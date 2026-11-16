import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
export * from './automation-config-types';
import {
  CANONICAL_AUTOMATIONS,
  AutomationTaskItem,
  AutomationGlobalConfig,
  AutomationConfigPatchInput,
  getDefaultAutomationConfig
} from './automation-config-types';

const FALLBACK_STATE_PATH = path.join(process.cwd(), '.antigravity', 'automation_config_state.json');

export function readLocalFallbackConfig(): AutomationGlobalConfig {
  try {
    if (fs.existsSync(FALLBACK_STATE_PATH)) {
      const raw = fs.readFileSync(FALLBACK_STATE_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultAutomationConfig(),
        ...parsed,
        tasks: {
          ...getDefaultAutomationConfig().tasks,
          ...(parsed.tasks || {})
        }
      };
    }
  } catch (err) {
    console.warn('[readLocalFallbackConfig] Error leyendo fallback, usando defaults:', err);
  }
  return getDefaultAutomationConfig();
}

export function writeLocalFallbackConfig(config: AutomationGlobalConfig): void {
  try {
    const dir = path.dirname(FALLBACK_STATE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_STATE_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (err) {
    console.warn('[writeLocalFallbackConfig] Error escribiendo fallback:', err);
  }
}

export async function getConsolidatedAutomationConfig(): Promise<{
  config: AutomationGlobalConfig;
  catalog: AutomationTaskItem[];
}> {
  const activeConfig = readLocalFallbackConfig();

  try {
    // Attempt to load from PostgreSQL via Prisma if connection is alive
    const records = await Promise.race([
      prisma.systemAutomationConfig.findMany(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 1500))
    ]);

    if (records && records.length > 0) {
      for (const rec of records) {
        if (rec.key === 'GLOBAL_SETTINGS') {
          activeConfig.masterHitlAutonomyLevel = rec.hitlAutonomyLevel;
          activeConfig.hotLeadThresholdEur = rec.hotLeadThresholdEur;
          activeConfig.notificationTarget = rec.notificationTarget;
          if (rec.parametersJson && typeof rec.parametersJson === 'object' && !Array.isArray(rec.parametersJson)) {
            const p = rec.parametersJson as Record<string, unknown>;
            if (typeof p.b2gEscalationThresholdEur === 'number') activeConfig.b2gEscalationThresholdEur = p.b2gEscalationThresholdEur;
            if (typeof p.logisticsKmPriceEur === 'number') activeConfig.logisticsKmPriceEur = p.logisticsKmPriceEur;
            if (typeof p.hotelPerDiemEur === 'number') activeConfig.hotelPerDiemEur = p.hotelPerDiemEur;
          }
        } else if (rec.key.startsWith('TASK_')) {
          const taskId = rec.key.replace('TASK_', '');
          activeConfig.tasks[taskId] = rec.enabled;
        }
      }
    }
  } catch {
    // Database unreachable or timed out; seamlessly fallback to local durable state
  }

  // Build catalog with live enabled state
  const catalog = CANONICAL_AUTOMATIONS.map(task => ({
    ...task,
    enabled: activeConfig.tasks[task.id] !== undefined ? activeConfig.tasks[task.id] : task.enabled
  }));

  return { config: activeConfig, catalog };
}

export async function patchConsolidatedAutomationConfig(
  input: AutomationConfigPatchInput
): Promise<{
  success: boolean;
  config: AutomationGlobalConfig;
  catalog: AutomationTaskItem[];
}> {
  const current = readLocalFallbackConfig();

  const updated: AutomationGlobalConfig = {
    masterHitlAutonomyLevel: input.masterHitlAutonomyLevel ?? current.masterHitlAutonomyLevel,
    hotLeadThresholdEur: input.hotLeadThresholdEur ?? current.hotLeadThresholdEur,
    notificationTarget: input.notificationTarget ?? current.notificationTarget,
    b2gEscalationThresholdEur: input.b2gEscalationThresholdEur ?? current.b2gEscalationThresholdEur,
    logisticsKmPriceEur: input.logisticsKmPriceEur ?? current.logisticsKmPriceEur,
    hotelPerDiemEur: input.hotelPerDiemEur ?? current.hotelPerDiemEur,
    tasks: {
      ...current.tasks,
      ...(input.tasks ?? {})
    },
    updatedAt: new Date().toISOString()
  };

  // 1. Always persist to durable local file storage
  writeLocalFallbackConfig(updated);

  // 2. Attempt to sync with PostgreSQL via Prisma
  try {
    const upsertPromise = async () => {
      await prisma.systemAutomationConfig.upsert({
        where: { key: 'GLOBAL_SETTINGS' },
        create: {
          key: 'GLOBAL_SETTINGS',
          department: 'GLOBAL',
          enabled: true,
          hitlAutonomyLevel: updated.masterHitlAutonomyLevel,
          hotLeadThresholdEur: updated.hotLeadThresholdEur,
          notificationTarget: updated.notificationTarget,
          parametersJson: {
            b2gEscalationThresholdEur: updated.b2gEscalationThresholdEur,
            logisticsKmPriceEur: updated.logisticsKmPriceEur,
            hotelPerDiemEur: updated.hotelPerDiemEur
          }
        },
        update: {
          hitlAutonomyLevel: updated.masterHitlAutonomyLevel,
          hotLeadThresholdEur: updated.hotLeadThresholdEur,
          notificationTarget: updated.notificationTarget,
          parametersJson: {
            b2gEscalationThresholdEur: updated.b2gEscalationThresholdEur,
            logisticsKmPriceEur: updated.logisticsKmPriceEur,
            hotelPerDiemEur: updated.hotelPerDiemEur
          }
        }
      });

      if (input.tasks) {
        for (const [taskId, isEnabled] of Object.entries(input.tasks)) {
          const item = CANONICAL_AUTOMATIONS.find(t => t.id === taskId);
          const dept = item ? item.department : 'UNKNOWN';
          await prisma.systemAutomationConfig.upsert({
            where: { key: `TASK_${taskId}` },
            create: {
              key: `TASK_${taskId}`,
              department: dept,
              enabled: isEnabled,
              hitlAutonomyLevel: updated.masterHitlAutonomyLevel,
              notificationTarget: updated.notificationTarget
            },
            update: {
              enabled: isEnabled,
              hitlAutonomyLevel: updated.masterHitlAutonomyLevel,
              notificationTarget: updated.notificationTarget
            }
          });
        }
      }
    };

    await Promise.race([
      upsertPromise(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 1500))
    ]);
  } catch {
    // Database unreachable; file fallback already safely persisted
  }

  const catalog = CANONICAL_AUTOMATIONS.map(task => ({
    ...task,
    enabled: updated.tasks[task.id] !== undefined ? updated.tasks[task.id] : task.enabled
  }));

  return { success: true, config: updated, catalog };
}

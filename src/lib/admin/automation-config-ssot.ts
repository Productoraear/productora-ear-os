import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export interface AutomationTaskItem {
  id: string;
  department: string;
  departmentName: string;
  name: string;
  description: string;
  enabled: boolean;
  hitlAutonomyLevel: number;
}

export interface AutomationGlobalConfig {
  masterHitlAutonomyLevel: number; // 5% Centinela ↔ 90% Piloto Automático
  hotLeadThresholdEur: number;      // e.g. 1500
  notificationTarget: string;       // e.g. "+34693693048"
  b2gEscalationThresholdEur: number; // e.g. 5000
  logisticsKmPriceEur: number;      // e.g. 0.50
  hotelPerDiemEur: number;          // e.g. 80
  tasks: Record<string, boolean>;   // taskId -> enabled
  updatedAt: string;
}

export const CANONICAL_AUTOMATIONS: AutomationTaskItem[] = [
  // DEP_01_LEGAL
  {
    id: 'LGL_01',
    department: 'DEP_01_LEGAL',
    departmentName: 'Dirección Jurídica, Fiscal & Compliance',
    name: 'Generador OTP de Contratos Bilaterales',
    description: 'Firma criptográfica bilateral y sellado de tiempo de contratos.',
    enabled: true,
    hitlAutonomyLevel: 5
  },
  {
    id: 'LGL_02',
    department: 'DEP_01_LEGAL',
    departmentName: 'Dirección Jurídica, Fiscal & Compliance',
    name: 'Auditor y Purga Soberana RGPD',
    description: 'Protocolo de derecho al olvido y anonimización según AI Act.',
    enabled: true,
    hitlAutonomyLevel: 25
  },
  {
    id: 'LGL_03',
    department: 'DEP_01_LEGAL',
    departmentName: 'Dirección Jurídica, Fiscal & Compliance',
    name: 'Compilador de Comunicaciones SGAE/AIE',
    description: 'Generación de hojas de liquidación y exención de repertorio propio.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'LGL_04',
    department: 'DEP_01_LEGAL',
    departmentName: 'Dirección Jurídica, Fiscal & Compliance',
    name: 'Pre-validador de RETA / Artistas y PRL',
    description: 'Verificación de alta laboral y certificados de prevención de riesgos.',
    enabled: true,
    hitlAutonomyLevel: 25
  },
  {
    id: 'LGL_05',
    department: 'DEP_01_LEGAL',
    departmentName: 'Dirección Jurídica, Fiscal & Compliance',
    name: 'Borradores Modelos AEAT 303 y 111',
    description: 'Cálculo automatizado de bases imponibles e IRPF trimestral.',
    enabled: true,
    hitlAutonomyLevel: 10
  },
  {
    id: 'LGL_06',
    department: 'DEP_01_LEGAL',
    departmentName: 'Dirección Jurídica, Fiscal & Compliance',
    name: 'Defensa Automatizada Chargebacks Stripe',
    description: 'Compilación de evidencia de firma OTP y fotos de actuación.',
    enabled: true,
    hitlAutonomyLevel: 25
  },

  // DEP_02_FINANCE
  {
    id: 'FIN_01',
    department: 'DEP_02_FINANCE',
    departmentName: 'Dirección Financiera, Tesorería & Splits',
    name: 'Conciliador de Splits 80/10/10 en Céntimos',
    description: 'Desglose exacto entre artista, EAR OS y proyecto social VIMUME.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'FIN_02',
    department: 'DEP_02_FINANCE',
    departmentName: 'Dirección Financiera, Tesorería & Splits',
    name: 'Cron Saga Liberador de Bloqueos 45 min',
    description: 'Liberación de fechas reservadas no formalizadas (anti-overbooking).',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'FIN_03',
    department: 'DEP_02_FINANCE',
    departmentName: 'Dirección Financiera, Tesorería & Splits',
    name: 'Recordatorio Inteligente 2º Pago (7 días)',
    description: 'Aviso automatizado vía WhatsApp del 50% restante antes del evento.',
    enabled: true,
    hitlAutonomyLevel: 80
  },
  {
    id: 'FIN_04',
    department: 'DEP_02_FINANCE',
    departmentName: 'Dirección Financiera, Tesorería & Splits',
    name: 'Previsor de Tesorería a 90 días',
    description: 'Proyección de flujo de caja para bodas y contratos B2G.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'FIN_05',
    department: 'DEP_02_FINANCE',
    departmentName: 'Dirección Financiera, Tesorería & Splits',
    name: 'Liquidación SEPA Instantánea 0% Fundadores',
    description: 'Dispersión bancaria inmediata para miembros del Founders Club.',
    enabled: true,
    hitlAutonomyLevel: 25
  },

  // DEP_03_B2G
  {
    id: 'B2G_01',
    department: 'DEP_03_B2G',
    departmentName: 'Dirección B2G, Contratación Pública & Ayuntamientos',
    name: 'Compilador de Pliegos Menores Art. 118 LCSP',
    description: 'Generación de memorias técnicas para contratos públicos <15.000 €.',
    enabled: true,
    hitlAutonomyLevel: 25
  },
  {
    id: 'B2G_02',
    department: 'DEP_03_B2G',
    departmentName: 'Dirección B2G, Contratación Pública & Ayuntamientos',
    name: 'FacturaE XML v3.2.2 con Códigos DIR3',
    description: 'Facturación electrónica homologada para administración pública.',
    enabled: true,
    hitlAutonomyLevel: 25
  },
  {
    id: 'B2G_03',
    department: 'DEP_03_B2G',
    departmentName: 'Dirección B2G, Contratación Pública & Ayuntamientos',
    name: 'Monitor de Licitaciones PLACSP',
    description: 'Escaneo y alerta de concursos de fiestas patronales y eventos.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'B2G_04',
    department: 'DEP_03_B2G',
    departmentName: 'Dirección B2G, Contratación Pública & Ayuntamientos',
    name: 'Verificador Certificados AEAT y Seg. Social',
    description: 'Monitoreo de vigencia de certificados positivos de deuda tributaria.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'B2G_05',
    department: 'DEP_03_B2G',
    departmentName: 'Dirección B2G, Contratación Pública & Ayuntamientos',
    name: 'Memorias Técnicas y Subvenciones VIMUME',
    description: 'Elaboración de justificaciones de impacto sociocultural.',
    enabled: true,
    hitlAutonomyLevel: 50
  },

  // DEP_04_MARKETING
  {
    id: 'MKT_01',
    department: 'DEP_04_MARKETING',
    departmentName: 'Dirección de Marketing, pSEO & Reputación',
    name: 'Rotador Dinámico sobre 29.165 URLs pSEO',
    description: 'Asignación equilibrada de proveedores en landings territoriales.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'MKT_02',
    department: 'DEP_04_MARKETING',
    departmentName: 'Dirección de Marketing, pSEO & Reputación',
    name: 'Sincronizador Reseñas & Schema.org',
    description: 'Estructuración de datos enriquecidos para Google Search Console.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'MKT_03',
    department: 'DEP_04_MARKETING',
    departmentName: 'Dirección de Marketing, pSEO & Reputación',
    name: 'Inyector de Enlaces Internos Geográficos',
    description: 'Malla de enlaces adyacentes provinciales para autoridad SEO.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'MKT_04',
    department: 'DEP_04_MARKETING',
    departmentName: 'Dirección de Marketing, pSEO & Reputación',
    name: 'Optimizador Metadatos OpenGraph',
    description: 'Generación reactiva de previews de alta conversión social.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'MKT_05',
    department: 'DEP_04_MARKETING',
    departmentName: 'Dirección de Marketing, pSEO & Reputación',
    name: 'Disparador Alertas Caída Orgánica (GSC)',
    description: 'Detección proactiva de pérdidas de visibilidad por municipio.',
    enabled: true,
    hitlAutonomyLevel: 90
  },

  // DEP_05_REVENUE
  {
    id: 'REV_01',
    department: 'DEP_05_REVENUE',
    departmentName: 'Dirección de Revenue, Ventas & Conversión',
    name: 'Traslado Soberano de Escaparate (1-Clic)',
    description: 'Absorción de datos desde Bodas.net y portales tradicionales.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'REV_02',
    department: 'DEP_05_REVENUE',
    departmentName: 'Dirección de Revenue, Ventas & Conversión',
    name: 'Generador Dossier Homologado A4 Print',
    description: 'Exportación limpia a PDF con ficha técnica, seguro y sello VIMUME.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'REV_03',
    department: 'DEP_05_REVENUE',
    departmentName: 'Dirección de Revenue, Ventas & Conversión',
    name: 'Simulador Menús Fincas Temporada 2026',
    description: 'Configurador dinámico de maridajes y presupuesto instantáneo.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'REV_04',
    department: 'DEP_05_REVENUE',
    departmentName: 'Dirección de Revenue, Ventas & Conversión',
    name: 'Descuentos Dinámicos por Huecos de Agenda',
    description: 'Yield management para optimizar fechas valle con precio cerrado.',
    enabled: true,
    hitlAutonomyLevel: 60
  },
  {
    id: 'REV_05',
    department: 'DEP_05_REVENUE',
    departmentName: 'Dirección de Revenue, Ventas & Conversión',
    name: 'Recuperación de Carritos y Cotizaciones',
    description: 'Re-engagement autónomo de parejas y organizadores indecisos.',
    enabled: true,
    hitlAutonomyLevel: 75
  },

  // DEP_06_OPERATIONS
  {
    id: 'OPS_01',
    department: 'DEP_06_OPERATIONS',
    departmentName: 'Dirección de Operaciones, Fleet OS & Acústica',
    name: 'Despachador Hojas de Ruta y Logística',
    description: 'Cálculo de 0,50 €/km extra (>100 km) y 80 € de dieta/hotel.',
    enabled: true,
    hitlAutonomyLevel: 80
  },
  {
    id: 'OPS_02',
    department: 'DEP_06_OPERATIONS',
    departmentName: 'Dirección de Operaciones, Fleet OS & Acústica',
    name: 'Certificador Acústico Ley 37/2003',
    description: 'Validación de niveles sonométricos (≤75 dB SPL / 12 W/pax).',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'OPS_03',
    department: 'DEP_06_OPERATIONS',
    departmentName: 'Dirección de Operaciones, Fleet OS & Acústica',
    name: 'Asignador Cuadrantes Técnicos y Backline',
    description: 'Cuadrícula logística de técnicos de sonido y rider de instrumentos.',
    enabled: true,
    hitlAutonomyLevel: 70
  },
  {
    id: 'OPS_04',
    department: 'DEP_06_OPERATIONS',
    departmentName: 'Dirección de Operaciones, Fleet OS & Acústica',
    name: 'Monitor Incidencias Técnicas en Directo',
    description: 'Canal de auxilio rápido ante fallos eléctricos o sonoros.',
    enabled: true,
    hitlAutonomyLevel: 10
  },
  {
    id: 'OPS_05',
    department: 'DEP_06_OPERATIONS',
    departmentName: 'Dirección de Operaciones, Fleet OS & Acústica',
    name: 'Gestor Devolución Fianzas Post-Evento',
    description: 'Cierre de depósito de garantía tras acta técnica conforme.',
    enabled: true,
    hitlAutonomyLevel: 25
  },

  // DEP_07_DEVSECOPS
  {
    id: 'SRE_01',
    department: 'DEP_07_DEVSECOPS',
    departmentName: 'Dirección de Tecnología, SRE & Autocura',
    name: 'Watchdog Autocura & Healthcheck /api/health',
    description: 'Inspección cada 5 min y recuperación proactiva de servicios caídos.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'SRE_02',
    department: 'DEP_07_DEVSECOPS',
    departmentName: 'Dirección de Tecnología, SRE & Autocura',
    name: 'Rotador Secretos & SSOT Hash Integrity',
    description: 'Vigilancia criptográfica de la Zona Cero SHA-256 cefa76c2...',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'SRE_03',
    department: 'DEP_07_DEVSECOPS',
    departmentName: 'Dirección de Tecnología, SRE & Autocura',
    name: 'Arnés 17 Compuertas en Pre-deploy',
    description: 'Ejecución determinista de auditorías de tipo, sintaxis y contratos.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'SRE_04',
    department: 'DEP_07_DEVSECOPS',
    departmentName: 'Dirección de Tecnología, SRE & Autocura',
    name: 'Centinela de Latencia y Core Web Vitals',
    description: 'Garantía de p95 < 120ms y renderizado OLED sin layout shifts.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'SRE_05',
    department: 'DEP_07_DEVSECOPS',
    departmentName: 'Dirección de Tecnología, SRE & Autocura',
    name: 'Backup Diario Cifrado y Verificación BD',
    description: 'Dump periódico de PostgreSQL con prueba de restauración no destructiva.',
    enabled: true,
    hitlAutonomyLevel: 90
  },

  // DEP_08_CONSULTING
  {
    id: 'CST_01',
    department: 'DEP_08_CONSULTING',
    departmentName: 'Dirección de Consultoría Estratégica & VIMUME',
    name: 'Informe Trimestral de Impacto Social',
    description: 'Generación de memorias de musicoterapia y terapias asistidas.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'CST_02',
    department: 'DEP_08_CONSULTING',
    departmentName: 'Dirección de Consultoría Estratégica & VIMUME',
    name: 'Calculadora SROI 4.85x y ODS (3, 8 y 11)',
    description: 'Medición de retorno social sobre inversión para convenios públicos.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'CST_03',
    department: 'DEP_08_CONSULTING',
    departmentName: 'Dirección de Consultoría Estratégica & VIMUME',
    name: 'Auditor de Accesibilidad WCAG 2.1 AAA',
    description: 'Verificación de contrastes, tipografía legible y Taste Engine OLED.',
    enabled: true,
    hitlAutonomyLevel: 90
  },
  {
    id: 'CST_04',
    department: 'DEP_08_CONSULTING',
    departmentName: 'Dirección de Consultoría Estratégica & VIMUME',
    name: 'Concierge IA & Triage con Escalado HITL',
    description: 'Atención 24/7 y transferencia inmediata al CEO ante leads calientes.',
    enabled: true,
    hitlAutonomyLevel: 85
  }
];

export const AutomationConfigPatchSchema = z.object({
  masterHitlAutonomyLevel: z.number().int().min(5).max(90).optional(),
  hotLeadThresholdEur: z.number().int().min(100).max(100000).optional(),
  notificationTarget: z.string().min(5).max(30).optional(),
  b2gEscalationThresholdEur: z.number().int().min(500).max(1000000).optional(),
  logisticsKmPriceEur: z.number().min(0.1).max(5.0).optional(),
  hotelPerDiemEur: z.number().min(30).max(500).optional(),
  tasks: z.record(z.string(), z.boolean()).optional()
});

export type AutomationConfigPatchInput = z.infer<typeof AutomationConfigPatchSchema>;

const FALLBACK_STATE_PATH = path.join(process.cwd(), '.antigravity', 'automation_config_state.json');

export function getDefaultAutomationConfig(): AutomationGlobalConfig {
  const tasksMap: Record<string, boolean> = {};
  for (const t of CANONICAL_AUTOMATIONS) {
    tasksMap[t.id] = t.enabled;
  }
  return {
    masterHitlAutonomyLevel: 85,
    hotLeadThresholdEur: 1500,
    notificationTarget: '+34693693048',
    b2gEscalationThresholdEur: 5000,
    logisticsKmPriceEur: 0.50,
    hotelPerDiemEur: 80,
    tasks: tasksMap,
    updatedAt: new Date().toISOString()
  };
}

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

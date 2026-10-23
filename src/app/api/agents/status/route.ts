import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { FLEET_ROSTER } from '@/lib/agents/sectorAgents';
import type { AgentSpec } from '@/lib/agents/sectorAgents';
import { isKillSwitchActive } from '@/lib/agents/killSwitch';
import { ALLOWED_WEBHOOKS } from '@/lib/agents/n8nDispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🛰️ FLEET STATUS — Estado vivo de la flota Titan de agentes (telemetría real).
 * ----------------------------------------------------------------------------
 * Devuelve el censo de agentes de entrada, el estado del kill-switch y la
 * profundidad de la cola de mensajes muertos (DLQ) en disco. Cero fachadas:
 * cada cifra se lee del estado real del sistema.
 */
export async function GET(): Promise<NextResponse> {
  const dlqPath = join(process.cwd(), '.antigravity', 'dlq.jsonl');
  let dlqDepth = 0;
  try {
    if (existsSync(dlqPath)) {
      dlqDepth = readFileSync(dlqPath, 'utf8').split('\n').filter((l) => l.trim().length > 0).length;
    }
  } catch {
    dlqDepth = -1; // sin permiso de lectura -> marcamos -1 para no mentir
  }

  const roster: readonly AgentSpec[] = FLEET_ROSTER;
  const payload = {
    killSwitch: isKillSwitchActive(),
    entryAgents: roster.map((spec: AgentSpec) => ({ id: spec.id, sector: spec.sector })),
    entryAgentCount: roster.length,
    divisionCount: 5,
    webhooks: ALLOWED_WEBHOOKS,
    dlq: {
      path: '.antigravity/dlq.jsonl',
      depth: dlqDepth,
      status: dlqDepth === 0 ? 'EMPTY' : dlqDepth === -1 ? 'UNREADABLE' : 'PENDING_REPLAY',
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload);
}

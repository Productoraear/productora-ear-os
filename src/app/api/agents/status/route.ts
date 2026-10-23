import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createOmegaFleet, OMEGA_FLEET_ROSTER, OMEGA_DIVISION_COUNT } from '@/lib/agents/omegaFleet';
import type { FleetSpec } from '@/lib/agents/omegaFleet';
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

  const roster: readonly FleetSpec[] = OMEGA_FLEET_ROSTER;
  const bus = createOmegaFleet();
  const registered = new Set(bus.registeredAgents());
  const orphans = roster.filter((spec: FleetSpec) => !registered.has(spec.id)).map((spec: FleetSpec) => spec.id);

  const byDivision = new Map<string, number>();
  for (const spec of roster) {
    byDivision.set(spec.division, (byDivision.get(spec.division) ?? 0) + 1);
  }
  const divisions = [...byDivision.entries()].map(([division, agentCount]) => ({ division, agentCount }));

  const payload = {
    killSwitch: isKillSwitchActive(),
    entryAgentCount: roster.length,
    divisionCount: OMEGA_DIVISION_COUNT,
    fleet: {
      totalAgents: roster.length,
      registeredHandlers: registered.size,
      orphanCount: orphans.length,
      orphans,
      divisionCount: OMEGA_DIVISION_COUNT,
      divisions,
    },
    entryAgents: roster.map((spec: FleetSpec) => ({ id: spec.id, division: spec.division, sector: spec.sector })),
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

import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { createEarBus, FLEET_ROSTER } from '@/lib/agents/sectorAgents';
import type { AgentSpec } from '@/lib/agents/sectorAgents';
import type { AgentId, AgentPayload, PayloadValue, TraceEntry } from '@/lib/agents/agentBus';
import { activateKillSwitch, isKillSwitchActive, releaseKillSwitch } from '@/lib/agents/killSwitch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ENTRY_AGENTS: readonly AgentId[] = FLEET_ROSTER.map((spec: AgentSpec): AgentId => spec.id);
const bus = createEarBus();

function authorized(req: Request): boolean {
  const expected: string | undefined = process.env.AGENT_ADMIN_TOKEN;
  if (!expected || expected.length < 16) return false; // falla cerrado si no hay token
  const given: string = req.headers.get('x-agent-token') ?? '';
  const a: Buffer = Buffer.from(given);
  const b: Buffer = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function cleanPayload(raw: unknown): AgentPayload {
  const out: Record<string, PayloadValue> = {};
  if (typeof raw !== 'object' || raw === null) return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>).slice(0, 20)) {
    if (typeof value === 'string') out[key.slice(0, 40)] = value.slice(0, 500);
    else if (typeof value === 'number' && Number.isFinite(value)) out[key.slice(0, 40)] = value;
    else if (typeof value === 'boolean') out[key.slice(0, 40)] = value;
  }
  return out;
}

export async function GET(req: Request): Promise<NextResponse> {
  if (!authorized(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  return NextResponse.json({ killSwitch: isKillSwitchActive(), entryAgents: ENTRY_AGENTS });
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (!authorized(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const body: unknown = await req.json();
    if (typeof body !== 'object' || body === null) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
    const { action, agent, intent, payload } = body as Record<string, unknown>;

    if (action === 'kill') {
      activateKillSwitch('Activado desde API admin');
      return NextResponse.json({ killSwitch: true });
    }
    if (action === 'release') {
      releaseKillSwitch();
      return NextResponse.json({ killSwitch: false });
    }

    if (typeof agent !== 'string' || !ENTRY_AGENTS.includes(agent as AgentId)) {
      return NextResponse.json({ error: 'Agente de entrada no permitido' }, { status: 400 });
    }
    const safeIntent: string = typeof intent === 'string' ? intent.slice(0, 64) : 'request';
    const trace: TraceEntry[] = await bus.send('omni-supervisor-daemon', agent as AgentId, safeIntent, cleanPayload(payload));
    return NextResponse.json({
      steps: trace.map((t: TraceEntry) => ({
        from: t.message.from,
        to: t.message.to,
        intent: t.message.intent,
        ok: t.reply?.ok ?? false,
        summary: t.reply?.summary ?? null,
        rejected: t.rejected ?? null,
        error: t.error ?? null,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Error interno del bus de agentes' }, { status: 500 });
  }
}

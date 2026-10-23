import { randomUUID } from 'node:crypto';
import { isKillSwitchActive } from './killSwitch';

/**
 * Flota completa de 32 Agentes Autónomos S-CLASS (Wave 31 — Titan Fleet).
 * Organizados en 4 Divisiones de Choque interconectadas por AgentBus.
 */
export type AgentId =
  // ── División 1 · Comercial, Voz & Cierre Cuántico (8) ──
  | 'voice-concierge'
  | 'lead-intake-dispatcher'
  | 'sales-closer'
  | 'logistics-pricer'
  | 'retention-reactivator'
  | 'finca-negotiator'
  | 'cross-sell-orchestrator'
  | 'vip-concierge-escalation'
  // ── División 2 · Técnica, Rider, Logística & Flota (8) ──
  | 'acoustic-rider-guard'
  | 'equipment-allocator'
  | 'convoy-telemetry-sentinel'
  | 'soundcheck-auditor'
  | 'procurement-inventory'
  | 'subcontract-dispatcher'
  | 'route-optimizer'
  | 'venue-profiler'
  // ── División 3 · Jurídica, B2G & Financiera (8) ──
  | 'smart-contract-engine'
  | 'b2g-tender-hunter'
  | 'b2g-pliego-compiler'
  | 'split-settlement-dispatcher'
  | 'modelo-182-tax-shield'
  | 'invoice-treasury-agent'
  | 'vendor-compliance-auditor'
  | 'dispute-escrow-arbitrator'
  // ── División 4 · VIMUME Clínica & Expansión B2B (8) ──
  | 'vimume-protocol-sentinel'
  | 'clinical-report-generator'
  | 'dental-clinic-coordinator'
  | 'veterinary-care-agent'
  | 'hospitality-table-agent'
  | 'real-estate-event-liaison'
  | 'corporate-experience-agent'
  | 'omni-supervisor-daemon'
  // ── División 5 · Sector Agents (Wave 30 — dispatch entry) ──
  | 'lead-intake'
  | 'acoustic-rider'
  | 'b2g-compliance'
  | 'vimume-impact'
  | 'escalation'
  | 'supervisor';

export type PayloadValue = string | number | boolean;
export type AgentPayload = Readonly<Record<string, PayloadValue>>;

export interface AgentMessage {
  readonly id: string;
  readonly traceId: string;
  readonly from: AgentId;
  readonly to: AgentId;
  readonly intent: string;
  readonly payload: AgentPayload;
  readonly depth: number;
  readonly createdAt: string;
}

export interface FollowUp {
  readonly to: AgentId;
  readonly intent: string;
  readonly payload: AgentPayload;
}

export interface AgentReply {
  readonly ok: boolean;
  readonly summary: string;
  readonly followUps?: readonly FollowUp[];
}

export type AgentHandler = (msg: AgentMessage) => Promise<AgentReply>;

export interface BusLimits {
  readonly maxDepth: number;
  readonly maxMessagesPerTrace: number;
  readonly maxMessagesPerMinute: number;
  readonly handlerTimeoutMs: number;
}

export const DEFAULT_LIMITS: BusLimits = {
  maxDepth: 4,
  maxMessagesPerTrace: 20,
  maxMessagesPerMinute: 30,
  handlerTimeoutMs: 30_000,
};

/** Intenciones que ningún agente puede pedir a otro (spec: sin push, sin secretos, sin Stripe directo). */
const FORBIDDEN_INTENTS: readonly string[] = [
  'git_push',
  'touch_secrets',
  'read_secrets',
  'stripe_operate',
  'stripe_refund',
  'edit_ssot_hash',
];

/** ZONA CERO: ningún mensaje puede apuntar a estos archivos. */
const ZONA_CERO: readonly string[] = [
  'ear-os-ssot.ts',
  'ssotintegrityguard.ts',
  'atomicdatelockengine.ts',
  'b2g-tender-engine.ts',
  'astra-conversation-engine.ts',
];

export type BusRejection =
  | 'KILL_SWITCH'
  | 'NO_HANDLER'
  | 'MAX_DEPTH'
  | 'TRACE_BUDGET'
  | 'RATE_LIMIT'
  | 'FORBIDDEN_INTENT'
  | 'ZONA_CERO'
  | 'SELF_LOOP';

export interface TraceEntry {
  readonly message: AgentMessage;
  readonly reply?: AgentReply;
  readonly rejected?: BusRejection;
  readonly error?: string;
}

function touchesZonaCero(payload: AgentPayload): boolean {
  return Object.values(payload).some((value: PayloadValue): boolean => {
    if (typeof value !== 'string') return false;
    const normalized: string = value.replace(/\\/g, '/').toLowerCase();
    return ZONA_CERO.some((protectedFile: string): boolean => normalized.endsWith(protectedFile));
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject): void => {
    const timer: NodeJS.Timeout = setTimeout((): void => reject(new Error('HANDLER_TIMEOUT')), ms);
    promise.then(
      (value: T): void => {
        clearTimeout(timer);
        resolve(value);
      },
      (err: unknown): void => {
        clearTimeout(timer);
        reject(err instanceof Error ? err : new Error(String(err)));
      },
    );
  });
}

export class AgentBus {
  private readonly handlers = new Map<AgentId, AgentHandler>();
  private readonly perTraceCount = new Map<string, number>();
  private readonly recentTimestamps: number[] = [];

  constructor(private readonly limits: BusLimits = DEFAULT_LIMITS) {}

  register(agent: AgentId, handler: AgentHandler): void {
    this.handlers.set(agent, handler);
  }

  /** Envía un mensaje y ejecuta en cascada las ayudas que cada agente solicite. */
  async send(
    from: AgentId,
    to: AgentId,
    intent: string,
    payload: AgentPayload,
    traceId: string = randomUUID(),
    depth = 0,
  ): Promise<TraceEntry[]> {
    const message: AgentMessage = {
      id: randomUUID(),
      traceId,
      from,
      to,
      intent: intent.slice(0, 64),
      payload,
      depth,
      createdAt: new Date().toISOString(),
    };

    const rejection: BusRejection | null = this.check(message);
    if (rejection) return [{ message, rejected: rejection }];

    const handler: AgentHandler | undefined = this.handlers.get(to);
    if (!handler) return [{ message, rejected: 'NO_HANDLER' }];

    this.perTraceCount.set(traceId, (this.perTraceCount.get(traceId) ?? 0) + 1);
    this.recentTimestamps.push(Date.now());

    const trace: TraceEntry[] = [];
    try {
      const reply: AgentReply = await withTimeout(handler(message), this.limits.handlerTimeoutMs);
      trace.push({ message, reply });
      for (const follow of reply.followUps ?? []) {
        const nested: TraceEntry[] = await this.send(to, follow.to, follow.intent, follow.payload, traceId, depth + 1);
        trace.push(...nested);
      }
    } catch (err: unknown) {
      trace.push({ message, error: err instanceof Error ? err.message : 'UNKNOWN_ERROR' });
    }
    return trace;
  }

  private check(message: AgentMessage): BusRejection | null {
    if (isKillSwitchActive()) return 'KILL_SWITCH';
    if (message.from === message.to) return 'SELF_LOOP';
    if (message.depth > this.limits.maxDepth) return 'MAX_DEPTH';
    if ((this.perTraceCount.get(message.traceId) ?? 0) >= this.limits.maxMessagesPerTrace) return 'TRACE_BUDGET';
    const cutoff: number = Date.now() - 60_000;
    while (this.recentTimestamps.length > 0 && this.recentTimestamps[0] < cutoff) this.recentTimestamps.shift();
    if (this.recentTimestamps.length >= this.limits.maxMessagesPerMinute) return 'RATE_LIMIT';
    if (FORBIDDEN_INTENTS.includes(message.intent)) return 'FORBIDDEN_INTENT';
    if (touchesZonaCero(message.payload)) return 'ZONA_CERO';
    return null;
  }
}

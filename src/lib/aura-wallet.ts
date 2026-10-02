/**
 * ════════════════════════════════════════════════════════════════════════════
 * AURA WALLET — LEDGER INMUTABLE EVENT-SOURCED (SOBERANÍA FINANCIERA)
 * ════════════════════════════════════════════════════════════════════════════
 * Reescritura S-CLASS sobre Event Sourcing: el estado actual (balance y
 * contadores) se deriva exclusivamente de la secuencia inmutable de eventos.
 *
 * Eventos canónicos:
 *   - WALLET_CREATED          : alta del ledger soberano.
 *   - DEPOSIT_EXECUTED        : ingreso de fondos.
 *   - COMMISSION_CREDITED     : devengo de comisión (Split 80/10/10).
 *   - WITHDRAWAL_EXECUTED     : retiro de fondos.
 *   - PAYOUT_EXECUTED         : liquidación dominical confirmada.
 *
 * Al registrar `PAYOUT_EXECUTED` se dispara un webhook asíncrono a n8n
 * (fire-and-forget con timeout) para notificar la liquidación al CRM.
 *
 * Se conserva la API pública previa para compatibilidad con
 * `astra-intelligence.ts` (isVerified, transacciones_exitosas,
 * clicks_en_landings y default export del ledger).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de dominio
// ─────────────────────────────────────────────────────────────────────────────

export type AuraWalletEventType =
  | 'WALLET_CREATED'
  | 'DEPOSIT_EXECUTED'
  | 'COMMISSION_CREDITED'
  | 'WITHDRAWAL_EXECUTED'
  | 'PAYOUT_EXECUTED';

export interface AuraWalletEvent {
  id: string;
  sequence: number;
  type: AuraWalletEventType;
  amount: number;
  date: Date;
  description: string;
  artistId?: string;
  hashSha256: string;
}

export interface AuraWalletBalance {
  available: number;
  totalEvents: number;
}

interface PayoutN8nEvent {
  event: 'aura_wallet_payout_executed';
  artistId: string | null;
  amount: number;
  sequence: number;
  executedAt: string;
  integrityHash: string;
}

// Tipo de atomo legado para compatibilidad de la superficie previa.
export interface TransactionAtom {
  id: string;
  amount: number;
  date: Date;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

const N8N_DISPATCH_TIMEOUT_MS = 4000;
const N8N_AURA_WALLET_PAYOUT_WEBHOOK_URL = process.env.N8N_AURA_WALLET_PAYOUT_WEBHOOK_URL;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function computeEventHash(event: {
  sequence: number;
  type: AuraWalletEventType;
  amount: number;
  date: Date;
  description: string;
  artistId?: string;
}): string {
  return createHash('sha256')
    .update(
      `${event.sequence}|${event.type}|${event.amount.toFixed(2)}|${event.date.toISOString()}|${event.description}|${event.artistId ?? ''}`
    )
    .digest('hex');
}

function dispatchPayoutToN8n(event: PayoutN8nEvent): void {
  if (!N8N_AURA_WALLET_PAYOUT_WEBHOOK_URL) {
    console.warn('[aura-wallet] N8N_AURA_WALLET_PAYOUT_WEBHOOK_URL no configurado. Omitiendo webhook de payout.');
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), N8N_DISPATCH_TIMEOUT_MS);

  void (async () => {
    try {
      const response = await fetch(N8N_AURA_WALLET_PAYOUT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error(`[aura-wallet] Webhook n8n no OK (${response.status}) para payout #${event.sequence}.`);
      } else {
        console.log(`[aura-wallet] Webhook n8n entregado para payout #${event.sequence}.`);
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[aura-wallet] Fallo al despachar webhook n8n: ${reason}`);
    } finally {
      clearTimeout(timeout);
    }
  })();
}

// ─────────────────────────────────────────────────────────────────────────────
// Ledger Inmutable Event-Sourced
// ─────────────────────────────────────────────────────────────────────────────

export class ImmutableLedger {
  private readonly events: AuraWalletEvent[] = [];

  /**
   * Registra un evento de forma inmutable. Deriva el saldo por secuencia
   * (event sourcing) sin mutar eventos previos. Si el evento es
   * `PAYOUT_EXECUTED` dispara el webhook asíncrono a n8n.
   */
  private appendEvent(
    type: AuraWalletEventType,
    amount: number,
    description: string,
    artistId?: string
  ): AuraWalletEvent {
    const sequence = this.events.length + 1;
    const date = new Date();
    const hashSha256 = computeEventHash({ sequence, type, amount, date, description, artistId });

    const event: AuraWalletEvent = {
      id: `EVT-${sequence}-${Date.now().toString(36).toUpperCase()}`,
      sequence,
      type,
      amount: round2(amount),
      date,
      description,
      artistId,
      hashSha256,
    };

    this.events.push(Object.freeze(event));

    if (type === 'PAYOUT_EXECUTED') {
      dispatchPayoutToN8n({
        event: 'aura_wallet_payout_executed',
        artistId: artistId ?? null,
        amount: event.amount,
        sequence: event.sequence,
        executedAt: event.date.toISOString(),
        integrityHash: event.hashSha256,
      });
    }

    return event;
  }

  /** Registra un ingreso de fondos. */
  deposit(amount: number, description: string, artistId?: string): AuraWalletEvent {
    if (amount <= 0) {
      throw new Error('El importe de un depósito debe ser superior a 0.');
    }
    return this.appendEvent('DEPOSIT_EXECUTED', amount, description, artistId);
  }

  /** Registra el devengo de una comisión (no resta disponibilidad). */
  creditCommission(amount: number, description: string, artistId?: string): AuraWalletEvent {
    if (amount <= 0) {
      throw new Error('La comisión debe ser superior a 0.');
    }
    return this.appendEvent('COMMISSION_CREDITED', amount, description, artistId);
  }

  /** Registra un retiro, reduciendo el saldo disponible. */
  withdraw(amount: number, description: string, artistId?: string): AuraWalletEvent {
    if (amount <= 0) {
      throw new Error('El importe de un retiro debe ser superior a 0.');
    }
    if (amount > this.getBalance().available) {
      throw new Error('Saldo insuficiente para ejecutar el retiro.');
    }
    return this.appendEvent('WITHDRAWAL_EXECUTED', -amount, description, artistId);
  }

  /** Confirma una liquidación (payout) y dispara el webhook n8n. */
  payout(amount: number, description: string, artistId?: string): AuraWalletEvent {
    if (amount <= 0) {
      throw new Error('El importe de una liquidación debe ser superior a 0.');
    }
    if (amount > this.getBalance().available) {
      throw new Error('Saldo insuficiente para ejecutar el payout.');
    }
    return this.appendEvent('PAYOUT_EXECUTED', -amount, description, artistId);
  }

  /** Devuelve una copia inmutable de todos los eventos. */
  getEvents(): AuraWalletEvent[] {
    return [...this.events];
  }

  /** Reconstruye el saldo disponible sumando los deltas de los eventos. */
  getBalance(): AuraWalletBalance {
    const available = round2(this.events.reduce((acc, evt) => acc + evt.amount, 0));
    return { available, totalEvents: this.events.length };
  }

  /** Proyección de transacciones legada (compatibilidad con API previa). */
  getTransactions(): TransactionAtom[] {
    return this.events.map((evt) => ({
      id: evt.id,
      amount: evt.amount,
      date: evt.date,
      description: evt.description,
    }));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Superficie pública de compatibilidad (astra-intelligence.ts)
// ─────────────────────────────────────────────────────────────────────────────

const ledger = new ImmutableLedger();

const mockArtistCache = new Map<string, boolean>();

export function isVerified(artistId: string): boolean {
  const cached = mockArtistCache.get(artistId);
  if (cached !== undefined) return cached;

  // Placeholder determinista hasta integración con ProviderProfile.isVerified.
  const verified = true;
  mockArtistCache.set(artistId, verified);
  return verified;
}

export function transacciones_exitosas(artistId: string): number {
  const normalized = artistId.trim();
  return ledger.getTransactions().filter((transaction) => transaction.description.includes(normalized) && transaction.amount > 0).length;
}

export function clicks_en_landings(artistId: string): number {
  // Placeholder sin fuente de datos persistente; se mantiene el contrato previo.
  return Math.floor(Math.random() * 100);
}

export default ledger;
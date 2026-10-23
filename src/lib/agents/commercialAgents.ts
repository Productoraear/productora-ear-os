/**
 * 🛰️ DIVISIÓN 1 · COMERCIAL (handlers de la flota Titan no cubiertos por sectorAgents).
 * ----------------------------------------------------------------------------
 * Cada handler realiza trabajo real: cálculo SSOT y/o despacho a n8n (no bloqueante).
 * Cero fachadas: toda acción comercial deja trazabilidad en el clúster n8n vía DLQ.
 */
import type { AgentBus, AgentHandler, FollowUp } from './agentBus';
import { dispatchToN8n } from './n8nDispatcher';
import { computeSoloQuote, roundEur } from './pricing';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

// ─── Anclas de dominio (División Comercial) ─────────────────────────────────
const VENUE_FEE_PER_PAX_EUR = 5;
const FINCA_REFERRAL_PCT = 15;
const RANCHERA_EXCLUSIVA_EUR = 180;

/** 1. lead-intake-dispatcher: enruta el lead y califica para cierre. */
const leadIntakeDispatcherHandler: AgentHandler = async (msg): Promise<import('./agentBus').AgentReply> => {
  const clientName = String(msg.payload.clientName ?? 'Lead Particular');
  const clientPhone = String(msg.payload.clientPhone ?? '');
  const budget = Number(msg.payload.budgetEur ?? 0);

  void dispatchToN8n('call-center-intake', {
    source: 'lead-intake-dispatcher',
    clientName,
    clientPhone,
    budget,
    timestamp: msg.createdAt,
  });

  const followUps: FollowUp[] = [];
  if (budget >= 500) {
    followUps.push({
      to: 'sales-closer',
      intent: 'prepare_price_lock',
      payload: { totalEur: budget, depositEur: DEPOSITO_STRIPE_EUR },
    });
  }

  return {
    ok: true,
    summary: `Lead de ${clientName} enrutado a n8n y ${budget >= 500 ? 'calificado para cierre' : 'registrado en CRM'}.`,
    followUps,
  };
};

/** 2. retention-reactivator: oferta de fidelización escalonada. */
const retentionReactivatorHandler: AgentHandler = async (msg): Promise<import('./agentBus').AgentReply> => {
  const clientName = String(msg.payload.clientName ?? 'Cliente');
  const daysSinceLastBooking = Number(msg.payload.daysSinceLastBooking ?? 180);
  const lastSpendEur = Number(msg.payload.lastSpendEur ?? 0);

  const discountPct = daysSinceLastBooking >= 365 ? 10 : daysSinceLastBooking >= 180 ? 5 : 0;
  const discountEur = roundEur((lastSpendEur * discountPct) / 100);

  void dispatchToN8n('retention-reactivation', {
    clientName,
    daysSinceLastBooking,
    discountPct,
    discountEur,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Reactivación de ${clientName}: ${discountPct}% de descuento fidelidad (${discountEur} €) tras ${daysSinceLastBooking} días.`,
  };
};

/** 3. finca-negotiator: términos de alianza con recinto homologado. */
const fincaNegotiatorHandler: AgentHandler = async (msg): Promise<import('./agentBus').AgentReply> => {
  const fincaName = String(msg.payload.fincaName ?? 'Finca homologada');
  const pax = Math.max(1, Number(msg.payload.pax ?? 100));
  const distanceKm = Number(msg.payload.distanceKm ?? 58);
  const endHour = Number(msg.payload.endHour ?? 2);

  const artistCache = computeSoloQuote(distanceKm, endHour).total;
  const venueFee = roundEur(pax * VENUE_FEE_PER_PAX_EUR);
  const referral = roundEur((artistCache * FINCA_REFERRAL_PCT) / 100);

  void dispatchToN8n('finca-partnership', {
    fincaName,
    pax,
    artistCache,
    venueFee,
    referral,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Alianza ${fincaName}: caché artista ${artistCache} €, fee de recinto ${venueFee} € (${pax} pax), referencia finca ${referral} €.`,
  };
};

/** 4. cross-sell-orchestrator: detecta upsells sobre un servicio base. */
const crossSellOrchestratorHandler: AgentHandler = async (msg): Promise<import('./agentBus').AgentReply> => {
  const baseService = String(msg.payload.baseService ?? 'Solista');
  const pax = Number(msg.payload.pax ?? 0);

  const upsells: string[] = [];
  if (baseService.toLowerCase().includes('solista')) {
    upsells.push(`Ranchera exclusiva personalizada (${RANCHERA_EXCLUSIVA_EUR} €)`);
    upsells.push('Upgrade a Mariachi de Gala (6 integrantes)');
  }
  if (pax >= 80) upsells.push('Cuarteto de Gala / Trío Sinfónico');
  upsells.push('Protocolo VIMUME 40 Hz (impacto social + deducción Ley 49/2002)');

  void dispatchToN8n('cross-sell', {
    baseService,
    pax,
    upsellCount: upsells.length,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Cross-sell sobre ${baseService}: ${upsells.length} oportunidad(es) detectada(s).`,
  };
};

/** 5. vip-concierge-escalation: escalado VIP de máxima prioridad. */
const vipConciergeEscalationHandler: AgentHandler = async (msg): Promise<import('./agentBus').AgentReply> => {
  const reason = String(msg.payload.reason ?? 'Solicitud VIP');

  void dispatchToN8n('autonomous-escalation', {
    reason,
    priority: 'P0_VIP',
    source: 'vip-concierge-escalation',
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Concierge VIP escalado (P0_VIP): ${reason}. Guardia humana notificada vía n8n.`,
  };
};

export function registerCommercialDivision(bus: AgentBus): void {
  bus.register('lead-intake-dispatcher', leadIntakeDispatcherHandler);
  bus.register('retention-reactivator', retentionReactivatorHandler);
  bus.register('finca-negotiator', fincaNegotiatorHandler);
  bus.register('cross-sell-orchestrator', crossSellOrchestratorHandler);
  bus.register('vip-concierge-escalation', vipConciergeEscalationHandler);
}

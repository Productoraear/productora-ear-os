import { AgentBus } from './agentBus';
import type { AgentHandler, AgentMessage, AgentReply, FollowUp } from './agentBus';
import {
  computeSoloQuote,
  computeSplit,
  checkB2gCeiling,
  computeRider,
  isAcousticContext,
  roundEur,
} from './pricing';
import type { AcousticContext } from './pricing';
import { dispatchToN8n } from './n8nDispatcher';
import type { N8nBody } from './n8nDispatcher';

/**
 * 🛰️ SECTOR AGENTS FACTORY (S-Class Collaboration Engine)
 * ========================================================
 * Implementa y orquesta los agentes que colaboran en EAR OS:
 * 1. voice-concierge: Atención vocal y triaje de consultas entrantes.
 * 2. lead-intake: Ingesta, saneamiento y sincronización con n8n/CRM.
 * 3. logistics-pricer: Cálculo SSOT de tarifas, kilometraje y hotel.
 * 4. b2g-compliance: Auditoría de contratos menores (Art. 118 LCSP < 14.250 €).
 * 5. acoustic-rider: Presión sonora dBA y potencia según Ley 37/2003.
 * 6. vimume-impact: Estimación clínica y deducción fiscal Ley 49/2002.
 * 7. sales-closer: Cierre de reservas con depósito Stripe 100 €.
 * 8. escalation: Despacho a guardia humana ante incidencias complejas.
 * 9. supervisor: Orquestador que supervisa y encadena el flujo.
 */

// ─── 1. VOICE CONCIERGE ───────────────────────────────────────────────────────
const voiceConciergeHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const query = String(msg.payload.query ?? msg.payload.mensaje ?? '');
  const pax = Number(msg.payload.pax ?? 0);
  const distanceKm = Number(msg.payload.distanceKm ?? msg.payload.km ?? 0);
  const followUps: FollowUp[] = [];

  // Si hay datos de contacto, deriva a lead-intake
  if (msg.payload.clientPhone || msg.payload.telefono) {
    followUps.push({
      to: 'lead-intake',
      intent: 'register_lead',
      payload: msg.payload,
    });
  }

  // Si consulta precio o distancia, deriva a pricing
  if (distanceKm > 0 || query.toLowerCase().includes('precio') || query.toLowerCase().includes('presupuesto')) {
    followUps.push({
      to: 'logistics-pricer',
      intent: 'quote_solo',
      payload: { distanceKm, endHour: Number(msg.payload.endHour ?? 2) },
    });
  }

  // Si menciona aforo o espacio, calcula rider acústico
  if (pax > 0) {
    followUps.push({
      to: 'acoustic-rider',
      intent: 'calc_rider',
      payload: { context: String(msg.payload.context ?? 'solista'), pax },
    });
  }

  return {
    ok: true,
    summary: `Consulta atendida por Voice Concierge. Intenciones identificadas: ${followUps.length}.`,
    followUps,
  };
};

// ─── 2. LEAD INTAKE ───────────────────────────────────────────────────────────
const leadIntakeHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const clientName = String(msg.payload.clientName ?? msg.payload.nombre ?? 'Cliente Particular');
  const clientPhone = String(msg.payload.clientPhone ?? msg.payload.telefono ?? '');
  const eventDate = String(msg.payload.eventDate ?? msg.payload.fecha ?? '');

  const n8nPayload: N8nBody = {
    source: 'agent-lead-intake',
    clientName,
    clientPhone,
    eventDate,
    timestamp: msg.createdAt,
  };

  void dispatchToN8n('call-center-intake', n8nPayload);

  return {
    ok: true,
    summary: `Lead de ${clientName} registrado y despachado al clúster n8n.`,
  };
};

// ─── 3. LOGISTICS PRICER ──────────────────────────────────────────────────────
const logisticsPricerHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const km = Number(msg.payload.distanceKm ?? 0);
  const endHour = Number(msg.payload.endHour ?? 2);
  const quote = computeSoloQuote(km, endHour);
  const split = computeSplit(quote.total);

  const followUps: FollowUp[] = [];
  if (quote.total >= 500) {
    followUps.push({
      to: 'sales-closer',
      intent: 'prepare_price_lock',
      payload: { totalEur: quote.total, depositEur: quote.deposito },
    });
  }

  return {
    ok: true,
    summary: `Tarifa Solista calculada: ${quote.total} € (Base: ${quote.base} €, Km: ${quote.logistica} €, Hotel: ${quote.hotel} €). Split: ${split.artista} € Artista / ${split.earOs} € EAR OS / ${split.vimume} € VIMUME.`,
    followUps,
  };
};

// ─── 4. B2G COMPLIANCE ────────────────────────────────────────────────────────
const b2gComplianceHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const amountEur = Number(msg.payload.amountEur ?? msg.payload.totalEur ?? 0);
  const verdict = checkB2gCeiling(amountEur);

  return {
    ok: verdict.allowed,
    summary: verdict.allowed
      ? `Conforme con Art. 118 LCSP. Margen preventivo restante: ${verdict.margin} € (Techo: ${verdict.ceiling} €).`
      : `EXCEDE LÍMITE CONTRATO MENOR B2G (${amountEur} € > ${verdict.ceiling} €). Requiere licitación abierta.`,
  };
};

// ─── 5. ACOUSTIC RIDER ────────────────────────────────────────────────────────
const acousticRiderHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const rawContext = String(msg.payload.context ?? 'solista');
  const context: AcousticContext = isAcousticContext(rawContext) ? rawContext : 'solista';
  const pax = Math.max(1, Number(msg.payload.pax ?? 50));
  const rider = computeRider(context, pax);

  return {
    ok: true,
    summary: `Rider acústico (${rider.context}): ${rider.minDba}-${rider.maxDba} dBA, Potencia: ${rider.watts} W (12 W/pax). Salud pública: < ${rider.healthLimitDb} dB SPL.`,
  };
};

// ─── 6. VIMUME IMPACT ─────────────────────────────────────────────────────────
const vimumeImpactHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const sessions = Math.max(1, Number(msg.payload.sessions ?? 1));
  const estimatedDeduction = roundEur(sessions * 120 * 0.80);

  return {
    ok: true,
    summary: `VIMUME Impacto Sanitario: ${sessions} sesiones estimadas (Protocolo 40 Hz Gamma). Deducción fiscal estimada Ley 49/2002: ${estimatedDeduction} € (80% IRPF).`,
  };
};

// ─── 7. SALES CLOSER ──────────────────────────────────────────────────────────
const salesCloserHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const totalEur = Number(msg.payload.totalEur ?? 350);
  const depositEur = Number(msg.payload.depositEur ?? 100);

  return {
    ok: true,
    summary: `Propuesta de cierre lista: Total ${totalEur} € con Depósito Price-Lock Stripe de ${depositEur} € (100% deducible).`,
  };
};

// ─── 8. ESCALATION ────────────────────────────────────────────────────────────
const escalationHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const reason = String(msg.payload.reason ?? 'Escalada técnica de agente');
  void dispatchToN8n('autonomous-escalation', {
    reason,
    source: msg.from,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Incidencia escalada a guardia humana vía n8n autonomous-escalation: ${reason}.`,
  };
};

// ─── 9. SUPERVISOR ────────────────────────────────────────────────────────────
const supervisorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  return {
    ok: true,
    summary: `Supervisor activo. Mensaje recibido de ${msg.from} con intención ${msg.intent}.`,
  };
};

// ─── FACTORY ──────────────────────────────────────────────────────────────────
export function createEarBus(): AgentBus {
  const bus = new AgentBus();
  bus.register('voice-concierge', voiceConciergeHandler);
  bus.register('lead-intake', leadIntakeHandler);
  bus.register('logistics-pricer', logisticsPricerHandler);
  bus.register('b2g-compliance', b2gComplianceHandler);
  bus.register('acoustic-rider', acousticRiderHandler);
  bus.register('vimume-impact', vimumeImpactHandler);
  bus.register('sales-closer', salesCloserHandler);
  bus.register('escalation', escalationHandler);
  bus.register('supervisor', supervisorHandler);
  return bus;
}

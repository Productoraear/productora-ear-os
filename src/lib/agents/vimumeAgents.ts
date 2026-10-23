/**
 * 🛰️ DIVISIÓN 4 · VIMUME CLÍNICA & EXPANSIÓN B2B.
 * ----------------------------------------------------------------------------
 * Handlers de impacto sanitario (Protocolo 40 Hz Gamma) y de expansión B2B
 * (dental, veterinaria, hospitality, inmobiliario y corporativo). Cada uno
 * despacha su evento a n8n con trazabilidad real.
 */
import type { AgentBus, AgentHandler, AgentMessage, AgentReply, FollowUp } from './agentBus';
import { dispatchToN8n } from './n8nDispatcher';
import { computeRider, roundEur } from './pricing';
import { LIMITE_SPL_DB } from '@/lib/constants/ear-os-ssot';

// ─── Anclas de dominio (División VIMUME) ────────────────────────────────────
const VIMUME_SESSION_COST_EUR = 120;
const DEDUCCION_IRPF_PCT = 80;
const SROI_X = 4.85;
const REDUCCION_PSICOFARMACOS_PCT = 74;
const REDUCCION_AGITACION_PCT = 38.2;

/** 1. vimume-protocol-sentinel: vigila el protocolo 40 Hz y el límite clínico. */
const vimumeProtocolSentinelHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const sessions = Math.max(1, Number(msg.payload.sessions ?? 1));
  const db = Number(msg.payload.db ?? 70);
  const compliant = db < LIMITE_SPL_DB;
  const hz = 40;

  void dispatchToN8n('vimume-clinical-report', { sessions, db, hz, compliant, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Protocolo VIMUME ${hz} Hz: ${db} dB ${compliant ? 'dentro del límite clínico' : 'EXCEDE el límite'} (< ${LIMITE_SPL_DB} dB) para ${sessions} sesión(es).`,
  };
};

/** 2. clinical-report-generator: reporte clínico con SROI y deducción fiscal. */
const clinicalReportGeneratorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const sessions = Math.max(1, Number(msg.payload.sessions ?? 1));
  const deduction = roundEur((sessions * VIMUME_SESSION_COST_EUR * DEDUCCION_IRPF_PCT) / 100);

  void dispatchToN8n('vimume-clinical-report', {
    sessions,
    sroi: SROI_X,
    reductionPsicofarmacosPct: REDUCCION_PSICOFARMACOS_PCT,
    reductionAgitacionPct: REDUCCION_AGITACION_PCT,
    deduction,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Reporte clínico VIMUME: ${sessions} sesiones · SROI ${SROI_X}x · desescalada psicofármacos ${REDUCCION_PSICOFARMACOS_PCT}% · agitación ${REDUCCION_AGITACION_PCT}% · deducción estimada ${deduction} €.`,
  };
};

/** 3. dental-clinic-coordinator: coordinación con clínicas dentales. */
const dentalClinicCoordinatorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const clinicName = String(msg.payload.clinicName ?? 'Clínica dental');
  const sessions = Math.max(1, Number(msg.payload.sessions ?? 1));

  void dispatchToN8n('dental-clinic', { clinicName, sessions, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Coordinación con ${clinicName}: ${sessions} sesión(es) de neuro-musicoterapia 40 Hz agendadas.`,
  };
};

/** 4. veterinary-care-agent: protocolo calmante veterinario. */
const veterinaryCareAgentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const clinicName = String(msg.payload.clinicName ?? 'Clínica veterinaria');
  const sessions = Math.max(1, Number(msg.payload.sessions ?? 1));

  void dispatchToN8n('veterinary-care', { clinicName, sessions, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Protocolo veterinario calmante (40 Hz) coordinado con ${clinicName}: ${sessions} sesión(es).`,
  };
};

/** 5. hospitality-table-agent: servicio hospitality de gala con ambientación. */
const hospitalityTableAgentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const venue = String(msg.payload.venue ?? 'Hotel');
  const tables = Math.max(1, Number(msg.payload.tables ?? 1));

  void dispatchToN8n('hospitality-table', { venue, tables, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Servicio hospitality en ${venue}: ${tables} mesa(s) de gala con ambientación acústica.`,
  };
};

/** 6. real-estate-event-liaison: liaison inmobiliario con show premium. */
const realEstateEventLiaisonHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const property = String(msg.payload.property ?? 'Promoción inmobiliaria');
  const eventType = String(msg.payload.eventType ?? 'Open House');

  void dispatchToN8n('real-estate-event', { property, eventType, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Liaison inmobiliario: ${eventType} en ${property} con show premium y protocolo acústico.`,
  };
};

/** 7. corporate-experience-agent: experiencia corporativa con rider acústico. */
const corporateExperienceAgentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const company = String(msg.payload.company ?? 'Empresa');
  const pax = Math.max(1, Number(msg.payload.pax ?? 50));
  const rider = computeRider('solista', pax);

  void dispatchToN8n('corporate-experience', {
    company,
    pax,
    minDba: rider.minDba,
    maxDba: rider.maxDba,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Experiencia corporativa para ${company}: ${pax} pax · rider ${rider.minDba}-${rider.maxDba} dBA.`,
  };
};

/** 8. omni-supervisor-daemon: enrutador central de intenciones entre divisiones. */
const omniSupervisorDaemonHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const intent = msg.intent.toLowerCase();
  const followUps: FollowUp[] = [];

  if (/carrera|artista|release|tour|royalt|sync|brand|management/.test(intent)) {
    followUps.push({ to: 'artist-career-manager', intent: 'manage_career', payload: msg.payload });
  }
  if (/b2g|licitac|pliego|contrato menor/.test(intent)) {
    followUps.push({ to: 'b2g-compliance', intent: 'audit_b2g', payload: msg.payload });
  }
  if (/rider|acustic|sonido|db|decibel/.test(intent)) {
    followUps.push({ to: 'acoustic-rider', intent: 'calc_rider', payload: msg.payload });
  }
  if (/vimume|clinica|mayor|senior|residencia/.test(intent)) {
    followUps.push({ to: 'vimume-impact', intent: 'estimate_sessions', payload: msg.payload });
  }

  return {
    ok: true,
    summary: `Omni-Supervisor: intención '${intent}' enrutada a ${followUps.length} departamento(s).`,
    followUps,
  };
};

export function registerVimumeDivision(bus: AgentBus): void {
  bus.register('vimume-protocol-sentinel', vimumeProtocolSentinelHandler);
  bus.register('clinical-report-generator', clinicalReportGeneratorHandler);
  bus.register('dental-clinic-coordinator', dentalClinicCoordinatorHandler);
  bus.register('veterinary-care-agent', veterinaryCareAgentHandler);
  bus.register('hospitality-table-agent', hospitalityTableAgentHandler);
  bus.register('real-estate-event-liaison', realEstateEventLiaisonHandler);
  bus.register('corporate-experience-agent', corporateExperienceAgentHandler);
  bus.register('omni-supervisor-daemon', omniSupervisorDaemonHandler);
}

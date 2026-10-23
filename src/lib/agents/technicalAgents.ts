/**
 * 🛰️ DIVISIÓN 2 · TÉCNICA (Rider, Flota, Sonido & Recintos).
 * ----------------------------------------------------------------------------
 * Handlers de cálculo SSOT y telemetría de operaciones técnicas. Cada uno
 * produce un veredicto real y despacha su evento a n8n (no bloqueante).
 */
import type { AgentBus, AgentHandler, AgentMessage, AgentReply } from './agentBus';
import { dispatchToN8n } from './n8nDispatcher';
import { computeRider, isAcousticContext, computeSoloQuote, roundEur } from './pricing';
import type { AcousticContext } from './pricing';
import { WATTS_PER_PAX, LIMITE_SPL_DB } from '@/lib/constants/ear-os-ssot';

// ─── Anclas de dominio (División Técnica) ───────────────────────────────────
const SOUNDCHECK_MINUTES_BY_CONTEXT: Readonly<Record<AcousticContext, number>> = {
  festejo: 120,
  boda_exterior: 90,
  boda_interior: 75,
  solista: 60,
  vimume_senior: 45,
};
const TECHNICIAN_PER_PAX_THRESHOLD = 200;
const FUEL_EUR_PER_KM = 0.35;

function readContext(msg: AgentMessage): AcousticContext {
  const raw = String(msg.payload.context ?? 'solista');
  return isAcousticContext(raw) ? raw : 'solista';
}

/** 1. acoustic-rider-guard: valida cumplimiento acústico Ley 37/2003. */
const acousticRiderGuardHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const context = readContext(msg);
  const pax = Math.max(1, Number(msg.payload.pax ?? 50));
  const rider = computeRider(context, pax);
  const requiresLimiter = rider.maxDba > LIMITE_SPL_DB;

  void dispatchToN8n('acoustic-rider-audit', {
    context,
    pax,
    minDba: rider.minDba,
    maxDba: rider.maxDba,
    watts: rider.watts,
    requiresLimiter,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Rider auditado (${rider.context}): ${rider.minDba}-${rider.maxDba} dBA · ${rider.watts} W · ${
      requiresLimiter ? 'requiere limitador telemático homologado' : 'dentro del límite de salud pública'
    } (< ${rider.healthLimitDb} dB SPL).`,
  };
};

/** 2. equipment-allocator: asigna tier de sonido según potencia. */
const equipmentAllocatorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const pax = Math.max(1, Number(msg.payload.pax ?? 50));
  const watts = pax * WATTS_PER_PAX;
  const tier = watts <= 600 ? 'Compact (Bose F1)' : watts <= 2400 ? 'Line Array L1/L2' : 'Line Array + Subwoofers (CETAC 32A)';

  void dispatchToN8n('equipment-allocation', { pax, watts, tier, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Equipamiento asignado: ${watts} W (${pax} pax) → ${tier}.`,
  };
};

/** 3. convoy-telemetry-sentinel: telemetría de desplazamiento del convoy. */
const convoyTelemetrySentinelHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const km = Math.max(0, Number(msg.payload.distanceKm ?? 0));
  const fuelCost = roundEur(km * FUEL_EUR_PER_KM);
  const etaMinutes = Math.round((km / 80) * 60 + 30);

  void dispatchToN8n('convoy-telemetry', { km, fuelCost, etaMinutes, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Telemetría de convoy: ${km} km · combustible ${fuelCost} € · ETA ${etaMinutes} min.`,
  };
};

/** 4. soundcheck-auditor: planifica prueba de sonido según contexto. */
const soundcheckAuditorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const context = readContext(msg);
  const minutes = SOUNDCHECK_MINUTES_BY_CONTEXT[context];

  void dispatchToN8n('soundcheck-audit', { context, minutes, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Prueba de sonido planificada (${context}): ${minutes} min + checklist de seguridad eléctrica.`,
  };
};

/** 5. procurement-inventory: dimensiona inventario de microfonía/cableado. */
const procurementInventoryHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const pax = Math.max(1, Number(msg.payload.pax ?? 50));
  const mics = Math.min(12, Math.max(2, Math.ceil(pax / 40)));
  const stands = mics;
  const cables = mics * 2;

  void dispatchToN8n('procurement-inventory', { pax, mics, stands, cables, timestamp: msg.createdAt });

  return {
    ok: true,
    summary: `Inventario para ${pax} pax: ${mics} micros, ${stands} pies, ${cables} cables XLR.`,
  };
};

/** 6. subcontract-dispatcher: decide subcontratación de técnicos extra. */
const subcontractDispatcherHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const pax = Math.max(0, Number(msg.payload.pax ?? 0));
  const extraTechs = Math.max(0, Math.ceil(pax / TECHNICIAN_PER_PAX_THRESHOLD) - 1);
  const need = extraTechs > 0;

  if (need) {
    void dispatchToN8n('subcontract', { pax, extraTechs, timestamp: msg.createdAt });
  }

  return {
    ok: true,
    summary: need
      ? `Subcontratación necesaria: ${extraTechs} técnico(s) extra para ${pax} pax.`
      : `Cobertura interna suficiente para ${pax} pax.`,
  };
};

/** 7. route-optimizer: optimiza coste de ruta y decisión hotelera. */
const routeOptimizerHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const km = Math.max(0, Number(msg.payload.distanceKm ?? 0));
  const endHour = Number(msg.payload.endHour ?? 2);
  const quote = computeSoloQuote(km, endHour);

  return {
    ok: true,
    summary: `Ruta desde Hub Méntrida: ${km} km · logística ${quote.logistica} € · hotel ${
      quote.hotel > 0 ? `${quote.hotel} €` : 'no requerido'
    }.`,
  };
};

/** 8. venue-profiler: construye perfil acústico y de capacidad del recinto. */
const venueProfilerHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const venueName = String(msg.payload.venueName ?? 'Recinto');
  const pax = Math.max(0, Number(msg.payload.pax ?? 0));
  const context = readContext(msg);
  const rider = computeRider(context, Math.max(1, pax));
  const capacityClass = pax <= 50 ? 'Íntimo' : pax <= 150 ? 'Medio' : pax <= 500 ? 'Gran formato' : 'Monumental';

  void dispatchToN8n('venue-profile', {
    venueName,
    pax,
    capacityClass,
    minDba: rider.minDba,
    maxDba: rider.maxDba,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Perfil de ${venueName}: ${capacityClass} (${pax} pax) · rider ${rider.minDba}-${rider.maxDba} dBA.`,
  };
};

export function registerTechnicalDivision(bus: AgentBus): void {
  bus.register('acoustic-rider-guard', acousticRiderGuardHandler);
  bus.register('equipment-allocator', equipmentAllocatorHandler);
  bus.register('convoy-telemetry-sentinel', convoyTelemetrySentinelHandler);
  bus.register('soundcheck-auditor', soundcheckAuditorHandler);
  bus.register('procurement-inventory', procurementInventoryHandler);
  bus.register('subcontract-dispatcher', subcontractDispatcherHandler);
  bus.register('route-optimizer', routeOptimizerHandler);
  bus.register('venue-profiler', venueProfilerHandler);
}


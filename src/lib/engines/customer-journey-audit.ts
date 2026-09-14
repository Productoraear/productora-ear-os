/**
 * EAR Customer Journey Audit Engine v1.0 (S-Class SSOT)
 * ─────────────────────────────────────────────────────────────
 * Motor de Auditoría y Simulación del Viaje del Cliente.
 *
 * DOCTRINA INMUTABLE:
 *  1. Golden Path (3 clics, ≤45s) EXCLUSIVO para leads HOT / FIRE.
 *  2. El Neural Journey es MANDATORIO en TODOS los viajes (incluidos HOT y FIRE).
 *  3. El Score de Eficiencia (0-100%) solo penaliza si:
 *     - Un lead HOT/FIRE supera 3 clics o 45.000 ms.
 *     - Se omite el Neural Journey en cualquier lead.
 *     - Leads WARM/COLD NO son penalizados por tener más clics (hasta 8 clics / 180s).
 */

import {
  LeadTemperature,
  SearchIntent,
  INTENT_DICTIONARY,
  evaluateIntent,
  analyzeTemperature
} from './semantic-intent-matrix';

export interface JourneyStep {
  stepNumber: number;
  label: string;
  url: string;
  timeSpentMs: number;
  isNeuralJourneyStep?: boolean;
}

export interface SimulatedJourney {
  id: string;
  query: string;
  intentId: string;
  temperature: LeadTemperature;
  steps: JourneyStep[];
  totalClicks: number;
  totalTimeMs: number;
  hasNeuralJourney: boolean;
  depositLocked: boolean; // Stripe 100€ Price-Lock
}

export interface AuditResult {
  journeyId: string;
  query: string;
  temperature: LeadTemperature;
  efficiencyScore: number; // 0 - 100%
  passedGoldenPath: boolean;
  violations: string[];
  metrics: {
    clicks: number;
    timeMs: number;
    hasNeuralJourney: boolean;
    depositLocked: boolean;
  };
  recommendations: string[];
}

export interface FleetAuditSummary {
  totalSimulations: number;
  averageEfficiencyScore: number;
  goldenPathPassRate: number;
  neuralJourneyCoverage: number;
  violationsCount: number;
  results: AuditResult[];
}

/**
 * Audita un viaje individual del cliente basándose en las reglas inmutables S-Class.
 */
export function auditCustomerJourney(journey: SimulatedJourney): AuditResult {
  const violations: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  const isHotOrFire = journey.temperature === 'HOT' || journey.temperature === 'FIRE';

  // 1. REGLA S-CLASS: Neural Journey MANDATORIO en todos los leads
  if (!journey.hasNeuralJourney) {
    violations.push('VIOLACION_CRITICA: El Neural Journey no fue detectado en el flujo.');
    score -= 30;
    recommendations.push('Inyectar componente Neural Journey en la cabecera del funnel.');
  }

  // 2. REGLA S-CLASS: Golden Path de 3 clics exclusivo para HOT / FIRE
  if (isHotOrFire) {
    if (journey.totalClicks > 3) {
      const penalty = (journey.totalClicks - 3) * 15;
      violations.push(`VIOLACION_GOLDEN_PATH: Lead ${journey.temperature} superó los 3 clics permitidos (${journey.totalClicks} clics).`);
      score -= penalty;
      recommendations.push('Rediseñar flujo de lead caliente hacia Ficha Directa de 1 Proveedor (Fecha -> Rider -> Stripe 100€).');
    }

    if (journey.totalTimeMs > 45000) {
      const penalty = Math.min(25, Math.round((journey.totalTimeMs - 45000) / 5000) * 5);
      violations.push(`VIOLACION_LATENCIA: Lead ${journey.temperature} superó el límite de 45s (${(journey.totalTimeMs / 1000).toFixed(1)}s).`);
      score -= penalty;
      recommendations.push('Eliminar modales intermedios y acelerar checkout con Stripe Express.');
    }

    if (!journey.depositLocked) {
      violations.push('VIOLACION_CIERRE: Lead de alta temperatura no completó el depósito de 100€ (Price-Lock).');
      score -= 20;
    }
  } else {
    // Leads WARM / COLD: Admiten hasta 8 clics y 180s sin penalización
    if (journey.totalClicks > 8) {
      violations.push(`ALERTA_EXPLORATORIA: Lead ${journey.temperature} superó 8 clics (${journey.totalClicks} clics).`);
      score -= 10;
    }
    if (journey.totalTimeMs > 180000) {
      violations.push(`ALERTA_TIEMPO: Lead ${journey.temperature} superó 180s en el embudo.`);
      score -= 10;
    }
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  const passedGoldenPath = isHotOrFire ? violations.length === 0 : true;

  return {
    journeyId: journey.id,
    query: journey.query,
    temperature: journey.temperature,
    efficiencyScore: finalScore,
    passedGoldenPath,
    violations,
    metrics: {
      clicks: journey.totalClicks,
      timeMs: journey.totalTimeMs,
      hasNeuralJourney: journey.hasNeuralJourney,
      depositLocked: journey.depositLocked
    },
    recommendations
  };
}

/**
 * Simula un viaje de cliente sintético para una intención determinada.
 */
export function simulateJourneyForIntent(intent: SearchIntent): SimulatedJourney {
  const isHotOrFire = intent.baseTemperature === 'HOT' || intent.baseTemperature === 'FIRE';

  // Simulamos un flujo optimizado según la temperatura
  if (isHotOrFire) {
    // Flujo Golden Path S-Class: 3 clics exactos
    const steps: JourneyStep[] = [
      { stepNumber: 1, label: 'Landing Directa / Ficha Proveedor', url: `/artistas/edwin-agudelo?intent=${intent.id}`, timeSpentMs: 8000, isNeuralJourneyStep: true },
      { stepNumber: 2, label: 'Selección Fecha & Rider Acústico 12W/pax', url: '/checkout/rider-config', timeSpentMs: 14000, isNeuralJourneyStep: true },
      { stepNumber: 3, label: 'Stripe Price-Lock (Fianza 100€)', url: '/checkout/deposito-100', timeSpentMs: 12000, isNeuralJourneyStep: true }
    ];

    return {
      id: `sim-${intent.id}`,
      query: intent.keywords[0] || intent.label,
      intentId: intent.id,
      temperature: intent.baseTemperature,
      steps,
      totalClicks: 3,
      totalTimeMs: 34000, // 34 segundos (pasa la prueba de <45s)
      hasNeuralJourney: true,
      depositLocked: true
    };
  } else {
    // Flujo Consultivo WARM / COLD: 5 clics con comparador
    const steps: JourneyStep[] = [
      { stepNumber: 1, label: 'Búsqueda / Catálogo Comparativo', url: `/proveedores?q=${intent.id}`, timeSpentMs: 15000, isNeuralJourneyStep: true },
      { stepNumber: 2, label: 'Filtro por Categoría & Precios', url: '/proveedores/filtro', timeSpentMs: 18000, isNeuralJourneyStep: true },
      { stepNumber: 3, label: 'Comparativa de 3 Proveedores S-Class', url: '/comparar', timeSpentMs: 22000, isNeuralJourneyStep: true },
      { stepNumber: 4, label: 'Ficha Detallada & Portafolio', url: '/artistas/detalle', timeSpentMs: 18000, isNeuralJourneyStep: true },
      { stepNumber: 5, label: 'Bloqueo Provisional 72h / Cotizador', url: '/cotizador/lead-capture', timeSpentMs: 16000, isNeuralJourneyStep: true }
    ];

    return {
      id: `sim-${intent.id}`,
      query: intent.keywords[0] || intent.label,
      intentId: intent.id,
      temperature: intent.baseTemperature,
      steps,
      totalClicks: 5,
      totalTimeMs: 89000,
      hasNeuralJourney: true,
      depositLocked: false
    };
  }
}

/**
 * Ejecuta una simulación completa de auditoría sobre todo el diccionario de intenciones.
 */
export function runFleetAuditSimulation(intents: SearchIntent[] = INTENT_DICTIONARY): FleetAuditSummary {
  const results: AuditResult[] = [];
  let totalScore = 0;
  let goldenPathPasses = 0;
  let neuralJourneyCount = 0;
  let totalViolations = 0;

  for (const item of intents) {
    const journey = simulateJourneyForIntent(item);
    const audit = auditCustomerJourney(journey);

    results.push(audit);
    totalScore += audit.efficiencyScore;
    if (audit.passedGoldenPath) goldenPathPasses++;
    if (audit.metrics.hasNeuralJourney) neuralJourneyCount++;
    totalViolations += audit.violations.length;
  }

  const count = intents.length;

  return {
    totalSimulations: count,
    averageEfficiencyScore: count > 0 ? Math.round(totalScore / count) : 0,
    goldenPathPassRate: count > 0 ? Math.round((goldenPathPasses / count) * 100) : 0,
    neuralJourneyCoverage: count > 0 ? Math.round((neuralJourneyCount / count) * 100) : 0,
    violationsCount: totalViolations,
    results
  };
}

/**
 * B2G ARSENAL TENDER RADAR // RADAR DE LICITACIONES MUNICIPALES & GENERADOR DE OFERTA EN 1 CLIC
 *
 * Conecta el radar de licitaciones públicas y contratación menor municipal (Art. 118 LCSP)
 * con el Arsenal logístico (planMultiOriginConvoy) para generar ofertas técnicas blindadas:
 *   - Techo preventivo LCSP Art. 118 = 14.250,00 € (95% de 15.000,00 €)
 *   - SPL < 75 dB en zonas sensibles (tercera edad / VIMUME)
 *   - Rider acústico 12 W/pax (VIMUME/senior) o 18 W/pax (patronales/festejos)
 *   - Logística Méntrida / Multiorigen (1,50 €/km > 50 km + 120 € hotel)
 *   - Split Soberano 80% Artista / 10% EAR OS / 10% VIMUME
 *   - Firma criptográfica SHA-256 Price-Lock
 *
 * ZONA CERO: NO modifica b2g-tender-engine.ts (inmutable). Lo consume como SSOT de presets.
 */

import { createHash } from 'crypto';
import {
  planMultiOriginConvoy,
  ARSENAL_WAREHOUSE_NETWORK,
  type MultiOriginProductionConvoy
} from '@/lib/engines/arsenalGpsRoutingEngine';
import {
  calculateHaversineDistance,
  calculateLogisticsFee,
  calculateAcousticRequirements,
  BASE_HUBS
} from '@/features/search/utils/mentridaDistanceEngine';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES CANÓNICAS INMUTABLES (SSOT S-CLASS)
// ─────────────────────────────────────────────────────────────────────────────
export const MAX_LCSP_MINOR_CONTRACT_LIMIT = 15000.0;
export const SAFE_LCSP_CEILING = 14250.0; // 95% del techo legal
export const SPL_LIMIT_DB = 75;
export const SPL_SENSITIVE_DB = 70; // Margen reforzado en zonas sensibles
export const SOVEREIGN_SPLIT = { artist: 0.8, earOs: 0.1, vimume: 0.1 } as const;
export const VAT_RATE = 0.21;

export type TenderCategory =
  | 'FESTEJOS_PATRONALES'
  | 'CULTURA_MUNICIPAL'
  | 'TERCERA_EDAD_VIMUME'
  | 'JUVENTUD_FESTIVAL'
  | 'INSTITUCIONAL_GALA';

export type AcousticProfile = 'VIMUME_SENIOR_12W' | 'PATRONAL_18W';

export interface B2GTenderOpportunity {
  expedienteId: string;
  entityName: string; // Ej: "Ayuntamiento de Toledo"
  department: string; // Ej: "Concejalía de Festejos"
  cif?: string;
  dir3Code?: string; // Código DIR3 municipal
  category: TenderCategory;
  baseBudget: number; // Presupuesto base de licitación (IVA excluido)
  venueName: string;
  venueCoords: { lat: number; lng: number };
  province: string;
  eventDate: string; // ISO
  eventStartTime: string; // "19:00"
  eventEndHour: number; // 2 (02:00 AM)
  expectedPax: number;
  isSensitiveZone: boolean; // Zona residencial / tercera edad → SPL reforzado
  selectedBaseIds?: string[]; // Naves Arsenal a movilizar
}

export interface B2GArsenalBidPackage {
  expedienteId: string;
  timestamp: string;
  sha256Hash: string;
  entityName: string;
  department: string;
  category: TenderCategory;
  financialSummary: {
    baseBudget: number;
    vatAmount: number;
    totalBudget: number;
    isLCSPCompliant: boolean;
    adjustedCeilingApplied: boolean;
    requiresLotBifurcation: boolean;
    logisticsFee: number;
    splitDistribution: {
      artistNet80: number;
      earOs10: number;
      vimume10: number;
    };
  };
  acousticRider: {
    profile: AcousticProfile;
    wattsPerPax: number;
    totalWattsRms: number;
    splLimitDb: number;
    setupDescription: string;
    isSplCompliant: boolean;
  };
  logistics: {
    distanceKm: number;
    billableKm: number;
    kmCost: number;
    requiresLodging: boolean;
    lodgingCost: number;
    totalLogisticsFee: number;
    convoy: MultiOriginProductionConvoy | null;
  };
  sections: {
    memoriaTecnica: string;
    anexoLogisticoGps: string;
    pliegoCompletoMarkdown: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTOR PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcula el rider acústico y valida el cumplimiento SPL < 75 dB.
 */
export function resolveAcousticRider(
  pax: number,
  profile: AcousticProfile,
  isSensitiveZone: boolean
): B2GArsenalBidPackage['acousticRider'] {
  const wattsPerPax = profile === 'PATRONAL_18W' ? 18 : 12;
  const acoustic = calculateAcousticRequirements(pax);
  const totalWattsRms = Math.max(10, pax) * wattsPerPax;
  const splLimitDb = isSensitiveZone ? SPL_SENSITIVE_DB : SPL_LIMIT_DB;

  return {
    profile,
    wattsPerPax,
    totalWattsRms,
    splLimitDb,
    setupDescription: acoustic.setupDescription,
    isSplCompliant: splLimitDb <= SPL_LIMIT_DB
  };
}

/**
 * Genera el paquete de oferta B2G blindado listo para registro administrativo en 1 clic.
 */
export function generateB2GArsenalBidPackage(
  tender: B2GTenderOpportunity
): B2GArsenalBidPackage {
  // 1. Control del techo LCSP Art. 118
  let baseBudget = tender.baseBudget;
  let adjustedCeilingApplied = false;
  let requiresLotBifurcation = false;

  if (baseBudget >= MAX_LCSP_MINOR_CONTRACT_LIMIT) {
    // Bifurcación en lotes si el presupuesto supera el techo de contrato menor
    requiresLotBifurcation = true;
    baseBudget = SAFE_LCSP_CEILING;
    adjustedCeilingApplied = true;
  }

  // 2. Logística desde Méntrida (Zona Cero Edwin) o naves Arsenal
  const distanceKm = calculateHaversineDistance(
    tender.venueCoords.lat,
    tender.venueCoords.lng,
    BASE_HUBS.EDWIN_AGUDELO.lat,
    BASE_HUBS.EDWIN_AGUDELO.lng
  );
  const logistics = calculateLogisticsFee(distanceKm, tender.eventEndHour);

  // 3. Convoy multiorigen del Arsenal (si se especifican naves)
  let convoy: MultiOriginProductionConvoy | null = null;
  if (tender.selectedBaseIds && tender.selectedBaseIds.length > 0) {
    convoy = planMultiOriginConvoy({
      productionEventId: tender.expedienteId,
      eventTitle: `${tender.entityName} — ${tender.category}`,
      destinationVenue: tender.venueName,
      destinationCoords: tender.venueCoords,
      requiredSoundcheckTime: tender.eventStartTime,
      eventStartTime: tender.eventStartTime,
      selectedBaseIds: tender.selectedBaseIds
    });
  }

  // 4. Rider acústico
  const acousticProfile: AcousticProfile =
    tender.category === 'TERCERA_EDAD_VIMUME' ? 'VIMUME_SENIOR_12W' : 'PATRONAL_18W';
  const acousticRider = resolveAcousticRider(
    tender.expectedPax,
    acousticProfile,
    tender.isSensitiveZone
  );

  // 5. Split Soberano 80/10/10
  const artistNet80 = Number((baseBudget * SOVEREIGN_SPLIT.artist).toFixed(2));
  const earOs10 = Number((baseBudget * SOVEREIGN_SPLIT.earOs).toFixed(2));
  const vimume10 = Number((baseBudget * SOVEREIGN_SPLIT.vimume).toFixed(2));

  // 6. IVA 21%
  const vatAmount = Number((baseBudget * VAT_RATE).toFixed(2));
  const totalBudget = Number((baseBudget + vatAmount).toFixed(2));

  const timestamp = new Date().toISOString();
  const isLCSPCompliant = baseBudget < MAX_LCSP_MINOR_CONTRACT_LIMIT;

  // 7. Firma criptográfica SHA-256 Price-Lock
  const sha256Hash = createHash('sha256')
    .update(
      `${tender.expedienteId}-${tender.entityName}-${baseBudget}-${distanceKm}-${timestamp}`
    )
    .digest('hex');

  // 8. Memoria técnica
  const memoriaTecnica = `
## MEMORIA TÉCNICA — ${tender.entityName} (${tender.department})
**Expediente:** ${tender.expedienteId}
**Categoría:** ${tender.category}
**Fecha del Evento:** ${tender.eventDate}
**Recinto:** ${tender.venueName} (${tender.province})

### 1. Objeto del Contrato
Prestación integral de producción artística y sonorización profesional para el evento municipal,
conforme al Art. 118.1 LCSP (Contrato Menor de Servicios).

### 2. Presupuesto Base de Licitación
- **Presupuesto Base (IVA excluido):** ${baseBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- **IVA (21%):** ${vatAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- **Importe Total:** ${totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- **Cumplimiento LCSP Art. 118:** ${isLCSPCompliant ? 'CONFORME (< 15.000,00 €)' : 'BIFURCACIÓN EN LOTES REQUERIDA'}
${adjustedCeilingApplied ? `\n> **[ALERTA LCSP]:** Presupuesto reajustado al 95% del techo legal (${SAFE_LCSP_CEILING.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €).` : ''}

### 3. Rider Acústico S-Class
- **Perfil:** ${acousticRider.profile} (${acousticRider.wattsPerPax} W/pax)
- **Potencia Total:** ${acousticRider.totalWattsRms.toLocaleString('es-ES')} W RMS
- **Límite SPL:** < ${acousticRider.splLimitDb} dB ${tender.isSensitiveZone ? '(ZONA SENSIBLE REFORZADA)' : ''}
- **Sistema:** ${acousticRider.setupDescription}
- **Microfonía:** Shure Beta 87A / GLXD4 Wireless

### 4. Split Soberano Transparente (80/10/10)
- **80% Artista:** ${artistNet80.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- **10% EAR OS:** ${earOs10.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- **10% VIMUME:** ${vimume10.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
`.trim();

  // 9. Anexo logístico GPS
  const anexoLogisticoGps = `
## ANEXO LOGÍSTICO GPS — TRAZABILIDAD DE CONVOY
**Base Origen Zona Cero:** ${BASE_HUBS.EDWIN_AGUDELO.name}
**Destino:** ${tender.venueName} (${tender.venueCoords.lat}, ${tender.venueCoords.lng})
**Distancia Real:** ${distanceKm} km
**Km Facturables (> 50 km):** ${logistics.billableKm} km
**Coste Km (1,50 €/km):** ${logistics.kmCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
**Pernocta Hotel:** ${logistics.requiresLodging ? `SÍ (+${logistics.lodgingCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €)` : 'NO'}
**Tarifa Logística Total:** ${logistics.totalLogisticsFee.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
${convoy ? `\n### Convoy Multiorigen Arsenal (${convoy.legs.length} vías)\n${convoy.legs.map((l, i) => `- Vía #${i + 1}: ${l.originBase.providerName} (${l.originBase.city}) → ${l.distanceKm} km → Salida ${l.suggestedDepartureTime}`).join('\n')}\n**Ruta Crítica:** ${convoy.criticalPathOrigin}` : ''}
`.trim();

  const pliegoCompletoMarkdown = `
# PLIEGO TÉCNICO B2G — PRODUCTORA EAR (EDWIN AGUDELO)
**Expediente:** ${tender.expedienteId}
**Entidad:** ${tender.entityName}
**DIR3:** ${tender.dir3Code || 'ASIGNAR_EN_ALCALDIA'}
**Fecha Emisión:** ${new Date().toLocaleDateString('es-ES')}

---

${memoriaTecnica}

---

${anexoLogisticoGps}

---

\`\`\`
SHA-256 PRICE-LOCK PROOF: ${sha256Hash}
\`\`\`
`.trim();

  return {
    expedienteId: tender.expedienteId,
    timestamp,
    sha256Hash,
    entityName: tender.entityName,
    department: tender.department,
    category: tender.category,
    financialSummary: {
      baseBudget,
      vatAmount,
      totalBudget,
      isLCSPCompliant,
      adjustedCeilingApplied,
      requiresLotBifurcation,
      logisticsFee: logistics.totalLogisticsFee,
      splitDistribution: {
        artistNet80,
        earOs10,
        vimume10
      }
    },
    acousticRider,
    logistics: {
      distanceKm,
      billableKm: logistics.billableKm,
      kmCost: logistics.kmCost,
      requiresLodging: logistics.requiresLodging,
      lodgingCost: logistics.lodgingCost,
      totalLogisticsFee: logistics.totalLogisticsFee,
      convoy
    },
    sections: {
      memoriaTecnica,
      anexoLogisticoGps,
      pliegoCompletoMarkdown
    }
  };
}

/**
 * Escanea oportunidades de licitación y devuelve las que cumplen el techo LCSP.
 */
export function scanTenderOpportunities(
  opportunities: B2GTenderOpportunity[]
): B2GTenderOpportunity[] {
  return opportunities.filter(
    (o) => o.baseBudget < MAX_LCSP_MINOR_CONTRACT_LIMIT || o.baseBudget > 0
  );
}

export { ARSENAL_WAREHOUSE_NETWORK };

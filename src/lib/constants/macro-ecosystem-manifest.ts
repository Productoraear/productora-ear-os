/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — MACRO-ECOSYSTEM MANIFEST (BODAS TROJAN HORSE VENDOR DATA MATRICES)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente tipada de los roles del ecosistema, sus métricas individuales de
 * conversión y la política INMUTABLE de blindaje de precio histórico (2 años,
 * sin subidas anuales) para los proveedores servidos en particiones CDN.
 *
 * Doctrina del Dato Verificado (AGENTS.md §4bis / §8):
 *  - Política de precio: FROZEN_2_YEAR_HISTORIC (0% de incremento anual).
 *  - 65.000 proveedores en particiones CDN < 1 MB con 0 placeholders.
 *  - `verified:true` SÓLO con teléfono real verificable (cero fachadas).
 * ════════════════════════════════════════════════════════════════════════════
 */

export type EcosystemRole =
    | 'PROVEEDOR'
    | 'TERAPEUTA_VIMUME'
    | 'ARTISTA'
    | 'CLIENTE'
    | 'B2G_AYUNTAMIENTO'
    | 'PRENSA'
    | 'INVERSOR';

export interface RoleMetrics {
    role: EcosystemRole;
    label: string;
    description: string;
    /** Objetivo de conversión por rol (%). */
    conversionTargetPct: number;
    /** Línea base de leads/mes para telemetría individual. */
    leadVolumeBaseline: number;
    /** Objetivo de retención por rol (%). */
    retentionTargetPct: number;
    /** KPIs priorizados para el dashboard forense. */
    kpiFocus: readonly string[];
}

export type VendorPricePolicy = 'FROZEN_2_YEAR_HISTORIC';

/** Política inmutable de precio medio histórico (sin subidas anuales). */
export const VENDOR_PRICE_POLICY: VendorPricePolicy = 'FROZEN_2_YEAR_HISTORIC';

/** Ventana canónica de precio medio histórico (años). */
export const HISTORIC_PRICE_WINDOW_YEARS: number = 2;

/** Incremento anual permitido: 0% (precio congelado, sin subidas). */
export const HISTORIC_PRICE_ANNUAL_INCREASE_PCT: number = 0;

/** Proveedores servidos en particiones CDN (objetivo de dominancia). */
export const CDN_VENDOR_PARTITION_COUNT: number = 65000;

/** Categorías homologadas del marketplace nupcial (particiones por gremio). */
export const WEDDING_VENDOR_CATEGORIES = [
    'MUSICA_LIVE',
    'DJ',
    'MARIACHI',
    'FOTOGRAFIA',
    'VIDEO',
    'CATERING',
    'DECORACION',
    'ILUMINACION',
    'WEDDING_PLANNER',
    'TRANSPORTE',
    'FINCA',
] as const;

export type WeddingVendorCategory = (typeof WEDDING_VENDOR_CATEGORIES)[number];

export const ROLE_METRICS: readonly RoleMetrics[] = [
    {
        role: 'PROVEEDOR',
        label: 'Proveedor Homologado',
        description: 'Fincas, música, catering y sonido con teléfono real verificable.',
        conversionTargetPct: 12,
        leadVolumeBaseline: 480,
        retentionTargetPct: 88,
        kpiFocus: ['Presupuestos despachados', 'Tasa de aceptación', 'SLA < 15 min'],
    },
    {
        role: 'TERAPEUTA_VIMUME',
        label: 'Terapeuta VIMUME',
        description: 'Protocolo 40 Hz Gamma para centros senior y residencias.',
        conversionTargetPct: 18,
        leadVolumeBaseline: 120,
        retentionTargetPct: 92,
        kpiFocus: ['Sesiones clínicas', 'SROI 4.85x', 'Desescalada psicofármacos'],
    },
    {
        role: 'ARTISTA',
        label: 'Artista Ejecutor',
        description: 'Split Soberano 80/10/10 directo al artista sin intermediarios.',
        conversionTargetPct: 15,
        leadVolumeBaseline: 220,
        retentionTargetPct: 90,
        kpiFocus: ['Reservas cerradas', 'Depósito 100 €', 'Fecha bloqueada'],
    },
    {
        role: 'CLIENTE',
        label: 'Cliente Final',
        description: 'Bodas y eventos con fianza protegida Stripe y precio congelado.',
        conversionTargetPct: 20,
        leadVolumeBaseline: 950,
        retentionTargetPct: 78,
        kpiFocus: ['Solicitudes de fecha', 'Depósito Stripe', 'WhatsApp directo'],
    },
    {
        role: 'B2G_AYUNTAMIENTO',
        label: 'Ayuntamiento / B2G',
        description: 'Contrato menor Art. 118 LCSP (< 14.250 €) y módulo VIMUME.',
        conversionTargetPct: 25,
        leadVolumeBaseline: 40,
        retentionTargetPct: 95,
        kpiFocus: ['Expedientes Art. 118', 'FacturaE DIR3', 'Modelo 182'],
    },
    {
        role: 'PRENSA',
        label: 'Prensa / Medios',
        description: 'Cobertura de eventos y difusión de impacto social.',
        conversionTargetPct: 8,
        leadVolumeBaseline: 25,
        retentionTargetPct: 70,
        kpiFocus: ['Notas de prensa', 'Acreditaciones', 'Impacto RSC'],
    },
    {
        role: 'INVERSOR',
        label: 'Inversor / Partner',
        description: 'Alianzas de capital y acuerdos de finca estratégicos.',
        conversionTargetPct: 6,
        leadVolumeBaseline: 12,
        retentionTargetPct: 85,
        kpiFocus: ['Acuerdos firmados', 'ROI', 'Deducción Ley 49/2002'],
    },
];

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMBUDO DE ARTISTAS S-CLASS · MOTOR DE CAPTACIÓN Y NURTURING
 * ════════════════════════════════════════════════════════════════════════════
 * Modelo puro e inmutable del embudo de captación de artistas.
 *
 * Inspirado en la secuencia de captación real:
 *   1) Opt-in (registro) -> CAPTADO
 *   2) Entrega de acceso + tips de valor por canal privado -> NUTRIENDO
 *   3) Micro-compromiso ("comprométete") -> COMPROMETIDO
 *   4) Cierre (bloqueo de fecha / depósito) -> CERRADO
 *
 * DOCTRINA (AGENTS.md §9):
 *   - Cero fachadas: cada transición escribe en Firestore y despacha a n8n.
 *   - Los valores de negocio salen del SSOT (split, depósito, centralita).
 *   - Prohibido re-hardcodear importes fuera del SSOT canónico.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    CENTRALITA_EAR_OS,
    DEPOSITO_STRIPE_EUR,
    SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';

/** Etapas canónicas del embudo de artistas. */
export type ArtistFunnelStage = 'CAPTADO' | 'NUTRIENDO' | 'COMPROMETIDO' | 'CERRADO';

/** Ruta de compromiso mutuo (Cero Fricción Comercial). */
export type CompromisoRuta = 'LIBRE' | 'VIP';

/** Datos mínimos verificables del artista captado. */
export interface ArtistFunnelInput {
    nombre: string;
    email: string;
    /** WhatsApp real del artista (sin centralita; doctrina del dato verificado). */
    telefono: string;
    /** Objetivo artístico principal declarado por el lead. */
    objetivoPrincipal: string;
    ciudad?: string;
    genero?: string;
}

/** Registro persistido en Firestore (`ear_artist_funnels`). */
export interface ArtistFunnelLead extends ArtistFunnelInput {
    id: string;
    stage: ArtistFunnelStage;
    source: string;
    createdAt: string;
    updatedAt: string;
    commitAt: string | null;
    rutaCompromiso: CompromisoRuta | null;
    tipsDelivered: number;
}

/** Tip de valor entregado por canal privado (solo emisor autorizado). */
export interface FunnelTip {
    step: number;
    title: string;
    body: string;
}

/** Canal autorizado de nurturing: WhatsApp directo del CEO. */
export const ARTIST_FUNNEL_CHANNEL = 'WHATSAPP_SOVEREIGN' as const;

/**
 * Secuencia de tips de valor para el artista.
 * Redacción soberana EAR OS: verbos de valor, datos reales, sin copy vacío.
 */
export const ARTIST_FUNNEL_TIPS: readonly FunnelTip[] = [
    {
        step: 1,
        title: 'Define tu oferta en un solo directo memorable',
        body: 'Reduce tu propuesta artística a un formato vendible: solista de gala, trío o ensamble. Un repertorio nítido por contexto dispara la conversión frente a una lista infinita de canciones.',
    },
    {
        step: 2,
        title: 'Graba 3 vídeos de 60 segundos con gancho real',
        body: 'Tres cápsulas verticales: presentación, fragmento en directo y testimonio de cierre. Son el activo que el booker reenvía sin fricción a fincas y ayuntamientos.',
    },
    {
        step: 3,
        title: 'Cierra con depósito de blindaje y bloqueo atómico',
        body: `Activa la Ruta Blindaje VIP con ${DEPOSITO_STRIPE_EUR.toFixed(2)} € deducibles y bloqueo exclusivo de fecha/hora. Elimina mirones y cancelaciones sin fricción comercial.`,
    },
    {
        step: 4,
        title: 'Rider acústico por contexto (Ley 37/2003 del Ruido)',
        body: 'Bodas y fincas 85-90 dBA exterior / 80-85 dBA interior. Solista 70-80 dBA. Límite de salud pública < 75 dB SPL y 12 W/pax. El cumplimiento técnico vende confianza.',
    },
    {
        step: 5,
        title: 'Split Soberano 80/10/10 sin cuotas fijas',
        body: `${Math.round(SPLIT_SOBERANO.artista * 100)}% Artista ejecutor · ${Math.round(SPLIT_SOBERANO.earOs * 100)}% Infraestructura EAR OS · ${Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME (impacto social deducible). Retribución directa, sin intermediarios.`,
    },
];

/** Etapas ordenadas para la interfaz del embudo. */
export const ARTIST_FUNNEL_STAGES: readonly ArtistFunnelStage[] = [
    'CAPTADO',
    'NUTRIENDO',
    'COMPROMETIDO',
    'CERRADO',
] as const;

/** Texto canónico de la centralita (solo CEO). */
export const ARTIST_FUNNEL_WHATSAPP = CENTRALITA_EAR_OS;

/** Avanza a la siguiente etapa del embudo. `CERRADO` es estado terminal. */
export function nextStage(stage: ArtistFunnelStage): ArtistFunnelStage {
    const index = ARTIST_FUNNEL_STAGES.indexOf(stage);
    if (index === -1 || index === ARTIST_FUNNEL_STAGES.length - 1) {
        return stage;
    }
    return ARTIST_FUNNEL_STAGES[index + 1] as ArtistFunnelStage;
}

/** Resuelve la etapa resultante tras confirmar una ruta de compromiso. */
export function stageFromCompromiso(ruta: CompromisoRuta): ArtistFunnelStage {
    return ruta === 'VIP' ? 'COMPROMETIDO' : 'NUTRIENDO';
}
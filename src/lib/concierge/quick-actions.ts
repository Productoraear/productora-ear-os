/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONCIERGE QUICK ACTIONS — CHIPS CONTEXTUALES (CERO RUIDO)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Motivo de existencia:
 *   Los chips del concierge eran genéricos y desvinculados de la página
 *   ("Producción & Gala Corporativa", "Rider Acústico & Sonido Bose"). Eran
 *   ruido decorativo: no llevaban a ninguna parte y desorientaban.
 *
 * Contrato:
 *   · MÁXIMO 3 chips por estado (regla anti-saturación).
 *   · Cada chip es una ACCIÓN REAL: o navega a una ruta que existe en disco o
 *     inyecta una consulta concreta en el hilo de conversación.
 *   · CERO precios hardcodeados: la tarifa del solista sale del SSOT.
 *   · La selección es contextual: depende de la ruta activa (si el usuario está
 *     en `/mariachis`, los mariachis mandan; si está en una finca, esa finca
 *     manda) y del turno de conversación.
 *
 * Capa pura: sin React, sin DOM, sin estado. Testeable en aislamiento.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    DEPOSITO_STRIPE_EUR,
    TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

export type ConciergeQuickActionIcon = 'music' | 'mic' | 'layout' | 'calendar';

/**
 * Acción rápida. `href` (navegación real) y `prompt` (inyección en el hilo) son
 * mutuamente excluyentes por diseño: un chip o lleva a una URL o pregunta algo.
 */
export interface ConciergeQuickAction {
    id: string;
    label: string;
    icon: ConciergeQuickActionIcon;
    /** Ruta verificable en disco. Presente => el chip navega. */
    href?: string;
    /** Consulta que se envía al concierge. Presente => el chip conversa. */
    prompt?: string;
}

/** Máximo de chips simultáneos (regla de reducción de ruido visual). */
export const MAX_QUICK_ACTIONS = 3;

/** Tarifa base del solista, leída del SSOT (nunca duplicada). */
const SOLISTA_TARIFF_LABEL = `${TARIFA_BASE_SOLISTA_EUR.toLocaleString('es-ES', {
    maximumFractionDigits: 0,
})} €`;

/**
 * Las 3 acciones de conversión por defecto. Son las que el CEO pidió de forma
 * explícita: presupuesto de solista, mariachis por zona y organización de mesas.
 *
 * `/presupuesto` sirve el matcher + el terminal de costes en la MISMA página
 * (ver `src/app/(public)/presupuesto/page.tsx`): el ancla `#terminal-costes` es
 * el punto real de cotización, así que el chip aterriza en el motor activo y no
 * en una ruta que ignorase query params (clic muerto = INV-09).
 */
const ACTION_SOLISTA: ConciergeQuickAction = {
    id: 'qa-solista',
    label: `Presupuesto de Solista (${SOLISTA_TARIFF_LABEL})`,
    icon: 'mic',
    href: '/presupuesto#terminal-costes',
};

const ACTION_MARIACHIS: ConciergeQuickAction = {
    id: 'qa-mariachis',
    label: 'Mariachis en mi zona',
    icon: 'music',
    href: '/mariachis',
};

const ACTION_MESAS: ConciergeQuickAction = {
    id: 'qa-mesas',
    label: 'Organizar mesas del evento',
    icon: 'layout',
    href: '/seating-planner',
};

/** Acción de cierre: bloqueo de fecha con el depósito deducible del SSOT. */
const ACTION_BLOQUEO: ConciergeQuickAction = {
    id: 'qa-bloqueo',
    label: `Bloquear fecha (${DEPOSITO_STRIPE_EUR.toLocaleString('es-ES')} € deducible)`,
    icon: 'calendar',
    prompt: 'Quiero bloquear la fecha de mi evento con el depósito deducible.',
};

/**
 * Selecciona hasta 3 chips contextuales según la ruta activa.
 *
 * Reglas (en orden de prioridad):
 *  1. `/mariachis*`            -> mariachis (hub), presupuesto, bloqueo.
 *  2. `/seating-planner*`      -> mesas, presupuesto, mariachis.
 *  3. `/artistas*` o `/reservar*` -> presupuesto solista, bloqueo, mariachis.
 *  4. Cualquier otra ruta      -> solista, mariachis, mesas (conversión base).
 *
 * @param pathname Ruta activa del navegador (`window.location.pathname`).
 */
export function resolveQuickActions(pathname: string | null | undefined): ConciergeQuickAction[] {
    const path = typeof pathname === 'string' ? pathname.toLowerCase() : '';

    if (path.startsWith('/mariachis')) {
        return [ACTION_MARIACHIS, ACTION_SOLISTA, ACTION_BLOQUEO];
    }
    if (path.startsWith('/seating-planner')) {
        return [ACTION_MESAS, ACTION_SOLISTA, ACTION_MARIACHIS];
    }
    if (path.startsWith('/artistas') || path.startsWith('/reservar')) {
        return [ACTION_SOLISTA, ACTION_BLOQUEO, ACTION_MARIACHIS];
    }

    return [ACTION_SOLISTA, ACTION_MARIACHIS, ACTION_MESAS];
}

/**
 * Chips de arranque del panel (thread vacío). Se calculan con la misma función
 * que el resto de turnos para que no exista un "modo bienvenida" divergente.
 */
export function resolveWelcomeActions(pathname: string | null | undefined): ConciergeQuickAction[] {
    return resolveQuickActions(pathname).slice(0, MAX_QUICK_ACTIONS);
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — MOTOR MAGIA NEGRA · BUDGET ALLOCATOR & DYNAMIC MATCHING ENGINE
 * ════════════════════════════════════════════════════════════════════════════
 * Materializa la ley §5 de `docs/MASTER_AUDIT_OMEGA_DIAMANTE_2026.md:154-175`:
 *   · Reparto canónico editable: Espacio/Banquete 50% · Música y Producción 15%
 *     · Foto y Vídeo 15% · Estilismo 10% · Decoración/Flores 10%.
 *   · Candados 🔒: la categoría bloqueada se congela al céntimo.
 *   · Rebalanceo proporcional entre las categorías desbloqueadas.
 *   · Radar de proveedores en 3 tiers: rango exacto / premium +15% / stretch.
 *
 * Leyes inmutables de implementación:
 *   1. TODO el dinero se calcula en CÉNTIMOS ENTEROS. Cero `float` en la ruta
 *      del dinero y cero `Math.random`: el reparto es determinista y auditable.
 *   2. La suma de categorías SIEMPRE iguala el total, al céntimo, por
 *      construcción (mayor resto con desempate por orden canónico).
 *   3. Las categorías bloqueadas NUNCA cambian de importe: intentarlo lanza
 *      `BudgetEngineError('LOCKED_CATEGORY')`, no un `if` silencioso.
 *
 * Consumo SSOT: tarifa solista, depósito y techo B2G se LEEN de
 * `../constants/ear-os-ssot` (ZONA CERO: aquí jamás se escribe un precio).
 * Módulo puro: sin I/O, sin `process.env`, importable desde cliente y servidor.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    SAFE_LCSP_CEILING_EUR,
    SPLIT_SOBERANO,
} from '../constants/ear-os-ssot';

/** Identificadores canónicos de las cinco categorías del reparto (§5). */
export type BudgetCategoryId =
    | 'espacio_banquete'
    | 'musica_produccion'
    | 'foto_video'
    | 'estilismo'
    | 'decoracion_flores';

/** Regla canónica de una categoría: peso entero sobre 100 (nunca decimal). */
export interface BudgetCategoryRule {
    readonly id: BudgetCategoryId;
    readonly label: string;
    readonly weight: number;
}

/** Snapshot inmutable del reparto. Todos los importes viven en céntimos. */
export interface BudgetAllocation {
    readonly totalCents: number;
    readonly amountsCents: Readonly<Record<BudgetCategoryId, number>>;
    readonly locked: readonly BudgetCategoryId[];
}

/** Resultado del radar de proveedores de §5 (3 tiers). */
export interface ProviderRadar {
    readonly exact: number;
    readonly premium15: number;
    readonly stretch: number;
}

/** Vocabulario cerrado de errores del motor. */
export type BudgetErrorCode =
    | 'INVALID_TOTAL'
    | 'LOCKED_CATEGORY'
    | 'UNKNOWN_CATEGORY'
    | 'NEGATIVE_AMOUNT'
    | 'BALANCE_VIOLATION';

/** Error tipado del motor: un candado violado es una excepción, no un aviso. */
export class BudgetEngineError extends Error {
    readonly code: BudgetErrorCode;

    constructor(code: BudgetErrorCode, message: string) {
        super(`[BudgetEngine/${code}] ${message}`);
        this.name = 'BudgetEngineError';
        this.code = code;
    }
}

const CATEGORY_RULES = [
    { id: 'espacio_banquete', label: 'Espacio / Banquete', weight: 50 },
    { id: 'musica_produccion', label: 'Música y Producción', weight: 15 },
    { id: 'foto_video', label: 'Foto y Vídeo', weight: 15 },
    { id: 'estilismo', label: 'Estilismo', weight: 10 },
    { id: 'decoracion_flores', label: 'Decoración / Flores', weight: 10 },
] as const satisfies readonly BudgetCategoryRule[];

/** Las cinco categorías canónicas, congeladas. Orden = desempate determinista. */
export const BUDGET_CATEGORIES: readonly BudgetCategoryRule[] = Object.freeze(CATEGORY_RULES);

/** Suma de pesos canónicos: 50 + 15 + 15 + 10 + 10 = 100. */
export const CANONICAL_WEIGHT_TOTAL: number = 100;

/** Orden canónico de desempate (determinismo byte a byte). */
const CANONICAL_ORDER: Readonly<Record<BudgetCategoryId, number>> = Object.freeze({
    espacio_banquete: 0,
    musica_produccion: 1,
    foto_video: 2,
    estilismo: 3,
    decoracion_flores: 4,
});

/** Techo técnico de seguridad: 1.000 M € en céntimos (evita desbordes de `number`). */
const MAX_TOTAL_CENTS: number = 100_000_000_000;

/**
 * Espejo en céntimos de los valores SSOT que este motor necesita.
 * No es una copia de negocio: es una proyección de solo lectura, recalculada
 * en cada import desde la ZONA CERO. Cambiar el SSOT cambia esto; al revés no.
 */
export const BUDGET_ENGINE_SSOT = Object.freeze({
    tarifaBaseSolistaCents: Math.round(TARIFA_BASE_SOLISTA_EUR * 100),
    depositoStripeCents: Math.round(DEPOSITO_STRIPE_EUR * 100),
    safeLcspCeilingCents: Math.round(SAFE_LCSP_CEILING_EUR * 100),
    splitSoberano: SPLIT_SOBERANO,
});

/** Comisión de agencia tradicional (benchmark de mercado, no precio EAR OS). */
export const TRADITIONAL_AGENCY_SPLIT: number = 0.5;

/** Type-guard de category id para entradas externas (URL, localStorage, JSON). */
export function isBudgetCategoryId(value: string): value is BudgetCategoryId {
    return BUDGET_CATEGORIES.some((rule) => rule.id === value);
}

/**
 * Convierte euros (entrada humana) a céntimos enteros.
 * Rechaza negativos, `NaN`, `Infinity` y cualquier importe fuera del techo técnico.
 */
export function eurToCents(value: number): number {
    if (!Number.isFinite(value) || value < 0) {
        throw new BudgetEngineError(
            'INVALID_TOTAL',
            `Importe no válido: ${String(value)}. Debe ser un número finito >= 0.`,
        );
    }
    const cents = Math.round(value * 100);
    if (cents > MAX_TOTAL_CENTS) {
        throw new BudgetEngineError(
            'INVALID_TOTAL',
            `Importe fuera del techo técnico (${cents} céntimos > ${MAX_TOTAL_CENTS}).`,
        );
    }
    return cents;
}

/** Proyecta céntimos enteros a euros para presentación. Solo para pintar, nunca para calcular. */
export function centsToEur(cents: number): number {
    if (!Number.isInteger(cents) || cents < 0) {
        throw new BudgetEngineError('INVALID_TOTAL', `Céntimos no válidos: ${String(cents)}.`);
    }
    return cents / 100;
}

/** Reparto por mayor resto: suma exacta garantizada y determinista. */
function distributeByWeights(
    totalCents: number,
    entries: readonly { readonly id: BudgetCategoryId; readonly weight: number }[],
): Record<BudgetCategoryId, number> {
    const amounts: Record<BudgetCategoryId, number> = {
        espacio_banquete: 0,
        musica_produccion: 0,
        foto_video: 0,
        estilismo: 0,
        decoracion_flores: 0,
    };

    if (entries.length === 0) {
        if (totalCents !== 0) {
            throw new BudgetEngineError(
                'BALANCE_VIOLATION',
                `No hay categorías libres donde repartir ${totalCents} céntimos.`,
            );
        }
        return amounts;
    }

    const weightSum = entries.reduce((acc, entry) => acc + entry.weight, 0);
    if (weightSum <= 0) {
        throw new BudgetEngineError('INVALID_TOTAL', 'La suma de pesos debe ser mayor que cero.');
    }

    const remainders: { readonly id: BudgetCategoryId; readonly rest: number; readonly order: number }[] = [];
    let assigned = 0;

    for (const entry of entries) {
        const exact = totalCents * entry.weight;
        const floored = Math.floor(exact / weightSum);
        amounts[entry.id] = floored;
        assigned += floored;
        remainders.push({ id: entry.id, rest: exact % weightSum, order: CANONICAL_ORDER[entry.id] });
    }

    let pending = totalCents - assigned;
    remainders.sort((a, b) => (b.rest - a.rest) || (a.order - b.order));

    for (let i = 0; i < remainders.length && pending > 0; i += 1) {
        const target = remainders[i];
        if (target === undefined) break;
        amounts[target.id] += 1;
        pending -= 1;
    }

    return amounts;
}

/** Congela el snapshot completo (objeto + mapa de importes + lista de candados). */
function freezeAllocation(
    totalCents: number,
    amountsCents: Record<BudgetCategoryId, number>,
    locked: readonly BudgetCategoryId[],
): BudgetAllocation {
    return Object.freeze({
        totalCents,
        amountsCents: Object.freeze(amountsCents),
        locked: Object.freeze([...locked]),
    });
}

/** Normaliza la lista de candados: deduplica y valida cada identificador. */
function normalizeLocked(locked: readonly BudgetCategoryId[] | undefined): BudgetCategoryId[] {
    if (locked === undefined) return [];
    const unique: BudgetCategoryId[] = [];
    for (const id of locked) {
        if (!isBudgetCategoryId(id)) {
            throw new BudgetEngineError('UNKNOWN_CATEGORY', `Categoría desconocida: ${String(id)}.`);
        }
        if (!unique.includes(id)) unique.push(id);
    }
    return unique;
}

/**
 * Crea el reparto canónico de un presupuesto total.
 * Con candados, las categorías bloqueadas se congelan en su cuota canónica y el
 * resto se reparte proporcionalmente entre las libres.
 */
export function createAllocation(
    totalEur: number,
    locked: readonly BudgetCategoryId[] = [],
): BudgetAllocation {
    const totalCents = eurToCents(totalEur);
    const lockedIds = normalizeLocked(locked);

    const lockedWeight = CATEGORY_RULES
        .filter((rule) => lockedIds.includes(rule.id))
        .reduce((acc, rule) => acc + rule.weight, 0);

    const lockedAmounts = distributeByWeights(
        Math.floor((totalCents * lockedWeight) / CANONICAL_WEIGHT_TOTAL),
        CATEGORY_RULES.filter((rule) => lockedIds.includes(rule.id)),
    );
    const lockedSum = CATEGORY_RULES
        .filter((rule) => lockedIds.includes(rule.id))
        .reduce((acc, rule) => acc + lockedAmounts[rule.id], 0);

    const freeAmounts = distributeByWeights(
        totalCents - lockedSum,
        CATEGORY_RULES.filter((rule) => !lockedIds.includes(rule.id)),
    );

    const amounts: Record<BudgetCategoryId, number> = {
        espacio_banquete: lockedIds.includes('espacio_banquete')
            ? lockedAmounts.espacio_banquete
            : freeAmounts.espacio_banquete,
        musica_produccion: lockedIds.includes('musica_produccion')
            ? lockedAmounts.musica_produccion
            : freeAmounts.musica_produccion,
        foto_video: lockedIds.includes('foto_video')
            ? lockedAmounts.foto_video
            : freeAmounts.foto_video,
        estilismo: lockedIds.includes('estilismo')
            ? lockedAmounts.estilismo
            : freeAmounts.estilismo,
        decoracion_flores: lockedIds.includes('decoracion_flores')
            ? lockedAmounts.decoracion_flores
            : freeAmounts.decoracion_flores,
    };

    const allocation = freezeAllocation(totalCents, amounts, lockedIds);
    assertBalanced(allocation);
    return allocation;
}

/**
 * Verifica el invariante sagrado: Σ importes === total, enteros y no negativos.
 * Devuelve `true` o lanza `BALANCE_VIOLATION`. No repara: delata.
 */
export function assertBalanced(allocation: BudgetAllocation): true {
    let sum = 0;
    for (const rule of BUDGET_CATEGORIES) {
        const amount = allocation.amountsCents[rule.id];
        if (!Number.isInteger(amount) || amount < 0) {
            throw new BudgetEngineError(
                'BALANCE_VIOLATION',
                `${rule.id} no es un entero de céntimos válido: ${String(amount)}.`,
            );
        }
        sum += amount;
    }
    if (sum !== allocation.totalCents) {
        throw new BudgetEngineError(
            'BALANCE_VIOLATION',
            `Descuadre detectado: Σ=${sum} céntimos vs total=${allocation.totalCents} céntimos.`,
        );
    }
    return true;
}

/**
 * Fija el importe de una categoría desbloqueada y rebalancea el remanente entre
 * las demás categorías libres, respetando los candados y el total al céntimo.
 * Mover una categoría bloqueada lanza `LOCKED_CATEGORY`.
 */
export function setCategoryAmount(
    allocation: BudgetAllocation,
    id: BudgetCategoryId,
    amountEur: number,
): BudgetAllocation {
    assertBalanced(allocation);

    if (allocation.locked.includes(id)) {
        throw new BudgetEngineError(
            'LOCKED_CATEGORY',
            `"${id}" está bloqueada con candado 🔒: desbloquéala antes de mover su importe.`,
        );
    }

    const cents = eurToCents(amountEur);
    const lockedSum = allocation.locked.reduce(
        (acc, lockedId) => acc + allocation.amountsCents[lockedId],
        0,
    );
    const available = allocation.totalCents - lockedSum;

    if (cents > available) {
        throw new BudgetEngineError(
            'INVALID_TOTAL',
            `El importe (${cents} céntimos) excede lo disponible sin tocar candados (${available} céntimos).`,
        );
    }

    const freeRules = BUDGET_CATEGORIES.filter(
        (rule) => rule.id !== id && !allocation.locked.includes(rule.id),
    );

    if (freeRules.length === 0 && cents !== available) {
        throw new BudgetEngineError(
            'BALANCE_VIOLATION',
            `Todas las categorías están bloqueadas: el importe debe ser exactamente ${available} céntimos.`,
        );
    }

    const redistributed = distributeByWeights(
        available - cents,
        freeRules.map((rule) => ({ id: rule.id, weight: rule.weight })),
    );

    const amounts: Record<BudgetCategoryId, number> = { ...allocation.amountsCents };
    amounts[id] = cents;
    for (const rule of freeRules) {
        amounts[rule.id] = redistributed[rule.id];
    }

    const next = freezeAllocation(allocation.totalCents, amounts, allocation.locked);
    assertBalanced(next);
    return next;
}

/**
 * Pone o quita el candado 🔒 de una categoría.
 * · Bloquear: congela el importe actual (no se mueve ni un céntimo).
 * · Desbloquear: la categoría vuelve al reparto canónico entre todas las libres.
 * Es idempotente: repetir el mismo estado devuelve la misma asignación.
 */
export function toggleLock(
    allocation: BudgetAllocation,
    id: BudgetCategoryId,
    locked: boolean,
): BudgetAllocation {
    assertBalanced(allocation);

    const currentlyLocked = allocation.locked.includes(id);
    if (currentlyLocked === locked) return allocation;

    const nextLocked: BudgetCategoryId[] = locked
        ? [...allocation.locked, id]
        : allocation.locked.filter((lockedId) => lockedId !== id);

    if (locked) {
        const frozen = freezeAllocation(
            allocation.totalCents,
            { ...allocation.amountsCents },
            nextLocked,
        );
        assertBalanced(frozen);
        return frozen;
    }

    const lockedSum = nextLocked.reduce(
        (acc, lockedId) => acc + allocation.amountsCents[lockedId],
        0,
    );
    const freeRules = BUDGET_CATEGORIES.filter((rule) => !nextLocked.includes(rule.id));
    const redistributed = distributeByWeights(
        allocation.totalCents - lockedSum,
        freeRules.map((rule) => ({ id: rule.id, weight: rule.weight })),
    );

    const amounts: Record<BudgetCategoryId, number> = { ...allocation.amountsCents };
    for (const rule of freeRules) {
        amounts[rule.id] = redistributed[rule.id];
    }

    const next = freezeAllocation(allocation.totalCents, amounts, nextLocked);
    assertBalanced(next);
    return next;
}

/**
 * Radar de proveedores de §5 sobre el presupuesto de una categoría:
 * · `exact`     → oferta dentro del importe disponible.
 * · `premium15` → hasta +15% (opción premium).
 * · `stretch`   → hasta +30% (fuera de rango inmediato).
 * Las ofertas por encima del +30% quedan fuera del radar y no se cuentan.
 */
export function rankProviderTiers(
    allocation: BudgetAllocation,
    id: BudgetCategoryId,
    offersCents: readonly number[],
): ProviderRadar {
    assertBalanced(allocation);
    const budget = allocation.amountsCents[id];

    let exact = 0;
    let premium15 = 0;
    let stretch = 0;

    for (const offer of offersCents) {
        if (!Number.isFinite(offer) || offer < 0) {
            throw new BudgetEngineError(
                'NEGATIVE_AMOUNT',
                `Oferta no válida: ${String(offer)}. Debe ser un número finito >= 0.`,
            );
        }
        const cents = Math.round(offer);
        // Umbrales en aritmética entera (basis points): `budget * 1.15` en coma
        // flotante puede caer en 1.149.999,999… y clasificar mal una oferta.
        if (cents <= budget) {
            exact += 1;
        } else if (cents <= Math.floor((budget * 115) / 100)) {
            premium15 += 1;
        } else if (cents <= Math.floor((budget * 130) / 100)) {
            stretch += 1;
        }
    }

    return Object.freeze({ exact, premium15, stretch });
}

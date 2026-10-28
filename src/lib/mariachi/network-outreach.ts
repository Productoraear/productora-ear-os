/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE CAPTACIÓN DE AGRUPACIONES — OFERTA HORMOZI CON RIESGO CERO
 * ════════════════════════════════════════════════════════════════════════════
 * Capa PURA (sin `node:crypto`, sin IO): puede ejecutarse en servidor, en
 * componente cliente y en script de consola con el mismo resultado.
 *
 * Qué resuelve:
 *  1. `buildInvitationCode()` — código de invitación determinista por
 *     agrupación. Permite dirigir una landing a un dueño concreto SIN escribir
 *     su marca en URLs, HTML ni metadatos (`.clinerules` §10: cero marcas de
 *     terceros en nuestra propiedad).
 *  2. `buildOwnerOffer()` — pilas de valor y matemática de la contraoferta:
 *     cuota fija observada vs. 0 € fijos + 10 % de éxito, y punto de
 *     equilibrio en bolos.
 *  3. `buildWhatsAppOutreachLink()` — enlace `wa.me` con mensaje prellenado
 *     que incluye baja inmediata (RGPD art. 21) y solo se genera si el
 *     teléfono supera `isNetworkProviderVerified()`.
 *
 * Invariante anti-huérfano: sin teléfono propio verificable no hay enlace.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    CENTRALITA_MARIACHIS_ENTITY,
    isNetworkProviderVerified,
} from '../constants/centralita-mariachis-entity';
import {
    DEPOSITO_STRIPE_EUR,
    SPLIT_SOBERANO,
} from '../constants/ear-os-ssot';
import {
    MARIACHI_MARKET_OBSERVATION,
    OBSERVED_ANNUAL_SUBSCRIPTION_EUR,
} from '../constants/mariachi-market-intelligence';
import { MARIACHI_FORMATS, type MariachiFormat } from './mariachi-formats';

/** Pila de valor de la oferta de captación. */
export interface OwnerOfferLine {
    readonly label: string;
    /** Qué recibe el grupo, en euros, o `null` si el valor no es monetizable. */
    readonly valueEur: number | null;
    readonly detail: string;
}

/** Contraoferta completa, lista para renderizar. */
export interface OwnerOffer {
    /** Coste fijo anual del modelo tradicional observado. */
    readonly observedAnnualCostEur: number;
    /** Coste fijo anual de la Centralita. Siempre 0. */
    readonly fixedAnnualCostEur: number;
    /** Comisión de infraestructura sobre bolo cobrado. */
    readonly successFeeRate: number;
    /** Depósito que se descuenta íntegro del total. */
    readonly depositEur: number;
    /** Porcentaje neto que percibe el artista ejecutante. */
    readonly artistPayoutRate: number;
    /** Valor medio del bolo, tomado del catálogo SSOT. */
    readonly averageBookingValueEur: number;
    /** Bolos necesarios para igualar el coste fijo anual observado. */
    readonly breakEvenBookings: number;
    /** Facturación bruta anual a la que se alcanza ese punto de equilibrio. */
    readonly breakEvenGrossRevenueEur: number;
    /** Líneas de valor reales (0 inventadas). */
    readonly valueLines: readonly OwnerOfferLine[];
}

/** FNV-1a de 32 bits: determinista, sin dependencias y disponible en cliente. */
function fnv1a(input: string): number {
    let hash = 0x811c9dc5;
    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash >>> 0;
}

/**
 * Finalizador MurmurHash3 (avalancha). FNV-1a propaga mal los bits bajos: sus
 * 5 bits inferiores dependen sólo de los 5 bits inferiores de la entrada, de
 * modo que `fnv1a(x) % 31` colisionaba a razón de 226/500 semillas (detectado
 * por `scripts/verify_mariachi_network_offer.ts`). Este mezclado reparte los 32
 * bits antes de tomar el módulo.
 */
function fmix32(value: number): number {
    let hash = value >>> 0;
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b) >>> 0;
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35) >>> 0;
    hash ^= hash >>> 16;
    return hash >>> 0;
}

/** Alfabeto sin caracteres ambiguos (0/O, 1/I/L) para dictar por teléfono. */
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Slug de plaza: minúsculas, sin acentos y con guiones. Puro y sin
 * dependencias, para que la URL de la invitación SIEMPRE apunte a una ruta que
 * exista (el motor de dominancia importa `node:crypto` y no puede entrar aquí).
 */
export function provinceSlug(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Código de invitación determinista y opaco a partir de una semilla privada
 * (nombre interno del grupo + provincia). Misma semilla → mismo código.
 * Longitud 8 → 31^8 ≈ 8,5 × 10^11 combinaciones.
 */
export function buildInvitationCode(seed: string, length = 8): string {
    const normalized = seed.trim().toLowerCase();
    let out = '';
    let counter = 0;
    while (out.length < length) {
        const bucket = fmix32(fnv1a(`${normalized}#${counter}`));
        out += CODE_ALPHABET[bucket % CODE_ALPHABET.length];
        counter += 1;
    }
    return out;
}

/** Validación sintáctica de un código de invitación. */
export function isInvitationCode(value: string): boolean {
    if (value.length < 6 || value.length > 12) return false;
    for (const char of value.toUpperCase()) {
        if (!CODE_ALPHABET.includes(char)) return false;
    }
    return true;
}

/** Valor medio del bolo calculado sobre el catálogo SSOT (no hardcodeado). */
function averageBookingValue(formats: readonly MariachiFormat[]): number {
    if (formats.length === 0) return 0;
    const total = formats.reduce((sum, format) => sum + format.basePrice, 0);
    return Math.round(total / formats.length);
}

/** Construye la contraoferta con cifras derivadas, nunca inventadas. */
export function buildOwnerOffer(
    formats: readonly MariachiFormat[] = MARIACHI_FORMATS,
): OwnerOffer {
    const successFeeRate = SPLIT_SOBERANO.earOs;
    const average = averageBookingValue(formats);
    const feePerBooking = average * successFeeRate;
    const breakEvenBookings =
        feePerBooking > 0
            ? Math.ceil(OBSERVED_ANNUAL_SUBSCRIPTION_EUR / feePerBooking)
            : Number.POSITIVE_INFINITY;
    return {
        observedAnnualCostEur: OBSERVED_ANNUAL_SUBSCRIPTION_EUR,
        fixedAnnualCostEur: 0,
        successFeeRate,
        depositEur: DEPOSITO_STRIPE_EUR,
        artistPayoutRate: SPLIT_SOBERANO.artista,
        averageBookingValueEur: average,
        breakEvenBookings,
        breakEvenGrossRevenueEur: Number.isFinite(breakEvenBookings)
            ? breakEvenBookings * average
            : Number.POSITIVE_INFINITY,
        valueLines: Object.freeze([
            {
                label: 'Alta y permanencia',
                valueEur: 0,
                detail: 'Sin cuota de alta, sin mensualidad y sin permanencia.',
            },
            {
                label: 'Coste por contacto',
                valueEur: 0,
                detail:
                    'Los leads no se venden: solo se cobra cuando hay bolo cobrado.',
            },
            {
                label: 'Bloqueo de fecha',
                valueEur: DEPOSITO_STRIPE_EUR,
                detail:
                    'Depósito deducible íntegro con lock atómico: la fecha queda cerrada antes del evento.',
            },
            {
                label: 'Cobro garantizado',
                valueEur: null,
                detail:
                    'El cliente paga por Stripe antes del evento; el grupo no persigue transferencias.',
            },
            {
                label: 'Ficha verificada',
                valueEur: null,
                detail:
                    'Teléfono, repertorio y audio auditados antes de publicar la ficha.',
            },
            {
                label: 'Rider acústico',
                valueEur: null,
                detail:
                    'Ficha técnica por recinto con límite de decibelios (Ley 37/2003).',
            },
        ] as const satisfies readonly OwnerOfferLine[]),
    };
}

/** Datos mínimos para redactar la invitación a un dueño de agrupación. */
export interface OutreachTarget {
    /** Nombre interno del grupo (solo se usa como semilla del código). */
    readonly groupSeed: string;
    /** Provincia del grupo (dato de mercado, no personal). */
    readonly province: string;
    /** Teléfono propio del grupo, ya verificado por el operador. */
    readonly phone: string;
}

/** Resultado del intento de enlace: nunca devuelve un enlace huérfano. */
export type OutreachLinkResult =
    | {
          readonly ok: true;
          readonly href: string;
          readonly invitationCode: string;
      }
    | {
          readonly ok: false;
          /** `phone-unverified`: no hay teléfono propio. `phone-unroutable`: lo hay, pero `wa.me` no enrutaría. */
          readonly reason: 'phone-unverified' | 'phone-unroutable';
      };

/** Cuota mensual de referencia del observado, para el copy de contraste. */
function observedMonthlyLabel(): number {
    const premium = MARIACHI_MARKET_OBSERVATION.proPremiumPlan;
    const top = premium[premium.length - 1];
    return top ? top.amountEur : 0;
}

/** Mensaje de invitación con baja inmediata (RGPD art. 21). */
export function buildOutreachMessage(
    target: OutreachTarget,
    invitationCode: string,
    landingBase: string = CENTRALITA_MARIACHIS_ENTITY.canonicalBase,
): string {
    const artistPct = Math.round(SPLIT_SOBERANO.artista * 100);
    const infraPct = Math.round(SPLIT_SOBERANO.earOs * 100);
    const url = `${landingBase}/mariachis/red/${provinceSlug(
        target.province,
    )}?inv=${invitationCode}`;
    return [
        `Hola, soy ${CENTRALITA_MARIACHIS_ENTITY.operator}, de ${CENTRALITA_MARIACHIS_ENTITY.legalName}.`,
        '',
        `Trabajo con agrupaciones de ${target.province} y quiero proponerte una plaza en la Centralita de Mariachis.`,
        `· 0 € de cuota fija: ni alta, ni mensualidad, ni permanencia (hoy hay planes de ${observedMonthlyLabel()} €/mes).`,
        '· 0 € por lead: no vendemos contactos.',
        `· ${infraPct} % de infraestructura solo sobre bolo cobrado; el ${artistPct} % es del grupo.`,
        `· El cliente deja ${DEPOSITO_STRIPE_EUR} € de depósito deducible y la fecha se bloquea al instante.`,
        '',
        `Tu propuesta personalizada: ${url}`,
        '',
        'Si no te interesa, responde BAJA y no volveré a escribirte. Sin insistencia.',
    ].join('\n');
}

/**
 * Dígitos internacionales para `wa.me`: quita el prefijo `00`, y si el número
 * viene sin prefijo país (9 dígitos) asume España (+34). Sin esto, un teléfono
 * nacional generaría un enlace muerto.
 */
function waDigits(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('00')) {
        digits = digits.slice(2);
    }
    if (digits.length === 9) {
        digits = `34${digits}`;
    }
    return digits;
}

/**
 * Genera el enlace de WhatsApp SOLO si el teléfono del grupo es verificable
 * (≥ 9 dígitos y distinto de la centralita) y, además, enrutable: tras
 * normalizar el prefijo país deben quedar entre 10 y 15 dígitos (E.164). Un
 * `wa.me` con menos dígitos no abre ninguna conversación; emitirlo sería un
 * enlace muerto disfrazado de captación. Sin teléfono válido → `ok: false`.
 */
export function buildWhatsAppOutreachLink(
    target: OutreachTarget,
    landingBase: string = CENTRALITA_MARIACHIS_ENTITY.canonicalBase,
): OutreachLinkResult {
    if (!isNetworkProviderVerified(target.phone)) {
        return { ok: false, reason: 'phone-unverified' };
    }
    const phone = waDigits(target.phone);
    if (phone.length < 10 || phone.length > 15) {
        return { ok: false, reason: 'phone-unroutable' };
    }
    const invitationCode = buildInvitationCode(
        `${target.groupSeed}|${target.province}`,
    );
    const message = buildOutreachMessage(target, invitationCode, landingBase);
    return {
        ok: true,
        invitationCode,
        href: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    };
}

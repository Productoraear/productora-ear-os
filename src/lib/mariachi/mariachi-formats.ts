/**
 * ════════════════════════════════════════════════════════════════════════════
 * CATÁLOGO CANÓNICO DE FORMATOS MARIACHI · CAPA PURA (CLIENT-SAFE)
 * ════════════════════════════════════════════════════════════════════════════
 * Extraído de `mariachiDispatchCore.ts` para que cualquier capa —servidor,
 * componentes cliente, builds TSX y guardianes— pueda leer los formatos SIN
 * arrastrar dependencias de Node (`crypto`).
 *
 * Este módulo NO importa nada de Node: sólo constantes del SSOT. Es la única
 * fuente de verdad de los 4 escalones comerciales de la Centralita y por tanto
 * el origen legítimo de los precios que publican las 220 landings y el
 * configurador `/reservar/solista`.
 *
 * Regla inmutable: `solista` se deriva de la Tarifa Base Solista del SSOT y el
 * depósito de `DEPOSITO_STRIPE_EUR`. Prohibido duplicar esos valores.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  DEPOSITO_STRIPE_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '../constants/ear-os-ssot';

export type MariachiFormatId = 'solista' | 'cuarteto' | 'gala' | 'monumental';

export interface MariachiFormat {
  id: MariachiFormatId;
  name: string;
  members: number;
  basePrice: number; // En euros (sin IVA)
  description: string;
  recommendedFor: string;
  depositAmount: number; // Siempre 100 € (SSOT)
  repertoireCount: number;
}

export const MARIACHI_FORMATS: readonly MariachiFormat[] = Object.freeze([
  {
    id: 'solista',
    name: 'Solista Serenata Express',
    members: 1,
    basePrice: TARIFA_BASE_SOLISTA_EUR,
    description:
      'Voz tenor solista de gala (Edwin Agudelo o voz asignada) con vihuela/guitarra o pistas de estudio en alta fidelidad.',
    recommendedFor: 'Serenatas, aniversarios y domicilios (hasta 35 pax)',
    depositAmount: DEPOSITO_STRIPE_EUR,
    repertoireCount: 10,
  },
  {
    id: 'cuarteto',
    name: 'Cuarteto Clásico Ranchero',
    members: 4,
    basePrice: 600,
    description:
      'Trompeta solista, vihuela, guitarrón y violín. El equilibrio perfecto para cócteles y fiestas familiares.',
    recommendedFor: 'Cócteles de boda y cumpleaños (hasta 90 pax)',
    depositAmount: DEPOSITO_STRIPE_EUR,
    repertoireCount: 18,
  },
  {
    id: 'gala',
    name: 'Gala Imperial Edwin Agudelo',
    members: 6,
    basePrice: 900,
    description:
      '2 trompetas, 2 violines, vihuela y guitarrón. Traje de charro de gala, show interactivo y dirección de Edwin Agudelo.',
    recommendedFor: 'Bodas en finca, banquetes y convenciones (hasta 200 pax)',
    depositAmount: DEPOSITO_STRIPE_EUR,
    repertoireCount: 26,
  },
  {
    id: 'monumental',
    name: 'Mariachi Monumental S-Class',
    members: 8,
    basePrice: 1300,
    description:
      'Agrupación sinfónica completa: 3 violines, 2 trompetas, vihuela, guitarrón y guitarra española. Acústica 12 W/pax.',
    recommendedFor: 'Fiestas patronales B2G, grandes auditorios y eventos VIP',
    depositAmount: DEPOSITO_STRIPE_EUR,
    repertoireCount: 35,
  },
]);

/** Índice tipado por id: elimina búsquedas O(n) y garantiza exhaustividad. */
export const MARIACHI_FORMAT_BY_ID: Readonly<Record<MariachiFormatId, MariachiFormat>> =
  Object.freeze({
    solista: MARIACHI_FORMATS[0],
    cuarteto: MARIACHI_FORMATS[1],
    gala: MARIACHI_FORMATS[2],
    monumental: MARIACHI_FORMATS[3],
  });

/** Escalones comerciales publicados (350 / 600 / 900 / 1.300 €). */
export const MARIACHI_TIER_PRICES_EUR: readonly number[] = Object.freeze(
  MARIACHI_FORMATS.map((format) => format.basePrice),
);

/**
 * Resuelve un formato por id admitiendo entradas no confiables (`string` de
 * query string). Devuelve `null` en lugar de lanzar: el llamador degrada.
 */
export function getMariachiFormat(id: string | null | undefined): MariachiFormat | null {
  if (typeof id !== 'string') return null;
  const key = id.trim().toLowerCase();
  return key in MARIACHI_FORMAT_BY_ID
    ? MARIACHI_FORMAT_BY_ID[key as MariachiFormatId]
    : null;
}

/** Type-guard estricto: evita `as` en fronteras de datos externos. */
export function isMariachiFormatId(value: unknown): value is MariachiFormatId {
  return getMariachiFormat(typeof value === 'string' ? value : null) !== null;
}

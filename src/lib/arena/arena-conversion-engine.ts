/**
 * ARENA AI FOR EAR OS — ELO CONVERSION & COPY TOURNAMENT ENGINE
 * Inspirado en el sistema de clasificación Elo de arena.ai (LMSYS)
 * aplicado a la optimización de conversión, titulares y retención.
 */

export interface ArenaVariant {
  id: string;
  name: string;
  type: 'copy_hero' | 'image_hero' | 'cta_button' | 'price_lock_hook';
  content: string;
  eloRating: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  conversionRate: number;
}

const DEFAULT_K_FACTOR = 32;

/**
 * Cálculo estándar de Elo Rating de arena.ai
 */
export function calculateNewElo(
  ratingA: number,
  ratingB: number,
  outcome: 1 | 0.5 | 0 // 1: gana A, 0.5: empate, 0: gana B
): { newRatingA: number; newRatingB: number } {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));

  const newRatingA = Math.round(ratingA + DEFAULT_K_FACTOR * (outcome - expectedA));
  const newRatingB = Math.round(ratingB + DEFAULT_K_FACTOR * ((1 - outcome) - expectedB));

  return { newRatingA, newRatingB };
}

export const INITIAL_ARENA_LEADERBOARD: ArenaVariant[] = [
  {
    id: 'hero-var-1',
    name: 'Soberanía & Split 80/10/10',
    type: 'copy_hero',
    content: 'CONTRATA DIRECTO CON EL ARTISTA. 80% ARTISTA, CERO INTERMEDIARIOS, DEPÓSITO 100€.',
    eloRating: 1420,
    matchesPlayed: 45,
    wins: 34,
    losses: 11,
    conversionRate: 0.18
  },
  {
    id: 'hero-var-2',
    name: 'Rider Acústico Bose S-Class',
    type: 'copy_hero',
    content: 'INGENIERÍA ACÚSTICA DE ÉLITE (LEY 37/2003) & ARTISTAS VERIFICADOS.',
    eloRating: 1380,
    matchesPlayed: 38,
    wins: 26,
    losses: 12,
    conversionRate: 0.15
  },
  {
    id: 'hero-var-3',
    name: 'Fincas Homologadas & Auditoría',
    type: 'copy_hero',
    content: 'NO PERSEGUIMOS ESPACIOS. LOS AUDITAMOS Y REMUNERAMOS.',
    eloRating: 1350,
    matchesPlayed: 40,
    wins: 22,
    losses: 18,
    conversionRate: 0.12
  },
  {
    id: 'cta-var-1',
    name: 'CTA Price-Lock 100€',
    type: 'cta_button',
    content: 'BLOQUEAR FECHA CON DEPÓSITO 100€ (PRICE-LOCK SHA-256)',
    eloRating: 1460,
    matchesPlayed: 52,
    wins: 42,
    losses: 10,
    conversionRate: 0.22
  },
  {
    id: 'cta-var-2',
    name: 'CTA Cotizador Inmediato',
    type: 'cta_button',
    content: 'CALCULAR PRESUPUESTO & DISPONIBILIDAD INMEDIATA',
    eloRating: 1310,
    matchesPlayed: 48,
    wins: 19,
    losses: 29,
    conversionRate: 0.09
  }
];

export function getTopVariantByType(type: ArenaVariant['type']): ArenaVariant {
  const filtered = INITIAL_ARENA_LEADERBOARD.filter(v => v.type === type);
  filtered.sort((a, b) => b.eloRating - a.eloRating);
  return filtered[0] || INITIAL_ARENA_LEADERBOARD[0];
}

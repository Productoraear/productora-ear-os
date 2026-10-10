import { isVerified, transacciones_exitosas, clicks_en_landings } from './aura-wallet';

/**
 * Calcula el ranking de un artista basado en su estado de verificación,
 * transacciones exitosas y clics en landings.
 *
 * @param artistId - Identificador único del artista.
 * @returns Puntuación numérica del ranking del artista.
 */
export function rankArtist(artistId: string): number {
  const verificationStatus: boolean = isVerified(artistId);
  const successfulTransactions: number = transacciones_exitosas(artistId);
  const landingClicks: number = clicks_en_landings(artistId);

  let score: number = 0;

  if (verificationStatus) {
    score += 10;
  }

  score += successfulTransactions * 2;
  score += Math.log(landingClicks + 1);

  return score;
}
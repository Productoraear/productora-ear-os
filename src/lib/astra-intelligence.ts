import { isVerified, transacciones_exitosas, clicks_en_landings } from './aura-wallet';

export function rankArtist(artistId: string): number {
  const verificationStatus = isVerified(artistId);
  const successfulTransactions = transacciones_exitosas(artistId);
  const landingClicks = clicks_en_landings(artistId);

  let score = 0;
  if (verificationStatus) {
    score += 10; // High score for verified artists
  }
  score += successfulTransactions * 2; // Additional points for each successful transaction
  score += Math.log(landingClicks + 1); // Points for landing clicks, logarithmic scale

  return score;
}
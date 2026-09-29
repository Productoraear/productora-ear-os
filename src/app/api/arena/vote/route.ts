import { NextRequest, NextResponse } from 'next/server';
import { calculateNewElo, INITIAL_ARENA_LEADERBOARD } from '@/lib/arena/arena-conversion-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { variantAId, variantBId, winnerId } = body;

    const varA = INITIAL_ARENA_LEADERBOARD.find(v => v.id === variantAId);
    const varB = INITIAL_ARENA_LEADERBOARD.find(v => v.id === variantBId);

    if (!varA || !varB) {
      return NextResponse.json({ error: 'Variantes no encontradas' }, { status: 404 });
    }

    const outcome = winnerId === variantAId ? 1 : winnerId === variantBId ? 0 : 0.5;
    const { newRatingA, newRatingB } = calculateNewElo(varA.eloRating, varB.eloRating, outcome);

    varA.eloRating = newRatingA;
    varA.matchesPlayed += 1;
    if (outcome === 1) varA.wins += 1; else if (outcome === 0) varA.losses += 1;

    varB.eloRating = newRatingB;
    varB.matchesPlayed += 1;
    if (outcome === 0) varB.wins += 1; else if (outcome === 1) varB.losses += 1;

    return NextResponse.json({
      success: true,
      battleResult: {
        varA: { id: varA.id, name: varA.name, newElo: newRatingA },
        varB: { id: varB.id, name: varB.name, newElo: newRatingB }
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const sorted = [...INITIAL_ARENA_LEADERBOARD].sort((a, b) => b.eloRating - a.eloRating);
  return NextResponse.json({
    totalVariants: sorted.length,
    leaderboard: sorted
  });
}

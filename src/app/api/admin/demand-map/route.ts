import { NextResponse } from 'next/server';
import { rankArtist } from '@/lib/astra-intelligence';
import { requireAdmin } from '@/lib/security/adminGuard';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const demandMap = await rankArtist('some_artist_id'); // Example usage of rankArtist
    return NextResponse.json(demandMap);
  } catch (error) {
    console.error('Error fetching demand heatmap:', error);
    return NextResponse.json({ error: 'Failed to fetch demand map' }, { status: 500 });
  }
}
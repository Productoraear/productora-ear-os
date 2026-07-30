import { NextResponse } from 'next/server';
import { rankArtist } from '@/lib/astra-intelligence';

export async function GET() {
  try {
    const demandMap = await rankArtist('some_artist_id'); // Example usage of rankArtist
    return NextResponse.json(demandMap);
  } catch (error) {
    console.error('Error fetching demand heatmap:', error);
    return NextResponse.json({ error: 'Failed to fetch demand map' }, { status: 500 });
  }
}
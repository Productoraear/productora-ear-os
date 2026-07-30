import { NextResponse } from 'next/server';
import { cortex } from '@/lib/astra-intelligence';
export async function GET() {
    try {
        const demandMap = await cortex.getDemandHeatmap();
        return NextResponse.json(demandMap);
    }
    catch (error) {
        console.error('Error fetching demand heatmap:', error);
        return NextResponse.json({ error: 'Failed to fetch demand map' }, { status: 500 });
    }
}

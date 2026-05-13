import { NextResponse } from 'next/server';
import { LogisticsService } from '@/lib/services/LogisticsService';

export async function GET() {
  try {
    const events = await LogisticsService.getActiveEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('🛑 [API_LOGISTICS_EVENTS] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

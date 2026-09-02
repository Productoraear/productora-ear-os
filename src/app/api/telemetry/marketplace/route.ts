/**
 * 🛰️ PROXY: MARKETPLACE INGESTION - S-CLASS SIGNAL COLLECTOR
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ MISSING_SUPABASE_CONFIG: Ingestion disabled.");
    return NextResponse.json({ success: false, error: 'Internal config error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const event = await req.json();

    if (!event.type || !event.sessionId || !event.payload) {
      return NextResponse.json({ success: false, error: 'Malformed event payload' }, { status: 400 });
    }

    const { error } = await supabase
      .from('marketplace_events')
      .insert([{
        type: event.type,
        session_id: event.sessionId,
        timestamp: event.timestamp || new Date().toISOString(),
        path: event.payload.path || '',
        occasion: event.payload.occasion || null,
        province: event.payload.province || null,
        event_date: event.payload.date || null,
        service_id: event.payload.serviceId || null,
        card_position: event.payload.cardPosition || null,
        badge_id: event.payload.badgeId || null,
        query: event.payload.query || null,
        price_snapshot: event.payload.priceSnapshot || null,
        metadata: event.payload.metadata || {}
      }]);

    if (error) {
      console.error("❌ SUPABASE_INSERT_ERROR:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ INGESTION_FAILURE:", error.message || error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}

/**
 * 🛰️ PROXY: MARKETPLACE INGESTION - S-CLASS SIGNAL COLLECTOR
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const event = await req.json();

    const { error } = await supabase
      .from('marketplace_events')
      .insert([{
        type: event.type,
        session_id: event.sessionId,
        timestamp: event.timestamp,
        path: event.payload.path,
        occasion: event.payload.occasion,
        province: event.payload.province,
        event_date: event.payload.date,
        service_id: event.payload.serviceId,
        card_position: event.payload.cardPosition,
        badge_id: event.payload.badgeId,
        query: event.payload.query,
        price_snapshot: event.payload.priceSnapshot,
        metadata: event.payload.metadata || {}
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ INGESTION_FAILURE:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

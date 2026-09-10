import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { GALA_FORMATS } from '@/data/gala-formats';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formatId, distanceKm, eventDate } = body;

    const currentFormat = GALA_FORMATS.find(f => f.id === formatId) || GALA_FORMATS[0];
    
    const billableKm = Math.max(0, distanceKm - 50);
    const kmLogisticsCost = Math.round(billableKm * 1.50);
    const hotelSurcharge = (distanceKm > 200) ? 120 : 0; // Simplified for lock
    
    const totalBaseBeforeVat = currentFormat.basePrice + kmLogisticsCost + hotelSurcharge;

    const secret = process.env.STRIPE_SECRET_KEY || 'OMEGA-DIOS-FALLBACK-SECRET-2026';
    
    const rawData = `${formatId}-${distanceKm}-${totalBaseBeforeVat}-${eventDate}`;
    
    const hmac = crypto.createHmac('sha256', secret)
      .update(rawData)
      .digest('hex')
      .toUpperCase();

    const priceLockHash = `SHA256-Ω-${hmac.substring(0, 16)}`;

    return NextResponse.json({
      priceLockHash,
      calculatedBase: totalBaseBeforeVat,
      status: 'SECURE'
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'HASH_GENERATION_FAILED' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { calculateLeadScore, type LeadInput } from '@/lib/scoring/leadScoreEngine';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body: LeadInput = await req.json();

    if (!body.email && !body.phone) {
      return NextResponse.json(
        { error: 'Se requiere al menos un email o teléfono de contacto' },
        { status: 400 }
      );
    }

    const scoreResult = calculateLeadScore(body);

    // Registro de telemetría de lead
    const timestamp = new Date().toISOString();
    console.log(`🏛️ [LEAD B2G] Score: ${scoreResult.score} (${scoreResult.tier}) - Email: ${body.email || 'N/A'}`);

    return NextResponse.json({
      success: true,
      timestamp,
      lead: {
        name: body.name || 'Sin nombre',
        email: body.email,
        phone: body.phone,
        organization: body.organizationName || 'Particular',
        budgetEur: body.budgetEur || 0
      },
      analysis: scoreResult,
      centralitaContact: {
        phone: '+34 693 693 048',
        whatsapp: 'https://wa.me/34693693048',
        priceLockDeposit: '100 € Stripe'
      }
    });
  } catch (error: any) {
    console.error('❌ Error procesando lead B2G:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno evaluando el lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    engine: 'B2G Lead Score Engine S-Class',
    threshold: 'Art. 118 LCSP < 14.250 €',
    centralitaPhone: '+34 693 693 048'
  });
}

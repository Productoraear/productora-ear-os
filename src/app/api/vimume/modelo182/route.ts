import { NextResponse } from 'next/server';
import { generateModelo182Draft, MecenazgoCalculationInput } from '@/lib/vimume-mecenazgo-engine';

/**
 * 🏛️ ENDPOINT: GENERADOR OFICIAL MODELO 182 AEAT // VIMUME LEY 49/2002
 */
export async function POST(req: Request) {
  try {
    const body: MecenazgoCalculationInput = await req.json();

    if (!body.amount || isNaN(Number(body.amount)) || Number(body.amount) <= 0) {
      return NextResponse.json(
        { error: 'Importe de donación inválido. Se requiere un valor numérico superior a 0 €.' },
        { status: 400 }
      );
    }

    const draft = generateModelo182Draft({
      amount: Number(body.amount),
      donorType: body.donorType || 'persona_fisica',
      isRecurringThreeYears: Boolean(body.isRecurringThreeYears),
      donorName: body.donorName || 'Anónimo / Empresa Colaboradora',
      donorTaxId: body.donorTaxId || 'PENDIENTE_ASIGNACION'
    });

    return NextResponse.json({
      success: true,
      data: draft
    });
  } catch (err: any) {
    console.error('Error generating Modelo 182 draft:', err);
    return NextResponse.json(
      { error: 'Error interno generando el borrador del Modelo 182 AEAT.', details: err.message },
      { status: 500 }
    );
  }
}

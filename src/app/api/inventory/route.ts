import { NextResponse } from 'next/server';
import { InventoryEngine } from '@/lib/constants/inventory-catalog';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const m2Param = searchParams.get('m2');
  const paxParam = searchParams.get('pax');

  if (m2Param || paxParam) {
    const m2 = Math.max(10, parseInt(m2Param || '50', 10));
    const pax = Math.max(5, parseInt(paxParam || '50', 10));
    const recommendation = InventoryEngine.recommendGearForSpace(m2, pax);
    return NextResponse.json({
      recommendation,
      catalog: InventoryEngine.getCatalog()
    });
  }

  return NextResponse.json({
    catalog: InventoryEngine.getCatalog()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, units = 1, eventDate, customerEmail } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Falta itemId para reservar.' }, { status: 400 });
    }

    const result = InventoryEngine.reserveUnits(itemId, units);
    if (!result.success) {
      return NextResponse.json({ error: result.message, remainingStock: result.remainingStock }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      remainingStock: result.remainingStock,
      eventDate,
      customerEmail
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al procesar reserva de inventario.' }, { status: 500 });
  }
}

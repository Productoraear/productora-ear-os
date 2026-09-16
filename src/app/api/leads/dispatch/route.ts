import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { productionEventId } = await req.json();
    if (!productionEventId) {
      return NextResponse.json({ error: 'productionEventId requerido' }, { status: 400 });
    }

    const event = await prisma.productionEvent.findUnique({
      where: { id: productionEventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const message = encodeURIComponent(
      `🚨 [NUEVA RESERVA S-CLASS]\nEvento: ${event.title}\nPresupuesto: ${event.totalBudget} €\nCliente: ${event.clientName || 'N/A'} (${event.clientEmail || 'N/A'})\nFecha: ${event.eventDate}`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=34693693048&text=${message}`;

    return NextResponse.json({ success: true, dispatchUrl: waUrl, status: 'DISPATCHED' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno de despacho' }, { status: 500 });
  }
}

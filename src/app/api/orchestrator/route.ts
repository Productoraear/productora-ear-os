import { NextRequest, NextResponse } from 'next/server';
import { MultiServiceOrchestrator } from '@/lib/engines/multiServiceOrchestrator';
// next/server waitUntil (experimental in older Next.js, standard in Vercel)
// Si no está disponible en next/server, Next.js expone waitUntil en middleware/edge, 
// o en su defecto podemos simular el comportamiento devolviendo rápidamente y ejecutando la promesa.
import { waitUntil } from '@vercel/functions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validación de schema básica
    if (!body.services || !Array.isArray(body.services)) {
      return NextResponse.json({ error: 'Payload requires a services array' }, { status: 400 });
    }

    // BALA DE PLATA 2: Orquestador ACID Anti-Timeout
    // En lugar de esperar a que la BD termine todas las operaciones y cálculos, 
    // lo delegamos al background usando waitUntil() y devolvemos 202 Accepted.
    
    const orchestrationPromise = MultiServiceOrchestrator.orchestrateProduction({
      title: body.title || 'Evento de Producción EAR OS',
      eventDate: body.eventDate || new Date().toISOString(),
      clientEmail: body.clientEmail || 'cliente@productoraear.com',
      clientName: body.clientName || 'Cliente Vip',
      location: body.location || 'Madrid',
      services: body.services
    }).then(result => {
      console.log(`[ORCHESTRATOR ACID] Production created with ID: ${result.productionId}`);
      // Aquí se podría emitir un evento Realtime (Supabase) para notificar al dashboard del Wedding Planner
      // que la orquestación ha finalizado y ya pueden ver el Checkout Link.
    }).catch(error => {
      console.error(`[ORCHESTRATOR ACID] FAILED: ${error.message}`);
    });

    // Delegamos a Vercel Functions para que no mate el request
    waitUntil(orchestrationPromise);

    // Retornamos inmediatamente para no bloquear el frontend (evitar 504 Gateway Timeout)
    return NextResponse.json({ 
      status: 'PROCESSING',
      message: 'La orquestación de la producción ha comenzado en background. Los resultados estarán listos en breve.',
      requestedServices: body.services.length
    }, { status: 202 });

  } catch (error) {
    console.error('[API/orchestrator] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'Orchestrator API Ready', timestamp: new Date().toISOString() });
}

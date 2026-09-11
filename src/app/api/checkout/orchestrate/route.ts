import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { MultiServiceOrchestrator } from '@/lib/engines/multiServiceOrchestrator';
import { waitUntil } from '@vercel/functions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any,
});

const OrchestrateCheckoutSchema = z.object({
  title: z.string().min(3).default('Producción Nupcial Integral'),
  eventDate: z.string().default(() => new Date().toISOString()),
  clientEmail: z.string().email().default('produccion@ear.com'),
  clientName: z.string().min(2).default('Cliente VIP'),
  location: z.string().default('Madrid'),
  depositOnly: z.boolean().default(false),
  services: z.array(z.any()).min(1, 'Se requiere al menos un servicio')
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const parsed = OrchestrateCheckoutSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;

    const normalizedServices = data.services.map((s: any, idx: number) => {
      const cleanName = (s.name || `Servicio ${idx + 1}`)
        .replace(/\.[a-zA-Z0-9]+$/, '')
        .replace(/\[.*?\]/g, '')
        .replace(/_/g, ' ')
        .trim();

      return {
        category: s.category || 'PRODUCTION_SERVICE',
        basePrice: Number(s.basePrice || s.unitPrice || 350),
        name: cleanName,
        requirements: Array.isArray(s.requirements) ? s.requirements : ['Rider Estándar homologado (12 W/pax)'],
        providerId: s.providerId || undefined
      };
    });

    const orchestrationResult = await MultiServiceOrchestrator.orchestrateProduction({
      title: data.title,
      eventDate: data.eventDate,
      clientEmail: data.clientEmail,
      clientName: data.clientName,
      location: data.location,
      services: normalizedServices
    });

    const amountInCents = data.depositOnly ? 10000 : Math.round(orchestrationResult.totalBudget * 100);
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: data.clientEmail,
      success_url: `${origin}/boda/reserva-confirmada?session_id={CHECKOUT_SESSION_ID}&production_id=${orchestrationResult.productionId}`,
      cancel_url: `${origin}/boda/revisar-presupuesto?production_id=${orchestrationResult.productionId}&status=recovered`,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: data.depositOnly ? `Reserva de Fecha: ${data.title}` : `Producción Técnica y Artística: ${data.title}`,
            description: `Gestión integral de ${orchestrationResult.servicesCount} partidas garantizadas.`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      }],
      metadata: {
        productionEventId: orchestrationResult.productionId,
        isDeposit: data.depositOnly ? 'true' : 'false'
      }
    });

    waitUntil(
      prisma.productionEvent.update({
        where: { id: orchestrationResult.productionId },
        data: {
          status: 'CHECKOUT_SESSION_CREATED',
          metadata: {
            checkoutSessionId: session.id,
            checkoutUrl: session.url,
            isDeposit: data.depositOnly,
            servicesCount: orchestrationResult.servicesCount,
            orchestrationLatencyMs: Date.now() - startTime
          }
        }
      }).catch(err => console.error('[API/orchestrate] Error Background:', err))
    );

    return NextResponse.json({
      success: true,
      productionId: orchestrationResult.productionId,
      checkoutUrl: session.url,
      totalBudget: orchestrationResult.totalBudget,
      executionTimeMs: Date.now() - startTime
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}

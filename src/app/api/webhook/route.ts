import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { waitUntil } from '@vercel/functions';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-01-27.acacia' as any, 
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const getAdminSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
};

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const productionEventId = session.metadata?.productionEventId;

    if (productionEventId) {
      const backgroundTask = (async () => {
        try {
          const prodEvent = await prisma.productionEvent.findUnique({ where: { id: productionEventId } });
          if (!prodEvent) return;

          const services = typeof prodEvent.serviceLines === 'string' 
            ? JSON.parse(prodEvent.serviceLines) 
            : (prodEvent.serviceLines as any[] || []);

          // Concurrencia O(1) con Promise.allSettled
          const transfers = services.filter((s: any) => s.providerId).map(async (service: any) => {
            const provider = await prisma.providerProfile.findUnique({ where: { id: service.providerId } });
            if (provider?.stripeAccountId) {
              const amountCents = Math.round((service.providerSplit || (service.unitPrice || 0) * 0.8) * 100);
              return stripe.transfers.create({
                amount: amountCents,
                currency: 'eur',
                destination: provider.stripeAccountId,
                transfer_group: productionEventId,
                metadata: { serviceId: service.id }
              });
            }
          });

          await Promise.allSettled(transfers);

          await prisma.productionEvent.update({
            where: { id: productionEventId },
            data: { 
              status: 'PAID_CONFIRMED',
              metadata: {
                ...(typeof prodEvent.metadata === 'object' && prodEvent.metadata ? prodEvent.metadata : {}),
                paidAt: new Date().toISOString(),
                stripeSessionId: session.id
              }
            }
          });

          const supabase = getAdminSupabase();
          await supabase.from('fleet_telemetry_events').insert({
            unit_id: productionEventId,
            event_data: {
              event: 'PRODUCTION_PAID_CONFIRMED',
              productionId: productionEventId,
              totalBudget: prodEvent.totalBudget,
              timestamp: new Date().toISOString()
            }
          });
        } catch (e) {
          console.error('[Webhook Background Error]', e);
        }
      })();

      waitUntil(backgroundTask);
    }
  }

  return NextResponse.json({ received: true });
}

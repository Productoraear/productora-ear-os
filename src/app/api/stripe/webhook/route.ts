import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { LEDGER_SSOT } from '@/lib/vendor/ledgerEngine';
import { generateModelo182Draft } from '@/lib/vimume-mecenazgo-engine';
import { waitUntil } from '@vercel/functions';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build',
  {
    apiVersion: '2023-10-16' as any,
  }
);

const getAdminSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!webhookSecret && process.env.NODE_ENV === 'production') {
    console.error('❌ [SECURITY_VIOLATION] STRIPE_WEBHOOK_SECRET no configurado en producción.');
    return NextResponse.json({ error: 'CONFIGURACION_SEGURIDAD_INVALIDA' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload';
    console.error('⚠️ [SECURITY_ALERT] Webhook Signature Verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const clientEmail = session.customer_details?.email || session.customer_email || 'unknown';
      const amountCents = session.amount_total ?? 1000;
      const amountTotal = amountCents / 100;
      const metadata = session.metadata ?? {};

      console.log(`✅ [STRIPE WEBHOOK] checkout.session.completed | id=${session.id} | amount=${amountTotal}€`);

      const tasks: Promise<any>[] = [];

      // 1. FLUJO SMARTLOCK (Price-Lock 72h)
      if (metadata.intentSlug || metadata.vertical) {
        const lockedAt = new Date();
        const expiresAt = new Date(lockedAt.getTime() + 72 * 60 * 60 * 1000);
        tasks.push(
          prisma.smartLock.upsert({
            where: { stripeSessionId: session.id },
            update: { status: 'ACTIVE_LOCKED', amountCents, lockedAt, expiresAt },
            create: {
              email: clientEmail,
              vertical: metadata.vertical ?? 'bodas',
              intentSlug: metadata.intentSlug ?? 'checkout-general',
              stripeSessionId: session.id,
              amountCents,
              status: 'ACTIVE_LOCKED',
              lockedAt,
              expiresAt,
            },
          }).catch(err => console.warn('[STRIPE WEBHOOK] SmartLock persist skipped:', err.message))
        );
      }

      // 2. FLUJO DE COMISIONES Y SPLIT 80/10/10 (Commission Ledger)
      if (metadata.quoteHash || amountTotal === LEDGER_SSOT.DEPOSIT_STRIPE_EUR) {
        const quoteHash = metadata.quoteHash || 'DIRECT_DEPOSIT';
        const providerAmount = Number((amountTotal * LEDGER_SSOT.SPLIT_ARTIST_PCT).toFixed(2));
        const platformFee = Number((amountTotal * LEDGER_SSOT.SPLIT_EAR_PCT).toFixed(2));
        const reserveFund = Number((amountTotal * LEDGER_SSOT.SPLIT_VIMUME_PCT).toFixed(2));
        
        let vimumeCertificate = null;
        if (metadata.affiliateCode) {
          vimumeCertificate = generateModelo182Draft({
            amount: reserveFund,
            donorType: 'persona_juridica',
            donorName: `Finca Afiliada / Prescriptor: ${metadata.affiliateCode}`,
            isRecurringThreeYears: true,
          });
          console.log(`🏛️ [VIMUME SSOT] Certificado Modelo 182 emitido para ${metadata.affiliateCode} (Hash: ${vimumeCertificate.firmaCriptograficaSha256})`);
        }

        if (process.env.POSTGRES_PRISMA_URL) {
          tasks.push(
            prisma.commissionLedger.create({
              data: {
                amount: amountTotal,
                currency: session.currency?.toUpperCase() || 'EUR',
                status: 'PAID',
                reference: session.id,
                sourceEvent: `STRIPE_CHECKOUT_PRICE_LOCK_${quoteHash}`,
                description: `Depósito de Reserva EAR OS (Price-Lock) - Quote ${quoteHash}`,
                notes: JSON.stringify({
                  split: { provider80: providerAmount, earOsFee10: platformFee, reserveFund10: reserveFund },
                  metadata,
                  customerEmail: clientEmail,
                  vimumeCertificate
                })
              }
            }).then(() => console.log(`📜 [LEDGER COMMITTED] Entrada 80/10/10 registrada para ${session.id}`))
            .catch(err => console.warn('⚠️ [LEDGER DB NOTICE] Registro en fallback resiliente:', err.message))
          );
        }
      }

      // 3. FLUJO DE PAGOS B2B/B2G Y PAYOUTS (Transfers)
      if (metadata.productionEventId) {
        const prodEventId = metadata.productionEventId;
        const payoutTask = async () => {
          try {
            const prodEvent = await prisma.productionEvent.findUnique({ where: { id: prodEventId } });
            if (!prodEvent) return;

            const services = typeof prodEvent.serviceLines === 'string' 
              ? JSON.parse(prodEvent.serviceLines) 
              : (prodEvent.serviceLines as any[] || []);

            const transfers = services.filter((s: any) => s.providerId).map(async (service: any) => {
              const provider = await prisma.providerProfile.findUnique({ where: { id: service.providerId } });
              if (provider?.stripeAccountId) {
                const payoutCents = Math.round((service.providerSplit || (service.unitPrice || 0) * LEDGER_SSOT.SPLIT_ARTIST_PCT) * 100);
                return stripe.transfers.create({
                  amount: payoutCents,
                  currency: 'eur',
                  destination: provider.stripeAccountId,
                  transfer_group: prodEventId,
                  metadata: { serviceId: service.id }
                });
              }
            });

            await Promise.allSettled(transfers);

            await prisma.productionEvent.update({
              where: { id: prodEventId },
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
              unit_id: prodEventId,
              event_data: { event: 'PRODUCTION_PAID_CONFIRMED', productionId: prodEventId, timestamp: new Date().toISOString() }
            });
          } catch (e) {
            console.error('[Webhook Payout Error]', e);
          }
        };
        tasks.push(payoutTask());
      }

      waitUntil(Promise.allSettled(tasks));
      return NextResponse.json({ received: true });
    }

    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(`[STRIPE WEBHOOK] payment_intent.succeeded | id=${pi.id} | amount=${pi.amount}`);
      return NextResponse.json({ received: true });
    }

    default:
      return NextResponse.json({ received: true, ignored: event.type });
  }
}
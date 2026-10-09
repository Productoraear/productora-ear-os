import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { lockDateAtomically } from '@/lib/availability/atomicDateLockEngine';
import { LEDGER_SSOT } from '@/lib/vendor/ledgerEngine';
import { generateModelo182Draft } from '@/lib/vimume-mecenazgo-engine';
import { waitUntil } from '@vercel/functions';
import { createClient } from '@supabase/supabase-js';
import { getStripe } from '@/lib/payments';

/** Línea de servicio deserializada desde `ProductionEvent.serviceLines` (Json). */
interface ServiceLine {
  id?: string;
  providerId?: string;
  unitPrice?: number;
  providerSplit?: number;
}

// 🔒 FAIL-CLOSED STRIPE (BLINDAJE SESSION_SECRET P0) — PEREZOSO.
// El módulo se importa SIEMPRE con éxito; la verificación fail-closed ocurre
// dentro de POST al resolver la instancia (sin clave legítima => 503).

const getAdminSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('[STRIPE_WEBHOOK] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configurados para telemetría admin.');
  }
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeClient: Stripe;
  try {
    stripeClient = getStripe();
  } catch {
    // Sin clave legítima no se procesa nada (fail-closed en uso).
    return NextResponse.json({ error: 'pagos_no_configurados' }, { status: 503 });
  }

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

    // 🔒 BLINDAJE P0-1: la firma es OBLIGATORIA en TODOS los entornos.
    // Sin secret de firma NO se procesa ningún evento bajo ninguna circunstancia.
    if (!webhookSecret) {
      console.error('❌ [SECURITY_VIOLATION] STRIPE_WEBHOOK_SECRET no configurado. Evento rechazado.');
      return NextResponse.json({ error: 'CONFIGURACION_SEGURIDAD_INVALIDA' }, { status: 500 });
    }

    event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
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

      const tasks: Array<Promise<unknown>> = [];

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
      // P0: el split se calcula sobre el TOTAL del show (350 € => 280/35/35),
      // NO sobre el depósito de 100 €. El depósito es solo la tranche de cierre.
      if (metadata.quoteHash || amountTotal === LEDGER_SSOT.DEPOSIT_STRIPE_EUR) {
        const quoteHash = metadata.quoteHash || 'DIRECT_DEPOSIT';
        const parsedTotalShow = metadata.totalEstimado ? Number(metadata.totalEstimado) : 0;
        const splitBase = Number.isFinite(parsedTotalShow) && parsedTotalShow > 0 ? parsedTotalShow : amountTotal;
        const providerAmount = Number((splitBase * LEDGER_SSOT.SPLIT_ARTIST_PCT).toFixed(2));
        const platformFee = Number((splitBase * LEDGER_SSOT.SPLIT_EAR_PCT).toFixed(2));
        const reserveFund = Number((splitBase * LEDGER_SSOT.SPLIT_VIMUME_PCT).toFixed(2));

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
            prisma.commissionLedger.upsert({
              where: { reference: session.id },
              update: {
                status: 'PAID',
                amount: splitBase,
                notes: JSON.stringify({
                  split: { provider80: providerAmount, earOsFee10: platformFee, reserveFund10: reserveFund },
                  depositCollected: amountTotal,
                  metadata,
                  customerEmail: clientEmail,
                  vimumeCertificate
                })
              },
              create: {
                amount: splitBase,
                currency: session.currency?.toUpperCase() || 'EUR',
                status: 'PAID',
                reference: session.id,
                sourceEvent: `STRIPE_CHECKOUT_PRICE_LOCK_${quoteHash}`,
                description: `Depósito de Reserva EAR OS (Price-Lock) - Quote ${quoteHash}`,
                notes: JSON.stringify({
                  split: { provider80: providerAmount, earOsFee10: platformFee, reserveFund10: reserveFund },
                  depositCollected: amountTotal,
                  metadata,
                  customerEmail: clientEmail,
                  vimumeCertificate
                })
              }
            }).then(() => console.log(`📜 [LEDGER COMMITTED] Entrada 80/10/10 idempotente para ${session.id}`))
              .catch(err => console.warn('⚠️ [LEDGER DB NOTICE] Registro en fallback resiliente:', err.message))
          );
        }
      }

      // 2bis. FLUJO DEPOSITO SOLISTA S-CLASS: materializar el bloqueo ACID de fecha
      if (metadata.tipo === 'DEPOSITO_SOLISTA_S_CLASS' && metadata.fecha) {
        tasks.push(
          lockDateAtomically({
            eventDate: metadata.fecha,
            clientName: clientEmail,
            location: metadata.formato || 'Reserva Solista S-Class',
            stripeSessionId: session.id,
          })
            .then((lockResult) => {
              if (lockResult.success) {
                console.log(`🔒 [ATOMIC DATE LOCK] Fecha ${metadata.fecha} bloqueada (productionId=${lockResult.productionId})`);
              } else {
                console.warn(`⚠️ [ATOMIC DATE LOCK] No se pudo bloquear ${metadata.fecha}: ${lockResult.reason}`);
              }
            })
            .catch((err: unknown) =>
              console.warn('[ATOMIC DATE LOCK] Fallo resiliente:', err instanceof Error ? err.message : String(err))
            )
        );
      }

      // 3. FLUJO DE PAGOS B2B/B2G Y PAYOUTS (Transfers)
      if (metadata.productionEventId) {
        const prodEventId = metadata.productionEventId;
        const payoutTask = async () => {
          try {
            const prodEvent = await prisma.productionEvent.findUnique({ where: { id: prodEventId } });
            if (!prodEvent) return;

            const services: ServiceLine[] = typeof prodEvent.serviceLines === 'string'
              ? (JSON.parse(prodEvent.serviceLines) as ServiceLine[])
              : (prodEvent.serviceLines as unknown as ServiceLine[]);

            const transfers = services
              .filter((service: ServiceLine) => Boolean(service.providerId))
              .map(async (service: ServiceLine) => {
                const provider = await prisma.providerProfile.findUnique({
                  where: { id: service.providerId as string },
                });
                if (provider?.stripeAccountId) {
                  const payoutCents = Math.round(
                    (service.providerSplit ?? (service.unitPrice ?? 0) * LEDGER_SSOT.SPLIT_ARTIST_PCT) * 100
                  );
                  return stripeClient.transfers.create({
                    amount: payoutCents,
                    currency: 'eur',
                    destination: provider.stripeAccountId,
                    transfer_group: prodEventId,
                    metadata: { serviceId: service.id ?? 'service' },
                  });
                }
                return undefined;
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
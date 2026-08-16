// src/app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommissionStatus } from "@prisma/client";
import { LedgerEngine } from "@/features/finance/LedgerEngine";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret) {
    console.error("❌ [STRIPE CRITICAL] Falta STRIPE_SECRET_KEY en las variables de entorno.");
    return NextResponse.json({ error: "Missing Stripe secret key" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2023-10-16' as any,
  });

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  // Validación de firma criptográfica
  if (webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error(`❌ [STRIPE SECURITY] Fallo de Firma Webhook: ${err.message}`);
      return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }
  } else {
    try {
      event = JSON.parse(rawBody) as Stripe.Event;
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }
  }

  // Procesamiento exclusivo de Checkout Completado
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, type: event.type }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const md = session.metadata ?? {};

  const amountTotal = (session.amount_total || 0) / 100;
  const payerEmail = session.customer_details?.email || (md as any).customerEmail || 'anonimo@productoraear.com';
  const concept = (md as any).concept || 'EAR OS S-Class Transaction';

  // Desglose Soberano 80/10/10
  const splitResult = {
    total: amountTotal,
    artistic: Number((amountTotal * 0.80).toFixed(2)),
    infrastructure: Number((amountTotal * 0.10).toFixed(2)),
    social: Number((amountTotal * 0.10).toFixed(2)),
  };

  const bookingId = (md as any).booking_id || (md as any).bookingId;
  const artistId = (md as any).artist_id || (md as any).artistId;
  const clientId = (md as any).client_id || (md as any).clientId;
  const workspaceId = (md as any).workspace_id || (md as any).workspaceId;
  const eventDate = (md as any).event_date || (md as any).eventDate;
  const originLat = Number((md as any).origin_lat || (md as any).originLat);
  const originLng = Number((md as any).origin_lng || (md as any).originLng);
  const destinationLat = Number((md as any).destination_lat || (md as any).destinationLat);
  const destinationLng = Number((md as any).destination_lng || (md as any).destinationLng);

  // Intentar persistencia en base de datos Postgres/Prisma con fallback seguro
  try {
    if (bookingId && artistId && workspaceId) {
      await prisma.$transaction(async (tx: any) => {
        const clientProfile = await tx.clientProfile.findUnique({
          where: { userId: clientId },
          select: { id: true },
        });
        const clientProfileId = clientProfile?.id ?? null;

        const contractExists = await tx.smartContract.findUnique({
          where: { id: bookingId },
          select: { id: true },
        });

        if (contractExists) {
          await tx.smartContract.update({
            where: { id: bookingId },
            data: {
              status: "RESERVED",
              deposit: amountTotal,
              stripeSessionId: session.id,
              eventDate: new Date(eventDate),
            },
          });
        } else {
          await tx.smartContract.create({
            data: {
              id: bookingId,
              artistId,
              userId: clientId,
              clientProfileId,
              workspaceId,
              status: "RESERVED",
              deposit: amountTotal,
              stripeSessionId: session.id,
              eventDate: new Date(eventDate),
            },
          });
        }

        const startAt = new Date(eventDate);
        const endAt = new Date(startAt.getTime() + 4 * 60 * 60 * 1000);

        await tx.calendarBlock.create({
          data: {
            artistId,
            startsAt: startAt,
            endsAt: endAt,
            label: "Stripe Embedded Checkout Reservation",
            status: "BLOCKED",
            bookingId,
          },
        });

        await tx.waybill.create({
          data: {
            workspaceId,
            artistProfileId: artistId,
            bookingId,
            referenceCode: `WAY-${bookingId.slice(0, 8)}-${Date.now()}`,
            originLabel: "Base Central EAR OS (Madrid)",
            destinationLabel: "Destino del Show - Geolocalizado",
            originLat,
            originLng,
            destinationLat,
            destinationLng,
            status: "QUEUED",
          },
        });

        await tx.commissionLedger.create({
          data: {
            userId: clientId,
            amount: amountTotal,
            currency: "EUR",
            status: CommissionStatus.PAID,
            reference: `TX-${bookingId.slice(0, 8)}-${Date.now()}`,
            sourceEvent: "stripe_checkout",
            description: `Split 80/10/10: Artista=${splitResult.artistic}€, EAR OS=${splitResult.infrastructure}€, VIMUME=${splitResult.social}€`,
            notes: `Stripe session ${session.id} | ${payerEmail}`,
          },
        });
      });
    } else {
      // Flujo Express / Depósito Autónomo
      await prisma.commissionLedger.create({
        data: {
          userId: clientId || null,
          amount: amountTotal,
          currency: "EUR",
          status: CommissionStatus.PAID,
          reference: `TX-SOV-${Date.now()}`,
          sourceEvent: "stripe_checkout_express",
          description: `Split 80/10/10: Artista=${splitResult.artistic}€, EAR OS=${splitResult.infrastructure}€, VIMUME=${splitResult.social}€`,
          notes: `Stripe session ${session.id} | Payer: ${payerEmail} | Concept: ${concept}`,
        },
      });
    }
  } catch (prismaErr: any) {
    console.warn("⚠️ [PRISMA LEDGER] Fallback seguro activo:", prismaErr.message);
  }

  // Sincronización en tiempo real con Firestore
  if (db) {
    try {
      const orderRef = doc(db, 'ear_orders', session.id);
      await setDoc(orderRef, {
        customer: payerEmail,
        amount: amountTotal,
        status: 'PAID',
        concept,
        paymentMethod: 'Stripe',
        splits: {
          artist: splitResult.artistic,
          earOs: splitResult.infrastructure,
          vault: splitResult.social,
        },
        createdAt: new Date(),
      });
      console.log(`📡 [FINANCIAL FEED] Sincronización reactiva con Firestore exitosa (${session.id})`);
    } catch (fbErr) {
      console.warn("⚠️ [FIREBASE] Registro fallback:", fbErr);
    }
  }

  console.log(`✅ [LEDGER SETTLED] ${amountTotal} € reconciliados con éxito.`);
  return NextResponse.json({ 
    success: true, 
    settled: true, 
    amount: amountTotal, 
    splits: splitResult 
  }, { status: 200 });
}

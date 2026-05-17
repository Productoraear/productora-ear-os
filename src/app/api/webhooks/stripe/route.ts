import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommissionStatus } from "@prisma/client";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder"
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const md = session.metadata ?? {};

  const bookingId = md.bookingId;
  const artistId = md.artistId;
  const userId = md.userId;
  const workspaceId = md.workspaceId;
  const date = md.date;

  if (!bookingId || !artistId || !userId || !workspaceId || !date) {
    return NextResponse.json({ error: "Missing metadata in Stripe callback" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update Smart Contract to reserved status
      // We check if smartContract exists with the given bookingId (UUID)
      const existingContract = await tx.smartContract.findUnique({
        where: { id: bookingId }
      });

      if (existingContract) {
        await tx.smartContract.update({
          where: { id: bookingId },
          data: {
            status: "RESERVED",
            signedAt: new Date(),
          },
        });
      }

      // 2. Create Calendar Block
      const eventStart = new Date(date);
      const eventEnd = new Date(eventStart.getTime() + 4 * 60 * 60 * 1000); // 4 hours show duration block
      
      await tx.calendarBlock.create({
        data: {
          artistId, // Must match valid artist profile UUID
          startsAt: eventStart,
          endsAt: eventEnd,
          label: `Bloqueo de Calendario - Reserva Stripe`,
          status: "BLOCKED",
        },
      });

      // 3. Create Logistics Dispatch order (Waybill)
      await tx.waybill.create({
        data: {
          workspaceId,
          artistProfileId: artistId,
          referenceCode: `WAY-${bookingId.slice(0, 8)}-${Date.now()}`,
          originLabel: "Base Central EAR OS",
          destinationLabel: "Destino del Show - España Vaciada",
          originLat: 40.416775,
          originLng: -3.703790,
          destinationLat: 40.416775,
          destinationLng: -3.703790,
          status: "QUEUED",
        },
      });

      // 4. Create Ledger Accounting
      await tx.commissionLedger.create({
        data: {
          userId,
          workspaceId,
          amount: Number(md.total ?? "100.00"),
          currency: "EUR",
          status: CommissionStatus.PAID,
          reference: `TX-${bookingId.slice(0, 8)}-${Date.now()}`,
          sourceEvent: "stripe_embedded_checkout",
          notes: `Depósito garantizado vía Stripe Webhook: Session: ${session.id}`,
        },
      });
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Transaction processing failure";
    console.error("WEBHOOK TRANSACTION ERROR:", error);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

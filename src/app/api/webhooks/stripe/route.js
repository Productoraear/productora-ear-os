// src/app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommissionStatus } from "@prisma/client";
export const runtime = "nodejs";
export async function POST(req) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeSecret || !webhookSecret) {
        console.error("Missing Stripe environment configuration variables at runtime.");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }
    const stripe = new Stripe(stripeSecret, {
        apiVersion: '2026-04-22.dahlia',
    });
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }
    const rawBody = await req.text();
    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Invalid webhook signature";
        return NextResponse.json({ error: message }, { status: 400 });
    }
    if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true }, { status: 200 });
    }
    const session = event.data.object;
    const md = session.metadata ?? {};
    const artistId = md.artistId;
    const clientId = md.clientId;
    const eventDate = md.eventDate;
    const originLat = Number(md.originLat);
    const originLng = Number(md.originLng);
    const destinationLat = Number(md.destinationLat);
    const destinationLng = Number(md.destinationLng);
    const totalAmountCalculated = Number(md.totalAmountCalculated ?? "0");
    const depositAmount = Number(md.depositAmount ?? "100");
    const bookingId = md.bookingId;
    const workspaceId = md.workspaceId;
    if (!artistId ||
        !clientId ||
        !eventDate ||
        !bookingId ||
        !workspaceId ||
        Number.isNaN(originLat) ||
        Number.isNaN(originLng) ||
        Number.isNaN(destinationLat) ||
        Number.isNaN(destinationLng)) {
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }
    try {
        await prisma.$transaction(async (tx) => {
            // Find client profile relation if exists
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
                        deposit: depositAmount,
                        stripeSessionId: session.id,
                        eventDate: new Date(eventDate),
                    },
                });
            }
            else {
                await tx.smartContract.create({
                    data: {
                        id: bookingId,
                        artistId,
                        userId: clientId,
                        clientProfileId,
                        workspaceId,
                        status: "RESERVED",
                        deposit: depositAmount,
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
                    workspaceId,
                    amount: totalAmountCalculated,
                    currency: "EUR",
                    status: CommissionStatus.PAID,
                    reference: `TX-${bookingId.slice(0, 8)}-${Date.now()}`,
                    sourceEvent: "stripe_embedded_checkout",
                    stripeSessionId: session.id,
                    notes: `Stripe webhook session ${session.id}`,
                },
            });
        });
        return NextResponse.json({ received: true }, { status: 200 });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Transaction processing failure";
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

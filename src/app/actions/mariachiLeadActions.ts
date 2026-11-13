import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SecureMariachiBookingInput {
  userId: string;
  userEmail: string;
  clientName: string;
  clientPhone: string; // Formato E.164 obligatorio (+34...)
  eventAddress: {
    street: string;
    number: string;
    postalCode: string;
    city: string;
    notes?: string;
  };
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm flexible
  durationHours: number; // Duración flexible (1, 1.5, 2, 3...)
  format: string; // Solista, Trío, Cuarteto...
  agrupacionId?: string;
  acceptsAntiFraudPolicy: boolean; // Blindaje antipicaresca
}

export async function createSecureMariachiBooking(input: SecureMariachiBookingInput) {
  // 1. CANDADO AUTH: Prohibido contratar sin sesión verificada
  if (!input.userId || !input.userEmail) {
    throw new Error("AUTH_REQUIRED: Debe iniciar sesión con su cuenta para formalizar una reserva blindada.");
  }

  // 2. CANDADO TELÉFONO E.164 (WhatsApp activo)
  const phoneClean = input.clientPhone.replace(/\s+/g, "");
  const phoneRegex = /^\+\d{8,14}$/;
  if (!phoneRegex.test(phoneClean)) {
    throw new Error("INVALID_PHONE: Es obligatorio un número de WhatsApp internacional válido (+34...) para la coordinación y telemetría.");
  }

  // 3. CANDADO DIRECCIÓN EXACTA
  const addr = input.eventAddress;
  if (!addr.street || !addr.city || !addr.postalCode) {
    throw new Error("INVALID_ADDRESS: La dirección del evento debe incluir calle, código postal y localidad.");
  }

  // 4. CANDADO ANTIPICARESCA (Tolerancia cero: expulsión de plataforma)
  if (!input.acceptsAntiFraudPolicy) {
    throw new Error("ANTIFRAUD_REJECTED: Debe aceptar los términos: cualquier cobro o sobreprecio en metálico no registrado en la plataforma conlleva la expulsión fulminante de cliente y mariachi.");
  }

  // 5. CÁLCULO DE HASH Y PERSISTENCIA DETERMINISTA
  const leadHash = `MAR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Registro en base de datos PostgreSQL
  const lead = await (db as any).mariachiLead.create({
    data: {
      leadHash,
      phone: phoneClean,
      municipality: addr.city,
      format: input.format,
      eventDate: input.eventDate,
      eventTime: input.startTime,
      channel: "WEB_AUTH_DISPATCH",
      isEdwinSoloist: input.format.toLowerCase().includes("solista"),
      hasClosedPrice: true,
      totalCents: 55000,
      depositCents: 27500,
      splitArtistCents: 44000, // Split 80%
      splitEarOsCents: 5500,   // Split 10%
      splitVimumeCents: 5500,  // Split 10%
      alertDispatched: false,
    },
  });

  return {
    success: true,
    bookingId: lead.id,
    leadHash: lead.leadHash,
    trackingUrl: `/seguimiento/${lead.leadHash}`,
    message: "Reserva verificada. Proceda al depósito de fianza para activar la sala de control y radar en tiempo real."
  };
}


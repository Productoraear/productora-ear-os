"use server";

import { stripe } from "@/lib/payments";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. ESQUEMAS ZOD DE VALIDACIÓN ESTRICTA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VipChauffeurCheckoutSchema = z.object({
  vehicleId: z.enum(['clase-s', 'clase-v', 'clase-e', 'maybach-suv']),
  vehicleName: z.string().min(1),
  serviceType: z.enum(['transfer_barajas', 'disposicion_4h', 'disposicion_8h', 'boda_gala', 'interurbano']),
  location: z.string().default('Madrid'),
  eventDate: z.string().optional(),
  priceLockMode: z.enum(['LOCK_10EUR', 'DEPOSIT_30_PERCENT', 'FULL_PAYMENT']).default('LOCK_10EUR'),
  calculatedTotal: z.number().min(10)
});

const B2GLightingCheckoutSchema = z.object({
  sku: z.string().min(1),
  productName: z.string().min(1),
  category: z.string().min(1),
  cataloguePage: z.number().optional().default(1),
  priceNumeric: z.number().nullable().optional(),
  municipality: z.string().optional().default('Sede Municipal / Corporativa'),
  priceLockMode: z.enum(['SMART_LOCK_10EUR', 'DEPOSIT_RESERVATION']).default('SMART_LOCK_10EUR')
});

const SupplierUnlockCheckoutSchema = z.object({
  supplierId: z.string().min(1),
  supplierName: z.string().min(1),
  category: z.string().default('Servicio S-Class'),
  city: z.string().default('España'),
  slug: z.string().optional()
});

export type VipChauffeurCheckoutInput = z.infer<typeof VipChauffeurCheckoutSchema>;
export type B2GLightingCheckoutInput = z.infer<typeof B2GLightingCheckoutSchema>;
export type SupplierUnlockCheckoutInput = z.infer<typeof SupplierUnlockCheckoutSchema>;

/**
 * 🚘 STRIPE CHECKOUT: FLOTA VIP & CHÓFER S-CLASS
 * Genera la sesión segura de pago para depósito de bloqueo (10 € / 72h) o reserva de flota.
 */
export async function createVipChauffeurCheckout(input: VipChauffeurCheckoutInput) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 10, 60000)) {
    logger.warn({ event: "VIP_CHECKOUT_RATE_LIMIT", ip });
    throw new Error("Límite de solicitudes de checkout alcanzado. Por favor, inténtelo de nuevo en un minuto.");
  }

  const parsed = VipChauffeurCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Datos de reserva inválidos: ${parsed.error.issues.map(e => e.message).join(", ")}`);
  }

  const { vehicleId, vehicleName, serviceType, location, eventDate, priceLockMode, calculatedTotal } = parsed.data;

  let chargeAmount = 10; // Default 10 € Price-Lock
  let conceptTitle = `Price-Lock 72h · Bloqueo de Vehículo ${vehicleName}`;
  let conceptDesc = `Garantía de tarifa y reserva de unidad ${vehicleName} en ${location} por 72 horas (Depósito 10 € compensable en factura final).`;

  if (priceLockMode === 'DEPOSIT_30_PERCENT') {
    chargeAmount = Math.round(calculatedTotal * 0.3);
    conceptTitle = `Depósito Reserva (30%) · ${vehicleName} en ${location}`;
    conceptDesc = `Reserva formal de servicio (${serviceType.replace(/_/g, ' ')}) para fecha ${eventDate || 'A convenir'}. Total: ${calculatedTotal} €.`;
  } else if (priceLockMode === 'FULL_PAYMENT') {
    chargeAmount = calculatedTotal;
    conceptTitle = `Reserva Completa Oficial · ${vehicleName} (${location})`;
    conceptDesc = `Servicio completo de chófer de representación S-Class en ${location}.`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: conceptTitle,
            description: conceptDesc,
            images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop'],
          },
          unit_amount: Math.round(chargeAmount * 100), // en céntimos
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'VIP_CHAUFFEUR_RESERVATION',
      vehicleId,
      vehicleName,
      serviceType,
      location,
      priceLockMode,
      eventDate: eventDate || 'TBD',
      totalServicePrice: String(calculatedTotal),
      depositPaid: String(chargeAmount),
      providerNif: 'B87910311'
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=vip_chauffeur`,
    cancel_url: `${baseUrl}/servicios/chofer-vip`,
  });

  if (!session.url) {
    throw new Error('No se pudo generar la sesión de pago de Stripe.');
  }

  logger.info({ event: "VIP_CHECKOUT_SUCCESS", sessionId: session.id, vehicleId, chargeAmount });

  return {
    sessionId: session.id,
    url: session.url
  };
}

/**
 * 🎄 STRIPE CHECKOUT: ALUMBRADO NAVIDEÑO & LICITACIONES B2G
 * Genera sesión de pago Smart-Lock (10 €) para bloqueo de tarifa de fábrica y emisión de expediente LCSP.
 */
export async function createB2GLightingCheckout(input: B2GLightingCheckoutInput) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 10, 60000)) {
    throw new Error("Límite de solicitudes alcanzado. Por favor, inténtelo de nuevo en un minuto.");
  }

  const parsed = B2GLightingCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Parámetros de licitación inválidos: ${parsed.error.issues.map(e => e.message).join(", ")}`);
  }

  const { sku, productName, category, cataloguePage, priceNumeric, municipality } = parsed.data;

  const chargeAmount = 10; // 10 € Smart-Lock
  const conceptTitle = `Smart-Lock 72h · Bloqueo de Stock & Tarifa LCSP (Ref: ${sku})`;
  const conceptDesc = `Reserva oficial de stock de fábrica y emisión de memoria técnica visada para ${productName} (${municipality}). Depósito compensable en pliego final.`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: conceptTitle,
            description: conceptDesc,
          },
          unit_amount: Math.round(chargeAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'B2G_LIGHTING_SMART_LOCK',
      sku,
      productName,
      category,
      cataloguePage: String(cataloguePage),
      municipality,
      catalogPrice: priceNumeric ? String(priceNumeric) : 'CUSTOM_QUOTE',
      depositPaid: '10'
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=b2g_lighting`,
    cancel_url: `${baseUrl}/arsenal/luces-navidad`,
  });

  if (!session.url) {
    throw new Error('No se pudo generar la sesión de pago de Stripe.');
  }

  return {
    sessionId: session.id,
    url: session.url
  };
}

/**
 * 🛡️ STRIPE CHECKOUT: SUPPLIER BLUR-LOCK & DESBLOQUEO DE CONTACTO DIRECTO (10 €)
 * Bloquea la fuga de datos y cobra 10 € (Smart-Lock 72h) para revelar teléfono, email y contratación directa con garantía 0 Fallos.
 */
export async function createSupplierUnlockCheckout(input: SupplierUnlockCheckoutInput) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 15, 60000)) {
    throw new Error("Límite de solicitudes alcanzado. Por favor, inténtelo de nuevo en un minuto.");
  }

  const parsed = SupplierUnlockCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Datos de desbloqueo inválidos: ${parsed.error.issues.map(e => e.message).join(", ")}`);
  }

  const { supplierId, supplierName, category, city, slug } = parsed.data;

  const chargeAmount = 10; // 10 € Desbloqueo Smart-Lock 72h
  const conceptTitle = `Smart-Lock 72h · Desbloqueo Ficha y Contacto Directo: ${supplierName}`;
  const conceptDesc = `Acceso inmediato al canal de contacto directo, teléfono auditado, disponibilidad en tiempo real y Garantía de 0 Fallos EAR OS S-Class para ${category} en ${city}.`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';
  const returnPath = slug ? `/proveedores/${slug}` : '/proveedores';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: conceptTitle,
            description: conceptDesc,
          },
          unit_amount: Math.round(chargeAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'SUPPLIER_CONTACT_UNLOCK',
      supplierId,
      supplierName,
      category,
      city,
      slug: slug || '',
      depositPaid: '10'
    },
    success_url: `${baseUrl}${returnPath}?unlocked=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}${returnPath}`,
  });

  if (!session.url) {
    throw new Error('No se pudo generar la sesión de pago de Stripe.');
  }

  logger.info({ event: "SUPPLIER_UNLOCK_CHECKOUT_CREATED", sessionId: session.id, supplierId, chargeAmount });

  return {
    sessionId: session.id,
    url: session.url
  };
}


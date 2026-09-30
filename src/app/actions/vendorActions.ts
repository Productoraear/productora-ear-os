'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface PromotionItem {
  id: string;
  title: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED' | 'GIFT';
  value: string;
  active: boolean;
  validUntil: string;
}

export interface VendorInboxItem {
  id: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  location: string;
  budget: number;
  status: 'NUEVO' | 'CONTACTADO' | 'PRESUPUESTADO' | 'RESERVADO' | 'DECLINADO';
  notes?: string;
  createdAt: string;
}

// Plantillas precargadas de promociones basadas en la base de datos de proveedores
const DEFAULT_PROMOTIONS: PromotionItem[] = [
  {
    id: 'promo-1',
    title: 'Descuento Especial Viernes y Domingos',
    description: '10% de descuento directo en contratación para eventos celebrados en viernes o domingo fuera de temporada alta.',
    discountType: 'PERCENT',
    value: '10%',
    active: true,
    validUntil: '2026-12-31'
  },
  {
    id: 'promo-2',
    title: 'Pack Hora Loca de Regalo',
    description: 'Regalo de 45 minutos extra de animación / sonido para la recena al contratar el pack completo de boda.',
    discountType: 'GIFT',
    value: 'Regalo',
    active: true,
    validUntil: '2026-12-31'
  },
  {
    id: 'promo-3',
    title: 'Microfonía Inalámbrica e Iluminación LED Gratis',
    description: 'Inclusión gratuita de 2 micrófonos inalámbricos Shure y 4 focos par LED para el espacio de baile.',
    discountType: 'GIFT',
    value: 'Gratis',
    active: false,
    validUntil: '2026-11-30'
  },
  {
    id: 'promo-4',
    title: 'Ahorro Boda Completa (Ceremonia + Cóctel + Banquete)',
    description: 'Descuento directo de 50 € al contratar la música para todo el evento continuado.',
    discountType: 'FIXED',
    value: '50 €',
    active: false,
    validUntil: '2026-12-31'
  }
];

// Inboxes simulados/precargados para Edwin Agudelo
const DEFAULT_INBOX: VendorInboxItem[] = [
  {
    id: 'lead-101',
    clientName: 'María Fernández & Carlos',
    clientPhone: '+34 612 345 678',
    eventDate: '2026-10-18',
    location: 'Finca La Gaivota (Madrid)',
    budget: 470.00,
    status: 'NUEVO',
    notes: 'Interesados en acústico solista para cóctel y banquete. Distancia 60km desde Méntrida.',
    createdAt: '2026-09-29T18:30:00Z'
  },
  {
    id: 'lead-102',
    clientName: 'Laura & Javier',
    clientPhone: '+34 687 112 233',
    eventDate: '2026-11-05',
    location: 'Jardines La Cartuja (Toledo)',
    budget: 350.00,
    status: 'CONTACTADO',
    notes: 'Confirmado presupuesto base de 350€. Pendiente envío de repertorio.',
    createdAt: '2026-09-28T14:15:00Z'
  },
  {
    id: 'lead-103',
    clientName: 'Residencia Los Olivos (VIMUME B2G)',
    clientPhone: '+34 693 693 048',
    eventDate: '2026-10-12',
    location: 'Méntrida (Toledo)',
    budget: 650.00,
    status: 'RESERVADO',
    notes: 'Sesión Neuro-Musicoterapia 40 Hz Gamma. Depósito Stripe 100€ Price-Lock pagado.',
    createdAt: '2026-09-25T10:00:00Z'
  }
];

// Almacén en memoria por proveedor mientras no exista tabla específica de promos
const vendorPromosStore = new Map<string, PromotionItem[]>();
const vendorInboxStore = new Map<string, VendorInboxItem[]>();

/**
 * CÁLCULO LOGÍSTICO SSOT EDWIN AGUDELO
 * Tarifa Base: 350 €
 * Logística: 0,75 €/km a partir del km 50 desde Hub Méntrida (+120 € Hotel si fin >= 3:00 AM o > 200 km)
 */
export async function calculateEdwinAgudeloQuoteAction(params: {
  distanceKm: number;
  endTimeHour?: number; // ej. 3 para 3:00 AM
  isManualOverride?: boolean;
  manualLogisticsFee?: number;
}) {
  const basePrice = 350.0;
  let kmFee = 0;
  let hotelFee = 0;

  if (params.isManualOverride && params.manualLogisticsFee !== undefined) {
    kmFee = params.manualLogisticsFee;
  } else {
    // 0,75 €/km a partir del km 50
    if (params.distanceKm > 50) {
      kmFee = (params.distanceKm - 50) * 0.75;
    }

    // Suplemento hotel 120 € si termina a las 3:00 AM o más tarde, o si la distancia > 200 km
    const isLateFinish = params.endTimeHour !== undefined && (params.endTimeHour >= 3 || params.endTimeHour === 0);
    if (isLateFinish || params.distanceKm > 200) {
      hotelFee = 120.0;
    }
  }

  const logisticsTotal = kmFee + hotelFee;
  const grandTotal = basePrice + logisticsTotal;

  // Split Soberano (80% Artista / 10% EAR OS / 10% VIMUME)
  const artistShare = grandTotal * 0.80;
  const earInfrastructureShare = grandTotal * 0.10;
  const vimumeSocialShare = grandTotal * 0.10;

  return {
    basePrice,
    distanceKm: params.distanceKm,
    kmFee: Number(kmFee.toFixed(2)),
    hotelFee: Number(hotelFee.toFixed(2)),
    logisticsTotal: Number(logisticsTotal.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    split: {
      artistShare: Number(artistShare.toFixed(2)),
      earInfrastructureShare: Number(earInfrastructureShare.toFixed(2)),
      vimumeSocialShare: Number(vimumeSocialShare.toFixed(2))
    }
  };
}

/**
 * Obtener promociones de un proveedor
 */
export async function getVendorPromotionsAction(vendorSlug: string) {
  if (!vendorPromosStore.has(vendorSlug)) {
    vendorPromosStore.set(vendorSlug, [...DEFAULT_PROMOTIONS]);
  }
  return vendorPromosStore.get(vendorSlug) || [];
}

/**
 * Alternar estado activo de una promoción
 */
export async function togglePromotionAction(vendorSlug: string, promoId: string) {
  const promos = vendorPromosStore.get(vendorSlug) || [...DEFAULT_PROMOTIONS];
  const updated = promos.map(p => p.id === promoId ? { ...p, active: !p.active } : p);
  vendorPromosStore.set(vendorSlug, updated);
  revalidatePath('/vendor/promociones');
  return { success: true, promotions: updated };
}

/**
 * Guardar o actualizar una promoción
 */
export async function savePromotionAction(vendorSlug: string, promotion: PromotionItem) {
  const promos = vendorPromosStore.get(vendorSlug) || [...DEFAULT_PROMOTIONS];
  const index = promos.findIndex(p => p.id === promotion.id);
  if (index >= 0) {
    promos[index] = promotion;
  } else {
    promos.push(promotion);
  }
  vendorPromosStore.set(vendorSlug, promos);
  revalidatePath('/vendor/promociones');
  return { success: true, promotions: promos };
}

/**
 * Obtener mensajes/leads del inbox del proveedor
 */
export async function getVendorInboxAction(vendorSlug: string) {
  if (!vendorInboxStore.has(vendorSlug)) {
    vendorInboxStore.set(vendorSlug, [...DEFAULT_INBOX]);
  }
  return vendorInboxStore.get(vendorSlug) || [];
}

/**
 * Actualizar estado de una solicitud en el inbox
 */
export async function updateVendorInboxStatusAction(
  vendorSlug: string,
  leadId: string,
  newStatus: VendorInboxItem['status']
) {
  const inbox = vendorInboxStore.get(vendorSlug) || [...DEFAULT_INBOX];
  const updated = inbox.map(item => item.id === leadId ? { ...item, status: newStatus } : item);
  vendorInboxStore.set(vendorSlug, updated);
  revalidatePath('/vendor/inbox');
  return { success: true, inbox: updated };
}

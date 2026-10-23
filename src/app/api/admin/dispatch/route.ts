import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEPOSITO_STRIPE_EUR, LOGISTICA_KM_HOTEL } from '@/lib/constants/ear-os-ssot';
import type {
  DispatchQueueItem,
  DispatchQueueResponse,
  DispatchStatus,
} from '@/lib/dispatch/dispatchQueueTypes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🚖 ADMIN DISPATCH — COLA DE DESPACHO EN LECTURA REAL (CERO FACHADAS)
 * -------------------------------------------------------------------
 * Sustituye la antigua semilla `INITIAL_DISPATCH_QUEUE` por una lectura real
 * desde PostgreSQL: `ProductionEvent` (producciones selladas) y `VendorBooking`
 * (reservas gestionadas por proveedores). Degradación elegante: ante cualquier
 * fallo de BD se devuelve `success:false` con `items:[]`, jamás datos simulados.
 */

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readMetaNumber(meta: unknown, key: string): number | null {
  const rec = asRecord(meta);
  const v = rec?.[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function readMetaString(meta: unknown, key: string): string | null {
  const rec = asRecord(meta);
  const v = rec?.[key];
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

function readMetaBoolean(meta: unknown, key: string): boolean | null {
  const rec = asRecord(meta);
  const v = rec?.[key];
  return typeof v === 'boolean' ? v : null;
}

function mapProductionStatus(status: string): DispatchStatus {
  if (status === 'PAID_CONFIRMED' || status === 'LOCKED' || status === 'CONFIRMED') {
    return 'LOCKED_ACID';
  }
  if (status === 'DRAFT' || status === 'PENDING') {
    return 'PENDING_ASSIGNMENT';
  }
  return 'DISPATCHED';
}

export async function GET(): Promise<NextResponse> {
  try {
    const [productions, bookings] = await Promise.all([
      prisma.productionEvent.findMany({
        where: { status: { notIn: ['CANCELLED', 'DRAFT'] } },
        orderBy: { eventDate: 'asc' },
        take: 100,
      }),
      prisma.vendorBooking.findMany({
        where: { status: { not: 'CANCELLED' } },
        include: { vendor: { select: { stageName: true, soundLimitDba: true } } },
        orderBy: { eventDate: 'asc' },
        take: 100,
      }),
    ]);

    const productionItems: DispatchQueueItem[] = productions.map((p) => {
      const distance = readMetaNumber(p.metadata, 'distanceKmFromMentrida');
      const soundDba = readMetaNumber(p.metadata, 'soundDba');
      const depositEur =
        readMetaNumber(p.metadata, 'depositEur') ??
        (p.status === 'PAID_CONFIRMED' ? DEPOSITO_STRIPE_EUR : 0);
      const hotelRequired =
        readMetaBoolean(p.metadata, 'hotelRequired') ?? (distance ?? 0) > LOGISTICA_KM_HOTEL;
      const artistName = readMetaString(p.metadata, 'artistName');

      return {
        id: p.id,
        source: 'PRODUCTION',
        eventName: p.title,
        clientName: p.clientName?.trim() || 'Cliente EAR OS',
        clientPhone: p.clientPhone?.trim() || '',
        eventDate: p.eventDate.toISOString(),
        location: p.location?.trim() || 'Ubicación Confirmada Cliente',
        distanceKmFromMentrida: distance,
        assignedArtist: artistName ?? 'Pendiente de asignación',
        status: mapProductionStatus(p.status),
        totalEur: p.totalBudget,
        depositPaidEur: depositEur,
        soundDba,
        hotelRequired,
      };
    });

    const bookingItems: DispatchQueueItem[] = bookings.map((b) => ({
      id: b.id,
      source: 'VENDOR_BOOKING',
      eventName: b.eventTitle,
      clientName: 'Cliente Confirmado EAR OS',
      clientPhone: '',
      eventDate: b.eventDate.toISOString(),
      location: b.location?.trim() || 'Ubicación Confirmada Cliente',
      distanceKmFromMentrida: null,
      assignedArtist: b.vendor.stageName?.trim() || 'Proveedor Homologado EAR',
      status: b.isLockedAcid ? 'LOCKED_ACID' : 'DISPATCHED',
      totalEur: b.totalPriceEur,
      depositPaidEur: b.depositPaidEur,
      soundDba: b.vendor.soundLimitDba ?? null,
      hotelRequired: false, // Sin distancia registrada en VendorBooking.
    }));

    const items: DispatchQueueItem[] = [...productionItems, ...bookingItems].sort(
      (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );

    const payload: DispatchQueueResponse = { success: true, count: items.length, items };
    return NextResponse.json(payload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[DispatchQueueAPI] Error leyendo cola de despacho:', message);
    const payload: DispatchQueueResponse = { success: false, count: 0, items: [], error: message };
    return NextResponse.json(payload, { status: 500 });
  }
}

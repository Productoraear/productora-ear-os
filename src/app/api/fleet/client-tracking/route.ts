import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateHaversineDistance } from '@/features/search/utils/mentridaDistanceEngine';

export const dynamic = 'force-dynamic';

/**
 * GET /api/fleet/client-tracking
 *
 * Devuelve el estado de seguimiento en vivo del convoy asignado a una producción
 * confirmada tras el pago de la fianza Stripe (100 €).
 *
 * Query params:
 *  - production_id (requerido): id del ProductionEvent
 *  - session_id    (opcional):  id de la Checkout Session de Stripe (auditoría)
 *
 * Construye un ClientLiveTrackingData a partir de:
 *  - ProductionEvent (Prisma): cliente, finca, metadata de convoy/conductor
 *  - FleetPosition (Prisma): última posición GPS conocida de la unidad asignada
 */

interface ConvoyMetadata {
  assignedProviderName?: string;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  originPointName?: string;
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  clientAccessNotes?: string;
  fleetUnitId?: string;
  depositStripeConfirmed?: boolean;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asCoords(
  value: unknown,
  fallback: { lat: number; lng: number }
): { lat: number; lng: number } {
  const rec = asRecord(value);
  const lat = asNumber(rec.lat, fallback.lat);
  const lng = asNumber(rec.lng, fallback.lng);
  return { lat, lng };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productionId = searchParams.get('production_id');
  const sessionId = searchParams.get('session_id');

  if (!productionId) {
    return NextResponse.json(
      { error: 'Falta el parámetro production_id.' },
      { status: 400 }
    );
  }

  try {
    const production = await prisma.productionEvent.findUnique({
      where: { id: productionId }
    });

    if (!production) {
      return NextResponse.json(
        { error: 'Producción no encontrada.' },
        { status: 404 }
      );
    }

    const metadata = asRecord(production.metadata);
    const convoy = asRecord(metadata.convoy) as ConvoyMetadata;

    // Coordenadas de destino: metadata.convoy.destinationCoords o fallback Méntrida
    const destinationCoords = asCoords(convoy.destinationCoords, {
      lat: 40.2383,
      lng: -4.1956
    });

    // Origen del convoy: metadata.convoy.originCoords o base Méntrida
    const originCoords = asCoords(convoy.originCoords, {
      lat: 40.2383,
      lng: -4.1956
    });

    // Última posición GPS conocida de la unidad asignada
    let currentLocationCoords = originCoords;
    let speedKmh = 0;
    let currentStatus: 'EN_ORIGEN' | 'EN_TRANSITO' | 'EN_DESTINO' | 'COMPLETADO' =
      'EN_ORIGEN';

    const fleetUnitId = asString(convoy.fleetUnitId, '');
    if (fleetUnitId) {
      const lastPosition = await prisma.fleetPosition.findFirst({
        where: { unitId: fleetUnitId },
        orderBy: { timestamp: 'desc' }
      });

      if (lastPosition) {
        currentLocationCoords = {
          lat: lastPosition.latitude,
          lng: lastPosition.longitude
        };
        speedKmh = Math.round(lastPosition.speed ?? 0);
        currentStatus = speedKmh > 5 ? 'EN_TRANSITO' : 'EN_ORIGEN';
      }
    }

    // ETA estimada: distancia restante / velocidad media (fallback 60 km/h)
    const remainingKm = calculateHaversineDistance(
      currentLocationCoords.lat,
      currentLocationCoords.lng,
      destinationCoords.lat,
      destinationCoords.lng
    );
    const effectiveSpeed = speedKmh > 5 ? speedKmh : 60;
    const etaMinutes = Math.max(1, Math.round((remainingKm / effectiveSpeed) * 60));

    const payload = {
      bookingId: production.id,
      clientName: asString(production.clientName, 'Cliente EAR OS'),
      venueName: asString(production.location, production.title),
      venueAddress: asString(production.location, 'Dirección pendiente de confirmar'),
      destinationCoords,
      originPointName: asString(convoy.originPointName, 'Base Logística Méntrida'),
      originCoords,
      currentLocationCoords,
      assignedProviderName: asString(
        convoy.assignedProviderName,
        'Productora EAR OS'
      ),
      driverName: asString(convoy.driverName, 'Jefe de Convoy EAR OS'),
      driverPhone: asString(convoy.driverPhone, '+34600000000'),
      vehiclePlate: asString(convoy.vehiclePlate, 'PENDIENTE'),
      vehicleModel: asString(convoy.vehicleModel, 'Furgón Logístico S-Class'),
      currentStatus,
      etaMinutes,
      speedKmh,
      depositStripeConfirmed:
        convoy.depositStripeConfirmed === true || Boolean(sessionId),
      clientAccessNotes: asString(
        convoy.clientAccessNotes,
        'Acceso por el portón principal. El convoy se anunciará por teléfono al llegar.'
      )
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido de servidor';
    return NextResponse.json(
      { error: 'No se pudo recuperar el seguimiento del convoy.', detail: message },
      { status: 500 }
    );
  }
}

import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { calculateHaversineDistance } from '@/features/search/utils/mentridaDistanceEngine';
import {
  ReservaConfirmadaLiveView
} from '@/features/fleet/ui/ReservaConfirmadaLiveView';
import type { ClientLiveTrackingData } from '@/features/fleet/ui/ClientLiveTrackingDrawer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reserva Confirmada | Seguimiento de Convoy en Vivo',
  description:
    'Tu fianza de 100 € está verificada. Sigue en vivo el convoy logístico hacia tu finca.',
  robots: { index: false, follow: false }
};

interface ReservaConfirmadaPageProps {
  searchParams: Promise<{
    session_id?: string;
    production_id?: string;
  }>;
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
  return {
    lat: asNumber(rec.lat, fallback.lat),
    lng: asNumber(rec.lng, fallback.lng)
  };
}

/**
 * Server Component: resuelve searchParams (async), consulta ProductionEvent en Prisma
 * y construye el ClientLiveTrackingData inicial para el mapa Leaflet HD + drawer.
 */
export default async function ReservaConfirmadaPage({
  searchParams
}: ReservaConfirmadaPageProps) {
  const resolvedParams = await searchParams;
  const sessionId = resolvedParams.session_id ?? '';
  const productionId = resolvedParams.production_id ?? '';

  let initialData: ClientLiveTrackingData | null = null;

  if (productionId) {
    try {
      const production = await prisma.productionEvent.findUnique({
        where: { id: productionId }
      });

      if (production) {
        const metadata = asRecord(production.metadata);
        const convoy = asRecord(metadata.convoy);

        const destinationCoords = asCoords(convoy.destinationCoords, {
          lat: 40.2383,
          lng: -4.1956
        });
        const originCoords = asCoords(convoy.originCoords, {
          lat: 40.2383,
          lng: -4.1956
        });

        let currentLocationCoords = originCoords;
        let speedKmh = 0;
        let currentStatus:
          | 'EN_ORIGEN'
          | 'EN_TRANSITO'
          | 'EN_DESTINO'
          | 'COMPLETADO' = 'EN_ORIGEN';

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

        const remainingKm = calculateHaversineDistance(
          currentLocationCoords.lat,
          currentLocationCoords.lng,
          destinationCoords.lat,
          destinationCoords.lng
        );
        const effectiveSpeed = speedKmh > 5 ? speedKmh : 60;
        const etaMinutes = Math.max(
          1,
          Math.round((remainingKm / effectiveSpeed) * 60)
        );

        initialData = {
          bookingId: production.id,
          clientName: asString(production.clientName, 'Cliente EAR OS'),
          venueName: asString(production.location, production.title),
          venueAddress: asString(
            production.location,
            'Dirección pendiente de confirmar'
          ),
          destinationCoords,
          originPointName: asString(
            convoy.originPointName,
            'Base Logística Méntrida'
          ),
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
      }
    } catch {
      initialData = null;
    }
  }

  return (
    <ReservaConfirmadaLiveView
      sessionId={sessionId}
      productionId={productionId}
      initialData={initialData}
    />
  );
}

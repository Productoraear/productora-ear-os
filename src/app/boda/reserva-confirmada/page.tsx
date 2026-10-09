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
    order_id?: string;
    tipo?: string;
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
 * Server Component: resuelve searchParams (async), consulta ProductionEvent o la sesión Stripe
 * y construye el ClientLiveTrackingData inicial para el mapa Leaflet HD + drawer con tramo horario.
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

        const slotTime = asString(metadata.timeSlot || metadata.horaTramo, '18:00');
        const dateFormatted = production.eventDate
          ? new Date(production.eventDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
          : '';

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
            convoy.assignedProviderName || metadata.artistName,
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
          ),
          timeSlot: slotTime,
          eventDate: asString(metadata.fecha, dateFormatted),
          serviceType: asString(metadata.formato, 'Artista / Agrupación de Gala'),
          bufferMinutes: asNumber(metadata.bufferMinutes, 30)
        };
      }
    } catch {
      initialData = null;
    }
  }

  // Fallback si viene directamente de Stripe Checkout sin productionId en query
  if (!initialData && sessionId) {
    try {
      const Stripe = (await import('stripe')).default;
      // 🔒 FAIL-CLOSED STRIPE (BLINDAJE SESSION_SECRET P0): sin secreto real, no se consulta Stripe.
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey || stripeKey === 'sk_test_dummy_key_for_build') {
        throw new Error('[RESERVA_CONFIRMADA] STRIPE_SECRET_KEY no configurado (fail-closed).');
      }
      const stripe = new Stripe(stripeKey, {
        apiVersion: '2025-01-27.acacia' as any
      });
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session && session.metadata) {
        const meta = session.metadata;
        initialData = {
          bookingId: meta.orderId || sessionId,
          clientName: asString(session.customer_details?.name, 'Cliente EAR OS'),
          venueName: asString(meta.municipio || 'Ubicación Confirmada', 'Ubicación de Gala'),
          venueAddress: asString(meta.municipio, 'Provincia / Sede Seleccionada'),
          destinationCoords: { lat: 40.4168, lng: -3.7038 },
          originPointName: 'Base Logística Méntrida',
          originCoords: { lat: 40.2383, lng: -4.1956 },
          currentLocationCoords: { lat: 40.2383, lng: -4.1956 },
          assignedProviderName: asString(meta.artistName, 'Artista de Roster S-Class'),
          driverName: 'Despacho Central EAR OS',
          driverPhone: '+34693693048',
          vehiclePlate: 'S-CLASS-VIP',
          vehicleModel: 'Logística In Situ',
          currentStatus: 'EN_ORIGEN',
          etaMinutes: 45,
          speedKmh: 0,
          depositStripeConfirmed: true,
          clientAccessNotes: 'Reserva con bloqueo de tramo horario y buffer previo de 30 min para accesos y montaje.',
          timeSlot: asString(meta.horaTramo, '18:00'),
          eventDate: asString(meta.fecha, 'Fecha Confirmada'),
          serviceType: asString(meta.formato, 'Artista / Agrupación'),
          bufferMinutes: asNumber(meta.bufferMinutes, 30)
        };
      }
    } catch {
      // Ignorar fallos de Stripe en local
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

import { NextResponse } from 'next/server';
import type { VenueAcousticInput, GeoAcousticOutput } from '@/lib/geo/geo-acoustic-radar';
import { calculateGeoAcousticRadar } from '@/lib/geo/geo-acoustic-radar';

export const runtime = 'nodejs';

const VALID_VENUE_TYPES: ReadonlyArray<VenueAcousticInput['venueType']> = [
  'SALON_BODA',
  'FINCA_EXTERIOR',
  'IGLESIA',
  'RESIDENCIA_MAYORES',
  'PLAZA_PUBLICA',
];

function isVenueAcousticInput(body: unknown): body is VenueAcousticInput {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;

  if (typeof b.venueName !== 'string' || b.venueName.trim().length === 0) return false;
  if (typeof b.venueType !== 'string' || !VALID_VENUE_TYPES.includes(b.venueType as VenueAcousticInput['venueType'])) return false;
  if (typeof b.guestCount !== 'number' || !Number.isFinite(b.guestCount) || b.guestCount < 1) return false;
  if (typeof b.destinationProvince !== 'string' || b.destinationProvince.trim().length === 0) return false;
  if (typeof b.distanceKmFromMentrida !== 'number' || !Number.isFinite(b.distanceKmFromMentrida) || b.distanceKmFromMentrida < 0) return false;

  if (b.eventEndHour !== undefined && typeof b.eventEndHour !== 'string') return false;
  if (b.isVimumeContext !== undefined && typeof b.isVimumeContext !== 'boolean') return false;

  return true;
}

/**
 * 📡 MASTER GEO-ACOUSTIC RADAR & FLEET DISPATCHER — Endpoint POST
 * Recibe VenueAcousticInput y devuelve GeoAcousticOutput (Rider Acústico + Logística S-Class + SHA-256).
 */
export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    if (!isVenueAcousticInput(body)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payload inválido. Se requiere VenueAcousticInput válido.',
          requiredFields: {
            venueName: 'string',
            venueType: VALID_VENUE_TYPES.join(' | '),
            guestCount: 'number >= 1',
            destinationProvince: 'string',
            distanceKmFromMentrida: 'number >= 0',
            eventEndHour: "string (formato 'HH:mm') [opcional]",
            isVimumeContext: 'boolean [opcional]',
          },
        },
        { status: 400 }
      );
    }

    const result: GeoAcousticOutput = calculateGeoAcousticRadar(body);

    return NextResponse.json(
      {
        success: true,
        engine: 'GEO_ACOUSTIC_RADAR_FLEET_DISPATCHER',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fallo interno en Geo-Acoustic Radar';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
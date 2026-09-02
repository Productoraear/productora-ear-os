'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { 
  WaybillStatus, 
  WaybillParticipantRole, 
  CommissionStatus 
} from '@prisma/client';

/**
 * 🛰️ DIRECTIVA OMEGA V207-FUSION — THE ATOMIC TRIGGER
 * Purpose: Fusing Financial Ledger with Spatial Dispatch Physics.
 */

const BookingSchema = z.object({
  artistId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  clientId: z.string().uuid(),
  startsAt: z.string().datetime(),
  amount: z.number().min(1),
  origin: z.object({
    label: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
  destination: z.object({
    label: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
  extras: z.array(z.string()).optional(),
});

export async function processEliteBooking(payload: unknown) {
  const validated = BookingSchema.parse(payload);
  const { artistId, workspaceId, clientId, startsAt, amount, origin, destination } = validated;

  return await prisma.$transaction(async (tx) => {
    // 1. EL PACTO: Crear SmartContract (Status: PENDING)
    const contract = await tx.smartContract.create({
      data: {
        userId: clientId, // Simplificado: Cliente es el User
        workspaceId,
        artistId,
        clientProfileId: clientId,
        title: `Contrato de Élite - ${origin.label} ➔ ${destination.label}`,
        status: 'PENDING',
      }
    });

    // 2. EL LEDGER: Asiento Contable (Comisión y Pago)
    const ledger = await tx.commissionLedger.create({
      data: {
        userId: clientId,
        workspaceId,
        amount,
        currency: 'EUR',
        status: 'PENDING',
        sourceEvent: 'ELITE_BOOKING_TRIGGER',
        reference: `RESERVA-${contract.id.slice(0, 8)}`,
      }
    });

    // 3. EL CALENDARIO: Bloqueo de Disponibilidad (Atomic Lock)
    await tx.calendarBlock.create({
      data: {
        artistId,
        startsAt: new Date(startsAt),
        endsAt: new Date(new Date(startsAt).getTime() + 3600000 * 3), // +3h por defecto
        label: `Reserva Exclusiva: ${contract.id}`,
        status: 'BLOCKED',
      }
    });

    // 4. EL WAYBILL: Materialización Geoespacial (PostGIS)
    const waybill = await tx.waybill.create({
      data: {
        workspaceId,
        artistProfileId: artistId,
        clientProfileId: clientId,
        referenceCode: `WAY-${contract.id.slice(0, 8)}`,
        status: 'QUEUED',
        originLabel: origin.label,
        destinationLabel: destination.label,
        originLat: origin.lat,
        originLng: origin.lng,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        startsAt: new Date(startsAt),
      }
    });

    // 5. EL MATCHING: Invocación de la Inteligencia Espacial (PostGIS Search)
    // Buscamos la unidad más cercana en un radio de 50km
    const nearbyUnits: any[] = await tx.$queryRaw`
      SELECT unit_id, code, distance_meters 
      FROM nearby_available_units(
        ${workspaceId}::uuid, 
        ${origin.lng}::double precision, 
        ${origin.lat}::double precision, 
        50000
      )
      LIMIT 1;
    `;

    let assignedUnitId = null;
    if (nearbyUnits.length > 0) {
      assignedUnitId = nearbyUnits[0].unit_id;
      
      // Auto-Asignación y Despacho Inmediato
      await tx.waybill.update({
        where: { id: waybill.id },
        data: {
          unitId: assignedUnitId,
          status: 'DISPATCHED',
        }
      });

      // Actualizar estado de la unidad
      await tx.fleetUnit.update({
        where: { id: assignedUnitId },
        data: { status: 'DISPATCHED' }
      });
    }

    // 6. EL WEBHOOK: Notificación al Mando (Fire & Forget)
    // Nota: En producción esto iría a una cola o Edge Function
    console.log(`🚨 [SINGULARIDAD ALCANZADA]: Contrato ${contract.id} firmado.`);
    console.log(`📍 Waybill ${waybill.id} creado (${origin.label} -> ${destination.label}).`);
    if (assignedUnitId) {
       console.log(`🚀 Unidad ${assignedUnitId} asignada mediante PostGIS. Estado: DISPATCHED.`);
    }

    return {
      success: true,
      contractId: contract.id,
      waybillId: waybill.id,
      assignedUnitId,
      status: assignedUnitId ? 'DISPATCHED' : 'QUEUED'
    };
  });
}

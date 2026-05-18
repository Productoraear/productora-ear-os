import { NextResponse } from "next/server";
import { TelemetryPingSchema } from "@/lib/fleet-api-contracts";
import { prisma } from "@/lib/prisma";

/**
 * 🛰️ API: POST /api/fleet/position
 * Ingesta de coordenadas GPS en tiempo real.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = TelemetryPingSchema.parse(body);

    // 1. Persistir Posición
    const position = await prisma.fleetPosition.create({
      data: {
        unitId: data.unitId || "default-unit", // En producción, se extrae del auth o deviceId
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        speed: data.speed,
        heading: data.heading,
        accuracy: data.accuracy,
        source: "GPS_DEVICE",
      }
    });

    // 2. Registrar Evento de Telemetría
    await prisma.fleetTelemetryEvent.create({
      data: {
        waybillId: data.waybillId,
        eventType: "position_updated",
        payload: {
          positionId: position.id,
          lat: data.latitude,
          lng: data.longitude,
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Position updated", 
      id: position.id 
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 400 });
  }
}

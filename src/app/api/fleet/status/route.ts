import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🛰️ API: POST /api/fleet/status
 * Actualización de estado operativo de una unidad.
 */
export async function POST(req: Request) {
  try {
    const { unitId, status } = await req.json();

    const unit = await prisma.fleetUnit.update({
      where: { id: unitId },
      data: { status }
    });

    await prisma.fleetTelemetryEvent.create({
      data: {
        eventType: "status_changed",
        payload: { unitId, newStatus: status }
      }
    });

    return NextResponse.json({ success: true, unit });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 400 });
  }
}

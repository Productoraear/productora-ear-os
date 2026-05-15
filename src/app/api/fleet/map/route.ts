import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🛰️ API: GET /api/fleet/map
 * Estado global de la flota para el God Mode Dashboard.
 */
export async function GET() {
  try {
    const units = await prisma.fleetUnit.findMany({
      include: {
        positions: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        waybills: {
          where: { status: 'IN_TRANSIT' },
          take: 1
        }
      }
    });

    return NextResponse.json(units);

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch map data" }, { status: 500 });
  }
}

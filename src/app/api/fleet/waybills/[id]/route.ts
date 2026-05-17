import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * 🛰️ API: GET /api/fleet/waybills/[id]
 * Recupera el detalle completo de una hoja de ruta, incluyendo checkpoints.
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const waybill = await prisma.waybill.findUnique({
      where: { id: params.id },
      include: {
        checkpoints: {
          orderBy: { order: 'asc' }
        },
        unit: true,
        contract: {
          include: { artist: true }
        }
      }
    });

    if (!waybill) return NextResponse.json({ error: "Waybill not found" }, { status: 404 });

    return NextResponse.json(waybill);

  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

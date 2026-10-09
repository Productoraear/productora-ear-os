import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security/adminGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FleetUnitRow = {
    id: string;
    unitCode: string | null;
    code: string | null;
    status: string;
    currentLocation: string | null;
    createdAt: Date;
    updatedAt: Date;
    positions: {
        latitude: number;
        longitude: number;
        speed: number | null;
        heading: number | null;
        timestamp: Date;
    }[];
};

export async function GET(request: Request): Promise<Response> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const raw = await prisma.fleetUnit.findMany({
            orderBy: { updatedAt: "desc" },
            include: {
                positions: {
                    orderBy: { timestamp: "desc" },
                    take: 1,
                    select: {
                        latitude: true,
                        longitude: true,
                        speed: true,
                        heading: true,
                        timestamp: true,
                    },
                },
            },
        });

        const data: FleetUnitRow[] = raw.map((unit) => ({
            id: unit.id,
            unitCode: unit.unitCode,
            code: unit.code,
            status: unit.status,
            currentLocation: unit.currentLocation,
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
            positions: unit.positions.map((p) => ({
                latitude: p.latitude,
                longitude: p.longitude,
                speed: p.speed,
                heading: p.heading,
                timestamp: p.timestamp,
            })),
        }));

        return NextResponse.json({ ok: true, data, total: data.length });
    } catch (error) {
        console.error("[fleet] GET error:", error);
        return NextResponse.json(
            { ok: false, error: "Error interno al leer la flota" },
            { status: 500 },
        );
    }
}

type FleetPatchBody = {
    id?: string;
    status?: string;
    currentLocation?: string;
};

export async function PATCH(request: Request): Promise<Response> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const body = (await request.json()) as FleetPatchBody;

        if (!body.id || typeof body.id !== "string" || body.id.length === 0) {
            return NextResponse.json(
                { ok: false, error: "Se requiere un id válido" },
                { status: 400 },
            );
        }

        const data: { status?: string; currentLocation?: string } = {};
        if (typeof body.status === "string" && body.status.length > 0) {
            data.status = body.status;
        }
        if (typeof body.currentLocation === "string" && body.currentLocation.length > 0) {
            data.currentLocation = body.currentLocation;
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                { ok: false, error: "Sin campos válidos que actualizar" },
                { status: 400 },
            );
        }

        const updated = await prisma.fleetUnit.update({
            where: { id: body.id },
            data,
        });

        return NextResponse.json({ ok: true, data: updated });
    } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === "P2025") {
            return NextResponse.json(
                { ok: false, error: "Unidad de flota no encontrada" },
                { status: 404 },
            );
        }
        console.error("[fleet] PATCH error:", error);
        return NextResponse.json(
            { ok: false, error: "Error interno al actualizar la flota" },
            { status: 500 },
        );
    }
}
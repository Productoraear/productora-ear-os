import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security/adminGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                              SECURITY HEADERS                              */
/* -------------------------------------------------------------------------- */

const SECURITY_HEADERS: Record<string, string> = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

function jsonResponse(
    body: unknown,
    init?: { status?: number; headers?: Record<string, string> },
): NextResponse {
    return NextResponse.json(body, {
        status: init?.status ?? 200,
        headers: { ...SECURITY_HEADERS, ...(init?.headers ?? {}) },
    });
}

/* -------------------------------------------------------------------------- */
/*                                   SCHEMAS                                  */
/* -------------------------------------------------------------------------- */

const FleetPatchSchema = z
    .object({
        id: z
            .string()
            .trim()
            .min(1, "Se requiere un id válido")
            .max(128, "id excede longitud máxima"),
        status: z
            .string()
            .trim()
            .min(1)
            .max(64, "status excede longitud máxima")
            .optional(),
        currentLocation: z
            .string()
            .trim()
            .min(1)
            .max(256, "currentLocation excede longitud máxima")
            .optional(),
    })
    .strict();

type FleetPatchInput = z.infer<typeof FleetPatchSchema>;

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type FleetPositionRow = {
    latitude: number;
    longitude: number;
    speed: number | null;
    heading: number | null;
    timestamp: Date;
};

type FleetUnitRow = {
    id: string;
    unitCode: string | null;
    code: string | null;
    status: string;
    currentLocation: string | null;
    createdAt: Date;
    updatedAt: Date;
    positions: FleetPositionRow[];
};

type FleetListResponse = {
    ok: true;
    data: FleetUnitRow[];
    total: number;
};

type FleetPatchResponse = {
    ok: true;
    data: {
        id: string;
        unitCode: string | null;
        code: string | null;
        status: string;
        currentLocation: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
};

type ErrorResponse = {
    ok: false;
    error: string;
    details?: unknown;
};

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */

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

        const payload: FleetListResponse = {
            ok: true,
            data,
            total: data.length,
        };

        return jsonResponse(payload);
    } catch (error) {
        console.error("[fleet] GET error:", error);
        const payload: ErrorResponse = {
            ok: false,
            error: "Error interno al leer la flota",
        };
        return jsonResponse(payload, { status: 500 });
    }
}

/* -------------------------------------------------------------------------- */
/*                                   PATCH                                    */
/* -------------------------------------------------------------------------- */

export async function PATCH(request: Request): Promise<Response> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        let rawBody: unknown;
        try {
            rawBody = await request.json();
        } catch {
            const payload: ErrorResponse = {
                ok: false,
                error: "Cuerpo JSON inválido",
            };
            return jsonResponse(payload, { status: 400 });
        }

        const parsed = FleetPatchSchema.safeParse(rawBody);
        if (!parsed.success) {
            const payload: ErrorResponse = {
                ok: false,
                error: "Payload inválido",
                details: parsed.error.flatten(),
            };
            return jsonResponse(payload, { status: 400 });
        }

        const body: FleetPatchInput = parsed.data;

        const data: { status?: string; currentLocation?: string } = {};
        if (body.status !== undefined) data.status = body.status;
        if (body.currentLocation !== undefined) {
            data.currentLocation = body.currentLocation;
        }

        if (Object.keys(data).length === 0) {
            const payload: ErrorResponse = {
                ok: false,
                error: "Sin campos válidos que actualizar",
            };
            return jsonResponse(payload, { status: 400 });
        }

        const updated = await prisma.fleetUnit.update({
            where: { id: body.id },
            data,
        });

        const payload: FleetPatchResponse = {
            ok: true,
            data: {
                id: updated.id,
                unitCode: updated.unitCode,
                code: updated.code,
                status: updated.status,
                currentLocation: updated.currentLocation,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            },
        };

        return jsonResponse(payload);
    } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === "P2025") {
            const payload: ErrorResponse = {
                ok: false,
                error: "Unidad de flota no encontrada",
            };
            return jsonResponse(payload, { status: 404 });
        }
        console.error("[fleet] PATCH error:", error);
        const payload: ErrorResponse = {
            ok: false,
            error: "Error interno al actualizar la flota",
        };
        return jsonResponse(payload, { status: 500 });
    }
}
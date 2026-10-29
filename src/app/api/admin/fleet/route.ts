import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
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
/*                              DOMINIO DE FLOTA                              */
/* -------------------------------------------------------------------------- */

const FLEET_STATUSES = ["IDLE", "EN_ROUTE", "ON_SITE", "MAINTENANCE"] as const;

type FleetStatus = (typeof FLEET_STATUSES)[number];

const fleetStatusSchema = z.enum(FLEET_STATUSES);

/** Un mismo campo no puede tener dos contratos: POST y PATCH comparten longitudes. */
const UNIT_CODE_MAX = 40;
const LOCATION_MAX = 160;
const UNIT_CODE_MIN = 2;

/**
 * Estados que exigen ubicación declarada. Una unidad «en tránsito» o «en sitio» sin
 * `currentLocation` es un dato falso que el panel de control pinta como si fuera real.
 */
const LOCATION_REQUIRED_STATUSES: ReadonlySet<FleetStatus> = new Set<FleetStatus>([
    "EN_ROUTE",
    "ON_SITE",
]);

/** Columnas con `@unique` en el modelo `fleetUnit`. */
const FLEET_UNIQUE_FIELDS = ["unitCode", "code"] as const;

/**
 * Canoniza el identificador de unidad antes de tocar PostgreSQL.
 * `@unique` es case-sensitive en Postgres: sin canonizar, `flt-01` y `FLT-01` entran como
 * dos unidades distintas y el 409 por duplicado nunca llega a dispararse.
 */
function canonicalUnitCode(value: string): string {
    return value
        .normalize("NFKC")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();
}

/** Extrae los campos violados de un P2002 (`meta.target` es array o nombre de constraint). */
function uniqueFieldsFromTarget(target: unknown): string[] {
    if (Array.isArray(target)) {
        return target.filter((item): item is string => typeof item === "string");
    }
    if (typeof target === "string") {
        const matched = FLEET_UNIQUE_FIELDS.filter((field) =>
            target.includes(field),
        );
        return matched.length > 0 ? matched : [target];
    }
    return [];
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
        status: fleetStatusSchema.optional(),
        currentLocation: z
            .string()
            .trim()
            .min(1, "currentLocation no puede quedar vacío")
            .max(LOCATION_MAX, "currentLocation excede longitud máxima")
            .optional(),
    })
    .strict();

type FleetPatchInput = z.infer<typeof FleetPatchSchema>;

const CreateBodySchema = z
    .object({
        unitCode: z
            .string()
            .trim()
            .min(UNIT_CODE_MIN, "unitCode requiere al menos 2 caracteres")
            .max(UNIT_CODE_MAX, "unitCode excede longitud máxima"),
        code: z
            .string()
            .trim()
            .min(UNIT_CODE_MIN, "code requiere al menos 2 caracteres")
            .max(UNIT_CODE_MAX, "code excede longitud máxima")
            .optional(),
        status: fleetStatusSchema.default("IDLE"),
        currentLocation: z
            .string()
            .trim()
            .max(LOCATION_MAX, "currentLocation excede longitud máxima")
            .optional(),
    })
    .strict()
    .refine(
        (value) =>
            !LOCATION_REQUIRED_STATUSES.has(value.status) ||
            (typeof value.currentLocation === "string" &&
                value.currentLocation.length > 0),
        {
            path: ["currentLocation"],
            message:
                "Los estados EN_ROUTE y ON_SITE exigen currentLocation declarada",
        },
    );

type CreateBodyInput = z.infer<typeof CreateBodySchema>;

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

/** Núcleo de `fleetUnit` sin relaciones: lo que devuelven POST y PATCH. */
type FleetUnitCore = {
    id: string;
    unitCode: string | null;
    code: string | null;
    status: string;
    currentLocation: string | null;
    createdAt: Date;
    updatedAt: Date;
};

type FleetUnitRow = FleetUnitCore & {
    positions: FleetPositionRow[];
};

type FleetListResponse = {
    ok: true;
    data: FleetUnitRow[];
    total: number;
};

type FleetPatchResponse = {
    ok: true;
    data: FleetUnitCore;
};

type FleetCreateResponse = {
    ok: true;
    data: FleetUnitCore;
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

/* -------------------------------------------------------------------------- */
/*                                    POST                                    */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request): Promise<Response> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

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

    const parsed = CreateBodySchema.safeParse(rawBody);
    if (!parsed.success) {
        const payload: ErrorResponse = {
            ok: false,
            error: "Payload inválido",
            details: {
                issues: parsed.error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            },
        };
        return jsonResponse(payload, { status: 400 });
    }

    const body: CreateBodyInput = parsed.data;
    const unitCode = canonicalUnitCode(body.unitCode);
    const code =
        typeof body.code === "string" && body.code.length > 0
            ? canonicalUnitCode(body.code)
            : null;
    const currentLocation =
        typeof body.currentLocation === "string" &&
        body.currentLocation.length > 0
            ? body.currentLocation
            : null;

    // Un identificador repetido significa lo mismo en cualquiera de las dos columnas
    // únicas: el panel pinta `unitCode ?? code`, así que ambas comparten espacio de nombres.
    const identifiers: string[] =
        code !== null && code !== unitCode ? [unitCode, code] : [unitCode];

    try {
        // Defensa previa: caza colisiones ya persistidas y en cualquier caja
        // (`flt-01` escrito antes de la canonización incluida).
        const clashFilters: Prisma.fleetUnitWhereInput[] = identifiers.flatMap(
            (value) => [
                { unitCode: { equals: value, mode: "insensitive" } },
                { code: { equals: value, mode: "insensitive" } },
            ],
        );

        const clash = await prisma.fleetUnit.findFirst({
            where: { OR: clashFilters },
            select: { unitCode: true, code: true },
        });

        if (clash) {
            const taken: string[] = [clash.unitCode, clash.code].filter(
                (value): value is string =>
                    typeof value === "string" && value.length > 0,
            );
            const payload: ErrorResponse = {
                ok: false,
                error:
                    taken.length > 0
                        ? `Identificador de unidad ya registrado: ${taken.join(", ")}`
                        : "Identificador de unidad ya registrado",
                details: { fields: taken },
            };
            return jsonResponse(payload, { status: 409 });
        }

        const data: Prisma.fleetUnitUncheckedCreateInput = {
            unitCode,
            status: body.status,
        };
        if (code !== null) data.code = code;
        if (currentLocation !== null) data.currentLocation = currentLocation;

        const created = await prisma.fleetUnit.create({
            data,
            select: {
                id: true,
                unitCode: true,
                code: true,
                status: true,
                currentLocation: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const payload: FleetCreateResponse = { ok: true, data: created };
        return jsonResponse(payload, { status: 201 });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            const payload: ErrorResponse = {
                ok: false,
                error: "unitCode o code ya registrado",
                details: { fields: uniqueFieldsFromTarget(error.meta?.target) },
            };
            return jsonResponse(payload, { status: 409 });
        }
        console.error("[fleet] POST error:", error);
        const payload: ErrorResponse = {
            ok: false,
            error: "Error interno al crear la unidad de flota",
        };
        return jsonResponse(payload, { status: 500 });
    }
}
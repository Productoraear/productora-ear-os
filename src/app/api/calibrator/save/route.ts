import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import {
    getProviderDimensions,
    type DimensionValue
} from '@/lib/matching/calibratorTypes';
import { detectPresetByTypology } from '@/lib/matching/calibratorPresets';

interface SaveCalibratorBody {
    providerId: string;
    providerName?: string;
    presetSlug?: string;
    dimensions?: Record<number, DimensionValue>;
    calibratedBy?: 'self' | 'admin';
    lastModifiedBy?: string;
}

function sanitizeDimensions(raw: Record<number, DimensionValue> | null | undefined) {
    const out: Record<number, DimensionValue> = {};
    if (!raw || typeof raw !== 'object') return out;

    const validIds = new Set(getProviderDimensions().map((d) => d.id));
    for (const [key, value] of Object.entries(raw)) {
        const id = Number(key);
        if (!Number.isInteger(id) || !validIds.has(id)) continue;
        out[id] = value;
    }
    return out;
}

function completionPercent(dimensions: Record<number, DimensionValue>): number {
    const filled = Object.keys(dimensions).filter((k) => {
        const v = dimensions[Number(k)];
        return v !== undefined && v !== null && v !== '';
    }).length;
    return Math.round((filled / 100) * 100);
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SaveCalibratorBody;

        if (!body.providerId) {
            return NextResponse.json({ error: 'providerId requerido' }, { status: 400 });
        }

        const calibratedBy = body.calibratedBy === 'admin' ? 'admin' : 'self';
        const dimensions = sanitizeDimensions(body.dimensions);
        const presetSlug = body.presetSlug || detectPresetByTypology('cortijo');

        const payload = {
            presetSlug,
            dimensions,
            completionPercent: completionPercent(dimensions),
            calibratedBy,
            lastModifiedBy: body.lastModifiedBy ?? null
        };

        const id = randomUUID();
        const dimensionsJson = JSON.stringify(dimensions);

        await prisma.$executeRaw`
            INSERT INTO "ProviderCalibration" (
                "id", "providerId", "presetSlug", "dimensions",
                "completionPercent", "calibratedBy", "lastModifiedBy",
                "createdAt", "updatedAt"
            )
            VALUES (
                ${id}, ${body.providerId}, ${payload.presetSlug},
                ${dimensionsJson}::jsonb,
                ${payload.completionPercent}, ${payload.calibratedBy},
                ${payload.lastModifiedBy},
                NOW(), NOW()
            )
            ON CONFLICT ("providerId") DO UPDATE SET
                "presetSlug" = EXCLUDED."presetSlug",
                "dimensions" = EXCLUDED."dimensions",
                "completionPercent" = EXCLUDED."completionPercent",
                "calibratedBy" = EXCLUDED."calibratedBy",
                "lastModifiedBy" = EXCLUDED."lastModifiedBy",
                "updatedAt" = NOW()
        `;

        return NextResponse.json({
            ok: true,
            calibrated: true,
            saved: {
                providerId: body.providerId,
                presetSlug: payload.presetSlug,
                completionPercent: payload.completionPercent,
                calibratedBy: payload.calibratedBy
            }
        });
    } catch (error) {
        console.error('Error saving calibrator:', error);
        return NextResponse.json(
            { error: 'Error interno guardando calibrador' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
    getProviderDimensions,
    type DimensionValue,
    type ProviderCalibration
} from '@/lib/matching/calibratorTypes';
import {
    CALIBRATOR_PRESET_META,
    buildCalibrationFromPreset,
    type PresetSlug
} from '@/lib/matching/calibratorPresets';

interface ProviderCalibrationRow {
    providerId: string;
    presetSlug: string;
    dimensions: unknown;
    completionPercent: number;
    calibratedBy: string;
    lastModifiedBy: string | null;
    updatedAt: Date;
}

function normalizePresetSlug(slug: string): PresetSlug {
    const meta = CALIBRATOR_PRESET_META.find((m) => m.slug === slug);
    return meta ? (slug as PresetSlug) : 'cortijo-rural';
}

function parseDimensions(raw: unknown): Record<number, DimensionValue> {
    if (!raw || typeof raw !== 'object') return {};
    const out: Record<number, DimensionValue> = {};
    const validIds = new Set(getProviderDimensions().map((d) => d.id));
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
        const id = Number(key);
        if (!Number.isInteger(id) || !validIds.has(id)) continue;
        out[id] = value as DimensionValue;
    }
    return out;
}

function toProviderCalibration(
    row: ProviderCalibrationRow,
    providerName: string
): ProviderCalibration {
    const dimensions = parseDimensions(row.dimensions);
    const filled = Object.keys(dimensions).filter((k) => {
        const v = dimensions[Number(k)];
        return v !== undefined && v !== null && v !== '';
    }).length;
    const completionPercent =
        row.completionPercent ?? Math.round((filled / 100) * 100);

    return {
        providerId: row.providerId,
        providerName,
        presetSlug: normalizePresetSlug(row.presetSlug),
        dimensions,
        completedAt: row.updatedAt.toISOString(),
        completionPercent,
        calibratedBy: row.calibratedBy === 'admin' ? 'admin' : 'self',
        lastModifiedBy: row.lastModifiedBy ?? undefined
    };
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ providerId: string }> }
) {
    const { providerId } = await params;

    try {
        const rawRows = await prisma.$queryRaw`
            SELECT
                "providerId",
                "presetSlug",
                "dimensions",
                "completionPercent",
                "calibratedBy",
                "lastModifiedBy",
                "updatedAt"
            FROM "ProviderCalibration"
            WHERE "providerId" = ${providerId}
            LIMIT 1
        `;
        const rows = rawRows as ProviderCalibrationRow[];
        const row = rows[0] ?? null;

        if (row) {
            const provider = await prisma.providerProfile.findUnique({
                where: { id: providerId },
                select: { id: true, name: true }
            });
            return NextResponse.json(
                toProviderCalibration(row, provider?.name ?? `Finca ${providerId.slice(0, 6)}`)
            );
        }

        // Sin calibrador guardado → devolvemos un preset autodetectado (no persistido)
        const provider = await prisma.providerProfile.findUnique({
            where: { id: providerId },
            select: { id: true, name: true, category: true }
        });

        const category = String(provider?.category ?? 'FINCA_ALQUILER');
        const fallback = buildCalibrationFromPreset(
            providerId,
            provider?.name ?? `Finca ${providerId.slice(0, 6)}`,
            normalizePresetSlug(category.toLowerCase())
        );

        return NextResponse.json({
            ...fallback,
            persisted: false
        });
    } catch (error) {
        console.error('Error reading calibrator:', error);

        // Respaldo puro en-memoria si la tabla aún no está migrada
        return NextResponse.json(
            buildCalibrationFromPreset(providerId, `Finca ${providerId.slice(0, 6)}`, 'cortijo-rural'),
            { status: 200 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  let payload: any;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid JSON body',
      },
      { status: 400 },
    );
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Payload must be an object',
      },
      { status: 400 },
    );
  }

  try {
    const { providerId, providerName, presetSlug, dimensions, calibratedBy } = payload;
    
    if (!providerId) {
      return NextResponse.json({ ok: false, error: 'providerId is required' }, { status: 400 });
    }

    // Asegurar que el provider existe (especialmente para demos)
    // Buscamos primero para no alterar otros datos
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      const slug = `prov-${providerId}-${Date.now()}`;
      await prisma.providerProfile.create({
        data: {
          id: providerId,
          slug,
          name: providerName || slug,
          category: "FINCA_ALQUILER",
        }
      });
    }

    const filledKeys = Object.keys(dimensions || {}).length;
    const completionPercent = Math.min(100, Math.round((filledKeys / 100) * 100));

    const saved = await prisma.providerCalibration.upsert({
      where: { providerId },
      update: {
        presetSlug: presetSlug || 'cortijo-rural',
        dimensions: dimensions || {},
        completionPercent,
        calibratedBy: calibratedBy || 'self',
      },
      create: {
        providerId,
        presetSlug: presetSlug || 'cortijo-rural',
        dimensions: dimensions || {},
        completionPercent,
        calibratedBy: calibratedBy || 'self'
      }
    });

    return NextResponse.json({
      ok: true,
      savedAt: saved.updatedAt.toISOString(),
      payload,
    });
  } catch (error: any) {
    console.error('[CALIBRATOR_SAVE] DB Error:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
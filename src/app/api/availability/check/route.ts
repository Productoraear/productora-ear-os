import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkDateAvailability, lockDateAtomically } from '@/lib/availability/atomicDateLockEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const AvailabilityQuerySchema = z.object({
  date: z.string().min(4, 'Se requiere una fecha válida'),
  artistProfileId: z.string().optional(),
  productionId: z.string().optional(),
  lock: z.enum(['true', 'false']).optional()
});

/**
 * GET /api/availability/check?date=YYYY-MM-DD&artistProfileId=...&lock=true
 *
 * Consulta atómica de disponibilidad contra `calendarBlock` y `ProductionEvent`.
 * Si `lock=true`, materializa el bloqueo dentro de una transacción ACID.
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(req.url);
    const parsed = AvailabilityQuerySchema.safeParse({
      date: searchParams.get('date') ?? '',
      artistProfileId: searchParams.get('artistProfileId') ?? undefined,
      productionId: searchParams.get('productionId') ?? undefined,
      lock: searchParams.get('lock') ?? undefined
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(', ') },
        { status: 400 }
      );
    }

    const { date, artistProfileId, productionId, lock } = parsed.data;

    if (lock === 'true') {
      const lockResult = await lockDateAtomically({
        eventDate: date,
        artistProfileId,
        productionEventId: productionId
      });

      return NextResponse.json(
        {
          ...lockResult,
          executionTimeMs: Date.now() - startTime
        },
        { status: lockResult.success ? 201 : 409 }
      );
    }

    const result = await checkDateAvailability({
      eventDate: date,
      artistProfileId,
      excludeProductionId: productionId
    });

    return NextResponse.json(
      {
        ...result,
        executionTimeMs: Date.now() - startTime
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/availability/check
 * Body: { date, artistProfileId?, productionId?, lock? }
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const parsed = AvailabilityQuerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(', ') },
        { status: 400 }
      );
    }

    const { date, artistProfileId, productionId, lock } = parsed.data;

    if (lock === 'true') {
      const lockResult = await lockDateAtomically({
        eventDate: date,
        artistProfileId,
        productionEventId: productionId
      });

      return NextResponse.json(
        { ...lockResult, executionTimeMs: Date.now() - startTime },
        { status: lockResult.success ? 201 : 409 }
      );
    }

    const result = await checkDateAvailability({
      eventDate: date,
      artistProfileId,
      excludeProductionId: productionId
    });

    return NextResponse.json(
      { ...result, executionTimeMs: Date.now() - startTime },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

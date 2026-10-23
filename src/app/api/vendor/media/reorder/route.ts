import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { VendorCrmRepository } from '@/lib/vendor/vendorCrmRepository';
import { resolveCurrentVendor } from '@/lib/vendor/vendorSession';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ReorderBody {
  orderedIds?: string[];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const vendor = await resolveCurrentVendor(req);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado o sesión no autorizada.' },
        { status: 401 },
      );
    }

    const body = (await req.json()) as ReorderBody;
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.some((id) => typeof id !== 'string')) {
      return NextResponse.json(
        { error: 'El cuerpo debe incluir un arreglo "orderedIds" con IDs válidos.' },
        { status: 400 },
      );
    }

    const repo = new VendorCrmRepository(prisma);
    const updatedCount = await repo.reorderMedia(vendor.id, orderedIds);

    return NextResponse.json({
      success: true,
      updatedCount,
      orderedIds,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    console.error('API /api/vendor/media/reorder ERROR:', message);
    return NextResponse.json(
      { error: 'Error interno al reordenar los archivos multimedia.' },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getActiveWhitelist, toggleProviderVisibility } from '@/lib/providers/visibility';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const whitelist = getActiveWhitelist();
    return NextResponse.json({
      success: true,
      data: whitelist
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error al obtener la whitelist de proveedores' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, slug, active } = body;

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, error: 'Se requiere id o slug del proveedor' },
        { status: 400 }
      );
    }

    const targetId = id || slug;
    const result = toggleProviderVisibility(targetId, slug, active);

    return NextResponse.json({
      success: result.success,
      active: result.active,
      providerId: targetId,
      active_ids: result.active_ids
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error al actualizar visibilidad' },
      { status: 500 }
    );
  }
}

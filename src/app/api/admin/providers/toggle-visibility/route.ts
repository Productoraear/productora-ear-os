import { NextRequest, NextResponse } from 'next/server';
import { getActiveWhitelist, toggleProviderVisibility } from '@/lib/providers/visibility';
import { requireAdmin } from '@/lib/security/adminGuard';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

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
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import routeGovernance from '@/data/governance/route_visibility.json';

/**
 * 🛡️ API HANDLER: GET / POST /api/admin/route-governance
 * Permite al Administrador consultar y alternar en caliente qué URLs
 * son accesibles para el público y cuáles quedan blindadas en exclusiva para el Administrador.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: routeGovernance
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, isPublic } = body;

    if (!path || typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos. Se requiere path (string) e isPublic (boolean).' },
        { status: 400 }
      );
    }

    const routeIndex = routeGovernance.routes.findIndex((r) => r.path === path);
    if (routeIndex === -1) {
      return NextResponse.json(
        { success: false, error: `La ruta ${path} no está registrada en el catálogo de gobernanza.` },
        { status: 404 }
      );
    }

    // Actualizar estado en memoria
    routeGovernance.routes[routeIndex].isPublic = isPublic;
    routeGovernance.governance.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Visibilidad de ${path} actualizada a: ${isPublic ? 'PÚBLICA' : 'SOLO_ADMINISTRADOR'}`,
      updatedRoute: routeGovernance.routes[routeIndex]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar gobernanza de rutas' },
      { status: 500 }
    );
  }
}

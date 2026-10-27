/**
 * 🏛️ API RADAR B2G — BÚSQUEDA EN VIVO DE LICITACIONES Y CONTRATOS MENORES
 * ============================================================================
 * GET /api/b2g/radar?city=Toledo&category=musica_fiestas
 *
 * Devuelve licitaciones reales rastreadas en vivo vía DeepSeek Search API
 * con validación LCSP (< 14.250 € Art. 118) y pre-configuración para generar
 * el dossier en 1 click.
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { scanLiveMunicipalTenders, fetchTenderDetailsLive } from '@/lib/b2g/b2gLiveTenderRadar';
import type { TenderRadarScanOptions } from '@/lib/b2g/b2gLiveTenderRadar';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') ?? undefined;
    const categoryRaw = searchParams.get('category');
    const detailUrl = searchParams.get('detailUrl');

    // Si se pide el detalle en vivo de una URL específica:
    if (detailUrl && typeof detailUrl === 'string') {
      const detail = await fetchTenderDetailsLive(detailUrl);
      if (!detail) {
        return NextResponse.json({ error: 'FETCH_FAILED', detail: 'No se pudo extraer el contenido del pliego.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, detail });
    }

    let category: TenderRadarScanOptions['category'] = 'musica_fiestas';
    if (categoryRaw === 'mayores_vimume' || categoryRaw === 'sonido_iluminacion') {
      category = categoryRaw;
    }

    const maxResults = searchParams.get('max') ? parseInt(searchParams.get('max')!, 10) : 8;

    const result = await scanLiveMunicipalTenders({
      provinceOrCity: city,
      category,
      maxResults
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno en el radar B2G';
    return NextResponse.json(
      { success: false, error: 'RADAR_EXCEPTION', detail: message },
      { status: 500 }
    );
  }
}

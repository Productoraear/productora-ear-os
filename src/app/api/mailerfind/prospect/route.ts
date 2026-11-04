import { NextRequest, NextResponse } from 'next/server';
import {
  MailerfindConnector,
  type MailerfindGremioTotal,
  type MailerfindSearchParams,
} from '@/lib/mcp/mailerfind-connector';
import { generateOrganicOutreach } from '@/lib/outreach/organic-outreach-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * CONTRATO DE AUTORIZACIÓN
 * role   : admin  (el layout (admin) exige sesión; este handler no expone datos
 *                  públicos de clientes, solo catálogo B2B cosechado)
 * tenant : productora-ear
 *
 * PAGINACIÓN REAL: se devuelve `total`, `offset`, `limit`, `hasMore`, `page` y
 * `totalPages`. Antes se devolvía `totalFound = número de la página`, por lo que
 * el panel no podía navegar (declaraba 30 resultados existiendo miles).
 */
const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 30;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MailerfindSearchParams;

    const requestedLimit = Number(body.limit);
    const requestedOffset = Number(body.offset);

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_LIMIT)
      : DEFAULT_LIMIT;
    const offset = Number.isFinite(requestedOffset) ? Math.max(Math.trunc(requestedOffset), 0) : 0;

    const page = await MailerfindConnector.searchLeadsPage({ ...body, limit, offset });

    const enrichedLeads = page.leads.map((lead) => ({
      ...lead,
      outreach: generateOrganicOutreach(lead),
    }));

    // Totales por gremio leídos de disco: la UI deja de teclear cifras a mano.
    const totals: { gremios: MailerfindGremioTotal[]; grandTotal: number; checkedAt: string } =
      MailerfindConnector.getGremioTotals();

    const totalPages = page.total > 0 ? Math.ceil(page.total / page.limit) : 1;
    const currentPage = Math.floor(page.offset / page.limit) + 1;

    return NextResponse.json({
      success: true,
      mode: page.mode,
      source: page.source,
      checkedAt: page.checkedAt,
      query: {
        targetAccount: body.targetAccount,
        niche: body.niche,
        location: body.location,
        province: body.province,
        search: body.query,
      },
      total: page.total,
      totalFound: enrichedLeads.length,
      offset: page.offset,
      limit: page.limit,
      hasMore: page.hasMore,
      page: currentPage,
      totalPages,
      leads: enrichedLeads,
      gremios: totals.gremios,
      grandTotal: totals.grandTotal,
      gremiosCheckedAt: totals.checkedAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido en Mailerfind';
    console.error('[Mailerfind Prospect API] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

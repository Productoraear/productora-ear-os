import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 2048;

function cleanStr(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  // eslint-disable-next-line no-control-regex
  const v = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
  return v.length > 0 ? v : null;
}

/**
 * Receptor de contexto del concierge de WhatsApp. Reenvia a n8n solo si
 * N8N_WHATSAPP_WEBHOOK_URL esta definida; si no, responde 204 sin efectos.
 * Nunca devuelve error al navegador (no debe afectar a la navegacion).
 */
export async function POST(req: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const raw = await req.text();
    if (raw.length === 0 || raw.length > MAX_BODY_BYTES) {
      return new NextResponse(null, { status: 204, headers });
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return new NextResponse(null, { status: 204, headers });
    }
    const b = parsed as Record<string, unknown>;
    const total = typeof b.estimatedTotal === 'number' && Number.isFinite(b.estimatedTotal) ? b.estimatedTotal : null;
    const hitl = typeof b.hitlThreshold === 'number' && Number.isFinite(b.hitlThreshold) ? b.hitlThreshold : null;

    const context = {
      source: 'productoraear.com',
      pathname: cleanStr(b.pathname, 200),
      providerName: cleanStr(b.providerName, 120),
      category: cleanStr(b.category, 80),
      estimatedTotal: total,
      timestamp: cleanStr(b.timestamp, 40),
      action: cleanStr(b.action, 80),
      showcaseUrl: cleanStr(b.showcaseUrl, 300),
      providerId: cleanStr(b.providerId, 60),
      hitlThreshold: hitl,
    };

    const url = process.env.N8N_WHATSAPP_WEBHOOK_URL;
    if (url && /^https:\/\//.test(url)) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
        signal: AbortSignal.timeout(3000),
      }).catch(() => undefined);
    }
  } catch {
    /* silencioso */
  }
  return new NextResponse(null, { status: 204, headers });
}

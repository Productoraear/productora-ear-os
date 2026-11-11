/**
 * ESPEJO de compatibilidad (W53_T04) — ruta declarada originalmente en la cola.
 * GET /api/career/connect/[platform]
 *
 * La ruta canónica vive en `/api/artist/career/connect/[provider]` (junto a
 * metrics y upload del Career OS). Este fichero REEXPORTA el mismo motor: no
 * duplica lógica ni puede divergir en seguridad.
 *
 * POR QUÉ NO SE REEXPORTA EL HANDLER TAL CUAL (corregido 2026-11-11):
 * un `export { GET } from …` propaga la FIRMA del original
 * (`ctx.params: Promise<{ provider: string }>`). Bajo el validador de tipos de
 * ruta de Next — que exige el nombre del segmento de ESTA carpeta (`platform`) —
 * eso rompía `tsc --noEmit` (TS2344). Aquí se adapta el segmento y se delega en
 * el handler canónico, de modo que la seguridad (state HMAC + TTL) sigue
 * viviendo en un único sitio: `src/lib/career/oauth-flow.ts`.
 */
import type { NextResponse } from 'next/server';

import { GET as canonicalGET, POST as canonicalPOST, dynamic, runtime } from '@/app/api/artist/career/connect/[provider]/route';

export { dynamic, runtime };

/** Adaptador de segmento: `platform` (contrato de la cola) → `provider` (motor). */
export function GET(
  request: Request,
  ctx: { params: Promise<{ platform: string }> },
): Promise<NextResponse> {
  const adapted: { params: Promise<{ provider: string }> } = {
    params: ctx.params.then((value) => ({ provider: value.platform })),
  };
  return canonicalGET(request, adapted);
}

/** 405 idéntico al canónico: el espejo no abre un verbo que la ruta no permite. */
export function POST(): NextResponse {
  return canonicalPOST();
}

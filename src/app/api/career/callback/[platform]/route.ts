/**
 * ESPEJO de compatibilidad (W53_T04) — ruta declarada originalmente en la cola.
 * GET /api/career/callback/[platform]
 *
 * Delega en el handler canónico de `/api/artist/career/callback/[provider]`:
 * una sola implementación de la validación CSRF y del cifrado en reposo.
 *
 * POR QUÉ NO SE REEXPORTA EL HANDLER TAL CUAL (corregido 2026-11-11):
 * el reexport propagaba la firma del original (`params: { provider }`) mientras
 * el validador de rutas de Next exige el segmento de ESTA carpeta (`platform`),
 * rompiendo `tsc --noEmit` (TS2344). Se adapta el segmento y no se duplica lógica.
 */
import type { NextResponse } from 'next/server';

import { GET as canonicalGET, POST as canonicalPOST, dynamic, runtime } from '@/app/api/artist/career/callback/[provider]/route';

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

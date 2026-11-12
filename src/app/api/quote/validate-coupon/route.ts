/**
 * ════════════════════════════════════════════════════════════════════════════
 * POST /api/quote/validate-coupon — VALIDACIÓN DE CUPÓN DE AFILIADO
 * ════════════════════════════════════════════════════════════════════════════
 * El simulador NO decide por sí mismo si un código de afiliado es válido: envía
 * el código aquí y este handler lo resuelve contra el padrón real en disco.
 *
 * SEC-1 (default-deny): primero el caso negativo. Sin body JSON → 400. Código
 * vacío → 400. Código inexistente/inactivo → 200 con `valido:false` y motivo,
 * para que la UI muestre el estado honesto sin romper el flujo de compra.
 *
 * AF-1: la respuesta declara siempre `probed`, `source`, `mode` y `checkedAt`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import { listActiveAffiliateCoupons } from '@/lib/affiliate/affiliate-registry';
import {
  validarCuponAfiliado,
  SUELO_SOLISTA_EUR,
  TARIFA_SOLISTA_EUR,
  type CuponRechazoMotivo,
} from '@/lib/pricing/solista-pricing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ValidateCouponBody {
  readonly code?: unknown;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'INVALID_JSON',
        detail: 'El body debe ser JSON válido.',
        probed: true,
        source: 'live' as const,
        mode: 'REAL' as const,
        checkedAt: new Date().toISOString(),
      },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      {
        ok: false,
        error: 'INVALID_BODY',
        detail: 'El body debe ser un objeto JSON con el campo `code`.',
        probed: true,
        source: 'live' as const,
        mode: 'REAL' as const,
        checkedAt: new Date().toISOString(),
      },
      { status: 400 },
    );
  }

  const { code } = body as ValidateCouponBody;

  if (typeof code !== 'string' || code.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: 'CODE_REQUIRED', detail: 'Falta el código de afiliado.' },
      { status: 400 },
    );
  }

  // Lectura real del padrón en disco (nunca una cifra inventada).
  const afiliados = listActiveAffiliateCoupons();
  const resultado = validarCuponAfiliado(code, afiliados);

  const mensajePorMotivo: Record<CuponRechazoMotivo, string> = {
    VACIO: 'Introduce un código de afiliado.',
    FORMATO_INVALIDO: 'El código no tiene el formato canónico EAR-<ENTIDAD>-<SUFIJO>.',
    NO_EXISTE: 'El código no figura en el padrón de afiliados homologados.',
    INACTIVO: 'El afiliado existe pero no está activo. Contacta con la Centralita.',
  };

  return NextResponse.json(
    {
      ok: true,
      valido: resultado.valido,
      code: resultado.codigoNormalizado,
      motivo: resultado.motivo ?? null,
      mensaje: resultado.valido
        ? `Cupón válido (${resultado.afiliadoNombre ?? 'afiliado homologado'}): Pack Solista Premium ${SUELO_SOLISTA_EUR.toFixed(2).replace('.', ',')} €.`
        : mensajePorMotivo[resultado.motivo ?? 'NO_EXISTE'],
      afiliado: resultado.valido ? (resultado.afiliadoNombre ?? null) : null,
      descuentoEur: resultado.descuentoEur,
      tarifaEstandarEur: TARIFA_SOLISTA_EUR,
      sueloEur: SUELO_SOLISTA_EUR,
      afiliadosRegistrados: afiliados.length,
      probed: true,
      source: 'live' as const,
      mode: 'REAL' as const,
      checkedAt: new Date().toISOString(),
    },
    { status: 200 },
  );
}

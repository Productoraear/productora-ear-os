/**
 * ════════════════════════════════════════════════════════════════════════════
 * /api/vimume/rsc-certificate · CERTIFICADO 40 Hz + MECENAZGO LEY 49/2002
 * ════════════════════════════════════════════════════════════════════════════
 * role   : public (POST de captación · GET catálogo)
 *          cron   (GET ?scope=telemetry · GET ?scope=diagnostics · POST ?action=retry)
 * tenant : public-web
 *
 * Contrato de respuesta: SIEMPRE `{ ok, error?, data? }`. Ninguna excepción cruda
 * cruza el borde (defensa en profundidad).
 *
 * La ruta NACE CERRADA (SEC-1): todo lo que expone estado interno exige
 * CRON_SECRET y falla cerrada (503 si el despliegue no tiene el secreto, 401 si
 * no coincide) a través de `cronSecretGuard`, que compara en tiempo constante.
 *
 * Casos negativos cubiertos:
 *  · cuerpo > 32 KB → 413 · JSON inválido → 400 · esquema inválido → 422
 *  · > 20 peticiones por IP y ventana de 10 min → 429 con Retry-After
 *  · techo Art. 118 LCSP, DIR3 ausente, pliego ausente o SPL > 75 dB → 422
 *  · `?scope` desconocido → 400 (no se adivina la intención del cliente)
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { describeCronAuthFailure, verifyCronSecret } from '@/lib/security/cronSecretGuard';
import {
  RSC_CHANNELS,
  VIMUME_PRESET_IDS,
  getVimumeRscCatalogue,
  getVimumeRscTelemetry,
  isDonorType,
  isRscChannel,
  isVimumeProgramPreset,
  issueVimumeRscCertificate,
  retryVimumeCertificate,
  runVimumeRscDiagnostics,
  type DonorType,
  type RscCertificateRequest,
  type RscChannel,
  type VimumeProgramPreset
} from '@/lib/vimume/b2g-tender-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Techo de cuerpo: el certificado completo es ~12 KB; 32 KB deja aire y corta abuso. */
const MAX_BODY_BYTES = 32 * 1024;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_BUCKET_HARD_CAP = 5000;

/**
 * Ventana deslizante en memoria por IP. Alcance `process-local` declarado: en un
 * despliegue multi-réplica cada réplica cuenta por su cuenta (el límite efectivo
 * es N × réplicas). Suficiente para frenar un bucle de formulario, no un DDoS:
 * eso se corta en el proxy.
 */
const rateBuckets = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded !== null) {
    const first = forwarded.split(',')[0];
    if (typeof first === 'string' && first.trim().length > 0) {
      return first.trim();
    }
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp !== null && realIp.trim().length > 0 ? realIp.trim() : 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  if (rateBuckets.size > RATE_BUCKET_HARD_CAP) {
    rateBuckets.clear();
  }

  const now = Date.now();
  const hits = (rateBuckets.get(ip) ?? []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateBuckets.set(ip, hits);
    return { allowed: false, remaining: 0 };
  }

  hits.push(now);
  rateBuckets.set(ip, hits);
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - hits.length };
}

/**
 * Esquema de borde: nada entra sin validar (SEC-4).
 * Los enums NO se declaran aquí: se delegan en los type-guards del motor
 * (`isRscChannel`, `isVimumeProgramPreset`, `isDonorType`) para que la lista de
 * valores válidos tenga un único dueño y no derive en dos verdades.
 */
const certificateRequestSchema = z.object({
  channel: z.string().trim().min(1).max(10),
  entityName: z.string().trim().min(3).max(160),
  department: z.string().trim().max(160).optional(),
  cif: z.string().trim().max(20).optional(),
  dir3Code: z.string().trim().max(20).optional(),
  pliegoRef: z.string().trim().max(120).optional(),
  programPreset: z.string().trim().min(1).max(40),
  customBudget: z.number().finite().positive().max(1_000_000).optional(),
  targetCentresCount: z.number().int().min(1).max(200).optional(),
  asistentesPorSesion: z.number().int().min(1).max(5000).optional(),
  donorType: z.string().trim().max(30).optional(),
  recurring: z.boolean().optional(),
  splDbPropuesto: z.number().min(40).max(120).optional(),
  contactEmail: z.string().trim().max(160).optional()
});

/** Traduce el prefijo del error del motor a su código HTTP. */
function statusForEngineError(error?: string): number {
  if (error === undefined || error.length === 0) {
    return 500;
  }

  const code = error.split(':')[0].trim();

  switch (code) {
    case 'EXPEDIENTE_NO_ENCONTRADO':
      return 404;
    case 'VALIDACION':
    case 'IMPORTE_INVALIDO':
    case 'PLIEGO_REQUERIDO':
    case 'DIR3_REQUERIDO':
    case 'TECHO_PREVENTIVO_EXCEDIDO':
    case 'BASE_INVALIDA':
    case 'SPL_INVALIDO':
    case 'ASISTENTES_INVALIDO':
    case 'AFORO_FUERA_DE_RANGO':
    case 'RECHAZADO_SOBRE_LIMITE':
    case 'RECHAZADO_FUERA_CONFORT':
    case 'DONATIVO_INVALIDO':
    case 'DONATIVO_FUERA_DE_RANGO':
    case 'DONANTE_INVALIDO':
      return 422;
    default:
      return 500;
  }
}

function jsonResult<T>(
  ok: boolean,
  error: string | undefined,
  data: T | undefined,
  status: number
): NextResponse {
  return NextResponse.json({ ok, error, data }, { status, headers: { 'Cache-Control': 'no-store' } });
}

// ════ FIN CABECERA DE RUTA ════

/**
 * GET — catálogo público (sin credencial) · telemetría y diagnóstico (cron).
 * El catálogo tiene caché pública porque es estático respecto al SSOT; la
 * telemetría jamás se cachea (sería una mentira con fecha anterior).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    if (scope === null || scope === 'catalogue') {
      return NextResponse.json(
        { ok: true, data: getVimumeRscCatalogue() },
        {
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'
          }
        }
      );
    }

    if (scope === 'telemetry' || scope === 'diagnostics') {
      const verdict = verifyCronSecret(request);

      if (!verdict.ok) {
        return NextResponse.json(describeCronAuthFailure(verdict), { status: verdict.status });
      }

      if (scope === 'diagnostics') {
        const report = await runVimumeRscDiagnostics();
        const succeeded = report.status === 'SUCCESS';

        return jsonResult(
          succeeded,
          succeeded ? undefined : 'DIAGNOSTICO_FALLIDO: revisa los ❌ del informe.',
          report,
          succeeded ? 200 : 500
        );
      }

      return NextResponse.json(
        { ok: true, data: getVimumeRscTelemetry() },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return jsonResult(
      false,
      `VALIDACION: scope desconocido (${scope}). Admitidos: catalogue, telemetry, diagnostics.`,
      undefined,
      400
    );
  } catch (reason) {
    return jsonResult(
      false,
      `ERROR_INTERNO: ${reason instanceof Error ? reason.message : String(reason)}`,
      undefined,
      500
    );
  }
}

/**
 * POST — emite el certificado (idempotente) o reintenta su entrega.
 * `?action=retry` es una operación de operador: exige CRON_SECRET y NO crea fila.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const rawBody = await request.text();

    if (rawBody.length > MAX_BODY_BYTES) {
      return jsonResult(
        false,
        `CUERPO_EXCESIVO: el cuerpo supera ${MAX_BODY_BYTES} bytes. Un certificado completo ocupa ~12 KB.`,
        undefined,
        413
      );
    }

    let payload: unknown = {};
    if (rawBody.trim().length > 0) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return jsonResult(false, 'VALIDACION: el cuerpo no es JSON válido.', undefined, 400);
      }
    }

    if (action === 'retry') {
      const verdict = verifyCronSecret(request);

      if (!verdict.ok) {
        return NextResponse.json(describeCronAuthFailure(verdict), { status: verdict.status });
      }

      const candidate =
        typeof payload === 'object' && payload !== null && !Array.isArray(payload)
          ? (payload as Record<string, unknown>).idempotencyKey
          : undefined;

      if (typeof candidate !== 'string') {
        return jsonResult(
          false,
          'VALIDACION: falta `idempotencyKey` en el cuerpo del reintento.',
          undefined,
          422
        );
      }

      const retried = await retryVimumeCertificate(candidate);

      return jsonResult(
        retried.ok,
        retried.error,
        retried.data,
        retried.ok ? 200 : statusForEngineError(retried.error)
      );
    }

    const ip = getClientIp(request);
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'RATE_LIMIT: demasiadas solicitudes de certificado desde esta IP. ' +
            'Espera 10 minutos o escríbenos por WhatsApp para tramitarlo a mano.'
        },
        { status: 429, headers: { 'Retry-After': '600', 'Cache-Control': 'no-store' } }
      );
    }

    const parsed = certificateRequestSchema.safeParse(payload);

    if (!parsed.success) {
      const issues = parsed.error.issues.slice(0, 6).map((issue) => {
        const path = issue.path !== undefined && issue.path.length > 0 ? issue.path.join('.') : 'body';
        return `${path}: ${issue.message}`;
      });

      return jsonResult(false, `VALIDACION: ${issues.join(' | ')}`, undefined, 422);
    }

    const body = parsed.data;

    // Segunda barrera: los valores cerrados se comprueban con los type-guards del
    // motor, no con una copia de la lista. Si mañana entra un canal nuevo, entra
    // en un solo sitio y este borde lo acepta sin tocar nada.
    const channelValue: string = body.channel;
    if (!isRscChannel(channelValue)) {
      return jsonResult(
        false,
        `VALIDACION: canal desconocido (${channelValue}). Admitidos: ${RSC_CHANNELS.join(', ')}.`,
        undefined,
        422
      );
    }
    const channel: RscChannel = channelValue;

    const presetValue: string = body.programPreset;
    if (!isVimumeProgramPreset(presetValue)) {
      return jsonResult(
        false,
        `VALIDACION: programa desconocido (${presetValue}). Admitidos: ${VIMUME_PRESET_IDS.join(', ')}.`,
        undefined,
        422
      );
    }
    const programPreset: VimumeProgramPreset = presetValue;

    let donorType: DonorType | undefined;
    if (body.donorType !== undefined && body.donorType.length > 0) {
      if (!isDonorType(body.donorType)) {
        return jsonResult(
          false,
          'VALIDACION: tipo de donante no válido. Admitidos: PERSONA_FISICA, PERSONA_JURIDICA.',
          undefined,
          422
        );
      }
      donorType = body.donorType;
    }

    const certRequest: RscCertificateRequest = {
      channel,
      entityName: body.entityName,
      department: body.department,
      cif: body.cif,
      dir3Code: body.dir3Code,
      pliegoRef: body.pliegoRef,
      programPreset,
      customBudget: body.customBudget,
      targetCentresCount: body.targetCentresCount,
      asistentesPorSesion: body.asistentesPorSesion,
      donorType,
      recurring: body.recurring,
      splDbPropuesto: body.splDbPropuesto,
      contactEmail: body.contactEmail
    };

    const issued = await issueVimumeRscCertificate(certRequest);

    return jsonResult(
      issued.ok,
      issued.error,
      issued.data,
      issued.ok ? 200 : statusForEngineError(issued.error)
    );
  } catch (reason) {
    return jsonResult(
      false,
      `ERROR_INTERNO: ${reason instanceof Error ? reason.message : String(reason)}`,
      undefined,
      500
    );
  }
}

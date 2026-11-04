import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import type Stripe from 'stripe';
import {
  buildProviderServiceBrief,
  buildProviderWhatsappUrl,
  type ProviderBriefFicha,
  type ProviderBriefInput,
  type ProviderBriefPayment,
  type ProviderBriefState,
  type ProviderPaymentStatus,
} from '@/lib/booking/provider-service-brief';
import { ACCEPTANCE_SLA_MS, signAcceptanceToken } from '@/lib/booking/acceptance-token';
import { calculateSovereignQuote, type FormatType } from '@/lib/pricing/sovereign-pricing';
import { generateSmartContract } from '@/lib/contracts/smartContractEngine';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { getStripe } from '@/lib/payments';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

/**
 * POST /api/booking/provider-brief
 * ---------------------------------------------------------------------------
 * ÚLTIMO PASO ANTES DE LA FIRMA. Entrega al proveedor la ficha de servicio de
 * precisión milimétrica (cuándo, dónde, qué/para qué, quién, invitados, rider,
 * dinero y su único paso: firmar) y SOLO la valida si el depósito existe y se
 * cobró dentro de las 2 h desde la solicitud.
 *
 * Autorización (SEC-1/SEC-2 · nace cerrada):
 *   role: cron | admin      tenant: ear-os
 *   Requiere `x-ear-secret` (o `Authorization: Bearer`) con un secreto de
 *   servidor de ≥ 16 caracteres. Sin secreto configurado → 503 fail-closed.
 *
 * Códigos de salida (nunca optimistas):
 *   200  ficha VALIDADA (pago verificado + datos completos) → despachable
 *   402  depósito pendiente (la ficha se emite, NO se firma, NO se despacha)
 *   409  pago fuera de plazo / importe no coincide con el depósito SSOT
 *   410  ventana de 2 h vencida sin pago
 *   422  ficha incompleta (se devuelve exactamente qué falta)
 *   503  Stripe o secreto no disponibles (fail-closed)
 * ---------------------------------------------------------------------------
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CENTRALITA_DIGITS = '34693693048';
const ID_PATTERN = /^[A-Za-z0-9_-]{3,100}$/;
const MAX_TEXT = 400;
const MAX_NOTES = 600;

function resolveBriefSecret(): string | null {
  const secret =
    process.env.BOOKING_BRIEF_SECRET ??
    process.env.BOOKING_TOKEN_SECRET ??
    process.env.CRON_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

function isAuthorized(req: NextRequest, secret: string): boolean {
  const headerSecret = req.headers.get('x-ear-secret');
  const authorization = req.headers.get('authorization');
  const bearer =
    authorization && authorization.toLowerCase().startsWith('bearer ')
      ? authorization.slice(7).trim()
      : null;
  const provided = headerSecret ?? bearer;
  if (!provided || provided.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(provided, 'utf8'), Buffer.from(secret, 'utf8'));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Anti-XSS de borde (SEC-4): sin ángulos ni caracteres de control. */
function readText(source: Record<string, unknown>, key: string, max: number): string | undefined {
  const raw = source[key];
  if (typeof raw !== 'string') return undefined;
  const clean = raw
    .split('<')
    .join('')
    .split('>')
    .join('')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, max);
  return clean.length > 0 ? clean : undefined;
}

function readInt(source: Record<string, unknown>, key: string): number | undefined {
  const raw = source[key];
  if (typeof raw === 'number' && Number.isInteger(raw)) return raw;
  if (typeof raw === 'string' && /^\d{1,5}$/.test(raw)) return Number(raw);
  return undefined;
}

function readNumber(source: Record<string, unknown>, key: string): number | undefined {
  const raw = source[key];
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && /^\d{1,7}(?:[.,]\d{1,4})?$/.test(raw)) {
    return Number(raw.replace(',', '.'));
  }
  return undefined;
}

function readRecord(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const raw = source[key];
  return isRecord(raw) ? raw : {};
}

function readFormat(source: Record<string, unknown>): FormatType | null {
  const raw = readText(source, 'format', 20);
  if (raw === 'solista' || raw === 'trio' || raw === 'quinteto') return raw;
  return null;
}

interface FichaParseResult {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly ficha: ProviderBriefFicha | null;
  readonly requestedAt: string | null;
  readonly totalEur: number | undefined;
  readonly depositEur: number;
  readonly setupMinutes: number | undefined;
}

function parseFicha(body: Record<string, unknown>): FichaParseResult {
  const errors: string[] = [];

  const requestId = readText(body, 'requestId', 100);
  if (!requestId || !ID_PATTERN.test(requestId)) errors.push('requestId');

  const requestedAtRaw = readText(body, 'requestedAt', 40);
  const requestedAtMs = requestedAtRaw ? Date.parse(requestedAtRaw) : Number.NaN;
  if (!Number.isFinite(requestedAtMs)) errors.push('requestedAt');

  const provider = readRecord(body, 'provider');
  const providerId = readText(provider, 'id', 100);
  const providerName = readText(provider, 'name', MAX_TEXT);
  if (!providerId || !ID_PATTERN.test(providerId)) errors.push('provider.id');
  if (!providerName) errors.push('provider.name');

  const client = readRecord(body, 'client');
  const event = readRecord(body, 'event');

  const depositRaw = readNumber(body, 'depositEur');
  const depositEur =
    typeof depositRaw === 'number' && depositRaw > 0 ? depositRaw : DEPOSITO_STRIPE_EUR;

  // Importe: declarado por el Price-Lock o recomputado con el motor SSOT.
  let totalEur = readNumber(body, 'totalEur');
  if (totalEur === undefined) {
    const format = readFormat(body);
    const distanceKm = readNumber(body, 'distanceKm') ?? 0;
    if (format !== null) {
      totalEur = calculateSovereignQuote({ format, distanceKm, soundRider: 'standard' }).totalBudget;
    }
  }

  if (errors.length > 0 || !requestId || !providerId || !providerName || !Number.isFinite(requestedAtMs)) {
    return {
      ok: false,
      errors,
      ficha: null,
      requestedAt: null,
      totalEur,
      depositEur,
      setupMinutes: undefined,
    };
  }

  const ficha: ProviderBriefFicha = {
    requestId,
    reference: readText(body, 'reference', 60),
    provider: {
      id: providerId,
      name: providerName,
      category: readText(provider, 'category', 120),
      email: readText(provider, 'email', 160),
      phone: readText(provider, 'phone', 30),
      address: readText(provider, 'address', MAX_TEXT),
      taxId: readText(provider, 'taxId', 30),
      stageName: readText(provider, 'stageName', MAX_TEXT),
    },
    clientName: readText(client, 'name', MAX_TEXT),
    clientPhone: readText(client, 'phone', 30),
    clientEmail: readText(client, 'email', 160),
    eventType: readText(event, 'type', 120),
    eventPurpose: readText(event, 'purpose', 200),
    eventDate: readText(event, 'date', 40),
    startTime: readText(event, 'startTime', 5),
    durationHours: readNumber(event, 'durationHours'),
    venueName: readText(event, 'venueName', MAX_TEXT),
    venueAddress: readText(event, 'venueAddress', MAX_TEXT),
    city: readText(event, 'city', 120),
    province: readText(event, 'province', 120),
    guests: readInt(event, 'guests'),
    childrenCount: readInt(event, 'childrenCount'),
    isIndoor: typeof event.isIndoor === 'boolean' ? event.isIndoor : undefined,
    serviceFormat: readText(event, 'serviceFormat', 160),
    riderNotes: readText(body, 'riderNotes', MAX_NOTES),
    parkingNotes: readText(body, 'parkingNotes', 200),
  };

  return {
    ok: true,
    errors: [],
    ficha,
    requestedAt: new Date(requestedAtMs).toISOString(),
    totalEur,
    depositEur,
    setupMinutes: readInt(body, 'setupMinutes'),
  };
}

interface PaymentResolution {
  readonly payment: ProviderBriefPayment;
  readonly source: 'stripe' | 'declarado' | 'ninguno';
  readonly stripeStatus: string | null;
  readonly fatal: { readonly status: number; readonly code: string; readonly message: string } | null;
}

/**
 * Trae la prueba de pago. Sin sesión de Stripe NO hay `paid`: un "pagado"
 * declarado por el cliente es exactamente la fachada que esta ruta prohíbe.
 */
async function resolvePayment(
  body: Record<string, unknown>,
  depositEur: number,
): Promise<PaymentResolution> {
  const paymentRecord = readRecord(body, 'payment');
  const sessionId = readText(paymentRecord, 'stripeSessionId', 120);
  const declaredStatus = readText(paymentRecord, 'status', 20);
  const declaredPaidAt = readText(paymentRecord, 'paidAt', 40);

  if (!sessionId) {
    if (declaredStatus === 'paid') {
      return {
        payment: { status: 'pending', paidAt: null, sessionId: null },
        source: 'declarado',
        stripeStatus: null,
        fatal: {
          status: 402,
          code: 'SIN_PRUEBA_DE_PAGO',
          message: 'Un pago declarado sin sesión de Stripe no valida la reserva.',
        },
      };
    }
    return {
      payment: { status: 'none', paidAt: null, sessionId: null },
      source: 'ninguno',
      stripeStatus: null,
      fatal: null,
    };
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : String(reason);
    return {
      payment: { status: 'pending', paidAt: null, sessionId },
      source: 'ninguno',
      stripeStatus: null,
      fatal: {
        status: 503,
        code: 'STRIPE_NO_DISPONIBLE',
        message: `No se pudo verificar el pago en Stripe (${message}).`,
      },
    };
  }

  const amountCents = typeof session.amount_total === 'number' ? session.amount_total : null;
  const expectedCents = Math.round(depositEur * 100);
  if (amountCents === null || amountCents !== expectedCents) {
    return {
      payment: { status: 'pending', paidAt: null, sessionId },
      source: 'stripe',
      stripeStatus: session.payment_status ?? null,
      fatal: {
        status: 409,
        code: 'IMPORTE_NO_COINCIDE',
        message: `El pago verificado (${(amountCents ?? 0) / 100} €) no cubre el depósito SSOT (${depositEur} €).`,
      },
    };
  }

  const paid = session.payment_status === 'paid';
  const status: ProviderPaymentStatus = paid
    ? 'paid'
    : session.status === 'expired'
      ? 'failed'
      : 'pending';

  const declaredPaidMs = declaredPaidAt ? Date.parse(declaredPaidAt) : Number.NaN;
  const paidAt = paid
    ? Number.isFinite(declaredPaidMs)
      ? new Date(declaredPaidMs).toISOString()
      : new Date(session.created * 1000).toISOString()
    : null;

  return {
    payment: {
      status,
      amountEur: amountCents / 100,
      paidAt,
      sessionId,
    },
    source: 'stripe',
    stripeStatus: session.payment_status ?? null,
    fatal: null,
  };
}

const STATE_STATUS: Readonly<Record<ProviderBriefState, number>> = {
  VALIDADO: 200,
  PENDIENTE_PAGO: 402,
  EXPIRADO_SIN_PAGO: 410,
  PAGO_FUERA_DE_PLAZO: 409,
  FICHA_INCOMPLETA: 422,
};

/** Un GET no entrega fichas: la ruta nace cerrada también en el método. */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: 'METODO_NO_PERMITIDO', message: 'Usa POST con autenticación de servidor.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = resolveBriefSecret();
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error: 'BRIEF_SECRET_NO_CONFIGURADO',
        message: 'BOOKING_BRIEF_SECRET / BOOKING_TOKEN_SECRET / CRON_SECRET no configurado (fail-closed).',
      },
      { status: 503 },
    );
  }

  if (!isAuthorized(req, secret)) {
    return NextResponse.json(
      { ok: false, error: 'NO_AUTORIZADO', message: 'Credencial de servidor ausente o inválida.' },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'JSON_INVALIDO', message: 'Cuerpo JSON malformado.' },
      { status: 400 },
    );
  }

  if (!isRecord(payload)) {
    return NextResponse.json(
      { ok: false, error: 'FICHA_MALFORMADA', invalidFields: ['body'] },
      { status: 422 },
    );
  }

  const parsed = parseFicha(payload);
  if (!parsed.ok || parsed.ficha === null || parsed.requestedAt === null) {
    return NextResponse.json(
      { ok: false, error: 'FICHA_MALFORMADA', invalidFields: parsed.errors },
      { status: 422 },
    );
  }

  const paymentResolution = await resolvePayment(payload, parsed.depositEur);
  if (paymentResolution.fatal !== null) {
    return NextResponse.json(
      {
        ok: false,
        error: paymentResolution.fatal.code,
        message: paymentResolution.fatal.message,
        paymentSource: paymentResolution.source,
        stripeStatus: paymentResolution.stripeStatus,
      },
      { status: paymentResolution.fatal.status },
    );
  }

  const nowMs = Date.now();
  const token = signAcceptanceToken({
    requestId: parsed.ficha.requestId,
    providerId: parsed.ficha.provider.id,
    timestamp: nowMs,
  });

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    'https://www.productoraear.com'
  ).replace(/\/+$/, '');

  const signatureUrl =
    token === null ? null : `${baseUrl}/api/booking/accept?token=${encodeURIComponent(token)}`;
  const signatureExpiresAt = token === null ? null : new Date(nowMs + ACCEPTANCE_SLA_MS).toISOString();

  const briefInput: ProviderBriefInput = {
    ficha: parsed.ficha,
    payment: paymentResolution.payment,
    requestedAt: parsed.requestedAt,
    now: new Date(nowMs).toISOString(),
    totalEur: parsed.totalEur,
    depositEur: parsed.depositEur,
    setupMinutes: parsed.setupMinutes,
    signatureUrl,
    signatureExpiresAt,
  };

  const brief = buildProviderServiceBrief(briefInput);
  const providerPhone = parsed.ficha.provider.phone ?? CENTRALITA_DIGITS;
  const whatsappUrl = brief.dispatchAllowed
    ? buildProviderWhatsappUrl(providerPhone, brief.text)
    : null;

  // Contrato que el proveedor firma: se previsualiza con el MISMO contenido que
  // la ficha y se sella con `briefHash` para que no existan dos versiones.
  let contract: {
    readonly contractId: string;
    readonly status: string;
    readonly sha256Hash: string;
    readonly totalAmount: number;
    readonly depositDeducted: number;
    readonly remainingToPay: number;
  } | null = null;
  let contractError: string | null = null;

  if (brief.signatureAllowed && brief.contractSeed !== null) {
    try {
      const document = generateSmartContract({
        requestId: brief.contractSeed.requestId,
        client: brief.contractSeed.client,
        provider: brief.contractSeed.provider,
        eventDetails: brief.contractSeed.eventDetails,
        baseAmount: brief.contractSeed.baseAmount,
        depositPaid: brief.contractSeed.depositPaid,
      });
      contract = {
        contractId: document.contractId,
        status: document.status,
        sha256Hash: document.sha256Hash,
        totalAmount: document.financials.totalAmount,
        depositDeducted: document.financials.depositDeducted,
        remainingToPay: document.financials.remainingToPay,
      };
    } catch (reason) {
      contractError = reason instanceof Error ? reason.message : String(reason);
    }
  }

  const generatedAt = new Date(nowMs).toISOString();

  // Despacho no bloqueante SIN datos personales (INV-14): solo identificadores,
  // veredicto y sello. El texto de la ficha viaja por el canal del proveedor.
  fireAndForgetN8n('call-center-intake', {
    kind: 'provider_service_brief',
    requestId: parsed.ficha.requestId,
    reference: parsed.ficha.reference ?? parsed.ficha.requestId,
    providerId: parsed.ficha.provider.id,
    state: brief.state,
    paymentState: brief.paymentState,
    dispatchAllowed: brief.dispatchAllowed,
    signatureAllowed: brief.signatureAllowed,
    briefSha256: brief.briefHash,
    briefChars: brief.chars,
    missingCount: brief.missing.length,
    generatedAt,
  });

  return NextResponse.json(
    {
      ok: brief.state === 'VALIDADO',
      mode: 'REAL',
      probed: true,
      source: 'live',
      state: brief.state,
      paymentState: brief.paymentState,
      dispatchAllowed: brief.dispatchAllowed,
      signatureAllowed: brief.signatureAllowed,
      missing: brief.missing,
      brief: {
        text: brief.text,
        chars: brief.chars,
        sha256: brief.briefHash,
        blocks: brief.blocks.length,
      },
      paymentWindow: brief.paymentWindow,
      payment: {
        source: paymentResolution.source,
        stripeStatus: paymentResolution.stripeStatus,
        amountEur: paymentResolution.payment.amountEur ?? null,
      },
      signature: signatureUrl === null ? null : { url: signatureUrl, expiresAt: signatureExpiresAt },
      contract,
      contractError,
      whatsappUrl,
      generatedAt,
    },
    { status: STATE_STATUS[brief.state] },
  );
}

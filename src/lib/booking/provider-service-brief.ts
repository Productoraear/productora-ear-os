/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — FICHA DE SERVICIO AL PROVEEDOR (PROVIDER SERVICE BRIEF)
 * ════════════════════════════════════════════════════════════════════════════
 * Sustituye el mensaje promocional ("Centralita Uber", bonos, garantías y
 * superlativos) por una ficha operativa de precisión milimétrica con orden
 * fijo: CUÁNDO · DÓNDE · QUÉ/PARA QUÉ · QUIÉN · INVITADOS · RIDER · DINERO ·
 * EL ÚNICO PASO QUE QUEDA (firmar el contrato que acepta el servicio).
 *
 * Reglas no negociables (Ω-DIAMANTE):
 *  1. Cero marketing: si una línea no ayuda a prestar el servicio, no existe.
 *  2. Cero invención: el dato ausente se imprime como `❌ falta` y entra en
 *     `missing[]`. Una ficha incompleta NO se despacha ni se firma.
 *  3. El pago manda: solo hay estado VALIDADO si el depósito existe y se cobró
 *     dentro de la ventana de 2 h (`PAYMENT_WINDOW_MS`) desde la solicitud.
 *  4. Trazabilidad: `briefHash` (SHA-256) sella la ficha y viaja al contrato
 *     que firma el proveedor (misma ficha = mismo hash = cero ambigüedad).
 *
 * Consumidores:
 *  - /api/booking/provider-brief   → gate duro (pago verificado + ficha completa)
 *  - /api/booking/notify-provider  → primer aviso, misma gramática
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
} from '../constants/ear-os-ssot';

/** Ventana máxima entre la solicitud del cliente y el cobro del depósito. */
export const PAYMENT_WINDOW_MS: number = 2 * 60 * 60 * 1000;

/**
 * Presupuesto de legibilidad: ~2,5 pantallas de móvil. Es un límite de diseño
 * para la ficha canónica, NO una excusa para truncar datos operativos: si un
 * rider es largo, se lee entero (el proveedor debe saber qué acepta).
 */
export const MAX_BRIEF_CHARS: number = 1600;

/** Veredicto del dinero (independiente de la completitud de la ficha). */
export type ProviderPaymentState =
  | 'VALIDADO'
  | 'PENDIENTE_PAGO'
  | 'EXPIRADO_SIN_PAGO'
  | 'PAGO_FUERA_DE_PLAZO';

/** Estado de la ficha completa: gobierna si se despacha y si se puede firmar. */
export type ProviderBriefState = ProviderPaymentState | 'FICHA_INCOMPLETA';

export type ProviderPaymentStatus = 'paid' | 'pending' | 'failed' | 'none';

export interface ProviderBriefProvider {
  readonly id: string;
  readonly name: string;
  readonly category?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly address?: string;
  readonly taxId?: string;
  readonly stageName?: string;
}

export interface ProviderBriefPayment {
  readonly status: ProviderPaymentStatus;
  readonly amountEur?: number;
  readonly paidAt?: string | null;
  readonly sessionId?: string | null;
}

/** Ficha tal como la rellena el cliente (más lo que exige cada gremio). */
export interface ProviderBriefFicha {
  readonly requestId: string;
  readonly reference?: string;
  readonly provider: ProviderBriefProvider;
  readonly clientName?: string;
  readonly clientPhone?: string;
  readonly clientEmail?: string;
  readonly eventType?: string;
  readonly eventPurpose?: string;
  readonly eventDate?: string;
  readonly startTime?: string;
  readonly durationHours?: number;
  readonly venueName?: string;
  readonly venueAddress?: string;
  readonly city?: string;
  readonly province?: string;
  readonly guests?: number;
  readonly childrenCount?: number;
  readonly isIndoor?: boolean;
  readonly serviceFormat?: string;
  readonly riderNotes?: string;
  readonly parkingNotes?: string;
}

export interface ProviderBriefInput {
  readonly ficha: ProviderBriefFicha;
  readonly payment?: ProviderBriefPayment;
  /** ISO-8601 del momento en que el cliente envió la ficha (abre la ventana). */
  readonly requestedAt: string;
  /** ISO-8601 inyectable: hace la ficha determinista en tests. */
  readonly now?: string;
  readonly totalEur?: number;
  readonly depositEur?: number;
  readonly setupMinutes?: number;
  /** Enlace de firma del contrato (ya firmado con HMAC por la ruta). */
  readonly signatureUrl?: string | null;
  /** ISO-8601 de caducidad del enlace de firma. */
  readonly signatureExpiresAt?: string | null;
}

export interface ProviderBriefBlock {
  readonly title: string;
  readonly lines: readonly string[];
}

export interface ProviderPaymentWindow {
  readonly openedAt: string | null;
  readonly closesAt: string | null;
  readonly paidAt: string | null;
  readonly remainingMs: number;
  readonly withinWindow: boolean;
}

/**
 * Semilla del contrato que firma el proveedor. Es estructuralmente compatible
 * con `GenerateContractParams` de `smartContractEngine`, sin acoplar el motor
 * de fichas al motor de contratos.
 */
export interface ProviderContractSeed {
  readonly requestId: string;
  readonly client: {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly address?: string;
  };
  readonly provider: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly address?: string;
    readonly taxId?: string;
    readonly stageName?: string;
  };
  readonly eventDetails: {
    readonly date: string;
    readonly startTime: string;
    readonly durationHours: number;
    readonly location: string;
    readonly city: string;
    readonly province?: string;
    readonly venueName?: string;
    readonly estimatedPax: number;
  };
  readonly baseAmount: number;
  readonly depositPaid: number;
}

export interface ProviderServiceBrief {
  readonly state: ProviderBriefState;
  readonly paymentState: ProviderPaymentState;
  readonly dispatchAllowed: boolean;
  readonly signatureAllowed: boolean;
  readonly missing: readonly string[];
  readonly blocks: readonly ProviderBriefBlock[];
  readonly text: string;
  readonly chars: number;
  readonly briefHash: string;
  readonly paymentWindow: ProviderPaymentWindow;
  readonly contractSeed: ProviderContractSeed | null;
}

/* ================================================================== */
/* Utilidades deterministas de formato (sin dependencias de locale)    */
/* ================================================================== */

const MISSING_MARK = '❌ falta';
const WEEKDAYS: readonly string[] = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** `2026-11-18` → `mié 18/11/2026`. Fecha de calendario: sin zona horaria. */
export function formatEventDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(utc.getTime())) return null;
  return `${WEEKDAYS[utc.getUTCDay()]} ${pad2(day)}/${pad2(month)}/${year}`;
}

function parseClock(value: string | undefined): number | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(normalized / 60))}:${pad2(normalized % 60)}`;
}

/** `2026-11-04T18:32:00Z` → `04/11 19:32` en hora de Madrid. */
function formatMadridStamp(iso: string | null): string | null {
  if (!iso) return null;
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) return null;
  try {
    const parts = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date(parsed));
    const pick = (type: string): string => parts.find((part) => part.type === type)?.value ?? '';
    return `${pick('day')}/${pick('month')} ${pick('hour')}:${pick('minute')}`;
  } catch {
    const date = new Date(parsed);
    return `${pad2(date.getUTCDate())}/${pad2(date.getUTCMonth() + 1)} ${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
  }
}

function formatEurAmount(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`;
}

function cleanText(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.replace(/\s+/g, ' ').trim();
  return trimmed.length > 0 ? trimmed : null;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Enlace wa.me listo para el despacho real (34 por defecto en España). */
export function buildProviderWhatsappUrl(phone: string, text: string): string {
  const digits = digitsOnly(phone);
  const target = digits.length === 9 ? `34${digits}` : digits;
  return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
}

/* ================================================================== */
/* Gate del dinero: 2 horas, ni un minuto más                          */
/* ================================================================== */

interface ResolvedPayment {
  readonly paymentState: ProviderPaymentState;
  readonly window: ProviderPaymentWindow;
}

/**
 * Decide si el pago existe y si llegó dentro de la ventana de 2 h.
 * `paidAt <= closesAt` es válido (segundo exacto incluido); un céntimo de
 * reloj después deja el bolo sin contrato y exige nuevo Price-Lock.
 */
export function resolveProviderPayment(input: ProviderBriefInput, nowMs: number): ResolvedPayment {
  const openedMs = Date.parse(input.requestedAt);
  const openedAt = Number.isFinite(openedMs) ? openedMs : null;
  const closesMs = openedAt === null ? null : openedAt + PAYMENT_WINDOW_MS;
  const closesAt = closesMs === null ? null : new Date(closesMs).toISOString();

  const payment = input.payment;
  const paidMs = payment?.paidAt ? Date.parse(payment.paidAt) : Number.NaN;
  const paidAtValid = Number.isFinite(paidMs);
  const withinWindow = paidAtValid && closesMs !== null ? paidMs <= closesMs : false;
  const remainingMs = closesMs === null ? 0 : Math.max(0, closesMs - nowMs);

  const window: ProviderPaymentWindow = {
    openedAt: openedAt === null ? null : new Date(openedAt).toISOString(),
    closesAt,
    paidAt: paidAtValid ? new Date(paidMs).toISOString() : null,
    remainingMs,
    withinWindow,
  };

  if (payment?.status === 'paid' && paidAtValid) {
    return { paymentState: withinWindow ? 'VALIDADO' : 'PAGO_FUERA_DE_PLAZO', window };
  }

  const expired = closesMs !== null && nowMs > closesMs;
  return { paymentState: expired ? 'EXPIRADO_SIN_PAGO' : 'PENDIENTE_PAGO', window };
}

/* ================================================================== */
/* Completitud de la ficha: sin estos datos no se despacha             */
/* ================================================================== */

function collectMissing(ficha: ProviderBriefFicha, totalEur: number | undefined): string[] {
  const missing: string[] = [];
  if (formatEventDate(ficha.eventDate) === null) missing.push('Fecha del evento');
  if (parseClock(ficha.startTime) === null) missing.push('Hora de inicio');
  if (
    typeof ficha.durationHours !== 'number' ||
    !Number.isFinite(ficha.durationHours) ||
    ficha.durationHours <= 0
  ) {
    missing.push('Duración (h)');
  }
  if (cleanText(ficha.venueAddress) === null) missing.push('Dirección exacta del lugar');
  if (cleanText(ficha.city) === null) missing.push('Municipio');
  if (cleanText(ficha.eventType) === null) missing.push('Tipo de evento');
  if (cleanText(ficha.clientName) === null) missing.push('Nombre del cliente');
  if (cleanText(ficha.clientPhone) === null || digitsOnly(ficha.clientPhone ?? '').length < 9) {
    missing.push('Teléfono del cliente');
  }
  if (typeof ficha.guests !== 'number' || !Number.isInteger(ficha.guests) || ficha.guests < 1) {
    missing.push('Nº de invitados');
  }
  if (typeof totalEur !== 'number' || !Number.isFinite(totalEur) || totalEur <= 0) {
    missing.push('Importe total');
  }
  return missing;
}

/* ================================================================== */
/* Construcción de los 8 bloques operativos                            */
/* ================================================================== */

interface BlockContext {
  readonly input: ProviderBriefInput;
  readonly totalEur: number | undefined;
  readonly depositEur: number;
  readonly paymentState: ProviderPaymentState;
  readonly signatureAllowed: boolean;
}

function whenBlock(ctx: BlockContext): ProviderBriefBlock {
  const ficha = ctx.input.ficha;
  const dateLabel = formatEventDate(ficha.eventDate) ?? MISSING_MARK;
  const startMinutes = parseClock(ficha.startTime);
  const rawDuration = ficha.durationHours;
  const duration: number | null =
    typeof rawDuration === 'number' && Number.isFinite(rawDuration) && rawDuration > 0
      ? rawDuration
      : null;

  const lines: string[] = [dateLabel];

  if (startMinutes !== null && duration !== null) {
    const endMinutes = startMinutes + Math.round(duration * 60);
    const crossesMidnight = endMinutes >= 1440;
    lines.push(
      `Inicio ${formatClock(startMinutes)} · Fin ${formatClock(endMinutes)}${crossesMidnight ? ' (+1 día)' : ''} · ${duration} h de servicio`,
    );
  } else if (startMinutes !== null) {
    lines.push(`Inicio ${formatClock(startMinutes)} · Duración ${MISSING_MARK}`);
  } else {
    lines.push(`Horario ${MISSING_MARK}`);
  }

  const setup = ctx.input.setupMinutes;
  if (startMinutes !== null && typeof setup === 'number' && Number.isInteger(setup) && setup > 0) {
    lines.push(`Montaje: ${setup} min antes (${formatClock(startMinutes - setup)})`);
  }

  return { title: '1 · CUÁNDO', lines };
}

function whereBlock(ctx: BlockContext): ProviderBriefBlock {
  const ficha = ctx.input.ficha;
  const lines: string[] = [];

  const venue = cleanText(ficha.venueName);
  if (venue) lines.push(venue);

  const address = cleanText(ficha.venueAddress) ?? MISSING_MARK;
  const city = cleanText(ficha.city) ?? MISSING_MARK;
  const province = cleanText(ficha.province);
  lines.push(`${address}, ${city}${province ? ` (${province})` : ''}`);

  if (ficha.isIndoor === true) lines.push('Espacio interior');
  if (ficha.isIndoor === false) lines.push('Espacio exterior');

  const parking = cleanText(ficha.parkingNotes);
  if (parking) lines.push(`Aparcamiento / acceso: ${parking}`);

  return { title: '2 · DÓNDE', lines };
}

function whatBlock(ctx: BlockContext): ProviderBriefBlock {
  const ficha = ctx.input.ficha;
  const eventType = cleanText(ficha.eventType) ?? MISSING_MARK;
  const purpose = cleanText(ficha.eventPurpose);
  const lines: string[] = [purpose ? `${eventType} · ${purpose}` : eventType];

  const serviceFormat = cleanText(ficha.serviceFormat);
  if (serviceFormat) lines.push(`Formato contratado: ${serviceFormat}`);

  return { title: '3 · QUÉ Y PARA QUÉ', lines };
}

function whoBlock(ctx: BlockContext): ProviderBriefBlock {
  const ficha = ctx.input.ficha;
  const name = cleanText(ficha.clientName) ?? MISSING_MARK;
  const phone = cleanText(ficha.clientPhone) ?? MISSING_MARK;
  const lines: string[] = [`${name} · ${phone}`];

  const email = cleanText(ficha.clientEmail);
  if (email) lines.push(email);

  return { title: '4 · QUIÉN CONTRATA Y PAGA', lines };
}

function guestsBlock(ctx: BlockContext): ProviderBriefBlock {
  const ficha = ctx.input.ficha;
  const guests = typeof ficha.guests === 'number' && ficha.guests > 0 ? ficha.guests : null;
  const children =
    typeof ficha.childrenCount === 'number' && ficha.childrenCount > 0 ? ficha.childrenCount : 0;

  const paxLine =
    guests === null
      ? MISSING_MARK
      : `${guests} invitados${children > 0 ? ` (${children} niños)` : ''}`;

  const lines: string[] = [paxLine];
  if (guests !== null) {
    const watts = guests * WATTS_PER_PAX;
    lines.push(
      `${watts} W de refuerzo (${WATTS_PER_PAX} W/pax) · tope ${LIMITE_SPL_DB} dB SPL (Ley 37/2003)`,
    );
  }

  return { title: '5 · INVITADOS Y PRESIÓN SONORA', lines };
}

function riderBlock(ctx: BlockContext): ProviderBriefBlock {
  const notes = cleanText(ctx.input.ficha.riderNotes);
  return {
    title: '6 · RIDER Y NECESIDADES',
    lines: [notes ?? 'Sin requisitos declarados por el cliente'],
  };
}

function moneyBlock(ctx: BlockContext): ProviderBriefBlock {
  const deposit = ctx.depositEur;
  const total = ctx.totalEur;

  if (typeof total !== 'number' || !Number.isFinite(total) || total <= 0) {
    return {
      title: '7 · DINERO',
      lines: [`Total ${MISSING_MARK} · Depósito ${formatEurAmount(deposit)}`],
    };
  }

  const remaining = Math.max(0, Math.round((total - deposit) * 100) / 100);

  if (ctx.paymentState === 'VALIDADO') {
    return {
      title: '7 · DINERO',
      lines: [
        `Total ${formatEurAmount(total)} · Depósito ${formatEurAmount(deposit)} COBRADO por Stripe`,
        `A cobrar en el evento: ${formatEurAmount(remaining)}`,
      ],
    };
  }

  return {
    title: '7 · DINERO',
    lines: [
      `Total ${formatEurAmount(total)} · Depósito ${formatEurAmount(deposit)} PENDIENTE`,
      `Resto previsto en el evento: ${formatEurAmount(remaining)} (no confirmado)`,
    ],
  };
}

function stepBlock(ctx: BlockContext): ProviderBriefBlock {
  const lines: string[] = [];
  const url = ctx.input.signatureUrl;

  if (ctx.signatureAllowed && typeof url === 'string' && url.length > 0) {
    lines.push(`Firma el contrato que acepta el servicio: ${url}`);
    const expires = formatMadridStamp(ctx.input.signatureExpiresAt ?? null);
    if (expires) lines.push(`El enlace caduca: ${expires} (hora de Madrid)`);
  } else if (ctx.paymentState === 'PENDIENTE_PAGO') {
    lines.push('No firmes todavía: el depósito aún no está cobrado.');
  } else if (ctx.paymentState === 'EXPIRADO_SIN_PAGO') {
    lines.push('No hay contrato: la ventana de 2 h venció sin pago.');
  } else if (ctx.paymentState === 'PAGO_FUERA_DE_PLAZO') {
    lines.push('No firmes: el pago llegó fuera de la ventana de 2 h. Se emite nuevo Price-Lock.');
  } else {
    lines.push('Firma pendiente de emisión: solicítala en la Centralita.');
  }

  lines.push(`Centralita: ${CENTRALITA_EAR_OS}`);
  return { title: '8 · TU ÚNICO PASO', lines };
}

function stateHeadline(
  state: ProviderBriefState,
  paymentState: ProviderPaymentState,
  window: ProviderPaymentWindow,
  depositEur: number,
): string {
  const closes = formatMadridStamp(window.closesAt);
  const paid = formatMadridStamp(window.paidAt);

  if (state === 'VALIDADO' && paid) {
    return `✅ VALIDADA · Depósito ${formatEurAmount(depositEur)} cobrado el ${paid} (dentro de las 2 h)`;
  }
  if (state === 'FICHA_INCOMPLETA') {
    if (paymentState === 'VALIDADO' && paid) {
      return `⚠️ FICHA INCOMPLETA · Depósito cobrado el ${paid}, pero faltan datos para firmar`;
    }
    return '⚠️ FICHA INCOMPLETA · No se despacha ni se firma hasta completar los datos';
  }
  if (paymentState === 'PENDIENTE_PAGO') {
    return `⏳ SIN PAGAR · Plazo del depósito ${formatEurAmount(depositEur)} hasta ${closes ?? 'sin ventana'} (Madrid)`;
  }
  if (paymentState === 'EXPIRADO_SIN_PAGO') {
    return `⛔ VENCIDA · Venció ${closes ?? 'la ventana'} sin pago · no hay contrato`;
  }
  return `⛔ PAGO FUERA DE PLAZO · Cobrado ${paid ?? 'tarde'} · límite ${closes ?? '—'} (Madrid)`;
}

/* ================================================================== */
/* Semilla del contrato (lo que el proveedor firma)                    */
/* ================================================================== */

function buildContractSeed(
  input: ProviderBriefInput,
  totalEur: number | undefined,
  depositEur: number,
): ProviderContractSeed | null {
  const ficha = input.ficha;
  const clientName = cleanText(ficha.clientName);
  const clientEmail = cleanText(ficha.clientEmail);
  const clientPhone = cleanText(ficha.clientPhone);
  const providerEmail = cleanText(ficha.provider.email);
  const providerPhone = cleanText(ficha.provider.phone);
  const date = cleanText(ficha.eventDate);
  const startTime = cleanText(ficha.startTime);
  const address = cleanText(ficha.venueAddress);
  const city = cleanText(ficha.city);

  if (
    clientName === null ||
    clientEmail === null ||
    clientPhone === null ||
    providerEmail === null ||
    providerPhone === null ||
    date === null ||
    startTime === null ||
    address === null ||
    city === null
  ) {
    return null;
  }

  const duration = ficha.durationHours;
  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration <= 0) return null;

  const guests = ficha.guests;
  if (typeof guests !== 'number' || !Number.isInteger(guests) || guests <= 0) return null;

  if (typeof totalEur !== 'number' || !Number.isFinite(totalEur) || totalEur <= 0) return null;

  return {
    requestId: ficha.requestId,
    client: {
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
    },
    provider: {
      id: ficha.provider.id,
      name: ficha.provider.name,
      email: providerEmail,
      phone: providerPhone,
      address: cleanText(ficha.provider.address) ?? undefined,
      taxId: cleanText(ficha.provider.taxId) ?? undefined,
      stageName: cleanText(ficha.provider.stageName) ?? undefined,
    },
    eventDetails: {
      date: date.slice(0, 10),
      startTime,
      durationHours: duration,
      location: address,
      city,
      province: cleanText(ficha.province) ?? undefined,
      venueName: cleanText(ficha.venueName) ?? undefined,
      estimatedPax: guests,
    },
    baseAmount: totalEur,
    depositPaid: depositEur,
  };
}

/* ================================================================== */
/* API pública                                                         */
/* ================================================================== */

/**
 * Construye la ficha de servicio que recibe el proveedor.
 *
 * Orden de decisión (fail-closed):
 *   1. ¿El pago existe y llegó dentro de las 2 h?  → `paymentState`.
 *   2. ¿Están todos los datos operativos?          → `state`.
 *   3. Solo si ambas respuestas son sí: `dispatchAllowed` y `signatureAllowed`.
 */
export function buildProviderServiceBrief(input: ProviderBriefInput): ProviderServiceBrief {
  const parsedNow = input.now ? Date.parse(input.now) : Number.NaN;
  const nowMs = Number.isFinite(parsedNow) ? parsedNow : Date.now();

  const depositEur =
    typeof input.depositEur === 'number' && Number.isFinite(input.depositEur) && input.depositEur > 0
      ? input.depositEur
      : DEPOSITO_STRIPE_EUR;
  const totalEur = input.totalEur;

  const missing = collectMissing(input.ficha, totalEur);
  const resolved = resolveProviderPayment(input, nowMs);
  const paymentState = resolved.paymentState;
  const state: ProviderBriefState = missing.length > 0 ? 'FICHA_INCOMPLETA' : paymentState;

  const dispatchAllowed = state === 'VALIDADO';
  const signatureAllowed =
    dispatchAllowed && typeof input.signatureUrl === 'string' && input.signatureUrl.length > 0;

  const ctx: BlockContext = { input, totalEur, depositEur, paymentState, signatureAllowed };

  const blocks: readonly ProviderBriefBlock[] = [
    whenBlock(ctx),
    whereBlock(ctx),
    whatBlock(ctx),
    whoBlock(ctx),
    guestsBlock(ctx),
    riderBlock(ctx),
    moneyBlock(ctx),
    stepBlock(ctx),
  ];

  const reference = cleanText(input.ficha.reference) ?? input.ficha.requestId;
  const sections: string[] = [
    `📋 *FICHA DE SERVICIO · ${reference}*`,
    stateHeadline(state, paymentState, resolved.window, depositEur),
  ];

  if (missing.length > 0) {
    sections.push(`⚠️ *FALTAN DATOS:* ${missing.join(' · ')}`);
  }

  for (const block of blocks) {
    sections.push(`*${block.title}*\n${block.lines.join('\n')}`);
  }

  const text = sections.join('\n\n');
  const briefHash = createHash('sha256')
    .update(
      ['EAR-BRIEF-v1', state, paymentState, input.payment?.sessionId ?? '-', text].join('\n'),
      'utf8',
    )
    .digest('hex');

  return {
    state,
    paymentState,
    dispatchAllowed,
    signatureAllowed,
    missing,
    blocks,
    text,
    chars: text.length,
    briefHash,
    paymentWindow: resolved.window,
    /**
     * La semilla del contrato SOLO existe si la ficha está validada (pago dentro
     * de las 2 h + datos completos). Un contrato sin depósito no se prepara
     * siquiera: no hay papel que firmar.
     */
    contractSeed: state === 'VALIDADO' ? buildContractSeed(input, totalEur, depositEur) : null,
  };
}

/* ================================================================== */
/* Primer aviso (pre-pago): 7 líneas, cero marketing                   */
/* ================================================================== */

export interface ProviderPingInput {
  readonly ficha: ProviderBriefFicha;
  readonly requestedAt: string;
  readonly totalEur?: number;
  readonly depositEur?: number;
  readonly setupMinutes?: number;
  readonly respondWithinMinutes?: number;
}

export interface ProviderPing {
  readonly text: string;
  readonly chars: number;
  readonly missing: readonly string[];
  readonly respondBefore: string;
}

/**
 * Aviso inicial al proveedor cuando AÚN no hay depósito. No es la ficha de
 * firma: no promete, no adorna y no pide firma. Solo dice qué hay, qué falta y
 * en cuánto tiempo debe responder.
 */
export function buildProviderPing(input: ProviderPingInput): ProviderPing {
  const ficha = input.ficha;
  const deposit = typeof input.depositEur === 'number' && input.depositEur > 0 ? input.depositEur : DEPOSITO_STRIPE_EUR;
  const minutes = input.respondWithinMinutes ?? 120;
  const deadline = new Date(Date.now() + minutes * 60 * 1000).toISOString();

  const missing = collectMissing(ficha, input.totalEur);
  const reference = cleanText(ficha.reference) ?? ficha.requestId;

  const dateLabel = formatEventDate(ficha.eventDate) ?? `${MISSING_MARK} (fecha)`;
  const startLabel = parseClock(ficha.startTime);
  const when = startLabel === null ? dateLabel : `${dateLabel} · ${formatClock(startLabel)}`;

  const venue = [cleanText(ficha.venueName), cleanText(ficha.city)]
    .filter((part): part is string => part !== null)
    .join(' · ');

  const lines: string[] = [
    `🔔 *SOLICITUD · ${reference}*`,
    'Reserva provisional: el cliente aún no ha pagado. No hay nada que firmar todavía.',
    '',
    `*CUÁNDO:* ${when}`,
    `*DÓNDE:* ${venue.length > 0 ? venue : `${MISSING_MARK} (dirección)`}`,
    `*QUÉ:* ${cleanText(ficha.serviceFormat) ?? cleanText(ficha.eventType) ?? MISSING_MARK}`,
    `*QUIÉN:* ${cleanText(ficha.clientName) ?? MISSING_MARK} · ${cleanText(ficha.clientPhone) ?? MISSING_MARK}`,
    `*INVITADOS:* ${typeof ficha.guests === 'number' ? ficha.guests : MISSING_MARK}`,
    `*DINERO:* ${typeof input.totalEur === 'number' ? formatEurAmount(input.totalEur) : MISSING_MARK} · depósito ${formatEurAmount(deposit)} ${input.totalEur === undefined ? '' : 'pendiente'}`.trim(),
    '',
    `*TU ÚNICO PASO AHORA:* responde SÍ o NO antes de ${formatMadridStamp(deadline) ?? `${minutes} min`} (Madrid).`,
    `Si aceptas, recibirás la ficha completa y el contrato cuando el cliente abone el depósito.`,
    `Centralita: ${CENTRALITA_EAR_OS}`,
  ];

  if (missing.length > 0) {
    lines.splice(2, 0, `⚠️ *FALTAN DATOS:* ${missing.join(' · ')}`);
  }

  const text = lines.join('\n');
  return { text, chars: text.length, missing, respondBefore: deadline };
}

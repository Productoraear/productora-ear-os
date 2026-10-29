'use client';

// ============================================================================
// Ω-ADMIN · PESTAÑA TESORERÍA — SPLIT SOBERANO EN VIVO + PRICE-LOCK (W41_T16)
// ----------------------------------------------------------------------------
// Contrato copiado de la ruta REAL (src/app/api/admin/treasury/route.ts), no
// inventado:
//   GET ?limit=1..100 ->
//     { ok:true, data:{ metrics, transactions }, total }
//     metrics = { totalDepositsAmount, totalDepositsCount, artistSplit,
//                 earOsSplit, vimumeSplit, rule }      (strings, 2 decimales)
//     transactions = { id, reference, client, service, deposit, hash,
//                      status, date }                    (ya formateados)
//   POST body `.strict()` ->
//     { stripeSessionId* (8..120), amountEur* (>= SSOT 100, <= 50.000),
//       clientName* (2..120), serviceName* (2..160), clientEmail?, paidAt? }
//     201 => { ok:true, data:{ id, reference, amount, created, status,
//                              paidAt, originHash, originMatchesStored, split } }
//     200 => replay idempotente sobre `reference = PRICELOCK:<session>`
//     400 INVALID_BODY/INVALID_JSON · 401 · 500 INTERNAL_ERROR
//
// DOCTRINA DEL DINERO (cero cálculo en cliente):
//   · El split 80/10/10 lo calcula SIEMPRE el servidor desde `ear-os-ssot.ts`.
//     Aquí no hay una sola multiplicación por porcentaje: se pinta lo que
//     devuelve la API (`artistSplit`/`earOsSplit`/`vimumeSplit`) y, tras un
//     alta, el `split` que acuña la respuesta. Ni una cifra de negocio escrita
//     a mano en la UI.
//   · El importe mínimo del depósito se LEE de `EAR_OS_SSOT.DEPOSITO_STRIPE_EUR`
//     (100,00 €). Escribir `100` a mano aquí sería duplicar el SSOT: prohibido.
//   · El cliente NUNCA envía comisión, status ni reference: el `.strict()` del
//     servidor los rechazaría y el ledger se escribe sólo desde el SSOT.
//
// DOCTRINA DE FRICCIÓN CERO (cero clics muertos):
//   · Toda la red pasa por `adminFetch` / `useAdminDocument` (Bearer Firebase +
//     sobre `{ ok:true, data }`). Prohibido `fetch` directo en el panel.
//   · `PRICELOCK:<sesión>` y el hash SHA-256 de origen se copian con
//     portapapeles VERIFICADO: un «copiado» falso es una mentira de interfaz.
//   · Alta idempotente: reintentar el mismo `stripeSessionId` no duplica fila,
//     y la UI lo dice explícitamente en vez de fingir un alta nueva.
//
// Cero `any`: contratos tipados de punta a punta.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    Copy,
    Loader2,
    Plus,
    RefreshCw,
    ShieldCheck,
    X,
} from 'lucide-react';
import { adminFetch, isAdminHttpError } from '@/lib/admin/adminFetch';
import type { AdminApiError } from '@/lib/admin/adminTypes';
import { EAR_OS_SSOT } from '@/lib/constants/ear-os-ssot';
import { useAdminDocument } from '../useAdminResource';

/* ── Contratos (espejo exacto de la ruta) ─────────────────────────────────── */

export type TreasuryMetrics = {
    totalDepositsAmount: string;
    totalDepositsCount: number;
    artistSplit: string;
    earOsSplit: string;
    vimumeSplit: string;
    rule: string;
};

export type TreasuryTransaction = {
    id: string;
    reference: string;
    client: string;
    service: string;
    deposit: string;
    hash: string;
    status: string;
    date: string;
};

export type TreasuryPayload = {
    metrics: TreasuryMetrics;
    transactions: TreasuryTransaction[];
};

/** Reparto exacto al céntimo que acuña el servidor (VIMUME absorbe el residuo). */
export type PriceLockSplit = {
    artist: number;
    earOs: number;
    vimume: number;
    rule: string;
    depositDeductible: true;
};

/** `data` desenvuelto del sobre Ω-ADMIN en el POST (201 alta / 200 replay). */
export type PriceLockAck = {
    id: string;
    reference: string;
    amount: number;
    created: boolean;
    status: string;
    paidAt: string | null;
    originHash: string;
    originMatchesStored: boolean | null;
    split: PriceLockSplit;
};

/* ── Constantes (espejo de la ruta; el servidor sigue siendo el juez) ─────── */

const LIST_PATH = '/api/admin/treasury?limit=50';
const WRITE_PATH = '/api/admin/treasury';

const MIN_SESSION = 8;
const MAX_SESSION = 120;
const MIN_TEXT = 2;
const MAX_CLIENT = 120;
const MAX_SERVICE = 160;
const MAX_PRICE_LOCK_EUR = 50_000;

/** Depósito inmutable: se LEE del SSOT, jamás se escribe a mano. */
const MIN_DEPOSIT_EUR = EAR_OS_SSOT.DEPOSITO_STRIPE_EUR;

/** Centinela del backend cuando la fila no tiene hash de origen. */
const NO_HASH = 'NO_HASH';

const FIELD_CLASS =
    'w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40';
const LABEL_CLASS = 'mb-1.5 block text-xs font-medium text-white/60';

type FormValues = {
    stripeSessionId: string;
    amountEur: string;
    clientName: string;
    serviceName: string;
};

/** Importe por defecto = depósito del SSOT (no un 100 literal). */
const EMPTY_FORM: FormValues = {
    stripeSessionId: '',
    amountEur: String(EAR_OS_SSOT.DEPOSITO_STRIPE_EUR),
    clientName: '',
    serviceName: '',
};

type Notice = {
    kind: 'ok' | 'info' | 'error';
    text: string;
    details: readonly string[];
};

/* ── Utilidades puras ─────────────────────────────────────────────────────── */

/**
 * Parseo tolerante al separador decimal español («100,50») sin inventar nada:
 * si no es un número finito, devuelve `null` y la UI lo declara.
 */
function parseDecimal(raw: string): number | null {
    const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
    if (normalized.length === 0) return null;
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

/** La API entrega «1234.56»: se localiza a es-ES sin alterar el valor. */
function formatEur(raw: string): string {
    const parsed = parseDecimal(raw);
    if (parsed === null) return '—';
    return `${parsed.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} €`;
}

/** Importe numérico ya calculado por el servidor. */
function formatAmount(amount: number): string {
    if (!Number.isFinite(amount)) return '—';
    return `${amount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} €`;
}

/** `deposit` llega como «100.00 €»: se normaliza; si no es número, se respeta. */
function formatDeposit(raw: string): string {
    const parsed = parseDecimal(raw.replace('€', ''));
    return parsed === null ? raw : formatAmount(parsed);
}

/**
 * Etiquetas de las tres bolsas leídas de la regla que dicta el SERVIDOR
 * (`metrics.rule` = «80% Artista / 10% EAR OS / 10% VIMUME»). Si la regla
 * cambiara en el SSOT, la UI cambia con ella: cero porcentajes duplicados.
 */
function splitLabels(rule: string): readonly [string, string, string] {
    const parts = rule
        .split('/')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
    return [parts[0] ?? 'Artista ejecutante', parts[1] ?? 'EAR OS', parts[2] ?? 'VIMUME'];
}

function matchesQuery(row: TreasuryTransaction, query: string): boolean {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return true;
    return [row.client, row.service, row.reference, row.hash, row.status, row.deposit, row.date]
        .some((value) => value.toLowerCase().includes(needle));
}

/** Traduce el fallo normalizado Ω a texto accionable (nada inventado). */
function describeError(error: AdminApiError): { text: string; details: readonly string[] } {
    if (error.code === 'UNAUTHORIZED') {
        return {
            text: 'Sesión caducada: sin token verificado no se registra dinero.',
            details: [error.message],
        };
    }
    if (error.code === 'FORBIDDEN') {
        return { text: 'Tu rol no permite operar la tesorería.', details: [error.message] };
    }
    if (error.code === 'VALIDATION') {
        const issues = error.issues ?? [];
        return {
            text: 'El servidor rechazó el depósito.',
            details: issues.length > 0 ? issues : [error.message],
        };
    }
    if (error.code === 'CONFLICT') {
        return {
            text: 'Conflicto de unicidad en el ledger: refresca la tabla antes de reintentar.',
            details: [error.message],
        };
    }
    if (error.code === 'CONFIG') {
        return { text: 'Firebase no está configurado en este entorno.', details: [error.message] };
    }
    if (error.status === 0) {
        return { text: 'Sin respuesta del servidor (red caída).', details: [error.message] };
    }
    if (error.status === 503) {
        return {
            text: 'Servicio de tesorería no configurado en este entorno (falta la base de datos).',
            details: [error.message],
        };
    }
    return { text: `${error.message} (HTTP ${error.status})`, details: [] };
}

/**
 * Validación previa al POST: mismos límites que el zod del servidor, para no
 * gastar un viaje ni dejar que el usuario descubra el error en un 400.
 */
function validateForm(values: FormValues): string | null {
    const session = values.stripeSessionId.trim();
    if (session.length === 0) {
        return 'El stripeSessionId es obligatorio: es la clave de idempotencia del depósito.';
    }
    if (session.length < MIN_SESSION) {
        return `El stripeSessionId necesita al menos ${MIN_SESSION} caracteres.`;
    }
    if (session.length > MAX_SESSION) {
        return `El stripeSessionId no puede superar ${MAX_SESSION} caracteres.`;
    }

    const amount = parseDecimal(values.amountEur);
    if (amount === null) return 'El importe del depósito debe ser un número.';
    if (amount < MIN_DEPOSIT_EUR) {
        return `El depósito Price-Lock no puede ser inferior a ${formatAmount(MIN_DEPOSIT_EUR)}.`;
    }
    if (amount > MAX_PRICE_LOCK_EUR) {
        return 'Importe fuera del rango permitido por la tesorería.';
    }

    const client = values.clientName.trim();
    if (client.length < MIN_TEXT) {
        return `El nombre del cliente necesita al menos ${MIN_TEXT} caracteres.`;
    }
    if (client.length > MAX_CLIENT) {
        return `El nombre del cliente no puede superar ${MAX_CLIENT} caracteres.`;
    }

    const service = values.serviceName.trim();
    if (service.length < MIN_TEXT) {
        return `El servicio necesita al menos ${MIN_TEXT} caracteres.`;
    }
    if (service.length > MAX_SERVICE) {
        return `El servicio no puede superar ${MAX_SERVICE} caracteres.`;
    }

    return null;
}

/** Portapapeles con fallo explícito (nunca un «copiado» falso). */
async function copyToClipboard(value: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || navigator.clipboard === undefined) return false;
    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        return false;
    }
}

/* ── Piezas de presentación ──────────────────────────────────────────────── */

const NOTICE_TONE: Readonly<Record<Notice['kind'], string>> = {
    ok: 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]',
    info: 'border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]',
    error: 'border-[#FF2B44]/30 bg-[#FF2B44]/10 text-[#FF2B44]',
};

function NoticeBanner({ notice, onDismiss }: { notice: Notice; onDismiss: () => void }) {
    return (
        <div
            role={notice.kind === 'error' ? 'alert' : 'status'}
            className={`mb-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border p-4 text-sm ${NOTICE_TONE[notice.kind]}`}
        >
            <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold">
                    {notice.kind === 'error' ? (
                        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <span className="break-words">{notice.text}</span>
                </p>
                {notice.details.length > 0 ? (
                    <ul className="mt-1 list-inside list-disc text-xs text-white/60">
                        {notice.details.map((detail) => (
                            <li key={detail} className="break-words">
                                {detail}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
            <button
                type="button"
                onClick={onDismiss}
                aria-label="Descartar aviso"
                className="rounded-full border border-white/10 bg-white/5 p-1 text-white/60 transition-all duration-300 ease-out hover:border-white/25 hover:text-white"
            >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
        </div>
    );
}

function CopyButton({
    label,
    value,
    copied,
    onCopy,
    disabled,
}: {
    label: string;
    value: string;
    copied: boolean;
    onCopy: () => void;
    disabled: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onCopy}
            disabled={disabled}
            aria-label={`${label}: ${value}`}
            title={copied ? 'Copiado' : `Copiar ${value}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-white/50 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613] disabled:cursor-not-allowed disabled:opacity-40"
        >
            {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
            ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
        </button>
    );
}

/** Tarjeta de bolsa del split: el valor SIEMPRE viene del backend. */
function SplitCard({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string | null;
    highlight?: boolean;
}) {
    return (
        <article
            className={`rounded-2xl border p-4 ${
                highlight ? 'border-[#ecb613]/30 bg-[#ecb613]/10' : 'border-white/10 bg-white/5'
            }`}
        >
            <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
            <p
                className={`mt-2 text-xl font-semibold tabular-nums ${
                    highlight ? 'text-[#ecb613]' : 'text-white'
                }`}
            >
                {value === null ? '—' : value}
            </p>
        </article>
    );
}

/**
 * Recibo criptográfico del alta: referencia idempotente, hash SHA-256 de origen
 * y reparto acuñado por el servidor. Si el reintento trae otro payload, se
 * declara en rojo: el Price-Lock registrado es inmutable y NO se ha tocado.
 */
function PriceLockAckPanel({
    ack,
    copiedKey,
    onCopy,
}: {
    ack: PriceLockAck;
    copiedKey: string | null;
    onCopy: (key: string, value: string) => void;
}) {
    const labels = splitLabels(ack.split.rule);
    const tampered = !ack.created && ack.originMatchesStored === false;

    return (
        <section className="mb-6 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/5 p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-white">
                    {ack.created
                        ? 'Depósito registrado en el ledger'
                        : 'Sesión ya registrada (idempotente): no se ha creado fila nueva'}
                </h3>
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-white/70">
                    {ack.status}
                </span>
            </div>

            <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div className="min-w-0">
                    <dt className="text-white/40">Referencia Price-Lock</dt>
                    <dd className="mt-1 flex items-center gap-2">
                        <code className="truncate font-mono text-[11px] text-[#ecb613]" title={ack.reference}>
                            {ack.reference}
                        </code>
                        <CopyButton
                            label="Copiar referencia"
                            value={ack.reference}
                            copied={copiedKey === 'ack-reference'}
                            onCopy={() => onCopy('ack-reference', ack.reference)}
                            disabled={false}
                        />
                    </dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-white/40">Hash SHA-256 de origen</dt>
                    <dd className="mt-1 flex items-center gap-2">
                        <code className="truncate font-mono text-[11px] text-white/60" title={ack.originHash}>
                            {ack.originHash.slice(0, 16)}…
                        </code>
                        <CopyButton
                            label="Copiar hash de origen"
                            value={ack.originHash}
                            copied={copiedKey === 'ack-hash'}
                            onCopy={() => onCopy('ack-hash', ack.originHash)}
                            disabled={false}
                        />
                    </dd>
                </div>
                <div>
                    <dt className="text-white/40">Importe</dt>
                    <dd className="mt-1 font-semibold tabular-nums text-white">
                        {formatAmount(ack.amount)} · 100% deducible del total del evento
                    </dd>
                </div>
                <div>
                    <dt className="text-white/40">Pagado</dt>
                    <dd className="mt-1 text-white/70">{ack.paidAt ?? 'No declarado por Stripe'}</dd>
                </div>
            </dl>

            <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                <p className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white/70">
                    {labels[0]}:{' '}
                    <span className="font-semibold tabular-nums text-white">
                        {formatAmount(ack.split.artist)}
                    </span>
                </p>
                <p className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white/70">
                    {labels[1]}:{' '}
                    <span className="font-semibold tabular-nums text-white">
                        {formatAmount(ack.split.earOs)}
                    </span>
                </p>
                <p className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white/70">
                    {labels[2]}:{' '}
                    <span className="font-semibold tabular-nums text-white">
                        {formatAmount(ack.split.vimume)}
                    </span>
                </p>
            </div>

            {tampered ? (
                <p
                    role="alert"
                    className="mt-3 flex items-start gap-2 rounded-xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 p-3 text-xs text-[#FF2B44]"
                >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                        El reintento trae un payload DISTINTO (importe, cliente o servicio) para la misma
                        sesión de Stripe. El Price-Lock ya registrado es inmutable y no se ha modificado:
                        verifica cuál de los dos es el real antes de liquidar.
                    </span>
                </p>
            ) : null}

            {!ack.created && ack.originMatchesStored === null ? (
                <p className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/50">
                    La fila existente no guarda hash de origen (ledger previo al hardening): no se puede
                    demostrar equivalencia con este reintento.
                </p>
            ) : null}
        </section>
    );
}

/* ── Pestaña ─────────────────────────────────────────────────────────────── */

/**
 * Pestaña Tesorería: KPIs del Split Soberano servidos por la API (que los
 * calcula desde el SSOT SHA-256), libro de depósitos Price-Lock y alta
 * idempotente con recibo criptográfico.
 * `query` llega del buscador global del shell para no dejar un control muerto.
 */
export function TesoreriaTab({ query = '' }: { query?: string }): ReactElement {
    const { status, data, error, reload } = useAdminDocument<TreasuryPayload>(LIST_PATH);

    const [form, setForm] = useState<FormValues>(EMPTY_FORM);
    const [formError, setFormError] = useState<string | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [ack, setAck] = useState<PriceLockAck | null>(null);
    const [busy, setBusy] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const metrics = data?.metrics ?? null;
    const transactions = useMemo(() => data?.transactions ?? [], [data]);
    const visible = useMemo(
        () => transactions.filter((row) => matchesQuery(row, query)),
        [transactions, query],
    );
    const labels = useMemo(() => splitLabels(metrics?.rule ?? ''), [metrics]);

    const loading = status === 'loading' || status === 'idle';
    const listingFailed = status === 'error' && error !== null;

    // El temporizador del «copiado» se limpia al desmontar (cero fugas).
    useEffect(
        () => () => {
            if (copiedTimerRef.current !== null) clearTimeout(copiedTimerRef.current);
        },
        [],
    );

    const setField = (key: keyof FormValues, value: string): void => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const markCopied = (key: string): void => {
        setCopiedKey(key);
        if (copiedTimerRef.current !== null) clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(() => {
            setCopiedKey(null);
            copiedTimerRef.current = null;
        }, 2000);
    };

    const handleCopy = async (key: string, value: string): Promise<void> => {
        const copied = await copyToClipboard(value);
        if (!copied) {
            setNotice({
                kind: 'error',
                text: 'El navegador bloqueó el portapapeles: copia el valor a mano.',
                details: [value],
            });
            return;
        }
        markCopied(key);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (busy) return;

        const localError = validateForm(form);
        if (localError !== null) {
            setFormError(localError);
            return;
        }
        const amount = parseDecimal(form.amountEur);
        if (amount === null) {
            setFormError('El importe del depósito debe ser un número.');
            return;
        }

        setFormError(null);
        setNotice(null);
        setAck(null);
        setBusy(true);

        try {
            // Payload EXACTO del `.strict()`: ni comisión, ni status, ni reference.
            const result = await adminFetch<PriceLockAck>(WRITE_PATH, {
                method: 'POST',
                body: {
                    stripeSessionId: form.stripeSessionId.trim(),
                    amountEur: amount,
                    clientName: form.clientName.trim(),
                    serviceName: form.serviceName.trim(),
                },
            });

            setAck(result);
            // Se conserva el importe (altas encadenadas del mismo depósito); el
            // identificador de sesión SÍ se limpia para no reenviarlo por inercia.
            setForm((prev) => ({ ...EMPTY_FORM, amountEur: prev.amountEur }));
            setNotice({
                kind: result.created ? 'ok' : 'info',
                text: result.created
                    ? `Depósito registrado · ${result.reference} · ${formatAmount(result.amount)}`
                    : `Sesión ya registrada (idempotente) · ${result.reference}: el ledger no se ha duplicado.`,
                details: [],
            });

            await reload();
        } catch (writeFailure) {
            const described = isAdminHttpError(writeFailure)
                ? describeError(writeFailure.toAdminApiError())
                : { text: 'Fallo de red al registrar el depósito.', details: [] as readonly string[] };
            setNotice({
                kind: 'error',
                text: `Alta del depósito: ${described.text}`,
                details: [
                    ...described.details,
                    'La clave PRICELOCK:<stripeSessionId> es idempotente: reintentar el MISMO identificador no duplica la fila; comprueba la tabla antes de cambiar importe o cliente.',
                ],
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <section
            aria-busy={busy}
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md"
        >
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Tesorería · Split Soberano</h2>
                    <span
                        title="Depósitos devueltos por la API (ventana ?limit=50)"
                        className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]"
                    >
                        {listingFailed || loading ? '—' : transactions.length}
                    </span>
                    {status === 'success' && visible.length !== transactions.length ? (
                        <span className="text-xs text-white/40">{visible.length} filtrados</span>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={() => void reload()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    Refrescar
                </button>
            </header>

            <div aria-live="polite">
                {notice !== null ? (
                    <NoticeBanner notice={notice} onDismiss={() => setNotice(null)} />
                ) : null}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <article className="rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-white/40">Custodia total</p>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-[#ecb613]">
                        {metrics === null ? '—' : formatEur(metrics.totalDepositsAmount)}
                    </p>
                    <p className="mt-1 text-[11px] text-white/40">
                        {metrics === null
                            ? 'Sin datos de la API'
                            : `${metrics.totalDepositsCount} depósito${
                                  metrics.totalDepositsCount === 1 ? '' : 's'
                              } Price-Lock`}
                    </p>
                </article>
                <SplitCard
                    label={labels[0]}
                    value={metrics === null ? null : formatEur(metrics.artistSplit)}
                />
                <SplitCard
                    label={labels[1]}
                    value={metrics === null ? null : formatEur(metrics.earOsSplit)}
                />
                <SplitCard
                    label={labels[2]}
                    value={metrics === null ? null : formatEur(metrics.vimumeSplit)}
                />
            </div>

            {metrics !== null ? (
                <p className="mb-5 font-mono text-[11px] text-white/40">
                    Regla del motor (SSOT SHA-256): {metrics.rule}. Depósito Price-Lock{' '}
                    {formatAmount(MIN_DEPOSIT_EUR)}, 100 % deducible del total del evento.
                </p>
            ) : null}

            <form
                onSubmit={(event) => void handleSubmit(event)}
                className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Plus className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">Registrar depósito Price-Lock</h3>
                    <span className="text-[11px] text-white/40">
                        Idempotente por sesión de Stripe: el reintento devuelve la misma referencia.
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <label className={LABEL_CLASS} htmlFor="treasury-session">
                            Sesión Stripe *
                        </label>
                        <input
                            id="treasury-session"
                            name="stripeSessionId"
                            required
                            minLength={MIN_SESSION}
                            maxLength={MAX_SESSION}
                            value={form.stripeSessionId}
                            onChange={(event) => setField('stripeSessionId', event.target.value)}
                            placeholder="cs_live_…"
                            autoComplete="off"
                            spellCheck={false}
                            disabled={busy}
                            className={FIELD_CLASS}
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLASS} htmlFor="treasury-amount">
                            Importe (€) *
                        </label>
                        <input
                            id="treasury-amount"
                            name="amountEur"
                            type="number"
                            required
                            inputMode="decimal"
                            min={MIN_DEPOSIT_EUR}
                            max={MAX_PRICE_LOCK_EUR}
                            step="0.01"
                            value={form.amountEur}
                            onChange={(event) => setField('amountEur', event.target.value)}
                            disabled={busy}
                            className={FIELD_CLASS}
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLASS} htmlFor="treasury-client">
                            Cliente *
                        </label>
                        <input
                            id="treasury-client"
                            name="clientName"
                            required
                            minLength={MIN_TEXT}
                            maxLength={MAX_CLIENT}
                            value={form.clientName}
                            onChange={(event) => setField('clientName', event.target.value)}
                            placeholder="Nombre, apellidos o empresa"
                            disabled={busy}
                            className={FIELD_CLASS}
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLASS} htmlFor="treasury-service">
                            Servicio *
                        </label>
                        <input
                            id="treasury-service"
                            name="serviceName"
                            required
                            minLength={MIN_TEXT}
                            maxLength={MAX_SERVICE}
                            value={form.serviceName}
                            onChange={(event) => setField('serviceName', event.target.value)}
                            placeholder="Boda · Finca · Festejo"
                            disabled={busy}
                            className={FIELD_CLASS}
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] text-white/40">
                        Mínimo {formatAmount(MIN_DEPOSIT_EUR)} (SSOT). El servidor acuña el split 80/10/10 y la
                        referencia PRICELOCK a partir del SSOT: el cliente no envía ninguna cifra de reparto.
                    </p>
                    <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/50 bg-[#ecb613]/15 px-4 py-2 text-xs font-semibold text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613]/25 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                        )}
                        {busy ? 'Registrando…' : 'Registrar depósito'}
                    </button>
                </div>
            </form>

            {formError !== null ? (
                <p
                    role="alert"
                    className="mb-5 flex items-center gap-2 rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-3 text-sm text-[#FF2B44]"
                >
                    <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {formError}
                </p>
            ) : null}

            {ack !== null ? (
                <PriceLockAckPanel
                    ack={ack}
                    copiedKey={copiedKey}
                    onCopy={(key, value) => void handleCopy(key, value)}
                />
            ) : null}

            {loading ? (
                <div className="flex items-center justify-center py-16 text-white/50">
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                </div>
            ) : listingFailed && error !== null ? (
                <div className="rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44]">
                    <p className="font-semibold">
                        Error {error.status !== 0 ? `HTTP ${error.status}` : 'de red'} · {error.code}
                    </p>
                    <p className="mt-1 text-white/70">{describeError(error).text}</p>
                    <p className="mt-1 text-xs text-white/50">
                        No se pinta ninguna cifra: una tesorería vacía falsa sería peor que un error honesto.
                    </p>
                    {error.code === 'UNAUTHORIZED' ? (
                        <a
                            href="/login?from=/admin/control"
                            className="mt-3 inline-flex rounded-full border border-[#FF2B44]/40 bg-[#FF2B44]/15 px-4 py-1.5 text-xs font-semibold transition-all duration-300 ease-out hover:bg-[#FF2B44]/25"
                        >
                            Volver a iniciar sesión
                        </a>
                    ) : null}
                </div>
            ) : visible.length === 0 ? (
                <p className="py-10 text-center text-sm text-white/40">
                    {transactions.length === 0
                        ? 'Sin depósitos Price-Lock registrados todavía.'
                        : 'Ningún depósito coincide con el buscador.'}
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-white/50">
                                <th scope="col" className="px-4 py-3 font-medium">Cliente</th>
                                <th scope="col" className="px-4 py-3 font-medium">Servicio</th>
                                <th scope="col" className="px-4 py-3 font-medium">Depósito</th>
                                <th scope="col" className="px-4 py-3 font-medium">Referencia</th>
                                <th scope="col" className="px-4 py-3 font-medium">Origen SHA-256</th>
                                <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                                <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-white/5 transition-colors duration-300 hover:bg-white/5"
                                >
                                    <td className="px-4 py-3 text-white/80">{row.client}</td>
                                    <td className="px-4 py-3 text-white/60">{row.service}</td>
                                    <td className="px-4 py-3 tabular-nums text-white/80">
                                        {formatDeposit(row.deposit)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <code
                                                className="max-w-[240px] truncate font-mono text-[11px] text-[#ecb613]"
                                                title={row.reference}
                                            >
                                                {row.reference}
                                            </code>
                                            <CopyButton
                                                label="Copiar referencia"
                                                value={row.reference}
                                                copied={copiedKey === `ref:${row.id}`}
                                                onCopy={() => void handleCopy(`ref:${row.id}`, row.reference)}
                                                disabled={row.reference.length === 0}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.hash === NO_HASH ? (
                                            <span className="text-white/40">—</span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="font-mono text-[11px] text-white/40"
                                                    title={row.hash}
                                                >
                                                    {row.hash.slice(0, 12)}…
                                                </span>
                                                <CopyButton
                                                    label="Copiar hash de origen"
                                                    value={row.hash}
                                                    copied={copiedKey === `hash:${row.id}`}
                                                    onCopy={() => void handleCopy(`hash:${row.id}`, row.hash)}
                                                    disabled={false}
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/80">
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-white/60">{row.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="mt-5 text-[11px] text-white/30">
                Sólo depósitos Price-Lock (`STRIPE_PRICE_LOCK`): las comisiones de afiliados viven en su
                propia pestaña. Importes y split provienen de `GET /api/admin/treasury`, calculados en
                servidor desde `ear-os-ssot.ts`: esta vista no multiplica ningún porcentaje.
            </p>
        </section>
    );
}










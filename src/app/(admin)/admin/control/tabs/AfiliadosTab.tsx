'use client';

// ============================================================================
// Ω-ADMIN · PESTAÑA AFILIADOS — ALTA CON CÓDIGO DE REFERIDO + COMISIÓN DEL
// MOTOR SSOT (W41_T15)
// ----------------------------------------------------------------------------
// Contratos tomados de la ruta real (src/app/api/admin/affiliates/route.ts),
// no inventados:
//   GET    -> { ok:true, data: PublicAffiliate[], total, page, pageSize, pages,
//               tierCatalog, kycThresholdEur }
//   POST   body .strict(): { email* (<=180), name? (1..120), companyName? (2..160),
//              cifNif? (8..20), phone? (6..24), category? (2..40, def. PRESCRIPTOR),
//              tier? (BRONZE|SILVER|GOLD|PLATINUM, def. BRONZE) }
//            -> 201 { ok:true, data } · 409 «El usuario ya tiene perfil de
//               afiliado…» · 400 VALIDATION + issues · 503 código agotado
//   PATCH  body .strict(): { id*, tier?, isActive?, isHomologated?, kycStatus?,
//              category?, companyName?, cifNif?, phone?, payoutMethod?,
//              payoutDetails? }
//
// DOCTRINA DEL DINERO (cero hardcoding):
//   · La comisión que se pinta es SIEMPRE `row.commissionRate`, la que devuelve
//     el motor SSOT (`affiliateCommissionEngine`) y re-deriva el backend al
//     cambiar de tier. Este fichero NO declara ni un solo porcentaje propio:
//     mandar `commissionRate` desde aquí haría saltar el `.strict()` (400).
//   · El código de referido lo reserva el servidor (único, con reintentos).
//
// DOCTRINA DE FRICCIÓN CERO (cero clics muertos):
//   · El enlace de atribución se muestra como TEXTO copiable, nunca como <a>:
//     la ruta pública /f/[code] aún no existe en disco y un anchor a un 404 es
//     exactamente el clic muerto que se prohíbe.
//   · Toda la red pasa por `useAdminResource` -> `adminFetch` (Bearer + sobre
//     Ω). Prohibido `fetch` directo.
//
// Cero `any`, cero estados inventados: un fallo se pinta como fallo y una
// escritura sólo se canta como éxito cuando `busy` vuelve a false sin `error`.
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
    X,
} from 'lucide-react';
import type { AdminApiError } from '@/lib/admin/adminTypes';
import { useAdminResource } from '../useAdminResource';

/* ── Contrato de fila (espejo exacto de `PublicAffiliate`) ────────────────── */

export type AffiliateRow = {
    id: string;
    affiliateCode: string;
    userId: string;
    companyName: string | null;
    cifNif: string | null;
    phone: string | null;
    category: string;
    payoutMethod: string;
    payoutDetails: string | null;
    hasPayoutDetails: boolean;
    /** Tier efectivo guardado en base de datos. */
    tier: string;
    /** Comisión del motor SSOT, ya resuelta en puntos porcentuales (no la fija la UI). */
    commissionRate: number;
    /** Tier que el motor inferiría por volumen de ventas acumuladas. */
    tierBySales: string;
    isHomologated: boolean;
    isActive: boolean;
    kycStatus: string;
    totalSalesGenerated: number;
    user: { email: string; name: string | null; role: string };
    counts: { ledgers: number; referrals: number; payouts: number };
    createdAt: string;
    updatedAt: string;
};

/** Enum real de `AffiliateTier` (espejo de la ruta y de Prisma). */
export const AFFILIATE_TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const;

export type AffiliateTier = (typeof AFFILIATE_TIERS)[number];

/** Etiquetas humanas: el valor enviado sigue siendo el enum, nunca el texto. */
const TIER_LABELS: Readonly<Record<AffiliateTier, string>> = {
    BRONZE: 'Bronce',
    SILVER: 'Plata',
    GOLD: 'Oro',
    PLATINUM: 'Platino',
};

const LIST_PATH = '/api/admin/affiliates';

/**
 * Dominio público de atribución (misma convención que el resto del repo:
 * `process.env.NEXT_PUBLIC_BASE_URL` con fallback al dominio que factura).
 */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://productoraear.com';

/* Límites espejo del zod del servidor (el servidor sigue siendo el juez). */
const MAX_EMAIL = 180;
const MAX_NAME = 120;
const MIN_COMPANY = 2;
const MAX_COMPANY = 160;
const MIN_DOC = 8;
const MAX_DOC = 20;
const MIN_PHONE = 6;
const MAX_PHONE = 24;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormValues = {
    email: string;
    name: string;
    companyName: string;
    cifNif: string;
    phone: string;
    tier: AffiliateTier;
};

const EMPTY_FORM: FormValues = {
    email: '',
    name: '',
    companyName: '',
    cifNif: '',
    phone: '',
    tier: 'BRONZE',
};

type Notice = {
    kind: 'ok' | 'error';
    text: string;
    details: readonly string[];
};

/** Acción de escritura en vuelo: se resuelve cuando `busy` vuelve a false. */
type PendingAction = {
    actionLabel: string;
    successText: string;
    resetsForm: boolean;
};

/* ── Utilidades puras ─────────────────────────────────────────────────────── */

/** `commissionRate` del motor SSOT ya viaja resuelto: aquí sólo se formatea. */
function formatRate(rate: number): string {
    if (!Number.isFinite(rate)) return '—';
    return rate % 1 === 0 ? `${rate.toFixed(0)} %` : `${rate.toFixed(2)} %`;
}

function formatSales(total: number): string {
    if (!Number.isFinite(total)) return '—';
    return `${total.toLocaleString('es-ES')} €`;
}

function isAffiliateTier(value: string): value is AffiliateTier {
    return (AFFILIATE_TIERS as readonly string[]).includes(value);
}

function tierLabel(value: string): string {
    return isAffiliateTier(value) ? TIER_LABELS[value] : value;
}

/** Etiqueta de fila: empresa manda; después nombre; después email. */
function labelOf(row: AffiliateRow): string {
    const company = row.companyName?.trim();
    if (company !== undefined && company.length > 0) return company;
    const name = row.user.name?.trim();
    if (name !== undefined && name.length > 0) return name;
    return row.user.email;
}

/** Enlace de atribución (sólo se muestra y se copia: no se navega). */
function referralLink(code: string): string {
    return `${BASE_URL.replace(/\/+$/, '')}/f/${code}`;
}

function digitsOf(raw: string): string {
    return raw.replace(/\D/g, '');
}

function toOptional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
}

function matchesQuery(row: AffiliateRow, query: string): boolean {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return true;
    return [
        row.affiliateCode,
        row.companyName,
        row.user.name,
        row.user.email,
        row.tier,
        row.category,
        row.kycStatus,
        row.phone,
    ]
        .filter((value): value is string => typeof value === 'string')
        .some((value) => value.toLowerCase().includes(needle));
}

/** Traduce el fallo normalizado del cliente Ω a texto accionable (nada inventado). */
function describeError(error: AdminApiError): { text: string; details: readonly string[] } {
    if (error.code === 'UNAUTHORIZED') {
        return {
            text: 'Sesión caducada: el panel no puede escribir sin token.',
            details: [error.message],
        };
    }
    if (error.code === 'FORBIDDEN') {
        return { text: 'Tu rol no permite operar la red de afiliados.', details: [error.message] };
    }
    if (error.code === 'CONFLICT') {
        return {
            text: 'El afiliado ya existe (ese email ya tiene perfil): edita la fila existente en vez de duplicarla.',
            details: [error.message],
        };
    }
    if (error.code === 'VALIDATION') {
        const issues = error.issues ?? [];
        return {
            text: 'El servidor rechazó los datos enviados.',
            details: issues.length > 0 ? issues : [error.message],
        };
    }
    if (error.code === 'NOT_FOUND') {
        return {
            text: 'El afiliado ya no existe: refresca antes de reintentar.',
            details: [error.message],
        };
    }
    if (error.code === 'CONFIG') {
        return { text: 'Firebase no está configurado en este entorno.', details: [error.message] };
    }
    if (error.status === 0) {
        return { text: 'Sin respuesta del servidor (red caída).', details: [error.message] };
    }
    return { text: `${error.message} (HTTP ${error.status})`, details: [] };
}

/** Validación previa al POST: evita un viaje inútil y explica qué falla. */
function validateForm(values: FormValues): string | null {
    const email = values.email.trim();
    if (email.length === 0) return 'El email del afiliado es obligatorio.';
    if (email.length > MAX_EMAIL) return `El email no puede superar ${MAX_EMAIL} caracteres.`;
    if (!EMAIL_REGEX.test(email)) return 'El email no tiene un formato válido.';

    const name = values.name.trim();
    if (name.length > MAX_NAME) return `El nombre no puede superar ${MAX_NAME} caracteres.`;

    const company = values.companyName.trim();
    if (company.length > 0 && company.length < MIN_COMPANY) {
        return `La razón social necesita al menos ${MIN_COMPANY} caracteres.`;
    }
    if (company.length > MAX_COMPANY) {
        return `La razón social no puede superar ${MAX_COMPANY} caracteres.`;
    }

    const doc = values.cifNif.trim();
    if (doc.length > 0) {
        if (doc.length < MIN_DOC) return `El CIF/NIF necesita al menos ${MIN_DOC} caracteres.`;
        if (doc.length > MAX_DOC) return `El CIF/NIF no puede superar ${MAX_DOC} caracteres.`;
    }

    const phone = values.phone.trim();
    if (phone.length > 0) {
        if (phone.length < MIN_PHONE) return `El teléfono necesita al menos ${MIN_PHONE} caracteres.`;
        if (phone.length > MAX_PHONE) return `El teléfono no puede superar ${MAX_PHONE} caracteres.`;
        if (digitsOf(phone).length < MIN_PHONE) {
            return 'El teléfono necesita dígitos reales: el servidor descarta lo que no sea contactable.';
        }
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

function NoticeBanner({ notice, onDismiss }: { notice: Notice; onDismiss: () => void }) {
    const ok = notice.kind === 'ok';
    return (
        <div
            className={`mb-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border p-4 text-sm ${
                ok
                    ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
                    : 'border-[#FF2B44]/30 bg-[#FF2B44]/10 text-[#FF2B44]'
            }`}
        >
            <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold">
                    {ok ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
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

function ActiveBadge({ active }: { active: boolean }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${
                active
                    ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
                    : 'border-white/15 bg-white/5 text-white/45'
            }`}
        >
            {active ? 'ACTIVO' : 'SUSPENDIDO'}
        </span>
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

/* ── Pestaña ─────────────────────────────────────────────────────────────── */

/**
 * Pestaña Afiliados: alta real (código único + tier del motor), enlace de
 * atribución copiable y activación/suspensión por fila.
 * `query` llega del buscador global del shell para no dejar un control muerto.
 */
export function AfiliadosTab({ query = '' }: { query?: string }): ReactElement {
    const { status, rows, total, error, busy, create, patch, reload } =
        useAdminResource<AffiliateRow>(LIST_PATH);

    const [form, setForm] = useState<FormValues>(EMPTY_FORM);
    const [formError, setFormError] = useState<string | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const pendingRef = useRef<PendingAction | null>(null);
    const wasBusyRef = useRef(false);
    const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const visible = useMemo(() => rows.filter((row) => matchesQuery(row, query)), [rows, query]);

    // Resultado de la última escritura: cuando `busy` vuelve a false, el hook ya
    // consolidó `error` en el mismo render. Un éxito sólo se canta si no hay error.
    useEffect(() => {
        if (busy) {
            wasBusyRef.current = true;
            return;
        }
        if (!wasBusyRef.current) return;
        wasBusyRef.current = false;

        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending === null) return;

        if (error === null) {
            setNotice({ kind: 'ok', text: pending.successText, details: [] });
            if (pending.resetsForm) {
                setForm(EMPTY_FORM);
                setFormError(null);
            }
            return;
        }

        const described = describeError(error);
        // `mutate` deja `error` no nulo tras una escritura fallida O tras una
        // recarga fallida. Si el listado quedó en 'error', la escritura PUDO
        // guardarse: se avisa para no duplicar el alta al reintentar.
        const reloadFailed = status === 'error';
        setNotice({
            kind: 'error',
            text: `${pending.actionLabel}: ${described.text}`,
            details: reloadFailed
                ? [
                      ...described.details,
                      'La escritura pudo guardarse y fallar la recarga: pulsa Refrescar y comprueba la fila antes de reintentar para no duplicar el alta.',
                  ]
                : described.details,
        });
    }, [busy, error, status]);

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

    const handleCreate = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const validation = validateForm(form);
        if (validation !== null) {
            setFormError(validation);
            return;
        }

        setFormError(null);
        setNotice(null);

        const email = form.email.trim();
        const tier = form.tier;

        // Payload EXACTO del CreateSchema (.strict()): `commissionRate` y
        // `category` no viajan desde la UI; la comisión la deriva el motor.
        const payload: {
            email: string;
            tier: AffiliateTier;
            name?: string;
            companyName?: string;
            cifNif?: string;
            phone?: string;
        } = { email, tier };

        const name = toOptional(form.name);
        if (name !== undefined) payload.name = name;
        const companyName = toOptional(form.companyName);
        if (companyName !== undefined) payload.companyName = companyName;
        const cifNif = toOptional(form.cifNif);
        if (cifNif !== undefined) payload.cifNif = cifNif;
        const phone = toOptional(form.phone);
        if (phone !== undefined) payload.phone = phone;

        pendingRef.current = {
            actionLabel: 'Alta de afiliado',
            successText: `Afiliado «${email}» creado: el servidor reservó su código de referido y la comisión que dicta el motor SSOT.`,
            resetsForm: true,
        };

        await create(payload);
    };

    const handleToggleActive = async (row: AffiliateRow): Promise<void> => {
        const next = !row.isActive;
        setNotice(null);
        pendingRef.current = {
            actionLabel: next ? 'Activación' : 'Suspensión',
            successText: next
                ? `Afiliado «${labelOf(row)}» activado.`
                : `Afiliado «${labelOf(row)}» suspendido: su histórico contable queda intacto.`,
            resetsForm: false,
        };
        await patch({ id: row.id, isActive: next });
    };

    const handleTierChange = async (row: AffiliateRow, next: AffiliateTier): Promise<void> => {
        if (next === row.tier) return;
        setNotice(null);
        pendingRef.current = {
            actionLabel: 'Cambio de tier',
            successText: `Tier de «${labelOf(row)}» actualizado a ${TIER_LABELS[next]}: la comisión la re-deriva el motor SSOT.`,
            resetsForm: false,
        };
        // La comisión NO se envía: el PATCH la recalcula desde el motor.
        await patch({ id: row.id, tier: next });
    };

    const loading = status === 'loading' || status === 'idle';
    // Un fallo de ESCRITURA llega con `status` todavía en 'success': la tabla
    // sigue siendo válida y el fallo se anuncia en el banner, sin borrarla.
    const listingFailed = status === 'error' && error !== null;

    return (
        <section
            aria-busy={busy}
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md"
        >
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Red de afiliados</h2>
                    <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]">
                        {listingFailed || loading ? '—' : total}
                    </span>
                    {status === 'success' && visible.length !== rows.length ? (
                        <span className="text-xs text-white/40">{visible.length} filtrados</span>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={() => void reload()}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613]"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
                    Refrescar
                </button>
            </header>

            {/* Anuncio accesible del resultado real de cada escritura. */}
            <div aria-live="polite">
                {notice !== null ? (
                    <NoticeBanner notice={notice} onDismiss={() => setNotice(null)} />
                ) : null}
            </div>

            <form
                onSubmit={handleCreate}
                noValidate
                className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-4"
            >
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">Alta de afiliado</h3>
                    <p className="text-[11px] text-white/40">
                        La comisión la fija el motor SSOT al guardar: aquí no se introduce a mano.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="afiliado-email" className="text-xs font-medium text-white/70">
                            Email <span className="text-[#ecb613]">*</span>
                        </label>
                        <input
                            id="afiliado-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            maxLength={MAX_EMAIL}
                            value={form.email}
                            onChange={(event) => setField('email', event.target.value)}
                            placeholder="afiliado@empresa.com"
                            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="afiliado-name" className="text-xs font-medium text-white/70">
                            Nombre de contacto
                        </label>
                        <input
                            id="afiliado-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            maxLength={MAX_NAME}
                            value={form.name}
                            onChange={(event) => setField('name', event.target.value)}
                            placeholder="Ej. Marta Ruiz"
                            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="afiliado-company" className="text-xs font-medium text-white/70">
                            Razón social
                        </label>
                        <input
                            id="afiliado-company"
                            name="companyName"
                            type="text"
                            autoComplete="organization"
                            maxLength={MAX_COMPANY}
                            value={form.companyName}
                            onChange={(event) => setField('companyName', event.target.value)}
                            placeholder="Ej. Bodas del Tajo S.L."
                            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="afiliado-cif" className="text-xs font-medium text-white/70">
                            CIF / NIF
                        </label>
                        <input
                            id="afiliado-cif"
                            name="cifNif"
                            type="text"
                            maxLength={MAX_DOC}
                            value={form.cifNif}
                            onChange={(event) => setField('cifNif', event.target.value)}
                            placeholder="B12345678"
                            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="afiliado-phone" className="text-xs font-medium text-white/70">
                            Teléfono
                        </label>
                        <input
                            id="afiliado-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            maxLength={MAX_PHONE}
                            value={form.phone}
                            onChange={(event) => setField('phone', event.target.value)}
                            placeholder="+34 6XX XXX XXX"
                            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="afiliado-tier" className="text-xs font-medium text-white/70">
                            Tier de partida
                        </label>
                        <select
                            id="afiliado-tier"
                            name="tier"
                            value={form.tier}
                            onChange={(event) => {
                                const next = event.target.value;
                                if (!isAffiliateTier(next)) return;
                                setForm((prev) => ({ ...prev, tier: next }));
                            }}
                            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[#ecb613]/60 focus:outline-none"
                        >
                            {AFFILIATE_TIERS.map((tier) => (
                                <option key={tier} value={tier}>
                                    {TIER_LABELS[tier]} ({tier})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {formError !== null ? (
                    <p role="alert" className="mt-3 text-xs font-medium text-[#FF2B44]">
                        {formError}
                    </p>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/50 bg-[#ecb613]/15 px-4 py-2 text-sm font-semibold text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613]/25 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Plus className="h-4 w-4" aria-hidden="true" />
                        )}
                        Dar de alta
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setForm(EMPTY_FORM);
                            setFormError(null);
                        }}
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all duration-300 ease-out hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                        Limpiar
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-white/50">
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                    <span className="sr-only">Cargando red de afiliados</span>
                </div>
            ) : listingFailed && error !== null ? (
                <div
                    role="alert"
                    className="rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44]"
                >
                    <p className="font-semibold">
                        Error {error.status !== 0 ? `HTTP ${error.status}` : 'de red'} · {error.code}
                    </p>
                    <p className="mt-1 text-white/70">{error.message}</p>
                    <p className="mt-2 text-xs text-white/40">
                        La tabla no se pinta porque la fuente falló: cero filas inventadas.
                    </p>
                </div>
            ) : visible.length === 0 ? (
                <p className="py-10 text-center text-sm text-white/40">
                    {rows.length === 0
                        ? 'Sin afiliados registrados todavía: da de alta el primero en el formulario de arriba.'
                        : 'Ningún afiliado coincide con la búsqueda.'}
                </p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-white/50">
                                    <th scope="col" className="px-3 py-3 font-medium">
                                        Código
                                    </th>
                                    <th scope="col" className="px-3 py-3 font-medium">
                                        Afiliado
                                    </th>
                                    <th scope="col" className="px-3 py-3 font-medium">
                                        Tier
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right font-medium">
                                        Comisión
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right font-medium">
                                        Ventas
                                    </th>
                                    <th scope="col" className="px-3 py-3 font-medium">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-3 py-3 font-medium">
                                        Enlace de atribución
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-white/5 align-top transition-colors duration-300 hover:bg-white/5"
                                    >
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-[#ecb613]">
                                                    {row.affiliateCode}
                                                </span>
                                                <CopyButton
                                                    label={`Copiar código de ${labelOf(row)}`}
                                                    value={row.affiliateCode}
                                                    copied={copiedKey === `code:${row.id}`}
                                                    onCopy={() =>
                                                        void handleCopy(`code:${row.id}`, row.affiliateCode)
                                                    }
                                                    disabled={busy}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="text-white/80">{labelOf(row)}</p>
                                            <p className="text-[11px] text-white/40">{row.user.email}</p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <label htmlFor={`afiliado-tier-${row.id}`} className="sr-only">
                                                Tier de {labelOf(row)}
                                            </label>
                                            <select
                                                id={`afiliado-tier-${row.id}`}
                                                value={row.tier}
                                                disabled={busy}
                                                onChange={(event) => {
                                                    const next = event.target.value;
                                                    if (!isAffiliateTier(next)) return;
                                                    void handleTierChange(row, next);
                                                }}
                                                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white focus:border-[#ecb613]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {isAffiliateTier(row.tier) ? null : (
                                                    <option value={row.tier}>
                                                        {row.tier.length > 0
                                                            ? `${row.tier} (legado)`
                                                            : 'SIN TIER'}
                                                    </option>
                                                )}
                                                {AFFILIATE_TIERS.map((tier) => (
                                                    <option key={tier} value={tier}>
                                                        {TIER_LABELS[tier]}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td
                                            className="px-3 py-3 text-right tabular-nums text-white/80"
                                            title={`Tier que dicta el volumen de ventas: ${tierLabel(row.tierBySales)}`}
                                        >
                                            {formatRate(row.commissionRate)}
                                        </td>
                                        <td className="px-3 py-3 text-right tabular-nums text-white/80">
                                            {formatSales(row.totalSalesGenerated)}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <ActiveBadge active={row.isActive} />
                                                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
                                                        KYC {row.kycStatus}
                                                    </span>
                                                    {row.isHomologated ? (
                                                        <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-2 py-0.5 text-[11px] text-[#ecb613]">
                                                            HOMOLOGADO
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => void handleToggleActive(row)}
                                                    disabled={busy}
                                                    className={`rounded-full border px-3 py-1 text-xs transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-40 ${
                                                        row.isActive
                                                            ? 'border-[#FF2B44]/40 bg-[#FF2B44]/10 text-[#FF2B44] hover:bg-[#FF2B44]/20'
                                                            : 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20'
                                                    }`}
                                                >
                                                    {row.isActive ? 'Suspender' : 'Activar'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="max-w-[230px] truncate font-mono text-[11px] text-white/50"
                                                    title={referralLink(row.affiliateCode)}
                                                >
                                                    {referralLink(row.affiliateCode)}
                                                </span>
                                                <CopyButton
                                                    label={`Copiar enlace de atribución de ${labelOf(row)}`}
                                                    value={referralLink(row.affiliateCode)}
                                                    copied={copiedKey === `link:${row.id}`}
                                                    onCopy={() =>
                                                        void handleCopy(
                                                            `link:${row.id}`,
                                                            referralLink(row.affiliateCode),
                                                        )
                                                    }
                                                    disabled={busy}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[11px] text-white/35">
                        {'El enlace se copia para compartirlo; no se abre desde aquí para no servir un 404 mientras la ruta pública '}
                        {'/f/<código>'}
                        {' no esté publicada.'}
                    </p>
                </>
            )}
        </section>
    );
}





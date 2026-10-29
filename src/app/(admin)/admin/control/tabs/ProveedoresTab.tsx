'use client';

// ============================================================================
// Ω-ADMIN · PESTAÑA PROVEEDORES — ALTA HOMOLOGADA + CONTROL DE RATING (W41_T12)
// ----------------------------------------------------------------------------
// Contratos tomados de la ruta real (src/app/api/admin/providers/route.ts),
// no inventados:
//   GET   -> { ok: true, data: ProviderRow[], total }  (take fijo 500; `size`
//            se ignora porque el zod de query no declara ese parámetro)
//   POST  body .strict(): { name*(2..160), companyName?, category*(enum 8),
//           city?, province?(2..120, default 'Madrid / Toledo'), phone?(<=24),
//           email?, description?(<=4000), claimStatus?, status? }
//           -> 201 { ok: true, data } · 409 CONFLICT · 400 VALIDATION + issues
//   PATCH body .strict(): { id*, status?, rating?(0..5) } — nada más.
//
// DOCTRINA DEL DATO VERIFICADO (cero verified de fachada):
//   · El cliente NUNCA envía `isVerified` ni `claimStatus:'VERIFIED_ACTIVE'`.
//     El POST omite ambos campos a propósito: el servidor calcula `isVerified`
//     comparando el teléfono real contra la centralita del CEO.
//   · Consecuencia honesta: el alta nace GHOST_UNCLAIMED/DRAFT y la tabla lo
//     pinta tal cual. Ningún badge «Real» se fabrica en el cliente.
//   · La promoción a ACTIVE_VERIFIED se BLOQUEA aquí para filas no verificadas,
//     porque el PATCH del servidor sólo valida `status` y `rating`.
//
// Toda la red pasa por `useAdminResource` -> `adminFetch` (Bearer + sobre Ω).
// Cero `any`, cero estados inventados: un fallo se pinta como fallo.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import Link from 'next/link';
import {
    AlertTriangle,
    CheckCircle2,
    Loader2,
    RefreshCw,
    ShieldCheck,
    Store,
    X,
} from 'lucide-react';
import type { AdminApiError } from '@/lib/admin/adminTypes';
import { useAdminResource } from '../useAdminResource';

/** Fila real devuelta por GET /api/admin/providers (providerProfile completo). */
export type ProviderRow = {
    id: string;
    name?: string | null;
    companyName?: string | null;
    slug?: string | null;
    category?: string | null;
    city?: string | null;
    province?: string | null;
    phone?: string | null;
    email?: string | null;
    description?: string | null;
    claimStatus?: string | null;
    status?: string | null;
    rating?: number | null;
    isVerified?: boolean | null;
    updatedAt?: string | null;
};

/** Enum real de `VendorCategory` (espejo exacto de la ruta y de Prisma). */
export const PROVIDER_CATEGORIES = [
    'FINCA_ALQUILER',
    'CATERING',
    'DJ_DISCOMOVIL',
    'BARRA_LIBRE',
    'FOTOGRAFIA_VIDEO',
    'FLORISTERIA',
    'TRANSPORTE_AUTOBUS',
    'DECORACION_ILUMINACION',
] as const;

export type ProviderCategory = (typeof PROVIDER_CATEGORIES)[number];

/** Etiquetas humanas: el valor enviado sigue siendo el enum, nunca el texto. */
const CATEGORY_LABELS: Readonly<Record<ProviderCategory, string>> = {
    FINCA_ALQUILER: 'Finca / Alquiler',
    CATERING: 'Catering',
    DJ_DISCOMOVIL: 'DJ / Discomóvil',
    BARRA_LIBRE: 'Barra libre',
    FOTOGRAFIA_VIDEO: 'Fotografía y vídeo',
    FLORISTERIA: 'Floristería',
    TRANSPORTE_AUTOBUS: 'Transporte (autobús)',
    DECORACION_ILUMINACION: 'Decoración e iluminación',
};

/** Estados operativos que expone el panel (el servidor acepta string 1..64). */
type ProviderStatus = 'DRAFT' | 'ACTIVE_VERIFIED' | 'SUSPENDED';
const PROVIDER_STATUSES: readonly ProviderStatus[] = ['DRAFT', 'ACTIVE_VERIFIED', 'SUSPENDED'];

const LIST_PATH = '/api/admin/providers';
const DEFAULT_PROVINCE = 'Madrid / Toledo';
const MAX_NAME = 160;
const MAX_COMPANY = 160;
const MAX_CITY = 120;
const MAX_PROVINCE = 120;
const MAX_PHONE = 24;
const MAX_EMAIL = 180;
const MAX_DESCRIPTION = 4000;
const MIN_PHONE_DIGITS = 9;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Notice = {
    kind: 'ok' | 'error';
    text: string;
    details: readonly string[];
};

/** Acción de escritura en vuelo: se resuelve cuando `busy` vuelve a false. */
type PendingAction = {
    actionLabel: string;
    successText: string;
    closesModal: boolean;
};

type FormValues = {
    name: string;
    companyName: string;
    category: string;
    province: string;
    city: string;
    phone: string;
    email: string;
    description: string;
};

const EMPTY_FORM: FormValues = {
    name: '',
    companyName: '',
    category: '',
    province: DEFAULT_PROVINCE,
    city: '',
    phone: '',
    email: '',
    description: '',
};

/** Etiqueta de fila: empresa manda; si no hay, nombre; nunca un id inventado. */
function labelOf(row: ProviderRow): string {
    const company = row.companyName?.trim();
    if (company !== undefined && company.length > 0) return company;
    const name = row.name?.trim();
    if (name !== undefined && name.length > 0) return name;
    return row.id.slice(0, 8);
}

function digitsOf(raw: string): string {
    return raw.replace(/\D/g, '');
}

function isProviderCategory(value: string): value is ProviderCategory {
    return (PROVIDER_CATEGORIES as readonly string[]).includes(value);
}

function categoryLabel(value?: string | null): string {
    if (typeof value !== 'string' || value.length === 0) return '—';
    return isProviderCategory(value) ? CATEGORY_LABELS[value] : value;
}

function isProviderStatus(value: string): value is ProviderStatus {
    return (PROVIDER_STATUSES as readonly string[]).includes(value);
}

function matchesQuery(row: ProviderRow, query: string): boolean {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return true;
    return [
        row.name,
        row.companyName,
        row.city,
        row.province,
        row.category,
        row.status,
        row.claimStatus,
        row.phone,
        row.email,
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
    if (error.code === 'CONFLICT') {
        return { text: 'Ese proveedor ya existe (nombre o slug duplicado).', details: [error.message] };
    }
    if (error.code === 'VALIDATION') {
        const issues = error.issues ?? [];
        return {
            text: 'El servidor rechazó los datos del formulario.',
            details: issues.length > 0 ? issues : [error.message],
        };
    }
    if (error.code === 'NOT_FOUND') {
        return {
            text: 'El proveedor ya no existe: refresca antes de reintentar.',
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

function toOptional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
}

/** Validación previa al POST: evita un viaje inútil y explica exactamente qué falla. */
function validateForm(values: FormValues): string | null {
    const name = values.name.trim();
    if (name.length === 0) return 'El nombre del proveedor es obligatorio.';
    if (name.length < 2) return 'El nombre del proveedor debe tener al menos 2 caracteres.';
    if (name.length > MAX_NAME) return `El nombre no puede superar ${MAX_NAME} caracteres.`;

    if (!isProviderCategory(values.category)) {
        return 'Selecciona una categoría homologada de la lista.';
    }

    const province = values.province.trim();
    if (province.length < 2) return 'La provincia es obligatoria (mínimo 2 caracteres).';
    if (province.length > MAX_PROVINCE) {
        return `La provincia no puede superar ${MAX_PROVINCE} caracteres.`;
    }

    if (values.companyName.trim().length > MAX_COMPANY) {
        return `La razón social no puede superar ${MAX_COMPANY} caracteres.`;
    }
    if (values.city.trim().length > MAX_CITY) {
        return `La ciudad no puede superar ${MAX_CITY} caracteres.`;
    }

    const phone = values.phone.trim();
    if (phone.length > 0) {
        if (phone.length > MAX_PHONE) return `El teléfono no puede superar ${MAX_PHONE} caracteres.`;
        if (digitsOf(phone).length < MIN_PHONE_DIGITS) {
            return `El teléfono necesita al menos ${MIN_PHONE_DIGITS} dígitos: si no, el servidor lo descarta y el proveedor nunca podrá verificarse.`;
        }
    }

    const email = values.email.trim();
    if (email.length > 0) {
        if (email.length > MAX_EMAIL) return `El email no puede superar ${MAX_EMAIL} caracteres.`;
        if (!EMAIL_REGEX.test(email)) return 'El email no tiene un formato válido.';
    }

    if (values.description.trim().length > MAX_DESCRIPTION) {
        return `La descripción no puede superar ${MAX_DESCRIPTION} caracteres.`;
    }

    return null;
}

/* ── Piezas de presentación ──────────────────────────────────────────────── */

/** Badge de verificación: única fuente de verdad es el booleano del servidor. */
function VerifiedBadge({ verified }: { verified: boolean }): ReactElement {
    if (verified) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2 py-0.5 text-[11px] font-medium text-[#00E5FF]">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Real
            </span>
        );
    }
    return (
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/45">
            No verificado
        </span>
    );
}

/** Badge de claim: color por estado real, sin inventar semántica. */
function ClaimBadge({ value }: { value?: string | null }): ReactElement {
    const label = typeof value === 'string' && value.trim().length > 0 ? value.trim() : 'SIN CLAIM';
    const tone =
        label === 'VERIFIED_ACTIVE'
            ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
            : label === 'CLAIMED_PENDING_VERIFICATION'
              ? 'border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]'
              : 'border-white/15 bg-white/5 text-white/50';

    return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}>{label}</span>;
}

/**
 * Rating editable por fila. El borrador vive en local para no lanzar un PATCH
 * por tecla: se confirma al salir del campo (blur) o con Enter, un solo viaje.
 */
function RatingControl({
    row,
    disabled,
    onCommit,
}: {
    row: ProviderRow;
    disabled: boolean;
    onCommit: (raw: string) => void;
}): ReactElement {
    const [draft, setDraft] = useState<string>(
        typeof row.rating === 'number' && Number.isFinite(row.rating) ? row.rating.toFixed(1) : '',
    );

    // Si el servidor devuelve otro rating (reload tras PATCH), el borrador se sincroniza.
    useEffect(() => {
        setDraft(typeof row.rating === 'number' && Number.isFinite(row.rating) ? row.rating.toFixed(1) : '');
    }, [row.rating]);

    const inputId = `proveedor-rating-${row.id}`;
    const label = labelOf(row);

    return (
        <div className="flex items-center gap-2">
            <label htmlFor={inputId} className="sr-only">
                Rating de {label} (0 a 5)
            </label>
            <input
                id={inputId}
                type="number"
                inputMode="decimal"
                min={0}
                max={5}
                step={0.1}
                value={draft}
                disabled={disabled}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={() => onCommit(draft)}
                onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    event.currentTarget.blur();
                }}
                className="w-16 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs tabular-nums text-white focus:border-[#ecb613]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
            <span className="text-[11px] text-white/30" aria-hidden="true">
                /5
            </span>
        </div>
    );
}

/**
 * Selector de estado por fila. `ACTIVE_VERIFIED` queda deshabilitado si el
 * servidor no ha verificado la fila: el PATCH del servidor sólo valida
 * `status`/`rating`, así que el blindaje del dato verificado vive aquí.
 */
function StatusControl({
    row,
    disabled,
    onChange,
}: {
    row: ProviderRow;
    disabled: boolean;
    onChange: (next: ProviderStatus) => void;
}): ReactElement {
    const current = typeof row.status === 'string' ? row.status : '';
    const known = isProviderStatus(current) ? current : null;
    const verified = row.isVerified === true;
    const inputId = `proveedor-status-${row.id}`;

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={inputId} className="sr-only">
                Estado de {labelOf(row)}
            </label>
            <select
                id={inputId}
                value={current}
                disabled={disabled}
                onChange={(event) => {
                    const next = event.target.value;
                    if (!isProviderStatus(next)) return;
                    onChange(next);
                }}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white focus:border-[#ecb613]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
                {known === null ? (
                    <option value={current}>{current.length > 0 ? `${current} (legado)` : 'SIN ESTADO'}</option>
                ) : null}
                {PROVIDER_STATUSES.map((candidate) => {
                    const blocked = candidate === 'ACTIVE_VERIFIED' && !verified;
                    return (
                        <option key={candidate} value={candidate} disabled={blocked}>
                            {blocked ? `${candidate} — requiere teléfono real` : candidate}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

/* ── Pestaña ─────────────────────────────────────────────────────────────── */

/**
 * Pestaña Proveedores: alta homologada + rating/estado por fila.
 * `query` llega del buscador global del shell para no dejar un control muerto.
 */
export function ProveedoresTab({ query = '' }: { query?: string }): ReactElement {
    const { status, rows, total, error, busy, create, patch, reload } =
        useAdminResource<ProviderRow>(LIST_PATH);

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormValues>(EMPTY_FORM);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const pendingRef = useRef<PendingAction | null>(null);
    const wasBusyRef = useRef(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const firstFieldRef = useRef<HTMLInputElement | null>(null);

    const closeForm = useCallback((): void => {
        setOpen(false);
        setFormError(null);
        triggerRef.current?.focus();
    }, []);

    // Diálogo: foco inicial en el primer campo y cierre con Escape (WCAG 2.2).
    useEffect(() => {
        if (!open) return;
        firstFieldRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key !== 'Escape') return;
            setOpen(false);
            setFormError(null);
            triggerRef.current?.focus();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    // Resultado de la última escritura: cuando `busy` vuelve a false, el hook ya
    // consolidó `error` en el mismo render; aquí se decide éxito o fracaso real.
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
            if (pending.closesModal) {
                setForm(EMPTY_FORM);
                setFormError(null);
                setOpen(false);
                triggerRef.current?.focus();
            }
            return;
        }

        const described = describeError(error);
        // `mutate` sólo deja `error` no nulo tras una escritura fallida o tras una
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

    const setField = (key: keyof FormValues, value: string): void => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const validation = validateForm(form);
        if (validation !== null) {
            setFormError(validation);
            return;
        }

        const category = form.category;
        if (!isProviderCategory(category)) {
            setFormError('Selecciona una categoría homologada de la lista.');
            return;
        }

        setFormError(null);
        setNotice(null);

        const name = form.name.trim();
        pendingRef.current = {
            actionLabel: 'Alta de proveedor',
            successText: `Proveedor «${name}» creado. Nace en DRAFT: la verificación la decide el servidor según el teléfono real.`,
            closesModal: true,
        };

        // Payload EXACTO del CreateBodySchema (.strict()). Sin `isVerified`, sin
        // `claimStatus`, sin `status`: los tres son decisión del servidor.
        await create({
            name,
            companyName: toOptional(form.companyName),
            category,
            province: form.province.trim(),
            city: toOptional(form.city),
            phone: toOptional(form.phone),
            email: toOptional(form.email),
            description: toOptional(form.description),
        });
    };

    const changeStatus = async (row: ProviderRow, next: ProviderStatus): Promise<void> => {
        const name = labelOf(row);
        const current = typeof row.status === 'string' ? row.status : '';

        if (next === current) {
            // Sin cambio real: no se gasta un PATCH que ensuciaría updatedAt.
            setNotice({
                kind: 'ok',
                text: `«${name}» ya está en ${next}: no se ha enviado ninguna escritura.`,
                details: [],
            });
            return;
        }

        if (next === 'ACTIVE_VERIFIED' && row.isVerified !== true) {
            setNotice({
                kind: 'error',
                text: `«${name}» no puede pasar a ACTIVE_VERIFIED: el servidor no lo ha verificado.`,
                details: [
                    'El dato verificado nace de un teléfono real distinto de la centralita; el panel no puede forzarlo.',
                    'Registra el teléfono real y vuelve a refrescar: sólo entonces se habilita esa opción.',
                ],
            });
            return;
        }

        setNotice(null);
        pendingRef.current = {
            actionLabel: `Estado de «${name}»`,
            successText: `«${name}» pasa a ${next}.`,
            closesModal: false,
        };
        await patch({ id: row.id, status: next });
    };

    const commitRating = async (row: ProviderRow, raw: string): Promise<void> => {
        const name = labelOf(row);
        const trimmed = raw.trim();

        if (trimmed.length === 0) {
            setNotice({
                kind: 'error',
                text: `Rating de «${name}»: el valor no puede estar vacío.`,
                details: ['Introduce un número entre 0 y 5 (paso 0.1) o refresca para descartar el cambio.'],
            });
            return;
        }

        const parsed = Number(trimmed);
        if (!Number.isFinite(parsed)) {
            setNotice({
                kind: 'error',
                text: `Rating de «${name}»: «${trimmed}» no es un número.`,
                details: [],
            });
            return;
        }
        if (parsed < 0 || parsed > 5) {
            setNotice({
                kind: 'error',
                text: `Rating de «${name}»: ${parsed} está fuera del rango 0–5.`,
                details: ['El servidor rechaza cualquier rating fuera de [0, 5].'],
            });
            return;
        }
        if (typeof row.rating === 'number' && Math.abs(row.rating - parsed) < 1e-9) {
            // Mismo valor: sin escritura ni ruido en la telemetría.
            return;
        }

        setNotice(null);
        pendingRef.current = {
            actionLabel: `Rating de «${name}»`,
            successText: `«${name}» puntúa ahora ${parsed.toFixed(1)} / 5.`,
            closesModal: false,
        };
        await patch({ id: row.id, rating: parsed });
    };

    const visible = rows.filter((row) => matchesQuery(row, query));
    const loading = status === 'idle' || status === 'loading';
    // Fallo de LECTURA: el listado no es fiable. Un fallo de ESCRITURA deja
    // `status` en 'success' y se comunica por `notice`, sin vaciar la tabla.
    const loadError = status === 'error' ? error : null;
    const sessionExpired = error?.code === 'UNAUTHORIZED';
    const verifiedCount = visible.filter((row) => row.isVerified === true).length;

    return (
        <section
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md"
            aria-busy={busy}
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Proveedores</h2>
                    <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]">
                        {loadError !== null ? '—' : total}
                    </span>
                    {status === 'success' && visible.length !== rows.length ? (
                        <span className="text-xs text-white/40">{visible.length} filtrados</span>
                    ) : null}
                    {status === 'success' && visible.length > 0 ? (
                        <span className="text-xs text-white/40">
                            {verifiedCount} verificados por el servidor
                        </span>
                    ) : null}
                    {busy ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            guardando…
                        </span>
                    ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void reload()}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613]"
                    >
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                        Refrescar
                    </button>
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => {
                            setNotice(null);
                            setFormError(null);
                            setOpen(true);
                        }}
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/50 bg-[#ecb613]/15 px-4 py-2 text-sm font-semibold text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613]"
                    >
                        <Store className="h-4 w-4" aria-hidden="true" />
                        Nuevo proveedor
                    </button>
                </div>
            </div>

            <p className="mb-5 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-relaxed text-white/50">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00E5FF]" aria-hidden="true" />
                La verificación la decide el servidor: el panel nunca envía «isVerified». Sin teléfono real
                (distinto de la centralita) el proveedor permanece como no verificado y no puede pasar a
                ACTIVE_VERIFIED.
            </p>

            {sessionExpired ? (
                <div
                    role="alert"
                    className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44]"
                >
                    <p className="flex items-center gap-2 font-semibold">
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        Sesión caducada: el panel no puede leer ni escribir proveedores.
                    </p>
                    <Link
                        href="/login?from=/admin/control"
                        className="rounded-full border border-[#FF2B44]/40 bg-[#FF2B44]/15 px-4 py-1.5 text-xs font-semibold transition-all duration-300 ease-out hover:bg-[#FF2B44]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF2B44]"
                    >
                        Volver a iniciar sesión
                    </Link>
                </div>
            ) : null}

            <div role="status" aria-live="polite">
                {notice !== null ? (
                    <div
                        className={`mb-4 rounded-2xl border p-4 text-sm ${
                            notice.kind === 'ok'
                                ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
                                : 'border-[#FF2B44]/30 bg-[#FF2B44]/10 text-[#FF2B44]'
                        }`}
                    >
                        <p className="flex items-center gap-2 font-semibold">
                            {notice.kind === 'ok' ? (
                                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                            )}
                            {notice.text}
                        </p>
                        {notice.details.length > 0 ? (
                            <ul className="mt-1 list-inside list-disc text-xs text-white/70">
                                {notice.details.map((detail) => (
                                    <li key={detail}>{detail}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-white/50">
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                    <span className="sr-only">Cargando proveedores…</span>
                </div>
            ) : loadError !== null ? (
                <div className="rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44]">
                    <p className="font-semibold">
                        Error {loadError.status !== 0 ? `HTTP ${loadError.status}` : 'de red'} ·{' '}
                        {loadError.code}
                    </p>
                    <p className="mt-1 text-white/70">{loadError.message}</p>
                    <button
                        type="button"
                        onClick={() => void reload()}
                        className="mt-3 rounded-full border border-[#FF2B44]/40 bg-[#FF2B44]/15 px-4 py-1.5 text-xs font-semibold transition-all duration-300 ease-out hover:bg-[#FF2B44]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF2B44]"
                    >
                        Reintentar
                    </button>
                </div>
            ) : visible.length === 0 ? (
                <p className="py-12 text-center text-sm text-white/40">
                    Sin proveedores que coincidan con la búsqueda.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] text-left text-sm">
                        <caption className="sr-only">
                            Proveedores homologados con claim, estado, rating y verificación del servidor
                        </caption>
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-white/40">
                                <th scope="col" className="px-3 py-2 font-medium">Proveedor</th>
                                <th scope="col" className="px-3 py-2 font-medium">Categoría</th>
                                <th scope="col" className="px-3 py-2 font-medium">Provincia / Ciudad</th>
                                <th scope="col" className="px-3 py-2 font-medium">Teléfono</th>
                                <th scope="col" className="px-3 py-2 font-medium">Claim</th>
                                <th scope="col" className="px-3 py-2 font-medium">Estado</th>
                                <th scope="col" className="px-3 py-2 font-medium">Rating</th>
                                <th scope="col" className="px-3 py-2 font-medium">Verificado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {visible.map((row) => {
                                const name = row.name?.trim() ?? '';
                                const company = row.companyName?.trim() ?? '';
                                const city = row.city?.trim() ?? '';
                                const province = row.province?.trim() ?? '';
                                const place = [province, city].filter((part) => part.length > 0).join(' · ');
                                const heading =
                                    company.length > 0
                                        ? company
                                        : name.length > 0
                                          ? name
                                          : row.id.slice(0, 8);

                                return (
                                    <tr
                                        key={row.id}
                                        className="text-white/80 transition-colors duration-300 ease-out hover:bg-white/[0.03]"
                                    >
                                        <td className="px-3 py-2">
                                            <p className="font-medium text-white">{heading}</p>
                                            {company.length > 0 && name.length > 0 ? (
                                                <p className="text-[11px] text-white/40">{name}</p>
                                            ) : null}
                                            {typeof row.slug === 'string' && row.slug.length > 0 ? (
                                                <p className="font-mono text-[11px] text-white/30">
                                                    {row.slug}
                                                </p>
                                            ) : null}
                                        </td>
                                        <td className="px-3 py-2 text-white/70">
                                            {categoryLabel(row.category)}
                                        </td>
                                        <td className="px-3 py-2 text-white/60">
                                            {place.length > 0 ? place : '—'}
                                        </td>
                                        <td className="px-3 py-2 font-mono text-xs text-white/60">
                                            {row.phone?.trim() || '—'}
                                        </td>
                                        <td className="px-3 py-2">
                                            <ClaimBadge value={row.claimStatus} />
                                        </td>
                                        <td className="px-3 py-2">
                                            <StatusControl
                                                row={row}
                                                disabled={busy}
                                                onChange={(next) => void changeStatus(row, next)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <RatingControl
                                                row={row}
                                                disabled={busy}
                                                onCommit={(raw) => void commitRating(row, raw)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <VerifiedBadge verified={row.isVerified === true} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {open ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="proveedor-dialog-title"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#09090d] p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex items-start justify-between gap-3">
                            <div>
                                <h3
                                    id="proveedor-dialog-title"
                                    className="text-base font-semibold text-white"
                                >
                                    Nuevo proveedor
                                </h3>
                                <p className="mt-1 text-xs text-white/50">
                                    Alta homologada. El claim y la verificación los decide el servidor a
                                    partir del teléfono real; el panel no los envía.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeForm}
                                aria-label="Cerrar el diálogo de alta"
                                className="rounded-full border border-white/10 bg-white/5 p-1.5 text-white/60 transition-all duration-300 ease-out hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613]"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="proveedor-name"
                                        className="text-xs font-medium text-white/70"
                                    >
                                        Nombre <span className="text-[#ecb613]">*</span>
                                    </label>
                                    <input
                                        ref={firstFieldRef}
                                        id="proveedor-name"
                                        name="name"
                                        type="text"
                                        required
                                        maxLength={MAX_NAME}
                                        value={form.name}
                                        onChange={(event) => setField('name', event.target.value)}
                                        placeholder="Ej. Finca Los Olivos"
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="proveedor-company"
                                        className="text-xs font-medium text-white/70"
                                    >
                                        Razón social
                                    </label>
                                    <input
                                        id="proveedor-company"
                                        name="companyName"
                                        type="text"
                                        maxLength={MAX_COMPANY}
                                        value={form.companyName}
                                        onChange={(event) => setField('companyName', event.target.value)}
                                        placeholder="Ej. Los Olivos Eventos S.L."
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="proveedor-category"
                                        className="text-xs font-medium text-white/70"
                                    >
                                        Categoría <span className="text-[#ecb613]">*</span>
                                    </label>
                                    <select
                                        id="proveedor-category"
                                        name="category"
                                        required
                                        value={form.category}
                                        onChange={(event) => setField('category', event.target.value)}
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[#ecb613]/60 focus:outline-none"
                                    >
                                        <option value="">Selecciona una categoría…</option>
                                        {PROVIDER_CATEGORIES.map((category) => (
                                            <option key={category} value={category}>
                                                {CATEGORY_LABELS[category]}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[11px] text-white/40">
                                        Enum homologado del marketplace: el valor viaja tal cual, no la
                                        etiqueta.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="proveedor-province"
                                        className="text-xs font-medium text-white/70"
                                    >
                                        Provincia <span className="text-[#ecb613]">*</span>
                                    </label>
                                    <input
                                        id="proveedor-province"
                                        name="province"
                                        type="text"
                                        required
                                        maxLength={MAX_PROVINCE}
                                        value={form.province}
                                        onChange={(event) => setField('province', event.target.value)}
                                        placeholder={DEFAULT_PROVINCE}
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="proveedor-city"
                                        className="text-xs font-medium text-white/70"
                                    >
                                        Ciudad
                                    </label>
                                    <input
                                        id="proveedor-city"
                                        name="city"
                                        type="text"
                                        maxLength={MAX_CITY}
                                        value={form.city}
                                        onChange={(event) => setField('city', event.target.value)}
                                        placeholder="Ej. Méntrida"
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="proveedor-phone"
                                        className="text-xs font-medium text-white/70"
                                    >
                                        Teléfono real
                                    </label>
                                    <input
                                        id="proveedor-phone"
                                        name="phone"
                                        type="tel"
                                        inputMode="tel"
                                        maxLength={MAX_PHONE}
                                        value={form.phone}
                                        onChange={(event) => setField('phone', event.target.value)}
                                        aria-describedby="proveedor-phone-help"
                                        placeholder="+34 6XX XXX XXX"
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                    />
                                    <p id="proveedor-phone-help" className="text-[11px] text-white/40">
                                        Mínimo {MIN_PHONE_DIGITS} dígitos. Sin teléfono real el servidor
                                        deja el proveedor como no verificado; la centralita nunca cuenta.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="proveedor-email"
                                    className="text-xs font-medium text-white/70"
                                >
                                    Email de contacto
                                </label>
                                <input
                                    id="proveedor-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    maxLength={MAX_EMAIL}
                                    value={form.email}
                                    onChange={(event) => setField('email', event.target.value)}
                                    placeholder="proveedor@dominio.com"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="proveedor-description"
                                    className="text-xs font-medium text-white/70"
                                >
                                    Descripción del servicio
                                </label>
                                <textarea
                                    id="proveedor-description"
                                    name="description"
                                    rows={4}
                                    maxLength={MAX_DESCRIPTION}
                                    value={form.description}
                                    onChange={(event) => setField('description', event.target.value)}
                                    aria-describedby="proveedor-description-help"
                                    placeholder="Qué cubre, aforo, extras incluidos…"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                                <p id="proveedor-description-help" className="text-[11px] text-white/40">
                                    {form.description.trim().length} / {MAX_DESCRIPTION} caracteres.
                                </p>
                            </div>

                            {formError !== null ? (
                                <p
                                    role="alert"
                                    className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 px-3 py-2 text-xs text-[#FF2B44]"
                                >
                                    {formError}
                                </p>
                            ) : null}

                            <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition-all duration-300 ease-out hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={busy}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/50 bg-[#ecb613]/20 px-4 py-2 text-xs font-semibold text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {busy ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                    ) : (
                                        <Store className="h-3.5 w-3.5" aria-hidden="true" />
                                    )}
                                    Crear proveedor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

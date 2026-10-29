'use client';

// ============================================================================
// Ω-ADMIN · PESTAÑA TERAPEUTAS — ALTA VIMUME + ACTIVACIÓN (W41_T13)
// ----------------------------------------------------------------------------
// Contratos tomados de la ruta real (src/app/api/admin/therapists/route.ts),
// no inventados:
//   GET   -> { ok: true, data: TherapistRow[], total }  (take fijo MAX_PAGE_SIZE
//            = 500; el zod de query sólo admite `specialty` y `status`)
//   POST  body .strict(): { email*, name?(1..120), specialty*(enum 4),
//           credentials?(<=4000), bio?(<=4000), status?='ACTIVE',
//           isActive?=true } -> 201 { ok: true, data } · 409 «El terapeuta ya
//           existe» · 400 VALIDATION
//   PATCH body .strict(): { id*, status?, specialty?, isActive? } — nada más.
//           Si no llega ningún campo útil -> 400 «No hay campos válidos».
//
// DOCTRINA DEL DATO VERIFICADO (cero fachadas):
//   · El alta NO inventa `status` ni `isActive`: se omiten a propósito y el
//     servidor aplica sus defaults (ACTIVE + activo). La interfaz lo declara.
//   · Activar/Suspender escribe SIEMPRE el par `isActive` + `status` para que
//     los dos campos no diverjan (nunca ACTIVE con isActive=false).
//   · Una escritura sin cambio real no gasta PATCH: se avisa y no se ensucia
//     `updatedAt`.
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
    HeartPulse,
    Loader2,
    RefreshCw,
    X,
} from 'lucide-react';
import type { AdminApiError } from '@/lib/admin/adminTypes';
import { useAdminResource } from '../useAdminResource';

/**
 * Fila real devuelta por GET /api/admin/therapists: `therapistProfile` completo
 * con la proyección `user: { email, name }` del include de la ruta.
 */
export type TherapistRow = {
    id: string;
    userId?: string | null;
    specialty?: string | null;
    credentials?: string | null;
    bio?: string | null;
    status?: string | null;
    isActive?: boolean | null;
    updatedAt?: string | null;
    createdAt?: string | null;
    user?: { email?: string | null; name?: string | null } | null;
};

/** Enum real de `specialty` (espejo exacto del zod de la ruta y de Prisma). */
export const THERAPIST_SPECIALTIES = [
    'musicoterapia',
    'neuroacustica',
    'estimulacion_cognitiva',
    'ocupacional',
] as const;

export type TherapistSpecialty = (typeof THERAPIST_SPECIALTIES)[number];

/** Etiquetas humanas: el valor enviado sigue siendo el enum, nunca el texto. */
const SPECIALTY_LABELS: Readonly<Record<TherapistSpecialty, string>> = {
    musicoterapia: 'Musicoterapia',
    neuroacustica: 'Neuroacústica',
    estimulacion_cognitiva: 'Estimulación cognitiva',
    ocupacional: 'Terapia ocupacional',
};

/** Estados reales del zod `statusSchema` de la ruta. */
export const THERAPIST_STATUSES = ['ACTIVE', 'SUSPENDED', 'INACTIVE'] as const;

export type TherapistStatus = (typeof THERAPIST_STATUSES)[number];

const STATUS_LABELS: Readonly<Record<TherapistStatus, string>> = {
    ACTIVE: 'Activo / en servicio',
    SUSPENDED: 'Suspendido',
    INACTIVE: 'Inactivo',
};

const LIST_PATH = '/api/admin/therapists';
const MAX_EMAIL = 180;
const MAX_NAME = 120;
const MAX_TEXT = 4000;
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
    email: string;
    name: string;
    specialty: string;
    credentials: string;
    bio: string;
};

const EMPTY_FORM: FormValues = {
    email: '',
    name: '',
    specialty: '',
    credentials: '',
    bio: '',
};

/* ── Helpers puros ───────────────────────────────────────────────────────── */

/** Etiqueta de fila: nombre del usuario manda; si no hay, email; nunca un id inventado. */
function labelOf(row: TherapistRow): string {
    const name = row.user?.name?.trim();
    if (name !== undefined && name.length > 0) return name;

    const email = row.user?.email?.trim();
    if (email !== undefined && email.length > 0) return email;

    return row.id.slice(0, 8);
}

function isTherapistSpecialty(value: string): value is TherapistSpecialty {
    return (THERAPIST_SPECIALTIES as readonly string[]).includes(value);
}

function specialtyLabel(value?: string | null): string {
    if (typeof value !== 'string' || value.length === 0) return '—';
    return isTherapistSpecialty(value) ? SPECIALTY_LABELS[value] : value;
}

function isTherapistStatus(value: string): value is TherapistStatus {
    return (THERAPIST_STATUSES as readonly string[]).includes(value);
}

function statusLabel(value?: string | null): string {
    if (typeof value !== 'string' || value.length === 0) return '—';
    return isTherapistStatus(value) ? STATUS_LABELS[value] : value;
}

/** Fecha corta es-ES; un valor inválido se declara con un guion, no con «Invalid Date». */
function formatDate(value?: string | null): string {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString('es-ES');
}

/** Filtro de cliente alimentado por el buscador global del shell. */
function matchesQuery(row: TherapistRow, query: string): boolean {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return true;
    return [
        row.user?.name,
        row.user?.email,
        row.specialty,
        row.status,
        row.isActive === true ? 'activo' : 'inactivo',
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
        return { text: 'El terapeuta ya existe para ese email.', details: [error.message] };
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
            text: 'El terapeuta ya no existe: refresca antes de reintentar.',
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

/** Cadena vacía => undefined: el `.strict()` del servidor no recibe claves inútiles. */
function toOptional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
}

/** Validación previa al POST: evita un viaje inútil y explica exactamente qué falla. */
function validateForm(values: FormValues): string | null {
    const email = values.email.trim();
    if (email.length === 0) return 'El email del terapeuta es obligatorio.';
    if (email.length > MAX_EMAIL) return `El email no puede superar ${MAX_EMAIL} caracteres.`;
    if (!EMAIL_REGEX.test(email)) return 'El email no tiene un formato válido.';

    const name = values.name.trim();
    if (name.length > MAX_NAME) return `El nombre no puede superar ${MAX_NAME} caracteres.`;

    if (!isTherapistSpecialty(values.specialty)) {
        return 'Selecciona una especialidad del catálogo VIMUME.';
    }

    if (values.credentials.trim().length > MAX_TEXT) {
        return `Las credenciales no pueden superar ${MAX_TEXT} caracteres.`;
    }

    if (values.bio.trim().length > MAX_TEXT) {
        return `La biografía no puede superar ${MAX_TEXT} caracteres.`;
    }

    return null;
}

/* ── Piezas de presentación ──────────────────────────────────────────────── */

/** Estado del perfil con color por valor real, sin inventar semántica. */
function StatusPill({ value }: { value?: string | null }): ReactElement {
    if (typeof value !== 'string' || value.length === 0) {
        return <span className="text-white/40">—</span>;
    }

    const tone = !isTherapistStatus(value)
        ? 'border-white/15 bg-white/5 text-white/60'
        : value === 'ACTIVE'
          ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
          : value === 'SUSPENDED'
            ? 'border-[#FF2B44]/30 bg-[#FF2B44]/10 text-[#FF2B44]'
            : 'border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]';

    return (
        <span
            title={statusLabel(value)}
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}
        >
            {value}
        </span>
    );
}

/** Bandera `isActive` tal cual la devuelve el servidor (nunca derivada de `status`). */
function ActivePill({ active }: { active: boolean }): ReactElement {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                active
                    ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
                    : 'border-white/15 bg-white/5 text-white/45'
            }`}
        >
            {active ? 'Sí' : 'No'}
        </span>
    );
}

/**
 * Especialidad editable por fila. Un `<select>` discreto no necesita borrador:
 * se confirma en el `change` con un único PATCH de `specialty`.
 */
function SpecialtyControl({
    row,
    disabled,
    onCommit,
}: {
    row: TherapistRow;
    disabled: boolean;
    onCommit: (raw: string) => void;
}): ReactElement {
    const inputId = `terapeuta-specialty-${row.id}`;
    const label = labelOf(row);
    const value = typeof row.specialty === 'string' && isTherapistSpecialty(row.specialty) ? row.specialty : '';

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={inputId} className="sr-only">
                Especialidad de {label}
            </label>
            <select
                id={inputId}
                value={value}
                disabled={disabled}
                onChange={(event) => onCommit(event.target.value)}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
                {value.length === 0 ? <option value="">— sin especialidad homologada</option> : null}
                {THERAPIST_SPECIALTIES.map((specialty) => (
                    <option key={specialty} value={specialty}>
                        {SPECIALTY_LABELS[specialty]}
                    </option>
                ))}
            </select>
            <span className="text-[11px] text-white/30">{specialtyLabel(row.specialty)}</span>
        </div>
    );
}

/* ── Pestaña ─────────────────────────────────────────────────────────────── */

/**
 * Pestaña Terapeutas del vertical VIMUME.
 *
 * `query` es opcional a propósito: el shell del panel pasa el buscador global,
 * pero el tab se monta igual sin props (misma firma que el scaffold) y filtra
 * en cliente sin golpear la API.
 */
export function TerapeutasTab({ query = '' }: { query?: string }): ReactElement {
    const { status, rows, total, error, busy, create, patch, reload } =
        useAdminResource<TherapistRow>(LIST_PATH);

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

        const specialty = form.specialty;
        if (!isTherapistSpecialty(specialty)) {
            setFormError('Selecciona una especialidad del catálogo VIMUME.');
            return;
        }

        setFormError(null);
        setNotice(null);

        const email = form.email.trim();
        pendingRef.current = {
            actionLabel: 'Alta de terapeuta',
            successText: `Terapeuta «${form.name.trim() || email}» creado. Nace ACTIVE y activo por los defaults del servidor.`,
            closesModal: true,
        };

        // Payload EXACTO del createBodySchema (.strict()). `status` e `isActive`
        // se omiten a propósito: los aplica el servidor, no el cliente.
        await create({
            email,
            name: toOptional(form.name),
            specialty,
            credentials: toOptional(form.credentials),
            bio: toOptional(form.bio),
        });
    };

    const toggleActive = async (row: TherapistRow, nextActive: boolean): Promise<void> => {
        const label = labelOf(row);
        const currentActive = row.isActive === true;
        const currentStatus = typeof row.status === 'string' ? row.status : '';
        const nextStatus: TherapistStatus = nextActive ? 'ACTIVE' : 'SUSPENDED';

        if (currentActive === nextActive && currentStatus === nextStatus) {
            // Sin cambio real: no se gasta un PATCH que ensuciaría updatedAt.
            setNotice({
                kind: 'ok',
                text: `«${label}» ya está en ${nextStatus}: no se ha enviado ninguna escritura.`,
                details: [],
            });
            return;
        }

        setNotice(null);
        pendingRef.current = {
            actionLabel: `Estado de «${label}»`,
            successText: nextActive
                ? `«${label}» activado: isActive=true y status=ACTIVE.`
                : `«${label}» suspendido: isActive=false y status=SUSPENDED.`,
            closesModal: false,
        };
        // El par viaja junto para que `isActive` y `status` no divergan nunca.
        await patch({ id: row.id, isActive: nextActive, status: nextStatus });
    };

    const commitSpecialty = async (row: TherapistRow, raw: string): Promise<void> => {
        const label = labelOf(row);

        if (!isTherapistSpecialty(raw)) {
            setNotice({
                kind: 'error',
                text: `Especialidad de «${label}»: «${raw}» no pertenece al catálogo VIMUME.`,
                details: ['El servidor sólo acepta el enum homologado; no se ha enviado ninguna escritura.'],
            });
            return;
        }

        if (raw === row.specialty) {
            setNotice({
                kind: 'ok',
                text: `«${label}» ya tiene la especialidad ${specialtyLabel(raw)}: sin escritura.`,
                details: [],
            });
            return;
        }

        setNotice(null);
        pendingRef.current = {
            actionLabel: `Especialidad de «${label}»`,
            successText: `«${label}» pasa a ${specialtyLabel(raw)}.`,
            closesModal: false,
        };
        await patch({ id: row.id, specialty: raw });
    };

    const visible = rows.filter((row) => matchesQuery(row, query));
    const loading = status === 'idle' || status === 'loading';
    const loadError = status === 'error' ? error : null;
    const sessionExpired = error?.code === 'UNAUTHORIZED';
    const activeCount = visible.filter((row) => row.isActive === true).length;
    const suspendedCount = visible.filter((row) => row.status === 'SUSPENDED').length;

    return (
        <section
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md"
            aria-busy={busy}
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Terapeutas VIMUME</h2>
                    <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]">
                        {loadError !== null ? '—' : total}
                    </span>
                    {status === 'success' && visible.length !== rows.length ? (
                        <span className="text-xs text-white/40">{visible.length} filtrados</span>
                    ) : null}
                    {status === 'success' && visible.length > 0 ? (
                        <span className="text-xs text-white/40">
                            {activeCount} activos · {suspendedCount} suspendidos
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
                        <HeartPulse className="h-4 w-4" aria-hidden="true" />
                        Nuevo terapeuta
                    </button>
                </div>
            </div>

            <p className="mb-5 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-relaxed text-white/50">
                <HeartPulse className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00E5FF]" aria-hidden="true" />
                El alta y el estado los decide el servidor: el panel no envía `status` ni `isActive` al
                crear; nacen ACTIVE y activos. Para retirar a un profesional del servicio se escribe el par
                `isActive=false` + `status=SUSPENDED` en un único PATCH, de modo que ambos campos no puedan
                divergir.
            </p>

            {sessionExpired ? (
                <div
                    role="alert"
                    className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44]"
                >
                    <p className="flex items-center gap-2 font-semibold">
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        Sesión caducada: el panel no puede leer ni escribir terapeutas.
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
                    <span className="sr-only">Cargando terapeutas…</span>
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
                    Sin terapeutas que coincidan con la búsqueda.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1080px] text-left text-sm">
                        <caption className="sr-only">
                            Terapeutas VIMUME con especialidad, activación y estado devueltos por el servidor
                        </caption>
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-white/40">
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Terapeuta
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Especialidad
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Activo
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Estado
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Actualizado
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {visible.map((row) => {
                                const label = labelOf(row);
                                const email = row.user?.email?.trim() ?? '';
                                const credentials = row.credentials?.trim() ?? '';
                                const isActive = row.isActive === true;

                                return (
                                    <tr
                                        key={row.id}
                                        className="text-white/80 transition-colors duration-300 ease-out hover:bg-white/[0.03]"
                                    >
                                        <td className="px-3 py-2">
                                            <p className="font-medium text-white">
                                                {row.user?.name?.trim() || email || row.id.slice(0, 8)}
                                            </p>
                                            {credentials.length > 0 ? (
                                                <p
                                                    className="max-w-[280px] truncate text-[11px] text-white/40"
                                                    title={credentials}
                                                >
                                                    {credentials}
                                                </p>
                                            ) : null}
                                            <p className="font-mono text-[11px] text-white/30">
                                                {row.id.slice(0, 12)}
                                            </p>
                                        </td>
                                        <td className="px-3 py-2 font-mono text-xs text-white/60">
                                            {email.length > 0 ? email : '—'}
                                        </td>
                                        <td className="px-3 py-2">
                                            <SpecialtyControl
                                                row={row}
                                                disabled={busy}
                                                onCommit={(raw) => void commitSpecialty(row, raw)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <ActivePill active={isActive} />
                                        </td>
                                        <td className="px-3 py-2">
                                            <StatusPill value={row.status} />
                                        </td>
                                        <td className="px-3 py-2 text-xs text-white/50">
                                            {formatDate(row.updatedAt)}
                                        </td>
                                        <td className="px-3 py-2">
                                            <button
                                                type="button"
                                                disabled={busy}
                                                aria-label={
                                                    isActive
                                                        ? `Suspender a ${label}`
                                                        : `Activar a ${label}`
                                                }
                                                onClick={() => void toggleActive(row, !isActive)}
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                                                    isActive
                                                        ? 'border-[#FF2B44]/40 bg-[#FF2B44]/15 text-[#FF2B44] hover:bg-[#FF2B44]/25 focus-visible:outline-[#FF2B44]'
                                                        : 'border-[#00E5FF]/40 bg-[#00E5FF]/15 text-[#00E5FF] hover:bg-[#00E5FF]/25 focus-visible:outline-[#00E5FF]'
                                                }`}
                                            >
                                                {isActive ? 'Suspender' : 'Activar'}
                                            </button>
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
                        aria-labelledby="terapeuta-dialog-title"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#09090d] p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex items-start justify-between gap-3">
                            <div>
                                <h3 id="terapeuta-dialog-title" className="text-base font-semibold text-white">
                                    Nuevo terapeuta VIMUME
                                </h3>
                                <p className="mt-1 text-xs text-white/50">
                                    El servidor crea (o reutiliza) el usuario por email, lo promociona a
                                    THERAPIST y abre su perfil. El perfil nace ACTIVE con los defaults del
                                    servidor; el panel no los envía.
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
                                    <label htmlFor="terapeuta-email" className="text-xs font-medium text-white/70">
                                        Email <span className="text-[#ecb613]">*</span>
                                    </label>
                                    <input
                                        ref={firstFieldRef}
                                        id="terapeuta-email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        maxLength={MAX_EMAIL}
                                        value={form.email}
                                        onChange={(event) => setField('email', event.target.value)}
                                        aria-describedby="terapeuta-email-help"
                                        placeholder="terapeuta@dominio.com"
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                    />
                                    <p id="terapeuta-email-help" className="text-[11px] text-white/40">
                                        Identifica al usuario. Si ya existe se promociona a THERAPIST; si ya
                                        tiene perfil, el servidor responde 409.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="terapeuta-name" className="text-xs font-medium text-white/70">
                                        Nombre
                                    </label>
                                    <input
                                        id="terapeuta-name"
                                        name="name"
                                        type="text"
                                        maxLength={MAX_NAME}
                                        value={form.name}
                                        onChange={(event) => setField('name', event.target.value)}
                                        placeholder="Ej. Nombre y apellidos"
                                        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="terapeuta-specialty" className="text-xs font-medium text-white/70">
                                    Especialidad <span className="text-[#ecb613]">*</span>
                                </label>
                                <select
                                    id="terapeuta-specialty"
                                    name="specialty"
                                    required
                                    value={form.specialty}
                                    onChange={(event) => setField('specialty', event.target.value)}
                                    aria-describedby="terapeuta-specialty-help"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[#ecb613]/60 focus:outline-none"
                                >
                                    <option value="">Selecciona una especialidad…</option>
                                    {THERAPIST_SPECIALTIES.map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {SPECIALTY_LABELS[specialty]}
                                        </option>
                                    ))}
                                </select>
                                <p id="terapeuta-specialty-help" className="text-[11px] text-white/40">
                                    Catálogo homologado VIMUME: son los cuatro valores que acepta el servidor.
                                </p>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="terapeuta-credentials"
                                    className="text-xs font-medium text-white/70"
                                >
                                    Credenciales
                                </label>
                                <textarea
                                    id="terapeuta-credentials"
                                    name="credentials"
                                    rows={3}
                                    maxLength={MAX_TEXT}
                                    value={form.credentials}
                                    onChange={(event) => setField('credentials', event.target.value)}
                                    aria-describedby="terapeuta-credentials-help"
                                    placeholder="Titulación, colegiación, años de práctica…"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                                <p id="terapeuta-credentials-help" className="text-[11px] text-white/40">
                                    {form.credentials.trim().length} / {MAX_TEXT} caracteres.
                                </p>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="terapeuta-bio" className="text-xs font-medium text-white/70">
                                    Biografía clínica
                                </label>
                                <textarea
                                    id="terapeuta-bio"
                                    name="bio"
                                    rows={4}
                                    maxLength={MAX_TEXT}
                                    value={form.bio}
                                    onChange={(event) => setField('bio', event.target.value)}
                                    aria-describedby="terapeuta-bio-help"
                                    placeholder="Enfoque terapéutico, protocolos (p. ej. 40 Hz), colectivos atendidos…"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                                <p id="terapeuta-bio-help" className="text-[11px] text-white/40">
                                    {form.bio.trim().length} / {MAX_TEXT} caracteres.
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
                                        <HeartPulse className="h-3.5 w-3.5" aria-hidden="true" />
                                    )}
                                    Crear terapeuta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

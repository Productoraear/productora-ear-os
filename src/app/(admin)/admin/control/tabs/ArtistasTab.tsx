'use client';

// ============================================================================
// Ω-ADMIN · PESTAÑA ARTISTAS — ESPACIO DE TRABAJO REAL (W41_T11)
// ----------------------------------------------------------------------------
// Antes: tabla read-only alimentada por el shell. Ahora: alta transaccional
// (POST /api/admin/artists) y cambio de estado (PATCH) con feedback accesible.
//
// Contratos tomados de la ruta real, no inventados:
//   POST  body .strict(): { email*, name?, stageName*(2..120), displayName?,
//         slug?(regex), genres?(array máx 12 de 1..40), status?(DRAFT|PUBLISHED|PAUSED) }
//         -> 201 { ok: true, data } · 409 CONFLICT · 400 VALIDATION + issues
//   PATCH body .strict(): { id*, status?, displayName?, slug? }
//   GET   -> { ok: true, data: ArtistRow[], total, page, size }
//
// Toda la red pasa por `useAdminResource` -> `adminFetch` (Bearer + sobre Ω).
// Cero `any`, cero estados inventados: un fallo se pinta como fallo.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, UserPlus, X } from 'lucide-react';
import type { AdminApiError } from '@/lib/admin/adminTypes';
import { useAdminResource } from '../useAdminResource';

/** Fila real devuelta por GET /api/admin/artists (artistProfile + user). */
export type ArtistRow = {
    id: string;
    stageName?: string | null;
    displayName?: string | null;
    slug?: string | null;
    status?: string | null;
    updatedAt?: string | null;
    user?: { email?: string | null; name?: string | null } | null;
};

/** Estados que acepta el motor de artistas (`ARTIST_STATUSES` en la ruta). */
type ArtistStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED';

/** Página máxima que admite la ruta (`MAX_PAGE_SIZE`), para el taller de alta. */
const LIST_PATH = '/api/admin/artists?size=100';
const MAX_STAGE_NAME = 120;
const MAX_EMAIL = 180;
const MAX_GENRES = 12;
const MAX_GENRE_LEN = 40;
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

function labelOf(row: ArtistRow): string {
    const stage = row.stageName?.trim();
    if (stage !== undefined && stage.length > 0) return stage;
    const display = row.displayName?.trim();
    if (display !== undefined && display.length > 0) return display;
    return row.id.slice(0, 8);
}

function formatDate(value?: string | null): string {
    if (typeof value !== 'string' || value.length === 0) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function parseGenres(raw: string): string[] {
    return raw
        .split(',')
        .map((genre) => genre.trim())
        .filter((genre) => genre.length > 0);
}

function matchesQuery(row: ArtistRow, query: string): boolean {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return true;
    return [row.stageName, row.displayName, row.slug, row.status, row.user?.email, row.user?.name]
        .filter((value): value is string => typeof value === 'string')
        .some((value) => value.toLowerCase().includes(needle));
}

/** Traduce el fallo normalizado del cliente Ω a texto accionable (nada inventado). */
function describeError(error: AdminApiError): { text: string; details: readonly string[] } {
    if (error.code === 'UNAUTHORIZED') {
        return { text: 'Sesión caducada: el panel no puede escribir sin token.', details: [error.message] };
    }
    if (error.code === 'CONFLICT') {
        return { text: 'Ese email o slug ya existe.', details: [error.message] };
    }
    if (error.code === 'VALIDATION') {
        const issues = error.issues ?? [];
        return {
            text: 'El servidor rechazó los datos del formulario.',
            details: issues.length > 0 ? issues : [error.message],
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

/** Validación previa al POST: evita un viaje inútil y explica exactamente qué falla. */
function validateForm(values: {
    email: string;
    stageName: string;
    displayName: string;
    genres: string;
}): string | null {
    const email = values.email.trim();
    if (email.length === 0) return 'El email es obligatorio.';
    if (email.length > MAX_EMAIL) return `El email no puede superar ${MAX_EMAIL} caracteres.`;
    if (!EMAIL_REGEX.test(email)) return 'El email no tiene un formato válido.';

    const stage = values.stageName.trim();
    if (stage.length === 0) return 'El nombre artístico es obligatorio.';
    if (stage.length < 2) return 'El nombre artístico debe tener al menos 2 caracteres.';
    if (stage.length > MAX_STAGE_NAME) {
        return `El nombre artístico no puede superar ${MAX_STAGE_NAME} caracteres.`;
    }

    if (values.displayName.trim().length > MAX_STAGE_NAME) {
        return `El nombre visible no puede superar ${MAX_STAGE_NAME} caracteres.`;
    }

    const genres = parseGenres(values.genres);
    if (genres.length > MAX_GENRES) {
        return `Máximo ${MAX_GENRES} géneros (has introducido ${genres.length}).`;
    }
    const tooLong = genres.find((genre) => genre.length > MAX_GENRE_LEN);
    if (tooLong !== undefined) {
        return `El género «${tooLong}» supera ${MAX_GENRE_LEN} caracteres.`;
    }
    return null;
}

/**
 * Pestaña Artistas: alta transaccional + publicación/pausa por fila.
 * `query` llega del buscador global del shell para no dejar un control muerto.
 */
export function ArtistasTab({ query = '' }: { query?: string }): ReactElement {
    const { status, rows, total, error, busy, create, patch, reload } =
        useAdminResource<ArtistRow>(LIST_PATH);

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [stageName, setStageName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [genres, setGenres] = useState('');
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
                setEmail('');
                setStageName('');
                setDisplayName('');
                setGenres('');
                setFormError(null);
                setOpen(false);
                triggerRef.current?.focus();
            }
            return;
        }

        const described = describeError(error);
        setNotice({
            kind: 'error',
            text: `${pending.actionLabel}: ${described.text}`,
            details: described.details,
        });
    }, [busy, error]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const validation = validateForm({ email, stageName, displayName, genres });
        if (validation !== null) {
            setFormError(validation);
            return;
        }

        setFormError(null);
        setNotice(null);

        const trimmedStage = stageName.trim();
        pendingRef.current = {
            actionLabel: 'Alta de artista',
            successText: `Artista «${trimmedStage}» creado y visible en la tabla.`,
            closesModal: true,
        };

        await create({
            email: email.trim(),
            stageName: trimmedStage,
            displayName: displayName.trim() === '' ? undefined : displayName.trim(),
            genres: parseGenres(genres),
        });
    };

    const toggleStatus = async (row: ArtistRow, next: ArtistStatus): Promise<void> => {
        const name = labelOf(row);
        const publishing = next === 'PUBLISHED';
        pendingRef.current = {
            actionLabel: `${publishing ? 'Publicar' : 'Pausar'} «${name}»`,
            successText: `«${name}» ${publishing ? 'publicado' : 'pausado'} correctamente.`,
            closesModal: false,
        };
        setNotice(null);
        await patch({ id: row.id, status: next });
    };

    const visible = rows.filter((row) => matchesQuery(row, query));
    const loading = status === 'idle' || status === 'loading';
    // Fallo de LECTURA: el listado no es fiable. Un fallo de ESCRITURA deja
    // `status` en 'success' y se comunica por `notice`, sin vaciar la tabla.
    const loadError = status === 'error' ? error : null;
    const sessionExpired = error?.code === 'UNAUTHORIZED';

    return (
        <section
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md"
            aria-busy={busy}
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Artistas</h2>
                    <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]">
                        {loadError !== null ? '—' : total}
                    </span>
                    {status === 'success' && visible.length !== total ? (
                        <span className="text-xs text-white/40">{visible.length} filtrados</span>
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
                            setOpen(true);
                        }}
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/50 bg-[#ecb613]/15 px-4 py-2 text-sm font-semibold text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613]"
                    >
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                        Nuevo artista
                    </button>
                </div>
            </div>

            {sessionExpired ? (
                <div
                    role="alert"
                    className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44]"
                >
                    <p className="flex items-center gap-2 font-semibold">
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        Sesión caducada: el panel no puede leer ni escribir artistas.
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
                    <span className="sr-only">Cargando artistas…</span>
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
                    Sin artistas que coincidan con la búsqueda.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] text-left text-sm">
                        <caption className="sr-only">
                            Artistas registrados con estado y acción de publicación
                        </caption>
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-white/40">
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Artista
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Slug
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Estado
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Actualizado
                                </th>
                                <th scope="col" className="px-3 py-2 text-right font-medium">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {visible.map((row) => {
                                const published = row.status === 'PUBLISHED';
                                const name = labelOf(row);
                                return (
                                    <tr
                                        key={row.id}
                                        className="text-white/80 transition-colors duration-300 ease-out hover:bg-white/[0.03]"
                                    >
                                        <td className="px-3 py-2 font-medium text-white">{name}</td>
                                        <td className="px-3 py-2 text-white/60">
                                            {row.user?.email ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 font-mono text-xs text-white/50">
                                            {row.slug ?? '—'}
                                        </td>
                                        <td className="px-3 py-2">
                                            <StatusPill value={row.status} />
                                        </td>
                                        <td className="px-3 py-2 text-white/50">
                                            {formatDate(row.updatedAt)}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <button
                                                type="button"
                                                disabled={busy}
                                                onClick={() =>
                                                    void toggleStatus(
                                                        row,
                                                        published ? 'PAUSED' : 'PUBLISHED',
                                                    )
                                                }
                                                aria-label={`${published ? 'Pausar' : 'Publicar'} a ${name}`}
                                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {published ? 'Pausar' : 'Publicar'}
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
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeForm();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="artista-form-title"
                        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#09090d]/95 p-6 shadow-2xl transition-all duration-300 ease-out"
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h3
                                    id="artista-form-title"
                                    className="text-lg font-semibold text-white"
                                >
                                    Nuevo artista
                                </h3>
                                <p className="mt-1 text-xs text-white/50">
                                    Crea el usuario (rol ARTIST) y su perfil en una sola transacción.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeForm}
                                aria-label="Cerrar formulario"
                                className="rounded-full border border-white/10 bg-white/5 p-1.5 text-white/60 transition-all duration-300 ease-out hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613]"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="artista-email"
                                    className="text-xs font-medium text-white/70"
                                >
                                    Email <span className="text-[#ecb613]">*</span>
                                </label>
                                <input
                                    ref={firstFieldRef}
                                    id="artista-email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="artista@dominio.com"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="artista-stage"
                                    className="text-xs font-medium text-white/70"
                                >
                                    Nombre artístico <span className="text-[#ecb613]">*</span>
                                </label>
                                <input
                                    id="artista-stage"
                                    name="stageName"
                                    type="text"
                                    required
                                    maxLength={MAX_STAGE_NAME}
                                    value={stageName}
                                    onChange={(event) => setStageName(event.target.value)}
                                    placeholder="Ej. Edwin Agudelo"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="artista-display"
                                    className="text-xs font-medium text-white/70"
                                >
                                    Nombre visible
                                </label>
                                <input
                                    id="artista-display"
                                    name="displayName"
                                    type="text"
                                    maxLength={MAX_STAGE_NAME}
                                    value={displayName}
                                    onChange={(event) => setDisplayName(event.target.value)}
                                    placeholder="Opcional · por defecto el nombre artístico"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="artista-genres"
                                    className="text-xs font-medium text-white/70"
                                >
                                    Géneros
                                </label>
                                <input
                                    id="artista-genres"
                                    name="genres"
                                    type="text"
                                    value={genres}
                                    onChange={(event) => setGenres(event.target.value)}
                                    aria-describedby="artista-genres-help"
                                    placeholder="Flamenco, Bolero, Jazz"
                                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#ecb613]/60 focus:outline-none"
                                />
                                <p id="artista-genres-help" className="text-[11px] text-white/40">
                                    Separados por comas · máximo {MAX_GENRES}, {MAX_GENRE_LEN}{' '}
                                    caracteres cada uno.
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
                                        <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                                    )}
                                    Crear artista
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

/** Badge de estado: color por estado real, sin inventar semántica. */
function StatusPill({ value }: { value?: string | null }): ReactElement {
    const label = typeof value === 'string' && value.trim().length > 0 ? value.trim() : 'SIN ESTADO';
    const tone =
        label === 'PUBLISHED'
            ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
            : label === 'PAUSED'
              ? 'border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]'
              : 'border-white/15 bg-white/5 text-white/60';

    return (
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}>
            {label}
        </span>
    );
}




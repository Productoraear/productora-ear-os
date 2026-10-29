'use client';

// ============================================================================
// Ω-ADMIN · HOOK ÚNICO DE RECURSOS DEL PANEL (W41_T10)
// ----------------------------------------------------------------------------
// Motivo forense: el shell del panel hacía `fetch` directo SIN cabecera
// `Authorization`, así que /api/admin/* respondía 401 y las pestañas pintaban
// 0 filas como si el sistema estuviera vacío (fachada silenciosa).
//
// Aquí no existe red propia: TODO pasa por `adminFetch` / `adminFetchList`
// (src/lib/admin/adminFetch.ts), que inyectan el Bearer de Firebase, validan el
// sobre `{ ok: true, data }` y traducen cualquier fallo a `AdminHttpError`.
// Prohibido `fetch` directo en módulos del panel.
//
// Cero `any`: el estado es genérico y el error viaja tipado como AdminApiError.
// ============================================================================

import { useCallback, useEffect, useState } from 'react';
import { AdminHttpError, adminFetch, adminFetchList } from '@/lib/admin/adminFetch';
import type { AdminApiError } from '@/lib/admin/adminTypes';

/** Ciclo de vida canónico de un recurso remoto. */
export type ResourceStatus = 'idle' | 'loading' | 'success' | 'error';

/** Estado observable de un listado. `rows` SIEMPRE es un array real. */
export interface ResourceState<T> {
    status: ResourceStatus;
    rows: T[];
    total: number;
    error: AdminApiError | null;
    busy: boolean;
}

/** Estado observable de un documento único (p. ej. el cuadro de tesorería). */
export interface DocumentState<T> {
    status: ResourceStatus;
    data: T | null;
    error: AdminApiError | null;
}

export type AdminResource<T> = ResourceState<T> & {
    reload: () => Promise<void>;
    create: (body: unknown) => Promise<void>;
    patch: (body: unknown) => Promise<void>;
};

export type AdminDocument<T> = DocumentState<T> & {
    reload: () => Promise<void>;
};

function emptyResource<T>(): ResourceState<T> {
    return { status: 'idle', rows: [], total: 0, error: null, busy: false };
}

/**
 * Normaliza cualquier fallo a `AdminApiError`.
 * Un fallo que no sea `AdminHttpError` es, por definición, ausencia de respuesta
 * HTTP válida: `status: 0` y código `SERVER`, nunca un mensaje inventado.
 */
function toAdminApiError(error: unknown): AdminApiError {
    if (error instanceof AdminHttpError) {
        return error.toAdminApiError();
    }
    return { status: 0, code: 'SERVER', message: 'Error de red' };
}

/**
 * Recurso de listado con acciones de escritura.
 * Los totales mostrados en los KPIs salen del `total` del backend, no de la
 * longitud del array (que puede venir paginada).
 */
export function useAdminResource<T>(path: string): AdminResource<T> {
    const [state, setState] = useState<ResourceState<T>>(emptyResource<T>);

    const load = useCallback(async (): Promise<void> => {
        setState((prev) => ({ ...prev, status: 'loading', error: null }));
        try {
            const { rows, total } = await adminFetchList<T>(path);
            setState((prev) => ({ status: 'success', rows, total, error: null, busy: prev.busy }));
        } catch (error) {
            setState((prev) => ({
                status: 'error',
                rows: [],
                total: 0,
                error: toAdminApiError(error),
                busy: prev.busy,
            }));
        }
    }, [path]);

    useEffect(() => {
        void load();
    }, [load]);

    const mutate = useCallback(
        async (method: 'POST' | 'PATCH', body: unknown): Promise<void> => {
            setState((prev) => ({ ...prev, busy: true, error: null }));

            let failure: AdminApiError | null = null;
            try {
                await adminFetch<unknown>(path, { method, body });
            } catch (error) {
                failure = toAdminApiError(error);
            }

            if (failure !== null) {
                setState((prev) => ({ ...prev, busy: false, error: failure }));
                return;
            }

            await load();
            setState((prev) => ({ ...prev, busy: false }));
        },
        [path, load],
    );

    const create = useCallback((body: unknown): Promise<void> => mutate('POST', body), [mutate]);
    const patch = useCallback((body: unknown): Promise<void> => mutate('PATCH', body), [mutate]);

    return { ...state, reload: load, create, patch };
}

/**
 * Recurso de documento único (no paginado). Se usa en Tesorería, cuya API
 * devuelve `{ metrics, transactions }` dentro del sobre Ω-ADMIN.
 */
export function useAdminDocument<T>(path: string): AdminDocument<T> {
    const [state, setState] = useState<DocumentState<T>>({
        status: 'idle',
        data: null,
        error: null,
    });

    const load = useCallback(async (): Promise<void> => {
        setState((prev) => ({ ...prev, status: 'loading', error: null }));
        try {
            const data = await adminFetch<T>(path);
            setState({ status: 'success', data, error: null });
        } catch (error) {
            setState({ status: 'error', data: null, error: toAdminApiError(error) });
        }
    }, [path]);

    useEffect(() => {
        void load();
    }, [load]);

    return { ...state, reload: load };
}

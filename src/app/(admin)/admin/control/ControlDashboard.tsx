'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
    ExternalLink,
    HeartPulse,
    Loader2,
    Music2,
    RefreshCw,
    Store,
    Truck,
    Users,
    Wallet,
} from 'lucide-react';

type TabId = 'artistas' | 'proveedores' | 'terapeutas' | 'flota' | 'afiliados' | 'tesoreria';

type ArtistRow = {
    id: string;
    stageName?: string | null;
    displayName?: string | null;
    slug?: string | null;
    status?: string | null;
    updatedAt?: string | null;
    user?: { email?: string | null; name?: string | null } | null;
};

type ProviderRow = {
    id: string;
    name?: string | null;
    companyName?: string | null;
    city?: string | null;
    province?: string | null;
    category?: string | null;
    claimStatus?: string | null;
    status?: string | null;
    rating?: number | null;
    updatedAt?: string | null;
};

type TherapistRow = {
    id: string;
    specialty?: string | null;
    status?: string | null;
    isActive?: boolean | null;
    updatedAt?: string | null;
    user?: { email?: string | null; name?: string | null } | null;
};

type FleetRow = {
    id: string;
    unitCode?: string | null;
    code?: string | null;
    status?: string | null;
    currentLocation?: string | null;
    updatedAt?: string | null;
    positions?: {
        latitude: number;
        longitude: number;
        speed?: number | null;
        heading?: number | null;
        timestamp?: string | null;
    }[];
};

type ApiResponse<T> = {
    ok: boolean;
    data?: T[];
    total?: number;
    error?: string;
};

type Column<T> = {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
};

type LoadState<T> = {
    status: 'idle' | 'loading' | 'success' | 'error';
    rows: T[];
    error: string;
};

const TABS: { id: TabId; label: string; icon: typeof Music2 }[] = [
    { id: 'artistas', label: 'Artistas', icon: Music2 },
    { id: 'proveedores', label: 'Proveedores', icon: Store },
    { id: 'terapeutas', label: 'Terapeutas', icon: HeartPulse },
    { id: 'flota', label: 'Flota', icon: Truck },
    { id: 'afiliados', label: 'Afiliados', icon: Users },
    { id: 'tesoreria', label: 'Tesorería', icon: Wallet },
];

async function fetchList<T>(url: string): Promise<T[]> {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    const json = (await res.json()) as ApiResponse<T>;
    if (!json.ok) {
        throw new Error(json.error ?? 'Error desconocido');
    }
    return json.data ?? [];
}

function useEntityData<T>(url: string) {
    const [state, setState] = useState<LoadState<T>>({
        status: 'idle',
        rows: [],
        error: '',
    });

    const load = useCallback(async () => {
        setState((prev) => ({ ...prev, status: 'loading', error: '' }));
        try {
            const rows = await fetchList<T>(url);
            setState({ status: 'success', rows, error: '' });
        } catch (err) {
            setState({
                status: 'error',
                rows: [],
                error: err instanceof Error ? err.message : 'Error desconocido',
            });
        }
    }, [url]);

    useEffect(() => {
        void load();
    }, [load]);

    return { ...state, reload: load };
}

function formatDate(value?: string | null): string {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-ES');
}

function StatusBadge({ value }: { value?: string | null }) {
    if (!value) return <span className="text-white/40">—</span>;
    return (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/80">
            {value}
        </span>
    );
}

function DataTable<T>({ rows, columns }: { rows: T[]; columns: Column<T>[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-white/50">
                        {columns.map((c) => (
                            <th key={c.key} className="px-4 py-3 font-medium">
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-white/5 transition-colors duration-300 hover:bg-white/5"
                        >
                            {columns.map((c) => (
                                <td key={c.key} className="px-4 py-3 text-white/80">
                                    {c.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PanelFrame({
    title,
    count,
    status,
    error,
    onReload,
    children,
}: {
    title: string;
    count: number;
    status: LoadState<unknown>['status'];
    error: string;
    onReload: () => void;
    children: ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]">
                        {count}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onReload}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613]"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refrescar
                </button>
            </div>

            {status === 'loading' || status === 'idle' ? (
                <div className="flex items-center justify-center py-16 text-white/50">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : status === 'error' ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                </div>
            ) : (
                children
            )}
        </section>
    );
}

function ArtistsPanel() {
    const { status, rows, error, reload } = useEntityData<ArtistRow>('/api/admin/artists');
    const columns: Column<ArtistRow>[] = [
        {
            key: 'name',
            header: 'Artista',
            render: (r) => r.displayName ?? r.stageName ?? r.user?.name ?? r.id.slice(0, 8),
        },
        { key: 'email', header: 'Email', render: (r) => r.user?.email ?? '—' },
        { key: 'slug', header: 'Slug', render: (r) => r.slug ?? '—' },
        { key: 'status', header: 'Estado', render: (r) => <StatusBadge value={r.status} /> },
        { key: 'updatedAt', header: 'Actualizado', render: (r) => formatDate(r.updatedAt) },
    ];
    return (
        <PanelFrame title="Artistas" count={rows.length} status={status} error={error} onReload={reload}>
            <DataTable rows={rows} columns={columns} />
        </PanelFrame>
    );
}

function ProvidersPanel() {
    const { status, rows, error, reload } = useEntityData<ProviderRow>('/api/admin/providers');
    const columns: Column<ProviderRow>[] = [
        { key: 'name', header: 'Proveedor', render: (r) => r.companyName ?? r.name ?? r.id.slice(0, 8) },
        { key: 'city', header: 'Ciudad', render: (r) => r.city ?? '—' },
        { key: 'province', header: 'Provincia', render: (r) => r.province ?? '—' },
        { key: 'category', header: 'Categoría', render: (r) => r.category ?? '—' },
        {
            key: 'claimStatus',
            header: 'Claim',
            render: (r) => <StatusBadge value={r.claimStatus} />,
        },
        { key: 'status', header: 'Estado', render: (r) => <StatusBadge value={r.status} /> },
        { key: 'rating', header: 'Rating', render: (r) => (r.rating != null ? r.rating.toFixed(1) : '—') },
    ];
    return (
        <PanelFrame title="Proveedores" count={rows.length} status={status} error={error} onReload={reload}>
            <DataTable rows={rows} columns={columns} />
        </PanelFrame>
    );
}

function TherapistsPanel() {
    const { status, rows, error, reload } = useEntityData<TherapistRow>('/api/admin/therapists');
    const columns: Column<TherapistRow>[] = [
        { key: 'name', header: 'Terapeuta', render: (r) => r.user?.name ?? r.id.slice(0, 8) },
        { key: 'email', header: 'Email', render: (r) => r.user?.email ?? '—' },
        { key: 'specialty', header: 'Especialidad', render: (r) => r.specialty ?? '—' },
        {
            key: 'isActive',
            header: 'Activo',
            render: (r) => (r.isActive ? 'Sí' : 'No'),
        },
        { key: 'status', header: 'Estado', render: (r) => <StatusBadge value={r.status} /> },
        { key: 'updatedAt', header: 'Actualizado', render: (r) => formatDate(r.updatedAt) },
    ];
    return (
        <PanelFrame title="Terapeutas" count={rows.length} status={status} error={error} onReload={reload}>
            <DataTable rows={rows} columns={columns} />
        </PanelFrame>
    );
}

function FleetPanel() {
    const { status, rows, error, reload } = useEntityData<FleetRow>('/api/admin/fleet');
    const columns: Column<FleetRow>[] = [
        { key: 'unit', header: 'Unidad', render: (r) => r.unitCode ?? r.code ?? r.id.slice(0, 8) },
        { key: 'status', header: 'Estado', render: (r) => <StatusBadge value={r.status} /> },
        { key: 'location', header: 'Ubicación', render: (r) => r.currentLocation ?? '—' },
        {
            key: 'position',
            header: 'GPS',
            render: (r) => {
                const p = r.positions?.[0];
                if (!p) return '—';
                return `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`;
            },
        },
        { key: 'updatedAt', header: 'Actualizado', render: (r) => formatDate(r.updatedAt) },
    ];
    return (
        <PanelFrame title="Flota" count={rows.length} status={status} error={error} onReload={reload}>
            <DataTable rows={rows} columns={columns} />
        </PanelFrame>
    );
}

function LinkCard({
    href,
    title,
    description,
}: {
    href: string;
    title: string;
    description: string;
}) {
    return (
        <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md">
            <h2 className="mb-2 text-lg font-semibold text-white">{title}</h2>
            <p className="mb-5 text-sm text-white/60">{description}</p>
            <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-4 py-2 text-sm text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613]/25"
            >
                Abrir {title}
                <ExternalLink className="h-4 w-4" />
            </Link>
        </section>
    );
}

export default function ControlDashboard() {
    const [activeTab, setActiveTab] = useState<TabId>('artistas');

    return (
        <div className="w-full overflow-x-hidden">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Panel de Control</h1>
                <p className="mt-2 text-sm text-white/60">
                    Gestión segmentada de entidades EAR OS desde un único punto de mando.
                </p>
            </header>

            <nav className="mb-6 flex flex-wrap gap-2" aria-label="Secciones de control">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out ${active
                                    ? 'border-[#ecb613]/60 bg-[#ecb613]/15 text-[#ecb613]'
                                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            <div className="min-h-[320px]">
                {activeTab === 'artistas' && <ArtistsPanel />}
                {activeTab === 'proveedores' && <ProvidersPanel />}
                {activeTab === 'terapeutas' && <TherapistsPanel />}
                {activeTab === 'flota' && <FleetPanel />}
                {activeTab === 'afiliados' && (
                    <LinkCard
                        href="/admin/afiliados"
                        title="Afiliados"
                        description="Gestión completa de afiliados y alianzas de la red EAR OS."
                    />
                )}
                {activeTab === 'tesoreria' && (
                    <LinkCard
                        href="/admin/tesoreria"
                        title="Tesorería"
                        description="Liquidaciones, comisiones y movimientos del Split Soberano 80/10/10."
                    />
                )}
            </div>
        </div>
    );
}
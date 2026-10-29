'use client';

// ============================================================================
// Ω-ADMIN · SHELL DEL PANEL DE CONTROL (W41_T10)
// ----------------------------------------------------------------------------
// Fin de las fachadas:
//   1. Cero `fetch` directo: el 401 silencioso venía de no enviar el Bearer.
//      Toda lectura/escritura pasa por `useAdminResource`/`useAdminDocument`,
//      que delegan en el cliente único `@/lib/admin/adminFetch`.
//   2. KPI reales: los 6 contadores muestran el `total` del backend o un guion
//      honesto (`—`) cuando la API falla; nunca un 0 inventado.
//   3. Afiliados y Tesorería dejan de ser `<Link>` vacíos y pintan sus datos
//      reales (afiliados: comisión del motor SSOT; tesorería: split 80/10/10
//      calculado por la API desde `ear-os-ssot.ts`).
// ============================================================================

import { useState } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
    AlertTriangle,
    HeartPulse,
    Loader2,
    Music2,
    RefreshCw,
    Search,
    Store,
    Truck,
    Users,
    Wallet,
} from 'lucide-react';
import type { AdminApiError } from '@/lib/admin/adminTypes';
import {
    useAdminDocument,
    useAdminResource,
    type AdminDocument,
    type AdminResource,
    type ResourceStatus,
} from './useAdminResource';
import { ArtistasTab, type ArtistRow } from './tabs/ArtistasTab';
import { ProveedoresTab, type ProviderRow } from './tabs/ProveedoresTab';
import { TerapeutasTab, type TherapistRow } from './tabs/TerapeutasTab';
import { FlotaTab, type FleetRow } from './tabs/FlotaTab';

/* ── Contratos de fila (espejo de las APIs reales) ────────────────────────── */

/** Proyección real de `PublicAffiliate` (src/app/api/admin/affiliates/route.ts). */
type AffiliateRow = {
    id: string;
    affiliateCode: string;
    companyName: string | null;
    tier: string;
    commissionRate: number;
    isActive: boolean;
    kycStatus: string;
    totalSalesGenerated: number;
    user: { email: string; name: string | null; role: string };
};

/** Contrato real de `GET /api/admin/treasury` (split calculado en servidor). */
type TreasuryMetrics = {
    totalDepositsAmount: string;
    totalDepositsCount: number;
    artistSplit: string;
    earOsSplit: string;
    vimumeSplit: string;
    rule: string;
};

type TreasuryTransaction = {
    id: string;
    reference: string;
    client: string;
    service: string;
    deposit: string;
    hash: string;
    status: string;
    date: string;
};

type TreasuryPayload = {
    metrics: TreasuryMetrics;
    transactions: TreasuryTransaction[];
};

/* ── Piezas de presentación ──────────────────────────────────────────────── */

type Column<T> = {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
};

type TabId = 'artistas' | 'proveedores' | 'terapeutas' | 'flota' | 'afiliados' | 'tesoreria';

const TABS: ReadonlyArray<{
    id: TabId;
    label: string;
    icon: typeof Music2;
    path: string;
}> = [
    { id: 'artistas', label: 'Artistas', icon: Music2, path: '/api/admin/artists' },
    { id: 'proveedores', label: 'Proveedores', icon: Store, path: '/api/admin/providers' },
    { id: 'terapeutas', label: 'Terapeutas', icon: HeartPulse, path: '/api/admin/therapists' },
    { id: 'flota', label: 'Flota', icon: Truck, path: '/api/admin/fleet' },
    { id: 'afiliados', label: 'Afiliados', icon: Users, path: '/api/admin/affiliates' },
    { id: 'tesoreria', label: 'Tesorería', icon: Wallet, path: '/api/admin/treasury' },
];

const LOGIN_HREF = '/login?from=/admin/control';

/** `commissionRate` del motor SSOT ya viaja en % (10, 12, 15, 20). */
function formatRate(rate: number): string {
    if (!Number.isFinite(rate)) return '—';
    return rate % 1 === 0 ? `${rate.toFixed(0)} %` : `${rate.toFixed(2)} %`;
}

function text(value?: string | null): string {
    return value ?? '';
}

/** Filtro de cliente: el buscador global nunca golpea la API. */
function filterRows<T>(rows: T[], query: string, toText: (row: T) => string): T[] {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return rows;
    return rows.filter((row) => toText(row).toLowerCase().includes(needle));
}

function StatusBadge({ value }: { value?: string | null }) {
    if (!value) return <span className="text-white/40">—</span>;
    return (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/80">
            {value}
        </span>
    );
}

function DataTable<T extends { id: string }>({
    rows,
    columns,
    emptyLabel,
}: {
    rows: T[];
    columns: Column<T>[];
    emptyLabel: string;
}) {
    if (rows.length === 0) {
        return <p className="py-10 text-center text-sm text-white/40">{emptyLabel}</p>;
    }

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
                    {rows.map((row) => (
                        <tr
                            key={row.id}
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
    total,
    shown,
    status,
    error,
    onReload,
    children,
}: {
    title: string;
    total: number;
    shown: number;
    status: ResourceStatus;
    error: AdminApiError | null;
    onReload: () => void;
    children: ReactNode;
}) {
    const loading = status === 'loading' || status === 'idle';

    return (
        <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]">
                        {status === 'error' ? '—' : total}
                    </span>
                    {status === 'success' && shown !== total ? (
                        <span className="text-xs text-white/40">{shown} filtrados</span>
                    ) : null}
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

            {loading ? (
                <div className="flex items-center justify-center py-16 text-white/50">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : error !== null ? (
                <div className="rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44]">
                    <p className="font-semibold">
                        Error {error.status !== 0 ? `HTTP ${error.status}` : 'de red'} · {error.code}
                    </p>
                    <p className="mt-1 text-white/70">{error.message}</p>
                </div>
            ) : (
                children
            )}
        </section>
    );
}

function SessionBanner() {
    return (
        <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 p-4 text-sm text-[#FF2B44] backdrop-blur-md"
        >
            <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Sesión caducada: el panel dejó de recibir datos reales.
            </p>
            <Link
                href={LOGIN_HREF}
                className="rounded-full border border-[#FF2B44]/40 bg-[#FF2B44]/15 px-4 py-1.5 text-xs font-semibold transition-all duration-300 ease-out hover:bg-[#FF2B44]/25"
            >
                Volver a iniciar sesión
            </Link>
        </div>
    );
}

function KpiCard({
    label,
    total,
    status,
}: {
    label: string;
    total: number | null;
    status: ResourceStatus;
}) {
    const failed = status === 'error';
    const loading = status === 'loading' || status === 'idle';
    const value = failed ? '—' : loading ? '···' : String(total ?? '—');

    return (
        <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-4 backdrop-blur-md transition-all duration-300 ease-out hover:border-[#ecb613]/30">
            <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
            <p
                className={`mt-2 text-2xl font-semibold tabular-nums ${
                    failed ? 'text-[#FF2B44]' : 'text-white'
                }`}
            >
                {value}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
                {failed ? 'sin datos verificables' : loading ? 'consultando API' : 'total real'}
            </p>
        </div>
    );
}

/* ── Paneles por entidad (reciben el recurso ya cableado) ─────────────────── */

function AffiliatesPanel({ resource, query }: { resource: AdminResource<AffiliateRow>; query: string }) {
    const rows = filterRows(resource.rows, query, (r) =>
        [r.affiliateCode, text(r.companyName), text(r.user.name), text(r.user.email), r.tier, r.kycStatus].join(' '),
    );
    const columns: Column<AffiliateRow>[] = [
        {
            key: 'code',
            header: 'Código',
            render: (r) => <span className="font-mono text-xs text-[#ecb613]">{r.affiliateCode}</span>,
        },
        {
            key: 'company',
            header: 'Empresa',
            render: (r) => r.companyName ?? r.user.name ?? r.user.email,
        },
        { key: 'tier', header: 'Tier', render: (r) => <StatusBadge value={r.tier} /> },
        {
            key: 'commission',
            header: 'Comisión',
            render: (r) => <span className="tabular-nums">{formatRate(r.commissionRate)}</span>,
        },
        {
            key: 'status',
            header: 'Estado',
            render: (r) => (
                <span className="inline-flex flex-wrap items-center gap-1">
                    <StatusBadge value={r.isActive ? 'ACTIVO' : 'INACTIVO'} />
                    <StatusBadge value={r.kycStatus} />
                </span>
            ),
        },
    ];
    return (
        <PanelFrame
            title="Afiliados"
            total={resource.total}
            shown={rows.length}
            status={resource.status}
            error={resource.error}
            onReload={() => void resource.reload()}
        >
            <DataTable rows={rows} columns={columns} emptyLabel="Sin afiliados que coincidan con la búsqueda." />
        </PanelFrame>
    );
}

/* ── Tesorería: KPIs 80/10/10 servidos por la API, no calculados en cliente ─ */

function TreasuryPanel({
    resource,
    query,
}: {
    resource: AdminDocument<TreasuryPayload>;
    query: string;
}) {
    const metrics = resource.data?.metrics ?? null;
    const transactions = resource.data?.transactions ?? [];

    const rows = filterRows(transactions, query, (t) =>
        [t.client, t.service, t.reference, t.hash, t.status, t.deposit].join(' '),
    );

    const columns: Column<TreasuryTransaction>[] = [
        { key: 'client', header: 'Cliente', render: (t) => t.client },
        { key: 'service', header: 'Servicio', render: (t) => t.service },
        {
            key: 'deposit',
            header: 'Depósito',
            render: (t) => <span className="tabular-nums">{t.deposit}</span>,
        },
        { key: 'status', header: 'Estado', render: (t) => <StatusBadge value={t.status} /> },
        { key: 'date', header: 'Fecha', render: (t) => t.date },
        {
            key: 'hash',
            header: 'Origen',
            render: (t) =>
                t.hash === 'NO_HASH' ? (
                    <span className="text-white/40">—</span>
                ) : (
                    <span className="font-mono text-[11px] text-white/40" title={t.hash}>
                        {t.hash.slice(0, 12)}…
                    </span>
                ),
        },
    ];

    const splitCards: ReadonlyArray<{ label: string; value: string }> = metrics
        ? [
              { label: 'Artista 80 %', value: metrics.artistSplit },
              { label: 'EAR OS 10 %', value: metrics.earOsSplit },
              { label: 'VIMUME 10 %', value: metrics.vimumeSplit },
          ]
        : [];

    return (
        <PanelFrame
            title="Tesorería · Depósitos Price-Lock"
            total={metrics?.totalDepositsCount ?? 0}
            shown={rows.length}
            status={resource.status}
            error={resource.error}
            onReload={() => void resource.reload()}
        >
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-white/40">Custodia total</p>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-[#ecb613]">
                        {metrics ? `${metrics.totalDepositsAmount} €` : '—'}
                    </p>
                </div>
                {splitCards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-wide text-white/40">{card.label}</p>
                        <p className="mt-2 text-xl font-semibold tabular-nums text-white">
                            {card.value} €
                        </p>
                    </div>
                ))}
            </div>

            {metrics !== null ? (
                <p className="mb-5 font-mono text-[11px] text-white/40">{metrics.rule}</p>
            ) : null}

            <DataTable
                rows={rows}
                columns={columns}
                emptyLabel="Sin depósitos Price-Lock registrados todavía."
            />
        </PanelFrame>
    );
}

/* ── Shell: un solo punto de carga para las 6 fuentes reales ─────────────── */

type Kpi = {
    id: TabId;
    label: string;
    total: number | null;
    status: ResourceStatus;
};

export default function ControlDashboard() {
    // Los seis recursos se montan UNA vez: cambiar de pestaña no re-consulta ni
    // pierde datos, y los KPIs reflejan todas las entidades, no solo la activa.
    // Sólo interesa el `total` del KPI: la pestaña Artistas monta su propio
    // recurso con ?size=100 para el taller de alta y edición.
    const artists = useAdminResource<ArtistRow>('/api/admin/artists?size=1');
    const providers = useAdminResource<ProviderRow>('/api/admin/providers');
    const therapists = useAdminResource<TherapistRow>('/api/admin/therapists');
    const fleet = useAdminResource<FleetRow>('/api/admin/fleet');
    const affiliates = useAdminResource<AffiliateRow>('/api/admin/affiliates');
    const treasury = useAdminDocument<TreasuryPayload>('/api/admin/treasury');

    const [activeTab, setActiveTab] = useState<TabId>('artistas');
    const [query, setQuery] = useState('');

    const sessionExpired = [
        artists,
        providers,
        therapists,
        fleet,
        affiliates,
        treasury,
    ].some((resource) => resource.error?.code === 'UNAUTHORIZED');

    const kpis: ReadonlyArray<Kpi> = [
        { id: 'artistas', label: 'Artistas', total: artists.total, status: artists.status },
        { id: 'proveedores', label: 'Proveedores', total: providers.total, status: providers.status },
        { id: 'terapeutas', label: 'Terapeutas', total: therapists.total, status: therapists.status },
        { id: 'flota', label: 'Flota', total: fleet.total, status: fleet.status },
        { id: 'afiliados', label: 'Afiliados', total: affiliates.total, status: affiliates.status },
        {
            id: 'tesoreria',
            label: 'Depósitos Price-Lock',
            total: treasury.data?.metrics.totalDepositsCount ?? null,
            status: treasury.status,
        },
    ];

    return (
        <div className="w-full overflow-x-hidden">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Panel de Control</h1>
                <p className="mt-2 text-sm text-white/60">
                    Gestión segmentada de entidades EAR OS. Cada contador proviene de su API real;
                    si una fuente falla, el panel lo declara en vez de pintar un cero falso.
                </p>
            </header>

            {sessionExpired ? <SessionBanner /> : null}

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                {kpis.map((kpi) => (
                    <KpiCard key={kpi.id} label={kpi.label} total={kpi.total} status={kpi.status} />
                ))}
            </div>

            <div className="relative mb-6">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                    type="search"
                    aria-label="Buscar entidad"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por nombre, email, código o estado…"
                    className="w-full rounded-full border border-white/10 bg-[#09090d]/80 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 backdrop-blur-md transition-all duration-300 ease-out focus:border-[#ecb613]/50 focus:outline-none"
                />
            </div>

            <nav className="mb-6 flex flex-wrap gap-2" aria-label="Secciones de control">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            aria-pressed={active}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out ${
                                active
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
                {activeTab === 'artistas' && <ArtistasTab query={query} />}
                {activeTab === 'proveedores' && <ProveedoresTab query={query} />}
                {activeTab === 'terapeutas' && <TerapeutasTab query={query} />}
                {activeTab === 'flota' && <FlotaTab query={query} />}
                {activeTab === 'afiliados' && <AffiliatesPanel resource={affiliates} query={query} />}
                {activeTab === 'tesoreria' && <TreasuryPanel resource={treasury} query={query} />}
            </div>
        </div>
    );
}


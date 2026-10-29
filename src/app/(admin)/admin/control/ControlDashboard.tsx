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
//   3. Cada pestaña vive en su módulo `./tabs/*` y pinta datos reales:
//      afiliados (comisión del motor SSOT) y tesorería (split 80/10/10 y alta
//      de depósito Price-Lock servidos por `/api/admin/treasury`, calculados
//      desde `ear-os-ssot.ts`). Este shell no calcula ni una cifra de dinero.
// ============================================================================

import { useState } from 'react';
import Link from 'next/link';
import {
    AlertTriangle,
    HeartPulse,
    Music2,
    Search,
    Store,
    Truck,
    Users,
    Wallet,
} from 'lucide-react';
import { useAdminDocument, useAdminResource, type ResourceStatus } from './useAdminResource';
import { ArtistasTab, type ArtistRow } from './tabs/ArtistasTab';
import { ProveedoresTab, type ProviderRow } from './tabs/ProveedoresTab';
import { TerapeutasTab, type TherapistRow } from './tabs/TerapeutasTab';
import { FlotaTab, type FleetRow } from './tabs/FlotaTab';
import { AfiliadosTab, type AffiliateRow } from './tabs/AfiliadosTab';
import { TesoreriaTab, type TreasuryPayload } from './tabs/TesoreriaTab';

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
    // `?limit=100` es el máximo que acepta la ruta: sin él el KPI se cortaría en
    // el límite por defecto (20). El número mostrado es siempre la ventana que
    // devuelve la API, jamás una cifra calculada en el cliente.
    const treasury = useAdminDocument<TreasuryPayload>('/api/admin/treasury?limit=100');

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
                {activeTab === 'afiliados' && <AfiliadosTab query={query} />}
                {activeTab === 'tesoreria' && <TesoreriaTab query={query} />}
            </div>
        </div>
    );
}


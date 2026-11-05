"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MasterUrlGovernanceMatrix } from '@/components/admin/MasterUrlGovernanceMatrix';
import { PartnerShowcaseTelemetryCard } from '@/components/admin/PartnerShowcaseTelemetryCard';
import { PartnerShowcaseMetricsPanel } from '@/components/otzarreta/PartnerShowcaseMetricsPanel';
import {
  DollarSign,
  Users,
  CreditCard,
  Wallet,
  QrCode,
  ArrowUpRight,
  RefreshCcw,
  Search,
  Landmark,
  Truck,
  Compass,
  Radio,
  Shield,
  ChevronRight,
  Crown
} from 'lucide-react';
import { formatProviderCount } from '@/lib/constants/providers-manifest';
import {
  ADMIN_DIRECTORY_TOTALS,
  ADMIN_MODULE_DIRECTORY,
  type AdminDirectoryEntry,
} from '@/lib/config/admin-navigation';
import type { DbFailureReport } from '@/lib/db/dbFailureClassifier';
import ScraperLiveMonitorWidget from '@/components/admin/ScraperLiveMonitorWidget';
import OpportunityRadarTerminal from '@/components/admin/OpportunityRadarTerminal';
import VendorManagedCareDesk from '@/components/admin/VendorManagedCareDesk';
import UberStyleBookingDispatcher from '@/components/admin/UberStyleBookingDispatcher';
import WhatsAppPriceLockGenerator from '@/components/admin/WhatsAppPriceLockGenerator';
import { MetricProvenanceBadge } from '@/components/admin/MetricProvenanceBadge';
import { liveMetric, staticMetric } from '@/lib/admin/metrics-provenance';

// ============================================================================
// DIRECTORIO DEL COCKPIT — FUENTE ÚNICA (`@/lib/config/admin-navigation`)
// ============================================================================
// PROHIBIDO volver a teclear este listado aquí. Antes vivía en este componente
// un array paralelo de 28 entradas (`ALL_ADMIN_DIRECT_URLS`) que duplicaba y
// contradecía el SSOT de navegación, con cifras inventadas que ya fueron erradicadas. Ahora se deriva de `ADMIN_MASTER_TABS`:
// dar de alta un módulo en el SSOT lo publica en ribbon, sidebar, ⌘K y aquí.
// Verificado por `scripts/audit_admin_ecosystem.cjs`.
const ALL_ADMIN_DIRECT_URLS: AdminDirectoryEntry[] = ADMIN_MODULE_DIRECTORY;

/** Chips de categoría derivados (sustituyen a «Ventas (5)» tecleado: era 7). */
const DIRECTORY_CATEGORY_CHIPS: Array<{ id: string; label: string }> = [
  { id: 'TODOS', label: `Todos (${ADMIN_DIRECTORY_TOTALS.entries})` },
  ...ADMIN_DIRECTORY_TOTALS.categories.map((category) => {
    const count = ADMIN_MODULE_DIRECTORY.filter((entry) => entry.category === category).length;
    return { id: category, label: `${category.split('&')[0].trim()} (${count})` };
  }),
];

export interface AdminDashboardTransaction {
  vertical?: string;
  createdAt: Date | string;
  amountCents: number;
  status: string;
}

export interface AdminDashboardData {
  /**
   * 'REAL' = PostgreSQL sondeado en esta petición.
   * 'DB_OFFLINE' = la DB no respondió: TODAS las cifras van a cero (AF-1/AF-2).
   */
  dataMode?: 'REAL' | 'DB_OFFLINE';
  /** `true` solo si el Promise.all de Prisma se resolvió (sonda real). */
  dbProbed?: boolean;
  /**
   * Causa clasificada del fallo cuando la DB no responde (null si respondió).
   * Se pinta en el aviso para que el CEO sepa QUÉ está roto y qué comando lo
   * arregla, en lugar del antiguo `code=UNKNOWN` mudo (AF-1 / INV-16).
   */
  dbFailure?: DbFailureReport | null;
  totalRevenue: number;
  totalTransactions: number;
  providerCount: number;
  activeStripeLocksCount: number;
  b2gTotal: number;
  artistCache: number;
  earOsFee: number;
  vimumeFee: number;
  stripeCustody: number;
  latestTransactions: AdminDashboardTransaction[];
}

export default function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCommandTab, setActiveCommandTab] = useState<'RADAR' | 'MANAGED' | 'DISPATCHER' | 'FINANCE' | 'DIRECTORIO'>('RADAR');
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Filtrado de URLs
  const filteredUrls = useMemo(() => {
    return ALL_ADMIN_DIRECT_URLS.filter((item) => {
      const matchesCategory = selectedCategory === "TODOS" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const GRAND_TOTAL_FORMATTED = formatProviderCount(data.providerCount);
  const totalVolumeExecuted = data.totalRevenue;
  const splitPercent = totalVolumeExecuted > 0 ? 100 : 0;
  const isDbLive = data.dbProbed ?? (data.dataMode !== 'DB_OFFLINE');

  const revenueMetric = liveMetric(
    'admin_total_revenue',
    'Facturación Bruta',
    data.totalRevenue,
    isDbLive,
    'Postgres.ProductionEvent.amount',
    '€',
    undefined,
    'REAL',
    formatCurrency(data.totalRevenue)
  );

  const txMetric = liveMetric(
    'admin_total_tx',
    'Operaciones Liquidadas',
    data.totalTransactions,
    isDbLive,
    'Postgres.ProductionEvent.count',
    'ops'
  );

  const providersMetric = staticMetric(
    'admin_providers_ssot',
    'Bóveda SSOT Proveedores',
    data.providerCount,
    'providers-manifest.ts',
    '',
    undefined,
    GRAND_TOTAL_FORMATTED
  );

  const stripeLocksMetric = liveMetric(
    'admin_stripe_locks',
    'Price-Lock Inmutable',
    data.activeStripeLocksCount,
    isDbLive,
    'Stripe.DepositHold',
    'Locks'
  );

  const b2gMetric = liveMetric(
    'admin_b2g_total',
    'Licitaciones Menores B2G',
    data.b2gTotal,
    isDbLive,
    'Postgres.B2GTender',
    '€',
    undefined,
    'REAL',
    formatCurrency(data.b2gTotal)
  );

  return (
    <div className="min-h-screen bg-[#030305] space-y-6 max-w-7xl mx-auto pb-16 font-sans">

      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA (ESTILO CATMÍN TEMPLATE 21ST.DEV)                 */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Dashboard S-Class</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Omni-Cockpit Soberano
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#ecb613]/50 transition-all"
            title="Refrescar Telemetría"
          >
            <RefreshCcw className={`w-4 h-4 text-[#ecb613] ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/simulador"
            className="py-2 px-4 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Abrir Simulador 21st</span>
          </Link>
        </div>
      </div>

      {/* AVISO HONESTO DE TELEMETRÍA (AF-1 / AF-2 / INV-16)                    */}
      {data.dataMode === 'DB_OFFLINE' && (
        <div
          role="status"
          className="rounded-2xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 px-4 py-3 flex items-start gap-3"
        >
          <Shield className="w-4 h-4 text-[#FF2B44] shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-[#FF2B44] uppercase font-mono tracking-wider">
              Sin datos de tesorería · PostgreSQL no responde
            </p>
            <p className="text-zinc-300 mt-1">
              Los KPIs de esta pantalla están a CERO. No se pintan cifras de demostración:
              este panel solo enseña dinero que existe en la base de datos.
            </p>
            {data.dbFailure && (
              <p className="mt-1.5 font-mono text-[11px] text-[#FF2B44]/90 break-words">
                {data.dbFailure.kind} · code={data.dbFailure.code} → {data.dbFailure.action}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI DE ALTO IMPACTO                       */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Card 1: Total Revenue (Facturación Bruta) */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-zinc-400">Facturación Bruta (Split)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {revenueMetric.probed ? formatCurrency(revenueMetric.value) : '0,00 €'}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {txMetric.probed ? `${txMetric.value} operaciones liquidadas` : '0 operaciones (DB Offline)'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <MetricProvenanceBadge metric={revenueMetric} size="sm" />
          </div>
        </div>

        {/* Card 2: Bóveda SSOT Proveedores (New Customers) */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-zinc-400">Bóveda SSOT Proveedores</span>
              <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#ecb613]" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-white">{GRAND_TOTAL_FORMATTED}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Registros en DB + Scraped</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <MetricProvenanceBadge metric={providersMetric} size="sm" />
          </div>
        </div>

        {/* Card 3: Depósitos Stripe Price-Lock (Active Accounts) */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-zinc-400">Price-Lock Inmutable</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {stripeLocksMetric.probed ? `${stripeLocksMetric.value} Locks` : '0 Locks'}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {isDbLive ? `${formatCurrency(data.stripeCustody)} en custodia` : '0,00 € en custodia'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <MetricProvenanceBadge metric={stripeLocksMetric} size="sm" />
          </div>
        </div>

        {/* Card 4: Licitaciones Menores B2G (Growth Rate) */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-zinc-400">Licitaciones Menores B2G</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Landmark className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {b2gMetric.probed ? formatCurrency(b2gMetric.value) : '0,00 €'}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Art. 118 LCSP (&lt;75 dB SPL)</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <MetricProvenanceBadge metric={b2gMetric} size="sm" />
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 2.05. RESUMEN EJECUTIVO FLAGSHIP (EZKERTZA BERRIA · ALIADO BIZKAIA)    */}
      {/* El detalle completo vive en #panel-eduardo (misma fuente de datos).   */}
      <PartnerShowcaseTelemetryCard detailHref="/otzarreta#panel-eduardo" />

      {/* 2.1. WHATSAPP PRICE-LOCK EXPRESS GENERATOR (CIERRE RÁPIDO NOVIAS/B2G) */}
      {/* ===================================================================== */}
      <WhatsAppPriceLockGenerator />
      {/* 2.2. APEX MISSION CONTROL BAR (CENTRO DE MANDO OPERATIVO S-CLASS)     */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-zinc-950/90 border border-white/10 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => setActiveCommandTab('RADAR')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeCommandTab === 'RADAR'
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/25 scale-[1.02]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>⚡ Radar Oportunidades & B2G</span>
        </button>

        <button
          onClick={() => setActiveCommandTab('MANAGED')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeCommandTab === 'MANAGED'
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/25 scale-[1.02]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>👑 Concierge Proveedores Gestionados</span>
        </button>

        <button
          onClick={() => setActiveCommandTab('DISPATCHER')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeCommandTab === 'DISPATCHER'
              ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/25 scale-[1.02]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>🚖 Dispatcher Uber/Airbnb & Rutas</span>
        </button>

        <button
          onClick={() => setActiveCommandTab('FINANCE')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeCommandTab === 'FINANCE'
              ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/25 scale-[1.02]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>💰 Split 80/10/10 & Ledger</span>
        </button>

        <button
          onClick={() => setActiveCommandTab('DIRECTORIO')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeCommandTab === 'DIRECTORIO'
              ? 'bg-purple-400 text-black shadow-lg shadow-purple-400/25 scale-[1.02]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>📁 Catálogo {ADMIN_DIRECTORY_TOTALS.entries} Destinos</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 3. VISTA 1: RADAR DE OPORTUNIDADES & B2G (TED UE + BOE EN VIVO)        */}
      {/* ===================================================================== */}
      {activeCommandTab === 'RADAR' && (
        <div className="space-y-6 animate-fadeIn">
          <OpportunityRadarTerminal />
          <ScraperLiveMonitorWidget />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. VISTA 2: CONCIERGE PROVEEDORES GESTIONADOS (PRO / ELITE)           */}
      {/* ===================================================================== */}
      {activeCommandTab === 'MANAGED' && (
        <div className="space-y-6 animate-fadeIn">
          <VendorManagedCareDesk />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. VISTA 3: DISPATCHER UBER/AIRBNB & LOGÍSTICA MÉNTRODA KM 0           */}
      {/* ===================================================================== */}
      {activeCommandTab === 'DISPATCHER' && (
        <div className="space-y-6 animate-fadeIn">
          <UberStyleBookingDispatcher />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. VISTA 4: FINANZAS, SPLIT SOBERANO 80/10/10 & LEDGER                */}
      {/* ===================================================================== */}
      {activeCommandTab === 'FINANCE' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Columna Izquierda: 2 Gráficos */}
            <div className="grid gap-6 md:grid-cols-2 xl:col-span-2">
              <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-400">Cierres de Contratos (Galas)</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{data.totalTransactions}</div>
                  <p className="text-xs text-zinc-500">Volumen en tiempo real</p>
                </div>
                <div className="h-32 w-full mt-4 flex items-end justify-between border-b border-zinc-900 pb-2">
                  {[25, 45, 30, 65, 50, 85, 95].map((val, i) => (
                    <div
                      key={i}
                      className="w-1/12 bg-[#ecb613]/20 hover:bg-[#ecb613]/60 transition-all rounded-t-sm"
                      style={{ height: `${data.totalTransactions > 0 && isDbLive ? val : 2}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-400">Facturación Bruta Global</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{formatCurrency(data.totalRevenue)}</div>
                  <p className="text-xs text-zinc-500">Ledger auditado</p>
                </div>
                <div className="h-32 w-full mt-4 flex items-end justify-between border-b border-zinc-900 pb-2">
                  {[15, 35, 20, 55, 40, 75, 90].map((val, i) => (
                    <div
                      key={i}
                      className="w-1/12 bg-emerald-500/20 hover:bg-emerald-500/60 transition-all rounded-t-sm"
                      style={{ height: `${data.totalRevenue > 0 && isDbLive ? val : 2}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Budget Overview // Split Soberano 80/10/10 */}
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white font-syne uppercase">Split 80/10/10 Overview</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30">
                    SSOT EN VIVO
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mt-2">
                  <span>Total Liquidado</span>
                  <span className="font-bold text-white">{formatCurrency(data.totalRevenue)}</span>
                </div>

                <div className="w-full bg-zinc-900 rounded-full h-2 mt-2 overflow-hidden">
                  <div className="bg-[#ecb613] h-full rounded-full transition-all duration-500" style={{ width: `${splitPercent}%` }} />
                </div>
                <p className="text-[11px] text-zinc-500 text-right mt-1">{splitPercent}% del volumen ejecutado</p>

                <div className="space-y-3 mt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-medium">80% Artista (Edwin Agudelo)</span>
                      <span className="text-white">{formatCurrency(data.artistCache)}</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${data.totalRevenue > 0 ? 80 : 0}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#ecb613] font-medium">10% Infraestructura EAR OS</span>
                      <span className="text-white">{formatCurrency(data.earOsFee)}</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#ecb613] h-full rounded-full" style={{ width: `${data.totalRevenue > 0 ? 10 : 0}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-medium">10% Impacto Social VIMUME</span>
                      <span className="text-white">{formatCurrency(data.vimumeFee)}</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${data.totalRevenue > 0 ? 10 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex justify-between">
                <span>Certificado Modelo 182 AEAT</span>
                <span className="text-cyan-400">80% Deducible</span>
              </div>
            </div>
          </div>

          {/* METAS Y TRANSACCIONES */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 shadow-sm">
              <div className="p-5 border-b border-[#1a1a24]">
                <p className="text-xs text-zinc-400">Balance Operativo Total</p>
                <h2 className="text-3xl font-bold font-mono text-white mt-1">{formatCurrency(data.totalRevenue)}</h2>
              </div>

              <div className="p-4 space-y-1">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2 font-mono">
                  Cuentas Soberanas (Split 80/10/10)
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Caché Edwin Agudelo (80%)</h3>
                      <p className="text-[11px] text-zinc-500">Retribución solista directa</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{formatCurrency(data.artistCache)}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#ecb613]/10 text-[#ecb613]">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">EAR OS Pasarela & CDN (10%)</h3>
                      <p className="text-[11px] text-zinc-500">Mantenimiento y telemetría</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{formatCurrency(data.earOsFee)}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Bóveda VIMUME Social (10%)</h3>
                      <p className="text-[11px] text-zinc-500">Impacto y sesiones 40 Hz</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{formatCurrency(data.vimumeFee)}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Stripe Price-Lock Custodia</h3>
                      <p className="text-[11px] text-zinc-500">Depósitos de 100 €</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{formatCurrency(data.stripeCustody)}</span>
                </div>
              </div>
            </div>

            {/* Card Derecha: Últimas Transacciones */}
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="p-5 border-b border-[#1a1a24] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold font-syne text-white uppercase">Transacciones Recientes</h2>
                    <p className="text-xs text-zinc-500">{data.latestTransactions.length} operaciones registradas</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    LEDGER VERIFICADO
                  </span>
                </div>

                {data.latestTransactions.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#09090d]/80 border border-white/10 flex items-center justify-center mx-auto text-zinc-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-300">Libro Contable en Espera</p>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                        Cero transacciones ficticias. El ledger registrará automáticamente cada depósito Stripe (100 €) o contratación con desglose de Split 80/10/10.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {data.latestTransactions.slice(0, 5).map((tx, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-white">{tx.vertical || 'Depósito Price-Lock'}</span>
                          <span className="text-[10px] text-zinc-500">{new Date(tx.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-mono font-bold text-emerald-400">+{formatCurrency(tx.amountCents / 100)}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{tx.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-zinc-900">
                <Link
                  href="/admin/tesoreria"
                  className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-[#ecb613] bg-zinc-950/60 border border-zinc-800/80 rounded-xl transition-colors"
                >
                  <span>Ver Ledger de Tesorería en Tiempo Real</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 👑 TELEMETRÍA DE ESCAPARATES FLAGSHIP (EZKERTZA BERRIA & GLOBAL EAR OS)   */}
      {/* ===================================================================== */}
      <div className="mt-8">
        <PartnerShowcaseMetricsPanel standaloneMode={true} initialTab="rendimiento" />
      </div>

      {/* ===================================================================== */}
      {/* 🏛️ MATRIZ DE GOBERNANZA & CALIDAD DE URLs (ADMIN CEO)                 */}
      {/* ===================================================================== */}
      <div className="mt-8">
        <MasterUrlGovernanceMatrix />
      </div>

      {/* ===================================================================== */}
      {/* 7. VISTA 5: DIRECTORIO MAESTRO DE DESTINOS DEL ADMIN (DERIVADO)       */}
      {/* ===================================================================== */}
      {activeCommandTab === 'DIRECTORIO' && (
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-widest">
                <Compass className="w-4 h-4 text-[#ecb613]" />
                Catálogo de Módulos // {ADMIN_DIRECTORY_TOTALS.adminModules} módulos +{' '}
                {ADMIN_DIRECTORY_TOTALS.publicShortcuts} atajos · auditado
              </div>
              <h2 className="text-xl font-bold font-syne text-white uppercase mt-1">
                Directorio de Acceso Rápido
              </h2>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar módulo o ruta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-black/60 border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900">
            {DIRECTORY_CATEGORY_CHIPS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${selectedCategory === cat.id
                  ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-[#ecb613]/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredUrls.map((route, idx) => {
              const Icon = route.icon;
              return (
                <Link
                  key={idx}
                  href={route.url}
                  className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-[#ecb613]/40 transition-colors">
                          <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#ecb613] transition-colors" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          {route.category.split("&")[0]}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 group-hover:border-[#ecb613]/30 group-hover:text-[#ecb613] transition-colors">
                        {route.badge}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors">
                      {route.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 font-light line-clamp-2">
                      {route.desc}
                    </p>
                  </div>

                  <div className="pt-2 mt-3 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300">
                    <span className="truncate">{route.url}</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-[#ecb613] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

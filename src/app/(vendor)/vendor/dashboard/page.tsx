'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Clock, Euro, ShieldCheck } from 'lucide-react';

import LeadsPipeline, { type PipelineLead } from '@/components/vendor/LeadsPipeline';
import type { VendorBookingStatus } from '@/lib/vendor/vendorCrmTypes';
import { respondToBookingAction } from '../actions';

interface LeadApi {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventDate: string | null;
  pax: number;
  budgetEur: number;
  source: string;
  status: VendorBookingStatus;
  lastMessage: { id: string; sender: string; body: string; createdAt: string } | null;
  messageCount: number;
}

interface LeadsApiResponse {
  success: boolean;
  leads: LeadApi[];
  error?: string;
}

const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function VendorDashboardPage() {
  const [leads, setLeads] = useState<LeadApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/crm/leads', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as LeadsApiResponse;
      if (data.success) {
        setLeads(data.leads);
        setError(null);
      } else {
        setError(data.error ?? 'Error al cargar las solicitudes.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const pipelineLeads: PipelineLead[] = useMemo(
    () =>
      leads.map((lead) => ({
        id: lead.id,
        clientName: lead.clientName,
        clientPhone: lead.clientPhone,
        clientEmail: lead.clientEmail,
        eventDate: lead.eventDate,
        pax: lead.pax,
        budgetEur: lead.budgetEur,
        source: lead.source,
        status: lead.status,
      })),
    [leads],
  );

  const handleRespond = useCallback(
    async (leadId: string, status: 'ACCEPTED' | 'DECLINED') => {
      const res = await respondToBookingAction({ leadId, status });
      if (!res.ok) throw new Error(res.error);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
      );
    },
    [],
  );

  const pendingCount = leads.filter((lead) => lead.status === 'PENDING').length;
  const acceptedCount = leads.filter((lead) => lead.status === 'ACCEPTED').length;
  const quotedEur = leads
    .filter((lead) => lead.status !== 'DECLINED')
    .reduce((sum, lead) => sum + (lead.budgetEur || 0), 0);

  return (
    <main className="min-h-screen bg-[#030305] text-zinc-100 font-sans p-6 sm:p-12 overflow-x-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00E5FF]/5 blur-[100px] rounded-full pointer-events-none" />

      <section className="relative z-10 max-w-6xl mx-auto space-y-12">
        <header className="space-y-3">
          <p className="text-[10px] font-mono text-[#ecb613] font-bold tracking-widest uppercase">
            Sistema Nervioso Central · Vendor
          </p>
          <h1 className="text-4xl sm:text-5xl font-syne font-black tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            Monitoriza tus KPIs de negocio y gestiona tus solicitudes en tiempo real desde el
            pipeline de leads del CRM.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KpiCard
            label="Pendientes (SLA 24h)"
            value={String(pendingCount)}
            icon={<Clock className="w-5 h-5 text-[#00E5FF]" />}
            valueColor="text-[#00E5FF]"
          />
          <KpiCard
            label="Aceptadas"
            value={String(acceptedCount)}
            icon={<CheckCircle2 className="w-5 h-5 text-[#ecb613]" />}
            valueColor="text-[#ecb613]"
          />
          <KpiCard
            label="Total Cotizado"
            value={eurFormatter.format(quotedEur)}
            icon={<Euro className="w-5 h-5 text-[#ecb613]" />}
            valueColor="text-[#ecb613]"
          />
          <KpiCard
            label="Estado del Perfil"
            value={error ? 'Sin conexión' : 'Activo'}
            subtitle={error ? 'Revisa la base de datos' : 'S-Class verificado'}
            icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
            valueColor={error ? 'text-rose-400' : 'text-emerald-400'}
          />
        </section>

        {error && !loading ? (
          <div className="px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs">
            {error}
          </div>
        ) : null}

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-syne font-bold text-white">Pipeline de Solicitudes</h2>
            <button
              type="button"
              onClick={() => void loadLeads()}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-mono text-xs uppercase tracking-wider"
            >
              Refrescar
            </button>
          </div>
          {loading ? (
            <p className="p-12 text-center text-xs font-mono text-zinc-500">
              Cargando pipeline de solicitudes...
            </p>
          ) : (
            <LeadsPipeline leads={pipelineLeads} onRespond={handleRespond} />
          )}
        </section>
      </section>
    </main>
  );
}

function KpiCard({
  label,
  value,
  icon,
  subtitle,
  accent = 'border-white/5',
  valueColor = 'text-white',
}: {
  label: string;
  value: string;
  icon: ReactNode;
  subtitle?: string;
  accent?: string;
  valueColor?: string;
}) {
  return (
    <article className={`bg-[#050508] border ${accent} rounded-2xl p-6 flex flex-col justify-between h-36 backdrop-blur-md transition-all hover:border-white/10`}>
      <div className="flex items-start justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          {label}
        </h3>
        {icon}
      </div>
      <div>
        <p className={`text-3xl font-mono font-bold ${valueColor}`}>{value}</p>
        {subtitle ? (
          <p className="text-[10px] font-mono text-zinc-500 mt-1 truncate">{subtitle}</p>
        ) : null}
      </div>
    </article>
  );
}
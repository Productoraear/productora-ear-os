import type { ReactElement } from 'react';
import { prisma } from '@/lib/database/prisma';
import type { FunnelEventType } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface FunnelPageData {
  total: number;
  leads: number;
  deposits: number;
  conversionRate: number | null;
  byEvent: Array<{ eventType: FunnelEventType; count: number }>;
  byStep: Array<{ step: number | null; count: number }>;
  byArchetype: Array<{ archetype: string | null; count: number }>;
}

const EVENT_LABELS: Readonly<Record<FunnelEventType, string>> = {
  FUNNEL_STARTED: 'Inicio de embudo',
  STEP_REACHED: 'Paso alcanzado',
  QUOTE_VIEWED: 'Cotización vista',
  LEAD_SUBMITTED: 'Lead captado',
  DEPOSIT_INITIATED: 'Depósito iniciado',
  DEPOSIT_CONFIRMED: 'Depósito confirmado',
  DEPOSIT_ERROR: 'Error de depósito',
  FUNNEL_ABANDONED: 'Abandono',
};

const STEP_LABELS: Readonly<Partial<Record<number, string>>> = {
  1: 'Tinder · Formato',
  2: 'Airbnb · Fecha',
  3: 'Bodas · Timeline',
  4: 'Uber · Logística',
  5: 'Lock · Bloqueo',
};

function fmt(n: number): string {
  return new Intl.NumberFormat('es-ES').format(n);
}

async function loadFunnelData(): Promise<FunnelPageData | null> {
  try {
    const [total, byEvent, byStep, byArchetype] = await Promise.all([
      prisma.funnelEvent.count(),
      prisma.funnelEvent.groupBy({ by: ['eventType'], _count: { _all: true } }),
      prisma.funnelEvent.groupBy({ by: ['step'], _count: { _all: true } }),
      prisma.funnelEvent.groupBy({ by: ['archetype'], _count: { _all: true } }),
    ]);

    const countOf = (type: FunnelEventType): number =>
      byEvent.find((row) => row.eventType === type)?._count._all ?? 0;

    const leads = countOf('LEAD_SUBMITTED');
    const deposits = countOf('DEPOSIT_INITIATED') + countOf('DEPOSIT_CONFIRMED');
    const started = countOf('FUNNEL_STARTED');

    return {
      total,
      leads,
      deposits,
      conversionRate: started > 0 ? Math.round((leads / started) * 1000) / 10 : null,
      byEvent: byEvent
        .map((row) => ({ eventType: row.eventType, count: row._count._all }))
        .sort((a, b) => b.count - a.count),
      byStep: byStep
        .map((row) => ({ step: row.step, count: row._count._all }))
        .sort((a, b) => (a.step ?? 0) - (b.step ?? 0)),
      byArchetype: byArchetype
        .map((row) => ({ archetype: row.archetype, count: row._count._all }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    console.error('[funnel-telemetry-page] load error:', error);
    return null;
  }
}

function Kpi(props: { label: string; value: string; accent: string }): ReactElement {
  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4 transition-all duration-300 ease-out hover:border-white/20">
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/40">
        {props.label}
      </span>
      <div className={`text-2xl font-black font-mono mt-1 ${props.accent}`}>{props.value}</div>
    </div>
  );
}

export default async function FunnelTelemetryPage(): Promise<ReactElement> {
  const data = await loadFunnelData();

  return (
    <div className="min-h-screen bg-[#030305] text-white p-6 md:p-10 overflow-x-hidden">
      <header className="max-w-5xl mx-auto mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest font-mono">
          Telemetría · Embudo
        </span>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mt-3 font-syne">
          Conversión en tiempo real
        </h1>
        <p className="text-white/50 text-sm mt-2 font-mono">
          Eventos de embudo persistidos en PostgreSQL 16 · despacho n8n no bloqueante · cero leads
          huérfanos.
        </p>
      </header>

      {data === null ? (
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-8">
          <p className="text-white/60 font-mono text-sm leading-relaxed">
            Sin datos todavía. La tabla <code className="text-[#00E5FF]">FunnelEvent</code> se
            materializa tras la primera interacción del funnel. Si el modelo aún no está migrado,
            ejecuta <code className="text-[#ecb613]">npx prisma db push</code> en el servidor.
          </p>
        </div>
      ) : (
        <main className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Eventos totales" value={fmt(data.total)} accent="text-[#00E5FF]" />
            <Kpi label="Leads captados" value={fmt(data.leads)} accent="text-[#ecb613]" />
            <Kpi label="Depósitos" value={fmt(data.deposits)} accent="text-emerald-400" />
            <Kpi
              label="Conversión"
              value={data.conversionRate === null ? '—' : `${data.conversionRate}%`}
              accent="text-[#FF2B44]"
            />
          </div>

          <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-white/70 font-mono mb-4">
              Eventos por tipo
            </h2>
            <div className="space-y-2">
              {data.byEvent.map((row) => {
                const pct = data.total > 0 ? (row.count / data.total) * 100 : 0;
                return (
                  <div key={row.eventType} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 text-[11px] font-mono text-white/70">
                      {EVENT_LABELS[row.eventType]}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#00E5FF]/70 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-[11px] font-mono font-bold text-white">
                      {fmt(row.count)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-white/70 font-mono mb-4">
                Distribución por paso
              </h2>
              <div className="space-y-2">
                {data.byStep.map((row) => (
                  <div
                    key={row.step ?? 'n/a'}
                    className="flex items-center justify-between text-[11px] font-mono"
                  >
                    <span className="text-white/70">
                      {row.step === null ? 'Sin paso' : (STEP_LABELS[row.step] ?? `Paso ${row.step}`)}
                    </span>
                    <span className="font-bold text-[#ecb613]">{fmt(row.count)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-white/70 font-mono mb-4">
                Distribución por arquetipo
              </h2>
              <div className="space-y-2">
                {data.byArchetype.map((row) => (
                  <div
                    key={row.archetype ?? 'n/a'}
                    className="flex items-center justify-between text-[11px] font-mono"
                  >
                    <span className="text-white/70">{row.archetype ?? 'Sin arquetipo'}</span>
                    <span className="font-bold text-[#00E5FF]">{fmt(row.count)}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}

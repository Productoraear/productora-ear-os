'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  CalendarDays,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Package,
  Coins,
  ArrowRight,
} from 'lucide-react';

interface CartProvider {
  slug: string;
  name: string;
  category: string;
  province: string | null;
  municipality: string | null;
  verified: boolean;
  rating: number | null;
  kind: string;
  bestScore: number;
  depositCents: number;
  calendarHref: string;
  icalHref: string;
  services: Array<{
    id: string;
    name: string;
    phase: string;
    essential: boolean;
    marketReferenceEur: number;
  }>;
}

interface CartLine {
  serviceId: string;
  service: string;
  category: string;
  phase: string;
  essential: boolean;
  included: boolean;
  score: number;
  providerSlug: string | null;
  providerName: string | null;
}

interface BlueprintResponse {
  ok: boolean;
  catalogServices?: number;
  providersEvaluated?: number;
  executionTimeMs?: number;
  cart?: {
    threshold: number;
    totals: {
      services: number;
      covered: number;
      gaps: number;
      coveragePercent: number;
      essentialTotal: number;
      essentialCovered: number;
      essentialCoveragePercent: number;
      uniqueProviders: number;
      depositUnitCents: number;
      totalDepositCents: number;
      marketReferenceEur: number;
    };
    providers: CartProvider[];
    lines: CartLine[];
    gaps: Array<{ id: string; name: string; category: string; essential: boolean }>;
  };
  error?: string;
}

interface DepositReceipt {
  slug: string;
  name: string;
  amountCents: number;
  status: string;
  reason: string | null;
  priceLockHash: string;
  calendarHref: string;
}

interface DepositResponse {
  ok: boolean;
  mode?: string;
  requested?: number;
  charged?: number;
  failed?: number;
  totalCents?: number;
  receipts?: DepositReceipt[];
  error?: string;
}

const DEFAULT_DATE = (() => {
  const date = new Date();
  date.setDate(date.getDate() + 120);
  return date.toISOString().slice(0, 10);
})();

function eur(cents: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export default function EventCartConsole() {
  const [province, setProvince] = useState('madrid');
  const [guests, setGuests] = useState(180);
  const [budgetEur, setBudgetEur] = useState(45000);
  const [eventDate, setEventDate] = useState(DEFAULT_DATE);
  const [timeSlot, setTimeSlot] = useState('14:00');

  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<BlueprintResponse | null>(null);
  const [charging, setCharging] = useState(false);
  const [deposit, setDeposit] = useState<DepositResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateBlueprint = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setDeposit(null);
    setBlueprint(null);
    try {
      const res = await fetch('/api/events/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ province, guests, budgetEur, eventDate, timeSlot }),
      });
      const json = (await res.json()) as BlueprintResponse;
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'No se pudo generar el plano del evento.');
        return;
      }
      setBlueprint(json);
    } catch {
      setError('Fallo de red generando el plano del evento.');
    } finally {
      setLoading(false);
    }
  };

  const chargeGuarantees = async (): Promise<void> => {
    const providers = blueprint?.cart?.providers ?? [];
    if (providers.length === 0) return;

    setCharging(true);
    setError(null);
    try {
      const res = await fetch('/api/events/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'simulate',
          eventDate,
          timeSlot,
          idempotencyKey: `ear-event-${eventDate}-${province}`,
          items: providers.map((provider) => ({
            slug: provider.slug,
            kind: provider.kind,
            name: provider.name,
            serviceIds: provider.services.map((service) => service.id),
          })),
        }),
      });
      const json = (await res.json()) as DepositResponse;
      setDeposit(json);
      if (!res.ok && json.error) setError(json.error);
    } catch {
      setError('Fallo de red al simular el cobro de garantías.');
    } finally {
      setCharging(false);
    }
  };

  const totals = blueprint?.cart?.totals;
  const providers = blueprint?.cart?.providers ?? [];

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613]">
              <Sparkles size={12} /> Plano de evento completo · 122 servicios
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Un evento, <span className="text-[#ecb613]">todos los proveedores</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
              Barrido completo del catálogo: cada servicio busca proveedor real con afinidad
              mínima del 75 %, entra al carrito y se le bloquea su propia fecha con una garantía
              de 1,00 €. Sin colisiones de agenda entre gremios.
            </p>
          </div>
          <Link
            href="/proveedores"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 hover:bg-white/10 transition-all"
          >
            <Package size={13} /> Directorio real
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <label className="space-y-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Provincia
            <input
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono"
              placeholder="madrid"
            />
          </label>
          <label className="space-y-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Invitados
            <input
              type="number"
              min={2}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
          </label>
          <label className="space-y-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Presupuesto €
            <input
              type="number"
              min={500}
              step={500}
              value={budgetEur}
              onChange={(event) => setBudgetEur(Number(event.target.value))}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
          </label>
          <label className="space-y-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Fecha
            <input
              type="date"
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
          </label>
          <label className="space-y-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Franja
            <input
              value={timeSlot}
              onChange={(event) => setTimeSlot(event.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono"
              placeholder="14:00"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => void generateBlueprint()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ecb613] text-black font-bold font-mono text-sm hover:bg-[#f5d273] transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'Barriendo el ecosistema…' : 'Generar carrito del evento'}
        </button>
      </header>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-mono text-rose-300">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {totals && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Servicios evaluados', value: `${totals.services}`, hint: `umbral ${blueprint?.cart?.threshold ?? 75} %` },
              { label: 'Cubiertos', value: `${totals.covered}`, hint: `${totals.coveragePercent} % del catálogo` },
              { label: 'Proveedores únicos', value: `${totals.uniqueProviders}`, hint: `${blueprint?.providersEvaluated ?? 0} evaluados` },
              { label: 'Garantías 1 €', value: eur(totals.totalDepositCents), hint: `${providers.length} agendas a bloquear` },
            ].map((card) => (
              <div key={card.label} className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4">
                <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{card.label}</div>
                <div className="text-2xl font-black text-white mt-1">{card.value}</div>
                <div className="text-[10px] font-mono text-[#ecb613] mt-0.5">{card.hint}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                <ShieldCheck size={14} />
                Imprescindibles cubiertos: {totals.essentialCovered}/{totals.essentialTotal} (
                {totals.essentialCoveragePercent} %)
              </div>
              <div className="text-[11px] text-zinc-500">
                Garantía por proveedor: {eur(totals.depositUnitCents)} · Referencia de mercado del
                carrito: {totals.marketReferenceEur.toLocaleString('es-ES')} € (orientativa)
              </div>
            </div>
            <button
              type="button"
              onClick={() => void chargeGuarantees()}
              disabled={charging || providers.length === 0}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF2B44] text-white font-bold font-mono text-xs hover:bg-[#ff4560] transition-all disabled:opacity-60"
            >
              {charging ? <Loader2 size={15} className="animate-spin" /> : <Coins size={15} />}
              {charging
                ? 'Bloqueando agendas…'
                : `Cobrar ${eur(totals.totalDepositCents)} (1 € × ${providers.length})`}
            </button>
          </div>
        </div>
      )}
      {providers.length > 0 && (
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              Carrito multi-proveedor
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">
              {providers.reduce((sum, provider) => sum + provider.services.length, 0)} partidas ·{' '}
              {providers.length} agendas
            </span>
          </div>
          <div className="max-h-[520px] overflow-y-auto divide-y divide-white/5">
            {providers.map((provider) => (
              <div key={provider.slug} className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{provider.name}</span>
                    {provider.verified && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        verificado
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    {provider.category} · {provider.municipality ?? provider.province ?? 'n/d'} ·{' '}
                    {provider.services.length} servicio(s)
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {provider.services.slice(0, 3).map((service) => service.name).join(' · ')}
                    {provider.services.length > 3 ? ' …' : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30">
                    {provider.bestScore} % afinidad
                  </span>
                  <Link
                    href={provider.calendarHref}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-white hover:bg-white/10 transition-all"
                  >
                    <CalendarDays size={11} /> Su agenda
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deposit?.receipts && deposit.receipts.length > 0 && (
        <div className="rounded-3xl bg-[#09090d]/80 border border-emerald-500/20 backdrop-blur-md overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Garantías procesadas
            </h2>
            <span className="text-[10px] font-mono text-emerald-300">
              {deposit.mode} · {deposit.charged}/{deposit.requested} · {eur(deposit.totalCents ?? 0)}
            </span>
          </div>
          <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5">
            {deposit.receipts.map((receipt) => (
              <div key={`${receipt.slug}-receipt`} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <span className="text-white">{receipt.name}</span>
                <span className="text-zinc-500">{receipt.slug}</span>
                <span className={receipt.status === 'REJECTED' ? 'text-rose-400' : 'text-emerald-400'}>
                  {receipt.status} · {eur(receipt.amountCents)}
                </span>
                <span className="text-zinc-600">#{receipt.priceLockHash.slice(0, 12)}</span>
                <Link
                  href={receipt.calendarHref}
                  className="inline-flex items-center gap-1 text-[#ecb613] hover:text-white"
                >
                  ver agenda <ArrowRight size={10} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

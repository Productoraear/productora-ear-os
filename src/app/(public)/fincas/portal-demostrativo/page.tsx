"use client";
import React from 'react';
import Link from 'next/link';
import {
  buildExecutiveDashboard,
  formatEuros,
} from '@/lib/fincas/fincaMetricsEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';
import BodasNetVsEarOsComparator from '@/components/fincas/BodasNetVsEarOsComparator';
import FincaAcousticShieldCard from '@/components/fincas/FincaAcousticShieldCard';
import {
  Gauge,
  ShieldCheck,
  Banknote,
  TrendingUp,
  CalendarCheck,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

export default function FincaExecutiveCockpitPage() {
  const dashboard = buildExecutiveDashboard();

  const topRentables = [...dashboard.rentabilidad]
    .sort((a, b) => b.margenFincaAnual - a.margenFincaAnual)
    .slice(0, 4);

  const totalMargenRed = dashboard.rentabilidad.reduce(
    (acc, r) => acc + r.margenFincaAnual,
    0,
  );

  const totalComisionesRed = dashboard.rentabilidad.reduce(
    (acc, r) => acc + r.comisionAfiliacionAnual,
    0,
  );

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#030305] text-white pt-16">
      {/* ── HERO EJECUTIVO CONECTADO CON FINCASPARABODA.COM ── */}
      <section className="relative border-b border-white/10 py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[11px] font-mono uppercase tracking-[0.3em]">
              <Gauge size={14} />
              FINCASPARABODA.COM · S-CLASS VERTICAL
            </div>
            <a 
              href="https://fincasparaboda.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-zinc-300 text-[11px] font-mono transition-colors"
            >
              <span>fincasparaboda.com</span>
              <ArrowRight size={11} className="text-[#ecb613]" />
            </a>
          </div>

          <div className="max-w-4xl space-y-6">
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95]">
              FincasParaBoda.com // Su finca factura <span className="text-[#ecb613]">más</span> sin intermediarios
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/60 leading-relaxed max-w-3xl">
              Ecosistema B2B conectado directamente con <strong className="text-[#ecb613]">fincasparaboda.com</strong> y Productora EAR: métricas reales de
              rentabilidad, 0 € en cuotas publicitarias, blindaje acústico inferior a{' '}
              <strong className="text-white">75 dB SPL</strong> y cierres inmediatos con
              depósito de <strong className="text-[#ecb613]">100 €</strong> en Stripe.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/fincasparaboda"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#ecb613] text-black font-black uppercase tracking-widest text-sm rounded-xl hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] transition-all font-mono"
              >
                Ver FincasParaBoda.com
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/proveedores?cat=finca"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.04] border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/[0.08] transition-all font-mono"
              >
                Directorio de Fincas Homologadas
              </Link>
              <a
                href="https://wa.me/34693693048?text=Hola%20Edwin%2C%20quiero%20homologar%20mi%20finca%20en%20fincasparaboda.com%20con%20blindaje%20ac%C3%BAstico%20y%200%E2%82%AC%20de%20cuota."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-emerald-500/25 transition-all font-mono"
              >
                Homologar Mi Espacio (0 €)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── MÉTRICAS DEMOLEDORAS ── */}
      <section className="py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ecb613]">
              Telemetría de la red homologada
            </p>
            <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Números que su banquero entenderá
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#050507] border border-white/10 rounded-2xl p-6 space-y-2">
              <ShieldCheck size={22} className="text-[#ecb613]" />
              <p className="font-mono text-4xl font-black text-white">
                {dashboard.totalFincasHomologadas}
              </p>
              <p className="font-body text-sm text-white/50">
                Fincas homologadas S-Class en la Zona Centro
              </p>
            </div>

            <div className="bg-[#050507] border border-white/10 rounded-2xl p-6 space-y-2">
              <TrendingUp size={22} className="text-[#ecb613]" />
              <p className="font-mono text-4xl font-black text-[#ecb613]">
                {formatEuros(dashboard.mercadoPotencialEur)}
              </p>
              <p className="font-body text-sm text-white/50">
                Mercado potencial anual de la red (28 bodas/finca)
              </p>
            </div>

            <div className="bg-[#050507] border border-white/10 rounded-2xl p-6 space-y-2">
              <Banknote size={22} className="text-[#ecb613]" />
              <p className="font-mono text-4xl font-black text-white">
                {formatEuros(totalMargenRed)}
              </p>
              <p className="font-body text-sm text-white/50">
                Margen anual atribuible a la red completa
              </p>
            </div>

            <div className="bg-[#050507] border border-white/10 rounded-2xl p-6 space-y-2">
              <CalendarCheck size={22} className="text-[#ecb613]" />
              <p className="font-mono text-4xl font-black text-white">
                {formatEuros(totalComisionesRed)}
              </p>
              <p className="font-body text-sm text-white/50">
                Comisiones de afiliación liquidando en 7 días hábiles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA BODAS.NET VS EAR OS ── */}
      <section className="py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <BodasNetVsEarOsComparator rows={dashboard.comparativa} />
        </div>
      </section>

      {/* ── BLINDAJE ACÚSTICO ── */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-[#050507]/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ecb613]">
              Blindaje acústico certificado
            </p>
            <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Cero multas. Cero quejas vecinales.{' '}
              <span className="text-[#ecb613]">Menos de 75 dB SPL</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.blindajeAcustico.slice(0, 6).map((shield) => {
              const finca = SCLASS_12_FINCAS_HOMOLOGADAS.find(
                (f) => f.id === shield.fincaId,
              );
              return (
                <FincaAcousticShieldCard
                  key={shield.fincaId}
                  shield={shield}
                  capacidadMaxPax={finca?.capacidadMaxPax ?? 300}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RANKING DE RENTABILIDAD ── */}
      <section className="py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ecb613]">
              Rentabilidad por finca
            </p>
            <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Las fincas más rentables de la red
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050507]">
            <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-white/[0.03] border-b border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/40">
              <span>Finca</span>
              <span className="text-right">Margen anual</span>
              <span className="text-right">Comisión</span>
              <span className="text-right">Ahorro multas</span>
            </div>
            <div className="divide-y divide-white/5">
              {topRentables.map((r) => (
                <div
                  key={r.fincaId}
                  className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center"
                >
                  <p className="font-body text-sm font-bold text-white truncate">
                    {r.fincaName}
                  </p>
                  <p className="text-right font-mono text-sm text-[#ecb613] font-black">
                    {formatEuros(r.margenFincaAnual)}
                  </p>
                  <p className="text-right font-mono text-sm text-white/70">
                    {formatEuros(r.comisionAfiliacionAnual)}
                  </p>
                  <p className="text-right font-mono text-sm text-emerald-400">
                    {formatEuros(r.ahorroMultasAnualEstimado)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="font-body text-sm text-white/40 leading-relaxed max-w-3xl">
            Proyección basada en {SCLASS_12_FINCAS_HOMOLOGADAS.length} fincas
            homologadas, 28 bodas anuales por espacio y tarifa base del solista
            de 350 € con logística desde Méntrida a 1,50 €/km a partir del km
            50.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-[#050507] border border-[#ecb613]/30 p-10 md:p-16 text-center space-y-6">
            <BadgeCheck size={40} className="text-[#ecb613] mx-auto" />
            <h2 className="font-syne text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Deje de pagar por leads fríos
            </h2>
            <p className="font-body text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              EAR OS le entrega el portal Bodas.net que su finca necesita, sin
              cuotas de alta, con blindaje acústico y con cierres blindados por
              el depósito Stripe de 100 €.
            </p>
            <Link
              href="/fincas"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#ecb613] text-black font-black uppercase tracking-widest text-sm rounded-xl hover:shadow-[0_0_35px_rgba(236,182,19,0.5)] transition-all"
            >
              Acceder al portal B2B de fincas
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
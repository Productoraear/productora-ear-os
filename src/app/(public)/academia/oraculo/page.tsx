"use client";

/**
 * 💎 ORÁCULO DIAMANTE ROJO — /academia/oraculo (y espejo /oraculo)
 * Suite consultiva algorítmica para artistas validados.
 * Tono: Baño de Realidad con Pasos Accionables S-Class.
 * Estética OLED #030305 · Acento Rubí #FF2B44.
 */

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Diamond, Search, FileText, AlertTriangle, Target } from 'lucide-react';
import OraculoSearchConsole from '@/components/academia/OraculoSearchConsole';
import GanttChronogram6199 from '@/components/academia/GanttChronogram6199';
import SpotifyAlgorithmAuditor from '@/components/academia/SpotifyAlgorithmAuditor';
import VelocityFunnelCalculator from '@/components/academia/VelocityFunnelCalculator';
import {
  CRITICAL_CASES,
  GROWTH_CLUSTERS,
  type CaseCategory,
} from '@/lib/academia/oraculoEngine';

const CATEGORY_LABEL: Record<CaseCategory, string> = {
  algoritmo: 'Algoritmo',
  fans: 'Fans',
  monetizacion: 'Monetización',
  identidad: 'Identidad',
  equipo: 'Equipo',
  gira: 'Gira',
};

const CATEGORIES: (CaseCategory | 'todos')[] = [
  'todos',
  'algoritmo',
  'fans',
  'monetizacion',
  'identidad',
  'equipo',
  'gira',
];

export default function OraculoDiamanteRojoPage() {
  const [activeCategory, setActiveCategory] = useState<CaseCategory | 'todos'>(
    'todos',
  );

  const cases = useMemo(
    () =>
      activeCategory === 'todos'
        ? CRITICAL_CASES
        : CRITICAL_CASES.filter((c) => c.category === activeCategory),
    [activeCategory],
  );

  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#FF2B44]/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* HERO */}
        <section className="relative">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[#FF2B44]/10 blur-[180px] pointer-events-none" />
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#FF2B44]/30 bg-[#FF2B44]/5 px-5 py-2 text-[11px] font-black uppercase tracking-[0.4em] text-[#FF2B44]">
              <Diamond size={14} /> Oráculo Diamante Rojo
            </div>
            <h1 className="font-syne text-5xl font-black uppercase italic leading-[0.8] tracking-tighter md:text-7xl">
              El Baño de Realidad
              <br />
              <span className="text-[#FF2B44]">con Pasos Accionables</span>
            </h1>
            <p className="font-sans text-lg leading-relaxed text-white/50 md:text-xl">
              Motor consultivo algorítmico para artistas validados. Sin adornos:
              diagnóstico, cronograma ejecutable y funnels de monetización reales.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/academia"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-all hover:border-[#FF2B44]/40"
              >
                Volver al Campus
              </Link>
              <Link
                href="/contacto"
                className="rounded-full bg-[#FF2B44] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#ff5063]"
              >
                Solicitar Diagnóstico
              </Link>
            </div>
          </div>
        </section>

        {/* CLUSTERS DE CRECIMIENTO */}
        <section className="mt-20">
          <h2 className="flex items-center gap-3 font-syne text-2xl font-black uppercase italic tracking-tighter">
            <Target size={22} className="text-[#FF2B44]" /> Clusters de Crecimiento
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {GROWTH_CLUSTERS.map((cluster) => (
              <article
                key={cluster.id}
                className="rounded-[2rem] border border-white/10 bg-[#050507] p-8 transition-all hover:border-[#FF2B44]/40"
              >
                <h3 className="font-syne text-xl font-black uppercase italic tracking-tight">
                  {cluster.title}
                </h3>
                <p className="mt-3 text-sm italic text-white/50">
                  {cluster.thesis}
                </p>
                <ul className="mt-5 space-y-2">
                  {cluster.actionSteps.map((step) => (
                    <li key={step} className="flex gap-3 text-xs text-white/60">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2B44]" />
                      {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]">
                  {cluster.northStarMetric}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HERRAMIENTAS INTERACTIVAS */}
        <section className="mt-20 grid gap-8 lg:grid-cols-2">
          <SpotifyAlgorithmAuditor />
          <VelocityFunnelCalculator />
        </section>

        <section className="mt-8">
          <GanttChronogram6199 />
        </section>

        <section className="mt-8">
          <OraculoSearchConsole />
        </section>

        {/* BIBLIOTECA DE 30 CASOS CRÍTICOS */}
        <section className="mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-3 font-syne text-2xl font-black uppercase italic tracking-tighter">
              <AlertTriangle size={22} className="text-[#FF2B44]" /> 30 Casos Críticos
              de la Industria
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Consulta en 1 clic
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'border-[#FF2B44] bg-[#FF2B44] text-black font-bold'
                    : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {cat === 'todos' ? 'Todos' : CATEGORY_LABEL[cat]}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caso) => (
              <article
                key={caso.id}
                className="rounded-2xl border border-white/10 bg-[#050507] p-5 transition-all hover:border-[#FF2B44]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF2B44]">
                    Caso #{caso.id}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/40">
                    {CATEGORY_LABEL[caso.category]}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">{caso.title}</h3>
                <p className="mt-2 text-xs italic text-white/45">{caso.symptom}</p>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-[11px]">
                  <p className="text-white/60">
                    <span className="font-mono uppercase tracking-widest text-white/30">
                      Diagnóstico ·{' '}
                    </span>
                    {caso.diagnosis}
                  </p>
                  <p className="text-[#00E5FF]">
                    <span className="font-mono uppercase tracking-widest text-white/30">
                      Acción ·{' '}
                    </span>
                    {caso.action}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EXPORTADOR DE AUDITORÍA */}
        <section className="mt-20 rounded-[2rem] border border-white/10 bg-[#050507] p-8 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="flex items-center gap-3 font-syne text-2xl font-black uppercase italic tracking-tighter">
                <FileText size={22} className="text-[#FF2B44]" /> Exportador de Auditoría
              </h2>
              <p className="text-sm text-white/50">
                Genera el informe criptográfico con el sello de certificación EAR OS
                desde la calculadora de salud algorítmica. Un documento accionable,
                trazable y listo para tu equipo.
              </p>
            </div>
            <button
              onClick={() => {
                document
                  .querySelector('input[aria-label="Nombre del artista"]')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF2B44] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#ff5063] cursor-pointer"
            >
              <Search size={14} /> Ir al Exportador
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
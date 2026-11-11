import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import TinderMatcherClient from '@/app/components/public/TinderMatcherClient';
import { CommercialEventCalculator } from '@/components/calculator/CommercialEventCalculator';
import { Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Diseña tu Presupuesto & Matcher S-Class | Productora EAR',
  description: 'Sistema interactivo de cotización en tiempo real, perfilado de eventos y matching de artistas de alta gama.',
};

/**
 * RUTA CANÓNICA DEL COTIZADOR (ORDEN 2026-11-11 §1).
 *
 * Antes: `/presupuesto` sólo servía el matcher y el conmutador enviaba a
 * `/cotizador`, ruta que NO existía (enlace muerto = INV-09 roto). Ahora la
 * canónica sirve los DOS flujos en la misma página, con el estado en un único
 * formulario: el recomendador arriba y el terminal de costes debajo.
 * `/calculadora` y `/cotizador` redirigen aquí con 301 (next.config.ts).
 */
export default function PresupuestoPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            MOTOR TÁCTICO DE COTIZACIÓN // EAR OS S-CLASS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            DISEÑA TU <span className="text-[#ecb613]">PRESUPUESTO</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Perfila el formato con el recomendador y desglosa cada servicio en el terminal de
            costes. Un solo estado: lo que marcas arriba se cotiza abajo, al céntimo.
          </p>

          {/* Anclas internas: misma página, cero rutas competidoras */}
          <div className="flex items-center justify-center pt-2">
            <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl gap-2">
              <a
                href="#matcher"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Recomendador / Matcher</span>
              </a>
              <a
                href="#terminal-costes"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-2"
              >
                <SlidersHorizontal size={14} />
                <span>Calculadora de Costes</span>
              </a>
            </div>
          </div>
        </div>

        {/* 1 · Recomendador / Matcher */}
        <section id="matcher" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 scroll-mt-32">
          <div className="p-6 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Inteligencia Conductual 50Q</span>
              <h3 className="text-xl font-black text-white uppercase font-syne">¿Prefieres que el Túnel Neural profile tu evento paso a paso?</h3>
              <p className="text-xs text-white/50">Simulador de presión acústica, compatibilidad de repertorio y congelación de tarifa en 4 pantallas.</p>
            </div>
            <Link
              href="/servicios"
              className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all whitespace-nowrap"
            >
              <span>Abrir Túnel Neural</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <TinderMatcherClient />
        </section>

        {/* 2 · Terminal de costes (mismo estado, misma página) */}
        <section id="terminal-costes" className="scroll-mt-32">
          <CommercialEventCalculator />
        </section>
      </div>
    </main>
  );
}


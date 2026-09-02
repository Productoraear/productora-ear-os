import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import TinderMatcherClient from '@/app/components/public/TinderMatcherClient';
import { Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Diseña tu Presupuesto & Matcher S-Class | Productora EAR',
  description: 'Sistema interactivo de cotización en tiempo real, perfilado de eventos y matching de artistas de alta gama.',
};

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
            DISEÑA TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">PRESUPUESTO</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Descubre el formato escénico idóneo mediante nuestro recomendador interactivo o cambia a la calculadora técnica de costes para desglosar servicios y logística.
          </p>

          {/* Unified Flow Switcher */}
          <div className="flex items-center justify-center pt-2">
            <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl gap-2">
              <Link
                href="/presupuesto"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Recomendador / Matcher</span>
              </Link>
              <Link
                href="/cotizador"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <SlidersHorizontal size={14} />
                <span>Calculadora de Costes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Matcher Component & Unified Flow */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Banner de Salto Inmediato al Túnel Neural */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Inteligencia Conductual 50Q</span>
              <h3 className="text-xl font-black text-white uppercase font-syne">¿Prefieres que el Túnel Neural profile tu evento paso a paso?</h3>
              <p className="text-xs text-white/50">Simulador de presión acústica, compatibilidad de repertorio y congelación de tarifa en 4 pantallas.</p>
            </div>
            <Link
              href="/servicios"
              className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_25px_rgba(236,182,19,0.3)] whitespace-nowrap"
            >
              <span>Abrir Túnel Neural →</span>
            </Link>
          </div>

          <TinderMatcherClient />
        </div>
      </div>
    </main>
  );
}


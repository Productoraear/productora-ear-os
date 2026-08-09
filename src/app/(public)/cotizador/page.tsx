import React from 'react';
import Link from 'next/link';
import { MultiPricer } from '@/features/finance/ui/MultiPricer';
import { Metadata } from 'next';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Calculadora de Costes & Cotizador S-Class | Productora EAR',
  description: 'Arquitectura de costes de alta fidelidad para servicios de autor, sonido L-Acoustics y logística táctica.',
};

export default function CotizadorPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            ARQUITECTURA TÁCTICA DE COSTES // EAR OS S-CLASS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            CALCULADORA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">PRESUPUESTOS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Configura en vivo tu ensamble artístico, microfonía y producción técnica con cálculo automático de kilometraje y dietas.
          </p>

          {/* Unified Flow Switcher */}
          <div className="flex items-center justify-center pt-2">
            <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl gap-2">
              <Link
                href="/presupuesto"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Recomendador / Matcher</span>
              </Link>
              <Link
                href="/cotizador"
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-2"
              >
                <SlidersHorizontal size={14} />
                <span>Calculadora de Costes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* MultiPricer Engine */}
        <MultiPricer />
      </div>
    </main>
  );
}


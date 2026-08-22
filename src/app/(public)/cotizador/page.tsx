import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, SlidersHorizontal, Cpu, Flame } from 'lucide-react';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { NeuroFunnelSClass } from '@/components/sclass/NeuroFunnelSClass';
import { MultiPricer } from '@/features/finance/ui/MultiPricer';

export const metadata: Metadata = {
  title: 'Cotizador S-Class & Neuro-Funnel Acústico | Productora EAR',
  description: 'Arquitectura de costes de alta fidelidad, diagnóstico acústico 12 W/pax y Price-Lock 72h con tarifas reales verificadas.',
};

export default function CotizadorPage() {
  return (
    <MeshGradientBackground intensity="stage">
      <main className="min-h-screen pt-32 pb-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header Hero */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
              NEURO-FUNNEL S-CLASS 2036 // EAR OS REVENUE ENGINE
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
              TÚNEL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">COTIZACIÓN INTELIGENTE</span>
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              Selecciona tu tipo de evento, diagnostica tus requerimientos acústicos (12 W/pax) y obtén tu propuesta técnica con <strong className="text-white">Price-Lock 72h SHA-256</strong>.
            </p>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center pt-2">
              <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl gap-2 backdrop-blur-md">
                <Link
                  href="/presupuesto"
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Matcher Algorítmico</span>
                </Link>
                <div className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-2">
                  <Cpu size={14} />
                  <span>Neuro-Funnel 2036</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🧠 Core Neuro-Funnel Component */}
          <NeuroFunnelSClass />

          {/* 📊 MultiPricer Modular Fallback */}
          <div className="pt-12 border-t border-white/10 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest block">Modo Avanzado de Ingeniería</span>
              <h3 className="text-xl font-bold font-syne text-white uppercase tracking-tight">
                Calculadora Paramétrica Desglosada (MultiPricer)
              </h3>
            </div>
            <MultiPricer />
          </div>

        </div>
      </main>
    </MeshGradientBackground>
  );
}

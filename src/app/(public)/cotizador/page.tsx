import React from 'react';
import { Metadata } from 'next';
import { Sparkles, Cpu, Box } from 'lucide-react';
import Link from 'next/link';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { MultiPricer } from '@/features/finance/ui/MultiPricer';

export const metadata: Metadata = {
  title: 'Cotizador Inteligente S-Class & Price-Lock 72h | Productora EAR',
  description: 'Calculadora paramétrica de alta fidelidad, diagnóstico acústico 12 W/pax, equipamiento audiovisual y Price-Lock 72h con tarifas reales verificadas.',
};

export default function CotizadorPage() {
  return (
    <MeshGradientBackground intensity="stage">
      <main className="min-h-screen pt-28 sm:pt-32 pb-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Hero Unificado */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(236,182,19,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
              NEURO-FUNNEL S-CLASS // EAR OS REVENUE ENGINE
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
              TÚNEL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white italic">COTIZACIÓN INTELIGENTE</span>
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              Configura tu evento, calibra la acústica (12 W/pax), añade hardware audiovisual del Arsenal y asegura tu fecha con <strong className="text-white">Price-Lock 72h SHA-256</strong>.
            </p>

            {/* Quick Navigation Tabs */}
            <div className="flex items-center justify-center pt-2">
              <div className="inline-flex p-1.5 bg-[#0a0a0f] border border-white/10 rounded-2xl gap-2 backdrop-blur-md">
                <Link
                  href="/presupuesto"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Matcher</span>
                </Link>
                <div className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-2 font-syne">
                  <Cpu size={14} />
                  <span>Cotizador Unificado</span>
                </div>
                <Link
                  href="/arsenal"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Box size={14} />
                  <span>Arsenal Técnico</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 💰 Motor Central Unificado MultiPricer S-Class */}
          <div className="relative z-10">
            <MultiPricer />
          </div>

        </div>
      </main>
    </MeshGradientBackground>
  );
}

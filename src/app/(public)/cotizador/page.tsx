import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, SlidersHorizontal, Cpu, Flame, Box, ArrowRight, Camera, Tv, Gamepad2, Volume2, ShieldCheck, Check } from 'lucide-react';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { NeuroFunnelSClass } from '@/components/sclass/NeuroFunnelSClass';
import { MultiPricer } from '@/features/finance/ui/MultiPricer';

export const metadata: Metadata = {
  title: 'Cotizador S-Class & Neuro-Funnel Acústico | Productora EAR',
  description: 'Arquitectura de costes de alta fidelidad, diagnóstico acústico 12 W/pax, equipamiento audiovisual y Price-Lock 72h con tarifas reales verificadas.',
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
              Selecciona tu tipo de evento, diagnostica tus requerimientos acústicos (12 W/pax), añade equipamiento audiovisual del <strong className="text-[#ecb613]">Arsenal Técnico</strong> y obtén tu propuesta formal con <strong className="text-white">Price-Lock 72h SHA-256</strong>.
            </p>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center pt-2">
              <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl gap-2 backdrop-blur-md">
                <Link
                  href="/presupuesto"
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Matcher</span>
                </Link>
                <div className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-2">
                  <Cpu size={14} />
                  <span>Neuro-Funnel</span>
                </div>
                <Link
                  href="/arsenal"
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Box size={14} />
                  <span>El Arsenal Técnico</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 🧠 Core Neuro-Funnel Component */}
          <NeuroFunnelSClass />

          {/* 📦 Arsenal Hub Cross-Section */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0a0a0f] border border-[#ecb613]/30 relative overflow-hidden space-y-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                  <Box size={14} />
                  <span>Stock Central Madrid // Despliegue Inmediato</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                  Equipamiento Audiovisual & <span className="text-[#ecb613]">El Arsenal</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/60 max-w-xl">
                  Integra pantallas LED, fotomatón 360º, sonido RCF, monitores 4K y simuladores en tu evento con montaje certificado y asistencia técnica in situ.
                </p>
              </div>

              <Link
                href="/arsenal"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ecb613] hover:bg-[#d9a40e] text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all font-syne shadow-lg shadow-[#ecb613]/20 self-start md:self-auto shrink-0"
              >
                <span>Explorar Catálogo Completo</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span className="flex items-center gap-1.5 text-[#ecb613]"><Camera size={14} /> Fotomatón</span>
                  <span className="text-white font-bold">390€ / 3h</span>
                </div>
                <h4 className="text-xs font-black uppercase text-white font-syne">Fotomatón 360º Slow-Motion</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Plataforma giratoria con iPad Pro, atrezo divertido y descarga QR instantánea.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span className="flex items-center gap-1.5 text-blue-400"><Tv size={14} /> Gran Formato</span>
                  <span className="text-white font-bold">450€ / día</span>
                </div>
                <h4 className="text-xs font-black uppercase text-white font-syne">Monitores 98" y 85" 4K</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Pantallas gigantes profesionales antirreflejos con soporte de pie para galas y ferias.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span className="flex items-center gap-1.5 text-purple-400"><Gamepad2 size={14} /> Gaming & VR</span>
                  <span className="text-white font-bold">380€ / día</span>
                </div>
                <h4 className="text-xs font-black uppercase text-white font-syne">Simuladores F1 & Meta Quest 3</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Cockpits con volante Force Feedback Fanatec y gafas VR inalámbricas para eventos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span className="flex items-center gap-1.5 text-emerald-400"><Volume2 size={14} /> Audio & Luces</span>
                  <span className="text-white font-bold">130€ / día</span>
                </div>
                <h4 className="text-xs font-black uppercase text-white font-syne">Sonido RCF 2.800W & Robótica</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Altavoces autoamplificados, microfonía Shure y cabezas móviles Beam/Wash.
                </p>
              </div>
            </div>
          </div>

          {/* 📊 MultiPricer Modular Fallback */}
          <div className="pt-8 border-t border-white/10 space-y-6">
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

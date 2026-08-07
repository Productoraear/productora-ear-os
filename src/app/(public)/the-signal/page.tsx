import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Sparkles, ArrowRight, Zap, Play } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Signal | Inmersión Táctica & Solvencia Escénica | Productora EAR',
  description: 'Inmersión profunda en la infraestructura, sonido de alta definición y contratos de garantía de Productora EAR.',
};

export default function TheSignalPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-6 relative overflow-hidden selection:bg-[#d4a855]/30">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#d4a855]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[#d4a855]">
            <Sparkles size={14} className="animate-spin" />
            <span>ACCESO EXCLUSIVO // INMERSIÓN DE SOLVENCIA</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold uppercase italic tracking-tight text-white">
            THE <span className="text-[#d4a855]">SIGNAL</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            La frecuencia donde confluyen la ingeniería logística de eventos, la acústica impecable y la garantía contractual inquebrantable.
          </p>
        </div>

        {/* Tactical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#d4a855]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d4a855]/10 flex items-center justify-center text-[#d4a855]">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white">Blindaje Contractual</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Respaldo legal total, seguro de responsabilidad civil de alta cobertura y sustitución inmediata ante contingencias.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#d4a855]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d4a855]/10 flex items-center justify-center text-[#d4a855]">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white">Rider Técnico Zero-Fail</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Equipamiento inalámbrico de élite, microfonía Shure Axient Digital y mezcla de monitores de latencia ultrabaja.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#d4a855]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d4a855]/10 flex items-center justify-center text-[#d4a855]">
              <Play size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white">Experiencia Inmersiva</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dirección artística a medida, arreglos musicales originales y un impacto emocional indeleble para tus invitados.
            </p>
          </div>
        </div>

        {/* CTA Conversion Box */}
        <div className="p-10 bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-[#d4a855]/30 rounded-3xl text-center space-y-8 shadow-2xl">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold uppercase italic tracking-tight text-white">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-xs text-zinc-400 uppercase tracking-widest">
              Conecta con nuestro motor de cotización o accede al centro de mando.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/presupuesto"
              className="w-full sm:w-auto px-8 py-4 bg-[#d4a855] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,168,85,0.2)] flex items-center justify-center gap-3"
            >
              Iniciar Cotización <ArrowRight size={16} />
            </Link>
            <Link
              href="/centro-mando"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all"
            >
              Acceso Centro de Mando
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

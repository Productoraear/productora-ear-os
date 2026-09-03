import React from 'react';
import { Metadata } from 'next';
import { SClassPricingTerminal } from '@/components/pricing/SClassPricingTerminal';
import { EdwinLegacyPlayer } from '@/features/artists/ui/EdwinLegacyPlayer';
import { Mic2, Star, ShieldCheck, Award, Sparkles, Music, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edwin Agudelo | Tenor Lírico, Mariachi de Gala & Paciente Cero S-Class',
  description: 'Contratación oficial de Edwin Agudelo para bodas, serenatas de gala y eventos institucionales. Sonorización Bose F1 12 W/pax, Price-Lock SHA-256 y split soberano 80/10/10.',
};

export default function EdwinAgudeloPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-28 pb-28 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-widest uppercase mb-4">
                <Sparkles size={14} />
                <span>PACIENTE CERO S-CLASS // TENOR LÍRICO DE GALA</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[1.05]">
                Edwin <span className="text-[#ecb613] italic">Agudelo</span>
              </h1>
              <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-xl font-light mt-4">
                Tenor lírico, cantante y compositor con más de 25 años de trayectoria y oficio real sobre los escenarios. Traje de gala con botonadura de plata y producción técnica de alta fidelidad. Garantía de cero fallos acústicos para bodas, serenatas exclusivas y recepciones de Estado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0e0e14] border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:border-[#ecb613]/40 transition-colors shadow-lg">
                <Star className="text-[#ecb613] shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-sm text-white font-syne uppercase tracking-wider">5.0 / 5 Verificado</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Satisfacción auditada en bodas y eventos premium en España.</p>
                </div>
              </div>
              <div className="bg-[#0e0e14] border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:border-[#ecb613]/40 transition-colors shadow-lg">
                <Mic2 className="text-[#ecb613] shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-sm text-white font-syne uppercase tracking-wider">Presión 12 W/PAX</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Sistemas Bose F1 & Microfonía Shure Axient Digital.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400">
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">Seguro RC 1.000.000 €</span>
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">Split Soberano 80%</span>
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">Price-Lock SHA-256</span>
            </div>
          </div>

          <div className="w-full flex justify-center lg:justify-end">
            <SClassPricingTerminal />
          </div>
        </div>

        {/* 🎵 Jukebox Multimedia S-Class de Edwin Agudelo */}
        <section className="space-y-6 pt-8 border-t border-white/10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold">
              BÓVEDA DE AUTOR & AUDICIÓN EN VIVO
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
              Discografía, Vídeos & <span className="text-[#ecb613]">Lírica en Directo</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Explora y reproduce las interpretaciones maestras de Edwin Agudelo. Desde bachata urbana de autor hasta clásicos rancheros en directo.
            </p>
          </div>

          <EdwinLegacyPlayer />
        </section>

      </div>
    </main>
  );
}

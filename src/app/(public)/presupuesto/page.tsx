import React from 'react';
import { Metadata } from 'next';
import TinderMatcherClient from '@/app/components/public/TinderMatcherClient';

export const metadata: Metadata = {
  title: 'Cotizador Inteligente & Matcher S-Class | Productora EAR',
  description: 'Sistema interactivo de cotización en tiempo real, perfilado de eventos y matching de artistas de alta gama.',
};

export default function PresupuestoPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4a855]/10 border border-[#d4a855]/30 rounded-full text-[#d4a855] text-xs font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#d4a855] animate-ping" />
            Motor Táctico de Cotización // v2.1
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase italic tracking-tighter text-white">
            DISEÑA TU <span className="text-[#d4a855]">EXPERIENCIA</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
            Descubre el formato escénico perfecto mediante nuestro recomendador inteligente o utiliza la pasarela de presupuesto rápido para eventos de alta solvencia.
          </p>
        </div>

        {/* Dynamic Matcher Component */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a855]/5 rounded-full blur-3xl pointer-events-none" />
          <TinderMatcherClient />
        </div>
      </div>
    </main>
  );
}

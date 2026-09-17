"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Globe, ShieldCheck, Zap, Music } from 'lucide-react';
import MariachiDispatchConsole from '@/components/mariachi/MariachiDispatchConsole';

export default function MariachisMainPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
      {/* HERO SECTION */}
      <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-24 border-b border-white/5">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[#ecb613]/10 blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
              <Sparkles size={13} />
              RED OFICIAL DE MARIACHIS // EAR OS S-CLASS
            </div>

            <Link
              href="/mariachis/unirse"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-wider text-white transition-all"
            >
              <Globe size={13} className="text-[#ecb613]" />
              ¿Eres Mariachi? Únete a la Red Mundial
            </Link>
          </div>

          <h1 className="font-syne text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            Contrata Tu Mariachi <br />
            <span className="text-[#ecb613]">Con Precio Cerrado</span> y Despacho Uber
          </h1>

          <p className="max-w-3xl text-sm sm:text-base md:text-lg text-white/60 font-sans leading-relaxed">
            Sin presupuestos inflados ni esperas de días. Selecciona tu formato, calcula la distancia exacta desde la sede más cercana a tu finca o domicilio y asegura tu fecha al instante con un depósito de 100 € en Stripe.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-white/50">
            <span className="flex items-center gap-2 text-white">
              <ShieldCheck size={16} className="text-[#ecb613]" /> Traje de charro de gala impecable
            </span>
            <span className="flex items-center gap-2 text-white">
              <Zap size={16} className="text-[#00E5FF]" /> Despacho en &lt; 50 ms
            </span>
            <span className="flex items-center gap-2 text-white">
              <Music size={16} className="text-emerald-400" /> Acústica garantizada
            </span>
          </div>
        </div>
      </section>

      {/* CONSOLA TRANSACCIONAL PRINCIPAL */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <MariachiDispatchConsole />
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="border-t border-white/5 py-16 bg-[#050508] text-center px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-syne uppercase text-white">
            ¿Tienes dudas o buscas una fecha urgente?
          </h2>
          <p className="text-xs sm:text-sm text-white/50 font-sans">
            Nuestra centralita opera 24/7 para serenatas nocturnas, sorpresas y bodas en toda España y sedes internacionales.
          </p>
          <div className="pt-4">
            <a
              href="https://wa.me/34693693048?text=Hola,%20deseo%20consultar%20disponibilidad%20de%20mariachis%20con%20EAR%20OS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              Hablar con Coordinación Artística (+34 693 693 048)
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
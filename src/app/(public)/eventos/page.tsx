'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Target, 
  Zap, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Phone,
  Megaphone,
  Compass
} from 'lucide-react';
import CategoryRouter from '@/features/discovery/CategoryRouter';
import { CENTRALITA } from '@/lib/phone-constants';

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-4 md:px-8 font-sans selection:bg-[#ecb613]/30">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-[#ecb613]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* 1. HERO SECTION: INGENIERÍA DE EXPERIENCIAS */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase font-mono">
            <Sparkles size={14} className="animate-spin" />
            <span>Ingeniería de Experiencias</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white font-syne leading-[0.9]">
            Eventos 360 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">de Autor</span>
          </h1>

          <p className="text-white/70 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            No solo organizamos eventos; creamos hitos inolvidables. Cubrimos desde la idea inicial hasta la medición de resultados.
          </p>

          <div className="flex flex-wrap justify-center gap-8 pt-4 text-xs font-mono font-bold text-white/40 uppercase tracking-widest border-y border-white/5 py-6">
            <span>Presión Acústica 12 W/pax</span>
            <span>•</span>
            <span>Protocolo Plan B Redundante</span>
            <span>•</span>
            <span>Garantía por Escrito</span>
          </div>
        </section>

        {/* 2. PRICING CARD & CONVOCATORIA 2026 GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* BLOQUE DE PRODUCCIÓN DE ALTO NIVEL (3000€) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-[2.5rem] bg-[#0a0a0f] border border-[#ecb613]/30 flex flex-col justify-between space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-[#ecb613]">
              <Compass size={120} />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono border border-[#ecb613]/20">
                  Producción de Alto Nivel
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Estándar S-Class
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black text-white font-syne">€3000</span>
                <span className="text-xs sm:text-sm font-bold text-white/50 uppercase tracking-widest">/ Pago Único (Base)</span>
              </div>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed italic border-l-2 border-[#ecb613] pl-4">
                "Nuestra visión nos impide hacer un 'copia y pega'. Creamos experiencias inolvidables con garantía de resultados por escrito."
              </p>

              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#ecb613]/10 text-[#ecb613] shrink-0">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase">Planificación Total</h4>
                    <p className="text-xs text-white/50 mt-0.5">Diseño conceptual y logística integral de proveedores homologados.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#ecb613]/10 text-[#ecb613] shrink-0">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase">Campañas Ads</h4>
                    <p className="text-xs text-white/50 mt-0.5">Promoción estratégica para garantizar el aforo y el impacto mediático.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 relative z-10">
              <a
                href={CENTRALITA.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-[0.25em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                <Calendar size={16} />
                <span>Agenda cita de 30 min sin compromiso</span>
              </a>
            </div>
          </div>

          {/* LA SELECCIÓN: CONVOCATORIA 2026 */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-b from-[#0e0e14] to-[#08080c] border border-white/10 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#ecb613]">
                <Clock size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Fase de Acceso Prioritario</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-syne leading-tight">
                  LA SELECCIÓN:<br/>
                  <span className="text-[#ecb613]">CONVOCATORIA 2026</span>
                </h3>
                <p className="text-xs text-white/60 mt-3 leading-relaxed">
                  No buscamos participantes, buscamos a la próxima generación de artistas de élite.
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Calendar size={14} className="text-[#ecb613]" /> Fecha
                  </span>
                  <span className="text-sm font-black text-white font-mono">15 Ene 2026</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Clock size={14} className="text-[#ecb613]" /> Hora
                  </span>
                  <span className="text-sm font-black text-white font-mono">09:00</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <MapPin size={14} className="text-[#ecb613]" /> Ubicación
                  </span>
                  <span className="text-sm font-black text-[#ecb613] font-mono">Sede Central EAR, Toledo</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/the-signal"
                className="w-full py-4.5 bg-white/10 hover:bg-[#ecb613] hover:text-black border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <span>Postular a Convocatoria</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </section>

        {/* 3. DISCOVERY ENGINE (PROVEEDORES HOMOLOGADOS) */}
        <section className="pt-10">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
              Infraestructura y Ecosistema
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
              Catálogo de Especialistas Homologados
            </h2>
          </div>
          
          <CategoryRouter type="V1" />
        </section>

      </div>
    </main>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Settings, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  ChevronDown, 
  Mic2, 
  Lightbulb, 
  Layout as LayoutIcon, 
  Radio, 
  MapPin, 
  Phone, 
  Globe, 
  CheckCircle2,
  Cpu,
  Trophy
} from 'lucide-react';
import { THEME, GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: ARCHITECTURE & ENGINEERING (S-Class V2.4)
 * Full Responsive Senior High-End Architecture.
 * Standardized HUD & Strategic Hero.
 */

interface ArchitectureEngineeringProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function ArchitectureEngineering({ onNavigate, hideHeader }: ArchitectureEngineeringProps) {
  return (
    <div className="bg-[#221d10] text-white font-montserrat selection:bg-[#ecb613] selection:text-[#221d10] w-full min-h-screen overflow-x-hidden relative">
      

      <main className={`max-w-7xl mx-auto space-y-24 md:space-y-40 pb-32 ${hideHeader ? 'pt-12 md:pt-24' : ''}`}>
        {/* 1. HERO STRATEGIC SECTION */}
        <section className="relative aspect-[3/4] md:aspect-[21/9] flex flex-col justify-center items-center p-6 md:p-12 overflow-hidden md:rounded-b-[80px] border-b border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-20 grayscale scale-105"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2070")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-[#221d10]/60 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center items-center flex flex-col space-y-8"
          >
            <span className="px-5 py-2 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl">
               Producción 360 // S-Class Level
            </span>
             <h1 className="text-[clamp(2rem,10vw,8rem)] font-cinzel font-black tracking-tighter uppercase leading-[1] md:leading-[0.9] text-balance">
                Arquitectura <br />
                <span className="gold-text italic font-serif normal-case">& Ingeniería.</span>
             </h1>
            <p className="text-sm md:text-xl lg:text-2xl text-white/40 font-medium italic max-w-2xl leading-relaxed text-balance px-4 md:px-0">
               Construimos la <span className="text-white font-bold">infraestructura invisible</span> donde la técnica desaparece para que el talento brille.
            </p>
          </motion.div>
        </section>

        {/* 2. METRICS HUD */}
        <section className="px-4 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-24 items-center">
          {[
            { label: 'Años de Blindaje', val: '15+', sub: 'Experiencia Real' },
            { label: 'Eventos Proyectados', val: '500+', sub: 'Éxitos S-Class' },
            { label: 'Equipos Técnicos', val: '1000+', sub: 'Arsenal Propio' }
          ].map((m, i) => (
            <div key={i} className="text-center group border-b sm:border-b-0 sm:border-r border-white/5 last:border-0 pb-8 sm:pb-0">
              <span className="block text-5xl md:text-8xl font-black text-white group-hover:text-gold-500 mb-1 transition-all">{m.val}</span>
              <span className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/30">{m.label}</span>
              <span className="block text-[8px] md:text-[9px] font-bold uppercase text-gold-500/20 mt-1 italic tracking-widest">{m.sub}</span>
            </div>
          ))}
        </section>

        {/* 3. MAIN PILLARS GRID */}
        <section className="px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Card 1: Ingenieria (Corporativo) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`flex flex-col ${GLASS_STYLE} ${GOLD_HUD_STYLE} rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group border border-white/5`}
          >
            <div className="aspect-video bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2012")' }} />
            <div className="p-10 md:p-14 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic serif gold-text">La Ingeniería</h3>
                <span className="px-4 py-2 bg-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase rounded-full border border-primary/20">B2B UNIT</span>
              </div>
              <p className="text-sm md:text-xl text-white/30 font-medium italic leading-relaxed text-balance">
                Soluciones técnicas de precisión. Audio, iluminación y estructura para eventos corporativos de alto nivel. Elevamos el estándar operativo.
              </p>
              <button 
                onClick={() => onNavigate?.('contact')}
                className="w-full py-6 md:py-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-4 font-black uppercase text-[10px] md:text-xs tracking-[0.3em]"
              >
                PROTOCOL SOLUCIONES <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Arquitectura (Artistas) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`flex flex-col ${GLASS_STYLE} ${GOLD_HUD_STYLE} rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group border border-white/5`}
          >
            <div className="aspect-video bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=2070")' }} />
            <div className="p-10 md:p-14 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic serif gold-text">La Arquitectura</h3>
                <span className="px-4 py-2 bg-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase rounded-full border border-primary/20">TALENT UNIT</span>
              </div>
              <p className="text-sm md:text-xl text-white/30 font-medium italic leading-relaxed text-balance">
                Diseño de espacios y momentos. Gestión de talento y booking estratégico para experiencias memorables que trascienden el tiempo.
              </p>
              <button 
                onClick={() => onNavigate?.('artists')}
                className="w-full py-6 md:py-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-4 font-black uppercase text-[10px] md:text-xs tracking-[0.3em]"
              >
                CATÁLOGO TALENTO <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* 4. TRUST ARCHITECTURE TIMELINE */}
        <section className="px-4 md:px-12">
          <div className="p-10 md:p-24 rounded-[3rem] md:rounded-[5rem] bg-black/40 border border-white/5 shadow-3xl">
            <div className="text-center mb-16 md:mb-32 space-y-4">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.6em]">Process of Excellence</span>
              <h2 className="text-3xl md:text-7xl font-black tracking-tighter uppercase italic serif gold-text">Trust Architecture.</h2>
            </div>

            <div className="space-y-12 md:space-y-24 max-w-5xl mx-auto">
              {[
                { id: '01', title: 'Planos', desc: 'Diseño técnico y logístico. Nada se deja al azar antes del montaje. Simulaciones 3D y planos de carga.', icon: LayoutIcon },
                { id: '02', title: 'Ejecución', desc: 'Implementación rigurosa con equipos S-Class de última generación. Personal certificado y blindado.', icon: Settings },
                { id: '03', title: 'Auditoría', desc: 'Control de calidad y revisión post-evento para blindar la mejora continua. Transparencia total.', icon: ShieldCheck }
              ].map((phase, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-20 group relative">
                   {i < 2 && <div className="absolute left-7 top-14 bottom-[-60px] w-px bg-primary/10 hidden md:block" />}
                   <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/5 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all flex-shrink-0 z-10 shadow-2xl">
                      <phase.icon size={24} className="md:w-8 md:h-8" />
                   </div>
                   <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Fase {phase.id}</span>
                        <div className="h-px bg-white/5 flex-1" />
                      </div>
                      <h4 className="text-2xl md:text-5xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors">{phase.title}</h4>
                      <p className="text-sm md:text-xl text-white/30 leading-relaxed font-medium italic text-balance max-w-2xl">
                         {phase.desc}
                      </p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ARSENAL PREVIEW */}
        <section className="px-4 md:px-12 space-y-12 md:space-y-24">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter leading-none italic serif gold-text">El Arsenal.</h2>
                <p className="text-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">Tecnología de Vanguardia</p>
              </div>
              <button 
                onClick={() => onNavigate?.('arsenal')}
                className="group flex items-center gap-4 text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.4em] border-b-2 border-primary/20 pb-2 hover:gap-8 transition-all"
              >
                EXPLORAR INVENTARIO <ArrowRight size={18} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: 'Acoustic Mastery', desc: 'Calibración sónica adaptativa para recintos complejos.', icon: Radio },
                { title: 'Luminous Flow', desc: 'Sincronización lumínica emocional en tiempo real.', icon: Lightbulb },
                { title: 'Stage Logic', desc: 'Gestión logística modular para escenarios dinámicos.', icon: Cpu }
              ].map((sys, i) => (
                <div key={i} className={`p-10 md:p-14 ${GLASS_STYLE} ${GOLD_HUD_STYLE} rounded-[2rem] md:rounded-[3rem] hover:bg-gold-500/5 transition-all group border border-white/5 shadow-xl flex flex-col items-center text-center`}>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 border border-primary/10 group-hover:bg-primary group-hover:text-black transition-all">
                    <sys.icon size={24} className="md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">{sys.title}</h3>
                  <p className="text-xs md:text-base text-white/30 leading-relaxed font-medium italic">{sys.desc}</p>
                </div>
              ))}
           </div>
        </section>

      </main>


    </div>
  );
}

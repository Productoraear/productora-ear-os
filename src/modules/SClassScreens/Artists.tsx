'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brush, 
  Workflow, 
  Gavel, 
  Play, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight, 
  Star,
  Music,
  UserCheck,
  Globe2,
  ChevronDown,
  Brain,
  Shirt,
  Users,
  Verified,
  Zap
} from 'lucide-react';
import { THEME, GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';
import ArtistsCalculators from './ArtistsCalculators';

/**
 * 🛰️ MODULE: ARTISTS (S-Class v3.0)
 * Talent Transformation & Elite Management.
 * Full Responsive Senior High-End Interface.
 */

interface ArtistsProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function Artists({ onNavigate, hideHeader }: ArtistsProps) {
  const [view, setView] = useState<'marketing' | 'calculators'>('marketing');
  const benefits = [
    { title: 'Mentalidad', desc: 'Psicología del éxito y control de carrera.', icon: Brain },
    { title: 'Branding', desc: 'Identidad visual y narrativa única.', icon: Brush },
    { title: 'Networking', desc: 'Conexiones directas con sellos y festivales.', icon: Globe2 },
    { title: 'Legal', desc: 'Gestión de derechos y contratos blindados.', icon: Gavel },
    { title: 'Merching', desc: 'Diseño y monetización de productos.', icon: Shirt },
    { title: 'Fans', desc: 'Estrategia de crecimiento de comunidad.', icon: Users },
  ];

  const methodology = [
    { step: '01', title: 'Diagnóstico 360°', desc: 'Evaluamos su posición actual y potencial.' },
    { step: '02', title: 'Estrategia', desc: 'Definimos su sonido, su imagen y su plan.' },
    { step: '03', title: 'Producción', desc: 'Grabación y contenido audiovisual high-end.' },
    { step: '04', title: 'Escalabilidad', desc: 'Giras y expansión internacional.' },
  ];

  if (view === 'calculators') {
    return (
      <div className="relative">
        <button 
          onClick={() => setView('marketing')}
          className="absolute top-12 left-12 z-[100] p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Volver a Visión General
        </button>
        <ArtistsCalculators />
      </div>
    );
  }

  return (
    <div className="bg-[#221d10] text-white font-montserrat selection:bg-[#ecb613] selection:text-[#221d10] w-full min-h-screen overflow-x-hidden relative">
      

      <main className={`max-w-7xl mx-auto space-y-24 md:space-y-48 pb-32 ${hideHeader ? 'pt-12 md:pt-24' : ''}`}>
        
        {/* 1. CINEMATIC HERO */}
        <section className="relative aspect-[3/4] md:aspect-[21/9] flex flex-col justify-end p-6 md:p-20 overflow-hidden md:rounded-b-[80px] border-b border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center grayscale opacity-30 scale-105"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514525253361-bee8a48740ad?auto=format&fit=crop&q=80&w=1920")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-transparent to-[#1a1510]/60" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 space-y-8 md:space-y-12 max-w-5xl"
          >
            <span className="px-5 py-2 md:px-8 md:py-3 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[11px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl inline-block shadow-2xl">
               Talent Transformation // S-Class
            </span>
            <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-cinzel font-black tracking-tighter uppercase leading-[0.85] text-balance">
              Del Talento <br /> <span className="gold-text italic font-serif normal-case">Al Activo Real.</span>
            </h1>
            <p className="text-base md:text-2xl lg:text-3xl text-white/30 font-medium italic max-w-2xl leading-relaxed text-balance">
              No gestionamos artistas; construimos legados técnicos y comerciales indestructibles.
            </p>
          </motion.div>
        </section>

        {/* 2. BENEFITS GRID */}
        <section className="px-4 md:px-12 space-y-12 md:space-y-24">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {benefits.map((b, i) => (
                <div key={i} className={`p-10 md:p-14 rounded-[3rem] md:rounded-[4rem] ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 flex flex-col gap-8 group hover:border-primary/20 transition-all shadow-3xl`}>
                   <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <b.icon size={28} />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-xl md:text-2xl font-cinzel font-black uppercase tracking-tight group-hover:text-primary transition-colors">{b.title}</h3>
                      <p className="text-sm md:text-lg text-white/30 font-medium italic leading-relaxed">{b.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* 3. METHODOLOGY (Timeline) */}
        <section className="px-4 md:px-12 space-y-12 md:space-y-24">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
              <h2 className="text-3xl md:text-7xl font-cinzel font-black uppercase tracking-tighter gold-text italic serif normal-case">Metodología.</h2>
              <p className="text-sm md:text-xl text-white/20 italic max-w-md">Un proceso de cuatro fases diseñado para la dominación del mercado.</p>
           </div>
           
           <div className="grid gap-12 md:gap-24">
              {methodology.map((m, i) => (
                <div key={i} className="flex gap-8 md:gap-16 items-start group">
                   <span className="text-4xl md:text-8xl font-black text-white/5 group-hover:text-primary/20 transition-colors leading-none">{m.step}</span>
                   <div className="space-y-4 pt-2 md:pt-6">
                      <h4 className="text-xl md:text-4xl font-cinzel font-black uppercase tracking-tighter group-hover:gold-text transition-all">{m.title}</h4>
                      <p className="text-sm md:text-2xl text-white/30 italic font-medium max-w-3xl leading-relaxed">{m.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* 4. DIGITAL SOVEREIGNTY (Fusionado de Stitch) */}
        <section className="px-4 md:px-12 pb-32">
           <div className={`p-10 md:p-20 rounded-[3rem] md:rounded-[5.5rem] ${GLASS_STYLE} bg-primary/5 border border-primary/10 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-primary">
                 <Globe2 size={400} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 relative z-10">
                 <div className="space-y-8 md:space-y-12">
                    <span className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">Command Center Sync</span>
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-balance">Soberanía <br /><span className="gold-text italic serif normal-case">Digital Total.</span></h2>
                    <p className="text-lg md:text-2xl text-white/40 italic font-medium leading-relaxed text-balance">
                      Integramos métricas de Spotify, RRSS y Venta de Tickets en un único panel de control de carrera. El artista recupera el poder de sus datos.
                    </p>
                    <div className="flex flex-wrap gap-6">
                       {['Spotify API', 'Instagram Insight', 'Apple Music', 'Ticketmaster'].map((api, i) => (
                         <div key={i} className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#ecb613]">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> {api}
                         </div>
                       ))}
                    </div>
                    
                    <button 
                        onClick={() => setView('calculators')}
                        className="mt-8 px-10 py-5 bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:brightness-110 transition-all shadow-[0_20px_40px_rgba(236,182,19,0.2)] flex items-center gap-4 group"
                    >
                        Acceder a Financial Engineering <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-6 md:gap-8">
                    {[
                      { label: 'Impacto Global', val: '4.2M', sub: 'Oídos Únicos' },
                      { label: 'Conversión', val: '12%', sub: 'Ticket Sales' },
                      { label: 'Retención', val: '88%', sub: 'Fan Loyalty' },
                      { label: 'Sync Score', val: '9.8', sub: 'S-Class Rating' },
                    ].map((stat, i) => (
                      <div key={i} className="p-8 md:p-12 rounded-[2rem] bg-black/40 border border-white/5 space-y-4 hover:border-primary/30 transition-all group/stat">
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/stat:text-primary transition-colors">{stat.label}</p>
                         <p className="text-4xl md:text-6xl font-black tracking-tighter gold-text">{stat.val}</p>
                         <p className="text-[9px] font-bold text-white/5 uppercase italic tracking-widest">{stat.sub}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>


      </main>


    </div>
  );
}

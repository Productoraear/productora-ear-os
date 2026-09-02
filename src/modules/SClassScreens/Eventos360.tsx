'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  PlayCircle, 
  Calculator, 
  Diamond, 
  Building2, 
  Store, 
  PartyPopper,
  Mail,
  ArrowRight,
  Zap,
  Star,
  Camera
} from 'lucide-react';
import { THEME, GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: EVENTOS 360 (S-Class v3.0)
 * High-End Production Architecture.
 * Full Responsive Senior High-End Interface.
 */

interface Eventos360Props {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function Eventos360({ onNavigate, hideHeader }: Eventos360Props) {
  const categories = [
    { title: 'Bodas Elite', icon: Diamond, sub: 'Momentos Atemporales' },
    { title: 'Corporativos', icon: Building2, sub: 'Excelencia Institucional' },
    { title: 'Expos & Ferias', icon: Store, sub: 'Impacto en IFEMA' },
    { title: 'Privados Tier 1', icon: PartyPopper, sub: 'Exclusividad Total' },
  ];

  const portfolio = [
    {
      title: 'Boda en la Finca',
      desc: 'Despliegue de audio inmersivo y diseño lumínico arquitectural para 400 invitados.',
      tag: 'BODAS',
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070'
    },
    {
      title: 'Tech Summit 2024',
      desc: 'Ingeniería de pantallas LED y realización multi-cámara en tiempo real.',
      tag: 'CORPORATIVO',
      img: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=2070'
    }
  ];

  return (
    <div className="bg-[#221d10] text-white font-montserrat selection:bg-[#ecb613] selection:text-[#221d10] w-full min-h-screen overflow-x-hidden relative">
      

      <main className={`max-w-7xl mx-auto space-y-24 md:space-y-48 pb-32 ${hideHeader ? 'pt-12 md:pt-24' : 'pt-4 md:pt-0'}`}>
        
        {/* 1. CINEMATIC HERO */}
        <section className="relative aspect-[3/4] md:aspect-[21/9] flex flex-col justify-end p-6 md:p-20 overflow-hidden md:rounded-b-[80px] border-b border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center grayscale opacity-30 scale-105 transition-all duration-[3s]"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-[#1a1510]/40 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 space-y-8 md:space-y-12 max-w-5xl"
          >
            <span className="px-5 py-2 md:px-8 md:py-3 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[11px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl inline-block shadow-2xl">
               Ingeniería de Espectáculo // S-Class
            </span>
            <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-cinzel font-black tracking-tighter uppercase leading-[0.85] text-balance">
              Producción <br /> <span className="gold-text italic font-serif normal-case">Sin Límites.</span>
            </h1>
            <div className="flex gap-4 md:gap-8 pt-4">
               <button className="h-14 md:h-18 px-10 md:px-14 bg-primary text-black text-[9px] md:text-sm font-black uppercase tracking-[0.3em] rounded-xl md:rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all">SHOWREEL 2024</button>
               <button className="h-14 md:h-18 px-10 md:px-14 border border-white/10 text-white/40 text-[9px] md:text-sm font-black uppercase tracking-[0.3em] rounded-xl md:rounded-2xl hover:bg-white/5 transition-all">PORTFOLIO</button>
            </div>
          </motion.div>
        </section>

        {/* 2. CATEGORIES HUD (Horizontal Scroll on Mobile) */}
        <section className="px-4 md:px-12 space-y-12 md:space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-4">
               <span className="text-primary text-[9px] md:text-xs font-black uppercase tracking-[0.6em] block">Nuestras Verticales</span>
               <h2 className="text-3xl md:text-7xl font-cinzel font-black uppercase tracking-tighter leading-none italic font-serif gold-text">Especialidades.</h2>
            </div>
            <p className="text-xs md:text-xl text-white/30 font-medium italic max-w-sm">Cuatro pilares de ejecución impecable adaptados a su visión.</p>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-8">
             {categories.map((cat, i) => (
               <div key={i} className={`snap-center flex-shrink-0 w-[280px] md:w-full p-10 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 flex flex-col items-center text-center gap-8 group hover:border-primary/20 transition-all shadow-3xl`}>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-black transition-colors">
                     <cat.icon size={28} className="md:w-10 md:h-10" />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-lg md:text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{cat.title}</h4>
                     <p className="text-[9px] md:text-xs font-bold text-white/20 uppercase tracking-widest italic">{cat.sub}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* 3. QUOTE WIDGET (UX High-Fidelity) */}
        <section className="px-4 md:px-12">
           <div className={`p-10 md:p-24 rounded-[3.5rem] md:rounded-[6rem] bg-gradient-to-br from-primary/10 via-black/40 to-transparent border border-primary/20 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden group shadow-4xl`}>
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="space-y-8 text-center lg:text-left relative z-10 lg:w-3/5">
                 <div className="flex items-center justify-center lg:justify-start gap-4">
                    <Calculator className="text-primary w-10 h-10 md:w-16 md:h-16" />
                    <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none">Smart <br /> <span className="gold-text italic serif normal-case">Calculator.</span></h3>
                 </div>
                 <p className="text-base md:text-2xl text-white/40 font-medium italic leading-relaxed text-balance">Calibre el despliegue técnico de su producción en segundos con nuestro algoritmo de auditoría en tiempo real.</p>
              </div>
              
              <div className="relative z-10 w-full lg:w-auto">
                 <button className="w-full lg:w-auto h-20 md:h-28 px-16 md:px-24 rounded-[2rem] md:rounded-full bg-primary text-black font-black uppercase text-xs md:text-xl tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 flex items-center justify-center gap-6">
                    INICIAR CÁLCULO <ArrowRight size={28} />
                 </button>
              </div>
           </div>
        </section>

        {/* 4. PORTFOLIO GRID */}
        <section className="px-4 md:px-12 space-y-24 md:space-y-48">
           <div className="text-center space-y-6">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Select Case Studies</span>
              <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-cinzel font-black uppercase tracking-tighter leading-none">Impacto <br /> <span className="gold-text italic font-serif normal-case">Realizado.</span></h2>
           </div>

           <div className="grid gap-24 md:gap-40">
              {portfolio.map((item, i) => (
                <motion.div 
                  key={i}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 50 }}
                  className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 md:gap-24 items-center group`}
                >
                   <div className="w-full lg:w-3/5 aspect-video md:aspect-[21/10] overflow-hidden rounded-[3rem] md:rounded-[5rem] border border-white/5 relative shadow-4xl">
                      <img 
                        src={item.img} 
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]" 
                        alt={item.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-xl border border-primary/20 text-primary text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-widest">{item.tag}</div>
                   </div>
                   <div className="w-full lg:w-2/5 space-y-8 md:space-y-12 text-center lg:text-left">
                      <div className="space-y-4">
                         <h4 className="text-3xl md:text-6xl font-cinzel font-black uppercase tracking-tighter group-hover:gold-text transition-colors leading-none">{item.title}</h4>
                         <p className="text-base md:text-2xl text-white/30 italic font-medium leading-relaxed text-balance">{item.desc}</p>
                      </div>
                      <button className="h-16 md:h-20 px-12 md:px-16 rounded-full border border-primary/20 text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.4em] hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-4 mx-auto lg:mx-0 group/sm shadow-lg">
                        DETAILS <ArrowRight size={18} className="group-hover/sm:translate-x-2 transition-transform" />
                      </button>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

      </main>


    </div>
  );
}

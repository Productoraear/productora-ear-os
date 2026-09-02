
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  ArrowRight, 
  MapPin, 
  PlayCircle,
  Star
} from 'lucide-react';
import { GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: SOCIAL IMPACT (S-Class V2.4)
 * Narrative of Impact & Human Connection.
 */

interface SocialImpactProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function SocialImpact({ onNavigate, hideHeader }: SocialImpactProps) {
  return (
    <div className="bg-[#221d10] text-white font-montserrat min-h-screen overflow-x-hidden relative">
      <main className="max-w-7xl mx-auto space-y-16 pb-32">
        
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[600px] flex flex-col justify-center items-center p-6 md:p-12 overflow-hidden md:rounded-b-[80px] border-b border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-[#221d10]/60 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center flex flex-col items-center space-y-8 max-w-4xl"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-[#cf7317]/20 backdrop-blur-md px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#cf7317] border border-[#cf7317]/30 mb-2">
                Proyecto Insignia // Social Impact
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-cinzel font-black tracking-tighter uppercase leading-[0.9] text-balance">
                Viaje Musical <br />
                <span className="text-[#cf7317] italic font-serif normal-case">por la Memoria.</span>
            </h1>
            <p className="text-sm md:text-xl lg:text-2xl text-white/40 font-medium italic leading-relaxed text-balance px-4 md:px-0">
                Un documental sonoro que rescata las historias olvidadas a través de melodías ancestrales y producción moderna.
            </p>
            
            <button className="flex items-center gap-4 px-10 py-5 bg-[#cf7317] text-white rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#cf7317]/20 hover:scale-105 transition-all active:scale-95">
               <PlayCircle size={20} />
               VER DOCUMENTAL
            </button>
          </motion.div>
        </section>

        {/* 2. MISSION STATEMENT */}
        <section className="px-6 text-center space-y-12">
            <div className="flex flex-col w-full items-center">
                <span className="text-[#cf7317] text-[10px] font-black uppercase tracking-[0.5em] mb-4">Nuestra Misión</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                    Narrativa de <span className="text-[#cf7317]">Impacto</span>
                </h2>
            </div>
            
            <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl text-white/50 font-medium leading-relaxed italic">
                    Creemos en el arte como herramienta de transformación social. En <span className="text-[#cf7317] font-bold">EAR</span>, cada evento y producción técnica busca dejar una huella positiva en la comunidad, conectando generaciones a través de la excelencia audiovisual.
                </p>
            </div>
        </section>

        {/* 3. STATS GRID */}
        <section className="px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                    { label: 'Comunidades', val: '15+', icon: Users, color: 'text-blue-400' },
                    { label: 'Artistas', val: '50+', icon: Star, color: 'text-[#cf7317]' },
                    { label: 'Eventos Benéficos', val: '20', icon: Heart, color: 'text-red-500' }
                ].map((stat, i) => (
                    <div key={i} className={`p-10 ${GLASS_STYLE} border border-white/5 rounded-[3rem] flex flex-col items-center text-center space-y-4 hover:border-[#cf7317]/30 transition-all group`}>
                        <div className={`p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform ${stat.color}`}>
                            <stat.icon size={32} />
                        </div>
                        <span className="text-4xl font-black ">{stat.val}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 4. GALLERY HEADER */}
        <section className="px-6 relative flex items-center justify-center w-full mb-8">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-[#cf7317]">Proyectos Recientes</h3>
            <button className="absolute right-6 md:right-12 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#cf7317] transition-colors flex items-center gap-2">
                VER TODOS <ArrowRight size={14} />
            </button>
        </section>

        {/* 5. PROJECT CARDS */}
        <section className="px-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
                { 
                    title: 'Luces de Esperanza', 
                    cat: 'Eventos', 
                    loc: 'Bogotá, Colombia',
                    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000',
                    desc: 'Iluminación técnica y montaje escénico para el festival anual de recaudación de fondos.'
                },
                { 
                    title: 'Sonido Joven', 
                    cat: 'Talleres', 
                    loc: 'Medellín, Colombia',
                    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
                    desc: 'Talleres de producción musical para jóvenes talentos en barrios vulnerables.'
                }
            ].map((proj, i) => (
                <div key={i} className={`group flex flex-col rounded-[3rem] overflow-hidden bg-white/5 border border-white/5 shadow-2xl hover:border-[#cf7317]/20 transition-all`}>
                    <div className="h-64 w-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 relative" style={{ backgroundImage: `url(${proj.img})` }}>
                        <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-black/60 text-white text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-white/10">
                            {proj.cat}
                        </div>
                    </div>
                    <div className="flex flex-col p-10 gap-4">
                        <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{proj.title}</h4>
                        <p className="text-sm md:text-base text-white/40 italic leading-relaxed">{proj.desc}</p>
                        <div className="flex items-center gap-3 mt-4 pt-6 border-t border-white/5">
                            <MapPin size={16} className="text-[#cf7317]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{proj.loc}</span>
                        </div>
                    </div>
                </div>
            ))}
        </section>

        {/* 6. CTA SECTION */}
        <section className="px-6 pb-20">
            <div className={`relative overflow-hidden rounded-[4rem] bg-[#cf7317] p-12 md:p-24 text-center shadow-3xl max-w-4xl mx-auto`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Heart size={400} className="absolute -top-20 -left-20 rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col items-center space-y-8">
                    <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                        ¿Tienes una idea <br /> de impacto?
                    </h3>
                    <p className="text-white/80 text-sm md:text-lg font-medium italic max-w-md">
                        Buscamos aliados para expandir nuestra huella cultural. Colabora con nosotros.
                    </p>
                    <button className="bg-white text-[#cf7317] px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl">
                        COLABORAR
                    </button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}

"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, History, Anchor, Sun, Users, Mail, Share2, Sparkles, Activity } from 'lucide-react';

/**
 * 🎼 VIMUME LEGACY: PATRIMONIO ADRIANA
 * Rediseñado como el corazón social del Dashboard S-Class.
 * Integrando el "Legado Sonoro" con la señal real de leads.
 */
const VimumeLegacy = () => {
  return (
    <div className="w-full h-full bg-[#050505]/40 backdrop-blur-3xl rounded-[48px] border border-white/5 overflow-y-auto scrollbar-hide flex flex-col shadow-2xl relative select-none font-mono">
      
      {/* 🛸 CABECERA EMOCIONAL */}
      <header className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0f0e17]/60">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="text-pink-400 font-black uppercase tracking-[5px] text-[9px] opacity-80 animate-pulse">Social Signal Active / Adriana Protocol</span>
           </div>
           <h2 className="text-4xl font-black uppercase text-white tracking-tighter italic font-serif leading-none">Vimume <span className="text-purple-500">Legacy</span></h2>
        </div>
        <div className="flex gap-4">
           {/* Real-time pulse from Social Division leads */}
           <div className="flex items-center gap-4 bg-white/5 px-8 py-3 rounded-full border border-white/5 shadow-inner">
              <div className="flex flex-col items-start leading-none">
                 <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">Memoria Activa</span>
                 <span className="text-[11px] text-white font-black mt-1 uppercase italic font-serif">A. LENIS LUNA</span>
              </div>
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />
           </div>
        </div>
      </header>

      {/* 🌌 VIAJE POR LA MEMORIA */}
      <div className="flex-grow p-12 space-y-20 pb-32">
        
        {/* HERO ESTRATÉGICO: PATRIMONIO VIVIENTE */}
        <section className="relative h-[450px] rounded-[4rem] overflow-hidden border border-white/10 group shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110" 
                style={{ backgroundImage: `url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")` }} />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e17] via-[#0f0e17]/50 to-transparent" />
           
           <div className="absolute inset-x-16 bottom-16 z-10">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="w-16 h-16 bg-purple-500/30 rounded-2xl flex items-center justify-center border border-purple-500/40 shadow-[0_20px_60px_rgba(139,92,246,0.3)] mb-8"
              >
                <Music className="text-purple-300 w-8 h-8" />
              </motion.div>
              <h1 className="bg-gradient-to-r from-purple-300 via-pink-400 to-white bg-clip-text text-transparent text-5xl font-black leading-none tracking-tighter uppercase italic font-serif mb-6">
                EL LEGADO ES <br/> ETERNAMENTE <br/> SONORO
              </h1>
              <p className="text-white/60 text-base font-medium max-w-xl italic font-serif leading-relaxed">
                Transformando el patrimonio musical en terapia de recuperación para el alma. Donde la tecnología S-Class abraza la memoria.
              </p>
           </div>
           
           <div className="absolute top-10 right-10 bg-black/40 backdrop-blur-3xl px-6 py-4 rounded-3xl border border-white/5 flex items-center gap-4">
              <Sparkles className="text-purple-400 w-5 h-5 animate-pulse" />
              <div className="text-[10px] font-black uppercase text-white tracking-[3px] leading-tight text-right">Proyecto <br/> Prioridad Edwin</div>
           </div>
        </section>

        {/* MÉTRICAS DE IMPACTO SOCIAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
                { title: 'Anclaje Emocional', value: '100%', detail: 'Respuesta Neuro-Musical', icon: Heart },
                { title: 'Patrimonio Copla', value: '4.2k', detail: 'Nodos Registrados', icon: Anchor },
                { title: 'Sincronía Social', value: 'Active', detail: 'División VIMUME Live', icon: Activity }
            ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-10 rounded-[3rem] shadow-xl hover:translate-y-[-5px] transition-all group">
                   <stat.icon className="text-purple-400 w-8 h-8 mb-8 group-hover:scale-110 transition-transform" />
                   <div className="text-5xl font-black text-white font-serif italic mb-2">{stat.value}</div>
                   <div className="text-[10px] font-black uppercase text-white/30 tracking-[4px]">{stat.title}</div>
                   <p className="text-[9px] text-purple-400/60 font-black mt-4 uppercase tracking-[2px]">{stat.detail}</p>
                </div>
            ))}
        </div>

        {/* PACTO DE CUIDADO: ROBUSTECIDO */}
        <section className="bg-gradient-to-br from-purple-500/10 to-transparent p-16 rounded-[4.5rem] border border-purple-500/20 relative shadow-2xl">
            <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter font-serif mb-12">El Pacto de Honor Social</h2>
            <div className="grid md:grid-cols-3 gap-12">
                {[
                    { title: 'Protección Adriana', desc: 'Protocolo de cuidado emocional premium basado en la dignidad absoluta.' },
                    { title: 'Bóveda de Recuerdos', desc: 'Patrimonio sonoro inquebrantable para las futuras generaciones EAR.' },
                    { title: 'Hospitalidad Clínica', desc: 'Integración forense en el acompañamiento a centros de alto cuidado.' }
                ].map((pacto, i) => (
                    <div key={i} className="flex flex-col gap-5 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-black text-[9px] uppercase tracking-[4px]">Ecosistema EAR / 0{i+1}</div>
                        <h4 className="font-black text-white uppercase text-sm tracking-widest">{pacto.title}</h4>
                        <p className="text-[12px] text-white/40 italic leading-relaxed font-serif">{pacto.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* FOOTER CULMINANTE */}
        <footer className="pt-20 flex flex-col items-center">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-12" />
            <button className="flex items-center gap-6 rounded-[2rem] px-16 py-7 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] hover:bg-purple-500 hover:text-white transition-all shadow-[0_25px_60px_rgba(255,255,255,0.1)] active:scale-95 font-serif italic group">
                <Mail size={20} className="group-hover:rotate-12 transition-transform" /> Contactar con Estrategia VIMUME
            </button>
            <p className="mt-12 text-white/10 text-[10px] uppercase font-black tracking-[1em]">Patrimonio EAR {"//"} Legado S-Class 2026</p>
        </footer>

      </div>
    </div>
  );
};

export default VimumeLegacy;

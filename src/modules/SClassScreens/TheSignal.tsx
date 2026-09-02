'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Activity, 
  Fingerprint, 
  Eye, 
  Shield, 
  Lock, 
  Workflow, 
  Brain,
  ChevronDown,
  Zap,
  Star
} from 'lucide-react';
import { THEME, GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: THE SIGNAL (S-Class v3.0)
 * Artist Funnel: Unlock Your Sonic Truth.
 * High-End Interrogation & Forensic Analysis.
 * Full Responsive Senior High-End Interface.
 */

interface TheSignalProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function TheSignal({ onNavigate, hideHeader }: TheSignalProps) {
  const protocolSteps = [
    {
      title: 'Auditoría Estética',
      desc: 'Analizamos su ADN visual y coherencia narrativa. No solo lo que suena, sino lo que proyecta.',
      icon: Eye
    },
    {
      title: 'Interrogatorio Sónico',
      desc: 'Pruebas de estrés creativo y técnico. Desciframos su señal pura por debajo del ruido.',
      icon: Activity
    },
    {
      title: 'Blindaje Identitario',
      desc: 'Protección de su visión bajo estándares de industria de alto nivel. Exclusividad asegurada.',
      icon: Lock
    }
  ];

  return (
    <div className="bg-[#221d10] text-white font-montserrat selection:bg-[#ecb613] selection:text-[#221d10] w-full min-h-screen overflow-x-hidden relative">
      
      <main className="max-w-7xl mx-auto space-y-24 md:space-y-48 pb-32 pt-12 md:pt-24 text-balance">
        
        {/* 1. CINEMATIC HERO */}
        <section className="relative aspect-[3/4] md:aspect-[21/9] flex flex-col justify-center items-center p-6 md:p-12 overflow-hidden md:rounded-b-[80px] border-b border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center grayscale opacity-10 scale-110"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2029")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-transparent to-[#221d10]/60" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 space-y-8 md:space-y-12 text-center items-center flex flex-col"
          >
            <span className="px-5 py-2 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl">
               Classified Access // Artist Audit
            </span>
            <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-cinzel font-black tracking-tighter uppercase leading-[0.85] text-balance">
              Libere su <br />
              <span className="gold-text italic font-serif normal-case">Verdad Sonora.</span>
            </h1>
            <p className="text-base md:text-2xl lg:text-3xl text-white/40 font-medium italic max-w-2xl leading-relaxed">
               No buscamos músicos. Buscamos señales puras en un mundo de ruido. ¿Es usted el mensaje?
            </p>
            <button className="h-16 md:h-24 px-12 md:px-20 rounded-full bg-primary text-black font-black uppercase text-[10px] md:text-lg tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 flex items-center justify-center gap-6">
               INICIAR PROTOCOLO <ArrowRight size={24} />
            </button>
          </motion.div>
        </section>

        {/* 2. PROTOCOL STEPS (High Fidelity) */}
        <section className="px-4 md:px-12 space-y-12 md:space-y-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
             {protocolSteps.map((step, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className={`p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 flex flex-col gap-8 group hover:border-primary/20 transition-all shadow-3xl`}
               >
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                     <step.icon size={28} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-xl md:text-2xl font-cinzel font-black uppercase tracking-tight group-hover:text-primary transition-colors">{step.title}</h3>
                     <p className="text-sm md:text-lg text-white/30 italic font-medium leading-[1.6]">{step.desc}</p>
                  </div>
               </motion.div>
             ))}
          </div>
        </section>

        {/* 3. INTERROGATION CALLOUT */}
        <section className="px-4 md:px-12">
           <div className="p-10 md:p-32 rounded-[3.5rem] md:rounded-[8rem] bg-gradient-to-br from-black via-primary/5 to-black border border-white/5 text-center space-y-12 md:space-y-20 relative overflow-hidden group shadow-4xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="space-y-6 md:space-y-8 relative z-10">
                 <h2 className="text-2xl md:text-6xl font-cinzel font-black uppercase tracking-tighter italic serif gold-text">¿Está listo para la Realidad?</h2>
                 <p className="text-sm md:text-2xl text-white/20 font-medium max-w-3xl mx-auto leading-relaxed">Solo el 2% de los artistas superan nuestra fase de auditoría técnica y estética inicial. El rigor no es opcional.</p>
              </div>
              <button 
                onClick={() => onNavigate?.('contact')}
                className="h-16 md:h-24 px-12 md:px-20 rounded-full border border-primary/20 text-primary font-black uppercase text-[10px] md:text-sm tracking-[0.4em] hover:bg-primary hover:text-black transition-all mx-auto flex items-center justify-center gap-4 group/btn">
                 SOLICITAR AUDITORÍA <Activity size={20} className="group-hover/btn:scale-125 transition-transform" />
              </button>
           </div>
        </section>

      </main>
    </div>
  );
}

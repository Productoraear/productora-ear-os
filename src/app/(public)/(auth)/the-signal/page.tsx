'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Signal, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Music, 
  Globe, 
  Database,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

/**
 * 🛰️ THE SIGNAL — TALENT ONBOARDING (AURA ONYX)
 * Vertical: Talent OS
 * Concepto: Emisión de señal para validación de autoridad.
 */

type Phase = 'CHOICE' | 'MANIFESTO' | 'CAPTURE' | 'SUCCESS';

export default function TheSignalPage() {
  const [phase, setPhase] = useState<Phase>('CHOICE');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = (nextPhase: Phase) => {
    setIsProcessing(true);
    setTimeout(() => {
      setPhase(nextPhase);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 flex items-center justify-center relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#050505] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-4xl px-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* PHASE 1: THE CHOICE */}
          {phase === 'CHOICE' && (
            <motion.div 
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                <Signal size={14} /> THE EAR SIGNAL
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] font-syne">
                El ruido es temporal. <br/>La <span className="text-[#ecb613]">Señal</span> es eterna.
              </h1>
              <div className="grid md:grid-cols-2 gap-8">
                <button 
                  onClick={() => handleNext('MANIFESTO')}
                  className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-[#ecb613]/30 transition-all group text-left"
                >
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Creador de Impacto</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-10">
                    Músicos y artistas con visión de legado.
                  </p>
                  <span className="flex items-center gap-3 text-[#ecb613] font-black text-[10px] tracking-[0.4em] uppercase">
                    EMITIR SEÑAL <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
                <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[3rem] opacity-40 text-left">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white/40">Curador Institucional</h3>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-10">
                    Próximamente para agentes y promotores.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 2: MANIFESTO */}
          {phase === 'MANIFESTO' && (
            <motion.div 
              key="manifesto"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-2xl mx-auto space-y-12"
            >
              <div className="border-l-4 border-[#ecb613] pl-12 space-y-8">
                <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Manifiesto de Autoridad</span>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] font-syne">
                  No somos un directorio.
                </h2>
                <p className="text-white/60 text-xl font-medium leading-relaxed italic">
                  EAR OS es una <span className="text-white font-black">Infraestructura Técnica</span>. No buscamos "bolos". Buscamos construir activos patrimoniales para artistas que entienden el valor de la estructura.
                </p>
                <button 
                  onClick={() => handleNext('CAPTURE')}
                  className="px-14 py-7 bg-[#ecb613] text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-white transition-all shadow-2xl shadow-[#ecb613]/20"
                >
                  ACEPTO EL PROTOCOLO
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: CAPTURE */}
          {phase === 'CAPTURE' && (
            <motion.div 
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto bg-white/[0.02] border border-white/5 p-12 md:p-16 rounded-[4rem] space-y-12"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Identidad del Talento</h2>
                <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">Signal Ingress</span>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Nombre del Proyecto / Artista</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-[#ecb613]/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Email de Autoridad</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-[#ecb613]/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Link a Media Kit / Video</label>
                  <input type="url" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-[#ecb613]/50 outline-none transition-all" />
                </div>
                <button 
                  onClick={() => handleNext('SUCCESS')}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-[#ecb613] transition-all"
                >
                  ENVIAR SEÑAL
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 4: SUCCESS */}
          {phase === 'SUCCESS' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12"
            >
              <div className="w-32 h-32 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-full flex items-center justify-center mx-auto text-[#ecb613]">
                <CheckCircle2 size={64} />
              </div>
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none font-syne">Señal Emitida</h2>
                <p className="text-white/40 text-xl font-medium italic max-w-lg mx-auto leading-relaxed">
                  Tu señal ha sido inyectada en el Nexus. El Comandante auditará tu propuesta en las próximas 48 horas.
                </p>
              </div>
              <Link href="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#ecb613] hover:text-white transition-colors">
                VOLVER AL RADAR <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Processing Loader */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center gap-6"
          >
            <div className="w-12 h-12 border-2 border-[#ecb613]/20 border-t-[#ecb613] rounded-full animate-spin" />
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Sintonizando...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

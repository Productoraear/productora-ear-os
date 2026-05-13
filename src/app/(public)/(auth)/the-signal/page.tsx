'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Shield, ArrowRight, Activity, Users, Layout, Cpu } from 'lucide-react';
import { useEarStore } from '@/store/useEarStore';

type Phase = 'CHOICE' | 'MANIFESTO' | 'FORM_1' | 'FORM_2' | 'FINAL';

export default function TheSignalPage() {
  const router = useRouter();
  const addXp = useEarStore((state) => state.addXp);
  
  const [phase, setPhase] = useState<Phase>('CHOICE');
  const [profile, setProfile] = useState<'CREATOR' | 'CURATOR' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = (nextPhase: Phase) => {
    setIsProcessing(true);
    setTimeout(() => {
      setPhase(nextPhase);
      setIsProcessing(false);
    }, 800);
  };

  const finalize = () => {
    setIsProcessing(true);
    addXp(100);
    setTimeout(() => {
      router.push('/portal');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#d4a855]/30 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background S-Class */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#050505] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#d4a855]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl px-6 relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'CHOICE' && (
            <motion.div 
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a855]/10 border border-[#d4a855]/20 text-[#d4a855] text-[10px] font-black uppercase tracking-[0.4em] mb-12">
                <Zap size={12} /> THE EAR SIGNAL
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-20">
                El 99% es ruido.<br/>Nosotros somos <span className="text-[#d4a855]">la Señal</span>.
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button 
                  onClick={() => { setProfile('CREATOR'); handleNext('MANIFESTO'); }}
                  className="glass-panel p-12 rounded-[3rem] border-white/5 bg-white/[0.02] hover:border-[#d4a855]/30 group transition-all"
                >
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Soy Creador</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-12">
                    No buscamos rellenos de cartel. Buscamos Arquitectos de Experiencia.
                  </p>
                  <span className="flex items-center justify-center gap-3 text-[#d4a855] font-black text-[10px] tracking-[0.4em] uppercase">
                    INICIAR PROCESO <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>

                <button 
                  onClick={() => { setProfile('CURATOR'); handleNext('MANIFESTO'); }}
                  className="glass-panel p-12 rounded-[3rem] border-white/5 bg-white/[0.02] hover:border-purple-500/30 group transition-all"
                >
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Soy Curador</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-12">
                    El algoritmo te da lo viral. Nosotros te damos lo legendario.
                  </p>
                  <span className="flex items-center justify-center gap-3 text-purple-500 font-black text-[10px] tracking-[0.4em] uppercase">
                    SOLICITAR ACCESO <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'MANIFESTO' && (
            <motion.div 
              key="manifesto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl mx-auto"
            >
              <div className="border-l-2 border-[#d4a855] pl-12 py-8">
                <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">Manifiesto de Ingreso</span>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-12">
                  Antes de Aplicar,<br/>entiende esto:
                </h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed mb-12">
                  EAR no es un directorio. Somos una <span className="text-white font-black">Infraestructura de Talento</span>. <br/>
                  Exigimos excelencia absoluta. Si buscas "bolos" rápidos, no apliques. Si buscas construir un activo patrimonial, estás en el lugar correcto.
                </p>
                <button 
                  onClick={() => handleNext('FORM_1')}
                  className="px-12 py-6 bg-[#d4a855] text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-full hover:bg-white transition-all shadow-[0_20px_40px_rgba(212,168,85,0.2)]"
                >
                  ACEPTO EL DESAFÍO
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'FORM_1' && (
            <motion.div 
              key="form1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto glass-panel p-12 lg:p-16 rounded-[4rem] border-white/5 bg-white/[0.01]"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">1. Tu Huella Digital</h2>
                <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.4em]">Fase 1/3</span>
              </div>

              <div className="space-y-12 mb-16">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 block mb-4">Link Video (Actuación)</label>
                  <input 
                    type="text" 
                    placeholder="Youtube / Vimeo..."
                    className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-white font-medium focus:border-[#d4a855] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 block mb-4">Métricas Reales</label>
                  <textarea 
                    placeholder="Engagement, Audiencia media..."
                    className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-white font-medium focus:border-[#d4a855] transition-all outline-none min-h-[150px]"
                  />
                </div>
              </div>

              <button 
                onClick={() => handleNext('FORM_2')}
                className="w-full py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl hover:bg-white/10 transition-all"
              >
                CONTINUAR
              </button>
            </motion.div>
          )}

          {phase === 'FORM_2' && (
            <motion.div 
              key="form2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto glass-panel p-12 lg:p-16 rounded-[4rem] border-white/5 bg-white/[0.01]"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">2. Filosofía de Escenario</h2>
                <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.4em]">Fase 2/3</span>
              </div>

              <div className="space-y-12 mb-16">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 block mb-4">¿Cuál es tu 'Linchpin'? (Valor Único)</label>
                  <textarea 
                    placeholder="¿Por qué eres incomparable?"
                    className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-white font-medium focus:border-[#d4a855] transition-all outline-none min-h-[150px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 block mb-4">Email de Contacto</label>
                  <input 
                    type="email" 
                    placeholder="tu@email.com"
                    className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl text-white font-medium focus:border-[#d4a855] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => setPhase('FORM_1')}
                  className="py-6 bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                >
                  ATRÁS
                </button>
                <button 
                  onClick={finalize}
                  className="py-6 bg-[#d4a855] text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl hover:bg-white transition-all"
                >
                  FINALIZAR APLICACIÓN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center flex-col gap-8"
          >
            <div className="w-16 h-16 border-4 border-[#d4a855]/20 border-t-[#d4a855] rounded-full animate-spin" />
            <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Sintonizando la Señal...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Lock, 
  ChevronRight, 
  Award, 
  Mic2, 
  Fingerprint, 
  FileSearch,
  BookOpen,
  ArrowRight,
  Target,
  Play,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StudioModule {
  id: string;
  level: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'locked';
  progress: number;
}

const MODULES: StudioModule[] = [
  {
    id: 'm1',
    level: 1,
    title: 'Psicología del Operador',
    description: 'De la creatividad caótica al hábito de impacto.',
    status: 'active',
    progress: 45
  },
  {
    id: 'm2',
    level: 1,
    title: 'Ingeniería de Señal Digital',
    description: 'Optimización de activos y presencia técnica.',
    status: 'locked',
    progress: 0
  },
  {
    id: 'm3',
    level: 2,
    title: 'Blindaje de Infraestructura',
    description: 'Protocolos legales y seguridad de equipo.',
    status: 'locked',
    progress: 0
  }
];

const EmanagerStudioMaster = () => {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const sharkMindsetScore = 84;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {/* Cinematic Background Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/2 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        {/* Top Navigation / Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-8">
          <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Emanager</span>
          <ChevronRight size={10} />
          <span className="text-[#D4AF37] font-bold">Studio Node</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Modules & Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Shark Mindset HUD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#111] to-[#080808] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Target size={32} className="text-[#D4AF37]" />
              </div>
              
              <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-8 font-black">Mindset de Ejecución</h3>
              
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Semicircular Dial Mockup */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={502.4}
                      initial={{ strokeDashoffset: 502.4 }}
                      animate={{ strokeDashoffset: 502.4 - (502.4 * sharkMindsetScore) / 100 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-[#D4AF37]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-serif italic font-black text-white">{sharkMindsetScore}%</span>
                    <span className="text-[10px] text-[#D4AF37] font-bold tracking-widest mt-2 uppercase">Shark Score</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed italic px-4">
                "La soberanía nace de la disciplina. El éxito es el residuo de un sistema diseñado para la excelencia."
              </p>
            </motion.div>

            {/* Module Explorer */}
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 ml-4 font-black">Explorador de Niveles</h3>
              <div className="space-y-3">
                {MODULES.map((mod) => (
                  <motion.div
                    key={mod.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      mod.id === activeModule.id 
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)]' 
                        : 'bg-[#111]/50 border-white/5 text-white hover:border-white/10'
                    } ${mod.status === 'locked' ? 'opacity-40 grayscale' : ''}`}
                    onClick={() => mod.status !== 'locked' && setActiveModule(mod)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                          mod.id === activeModule.id ? 'bg-black/10 border-black/10' : 'bg-white/5 border-white/10'
                        }`}>
                          {mod.status === 'locked' ? <Lock size={16} /> : <span className="font-black text-xs">{mod.level}</span>}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold tracking-tight">{mod.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`h-1 w-12 rounded-full overflow-hidden ${
                              mod.id === activeModule.id ? 'bg-black/20' : 'bg-white/10'
                            }`}>
                              <div 
                                className={`h-full ${mod.id === activeModule.id ? 'bg-black' : 'bg-[#D4AF37]'}`} 
                                style={{ width: `${mod.progress}%` }} 
                              />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tighter ${
                              mod.id === activeModule.id ? 'text-black/60' : 'text-gray-500'
                            }`}>{mod.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} className={mod.id === activeModule.id ? 'text-black' : 'text-gray-600'} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Content & Tools (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Interactive Lesson Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111] border border-white/5 rounded-[3rem] p-10 min-h-[500px] relative overflow-hidden flex flex-col justify-end group"
            >
              {/* Background "Video" Placeholder */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1514525253361-bee8718a340b?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale brightness-50 group-hover:scale-105 transition-transform duration-1000" />
              </div>

              <div className="relative z-20 space-y-6 max-w-2xl">
                <div className="flex items-center space-x-3">
                   <div className="px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                     Lección Actual
                   </div>
                   <div className="flex items-center text-white/40 text-[9px] font-bold uppercase tracking-widest">
                     <BookOpen size={12} className="mr-1" /> Módulo 1.2
                   </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif italic font-black text-white leading-tight">
                  Define tu autoridad técnica antes de que el mercado defina tu precio.
                </h2>
                
                <p className="text-gray-400 text-lg leading-relaxed font-light italic">
                  La ingeniería operativa no es solo equipo y cables; es el diseño de una experiencia que obliga al cliente a aceptar tu valor sin negociaciones.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-shadow hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)]"
                  >
                    Continuar Formación <Play size={14} fill="black" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                  >
                    Guía Forense (PDF)
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Tools Bóveda */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black">Bóveda de Herramientas Estratégicas</h3>
                <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:underline">Ver Todo el Arsenal</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-[#D4AF37]/30 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <Mic2 size={24} className="text-[#D4AF37]" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Audio Signal Analysis</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Diagnóstico avanzado de señal y mentoría técnica en tiempo real.</p>
                  <div className="mt-4 flex items-center text-[#D4AF37] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Ejecutar Scanner <ArrowRight size={12} className="ml-2" />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-[#D4AF37]/30 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <Fingerprint size={24} className="text-[#D4AF37]" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Visual DNA Vault</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Estructura de identidad de marca y activos visuales de alta autoridad.</p>
                  <div className="mt-4 flex items-center text-[#D4AF37] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Acceder a Bóveda <ArrowRight size={12} className="ml-2" />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-[#D4AF37]/30 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <FileSearch size={24} className="text-[#D4AF37]" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Contract Auditor</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Revisión forense de infraestructura legal y contratos artísticos.</p>
                  <div className="mt-4 flex items-center text-[#D4AF37] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Subir Contrato <ArrowRight size={12} className="ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement / Goal */}
            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <Award size={28} className="text-black" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Hito de Próximo Nivel: Arquitecto Senior</h4>
                  <p className="text-gray-500 text-xs mt-1">Completa el Módulo de Ingeniería Digital para desbloquear el Nivel 2.</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2 text-[#D4AF37] font-black text-xl italic">
                  <span>350 XP</span>
                  <Zap size={20} fill="#D4AF37" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Bottom Action (Mobile) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%]">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3"
        >
          Continuar Lección <Play size={14} fill="black" />
        </motion.button>
      </div>

    </div>
  );
};

export default EmanagerStudioMaster;

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Users, Zap, CheckCircle2, Music, Waves, ShieldCheck } from 'lucide-react';
import { VimumeEngine, VIMUME_PROTOCOLS } from '@/lib/engines/VimumeEngine';
import { S_CLASS_THEME } from '@/lib/constants/SClassNexus';

/**
 * 🏛️ VIMUMEDASHBOARD S-CLASS v2.0
 * Reactor de Impacto Cognitivo con Estética Aura Onyx & Púrpura Profundo.
 * Visualizador de Ondas Gamma 40Hz integrado.
 */

export default function VimumeDashboard() {
  const [activeSession, setActiveSession] = useState(VIMUME_PROTOCOLS[0]);
  const [impactScore, setImpactScore] = useState(0);
  const [isStimulating, setIsStimulating] = useState(false);

  useEffect(() => {
    // Cálculo de ICP S-Class (Simulación de paciente de 78 años, 12 sesiones, engagement alto)
    const score = VimumeEngine.calculateICP(78, 12, 9.5);
    setImpactScore(score);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-inter overflow-hidden relative">
      {/* 🌌 FONDO AMBIENTAL AURA ONYX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* 📑 HEADER QUIRÚRGICO */}
        <header className="flex justify-between items-end border-b border-white/5 pb-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-500 mb-2 block">
              Protocolo VIMUME // Reactor Social
            </span>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Impacto <span className="text-purple-600 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">Cognitivo</span>
            </h1>
          </motion.div>

          <div className="flex gap-8 items-center">
             <div className="text-right">
                <div className="text-5xl font-black text-white italic tracking-tighter">
                  {impactScore.toFixed(1)}%
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">ROI Social Proyectado</div>
             </div>
             <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
                <Activity size={32} className="text-purple-400" />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* 🌑 COLUMNA IZQUIERDA: LÍNEA DE TIEMPO SOBERANA */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3 mb-8">
              <Users size={14} className="text-purple-500" /> Evolución del Legado
            </h2>
            
            <div className="relative space-y-4">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />
              
              {VIMUME_PROTOCOLS.map((session, idx) => (
                <motion.div
                  key={session.id}
                  whileHover={{ x: 8 }}
                  onClick={() => setActiveSession(session)}
                  className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative group overflow-hidden ${
                    activeSession.id === session.id
                      ? 'bg-purple-600/10 border-purple-500/50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                      : 'bg-zinc-900/30 border-white/5 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                      activeSession.id === session.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-600'
                    }`}>
                      {session.level}
                    </div>
                    <div>
                      <h3 className="font-bold italic uppercase text-sm tracking-tight">{session.title}</h3>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        Frecuencia: {session.frequency}
                      </p>
                    </div>
                  </div>
                  
                  {activeSession.id === session.id && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent" 
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ⚡ COLUMNA CENTRAL: REACTOR GAMMA 40Hz */}
          <div className="lg:col-span-8 space-y-12">
            
            <div className="bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 relative overflow-hidden h-[500px] flex flex-col justify-center items-center group">
              {/* 🧠 VISUALIZADOR 40Hz (S-Class Animation) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence>
                  {isStimulating && [...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 2.5], 
                        opacity: [0.6, 0],
                        borderWidth: ['2px', '0px']
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.3,
                        ease: "easeOut"
                      }}
                      className="absolute border border-purple-500/40 rounded-full"
                      style={{ width: '200px', height: '200px' }}
                    />
                  ))}
                </AnimatePresence>
                
                {/* ONDAS CONSTANTES SUTILES */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`static-${i}`}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      delay: i * 1,
                    }}
                    className="absolute border border-white/5 rounded-full"
                    style={{ width: `${300 + i * 150}px`, height: `${300 + i * 150}px` }}
                  />
                ))}
              </div>

              <div className="relative z-10 text-center space-y-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/30 mb-4 group-hover:scale-110 transition-transform duration-700">
                  <Music className={`text-purple-400 ${isStimulating ? 'animate-bounce' : ''}`} size={40} />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none max-w-xl">
                    {activeSession.title}
                  </h2>
                  <p className="text-zinc-500 text-sm max-w-md font-medium leading-relaxed uppercase tracking-wide mx-auto">
                    {activeSession.description}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsStimulating(!isStimulating)}
                  className={`px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.4em] transition-all ${
                    isStimulating 
                    ? 'bg-purple-600 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] border border-purple-400/50' 
                    : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isStimulating ? 'Protocolo Activo (40Hz)' : 'Iniciar Estimulación'}
                </motion.button>
              </div>
            </div>

            {/* 📊 KPI GRID S-CLASS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Estado Neural', value: isStimulating ? 'MODO GAMMA' : 'STANDBY', icon: Brain, color: 'text-purple-500' },
                { label: 'Frecuencia Táctica', value: activeSession.frequency, icon: Waves, color: 'text-blue-500' },
                { label: 'Integridad Clínica', value: '100% S-CLASS', icon: ShieldCheck, color: 'text-emerald-500' }
              ].map((kpi, i) => (
                <div key={i} className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] hover:border-white/20 transition-all group">
                  <kpi.icon className={`${kpi.color} mb-4 group-hover:scale-110 transition-transform`} size={24} />
                  <div className="text-xl font-black italic uppercase tracking-tighter text-white mb-1">
                    {kpi.value}
                  </div>
                  <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

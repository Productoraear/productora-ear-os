'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  Shield, 
  Zap, 
  Brain, 
  Database, 
  Network, 
  Lock,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  Heart
} from 'lucide-react';
import { GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: COMMAND CENTER (S-CLASS CORE)
 * El Cerebro Digital de Productora EAR.
 * Fusión de Backups e Inteligencia Multi-Agente.
 */

interface CommandCenterProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function CommandCenter({ onNavigate, hideHeader }: CommandCenterProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'backups' | 'agents' | 'metrics'>('backups');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingProgress < 100) setLoadingProgress(prev => Math.min(prev + 1, 100));
    }, 20);
    return () => clearTimeout(timer);
  }, [loadingProgress]);

  const backups = [
    { name: 'EAR_OS_MASTER_2026', status: 'Active', pulse: 'Cyan', health: 100 },
    { name: 'STITCH_V2_ARTISTS', status: 'Synced', pulse: 'Gold', health: 94 },
    { name: 'ECOSYSTEM_2026_LEGACY', status: 'Legacy', pulse: 'Amber', health: 100 },
  ];

  const agents = [
    { name: 'Arquitecto', task: 'Planificación S-Class', status: 'Thinking' },
    { name: 'Diseñador', task: 'Bible Consistency', status: 'Polishing' },
    { name: 'Ensamblador', task: 'Code Injector', status: 'Operating' },
  ];

  return (
    <div className="bg-[#221d10] text-white font-montserrat p-4 md:p-12 min-h-full">
      
      {/* 🟢 TOP HUD - SEÑAL CEREBRAL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {backups.map((b, i) => (
          <div key={i} className={`${GLASS_STYLE} ${GOLD_HUD_STYLE} p-6 rounded-3xl border border-white/5 relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-2 h-2 rounded-full m-4 ${b.pulse === 'Cyan' ? 'bg-cyan-400 animate-pulse' : 'bg-[#ecb613]'} shadow-[0_0_15px_rgba(236,182,19,0.5)]`} />
            <div className="space-y-4">
               <div className="flex items-center gap-3 opacity-30 text-[9px] font-black uppercase tracking-widest">
                  <Database size={12} /> Backup Node
               </div>
               <h3 className="text-xs font-black uppercase tracking-tighter truncate">{b.name}</h3>
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-white/40 uppercase">{b.status}</span>
                  <span className="text-2xl font-black font-cinzel text-[#ecb613]">{b.health}%</span>
               </div>
            </div>
          </div>
        ))}
        <div className={`${GLASS_STYLE} ${GOLD_HUD_STYLE} p-6 rounded-3xl bg-[#ecb613] text-[#221d10] flex flex-col justify-center items-center text-center cursor-pointer hover:scale-105 transition-all`}>
           <Zap size={24} className="mb-2" />
           <span className="text-[10px] font-black uppercase tracking-widest">Sincronización Total</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 h-full">
        
        {/* 🔵 IZQUIERDA: LOG DE AGENTES */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className={`p-8 ${GLASS_STYLE} border border-white/5 rounded-[2.5rem] bg-white/[0.01]`}>
              <h4 className="font-cinzel text-[11px] font-black uppercase tracking-[0.4em] text-[#ecb613] mb-8 flex items-center gap-3">
                 <Shield size={16} /> Protocolo Multi-Agente
              </h4>
              <div className="space-y-6">
                 {agents.map((agent, i) => (
                   <div key={i} className="flex gap-5 items-start">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ecb613] shrink-0">
                         {i === 0 ? <Brain size={18} /> : i === 1 ? <Search size={18} /> : <Cpu size={18} />}
                      </div>
                      <div className="space-y-1">
                         <div className="flex justify-between items-center w-full">
                            <p className="text-xs font-black uppercase tracking-tight">{agent.name}</p>
                            <span className="text-[9px] font-black py-0.5 px-2 bg-[#ecb613]/10 text-[#ecb613] rounded uppercase">{agent.status}</span>
                         </div>
                         <p className="text-[10px] text-white/20 italic">{agent.task}</p>
                         <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: agent.status === 'Thinking' ? '40%' : '100%' }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                              className="h-full bg-[#ecb613]" 
                            />
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className={`p-8 bg-[#1a150a] border border-white/5 rounded-[2.5rem] relative overflow-hidden`}>
              <div className="flex items-center gap-3 mb-6">
                 <Activity size={16} className="text-[#ecb613]" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Estado Operativo</span>
              </div>
              <p className="text-sm font-serif italic text-white/40 leading-relaxed">
                "La fusión de los átomo de diseño de los 3 backups está operando al 98% de integridad. El HUD global se ha inyectado con éxito."
              </p>
           </div>
        </div>

        {/* 🔴 DERECHA: VISUALIZADOR DE NÚCLEO */}
        <div className="col-span-12 lg:col-span-8">
           <div className={`h-[500px] w-full ${GLASS_STYLE} border border-white/10 rounded-[4rem] relative flex items-center justify-center overflow-hidden bg-[#2d2616]`}>
              <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center">
                 <Network size={600} className="animate-spin-slow" />
              </div>
              
              {/* CORE PULSE */}
              <div className="relative z-10 text-center space-y-10 px-6">
                 <motion.div 
                   animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                   transition={{ duration: 10, repeat: Infinity }}
                   className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-[#ecb613] to-amber-700 rounded-[3rem] md:rounded-[4rem] mx-auto flex items-center justify-center shadow-[0_0_100px_rgba(236,182,19,0.3)] relative"
                 >
                    <div className="absolute inset-0 bg-[#ecb613] blur-[40px] opacity-20 animate-pulse" />
                    <Cpu size={80} className="text-[#221d10]" />
                 </motion.div>
                 
                 <div className="space-y-4">
                    <h2 className="font-cinzel text-3xl md:text-5xl font-black uppercase tracking-tighter shadow-sm text-balance">
                       Integridad <br /> <span className="gold-text italic font-serif normal-case">Del Sistema.</span>
                    </h2>
                    <div className="flex items-center justify-center gap-6">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#ecb613]">
                          <CheckCircle2 size={14} /> Backups Fusionados
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20">
                          <AlertCircle size={14} /> 2 Conflictos Resueltos
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={() => onNavigate?.('home')}
                  className="px-12 py-5 bg-white text-[#221d10] rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#ecb613] transition-all shadow-4xl active:scale-95"
                 >
                   Acceder al Norte Magnético
                 </button>
              </div>

               {/* FLOATING METRICS */}
               <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center px-12 py-6 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-xl">
                  {['LATENCY: 0.002s', 'DNA_HASH: EB-442-X', 'OS_VERSION: S-CLASS 2.4'].map((m, i) => (
                    <span key={i} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/10 italic">{m}</span>
                  ))}
               </div>
            </div>

            {/* 🛡️ TACTICAL ACCESS GRID */}
            <div className="grid grid-cols-2 gap-6 mt-12">
               <button 
                onClick={() => onNavigate?.('Arsenal')}
                className={`p-10 ${GLASS_STYLE} border border-amber-500/20 rounded-[3rem] hover:bg-amber-500/10 transition-all group relative overflow-hidden`}
               >
                  <div className="flex flex-col items-center text-center space-y-4">
                     <Cpu size={40} className="text-amber-500 group-hover:scale-125 transition-transform" />
                     <h4 className="text-xl font-black uppercase tracking-tighter">Inventario Arsenal</h4>
                     <p className="text-[10px] text-white/30 uppercase tracking-widest">Sincronización Firebase Activa</p>
                  </div>
               </button>

               <button 
                onClick={() => onNavigate?.('Vimume')}
                className={`p-10 ${GLASS_STYLE} border border-red-500/20 rounded-[3rem] hover:bg-red-500/10 transition-all group relative overflow-hidden`}
               >
                  <div className="flex flex-col items-center text-center space-y-4">
                     <Heart size={40} className="text-red-500 group-hover:scale-125 transition-transform" />
                     <h4 className="text-xl font-black uppercase tracking-tighter">Tracker VIMUME</h4>
                     <p className="text-[10px] text-white/30 uppercase tracking-widest">Protocolo de Impacto Social</p>
                  </div>
               </button>
            </div>
        </div>

      </div>
    </div>
  );
}

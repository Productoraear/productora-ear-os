"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Heart, 
  Database, 
  History,
  Music,
  Compass,
  LayoutGrid,
  Layers,
  Stethoscope
} from 'lucide-react';

export type VimumeView = 'CORE' | 'TRACKER' | 'SOCIAL' | 'LEGACY' | 'ATLAS' | 'PROJECTS' | 'CLINICAL';

interface VimumeNavigatorProps {
  activeView: VimumeView;
  onViewChange: (view: VimumeView) => void;
}

const NAV_ITEMS = [
  { id: 'CORE', label: 'Núcleo VIMUME', icon: Zap, color: 'text-yellow-400' },
  { id: 'CLINICAL', label: 'Dashboard Forense', icon: Stethoscope, color: 'text-blue-500' },
  { id: 'TRACKER', label: 'Métrica Clínica', icon: Activity, color: 'text-blue-400' },
  { id: 'SOCIAL', label: 'Impacto ODS', icon: Heart, color: 'text-pink-400' },
  { id: 'LEGACY', label: 'Viaje Musical', icon: Music, color: 'text-purple-400' },
  { id: 'ATLAS', label: 'Bóveda de Datos', icon: Database, color: 'text-[#ecb613]' },
  { id: 'PROJECTS', label: 'Proyectos VIMUME', icon: Layers, color: 'text-emerald-400' },
] as const;

export default function VimumeNavigator({ activeView, onViewChange }: VimumeNavigatorProps) {
  return (
    <nav className="w-full h-24 bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] flex items-center justify-between px-10 z-30 shrink-0 select-none">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-tight">Vertical</span>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
            VIMUME <span className="text-white/20">OS</span>
          </h2>
        </div>
        <div className="w-px h-8 bg-white/10 mx-4" />
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as VimumeView)}
                className={`
                  relative h-12 px-5 rounded-2xl flex items-center gap-3 transition-all duration-500 group overflow-hidden shrink-0
                  ${isActive ? 'bg-white/5 border border-white/10' : 'hover:bg-white/[0.02] border border-transparent'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon 
                  size={16} 
                  className={`transition-colors duration-500 ${isActive ? item.color : 'text-white/30 group-hover:text-white/60'}`} 
                />
                <span className={`
                  text-[10px] font-black uppercase tracking-widest transition-colors duration-500
                  ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white/40'}
                `}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* METRICAS RAPIDAS */}
      <div className="hidden xl:flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Soberanía de Datos</span>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '100%' }}
                   className="h-full bg-blue-500/50 shadow-[0_0_10px_#3b82f6]"
                />
             </div>
             <span className="text-[10px] font-black text-blue-400">ACTIVO</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5">
          <Activity size={14} className="text-green-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-white/40 uppercase tracking-tighter">BPM ESTIMADO</span>
            <span className="text-[10px] font-black text-white leading-none tracking-widest">74 <span className="text-[8px] text-white/30 font-normal">REAL-TIME</span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}

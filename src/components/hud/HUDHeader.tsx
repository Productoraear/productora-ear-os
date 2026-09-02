
"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Settings, 
  Bell, 
  Activity, 
  Zap,
  Lock,
  ChevronLeft
} from 'lucide-react';

interface HUDHeaderProps {
  onNavigateBack?: () => void;
  status?: string;
}

export const HUDHeader: React.FC<HUDHeaderProps> = ({ 
  onNavigateBack,
  status = "Master Control Online"
}) => {
  const { scrollY } = useScroll();
  
  // Animaciones de scroll para el header
  const backgroundColor = useTransform(
    scrollY, 
    [0, 50], 
    ["rgba(5, 5, 5, 0)", "rgba(5, 5, 5, 0.9)"]
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );

  return (
    <motion.header 
      style={{ backgroundColor, backdropFilter: backdropBlur }}
      className="fixed top-0 left-0 right-0 z-[100] px-8 py-4 flex items-center justify-between border-b border-gold-500/10 transition-all duration-300"
    >
      <div className="flex items-center gap-6">
        {onNavigateBack ? (
          <motion.button
            onClick={onNavigateBack}
            whileHover={{ x: -3 }}
            className="flex items-center gap-2 text-gold-500/60 hover:text-gold-500 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-gold-500/30">
              <ChevronLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Volver al HUD</span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="w-10 h-10 border border-gold-500/50 flex items-center justify-center rounded bg-black/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <Shield className="text-gold-500" size={20} />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
                <span className="gold-text">EAR OS</span> 
                <span className="text-[8px] bg-gold-500 text-black px-1 py-0.5 rounded font-bold">S-CLASS</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-medium">Logística Neural (Neural Logistics)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center gap-2 text-gold-500/80">
            <Activity size={10} className="animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">ESTADO: {status === 'Master Control Online' ? 'Control Maestro Online' : status}</span>
          </div>
          <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 mt-1 italic">Autorizado: Edwin Agudelo // CEO</p>
        </div>
        
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Search size={14} className="text-white/40" /></button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell size={14} className="text-white/40" />
            <span className="absolute top-2 right-2 w-1 h-1 bg-gold-500 rounded-full shadow-[0_0_5px_#D4AF37]"></span>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Settings size={14} className="text-white/40" /></button>
        </div>

        <div className="w-8 h-8 rounded-full border border-gold-500/30 overflow-hidden bg-zinc-900 flex items-center justify-center">
           <span className="text-[10px] font-black text-gold-500">EA</span>
        </div>
      </div>
    </motion.header>
  );
};

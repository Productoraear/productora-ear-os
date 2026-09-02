'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Lock, Cpu, ArrowRight, X } from 'lucide-react';

export type ScreenType = 
  | 'career-command-center' // Artistas (Pantalla clave)
  | 'b2b-wedding-cockpit'   // Eventos & B2B (Operativa)
  | 'vimume-landing'        // Salud & Bienestar
  | 'academy-brujula'       // Academy & Mentalidad

export interface StitchConfig {
  type: ScreenType;
  title?: string;
  description?: string;
  action?: string;
  icon?: React.ReactNode;
}

export default function StitchBridge({ config, children }: { config: StitchConfig, children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="relative w-full min-h-[600px] bg-black/60 border border-gold-500/20 rounded-[40px] overflow-hidden backdrop-blur-3xl group shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
      {/* HUD Overlay Elements */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gold-500/10 rounded-xl flex items-center justify-center border border-gold-500/20">
            <Cpu className="text-gold-500" size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Neural Bridge Active</h3>
            <p className="text-xs font-bold text-white uppercase">{config.title || config.type.replace(/-/g, ' ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">S-Class Linked</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Activity className="text-gold-500/40" size={12} />
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Buffer 0.2ms</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pt-24 p-8 relative z-10 h-full overflow-y-auto custom-scrollbar">
        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {children}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gold-500/5 border border-gold-500/10 rounded-3xl flex items-center justify-center mb-8"
            >
              {config.icon || <Shield className="text-gold-500/40" size={40} />}
            </motion.div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
              {config.title || 'Inyección de Módulo'}
            </h1>
            <p className="text-white/40 max-w-lg mb-12 italic">
              {config.description || 'Preparando la transmutation neural de este componente Stitch hacia el núcleo EAR OS.'}
            </p>
            <button 
              className="group relative px-12 py-5 bg-gold-500 text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(212,175,55,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                {config.action || 'Sincronizar Datos'} <ArrowRight size={16} />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </div>
        )}
      </div>

      {/* Tactical Footer */}
      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-center z-50 border-t border-white/5 bg-black/40 text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Lock size={8} /> Protocolo: S-CLASS</span>
          <span>Kernel: AST-003</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Stitch Bridge v2.4</span>
          <span className="text-gold-500/30">EDWIN AGUDELO PRODUCCIONES</span>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gold-500/5 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
}
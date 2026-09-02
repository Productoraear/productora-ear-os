
"use client";

import React from 'react';
import { 
  Zap, 
  RefreshCcw, 
  Lock,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HUDFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gold-500/10 bg-black/90 px-8 py-3 backdrop-blur-2xl z-[100]">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-black text-white/30">
        <div className="flex gap-10">
          <motion.span 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center gap-2 group cursor-help"
            title="Conexión segura con Firebase establecida"
          >
            <Database size={12} className="text-green-500 group-hover:scale-110 transition-transform" /> 
            <span className="group-hover:text-green-500 transition-colors">Firebase: Sincronizado</span>
          </motion.span>
          
          <span className="flex items-center gap-2 group cursor-help" title="33 habilidades de marketing activas">
            <Cpu size={12} className="text-gold-500/70 group-hover:scale-110 transition-transform" /> 
            <span className="group-hover:text-gold-500 transition-colors">Marketing Skills: 33 Active</span>
          </span>
          
          <span className="hidden md:flex items-center gap-2 group cursor-help opacity-40 hover:opacity-100 transition-opacity">
            <RefreshCcw size={12} className="animate-spin-slow" /> 
            <span>Vimume Core: Hibernando</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-4 border-l border-white/5 pl-10">
             <span className="flex items-center gap-2">
               <Globe size={10} className="text-white/20" />
               SECURE GATEWAY: ES-MADRID-01
             </span>
             <span className="flex items-center gap-2 text-gold-500/50">
               <Lock size={10} /> EAR-AES-256
             </span>
          </div>
          <p className="border-l border-white/5 pl-10">
            Diseño de Precisión // <span className="text-white/20">Urban Luxury Performance</span> // 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

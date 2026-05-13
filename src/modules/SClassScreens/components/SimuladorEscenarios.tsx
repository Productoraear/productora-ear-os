"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SimuladorEscenarios = () => {
  const [inversion, setInversion] = useState(5000);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-pane p-6"
    >
      <h3 className="text-[var(--color-gold)] font-display text-sm tracking-[0.2em] mb-4">Simulador (Proyecciones)</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs text-[var(--color-on-surface-muted)] uppercase tracking-wider block mb-2">
            Inversión B2B Simulada: {inversion}€
          </label>
          <input 
            type="range" 
            min="1000" max="20000" step="500"
            value={inversion}
            onChange={(e) => setInversion(Number(e.target.value))}
            className="w-full accent-[var(--color-gold)]"
          />
        </div>
        
        <div className="p-4 bg-[var(--color-surface)] rounded-[var(--radius-obsidian)] border border-white/5">
          <p className="text-xs text-[var(--color-on-surface-muted)] uppercase tracking-wider">Proyección Retorno (ROI)</p>
          <p className="text-2xl font-black mt-1 text-[#4ade80]">+{Math.floor(inversion * 1.45)}€</p>
        </div>
      </div>
    </motion.div>
  );
};

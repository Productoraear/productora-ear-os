"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const MotorTactico = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-pane p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)] opacity-5 blur-3xl rounded-full" />
      <h3 className="text-[var(--color-gold)] font-display text-sm tracking-[0.2em] mb-4">Motor Táctico</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="surface-card p-4">
          <p className="text-xs text-[var(--color-on-surface-muted)] uppercase tracking-wider">Oxígeno Financiero</p>
          <p className="text-3xl font-black mt-1 text-gold-gradient">84.5%</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs text-[var(--color-on-surface-muted)] uppercase tracking-wider">Tasa de Conversión</p>
          <p className="text-3xl font-black mt-1 text-white">12.3%</p>
        </div>
      </div>
    </motion.div>
  );
};

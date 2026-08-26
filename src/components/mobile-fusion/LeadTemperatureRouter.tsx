'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Snowflake, Sun, Sparkles, ArrowRight, 
  ShieldCheck, Volume2, Calendar, CheckCircle2, 
  RotateCcw, Compass, Zap
} from 'lucide-react';
import { SOVEREIGN_ARTIST } from './types';

export type LeadTemperature = 'COLD' | 'WARM' | 'HOT';

interface LeadTemperatureRouterProps {
  currentTemp: LeadTemperature;
  onTempChange: (temp: LeadTemperature) => void;
  onNavigateToStage: (stageId: string) => void;
}

export default function LeadTemperatureRouter({
  currentTemp,
  onTempChange,
  onNavigateToStage
}: LeadTemperatureRouterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const temperatures = [
    {
      id: 'COLD' as LeadTemperature,
      label: 'Frío (Descubrimiento)',
      shortLabel: '❄️ Lead Frío',
      desc: 'Estoy explorando ideas y conociendo la trayectoria de Edwin Agudelo',
      badge: 'STORYSELLING & AUTORIDAD',
      targetModule: 'story-reel',
      color: '#38bdf8'
    },
    {
      id: 'WARM' as LeadTemperature,
      label: 'Templado (Configuración & Presupuesto)',
      shortLabel: '🌤️ Lead Templado',
      desc: 'Tengo fecha tentativa y quiero comparar formatos y timeline nupcial',
      badge: 'COMBO 1: TINDER + BODAS',
      targetModule: 'combo-1',
      color: '#ecb613'
    },
    {
      id: 'HOT' as LeadTemperature,
      label: 'Caliente (Cierre & Bloqueo Atómico)',
      shortLabel: '🔥 Lead Caliente',
      desc: 'Tengo fecha confirmada y quiero bloquear la exclusividad con 100€ de depósito',
      badge: 'PRICE-LOCK STRIPE 100€',
      targetModule: 'instant-lock',
      color: '#f43f5e'
    }
  ];

  const currentMeta = temperatures.find(t => t.id === currentTemp) || temperatures[1];

  return (
    <div className="w-full bg-[#101016]/95 border border-white/15 rounded-2xl p-2.5 backdrop-blur-xl shadow-xl space-y-2 mb-3">
      
      {/* 🌡️ TEMPERATURE BAR HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: currentMeta.color }}
          />
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
            TERMÓMETRO DE VIAJE DEL CLIENTE
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/70 flex items-center gap-1 transition-all border border-white/10"
        >
          <span style={{ color: currentMeta.color }} className="font-bold">
            {currentMeta.shortLabel}
          </span>
          <span className="text-[8px] text-white/40">▼</span>
        </button>
      </div>

      {/* 🧭 3 TEMPERATURE SWITCHER BUTTONS */}
      <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-[10px] font-mono">
        {temperatures.map(t => {
          const isActive = t.id === currentTemp;
          return (
            <button
              key={t.id}
              onClick={() => {
                onTempChange(t.id);
                onNavigateToStage(t.targetModule);
              }}
              className={`py-1.5 px-2 rounded-lg text-center font-bold transition-all truncate ${
                isActive 
                  ? 'bg-white/15 text-white shadow-sm border border-white/20' 
                  : 'text-white/50 hover:text-white'
              }`}
              style={isActive ? { borderLeft: `3px solid ${t.color}` } : {}}
            >
              {t.shortLabel}
            </button>
          );
        })}
      </div>

      {/* 🗺️ EXPANDED TEMPERATURE GUIDANCE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-white/10 text-xs font-mono space-y-2 overflow-hidden"
          >
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-[11px]">{currentMeta.label}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-black/50 text-[#ecb613] font-bold">
                  {currentMeta.badge}
                </span>
              </div>
              <p className="text-[10px] text-white/60 font-light">
                {currentMeta.desc}
              </p>
            </div>

            {/* Continuous Loop Customer Journey Re-entry Point */}
            <div className="flex items-center justify-between text-[9px] text-white/40 pt-1">
              <span>● Bucle dinámico activo</span>
              <span className="text-[#ecb613]">Re-entrada disponible en cada hito</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Snowflake, Sun, Sparkles, ArrowRight, 
  ShieldCheck, Zap, Compass, RefreshCw, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLeadTemperatureStore, LeadTemperature } from '../stores/useLeadTemperatureStore';

export default function NeuralClientCompanion() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { 
    temperature, 
    score, 
    visitedPages, 
    hasCompared, 
    recordPageView, 
    setTemperature 
  } = useLeadTemperatureStore();

  useEffect(() => {
    setMounted(true);
    if (pathname) {
      recordPageView(pathname);
    }
  }, [pathname, recordPageView]);

  if (!mounted) return null;

  const tempConfigs: Record<LeadTemperature, {
    label: string;
    badge: string;
    color: string;
    icon: React.ReactNode;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  }> = {
    COLD: {
      label: 'Frío (Storytelling & Descubrimiento)',
      badge: 'STORYSELLING & AUTORIDAD',
      color: '#38bdf8',
      icon: <Snowflake className="w-4 h-4 text-sky-400" />,
      description: 'Conoce el ADN de Productora EAR, la trayectoria de Edwin Agudelo y la soberanía del Split 80/10/10.',
      ctaLabel: 'Ver Artistas S-Class',
      ctaHref: '/artistas'
    },
    WARM: {
      label: 'Templado (Comparación & Transparencia)',
      badge: 'MATRIZ TRANSPARENTE S-CLASS',
      color: '#ecb613',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      description: 'Compara nuestras tarifas sin comisiones infladas vs portales tradicionales. Sin trampa ni cartón.',
      ctaLabel: 'Abrir Matriz Comparativa',
      ctaHref: '/comparar'
    },
    HOT: {
      label: 'Caliente (Configuración & Presupuesto)',
      badge: 'PRICE-LOCK 72H SHA-256',
      color: '#f97316',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      description: 'Calibra la acústica (12 W/pax), selecciona tu equipamiento técnico y asegura la fecha de tu evento.',
      ctaLabel: 'Ir al Cotizador Inteligente',
      ctaHref: '/cotizador'
    },
    FIRE: {
      label: 'Fuego (Cierre & Bloqueo Atómico)',
      badge: 'STRIPE 100€ PRICE-LOCK',
      color: '#ff2b44',
      icon: <Zap className="w-4 h-4 text-rose-500" />,
      description: 'Tu fecha está disponible. Garantiza la exclusividad con un depósito seguro de 100,00 € en Stripe.',
      ctaLabel: 'Bloquear Exclusividad',
      ctaHref: '/cotizador?step=checkout'
    }
  };

  const currentConfig = tempConfigs[temperature];

  return (
    <aside className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-3rem)]">
      <div className="bg-[#030305]/95 border border-white/10 backdrop-blur-2xl rounded-2xl p-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] font-sans text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span 
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: currentConfig.color }}
              />
              <span 
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: currentConfig.color }}
              />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              EAR NEURAL COMPANION
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-300">
              Score: <strong className="text-white">{score} pt</strong>
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              {isOpen ? <X size={14} /> : <Compass size={14} />}
            </button>
          </div>
        </div>

        {/* Floating Quick Action Row */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
              {currentConfig.icon}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate font-syne">
                {currentConfig.label.split('(')[0]}
              </p>
              <p className="text-[10px] text-zinc-400 font-mono truncate">
                {currentConfig.badge}
              </p>
            </div>
          </div>

          <Link
            href={currentConfig.ctaHref}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold font-syne uppercase tracking-wider bg-[#ecb613] text-black hover:bg-amber-300 transition-all flex items-center gap-1 shrink-0 shadow-lg shadow-[#ecb613]/20"
          >
            <span>{currentConfig.ctaLabel.split(' ')[0]}</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Expanded Drawer Details */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10 space-y-3 overflow-hidden text-xs"
            >
              <p className="text-zinc-300 font-light leading-relaxed text-[11px]">
                {currentConfig.description}
              </p>

              {/* Temperature Selector Buttons */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Ajustar Temperatura del Lead:
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {(['COLD', 'WARM', 'HOT', 'FIRE'] as LeadTemperature[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemperature(t)}
                      className={`py-1 px-1.5 rounded-lg text-[9px] font-mono font-bold transition-all text-center border ${
                        temperature === t 
                          ? 'bg-white/15 border-white/30 text-white shadow' 
                          : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 pt-1">
                <span>Páginas exploradas: <strong>{visitedPages.length}</strong></span>
                {hasCompared && <span className="text-[#ecb613]">✓ Matriz Consultada</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </aside>
  );
}

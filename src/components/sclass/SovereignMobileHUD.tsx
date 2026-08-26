'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Home, Sliders, Calendar, Users, Zap, ShieldCheck, 
  X, MapPin, Music, Sparkles 
} from 'lucide-react';
import { useEcosystemFilterStore } from '@/store/useEcosystemFilterStore';

export function SovereignMobileHUD() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { guests, setGuests, category, setCategory } = useEcosystemFilterStore();
  const router = useRouter();

  const sheetVariants: Variants = {
    hidden: { y: '100%', opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    exit: { 
      y: '100%', 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[100] flex flex-col justify-end pointer-events-none">
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full bg-[#12121a] border border-white/10 rounded-3xl p-5 mb-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col gap-6"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block mb-1">
                    Motor Híbrido EAR
                  </span>
                  <h3 className="text-lg font-syne font-black text-white uppercase">
                    Parámetros de Reserva
                  </h3>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 text-emerald-400">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">Asistentes VIP</span>
                      <span className="block text-[10px] font-mono text-white/50">Cálculo de Presión Acústica</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0a0a0f] rounded-xl p-1 border border-white/10">
                    <button onClick={() => setGuests('adults', -5)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center">-</button>
                    <span className="font-mono text-sm font-bold w-6 text-center text-[#ecb613]">{guests.adults}</span>
                    <button onClick={() => setGuests('adults', 5)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center">+</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'musica', label: 'Música S-Class', icon: Music },
                    { id: 'espacios', label: 'Fincas & Venues', icon: MapPin },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl flex flex-col gap-2 transition-all border ${
                        category === cat.id 
                          ? 'bg-[#ecb613]/10 border-[#ecb613]/50 text-[#ecb613]' 
                          : 'bg-black/40 border-white/5 text-white/60 hover:bg-white/5'
                      }`}
                    >
                      <cat.icon size={18} />
                      <span className="text-xs font-mono font-bold">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsExpanded(false);
                  router.push('/eventos');
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d99f0b] text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
              >
                <Zap size={16} />
                <span>Aplicar Filtros Dinámicos</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVEGACIÓN INFERIOR CON RUTAS ACTIVAS */}
        <div className="w-full h-16 bg-black/80 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center justify-around px-2 shadow-2xl pointer-events-auto">
          <button 
            onClick={() => router.push('/')}
            className="flex flex-col items-center gap-1 w-16 text-white/50 hover:text-white transition-colors"
          >
            <Home size={20} />
            <span className="text-[9px] font-mono">Inicio</span>
          </button>
          
          <button 
            onClick={() => router.push('/checkout/presupuesto')}
            className="flex flex-col items-center gap-1 w-16 text-white/50 hover:text-white transition-colors"
          >
            <Calendar size={20} />
            <span className="text-[9px] font-mono">Fechas</span>
          </button>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative -top-5 w-14 h-14 bg-gradient-to-b from-[#ecb613] to-[#b3880b] rounded-full flex items-center justify-center text-black border-4 border-[#050505] shadow-[0_0_20px_rgba(236,182,19,0.4)] active:scale-90 transition-transform"
          >
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <Sliders size={22} strokeWidth={2.5} />
            </motion.div>
          </button>

          <button 
            onClick={() => router.push('/ocasiones/ayuntamientos')}
            className="flex flex-col items-center gap-1 w-16 text-white/50 hover:text-white transition-colors"
          >
            <ShieldCheck size={20} />
            <span className="text-[9px] font-mono">Garantía</span>
          </button>

          <button 
            onClick={() => router.push('/vimume')}
            className="flex flex-col items-center gap-1 w-16 text-white/50 hover:text-white transition-colors"
          >
            <Sparkles size={20} />
            <span className="text-[9px] font-mono">Oráculo</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SovereignMobileHUD;

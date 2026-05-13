'use client';
import React, { useEffect, useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  Zap, 
  Boxes, 
  ChevronRight,
  Sparkles,
  Target,
  Wind,
  Flame,
  CloudRain,
  Sun,
  ArrowRight,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import PaymentModal from './PaymentModal';
import { useAtmosphere } from '@/app/context/AtmosphereProvider';

const AtmosphereButton = ({ id, icon: Icon, label, active, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(id)}
    className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border transition-all duration-700 ${
      active 
        ? 'bg-[#d4a855] text-black border-[#d4a855] shadow-[0_20px_60px_rgba(212,168,85,0.3)]' 
        : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
    }`}
  >
    <Icon size={24} strokeWidth={1} />
    <span className="text-[9px] font-black uppercase tracking-[0.3em]">{label}</span>
  </motion.button>
);

const CostCalculator: React.FC = () => {
  const { 
    budget, 
    attendees, 
    eventType, 
    selectedPackage, 
    calculatedMargin,
    setBudget, 
    setAttendees, 
    setEventType 
  } = useCalculatorStore();

  const { atmosphere, setAtmosphere } = useAtmosphere();
  const [showPayment, setShowPayment] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    useCalculatorStore.getState().calculatePackage();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const atmospheres = [
    { id: 'elegant', label: 'Elegante', icon: Sun },
    { id: 'wild', label: 'Intenso', icon: Flame },
    { id: 'zen', label: 'Zen', icon: Wind },
    { id: 'cyber', label: 'Cyber', icon: Zap },
  ] as const;

  return (
    <div className="py-40 bg-black min-h-screen relative overflow-hidden font-manrope" onMouseMove={handleMouseMove}>
      {/* Kinetic Background Decor */}
      <motion.div 
        animate={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 168, 85, 0.08), transparent 800px)`
        }}
        className="absolute inset-0 pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <header className="mb-32 flex flex-col md:flex-row justify-between items-end gap-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] font-black uppercase tracking-[0.6em] text-[#d4a855] mb-8 flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-[#d4a855]" /> Engine Predictor v3.0
            </motion.div>
            <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-10 italic">
              Omni <span className="text-white/10">Stitch</span>
            </h1>
            <p className="text-[13px] text-white/30 uppercase tracking-[0.3em] font-bold leading-relaxed max-w-lg">
              Arquitectura de presupuestos en tiempo real con coherencia estética S-Class 2050.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {atmospheres.map(a => (
               <AtmosphereButton 
                 key={a.id} 
                 id={a.id}
                 icon={a.icon}
                 label={a.label}
                 active={atmosphere === a.id} 
                 onClick={setAtmosphere} 
               />
             ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Controls: The Dashboard */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Input Group: Budget */}
            <div className="glass-panel p-16 rounded-[3.5rem] space-y-12">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                    <Wallet size={24} strokeWidth={1} className="text-[#d4a855]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Presupuesto Maestro</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">€{budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="250000" 
                step="5000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#d4a855]"
              />
            </div>

            {/* Input Group: Attendees */}
            <div className="glass-panel p-16 rounded-[3.5rem] space-y-12">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                    <Users size={24} strokeWidth={1} className="text-[#d4a855]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Capacidad (PAX)</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{attendees} Asistentes</p>
                  </div>
                </div>
              </div>
              <input 
                type="range" 
                min="50" 
                max="5000" 
                step="50"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#d4a855]"
              />
            </div>

            {/* AI Recommendation Slot */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPackage?.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-16 border border-white/5 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Activity size={100} strokeWidth={0.5} className="text-[#d4a855]" />
                </div>
                <div className="flex items-center gap-4 mb-10">
                  <Sparkles size={18} strokeWidth={1} className="text-[#d4a855]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#d4a855]">Astra Neural Recommendation</span>
                </div>
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-8 italic">{selectedPackage?.name || "Bespoke System"}</h3>
                <div className="grid grid-cols-2 gap-6">
                   {selectedPackage?.items.map((item: string, i: number) => (
                     <div key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/30">
                       <div className="w-1.5 h-1.5 bg-[#d4a855] rounded-full" /> {item}
                     </div>
                   ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Checkout: The Trigger */}
          <div className="lg:col-span-5 sticky top-40">
            <div className="bg-white p-16 rounded-[4rem] flex flex-col gap-12 shadow-[0_60px_120px_rgba(0,0,0,0.6)]">
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30">Inversión Final Proyectada</p>
                <h2 className="text-7xl font-black text-black tracking-tighter italic">€{budget.toLocaleString()}</h2>
              </div>

              <div className="h-[1px] bg-black/5 w-full" />

              <div className="space-y-8">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-black/60">
                  <span>Reserva Blindada</span>
                  <span className="text-black font-black">1.000,00 €</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-black/60">
                  <span>Fee Operativo</span>
                  <span className="text-black font-black">€{calculatedMargin.toFixed(0)}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPayment(true)}
                className="w-full py-10 bg-black text-white rounded-3xl font-black uppercase tracking-[0.5em] text-[12px] flex items-center justify-center gap-5 group hover:bg-[#d4a855] transition-all shadow-2xl"
              >
                Activar Protocolo <ArrowRight size={20} strokeWidth={1} className="group-hover:translate-x-3 transition-transform" />
              </motion.button>

              <div className="flex flex-col items-center gap-6">
                <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em] text-center max-w-[250px] leading-relaxed">
                  Transacción protegida por el núcleo de seguridad EAR OS V2.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        amount={budget} 
        concept={`Reserva S-Class 2050: ${selectedPackage?.name || eventType}`} 
      />
    </div>
  );
};

export default CostCalculator;

"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Truck, Shield, ArrowRight, Zap, Play, CheckCircle2, Music } from 'lucide-react';

export default function TacticalDeploymentForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(prev => prev + 1);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[600px] bg-[#050505] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row transition-all duration-700 selection:bg-[#d4af37] selection:text-black">
      
      {/* Left Column: Tactical Map Simulator */}
      <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-[#0a0a0a] relative border-r border-white/5 overflow-hidden">
        {/* Radar Effect Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 border border-[#d4af37]/10 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-20 border border-[#d4af37]/10 rounded-full animate-ping opacity-10" />
            <div className="absolute inset-40 border border-[#d4af37]/10 rounded-full animate-ping opacity-5" />
          </div>
          
          {/* Tactical Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Floating Icons Assets */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-full flex items-center justify-center text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            <Navigation className="w-8 h-8 fill-current" />
          </motion.div>

          <div className="absolute top-20 left-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/50 border border-white/10 animate-pulse">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">Unit E-01</span>
            </div>
          </div>

          <div className="absolute bottom-20 right-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/50 border border-white/10 animate-pulse">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">Protocol S-Class</span>
            </div>
          </div>
        </div>

        {/* Real-time Intel HUD */}
        <div className="absolute bottom-6 left-6 z-20 space-y-1">
          <div className="flex items-center gap-2 text-[#d4af37] text-[10px] font-black uppercase tracking-[0.3em] font-mono">
            <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse" />
            LIVE_LOGISTICS_INTEL
          </div>
          <div className="text-white/40 text-[9px] font-mono leading-none tracking-tighter">
            LAT: 40.4168 // LON: -3.7038 // STATUS: READY_FOR_DEPLOY
          </div>
        </div>
      </div>

      {/* Right Column: Deployment Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col overflow-y-auto">
        <div className="mb-8 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.5em] font-mono">Mission Control</span>
            <h3 className="text-white text-3xl font-black tracking-tighter uppercase leading-tight">SOLICITAR <br /> DESPLIEGUE</h3>
          </div>
          <div className="text-right">
            <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Step</div>
            <div className="text-white font-black text-2xl font-mono">{step}/03</div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="flex-1 space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="group space-y-2">
                    <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest px-4 block">Pick-up Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                      <input 
                        type="text" 
                        placeholder="📍 Introducir Ubicación del Evento..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none focus:bg-white/10 transition-all font-medium placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group space-y-2">
                      <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest px-4 block">Fecha</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                        <input type="text" placeholder="DD/MM/YYYY" className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none transition-all font-medium placeholder:text-zinc-700" />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest px-4 block">Duración</label>
                      <div className="relative">
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none transition-all font-medium appearance-none">
                          <option>4 Horas (Estándar)</option>
                          <option>8 Horas (Full Event)</option>
                          <option>Ilimitado (S-Class)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest px-4 block">Seleccionar Arsenal</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/5 border border-[#d4af37]/30 p-4 rounded-2xl flex items-center justify-between group hover:bg-[#d4af37]/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#d4af37]">
                          <Music size={24} />
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-black uppercase tracking-tight">Tech Bundle: Pro Audio</h4>
                          <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Sistema HK Audio + Mesa Pioneer</p>
                        </div>
                      </div>
                      <div className="text-[#d4af37] text-xs font-black">+€450</div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500">
                          <Zap size={24} />
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-black uppercase tracking-tight">Visual Deployment</h4>
                          <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Muros LED + Control Mapeado</p>
                        </div>
                      </div>
                      <div className="text-zinc-600 text-xs font-black">+€1.200</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-6 py-12"
              >
                <div className="w-24 h-24 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full flex items-center justify-center text-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-white text-2xl font-black uppercase tracking-tight mb-2">ORDEN RECIBIDA</h4>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-mono leading-relaxed">
                    ANALIZANDO LOGÍSTICA // ASIGNANDO RECURSOS // PREPARANDO DESPLIEGUE TÁCTICO
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-zinc-700 text-[8px] font-black uppercase tracking-widest">Estimated Impact Value</span>
            <span className="text-[#d4af37] font-black font-mono text-xl tabular-nums tracking-tighter">€12.500,00</span>
          </div>
          
          {step < 3 && (
            <button 
              onClick={handleNext}
              disabled={loading}
              className="h-16 px-10 rounded-full bg-[#d4af37] text-black text-xs font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-[#f0c541] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  CONFIRMAR FASE <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          )}

          {step === 3 && (
            <button className="h-16 px-10 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:scale-105 transition-all">
              COMMAND CENTER <Play className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

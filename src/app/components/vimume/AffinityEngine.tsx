"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BrainCircuit, PlayCircle, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib';

export default function AffinityEngine() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ year: '', region: '' });
  const [isScanning, setIsScanning] = useState(false);

  const handleAnalyze = () => {
    if (!formData.year || !formData.region) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep(2);
    }, 3000); // 3 seconds of "Astra" scanning
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1 bg-gradient-to-b from-[#ecb613]/20 to-transparent rounded-3xl">
      <div className="bg-[#050505] rounded-[22px] border border-white/10 p-6 md:p-10 relative overflow-hidden">
        
        {/* Background Glow (Aura-Gamma) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#ecb613]/10 to-[#ff00a0]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <BrainCircuit className="text-[#ecb613] w-8 h-8" />
            <h2 className="text-2xl md:text-3xl font-syne font-bold text-white">
              Motor de Afinidad <span className="text-[#ecb613]">Neuronal</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && !isScanning && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Año de Nacimiento del Sujeto
                  </label>
                  <input 
                    type="number" 
                    placeholder="Ej. 1945"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-[#ecb613]/50 focus:outline-none focus:ring-1 focus:ring-[#ecb613]/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} /> Contexto Geográfico Vital
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. Madrid, Andalucía..."
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-[#ecb613]/50 focus:outline-none focus:ring-1 focus:ring-[#ecb613]/50 transition-all"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    onClick={handleAnalyze}
                    className="w-full bg-[#ecb613] text-black font-bold text-lg py-4 rounded-xl hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Activity size={20} />
                    INICIAR ESCANEO DE IMPACTO (ASTRA)
                  </button>
                </div>
              </motion.div>
            )}

            {isScanning && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 space-y-6"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-24 h-24 rounded-full border-t-2 border-r-2 border-[#ecb613] flex items-center justify-center animate-spin"
                >
                  <BrainCircuit className="text-[#ecb613] animate-none w-10 h-10" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[#ecb613] font-mono text-sm uppercase tracking-widest">Sincronizando Genoma Musical...</p>
                  <p className="text-white/40 text-xs">Cruzando data de {formData.year} en {formData.region}</p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#ecb613]/20 text-[#ecb613] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 size={14} /> Protocolo Encontrado
                    </div>
                    <h3 className="text-2xl font-bold text-white">Vector: {formData.region} {formData.year}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Astra ha identificado una ventana de plasticidad neuronal óptima. La estimulación a 40Hz combinada con el paisaje sonoro de su juventud proyecta una <strong className="text-[#ecb613]">recuperación de respuesta emocional del 42%</strong> en las primeras sesiones.
                    </p>
                  </div>
                  <div className="w-full md:w-auto">
                    <button className="w-full whitespace-nowrap bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-[#ecb613] transition-colors flex items-center justify-center gap-2">
                      <PlayCircle size={18} />
                      DESCARGAR DOSSIER B2G
                    </button>
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="text-white/40 text-xs hover:text-white transition-colors underline underline-offset-4">
                  Realizar nueva simulación
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
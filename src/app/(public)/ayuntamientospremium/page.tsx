"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Scale, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Zap,
  Calculator,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glassCard";

// ============================================================================
// 🏛️ AYUNTAMIENTOS PREMIUM: PROTOCOLO VIMUME SOCIAL (S-CLASS)
// ============================================================================

export default function AyuntamientosPremium() {
  const [selectedAyuntamiento, setSelectedAyuntamiento] = useState("Navalcarnero");
  const [totalBudget, setTotalBudget] = useState(12500);
  const [allocation, setAllocation] = useState({
    sessions: 8500,
    metrics: 2500,
    events: 1500
  });

  // Lógica de recalibración presupuestaria (Fotosíntesis de Tokens)
  const handleBudgetChange = (key: keyof typeof allocation, value: number) => {
    const diff = value - allocation[key];
    if (totalBudget + diff >= 0) {
      setAllocation(prev => ({ ...prev, [key]: value }));
      setTotalBudget(prev => prev + diff);
    }
  };

  const odsData = [
    { id: 3, name: "Salud y Bienestar", impact: "Mejora cognitiva 40Hz", color: "#4ade80" },
    { id: 10, name: "Reducción Desigualdades", impact: "Inclusión Senior", color: "#facc15" },
    { id: 11, name: "Ciudades Sostenibles", impact: "Envejecimiento Activo", color: "#fb923c" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Decor - S-Class Aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#d4a855]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#d4a855]/3 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-1 bg-[#d4a855]" />
              <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em]">Protocolo Institucional</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">
              VIMUME <span className="text-[#d4a855] not-italic">SOCIAL</span>
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
              Gestión de Impacto y Presupuesto ODS (Nivel 3)
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <GlassCard className="px-8 py-4 border-[#d4a855]/20 bg-[#d4a855]/5">
              <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Entidad Detectada (BOE)</p>
              <div className="flex items-center gap-3">
                <Building2 className="text-[#d4a855]" size={20} />
                <span className="font-black text-xl uppercase tracking-tight">{selectedAyuntamiento}</span>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: ESTRATEGIA Y ODS */}
          <div className="space-y-8">
            <GlassCard className="p-8 border-white/5 bg-white/[0.02]">
              <h2 className="text-xl font-black uppercase tracking-tight mb-10 flex items-center gap-3">
                <Scale className="text-[#d4a855]" size={22} /> Alineación ODS
              </h2>
              <div className="space-y-8">
                {odsData.map(ods => (
                  <motion.div 
                    key={ods.id} 
                    whileHover={{ x: 5 }}
                    className="group cursor-default relative pl-6 border-l border-white/10"
                  >
                    <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[#d4a855] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-[#d4a855] uppercase">Objetivo {ods.id}</span>
                      <CheckCircle2 size={16} className="text-[#d4a855] opacity-50" />
                    </div>
                    <p className="text-lg font-black text-white mb-1 uppercase tracking-tight">{ods.name}</p>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{ods.impact}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-[#d4a855]/20 bg-gradient-to-br from-[#d4a855]/10 to-transparent">
              <h2 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                <TrendingUp className="text-[#d4a855]" size={22} /> ROI Social Alpha
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-[8px] text-white/40 uppercase font-black mb-1 tracking-widest">Multiplicador</p>
                    <p className="text-3xl font-black text-[#d4a855]">4.2x</p>
                  </div>
                  <BarChart3 size={32} className="text-[#d4a855]/20" />
                </div>
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-[8px] text-white/40 uppercase font-black mb-1 tracking-widest">Alcance Senior</p>
                    <p className="text-3xl font-black text-white">450+</p>
                  </div>
                  <Users size={32} className="text-white/10" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* COLUMNA CENTRAL: DESGLOSE PRESUPUESTARIO INTERACTIVO */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-10 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Calculator size={120} />
              </div>
              
              <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                    Ingeniería <span className="text-[#d4a855] not-italic">Presupuestaria</span>
                  </h2>
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Ajuste en Tiempo Real (S-Class)</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Presupuesto Ejecutado</p>
                  <motion.p 
                    key={totalBudget}
                    initial={{ scale: 1.1, color: "#d4a855" }}
                    animate={{ scale: 1, color: "#d4a855" }}
                    className="text-5xl font-black"
                  >
                    €{totalBudget.toLocaleString()}
                  </motion.p>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                {/* MÓDULO 1 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-[#d4a855]" />
                      <span className="text-xs font-black uppercase tracking-widest">Ciclo VIMUME (10 Sesiones)</span>
                    </div>
                    <span className="font-black text-[#d4a855]">€{allocation.sessions.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="5000" max="15000" step="500"
                    value={allocation.sessions}
                    onChange={(e) => handleBudgetChange('sessions', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#d4a855]"
                  />
                </div>

                {/* MÓDULO 2 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                      <BarChart3 size={16} className="text-[#d4a855]" />
                      <span className="text-xs font-black uppercase tracking-widest">VIMUME Tracker Panel</span>
                    </div>
                    <span className="font-black text-[#d4a855]">€{allocation.metrics.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="1000" max="5000" step="100"
                    value={allocation.metrics}
                    onChange={(e) => handleBudgetChange('metrics', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#d4a855]"
                  />
                </div>

                {/* MÓDULO 3 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-[#d4a855]" />
                      <span className="text-xs font-black uppercase tracking-widest">Jornada Intergeneracional</span>
                    </div>
                    <span className="font-black text-[#d4a855]">€{allocation.events.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="500" max="3000" step="100"
                    value={allocation.events}
                    onChange={(e) => handleBudgetChange('events', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#d4a855]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-[2] bg-[#d4a855] text-black h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_35px_rgba(212,168,85,0.25)]">
                  <FileText size={20} /> Generar Dossier Institucional
                </button>
                <button className="flex-1 bg-white/5 border border-white/10 text-white h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  Reset <ArrowRight size={16} className="rotate-180" />
                </button>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-6">
                <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Vencimiento Partida</p>
                  <p className="text-lg font-black text-white uppercase italic">14 Días Restantes</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-6">
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Equipo de Campo</p>
                  <p className="text-lg font-black text-white uppercase italic">4 Técnicos Listos</p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Zap, Activity, TrendingUp, AlertTriangle, 
  Target, Cpu, Globe, Shield, Sparkles, Database,
  Search, ShieldCheck
} from 'lucide-react';
import { useEmpireStore } from '@/stores/useEmpireStore'; // INYECCIÓN DE SANGRE REAL

export function AstraNeuralTwin() {
  // --- SISTEMA NERVIOSO (DATOS REALES) ---
  const { pipeline, soberanos } = useEmpireStore();

  // --- ESTADOS DE TEATRO UX (SU LÓGICA) ---
  const [estaSinapsis, setEstaSinapsis] = useState(false);
  const [consultaOraculo, setConsultaOraculo] = useState('');
  const [resultadoOraculo, setResultadoOraculo] = useState<any>(null);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setEstaSinapsis(true);
      setTimeout(() => setEstaSinapsis(false), 2000);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const consultarOraculo = async () => {
    if (!consultaOraculo) return;
    setEstaSinapsis(true);
    setTimeout(() => {
      setResultadoOraculo({
        recomendacion: `Astra sugiere procesar los ${soberanos?.length || 0} soberanos con un Surge Pricing del +15%.`,
        razonamiento: `Detectado volumen de capital de €${(pipeline || 0).toLocaleString()} en pipeline. Capacidad logística al límite.`,
        confianza: 96,
        beneficio: `€${((pipeline || 0) * 0.15).toLocaleString()} adicionales proyectados.`
      });
      setEstaSinapsis(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      {/* CABECERA: EL CEREBRO DEL IMPERIO */}
      <div className="flex justify-between items-center bg-black/40 border border-[#d4a855]/20 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(212,168,85,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a855]/5 blur-[80px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a855] to-[#f0d78c] flex items-center justify-center shadow-[0_0_30px_rgba(212,168,85,0.3)] transition-all duration-1000 ${estaSinapsis ? 'scale-110 rotate-3' : ''}`}>
              <Brain size={32} className="text-black" />
            </div>
            {estaSinapsis && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping border-2 border-black" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">GEMELO NEURAL <span className="text-[#d4a855]">ASTRA</span></h2>
            <p className="text-[10px] text-[#d4a855] uppercase tracking-[0.3em] font-bold mt-1">Sincronizado con Pipeline Real: €{(pipeline || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-4 text-right">
          <div className="glass-pane px-4 py-2 border-[#d4a855]/20 bg-black/40">
            <p className="text-[8px] text-white/30 uppercase font-black">Soberanos en Matriz</p>
            <p className="text-xl font-black text-[#d4a855]">{soberanos?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* GRID DEL ORÁCULO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-pane p-6 bg-white/[0.01] border-white/5 relative">
          <div className="flex items-center gap-3 mb-6">
            <Activity size={20} className="text-[#d4a855]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Flujo de Conciencia Digital</h3>
          </div>
          <div className="space-y-4 text-xs font-medium text-white/40">
            <p className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#d4a855] rounded-full" /> 
              Escaneando {soberanos?.length || 0} entidades activas en la Matriz...
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#d4a855] rounded-full" /> 
              Capital total monitorizado: <span className="text-white/80 font-black">€{(pipeline || 0).toLocaleString()}</span>
            </p>
            <p className="flex items-center gap-2 animate-pulse">
              <span className="w-1 h-1 bg-green-500 rounded-full" /> 
              Astra detecta optimización de margen en contratos actuales.
            </p>
          </div>
          
          {/* Gráfico Visual de fondo (Decorativo) */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a855]/20 to-transparent" />
        </div>

        <div className="glass-pane p-6 border-[#d4a855]/30 bg-[#d4a855]/5">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={20} className="text-[#d4a855]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Consultar al Oráculo</h3>
          </div>
          <input 
            type="text"
            value={consultaOraculo}
            onChange={(e) => setConsultaOraculo(e.target.value)}
            placeholder="Ej: ¿Siguiente paso estratégico?"
            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-[#d4a855]/50 focus:outline-none mb-4 placeholder:opacity-30"
          />
          <button 
            onClick={consultarOraculo}
            className="w-full py-3 rounded-xl bg-[#d4a855] text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_10px_20px_rgba(212,168,85,0.2)]"
          >
            {estaSinapsis ? 'PROCESANDO SINAPSIS...' : 'EJECUTAR CONSULTA'}
          </button>

          <AnimatePresence>
            {resultadoOraculo && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-xl bg-black/40 border border-[#d4a855]/20 space-y-3 shadow-inner"
              >
                <div className="flex items-center gap-2 text-[#d4a855]">
                  <ShieldCheck size={14} />
                  <p className="text-[10px] font-black uppercase">Respuesta del Oráculo</p>
                </div>
                <p className="text-xs font-bold text-white/90 leading-tight">{resultadoOraculo.recomendacion}</p>
                <div className="pt-2 border-t border-white/5">
                   <p className="text-[9px] text-[#d4a855] font-black uppercase mb-1">Impacto Estimado</p>
                   <p className="text-sm font-black text-green-400">{resultadoOraculo.beneficio}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AstraNeuralTwin;

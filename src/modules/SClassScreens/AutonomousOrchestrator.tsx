"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Shield, Cpu, Activity, Power, Terminal, 
  ChevronRight, AlertCircle, TrendingUp, DollarSign,
  Maximize2, Workflow
} from 'lucide-react';
import { empireLoop, EventoSoberano } from '@/lib/services/EmpireLoop';

// ─────────────────────────────────────────────────────
// COMPONENTE: ORQUESTADOR AUTÓNOMO (NIVEL 10)
// ─────────────────────────────────────────────────────
export function AutonomousOrchestrator() {
  const [estaActivo, setEstaActivo] = useState(false);
  const [registros, setRegistros] = useState<EventoSoberano[]>([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [activosDesplegados, setActivosDesplegados] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = empireLoop.suscribir((evento) => {
      setRegistros(prev => {
        if (prev.some(log => log.id === evento.id)) return prev;
        return [evento, ...prev].slice(0, 50);
      });
      
      if (evento.tipo === 'CIERRE_VENTA') {
        const cantidad = parseInt(evento.mensaje.replace(/[^0-9]/g, '')) || 0;
        setIngresosTotales(prev => prev + cantidad);
      }
      if (evento.tipo === 'ASIGNACION_FLOTA') {
        setActivosDesplegados(prev => prev + 1);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (estaActivo) {
      empireLoop.executeAutonomousCycle();
    } else {
      empireLoop.desactivarModoSoberano();
    }
  }, [estaActivo]);

  return (
    <div className="glass-pane border-[#d4a855]/30 overflow-hidden relative min-h-[500px] flex flex-col">
      {/* GLOW DE FONDO S-CLASS */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#d4a855]/5 to-transparent transition-opacity duration-1000 ${estaActivo ? 'opacity-100' : 'opacity-0'}`} />

      {/* CABECERA: CONTROL MODO SOBERANO */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${estaActivo ? 'bg-[#d4a855] shadow-[0_0_30px_rgba(212,168,85,0.4)] text-black' : 'bg-white/5 text-white/40'}`}>
            <Workflow size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">ORQUESTADOR <span className="text-[#d4a855]">DEL IMPERIO</span></h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Nivel 10: Dominancia Total Autónoma</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[8px] text-white/30 uppercase font-bold">Ingresos Autónomos</p>
            <p className="text-lg font-black text-[#d4a855]">€{ingresosTotales.toLocaleString()}</p>
          </div>
          
          <button 
            onClick={() => setEstaActivo(!estaActivo)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              estaActivo 
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600' 
              : 'bg-gradient-to-r from-[#d4a855] to-[#f0d78c] text-black shadow-[0_0_20px_rgba(212,168,85,0.2)] hover:scale-105'
            }`}
          >
            <Power size={16} />
            {estaActivo ? 'DESACTIVAR MODO SOBERANO' : 'ACTIVAR PILOTO AUTOMÁTICO'}
          </button>
        </div>
      </div>

      {/* CUERPO: CONSOLA TÁCTICA & MONITOR */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-x divide-white/5 relative z-10">
        
        {/* MONITOR DE TELEMETRÍA */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Telemetría del Imperio</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <TarjetonEstado etiqueta="Eficiencia Operativa" valor="99.8%" tendencia="+2.4%" />
              <TarjetonEstado etiqueta="Contratos Cerrados (AI)" valor="142" tendencia="+12" />
              <TarjetonEstado etiqueta="Activos Desplegados" valor={activosDesplegados.toString()} tendencia="VIVO" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/30 font-bold uppercase">Estado de Astra</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded ${estaActivo ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                {estaActivo ? 'SINAPSIS ACTIVA' : 'EN ESPERA'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={estaActivo ? { width: ['0%', '100%'] } : { width: '0%' }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="h-full bg-[#d4a855]"
              />
            </div>
          </div>
        </div>

        {/* CONSOLA DE REGISTROS SOBERANOS */}
        <div className="lg:col-span-2 bg-black/20 flex flex-col h-[400px]">
          <div className="p-3 bg-black/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-[#d4a855]" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Consola del Núcleo Fénix</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
              <div className="w-2 h-2 rounded-full bg-green-500/20" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono custom-scrollbar">
            <AnimatePresence initial={false}>
              {registros.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-[11px] flex gap-3 py-1 border-b border-white/[0.02] ${
                    log.estado === 'CRITICO' ? 'text-red-400' : 
                    log.estado === 'ADVERTENCIA' ? 'text-yellow-400' : 
                    'text-white/70'
                  }`}
                >
                  <span className="text-white/20 shrink-0">[{log.timestamp.toLocaleTimeString()}]</span>
                  <span className={`font-black shrink-0 ${
                    log.tipo === 'VAMPIRIZACION' ? 'text-blue-400' :
                    log.tipo === 'PROCESAMIENTO_ASTRA' ? 'text-[#d4a855]' :
                    log.tipo === 'ASIGNACION_FLOTA' ? 'text-purple-400' :
                    'text-green-400'
                  }`}>
                    {log.tipo}:
                  </span>
                  <span className="leading-tight">{log.mensaje}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {!estaActivo && registros.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Workflow size={48} className="mb-4" />
                <p className="text-[10px] uppercase font-bold tracking-widest">Esperando ignición soberana...</p>
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}

function TarjetonEstado({ etiqueta, valor, tendencia }: { etiqueta: string, valor: string, tendencia: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center group hover:border-[#d4a855]/20 transition-all">
      <div>
        <p className="text-[8px] text-white/30 uppercase font-black">{etiqueta}</p>
        <p className="text-lg font-black text-white mt-0.5">{valor}</p>
      </div>
      <div className={`px-2 py-1 rounded text-[8px] font-black ${tendencia.includes('+') || tendencia === 'VIVO' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        {tendencia}
      </div>
    </div>
  );
}

export default AutonomousOrchestrator;

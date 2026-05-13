"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEmpireStore } from '@/stores/useEmpireStore';

export function FenixConsole() {
  const logs = useEmpireStore((state) => state.logs);

  const getLogIcon = (nivel: string) => {
    switch (nivel) {
      case 'INICIO': return <Zap size={12} className="text-[#d4a855]" />;
      case 'VAMPIRIZACION': return <Terminal size={12} className="text-purple-400" />;
      case 'CRM': return <Info size={12} className="text-blue-400" />;
      case 'ORACULO': return <Zap size={12} className="text-amber-400" />;
      case 'EXITO': return <CheckCircle size={12} className="text-green-400" />;
      default: return <Info size={12} className="text-white/40" />;
    }
  };

  return (
    <div className="glass-pane bg-black/60 border-white/5 h-[400px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#d4a855]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Consola Fénix - Telemetría en Vivo</h3>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-amber-500/20" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {logs.slice().reverse().map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 py-1 group"
            >
              <span className="text-white/20 shrink-0">[{new Date().toLocaleTimeString()}]</span>
              <div className="shrink-0 mt-0.5">{getLogIcon(log.nivel)}</div>
              <div className="flex-1">
                <span className="text-white/40 uppercase mr-2 font-bold">{log.nivel}:</span>
                <span className="text-white/80">{log.mensaje}</span>
                {log.tipo && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                    log.tipo === 'SUCCESS' ? 'bg-green-500/10 text-green-500' :
                    log.tipo === 'ERROR' ? 'bg-red-500/10 text-red-500' :
                    log.tipo === 'WARNING' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {log.tipo}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/10 uppercase tracking-widest italic">
            Esperando ignición del Bucle Imperio...
          </div>
        )}
      </div>
    </div>
  );
}

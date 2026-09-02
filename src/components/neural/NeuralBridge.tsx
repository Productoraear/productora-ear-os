
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Terminal, Zap, Send, ShieldCheck, Sparkles } from 'lucide-react';

interface LogEntry {
  id: string;
  source: 'ASTRA' | 'QWEN' | 'SYSTEM';
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'neural';
}

export const NeuralBridge: React.FC = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      source: 'SYSTEM',
      message: 'Neural Bridge v1.0.4 - Conexión establecida.',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info'
    },
    {
      id: '2',
      source: 'ASTRA',
      message: 'Esperando directivas estratégicas de QWEN para optimización del Ecosistema EAR.',
      timestamp: new Date().toLocaleTimeString(),
      type: 'neural'
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleInyectar = () => {
    if (!input.trim()) return;

    let qwenAction = input.trim(); // Assume input is the action for now
    let messageForLog = input;
    let logType: LogEntry['type'] = 'neural';
    let astraResponseMessage = 'Directiva recibida. Iniciando análisis de impacto...';

    // Ejecutar acciones según el comando de Qwen
    switch(qwenAction) {
      case 'UPDATE_STRATEGY':
        messageForLog = 'DIRECTIVA NEURAL DETECTADA: Optimizando Retención VIP y Logística de Eventos siguiendo el Plan Qwen.';
        logType = 'success';
        astraResponseMessage = 'Compilando servicios: LogisticsService.ts y VIPService.ts actualizados. El HUD ahora refleja el estándar S-Class de Qwen.';
        console.log("[NEURAL] Actualizando estrategia con Directiva VIP...");
        break;
      case 'INIT_10X_MATRIX':
        messageForLog = 'DIRECTIVA NEURAL DETECTADA: Inicializando Matriz 10x para optimización de rendimiento.';
        logType = 'success';
        astraResponseMessage = 'Matriz 10x activada. Monitoreando KPIs de rendimiento en tiempo real.';
        console.log("[NEURAL] Inicializando Matriz 10x...");
        break;
      case 'TRANSMUTE_LEGACY':
        messageForLog = 'DIRECTIVA NEURAL DETECTADA: Iniciando Transmutación del Legado.';
        logType = 'warning';
        astraResponseMessage = 'Proceso de transmutación iniciado. Verificando compatibilidad de módulos.';
        console.log("[NEURAL] Iniciando Transmutación del Legado...");
        break;
      default:
        console.log("[NEURAL] Acción no reconocida:", qwenAction);
        // Default message and type remain 'neural'
    }

    const newLog: LogEntry = {
      id: Date.now().toString(),
      source: 'QWEN',
      message: messageForLog,
      timestamp: new Date().toLocaleTimeString(),
      type: logType
    };

    setLogs(prev => [...prev, newLog]);
    setInput('');

    // Simular procesamiento de ASTRA
    setTimeout(() => {
      setLogs(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        source: 'ASTRA',
        message: astraResponseMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: 'success'
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border border-gold-500/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/10 bg-gradient-to-r from-black via-zinc-900 to-black">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-500/20 rounded-lg">
            <Brain className="text-gold-500 w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">Puente Neural</h2>
            <p className="text-[10px] text-gold-500/50 font-black tracking-tighter uppercase">ASTRA CORE ⇄ QWEN STRAT</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Sincronizado</span>
        </div>
      </div>

      {/* Logs Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[11px] leading-relaxed scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-4 p-3 rounded-lg border ${
                log.source === 'QWEN' ? 'bg-blue-500/5 border-blue-500/20' : 
                log.source === 'ASTRA' ? 'bg-gold-500/5 border-gold-500/20' : 
                'bg-zinc-900/50 border-white/5'
              }`}
            >
              <div className="flex-shrink-0 font-black opacity-50 w-16">[{log.timestamp}]</div>
              <div className="flex-shrink-0 font-black w-14 uppercase tracking-tighter" style={{ 
                color: log.source === 'QWEN' ? '#3b82f6' : log.source === 'ASTRA' ? '#d4af37' : '#71717a'
              }}>
                {log.source}:
              </div>
              <div className={`flex-1 ${log.type === 'neural' ? 'text-blue-100 font-medium' : 'text-zinc-400'}`}>
                {log.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-zinc-900/50 border-t border-gold-500/10">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pega aquí el comando estratégico de QWEN..."
            className="w-full bg-black/60 border border-gold-500/20 rounded-xl p-4 pr-16 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-gold-500/50 transition-all resize-none h-24"
          />
          <button 
            onClick={handleInyectar}
            disabled={!input.trim()}
            className="absolute bottom-4 right-4 p-3 bg-gold-500 text-black rounded-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
          >
            <Zap size={16} fill="currentColor" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-green-500" /> AES-ENTROPY</span>
            <span className="flex items-center gap-1"><Sparkles size={10} className="text-gold-500" /> 33 SKILLS ACTIVE</span>
          </div>
          <span>v1.0.4-NEURAL</span>
        </div>
      </div>
    </div>
  );
};

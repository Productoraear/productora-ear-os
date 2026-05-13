"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const ShieldTracker: React.FC = () => {
  // Simulamos los nodos orbitales de la misión
  const orbitalNodes = [
    { id: 1, label: "Estado Legal", status: "COMPLETED", desc: "Contrato firmado y securizado", icon: "⚖️" },
    { id: 2, label: "Liquidación", status: "IN_PROGRESS", desc: "Depósito blindado. Siguiente hito: -30 días", icon: "💰" },
    { id: 3, label: "Talento Táctico", status: "PENDING", desc: "Ensayos acústicos pendientes", icon: "🎧" },
    { id: 4, label: "Despliegue", status: "PENDING", desc: "Coordinación logística Finca Premium", icon: "🚁" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-16 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-emerald-500 font-mono text-sm tracking-widest uppercase">Misión Activa</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Radar de <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">Misión</span>
          </h1>
          <p className="text-zinc-500 font-mono text-sm">OPERACIÓN: OP-2026-OMNI | FECHA DE IMPACTO: T-142 DÍAS</p>
        </header>

        {/* Nodos Orbitales (Radar UI) */}
        <div className="relative">
          {/* Línea conectora central */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {orbitalNodes.map((node, index) => {
              const isCompleted = node.status === 'COMPLETED';
              const isInProgress = node.status === 'IN_PROGRESS';
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' :
                    isInProgress ? 'bg-amber-500/5 border-amber-500/20' :
                    'bg-white/[0.01] border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-2xl opacity-80">{node.icon}</span>
                    <span className={`text-[10px] font-mono px-2 py-1 rounded-full ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-500' :
                      isInProgress ? 'bg-amber-500/10 text-amber-500' :
                      'bg-white/5 text-zinc-500'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-2">{node.label}</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">{node.desc}</p>
                  
                  {isInProgress && (
                    <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-1/2 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Panel Inferior: Telemetría */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-16 p-8 bg-white/[0.02] border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Comandante a Cargo</p>
            <p className="text-white font-medium">Edwin Agudelo (Alpha 1)</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Nivel de Seguridad</p>
            <p className="text-emerald-500 font-mono">PLATINUM SHIELD</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Última Sincronización</p>
            <p className="text-zinc-300 font-mono text-sm">Hace 2 minutos (Nexus V2)</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

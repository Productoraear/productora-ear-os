"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hash, Globe, Zap, DollarSign, Database, Server, Cpu } from "lucide-react";

export const NeuralNexus = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse(prev => (prev + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { name: "CFO (GEMA 3)", icon: DollarSign, color: "text-[#d4af37]", pos: "top-0 left-1/2 -translate-x-1/2" },
    { name: "COO (GEMA 4)", icon: Zap, color: "text-emerald-400", pos: "bottom-0 left-1/2 -translate-x-1/2" },
    { name: "BÓVEDA (1829)", icon: Database, color: "text-blue-400", pos: "left-0 top-1/2 -translate-y-1/2" },
    { name: "ARK (94K)", icon: Server, color: "text-purple-400", pos: "right-0 top-1/2 -translate-y-1/2" },
  ];

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center p-8 overflow-hidden rounded-[4rem] bg-gradient-to-b from-zinc-900/50 to-black border border-white/5">
      {/* Background Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-[400px] h-[400px] rounded-full border border-[#d4af37]/10 transition-transform duration-1000 ${pulse % 2 === 0 ? "scale-110 opacity-20" : "scale-100 opacity-10"}`} />
        <div className={`w-[300px] h-[300px] rounded-full border border-[#d4af37]/20 transition-transform duration-700 ${pulse % 2 !== 0 ? "scale-110 opacity-20" : "scale-100 opacity-10"}`} />
      </div>

      {/* Center Core */}
      <div className="relative z-10 w-48 h-48 bg-black border border-[#d4af37]/30 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(236,182,19,0.2)]">
        <Cpu className="w-12 h-12 text-[#d4af37] animate-pulse" />
        <span className="font-mono text-[10px] text-[#d4af37] mt-4 tracking-widest uppercase">EAR OS CORE</span>
        <span className="font-mono text-[8px] text-zinc-500 mt-1">v2.4 ACTIVE</span>
      </div>

      {/* Nodes */}
      {nodes.map((node, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.2 }}
          className={`absolute ${node.pos} bg-zinc-900 border border-white/10 p-6 rounded-3xl flex items-center gap-4 hover:border-[#d4af37]/40 transition-all cursor-pointer group shadow-2xl`}
        >
          <div className={`p-4 bg-black/50 rounded-2xl group-hover:scale-110 transition-transform ${node.color}`}>
            <node.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">NODE_{idx + 1}</p>
            <p className="text-sm font-bold text-white uppercase">{node.name}</p>
          </div>
          
          {/* Connector Lines (Simulated with div/css) */}
          <div className="absolute top-1/2 left-1/2 -z-10 w-[200px] h-[2px] bg-gradient-to-r from-[#d4af37]/50 to-transparent pointer-events-none origin-left opacity-20" />
        </motion.div>
      ))}

      {/* Floating Data Streams */}
      <div className="absolute bottom-20 left-10 text-left">
          <div className="flex gap-2 items-center text-[#d4af37] mb-2">
            <Globe className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase">Vampire Mode Status</span>
          </div>
          <p className="text-zinc-500 text-[10px] font-mono leading-relaxed max-w-xs">
            {">"} Sincronizando 1,829 URLs legadas... <br />
            {">"} Inyección Neural en kamal.es: COMPLETA. <br />
            {">"} Capturando leads (94,000 activos): ACTIVO.
          </p>
      </div>

      {/* OPERATIVO CALL TO ACTION */}
      <div className="absolute top-12 right-12 text-right">
          <div className="px-6 py-2 bg-[#d4af37] text-black font-black uppercase text-[10px] tracking-widest rounded-full shadow-xl animate-bounce">
            OPERATIVO CONFIRMADO
          </div>
      </div>
    </div>
  );
};

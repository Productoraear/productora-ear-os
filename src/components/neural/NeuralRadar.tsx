"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const NeuralRadar = () => {
  const [connections, setConnections] = useState<{id: number, x1: number, y1: number, x2: number, y2: number}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newConn = {
        id: Math.random(),
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
      };
      setConnections(prev => [...prev, newConn].slice(-8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 bg-black/40 rounded-2xl border border-[#d4af37]/10 overflow-hidden group">
      {/* Sonar Sweep */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 origin-center bg-gradient-to-tr from-[#d4af37]/10 to-transparent pointer-events-none"
        style={{ width: '200%', height: '200%', top: '-50%', left: '-50%' }}
      />
      
      {/* Grid Lines */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="absolute top-4 left-4 font-mono text-[10px] text-[#d4af37] flex items-center gap-2">
        <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-ping" />
        HUNGARIAN_ALGORITHM_LIVE
      </div>

      <svg className="absolute inset-0 w-full h-full">
        <AnimatePresence>
          {connections.map((conn) => (
            <motion.g key={conn.id}>
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                exit={{ opacity: 0 }}
                x1={`${conn.x1}%`} y1={`${conn.y1}%`}
                x2={`${conn.x2}%`} y2={`${conn.y2}%`}
                stroke="#d4af37"
                strokeWidth="1"
              />
              <circle cx={`${conn.x1}%`} cy={`${conn.y1}%`} r="2" fill="#d4af37" />
              <circle cx={`${conn.x2}%`} cy={`${conn.y2}%`} r="2" fill="#fff" />
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>

      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-zinc-500">
        SCANNING_MARKET_NODES...
      </div>
    </div>
  );
};
"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database } from 'lucide-react';
import { GhostHunter } from '@/lib/services/ghost_hunter';

export const BucleAprendizaje = () => {
  const [intel, setIntel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌌 RAG INGESTION SIMULATION & GHOST HUNTER BIND
    async function fetchIntel() {
      try {
        const data = await GhostHunter.getLatestIntel(3);
        if (data && data.length > 0) {
          setIntel(data);
        }
      } catch (err) {
        console.warn('GhostHunter Nexus offline (Expected in dev)', err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntel();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-pane p-6 border-l-2 border-l-[#4ade80]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[#4ade80]" />
          <h3 className="text-[#4ade80] font-display text-sm tracking-[0.2em]">Cerebro Digital (RAG)</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-[#4ade80]/10 rounded-full">
          <Database size={12} className="text-[#4ade80] animate-pulse" />
          <span className="text-[10px] uppercase text-[#4ade80] font-bold">Ghost Hunter</span>
        </div>
      </div>
      
      <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-white/70 h-40 overflow-y-auto custom-scrollbar space-y-4">
        <p className="text-[#4ade80] mb-2">$ ghost_hunter.extract_intel("latest")</p>
        
        {loading ? (
           <p className="animate-pulse">&gt; Conectando a la Bóveda de Conocimiento...</p>
        ) : intel.length > 0 ? (
          intel.map((item, idx) => (
             <div key={idx} className="border-l border-white/10 pl-2">
               <p className="text-white">&gt; {item.entity_name} ({item.confidence_score * 100}% confidencia)</p>
               <p className="text-white/50 truncate">&gt; URL: {item.source_url}</p>
             </div>
          ))
        ) : (
          <>
            <p>&gt; Análisis RAG completado: 80% de objeciones por falta de claridad en precios de "Lujo Total".</p>
            <p>&gt; Recomendación: Activar modal de precios interactivo (Protocolo Failsafe).</p>
            <p className="text-white/30 italic mt-2">{"//"} Bóveda vacía. Mostrando caché RAG por defecto.</p>
          </>
        )}
      </div>
    </motion.div>
  );
};

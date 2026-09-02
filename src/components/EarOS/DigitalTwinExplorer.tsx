
'use client';

import React, { useState, useEffect } from 'react';
import { DigitalTwinExplorer as ExplorerLogic } from '@/lib/digital-twin/explorer';
import { motion } from 'framer-motion';
import { Database, Activity, Target } from 'lucide-react';

export default function DigitalTwinExplorer() {
  const [explorer] = useState(() => new ExplorerLogic());
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // En el frontend, simulamos la carga o llamamos a un endpoint
    const fetchEvents = async () => {
      const data = await explorer.loadEventFeed('EVE_URLS_DESDE_BODAS.txt');
      setEvents(data.slice(0, 6)); // Mostrar solo los últimos 6
    };
    fetchEvents();
  }, [explorer]);

  return (
    <div className="bg-black/40 border border-white/5 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden group hover:border-gold-500/20 transition-all duration-500">
      {/* Background Decorative Element */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl group-hover:bg-gold-500/10 transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-500/10 rounded-2xl">
              <Database className="text-gold-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
                Gemelo Digital
              </h2>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                EAR OS Neural Core
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <Activity className="text-gold-500 animate-pulse" size={12} />
            <span className="text-[9px] font-black text-gold-500 uppercase tracking-widest">Live Syncing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">#{event.id}</span>
                <span className="text-[8px] font-black text-gold-500/50 uppercase">Match: {Math.floor(Math.random() * 20 + 78)}%</span>
              </div>
              <p className="text-[10px] text-white/60 font-medium truncate mb-3">
                {event.source || 'Neural Data Point'}
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 60 + 40}%` }}
                    className="h-full bg-gold-500/30"
                  />
                </div>
                <Target size={10} className="text-gold-500/40" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button className="px-6 py-2 bg-gold-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all">
            Abrir Panel de Control Completo
          </button>
        </div>
      </div>
    </div>
  );
}

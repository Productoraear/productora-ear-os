
"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Box, Truck, Clock } from 'lucide-react';
import { GlassCard } from '@/app/components/ui/glassCard';

/**
 * 👻 GHOST TRACKING INTERFACE (V1 EVENTOS)
 * Visualización de logística Uber-style para la flota de EAR.
 */

interface TrackedUnit {
  id: string;
  name: string;
  status: 'In Transit' | 'Setting Up' | 'Idle';
  coords: { lat: number; lng: number };
  eta?: string;
}

export function GhostTracker() {
  const [units, setUnits] = useState<TrackedUnit[]>([
    { id: 'truck-1', name: 'Logística Alfa (Rigging)', status: 'In Transit', coords: { lat: 40.4168, lng: -3.7038 }, eta: '12 min' },
    { id: 'truck-2', name: 'Audio Mobile 1', status: 'Setting Up', coords: { lat: 40.4235, lng: -3.6920 } },
  ]);

  return (
    <GlassCard className="p-8 border-white/5 bg-black/40 overflow-hidden relative min-h-[400px]">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Live Telemetry</span>
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
        <Navigation size={16} className="text-[#ecb613]" /> Ghost Tracking Network
      </h3>

      <div className="space-y-6 relative z-10">
        {units.map((unit) => (
          <motion.div 
            key={unit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-xl border ${unit.status === 'In Transit' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-[#ecb613]/10 border-[#ecb613]/20 text-[#ecb613]'}`}>
                {unit.status === 'In Transit' ? <Truck size={24} /> : <Box size={24} />}
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors">{unit.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black text-white/40 uppercase flex items-center gap-1">
                    <MapPin size={10} /> GPS: {unit.coords.lat}, {unit.coords.lng}
                  </span>
                  {unit.eta && (
                    <span className="text-[10px] font-black text-blue-400 uppercase flex items-center gap-1">
                      <Clock size={10} /> ETA: {unit.eta}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: [-100, 100] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#ecb613]/40 to-transparent"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid Pattern Decorative */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
    </GlassCard>
  );
}

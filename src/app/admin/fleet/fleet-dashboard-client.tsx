"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Activity, 
  Navigation, 
  ShieldCheck, 
  Zap, 
  Box, 
  Clock,
  ChevronRight,
  AlertCircle,
  Database,
  Play
} from 'lucide-react';
import { useFleetTracking } from "@/hooks/use-fleet-tracking";
import { seedFleetData } from "@/lib/actions/seed-fleet";
import { simulateTelemetryStream } from "@/lib/actions/telemetry-broadcaster";

/**
 * 🛰️ EAR OS / FLEET COMMAND HUB (V5 ELITE)
 * High-performance dispatcher interface with Realtime LERP & Mission Intelligence.
 */

export default function FleetDashboardClient({ initialWaybills, initialUnits, workspace }: any) {
  const [selectedId, setSelectedId] = useState(initialWaybills[0]?.id ?? null);
  const { position } = useFleetTracking(selectedId, { 
    lat: initialWaybills[0]?.originLat || 40.4168, 
    lng: initialWaybills[0]?.originLng || -3.7038 
  });

  const selectedWaybill = useMemo(() => 
    initialWaybills.find((w: any) => w.id === selectedId) || initialWaybills[0],
    [selectedId, initialWaybills]
  );

  const handleSeed = async () => {
    if (confirm("Execute S-Class System Seed?")) {
      await seedFleetData();
      window.location.reload();
    }
  };

  const handleSimulate = async () => {
    if (!selectedWaybill || !selectedWaybill.unitId) {
      alert("Assign a unit first to simulate telemetry.");
      return;
    }
    await simulateTelemetryStream(
      selectedWaybill.id,
      selectedWaybill.unitId,
      selectedWaybill.originLat,
      selectedWaybill.originLng,
      selectedWaybill.destinationLat,
      selectedWaybill.destinationLng
    );
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#f6f0e5] p-8 font-sans selection:bg-[#ebb515]/30 overflow-x-hidden">
      
      {/* 🏛️ HEADER: COMMAND CONTROL */}
      <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[#ebb515] text-[11px] font-black uppercase tracking-[0.4em]">
            <Zap size={14} className="animate-pulse" /> S-Class Fleet OS / Fase 5
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.95] font-['Cabinet_Grotesk']">
            Fleet Command <span className="text-[#ebb515]">Hub</span>
          </h1>
          <p className="text-[#ada596] text-sm mt-2">Realtime per workspace, physical interpolation & transactional actions.</p>
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={handleSeed}
            className="px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-full hover:bg-[#ebb515] hover:text-[#0d0b07] transition-all flex items-center gap-3 group"
          >
            <Database size={16} className="text-[#ebb515] group-hover:text-black" />
            <span className="text-[11px] font-black uppercase tracking-widest">Seed System</span>
          </button>
          <div className="h-12 w-px bg-white/10" />
          <div className="bg-[#ebb515]/10 border border-[#ebb515]/20 px-6 py-3 rounded-full flex items-center gap-3">
             <div className="w-2 h-2 bg-[#ebb515] rounded-full animate-ping" />
             <span className="text-[11px] font-black uppercase tracking-widest text-[#ebb515]">Realtime ACTIVE</span>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-8">
        
        {/* 📋 MISSION QUEUE (LEFT PANEL) */}
        <section className="col-span-3 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ebb515]">Waybills Queue</h2>
            <span className="bg-white/5 px-3 py-1 rounded text-[10px] font-bold text-[#ada596] uppercase">Count: {initialWaybills.length}</span>
          </div>

          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {initialWaybills.length === 0 ? (
               <div className="p-12 border border-dashed border-white/10 rounded-[2rem] text-center text-white/20 uppercase font-black tracking-widest italic text-sm">
                  No Active Missions
               </div>
            ) : (
              initialWaybills.map((w: any) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedId(w.id)}
                  className={`w-full p-6 text-left rounded-2xl border transition-all flex justify-between gap-4 ${
                    selectedId === w.id 
                      ? 'bg-[#ebb515]/10 border-[#ebb515]/40 text-[#f6f0e5] shadow-lg shadow-black/50' 
                      : 'bg-[#1a1a1a] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="inline-flex px-3 py-1 bg-[#202020] text-[10px] font-black uppercase tracking-widest rounded-full text-[#ada596]">
                      {w.status}
                    </div>
                    <div className="space-y-1">
                      <p className="font-black uppercase tracking-tight text-lg leading-tight">{w.destinationLabel}</p>
                      <p className="text-[11px] text-[#ada596] font-medium leading-tight">{w.originLabel} → {w.destinationLabel}</p>
                    </div>
                  </div>
                  <div className="text-[#ada596] text-[11px] font-bold font-mono">
                    {w.etaSeconds ? `${Math.round(w.etaSeconds / 60)}m` : '--'}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* 🗺️ OPERATIONAL MAP (MIDDLE PANEL) */}
        <section className="col-span-6 space-y-8">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ebb515]">Tactical Map</h2>
          <div className="aspect-[4/3] bg-[#0e0e0e] border border-white/5 rounded-[3rem] relative overflow-hidden shadow-2xl">
             {/* S-Class Map Visuals */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(235,181,21,0.08),_transparent_22%)]" />
             <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 pointer-events-none opacity-[0.03] border-white/20">
                {Array.from({length: 96}).map((_, i) => <div key={i} className="border border-white/10" />)}
             </div>

             {selectedWaybill ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute inset-[-60px] bg-[#ebb515] rounded-full blur-3xl opacity-20"
                    />
                    <motion.div 
                      className="w-16 h-16 bg-[#ebb515] rounded-full flex items-center justify-center text-[#0d0b07] shadow-[0_0_60px_rgba(235,181,21,0.4)] z-10 relative"
                      animate={{ rotate: position.heading || 0 }}
                    >
                      <Navigation size={32} />
                    </motion.div>
                  </div>
                  <div className="mt-12 text-center space-y-3">
                     <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#ebb515]">Mission Telemetry</p>
                     <p className="text-4xl font-black uppercase tracking-tighter leading-none">{selectedWaybill.referenceCode}</p>
                     <p className="text-white/20 font-mono text-xs tracking-widest pt-2 uppercase">
                        Active: {selectedWaybill.unit?.label || "SEARCHING..."}
                     </p>
                  </div>
               </div>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-white/5 uppercase font-black text-6xl tracking-[0.2em]">
                  SCANNING_GRID
               </div>
             )}
          </div>
        </section>

        {/* 🕵️ INSPECTOR (RIGHT PANEL) */}
        <section className="col-span-3 space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ebb515]">Inspector</h2>
          <AnimatePresence mode="wait">
            {selectedWaybill ? (
              <motion.div 
                key={selectedWaybill.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-8 bg-[#1a1a1a] border border-white/5 rounded-3xl space-y-8 shadow-xl">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#ada596] tracking-widest">Protocol Reference</p>
                    <p className="text-2xl font-black uppercase tracking-tighter">{selectedWaybill.referenceCode}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-[#ada596] tracking-widest">Status</p>
                       <p className="text-sm font-black uppercase text-[#ebb515]">{selectedWaybill.status}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-[#ada596] tracking-widest">ETA</p>
                       <p className="text-sm font-black uppercase">{selectedWaybill.etaSeconds ? `${Math.round(selectedWaybill.etaSeconds / 60)}m` : '--'}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-6 border-t border-white/5">
                    <p className="text-[10px] uppercase font-bold text-[#ada596] tracking-widest">Assigned Unit</p>
                    <p className="text-sm font-black uppercase">{selectedWaybill.unit?.label || "None"}</p>
                  </div>

                  <div className="pt-8 flex flex-col gap-3">
                    <button 
                      onClick={handleSimulate}
                      className="w-full py-4 bg-[#ebb515] text-[#0d0b07] font-black uppercase text-[11px] tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(235,181,21,0.2)] flex items-center justify-center gap-3"
                    >
                      <Play size={14} fill="black" /> Launch Simulation
                    </button>
                    <button className="w-full py-4 bg-[#202020] border border-white/5 text-[#f6f0e5] font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-white/5 transition-all">
                      S-Class Override
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex justify-between items-center">
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-[#ada596] tracking-widest">System Integrity</p>
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase">
                        <ShieldCheck size={14} /> Nominal_05
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-[#ada596] tracking-widest">Latency</p>
                      <p className="text-xs font-mono font-black italic">1.2ms</p>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center text-[#ada596] uppercase font-black tracking-widest italic text-xs">
                 Select Mission to Inspect
              </div>
            )}
          </AnimatePresence>
        </section>

      </main>
    </div>
  );
}

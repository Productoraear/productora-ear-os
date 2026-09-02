"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock, 
  Navigation, 
  AlertCircle,
  Zap,
  MoreVertical,
  Maximize2
} from 'lucide-react';

/**
 * 🛰️ FLEET & LOGISTICS OS — DASHBOARD DE GIRAS (GOD MODE)
 * Standard: Aura Onyx / Uber Real-Time Logic
 */

interface FleetMember {
  id: string;
  name: string;
  location: string;
  status: "available" | "busy" | "offline" | "delayed";
  latitude: number;
  longitude: number;
  assignedWaybill?: string;
  lastUpdate: string;
}

export default function GirasDashboardPage() {
  const [selectedMember, setSelectedMember] = useState<FleetMember | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data derived from EarFleetMap_legacy_v2.tsx
  const fleetMembers: FleetMember[] = [
    {
      id: "1",
      name: "Van Gira 01 (C. Madrid)",
      location: "M-30 Sur, Madrid",
      status: "busy",
      latitude: 40.4168,
      longitude: -3.7038,
      assignedWaybill: "WB-2026-042",
      lastUpdate: "2 min ago"
    },
    {
      id: "2",
      name: "Técnico Audio (Barcelona)",
      location: "Diagonal, Barcelona",
      status: "available",
      latitude: 41.3851,
      longitude: 2.1734,
      lastUpdate: "En línea"
    },
    {
      id: "3",
      name: "Logística Eventos (Valencia)",
      location: "Puerto Valencia",
      status: "delayed",
      latitude: 39.4699,
      longitude: -0.3763,
      assignedWaybill: "WB-2026-051",
      lastUpdate: "5 min ago (Signal Low)"
    },
  ];

  const statusColors = {
    available: "bg-green-500",
    busy: "bg-[#ecb613]",
    delayed: "bg-red-500",
    offline: "bg-white/20",
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 space-y-8">
      
      {/* 🌌 NEXUS HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 text-[#ecb613] mb-4">
            <Zap size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Fleet & Logistics OS</span>
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Control <span className="text-white/20">de Giras</span></h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Señal de Red: Global</p>
          <p className="text-2xl font-mono font-bold tracking-tighter text-[#ecb613]">
            {currentTime.toLocaleTimeString('es-ES', { hour12: false })}
          </p>
        </div>
      </div>

      {/* 🗺️ BENTO GRID LAYOUT */}
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* LEFT: FLEET LIST */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 space-y-6">
              <div className="flex justify-between items-center px-2">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60 italic">Unidades Activas</h3>
                 <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold">08</span>
              </div>
              
              <div className="space-y-3">
                 {fleetMembers.map((member) => (
                   <div 
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      selectedMember?.id === member.id 
                      ? 'bg-[#ecb613]/10 border-[#ecb613]/40' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                   >
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${statusColors[member.status]}`} />
                           <span className="text-[10px] font-black uppercase tracking-widest">{member.name}</span>
                        </div>
                        <span className="text-[8px] text-white/20 font-bold uppercase">{member.lastUpdate}</span>
                     </div>
                     <p className="text-[9px] text-white/40 font-medium">{member.location}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* STATS CARD */}
           <div className="bg-[#ecb613] rounded-[2.5rem] p-8 text-black space-y-6">
              <div className="flex items-center justify-between">
                <Navigation size={24} />
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Impacto Logístico</p>
                <p className="text-4xl font-black italic tracking-tighter">98.4%</p>
              </div>
              <p className="text-[9px] font-bold uppercase leading-tight">Optimización de ruta en tiempo real activa mediante IA.</p>
           </div>
        </div>

        {/* CENTER: THE MAP (Simulated) */}
        <div className="lg:col-span-3 h-[700px] bg-white/[0.02] border border-white/10 rounded-[3.5rem] relative overflow-hidden group">
           {/* MAP OVERLAY GRADIENTS */}
           <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
           
           {/* SIMULATED MAP UI */}
           <div className="absolute inset-0 flex items-center justify-center opacity-20 scale-110 grayscale brightness-50">
              <div className="w-full h-full border-[20px] border-white/5 grid grid-cols-12 grid-rows-12 gap-1">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border border-white/[0.02]" />
                ))}
              </div>
           </div>

           {/* MAP PINS (Dynamic) */}
           {fleetMembers.map((member) => (
             <div 
              key={member.id}
              className="absolute transition-all duration-1000 group-hover:scale-105"
              style={{ 
                top: `${40 + (member.latitude - 40) * 10}%`, 
                left: `${50 + (member.longitude + 3) * 5}%` 
              }}
             >
               <div className="relative flex flex-col items-center group/pin">
                  <div className={`p-3 rounded-full border-2 border-white shadow-[0_0_20px_rgba(236,182,19,0.3)] transition-all ${
                    statusColors[member.status]
                  } group-hover/pin:scale-125`}>
                     <MapPin size={16} className="text-white" />
                  </div>
                  <div className="mt-2 bg-[#0d0d0d]/90 border border-white/10 px-3 py-1.5 rounded-lg opacity-0 group-hover/pin:opacity-100 transition-all backdrop-blur-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{member.name}</p>
                  </div>
               </div>
             </div>
           ))}

           {/* MAP CONTROLS */}
           <div className="absolute top-10 right-10 z-20 flex flex-col gap-3">
              <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/5 transition-all text-white/60 hover:text-white">
                <Maximize2 size={20} />
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/5 transition-all text-white/60 hover:text-white">
                <MoreVertical size={20} />
              </button>
           </div>

           {/* ACTIVE WAYBILL HUD (Floating) */}
           {selectedMember && (
             <div className="absolute bottom-12 left-12 right-12 z-20 bg-[#0d0d0d]/90 border border-[#ecb613]/20 p-10 rounded-[2.5rem] backdrop-blur-xl flex justify-between items-center animate-in fade-in slide-in-from-bottom-10">
                <div className="flex gap-12">
                   <div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Hoja de Ruta</p>
                      <h4 className="text-2xl font-black uppercase italic tracking-tighter text-[#ecb613]">
                        {selectedMember.assignedWaybill || "SIN ASIGNAR"}
                      </h4>
                   </div>
                   <div className="w-px h-12 bg-white/10" />
                   <div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Unidad</p>
                      <h4 className="text-2xl font-black uppercase italic tracking-tighter">
                        {selectedMember.name}
                      </h4>
                   </div>
                </div>
                <div className="flex gap-6">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">ETA Estimado</p>
                      <p className="text-xl font-bold tracking-tighter">14:20h <span className="text-[#ecb613] text-[10px] uppercase ml-2">Sincronizado</span></p>
                   </div>
                   <button className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ecb613] transition-colors">
                     Ver Detalle
                   </button>
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}

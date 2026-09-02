"use client";
import React, { useEffect, useState } from 'react';
import { useEmpireStore } from '@/stores/useEmpireStore';
import { ExpansionDashboard } from '@/modules/SClassScreens/ExpansionDashboard';
import { AstraNeuralTwin } from '@/modules/SClassScreens/AstraNeuralTwin';
import { FleetTracker } from '@/modules/SClassScreens/FleetTracker';
import { Workflow, Zap, Shield, Activity } from 'lucide-react';

export default function SingularityPage() {
  const [mounted, setMounted] = useState(false);
  const { pipeline, soberanos } = useEmpireStore();

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 space-y-6">
      {/* HEADER DE SINGULARIDAD */}
      <div className="glass-pane p-4 border-[#d4a855]/30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#d4a855] rounded-lg flex items-center justify-center text-black">
            <Workflow size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">EAR OS <span className="text-[#d4a855]">GOLD SINGULARITY</span></h1>
            <p className="text-[8px] text-[#d4a855] font-bold uppercase tracking-[0.5em]">Nivel 10: Interconexión Absoluta</p>
          </div>
        </div>
        <div className="flex gap-8 text-right">
          <div>
            <p className="text-[8px] text-white/30 uppercase font-black">Capital en Pipeline</p>
            <p className="text-xl font-black text-[#d4a855]">€{(pipeline || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[8px] text-white/30 uppercase font-black">Soberanos Activos</p>
            <p className="text-xl font-black text-white">{(soberanos?.length || 0)}</p>
          </div>
        </div>
      </div>

      {/* GRID DE LAS TRES VERTICALES INTERCONECTADAS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* VERTICAL I: CRM & EXPANSIÓN */}
        <div className="space-y-6">
          <div className="glass-pane p-6 border-white/5 bg-white/[0.01]">
            <ExpansionDashboard />
          </div>
        </div>

        {/* VERTICAL II & III: ORÁCULO & FLOTA */}
        <div className="space-y-6">
          <div className="glass-pane p-6 border-[#d4a855]/20 bg-gradient-to-b from-[#d4a855]/5 to-transparent">
             <h3 className="text-xs font-black uppercase text-[#d4a855] mb-4 flex items-center gap-2">
               <Zap size={14}/> Vertical II: Oráculo Predictivo Astra
             </h3>
             <AstraNeuralTwin />
          </div>
          
          <div className="glass-pane p-6 border-white/5">
             <h3 className="text-xs font-black uppercase text-white/40 mb-4 flex items-center gap-2">
               <Shield size={14}/> Vertical III: Control de Flota Logística
             </h3>
             <FleetTracker />
          </div>
        </div>

      </div>

      {/* FOOTER DE TELEMETRÍA */}
      <div className="flex justify-between items-center text-[8px] text-white/20 uppercase font-black tracking-widest">
        <p>Hardware Local: RX 7900 XTX (24GB VRAM) - Operativo</p>
        <div className="flex items-center gap-2 text-green-500/50">
          <Activity size={10} />
          <span>Sinapsis Zustand: Estable</span>
        </div>
      </div>
    </main>
  );
}


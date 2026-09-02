"use client";
import React from 'react';
import { useEmpireStore } from '@/stores/useEmpireStore';
import { Map, Crosshair, Car, BatteryCharging, Shield, Activity } from 'lucide-react';

export function FleetTracker() {
  const { pipeline } = useEmpireStore();
  const fleetStatus = (pipeline || 0) > 20000 ? 'DESPLIEGUE MÁXIMO' : 'EN ESPERA';

  return (
    <div className="space-y-6 animate-in fade-in duration-700 bg-black/20 p-6 rounded-2xl border border-white/5">
      <div className="flex justify-between items-center border-b border-[#d4a855]/20 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase text-white tracking-tighter flex items-center gap-2">
            <Shield className="text-[#d4a855]" size={24} /> CONTROL DE <span className="text-[#d4a855]">FLOTA VIP</span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Logística Táctica S-Class</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">Estatus de Red</p>
          <p className="text-xs font-black text-green-400 uppercase flex items-center gap-1">
            <Activity size={10} /> {fleetStatus}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-pane bg-black border-white/10 h-64 flex items-center justify-center relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <Crosshair size={48} className="text-[#d4a855] opacity-20 animate-pulse" />
          <div className="absolute top-4 right-4 bg-red-500/20 text-red-500 text-[8px] font-black px-2 py-1 rounded border border-red-500/30">
            LIVE TELEMETRY
          </div>
          <p className="absolute bottom-4 left-4 text-[9px] text-[#d4a855] font-mono tracking-[0.2em]">
            GPS_CORE_ACTIVE // ENCRIPTACIÓN_NIVEL_10
          </p>
        </div>

        <div className="space-y-4">
          <div className="glass-pane p-4 border-[#d4a855]/30 bg-[#d4a855]/5 flex flex-col gap-2 rounded-xl">
            <div className="flex justify-between items-center">
               <Car size={16} className="text-[#d4a855]" />
               <span className="text-[9px] font-black uppercase bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-white">OPERATIVO</span>
            </div>
            <p className="text-xs font-black text-white mt-2">V-VIP Mercedes-Maybach</p>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-[#d4a855] h-full w-[98%]" />
            </div>
            <p className="text-[9px] text-white/40 flex items-center gap-1"><BatteryCharging size={10}/> 98% Combustible / Carga</p>
          </div>

          <div className="glass-pane p-4 border-white/5 bg-white/[0.02] flex flex-col gap-2 opacity-60 rounded-xl">
            <div className="flex justify-between items-center">
               <Car size={16} className="text-white/40" />
               <span className="text-[9px] font-black uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">EN MISIÓN</span>
            </div>
            <p className="text-xs font-black text-white mt-2">Audi Premium Q8 Sport</p>
            <p className="text-[9px] text-white/40 flex items-center gap-1"><BatteryCharging size={10}/> 45% Nivel de Activo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleetTracker;

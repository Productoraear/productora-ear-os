"use client";

import React, { useEffect, useState } from 'react';
import { 
  Map as MapIcon, 
  Package, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Box, 
  MapPin,
  Settings,
  ChevronRight
} from 'lucide-react';

interface Gear {
  id: string;
  name: string;
  status: string;
  providerId: string;
}

interface EventLogistics {
  id: string;
  type: string;
  status: string;
  location: string;
  techArsenal: Gear[];
}

export function LogisticsDashboard() {
  const [events, setEvents] = useState<EventLogistics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/nexus/logistics/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching logistics data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'RIGGING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'LOGISTICS': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'SOUNDCHECK': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d4a855]"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Logístico */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="text-[#d4a855]" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855]">Fleet & Gear Orchestrator</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Centro de Mando <span className="text-[#d4a855]">Logístico</span></h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest mb-1">Activos en Despliegue</p>
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-2xl font-black text-white">{events.length}</span>
                <span className="text-[8px] font-bold uppercase text-white/30">Eventos</span>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-2xl font-black text-[#d4a855]">{events.reduce((acc, curr) => acc + curr.techArsenal.length, 0)}</span>
                <span className="text-[8px] font-bold uppercase text-white/30">Unidades Gear</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa / Telemetría (Placeholder Visual S-Class) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-pane rounded-2xl border-white/5 overflow-hidden h-[400px] relative bg-black">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            {/* HUD del Mapa */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-white tracking-widest uppercase">GPS_CORE_ACTIVE: IBIZA_MADRID_BARCELONA</span>
              </div>
            </div>

            {/* Simulación de Mapa con Pines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <MapIcon size={120} className="text-white/5 rotate-12" />
                {events.map((evt, idx) => (
                  <div 
                    key={evt.id}
                    className="absolute animate-bounce"
                    style={{ 
                      top: `${30 + idx * 20}%`, 
                      left: `${20 + idx * 25}%` 
                    }}
                  >
                    <div className="relative group pointer-events-auto cursor-pointer">
                      <MapPin className="text-[#d4a855]" size={32} />
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/90 border border-[#d4a855]/30 p-2 rounded text-[9px] z-20">
                        <p className="font-black text-white">{evt.type}</p>
                        <p className="text-white/60">{evt.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
               <div className="flex items-center gap-3">
                  <Activity size={16} className="text-[#d4a855]" />
                  <div>
                    <p className="text-[9px] font-black text-white/40 uppercase">Latencia de Red</p>
                    <p className="text-xs font-black text-white">12ms <span className="text-green-500 font-normal ml-1">ESTABLE</span></p>
                  </div>
               </div>
            </div>
          </div>

          {/* Listado de Equipamiento Crítico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-pane p-5 bg-white/[0.02] border-white/5 rounded-2xl">
               <h3 className="text-xs font-black uppercase text-white/60 tracking-[0.2em] mb-4 flex items-center gap-2">
                 <AlertTriangle size={14} className="text-amber-500" /> Alertas de Mantenimiento
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                    <div>
                       <p className="text-xs font-bold text-white">Generador 150KVA</p>
                       <p className="text-[9px] text-amber-500/60 uppercase font-bold">Filtro de aceite requerido</p>
                    </div>
                    <Settings size={14} className="text-amber-500/40" />
                 </div>
               </div>
            </div>
            <div className="glass-pane p-5 bg-white/[0.02] border-white/5 rounded-2xl">
               <h3 className="text-xs font-black uppercase text-white/60 tracking-[0.2em] mb-4 flex items-center gap-2">
                 <CheckCircle2 size={14} className="text-green-500" /> Próximos Despliegues
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                    <div>
                       <p className="text-xs font-bold text-white">Rigging Gala Arts</p>
                       <p className="text-[9px] text-white/40 uppercase font-bold">T-Minus 14:00h</p>
                    </div>
                    <ChevronRight size={14} className="text-white/20" />
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Eventos Activos */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-white/60 tracking-[0.2em] px-2 flex items-center gap-2">
            <Box size={14} className="text-[#d4a855]" /> Misiones en Curso
          </h3>
          {events.map(evt => (
            <div key={evt.id} className="glass-pane p-5 bg-black/40 border-white/10 hover:border-[#d4a855]/40 transition-all rounded-2xl group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${getStatusColor(evt.status)}`}>
                    {evt.status}
                  </span>
                  <h4 className="text-lg font-black text-white mt-2 leading-tight group-hover:text-[#d4a855] transition-colors">{evt.type}</h4>
                  <p className="text-[10px] text-white/40 font-bold uppercase mt-1 flex items-center gap-1">
                    <MapPin size={10} /> {evt.location}
                  </p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <Package size={16} className="text-white/40" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                  <span className="text-white/30 tracking-widest">Rigging Progress</span>
                  <span className="text-white">85%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#d4a855] to-[#f5d085] h-full w-[85%] shadow-[0_0_10px_rgba(212,168,85,0.3)]" />
                </div>
                
                <div className="pt-2 flex -space-x-2">
                  {evt.techArsenal.slice(0, 4).map((gear, i) => (
                    <div key={gear.id} className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[8px] font-black text-white/60">
                      {gear.name[0]}
                    </div>
                  ))}
                  {evt.techArsenal.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-[#d4a855] border border-black flex items-center justify-center text-[8px] font-black text-black">
                      +{evt.techArsenal.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Acción Global */}
          <button className="w-full py-4 bg-[#d4a855] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#f5d085] transition-colors flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(212,168,85,0.2)]">
            <Package size={14} /> Desplegar Nuevo Activo
          </button>
        </div>
      </div>
    </div>
  );
}

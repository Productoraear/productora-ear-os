'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Calendar, 
  Zap, 
  Target, 
  Cpu, 
  Database, 
  Radio, 
  Eye, 
  ShieldCheck,
  LayoutGrid,
  Settings,
  Bell
} from 'lucide-react';

/**
 * 🛰️ MODULE: NEXUS DASHBOARD (S-Class v3.0)
 * Partner / Venue / Vendor HUD.
 * Perspective: Technical Twin, Performance Overlays, Real-Time Coordination.
 */

export default function NexusDashboardSClass() {
  const [activeTab, setActiveTab] = useState('grid');

  const stats = [
    { label: 'Sincronicidad', val: '98.2%', icon: Target, color: '#4dff88' },
    { label: 'Nodos Activos', val: '14/15', icon: Network, color: '#d4af37' },
    { label: 'Latencia Red', val: '4ms', icon: Radio, color: '#4d94ff' },
    { label: 'Energía (Watts)', val: '12.4kW', icon: Zap, color: '#ff4d4d' },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black p-4 md:p-12 overflow-hidden relative">
      
      {/* BACKGROUND GRID DYNAMICO */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="w-[200%] h-[200%] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] animate-[pulse_8s_infinite]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto space-y-12">
        
        {/* HEADER TÁCTICO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/5 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center text-[#d4af37] border border-[#d4af37]/20 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                    <Cpu size={32} />
                 </div>
                 <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Nexus <span className="text-[#d4af37]">OS</span></h1>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.4em] mt-2">Plataforma de Interconexión de Proveedores de Élite</p>
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              {['grid', 'timeline', 'assets'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 h-14 rounded-full font-black uppercase tracking-widest text-[10px] transition-all border ${activeTab === tab ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/20'}`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
        </header>

        {/* STATS OVERLAY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {stats.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/40 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/5 group hover:border-[#d4af37]/20 transition-all shadow-xl"
              >
                 <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <s.icon size={20} style={{ color: s.color }} />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">0{i+1}</span>
                 </div>
                 <div className="text-3xl font-black tracking-tighter mb-1 uppercase italic">{s.val}</div>
                 <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{s.label}</div>
              </motion.div>
           ))}
        </div>

        {/* MAIN HUD CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
           
           {/* LEFT PANEL: FLEET/LOGISTICS */}
           <div className="xl:col-span-8 space-y-12">
              <section className="bg-zinc-900/20 rounded-[3rem] border border-white/5 p-12 overflow-hidden relative group">
                 <div className="absolute top-0 right-0 p-8">
                    <LayoutGrid size={24} className="text-zinc-700 group-hover:text-[#d4af37] transition-colors" />
                 </div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Despliegue de Activos <span className="text-[#d4af37]/40">Real-Time</span></h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(asset => (
                       <div key={asset} className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all space-y-6">
                          <div className="flex justify-between items-start">
                             <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center rounded-xl">
                                <Radio size={24} className="text-[#4dff88]" />
                             </div>
                             <div className="text-right">
                                <div className="text-xl font-bold font-mono tracking-tighter">TRUCK-0{asset}</div>
                                <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Unidad de Transporte</div>
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <div className="flex justify-between text-[8px] uppercase font-black text-zinc-500 block mb-1">
                                <span>Carga Térmica</span>
                                <span>82%</span>
                             </div>
                             <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#d4af37] w-[82%]" />
                             </div>
                          </div>

                          <div className="flex justify-between pt-4 border-t border-white/5">
                             <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-[#d4af37]" />
                                <span className="text-[10px] font-bold">ZONA A-4</span>
                             </div>
                             <button className="text-[8px] font-black uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors">
                                Ver Cámara HW
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* TIMELINE DE SINCRONICIDAD */}
              <section className="space-y-8">
                 <h2 className="text-2xl font-black uppercase tracking-tighter italic">Cronométrica Operacional</h2>
                 <div className="space-y-4">
                    {[
                      { time: '18:00', task: 'Llegada de Camión Técnico', status: 'done' },
                      { time: '19:30', task: 'Instalación Arreglo Lineal Martin Audio', status: 'current' },
                      { time: '21:00', task: 'Soundcheck Nivel III (Aislamiento)', status: 'future' },
                    ].map((step, i) => (
                       <div key={i} className={`p-8 rounded-[2rem] border flex items-center gap-12 ${step.status === 'current' ? 'bg-[#d4af37]/5 border-[#d4af37]/30' : 'bg-transparent border-white/5 opacity-40'}`}>
                          <div className="text-3xl font-black font-mono tracking-tighter w-24 shrink-0">{step.time}</div>
                          <div className="flex-1">
                             <h4 className="text-xl font-bold tracking-tight">{step.task}</h4>
                             <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mt-1">Status: {step.status.toUpperCase()}</p>
                          </div>
                          {step.status === 'current' && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-4 h-4 bg-[#d4af37] rounded-full shadow-[0_0_20px_#d4af37]" />}
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* RIGHT PANEL: NOTIFICATIONS & HEALTH */}
           <div className="xl:col-span-4 space-y-12">
              <div className="bg-zinc-900 border border-white/5 rounded-[3.5rem] p-12 space-y-12">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4">
                       <Bell size={20} className="text-[#d4af37]" /> Terminal
                    </h3>
                    <div className="w-2 h-2 bg-[#4dff88] rounded-full animate-pulse" />
                 </div>

                 <div className="space-y-6 font-mono">
                    {[
                      { msg: 'Auth Token validado: EAR_HUB_MDR_001', time: '12:00:23', type: 'system' },
                      { msg: 'Detección de Interferencia RF en Canal 04', time: '12:15:45', type: 'warning' },
                      { msg: 'Despliegue confirmado en Finca La Pólvora', time: '12:20:10', type: 'success' },
                    ].map((log, i) => (
                       <div key={i} className="text-[10px] space-y-1 border-l border-white/10 pl-6 relative">
                          <div className="absolute left-[-4px] top-0 w-2 h-2 bg-zinc-700 rounded-full" />
                          <div className="text-zinc-600">[{log.time}]</div>
                          <div className={log.type === 'warning' ? 'text-red-500' : log.type === 'success' ? 'text-[#4dff88]' : 'text-white'}>
                             {log.msg}
                          </div>
                       </div>
                    ))}
                 </div>

                 <button className="w-full h-16 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-105 transition-all">
                    <Database size={16} /> Descargar Dossier Técnico
                 </button>
              </div>

              <div className="bg-black border border-white/5 rounded-[3.5rem] p-12 flex flex-col items-center text-center space-y-8 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 to-transparent pointer-events-none" />
                 <ShieldCheck size={64} className="text-[#d4af37] mb-4" />
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Certificación <br />S-Class 2026</h3>
                 <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">Este nodo operativo cumple con el Protocolo Fantasma de Dominancia Técnica y Calidad Audiovisual.</p>
                 <div className="px-6 py-2 bg-zinc-900 rounded-full text-[8px] font-black uppercase tracking-[0.3em] border border-white/10">
                    ID: NEXUS-MDR-001
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

const MapPin = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

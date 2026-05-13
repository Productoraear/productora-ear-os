'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Cpu, 
  Map, 
  Zap, 
  Globe, 
  Layers, 
  Anchor, 
  Maximize2, 
  Wifi,
  HardDrive
} from 'lucide-react';

/**
 * 🏗️ MODULE: ARCHITECTURE & ENGINEERING (S-Class v3.0)
 * Logic for Global Infrastructure, Technical Blueprints, and Massive Site Deployment.
 */

export default InfrastructurePanel;
export function InfrastructurePanel() {
  const nodeStatus = [
    { name: 'Power Grid A', status: 'Stable', load: '45%' },
    { name: 'Audio Array', status: 'Active', load: '82%' },
    { name: 'RF Environment', status: 'Optimal', load: '12%' },
    { name: 'Global Sync', status: 'Locked', load: '100%' },
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans p-6 md:p-16 rounded-[4rem] border border-white/5 overflow-hidden relative">
      
      {/* HUD ELEMENTS */}
      <div className="absolute top-0 left-0 w-full flex justify-between p-12 pointer-events-none opacity-30">
        <div className="text-[10px] font-mono tracking-widest uppercase">Dept: Infrastructure Engineering</div>
        <div className="text-[10px] font-mono tracking-widest uppercase">System: EAR OS Global Alpha</div>
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: TITLE & BLUEPRINT */}
        <div className="lg:col-span-12 space-y-8">
           <div className="space-y-2 border-l-4 border-[#d4af37] pl-8">
              <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">Engineering <br /> <span className="text-zinc-600">Architecture</span></h1>
              <p className="text-[10px] tracking-[0.5em] font-black uppercase text-[#d4af37]/60">Protocolo de Despliegue de Infraestructura Masiva</p>
           </div>
        </div>

        {/* CORE STATS GRID */}
        <div className="lg:col-span-8 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Nodos Globales', val: '12,431', icon: Globe, color: '#4d94ff' },
                { title: 'Tasa S-Class', val: '99.98%', icon: Shield, color: '#4dff88' },
                { title: 'Compute Power', val: '4.2 PH/s', icon: Cpu, color: '#d4af37' },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 flex flex-col items-center text-center group hover:bg-zinc-900/80 transition-all cursor-crosshair shadow-2xl"
                >
                   <div className="w-16 h-16 rounded-3xl bg-black mb-6 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <stat.icon size={28} style={{ color: stat.color }} />
                   </div>
                   <div className="text-4xl font-black tracking-tighter mb-2 italic uppercase">{stat.val}</div>
                   <div className="text-[8px] uppercase tracking-[0.3em] font-black text-zinc-500">{stat.title}</div>
                </motion.div>
              ))}
           </div>

           {/* LARGE INFRA MAP PLACEHOLDER (Blueprint) */}
           <div className="bg-zinc-900/30 rounded-[4rem] border border-white/5 h-[600px] relative overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent)] pointer-events-none" />
              
              {/* TOP BAR GRID */}
              <div className="absolute top-0 w-full p-8 flex justify-between border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-400">LIVE FEED: GLOBAL_NET_SCLASS</span>
                 </div>
                 <div className="flex gap-2">
                    <Maximize2 size={16} className="text-zinc-600" />
                    <Layers size={16} className="text-zinc-600" />
                 </div>
              </div>

              {/* SCHEMATIC LOOK */}
              <div className="flex items-center justify-center h-full flex-col space-y-8 opacity-50 transition-opacity group-hover:opacity-100">
                 <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                      className="w-[300px] h-[300px] border border-dashed border-[#d4af37]/30 rounded-full flex items-center justify-center"
                    >
                       <div className="w-[200px] h-[200px] border border-zinc-800 rounded-full" />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <HardDrive size={48} className="text-[#d4af37]" />
                    </div>
                 </div>
                 <div className="text-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Estructura Base de Datos <span className="text-[#d4af37]">S-Class</span></h3>
                    <p className="text-xs text-zinc-500 font-mono mt-2">UUID: 45A-ENGINE-CORE-GOLD</p>
                 </div>
              </div>

              {/* BOTTOM METADATA Overlay */}
              <div className="absolute bottom-0 w-full p-12 bg-gradient-to-t from-black to-transparent">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {nodeStatus.map((n, i) => (
                       <div key={i} className="bg-black/50 p-4 rounded-xl border border-white/5">
                          <div className="text-zinc-500 text-[8px] uppercase font-black">{n.name}</div>
                          <div className="flex justify-between items-end mt-1">
                             <div className="text-xs font-bold">{n.status}</div>
                             <div className="text-[10px] font-mono text-[#d4af37]">{n.load}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: TERMINAL & ACTIONS */}
        <div className="lg:col-span-4 space-y-12">
           <section className="bg-black p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl">
              <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                 <Anchor className="text-[#d4af37]" size={24} />
                 <h2 className="text-xl font-black uppercase tracking-tighter italic">Logistics Hub</h2>
              </div>

              <div className="space-y-6">
                 {[
                   { label: 'Network Latency', val: '4.2ms', icon: Wifi },
                   { label: 'Energy Output', val: '1.2 GW', icon: Zap },
                   { label: 'Location Lock', val: 'Madrid, ES', icon: Map },
                 ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-zinc-900/50 p-4 rounded-2xl transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center rounded-xl border border-white/5 group-hover:border-[#d4af37]/30">
                             <item.icon size={18} className="text-zinc-500 group-hover:text-white" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.label}</span>
                       </div>
                       <span className="text-sm font-mono font-bold">{item.val}</span>
                    </div>
                 ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                 <button className="w-full h-16 bg-[#d4af37] text-black font-black uppercase tracking-widest text-[10px] rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                    Desplegar Infraestructura
                 </button>
                 <button className="w-full h-16 bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] rounded-[2rem] border border-white/5 hover:bg-zinc-800 transition-colors">
                    Revisión de Planos HQ
                 </button>
              </div>
           </section>

           {/* SMALL SENSOR HUD */}
           <div className="bg-[#d4af37] p-10 rounded-[4rem] text-black space-y-6 shadow-[0_0_100px_rgba(212,175,55,0.1)]">
              <h4 className="text-xs font-black uppercase tracking-widest italic opacity-60">Seguridad Perimetral</h4>
              <div className="text-4xl font-black tracking-tighter uppercase italic leading-none">Status: <br />Protected</div>
              <div className="pt-4 flex justify-between items-center">
                 <Shield size={32} />
                 <div className="text-[10px] font-mono font-black border border-black/20 px-4 py-1 rounded-full uppercase tracking-widest">A-CLASS-7</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

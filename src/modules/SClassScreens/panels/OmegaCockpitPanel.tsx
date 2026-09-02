'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Crown, 
  Terminal, 
  Zap, 
  PieChart, 
  Globe, 
  Lock, 
  Activity, 
  Cpu,
  Layers,
  Search,
  Eye,
  Database,
  BarChart3,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';

/**
 * 🧛 MODULE: OMEGA COCKPIT (S-Class v3.0 - Valhalla)
 * Unified Dashboard for CEO, High-Net-Worth Logistics, and Fleet Dominance.
 * Perspective: Supreme Command, Absolute Authority, Dark Mode Opulence.
 */

export default OmegaCockpitPanel;
export function OmegaCockpitPanel() {
  const kpis = [
    { label: 'VALORACIÓN PROYECTADA', val: '$7.4M', color: '#d4af37', trend: '+14%' },
    { label: 'EFICIENCIA OPERATIVA', val: '98.8%', color: '#4dff88', trend: '+2%' },
    { label: 'RETENCIÓN DE LÓGICA', val: '99.9%', color: '#4d94ff', trend: 'MAX' },
    { label: 'RIESGO SISTÉMICO', val: '0.02%', color: '#ff4d4d', trend: '-8%' },
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black p-4 md:p-16 rounded-[4.5rem] border-4 border-zinc-900 overflow-hidden relative">
      
      {/* OMEGA HUD OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
         <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent)]" />
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto space-y-16">
        
        {/* TOP COMMAND BAR */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12">
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center text-[#d4af37] border-2 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,1)] relative group cursor-wait">
                 <div className="absolute inset-0 bg-[#d4af37]/5 rounded-[2.5rem] animate-pulse" />
                 <Crown size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-2">
                 <div className="flex items-center gap-4">
                    <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">Omega <span className="text-zinc-700">Cockpit</span></h1>
                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-1 rounded-full flex items-center gap-2">
                       <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Alpha Access Only</span>
                    </div>
                 </div>
                 <p className="text-xs tracking-[0.6em] font-black uppercase text-[#d4af37]/60">Centro de Mando de la Productora EAR (Protocolo Gold)</p>
              </div>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full xl:w-auto">
              {kpis.map((kpi, i) => (
                 <div key={i} className="bg-zinc-900/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/5 space-y-2 group hover:bg-zinc-900 transition-all">
                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{kpi.label}</div>
                    <div className="flex items-end justify-between">
                       <div className="text-3xl font-black italic tracking-tighter uppercase">{kpi.val}</div>
                       <div className="text-[10px] font-bold font-mono" style={{ color: kpi.color }}>{kpi.trend}</div>
                    </div>
                 </div>
              ))}
           </div>
        </header>

        {/* MAIN DEEP DIVE LOGIC */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
           
           {/* LEFT: STRATEGIC INSIGHTS */}
           <div className="xl:col-span-8 space-y-16">
              
              {/* FLEET STATUS (Bento Style) */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                 <div className="md:col-span-8 bg-zinc-900/20 rounded-[4rem] border border-white/5 p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Globe size={200} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-12">Despliegue de la <br /> <span className="text-[#d4af37]">Flota EAR_OS</span></h2>
                    
                    <div className="space-y-10 relative z-10">
                       {[
                         { name: 'UNIDAD VIMUME-MDR', status: 'Operational', load: 84, color: '#d4af37' },
                         { name: 'INFRAESTRUCTURA ALPHA', status: 'Syncing', load: 62, color: '#4d94ff' },
                         { name: 'NETWORK NEXUS-GOLD', status: 'Optimal', load: 99, color: '#4dff88' },
                       ].map((unit, i) => (
                          <div key={i} className="space-y-4">
                             <div className="flex justify-between items-end">
                                <span className="text-xs font-black uppercase tracking-widest">{unit.name}</span>
                                <span className="text-[10px] font-mono text-zinc-500">{unit.status} - {unit.load}%</span>
                             </div>
                             <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${unit.load}%` }}
                                  transition={{ duration: 2, delay: i * 0.3 }}
                                  className="h-full"
                                  style={{ backgroundColor: unit.color }}
                                />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="md:col-span-4 bg-[#d4af37] rounded-[4rem] p-12 text-black flex flex-col justify-between shadow-2xl group hover:scale-[1.02] transition-transform">
                    <div className="space-y-4">
                       <Shield size={64} className="opacity-80" />
                       <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Admin <br />Shield</h3>
                    </div>
                    <div className="space-y-2">
                       <div className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-4 py-2 rounded-full inline-block">Security Lvl: 10</div>
                       <p className="text-[10px] font-bold leading-relaxed">Encriptación cuántica activa sobre todos los módulos TSX recuperados.</p>
                    </div>
                 </div>
              </section>

              {/* CEO VAULT: FINANCIALS & OPERATIONS */}
              <section className="bg-zinc-900 border border-white/5 rounded-[5rem] p-16 space-y-16">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-6">
                       <Database className="text-[#d4af37]" /> Bóveda del CEO (Vault 00)
                    </h2>
                    <button className="px-8 h-14 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors">
                       Extraer Reporte 7 Cifras
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="p-10 bg-black/40 rounded-[2.5rem] border border-white/5 group hover:border-[#d4af37]/30 transition-all">
                          <div className="flex justify-between mb-4">
                             <BarChart3 className="text-zinc-600 group-hover:text-white" size={24} />
                             <span className="text-[10px] font-mono text-[#d4af37]">ROI ANUAL</span>
                          </div>
                          <div className="text-5xl font-black italic tracking-tighter text-white">340%</div>
                          <div className="text-[8px] uppercase font-black text-zinc-500 mt-2 tracking-widest">Crecimiento Orgánico EAR OS</div>
                       </div>
                       <div className="p-10 bg-black/40 rounded-[2.5rem] border border-white/5 group hover:border-[#d4af37]/30 transition-all">
                          <div className="flex justify-between mb-4">
                             <TrendingUp className="text-zinc-600 group-hover:text-white" size={24} />
                             <span className="text-[10px] font-mono text-[#d4af37]">VALOR DE MARCA</span>
                          </div>
                          <div className="text-5xl font-black italic tracking-tighter text-white">HIGH-END</div>
                          <div className="text-[8px] uppercase font-black text-zinc-500 mt-2 tracking-widest">Posicionamiento Silicon Valley</div>
                       </div>
                    </div>

                    <div className="bg-black rounded-[3rem] p-12 space-y-8 relative overflow-hidden border border-white/5">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                          <PieChart size={150} />
                       </div>
                       <h4 className="text-xl font-black uppercase tracking-tighter italic">Distribución de Capital</h4>
                       <div className="space-y-6">
                          {[
                            { label: 'R&D AI Logic', val: '45%' },
                            { label: 'Fleet Infrastructure', val: '30%' },
                            { label: 'VIMUME Science', val: '25%' },
                          ].map((x, i) => (
                             <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-xs font-bold uppercase text-zinc-400">{x.label}</span>
                                <span className="text-sm font-mono font-black text-[#d4af37]">{x.val}</span>
                             </div>
                          ))}
                       </div>
                       <div className="pt-4">
                          <div className="w-full h-1 bg-zinc-800 rounded-full flex overflow-hidden">
                             <div className="h-full bg-[#d4af37] w-[45%]" />
                             <div className="h-full bg-blue-500 w-[30%]" />
                             <div className="h-full bg-white w-[25%]" />
                          </div>
                       </div>
                    </div>
                 </div>
              </section>
           </div>

           {/* RIGHT: SYSTEM LOGS & PULSE */}
           <div className="xl:col-span-4 space-y-16">
              
              <div className="bg-black p-12 border border-white/5 rounded-[4rem] space-y-12">
                 <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4 italic">
                       <Terminal className="text-[#d4af37]" /> System Pulse
                    </h3>
                    <div className="w-4 h-4 bg-[#4dff88] rounded-full shadow-[0_0_20px_#4dff88]" />
                 </div>
                 
                 <div className="space-y-8">
                    {[
                      { msg: 'Inyección de Lógica S-Class... EXITOSA', time: '14:02:44' },
                      { msg: 'Sincronización con Bodega H: activa', time: '14:15:10' },
                      { msg: 'Cazador Algoritmo: Matching 98%', time: '14:22:01' },
                      { msg: 'Nivel Alfa alcanzado en VIMUME', time: '14:30:55' },
                    ].map((log, i) => (
                       <div key={i} className="text-[10px] font-mono space-y-1">
                          <div className="text-zinc-600">[{log.time}]</div>
                          <div className="text-zinc-300 border-l border-[#d4af37]/30 pl-4 py-1">{log.msg}</div>
                       </div>
                    ))}
                 </div>

                 <button className="w-full h-16 bg-zinc-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[8px] flex items-center justify-center gap-4 hover:bg-zinc-800 transition-colors border border-white/5">
                    <Search size={14} /> Abrir Explorador Forense
                 </button>
              </div>

              <div className="bg-gradient-to-tr from-[#d4af37] to-[#8d7522] p-16 rounded-[4.5rem] text-black space-y-8 relative overflow-hidden group shadow-[0_40px_100px_rgba(212,175,55,0.2)]">
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Zap size={64} className="opacity-40 animate-pulse" />
                 <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Infinite <br /> Arsenal</h3>
                 <p className="text-xs font-bold leading-relaxed opacity-70">Desplegando el 100% de los activos recuperados. El sistema está en modo dominancia total.</p>
                 <div className="flex gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#d4af37]">
                       <Layers size={24} />
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                       <Activity size={24} />
                    </div>
                 </div>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-[4rem] p-12 text-center space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Próximo Hito</h4>
                 <div className="text-2xl font-black tracking-tighter italic uppercase text-white">Lanzamiento EAR v3.0</div>
                 <div className="px-8 h-12 bg-zinc-800 rounded-full flex items-center justify-center gap-4 mx-auto border border-white/5">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#d4af37]">T-MINUS 12 DAYS</span>
                 </div>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
}

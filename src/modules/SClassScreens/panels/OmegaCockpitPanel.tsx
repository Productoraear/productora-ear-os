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
  Activity, 
  Layers,
  Search,
  Database,
  BarChart3,
  TrendingUp
} from 'lucide-react';

/**
 * 🧛 MODULE: OMEGA COCKPIT (S-Class v4.2 - Sovereign)
 * Unified Dashboard for CEO, High-Net-Worth Logistics, and Pre-Launch Fleet Dominance.
 * Metric Directives: 0 Ventas registradas, 0 € Ingresos, VIMUME en pre-lanzamiento.
 */

export default OmegaCockpitPanel;
export function OmegaCockpitPanel() {
  const kpis = [
    { label: 'INGRESOS REGISTRADOS', val: '€0.00', color: '#d4af37', trend: 'PRE-LANZAMIENTO' },
    { label: 'VENTAS CERRADAS', val: '0', color: '#4dff88', trend: '0 FACTURADO' },
    { label: 'EFICIENCIA TÉCNICA', val: '100%', color: '#4d94ff', trend: 'STAGING READY' },
    { label: 'RIESGO SISTÉMICO', val: '0.00%', color: '#4dff88', trend: 'PROTEGIDO' },
  ];

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-[#d4af37] selection:text-black p-4 sm:p-8 lg:p-10 rounded-3xl border border-zinc-800/80 overflow-hidden relative w-full min-w-0 shadow-2xl">
      
      {/* OMEGA HUD OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
         <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent)]" />
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto space-y-8 sm:space-y-12">
        
        {/* TOP COMMAND BAR */}
        <header className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-6 pb-6 border-b border-white/5 w-full min-w-0">
           <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-2xl flex items-center justify-center text-[#d4af37] border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] shrink-0 relative group">
                 <div className="absolute inset-0 bg-[#d4af37]/5 rounded-2xl animate-pulse" />
                 <Crown size={36} className="relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-1 min-w-0">
                 <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none">
                      Omega <span className="text-zinc-600">Cockpit</span>
                    </h1>
                    <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                       <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Pre-Launch Gold</span>
                    </div>
                 </div>
                 <p className="text-[10px] sm:text-xs tracking-[0.25em] font-bold uppercase text-[#d4af37]/70 truncate">
                   Centro de Mando · Productora EAR (Protocolo Gold)
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full 2xl:w-auto shrink-0">
              {kpis.map((kpi, i) => (
                 <div key={i} className="bg-zinc-900/60 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1 group hover:border-[#d4af37]/30 transition-all min-w-0">
                    <div className="text-[8px] font-black uppercase tracking-wider text-zinc-500 truncate">{kpi.label}</div>
                    <div className="flex items-baseline justify-between gap-2">
                       <div className="text-xl sm:text-2xl font-black italic tracking-tight uppercase text-white truncate">{kpi.val}</div>
                       <div className="text-[8px] font-mono font-bold shrink-0" style={{ color: kpi.color }}>{kpi.trend}</div>
                    </div>
                 </div>
              ))}
           </div>
        </header>

        {/* MAIN DEEP DIVE LOGIC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full min-w-0">
           
           {/* LEFT: STRATEGIC INSIGHTS */}
           <div className="lg:col-span-8 space-y-8 min-w-0">
              
              {/* FLEET STATUS (Bento Style) */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-6 min-w-0">
                 <div className="md:col-span-8 bg-zinc-900/40 rounded-3xl border border-white/5 p-6 sm:p-8 relative overflow-hidden group min-w-0">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Globe size={160} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic mb-6">
                      Despliegue de la <br /> <span className="text-[#d4af37]">Flota EAR_OS</span>
                    </h2>
                    
                    <div className="space-y-6 relative z-10">
                       {[
                         { name: 'UNIDAD VIMUME-MDR', status: 'Pre-Lanzamiento (No Desplegado en Calle)', load: 0, color: '#d4af37' },
                         { name: 'INFRAESTRUCTURA ALPHA', status: 'Soberana', load: 100, color: '#4d94ff' },
                         { name: 'NETWORK NEXUS-GOLD', status: 'Optimal', load: 100, color: '#4dff88' },
                       ].map((unit, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between items-end gap-2 flex-wrap">
                                <span className="text-xs font-black uppercase tracking-wider truncate">{unit.name}</span>
                                <span className="text-[10px] font-mono text-zinc-400 shrink-0">{unit.status} - {unit.load}%</span>
                             </div>
                             <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${unit.load}%` }}
                                  transition={{ duration: 1.5, delay: i * 0.2 }}
                                  className="h-full"
                                  style={{ backgroundColor: unit.color }}
                                />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="md:col-span-4 bg-[#d4af37] rounded-3xl p-6 sm:p-8 text-black flex flex-col justify-between shadow-xl group hover:scale-[1.01] transition-transform min-w-0">
                    <div className="space-y-3">
                       <Shield size={48} className="opacity-80" />
                       <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Admin <br />Shield</h3>
                    </div>
                    <div className="space-y-2 mt-6">
                       <div className="text-[9px] font-black uppercase tracking-widest bg-black/15 px-3 py-1.5 rounded-full inline-block">Security Lvl: 10</div>
                       <p className="text-[10px] font-bold leading-relaxed">Encriptación cuántica activa sobre todos los módulos TSX recuperados.</p>
                    </div>
                 </div>
              </section>

              {/* CEO VAULT: FINANCIALS & OPERATIONS */}
              <section className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-8 min-w-0">
                 <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                       <Database className="text-[#d4af37]" /> Bóveda del CEO (Vault 00)
                    </h2>
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-[#d4af37] rounded-full font-mono text-[9px] uppercase tracking-widest">
                       Fase Pre-Operativa · 0 € Ventas
                    </span>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
                    <div className="p-6 sm:p-8 bg-black/50 rounded-2xl border border-white/5 group hover:border-[#d4af37]/30 transition-all min-w-0">
                       <div className="flex justify-between mb-3">
                          <BarChart3 className="text-zinc-500 group-hover:text-white" size={20} />
                          <span className="text-[10px] font-mono text-[#d4af37]">INGRESOS REGISTRADOS</span>
                       </div>
                       <div className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white">€0.00</div>
                       <div className="text-[8px] uppercase font-black text-zinc-400 mt-2 tracking-widest">0 Ventas · Fase Previa al Lanzamiento</div>
                    </div>

                    <div className="p-6 sm:p-8 bg-black/50 rounded-2xl border border-white/5 group hover:border-[#d4af37]/30 transition-all min-w-0">
                       <div className="flex justify-between mb-3">
                          <TrendingUp className="text-zinc-500 group-hover:text-white" size={20} />
                          <span className="text-[10px] font-mono text-[#d4af37]">MADUREZ TÉCNICA</span>
                       </div>
                       <div className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white">TRL-8</div>
                       <div className="text-[8px] uppercase font-black text-zinc-400 mt-2 tracking-widest">Homologación y Staging Completo</div>
                    </div>
                 </div>

                 <div className="bg-black/60 rounded-2xl p-6 space-y-6 relative overflow-hidden border border-white/5 min-w-0">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                       <PieChart size={120} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tighter italic">Split Soberano Inmutable</h4>
                    <div className="space-y-4">
                       {[
                         { label: 'Artista / Solista (Edwin Agudelo)', val: '80%' },
                         { label: 'EAR OS Infraestructura', val: '10%' },
                         { label: 'Fondo VIMUME Core', val: '10%' },
                       ].map((x, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                             <span className="text-xs font-bold uppercase text-zinc-400">{x.label}</span>
                             <span className="text-sm font-mono font-black text-[#d4af37]">{x.val}</span>
                          </div>
                       ))}
                    </div>
                    <div className="pt-2">
                       <div className="w-full h-1.5 bg-zinc-800 rounded-full flex overflow-hidden">
                          <div className="h-full bg-[#d4af37] w-[80%]" />
                          <div className="h-full bg-blue-500 w-[10%]" />
                          <div className="h-full bg-emerald-500 w-[10%]" />
                       </div>
                    </div>
                 </div>
              </section>
           </div>

           {/* RIGHT: SYSTEM LOGS & PULSE */}
           <div className="lg:col-span-4 space-y-8 min-w-0">
              
              <div className="bg-black/80 p-6 sm:p-8 border border-white/5 rounded-3xl space-y-6 min-w-0">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
                       <Terminal className="text-[#d4af37]" /> System Pulse
                    </h3>
                    <div className="w-3 h-3 bg-[#4dff88] rounded-full shadow-[0_0_15px_#4dff88]" />
                 </div>
                 
                 <div className="space-y-4">
                    {[
                      { msg: 'Inyección de Lógica S-Class... EXITOSA', time: '14:02:44' },
                      { msg: 'Sincronización con Bodega H: activa', time: '14:15:10' },
                      { msg: 'Cazador Algoritmo: Matching 98%', time: '14:22:01' },
                      { msg: 'Fase Staging / 0 Ventas confirmada', time: '14:30:55' },
                    ].map((log, i) => (
                       <div key={i} className="text-[10px] font-mono space-y-0.5">
                          <div className="text-zinc-600">[{log.time}]</div>
                          <div className="text-zinc-300 border-l border-[#d4af37]/30 pl-3 py-0.5">{log.msg}</div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-gradient-to-tr from-[#d4af37] to-[#8d7522] p-6 sm:p-8 rounded-3xl text-black space-y-6 relative overflow-hidden group shadow-xl min-w-0">
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Zap size={48} className="opacity-40 animate-pulse" />
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Infinite <br /> Arsenal</h3>
                 <p className="text-xs font-bold leading-relaxed opacity-75">Desplegando el 100% de los activos recuperados. Sistema listo para lanzamiento oficial.</p>
                 <div className="flex gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-[#d4af37]">
                       <Layers size={20} />
                    </div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                       <Activity size={20} />
                    </div>
                 </div>
              </div>

              <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6 sm:p-8 text-center space-y-4 min-w-0">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Próximo Hito</h4>
                 <div className="text-xl font-black tracking-tighter italic uppercase text-white">Lanzamiento Comercial EAR OS</div>
                 <div className="px-6 h-10 bg-zinc-800 rounded-full flex items-center justify-center gap-3 mx-auto border border-white/5">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#d4af37]">FASE PREVIA ACTIVA</span>
                 </div>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
}

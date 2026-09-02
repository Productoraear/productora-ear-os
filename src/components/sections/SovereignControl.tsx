import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Lock, 
  Activity, 
  Database, 
  Users, 
  Key,
  ChevronRight,
  Zap,
  Cpu
} from 'lucide-react';
import { GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ COMPONENT: SOVEREIGN CONTROL (Area Soberana)
 * High-Level System Governance & Resource Allocation.
 * Priority: High (Logical Form + Dashboard).
 */

interface SovereignControlProps {
  systemStatus: 'ACTIVE' | 'DEGRADED' | 'STANDBY';
  resources: {
    label: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  onAction?: (action: string) => void;
}

const SovereignControl = ({ systemStatus, resources, onAction }: SovereignControlProps) => {
  return (
    <div className="space-y-12">
      {/* 1. STATUS MONITOR */}
      <div className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-4xl relative overflow-hidden group`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 ${systemStatus === 'ACTIVE' ? 'border-green-500/50' : 'border-red-500/50'} flex items-center justify-center p-2`}>
               <div className={`w-full h-full rounded-full ${systemStatus === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'} animate-pulse`} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">EAR.System <span className="gold-text italic serif normal-case">Nodes.</span></h3>
            <p className="text-xs md:text-sm font-bold text-white/30 uppercase tracking-[0.3em]">Protocol Status: {systemStatus}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
          {resources.map((res, i) => (
            <div key={i} className="p-4 md:p-6 bg-black/40 rounded-3xl border border-white/5 space-y-2">
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/20">{res.label}</span>
               <div className="flex items-end gap-2">
                  <span className="text-xl md:text-3xl font-black text-white">{res.value}%</span>
                  <span className={`text-[9px] font-bold ${res.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {res.trend === 'up' ? '↑' : '↓'}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. GOVERNANCE FORM (CRITICAL LOGIC) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className={`p-10 md:p-16 rounded-[3rem] md:rounded-[4.5rem] ${GLASS_STYLE} border border-white/5 space-y-10 shadow-3xl`}>
           <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary">
                 <ShieldAlert size={32} />
                 <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Restringido.</h4>
              </div>
              <p className="text-sm md:text-lg text-white/30 italic font-medium leading-relaxed">
                 Asignación de recursos soberanos y despliegue de infraestructura crítica EAR.
              </p>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Clave de Acceso</label>
                 <div className="relative">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      className="w-full h-16 md:h-20 bg-white/5 border border-white/10 rounded-2xl md:rounded-[1.5rem] pl-16 pr-6 text-xl text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/5"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Nodo Destino</label>
                    <select className="w-full h-16 md:h-20 bg-white/5 border border-white/10 rounded-2xl md:rounded-[1.5rem] px-6 text-xs md:text-sm font-black uppercase tracking-widest text-white/40 focus:text-white outline-none appearance-none cursor-pointer">
                       <option>Producción IFEMA</option>
                       <option>Gira Mundial Tier 1</option>
                       <option>Laboratorio VIMUME</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Prioridad Alpha</label>
                    <select className="w-full h-16 md:h-20 bg-white/5 border border-white/10 rounded-2xl md:rounded-[1.5rem] px-6 text-xs md:text-sm font-black uppercase tracking-widest text-white/40 focus:text-white outline-none appearance-none cursor-pointer">
                       <option>Nivel 1 (Crítico)</option>
                       <option>Nivel 2 (Standby)</option>
                       <option>Nivel 3 (Logístico)</option>
                    </select>
                 </div>
              </div>

              <button className="w-full h-20 md:h-24 rounded-3xl bg-primary text-black font-black uppercase text-xs md:text-lg tracking-[0.4em] shadow-4xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 mt-8">
                 AUTORIZAR DESPLIEGUE <ChevronRight size={24} />
              </button>
           </div>
        </div>

        {/* 3. LOGBOOK / ACTIVITY MONITOR */}
        <div className={`p-10 md:p-16 rounded-[3rem] md:rounded-[4.5rem] bg-black/20 border border-white/5 space-y-12 shadow-3xl`}>
           <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white/40 italic">Activity <span className="text-white not-italic">Logbook.</span></h4>
              <Activity className="text-primary/40 animate-pulse" />
           </div>

           <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
              {[
                { time: '14:23', msg: 'ACCESO NIVEL 1 AUTORIZADO - NODO.MARID', type: 'success' },
                { time: '12:05', msg: 'ADVERTENCIA: CARGA TÉRMICA EN ARSENAL.LED', type: 'warning' },
                { time: '09:41', msg: 'SINCRONIZACIÓN FIREBASE COMPLETADA', type: 'info' },
                { time: '08:12', msg: 'NUEVA SOLICITUD FORENSE RECIBIDA (TIER 1)', type: 'alert' }
              ].map((log, i) => (
                <div key={i} className="flex gap-6 items-start p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                   <span className="text-[10px] font-black text-primary font-mono pt-1">{log.time}</span>
                   <div className="space-y-1">
                      <p className={`text-[11px] md:text-sm font-bold uppercase tracking-wide ${log.type === 'warning' ? 'text-red-400' : log.type === 'alert' ? 'text-yellow-500' : 'text-white/60'}`}>{log.msg}</p>
                      <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">System Node Alpha-9</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SovereignControl;

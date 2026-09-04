"use client";
import React from 'react';
import { useEmpireStore } from '@/stores/useEmpireStore';
import { TrendingUp, Zap, Target, Users, Shield, ArrowRight } from 'lucide-react';

export function ExpansionDashboard() {
  const { soberanos, addSoberano } = useEmpireStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* VERTICAL 1: VAMPIRIZACIÓN (CONTROL DE LEADS) */}
      <div className="flex justify-between items-end border-b border-[#d4a855]/20 pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            MATRIZ DE <span className="text-[#d4a855]">SOBERANOS</span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold mt-2">Vertical I: Inteligencia de Mercado</p>
        </div>
        <button 
          onClick={() => addSoberano({ id: Math.random().toString(), nombre: 'Lead Prospecto Enriquecido', etapa: 'Prospección Activa', valor: 0, probabilidad: 0 })}
          className="bg-[#d4a855] text-black px-8 py-3 rounded-full font-black uppercase text-[10px] hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,168,85,0.3)]"
        >
          Capturar Prospecto (+0€)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VERTICAL 2: ORÁCULO ASTRA (MÉTRICAS) */}
        <div className="lg:col-span-2 glass-pane p-8 border-[#d4a855]/30 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Pipeline Total</p>
            <p className="text-4xl font-black text-white">€{soberanos.reduce((acc, s) => acc + s.valor, 0).toLocaleString()}</p>
            <p className="text-[10px] text-white/40 font-mono flex items-center gap-1">0.0% · Sin Ventas Aún</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Tasa de Cierre</p>
            <p className="text-4xl font-black text-white">0%</p>
            <p className="text-[10px] text-[#d4a855] font-bold tracking-widest uppercase">Fase Pre-Operativa</p>
          </div>
          <div className="space-y-1 text-right">
            <Zap className="text-[#d4a855] ml-auto mb-2" size={24} />
            <p className="text-[9px] text-white/30 uppercase font-black">Modo Astra</p>
            <p className="text-xl font-black text-[#d4a855]">SINAPSIS OK</p>
          </div>
        </div>

        {/* VERTICAL 3: DESPACHO DE FLOTA (ACCIONES) */}
        <div className="glass-pane p-6 border-white/10 flex flex-col justify-between">
          <h3 className="text-[10px] font-black uppercase text-white/60 tracking-widest mb-4">Estado de Flota VIP</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <span className="text-[10px] text-white/80">V-VIP Mercedes</span>
                <span className="text-[9px] bg-green-500/20 text-green-400 px-2 rounded">LISTO</span>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg opacity-50">
                <span className="text-[10px] text-white/80">Range Rover Lux</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 rounded">STANDBY</span>
             </div>
          </div>
          <button className="w-full mt-6 py-3 border border-white/20 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-all">Ver Telemetría</button>
        </div>
      </div>

      {/* TABLA DE DOMINANCIA */}
      <div className="glass-pane p-8 border-white/5 overflow-hidden">
        <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
          <Target className="text-[#d4a855]" size={18} /> Historial de Operaciones
        </h3>
        <table className="w-full text-left">
          <thead className="text-white/20 uppercase text-[9px] font-black tracking-[0.2em]">
            <tr>
              <th className="pb-4">Soberano</th>
              <th className="pb-4">Potencial</th>
              <th className="pb-4">Etapa</th>
              <th className="pb-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {soberanos.map((s) => (
              <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="py-5 font-bold text-white/90">{s.nombre}</td>
                <td className="py-5 font-black text-[#d4a855]">€{s.valor.toLocaleString()}</td>
                <td className="py-5 text-white/40 uppercase text-[10px] tracking-widest">{s.etapa}</td>
                <td className="py-5 text-right">
                  <button className="text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 ml-auto group-hover:text-[#d4a855] transition-colors">
                    Ficha de Misión <ArrowRight size={10} />
                  </button>
                </td>
              </tr>
            ))}
            {soberanos.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-white/30 italic uppercase font-mono text-xs">
                  0 Operaciones Cerradas · Ecosistema en Fase Pre-Lanzamiento (0 Ventas / 0 € Ingresos)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpansionDashboard;


"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  Shield, 
  Globe, 
  Users,
  ChevronRight,
  Database,
  Layers,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/app/components/ui/glassCard";

// ============================================================================
// 🏛️ VIMUME IMPACT REACTOR & AURA WALLET (V33 AGUJERO NEGRO)
// ============================================================================

export default function VimumePage() {
  const [auraBalance, setAuraBalance] = useState(14500.50);
  const [impactScore, setImpactScore] = useState(8.9);
  const [isSyncing, setIsSyncing] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: "tx_01", type: "SPLIT", entity: "Ayto. Alcorcón", amount: 1250.00, status: "PAID", date: "Hace 2h" },
    { id: "tx_02", type: "DIRECT", entity: "Proveedor Audio Pro", amount: 450.25, status: "PENDING", date: "Hace 5h" },
    { id: "tx_03", type: "RECURRING", entity: "Suscripción Premium", amount: 29.99, status: "PAID", date: "Ayer" },
  ]);

  const syncMatrix = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* HEADER: EL REACTOR DE IMPACTO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse shadow-[0_0_10px_#ecb613]" />
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">Singularity Node v2.0</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white">
            REACTOR <span className="text-[#ecb613] not-italic">VIMUME</span>
          </h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Monitor de Impacto Social y Flujo del Agujero Negro</p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={syncMatrix}
            disabled={isSyncing}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
          >
            {isSyncing ? <Activity className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
            Sincronizar NUCLEO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: AURA WALLET & KPI */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AURA WALLET: EL AGUJERO NEGRO FINANCIERO */}
          <GlassCard className="p-8 border-[#ecb613]/20 bg-gradient-to-br from-[#ecb613]/10 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <Wallet className="w-20 h-20 text-[#ecb613] -rotate-12 translate-x-4 -translate-y-4" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-[#ecb613] rounded-lg text-black">
                  <Sparkles size={16} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Aura Wallet</h2>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-[#ecb613]/60 tracking-widest">Balance de Comisiones</p>
                <p className="text-5xl font-black text-white tracking-tighter italic">
                  {auraBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}<span className="text-[#ecb613] ml-2 text-3xl">€</span>
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Impact Score</p>
                  <p className="text-xl font-black text-[#ecb613] italic">{impactScore}<span className="text-xs ml-1 opacity-40">/10</span></p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">ROI Social</p>
                  <p className="text-xl font-black text-white italic">+245%</p>
                </div>
              </div>

              <button className="w-full mt-10 py-4 bg-[#ecb613] text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:shadow-[0_0_30px_rgba(236,182,19,0.3)] transition-all">
                Liquidar en Stripe
              </button>
            </div>
          </GlassCard>

          {/* TELEMETRÍA DE RED */}
          <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 flex items-center gap-2">
              <Globe size={12} /> Red de Influencia
            </h2>
            <div className="space-y-6">
              {[
                { name: "Ayuntamientos", count: 12, growth: "+4" },
                { name: "Proveedores", count: 85, growth: "+12" },
                { name: "Terapeutas", count: 42, growth: "+2" },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-[#ecb613]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black italic">{item.count}</span>
                    <span className="text-[8px] font-black text-emerald-500">{item.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* COLUMNA DERECHA: LEDGER DE TRANSACCIONES & FEED */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* COMMISSION LEDGER */}
          <GlassCard className="p-0 border-white/5 bg-black/60 overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <TrendingUp className="text-[#ecb613] w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Commission Ledger</h3>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Historial de Transacciones Fraccionadas</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              </div>
            </div>

            <div className="flex-1 p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.01]">
                  <tr>
                    <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-white/20">Entidad / Nodo</th>
                    <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-white/20">Tipo</th>
                    <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-white/20">Estado</th>
                    <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-white/20 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-[#ecb613] transition-colors">{tx.entity}</span>
                          <span className="text-[8px] font-mono text-white/20 mt-1">{tx.date} • {tx.id}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[9px] font-black uppercase px-2 py-1 bg-white/5 rounded-md border border-white/10">{tx.type}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-1 rounded-full ${tx.status === 'PAID' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                          <span className={`text-[9px] font-black uppercase ${tx.status === 'PAID' ? 'text-emerald-500' : 'text-yellow-500'}`}>{tx.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black italic text-white">+{tx.amount.toFixed(2)}€</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
              <button className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors flex items-center gap-2">
                Ver Transacciones del Agujero Negro <ChevronRight size={12} />
              </button>
            </div>
          </GlassCard>

          {/* GRID DE IMPACTO SECUNDARIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8 border-white/5 bg-white/[0.01] flex items-center gap-6">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                <ArrowUpRight size={28} />
              </div>
              <div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Crecimiento de Red</p>
                <p className="text-xl font-black text-white italic">+15.2% <span className="text-xs font-normal opacity-40 ml-1">este mes</span></p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-white/5 bg-white/[0.01] flex items-center gap-6">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                <Layers size={28} />
              </div>
              <div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Bloques Sincronizados</p>
                <p className="text-xl font-black text-white italic">4,502 <span className="text-xs font-normal opacity-40 ml-1">nodos</span></p>
              </div>
            </GlassCard>
          </div>
        </div>

      </div>

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#ecb613]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />
      </div>

    </div>
  );
}

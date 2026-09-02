"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function WeddingPlannerDashboard() {
  const [weddingsPerYear, setWeddingsPerYear] = useState<number>(10);
  const [avgBudget, setAvgBudget] = useState<number>(3000);
  const commissionRate = 0.15; // 15% S-Class Affiliate Commission

  const moneyLost = weddingsPerYear * avgBudget * commissionRate;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HEADER PARTNER */}
      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Icons.Shield className="w-8 h-8 text-[#d4af37]" />
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase">EAR OS // P2P</h1>
            <p className="text-[10px] text-[#d4af37] tracking-[0.2em] uppercase">S-Class Partner Network</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Estado: No Verificado</span>
          <button className="bg-[#d4af37] text-black px-6 py-2 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-white transition-colors">
            Solicitar Invitación
          </button>
        </div>
      </header>

      {/* HERO ROI CALCULATOR */}
      <section className="pt-40 pb-20 px-8 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Abstract Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 mb-8 text-[#d4af37] text-xs font-black tracking-[0.3em] uppercase">
            <Icons.TrendingUp className="w-4 h-4" /> Calculadora de Impacto
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black font-display tracking-tighter leading-none mb-6">
            Cuánto dinero estás <br/>
            <span className="text-red-500 italic">Perdiendo?</span>
          </h2>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            La mayoría de las agencias y planners regalan los márgenes de producción técnica. Nosotros te los pagamos.
          </p>
        </motion.div>

        {/* CALCULATOR INTERFACE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10"
        >
          
          <div className="space-y-10">
            <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Tus Métricas</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm text-zinc-400 uppercase tracking-wider font-bold">Bodas al Año</label>
                <span className="text-2xl font-black text-[#d4af37]">{weddingsPerYear}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={weddingsPerYear} 
                onChange={(e) => setWeddingsPerYear(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm text-zinc-400 uppercase tracking-wider font-bold">Presupuesto A/V por Boda</label>
                <span className="text-2xl font-black text-[#d4af37]">{avgBudget} €</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="20000" 
                step="500"
                value={avgBudget} 
                onChange={(e) => setAvgBudget(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-black/80 rounded-2xl p-8 border border-[#d4af37]/20 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <p className="text-sm text-zinc-400 uppercase tracking-widest font-bold mb-4">Capital Perdido Anual</p>
            <div className="text-6xl font-black font-mono tracking-tighter text-red-500 mb-8 tabular-nums">
              -{moneyLost.toLocaleString()} €
            </div>

            <div className="border-t border-white/5 py-6">
              <p className="text-sm text-zinc-400 uppercase tracking-widest font-bold mb-4">Tu Beneficio EAR OS P2P</p>
              <div className="text-5xl font-black font-mono tracking-tighter text-[#d4af37] tabular-nums flex items-center gap-4">
                +{moneyLost.toLocaleString()} €
                <Icons.ArrowUpRight className="w-10 h-10" />
              </div>
            </div>

            <button className="w-full mt-4 bg-white text-black py-4 rounded-lg font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all">
              Reclamar mi Margen
            </button>
          </div>

        </motion.div>
      </section>

      {/* P2P FEATURES */}
      <section className="py-24 px-8 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 border border-white/5 bg-black/50 rounded-2xl hover:border-[#d4af37]/30 transition-colors">
            <Icons.Zap className="w-10 h-10 text-[#d4af37] mb-6" />
            <h3 className="text-xl font-black mb-4">Ejecución Invisible</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Trabajamos bajo tu marca blanca. Entregamos excelencia técnica S-Class, y tú te llevas el mérito frente a tus clientes.
            </p>
          </div>

          <div className="p-8 border border-white/5 bg-black/50 rounded-2xl hover:border-[#d4af37]/30 transition-colors">
            <Icons.PieChart className="w-10 h-10 text-[#d4af37] mb-6" />
            <h3 className="text-xl font-black mb-4">Comisiones Black-Tier</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Hasta un 20% de comisión directa por cada contrato cerrado a través del ecosistema EAR. Liquidaciones a 24H.
            </p>
          </div>

          <div className="p-8 border border-white/5 bg-black/50 rounded-2xl hover:border-[#d4af37]/30 transition-colors">
            <Icons.Target className="w-10 h-10 text-[#d4af37] mb-6" />
            <h3 className="text-xl font-black mb-4">Preferencia Absoluta</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Los VIP Partners tienen prioridad de despliegue y acceso preferente al Roster The Signal de artistas exclusivos.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { NeuralRadar } from "../../components/neural/NeuralRadar";
import { motion } from "framer-motion";
import { 
  DollarSign, Activity, Database, Server, Globe, Cpu, ArrowUpRight, Zap, Target, Search, Brain, Rocket
} from "lucide-react";
import Link from "next/link";

const EarCommandCenterSClass = () => {
  const [valuation, setValuation] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);

  useEffect(() => {
    const valInterval = setInterval(() => {
      setValuation(prev => prev >= 2500000 ? 2500000 : prev + 25000);
    }, 10);
    const dataInterval = setInterval(() => {
      setDataPoints(prev => prev >= 1383510 ? 1383510 : prev + 13835);
    }, 10);
    return () => {
      clearInterval(valInterval);
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <div className="bg-[#050505] text-white min-h-screen font-mono selection:bg-[#d4af37]/30 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <header className="border-b border-white/10 bg-[#0a0c10]/80 backdrop-blur-md sticky top-0 z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-white/50">EAR OS · COMMAND CENTER · V2.0</h1>
        </div>
        <div className="flex gap-6 text-[10px] tracking-widest text-gray-500 uppercase">
          <span className="flex items-center gap-2 font-bold text-[#d4af37]">S-CLASS STATUS: OPTIMAL</span>
          <span className="flex items-center gap-2"><Server size={12} /> DUBAI (MIRROR)</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* MODULO: LEGADO DE SABIDURIA RESCATADO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-12 bg-gradient-to-r from-[#0a0c10] to-[#111] border border-[#d4af37]/20 rounded-2xl p-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[#d4af37] text-xs font-bold tracking-[0.3em] uppercase mb-2 flex items-center gap-2">
                <Brain size={14} /> Legado de Autoridad: 99 Dias Haciendo Clic
              </h3>
              <p className="text-xl font-bold uppercase tracking-tighter text-white/90">Metodologia S-Class Restaurada</p>
            </div>
            <div className="bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/20">
              <span className="text-[10px] font-black text-[#d4af37] tracking-widest uppercase animate-pulse">100% Verified</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase mb-2">Skill Maestro</p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Metodo Nike</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase mb-2">Estrategia Elite</p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Paradoja 10K</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase mb-2">Defensa Mercado</p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Trust Architecture</p>
            </div>
          </div>
        </motion.div>

        {/* KPI: Valoracion Financiera */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-8 bg-[#0a0c10] border border-[#d4af37]/20 rounded-2xl p-8 relative overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign size={120} /></div>
          <span className="text-[#d4af37] text-xs font-bold tracking-widest uppercase bg-[#d4af37]/10 px-2 py-1 rounded">IPO VALUATION</span>
          <div className="text-7xl font-bold tracking-tighter text-white mb-2 font-display">${valuation.toLocaleString()}</div>
          <p className="text-gray-400 text-sm flex items-center gap-2"><ArrowUpRight className="text-green-500" size={16} /> <span className="text-green-500 font-bold">+12.5%</span> vs Q4 2025</p>
        </motion.div>

        {/* KPI: RAG Intelligence */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-4 bg-[#0a0c10] border border-white/10 rounded-2xl p-8 relative overflow-hidden hover:border-white/30 transition-colors">
          <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2"><Database size={14} className="text-blue-500" /> Intelligence Core</h3>
          <div className="text-4xl font-bold text-white mb-1">{dataPoints.toLocaleString()}</div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Lineas de Conocimiento</p>
        </motion.div>

        {/* Accesos Directos */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/the-signal"><div className="bg-[#111] border border-white/5 p-6 rounded-xl cursor-pointer group hover:border-[#d4af37]/50 transition-all"><Zap className="text-[#d4af37] mb-4" /><h3 className="text-sm font-bold uppercase tracking-widest">The Signal</h3></div></Link>
          <Link href="/astra"><div className="bg-[#111] border border-white/5 p-6 rounded-xl cursor-pointer group hover:border-[#d4af37]/50 transition-all"><Brain className="text-[#d4af37] mb-4" /><h3 className="text-sm font-bold uppercase tracking-widest">Astra OS</h3></div></Link>
          <Link href="/vimume"><div className="bg-[#111] border border-white/5 p-6 rounded-xl cursor-pointer group hover:border-red-500/50 transition-all"><Activity className="text-red-500 mb-4" /><h3 className="text-sm font-bold uppercase tracking-widest">Vimume</h3></div></Link>
          <Link href="/toolkit-hub"><div className="bg-[#111] border border-white/5 p-6 rounded-xl cursor-pointer group hover:border-[#d4af37]/50 transition-all"><Target className="text-[#d4af37] mb-4" /><h3 className="text-sm font-bold uppercase tracking-widest">Engineering Hub</h3></div></Link>
        </div>

        <footer className="md:col-span-12 mt-12 border-t border-white/5 pt-8 flex justify-between items-center text-xs text-gray-600 font-mono">
          <p>SYSTEM STATUS: <span className="text-green-500 font-bold uppercase tracking-widest">Optimal</span></p>
          <p>LAST SYNC: {new Date().toLocaleTimeString()}</p>
          <p>EAR OS BUILD: 2026.03.17.ULTRA</p>
        </footer>
      </main>
    </div>
  );
};

export default EarCommandCenterSClass;
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Target, Users, DollarSign, Activity, Globe, Search } from "lucide-react";
import { NeuralRadar } from "@/components/neural/NeuralRadar";
import Link from "next/link";

export default function CommandCenterPage() {
  const [valuation, setValuation] = useState(0);
  const targetValuation = 2500000;

  useEffect(() => {
    const interval = setInterval(() => {
      setValuation(prev => {
        if (prev >= targetValuation) return targetValuation;
        return prev + 12500;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 sm:p-8 font-sans selection:bg-[#d4af37] selection:text-black pt-20">
      {/* HEADER S-CLASS */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-[#d4af37]" />
            <span className="text-xs font-mono text-[#d4af37] tracking-[0.3em]">EAR OPERATING SYSTEM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white">
            Command <span className="text-zinc-600">Center</span>
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs font-mono text-zinc-500 mb-1">VALORACIÓN IPO (EST)</div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#d4af37]">
            ${valuation.toLocaleString()}
          </div>
        </div>
      </header>

      {/* GRID TÁCTICO */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* RADAR DE MERCADO (HUNGARIAN ALGO) */}
        <div className="col-span-12 lg:col-span-8 bg-[#0a0c10] border border-white/10 rounded-3xl p-1 relative overflow-hidden group hover:border-[#d4af37]/30 transition-all">
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-xl font-bold flex items-center gap-2 font-mono">
              <Activity className="w-5 h-5 text-[#d4af37]" />
              Market Intelligence
            </h3>
            <p className="text-sm text-zinc-500 mt-1 font-mono">Algoritmo Húngaro & Rastreo de Competencia</p>
          </div>
          <div className="h-[400px] w-full">
            <NeuralRadar />
          </div>
        </div>

        {/* GROWTH ENGINE */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-[#0a0c10] border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#d4af37]/10 rounded-xl">
                  <Zap className="w-6 h-6 text-[#d4af37]" />
                </div>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-mono rounded">ACTIVE</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 font-serif">Growth Engine</h3>
              <p className="text-sm text-zinc-500 mb-4 font-mono">
                Capacidades inyectadas del ecosistema EAR:
              </p>
              <ul className="space-y-2 text-sm text-zinc-400 font-mono">
                <li className="flex items-center gap-2"><Target className="w-3 h-3 text-amber-400" /> Hunter Protocol (Email Finding)</li>
                <li className="flex items-center gap-2"><Users className="w-3 h-3 text-amber-400" /> CRM Automation Pipeline</li>
                <li className="flex items-center gap-2"><DollarSign className="w-3 h-3 text-amber-400" /> Revenue Ops (Stripe 100€)</li>
                <li className="flex items-center gap-2"><Search className="w-3 h-3 text-amber-400" /> SEO Dominance</li>
              </ul>
            </div>
            <Link 
              href="/toolkit-hub" 
              className="w-full mt-6 bg-white/5 hover:bg-[#d4af37] hover:text-black text-white py-3 rounded-xl font-mono text-xs uppercase tracking-widest transition-all text-center block"
            >
              Desplegar Toolkit Hub
            </Link>
          </motion.div>
        </div>

        {/* METRICS & STATUS */}
        <div className="col-span-6 lg:col-span-3 bg-[#0a0c10] border border-white/10 rounded-3xl p-6">
          <div className="text-zinc-500 text-xs font-mono mb-2">TOTAL ASSETS</div>
          <div className="text-3xl font-bold font-mono">34,114</div>
          <div className="text-[#d4af37] text-xs mt-1 font-mono">+12% vs last week</div>
        </div>
        <div className="col-span-6 lg:col-span-3 bg-[#0a0c10] border border-white/10 rounded-3xl p-6">
          <div className="text-zinc-500 text-xs font-mono mb-2">RAG KNOWLEDGE</div>
          <div className="text-3xl font-bold font-mono">1.3M</div>
          <div className="text-xs text-zinc-600 mt-1 font-mono">Data points indexed</div>
        </div>
        <div className="col-span-12 lg:col-span-6 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-3xl p-6 text-black relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black font-serif mb-2">VIMUME LEGACY</h3>
            <p className="text-black/80 max-w-md text-sm font-medium mb-4 font-mono">
              Proyecto de impacto social activo. Conectando memoria y música para 1.500 beneficiarios.
            </p>
            <Link href="/vimume" className="inline-block bg-black text-white px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase font-mono">
              Ver Informe de Impacto
            </Link>
          </div>
          <Globe className="absolute -right-4 -bottom-4 w-32 h-32 text-black/10 rotate-12" />
        </div>

      </div>
    </div>
  );
}

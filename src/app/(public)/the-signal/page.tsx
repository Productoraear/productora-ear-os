'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, ArrowRight, Zap, Play, CheckCircle2, 
  Award, FileCheck, Users, Building, Activity, ChevronRight, Lock
} from 'lucide-react';

export default function TheSignalPage() {
  const [selectedRole, setSelectedRole] = useState<'PARTICULAR' | 'B2B' | 'B2G' | 'ARTISTA'>('PARTICULAR');
  const [eventBudget, setEventBudget] = useState<number>(2500);
  const [attendeeRange, setAttendeeRange] = useState<string>('50-200');
  const [calculatedSolvency, setCalculatedSolvency] = useState<number>(94);

  const handleRoleChange = (role: 'PARTICULAR' | 'B2B' | 'B2G' | 'ARTISTA') => {
    setSelectedRole(role);
    if (role === 'PARTICULAR') { setEventBudget(1500); setCalculatedSolvency(92); }
    if (role === 'B2B') { setEventBudget(4500); setCalculatedSolvency(96); }
    if (role === 'B2G') { setEventBudget(8500); setCalculatedSolvency(99); }
    if (role === 'ARTISTA') { setEventBudget(1200); setCalculatedSolvency(88); }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-6 relative overflow-hidden selection:bg-[#d4a855]/30">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#d4a855]/10 via-purple-500/5 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* 🌟 HERO: CINEMATIC AUTHORITY */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[#d4a855]">
            <Sparkles size={14} className="animate-spin text-[#d4a855]" />
            <span>PORTAL DE INMERSIÓN TÁCTICA & PRE-CALIFICACIÓN // S-CLASS</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tight text-white leading-[0.9]">
            THE <span className="text-[#d4a855]">SIGNAL</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            La puerta de entrada a la infraestructura escénica de Productora EAR. Evalúa la solvencia técnica de tu evento, desbloquea las garantías contractuales y conecta con el motor de cotización adecuado.
          </p>
        </div>

        {/* 🧭 PRE-QUALIFICATION & ROLE ROUTE SELECTOR */}
        <div className="bg-[#101010] border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-10">
          <div className="text-center space-y-2">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#d4a855]">
              Fase 1: Pre-Calificación de Solvencia & Perfilado
            </h3>
            <h2 className="text-2xl md:text-3xl font-black uppercase italic text-white">
              ¿Cuál es tu rol en la producción?
            </h2>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'PARTICULAR', title: 'Boda / Particular VIP', icon: <Sparkles size={20} />, desc: 'Ceremonias de gala y aniversarios exclusivos.' },
              { id: 'B2B', title: 'Empresa / Convención', icon: <Building size={20} />, desc: 'Galas corporativas, ferias y lanzamientos de marca.' },
              { id: 'B2G', title: 'Ayuntamiento / Fiestas', icon: <Shield size={20} />, desc: 'Licitaciones públicas y festejos patronales.' },
              { id: 'ARTISTA', title: 'Músico / Curador', icon: <Users size={20} />, desc: 'Ingreso al roster oficial y rider técnico.' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id as any)}
                className={`p-6 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all duration-300 ${
                  selectedRole === r.id
                    ? 'bg-[#d4a855]/10 border-[#d4a855] shadow-lg shadow-[#d4a855]/10'
                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === r.id ? 'bg-[#d4a855] text-black' : 'bg-white/5 text-zinc-400'
                }`}>
                  {r.icon}
                </div>
                <div>
                  <h4 className={`text-sm font-black uppercase tracking-tight ${selectedRole === r.id ? 'text-[#d4a855]' : 'text-white'}`}>
                    {r.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Live Solvency & Readiness Metrics Box */}
          <div className="bg-black/60 border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Índice de Solvencia Técnica</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white italic">{calculatedSolvency}%</span>
                <span className="text-xs text-[#d4a855] font-bold uppercase">APTO S-CLASS</span>
              </div>
            </div>

            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Garantía Aplicada</span>
              <p className="text-xs font-bold text-zinc-300">Póliza RC 1.000.000€ + Rider Shure/L-Acoustics</p>
            </div>

            <div className="flex md:justify-end">
              <Link
                href={selectedRole === 'PARTICULAR' ? '/presupuesto' : '/cotizador'}
                className="w-full md:w-auto px-6 py-3.5 bg-[#d4a855] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#d4a855]/20 flex items-center justify-center gap-2"
              >
                Acceder a {selectedRole === 'PARTICULAR' ? 'Recomendador' : 'Cotizador'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* 🛡️ LIVING AUTHORITY BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#d4a855]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d4a855]/10 flex items-center justify-center text-[#d4a855]">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">Blindaje Legal & ACID Ledger</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Contratos mercantiles automatizados con retención, factura desglosada y registro inmutable para empresas e instituciones.
            </p>
          </div>

          <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#d4a855]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d4a855]/10 flex items-center justify-center text-[#d4a855]">
              <Activity size={24} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">Acústica Zero-Fail</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Equipos L-Acoustics K2/Kara y microfonía Axient Digital. Presión sonora homogénea sin ecos ni acoples en directo.
            </p>
          </div>

          <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#d4a855]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d4a855]/10 flex items-center justify-center text-[#d4a855]">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">Solvencia Escénica</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dirección musical bajo la tutela del Maestro Edwin Agudelo, arreglos orquestales propios y elegancia charra de gran gala.
            </p>
          </div>
        </div>

        {/* 🚀 CONVERSION HUB: DUAL HIGH TICKET FUNNEL */}
        <div className="p-10 lg:p-14 bg-gradient-to-br from-[#141414] via-[#0d0d0d] to-[#080808] border border-[#d4a855]/40 rounded-[3rem] text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-[#d4a855] uppercase tracking-[0.4em] block">
              SISTEMA DE DECISIÓN S-CLASS // ELECCIÓN DE RUTA
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-white">
              ¿Cómo deseas estructurar tu evento?
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto">
              Elige entre la búsqueda inteligente por afinidad o el configurador técnico de partidas presupuestarias.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
            <Link
              href="/presupuesto"
              className="w-full sm:w-1/2 py-5 bg-[#d4a855] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,168,85,0.25)] flex items-center justify-center gap-3"
            >
              <Sparkles size={16} /> Recomendador Matcher
            </Link>
            
            <Link
              href="/cotizador"
              className="w-full sm:w-1/2 py-5 bg-white/5 border border-white/20 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <FileCheck size={16} /> Cotizador Técnico
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

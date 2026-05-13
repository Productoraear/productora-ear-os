'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crosshair, 
  Zap, 
  Cpu, 
  Database, 
  ShieldAlert, 
  Target, 
  Radio, 
  LayoutGrid,
  Sword,
  Wrench,
  Siren,
  FileText
} from 'lucide-react';

/**
 * 🛠️ CONSOLIDATED TACTICAL PANELS (S-Class v3.0)
 * Restoration of supporting modules for the S-Class Fleet.
 */

/* 1. ARSENAL TACTICO */
export function TacticalArsenalPanel() {
  const assets = [
    { name: 'Algoritmo Cazador', type: 'IA / Matching', power: '98%' },
    { name: 'VIMUME Aspiration', type: 'Data / Bio', power: '92%' },
    { name: 'Nexus Connector', type: 'Network', power: '87%' },
    { name: 'Admin Shield V2', type: 'Security', power: 'MAX' },
  ];

  return (
    <div className="bg-[#080808] min-h-screen text-white p-8 md:p-16 rounded-[4rem] border border-white/5 space-y-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Sword size={300} />
      </div>
      <header className="space-y-4">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Tactical <span className="text-[#d4af37]">Arsenal</span></h1>
        <p className="text-[10px] tracking-[0.4em] font-black uppercase text-zinc-500">Recursos de Dominancia Operacional</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {assets.map((asset, i) => (
          <div key={i} className="bg-zinc-900 border border-white/5 p-10 rounded-[3rem] hover:border-[#d4af37]/30 transition-all group">
            <div className="w-12 h-12 bg-black rounded-2xl mb-6 flex items-center justify-center text-[#d4af37]">
               {i === 0 ? <Target size={24} /> : i === 1 ? <Radio size={24} /> : i === 2 ? <LayoutGrid size={24} /> : <ShieldAlert size={24} />}
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-[#d4af37] transition-colors">{asset.name}</h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">{asset.type}</p>
            <div className="mt-6 flex justify-between items-end">
               <div className="text-3xl font-black italic">{asset.power}</div>
               <button className="text-[8px] font-black uppercase tracking-widest text-[#d4af37]">Ajustar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 2. OPERATIONS TOOLKIT */
export function ToolkitPanel() {
  const tools = ['Conversor de Divisas', 'Calculadora de ROI', 'Generador de Dossier', 'Mapper de Activos', 'Sync de Calendario', 'Vampire Data Scraper'];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white p-8 md:p-16 rounded-[4rem] border border-white/5 space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Ops <span className="text-zinc-600">Toolkit</span></h1>
          <p className="text-[10px] tracking-[0.4em] font-black uppercase text-[#d4af37]">Herramientas de Alta Productividad</p>
        </div>
        <Wrench size={48} className="text-zinc-800" />
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <button key={i} className="h-40 bg-zinc-900 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 hover:bg-zinc-800 hover:border-white/10 transition-all group shadow-xl">
            <Cpu size={32} className="text-zinc-700 group-hover:text-[#d4af37] transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{tool}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* 3. SECURITY TRACKER */
export function SecurityTrackerPanel() {
  return (
    <div className="bg-black min-h-screen text-white p-8 md:p-16 rounded-[4rem] border border-white/5 space-y-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <header className="flex items-center gap-8 relative z-10">
        <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] animat-pulse">
           <Siren size={32} className="text-white" />
        </div>
        <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Security <span className="text-red-500">Pulse</span></h1>
      </header>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 space-y-8 relative z-10">
        <div className="flex justify-between items-center bg-black/40 p-10 rounded-[2rem] border border-white/5">
           <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Estado Perimetral</div>
              <div className="text-4xl font-black italic text-[#4dff88]">TODO DESPEJADO</div>
           </div>
           <ShieldAlert size={48} className="text-[#4dff88] opacity-50" />
        </div>
        <div className="space-y-4">
           {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-6 bg-black/20 rounded-2xl border border-white/5 font-mono text-[10px]">
                 <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                 <span className="text-zinc-400 uppercase">Intento de Acceso Bloqueado: IP_HASH_00{i}</span>
                 <span className="text-red-400 font-bold">RECHAZADO</span>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

/* 4. OPERATIONAL BRIEFING */
export function BriefingPanel() {
  return (
    <div className="bg-[#050505] min-h-screen text-white p-8 md:p-16 rounded-[4rem] border border-white/5 space-y-12">
      <header className="space-y-4">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Ops <span className="text-[#d4af37]">Briefing</span></h1>
        <p className="text-[10px] tracking-[0.4em] font-black uppercase text-zinc-500">Estado de Misión: Reconstrucción en Curso</p>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="bg-zinc-900 rounded-[3rem] p-12 space-y-8 border border-white/5">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic border-b border-white/5 pb-6">Objetivos de Hoy</h2>
          <div className="space-y-6">
            {['Inyección de Flota TSX', 'Sincronización Bodega H:', 'Auditoría Forense F:', 'Validación de 52 Sesiones'].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-10 h-10 bg-black rounded-xl border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                   <Target size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight uppercase group-hover:text-[#d4af37] transition-colors">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900 rounded-[3rem] p-12 space-y-8 border border-white/5 flex flex-col justify-center items-center text-center">
           <FileText size={80} className="text-[#d4af37] opacity-20 mb-4" />
           <h2 className="text-2xl font-black uppercase tracking-tighter italic">Documentación S-Class</h2>
           <p className="text-xs text-zinc-500 max-w-xs uppercase leading-relaxed">Todos los protocolos de alta gama están siendo migrados al nuevo núcleo de EAR OS V2.</p>
           <button className="mt-8 px-12 h-16 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl">
              Leer Dossier Completo
           </button>
        </div>
      </div>
    </div>
  );
}

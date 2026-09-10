"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Crown, ShieldCheck, Database, Users, Cpu, CheckCircle2, Bot, 
  Sparkles, Layers, Terminal, ChevronRight, X, LayoutGrid, AlertTriangle, 
  Activity, Landmark, Zap, Radio
} from 'lucide-react';

export default function AdminSClassDashboard() {
  const [copilotOpen, setCopilotOpen] = useState(true);

  const modules = [
    { id: 'omni-cockpit', name: 'Omni-Cockpit', desc: 'Centro de comando drag & drop con widgets reordenables y persistencia.', icon: LayoutGrid, tag: 'DRAG & DROP', color: 'text-white' },
    { id: 'sourcing', name: 'Sourcing & Tesorería', desc: 'Matriz presupuestaria, pipeline de proveedores y copiloto LTV.', icon: Database, tag: 'CENTRO OPS', color: 'text-[#d4ac0d]' },
    { id: 'directorio', name: 'Directorio de Proveedores', desc: 'Gobierno de 26K+ proveedores con control territorial y filtros.', icon: Users, tag: '26K+ NODOS', color: 'text-emerald-400' },
    { id: 'afiliados', name: 'Red de Afiliados', desc: 'Motor de comisionamiento por tiers con simulador en vivo.', icon: Crown, tag: 'COMISIONES', color: 'text-[#8e44ad]' },
    { id: 'cockpit', name: 'Cockpit B2G & NDA', desc: 'Expedientes institucionales Art. 118 LCSP y contratos de ultra-lujo.', icon: Landmark, tag: 'B2G < 14.250 €', color: 'text-red-400' },
    { id: 'oraculo', name: 'Oráculo S-Class', desc: 'Módulos cognitivos protegidos con TOTP, tripwires y auditoría.', icon: ShieldCheck, tag: 'TOTP 2FA', color: 'text-[#d4ac0d]', highlight: true },
    { id: 'telemetria', name: 'Telemetría Global', desc: 'Estado de subsistemas en tiempo real, latencias y salud bare-metal.', icon: Activity, tag: 'REAL-TIME', color: 'text-cyan-400' },
    { id: 'mobile-studio', name: 'Mobile Experience Studio', desc: 'Selector OLED de 4 modos y Fusion Mixer de 10 arquetipos.', icon: Layers, tag: 'NEW', color: 'text-white' }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] font-sans">
      <header className="bg-[#080808] border-b border-[#1f1f1f] px-6 py-3.5 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#d4ac0d] font-black tracking-wider text-sm">
            <Crown className="w-4 h-4" /> EAR OS // CENTRO DE MANDO S-CLASS
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-[#141414] border border-[#333] px-3 py-1.5 rounded-lg font-semibold text-[#d4ac0d] uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27ae60]" /> Modus Soberano
          </div>
          <div className="text-gray-400 font-medium">Km 0 Méntrida</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 pb-32">
        <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d4ac0d] bg-[#d4ac0d]/10 px-3 py-1 rounded-full border border-[#d4ac0d]/20">
              <Cpu className="w-3.5 h-3.5" /> Cabina Central Soberana S-Class
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Productora EAR // Panel de Operaciones</h1>
            <p className="text-gray-400 text-sm max-w-2xl font-light">Gobierno centralizado de tesorería, automatización con IA local y ejecución de eventos de alto valor.</p>
          </div>
          <div className="bg-[#121212] border border-[#222] p-4 rounded-xl space-y-2 text-xs relative z-10 w-full md:w-64">
            <div className="flex justify-between text-gray-300"><span>Supabase:</span><span className="text-[#27ae60] font-bold">● Conectado</span></div>
            <div className="flex justify-between text-gray-300"><span>Worker IA:</span><span className="text-[#d4ac0d] font-semibold">2.55s (Activo)</span></div>
            <div className="flex justify-between text-gray-300"><span>Leads LTV:</span><span className="text-white font-bold">8 cargados</span></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#d4ac0d]"/> Módulos de Gestión Activa <span className="text-[10px] text-gray-600 ml-auto">8 subsistemas operativos</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod) => (
              <Link href={`/admin/${mod.id}`} key={mod.id} className={`bg-[#0b0b0b] border ${mod.highlight ? 'border-[#3b3066] hover:border-[#8e44ad]' : 'border-[#1f1f1f] hover:border-[#d4ac0d]/50'} p-5 rounded-xl transition-all group flex items-start gap-4 cursor-pointer`}>
                <div className={`p-3 rounded-xl bg-[#141414] border border-[#222] group-hover:bg-[#1a1a1a] transition-colors ${mod.color}`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white group-hover:text-[#d4ac0d] transition-colors">{mod.name}</h4>
                    <span className="text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-[#141414] border border-[#333] text-gray-400">{mod.tag}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-light">{mod.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#d4ac0d] self-center transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </main>

      {copilotOpen && (
        <aside className="fixed bottom-6 right-6 w-96 bg-[#0e0e0e] border border-[#333] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="bg-[#141414] border-b border-[#222] px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4ac0d]"><Bot className="w-4 h-4"/> COPILOTO GLOBAL</div>
            <button onClick={() => setCopilotOpen(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-[#050505] border border-[#222] p-3 rounded-xl text-xs text-gray-300">
              <span className="text-[#d4ac0d] font-semibold block mb-1">Contexto S-Class Restaurado</span>
              Toda la infraestructura está ahora conectada al motor de enrutamiento estabilizado.
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

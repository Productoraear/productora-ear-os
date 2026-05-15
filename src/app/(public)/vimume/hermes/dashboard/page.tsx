"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  History, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Printer 
} from 'lucide-react';

// Tipos base para el Hub Operativo
type SessionStatus = 'idle' | 'recording' | 'review' | 'closed';

export default function HermesDashboard() {
  const [status, setStatus] = useState<SessionStatus>('idle');

  return (
    <main className="bg-[#0A0A0A] min-h-screen text-white flex font-sans selection:bg-[#ecb613]/30">
      {/* 🧊 SIDEBAR NAVIGATION - SILICON VALLEY STYLE */}
      <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col p-4 lg:p-6 gap-8 bg-[#050505]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-[#ecb613] rounded-xl flex items-center justify-center text-black font-black italic">H</div>
          <span className="hidden lg:block font-black uppercase tracking-tighter text-xl">HERMES <span className="text-[#ecb613]">OT</span></span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard, active: true },
            { label: "Sesiones", icon: Clock },
            { label: "Pacientes", icon: Users },
            { label: "Historial", icon: History },
            { label: "Informes", icon: FileText },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${item.active ? 'bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20' : 'text-white/40 hover:bg-white/5'}`}>
              <item.icon size={20} />
              <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <button className="w-full flex items-center gap-4 p-4 text-white/20 hover:text-red-500 transition-colors">
            <LogOut size={20} />
            <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT CANVAS */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-4 text-white/40">
            <span className="text-[10px] font-black uppercase tracking-widest">Edwin Agudelo</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest">Centro Navalcarnero</span>
          </div>
          <div className="flex items-center gap-6">
             <Search size={18} className="text-white/40" />
             <Bell size={18} className="text-white/40" />
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ecb613] to-orange-500 border border-white/10" />
          </div>
        </header>

        <section className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto w-full">
          {/* 👋 WELCOME & ACTIONS */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Bienvenido, <span className="text-[#ecb613]">Edwin</span></h2>
              <p className="text-white/40 text-sm italic">Usted tiene 4 sesiones programadas para hoy.</p>
            </div>
            <button onClick={() => setStatus('recording')} className="px-8 py-4 bg-[#ecb613] text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)]">
              <PlusCircle size={18} /> Nueva Sesión
            </button>
          </div>

          <AnimatePresence mode="wait">
            {status === 'idle' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                {/* 📊 SUMMARY CARDS */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: "Sesiones Hoy", value: "04", icon: Clock },
                    { label: "Borradores", value: "02", icon: FileText },
                    { label: "Participantes", value: "45", icon: Users },
                  ].map((card, i) => (
                    <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex justify-between items-center group hover:bg-[#ecb613]/5 transition-all">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{card.label}</p>
                        <p className="text-4xl font-black italic tracking-tighter">{card.value}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#ecb613]/20 transition-colors">
                        <card.icon size={24} className="text-[#ecb613]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 📋 RECENT ACTIVITY TABLE */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Sesiones Recientes</h3>
                  <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20">Participante</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20">Estado</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20">Última Nota</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { id: "P-045", name: "Paciente 45", status: "Borrador", time: "Hace 2h" },
                          { id: "P-102", name: "Paciente 102", status: "Cerrada", time: "Ayer" },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">{row.id}</div>
                                <span className="font-bold text-sm">{row.name}</span>
                              </div>
                            </td>
                            <td className="p-6 text-[10px] font-black uppercase">
                              <span className={`px-3 py-1 rounded-full ${row.status === 'Borrador' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-6 text-xs text-white/40 italic">"{row.time}"</td>
                            <td className="p-6 text-right">
                              <button className="p-2 hover:text-[#ecb613] transition-colors">
                                <Printer size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 space-y-12">
                 <div className="flex justify-between items-center border-b border-white/5 pb-8">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#ecb613]">Nueva Sesión Operativa</h2>
                  <button onClick={() => setStatus('idle')} className="text-[10px] font-black uppercase tracking-widest text-white/40">Cancelar</button>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Participante</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#ecb613]">
                        <option>Seleccionar Paciente...</option>
                        <option>P-045 - Paciente 45</option>
                        <option>P-102 - Paciente 102</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Objetivo</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#ecb613]" placeholder="Ej: Reducir apatía matutina..." />
                    </div>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Protocolo S-Class</p>
                    <div className="space-y-4">
                       <label className="flex items-center gap-3 text-xs italic text-white/60">
                         <input type="checkbox" className="accent-[#ecb613]" checked /> Consentimiento verificado
                       </label>
                       <label className="flex items-center gap-3 text-xs italic text-white/60">
                         <input type="checkbox" className="accent-[#ecb613]" checked /> Documentar sesión activa
                       </label>
                    </div>
                    <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ecb613] transition-colors">
                      Comenzar Intervención
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

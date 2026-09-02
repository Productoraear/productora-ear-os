'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Lock, 
  Activity,
  Globe,
  MapPin,
  FileText,
  DollarSign
} from 'lucide-react';

/**
 * 🛡️ COMPONENT: SHIELD TRACKER (S-Class v3.0)
 * Tactical Kanban / Pulse for Distance Weddings & High-End Events.
 * Logic: Emotional certainty through real-time military-grade tracking.
 */

interface Task {
  id: string;
  status: 'completed' | 'active' | 'pending' | 'blocked';
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  date: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    status: 'completed',
    title: 'Auditores de Acústica en Recinto',
    category: 'Ingeniería',
    priority: 'high',
    details: 'Se ha verificado la resonancia de la sala principal. Limitadores configurados.',
    date: '2026-03-20'
  },
  {
    id: '2',
    status: 'active',
    title: 'Protocolo de Seguridad VIP',
    category: 'Logística',
    priority: 'critical',
    details: 'Coordinación con escoltas y control de accesos perimetrales en curso.',
    date: '2026-03-22'
  },
  {
    id: '3',
    status: 'pending',
    title: 'Carga de Arsenal Martin Audio',
    category: 'Hardware',
    priority: 'medium',
    details: 'Preparación de equipo técnico para transporte desde Hub Madrid.',
    date: '2026-03-24'
  },
  {
    id: '4',
    status: 'blocked',
    title: 'Visa de Artista Internacional',
    category: 'Legal',
    priority: 'high',
    details: 'Esperando validación consular para el saxofonista desde NYC.',
    date: '2026-03-21'
  }
];

export default function ShieldTracker() {
  const [tasks] = useState<Task[]>(INITIAL_TASKS);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return '#4dff88';
      case 'active': return '#d4af37';
      case 'pending': return '#ffffff44';
      case 'blocked': return '#ff4d4d';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={18} />;
      case 'active': return <Activity size={18} className="animate-pulse" />;
      case 'pending': return <Clock size={18} />;
      case 'blocked': return <AlertTriangle size={18} />;
    }
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      {/* HEADER TÁCTICO */}
      <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#d4af37] border border-[#d4af37]/20">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter">Shield Tracker <span className="text-[#d4af37]">S-Class</span></h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <Globe size={10} className="text-[#d4af37]" /> Control Logístico Nacional de Alta Disponibilidad
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-zinc-900/50 px-4 py-2 rounded-xl border border-white/5">
            <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Estado Operativo</div>
            <div className="text-sm font-bold text-[#4dff88] flex items-center gap-2 uppercase">
              <span className="w-2 h-2 bg-[#4dff88] rounded-full animate-pulse" /> Activo
            </div>
          </div>
          <div className="bg-zinc-900/50 px-4 py-2 rounded-xl border border-white/5 font-mono">
            <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Token ID</div>
            <div className="text-sm font-bold text-white/60">EAR-2026-SHLD</div>
          </div>
        </div>
      </div>

      {/* MÉTRICAS DE PULSO */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5">
        {[
          { label: 'Completado', val: '84%', icon: CheckCircle2, color: '#4dff88' },
          { label: 'Latencia', val: '12ms', icon: Activity, color: '#d4af37' },
          { label: 'Ubicación', val: 'Madrid', icon: MapPin, color: '#ffffff' },
          { label: 'Nodos', val: '127', icon: Globe, color: '#ffffff' },
        ].map((m, i) => (
          <div key={i} className="p-6 border-r border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <m.icon size={12} className="text-zinc-500" />
              <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{m.label}</span>
            </div>
            <div className="text-2xl font-black tracking-tighter" style={{ color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* LISTA TÁCTICA (KANBAN) */}
      <div className="p-4 md:p-8 space-y-4">
        <AnimatePresence>
          {tasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl hover:border-[#d4af37]/30 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6"
            >
              <div 
                className="w-1.5 h-12 rounded-full hidden md:block" 
                style={{ backgroundColor: getStatusColor(task.status) }} 
              />
              
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ color: getStatusColor(task.status) }}>
                {getStatusIcon(task.status)}
              </div>

              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h4 className="text-lg font-bold tracking-tight">{task.title}</h4>
                  <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400">
                    {task.category}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm italic font-medium">{task.details}</p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-[8px] text-zinc-500 uppercase font-black">Fecha Objetivo</div>
                  <div className="text-xs font-mono font-bold">{task.date}</div>
                </div>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FOOTER - CTA DE ACCIÓN */}
      <div className="p-8 bg-gradient-to-t from-zinc-900/50 to-transparent border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="Agent" />
              </div>
            ))}
          </div>
          <div>
            <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Equipo en Escucha</div>
            <div className="text-xs font-bold">3 Agentes S-Class Asignados</div>
          </div>
        </div>

        <button className="px-10 h-14 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
          <Lock size={16} /> Abrir Canal Seguro de Protocolo
        </button>
      </div>
    </div>
  );
}

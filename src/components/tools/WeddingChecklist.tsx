"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Zap,
  MoreHorizontal
} from 'lucide-react';

const TASKS = [
  { id: 1, category: '10 a 12 Meses Antes', items: [
      { text: 'Establecer Presupuesto Base', done: true, priority: 'high' },
      { text: 'Elegir Fecha & Reservar Banquete', done: true, priority: 'high' },
      { text: 'Aprobar EAR OS Blueprint', done: true, priority: 'critical' }
    ]
  },
  { id: 2, category: '6 a 9 Meses Antes', items: [
      { text: 'Contratación DJ EAR', done: false, priority: 'critical' },
      { text: 'Elección de Fotógrafo Documental', done: true, priority: 'high' },
      { text: 'Primer listado de Invitados', done: false, priority: 'normal' }
    ]
  },
  { id: 3, category: '3 a 6 Meses Antes', items: [
      { text: 'Reunión Musical con Kamal (Repertorio)', done: false, priority: 'high' },
      { text: 'Cerrar Luna de Miel', done: false, priority: 'normal' },
      { text: 'Envío de Invitaciones Oficiales', done: false, priority: 'high' }
    ]
  },
  { id: 4, category: 'El Mes del Evento', items: [
      { text: 'Confirmation Final Invitados', done: false, priority: 'critical' },
      { text: 'Cierre de Distribución Mesas (Arranger)', done: false, priority: 'high' },
      { text: 'Prueba de Sonido / Iluminación S-Class', done: false, priority: 'critical' }
    ]
  }
];

export const WeddingChecklist = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-12 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-4 text-[#d4af37] font-mono tracking-widest text-[10px] font-black uppercase border border-[#d4af37]/30 px-6 py-2 rounded-full bg-[#d4af37]/5">
            <Zap className="w-4 h-4 fill-[#d4af37]" />
            <span>Master Timeline Controller</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Planificador <br className="hidden md:block"/>
            <span className="italic font-serif text-[#d4af37] font-normal">S-Class.</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Ejecución táctica garantizada. El éxito de un evento se forja en los detalles previos. 
            Este es nuestro Checkpoint de Seguridad Operativa.
          </p>
        </div>

        {/* PROGRESS HUD */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 mb-12 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">Avance Global (Sync)</span>
            <span className="font-mono text-2xl font-black text-white">41%</span>
          </div>
          <div className="w-full bg-black border border-white/10 rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '41%' }}
              className="h-full bg-gradient-to-r from-[#d4af37]/50 to-[#d4af37] shadow-[0_0_15px_#d4af37]" 
            />
          </div>
          <div className="flex justify-between mt-4 text-[10px] uppercase font-bold text-zinc-600 tracking-widest">
            <span className="text-emerald-500">5 Tareas Completadas</span>
            <span className="text-amber-500">7 Tareas Pendientes</span>
          </div>
        </div>

        {/* TIMELINE LIST */}
        <div className="space-y-12 relative">
          
          {/* Vertical Line Connector */}
          <div className="absolute left-8 top-10 bottom-10 w-px bg-white/5 hidden md:block" />

          {TASKS.map((group, groupIdx) => (
            <div key={group.id} className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="hidden md:flex w-16 h-16 bg-[#050505] border-[3px] border-[#d4af37]/30 rounded-full items-center justify-center shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                  <Calendar className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white/90">
                  {group.category}
                </h3>
              </div>

              <div className="md:ml-[88px] space-y-4">
                {group.items.map((task, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                      task.done 
                        ? 'bg-emerald-900/10 border-emerald-500/10 hover:border-emerald-500/30' 
                        : 'bg-zinc-900/30 border-white/5 hover:border-[#d4af37]/30 group'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {task.done ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-zinc-600 shrink-0 group-hover:text-[#d4af37] transition-colors" />
                      )}
                      <div>
                        <p className={`font-bold ${task.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                          {task.text}
                        </p>
                        <div className="flex gap-2 items-center mt-1">
                          {task.priority === 'critical' && (
                            <span className="text-[9px] uppercase tracking-widest bg-rose-500/10 text-rose-500 px-2 rounded border border-rose-500/20 flex items-center gap-1">
                               <AlertTriangle className="w-2 h-2" /> CRITICAL
                            </span>
                          )}
                          {task.priority === 'high' && (
                            <span className="text-[9px] uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 rounded border border-amber-500/20 flex items-center gap-1">
                               <Clock className="w-2 h-2" /> HIGH PRIO
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button className="text-zinc-600 hover:text-white transition-colors">
                       <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default WeddingChecklist;

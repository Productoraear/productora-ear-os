"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  Map as MapIcon, 
  CheckSquare, 
  Calculator, 
  Globe, 
  Gift, 
  ArrowRight, 
  Zap,
  Music,
  ShieldCheck
} from 'lucide-react';

const TOOLS = [
  {
    title: 'Gestor de Invitados',
    desc: 'Control de asistencia, alergias y requerimientos dietéticos nivel S-Class.',
    icon: Users,
    href: '/herramientas/invitados',
    color: 'text-blue-500'
  },
  {
    title: 'Organizador de Mesas',
    desc: 'Distribución táctica del banquete. Arrastrar y soltar con IA.',
    icon: MapIcon,
    href: '/herramientas/mesas',
    color: 'text-emerald-500'
  },
  {
    title: 'Checklist Maestro',
    desc: 'Cronograma EAR OS paso a paso hasta el día del evento.',
    icon: CheckSquare,
    href: '/herramientas/checklist',
    color: 'text-rose-500'
  },
  {
    title: 'Control Presupuestario',
    desc: 'Gestión financiera milimétrica, pagos pendientes e historial.',
    icon: Calculator,
    href: '/herramientas/presupuesto',
    color: 'text-purple-500'
  },
  {
    title: 'Buscador de Proveedores',
    desc: 'Acceso a la base de datos verificada de partners S-Class.',
    icon: Globe,
    href: '/herramientas/proveedores',
    color: 'text-[#d4af37]'
  },
  {
    title: 'Playlist & Audiovisual',
    desc: 'Coordinación directa de repertorio y momentos clave con EAR DJ.',
    icon: Music,
    href: '/herramientas/musica',
    color: 'text-indigo-400'
  }
];

export const WeddingToolsHub = () => {
  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="mb-16 border-b border-white/5 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4 text-[#d4af37] font-mono tracking-widest text-[10px] font-black uppercase">
              <Zap className="w-4 h-4 fill-[#d4af37]" />
              <span>Suite de Herramientas Novios (Couple Hub)</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Command <br />
              <span className="italic font-serif text-[#d4af37] font-normal">Center.</span>
            </h1>
            <p className="text-zinc-500 text-lg">
              Deje el Excel obsoleto. Su boda merece una infraestructura tecnológica de grado operativo. 
              Control total desde un único dashboard.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 px-4 py-2 rounded-xl text-[#d4af37] md:w-auto w-full justify-center">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-widest">S-Class Activated</span>
          </div>
        </div>

        {/* METRICS HUD STYLE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Días Restantes', value: '142', sub: 'T-Minus' },
            { label: 'Invitados Conf.', value: '184', sub: 'de 200' },
            { label: 'Presupuesto', value: '62%', sub: 'Consumido' },
            { label: 'Tareas Completas', value: '45', sub: 'de 120' }
          ].map((metric, i) => (
            <div key={i} className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#d4af37]/30 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">{metric.label}</span>
              <div>
                <div className="text-4xl font-mono font-black text-white">{metric.value}</div>
                <div className="text-[10px] uppercase text-[#d4af37] mt-1 tracking-widest">{metric.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={tool.href} className="block h-full bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 group hover:bg-zinc-900/50 hover:border-[#d4af37]/30 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute -inset-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full blur-3xl" />
                
                <div className={`w-14 h-14 bg-black rounded-full flex items-center justify-center border border-white/10 mb-8 group-hover:scale-110 transition-transform ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3 group-hover:text-[#d4af37] transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-sm text-zinc-500 leading-relaxed max-w-[90%] mb-8">
                  {tool.desc}
                </p>

                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                  Ingresar Módulo <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WeddingToolsHub;

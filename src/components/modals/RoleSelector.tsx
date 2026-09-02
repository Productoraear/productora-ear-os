
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types';
import { 
  Users, 
  Briefcase, 
  Terminal, 
  TrendingUp, 
  MessageSquare, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const ROLE_CONFIGS = [
  { 
    role: UserRole.ARTIST, 
    title: "Artista / Talento", 
    desc: "Crea tu Arquitectura de Legado y monetiza tu arte.", 
    icon: Users,
    color: "from-purple-600 to-pink-600"
  },
  { 
    role: UserRole.MANAGER, 
    title: "Mánager / Agente", 
    desc: "Gestiona activos artísticos con precisión quirúrgica.", 
    icon: Briefcase,
    color: "from-blue-600 to-cyan-600"
  },
  { 
    role: UserRole.ENTREPRENEUR, 
    title: "Emprendedor", 
    desc: "Escala tu ROI mediante ingeniería emocional y de marca.", 
    icon: TrendingUp, 
    color: "from-green-600 to-emerald-600"
  },
  { 
    role: UserRole.PROJECT_MANAGER, 
    title: "Project Manager", 
    desc: "Optimiza procesos y garantiza la latencia cero.", 
    icon: Terminal,
    color: "from-amber-600 to-orange-600"
  },
  { 
    role: UserRole.STRATEGIC_COMMUNICATOR, 
    title: "Comunicador", 
    desc: "Construye narrativas que blindan y proyectan autoridad.", 
    icon: MessageSquare,
    color: "from-indigo-600 to-violet-600"
  },
  { 
    role: UserRole.BOOK_AUTHOR, 
    title: "Autor / Escritor", 
    desc: "Convierte tu conocimiento en un legado estructurado.", 
    icon: BookOpen,
    color: "from-rose-600 to-red-600"
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 bg-[#050505] overflow-y-auto">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-4">
          SELECCIONA TU <br />
          <span className="gold-text">MODALIDAD.</span>
        </h1>
        <p className="mt-4 text-lg text-white/40 max-w-2xl mx-auto uppercase tracking-widest font-bold">
          Configura tu HUD según tu rol estratégico en el ecosistema EAR.
        </p>
      </motion.div>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ROLE_CONFIGS.map((config, index) => (
          <motion.button
            key={config.role}
            onClick={() => onRoleSelect(config.role)}
            className="group relative h-48 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden p-8 text-left transition-all hover:border-gold-500/40 hover:-translate-y-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center group-hover:border-gold-500/50 transition-all">
                  <config.icon className="text-gold-500 group-hover:scale-110 transition-transform" size={24} />
                </div>
                <ArrowRight className="text-white/10 group-hover:text-gold-500 group-hover:translate-x-2 transition-all" size={20} />
              </div>
              
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:gold-text transition-all">
                  {config.title}
                </h3>
                <p className="text-sm text-white/40 mt-1 line-clamp-2">
                  {config.desc}
                </p>
              </div>
            </div>
            
            {/* Minimalist Role Number */}
            <span className="absolute -bottom-4 -right-4 text-7xl font-black text-white/[0.01] group-hover:text-gold-500/[0.03] transition-colors italic">
              0{index + 1}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

type IntentRole = 'DIPLOMATICO' | 'ARTISTA' | 'VIMUME';

interface PortalProps {
  role: IntentRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  activeColor: string;
  onHover: (role: IntentRole | null) => void;
  isActive: boolean;
}

const Portal: React.FC<PortalProps> = ({ role, title, description, icon, activeColor, onHover, isActive }) => {
  return (
    <motion.div
      className={`relative group cursor-pointer p-8 rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 ${
        isActive ? 'scale-105 border-opacity-50' : 'hover:border-white/30 opacity-60 hover:opacity-100'
      }`}
      style={{
        backgroundColor: isActive ? `${activeColor}10` : 'transparent',
        boxShadow: isActive ? `0 0 40px ${activeColor}20` : 'none',
      }}
      onMouseEnter={() => onHover(role)}
      onMouseLeave={() => onHover(null)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-500`}
             style={{ color: isActive ? activeColor : 'white' }}>
          {icon}
        </div>
        <h3 className="text-xl font-bold tracking-widest text-white group-hover:text-gold-400 transition-colors uppercase">
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed font-light">
          {description}
        </p>
        
        <div className="flex flex-col space-y-3 w-full mt-6">
          <Link href={`/${role === 'VIMUME' ? 'proyectos/vimume' : role === 'DIPLOMATICO' ? 'eventos' : 'artistas'}`}>
            <motion.button
              className="w-full px-10 py-3 rounded-xl border border-gold-500/30 text-[10px] font-black tracking-[0.4em] hover:bg-gold-500 hover:text-black shadow-[0_0_20px_rgba(196,163,0,0.1)] transition-all uppercase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sincronizar Señal
            </motion.button>
          </Link>
          
          <Link href="/identificacion">
            <motion.button
              className="w-full px-10 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.4em] hover:border-gold-500/50 text-gray-400 hover:text-white transition-all uppercase flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield size={12} className="text-gold-500" />
              Auditoría Estratégica
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Dynamic Bezel Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at center, ${activeColor}05 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
};

export const IntentScanner: React.FC = () => {
  const [activeRole, setActiveRole] = useState<IntentRole | null>(null);

  const portals: PortalProps[] = [
    {
      role: 'DIPLOMATICO',
      title: 'Eventos / Institucional',
      description: 'Diplomacia Estratégica, Embajadas y Coordinación de Élite. Sistemas de afiliados para Wedding Planners.',
      icon: <Shield size={32} />,
      activeColor: '#C4A300',
      isActive: activeRole === 'DIPLOMATICO',
      onHover: setActiveRole,
    },
    {
      role: 'ARTISTA',
      title: 'Artistas / Humanizarte',
      description: 'Formación avanzada y monetización inmutable. Casting nacional HU-MANIZARTE en proceso.',
      icon: <Sparkles size={32} />,
      activeColor: '#C4A300',
      isActive: activeRole === 'ARTISTA',
      onHover: setActiveRole,
    },
    {
      role: 'VIMUME',
      title: 'Proyectos / VIMUME',
      description: 'Viaje Musical por la Memoria. Sincronización Estratégica de legados históricos para la salud emocional.',
      icon: <BrainCircuit size={32} />,
      activeColor: '#C4A300',
      isActive: activeRole === 'VIMUME',
      onHover: setActiveRole,
    },
  ];

  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
      {/* Background Liquid Shader Simulation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: activeRole ? 1.2 : 1,
            opacity: activeRole ? 0.4 : 0.1,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ backgroundColor: activeRole ? '#C4A300' : '#453200' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {portals.map((portal) => (
          <Portal key={portal.role} {...portal} />
        ))}
      </div>

      {/* Security Badge Placeholder */}
      <motion.div 
        className="mt-16 flex items-center space-y-2 flex-col opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold font-mono">
          Arquitectura Estratégica EAR OS - V.01 | SILICON VALLEY EDITION
        </span>
        <div className="flex space-x-4">
          <div className="text-[10px] border border-white/10 px-3 py-1 rounded bg-black/40">AES-256</div>
          <div className="text-[10px] border border-white/10 px-3 py-1 rounded bg-black/40">IPFS IMMUTABLE</div>
          <div className="text-[10px] border border-white/10 px-3 py-1 rounded bg-black/40">ZERO-LATENCY GPU</div>
        </div>
      </motion.div>
    </div>
  );
};

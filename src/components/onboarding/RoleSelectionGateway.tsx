'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Shield, Building2, Music, HeartHandshake } from 'lucide-react';
import { useSharedContext } from '@/app/context/SharedContext';

const profiles = [
  {
    id: 'b2g_institutional',
    title: 'Institución / B2G',
    subtitle: 'Ayuntamientos, Fondos UE, FITUR y Concejalias',
    icon: Building2,
    color: 'border-[#ecb613]/40 hover:border-[#ecb613]',
    targetRoute: '/blog/b2g',
    badge: 'Protocolo Oficial',
  },
  {
    id: 'b2b_events',
    title: 'B2B / Promotores & Fincas',
    subtitle: 'Bodas de Élite, Sonorización Bose/XR18 y Renta de Flota',
    icon: Shield,
    color: 'border-[#ecb613]/40 hover:border-[#ecb613]',
    targetRoute: '/cotizador',
    badge: 'Cotización <300ms',
  },
  {
    id: 'artist_talent',
    title: 'Artistas & Solistas',
    subtitle: 'Roster Exclusivo, Mariachi, Tenores y Emanager Studio',
    icon: Music,
    color: 'border-[#ecb613]/40 hover:border-[#ecb613]',
    targetRoute: '/artistas/edwin-agudelo',
    badge: 'Matching Activo',
  },
  {
    id: 'vimume_social',
    title: 'VIMUME / Impacto Social',
    subtitle: 'Musicoterapia Sensorial, Residencias y ODS 2030',
    icon: HeartHandshake,
    color: 'border-[#ecb613]/40 hover:border-[#ecb613]',
    targetRoute: '/vimume',
    badge: 'Memoria Sonora',
  },
];

export default function RoleSelectionGateway() {
  const router = useRouter();
  const { setRole } = useSharedContext();

  const handleSelectProfile = (profileId: string, targetRoute: string) => {
    // Persistencia del rol en el contexto soberano
    if (setRole) setRole(profileId);
    
    // Navegación fluida hacia la vertical seleccionada
    router.push(targetRoute);
  };

  return (
    <div className="max-w-6xl w-full px-6 py-12 z-10">
      <div className="text-center mb-12">
        <span className="text-[#ecb613] text-xs font-mono tracking-widest uppercase border border-[#ecb613]/30 px-3 py-1 rounded-full bg-[#ecb613]/5">
          Ecosistema Soberano EAR OS V2
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-4 bg-gradient-to-r from-white via-slate-200 to-[#ecb613] bg-clip-text text-transparent">
          Seleccione su Perfil Operativo
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Acceda a la infraestructura personalizada según su nivel de autoridad, requerimiento técnico o misión institucional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {profiles.map((profile, idx) => {
          const Icon = profile.icon;
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleSelectProfile(profile.id, profile.targetRoute)}
              className={`bg-[#0a0a0c]/80 backdrop-blur-xl border ${profile.color} p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(236,182,19,0.2)]`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#ecb613]/50 transition-colors">
                    <Icon className="w-6 h-6 text-[#ecb613]" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {profile.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#ecb613] transition-colors">
                  {profile.title}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {profile.subtitle}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs text-[#ecb613] font-semibold group-hover:translate-x-1 transition-transform">
                <span>Ingresar al Ecosistema</span>
                <span className="ml-2">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

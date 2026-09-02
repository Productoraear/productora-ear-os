"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Landmark, Heart, Sparkles, ChevronRight, Lock, Fingerprint, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ROLES = [
    { id: 'DIPLOMATICO', title: 'Diplomático / Embajada', icon: Landmark, color: '#0052FF', description: 'Protocolo de Excelencia y Atmósferas de Prestigio.' },
    { id: 'AYUNTAMIENTO', title: 'Institución / Alcaldía', icon: Shield, color: '#C4A300', description: 'Impacto Social y Transformación de Espacios Públicos.' },
    { id: 'COORDINADOR_BODA', title: 'Wedding Planner', icon: Heart, color: '#FF3B3B', description: 'Logística Invisible y Perfeccionismo Sensorial.' },
    { id: 'ARTISTA', title: 'Talento / Creador', icon: Sparkles, color: '#A855F7', description: 'Soberanía Creativa y Split 80% Directo.' },
    { id: 'VIMUME_CENTRO', title: 'VIMUME: Residencias', icon: Landmark, color: '#2ECC71', description: 'Programas de Envejecimiento Activo y 40Hz.' },
    { id: 'VIMUME_FAMILIAR', title: 'VIMUME: Familias', icon: Heart, color: '#FF69B4', description: 'Reconexión Emocional a través de los Recuerdos.' }
];

export default function IdentificationPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();

    const handleIdentify = (roleId: string) => {
        setSelected(roleId);
        setTimeout(() => {
            router.push(`/auditoria?role=${roleId}`);
        }, 1200);
    };

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] z-10 pointer-events-none" />

            <div className="absolute top-8 left-8 z-30">
              <Link href="/" className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors uppercase">
                <ChevronLeft size={16} />
                <span>Volver al Diamante</span>
              </Link>
            </div>
            
            <AnimatePresence>
                {!selected ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        className="relative z-20 max-w-4xl w-full space-y-8 text-center"
                    >
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400">
                                <Fingerprint size={14} />
                                <span>Control de Acceso Operativo</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black font-serif uppercase tracking-tight text-white">
                                IDENTIFICACIÓN <span className="text-amber-400">S-CLASS</span>
                            </h1>
                            <p className="text-zinc-400 text-xs sm:text-sm font-mono max-w-lg mx-auto">
                                Selecciona tu rol para personalizar la auditoría técnica y los protocolos de contratación.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                            {ROLES.map((role) => {
                                const Icon = role.icon;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => handleIdentify(role.id)}
                                        className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-900/60 transition-all flex flex-col justify-between group text-left"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 group-hover:scale-110 transition-transform">
                                                <Icon size={20} />
                                            </div>
                                            <ChevronRight size={16} className="text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold font-mono text-white mb-1">{role.title}</h3>
                                            <p className="text-[11px] text-zinc-500 font-mono leading-relaxed">{role.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-20 text-center space-y-4 font-mono"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
                        <h2 className="text-lg font-bold text-amber-400 tracking-widest uppercase">
                            Autenticando Credenciales...
                        </h2>
                        <p className="text-xs text-zinc-500">
                            Cargando suite de auditoría técnica y financiera.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

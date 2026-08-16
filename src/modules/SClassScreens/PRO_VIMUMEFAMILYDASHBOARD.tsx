'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Activity, ShieldCheck, Calendar, Music, Users, ArrowRight } from 'lucide-react';

export const VimumeFamilyDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050508] text-white pt-10 pb-12 px-4 md:px-6 font-sans">

            <div className="max-w-7xl mx-auto">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Conexión Neural Activa</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase italic tracking-tighter">
                            VISTA <span className="text-ear-purple text-outline-sm">NEURAL</span> FAMILIAR
                        </h1>
                        <p className="text-gray-400 mt-2 max-w-xl text-sm md:text-base">
                            Monitorización estratégica del impacto de la musicoterapia forense en el núcleo familiar VIMUME.
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-mono text-gray-400">
                        ID_SESION: VIM-2026-BETA
                    </div>
                </div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-ear-purple/20 to-black border border-white/5 flex flex-col justify-between group hover:border-ear-purple/30 transition-all">
                        <div className="flex justify-between items-start">
                            <Brain className="text-ear-purple" size={32} />
                            <span className="text-[10px] font-black text-ear-purple uppercase tracking-widest">Estado Cognitivo</span>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-5xl font-black italic">+24% Empatía Reactiva</h3>
                            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Mejora medida en la última sesión sonora</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col justify-between">
                        <Activity className="text-emerald-500" size={24} />
                        <div>
                            <h3 className="text-3xl font-black">Estable</h3>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest leading-tight">Ritmo Cardíaco en Frecuenciación 40Hz</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col justify-between">
                        <Heart className="text-red-500" size={24} />
                        <div>
                            <h3 className="text-3xl font-black">9.8/10</h3>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest leading-tight">Índice de Bienestar Familiar Relativo</p>
                        </div>
                    </div>
                </div>

                {/* Timeline and Assets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 p-8 rounded-[2rem] bg-white/5 border border-white/5">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 border-b border-white/5 pb-4">Bitácora de Sesiones (Historial Forense)</h4>
                        <div className="space-y-6">
                            {[
                                { date: '12 Feb 2026', title: 'Reconexión Boleros de Oro', status: 'Finalizada', impact: 'Alto' },
                                { date: '05 Feb 2026', title: 'Frecuencias de Memoria 40Hz', status: 'Finalizada', impact: 'Crítico+' },
                                { date: '29 Ene 2026', title: 'Mapeo de Biografía Sonora', status: 'Finalizada', impact: 'Media' },
                            ].map((session, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-ear-purple font-mono text-xs">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight">{session.title}</p>
                                            <p className="text-[10px] text-gray-400">{session.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase">
                                        <span className="text-emerald-500">{session.impact} Impacto</span>
                                        <ArrowRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-ear-purple text-black flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 opacity-20 group-hover:scale-110 transition-transform">
                            <Music size={120} />
                        </div>
                        <div>
                            <h4 className="font-black italic text-xl uppercase leading-tight">Solicitar Nueva Sesión Táctica</h4>
                            <p className="text-xs mt-2 font-medium">Prioridad para miembros del Legado VIMUME.</p>
                        </div>
                        <button className="mt-8 bg-black text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                            Contactar Ingeniería
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VimumeFamilyDashboard;

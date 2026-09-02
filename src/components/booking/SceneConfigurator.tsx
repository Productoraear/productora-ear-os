'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, DollarSign, Target, Sparkles, ChevronRight, Briefcase, Heart, Star, Users, ArrowRight } from 'lucide-react';

const EVENT_TYPES = [
    { id: 'gala', label: 'Gala Privada / VIP', icon: Star, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', base: 4500 },
    { id: 'corporate', label: 'Corporativo / Lanzamiento', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', base: 3500 },
    { id: 'wedding', label: 'Boda Luxury / Élite', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', base: 2450 }
];

export const SceneConfigurator = () => {
    const [selectedType, setSelectedType] = useState('wedding');
    const [duration, setDuration] = useState(4);
    const [attendees, setAttendees] = useState(150);

    const estimatedInvestment = useMemo(() => {
        const base = EVENT_TYPES.find(t => t.id === selectedType)?.base || 0;
        const durationMultiplier = 1 + (duration - 1) * 0.15;
        const guestsMultiplier = 1 + (attendees / 100) * 0.05;
        return Math.round(base * durationMultiplier * guestsMultiplier);
    }, [selectedType, duration, attendees]);

    return (
        <section className="bg-black/50 border border-white/10 rounded-[4rem] p-16 relative overflow-hidden group/container shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Sparkles size={200} className="text-gold-500" />
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-16 relative z-10">
                <div className="space-y-12 flex-1 w-full">
                    <header className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Target className="text-gold-500 animate-pulse" />
                            <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em]">Configurador de Escena v0.5</span>
                        </div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Diseña tu Experiencia</h2>
                        <p className="text-gray-500 font-light italic text-lg max-w-xl">Define la naturaleza de la señal y los parámetros del despliegue.</p>
                    </header>

                    {/* Step 1: Event Type */}
                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Paso 01: Naturaleza del Despliegue</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {EVENT_TYPES.map((type) => (
                                <button 
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`p-10 rounded-[3rem] border-2 transition-all duration-500 flex flex-col items-center gap-6 text-center group/card ${selectedType === type.id ? `${type.border} ${type.bg} scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.3)]` : 'bg-white/5 border-white/5 opacity-50 hover:opacity-100 hover:border-white/10 hover:bg-white/[0.08]'}`}
                                >
                                    <div className={`p-6 rounded-[2rem] bg-black border border-white/10 ${selectedType === type.id ? type.color : 'text-gray-700'}`}>
                                        <type.icon size={32} className="group-hover/card:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8 p-10 bg-white/5 border border-white/5 rounded-[3rem]">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-3">
                                        <Clock size={16} className="text-gold-500" />
                                        Duración del Evento
                                    </label>
                                    <span className="text-2xl font-black text-white">{duration}H</span>
                                </div>
                                <input 
                                    type="range" min="1" max="8" step="1"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-gold-500 cursor-pointer"
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-3">
                                        <Users size={16} className="text-gold-500" />
                                        Aforo Estimado
                                    </label>
                                    <span className="text-2xl font-black text-white">{attendees} PAX</span>
                                </div>
                                <input 
                                    type="range" min="30" max="500" step="10"
                                    value={attendees}
                                    onChange={(e) => setAttendees(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-gold-500 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Paso 02: Fecha de Reserva</h5>
                            <div className="p-8 bg-black/80 border border-white/10 rounded-[3rem] aspect-square flex flex-col items-center justify-center gap-6 group/cal cursor-pointer hover:border-gold-500 transition-all">
                                <Calendar size={48} className="text-gray-800 group-hover/cal:text-gold-500 transition-colors" />
                                <div className="text-center">
                                    <p className="text-xs font-black uppercase tracking-widest text-white">Abrir Calendario Master</p>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase mt-2">Ver Disponibilidad S-Class</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Investment Panel (Side) */}
                <div className="w-full lg:w-[400px] h-full flex flex-col gap-8 pt-20">
                    <div className="bg-gold-500 p-12 rounded-[3.5rem] flex flex-col gap-12 text-black shadow-[0_40px_100px_rgba(196,163,0,0.3)] relative overflow-hidden group/iv group">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <DollarSign size={100} />
                        </div>
                        
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Inversión Base Estimada</span>
                            <div className="text-6xl font-black tracking-tighter leading-none group-hover:scale-110 transition-transform origin-left">
                                {estimatedInvestment.toLocaleString()}€
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Fórmula de Despliegue v0.3</p>
                        </div>

                        <div className="space-y-4 border-t border-black/10 pt-8">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                <span>Tasa de Reserva (15%)</span>
                                <span>{Math.round(estimatedInvestment * 0.15)}€</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-60">
                                <span>Fee de Gestión</span>
                                <span>Incluido</span>
                            </div>
                        </div>

                        <button className="w-full py-8 mt-4 bg-black text-gold-500 font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4 group/next">
                            <span>Siguiente: Seleccionar Talento</span>
                            <ArrowRight size={16} className="group-hover/next:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-6">
                        <div className="p-3 bg-white/10 rounded-xl text-white">
                            <Sparkles size={18} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed text-gray-500">Cada despliegue incluye auditoría estratégica y calibración de señal gratuita.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

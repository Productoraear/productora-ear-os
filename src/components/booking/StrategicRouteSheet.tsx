'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Navigation, MapPin, Bus, Hotel, Mic, Tag, Truck, User, Phone, Send, Info, ChevronRight, Share2 } from 'lucide-react';

export const StrategicRouteSheet = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Mock countdown for next event
        const interval = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setHours(21, 0, 0, 0); // Next show at 21:00
            
            const diff = tomorrow.getTime() - now.getTime();
            if (diff > 0) {
                setTimeLeft({
                    hours: Math.floor(diff / (1000 * 60 * 60)),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60)
                });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatNum = (n: number) => n.toString().padStart(2, '0');

    const checkpoints = [
        { id: '1', time: '10:00', label: 'Salida Hotel', icon: Bus, status: 'DONE' },
        { id: '2', time: '12:30', label: 'Llegada Venue', icon: MapPin, status: 'CURRENT' },
        { id: '3', time: '15:00', label: 'Soundcheck', icon: Mic, status: 'PENDING' },
        { id: '4', time: '21:00', label: 'Showtime', icon: Tag, status: 'PENDING' },
        { id: '5', time: '23:30', label: 'Carga & Desalojo', icon: Truck, status: 'PENDING' }
    ];

    return (
        <section className="bg-[#0A0A0A] border-l-2 border-gold-500/20 p-12 space-y-12 relative animate-in slide-in-from-left duration-700">
            {/* Countdown Banner */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-gold-500/10 border border-gold-500/20 p-8 rounded-[3rem] backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Navigation size={100} className="text-gold-500" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                    <span className="text-gold-500 text-[9px] font-black uppercase tracking-[0.5em]">Próximo Despliegue</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Impacto Inminente</h3>
                </div>
                
                <div className="flex gap-4">
                    {[
                        { val: formatNum(timeLeft.hours), unit: 'HORAS' },
                        { val: formatNum(timeLeft.minutes), unit: 'MINUTOS' },
                        { val: formatNum(timeLeft.seconds), unit: 'SEGUNDOS' }
                    ].map((t, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="text-4xl md:text-6xl font-black tracking-tighter text-white font-mono tabular-nums leading-none">
                                {t.val}
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gold-500/50 mt-2">{t.unit}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Left: Checkpoints Timeline */}
                <div className="md:col-span-8 space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Hoja de Ruta | Checkpoints</h4>
                        <div className="flex items-center gap-2 text-[10px] text-green-500 font-black uppercase tracking-widest">
                            <Clock size={12} className="animate-spin-slow" />
                            Actualizado
                        </div>
                    </div>

                    <div className="space-y-4">
                        {checkpoints.map((cp) => (
                            <div key={cp.id} className={`p-8 rounded-[2rem] border transition-all flex items-center justify-between group cursor-pointer ${
                                cp.status === 'DONE' ? 'bg-white/5 border-white/10 opacity-40' : 
                                cp.status === 'CURRENT' ? 'bg-gold-500/10 border-gold-500 shadow-[0_0_40px_rgba(196,163,0,0.1)]' : 
                                'bg-black/50 border-white/5 hover:border-gold-500/30'
                            }`}>
                                <div className="flex items-center gap-8">
                                    <div className="text-xl font-black font-mono tracking-tighter text-gold-500">{cp.time}</div>
                                    <div className={`p-4 rounded-xl ${cp.status === 'CURRENT' ? 'bg-gold-500 text-black' : 'bg-white/5 text-gray-700'}`}>
                                        <cp.icon size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-[11px] font-black uppercase tracking-widest">{cp.label}</h5>
                                        <p className="text-[9px] text-gray-500 uppercase tracking-tighter font-bold">{cp.status === 'DONE' ? 'Sincronizado' : cp.status === 'CURRENT' ? 'En Progreso' : 'Planificado'}</p>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${cp.status === 'CURRENT' ? 'bg-gold-500 border-transparent text-black' : 'border-white/10 text-gray-700'}`}>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Crew Info */}
                <div className="md:col-span-4 space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Crew Asignada</h4>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'EDWIN AGUDELO', role: 'TOUR MANAGER', icon: User },
                            { name: 'JAVIER ALONSO', role: 'TECH DIRECTOR', icon: User },
                            { name: 'ADRIANA EAR', role: 'PROD DIRECTOR', icon: User }
                        ].map((c, idx) => (
                            <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-gold-500/30 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center">
                                        <c.icon size={18} className="text-gray-500 group-hover:text-gold-500 transition-colors" />
                                    </div>
                                    <div>
                                        <h6 className="text-[10px] font-black uppercase tracking-wider">{c.name}</h6>
                                        <p className="text-[8px] text-gold-500 uppercase font-black tracking-widest leading-none scale-100 opacity-60 group-hover:opacity-100 transition-opacity">{c.role}</p>
                                    </div>
                                </div>
                                <button className="p-3 hover:bg-gold-500 hover:text-black rounded-xl border border-white/10 transition-all">
                                    <Phone size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-8 bg-white/5 border border-white/10 rounded-[2rem] border-dashed text-xs font-black uppercase tracking-[0.3em] flex flex-col items-center justify-center gap-4 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all text-gray-500 hover:text-gold-500 group">
                        <Send size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        Enviar Reporte a Base
                    </button>
                    
                    <div className="p-6 bg-black border border-white/5 rounded-3xl flex items-center gap-4">
                        <Share2 size={16} className="text-gold-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Sincronizar con calendario externo</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

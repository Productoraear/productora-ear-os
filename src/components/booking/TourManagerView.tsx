'use client';

import React, { useState } from 'react';
import { Map, Navigation, MapPin, Search, Phone, ShieldCheck, Zap, Crosshair, ChevronRight, Activity, Globe } from 'lucide-react';

export const TourManagerView = () => {
    const [isAtVenue, setIsAtVenue] = useState(false);

    return (
        <section className="bg-black/50 border border-white/10 rounded-[4rem] p-12 space-y-12 relative overflow-hidden group/container shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <header className="flex justify-between items-end mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Globe className="text-gold-500 animate-spin-slow" />
                        <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em]">Geo-Strategic Logistics</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Monitoreo de Gira</h2>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Latitud: 40.4168° N</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Longitud: 3.7038° W</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Left: Map View (Main Area) */}
                <div className="md:col-span-8 space-y-6 relative h-[600px] bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden group">
                    {/* Mock Map Background (Abstract Grid) */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #C4A300 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                    </div>

                    {/* Interactive Heat Overlay Elements */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] ml-40 mt-40" />
                    </div>

                    {/* Map Markers */}
                    {[
                        { id: '1', top: '20%', left: '30%', active: false, label: 'Barcelona' },
                        { id: '2', top: '50%', left: '50%', active: true, label: 'Madrid (Current)' },
                        { id: '3', top: '80%', left: '40%', active: false, label: 'Mérida' }
                    ].map((marker) => (
                        <div key={marker.id} className="absolute transition-all duration-500" style={{ top: marker.top, left: marker.left }}>
                            <div className="relative group">
                                <div className={`w-6 h-6 rounded-full border-4 border-[#0A0A0A] flex items-center justify-center transition-all ${marker.active ? 'bg-gold-500 scale-125 shadow-[0_0_30px_rgba(196,163,0,0.5)]' : 'bg-white/20'}`}>
                                    <div className="w-1 h-1 bg-black rounded-full" />
                                </div>
                                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/80 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">{marker.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* UI Overlay Controls */}
                    <div className="absolute top-8 left-8 flex flex-col gap-4">
                        <button className="p-4 bg-black/80 border border-white/10 rounded-2xl hover:bg-gold-500 hover:text-black transition-all">
                            <Plus size={18} />
                        </button>
                        <button className="p-4 bg-black/80 border border-white/10 rounded-2xl hover:bg-gold-500 hover:text-black transition-all">
                            <Minus size={18} />
                        </button>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between p-6 bg-black/60 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-gold-500/20 rounded-2xl text-gold-500">
                                <Navigation size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <h6 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Próxima Parada</h6>
                                <p className="text-lg font-black uppercase tracking-tighter">Mérida | Anfiteatro Romano</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-px bg-white/10" />
                            <div className="text-right">
                                <p className="text-[10px] font-mono text-gray-400">ETA: 322 KM</p>
                                <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest">3h 45m</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Log Info Panel */}
                <div className="md:col-span-4 space-y-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-black rounded-2xl border border-white/5">
                                <Crosshair size={24} className="text-gold-500" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tech Manager Direct</h4>
                                <p className="text-lg font-black uppercase tracking-tighter">EDWIN AGUDELO</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-gray-600 font-black uppercase">Canal de Voz</span>
                                    <span className="text-[10px] font-bold text-white">+34 693 693 048</span>
                                </div>
                                <button className="p-3 bg-gold-500 text-black rounded-xl hover:scale-110 active:scale-95 transition-all">
                                    <Phone size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={16} className="text-green-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Seguridad Operativa</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap size={16} className="text-gold-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Respuesta Crítica: 18ms</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsAtVenue(!isAtVenue)}
                            className={`w-full py-8 mt-4 font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] transition-all flex items-center justify-center gap-4 overflow-hidden relative group/at ${
                                isAtVenue ? 'bg-green-500 text-white' : 'bg-gold-500 text-black hover:bg-white'
                            }`}
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/at:translate-x-full transition-transform duration-1000" />
                            <MapPin size={16} className={isAtVenue ? 'animate-bounce' : ''} />
                            <span className="relative z-10">{isAtVenue ? 'RECIBIDO EN VENUE' : 'LLEGUÉ AL VENUE'}</span>
                        </button>
                    </div>

                    <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] flex items-center gap-6 group hover:bg-red-500/10 transition-all cursor-pointer">
                        <div className="p-4 bg-red-500/20 rounded-2xl text-red-600">
                            <Activity size={24} className="animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-red-600">Alerta de Clima</h6>
                            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Activando Cláusula de Seguro IBM/DarkSky...</p>
                        </div>
                        <ChevronRight size={16} className="text-red-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const Plus = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const Minus = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

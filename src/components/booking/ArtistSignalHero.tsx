'use client';

import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Share2, Youtube, Music, Instagram, TrendingUp, Users, Zap, Maximize2, Settings, Monitor, Activity, ShieldCheck } from 'lucide-react';

export const ArtistSignalHero = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SYNCING' | 'DONE'>('IDLE');

    const stats = [
        { label: 'Views', value: '1.2M', icon: Users, trend: '+12%' },
        { label: 'Engagement', value: '84.2%', icon: TrendingUp, trend: '+5.4%' },
        { label: 'Real-time Signal', value: '98/100', icon: Activity, trend: 'Stable' }
    ];

    return (
        <section className="relative w-full aspect-video bg-black rounded-[4rem] border border-white/10 overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.8)] group animate-in zoom-in-95 duration-1000">
            {/* Background Video Mock (Subtle Gradient Animation) */}
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-gold-500/10 transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-105' : 'opacity-40'}`} />
            
            {/* Abstract Signal Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gold-500 animate-pulse" />
                <div className="absolute top-1/2 left-0 w-full h-[50px] bg-gradient-to-t from-transparent via-gold-500/20 to-transparent -translate-y-1/2" />
            </div>

            {/* Play Button Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isPlaying ? 'opacity-0 scale-150' : 'opacity-100'}`}>
                <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-32 h-32 bg-gold-500 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(196,163,0,0.4)] hover:scale-110 active:scale-90 transition-all group/play"
                >
                    <Play size={40} className="text-black ml-2 group-hover/play:scale-125 transition-transform" />
                </button>
            </div>

            {/* Top Bar UI */}
            <div className="absolute top-12 left-12 right-12 flex justify-between items-center z-10">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-xl flex items-center gap-4">
                        <Monitor size={18} className="text-gold-500" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white leading-none">Señal Artística Master</h4>
                            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-1">Status: {status === 'SYNCING' ? 'PROCESANDO...' : 'Sincronizado'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500">
                            <Zap size={16} />
                        </div>
                        <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center text-green-500">
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                        <Share2 size={18} />
                    </button>
                    <button className="px-8 py-4 bg-gold-500 text-black font-black uppercase tracking-widest text-[9px] rounded-2xl hover:bg-white transition-all">
                        Promocionar Signal
                    </button>
                </div>
            </div>

            {/* Player Controls (Bottom Bar) */}
            <div className="absolute bottom-12 left-12 right-12 flex flex-col gap-6 z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {/* Progress Bar */}
                <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress">
                    <div className="absolute top-0 left-0 h-full w-[64%] bg-gold-500 shadow-[0_0_15px_rgba(196,163,0,0.8)]" />
                    <div className="absolute top-1/2 left-[64%] w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 scale-0 group-hover/progress:scale-100 transition-transform" />
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8 text-white">
                        <div className="flex items-center gap-6">
                            <button className="hover:text-gold-500 transition-colors"><SkipBack size={24} /></button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-gold-500 transition-colors">
                                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                            </button>
                            <button className="hover:text-gold-500 transition-colors"><SkipForward size={24} /></button>
                        </div>
                        <div className="text-[11px] font-mono tracking-widest text-gray-400">
                            <span className="text-white">03:42</span> / 05:18
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 p-2 bg-black/40 rounded-2xl border border-white/5">
                            <button className="p-3 text-red-500 hover:bg-white/5 rounded-xl transition-all"><Youtube size={18} /></button>
                            <button className="p-3 text-green-500 hover:bg-white/5 rounded-xl transition-all"><Music size={18} /></button>
                            <button className="p-3 text-purple-500 hover:bg-white/5 rounded-xl transition-all"><Instagram size={18} /></button>
                            <div className="w-px h-6 bg-white/10 mx-2" />
                            <button 
                                onClick={() => setStatus('SYNCING')}
                                className="px-6 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gold-500 hover:text-black transition-all"
                            >
                                Sincronizar Plataformas
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button className="p-4 hover:text-gold-500 transition-colors"><Settings size={20} /></button>
                            <button className="p-4 hover:text-gold-500 transition-colors"><Maximize2 size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Overlay (Left) */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-12 group-hover:translate-x-0">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-black/80 border border-white/10 p-6 rounded-[2rem] backdrop-blur-2xl flex items-center gap-6 min-w-[200px] hover:border-gold-500 transition-all">
                        <div className="p-3 bg-gold-500/10 rounded-xl text-gold-500">
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{stat.label}</span>
                            <div className="flex items-baseline gap-3">
                                <h6 className="text-xl font-black text-white">{stat.value}</h6>
                                <span className="text-[8px] font-bold text-green-500">{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, 
    Calendar, 
    MapPin, 
    Music, 
    Camera, 
    Users, 
    Star,
    Sparkles,
    Settings,
    Bell
} from 'lucide-react';

/**
 * 💍 MODULE: WEDDING DASHBOARD (Event Vertical)
 * Personal event planning and logistics.
 * Logic: Guest tracking, venue selection, and emotional milestones.
 */

const tabs = [
    { id: 'overview', label: 'Resumen', icon: Star },
    { id: 'guests', label: 'Invitados', icon: Users },
    { id: 'venue', label: 'Espacio', icon: MapPin },
    { id: 'playlist', label: 'VIMUME Lista', icon: Music },
];

export default WeddingDashboardPanel;
export function WeddingDashboardPanel() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="flex flex-col h-full gap-8">
            
            {/* Wedding Header / Hero */}
            <div className="relative p-12 bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-12">
                <div className="absolute top-0 right-0 p-12 opacity-10 blur-sm">
                    <Heart size={200} className="text-rose-500" />
                </div>
                
                <div className="relative z-10 w-48 h-48 rounded-full border-4 border-[#d4af37]/30 p-2 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                    <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 cursor-help group">
                         <Heart size={64} className="text-rose-400 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                <div className="relative z-10 text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                            EAR <span className="text-rose-500">GESTIÓN DE</span> <span className="text-[#d4af37]">BODAS</span>
                        </h2>
                        <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                            Protocol: Adriana & Comandante
                        </span>
                    </div>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em] mb-8">Sincronización Logística y Emocional Activa</p>
                    
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                        <div className="flex items-center gap-3 px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                            <Calendar size={18} className="text-rose-500" />
                            <span className="text-xs font-black text-white uppercase tracking-widest italic">POR DETERMINAR • 2026</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                            <Sparkles size={18} className="text-[#d4af37]" />
                            <span className="text-xs font-black text-white uppercase tracking-widest italic font-mono">180 Invitados</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col gap-3">
                    <button className="p-4 bg-zinc-900 border border-white/10 rounded-3xl text-zinc-500 hover:text-white transition-all shadow-xl">
                        <Settings size={20} />
                    </button>
                    <button className="p-4 bg-zinc-900 border border-white/10 rounded-3xl text-zinc-500 hover:text-[#d4af37] transition-all shadow-xl relative">
                        <Bell size={20} />
                        <div className="absolute top-3 right-3 w-2 h-2 bg-[#d4af37] rounded-full animate-ping" />
                    </button>
                </div>
            </div>

            {/* Content Switcher */}
            <div className="flex flex-col lg:flex-row gap-10 flex-1">
                
                {/* Navigation Sidebar */}
                <div className="lg:w-72 flex flex-col gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full p-6 rounded-[2.5rem] flex items-center gap-6 transition-all border ${
                                activeTab === tab.id 
                                ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' 
                                : 'bg-zinc-900/40 text-zinc-500 border-white/5 hover:bg-zinc-900 hover:border-white/10'
                            }`}
                        >
                            <tab.icon size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Sub-Panel Area */}
                <div className="flex-1 p-12 bg-zinc-900/40 border border-white/5 rounded-[4rem] backdrop-blur-xl relative overflow-hidden flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex-1"
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] space-y-6">
                                            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">Checklist Crítica</div>
                                            <div className="space-y-4">
                                                {['Confirmación de Catering', 'Review de Vestido (Astra Neural Scan)', 'Selección de Soundtrack (VIMUME)', 'Logística de Transporte'].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 text-xs font-bold text-zinc-300 group cursor-pointer">
                                                        <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-[#d4af37] transition-all">
                                                            <div className="w-2 h-2 bg-[#d4af37] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center">
                                            <Camera size={48} className="text-zinc-700 mb-6" />
                                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Moodboard Táctico</div>
                                            <button className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest border-b border-[#d4af37]/20 pb-1 hover:text-white transition-colors">
                                                Abrir Galería de Activos
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="p-10 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-[3rem]">
                                        <div className="flex items-center gap-6 mb-4">
                                            <Calendar className="text-[#d4af37]" />
                                            <span className="text-xs font-black text-white uppercase italic tracking-widest">Próximo Hito: Selección de Fecha Final</span>
                                        </div>
                                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden p-0.5">
                                            <div className="h-full bg-[#d4af37] rounded-full w-[15%]" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'overview' && (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                                    <h5 className="text-xs font-black text-white uppercase italic tracking-widest mb-2">Módulo en Desarrollo</h5>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Sincronizando con las bases de datos de Google Wedding API</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Corner Decoration */}
                    <div className="absolute bottom-[-50px] right-[-50px] opacity-10">
                         <Sparkles size={200} className="text-[#d4af37]" />
                    </div>
                </div>
            </div>

        </div>
    );
}

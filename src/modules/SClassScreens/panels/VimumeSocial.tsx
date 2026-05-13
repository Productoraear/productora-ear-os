"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Brain, Users, Video, Eye,
    MapPin, Zap, Briefcase,
    Anchor, Sun, Smile, HeartHandshake, Award, Lightbulb, FileText, CalendarClock, Search,
    Share2, CheckCircle, Speaker, Landmark, Ear, ChevronUp, ChevronDown, MonitorPlay, Database, Code, Rocket
} from 'lucide-react';

export default function VimumeSocial() {
    const [activeTab, setActiveTab] = useState<'overview' | 'ethics' | 'strategy' | 'funding' | 'campaigns' | 'roadmap'>('overview');
    const [openAccordion, setOpenAccordion] = useState<string | null>('sensory');

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="w-full h-full bg-[#050505] text-white overflow-y-auto scrollbar-hide font-mono">
            {/* HERO SECTION */}
            <div className="relative py-24 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-900/30 border border-pink-500/30 text-pink-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-2xl">
                        <Heart size={10} fill="currentColor" /> Proyecto Buque Insignia
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif font-black text-white mb-8 animate-fade-in-up uppercase italic leading-none">
                        VIAJE MUSICAL <br /> <span className="text-[#ecb613]">POR LA MEMORIA</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light italic leading-relaxed animate-fade-in-up delay-100">
                        Reconectando vidas a través de la música. Una iniciativa terapéutica para devolver la identidad y la emoción a nuestros mayores.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* TABS INTERNAS VIMUME */}
                <div className="flex justify-center mb-16 overflow-x-auto pb-4 no-scrollbar">
                    <div className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/5 min-w-max shadow-2xl">
                        {[
                            { id: 'overview', label: 'EL PROYECTO' },
                            { id: 'ethics', label: 'CÓDIGO ÉTICO' },
                            { id: 'strategy', label: 'ESTRATEGIA' },
                            { id: 'funding', label: 'INVERSIÓN' },
                            { id: 'campaigns', label: 'CAMPAÑAS' },
                            { id: 'roadmap', label: 'CRONOGRAMA' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all uppercase ${activeTab === tab.id
                                    ? (tab.id === 'funding' ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.3)]')
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTENT AREAS */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 1. OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-32">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                    <div className="space-y-12">
                                        <div className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl">
                                            <Brain size={48} className="text-pink-400 mb-8" />
                                            <h3 className="text-3xl font-serif font-black mb-6 italic uppercase">El Poder de la Reminiscencia</h3>
                                            <p className="text-gray-500 text-lg leading-relaxed font-light italic text-justify">
                                                Utilizamos la música como llave maestra para acceder a recuerdos que parecían perdidos. Nuestro enfoque científico y humano busca mejorar la calidad de vida de personas con Alzheimer y demencia.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-center shadow-2xl">
                                                <span className="text-5xl font-serif font-black text-white block mb-2 italic">150+</span>
                                                <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Familias Impactadas</span>
                                            </div>
                                            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-center shadow-2xl">
                                                <span className="text-5xl font-serif font-black text-white block mb-2 italic">90%</span>
                                                <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Mejora Emocional</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative rounded-[4rem] overflow-hidden border border-white/5 h-[600px] shadow-2xl group">
                                        <img src="https://images.unsplash.com/photo-1551847677-dc82d764e1eb?q=80&w=1000&auto=format&fit=crop" alt="Music Therapy" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                        <div className="absolute bottom-12 left-12 right-12">
                                            <p className="text-2xl text-white font-serif font-black italic uppercase leading-tight tracking-tighter">"La música es <br /><span className="text-[#ecb613]">lo último</span> que se olvida."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Otros tabs se pueden añadir aquí siguiendo el mismo patrón */}
                        {activeTab !== 'overview' && (
                            <div className="flex flex-col items-center justify-center py-48 text-center space-y-6">
                                <Rocket className="text-[#ecb613] animate-pulse" size={64} />
                                <h3 className="text-2xl font-serif italic text-white uppercase">Módulo {activeTab.toUpperCase()} en reconstrucción S-Class</h3>
                                <p className="text-gray-500 max-w-md">Integrando los activos forenses de las 52 sesiones para una sincronización total.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

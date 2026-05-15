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
    const [activeTab, setActiveTab] = useState<'overview' | 'funding' | 'roadmap'>('overview');

    return (
        <div className="w-full h-full bg-[#050505] text-white overflow-y-auto scrollbar-hide font-mono">
            {/* HERO SECTION */}
            <div className="relative py-32 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ecb613]/10 via-black to-black opacity-40" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[9px] font-black uppercase tracking-[0.4em] mb-12 animate-fade-in shadow-2xl backdrop-blur-md">
                        <Heart size={10} fill="currentColor" /> PROYECTO BUQUE INSIGNIA
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white mb-8 animate-fade-in-up uppercase italic leading-[0.8] tracking-tighter">
                        VIAJE MUSICAL <br /> <span className="text-white/20">POR LA MEMORIA</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-xl font-medium italic leading-relaxed animate-fade-in-up delay-100">
                        "Reconectando vidas a través de la música. Una iniciativa terapéutica para devolver la identidad y la emoción a nuestros mayores."
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* TABS INTERNAS VIMUME */}
                <div className="flex justify-center mb-24 overflow-x-auto pb-4 no-scrollbar">
                    <div className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/5 min-w-max shadow-2xl backdrop-blur-xl">
                        {[
                            { id: 'overview', label: 'PROYECTO' },
                            { id: 'funding', label: 'INVERSIÓN' },
                            { id: 'roadmap', label: 'CRONOGRAMA' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-10 py-3.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === tab.id
                                    ? 'bg-[#ecb613] text-black shadow-[0_0_30px_rgba(236,182,19,0.4)]'
                                    : 'text-white/30 hover:text-white hover:bg-white/5'
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                    >
                        {/* 1. OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-40 pb-32">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                                    <div className="space-y-12">
                                        <div className="bg-white/[0.02] border border-white/5 p-16 rounded-[4rem] shadow-2xl backdrop-blur-3xl">
                                            <Brain size={56} className="text-[#ecb613] mb-10" />
                                            <h3 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">El Poder de la Reminiscencia</h3>
                                            <p className="text-white/50 text-xl leading-relaxed font-medium italic text-justify">
                                                Utilizamos la música como llave maestra para acceder a recuerdos que parecían perdidos. Nuestro enfoque científico y humano busca mejorar la calidad de vida de personas con Alzheimer y demencia, reduciendo la ansiedad y fomentando la conexión con sus seres queridos.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="bg-white/5 p-12 rounded-[3rem] border border-white/5 text-center shadow-2xl">
                                                <span className="text-6xl font-black text-white block mb-3 italic tracking-tighter">150+</span>
                                                <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em]">Familias Impactadas</span>
                                            </div>
                                            <div className="bg-white/5 p-12 rounded-[3rem] border border-white/5 text-center shadow-2xl">
                                                <span className="text-6xl font-black text-[#ecb613] block mb-3 italic tracking-tighter">90%</span>
                                                <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em]">Mejora Emocional</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative rounded-[5rem] overflow-hidden border border-white/5 h-[700px] shadow-2xl group bg-white/5">
                                        {/* Fallback to CSS/Gradient if images are heavy or remote */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <Speaker size={200} className="text-[#ecb613]" />
                                        </div>
                                        <div className="absolute bottom-16 left-16 right-16 z-20">
                                            <p className="text-3xl text-white font-black italic uppercase leading-tight tracking-tighter shadow-black drop-shadow-2xl">"La música es <br /><span className="text-[#ecb613]">lo último</span> que se olvida."</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Especialización Cultural */}
                                <div className="space-y-16">
                                    <div className="text-center space-y-4">
                                        <h3 className="text-5xl font-black uppercase italic tracking-tighter">Patrimonio Sonoro Vital</h3>
                                        <p className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Especialización Cultural</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            { title: "La Copla & Posguerra", label: "Pilar de Resiliencia", desc: "Música de supervivencia. Conectamos con emociones de fortaleza y superación. Reactivamos la dignidad y la 'raíz' del paciente." },
                                            { title: "El Ye-yé & Apertura", label: "Pilar de Vitalidad", desc: "Alegría y activación motora. La herramienta para cambiar el estado de ánimo de pasivo a activo. Nadie puede estar triste escuchando 'Tómbola'." },
                                            { title: "Verbena & Folclore", label: "Pilar de Comunidad", desc: "Pasodobles y Zarzuelas. Sonidos que significan 'familia'. Un himno colectivo que combate el aislamiento y une a la sala." }
                                        ].map((item, i) => (
                                            <div key={i} className="p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] hover:bg-white/5 transition-all space-y-6 group">
                                                <div className="text-[#ecb613] text-[9px] font-black uppercase tracking-widest">{item.label}</div>
                                                <h4 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-[#ecb613] transition-colors">{item.title}</h4>
                                                <p className="text-white/40 text-base italic leading-relaxed">"{item.desc}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Integration of previous rich content into Overview */}
                                <div className="space-y-32 pt-20 border-t border-white/5">
                                    <div className="text-center space-y-6">
                                        <h2 className="text-6xl font-black uppercase italic tracking-tighter">Ejes de Intervención</h2>
                                        <p className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Verticales de Impacto</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                        {[
                                            { 
                                                title: "BANCA & SEGUROS", 
                                                concept: "Longevidad Digna", 
                                                hook: "Eficiencia sociosanitaria. Nuestra arquitectura reduce la ansiedad en centros y mejora la calidad de vida sin fármacos.",
                                                targets: "Fundación 'la Caixa', Mapfre, BBVA"
                                            },
                                            { 
                                                title: "TECH & TELCO", 
                                                concept: "Conexión Humana", 
                                                hook: "Reconexión real. En un mundo hiperconectado, nuestros mayores están aislados. Usamos tecnología de audio para reconectar neuronas.",
                                                targets: "Fundación Telefónica, Vodafone"
                                            },
                                            { 
                                                title: "SANITARIA", 
                                                concept: "Terapia Complementaria", 
                                                hook: "Humanización de marca. Somos el complemento emocional a su tratamiento clínico. Ustedes cuidan el cuerpo; nosotros la identidad.",
                                                targets: "Cinfa, Sanitas, Laboratorios"
                                            }
                                        ].map((v, i) => (
                                            <div key={i} className="relative p-16 bg-white/[0.02] border border-white/5 rounded-[4rem] space-y-8 group hover:bg-[#ecb613]/5 hover:border-[#ecb613]/20 transition-all">
                                                <div className="space-y-2">
                                                    <h4 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-[#ecb613] transition-colors">{v.title}</h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{v.concept}</p>
                                                </div>
                                                <p className="text-white/50 text-lg italic leading-relaxed">"{v.hook}"</p>
                                                <div className="pt-8 border-t border-white/5">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Interlocutores Institucionales:</p>
                                                    <p className="text-[#ecb613] font-bold text-sm italic">{v.targets}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bio Section */}
                                    <div className="mt-32 p-20 bg-white/[0.01] border border-white/5 rounded-[5rem] grid md:grid-cols-2 gap-20 items-center">
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <p className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">El Master Interpreter</p>
                                                <h3 className="text-6xl font-black uppercase italic tracking-tighter">Edwin Agudelo</h3>
                                            </div>
                                            <p className="text-white/40 text-xl italic leading-relaxed font-medium">
                                                "He emocionado a auditorios de miles; ahora uso esa capacidad técnica de élite para emocionar a quien más lo necesita. Es una transferencia de competencia."
                                            </p>
                                            <button className="px-10 py-5 bg-[#ecb613] text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)]">
                                                Ver Dossier de Autoridad
                                            </button>
                                        </div>
                                        <div className="bg-white/5 rounded-[4rem] p-16 space-y-12">
                                            <h4 className="text-xl font-black uppercase tracking-widest text-white/30">Autoridad & Confianza</h4>
                                            <div className="space-y-8">
                                                {[
                                                    { title: "Foso Moral", desc: "Honestidad Radical. No tenemos la burocracia de las grandes ONGs. Cada euro va directo a la intervención." },
                                                    { title: "Autoridad Artística", desc: "Transferencia de competencia desde los escenarios de élite al cuidado humano." },
                                                    { title: "Método Institucional", desc: "No hacemos 'conciertos'. Aplicamos el protocolo Vimume (Diagnóstico, Intervención, Evaluación)." }
                                                ].map((r, i) => (
                                                    <div key={i} className="flex gap-6">
                                                        <div className="w-1.5 h-1.5 bg-[#ecb613] rounded-full mt-2" />
                                                        <div className="space-y-1">
                                                            <p className="font-black text-sm uppercase tracking-widest">{r.title}</p>
                                                            <p className="text-white/40 text-sm italic font-medium">"{r.desc}"</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'overview' && (
                            <div className="flex flex-col items-center justify-center py-48 text-center space-y-6">
                                <Rocket className="text-[#ecb613] animate-pulse" size={64} />
                                <h3 className="text-2xl font-black italic text-white uppercase">Módulo {activeTab.toUpperCase()} en reconstrucción</h3>
                                <p className="text-white/20 max-w-md italic">Sincronizando activos de impacto y validación institucional.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

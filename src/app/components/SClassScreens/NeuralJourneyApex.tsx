'use client';

/**
 * NEURAL JOURNEY APEX — El Motor de Conversión Definitivo (S-Class)
 * 
 * Transmutación Aura Onyx del componente NeuralJourneyV2.
 * Estética: Obsidian Stage, Glassmorphism, Gold Accents.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Heart, Zap, Music, Diamond, ArrowRight, X,
    Calendar, MapPin, Users, Wallet, CheckCircle2,
    Camera, Utensils, Lightbulb, ClipboardList, Headphones, Clapperboard, Flower2,
    Lock, Unlock, Wind, Activity, ShieldCheck
} from 'lucide-react';
import { useEventEngine } from '@/contexts/EventEngineContext';
import type { AuraType, ClimaxType, ServiceCategory, WeddingPreferences } from '@/lib/engines/weddingMatchEngine';

interface NeuralJourneyApexProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (preferences: WeddingPreferences) => void;
}

const STEPS = [
    { id: 'aura', label: 'El Aura', subtitle: 'La esencia visual y emocional' },
    { id: 'climax', label: 'El Clímax', subtitle: 'El momento que definirá el recuerdo' },
    { id: 'details', label: 'Arquitectura', subtitle: 'Datos técnicos y presupuesto neural' },
    { id: 'priorities', label: 'Soberanía', subtitle: 'Prioridades de servicio EAR' },
];

const AURA_OPTIONS: { id: AuraType; label: string; desc: string; icon: any; image: string }[] = [
    {
        id: 'elite_luxury', label: 'Élite & Lujo',
        desc: 'Opulencia absoluta y protocolos de alta gama.',
        icon: Diamond,
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200'
    },
    {
        id: 'boutique_intimate', label: 'Boutique',
        desc: 'Conexión profunda y sofisticación minimalista.',
        icon: Heart,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200'
    },
    {
        id: 'modern_hightech', label: 'Vanguardia',
        desc: 'Energía digital, visuales LED y shows híbridos.',
        icon: Zap,
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200'
    },
    {
        id: 'fiesta_salvaje', label: 'Social Burst',
        desc: 'Foco total en la pista y la experiencia compartida.',
        icon: Music,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200'
    },
];

const CLIMAX_OPTIONS: { id: ClimaxType; label: string; desc: string; icon: any }[] = [
    { id: 'elegancia_eterna', label: 'Elegancia Eterna', desc: 'Música en vivo clásica y jazz.', icon: Music },
    { id: 'efecto_festival', label: 'Efecto Festival', desc: 'Energía de club y confetti.', icon: Zap },
    { id: 'disrupcion_cool', label: 'Disrupción Cool', desc: 'Mezclas crossover y bandas indie.', icon: Sparkles },
];

const SERVICE_OPTIONS: { id: ServiceCategory; label: string; icon: any }[] = [
    { id: 'MUSICA_LIVE', label: 'Mariachi & Tenor Lírico', icon: Music },
    { id: 'DJ', label: 'DJ Set & Live Remix', icon: Headphones },
    { id: 'ILUMINACION', label: 'PA Bose & Shure Axient (Alquiler)', icon: Lightbulb },
    { id: 'FOTOGRAFIA', label: 'Registro Visual 4K', icon: Camera },
    { id: 'CATERING', label: 'Suministro Gastronómico', icon: Utensils },
    { id: 'DECORACION', label: 'Escenografía S-Class', icon: Flower2 },
    { id: 'WEDDING_PLANNER', label: 'Dirección Protocolar VIP', icon: ClipboardList },
    { id: 'VIDEO', label: 'VIMUME Memoria Activa', icon: Clapperboard },
];

export const NeuralJourneyApex: React.FC<NeuralJourneyApexProps> = ({ isOpen, onClose, onComplete }) => {
    const {
        budget, setBudget,
        guestCount, setGuestCount,
        atmosphere, setAtmosphere,
        locks, toggleLock,
        costPerPerson,
        sophistication
    } = useEventEngine();

    const [step, setStep] = useState(0);
    const [aura, setAura] = useState<AuraType | null>(null);
    const [climax, setClimax] = useState<ClimaxType | null>(null);
    const [date, setDate] = useState('');
    const [city, setCity] = useState('');
    const [preciseLocation, setPreciseLocation] = useState('');
    const [gpsCoords, setGpsCoords] = useState('');
    const [priorities, setPriorities] = useState<ServiceCategory[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAuraSelect = (selected: AuraType) => {
        setAura(selected);
        if (selected === 'elite_luxury') setAtmosphere(90);
        else if (selected === 'boutique_intimate') setAtmosphere(60);
        else if (selected === 'modern_hightech') setAtmosphere(75);
        else setAtmosphere(40);
        setTimeout(() => setStep(1), 600);
    };

    const handleClimaxSelect = (selected: ClimaxType) => {
        setClimax(selected);
        setTimeout(() => setStep(2), 600);
    };

    const togglePriority = (cat: ServiceCategory) => {
        setPriorities(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : (prev.length < 4 ? [...prev, cat] : prev));
    };

    const handleSubmit = () => {
        if (!aura || !climax || !date || !city || priorities.length === 0) return;
        setIsProcessing(true);
        setTimeout(() => {
            onComplete({ aura, climax, budget, city, date, guestCount, priorities, preciseLocation, gpsCoords });
            setIsProcessing(false);
        }, 2500);
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return (
        <div className="relative w-full h-full bg-black flex flex-col p-8 md:p-20">
            {/* Neural Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-[1px] bg-[#d4a855]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4a855]">Neural Journey V2.0</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Diseñando tu <span className="text-white/20">Realidad</span>
                    </h2>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-4 mb-24">
                    {STEPS.map((s, i) => (
                        <div 
                            key={s.id} 
                            className={`flex-1 h-1 transition-all duration-1000 ${i <= step ? 'bg-[#d4a855]' : 'bg-white/10'}`} 
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: AURA */}
                    {step === 0 && (
                        <motion.div 
                            key="aura" 
                            initial={{ opacity: 0, y: 40 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -40 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {AURA_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = aura === opt.id;
                                return (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => handleAuraSelect(opt.id)}
                                        className={`group relative p-10 rounded-[3rem] border transition-all duration-700 text-left overflow-hidden ${
                                            isSelected ? 'border-[#d4a855] bg-[#0a0a0a]' : 'border-white/5 bg-[#050505] hover:border-white/20'
                                        }`}
                                    >
                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#d4a855] mb-8 border border-white/10 group-hover:bg-[#d4a855] group-hover:text-black transition-all">
                                                <Icon size={24} strokeWidth={1} />
                                            </div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-widest mb-3">{opt.label}</h3>
                                            <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold leading-relaxed">{opt.desc}</p>
                                        </div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#d4a855]/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* STEP 2: CLIMAX */}
                    {step === 1 && (
                        <motion.div 
                            key="climax" 
                            initial={{ opacity: 0, y: 40 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -40 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {CLIMAX_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                return (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => handleClimaxSelect(opt.id)}
                                        className="group p-12 rounded-[4rem] border border-white/5 bg-[#050505] hover:border-[#d4a855]/40 transition-all duration-700 text-center flex flex-col items-center"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-[#d4a855] mb-8 border border-white/10 group-hover:scale-110 transition-all duration-700">
                                            <Icon size={32} strokeWidth={1} />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-widest mb-4">{opt.label}</h3>
                                        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">{opt.desc}</p>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* STEP 3: DETAILS */}
                    {step === 2 && (
                        <motion.div 
                            key="details" 
                            initial={{ opacity: 0, y: 40 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -40 }}
                            className="flex flex-col gap-12"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="glass-panel p-10 rounded-[3rem]">
                                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4a855] mb-6 block">Ubicación Estratégica</label>
                                    <select 
                                        value={city} 
                                        onChange={e => setCity(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-black text-white focus:border-[#d4a855] outline-none transition-colors uppercase"
                                    >
                                        <option value="" className="bg-black">Seleccionar...</option>
                                        <option value="madrid" className="bg-black">Madrid</option>
                                        <option value="barcelona" className="bg-black">Barcelona</option>
                                        <option value="marbella" className="bg-black">Marbella</option>
                                        <option value="ibiza" className="bg-black">Ibiza</option>
                                    </select>
                                </div>
                                <div className="glass-panel p-10 rounded-[3rem]">
                                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4a855] mb-6 block">Fecha del Evento</label>
                                    <input 
                                        type="date" 
                                        value={date} 
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-black text-white focus:border-[#d4a855] outline-none transition-colors" 
                                    />
                                </div>
                            </div>

                            <div className="glass-panel p-16 rounded-[4rem] flex flex-col gap-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-20">
                                    <Activity size={80} strokeWidth={0.5} className="text-[#d4a855]" />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/30">Inversión Recomendada</span>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-8xl font-black text-white italic leading-none">{(budget).toLocaleString()}</span>
                                        <span className="text-[#d4a855] text-4xl font-black italic">€</span>
                                    </div>
                                </div>

                                <input 
                                    type="range" min={5000} max={250000} step={5000} 
                                    value={budget} 
                                    onChange={e => setBudget(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#d4a855]" 
                                />

                                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Sofisticación</span>
                                        <span className="text-xl font-black text-white italic">{atmosphere}%</span>
                                    </div>
                                    <button 
                                        onClick={() => setStep(3)}
                                        disabled={!city || !date}
                                        className="px-12 py-6 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-[#d4a855] hover:text-white transition-all disabled:opacity-10"
                                    >
                                        Continuar <ArrowRight size={14} className="inline ml-2" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: PRIORITIES */}
                    {step === 3 && !isProcessing && (
                        <motion.div 
                            key="priorities" 
                            initial={{ opacity: 0, y: 40 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -40 }}
                            className="flex flex-col gap-12"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {SERVICE_OPTIONS.map(svc => {
                                    const Icon = svc.icon;
                                    const isSelected = priorities.includes(svc.id);
                                    return (
                                        <button 
                                            key={svc.id} 
                                            onClick={() => togglePriority(svc.id)}
                                            className={`p-10 rounded-[3rem] border transition-all duration-700 flex flex-col items-center gap-4 ${
                                                isSelected ? 'border-[#d4a855] bg-[#d4a855] text-black shadow-2xl scale-105' : 'border-white/5 bg-[#050505] text-white hover:border-white/20'
                                            }`}
                                        >
                                            <Icon size={24} strokeWidth={1} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{svc.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-center mt-12">
                                <button 
                                    onClick={handleSubmit}
                                    className="px-20 py-10 bg-[#d4a855] text-black text-xs font-black uppercase tracking-[0.5em] rounded-[3rem] hover:bg-white transition-all shadow-[0_40px_80px_rgba(212,168,85,0.3)] hover:scale-105"
                                >
                                    Sincronizar Protocolo
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* PROCESSING */}
                    {isProcessing && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="flex flex-col items-center justify-center py-40"
                        >
                            <div className="relative w-40 h-40 mb-12">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-[#d4a855]/20 rounded-full"
                                />
                                <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-4 border border-[#d4a855] border-t-transparent rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldCheck size={32} strokeWidth={1} className="text-[#d4a855]" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-[0.4em] animate-pulse">Analizando Red Neural...</h3>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

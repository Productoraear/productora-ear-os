'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, Heart, Users, MapPin, Zap, Music, Camera, Utensils, Car } from 'lucide-react';

export type DatasetCategory = 'espacios' | 'musica' | 'foto_video' | 'catering' | 'coches' | 'todos';

interface MatchAsistidoProps {
    onComplete?: (filters: { category: DatasetCategory; province: string; mood: string | null }) => void;
    onClose?: () => void;
}

export const MatchAsistido: React.FC<MatchAsistidoProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState(0);
    const [selection, setSelection] = useState({
        category: 'espacios' as DatasetCategory,
        province: '',
        mood: null as string | null
    });

    const STEPS = [
        {
            title: "¿Qué infraestructura necesitas hoy?",
            subtitle: "Cada categoría ha sido auditada bajo protocolos de ingeniería.",
            field: 'category',
            options: [
                { id: 'espacios', label: 'Escenario / Espacio', icon: Zap },
                { id: 'musica', label: 'Banda Sonora (Música)', icon: Music },
                { id: 'foto_video', label: 'Registro Audiovisual', icon: Camera },
                { id: 'catering', label: 'Suministro (Catering)', icon: Utensils },
                { id: 'coches', label: 'Logística de Traslado', icon: Car },
            ]
        },
        {
            title: "¿En qué zona operamos?",
            subtitle: "Filtramos solo proveedores con cobertura garantizada.",
            field: 'province',
            options: [
                { id: 'Madrid', label: 'Madrid', icon: MapPin },
                { id: 'Toledo', label: 'Toledo', icon: MapPin },
                { id: 'Córdoba', label: 'Córdoba', icon: MapPin },
                { id: 'Barcelona', label: 'Barcelona', icon: MapPin },
                { id: 'other', label: 'Otra (Ver listado completo)', icon: Sparkles },
            ]
        },
        {
            title: "¿Cuál es el 'Mood' del evento?",
            subtitle: "Algoritmo de matching por identidad y estilo.",
            field: 'mood',
            options: [
                { id: 'party', label: 'Máxima Energía', icon: Zap },
                { id: 'romantic', label: 'Sutileza & Romance', icon: Heart },
                { id: 'luxury', label: 'Alto Estatus', icon: Sparkles },
                { id: 'compact', label: 'Eficiencia Íntima', icon: Users },
            ]
        }
    ];

    const handleSelect = (val: any) => {
        const currentField = STEPS[step].field;
        const newSelection = { ...selection, [currentField]: val };
        setSelection(newSelection);

        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onComplete?.(newSelection);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                className="relative w-full max-w-4xl bg-gradient-to-br from-[#0f0f0f] to-black border border-white/10 rounded-[3rem] p-10 md:p-20 overflow-hidden shadow-2xl"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <button onClick={onClose} className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors">
                    <X size={32} />
                </button>

                <div className="relative z-10">
                    {/* Progress */}
                    <div className="flex gap-2 mb-12">
                        {STEPS.map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="max-w-xl">
                                <span className="text-primary text-[10px] uppercase font-black tracking-[0.4em] mb-4 block">Asistente de Matching EAR</span>
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase">
                                    {STEPS[step].title}
                                </h2>
                                <p className="text-neutral-500 mt-4 text-lg font-light">
                                    {STEPS[step].subtitle}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {STEPS[step].options.map(opt => {
                                    const Icon = opt.icon;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(opt.id === 'other' ? '' : opt.id)}
                                            className="group flex items-center gap-6 p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-primary/50 hover:bg-white/[0.07] transition-all text-left"
                                        >
                                            <div className="p-4 bg-black rounded-2xl border border-white/10 group-hover:border-primary/30 transition-colors">
                                                <Icon className="text-primary" size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-lg font-bold text-white block uppercase tracking-tight">{opt.label}</span>
                                                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1 block">Protocolo Certificado</span>
                                            </div>
                                            <ArrowRight className="text-neutral-700 group-hover:text-primary transition-colors group-hover:translate-x-1" size={20} />
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {step > 0 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="mt-12 text-sm text-neutral-500 hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                            <X size={14} className="rotate-45" /> Volver al paso anterior
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

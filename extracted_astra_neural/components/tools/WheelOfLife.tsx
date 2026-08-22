
// ... imports remain the same ...
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateWheelOfLifeSynthesis, generateStrategicPlaybook } from '../../services/geminiService';
import { PlaybookStep } from '../../types';
import { Icon } from '../Icon';
import { TOOL_REGISTRY } from '../../utils/toolRegistry';

interface WheelOfLifeProps {
  onComplete: () => void;
  onLaunchTool: (toolId: string) => void;
}

const CATEGORIES = [
    'Arte y Creatividad',
    'Carrera y Negocio',
    'Finanzas',
    'Salud y Bienestar',
    'Relaciones',
    'Desarrollo Personal',
    'Entorno Físico',
    'Diversión y Ocio',
];

// ... COACHING_PROMPTS and components ReflectionInput, CompactSlider remain the same ...
const COACHING_PROMPTS: Record<string, { low: string; mid: string; high: string }> = {
    'Arte y Creatividad': {
        low: "¿Qué bloqueos internos o externos están asfixiando tu expresión creativa actualmente?",
        mid: "Tienes la chispa, pero no el fuego. ¿Qué rutina diaria te falta para priorizar tu arte?",
        high: "Estás en flujo. ¿Cómo puedes canalizar este exceso de creatividad para potenciar otras áreas estancadas?"
    },
    'Carrera y Negocio': {
        low: "¿Estás en el lugar incorrecto o simplemente quemado? ¿Cuál es el cambio más pequeño que te daría alivio?",
        mid: "Estás en una zona de confort peligrosa. ¿Qué riesgo calculado has estado evitando tomar?",
        high: "Lideras tu juego. ¿Estás construyendo un legado o solo manteniendo el éxito?"
    },
    'Finanzas': {
        low: "La ansiedad financiera drena creatividad. ¿Cuál es la fuga de dinero número uno que puedes cerrar hoy?",
        mid: "Sobrevives, pero no prosperas. ¿Qué creencia limitante te impide escalar tus ingresos?",
        high: "Tu libertad financiera es sólida. ¿Estás usando ese dinero para comprar tiempo o cosas?"
    },
    'Salud y Bienestar': {
        low: "Tu cuerpo te está enviando señales. ¿Qué estás ignorando que no puedes permitirte ignorar más?",
        mid: "Cumples lo básico, pero falta vitalidad. ¿Qué hábito tóxico te está robando ese 10% extra de energía?",
        high: "Eres una máquina. ¿Cómo puedes usar esta vitalidad para servir mejor a tu propósito?"
    },
    'Relaciones': {
        low: "¿Te estás aislando o estás rodeado de las personas equivocadas? ¿Quién drena tu energía?",
        mid: "Hay conexión, pero falta profundidad. ¿Qué conversación difícil has estado posponiendo?",
        high: "Tu tribu es fuerte. ¿A quién puedes mentorizar o elevar con tu red actual?"
    },
    'Desarrollo Personal': {
        low: "¿Cuándo fue la última vez que aprendiste algo que te hizo sentir incómodo y novato?",
        mid: "Lees y escuchas, pero ¿ejecutas? ¿Dónde está la brecha entre tu saber y tu hacer?",
        high: "El crecimiento es tu estilo de vida. ¿Estás enfocado en el ego o en la contribución?"
    },
    'Entorno Físico': {
        low: "Tu entorno refleja tu mente. ¿Qué dice el desorden o la incomodidad actual sobre tu estado interno?",
        mid: "Es funcional, pero no inspirador. ¿Qué elemento podrías añadir para que tu espacio te de energía?",
        high: "Tu espacio es un templo. ¿Es momento de cambiar de escenario para nuevos estímulos?"
    },
    'Diversión y Ocio': {
        low: "¿Recuerdas lo que es jugar sin propósito? ¿Por qué sientes culpa al descansar?",
        mid: "Te diviertes, pero ¿te recargas? ¿Es ocio de calidad o solo evasión de pantallas?",
        high: "Vives con alegría. ¿Cómo puedes contagiar ese espíritu lúdico a tu trabajo?"
    }
};

const ReflectionInput: React.FC<{
    category: string;
    score: number;
    value: string;
    onChange: (val: string) => void;
}> = ({ category, score, value, onChange }) => {
    
    const getPrompt = () => {
        const prompts = COACHING_PROMPTS[category];
        if (!prompts) return `Reflexiona sobre tu puntuación de ${score} en ${category}.`;
        
        if (score <= 3) return prompts.low;
        if (score <= 7) return prompts.mid;
        return prompts.high;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 bg-zinc-800/30 rounded-lg border-l-2 border-blue-500 overflow-hidden"
        >
            <div className="p-3">
                <p className="text-xs text-blue-300 font-medium mb-2 flex items-start gap-2 leading-snug">
                    <Icon className="w-3 h-3 mt-0.5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></Icon>
                    {getPrompt()}
                </p>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-black/20 text-zinc-300 text-sm p-2 rounded-md border border-zinc-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none outline-none"
                    placeholder="Escribe tu reflexión aquí..."
                    rows={2}
                />
            </div>
        </motion.div>
    );
};

const CompactSlider: React.FC<{
    category: string;
    score: number;
    onChange: (val: number) => void;
    active: boolean;
}> = ({ category, score, onChange, active }) => {
    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 ${active ? 'bg-zinc-900/80 border-blue-500/50 shadow-lg shadow-blue-900/10' : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900/60'}`}>
            <div className="flex justify-between items-center mb-3">
                <label className="font-medium text-sm text-zinc-200">{category}</label>
                <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${score >= 8 ? 'bg-green-500/20 text-green-400' : score >= 5 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                    {score}/10
                </span>
            </div>
            <div className="relative h-2 bg-zinc-800 rounded-full group cursor-pointer">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" 
                    style={{ width: `${score * 10}%` }}
                />
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={score}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="absolute top-[-8px] left-0 w-full h-6 opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-100 border-2 border-zinc-900"
                    style={{ left: `calc(${score * 10}% - 8px)` }}
                />
            </div>
        </div>
    );
};

export const WheelOfLife: React.FC<WheelOfLifeProps> = ({ onComplete, onLaunchTool }) => {
    const { t, language } = useTranslations();
    const [scores, setScores] = useState<Record<string, number>>(
        CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 5 }), {})
    );
    const [microReflections, setMicroReflections] = useState<Record<string, string>>({});
    const [finalReflection, setFinalReflection] = useState('');
    const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState(false);
    const [playbook, setPlaybook] = useState<PlaybookStep[] | null>(null);
    const [isGeneratingPlaybook, setIsGeneratingPlaybook] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isDraggingChart, setIsDraggingChart] = useState(false);

    const chartContainerRef = useRef<HTMLDivElement>(null);

    const handleScoreChange = (category: string, value: number) => {
        const clamped = Math.min(10, Math.max(1, value));
        setScores(prev => ({ ...prev, [category]: clamped }));
        setActiveCategory(category);
    };

    const handleReflectionChange = (category: string, value: string) => {
         setMicroReflections(prev => ({ ...prev, [category]: value }));
    };

    const handleGenerateSynthesis = async () => {
        setIsGeneratingSynthesis(true);
        const synthesis = await generateWheelOfLifeSynthesis(scores, microReflections, language);
        setFinalReflection(synthesis);
        setIsGeneratingSynthesis(false);
    };

    const handleGeneratePlaybook = async () => {
        if (!finalReflection) return;
        setIsGeneratingPlaybook(true);
        const steps = await generateStrategicPlaybook(finalReflection, language);
        setPlaybook(steps);
        setIsGeneratingPlaybook(false);
    };

    const chartData = useMemo(() => {
        return CATEGORIES.map(cat => ({
            subject: t(cat),
            A: scores[cat],
            fullMark: 10,
        }));
    }, [scores, t]);

    const handleChartInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!chartContainerRef.current) return;

        const rect = chartContainerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = clientX - rect.left - centerX;
        const y = clientY - rect.top - centerY;

        let angleDeg = Math.atan2(y, x) * (180 / Math.PI);
        if (angleDeg < 0) angleDeg += 360; 

        const radius = Math.min(centerX, centerY) * 0.8; 
        const distance = Math.sqrt(x*x + y*y);
        const normalizedScore = Math.min(10, Math.max(1, Math.round((distance / radius) * 10)));

        // Simple mapping logic for 8 slices
        const index = Math.round(((270 - angleDeg + 360) % 360) / 45) % 8;
        const category = CATEGORIES[index];
        
        if (category) {
            handleScoreChange(category, normalizedScore);
        }

    }, [handleScoreChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDraggingChart(true);
        handleChartInteraction(e);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDraggingChart) {
            handleChartInteraction(e);
        }
    };

    const handleMouseUp = () => {
        setIsDraggingChart(false);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950 text-white overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('tool_wheelOfLife_title')}</h1>
                        <p className="text-base text-zinc-400 mb-6">{t('wheel_instructions')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lg:col-span-5 lg:sticky lg:top-8 z-10 order-1"
                        >
                            <div 
                                ref={chartContainerRef}
                                className="bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800/50 backdrop-blur-md shadow-xl relative cursor-crosshair touch-none"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleChartInteraction}
                                onTouchMove={handleChartInteraction}
                            >
                                <h3 className="text-center text-sm font-semibold text-zinc-400 mb-2 lg:hidden">{t('wheel_drag_instruction')}</h3>
                                <div className="w-full aspect-square max-h-[400px] mx-auto">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                            <PolarGrid stroke="#3f3f46" strokeDasharray="4 4" />
                                            <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                                            <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#3f3f46" tick={false} axisLine={false} />
                                            <Radar name={t('wheel_score_label')} dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.4} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none opacity-50">
                                     <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded-full">{t('wheel_interactive_label')}</span>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-7 space-y-4 order-2"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {CATEGORIES.map(cat => (
                                    <div key={cat} className="space-y-2">
                                        <CompactSlider 
                                            category={t(cat)}
                                            score={scores[cat]}
                                            onChange={(val) => handleScoreChange(cat, val)}
                                            active={activeCategory === cat}
                                        />
                                        <AnimatePresence>
                                            {(activeCategory === cat || microReflections[cat]) && (
                                                <ReflectionInput 
                                                    category={cat}
                                                    score={scores[cat]}
                                                    value={microReflections[cat] || ''}
                                                    onChange={(val) => handleReflectionChange(cat, val)}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-12 pt-8 border-t border-zinc-800"
                            >
                                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-2xl border border-blue-500/20">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-blue-500/20 rounded-xl">
                                            <Icon className="w-6 h-6 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></Icon>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{t('wheel_reflection_title')}</h3>
                                            <p className="text-sm text-zinc-400">IA Analysis & Strategy</p>
                                        </div>
                                    </div>
                                    
                                    {!finalReflection && (
                                        <button 
                                            onClick={handleGenerateSynthesis} 
                                            disabled={isGeneratingSynthesis} 
                                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                                        >
                                            {isGeneratingSynthesis ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Icon className="w-5 h-5 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                                    {t('wheel_generating_synthesis')}
                                                </span>
                                            ) : (
                                                t('wheel_generate_synthesis_button')
                                            )}
                                        </button>
                                    )}

                                    {finalReflection && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                            <div className="bg-black/30 p-4 rounded-lg border-l-4 border-blue-500">
                                                <p className="text-zinc-300 text-sm italic leading-relaxed">"{finalReflection}"</p>
                                            </div>

                                            {!playbook ? (
                                                 <button 
                                                    onClick={handleGeneratePlaybook} 
                                                    disabled={isGeneratingPlaybook} 
                                                    className="w-full py-3 bg-zinc-800 text-white font-bold rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-all"
                                                >
                                                    {isGeneratingPlaybook ? t('wheel_generating_playbook') : t('wheel_generate_playbook_button')}
                                                </button>
                                            ) : (
                                                <div className="space-y-3">
                                                    <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t('wheel_playbook_title')}</h4>
                                                    {playbook.map((step, index) => {
                                                        const toolConfig = TOOL_REGISTRY[step.toolId];
                                                        return (
                                                            <button 
                                                                key={index}
                                                                onClick={() => onLaunchTool(step.toolId)}
                                                                className="w-full text-left p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg hover:border-blue-500/50 transition-all flex items-center gap-3 group"
                                                            >
                                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">{index + 1}</span>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-zinc-200 text-sm truncate">{toolConfig ? t(toolConfig.titleKey) : step.toolId}</p>
                                                                    <p className="text-xs text-zinc-500 truncate">{step.description}</p>
                                                                </div>
                                                                <Icon className="w-4 h-4 text-zinc-600 group-hover:text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                            
                            <div className="text-center pt-4">
                                <button 
                                    // FIX: Use anonymous function to prevent event passing
                                    onClick={() => onComplete()} 
                                    className="text-sm text-zinc-500 hover:text-white underline transition-colors"
                                >
                                    {t('completeAndContinue')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
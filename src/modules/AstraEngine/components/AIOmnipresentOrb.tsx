
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { AppView, WorkflowStage } from '../types';

interface AIOmnipresentOrbProps {
    onOpenAssistant: () => void;
    currentView: AppView;
    activeToolId: string | null;
    currentStage: WorkflowStage;
}

const CONTEXT_SUGGESTIONS: Record<string, string[]> = {
    'DASHBOARD': [
        "Todo tranquilo en el radar. ¿Revisamos métricas clave?",
        "Tu perfil estratégico sugiere una acción audaz hoy.",
        "¿Quieres un resumen rápido de tus proyectos?"
    ],
    'STRATEGIC_JOURNEY': [
        "Cada paso cuenta. ¿Necesitas claridad sobre la fase actual?",
        "Recuerda: la estrategia sin ejecución es alucinación.",
        "Estoy listo para auditar tus decisiones si me necesitas."
    ],
    'TOOL': [
        "Estoy analizando tus inputs en tiempo real...",
        "Si te bloqueas, puedo generarte un borrador inicial.",
        "¿Quieres que juegue al Abogado del Diablo con esta idea?"
    ],
    'DEFAULT': [
        "Estoy aquí. ¿Cuál es tu siguiente movimiento?",
        "Sistemas nominales. Esperando instrucciones.",
        "La claridad precede al éxito."
    ]
};

export const AIOmnipresentOrb: React.FC<AIOmnipresentOrbProps> = ({ 
    onOpenAssistant, 
    currentView, 
    activeToolId, 
    currentStage 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    // Context Awareness Logic
    useEffect(() => {
        // Reset suggestion on view change
        setSuggestion(null);
        
        const contextKey = activeToolId ? 'TOOL' : currentView === AppView.STRATEGIC_JOURNEY ? 'STRATEGIC_JOURNEY' : 'DASHBOARD';
        const pool = CONTEXT_SUGGESTIONS[contextKey] || CONTEXT_SUGGESTIONS['DEFAULT'];
        
        // Trigger a random suggestion after a delay to simulate "observation"
        const timer = setTimeout(() => {
            const randomMsg = pool[Math.floor(Math.random() * pool.length)];
            setSuggestion(randomMsg);
            
            // Auto-hide suggestion after 8 seconds
            setTimeout(() => setSuggestion(null), 8000);
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentView, activeToolId, currentStage]);

    return (
        <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end pointer-events-none">
            {/* Proactive Suggestion Bubble */}
            <AnimatePresence>
                {suggestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="mb-4 mr-2 bg-zinc-900/90 backdrop-blur-xl border border-blue-500/30 text-zinc-200 text-sm py-3 px-4 rounded-2xl rounded-br-none shadow-2xl max-w-[250px] pointer-events-auto cursor-pointer relative overflow-hidden group"
                        onClick={onOpenAssistant}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex gap-2 items-start">
                            <Icon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" /></Icon>
                            <span>{suggestion}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Orb */}
            <motion.button
                onClick={onOpenAssistant}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-16 h-16 pointer-events-auto group focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Outer Glow / Aura */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500/40 blur-xl"
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3] 
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                />

                {/* Core Orb */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur-md">
                    {/* Inner Plasma Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-fuchsia-600 opacity-80"
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                        }}
                        style={{ filter: 'blur(8px)' }}
                    />
                    
                    {/* Glass Reflection */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />

                    {/* Icon */}
                    <Icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" />
                    </Icon>
                </div>

                {/* Orbiting Ring (Active State) */}
                <motion.div
                    className="absolute -inset-1 rounded-full border border-blue-400/30 border-t-blue-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ display: isHovered ? 'block' : 'none' }}
                />
            </motion.button>
        </div>
    );
};

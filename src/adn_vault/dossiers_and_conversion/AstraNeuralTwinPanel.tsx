'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bot,
    User,
    Zap,
    Loader2,
    ShieldCheck,
    Terminal,
    Sparkles,
    BrainCircuit
} from 'lucide-react';

/**
 * 🧠 MODULE: ASTRA NEURAL TWIN (S-Class v3.0)
 * Digital Twin AI Interface for EAR OS Gold.
 * Perspective: Conversational Intelligence, Neural Link, Predictive Logic.
 */

interface Message {
    id: string;
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

export default AstraNeuralTwinPanel;
export function AstraNeuralTwinPanel() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'ai',
            content: "Bóveda RAG Integrada: SESSION_OMEGA y LOGS_MASTER indexados. El cerebro digital tiene acceso al historial forense completo. ¿En qué puedo asistirte hoy para optimizar la valoración del sistema?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulando respuesta IA (Pérdida temporal de servicio mock)
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Analizando fragmentos recuperados en D: y F:... El Protocolo de Dominancia está al 92%. Recomiendo la inyección masiva de los módulos de rastreo Hermes para completar la tríada táctica.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[750px] w-full bg-zinc-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
            
            {/* HUD Header */}
            <div className="px-12 py-8 border-b border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/20">
                        <BrainCircuit size={28} className="text-[#d4af37] animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                            ASTRA NEURAL <span className="text-[#d4af37]">TWIN</span>
                            <span className="text-[10px] bg-[#d4af37] text-black px-2 py-0.5 rounded font-black italic">S-GOLD</span>
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
                            Neural Synchronized Intelligence
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest">RAG Vault</span>
                        <span className="text-[10px] text-emerald-500 font-mono">3 SESSIONS INDEXED</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Enlace Estable</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                <AnimatePresence mode="popLayout">
                    {messages.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] flex gap-6 ${item.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                                    item.role === 'ai' 
                                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)]' 
                                    : 'bg-zinc-900 text-white border-white/10'
                                }`}>
                                    {item.role === 'ai' ? <Bot size={24} /> : <User size={24} />}
                                </div>
                                <div className="space-y-3">
                                    <div className={`p-8 rounded-[2.5rem] text-sm leading-relaxed shadow-xl border ${
                                        item.role === 'user' 
                                        ? 'bg-white text-black font-bold rounded-tr-none' 
                                        : 'bg-zinc-900/80 text-zinc-200 border-white/5 rounded-tl-none font-mono underline-offset-4 decoration-[#d4af37]/30'
                                    }`}>
                                        <div className="whitespace-pre-wrap">{item.content}</div>
                                    </div>
                                    <div className={`text-[8px] font-black uppercase tracking-widest text-zinc-500 ${item.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {item.timestamp.toLocaleTimeString()} • Protocolo {item.role.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <Bot size={24} />
                            </div>
                            <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] rounded-tl-none border border-white/5 flex items-center gap-4">
                                <Loader2 size={18} className="text-[#d4af37] animate-spin" />
                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest animate-pulse italic">Astra Analyzer: Procesando Frecuencia del Comandante...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Bar */}
            <div className="p-10 bg-black/40 border-t border-white/5">
                <div className="relative group max-w-5xl mx-auto">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Emite tu consulta táctica al Gemelo Digital S-Class..."
                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] py-6 px-10 pr-20 text-white focus:outline-none focus:border-[#d4af37]/50 transition-all font-medium placeholder:text-zinc-700 shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#d4af37] text-black rounded-2xl flex items-center justify-center hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                    >
                        <Send size={24} />
                    </button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em]">
                        <Terminal size={12} /> Consola Segura
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em]">
                        <ShieldCheck size={12} /> Encriptación Neural
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em]">
                        <Sparkles size={12} className="text-[#d4af37]" /> Gemini-Level Processing
                    </div>
                </div>
            </div>

            <style p-jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.4); }
            `}</style>
        </div>
    );
}

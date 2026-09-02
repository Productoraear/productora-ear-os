"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  ShieldCheck,
  Network,
  DatabaseZap
} from 'lucide-react';
import { BentoCard, StatBox, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';
import { GhostHunter } from '@/lib/services/ghost_hunter';

export const AstraNeuralBrain = () => {
    const [messages, setMessages] = useState<{role: string, content: string | React.ReactNode}[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [intelStream, setIntelStream] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Boot Sequence & RAG Integration
    useEffect(() => {
        const initializeBrain = async () => {
            try {
                // 1. Despertar Cazador Fantasma
                const intel = await GhostHunter.getLatestIntel(5);
                if (intel && intel.length > 0) {
                    setIntelStream(intel);
                    setMessages([
                        { 
                            role: 'astra', 
                            content: `[SISTEMA INICIADO] He detectado ${intel.length} anomalías/datos recientes en la red. Bóveda RAG sincronizada y lista para toma de decisiones. Esperando directivas, Comandante.`
                        }
                    ]);
                } else {
                    setMessages([
                        { 
                            role: 'astra', 
                            content: `[SISTEMA INICIADO] Bóveda RAG vacía. Esperando Inyección Omega. Modo táctico en espera.`
                        }
                    ]);
                }
            } catch (error) {
                console.error("Fallo en sincronización RAG:", error);
                setMessages([
                    { 
                        role: 'astra', 
                        content: `[ADVERTENCIA] Error de sincronización con Bóveda RAG. Verifique las credenciales de Supabase en .env.local.`
                    }
                ]);
            }
        };
        initializeBrain();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch('/api/astra', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: input,
                    context: intelStream // Pasamos la sangre fresca al cerebro
                })
            });
            const data = await response.json();
            
            // Format response (handling message and recommendations)
            const formattedResponse = (
                <div className="space-y-3">
                    <p>{data.message || data.response || "Comando procesado."}</p>
                    {data.recommendations && data.recommendations.length > 0 && (
                        <div className="mt-2 p-3 bg-black/20 border border-ear-gold/20 rounded-xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-ear-gold mb-2">Recomendaciones Tácticas:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                                {data.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );

            setMessages(prev => [...prev, { role: 'astra', content: formattedResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'astra', content: "ERROR DE SINAPSIS: Canal Astra inestable. Reconectando enlace neural..." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-montserrat">
            {/* Brain Telemetry */}
            <div className="space-y-6">
                <BentoCard title="ASTRA NEURAL" subtitle="Cognitive Processing Module">
                    <div className="mt-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-ear-gold/10 rounded-xl flex items-center justify-center border border-ear-gold/20">
                                <BrainCircuit className="text-ear-gold w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Status</p>
                                <p className="text-xl font-black text-white italic">Online</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <StatBox label="Neural Stability" value="99.9%" color="text-emerald-500" />
                            <StatBox label="RAG Context" value={`${intelStream.length} Nodes`} color="text-ear-gold" />
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="TELEMETRY" subtitle="Real-time Metrics">
                    <div className="space-y-4 mt-4">
                        <SmallKPI icon={DatabaseZap} label="RAG Sync" value={intelStream.length > 0 ? "Active" : "Awaiting Data"} />
                        <SmallKPI icon={Network} label="Nodes" value="15,000+" />
                        <SmallKPI icon={Zap} label="Latency" value="4ms" />
                    </div>
                </BentoCard>

                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] flex items-center gap-4">
                    <ShieldCheck className="text-emerald-500 w-6 h-6 shrink-0" />
                    <p className="text-[9px] font-black uppercase text-white/70 tracking-widest italic leading-relaxed">
                        Protocolo <span className="text-ear-gold">ALPHA GOD MODE</span> Activo
                    </p>
                </div>
            </div>

            {/* Neural Interface */}
            <div className="lg:col-span-2 h-[800px]">
                <BentoCard title="NEURAL STREAM" subtitle="Gemini 1.5 Pro Integrated Interface">
                    <div className="flex flex-col h-full mt-4">
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto space-y-8 pr-4 scrollbar-hide py-4"
                        >
                            <AnimatePresence>
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                                        <Sparkles size={48} className="mb-4 text-ear-gold animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Neural Link Open</p>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-white/5 text-white border border-white/10 italic rounded-tr-none' 
                                            : 'bg-ear-gold/5 text-ear-gold border border-ear-gold/20 rounded-tl-none font-medium shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                                        }`}>
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-2">
                                                {msg.role === 'user' ? 'Comandante' : 'Astra Neural'}
                                            </p>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-1 items-center px-6 py-4 bg-ear-gold/5 rounded-full border border-ear-gold/10">
                                            <div className="w-1 h-1 bg-ear-gold rounded-full animate-bounce" />
                                            <div className="w-1 h-1 bg-ear-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1 h-1 bg-ear-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input */}
                        <div className="mt-6 flex gap-4 relative">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Transmitir comando a la red neural..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-full h-16 px-10 text-white italic focus:outline-none focus:border-ear-gold transition-all placeholder:text-white/10 font-medium"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="w-16 h-16 bg-ear-gold text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                            >
                                <Zap size={24} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
};

export default AstraNeuralBrain;

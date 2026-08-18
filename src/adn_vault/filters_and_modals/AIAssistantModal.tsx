
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '../hooks/useAIAssistant'; 
import { useTranslations } from '../contexts/LanguageContext';

interface AIAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate?: (text: string, action: string) => Promise<string>; // Legacy prop support
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslations();
    const [input, setInput] = useState('');
    
    // Connect to the new brain
    const { response, isStreaming, generateResponse } = useAIAssistant();

    const handleSubmit = () => {
        if (!input.trim()) return;
        generateResponse(input);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="text-blue-500">✦</span> Astra AI Assistant
                        </h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
                        {/* Mensaje Usuario */}
                        {input && response && (
                            <div className="flex justify-end">
                                <div className="bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg rounded-tr-none max-w-[80%]">
                                    {input}
                                </div>
                            </div>
                        )}

                        {/* Respuesta IA */}
                        {(response || isStreaming) && (
                            <div className="flex justify-start">
                                <div className="bg-blue-900/20 border border-blue-500/20 text-blue-100 px-4 py-3 rounded-lg rounded-tl-none max-w-[90%] leading-relaxed shadow-sm">
                                    {response}
                                    {isStreaming && (
                                        <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {!response && !isStreaming && (
                            <div className="text-center text-zinc-500 mt-10">
                                <p>¿En qué puedo ayudarte estratégicamente hoy?</p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="Escribe tu consulta..."
                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                disabled={isStreaming}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={isStreaming || !input.trim()}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                {isStreaming ? 'Thinking...' : 'Enviar'}
                            </button>
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

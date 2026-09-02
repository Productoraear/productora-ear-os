'use client';

import React, { useState, useRef, useEffect } from 'react';
import { earIntelligence } from '@/lib/ear-intelligence';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Cpu, Zap, ChevronUp, ChevronDown } from 'lucide-react';

export default function IntelligenceTerminal() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string, source?: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await earIntelligence.query(userMsg);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.answer, 
        source: response.source 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error: No se pudo conectar con el modelo local.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'w-96' : 'w-12 h-12 overflow-hidden'}`}>
        <div className="bg-[#040404]/90 border border-[#D4AF37]/30 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col h-[500px]">
          
          {/* Header */}
          <div 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-4 bg-[#D4AF37]/10 flex items-center justify-between cursor-pointer border-b border-[#D4AF37]/20"
          >
            <div className="flex items-center gap-2">
              <Cpu size={16} className={`text-[#D4AF37] ${loading ? 'animate-spin' : 'animate-pulse'}`} />
              {isOpen && <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">EAR CORE INTELLIGENCE</span>}
            </div>
            {isOpen ? <ChevronDown size={14} className="text-[#D4AF37]" /> : <ChevronUp size={14} className="text-[#D4AF37] ml-2" />}
          </div>

          {isOpen && (
            <>
              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs custom-scrollbar">
                {messages.length === 0 && (
                  <div className="text-gray-500 italic text-center py-20 opacity-30">
                    <Terminal size={40} className="mx-auto mb-4" />
                    <p>Esperando comandos del CEO...</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-xl ${
                      m.role === 'user' 
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20' 
                      : 'bg-white/5 text-gray-200 border border-white/10'
                    }`}>
                      <p className="leading-relaxed">{m.content}</p>
                      {m.source && (
                        <div className="mt-2 pt-1 border-t border-white/5 text-[8px] uppercase tracking-widest text-[#89cff0] flex items-center gap-1">
                          <Zap size={8} /> {m.source}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-3 rounded-xl flex gap-1 items-center italic text-[#D4AF37]">
                      <span className="animate-pulse">DeepSeek analizando...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-black/40 border-t border-[#D4AF37]/10 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Comando para el sistema..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
                />
                <button 
                  onClick={handleSend}
                  className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-3 py-1 rounded-lg transition-all active:scale-95 shadow-lg shadow-[#D4AF37]/20"
                >
                  <Send size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

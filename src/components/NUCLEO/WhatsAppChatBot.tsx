"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  User,
  ExternalLink,
  Smartphone
} from 'lucide-react';

export const WhatsAppChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'bot' | 'user', text: string}>>([
    { role: 'bot', text: 'Bienvenido a EAR OS. Soy ASTRA-WP. ¿Necesitas presupuesto o disponibilidad para un evento?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg = { role: 'user', text: inputValue } as const;
    setMessages([...messages, newMsg]);
    setInputValue('');

    // Respuesta simulada del bot
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'He recibido tu solicitud. Para agilizar el proceso, pulsa el botón de abajo para conectar directamente con un Productor Ejecutivo vía WhatsApp.' 
      }]);
    }, 1000);
  };

  const openWhatsApp = () => {
    const phoneNumber = "584120335095"; // Carlos Acevedo (Teléfono del prompt)
    const text = encodeURIComponent("Hola, vengo desde EAR OS. Necesito información personalizada.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-green-500 text-white rounded-full shadow-[0_10px_40px_rgba(34,197,94,0.4)]"
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-8 z-50 w-[350px] bg-black/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-green-500/10 p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-white tracking-widest">ASTRA WP</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online // S-Class Support</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-[300px] overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-[12px] leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-gold-500 text-black font-bold rounded-tr-none' 
                      : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {messages.length > 2 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={openWhatsApp}
                  className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone size={14} /> Saltar a WhatsApp Real
                </motion.button>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu duda táctica..."
                className="flex-1 bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-[12px] text-white outline-none focus:border-green-500/30 transition-all"
              />
              <button 
                onClick={handleSend}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

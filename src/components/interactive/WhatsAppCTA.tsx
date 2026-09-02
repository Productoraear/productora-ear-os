'use client';

import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '34693693048';
const WHATSAPP_MSG = encodeURIComponent('Hola Edwin, solicito asesoramiento sin compromiso para EAR OS.');

export const WhatsAppCTA: React.FC = () => {
  return (
    <motion.div
      className="fixed bottom-10 right-10 z-[100]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', damping: 20 }}
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 border-4 border-white/20"
      >
        <MessageSquareText size={32} />
        
        {/* TOOLTIP LABEL */}
        <div className="absolute right-20 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <span className="text-xs font-bold tracking-widest text-gold-400 uppercase">
            Asesoramiento sin compromiso
          </span>
        </div>

        {/* PULSE RADAR EFFECT */}
        <div className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20 pointer-events-none" />
      </a>
    </motion.div>
  );
};

/**
 * 🔒 POSITIVE FRICTION MODAL - THE IKEA EFFECT CONVERSION
 * Purpose: Transition users from exploration to engagement when they save 3+ items.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, ShieldCheck, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { useShortlist } from '@/hooks/useShortlist';
import { marketplaceFeedback } from '@/services/marketplace/MarketplaceFeedbackService';

export const PositiveFrictionModal: React.FC = () => {
  const { items, count } = useShortlist();
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // 🎯 TRIGGER: 3 o más elementos guardados
    if (count >= 3 && !hasTriggered) {
      setIsOpen(true);
      setHasTriggered(true);
      marketplaceFeedback.track('lead_started', {
        metadata: { trigger: 'shortlist_threshold', count }
      });
    }
  }, [count, hasTriggered]);

  const handleClose = () => {
    setIsOpen(false);
    marketplaceFeedback.track('lead_started', {
      metadata: { action: 'modal_dismissed' }
    });
  };

  const handleRequestDossier = () => {
    marketplaceFeedback.track('lead_started', {
      metadata: { action: 'dossier_requested', items: items.map(i => i.serviceId) }
    });
    // Redirigir al cotizador o portal con la pre-selección
    window.location.href = '/cotizador?items=' + items.map(i => i.serviceId).join(',');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          {/* OVERLAY */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* MODAL CONTAINER */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* DECORATION */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a855] to-transparent" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d4a855]/10 blur-[100px] rounded-full" />

            <div className="p-12 md:p-16 relative z-10">
              <button 
                onClick={handleClose}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-[#d4a855]/20 rounded-2xl flex items-center justify-center border border-[#d4a855]/30">
                  <Zap className="text-[#d4a855]" size={32} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#d4a855] uppercase tracking-[0.4em] block mb-1">Selección Consolidada</span>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Tu Dossier <span className="text-white/30">S-Class</span></h2>
                </div>
              </div>

              <p className="text-white/40 text-lg mb-12 leading-relaxed">
                Has seleccionado <span className="text-white font-bold">{count} servicios élite</span>. Hemos preparado una comparativa técnica y de inversión exclusiva para tu perfil.
              </p>

              {/* ITEM LIST PREVIEW */}
              <div className="space-y-4 mb-12">
                {items.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="w-2 h-2 bg-[#d4a855] rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button 
                  onClick={handleRequestDossier}
                  className="flex-1 h-16 bg-[#d4a855] text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#d4a855]/20"
                >
                  Generar Dossier <FileText size={18} />
                </button>
                <button 
                  onClick={handleClose}
                  className="flex-1 h-16 bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  Seguir Explorando
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#d4a855]" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Protocolo Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#d4a855]" />
                  <span className="text-[8px] font-black uppercase tracking-widest">IA Astra Ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

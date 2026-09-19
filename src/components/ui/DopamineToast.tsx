"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, X } from 'lucide-react';

export interface DopamineToastProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  amountEur?: number;
  onClose?: () => void;
}

export const DopamineToast: React.FC<DopamineToastProps> = ({
  isVisible,
  title = '¡RESERVA Y DEPOSIT BLINDAJE CONFIRMADO!',
  message = 'Fianza Price-Lock de 100 € registrada en Stripe (SHA-256).',
  amountEur = 100,
  onClose
}) => {
  useEffect(() => {
    if (isVisible) {
      // Reproducir feedback auditivo háptico sutil si el navegador lo permite
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch {
        // Ignorar si el audio automático está bloqueado por el navegador
      }
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[200] max-w-sm w-full p-5 rounded-3xl bg-gradient-to-r from-[#0c0c14] to-[#050508] border border-[#ecb613]/50 shadow-[0_20px_50px_rgba(236,182,19,0.25)] text-white space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="p-2.5 rounded-2xl bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613]">
              <Sparkles size={20} />
            </div>

            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={11} /> Cierre Transaccional S-Class
              </span>
              <h4 className="text-sm font-bold font-syne text-white">{title}</h4>
              <p className="text-xs text-zinc-300 font-sans leading-snug">{message}</p>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-zinc-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/10">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} /> Stripe Verified
            </span>
            <span className="text-white font-bold font-syne text-sm">
              +{amountEur} €
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

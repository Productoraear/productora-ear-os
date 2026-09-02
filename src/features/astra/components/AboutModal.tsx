"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon, ShieldCheckIcon, CpuChipIcon } from '@heroicons/react/24/outline';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                  ✦
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Astra Operating System</h3>
                  <p className="text-xs text-zinc-400 font-mono">v2.5 // Strategic Reasoning Engine</p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
              <p>
                Astra OS is an executive-tier strategic operating system engineered to empower creators, executives, entrepreneurs, and thought leaders to navigate high-stakes decisions with rigorous first-principles precision.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                    <CpuChipIcon className="w-4 h-4" /> Gemini AI Co-Pilot
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Multi-persona deliberation councils and deep synthesis workflows.
                  </p>
                </div>

                <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <ShieldCheckIcon className="w-4 h-4" /> Antifragile Design
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Strict boundary analysis, risk radar audits, and IP protection.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-zinc-400 text-center font-mono">
                Engineered for maximum asymmetric leverage.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

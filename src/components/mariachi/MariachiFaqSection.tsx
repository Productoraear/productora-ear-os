"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

import { MARIACHI_FAQS, FaqItem } from '@/lib/constants/mariachi-faqs';
export { MARIACHI_FAQS };
export type { FaqItem };

export default function MariachiFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div id="preguntas-frecuentes" className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
          <HelpCircle size={14} />
          RESOLUCIÓN DE DUDAS // TRANSPARENCIA TOTAL
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
          Preguntas Frecuentes
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-sans">
          Todo lo que necesitas saber sobre garantías de reserva, facturación, acústica y logística.
        </p>
      </div>

      <div className="space-y-3">
        {MARIACHI_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#09090f] border-[#ecb613]/40 shadow-lg'
                  : 'bg-[#050508] border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-syne font-bold text-base sm:text-lg text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[#ecb613] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-white/70 font-sans leading-relaxed border-t border-white/5">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

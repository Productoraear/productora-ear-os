'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  Brain, 
  Ear, 
  BarChart3, 
  FileText, 
  Building, 
  Feather,
  Sparkles
} from 'lucide-react';
import { VIMUME_CLINICAL_SSOT, VimumeSovereignFAQ } from '@/lib/constants/vimume-clinical-ssot';

const TAG_COLORS: Record<VimumeSovereignFAQ['authorityTag'], { bg: string; text: string; border: string }> = {
  NEUROCIENCIA: { bg: 'bg-[#8b5cf6]/10', text: 'text-[#8b5cf6]', border: 'border-[#8b5cf6]/30' },
  AUDIOLOGIA: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  ESTADISTICA: { bg: 'bg-[#AAD6CD]/10', text: 'text-[#AAD6CD]', border: 'border-[#AAD6CD]/30' },
  FISCAL_LEGAL: { bg: 'bg-[#ecb613]/10', text: 'text-[#ecb613]', border: 'border-[#ecb613]/30' },
  CONCERTACION_B2G: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  IDENTIDAD: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' }
};

export function VimumeRagFaqSection() {
  const [selectedTag, setSelectedTag] = useState<string>('TODAS');
  const [openIndex, setOpenIndex] = useState<number | null>(121);

  const faqs = VIMUME_CLINICAL_SSOT.FAQ_LIST;
  const filteredFaqs = selectedTag === 'TODAS'
    ? faqs
    : faqs.filter(f => f.authorityTag === selectedTag);

  const tags = ['TODAS', 'NEUROCIENCIA', 'AUDIOLOGIA', 'ESTADISTICA', 'FISCAL_LEGAL', 'CONCERTACION_B2G', 'IDENTIDAD'];

  return (
    <section className="space-y-8">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-mono tracking-widest uppercase font-bold">
            <HelpCircle size={13} className="text-[#8b5cf6]" />
            <span>BASE RAG SSOT // BLOQUE 7 DEL CUESTIONARIO MAESTRO (Q121-Q140)</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
            Consultas de Autoridad <span className="text-[#8b5cf6]">Clínica & Jurídica</span>
          </h3>
          <p className="text-sm text-zinc-400 max-w-2xl font-light">
            Respuestas inmutables extraídas del RAG de VIMUME (3.601 vectores cognitivos) para comités médicos, directores de residencias y técnicos de contratación pública.
          </p>
        </div>

        {/* CONTADOR */}
        <div className="text-xs font-mono text-zinc-400 bg-black/60 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 w-fit">
          <Sparkles size={14} className="text-[#ecb613]" />
          <span>3.997 Docs RAG Indexados</span>
        </div>
      </div>

      {/* FILTRO DE TAGS */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
              selectedTag === tag
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ACORDEÓN DE PREGUNTAS */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openIndex === faq.questionNumber;
          const tagStyle = TAG_COLORS[faq.authorityTag];

          return (
            <div
              key={faq.questionNumber}
              className="rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#8b5cf6]/40 transition-colors overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : faq.questionNumber)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">
                      Q{faq.questionNumber}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md border font-bold ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}>
                      {faq.authorityTag}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white font-syne">
                    {faq.question}
                  </h4>
                </div>

                <div className={`p-2 rounded-xl bg-white/5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-5 sm:p-6 pt-0 border-t border-white/5 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

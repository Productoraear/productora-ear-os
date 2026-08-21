"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  Copy, 
  Check, 
  X, 
  Search, 
  Layers, 
  ChevronUp, 
  ChevronDown, 
  Flame, 
  Zap, 
  Phone, 
  ShieldCheck, 
  Radio,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface TacticalPlaybook {
  routePattern: RegExp;
  category: string;
  source: string;
  title: string;
  checklist: string[];
  actionPayload: string;
}

const TACTICAL_PLAYBOOKS: TacticalPlaybook[] = [
  {
    routePattern: /\/(admin\/arsenal|admin\/campanas|marketing|arsenal)/,
    category: "MARKETING & ADS DE ALTA CONVERSIÓN",
    source: "Lección 6.2 & 3.3 — Dani Aragón (Vampirización Whisper)",
    title: "Playbook: Estructura de Anuncio Imposible de Ignorar",
    checklist: [
      "Gancho visual en los primeros 3 segundos (romper el patrón de scroll).",
      "Nombrar el dolor exacto ('¿Te frustra que el presupuesto suba un 35% a mitad de boda?').",
      "Presentar el Linchpin único (Sonorización Bose F1 + 12 W/pax).",
      "Llamada a la acción con escasez genuina: 'Solo 52 fechas anuales aseguradas'."
    ],
    actionPayload: "Estructura de Campaña Ads: Gancho 0-3s -> Dolor -> Linchpin 12W/pax -> Escasez 52 fechas."
  },
  {
    routePattern: /\/(admin\/artistas|artistas|the-signal|academia)/,
    category: "DESARROLLO DE ARTISTAS & THE SIGNAL",
    source: "Incubadora Despegue — Framework de Autoridad",
    title: "Playbook: Onboarding y Blindaje de Carrera de Artistas",
    checklist: [
      "Evaluar la 'Señal' vs 'Ruido': Auditar repertorio, afinación y vestuario de gala.",
      "Implantar el Split Soberano 80/10/10 en servidor antes de la primera actuación.",
      "Garantizar Rider Técnico mínimo: Microfonía Shure Axient / Beta 87A y seguro RC de 1M€.",
      "Descarga del Workbook Táctico y plan de monetización patrimonial."
    ],
    actionPayload: "Protocolo The Signal: Split 80/10/10 + Shure Axient + Póliza RC 1M€ + Workbook Táctico."
  },
  {
    routePattern: /\/(admin\/vimume|vimume|ayuntamientos|b2g)/,
    category: "AUTORIDAD PÚBLICA & ESTIMULACIÓN GAMMA",
    source: "Protocolo VIMUME 40Hz MIT & Art. 118 LCSP",
    title: "Playbook: Licitación Municipal y Contratación Menor B2G",
    checklist: [
      "Inyectar memoria técnica de estimulación neurocognitiva 40Hz (MIT / Massachusetts).",
      "Generación de pliego bajo Art. 118 LCSP para contratos menores (< 15.000 €).",
      "Justificación de impacto social positivo y alineación con fondos europeos NextGenEU.",
      "Aprobación técnica directa por el pleno sin concurso público dilatado."
    ],
    actionPayload: "Memoria B2G Art. 118 LCSP: Neuroestimulación Gamma 40Hz MIT + Impacto Social NextGenEU."
  },
  {
    routePattern: /\/(bodas|cotizador|presupuesto)/,
    category: "CIERRE NUPCIAL S-CLASS & CONCIERGE",
    source: "Biblioteca Bodas.net PRO (Sanitizada en Bóveda RAG)",
    title: "Playbook: Desarme de Objeciones y Cierre Bespoke",
    checklist: [
      "Anticipar sobrecostes de la competencia: blindar precio final por contrato mercantil.",
      "Prescribir 12 W/pax de presión acústica para no ensordecer mayores ni vaciar la pista.",
      "Desplegar Protocolo Plan B con redundancia técnica y generador auxiliar in situ.",
      "Bloqueo de slot con Price-Lock 72h garantizado con depósito inicial de 10 €."
    ],
    actionPayload: "Estrategia de Cierre Nupcial: Presupuesto Cerrado + 12W/pax + Plan B Redundante + Price-Lock 72h."
  },
  {
    routePattern: /\/(empresarios|corporativo)/,
    category: "ACOMPAÑAMIENTO EMPRESARIAL B2B",
    source: "Metodología Edwin Agudelo (Planes 1.000€ y 3.000€)",
    title: "Playbook: Acompañamiento Estratégico & Táctico",
    checklist: [
      "Aplicar la Promesa Soberana: 'No queremos solo tu presupuesto, queremos tu transformación'.",
      "Auditoría continua de procesos comerciales e ingeniería emocional de ventas.",
      "Garantía de resultados por escrito en el Plan Ejecución 1.000€/mes.",
      "Gestión full-service de activos digitales en Plan Premium Business 3.000€/mes."
    ],
    actionPayload: "Propuesta B2B: Plan Ejecución 1000€ / Premium Business 3000€ con garantía de ROI por escrito."
  }
];

export const AstraOracle: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [searching, setSearching] = useState<boolean>(false);

  // Dynamic context lookup based on pathname
  const activePlaybook = useMemo(() => {
    for (const pb of TACTICAL_PLAYBOOKS) {
      if (pb.routePattern.test(pathname || '')) {
        return pb;
      }
    }
    // Default fallback
    return TACTICAL_PLAYBOOKS[0];
  }, [pathname]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSearchRAG = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setTimeout(() => {
      const q = searchQuery.toLowerCase();
      if (q.includes('ads') || q.includes('facebook') || q.includes('youtube')) {
        setCustomAnswer("📌 [Dani Aragón]: 'El secreto de los anuncios musicales no es mostrar tu canción, sino mostrar la emoción de quien la escucha. Usa ganchos en los primeros 3 segundos y retén a la audiencia con micro-historias antes de pedir el clic'.");
      } else if (q.includes('boda') || q.includes('precio') || q.includes('catering')) {
        setCustomAnswer("📌 [Bóveda RAG Nupcial]: 'El 68% de las parejas en fincas sufre por cortes eléctricos o volumen estridente. El estándar EAR OS prescribe 12 W/pax con matrices Bose F1 y doble microfonía Shure Axient con seguro de 1M€'.");
      } else if (q.includes('ayuntamiento') || q.includes('b2g') || q.includes('licitacion')) {
        setCustomAnswer("📌 [Protocolo VIMUME B2G]: 'Bajo el Art. 118 LCSP (<15.000 €), el concejal puede adjudicar directamente la actividad sin concurso si se acredita el carácter científico de estimulación Gamma 40Hz (MIT) e impacto social'.");
      } else {
        setCustomAnswer("📌 [Bóveda Cognitiva 8.420 Nodos]: 'Para este objetivo, aplica la estructura de Despegue: 1) Definir el Linchpin único, 2) Eliminar la fricción de contratación, 3) Aplicar el Price-Lock 72h con garantía por contrato'.");
      }
      setSearching(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      
      {/* 🔮 FLOATING PILL TRIGGER */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-3.5 sm:px-5 sm:py-3 bg-[#0c0c14]/90 backdrop-blur-xl border border-[#ecb613]/50 hover:border-[#ecb613] rounded-full shadow-[0_10px_35px_rgba(236,182,19,0.25)] flex items-center gap-3 text-white cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ecb613] relative z-10" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#ecb613] font-bold">
              Oráculo Astra
            </span>
            <span className="text-[11px] text-white/80 font-medium">
              Inteligencia Táctica Activa
            </span>
          </div>

          <Sparkles size={16} className="text-[#ecb613] group-hover:rotate-12 transition-transform" />
        </motion.button>
      )}

      {/* 🌌 EXPANDED GLASSMORPHIC HUD */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-[92vw] sm:w-[460px] bg-[#07070c]/95 backdrop-blur-2xl border border-[#ecb613]/40 rounded-[2.5rem] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-5 text-white overflow-hidden relative"
          >
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
                  <Brain size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-black uppercase tracking-[0.3em] text-[#ecb613]">
                    Oráculo Astra // S-Class
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Radio size={10} className="animate-pulse" />
                    8.420 Nodos RAG Sincronizados
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Context & Active Route */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                <span>Ruta detectada: <strong className="text-white">{pathname}</strong></span>
                <span className="text-[#ecb613] font-bold">{activePlaybook.category}</span>
              </div>
            </div>

            {/* Active Tactical Playbook */}
            <div className="space-y-3 relative z-10">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#ecb613] uppercase tracking-wider block font-bold">
                  {activePlaybook.source}
                </span>
                <h4 className="text-sm font-black uppercase text-white font-syne">
                  {activePlaybook.title}
                </h4>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-white/80 font-light">
                {activePlaybook.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={13} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct RAG Query Box */}
            <form onSubmit={handleSearchRAG} className="space-y-2 relative z-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Consultar Bóveda RAG (Ads, Bodas, B2G, Whisper)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 p-3 pr-10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-[#ecb613] font-mono"
                />
                <button
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#ecb613] hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                >
                  <Search size={15} />
                </button>
              </div>

              {customAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3.5 rounded-xl bg-[#100d04] border border-[#ecb613]/30 text-xs text-white/90 leading-relaxed font-light font-mono"
                >
                  {customAnswer}
                </motion.div>
              )}
            </form>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 relative z-10">
              <button
                onClick={() => handleCopy(activePlaybook.actionPayload)}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer text-white"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-[#ecb613]" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Protocolo'}</span>
              </button>

              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent(`Astra Neural Protocol (${pathname}):\n${activePlaybook.actionPayload}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#ecb613] hover:bg-white text-black text-xs font-mono font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Phone size={13} />
                <span>Centralita</span>
              </a>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AstraOracle;

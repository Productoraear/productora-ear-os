'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Zap, ShieldCheck, Volume2 } from 'lucide-react';

interface AnticipationWidgetProps {
  vertical: string;
}

/**
 * 🧠 AnticipationWidget S-Class — Micro-Interacción Proactiva de Neuromarketing
 * Predice la siguiente duda del usuario en base a la vertical seleccionada,
 * apareciendo flotante tras scroll > 40% para anclar autoridad técnica.
 */
export default function AnticipationWidget({ vertical }: AnticipationWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.4 && !dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
  };

  // Insights extraídos del RAG y AlsoAsked/AnswerThePublic
  const getInsight = (): { icon: React.ReactNode; label: string; text: string } => {
    switch (vertical) {
      case 'bodas':
        return {
          icon: <Volume2 className="w-5 h-5 text-amber-400" />,
          label: 'Cobertura Acústica',
          text: '¿Dudando sobre la potencia necesaria? Nuestro line array Bose F1 812 cubre acústicamente hasta 300 invitados sin distorsión vocal. Garantía 12 W/pax.',
        };
      case 'corporativo':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
          label: 'Protocolo de Puntualidad',
          text: 'Sabemos que el protocolo exige puntualidad. Nuestro equipo técnico inicia el montaje 3 horas antes del acceso de invitados con redundancia completa.',
        };
      case 'quinceaneras':
        return {
          icon: <Zap className="w-5 h-5 text-pink-400" />,
          label: 'Repertorio Actualizado',
          text: 'Nuestro setlist se actualiza cada 2 semanas con los éxitos de Spotify Top 50. Vals de ensueño + urbano actual sin transiciones bruscas.',
        };
      case 'vimume':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          label: 'Seguridad Clínica',
          text: 'Las sesiones de musicoterapia no superan los 75 dB (norma OMS) y están supervisadas por protocolo VIMUME de estimulación neurocognitiva.',
        };
      case 'ayuntamientos':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
          label: 'Documentación LCSP',
          text: 'Expediente listo para contrato menor LCSP (<15.000€): memoria técnica, certificado de solidez, seguro RC 600.000€ y factura con NIF.',
        };
      default:
        return {
          icon: <Zap className="w-5 h-5 text-amber-400" />,
          label: 'Coste de Desplazamiento',
          text: '¿Quieres saber el coste exacto de desplazamiento? El algoritmo lo calcula automáticamente: 0.35€/km fuera de los 50km base de Madrid.',
        };
    }
  };

  const insight = getInsight();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-[#09090d]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 rounded-2xl p-5 relative">
            {/* Ambient Glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#ecb613]/10 via-transparent to-purple-500/10 pointer-events-none" />

            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#ecb613]/10 flex items-center justify-center shrink-0 border border-[#ecb613]/30">
                {insight.icon}
              </div>
              <div>
                <p className="text-[10px] text-[#ecb613] font-mono font-bold mb-1 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" />
                  <span>EAR OS Anticipa — {insight.label}</span>
                </p>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

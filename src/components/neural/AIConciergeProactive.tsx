'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Calculator, 
  ArrowRight, 
  X, 
  MessageSquare, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Phone 
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface AIProactiveMessage {
  id: string;
  triggerSource: 'hesitation' | 'viewport' | 'telemetry';
  headline: string;
  content: string;
  ctaText: string;
  ctaAction: () => void;
  tag: string;
}

interface AIConciergeProactiveProps {
  onSelectTab?: (tabId: string) => void;
}

export const AIConciergeProactive: React.FC<AIConciergeProactiveProps> = ({ onSelectTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState<AIProactiveMessage | null>(null);
  const [dismissedMessages, setDismissedMessages] = useState<Set<string>>(new Set());
  const [cursorVelocity, setCursorVelocity] = useState<number>(0);

  const lastMousePos = useRef<{ x: number; y: number; time: number } | null>(null);
  const hesitationTimer = useRef<NodeJS.Timeout | null>(null);
  const currentTargetZone = useRef<string | null>(null);

  // Mensajes predictivos S-Class contextuales
  const triggerMessage = useCallback((msg: AIProactiveMessage) => {
    if (dismissedMessages.has(msg.id)) return;
    setActiveMessage(msg);
    setIsOpen(true);
  }, [dismissedMessages]);

  // 1. RASTREADOR DE VELOCIDAD DE CURSOR (Heurística de vacilación táctica: v = dr/dt)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (!lastMousePos.current) {
        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
        return;
      }

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dt = Math.max(1, now - lastMousePos.current.time);
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt; // px / ms

      setCursorVelocity(velocity);
      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

      // Detectar si el usuario desacelera drásticamente sobre una sección estratégica (<0.15 px/ms)
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
      const interactiveZone = elementUnderCursor?.closest('[data-proactive-zone]');
      const zoneId = interactiveZone?.getAttribute('data-proactive-zone') || null;

      if (zoneId && velocity < 0.18) {
        if (currentTargetZone.current !== zoneId) {
          currentTargetZone.current = zoneId;
          if (hesitationTimer.current) clearTimeout(hesitationTimer.current);

          hesitationTimer.current = setTimeout(() => {
            if (zoneId === 'mecenazgo') {
              triggerMessage({
                id: 'hesitation-mecenazgo',
                triggerSource: 'hesitation',
                tag: 'LEY 49/2002 // AEAT',
                headline: '¿Deseas calcular tu deducción fiscal del 80%?',
                content: 'Veo que analizas el incentivo tributario. Si eres particular, una donación de 150 € tiene un coste neto de solo 30 €. Si eres empresa, deduces hasta el 50% en Impuesto de Sociedades.',
                ctaText: 'Abrir Calculadora Modelo 182',
                ctaAction: () => {
                  if (onSelectTab) onSelectTab('mecenazgo');
                  setIsOpen(false);
                }
              });
            } else if (zoneId === 'evidencia') {
              triggerMessage({
                id: 'hesitation-evidencia',
                triggerSource: 'hesitation',
                tag: 'NEUROCIENCIA 40 HZ',
                headline: '¿Deseas auditar la cohorte N=45?',
                content: 'El estudio piloto arrojó una caída del 38.2% en la escala CMAI (agitación psicomotriz) y una reducción del 74% en neurolépticos con p < 0.05.',
                ctaText: 'Ver Métricas del Estudio',
                ctaAction: () => {
                  if (onSelectTab) onSelectTab('evidencia');
                  setIsOpen(false);
                }
              });
            }
          }, 1200); // 1.2 segundos de vacilación sobre el elemento
        }
      } else {
        if (hesitationTimer.current) {
          clearTimeout(hesitationTimer.current);
          hesitationTimer.current = null;
        }
        currentTargetZone.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hesitationTimer.current) clearTimeout(hesitationTimer.current);
    };
  }, [triggerMessage, onSelectTab]);

  // 2. INTERSECTION OBSERVER EN EL VIEWPORT (> 3 segundos en pantalla)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionId = entry.target.getAttribute('id') || entry.target.getAttribute('data-section');

            const timer = setTimeout(() => {
              if (sectionId === 'seccion-mecenazgo' || sectionId === 'portal-mecenazgo') {
                triggerMessage({
                  id: 'viewport-mecenazgo-3s',
                  triggerSource: 'viewport',
                  tag: 'CONCIERGE TRIBUTARIO',
                  headline: 'Certificación Fiscal Oficial de Donaciones',
                  content: 'Emitimos certificado con hash criptográfico SHA-256 para desgravación directa en el borrador de la AEAT (Modelo 182).',
                  ctaText: 'Simular Deducción IRPF / IS',
                  ctaAction: () => {
                    if (onSelectTab) onSelectTab('mecenazgo');
                    setIsOpen(false);
                  }
                });
              } else if (sectionId === 'seccion-sonometria' || sectionId === 'sonometria') {
                triggerMessage({
                  id: 'viewport-sonometria-3s',
                  triggerSource: 'viewport',
                  tag: 'AUDIOLOGÍA GERIÁTRICA',
                  headline: 'Protección Anti-Reclutamiento Coclear',
                  content: 'Los oídos ancianos sufren ante picos >78 dB. Nuestro sistema Bose a 12 W/pax garantiza sonido nítido sin distorsión.',
                  ctaText: 'Inspeccionar Sonómetro',
                  ctaAction: () => {
                    if (onSelectTab) onSelectTab('sonometria');
                    setIsOpen(false);
                  }
                });
              }
            }, 3000);

            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.5 }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll('[data-observe-concierge]');
      targets.forEach((el) => observer.observe(el));
    };

    // Dar tiempo al DOM de hidratarse
    const t = setTimeout(observeElements, 1000);

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [triggerMessage, onSelectTab]);

  const handleDismiss = () => {
    if (activeMessage) {
      setDismissedMessages((prev) => new Set(prev).add(activeMessage.id));
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && activeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-sm sm:max-w-md rounded-3xl bg-[#09090f]/95 backdrop-blur-2xl border border-[#8b5cf6]/50 p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.25)] space-y-4 pointer-events-auto relative overflow-hidden mb-4"
          >
            {/* Glow decorativo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#8b5cf6]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header del Concierge */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-[#8b5cf6]">
                  <Brain size={14} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#8b5cf6] font-bold block uppercase tracking-wider">
                    {activeMessage.tag}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    ORÁCULO PREDICTIVO // EAR OS
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Cerrar notificación"
              >
                <X size={14} />
              </button>
            </div>

            {/* Contenido */}
            <div className="space-y-1.5 relative z-10">
              <h4 className="text-sm font-black text-white font-syne uppercase leading-snug">
                {activeMessage.headline}
              </h4>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {activeMessage.content}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 pt-1 relative z-10">
              <button
                type="button"
                onClick={activeMessage.ctaAction}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#8b5cf6]/30"
              >
                <span>{activeMessage.ctaText}</span>
                <ArrowRight size={13} />
              </button>

              <a
                href={CENTRALITA.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer"
                title="Consultar por WhatsApp"
              >
                <Phone size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Icon (Minimized state) */}
      <motion.button
        type="button"
        onClick={() => {
          if (!activeMessage) {
            triggerMessage({
              id: 'manual-trigger',
              triggerSource: 'telemetry',
              tag: 'ASISTENTE CLÍNICO & FISCAL',
              headline: '¿Cómo podemos impulsar tu centro residencial?',
              content: 'Te orientamos en el cálculo de deducciones fiscales (Ley 49/2002), homologación acústica de salas (<75 dB) o contratación menor B2G (Art. 118 LCSP).',
              ctaText: 'Ver Calculadora Fiscal',
              ctaAction: () => {
                if (onSelectTab) onSelectTab('mecenazgo');
                setIsOpen(false);
              }
            });
          } else {
            setIsOpen(!isOpen);
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto p-3.5 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#ecb613] text-white shadow-[0_0_35px_rgba(139,92,246,0.5)] flex items-center gap-2.5 border border-white/20 cursor-pointer"
      >
        <Sparkles size={18} className="animate-spin-slow" />
        <span className="text-xs font-mono font-bold tracking-wider uppercase hidden sm:inline">
          Oráculo VIMUME
        </span>
      </motion.button>
    </div>
  );
};

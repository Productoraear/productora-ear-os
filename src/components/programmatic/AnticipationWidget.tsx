'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Zap, ShieldCheck, Volume2 } from 'lucide-react';

interface AnticipationWidgetProps {
  vertical: string;
  intent?: string;
}

/**
 * 🧠 AnticipationWidget S-Class — Micro-Interacción Proactiva de Neuromarketing
 * Predice la siguiente duda u objeción del usuario en base al INTENT específico y vertical,
 * apareciendo flotante tras scroll > 35% para anclar autoridad técnica y acelerar el cierre.
 */
export default function AnticipationWidget({ vertical, intent = '' }: AnticipationWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.35 && !dismissed) {
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

  // Resolver cognitivo dinámico de Anticipación según el INTENT exacto
  const getInsight = (): { icon: React.ReactNode; label: string; text: string } => {
    const slug = (intent || '').toLowerCase();

    // 1. Chófer VIP / Vehículos Nupciales & Traslados
    if (slug.includes('coche') || slug.includes('chofer') || slug.includes('mercedes') || slug.includes('transporte-vip')) {
      return {
        icon: <ShieldCheck className="w-5 h-5 text-[#ecb613]" />,
        label: 'Flota VIP & Protocolo de Gala',
        text: '¿Dudas sobre traslados o tiempos de espera? Nuestros chóferes visten traje de gala, disponen de agua y Wi-Fi 5G a bordo y monitorizan vuelos y accesos en tiempo real.',
      };
    }

    // 2. Pantallas LED y Producción Visual
    if (slug.includes('pantalla') || slug.includes('led') || slug.includes('audiovisual')) {
      return {
        icon: <Zap className="w-5 h-5 text-cyan-400" />,
        label: 'Resolución & Luminosidad Real',
        text: '¿Dudando sobre la luminosidad en exteriores? Montamos cabinets P3.9 de >4.500 nits protegidos IP65 o P2.6 para interiores con procesadores Novastar y escalado 4K.',
      };
    }

    // 3. Alumbrado Navideño & Licitaciones
    if (slug.includes('navid') || slug.includes('alumbrado') || slug.includes('luces')) {
      return {
        icon: <Zap className="w-5 h-5 text-amber-300" />,
        label: 'Ingeniería Lumínica & LCSP',
        text: '¿Necesitas memoria técnica visada o cuadro de carga? Entregamos certificado de cálculo de viento, cuadros estancos IP67 y bajo consumo LED para auditorías municipales.',
      };
    }

    // 4. Pedidas de Mano / Serenatas Sorpresa
    if (slug.includes('pedida-mano') || slug.includes('serenata') || slug.includes('sorpresa')) {
      return {
        icon: <Volume2 className="w-5 h-5 text-rose-400" />,
        label: 'Operativo Sorpresa 100% Invisible',
        text: '¿Cómo garantizamos el factor sorpresa? El artista se posiciona discretamente a 50 metros y recibe señal de inicio por WhatsApp o geolocalización GPS en el minuto exacto.',
      };
    }

    // 5. Barcelona / Cataluña
    if (slug.includes('barcelona') || slug.includes('valles')) {
      return {
        icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
        label: 'Logística Cataluña & Desplazamiento',
        text: '¿Actuación o sonorización en Barcelona/Vallès? Coordinamos enlace directo con equipo de sonido in-situ para anular costes de transporte de carga pesada.',
      };
    }

    // 6. Mallorca / Baleares
    if (slug.includes('mallorca') || slug.includes('baleares')) {
      return {
        icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
        label: 'Logística Insular Garantizada',
        text: '¿Evento en Baleares? El rider técnico viaja con flight-cases homologados y conexión con partners preferentes locales para redundancia inmediata.',
      };
    }

    // 7. Galicia / Norte
    if (slug.includes('galicia') || slug.includes('pontevedra') || slug.includes('coruna')) {
      return {
        icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        label: 'Protección Climática Outdoor',
        text: '¿Riesgo de humedad o lluvia en fincas gallegas? Todo el conexionado y matrices de amplificación cuentan con protección estanca y carpa técnica para FOH.',
      };
    }

    // 8. Fincas y Salones Singulares
    if (slug.includes('finca') || slug.includes('malpica') || slug.includes('afligidos')) {
      return {
        icon: <Volume2 className="w-5 h-5 text-amber-400" />,
        label: 'Acústica de Finca & Acometida Eléctrica',
        text: '¿Finca histórica con limitador acústico o corriente monofásica? Nuestros procesadores DSP autorregulan la curva de graves para cumplir normativa sin perder pegada.',
      };
    }

    // 9. Ayuntamientos / LCSP
    if (vertical === 'ayuntamientos' || slug.includes('lcsp') || slug.includes('patronales') || slug.includes('institucionales')) {
      return {
        icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
        label: 'Pliegos Técnicos & Seguro 600.000 €',
        text: '¿Licitación urgente para fiestas o actos? Emitimos la memoria valorada y factura electrónica con FACe en <24 horas para agilizar la intervención municipal.',
      };
    }

    // 10. VIMUME / Musicoterapia
    if (vertical === 'vimume' || slug.includes('musicoterapia') || slug.includes('envejecimiento')) {
      return {
        icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        label: 'Seguridad Clínica & Telemetría',
        text: 'Las sesiones se ajustan rigurosamente a <75 dB con estímulos pentatónicos que no saturan el sistema nervioso de personas con deterioro neurocognitivo.',
      };
    }

    // 11. Quinceañeras
    if (vertical === 'quinceaneras' || slug.includes('15-anos')) {
      return {
        icon: <Zap className="w-5 h-5 text-pink-400" />,
        label: 'Repertorio Top 50 Spotify',
        text: 'Nuestro setlist se actualiza cada 2 semanas con los éxitos virales de TikTok y Spotify Top 50. Vals mariachi de ensueño + sesión urbana sin cortes.',
      };
    }

    // 12. Corporativo Default
    if (vertical === 'corporativo') {
      return {
        icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
        label: 'Protocolo de Puntualidad & Cero Fallos',
        text: 'Sabemos que el protocolo corporativo no perdona fallos. Montaje 3 horas antes de la apertura, conmutación de backup en <50ms y factura NIF inmediata.',
      };
    }

    // 13. Bodas Default
    return {
      icon: <Volume2 className="w-5 h-5 text-amber-400" />,
      label: 'Cobertura Acústica 12 W/pax',
      text: '¿Dudando sobre la potencia necesaria? Nuestro line array Bose F1 812 cubre acústicamente hasta 300 invitados sin distorsión vocal. Garantía 12 W/pax.',
    };
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
          <div className="bg-[#09090d]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 rounded-2xl p-5 relative">
            {/* Ambient Glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#ecb613]/15 via-transparent to-blue-500/10 pointer-events-none" />

            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors z-10 p-1"
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
                <p className="text-xs text-neutral-300 leading-relaxed">
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

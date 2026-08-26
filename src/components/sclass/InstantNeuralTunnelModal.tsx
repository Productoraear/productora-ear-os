'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, ShieldCheck, Heart, Landmark, Building2, 
  Flame, Music, Zap, ArrowRight, Phone, MessageCircle, 
  CheckCircle2, Lock, Radio, Sliders, FileText, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export type TunnelProfile = 'CLIENT' | 'B2G' | 'PARTNER' | 'ARTIST' | 'BBQ';

interface InstantNeuralTunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TunnelProfile;
  initialEventName?: string;
}

const PROFILE_DATA: Record<TunnelProfile, {
  title: string;
  badge: string;
  subtitle: string;
  accentColor: string;
  glowColor: string;
  icon: any;
  phases: { id: string; title: string; desc: string }[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  specs: { label: string; value: string }[];
}> = {
  CLIENT: {
    title: 'Túnel Nupcial & Particulares S-Class',
    badge: 'UNIO // B2C VIP',
    subtitle: 'Música de Conservatorio, Presión 12 W/pax y Price-Lock 72h',
    accentColor: '#ecb613',
    glowColor: 'rgba(236, 182, 19, 0.35)',
    icon: Heart,
    phases: [
      { id: '01', title: '01. Mapa Emocional', desc: 'Selección de repertorio lírico de gala, vals nupcial y dedicatorias de autor.' },
      { id: '02', title: '02. Física Acústica', desc: 'Calibración de sonido Bose F1 a 12 W/pax para cóctel, ceremonia y banquete sin cables.' },
      { id: '03', title: '03. Bloqueo 72h', desc: 'Depósito de 100€ en Stripe con SHA-256 inmutable. 100% reembolsable en 24h si no encaja.' }
    ],
    primaryCta: { label: 'Cotizar Boda en 1 Minuto', href: '/cotizador?mode=bespoke&role=cliente' },
    secondaryCta: { label: 'Ver Repertorio de Gala', href: '/bodas' },
    specs: [
      { label: 'Garantía Acústica', value: '12 W/pax Homologado' },
      { label: 'Seguro RC', value: '1.000.000 € Incluido' },
      { label: 'Depósito Seguro', value: '100 € Reembolsable' },
      { label: 'Split Soberano', value: '80% Artista / 10% EAR / 10% VIMUME' }
    ]
  },
  B2G: {
    title: 'Protocolo Institucional & Diplomacia',
    badge: 'B2G // LCSP ART. 118',
    subtitle: 'Memorias Técnicas en 24h para Ayuntamientos, Embajadas y Festivales',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    icon: Landmark,
    phases: [
      { id: '01', title: '01. Memoria Técnica', desc: 'Generación automática de justificación contractual bajo Art. 118 LCSP (<15.000 €).' },
      { id: '02', title: '02. Producción Escénica', desc: 'Rider de gran formato: Pantallas LED P2.9, microfonía Shure Axient y Line Array d&b.' },
      { id: '03', title: '03. Facturación FACe', desc: 'Tramitación directa con NIF fiscal, alta en SS de artistas y certificado tributario al corriente.' }
    ],
    primaryCta: { label: 'Desplegar Pliego Técnico B2G', href: '/ocasiones/ayuntamientos' },
    secondaryCta: { label: 'Auditoría de Soberanía Técnica', href: '/soberania-tecnica' },
    specs: [
      { label: 'Contratación', value: 'Contrato Menor LCSP' },
      { label: 'Memoria Técnica', value: 'Lista en 24 horas' },
      { label: 'Régimen SS', value: '100% Artistas en Alta' },
      { label: 'SLA Público', value: 'Garantía 0 Fallos' }
    ]
  },
  PARTNER: {
    title: 'Red de Fincas, Planners & Espacios',
    badge: 'B2B PARTNERS // COMISIÓN 10%',
    subtitle: 'Producción Técnica Homologada y Liquidaciones Semanales en Stripe',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    icon: Building2,
    phases: [
      { id: '01', title: '01. Homologación Venue', desc: 'Indexación técnica de tu finca o espacio en la red de 22.471 activos de España.' },
      { id: '02', title: '02. Producción Sin Fricción', desc: 'Montaje de sonido Bose y pantallas LED sin alterar la estética arquitectónica del recinto.' },
      { id: '03', title: '03. Split Automático', desc: 'Liquidación transparente del 10% de comisión comercial cada domingo vía Stripe Connect.' }
    ],
    primaryCta: { label: 'Explorar Catálogo de Fincas', href: '/proveedores?cat=finca' },
    secondaryCta: { label: 'Acceso Programa Alianzas', href: '/empresarios' },
    specs: [
      { label: 'Comisión Partner', value: '10% Neto por Evento' },
      { label: 'Liquidación', value: 'Automática Semanal' },
      { label: 'Protección Finca', value: 'Seguro RC 1M€' },
      { label: 'Soporte Técnico', value: 'Operador In Situ' }
    ]
  },
  ARTIST: {
    title: 'The Signal: Roster de Diamantes Rojos',
    badge: 'TALENTO // SPLIT 80%',
    subtitle: 'Evaluación Artística, Cero Intermediarios y Contrato Soberano 80/10/10',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    icon: Music,
    phases: [
      { id: '01', title: '01. Curaduría Vocal', desc: 'Auditoría de repertorio, técnica de conservatorio y afinidad con el estándar S-Class.' },
      { id: '02', title: '02. Estandarización Rider', desc: 'Inclusión de microfonía Shure Beta, in-ears inalámbricos y trajes de gran gala.' },
      { id: '03', title: '03. Soberanía del Split', desc: 'El artista retiene el 80% íntegro de cada caché, liquidado directamente tras la actuación.' }
    ],
    primaryCta: { label: 'Conocer a Edwin Agudelo (Paciente Cero)', href: '/artistas/edwin-agudelo' },
    secondaryCta: { label: 'Explorar Catálogo de Artistas', href: '/artistas' },
    specs: [
      { label: 'Split Artista', value: '80% Neto' },
      { label: 'Tarifa Solista', value: 'Desde 350 €' },
      { label: 'Tarifa Ensamble', value: 'Desde 750 €' },
      { label: 'Impacto Social', value: '10% VIMUME' }
    ]
  },
  BBQ: {
    title: 'Live Fire & Gastronomía de Brasas',
    badge: 'SHOWCOOKING // FUEGO VIVO',
    subtitle: 'Ritual Ibérico, Asado Argentino, Ancestral a la Cruz y Ahumados Low & Slow',
    accentColor: '#ff5533',
    glowColor: 'rgba(255, 85, 51, 0.35)',
    icon: Flame,
    phases: [
      { id: '01', title: '01. Selección de Cortes', desc: 'Secreto, pluma y presa ibérica de bellota, costillares Angus y corderos lechales D.O.' },
      { id: '02', title: '02. Fuego en Directo', desc: 'Estaciones móviles con leña de encina, carbón de quebracho y maestros parrilleros titulados.' },
      { id: '03', title: '03. Servicio Integral', desc: 'Registro sanitario RGEAA, pan rústico de masa madre, guarniciones al rescoldo y sonido Bose.' }
    ],
    primaryCta: { label: 'Cotizar Menú de Brasas', href: '/proveedores?cat=catering' },
    secondaryCta: { label: 'Consultar Fechas Disponibles', href: '/contacto' },
    specs: [
      { label: 'Capacidad', value: 'Desde 30 a 600 PAX' },
      { label: 'Registro Sanitario', value: 'RGEAA Homologado' },
      { label: 'Tarifa Base', value: 'Desde 45 €/pax' },
      { label: 'Sonido Cóctel', value: 'Bose F1 Cortesía' }
    ]
  }
};

export const InstantNeuralTunnelModal: React.FC<InstantNeuralTunnelModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialEventName
}) => {
  // ESC listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const data = PROFILE_DATA[profile] || PROFILE_DATA.CLIENT;
  const Icon = data.icon;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
        onClick={onClose}
      >
        {/* Glow ambient background */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ backgroundColor: data.glowColor }}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#0b0b12] border rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden my-auto"
          style={{ borderColor: `${data.accentColor}60` }}
        >
          {/* Top Bar with Badge & Close Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div 
                className="p-2 rounded-xl border"
                style={{ 
                  backgroundColor: `${data.accentColor}15`, 
                  borderColor: `${data.accentColor}40`,
                  color: data.accentColor 
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <span 
                  className="text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                  style={{ 
                    backgroundColor: `${data.accentColor}10`, 
                    borderColor: `${data.accentColor}30`,
                    color: data.accentColor 
                  }}
                >
                  {data.badge}
                </span>
                <span className="text-[10px] font-mono text-white/40 ml-2">
                  TÚNEL NEURAL INMEDIATO
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all"
              title="Cerrar Túnel Neural (ESC)"
            >
              <X size={16} />
            </button>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-1.5 mb-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne tracking-tight">
              {data.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          {/* 3 Technical Phases of the Neural Tunnel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {data.phases.map((phase) => (
              <div 
                key={phase.id}
                className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5"
              >
                <span 
                  className="text-xs font-mono font-bold uppercase block"
                  style={{ color: data.accentColor }}
                >
                  {phase.title}
                </span>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Key Specs Pill Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#12121e] p-3 rounded-2xl border border-white/10 mb-6">
            {data.specs.map((spec, sIdx) => (
              <div key={sIdx} className="space-y-0.5">
                <span className="text-[8px] font-mono text-white/40 uppercase block truncate">{spec.label}</span>
                <span className="text-xs font-mono font-bold text-white block truncate" style={{ color: data.accentColor }}>
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Dual Action Buttons: Instant Flow & WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={data.primaryCta.href}
              onClick={onClose}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl font-mono font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 shadow-xl text-black"
              style={{ backgroundColor: data.accentColor }}
            >
              <span>{data.primaryCta.label}</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href={data.secondaryCta.href}
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-all"
            >
              <span>{data.secondaryCta.label}</span>
            </Link>

            <a
              href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20deseo%20activar%20el%20servicio%20de%20${encodeURIComponent(data.title)}.`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              title="Hablar con la Centralita (+34 693 693 048)"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

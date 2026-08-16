'use client';

/**
 * CINEMATIC TUNNEL IGNITION — Gateway Soberano (S-Class)
 * 
 * Componente inline que se monta en la Home cuando el usuario
 * pulsa una de las 4 tarjetas del Gateway. Despliega una atmósfera
 * cinemática con físicas de muelle (spring physics), resplandor
 * dinámico por perfil y fases reactivas al scroll.
 * 
 * Perfiles: ARTIST | B2G | PARTNER | CLIENT
 */

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  Mic2, Building2, Boxes, Heart,
  ArrowRight, ShieldCheck, FileText, Brain,
  Sparkles, Music, Zap, Users, X
} from 'lucide-react';

export type ProfileContext = 'ARTIST' | 'B2G' | 'PARTNER' | 'CLIENT';

interface CinematicTunnelIgnitionProps {
  profileContext: ProfileContext;
  onClose: () => void;
}

/* ── Profile Configuration Map ─────────────────────────────── */

const PROFILE_CONFIG: Record<ProfileContext, {
  title: string;
  subtitle: string;
  glowFrom: string;
  glowVia: string;
  glowTo: string;
  accentColor: string;
  borderColor: string;
  icon: React.ElementType;
  phases: { id: string; label: string; desc: string }[];
  optionA: { label: string; desc: string; href: string };
  optionB: { label: string; desc: string; href: string };
}> = {
  ARTIST: {
    title: 'Túnel de Curaduría & Escenario',
    subtitle: 'The Signal: Evaluación de Diamantes Rojos con split soberano 80/10/10',
    glowFrom: 'rgba(168, 85, 247, 0.08)',
    glowVia: 'rgba(168, 85, 247, 0.25)',
    glowTo: 'rgba(168, 85, 247, 0.45)',
    accentColor: '#a855f7',
    borderColor: 'border-purple-500/30',
    icon: Mic2,
    phases: [
      { id: 'signal', label: '01. Frecuencia Roster', desc: 'Evaluación de talento artístico y técnico. Medidor de afinidad con el estándar S-Class.' },
      { id: 'rider', label: '02. Auditoría de Rider', desc: 'Especificaciones técnicas: Watts, IEM, microfonía RF, PA requerido y compatibilidad Shure Axient.' },
      { id: 'sovereignty', label: '03. Soberanía del Split', desc: 'Contrato activo bajo estructura 80/10/10. El artista retiene el 80% de cada actuación.' },
    ],
    optionA: { label: 'Formulario The Signal', desc: 'Evalúa tu talento para entrar en el roster de Diamantes Rojos.', href: '/artistas?mode=signal&role=artista' },
    optionB: { label: 'Paciente Cero: Edwin Agudelo', desc: 'Benchmark de excelencia artística y técnica.', href: '/artistas/edwin-agudelo' },
  },
  B2G: {
    title: 'Protocolo de Autoridad Pública',
    subtitle: 'Estimulación Gamma 40Hz (MIT) · Art. 118 LCSP · Fondos NextGenerationEU',
    glowFrom: 'rgba(59, 130, 246, 0.08)',
    glowVia: 'rgba(59, 130, 246, 0.25)',
    glowTo: 'rgba(59, 130, 246, 0.45)',
    accentColor: '#3b82f6',
    borderColor: 'border-blue-500/30',
    icon: Building2,
    phases: [
      { id: 'clinical', label: '01. Autoridad Clínica', desc: 'Protocolo validado de neuroestimulación Gamma 40Hz basado en investigación MIT para reactivación cognitiva.' },
      { id: 'compliance', label: '02. Cumplimiento Municipal', desc: 'Generación automática de memorias técnicas y administrativas bajo Art. 118 LCSP (<15.000 €).' },
      { id: 'funding', label: '03. Fondos Europeos', desc: 'Alineación con ODS 2030 y NextGenerationEU para pilotos en residencias y centros de día.' },
    ],
    optionA: { label: 'Generar Pliego B2G', desc: 'Memoria técnica lista para aprobación en pleno municipal.', href: '/vimume/clinica?mode=b2g&role=institucion' },
    optionB: { label: 'Evidencia Clínica 40Hz', desc: 'Casos de estudio y protocolo de estimulación Gamma.', href: '/vimume' },
  },
  PARTNER: {
    title: 'Verificación de Infraestructura',
    subtitle: 'Red de 22.471 activos indexados · Verificación ZK · Catálogo S-Class',
    glowFrom: 'rgba(16, 185, 129, 0.08)',
    glowVia: 'rgba(16, 185, 129, 0.25)',
    glowTo: 'rgba(16, 185, 129, 0.45)',
    accentColor: '#10b981',
    borderColor: 'border-emerald-500/30',
    icon: Boxes,
    phases: [
      { id: 'network', label: '01. Mapa de Red', desc: 'Visualización de los 22.471 proveedores indexados en España con afinidad técnica y geolocalización.' },
      { id: 'verification', label: '02. Verificación ZK', desc: 'Protocolo de reclamación de ficha con prueba de conocimiento cero y validación documental.' },
      { id: 'monetization', label: '03. Monetización', desc: 'Integración en el catálogo de alquiler de equipos, logística y split de producción técnica.' },
    ],
    optionA: { label: 'Explorar Catálogo S-Class', desc: 'Navega la red logística de producción con matching por afinidad.', href: '/servicios?mode=dynamic&role=proveedor' },
    optionB: { label: 'Reclamar mi Ficha', desc: '¿Eres uno de los 22.471 perfiles? Reclama tu negocio en 1 clic.', href: '/reclamar-perfil' },
  },
  CLIENT: {
    title: 'Arquitectura de Experiencia Bespoke',
    subtitle: 'Cálculo acústico 12 W/pax · Haversine KM · Price-Lock SHA-256 (72h)',
    glowFrom: 'rgba(236, 182, 19, 0.08)',
    glowVia: 'rgba(236, 182, 19, 0.25)',
    glowTo: 'rgba(236, 182, 19, 0.45)',
    accentColor: '#ecb613',
    borderColor: 'border-[#ecb613]/30',
    icon: Heart,
    phases: [
      { id: 'intention', label: '01. Intención', desc: 'Captura de mapa de calor emocional: atmosferas de gala, fiesta rompedora o íntimo acústico.' },
      { id: 'engineering', label: '02. Ingeniería', desc: 'Cálculo de potencia acústica (12 W/pax), radio de cobertura Haversine y rider técnico automático.' },
      { id: 'sovereignty', label: '03. Soberanía', desc: 'Price-Lock 72h SHA-256 con depósito de 10 € en Stripe. Presupuesto inmutable y trazable.' },
    ],
    optionA: { label: 'Cotización Bespoke', desc: 'Diseña tu experiencia de gala con presupuesto exacto.', href: '/cotizador?mode=bespoke&role=cliente' },
    optionB: { label: 'Producción B2B / Técnica', desc: 'Line Array, ArtNet DMX y rider profesional completo.', href: '/cotizador' },
  },
};

/* ── Component ──────────────────────────────────────────── */

export const CinematicTunnelIgnition: React.FC<CinematicTunnelIgnitionProps> = ({ profileContext, onClose }) => {
  const config = PROFILE_CONFIG[profileContext];
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const ambientGlow = useTransform(smoothProgress, [0, 0.5, 1], [config.glowFrom, config.glowVia, config.glowTo]);
  const scaleFactor = useTransform(smoothProgress, [0, 0.3, 0.7], [0.97, 1, 1.01]);
  const phaseOpacity1 = useTransform(smoothProgress, [0, 0.15, 0.3], [0.3, 1, 1]);
  const phaseOpacity2 = useTransform(smoothProgress, [0.15, 0.35, 0.5], [0.3, 1, 1]);
  const phaseOpacity3 = useTransform(smoothProgress, [0.35, 0.55, 0.7], [0.3, 1, 1]);
  const phaseOpacities = [phaseOpacity1, phaseOpacity2, phaseOpacity3];

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [profileContext]);

  const IconComponent = config.icon;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <motion.div style={{ scale: scaleFactor }} className="relative min-h-[140vh] bg-black border-t border-white/10 rounded-[3rem] overflow-hidden">
        
        {/* Dynamic Ambient Glow */}
        <motion.div style={{ backgroundColor: ambientGlow }} className="absolute inset-0 blur-[180px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
          aria-label="Cerrar túnel"
        >
          <X size={20} />
        </button>

        <div className="sticky top-24 max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-32 space-y-16 relative z-10">
          
          {/* ── Cinematic Header ─────────────────────────────── */}
          <div className="text-center space-y-5">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border mx-auto"
              style={{ borderColor: `${config.accentColor}40`, backgroundColor: `${config.accentColor}15` }}
            >
              <IconComponent size={28} style={{ color: config.accentColor }} />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono tracking-[0.3em] uppercase mx-auto w-fit"
              style={{ color: config.accentColor }}
            >
              Nivel Táctico: {profileContext}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]"
            >
              {config.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-white/50 text-sm md:text-base max-w-2xl mx-auto font-light"
            >
              {config.subtitle}
            </motion.p>
          </div>

          {/* ── Tunnel Phases (Scroll-Reactive) ─────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.phases.map((phase, i) => (
              <motion.div
                key={phase.id}
                style={{ opacity: phaseOpacities[i] }}
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7 + i * 0.15, duration: 0.6 }}
                className={`p-7 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-opacity-60 transition-colors`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono"
                    style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: config.accentColor }}>
                    {phase.label}
                  </h3>
                </div>
                <p className="text-white/60 text-sm font-light leading-relaxed">{phase.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Bifurcation Options (A / B) ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="space-y-5"
          >
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                Bifurcación de Intención
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A */}
              <Link
                href={config.optionA.href}
                className="group p-6 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] pointer-events-none"
                  style={{ backgroundColor: `${config.accentColor}15` }}
                />
                <div className="relative z-10 space-y-3">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Opción A</span>
                  <h4 className="text-lg font-black uppercase tracking-tight text-white">{config.optionA.label}</h4>
                  <p className="text-white/50 text-xs leading-relaxed">{config.optionA.desc}</p>
                  <div className="flex items-center gap-2 pt-2" style={{ color: config.accentColor }}>
                    <span className="text-xs font-black uppercase tracking-wider">Iniciar →</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>

              {/* Option B */}
              <Link
                href={config.optionB.href}
                className="group p-6 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] pointer-events-none"
                  style={{ backgroundColor: `${config.accentColor}10` }}
                />
                <div className="relative z-10 space-y-3">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Opción B</span>
                  <h4 className="text-lg font-black uppercase tracking-tight text-white">{config.optionB.label}</h4>
                  <p className="text-white/50 text-xs leading-relaxed">{config.optionB.desc}</p>
                  <div className="flex items-center gap-2 pt-2 text-white/60 group-hover:text-white transition-colors">
                    <span className="text-xs font-black uppercase tracking-wider">Explorar →</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* ── Guarantees Bar ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-8 border-t border-white/5"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/50">
              <ShieldCheck size={12} style={{ color: config.accentColor }} />
              <span>SHA-256 Price-Lock</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/50">
              <Zap size={12} style={{ color: config.accentColor }} />
              <span>12 W/pax Acústico</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/50">
              <Users size={12} style={{ color: config.accentColor }} />
              <span>22.471 Proveedores</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

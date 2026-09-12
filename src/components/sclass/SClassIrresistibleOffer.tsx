'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Gift, 
  Lock, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Clock,
  Award,
  ChevronDown
} from 'lucide-react';

export interface DeliverableItem {
  spec: string;
  detail: string;
}

export interface CoreBenefitItem {
  title: string;
  desc: string;
}

export interface BonusItem {
  title: string;
  realValue: string;
  description: string;
}

export interface ObjectionItem {
  question: string;
  answer: string;
}

export interface SClassIrresistibleOfferProps {
  // 1. Promesa Transformacional (El resultado final deseado, no el producto)
  promiseBadge?: string;
  headlinePromise: string;
  subPromise: string;

  // 2. Beneficios Centrales (Impacto y transformación)
  benefits: CoreBenefitItem[];

  // 3. Entregables Específicos & Medibles
  deliverablesBadge?: string;
  deliverablesTitle?: string;
  deliverables: DeliverableItem[];

  // 4. El Precio Anclado & Condiciones de Acceso
  priceAnchor: {
    totalValueEstimate?: string;
    finalPrice: string;
    depositAmount: string;
    periodOrFormat: string;
    legalNote?: string;
  };

  // 5. La Garantía (Riesgo Cero)
  guarantee: {
    title: string;
    description: string;
    badgeText?: string;
  };

  // 6. Bonos Exclusivos (Regalos reales que suman valor sin subir el precio)
  bonuses: BonusItem[];

  // 7. Derribo de Objeciones (FAQ de Conversión)
  objections: ObjectionItem[];

  // 8. Escasez Real & Llamada al Cierre
  scarcity: {
    urgencyBadge: string;
    limitText: string;
    ctaPrimaryText: string;
    ctaSecondaryText?: string;
    checkoutUrl: string;
    whatsappText?: string;
  };
}

export default function SClassIrresistibleOffer({
  promiseBadge = "LA FÓRMULA DE VALOR S-CLASS // AUDITORÍA DIRECTA",
  headlinePromise,
  subPromise,
  benefits,
  deliverablesBadge = "LO QUE RECIBES DE FORMA EXACTA Y MEDIBLE",
  deliverablesTitle = "Entregables de Ingeniería Sonora y Escénica",
  deliverables,
  priceAnchor,
  guarantee,
  bonuses,
  objections,
  scarcity
}: SClassIrresistibleOfferProps) {
  const [openObjection, setOpenObjection] = useState<number | null>(null);

  const toggleObjection = (idx: number) => {
    setOpenObjection(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-[#030305] text-white border-t border-b border-white/10">
      {/* Luz ambiental sutil */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#ecb613]/10 via-transparent to-transparent blur-[140px]" />

      <div className="relative mx-auto max-w-5xl space-y-16">
        
        {/* ── PASO 1: LA PROMESA TRANSFORMACIONAL (Lo que compran, no el producto) ── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/40 bg-[#ecb613]/10 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#ecb613]">
            <Sparkles size={13} />
            <span>{promiseBadge}</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            {headlinePromise}
          </h2>
          <p className="font-sans text-base sm:text-xl text-white/75 font-light leading-relaxed">
            {subPromise}
          </p>
        </div>

        {/* ── PASO 2: EL VALOR Y LOS BENEFICIOS (La transformación en acción) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div 
              key={i} 
              className="rounded-2xl border border-white/10 bg-[#09090e] p-6 space-y-3 hover:border-[#ecb613]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ecb613]/10 font-mono text-xs font-bold text-[#ecb613]">
                  0{i + 1}
                </span>
                <h3 className="font-syne text-base font-bold uppercase text-white tracking-wide">
                  {b.title}
                </h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed font-sans">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── PASO 3: ENTREGABLES EXACTOS Y MEDIBLES (Lo tangible) ── */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#0a0a12] to-[#050507] p-8 sm:p-12 space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#AAD6CD]">
              {deliverablesBadge}
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
              {deliverablesTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deliverables.map((d, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <CheckCircle2 size={20} className="text-[#ecb613] shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-white tracking-wide">{d.spec}</p>
                  <p className="text-xs text-white/60 font-sans mt-0.5 leading-relaxed">{d.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PASO 4: EL PRECIO ANCLADO (Solo aquí, después de entender el valor) ── */}
        <div className="relative rounded-3xl border-2 border-[#ecb613] bg-[#09090d] p-8 sm:p-12 shadow-[0_0_60px_rgba(236,182,19,0.12)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#ecb613] font-bold">
                Inversión Total Garantizada
              </span>
              {priceAnchor.totalValueEstimate && (
                <p className="font-mono text-xs text-white/40 line-through">
                  Valoración de Mercado Estimada: {priceAnchor.totalValueEstimate}
                </p>
              )}
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="font-syne text-5xl sm:text-6xl font-black text-white">
                  {priceAnchor.finalPrice}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                  {priceAnchor.periodOrFormat}
                </span>
              </div>
              <p className="font-mono text-xs text-[#AAD6CD]">
                Bloqueo Inmediato de Fecha con depósito de solo <strong>{priceAnchor.depositAmount}</strong>
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <a
                href={scarcity.checkoutUrl}
                className="rounded-xl bg-[#ecb613] px-8 py-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(236,182,19,0.35)] transition-all hover:scale-105 hover:bg-white flex items-center gap-3 cursor-pointer"
              >
                <Lock size={15} />
                <span>{scarcity.ctaPrimaryText}</span>
              </a>
              {priceAnchor.legalNote && (
                <span className="font-mono text-[10px] text-white/40 max-w-xs text-center md:text-right">
                  {priceAnchor.legalNote}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── PASO 5: LA GARANTÍA (Elimina el miedo a decidir) ── */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 text-[#AAD6CD]">
            <ShieldCheck size={36} />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#AAD6CD] font-bold">
              {guarantee.badgeText || "GARANTÍA SOBERANA RIESGO CERO"}
            </span>
            <h4 className="font-syne text-lg sm:text-xl font-bold uppercase text-white">
              {guarantee.title}
            </h4>
            <p className="text-sm text-white/70 leading-relaxed font-sans">
              {guarantee.description}
            </p>
          </div>
        </div>

        {/* ── PASO 6: LOS BONOS (Regalos reales que suman valor sin inflar el precio) ── */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.25em] text-[#ecb613] font-bold">
              <Gift size={14} />
              <span>Bonos de Alto Impacto Incluidos de Forma Gratuita</span>
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
              Regalos Reales para Maximizar tu Celebración
            </h3>
            <p className="text-xs text-white/50 font-mono">
              (No es relleno para justificar el número: son activos de alto valor que entregamos sin coste extra)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bonuses.map((bonus, i) => (
              <div 
                key={i} 
                className="rounded-2xl border border-white/10 bg-[#07070b] p-6 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-1 rounded-md">
                    Bono Gratuito 0{i + 1}
                  </span>
                  <span className="font-mono text-xs text-white/40 line-through">
                    Valor Real: {bonus.realValue}
                  </span>
                </div>
                <h4 className="font-syne text-lg font-bold text-white uppercase">
                  {bonus.title}
                </h4>
                <p className="text-sm text-white/70 leading-relaxed font-sans">
                  {bonus.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PASO 7: DERRIBO PREVENTIVO DE OBJECIONES (FAQ de Conversión) ── */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 font-bold">
              Claridad Absoluta
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
              Respuestas a tus Dudas Antes de Decidir
            </h3>
          </div>

          <div className="space-y-3">
            {objections.map((obj, i) => {
              const isOpen = openObjection === i;
              return (
                <div 
                  key={i} 
                  className="rounded-xl border border-white/10 bg-[#07070b] overflow-hidden"
                >
                  <button
                    onClick={() => toggleObjection(i)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-syne text-sm font-bold uppercase text-white hover:text-[#ecb613] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle size={16} className="text-[#ecb613] shrink-0" />
                      <span>{obj.question}</span>
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-white/50 transition-transform ${isOpen ? 'rotate-180 text-[#ecb613]' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5 text-xs text-white/70 leading-relaxed font-sans">
                      {obj.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PASO 8: ESCASEZ REAL Y CIERRE FINAL (Límite genuino) ── */}
        <div className="rounded-3xl border border-[#ecb613]/50 bg-gradient-to-r from-[#0d0d14] via-[#12121c] to-[#0d0d14] p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-red-400">
            <Flame size={14} className="animate-pulse" />
            <span>{scarcity.urgencyBadge}</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="font-syne text-3xl sm:text-4xl font-black uppercase text-white">
              No Fabricamos Eventos en Serie: Cada Fecha es Única
            </h3>
            <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed">
              {scarcity.limitText}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={scarcity.checkoutUrl}
              className="rounded-xl bg-[#ecb613] px-10 py-5 font-mono text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_40px_rgba(236,182,19,0.4)] transition-all hover:scale-105 hover:bg-white flex items-center gap-3 cursor-pointer"
            >
              <Lock size={16} />
              <span>{scarcity.ctaPrimaryText}</span>
            </a>
            {scarcity.whatsappText && (
              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent(scarcity.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-5 font-mono text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <span>Consultar Disponibilidad por WhatsApp</span>
                <ArrowRight size={14} />
              </a>
            )}
          </div>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
            Firma Criptográfica SHA-256 Price-Lock Activa durante 72 Horas
          </p>
        </div>

      </div>
    </section>
  );
}

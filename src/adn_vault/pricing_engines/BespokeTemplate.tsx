"use client";

import React, { Suspense } from 'react';
import { useTripwire } from '@/hooks/useTripwire';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Shield, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Trophy, 
  Music, 
  Award, 
  History, 
  Mic2, 
  Heart,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Users,
  Layers,
  Building2,
  Crown
} from 'lucide-react';
import { SublimeEventMatchmaker } from '@/app/components/SClassScreens/SublimeEventMatchmaker';
import { useSovereignContext } from '@/shared/context/SovereignContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateForProvince, getTemplateConfig } from '@/shared/utils/templateEngine';
import { generateSemanticPageData } from '@/lib/seo/semantic-engine';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { LocalBusinessSchema } from '@/app/components/seo/LocalBusinessSchema';

interface BespokeTemplateProps {
  title: string;
  description: string;
  location: string;
  serviceId: string;
  keywords: string[];
  isApex?: boolean;
}

export const BespokeTemplate: React.FC<BespokeTemplateProps> = ({
  title,
  description,
  location,
  serviceId,
  keywords,
}) => {
  const { igniteTripwire } = useTripwire();
  const { signal, isMounted } = useSovereignContext();
  const router = useRouter();
  const pathname = usePathname();
  const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);

  // Semantic & GEO Engine Generation (Unicidad Semántica >70%)
  const semanticData = generateSemanticPageData([serviceId], location);

  // Multivariate Engine Activation
  const templateId = getTemplateForProvince(location.toLowerCase());
  const config = getTemplateConfig(templateId, capitalizedLocation);

  const isWeddingPlannerIntent = serviceId.includes('wedding-planner') || serviceId.includes('colaboracion') || serviceId.includes('proveedores');

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 font-sans">
      <LocalBusinessSchema 
        city={capitalizedLocation} 
        serviceName={semanticData.title} 
        serviceDesc={semanticData.metaDescription} 
        priceRange={semanticData.priceRange}
        canonicalPath={semanticData.canonicalPath}
        faqs={semanticData.faqs}
      />
      
      {/* 2050 Hero: Minimalist & Deep */}
      <section className="relative pt-44 pb-24 px-6 md:px-12 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-gradient-to-b ${config.gradient} to-transparent blur-[120px]`} />
        </div>

        {/* AUTHORITY SEAL */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-32 right-8 z-[100] hidden lg:flex flex-col items-center gap-2"
        >
          <div className="glass-panel p-4 rounded-full border-[#ecb613]/30 bg-[#ecb613]/10 backdrop-blur-xl flex items-center justify-center relative group">
            <Trophy size={24} className="text-[#ecb613] group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -inset-2 rounded-full border border-[#ecb613]/20 animate-pulse" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ecb613]">SLA 99.9%</span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/40">Garantía Productora EAR</span>
          </div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-[#ecb613]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-[#ecb613]">
              {semanticData.searchIntent}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.9] max-w-5xl">
            {semanticData.h1}
          </h1>

          <p className="text-base md:text-xl text-slate-300 max-w-3xl leading-relaxed font-light">
            {semanticData.metaDescription}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <MapPin className="w-4 h-4 text-[#ecb613]" /> Cobertura en: {semanticData.venues.slice(0, 3).join(', ')}
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-xl">
              Rango Tarifario: {semanticData.priceRange} (Garantía 0.50 €)
            </div>
            {isWeddingPlannerIntent && (
              <div className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-4 py-2 rounded-xl">
                ★ 10% Comisión de Agencia Garantizada
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* 📊 AEO ESPECIFICACIONES TÉCNICAS */}
      <section className="px-6 md:px-12 py-10 border-b border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
          {semanticData.technicalSpecs.map((spec, i) => (
            <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">{spec.label}</span>
              <span className="text-xs md:text-sm font-bold text-[#ecb613]">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TÚNEL NEURAL SUBLIME (10 PANTALLAS + TINDER MATCH + SLIDERS CON CANDADO) */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto space-y-12">
        <SublimeEventMatchmaker initialLocation={location} />
      </section>

      {/* SECCIÓN EDITORIAL PROFUNDA (>70% UNICIDAD SEMÁNTICA) */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="bg-[#0a0a0d] border border-white/10 p-8 md:p-14 rounded-[3rem] space-y-8">
          <div className="prose prose-invert prose-yellow max-w-none text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line font-light">
            {semanticData.editorialBody}
          </div>

          {/* VENUES LOCALS DESTACADOS */}
          <div className="pt-8 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ecb613]">
              Espacios y Fincas de Referencia en {capitalizedLocation}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {semanticData.venues.map((venue, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 text-xs px-3 py-1.5 rounded-full text-slate-300 font-mono">
                  📍 {venue}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES GEO-LOCALES & SCHEMA FAQ */}
      <section className="py-20 px-6 md:px-12 bg-black/60 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" /> FAQ Oficial
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Preguntas Frecuentes en <span className="text-[#ecb613]">{capitalizedLocation}</span>
            </h2>
          </div>

          <div className="space-y-4">
            {semanticData.faqs.map((faq, i) => (
              <div 
                key={i}
                className="bg-[#0a0a0d] border border-white/10 p-6 md:p-8 rounded-2xl space-y-3"
              >
                <h4 className="text-base font-bold text-white flex items-start gap-3">
                  <span className="text-[#ecb613] font-mono">0{i+1}.</span> {faq.q}
                </h4>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIMUME SOCIAL ANCHOR */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-transparent to-pink-950/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <Heart className="text-pink-500" size={20} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400">Impacto Social S-Class</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Tu evento en {capitalizedLocation} financia la memoria
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
              A través de nuestro Split Soberano (80/10/10), el 10% de cada contratación en {capitalizedLocation} se transfiere automáticamente a sesiones de neuro-reminiscencia musical para mayores y residencias de la región.
            </p>
          </div>
          <Link 
            href={ROUTES.vimume} 
            className="px-8 py-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold uppercase text-xs tracking-widest transition-all"
          >
            Conoce el Programa VIMUME →
          </Link>
        </div>
      </section>

    </div>
  );
};

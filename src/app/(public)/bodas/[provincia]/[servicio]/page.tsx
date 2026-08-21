import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Volume2, 
  Crown, 
  ArrowRight, 
  Calendar, 
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';
import { CENTRALITA } from '@/lib/phone-constants';
import ThermodynamicNeuralTunnel from '@/features/bodas/ui/ThermodynamicNeuralTunnel';

interface Props {
  params: Promise<{
    provincia: string;
    servicio: string;
  }> | {
    provincia: string;
    servicio: string;
  };
}

function formatSlug(str?: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const provFormatted = formatSlug(resolvedParams?.provincia || 'Madrid');
  const servFormatted = formatSlug(resolvedParams?.servicio || 'Servicio de Boda');

  return {
    title: `${servFormatted} para Bodas en ${provFormatted} | Cotización S-Class`,
    description: `¿Buscando ${servFormatted} en ${provFormatted}? Evita 400 opciones y sobrecostes de directorios pasivos. Motor de inteligencia para bodas con presupuesto cerrado y garantía técnica.`,
    alternates: {
      canonical: `https://www.productoraear.com/bodas/${resolvedParams?.provincia || 'madrid'}/${resolvedParams?.servicio || 'dj-eventos'}`,
    }
  };
}

export default async function ProgrammaticWeddingPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const provincia = resolvedParams?.provincia || 'madrid';
  const servicio = resolvedParams?.servicio || 'dj-eventos';

  const provFormatted = formatSlug(provincia) || 'Madrid';
  const servFormatted = formatSlug(servicio) || 'Música y Producción';

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-8 font-sans selection:bg-[#ecb613]/30">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-[#ecb613]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* 1. BREADCRUMBS SOBERANOS */}
        <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-white transition-colors">EAR OS</Link>
          <span>/</span>
          <Link href="/bodas" className="hover:text-white transition-colors">Bodas</Link>
          <span>/</span>
          <span className="text-white/60">{provFormatted}</span>
          <span>/</span>
          <span className="text-[#ecb613]">{servFormatted}</span>
        </nav>

        {/* 2. HERO ANCHOR: LA TRAMPA DEL CEREBRO PEREZOSO */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-2">
          
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase font-mono">
            <MapPin size={14} className="text-[#ecb613]" />
            <span>Cobertura Oficial en {provFormatted} // S-Class Node</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
            {servFormatted} en <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
              {provFormatted}
            </span>
          </h1>

          {/* Anchor Hook Copy */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 text-left space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ecb613] uppercase tracking-wider">
              <AlertCircle size={16} />
              <span>Análisis de Mercado & Desmitificación de Directorios</span>
            </div>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              ¿Buscando {servFormatted.toLowerCase()} en {provFormatted}? <strong>Bodas.net te dará 400 opciones y un dolor de cabeza</strong>. Nuestro Motor de Inteligencia ha analizado los precios y resultados de 1.200 bodas en la provincia. Diseña tu experiencia a continuación y te daremos la propuesta exacta y a quién contratar con garantía técnica por contrato.
            </p>
          </div>

        </section>

        {/* 3. TÚNEL NEURAL TERMODINÁMICO INTEGRADO */}
        <section className="pt-2">
          <ThermodynamicNeuralTunnel 
            initialProvince={provFormatted} 
            initialService={servFormatted} 
          />
        </section>

        {/* 4. GARANTÍA OPERATIVA EN LA PROVINCIA */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
          <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/5 space-y-2">
            <ShieldCheck size={24} className="text-[#ecb613]" />
            <h4 className="font-bold text-sm text-white uppercase">Flota Local en {provFormatted}</h4>
            <p className="text-xs text-white/50 leading-relaxed">Despliegue de equipos y artistas propios sin intermediarios ni costes de agencia.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/5 space-y-2">
            <Volume2 size={24} className="text-[#ecb613]" />
            <h4 className="font-bold text-sm text-white uppercase">Presión Acústica 12 W/pax</h4>
            <p className="text-xs text-white/50 leading-relaxed">Sonido Bose F1 calibrado para la acústica exacta de fincas y salones en {provFormatted}.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/5 space-y-2">
            <Crown size={24} className="text-[#ecb613]" />
            <h4 className="font-bold text-sm text-white uppercase">Garantía por Escrito</h4>
            <p className="text-xs text-white/50 leading-relaxed">Contrato mercantil formal, seguro de 1M€ y soporte técnico in situ.</p>
          </div>
        </section>

      </div>
    </main>
  );
}

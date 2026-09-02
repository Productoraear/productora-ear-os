import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  HeartPulse, Sparkles, Brain, Activity, ShieldCheck, 
  Users, Building2, Calendar, ArrowRight, CheckCircle2, 
  Phone, FileText, Award, Heart
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'Proyecto VIMUME · Estimulación Neuroacústica 40Hz & Bienestar Cognitivo | Productora EAR',
  description: 'Protocolo de neuroestimulación acústica a 40Hz para personas mayores y centros residenciales. Alianzas ODS, sistema para terapeutas y familiares.',
  alternates: {
    canonical: 'https://www.productoraear.com/vimume',
  },
  openGraph: {
    title: 'Proyecto VIMUME · Neuroestimulación Acústica 40Hz · Productora EAR',
    description: 'Protocolo clínico y social para la estimulación de la memoria y el envejecimiento activo.',
    url: 'https://www.productoraear.com/vimume',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website'
  }
};

const VIMUME_PILLARS = [
  {
    icon: Brain,
    title: 'Estimulación a 40Hz Gamma',
    badge: 'EVIDENCIA NEUROLÓGICA',
    description: 'Frecuencia acústica modulada que estimula la sincronización neuronal, mejorando el estado anímico, la atención y la activación de recuerdos en personas con deterioro cognitivo y Alzheimer.'
  },
  {
    icon: Heart,
    title: 'Reconexión Familiar Biográfica',
    badge: 'IMPACTO EMOCIONAL',
    description: 'Protocolo de memoria musical personalizada con las canciones que marcaron la vida de nuestros mayores. Fomenta la comunicación y reduce los episodios de ansiedad o apatía.'
  },
  {
    icon: Building2,
    title: 'Red de Residencias & Centros de Día',
    badge: 'SECTOR GERIÁTRICO',
    description: 'Implantación del protocolo en centros de mayores y residencias de la Comunidad de Madrid y Castilla-La Mancha, con registro de sesiones para terapeutas ocupacionales.'
  },
  {
    icon: ShieldCheck,
    title: 'Contratación Pública ODS 2030',
    badge: 'B2G INSTITUCIONAL',
    description: 'Adaptado a la Ley de Contratos del Sector Público (Art. 118 LCSP) para ayuntamientos y diputaciones comprometidos con las políticas de envejecimiento activo y bienestar.'
  }
];

const KNOWLEDGE_HUBS = [
  {
    title: 'Musicoterapia & Alzheimer',
    slug: 'musicoterapia-alzheimer',
    desc: 'Bases neurofisiológicas de la música en la reactivación sináptica.'
  },
  {
    title: 'Terapia Ocupacional en Residencias',
    slug: 'terapia-ocupacional',
    desc: 'Guías de aplicación práctica para terapeutas y psicogerontólogos.'
  },
  {
    title: 'Envejecimiento Activo & Soledad No Deseada',
    slug: 'envejecimiento-activo',
    desc: 'Estrategias comunitarias para fortalecer la salud emocional en mayores.'
  },
  {
    title: 'Agenda 2030 & ODS de Salud',
    slug: 'agenda-2030-ods',
    desc: 'Alineación institucional con los objetivos de desarrollo sostenible.'
  }
];

export default function MasterVimumePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-cyan-500 selection:text-black">
      {/* ── HERO BANNER S-CLASS ── */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-6">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Proyecto VIMUME · Medicina Acústica & Dignidad</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase font-serif max-w-4xl mx-auto leading-tight">
          Estimulación Neuroacústica a 40Hz para <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-200 to-emerald-400">Nuestros Mayores</span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
          Un puente sonoro entre la ciencia neurológica y la emoción humana. Desarrollamos intervenciones acústicas calibradas para despertar recuerdos, aliviar la soledad y dignificar el cuidado en residencias.
        </p>

        {/* Métricas clave */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-cyan-400 font-mono">40 Hz</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Frecuencia Gamma</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-emerald-400 font-mono">&lt; 75 dB</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Confort Geriátrico</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-purple-400 font-mono">Art. 118</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Contrato Menor LCSP</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-amber-400 font-mono">ODS 3 & 10</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Agenda 2030</div>
          </div>
        </div>
      </section>

      {/* ── LOS 4 PILARES DEL PROYECTO ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif uppercase tracking-wide">
            Arquitectura del Protocolo VIMUME
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Metodología interdisciplinar validada para residencias, terapeutas y administraciones públicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIMUME_PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl p-6 flex flex-col justify-between bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/50 transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    {p.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif mt-2 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PILOTO NAVALCARNERO & MUNICIPIOS ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-500/10 via-zinc-900 to-black border border-cyan-500/30 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold uppercase mb-4">
                <span>Dossier de Impacto Municipal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif uppercase">
                Programa Piloto para Residencias y Centros de Mayores
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl">
                Diseñado para su integración directa en los planes de servicios sociales de consistorios locales (como el corredor Navalcarnero - Méntrida). Incluye memoria técnica, sesiones en directo con Edwin Agudelo y evaluación psicocognitiva.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  href="/contratacion/ayuntamientos/navalcarnero"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Ver Ficha Navalcarnero</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/contratacion/ayuntamientos/mentrida"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all border border-zinc-700"
                >
                  <span>Ver Ficha Méntrida</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
              <div className="text-xs font-mono text-zinc-500 uppercase">Gala Anual</div>
              <div className="text-lg font-bold text-white mt-1">"Nuestros Héroes"</div>
              <p className="text-xs text-zinc-400 mt-2">
                Concierto sinfónico homenaje a los mayores de las residencias participantes y sus familias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTÍCULOS & CONOCIMIENTO VIMUME ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Repositorio Científico & Divulgación
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            Documentación técnica sobre musicoterapia aplicada, gerontología y ODS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KNOWLEDGE_HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={`/vimume/conocimiento/${hub.slug}`}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all group"
            >
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors font-mono">
                {hub.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                {hub.desc}
              </p>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                <span>Leer memoria</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION RESIDENCIAS ── */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-zinc-900 to-cyan-500/10 border border-cyan-500/30">
          <h3 className="text-xl font-bold text-white font-serif mb-2">
            ¿Gestionas una Residencia o Área de Mayores?
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Solicita una sesión demostrativa sin compromiso en tu centro. Te facilitamos la memoria técnica completa y la tramitación administrativa.
          </p>
          <a
            href={CENTRALITA.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Contacto Dirección VIMUME: {CENTRALITA.display}</span>
          </a>
        </div>
      </section>
    </div>
  );
}

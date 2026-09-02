import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Heart, Sparkles, ShieldCheck, Music, Calendar, Star, 
  ArrowRight, CheckCircle2, Phone, MapPin, Sliders, Flame, Users
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import LaserTunnelFunnel from '@/components/programmatic/LaserTunnelFunnel';

export const metadata: Metadata = {
  title: 'Bodas de Gala, Música en Directo y Sonorización | Productora EAR',
  description: 'Contratación directa de músicos de conservatorio, mariachi solista, sonorización Bose F1 y catering de brasas para bodas y fincas exclusivas con Price-Lock 72h.',
  alternates: {
    canonical: 'https://www.productoraear.com/bodas',
  },
  openGraph: {
    title: 'Bodas de Gala & Eventos Nupciales S-Class · Productora EAR',
    description: 'Música en directo, sonorización de alta fidelidad y producción integral para parejas y fechas señaladas.',
    url: 'https://www.productoraear.com/bodas',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website'
  }
};

const WEDDING_PACKS = [
  {
    name: 'Ceremonia & Cóctel Acústico',
    tag: 'Esencial Elegante',
    price: 'Desde 850 €',
    features: [
      'Dúo de cuerda o solista lírico / mariachi',
      'Sonido auto-amplificado Bose 12 W/pax',
      'Microfonía inalámbrica para votos nupciales',
      'Coordinación de timing con wedding planner'
    ]
  },
  {
    name: 'Pack Integral Nupcial S-Class',
    tag: 'Recomendado',
    highlight: true,
    price: 'Desde 1.950 €',
    features: [
      'Ceremonia + Cóctel + Banquete + Fiesta',
      'Mariachi de gala con traje charro de autor',
      'Doble sistema de sonido Bose F1 & iluminación LED',
      'DJ técnico residente con control DMX',
      'Price-Lock garantizado por 72 horas'
    ]
  },
  {
    name: 'Experiencia Monumental & Showcooking',
    tag: 'Gran Gala',
    price: 'Consultar Fechas',
    features: [
      'Agrupación de Mariachi completa (6+ músicos)',
      'Escenario modular, iluminación arquitectónica y puente truss',
      'Catering de brasas y corte de jamón ibérico premium',
      'Director técnico en sala y seguro de contingencia 100%'
    ]
  }
];

const FEATURED_PROVINCES = [
  { name: 'Madrid', slug: 'madrid', venues: '240+ fincas homologadas' },
  { name: 'Toledo', slug: 'toledo', venues: '85+ cigarrales y cortijos' },
  { name: 'Guadalajara', slug: 'guadalajara', venues: '40+ palacetes y dehesas' },
  { name: 'Segovia', slug: 'segovia', venues: '35+ monasterios y castillos' },
  { name: 'Ávila', slug: 'avila', venues: '25+ haciendas de sierra' },
  { name: 'Barcelona', slug: 'barcelona', venues: '120+ masías de autor' }
];

export default function MasterBodasPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black">
      {/* ── HERO BANNER S-CLASS ── */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-6">
          <Heart className="w-3.5 h-3.5 fill-amber-400/20" />
          <span>Producción Nupcial & Fechas Señaladas</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase font-serif max-w-4xl mx-auto leading-tight">
          Música en Directo & Sonido de Alta Distinción para <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Bodas Inolvidables</span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
          Diseñamos la banda sonora de tu gran día. Músicos de conservatorio, solistas líricos, mariachis de gala y sonorización acústica de precisión con Price-Lock blindado por 72h.
        </p>

        {/* Métricas clave */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-amber-400 font-mono">12 W/pax</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Potencia Acústica SLA</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-emerald-400 font-mono">0 Fallos</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Garantía Redundante</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-purple-400 font-mono">72 Horas</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Price-Lock SHA-256</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-cyan-400 font-mono">+1.200</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Enlaces Producidos</div>
          </div>
        </div>
      </section>

      {/* ── PAQUETES NUPCIALES ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif uppercase tracking-wide">
            Formatos de Producción Nupcial
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Elige el formato idóneo para la ceremonia, el cóctel o la fiesta completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WEDDING_PACKS.map((pack, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                pack.highlight 
                  ? 'bg-gradient-to-b from-amber-500/10 via-zinc-900 to-black border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,197,56,0.15)] relative scale-[1.02]' 
                  : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {pack.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px] uppercase tracking-wider font-mono shadow-md">
                  Formato Más Solicitado
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase text-amber-400 font-semibold">{pack.tag}</span>
                  <span className="text-sm font-bold text-white font-mono">{pack.price}</span>
                </div>

                <h3 className="text-xl font-bold text-white font-serif mb-4">{pack.name}</h3>

                <ul className="space-y-3 mb-8">
                  {pack.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#cotizador"
                className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  pack.highlight
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                <span>Configurar Presupuesto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── TÚNEL DE COTIZACIÓN PROGRAMÁTICO ── */}
      <section id="cotizador" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono uppercase mb-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Configurador en Tiempo Real</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif uppercase">
            Túnel de Cotización <span className="text-amber-400">Price-Lock 72h</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Selecciona tu provincia, número de invitados y tipo de evento para obtener una tarifa cerrada al instante.
          </p>
        </div>

        <div className="p-4 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 shadow-2xl backdrop-blur-xl">
          <LaserTunnelFunnel defaultProvincia="madrid" />
        </div>
      </section>

      {/* ── COBERTURA PROVINCIAL DIRECTA ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Cobertura Provincial Directa Sin Intermediarios
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            Operamos con flota técnica propia y homologación en las mejores fincas de España.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FEATURED_PROVINCES.map((p) => (
            <Link
              key={p.slug}
              href={`/bodas/${p.slug}`}
              className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-900 transition-all text-center group"
            >
              <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-mono">
                {p.name}
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 truncate">
                {p.venues}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER CALLOUT ── */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/10 border border-amber-500/30">
          <h3 className="text-xl font-bold text-white font-serif mb-2">
            ¿Tienes una fecha señalada especial?
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Serenatas sorpresa a domicilio, aniversarios íntimos, pedidas de mano con mariachi o bodas de plata. Llámanos a nuestra centralita directa.
          </p>
          <a
            href={CENTRALITA.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Centralita Nupcial: {CENTRALITA.display}</span>
          </a>
        </div>
      </section>
    </div>
  );
}

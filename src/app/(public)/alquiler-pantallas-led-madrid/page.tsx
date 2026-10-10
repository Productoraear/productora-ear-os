import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  MapPin,
  Phone,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Layers,
  Cpu,
  Zap,
  Award,
  Tv,
  ArrowRight,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

const SITE_URL = 'https://productoraear.com';
const PAGE_PATH = '/alquiler-pantallas-led-madrid';
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;
const BRAND_NAME = 'Productora EAR — Producciones y Sonorización';

export const metadata: Metadata = {
  title: 'Alquiler de Pantallas LED en Madrid y Toledo | Productora EAR',
  description:
    'Alquiler de pantallas LED modulares P2.9 y P3.9 para bodas, conciertos y eventos corporativos en Madrid. Montaje técnico, seguro de RC y operador de vídeo en vivo. Desde 2x1m hasta 6x3m.',
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: 'Alquiler de Pantallas LED en Madrid | Productora EAR',
    description:
      'Pantallas LED modulares P2.9 y P3.9 con procesadores Novastar y sonorización Bose F1 para eventos en Madrid y Toledo.',
    url: CANONICAL_URL,
    type: 'website',
    siteName: BRAND_NAME,
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alquiler de Pantallas LED en Madrid | Productora EAR',
    description:
      'Pantallas LED modulares P2.9 y P3.9 con procesadores Novastar y sonorización Bose F1 para eventos en Madrid y Toledo.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface JsonLdOffer {
  '@type': 'Offer';
  price: string;
  priceCurrency: string;
  availability: string;
  url: string;
  areaServed: string[];
  seller: {
    '@type': 'LocalBusiness';
    name: string;
    telephone: string;
    address: {
      '@type': 'PostalAddress';
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
    };
  };
}

interface JsonLdProduct {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: JsonLdOffer;
}

const jsonLd: JsonLdProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Alquiler de Pantallas LED para Eventos en Madrid',
  description:
    'Servicio integral de alquiler y montaje de pantallas LED modulares P2.9 y P3.9 para galas, bodas y eventos institucionales.',
  brand: {
    '@type': 'Brand',
    name: BRAND_NAME,
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: CANONICAL_URL,
    areaServed: ['Madrid', 'Toledo', 'Castilla-La Mancha', 'Comunidad de Madrid'],
    seller: {
      '@type': 'LocalBusiness',
      name: BRAND_NAME,
      telephone: `+${CENTRALITA_EAR_OS}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Méntrida',
        addressRegion: 'Toledo / Madrid',
        addressCountry: 'ES',
      },
    },
  },
};

interface SpecItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TrustBadge {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const specs: SpecItem[] = [
  {
    title: 'Pitch P2.9 / P3.9 Indoor & Outdoor',
    desc: 'Brillo de hasta 5.000 nits para luz solar directa y resolución 4K en interior.',
    icon: Tv,
  },
  {
    title: 'Estructura Modular Rápida',
    desc: 'Configuración desde 2x1m hasta formatos de 6x3m con ensamblaje en menos de 90 minutos.',
    icon: Layers,
  },
  {
    title: 'Técnico de Vídeo & Sonido Incluido',
    desc: 'Operador cualificado durante todo el evento para sincronización de contenido.',
    icon: Cpu,
  },
  {
    title: 'Cobertura & Logística Inmediata',
    desc: 'Despacho directo desde el Hub Central en Méntrida a cualquier punto de Madrid.',
    icon: Zap,
  },
];

const trustBadges: TrustBadge[] = [
  { label: 'Seguro RC Profesional', icon: ShieldCheck },
  { label: 'Procesadores Novastar', icon: Award },
  { label: 'Sonorización Bose F1', icon: Sparkles },
];

export default function AlquilerPantallasLedMadridPage() {
  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS}?text=Hola%20Edwin,%20deseo%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20pantallas%20LED%20en%20Madrid`;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section S-Class */}
        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 md:p-12 relative overflow-hidden shadow-2xl hover:border-[#ecb613]/40 transition-colors duration-500">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#258DCD]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3.5 py-1 bg-[#258DCD]/15 text-[#258DCD] border border-[#258DCD]/40 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Cobertura Integral Madrid & Toledo
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif leading-tight">
              Alquiler de Pantallas LED Gigantes para Bodas y Eventos en Madrid
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Pantallas modulares P2.9 y P3.9 con procesadores Novastar, montaje certificado y operadores de vídeo en vivo. Configuración desde 2x1m hasta 6x3m, con brillo de hasta 5.000 nits para interior y exterior.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1.5 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-wider">
                Tarifa Solista desde {TARIFA_BASE_SOLISTA_EUR} €
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
                Reserva con {DEPOSITO_STRIPE_EUR} €
              </span>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/reservar/solista"
                className="group relative py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-sm tracking-wide transition-all duration-300 shadow-[0_10px_30px_rgba(236,182,19,0.3)] hover:shadow-[0_14px_40px_rgba(236,182,19,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
              >
                <CreditCard className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Reservar Tarifa Solista {TARIFA_BASE_SOLISTA_EUR} €</span>
                <ArrowRight className="w-4 h-4 -ml-1 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-0" />
              </Link>
              <Link
                href="/alquiler"
                className="group py-3.5 px-6 rounded-xl bg-[#121218] hover:bg-[#1a1a24] border border-white/15 hover:border-[#ecb613]/40 text-white font-medium text-sm flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
              >
                <Layers className="w-4 h-4 text-[#ecb613] transition-transform duration-300 group-hover:rotate-6" />
                <span>Ver Packs de Inventario</span>
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group py-3.5 px-6 rounded-xl bg-[#121218] hover:bg-[#1a1a24] border border-white/15 hover:border-emerald-500/40 text-white font-medium text-sm flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
              >
                <Phone className="w-4 h-4 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                <span>WhatsApp Directo (+34 {CENTRALITA_EAR_OS})</span>
              </a>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 flex items-center gap-3 hover:border-[#ecb613]/40 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(236,182,19,0.08)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#ecb613]/20 group-hover:scale-105">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-white">{badge.label}</span>
              </div>
            );
          })}
        </section>

        {/* Especificaciones Técnicas */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">
              Rider Audiovisual Homologado
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">
              Tecnología de Pantalla & Procesamiento Profesional
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specs.map((spec) => (
              <div
                key={spec.title}
                className="group p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-2 hover:border-[#ecb613]/40 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(236,182,19,0.1)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-[#ecb613]/20 group-hover:scale-105 group-hover:rotate-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{spec.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Banner de Integración con el Repertorio de Edwin Agudelo */}
        <section className="p-8 rounded-3xl bg-[#09090d]/80 border border-[#ecb613]/30 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-[#ecb613]/60 hover:shadow-[0_14px_40px_rgba(236,182,19,0.12)] transition-all duration-500">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white font-serif">
              ¿Deseas combinar Pantallas LED con Música en Vivo?
            </h3>
            <p className="text-xs text-gray-400">
              Añade a Edwin Agudelo Solista ({TARIFA_BASE_SOLISTA_EUR} €) o Gran Ensamble Imperial para una puesta en escena completa con sonorización Bose F1.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center shrink-0">
            <Link
              href="/reservar/solista"
              className="group py-3 px-6 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] hover:shadow-[0_10px_30px_rgba(236,182,19,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span>Reservar Solista</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/checkout"
              className="group py-3 px-6 rounded-xl bg-[#121218] hover:bg-[#1a1a24] border border-white/15 hover:border-[#ecb613]/40 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span>Ir al Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
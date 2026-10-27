import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import {
  Sparkles, ShieldCheck, Zap, Music,
  PhoneCall, MessageCircle, ArrowRight,
  Heart, Users, CheckCircle2, Lock
} from 'lucide-react';
import MariachiDispatchConsole from '@/components/mariachi/MariachiDispatchConsole';
import MariachiEscaparateEdwin from '@/components/mariachi/MariachiEscaparateEdwin';
import MariachiPricingPacks from '@/components/mariachi/MariachiPricingPacks';
import MariachiEventTypes from '@/components/mariachi/MariachiEventTypes';
import MariachiGeoCoverage from '@/components/mariachi/MariachiGeoCoverage';
import MariachiFaqSection from '@/components/mariachi/MariachiFaqSection';
import { MARIACHI_FAQS } from '@/lib/constants/mariachi-faqs';
import MariachiB2GProduction from '@/components/mariachi/MariachiB2GProduction';
import MariachiCulturalDiplomacy from '@/components/mariachi/MariachiCulturalDiplomacy';
import MariachiCentralita from '@/components/mariachi/MariachiCentralita';
import MariachiLandingDirectory from '@/components/mariachi/MariachiLandingDirectory';
import { EdwinMariachiCulture } from '@/features/artists/ui/EdwinMariachiCulture';
import { MARIACHI_KEYWORDS_METADATA } from '@/lib/constants/mariachi-keyword-matrix';
import QuantumColibri from '@/components/brand/QuantumColibri';
import IntegrityAuditBadge from '@/components/telemetry/IntegrityAuditBadge';
import ThemeToggle from '@/components/layout/ThemeToggle';

const CANONICAL_URL = 'https://productoraear.com/mariachis';

export const metadata: Metadata = {
  title: '▷ Contratar Mariachis en España | Precio Cerrado, Edwin Agudelo & Reserva Garantizada | Productora EAR',
  description: 'Mariachis profesionales en toda España con precio cerrado desde 350€. Edwin Agudelo (Mariachi Imperial) como voz de referencia, formatos desde solista hasta 8 integrantes. Reserva segura con 100€ deducibles en Stripe, logística transparente y formación adaptada al límite de ruido de cada finca.',
  keywords: [...MARIACHI_KEYWORDS_METADATA],
  alternates: {
    canonical: CANONICAL_URL
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: CANONICAL_URL,
    siteName: 'Productora EAR',
    title: '▷ Contratar Mariachis en España | Precio Cerrado y Reserva Garantizada | Productora EAR',
    description: 'La primera plataforma de contratación directa de mariachis con despacho tipo Uber, cálculo kilométrico exacto, depósito seguro en Stripe y dirección artística de Edwin Agudelo.',
    images: [
      {
        url: 'https://productoraear.com/og-mariachis.jpg',
        width: 1200,
        height: 630,
        alt: 'Mariachi Imperial de Gala Edwin Agudelo - Productora EAR'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contratar Mariachis en España | Productora EAR',
    description: 'Precio cerrado, voz de Edwin Agudelo, trajes de charro de gran gala y reserva con depósito de 100 € en Stripe.'
  }
};

export default function MariachisPage() {
  // Generación estructurada de Schema.org JSON-LD
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${CANONICAL_URL}/#website`,
        url: CANONICAL_URL,
        name: 'Mariachis en España — Productora EAR OS',
        publisher: {
          '@id': 'https://productoraear.com/#organization'
        }
      },
      {
        '@type': 'MusicGroup',
        '@id': `${CANONICAL_URL}/#mariachi-imperial`,
        name: 'Mariachi Imperial de Gala — Edwin Agudelo',
        genre: ['Mariachi', 'Ranchera', 'Bolero Ranchero', 'Música Tradicional Mexicana'],
        url: CANONICAL_URL,
        description: 'Agrupación y solista tenor de música mexicana tradicional y contemporánea de gala para bodas, serenatas y festivales.',
        founder: {
          '@type': 'Person',
          name: 'Edwin Agudelo'
        }
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://productoraear.com/#organization',
        name: 'Productora EAR OS',
        url: 'https://productoraear.com',
        telephone: '+34693693048',
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'ES',
          addressRegion: 'Toledo / Madrid'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${CANONICAL_URL}/#faq`,
        mainEntity: MARIACHI_FAQS.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };

  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
      {/* Script JSON-LD Server-Side */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* BLOQUE 1: SUBHEADER STICKY CON CAMBIO DE MODO Y ACCESOS RÁPIDOS */}
      <div className="w-full bg-[#07070b]/90 border-b border-white/10 backdrop-blur-md sticky top-0 z-40 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#ecb613]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              DESPACHO ACTIVO 24/7 EN TODA ESPAÑA
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <a href="#cotizador-uber" className="hidden md:inline text-white/70 hover:text-white transition-colors">
              Cotizador Uber &rarr;
            </a>
            <a href="#precios" className="hidden md:inline text-white/70 hover:text-white transition-colors">
              Packs &amp; Precios &rarr;
            </a>
            <a href="#artista-destacado" className="hidden lg:inline text-white/70 hover:text-white transition-colors">
              Edwin Agudelo &rarr;
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/studio/artist"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/30 text-[#ecb613] font-bold transition-all"
            >
              <Lock size={12} />
              <span>Área Privada Artistas</span>
            </Link>
            <Link
              href="/mariachis/unirse"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white transition-all hidden sm:inline-flex"
            >
              <Users size={12} className="text-[#ecb613]" />
              <span>Únete al Puente (29€/mes)</span>
            </Link>
            <a
              href="https://wa.me/34693693048?text=Hola,%20deseo%20consultar%20disponibilidad%20inmediata%20de%20mariachis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
            >
              <MessageCircle size={12} />
              <span>+34 693 693 048</span>
            </a>
          </div>
        </div>
      </div>

      {/* BLOQUE 2: HERO SECTION TRANSACCIONAL DE GALA (AWWWARDS COUTURE EDITION) */}
      <section className="relative px-6 pt-20 pb-20 md:pt-32 md:pb-32 border-b border-white/10 awwwards-mesh-gradient overflow-hidden">
        {/* Halos Orgánicos Respiratorios */}
        <div className="absolute top-0 right-0 h-[700px] w-[700px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[#ecb613]/15 blur-[200px] pointer-events-none animate-breathing-halo" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-[#00E5FF]/10 blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl text-[#ecb613] text-[11px] font-mono uppercase tracking-[0.3em] shadow-lg shadow-black/50">
              <Sparkles size={14} className="text-[#ecb613] animate-pulse" />
              <span>RED NACIONAL S-CLASS // PRECIO CERRADO &amp; RESERVA INMEDIATA</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={13} /> Fianza 100 € Stripe Price-Lock
              </span>
              <span className="text-white/40 font-mono hidden sm:inline">100% Deducible</span>
            </div>
          </div>

          <h1 className="font-syne text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.92]">
            Contrata Tu Mariachi <br />
            <span className="text-metallic-gold">
              Con Precio Cerrado
            </span> <br />
            <span className="text-white/90 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-normal">
              y Despacho Logístico Inteligente
            </span>
          </h1>

          <p className="max-w-3xl text-sm sm:text-base md:text-xl text-white/80 font-sans leading-relaxed font-light">
            Sin llamadas a ciegas ni regateos interminables. Selecciona tu formación desde solista de gala hasta ensamble monumental,
            calcula la distancia exacta en kilómetros desde la sede más cercana y asegura tu fecha en segundos con un
            <strong className="text-white font-semibold"> depósito de 100 € en Stripe</strong> (100% deducible de la liquidación final).
          </p>

          {/* Badges de Lujo Biselados (Couture Glass) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="couture-glass-card p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#ecb613] shrink-0" />
              <div>
                <span className="text-white font-bold block">Traje Gran Gala</span>
                <span className="text-white/40 text-[10px]">Botonadura plata</span>
              </div>
            </div>

            <div className="couture-glass-card p-4 rounded-2xl flex items-center gap-3">
              <Zap size={20} className="text-[#00E5FF] shrink-0" />
              <div>
                <span className="text-white font-bold block">Despacho 24/7</span>
                <span className="text-white/40 text-[10px]">WhatsApp directo</span>
              </div>
            </div>

            <div className="couture-glass-card p-4 rounded-2xl flex items-center gap-3">
              <Music size={20} className="text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-bold block">Rider Acústico</span>
                <span className="text-white/40 text-[10px]">Calibrado por finca</span>
              </div>
            </div>

            <div className="couture-glass-card p-4 rounded-2xl flex items-center gap-3">
              <Heart size={20} className="text-[#FF2B44] shrink-0" />
              <div>
                <span className="text-white font-bold block">Impacto Social</span>
                <span className="text-white/40 text-[10px]">10% Sesiones VIMUME</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#cotizador-uber"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#ecb613] via-amber-300 to-[#ecb613] hover:brightness-110 text-black font-syne text-xs uppercase font-black tracking-widest transition-all duration-300 shadow-2xl shadow-[#ecb613]/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Calcular Presupuesto Inmediato</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/34693693048?text=Hola,%20deseo%20asesoría%20personalizada%20para%20contratar%20un%20mariachi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-white/40 text-white font-syne text-xs uppercase font-bold tracking-wider transition-all duration-300 backdrop-blur-md"
            >
              <MessageCircle size={16} className="text-emerald-400" />
              <span>Asesoría Inmediata por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 🚀 MÓDULO ESTRATÉGICO: EL PUENTE SOBERANO (CLIENTES PAGAN SEGURO / ARTISTAS GESTIONAN SU CARRERA) */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-4">
        <div className="rounded-3xl border border-[#ecb613]/30 bg-gradient-to-r from-[#0d0d15] via-[#141420] to-[#0d0d15] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.25em]">
                <Sparkles size={12} />
                EL PUENTE TECNOLÓGICO Y FINANCIERO // EAR OS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-syne uppercase text-white tracking-tight leading-tight">
                El Puente de Confianza Entre <span className="text-[#ecb613]">Clientes Exigentes</span> y <span className="text-white">Artistas Profesionales</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                A diferencia de directorios anticuados que canibalizan los precios a 150€ sin fianza, en EAR OS garantizamos que <strong>los clientes reservan con depósito de 100€ deducible en Stripe</strong> y los artistas gestionan su carrera en su <strong>Área Privada con cobro del 80% neto</strong> bajo una cuota plana transparente (29€/mes o 290€/año).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[#ecb613] font-bold block uppercase text-[10px]">Para Clientes:</span>
                  <p className="text-zinc-300 text-[11px]">Reserva protegida por Stripe Escrow, artistas de gala verificados, cálculo acústico Bose F1 y cero sorpresas.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[#00E5FF] font-bold block uppercase text-[10px]">Para Músicos &amp; Mariachis:</span>
                  <p className="text-zinc-300 text-[11px]">Área Privada (`/studio/artist`), calendario ACID, contratos con seguro RC 1M€ y cobro del 80% neto directo a tu cuenta.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href="#cotizador-uber"
                className="w-full py-4 px-6 rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-black font-syne text-xs uppercase tracking-wider text-center transition-all shadow-xl shadow-[#ecb613]/20 flex items-center justify-center gap-2"
              >
                <span>Contratar Mariachi (Desde 350€)</span>
                <ArrowRight size={14} />
              </a>
              <Link
                href="/studio/artist"
                className="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold font-syne text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-2"
              >
                <Lock size={14} className="text-[#ecb613]" />
                <span>Entrar al Área Privada de Artista</span>
              </Link>
              <Link
                href="/mariachis/unirse"
                className="text-center text-[11px] font-mono text-zinc-400 hover:text-white transition pt-1"
              >
                ¿Eres Mariachi? Únete al Puente (29€/mes o 290€/año) &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 3: ESCAPARATE ARTISTA DESTACADO (EDWIN AGUDELO — MARIACHI IMPERIAL) */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <MariachiEscaparateEdwin />
      </section>

      {/* BLOQUE 4 & 5: CONSOLA DE DESPACHO UBER EN TIEMPO REAL & REPERTORIO */}
      <section id="cotizador-uber" className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
            <Zap size={14} />
            MOTOR LOGÍSTICO // DESPACHO INSTANTÁNEO
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
            Consola de Despacho &amp; Cotizador en Vivo
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-sans">
            Selecciona tu destino, personaliza las canciones del repertorio y bloquea tu fecha con garantía Stripe de 100 €.
          </p>
        </div>

        <MariachiDispatchConsole />
      </section>

      {/* BLOQUE 6: ¿QUÉ QUIERES CELEBRAR? (TIPOS DE EVENTO) */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiEventTypes />
      </section>

      {/* BLOQUE 6b: DIRECTORIO DE INTENCIONES DE BÚSQUEDA (SUB-LANDINGS pSEO) */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiLandingDirectory />
      </section>

      {/* BLOQUE 7: PACKS SINCRONIZADOS CON STRIPE & BANNER DE DIGNIFICACIÓN/AFILIADOS */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiPricingPacks />
      </section>

      {/* BLOQUE 8: CÓMO FUNCIONA EN 3 PASOS */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
            <CheckCircle2 size={14} />
            CONTRATACIÓN EN 3 PASOS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
            Cómo Contratar tu Mariachi
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-sans">
            Olvídate de formularios que tardan 48 horas en contestar. El proceso en EAR OS es directo, transparente y blindado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          <div className="p-8 rounded-3xl bg-[#060609] border border-white/10 space-y-4 relative">
            <span className="text-5xl font-black font-mono text-[#ecb613]/60">01</span>
            <h3 className="text-xl font-bold font-syne text-white">Elige Formato y Destino</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Selecciona entre solista de gala, cuarteto, ensamble imperial o sinfónico. Nuestro motor calcula la distancia exacta por GPS y te muestra el precio final cerrado.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#060609] border border-[#ecb613]/30 space-y-4 relative shadow-xl shadow-[#ecb613]/5">
            <span className="text-5xl font-black font-mono text-[#ecb613]">02</span>
            <h3 className="text-xl font-bold font-syne text-white">Bloquea con 100 € en Stripe</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              El depósito de 100 € Price-Lock bloquea de forma atómica la fecha y hora en el calendario de los músicos.
              <strong> 100% deducible</strong>: se descuenta íntegro de la liquidación final.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#060609] border border-white/10 space-y-4 relative">
            <span className="text-5xl font-black font-mono text-[#ecb613]/60">03</span>
            <h3 className="text-xl font-bold font-syne text-white">Disfruta de la Serenata</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              El grupo llega uniformado con traje de charro de gala y equipo de sonido Bose calibrado.
              Música en directo inolvidable y coordinación telefónica permanente.
            </p>
          </div>
        </div>
      </section>

      {/* BLOQUE 9: GARANTÍA BLINDADA EAR OS (ESCUDO DE VALOR) */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-[#0d0d15] via-[#09090e] to-[#0d0d15] border border-white/10 p-8 md:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase">
              <ShieldCheck size={14} />
              GARANTÍA DE CONTRATO S-CLASS
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-syne uppercase text-white">
              El Escudo de Valor de Productora EAR
            </h3>
            <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed">
              A diferencia de directorios que operan sin compromiso ni fianza, en EAR OS cada reserva cuenta con tres cerrojos inquebrantables:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <Lock size={18} className="text-[#ecb613]" />
              <h4 className="font-bold text-white uppercase font-syne">Bloqueo Atómico de Agenda</h4>
              <p className="text-white/50 font-sans leading-relaxed">
                Ningún músico duplica una fecha reservada. Nuestro motor atómico ACID bloquea la exclusividad del servicio al instante.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <h4 className="font-bold text-white uppercase font-syne">Protocolo Acústico Realista</h4>
              <p className="text-white/50 font-sans leading-relaxed">
                Pedimos el límite dBA de la finca, enviamos ficha técnica, adaptamos la formación (cuerdas o sordinas) y medimos con sonómetro en la prueba de sonido.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <Heart size={18} className="text-[#FF2B44]" />
              <h4 className="font-bold text-white uppercase font-syne">Split Soberano 80/10/10</h4>
              <p className="text-white/50 font-sans leading-relaxed">
                80% directo al artista ejecutor, 10% plataforma tecnológica y 10% financia sesiones de neuroacústica VIMUME en residencias de mayores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 10: CENTRALITA + AFILIACIÓN DE GRUPOS */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiCentralita />
      </section>

      {/* BLOQUE 10b: AYUNTAMIENTOS — PRODUCCIÓN INTEGRAL */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiB2GProduction />
      </section>

      {/* BLOQUE 10c: DIPLOMACIA CULTURAL — EMBajadas, HERMANAMIENTOS, MAYORES */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiCulturalDiplomacy />
      </section>

      {/* BLOQUE 11: COBERTURA GEO NACIONAL & 50 PROVINCIAS */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiGeoCoverage />
      </section>

      {/* BLOQUE 12: GUÍAS ESENCIALES Y CULTURA MARIACHI */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <EdwinMariachiCulture />
      </section>

      {/* BLOQUE 13: PREGUNTAS FRECUENTES */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <MariachiFaqSection />
      </section>

      {/* BLOQUE 14: CTA FINAL DE ALTA CONVERSIÓN & URGENCIA */}
      <section className="border-t border-white/10 py-20 bg-gradient-to-b from-[#050508] to-[#020204] text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
            <PhoneCall size={14} />
            COORDINACIÓN ARTÍSTICA INMEDIATA // 24 HORAS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
            ¿Tienes una Fecha Urgente o Prefieres Asesoría Directa?
          </h2>
          <p className="text-xs sm:text-base text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo de coordinación de Productora EAR atiende llamadas y WhatsApps las 24 horas para serenatas nocturnas,
            bodas y eventos en cualquier punto de España.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/34693693048?text=Hola,%20necesito%20coordinar%20un%20mariachi%20con%20urgencia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle size={16} />
              Hablar por WhatsApp (+34 693 693 048)
            </a>
            <a
              href="tel:+34693693048"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              <PhoneCall size={16} className="text-[#ecb613]" />
              Llamar a Centralita 24/7
            </a>
          </div>
        </div>
      </section>

      {/* BLOQUE 15: FICHA TÉCNICA DE INTEGRIDAD Y RENDIMIENTO (ANTIGRAVITY OMEGA) */}
      <section className="border-t border-white/5 py-8 bg-[#040406]">
        <IntegrityAuditBadge />
      </section>

      {/* GUARDIÁN VECTORIAL S-CLASS: EL COLIBRÍ CUÁNTICO */}
      <QuantumColibri primaryAccent="#ecb613" />
    </main>
  );
}
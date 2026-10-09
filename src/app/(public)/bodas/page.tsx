'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Crown,
  Music,
  Wine,
  Mic2,
  Palette,
  Disc,
  ArrowRight,
  Phone,
  Calendar,
  Star,
  Building2,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  Armchair
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import ThermodynamicNeuralTunnel from '@/features/bodas/ui/ThermodynamicNeuralTunnel';
import SmartMarketplaceNav from '@/features/marketplace/ui/SmartMarketplaceNav';
import { FramerMotionScrollCanvas } from '@/components/ui/FramerMotionScrollCanvas';
import { motion } from 'framer-motion';
import VanguardFluidBackground from '@/components/sclass/VanguardFluidBackground';
import HolographicTiltCard from '@/components/sclass/HolographicTiltCard';

// Marco cinematográfico del hero: imagen auténtica y emocional (Edwin Agudelo cantando a los novios en directo).
const HERO_WEDDING_IMAGE =
  'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg';

// Reel nupcial propio (self-hosted / CDN propio). Si está vacío, el hero usa la imagen cinematográfica con movimiento.
const WEDDING_REEL_URL = '';

interface WeddingBlock {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  ctaHref: string;
  highlightTag: string;
  imageBg: string;
}

const weddingBlocks: WeddingBlock[] = [
  {
    id: 'wedding-planners',
    title: 'Wedding Planners',
    subtitle: 'Dirección & Logística Integral 360',
    description: 'Coordinación impecable de la arquitectura técnica, escénica y emocional de vuestra gran celebración.',
    icon: <Crown className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Explorar Planners Homologados',
    ctaHref: '/proveedores?categoria=wedding-planners',
    highlightTag: 'Dirección 360',
    imageBg: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'catering-gourmet',
    title: 'Catering Gourmet',
    subtitle: 'Alta Cocina de Autor',
    description: 'Banquete inolvidable en alianza con chefs galardonados y bodegas seleccionadas.',
    icon: <Wine className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Conectar con Catering Gourmet',
    ctaHref: '/proveedores?categoria=catering',
    highlightTag: 'Experiencia Sensorial',
    imageBg: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'maestros-ceremonia',
    title: 'Maestros de Ceremonia',
    subtitle: 'Voz, Elegancia & Narrativa',
    description: 'Narrativa emotiva y dirección vocal para que vuestro "Sí, quiero" trascienda el tiempo.',
    icon: <Mic2 className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Contratar Maestro de Ceremonia',
    ctaHref: '/proveedores?categoria=maestros-de-ceremonia',
    highlightTag: 'Protocolo de Autor',
    imageBg: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'protocolo-plan-b',
    title: 'Protocolo Plan B',
    subtitle: 'Blindaje Técnico Militar',
    description: 'Sistemas de energía redundantes y equipos acústicos dobles para cero imprevistos.',
    icon: <ShieldCheck className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Activar Blindaje Redundante',
    ctaHref: '/cotizador?servicio=plan-b',
    highlightTag: 'Garantía 100%',
    imageBg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'diseno-espacios',
    title: 'Diseño de Espacios',
    subtitle: 'Arquitectura Efímera & Escenografía',
    description: 'Transformación escénica monumental de fincas, jardines y salones con iluminación de gala.',
    icon: <Palette className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Diseño y Escenografía Nupcial',
    ctaHref: '/proveedores?categoria=decoracion',
    highlightTag: 'Atmósfera Visual',
    imageBg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'dj-sound-design',
    title: 'DJ & Sound Design',
    subtitle: 'Acústica de Alta Fidelidad',
    description: 'Sistemas profesionales Bose F1 Model 812, microfonía Shure Beta 87A e iluminación robotizada.',
    icon: <Disc className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Configurar DJ & Sound Bose',
    ctaHref: '/proveedores?categoria=dj-sonido',
    highlightTag: 'Presión 12 W/pax',
    imageBg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'
  }
];

const topProvincesBanquetes = [
  { name: 'Madrid', count: '419 banquetes', slug: 'madrid' },
  { name: 'Barcelona', count: '524 banquetes', slug: 'barcelona' },
  { name: 'Valencia', count: '235 banquetes', slug: 'valencia' },
  { name: 'Sevilla', count: '237 banquetes', slug: 'sevilla' },
  { name: 'Málaga', count: '290 banquetes', slug: 'malaga' },
  { name: 'Toledo', count: '185 banquetes', slug: 'toledo' },
  { name: 'Murcia', count: '162 banquetes', slug: 'murcia' },
  { name: 'Granada', count: '126 banquetes', slug: 'granada' },
  { name: 'Zaragoza', count: '75 banquetes', slug: 'zaragoza' },
  { name: 'Alicante', count: '289 banquetes', slug: 'alicante' },
  { name: 'Córdoba', count: '108 banquetes', slug: 'cordoba' },
  { name: 'Cádiz', count: '227 banquetes', slug: 'cadiz' },
];

export default function BodasPage() {
  return (
    <main className="min-h-screen bg-[#060507] text-white pt-24 pb-20 px-4 md:px-8 font-sans selection:bg-[#ecb613]/30 overflow-x-hidden relative">

      {/* FLUIDO WEBGL S-CLASS: Shaders reactivos al cursor (Nivel Awwwards) */}
      <VanguardFluidBackground
        accentColor="#ecb613"
        accentColorSecondary="#0a0806"
        cursorReactivity={0.9}
        speed={1.1}
        opacity={0.85}
      />

      {/* Iluminación ambiental dorada champagne de gala */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1300px] h-[650px] bg-gradient-radial from-[#ecb613]/18 via-[#d4af37]/8 to-transparent blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">

        {/* 1. HERO EDITORIAL CINEMATOGRÁFICO — SPLIT LAYOUT (Nivel Awwwards) */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-4 lg:pt-6">

          {/* COLUMNA EDITORIAL: tipografía de autor, hairlines y prueba social real */}
          <div className="lg:col-span-6 text-left space-y-7">

            {/* Hairline superior con sello de autor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-4"
            >
              <span className="h-px w-12 bg-gradient-to-r from-[#ecb613] to-transparent" />
              <span className="text-[11px] font-mono font-black uppercase tracking-[0.35em] text-[#ecb613]">
                Arquitectura Nupcial de Autor · España
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[0.92]"
            >
              Bodas de{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#f5d77f] to-[#ecb613]">
                  Alta Distinción
                </span>
                <span className="absolute -bottom-2 left-0 h-[3px] w-full bg-gradient-to-r from-[#ecb613] via-[#f5d77f]/60 to-transparent" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/75 text-base sm:text-lg max-w-xl leading-relaxed"
            >
              Orquestamos los <strong className="text-white">6 pilares</strong> de una celebración legendaria —música en directo, catering de autor, escenografía monumental y blindaje técnico— con la precisión de una producción de gala y la emoción de un instante irrepetible.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={CENTRALITA.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-5 bg-gradient-to-r from-[#ecb613] via-[#f5d77f] to-[#ecb613] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_35px_rgba(236,182,19,0.4)] hover:scale-[1.03] cursor-pointer"
              >
                <Calendar size={18} />
                <span>Consultar Fecha con Asesor Nupcial</span>
              </a>

              <Link
                href="/artistas/edwin-agudelo"
                className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/15 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer backdrop-blur-xl hover:border-[#ecb613]/50"
              >
                <Music size={18} className="text-[#ecb613]" />
                <span>Show Solista Premium</span>
              </Link>
            </motion.div>

            {/* Prueba social real + sellos S-Class */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-6 border-t border-white/10"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#ecb613]">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={13} className="fill-[#ecb613]" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider">5.0 · Opiniones verificadas</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <BadgeCheck size={15} className="text-[#ecb613]" />
                <span className="text-[11px] font-mono uppercase tracking-wider">Depósito 100€ 100% deducible</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <ShieldCheck size={15} className="text-[#ecb613]" />
                <span className="text-[11px] font-mono uppercase tracking-wider">Plan B · Cero imprevistos</span>
              </div>
            </motion.div>

          </div>

          {/* COLUMNA MEDIA: marco cinematográfico retrato 4/5, sin texto encima del sujeto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Halo dorado tras el marco */}
              <div className="absolute -inset-6 bg-gradient-radial from-[#ecb613]/22 via-[#ecb613]/5 to-transparent blur-3xl pointer-events-none" />

              <div className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-[0_35px_90px_rgba(0,0,0,0.85)]">
                {WEDDING_REEL_URL ? (
                  <video
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={HERO_WEDDING_IMAGE}
                  >
                    <source src={WEDDING_REEL_URL} type="video/mp4" />
                  </video>
                ) : (
                  <motion.img
                    src={HERO_WEDDING_IMAGE}
                    alt="Edwin Agudelo cantando en directo a los novios durante su enlace"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.14 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: 'easeOut' }}
                  />
                )}

                {/* Gradientes que protegen la imagen y anclan la tipografía de las esquinas */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060507] via-[#060507]/15 to-transparent" />
                <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />

                {/* Sello dorado superior */}
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-[#ecb613]/40 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-widest">
                  <Sparkles size={12} /> Directo & Emotivo
                </div>

                {/* Caption inferior (no tapa al sujeto) */}
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">En vivo</p>
                  <p className="text-sm font-black uppercase text-white font-syne tracking-tight">
                    Edwin Agudelo · Banda sonora de vuestra boda
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </section>

        {/* 2. BUSCADOR INTELIGENTE NUPCIAL DUAL & NAVEGACIÓN S-CLASS */}
        <section className="pt-2">
          <div className="text-center mb-6 space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-[#ecb613]">
              Buscador Inteligente Nupcial
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne">
              Encuentra Servicios Homologados y Producción de Gala
            </h2>
          </div>
          <SmartMarketplaceNav />
        </section>

        {/* 2.5. HERRAMIENTAS DE BODA PRO (GESTIÓN DE MESAS S-CLASS) */}
        <section className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 rounded-3xl bg-[#0c0a0e] border border-white/10">
            <div className="md:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono">
                <Armchair size={13} /> Herramientas Pro
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                Gestiona las Mesas y los Invitados con precisión S-Class
              </h3>
              <p className="text-white/70 text-sm max-w-xl">
                Plano visual con arrastrar y soltar, auto-asignación por grupos, detección de sobrecapacidad y exportación a PDF lista para imprenta.
              </p>
            </div>
            <div className="flex md:items-end justify-start md:justify-end">
              <Link
                href="/bodas/herramientas/mesas"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-[0_10px_35px_rgba(236,182,19,0.35)]"
              >
                <Armchair size={15} />
                Abrir Gestión de Mesas
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. TÚNEL NEURAL TERMODINÁMICO (MATCHMAKING INTELIGENTE NUPCIAL) */}
        <section className="pt-2">
          <ThermodynamicNeuralTunnel
            initialProvince="Madrid"
            initialService="Producción de Boda S-Class"
          />
        </section>

        {/* 4. CANVAS FRAMER MOTION S-CLASS (ULTRA-ANIMACIÓN SCROLL 60FPS) */}
        <section>
          <FramerMotionScrollCanvas
            title="BODAS S-CLASS & MÚSICA EN VIVO"
            subtitle="Ingeniería acústica Bose F1 y producción escénica de autor para celebraciones inolvidables"
            badge="EXPERIENCIA INMERSIVA 60FPS"
            accentColor="#ecb613"
            mediaUrl="https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg"
          />
        </section>

        {/* 5. FINCAS Y ESPACIOS POR ZONA (GRID INTERACTIVO CON RECUENTO DE BANQUETES) */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-[#ecb613]">
                Directorio Exclusivo
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
                Espacios y Banquetes por Zona
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Explora las fincas, masías y palacetes nupciales más codiciados de España.
              </p>
            </div>
            <Link
              href="/fincas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 text-xs font-black uppercase tracking-wider transition-all"
            >
              <span>Ver Catálogo Completo de Fincas</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topProvincesBanquetes.map((prov) => (
              <Link
                key={prov.slug}
                href={`/fincas/${prov.slug}`}
                className="p-5 rounded-2xl bg-[#0c0a0e] border border-white/10 hover:border-[#ecb613] transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_30px_rgba(236,182,19,0.15)] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20 group-hover:bg-[#ecb613] group-hover:text-black transition-colors">
                    <Building2 size={18} className="text-[#ecb613] group-hover:text-black" />
                  </div>
                  <span className="text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-1 rounded-full font-bold">
                    {prov.count}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white font-syne group-hover:text-[#ecb613] transition-colors">
                    {prov.name}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5 flex items-center gap-1">
                    <span>Espacios Homologados</span>
                    <ChevronRight size={10} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. LOS 6 PILARES DE LA CELEBRACIÓN (TARJETAS VISUALES CON IMÁGENES HD) */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
              Infraestructura 360
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
              Los 6 Pilares de la Celebración
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingBlocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <HolographicTiltCard
                  className="rounded-3xl group min-h-[380px]"
                  glareColor="#ecb613"
                  maxTilt={9}
                  hoverScale={1.02}
                  glareIntensity={0.6}
                  parallaxDepth={22}
                >
                  <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0e0c10] flex flex-col justify-between p-8 group shadow-2xl min-h-[380px] h-full">
                    <div className="absolute inset-0 z-0">
                      <img
                        src={block.imageBg}
                        alt={block.title}
                        className="w-full h-full object-cover opacity-25 group-hover:opacity-45 transition-opacity duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060507] via-[#060507]/80 to-transparent" />
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3.5 rounded-2xl bg-[#ecb613]/15 border border-[#ecb613]/30 backdrop-blur-md group-hover:scale-110 transition-transform">
                          {block.icon}
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-wider text-[#ecb613] font-mono backdrop-blur-md">
                          {block.highlightTag}
                        </span>
                      </div>

                      <div className="pt-2">
                        <h3 className="text-2xl font-black uppercase text-white font-syne tracking-tight group-hover:text-[#ecb613] transition-colors">
                          {block.title}
                        </h3>
                        <p className="text-[11px] font-mono text-[#ecb613] uppercase tracking-widest mt-1">
                          {block.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed font-medium">
                        {block.description}
                      </p>
                    </div>

                    <div className="relative z-10 pt-6">
                      <Link
                        href={block.ctaHref}
                        className="w-full py-4 px-5 rounded-xl bg-white/10 group-hover:bg-[#ecb613] group-hover:text-black text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                      >
                        <span>{block.ctaText}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </HolographicTiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. SHOW SOLISTA PREMIUM EDWIN AGUDELO (SECCIÓN DESTACADA CÁLIDA) */}
        <section className="p-8 sm:p-14 rounded-[3rem] bg-gradient-to-br from-[#181216] via-[#1a150c] to-[#120e14] border border-[#ecb613]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/15 text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono border border-[#ecb613]/40">
                <Crown size={14} /> Banda Sonora de Vuestra Boda
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-syne leading-tight">
                Edwin Agudelo & Ensamble de Gala
              </h2>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Desde el <strong>Show Solista Premium (350€)</strong> con sonido Bose y sesión de fotos de gala, hasta <strong>agrupaciones monumentales de 6, 9 y 13 músicos</strong>. Personalizamos el 100% del repertorio para crear el instante más emotivo de vuestra vida.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <span className="text-lg font-black text-[#ecb613] font-syne">Solista 350€</span>
                  <p className="text-[10px] text-white/60 uppercase mt-0.5">2 salidas de 30 min + Sonido Bose</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <span className="text-lg font-black text-white font-syne">Gala 6+ Músicos</span>
                  <p className="text-[10px] text-white/60 uppercase mt-0.5">Ensamble nupcial con violines</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <span className="text-lg font-black text-white font-syne">Imperial 13+ Músicos</span>
                  <p className="text-[10px] text-white/60 uppercase mt-0.5">Máximo formato monumental</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <a
                href={CENTRALITA.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 cursor-pointer text-center"
              >
                <Phone size={16} />
                <span>Hablar con Edwin Agudelo</span>
              </a>

              <Link
                href="/artistas/edwin-agudelo"
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all text-center border border-white/15"
              >
                <span>Ver Ficha & Dossier Completo</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIOS REALES Y OPINIONES 5.0★ VERIFICADAS */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono">
                <Star size={12} className="fill-[#ecb613]" />
                <span>100% Recomendado por Parejas</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
                Opiniones Reales & <span className="text-[#ecb613]">Garantía S-Class</span>
              </h2>
            </div>
            <a
              href="/reservar/solista"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#ecb613] hover:bg-white text-black text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(236,182,19,0.35)] hover:scale-105"
            >
              <span>Bloquear Fecha con Garantía Oficial (5.0★)</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                autor: "Adriana & Sergio",
                fecha: "27/04/2024",
                titulo: "Nuestra Boda Sergio y Adriana",
                comentario: "No tenemos palabras para expresar la inmensa gratitud que tenemos hacia Edwin y su grupo. Hicieron nuestra noche de bodas la mejor e inolvidable."
              },
              {
                autor: "Eduardo",
                fecha: "03/11/2023",
                titulo: "Mi boda fue espectacular",
                comentario: "Muy agradecido por el espectacular show, cómo conecta a través de las emociones es increíble."
              },
              {
                autor: "Yanet",
                fecha: "03/04/2023",
                titulo: "Insuperable",
                comentario: "Por mucho que busques, no encontrarás a alguien tan profesional como Edwin."
              },
              {
                autor: "Alexandra",
                fecha: "12/10/2019",
                titulo: "Excelente grupo de mariachis",
                comentario: "Edwin es un gran profesional. Para nuestra boda se trajo a su grupo de mariachis y fue espectacular."
              }
            ].map((rev, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-[#0c0a0e] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#ecb613]">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} size={14} className="fill-[#ecb613]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{rev.fecha}</span>
                  </div>

                  <h3 className="text-sm font-black text-white uppercase tracking-tight font-syne">
                    "{rev.titulo}"
                  </h3>

                  <p className="text-xs text-white/75 leading-relaxed italic">
                    "{rev.comentario}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-white uppercase">
                    {rev.autor}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-0.5 rounded-full font-semibold">
                    Verificado
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

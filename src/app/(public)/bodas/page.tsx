'use client';

import React, { useState } from 'react';
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
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { FramerMotionScrollCanvas } from '@/components/ui/FramerMotionScrollCanvas';
import { FRAMER_PHYSICS_PRESETS } from '@/lib/framer/framerDesignVault';
import { motion } from 'framer-motion';

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
    subtitle: 'Dirección & Logística Integral',
    description: 'Coordinación impecable de la arquitectura técnica y emocional de vuestra gran boda.',
    icon: <Crown className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Explorar Planners Homologados',
    ctaHref: '/proveedores?categoria=wedding-planners',
    highlightTag: 'Dirección 360',
    imageBg: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'catering-gourmet',
    title: 'Catering Gourmet',
    subtitle: 'Alta Cocina de Celebración',
    description: 'Banquete de autor en alianza con los mejores chefs de alta escuela.',
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
    description: 'Narrativa emotiva y dirección de voz para que vuestro "Sí, quiero" sea inolvidable.',
    icon: <Mic2 className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Maestros de Ceremonia de Gala',
    ctaHref: '/proveedores?categoria=maestros-de-ceremonia',
    highlightTag: 'Protocolo de Autor',
    imageBg: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'protocolo-plan-b',
    title: 'Protocolo Plan B',
    subtitle: 'Blindaje Técnico Militar',
    description: 'Generadores y sistemas de audio redundantes para que nada detenga vuestra fiesta.',
    icon: <ShieldCheck className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Activar Blindaje Nupcial 100%',
    ctaHref: '/cotizador?servicio=plan-b',
    highlightTag: 'Garantía Total',
    imageBg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'diseno-espacios',
    title: 'Diseño de Espacios',
    subtitle: 'Arquitectura Efímera & Escenografía',
    description: 'Iluminación cálida monumental y transformación estética de jardines y salones.',
    icon: <Palette className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Diseño y Decoración Nupcial',
    ctaHref: '/proveedores?categoria=decoracion',
    highlightTag: 'Atmósfera Visual',
    imageBg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'dj-sound-design',
    title: 'DJ & Sound Design',
    subtitle: 'Acústica de Alta Fidelidad',
    description: 'Equipamiento de sonido Bose F1 Model 812 y microfonía Shure Beta 87A.',
    icon: <Disc className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Configurar DJ & Sonido Bose',
    ctaHref: '/proveedores?categoria=dj-sonido',
    highlightTag: 'Presión 12 W/pax',
    imageBg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'
  }
];

export default function BodasPage() {
  const [showTerritorialDirectory, setShowTerritorialDirectory] = useState(false);

  return (
    <main className="min-h-screen bg-[#080608] text-white pt-24 pb-20 px-4 md:px-8 font-sans selection:bg-[#ecb613]/30 overflow-x-hidden">

      {/* Glow de calidez romántica (Champagne / Oro Rosado) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-[#ecb613]/15 via-[#ff9e64]/5 to-transparent blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">

        {/* 1. HERO ROMÁNTICO S-CLASS (CALIDEZ & ELEGANCIA) */}
        <section className="text-center max-w-4xl mx-auto space-y-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-gradient-to-r from-[#ecb613]/20 via-[#e6c594]/15 to-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-[11px] font-black tracking-[0.35em] uppercase font-mono shadow-[0_0_30px_rgba(236,182,19,0.2)]"
          >
            <Sparkles size={14} className="animate-spin text-[#ecb613]" />
            <span>Arquitectura Nupcial de Autor</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white font-syne leading-[0.92]"
          >
            Bodas de <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fdfbf7] via-[#ecb613] to-[#e6c594]">
              Alta Distinción
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Donde la ingeniería acústica y el arte se fusionan para crear una experiencia nupcial cálida, inolvidable y blindada al 100%.
          </motion.p>

          {/* Botones principales de acción romántica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-5 bg-gradient-to-r from-[#ecb613] to-[#e6c594] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_35px_rgba(236,182,19,0.35)] hover:scale-105 cursor-pointer"
            >
              <Calendar size={18} />
              <span>Consultar Fecha con Asesor Nupcial</span>
            </a>

            <Link
              href="/artistas/edwin-agudelo"
              className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/15 flex items-center justify-center gap-3 transition-all cursor-pointer backdrop-blur-xl hover:border-[#ecb613]/50"
            >
              <Music size={18} className="text-[#ecb613]" />
              <span>Show Solista Premium Edwin Agudelo</span>
            </Link>
          </motion.div>
        </section>

        {/* 2. FRAMER MOTION CANVAS DE ULTIMA GENERACIÓN (SCROLL INMERSIVO 60FPS) */}
        <section className="relative">
          <FramerMotionScrollCanvas
            title="BODAS DE AUTOR & MÚSICA EN DIRECTO"
            subtitle="Una orquestación sonoro-emocional diseñada a medida para el momento más memorable de vuestra vida."
            badge="EXPERIENCIA NUPCIAL INMERSIVA 60FPS"
            accentColor="#ecb613"
            mediaUrl="https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg"
          />
        </section>

        {/* 3. LOS 6 PILARES NUPCIALES DE CELEBRACIÓN (TARJETAS VISUALES CON IMAGEN DE FONDO) */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
              Infraestructura Integral
            </span>
            <h2 className="text-3xl sm:text-6xl font-black uppercase text-white font-syne tracking-tight">
              Los 6 Pilares de la Celebración
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Selección curada de áreas estratégicas para una orquestación inolvidable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingBlocks.map((block) => (
              <motion.div
                key={block.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={FRAMER_PHYSICS_PRESETS.tactileSpring}
                className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0e0c10] flex flex-col justify-between p-8 group shadow-2xl min-h-[360px]"
              >
                {/* Imagen de fondo con overlay degradado cálido */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={block.imageBg}
                    alt={block.title}
                    className="w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080608] via-[#080608]/80 to-transparent" />
                </div>

                {/* Contenido flotante */}
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
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. SHOW SOLISTA PREMIUM EDWIN AGUDELO (SECCIÓN CÁLIDA DESTACADA) */}
        <section className="p-8 sm:p-14 rounded-[3rem] bg-gradient-to-br from-[#181216] via-[#1a150c] to-[#120e14] border border-[#ecb613]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/15 text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono border border-[#ecb613]/40">
                <Crown size={14} /> Banda Sonora Inolvidable
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-syne leading-tight">
                Edwin Agudelo & Ensamble de Gala
              </h2>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Desde el <strong>Show Solista Premium (350€)</strong> con sonido Bose y sesión de fotos de gala, hasta <strong>agrupaciones monumentales de 6, 9 y 13 músicos</strong>. Creamos el instante mágico y emocionante que recordáis para siempre.
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
                className="w-full py-5 bg-gradient-to-r from-[#ecb613] to-[#e6c594] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 cursor-pointer text-center"
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

        {/* 5. OPINIONES REALES & TESTIMONIOS (CALIDEZ Y CONFIANZA 5.0★) */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono">
                <Star size={12} className="fill-[#ecb613]" />
                <span>100% Recomendado por Parejas</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
                Experiencias Reales & <span className="text-[#ecb613]">Garantía Nupcial</span>
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
                comentario: "Por mucho que busques, no encontrarás a alguien tan profesional y entregado como Edwin."
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
                className="p-6 rounded-3xl bg-[#0e0c10] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
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

        {/* 6. DIRECTORIO TERRITORIAL (DESPLEGABLE LIMPIO ACORDEÓN PARA PURGAR EL RUIDO VISUAL) */}
        <section className="pt-8 border-t border-white/10">
          <button
            onClick={() => setShowTerritorialDirectory(!showTerritorialDirectory)}
            className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-widest flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#ecb613]" />
              Directorio de Espacios Nupciales y Cobertura Territorial (52 Provincias)
            </span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${showTerritorialDirectory ? 'rotate-180' : ''}`} />
          </button>

          {showTerritorialDirectory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
            >
              {[
                'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga',
                'Toledo', 'Murcia', 'Granada', 'Zaragoza', 'Alicante',
                'Córdoba', 'Las Palmas', 'Valladolid', 'A Coruña', 'Cádiz'
              ].map((prov) => (
                <Link
                  key={prov}
                  href={`/bodas/fincas-${prov.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}-sonorizacion-gala`}
                  className="p-3 rounded-xl bg-[#0e0c10] border border-white/5 hover:border-[#ecb613] text-xs text-white/70 hover:text-white transition-all text-center font-mono"
                >
                  {prov}
                </Link>
              ))}
            </motion.div>
          )}
        </section>

      </div>
    </main>
  );
}

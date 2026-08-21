'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  Music, 
  Wine, 
  Mic2, 
  Layers, 
  Palette, 
  Disc, 
  ArrowRight, 
  Phone,
  Calendar,
  CheckCircle2,
  Star,
  ExternalLink
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import ThermodynamicNeuralTunnel from '@/features/bodas/ui/ThermodynamicNeuralTunnel';

interface WeddingBlock {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  ctaHref: string;
  highlightTag: string;
}

const weddingBlocks: WeddingBlock[] = [
  {
    id: 'wedding-planners',
    title: 'Wedding Planners',
    subtitle: 'Dirección & Logística Integral',
    description: 'Coordinación total de la logística técnica y emocional.',
    icon: <Crown className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Explorar Wedding Planners Homologados',
    ctaHref: '/proveedores?categoria=wedding-planners',
    highlightTag: 'Dirección 360'
  },
  {
    id: 'catering-gourmet',
    title: 'Catering Gourmet',
    subtitle: 'Alta Cocina de Celebración',
    description: 'Alianzas con chefs de renombre para una experiencia de autor.',
    icon: <Wine className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Conectar con Catering Gourmet',
    ctaHref: '/proveedores?categoria=catering',
    highlightTag: 'Experiencia Sensorial'
  },
  {
    id: 'maestros-ceremonia',
    title: 'Maestros de Ceremonia',
    subtitle: 'Voz, Elegancia & Narrativa',
    description: 'Narrativa y voz para que vuestro sí sea legendario.',
    icon: <Mic2 className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Contratar Maestro de Ceremonia de Gala',
    ctaHref: '/proveedores?categoria=maestros-de-ceremonia',
    highlightTag: 'Protocolo de Autor'
  },
  {
    id: 'protocolo-plan-b',
    title: 'Protocolo Plan B',
    subtitle: 'Blindaje Técnico Militar',
    description: 'Infraestructura redundante ante cualquier imprevisto.',
    icon: <ShieldCheck className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Activar Blindaje Redundante y Generadores',
    ctaHref: '/cotizador?servicio=plan-b',
    highlightTag: 'Garantía 100%'
  },
  {
    id: 'diseno-espacios',
    title: 'Diseño de Espacios',
    subtitle: 'Arquitectura Efímera & Escenografía',
    description: 'Transformación visual de la finca o salón.',
    icon: <Palette className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Diseño y Decoración Nupcial 3D',
    ctaHref: '/proveedores?categoria=decoracion',
    highlightTag: 'Atmósfera Visual'
  },
  {
    id: 'dj-sound-design',
    title: 'DJ & Sound Design',
    subtitle: 'Acústica de Alta Fidelidad',
    description: 'Sistemas de audio de alta fidelidad 24/7.',
    icon: <Disc className="w-6 h-6 text-[#ecb613]" />,
    ctaText: 'Configurar DJ & Sound Design Bose',
    ctaHref: '/proveedores?categoria=dj-sonido',
    highlightTag: 'Presión 12 W/pax'
  }
];

export default function BodasPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-4 md:px-8 font-sans selection:bg-[#ecb613]/30">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-[#ecb613]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* 1. HERO SECTION: BODA S-CLASS */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase font-mono">
            <Heart size={14} className="animate-pulse fill-current" />
            <span>Arquitectura Nupcial de Autor</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white font-syne leading-[0.9]">
            Bodas de <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">Alta Distinción</span>
          </h1>

          <p className="text-white/70 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Una orquestación perfecta donde cada detalle técnico y emocional está blindado. Conectamos los 6 pilares indispensables para una celebración legendaria.
          </p>

          {/* Quick CTA row */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)] hover:scale-105 cursor-pointer"
            >
              <Calendar size={16} />
              <span>Consultar Fecha con Asesor Nupcial</span>
            </a>

            <Link
              href="/artistas/edwin-agudelo"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <Music size={16} className="text-[#ecb613]" />
              <span>Show Solista Premium Edwin Agudelo</span>
            </Link>
          </div>
        </section>

        {/* 2. TÚNEL NEURAL TERMODINÁMICO S-CLASS (MATCHMAKING NUPCIAL) */}
        <section className="pt-2">
          <ThermodynamicNeuralTunnel 
            initialProvince="Madrid" 
            initialService="Producción de Boda S-Class" 
          />
        </section>

        {/* 3. 6 BLOQUES DE BODA CON TÚNEL NEURAL DIRECTO */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
              Túnel Neural de Proveedores
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
              Los 6 Pilares de la Celebración
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddingBlocks.map((block) => (
              <div 
                key={block.id}
                className="p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between space-y-6 group shadow-xl relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/20 group-hover:scale-110 transition-transform">
                      {block.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-[#ecb613] font-mono">
                      {block.highlightTag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black uppercase text-white font-syne tracking-tight group-hover:text-[#ecb613] transition-colors">
                      {block.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#ecb613] uppercase tracking-widest mt-0.5">
                      {block.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed font-medium">
                    {block.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={block.ctaHref}
                    className="w-full py-4 px-4 rounded-xl bg-white/5 group-hover:bg-[#ecb613] group-hover:text-black text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{block.ctaText}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. PACK SOLISTA PREMIUM & SHOWS CON GRUPO */}
        <section className="p-8 sm:p-14 rounded-[3rem] bg-gradient-to-r from-[#0d0d14] via-[#120f08] to-[#0d0d14] border border-[#ecb613]/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono border border-[#ecb613]/30">
                <Crown size={14} /> Banda Sonora de Vuestra Boda
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-syne leading-tight">
                Edwin Agudelo & Ensamble de Gala
              </h2>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Desde el <strong>Show Solista Premium (350€)</strong> con sonido Bose y sesión de fotos de gala, hasta <strong>agrupaciones de 6, 9 y 13 músicos</strong> con exclusividad de fecha. Personalizamos el 100% del repertorio para crear el instante más emotivo de vuestra vida.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                  <span className="text-lg font-black text-[#ecb613] font-syne">Solista 350€</span>
                  <p className="text-[10px] text-white/50 uppercase mt-0.5">2 salidas de 30 min + Sonido Bose</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                  <span className="text-lg font-black text-white font-syne">Gala 6+ Músicos</span>
                  <p className="text-[10px] text-white/50 uppercase mt-0.5">Ensamble completo con violines</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                  <span className="text-lg font-black text-white font-syne">Imperial 13+ Músicos</span>
                  <p className="text-[10px] text-white/50 uppercase mt-0.5">Máximo formato monumental</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <a
                href={CENTRALITA.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 cursor-pointer text-center"
              >
                <Phone size={16} />
                <span>Hablar con Edwin Agudelo</span>
              </a>

              <Link
                href="/artistas/edwin-agudelo"
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all text-center"
              >
                <span>Ver Ficha y Dossier Completo</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </section>

        {/* 4. OPINIONES VERIFICADAS EN BODAS.NET (5.0 ESTRELLAS · 100% RECOMENDADO) */}
        <section className="space-y-10 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[9px] font-black uppercase tracking-widest font-mono">
                <Star size={12} className="fill-[#ecb613]" />
                <span>100% Recomendado por Parejas</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
                Opiniones Reales en <span className="text-[#ecb613]">Bodas.net</span>
              </h2>
            </div>
            <a
              href="https://www.bodas.net/musica/productora-ear--e78903#reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 text-xs font-black uppercase tracking-wider transition-all min-h-[48px]"
            >
              <span>Ver Escaparate en Bodas.net (5.0★)</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                autor: "Adriana & Sergio",
                fecha: "27/04/2024",
                rating: 5.0,
                titulo: "Nuestra Boda Sergio y Adriana",
                comentario: "No tenemos palabras para expresar la inmensa gratitud que tenemos hacia Edwin y su grupo, ya que recibimos el mejor servicio de Mariachis, de fotos y decoración que ha hecho nuestra noche de bodas la mejor e inolvidable."
              },
              {
                autor: "Eduardo",
                fecha: "03/11/2023",
                rating: 5.0,
                titulo: "Mi boda fue espectacular",
                comentario: "Muy agradecido por el espectacular show, cómo conecta a través de las emociones es increíble."
              },
              {
                autor: "Yanet",
                fecha: "03/04/2023",
                rating: 5.0,
                titulo: "Insuperable",
                comentario: "Por mucho que busques, no encontrarás a alguien tan profesional como Edwin."
              },
              {
                autor: "Alexandra",
                fecha: "12/10/2019",
                rating: 5.0,
                titulo: "Excelente grupo de mariachis",
                comentario: "Edwin es un gran profesional, lo habíamos oído anteriormente en actuaciones individuales y para nuestra boda se trajo a su grupo de mariachis y fue espectacular, ¡un gran recuerdo!"
              }
            ].map((rev, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
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

                  <p className="text-xs text-white/70 leading-relaxed italic">
                    "{rev.comentario}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-white uppercase">
                    {rev.autor}
                  </span>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded-full font-mono">
                    Verificado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

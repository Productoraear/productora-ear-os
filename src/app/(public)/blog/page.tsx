'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  Award,
  Music2,
  Phone
} from 'lucide-react';
import { TARIFA_BASE_SOLISTA_EUR, CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

const ESSAYS = [
  {
    id: 'tesis-1',
    youtubeId: 'XobDmIel3EI',
    tag: 'VISIÓN & PROPÓSITO',
    title: 'Por qué la música debe dignificar al artista y emocionar de verdad',
    excerpt: 'Una reflexión profunda de Edwin Agudelo sobre el valor del arte vivo frente a la intermediación salvaje. El origen del Split 80/10/10 y la soberanía del creador.',
    readTime: '4 min de lectura · Vídeo de reflexión'
  },
  {
    id: 'tesis-2',
    youtubeId: 'C_6xIx58uPk',
    tag: 'INNOVACIÓN & IA',
    title: 'Inteligencia Artificial y Software al servicio del talento humano',
    excerpt: 'Cómo la tecnología y la automatización no sustituyen el alma ni la emoción de una voz humana, sino que eliminan la burocracia para que el arte florezca.',
    readTime: '5 min de lectura · Vídeo de reflexión'
  },
  {
    id: 'tesis-3',
    youtubeId: 'rgO5mmTXPu4',
    tag: 'RESPONSABILIDAD SOCIAL',
    title: 'El deber del empresario con los mayores y el impacto social',
    excerpt: 'El nacimiento de VIMUME. Por qué cada euro facturado en un evento festivo debe devolver una huella de ternura y serenidad a nuestros mayores.',
    readTime: '6 min de lectura · Vídeo de reflexión'
  }
];

export default function BlogPensamientoPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* CABECERA EDITORIAL */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-mono font-medium border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <BookOpen size={13} />
            <span>PENSAMIENTO Y VISIÓN DEL FUNDADOR // EDWIN AGUDELO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif mb-4 leading-tight">
            Ensayos de Liderazgo, Arte y Soberanía.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              La Filosofía detrás de EAR OS.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Las ideas matrices que impulsan nuestro ecosistema: el reparto digno 80/10/10, la unión entre tecnología y emoción, y el compromiso social innegociable con nuestros mayores.
          </p>
        </div>

        {/* LISTADO DE LOS 3 ARTÍCULOS CON VÍDEOS */}
        <div className="space-y-16 mb-20">
          {ESSAYS.map((essay, idx) => (
            <article
              key={essay.id}
              className="p-6 sm:p-10 rounded-3xl bg-[#09090d]/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-bold uppercase tracking-wider">
                  {essay.tag}
                </span>
                <span className="text-zinc-500">{essay.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
                {essay.title}
              </h2>

              <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {essay.excerpt}
              </p>

              {/* Vídeo Incrustado de YouTube */}
              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black shadow-lg">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${essay.youtubeId}?rel=0&modestbranding=1`}
                  title={essay.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              {/* TARJETA DESTACADA AL PIE DE CADA ENSAYO */}
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-amber-500 font-bold uppercase block">
                    ¿Celebras una boda o evento próximamente?
                  </span>
                  <span className="text-sm font-bold font-serif text-white">
                    Contrata a Edwin Agudelo (Tenor Solista) desde {TARIFA_BASE_SOLISTA_EUR} €
                  </span>
                </div>
                <Link
                  href="/reservar/solista"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-all shadow-md hover:scale-105 whitespace-nowrap"
                >
                  Ver Disponibilidad en Calendario
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
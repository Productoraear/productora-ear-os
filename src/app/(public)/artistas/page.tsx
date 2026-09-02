import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Music, Sparkles, Award, ShieldCheck, Users, Calendar, 
  ArrowRight, CheckCircle2, Phone, Star, Play, Mic2, HeartHandshake
} from 'lucide-react';
import { HIGH_VALUE_VARIANTS } from '@/lib/artists/matrix';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'Roster S-Class de Artistas | The Signal · Productora EAR',
  description: 'Contratación directa de artistas y producción musical sin intermediarios abusivos. Paciente Cero Edwin Agudelo, solistas líricos, mariachis y shows ecuestres.',
  alternates: {
    canonical: 'https://www.productoraear.com/artistas',
  },
  openGraph: {
    title: 'Roster S-Class de Artistas & The Signal · Productora EAR',
    description: 'Catálogo oficial de artistas soberanos. Paciente Cero Edwin Agudelo, mariachi de gala y espectáculos de autor.',
    url: 'https://www.productoraear.com/artistas',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website'
  }
};

const ROSTER_FEATURED = [
  {
    id: 'edwin-agudelo',
    name: 'Edwin Agudelo',
    role: 'Paciente Cero · Tenor Lírico & Mariachi Master',
    badge: 'SSOT MASTER',
    badgeColor: 'bg-amber-500 text-black font-bold',
    description: 'Voz principal y embajador cultural. Reconocido por coordinar más de 37 grandes giras y conciertos internacionales. Interpretación de alto impacto emocional para bodas de lujo, galas diplomáticas y teatros.',
    formats: ['Solista Premium', 'Mariachi 6+', 'Show Cantando a Caballo'],
    repertoire: ['Acompáñame', 'Si Nos Dejan', 'Granada', 'El Rey'],
    slug: 'edwin-agudelo',
    isHero: true
  },
  {
    id: 'mariachi-gala',
    name: 'Mariachi Imperial S-Class',
    role: 'Ensamble Tradicional Charro (6 a 12 músicos)',
    badge: 'GRAN FORMATO',
    badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    description: 'Trajes de charro auténticos con botonadura de plata y sombreros bordados a mano. Violines, trompetas, vihuela y guitarrón para serenatas, bodas y fiestas patronales.',
    formats: ['Ensamble 6 Músicos', 'Octeto Monumental', 'Orquesta Charra'],
    repertoire: ['Cielito Lindo', 'Hermoso Cariño', 'La Bikina', 'El Jinete'],
    slug: 'mariachis-bodas-barcelona-gala'
  },
  {
    id: 'show-caballo',
    name: 'Espectáculo Cantando a Caballo',
    role: 'Alta Escuela Ecuestre & Voz en Directo',
    badge: 'EXCLUSIVO FERIAS',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    description: 'Doma clásica y española sincronizada con rancheras tradicionales en directo. Monta de alta escuela con seguro de responsabilidad civil completo para plazas y recintos abiertos.',
    formats: ['Show Ecuestre Individual', 'Exhibición con Baile Flamenco'],
    repertoire: ['El Jinete', 'Volver Volver', 'México Lindo y Querido'],
    slug: 'mariachi-caballo-eventos-sevilla'
  }
];

export default function MasterArtistasPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black">
      {/* ── HERO BANNER S-CLASS ── */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest mb-6">
          <Mic2 className="w-3.5 h-3.5" />
          <span>The Signal · Roster S-Class Soberano</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase font-serif max-w-4xl mx-auto leading-tight">
          Talento Musical Soberano Sin <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-amber-400">Intermediarios Abusivos</span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
          Accede directamente al roster oficial de Productora EAR. El 80% de los honorarios se liquida de forma directa y transparente al artista, con auditoría acústica continua y riders técnicos cerrados.
        </p>

        {/* Métricas clave */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-purple-400 font-mono">80% Neto</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Split Directo al Artista</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-amber-400 font-mono">37 Giras</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Coordinadas con Éxito</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-emerald-400 font-mono">SLA 100%</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Contrato Homologado</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xl font-bold text-cyan-400 font-mono">Waybill</div>
            <div className="text-[11px] text-zinc-400 uppercase font-medium mt-0.5">Ruta Digital Móvil</div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN PACIENTE CERO: EDWIN AGUDELO ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-black border-2 border-amber-500/40 p-6 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black font-bold text-xs uppercase font-mono mb-4">
                <Star className="w-3.5 h-3.5 fill-black" />
                <span>Paciente Cero · Embajador Institucional</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif uppercase tracking-tight">
                Edwin Agudelo
              </h2>
              <p className="text-amber-400 text-sm font-mono mt-1 font-semibold">
                Tenor Lírico, Voz Mariachi & Director del Proyecto VIMUME
              </p>
              <p className="text-zinc-300 text-sm mt-4 leading-relaxed max-w-2xl">
                Con una trayectoria intachable en escenarios de América y Europa, Edwin Agudelo personifica el estándar de excelencia artística de Productora EAR. Su capacidad vocal abarca desde la potencia del mariachi tradicional de gala hasta la sensibilidad terapéutica en el protocolo neuroacústico VIMUME.
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono">
                  Diploma de Honor Consular
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono">
                  Álbum "Acompáñame"
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono">
                  Coordinador 37 Grandes Producciones
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  href="/artistas/edwin-agudelo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Ver Perfil y Rider Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/artistas/edwin-agudelo/booking"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all border border-zinc-700"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Comprobar Disponibilidad</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="text-xs font-mono text-zinc-500 uppercase">Repertorio Insignia</div>
                <div className="text-sm font-bold text-white mt-1">"Acompáñame" & Rancheras de Oro</div>
                <p className="text-xs text-zinc-400 mt-2">
                  Himno de resiliencia y esperanza, adaptado tanto para grandes auditorios como para el protocolo de memoria en mayores.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="text-xs font-mono text-zinc-500 uppercase">Disponibilidad Territorial</div>
                <div className="text-sm font-bold text-white mt-1">Madrid, Toda España e Internacional</div>
                <p className="text-xs text-zinc-400 mt-2">
                  Desplazamiento con rider acústico calibrado y seguro de responsabilidad civil completo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROSTER COMPLETO & FORMATOS S-CLASS ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif uppercase tracking-wide">
            Formatos del Roster S-Class
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Producciones artísticas paquetizadas con solvencia técnica homologada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROSTER_FEATURED.map((artist) => (
            <div 
              key={artist.id}
              className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full ${artist.badgeColor}`}>
                    {artist.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-serif mb-1 group-hover:text-purple-400 transition-colors">
                  {artist.name}
                </h3>
                <h4 className="text-xs font-mono text-zinc-400 uppercase mb-4">
                  {artist.role}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {artist.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Formatos Disponibles:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {artist.formats.map((f, i) => (
                      <span key={i} className="text-[11px] bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/artistas/${artist.slug}`}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-zinc-800 hover:bg-purple-600 hover:text-white text-zinc-200 transition-all"
              >
                <span>Ficha & Contratación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── VARIANTES DE BOOKING DIRECTO ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Variantes de Alto Valor & Contratación Rápida
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            Plazas y tipos de evento con cobertura y rider acústico garantizado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HIGH_VALUE_VARIANTS.map((v) => (
            <Link
              key={v.slug}
              href={`/artistas/${v.slug}`}
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900 transition-all group"
            >
              <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors font-mono">
                {v.title}
              </div>
              <div className="text-xs text-zinc-400 mt-1 line-clamp-2">
                {v.metaDescription}
              </div>
              <div className="mt-2 text-[10px] font-mono text-purple-400 uppercase">
                {v.city} · {v.showTypeName}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LLAMADA A LA ACCIÓN: THE SIGNAL ── */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-zinc-900 to-purple-500/10 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white font-serif mb-2">
            ¿Eres Artista o Músico Profesional?
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Únete a la red The Signal. Facturación legalizada, cobro garantizado con split 80% neto y acceso a bolsas de empleo para eventos y festivales.
          </p>
          <a
            href={CENTRALITA.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Hablar con Dirección Artística: {CENTRALITA.display}</span>
          </a>
        </div>
      </section>
    </div>
  );
}

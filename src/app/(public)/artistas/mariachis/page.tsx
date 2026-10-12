import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Lock,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Music,
  Users
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Contratar Mariachis en Directo en España (Desde 350€) · Productora EAR',
  description:
    'Contrata las mejores agrupaciones de mariachis en España con Productora EAR. 4 formatos oficiales (Solista 350€, Cuarteto 600€, Gran Ensamble 900€, Gala Imperial 1.300€), sonorización Bose calibrada y reserva garantizada con 100€ en Stripe.',
  keywords: [
    'contratar mariachis españa',
    'mariachis en directo madrid',
    'mariachi toledo',
    'mariachi bodas barcelona',
    'mariachis valencia',
    'mariachis sevilla',
    'precio mariachi por hora',
    'serenatas mariachi domicilio',
    'Edwin Agudelo mariachi',
    'Productora EAR mariachis'
  ],
  alternates: {
    canonical: 'https://productoraear.com/artistas/mariachis',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://productoraear.com/artistas/mariachis',
    siteName: 'Productora EAR',
    title: 'Contratar Mariachis en Directo en España · Productora EAR',
    description:
      'Directorio y cotizador oficial de mariachis: 4 formatos homologados, kilometraje exacto (1,50 €/km) y bloqueo de fecha garantizado en Stripe con 100 € deducibles.',
    images: [
      {
        url: 'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg',
        width: 1200,
        height: 630,
        alt: 'Mariachis en Directo Productora EAR',
      },
    ],
  },
};

const MARIACHI_PACKS = [
  {
    id: 'solista',
    name: 'Show Solista Charro',
    members: '1 Tenor / Solista',
    price: 350,
    desc: 'Espectáculo íntimo de serenatas, rancheras y boleros con Edwin Agudelo. Sonorización Bose calibrada y acústica de gala sin agresión sonora.',
    ideal: 'Bodas civiles, cócteles, aniversarios y serenatas a domicilio.',
  },
  {
    id: 'cuarteto',
    name: 'Mariachi Cuarteto Esencial',
    members: '4 Músicos en Escena',
    price: 600,
    desc: 'Formato vivo con trompeta, vihuela, guitarrón y voz principal. Vestimenta charra tradicional completa y dinamismo festivo.',
    ideal: 'Cumpleaños, bodas de oro, celebraciones familiares y cenas de gala.',
  },
  {
    id: 'gran-ensamble',
    name: 'Gran Ensamble Regional',
    members: '6 a 9 Músicos',
    price: 900,
    desc: 'Potencia acústica con sección doble de trompetas, violines, armonía completa y solistas rotativos. Gran presencia escénica.',
    ideal: 'Grandes bodas, banquetes nupciales, eventos corporativos y ferias.',
  },
  {
    id: 'gala-imperial',
    name: 'Mariachi Monumental S-Class',
    members: '13 Músicos de Gala',
    price: 1300,
    desc: 'Orquesta charra completa con sección sinfónica de cuerdas, metales de alta precisión y dirección musical de Edwin Agudelo.',
    ideal: 'Fiestas patronales, teatros, festivales y contratos B2G de ayuntamientos.',
  },
];

const HUBS_PROVINCIAS = [
  { name: 'Madrid', base: '0 km (Hub Méntrida)', tag: 'Inmediato' },
  { name: 'Toledo', base: 'Base Central Méntrida', tag: 'Inmediato' },
  { name: 'Barcelona', base: 'Red Cataluña Homologada', tag: 'Red Nacional' },
  { name: 'Valencia', base: 'Red Levante Homologada', tag: 'Red Nacional' },
  { name: 'Sevilla', base: 'Red Andalucía Homologada', tag: 'Red Nacional' },
  { name: 'Málaga', base: 'Costa del Sol Homologada', tag: 'Red Nacional' },
];

export default function ArtistasMariachisPage(): React.JSX.Element {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: 'Directorio y Contratación de Mariachis en Directo en España',
    description:
      'Catálogo homologado de mariachis con 4 formatos oficiales, dirección de Edwin Agudelo y bloqueo de fecha en Stripe.',
    url: 'https://productoraear.com/artistas/mariachis',
    provider: {
      '@type': 'Organization',
      name: 'Productora EAR',
      telephone: CENTRALITA_EAR_OS,
      url: 'https://productoraear.com',
    },
  };

  return (
    <main className="min-h-screen bg-[#030305] text-slate-100 font-sans selection:bg-amber-400/30 selection:text-amber-100 overflow-x-hidden pt-20 sm:pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative radial halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(236,182,19,0.12),transparent_65%)]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        {/* BREADCRUMB NAVEGACIONAL */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/artistas" className="hover:text-[#ecb613] transition">
            Artistas & Shows
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#ecb613] font-bold">Mariachis & Folclore Tradicional</span>
        </nav>

        {/* HERO S-CLASS */}
        <section className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vertical Oficial · Red Nacional de Mariachis EAR OS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tight font-syne">
            Mariachis en Directo · <span className="text-[#ecb613]">Tradición de Gala & Cierre Blindado</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Desde el formato íntimo solista hasta la orquesta monumental de 13 músicos. Presupuesto transparente basado en SSOT, acústica calibrada Bose conforme a la Ley 37/2003 y bloqueo atómico de fecha con depósito de 100 € en Stripe.
          </p>

          {/* DUAL CTA HERO */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 font-mono text-xs">
            <Link
              href="/mariachis"
              className="bg-[#ecb613] hover:bg-white text-black font-black uppercase py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            >
              <Lock className="w-4 h-4 fill-black" />
              <span>Abrir Cotizador Oficial de Mariachis (/mariachis)</span>
            </Link>

            <Link
              href="/artistas?subcategory=mariachi"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-[#ecb613]" />
              <span>Ver Catálogo de Artistas Mariachi</span>
            </Link>
          </div>
        </section>

        {/* BANNER TRANSACCIONAL DESTACADO: EL COTIZADOR INTELIGENTE */}
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0c0a06] via-[#09090e] to-[#12080a] border-2 border-[#ecb613]/60 p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Despacho Directo por Distancia Real (1,50 €/km)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-syne uppercase">
                ¿Por qué cotizar con la plataforma oficial de <span className="text-[#ecb613]">Mariachis EAR OS</span>?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                A diferencia de los directorios informales que tardan 48 horas en responder y no garantizan la asistencia de los músicos, nuestro motor conecta en tiempo real con la agenda del artista, calcula el kilometraje exacto, emite contrato oficial y bloquea tu fecha en Stripe con 100 € deducibles del precio final.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Rider Acústico</span>
                  <span className="text-[#ecb613] font-bold">75 - 90 dB SPL</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Split Justo</span>
                  <span className="text-emerald-400 font-bold">80% Artista / 10% VIMUME</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Cobertura</span>
                  <span className="text-white font-bold">52 Provincias</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/mariachis"
                className="w-full bg-[#ecb613] hover:bg-white text-black font-black uppercase py-4 px-4 rounded-xl text-center transition flex items-center justify-center gap-2 text-xs font-mono shadow-md"
              >
                <span>Cotizar en /mariachis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent('Hola, quiero cotizar un Mariachi para mi evento.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-emerald-400 text-black font-bold uppercase py-3.5 px-4 rounded-xl text-center transition flex items-center justify-center gap-2 text-xs font-mono"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Consulta WhatsApp Directa</span>
              </a>
            </div>
          </div>
        </section>

        {/* 4 FORMATOS HOMOLOGADOS */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block">
              Tarifas Transparentes Homologadas
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-syne uppercase">
              Los 4 Formatos Oficiales de Mariachi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MARIACHI_PACKS.map((pack) => (
              <div
                key={pack.id}
                className="rounded-2xl bg-[#07070b] border border-slate-800 hover:border-[#ecb613]/60 transition-all duration-300 p-5 flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-mono font-bold uppercase border border-[#ecb613]/30">
                      {pack.members}
                    </span>
                    <span className="text-xl font-black text-white font-mono">
                      {pack.price} €
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white font-syne uppercase group-hover:text-[#ecb613] transition-colors">
                    {pack.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {pack.desc}
                  </p>
                  <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-300">
                    <span className="text-slate-500 block text-[9px] uppercase">Recomendado para:</span>
                    {pack.ideal}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80">
                  <Link
                    href={`/mariachis#packs`}
                    className="w-full bg-slate-900 group-hover:bg-[#ecb613] text-slate-200 group-hover:text-black text-xs font-bold font-mono uppercase py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Detalles & Reservar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HUBS DE COBERTURA GEO */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block">
              Logística S-Class
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-syne uppercase">
              Cobertura en Toda España
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Calculamos el kilometraje real desde el punto de partida hasta tu evento: 1,50 €/km a partir del km 50.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HUBS_PROVINCIAS.map((hub) => (
              <div
                key={hub.name}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono space-y-1 hover:border-[#ecb613]/50 transition"
              >
                <div className="flex items-center justify-center gap-1 text-[#ecb613] text-xs font-bold">
                  <MapPin className="w-3 h-3" />
                  <span>{hub.name}</span>
                </div>
                <div className="text-[10px] text-slate-400">{hub.base}</div>
                <div className="text-[9px] text-emerald-400 font-bold uppercase">{hub.tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL DE CONEXIÓN */}
        <section className="text-center bg-gradient-to-b from-[#0a0a10] to-[#040406] border border-slate-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 space-y-4">
          <h2 className="text-xl sm:text-3xl font-black text-white font-syne uppercase">
            ¿Listo para vivir la magia del Mariachi en vivo?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
            Entra ahora al cotizador interactivo de Productora EAR y obtén tu presupuesto instantáneo en menos de 60 segundos.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center font-mono text-xs">
            <Link
              href="/mariachis"
              className="bg-[#ecb613] hover:bg-white text-black font-black uppercase py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Ir a la Plataforma /mariachis</span>
            </Link>
            <Link
              href="/artistas"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>Volver a Catálogo General</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

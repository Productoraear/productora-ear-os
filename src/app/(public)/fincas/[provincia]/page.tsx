import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  Phone,
  MessageCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import {
  SCLASS_12_FINCAS_HOMOLOGADAS,
  type FincaHomologada,
} from '@/lib/constants/fincas-catalog';
import { CENTRALITA } from '@/lib/phone-constants';
import { normalizeForUrl } from '@/lib/acg/acgSemanticGraph';
import SemanticBlockRenderer from '@/components/programmatic/SemanticBlockRenderer';

interface ProvinciaFincasProps {
  params: Promise<{ provincia: string }>;
}

const FINCA_IMAGES: Record<string, string> = {
  'finca-la-chopera': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
  'soto-de-mozanaque': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
  'finca-el-regajal': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1200&auto=format&fit=crop',
  'finca-aldea-santillana': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
  'la-casona-de-torrelodones': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
  'finca-las-tenadas': 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  'cigarral-del-angel': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  'finca-los-enebrales': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
  'la-quinta-de-jarama': 'https://images.unsplash.com/photo-1561128290-f1713cc2e8bb?q=80&w=1200&auto=format&fit=crop',
  'castillo-de-vinuelas': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1200&auto=format&fit=crop',
  'finca-valduerna': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
  'dehesa-de-valbueno': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

/**
 * Intents SEO de fincas publicados originalmente por el catch-all
 * `[vertical]/[intent]`. Se preservan aquí para no romper backlinks mientras
 * la ruta concreta `/fincas/[provincia]` asume la resolución territorial.
 */
const FINCA_SEO_INTENTS: Record<string, { title: string; description: string }> = {
  'opiniones-quinta-malpica-sonorizacion': {
    title: 'Sonorización y Música en Quinta Malpica | Opiniones y Rider',
    description: 'Estudio de acústica y música en directo para eventos en Quinta Malpica. Cobertura uniforme 12 W/pax, microfonía sin acoples y solista desde 350€.',
  },
  'finca-los-afligidos-musica-directo': {
    title: 'Música en Directo y Sonorización en Finca Los Afligidos',
    description: 'Producción musical y técnica para bodas en Finca Los Afligidos. Ensamble de mariachi, tenor Edwin Agudelo y PA Bose F1 con cero distorsión.',
  },
  'iluminacion-navidena-fincas-eventos': {
    title: 'Iluminación Navideña y Micro-LED para Fincas y Hoteles',
    description: 'Ambientación lumínica de alta gama para fincas, bodegas y espacios de eventos. Cortinas de micro-LED IP65, arbolado luminoso y figuras 3D exclusivas.',
  },
};

function resolveProvincia(raw: string): { slug: string; display: string } | null {
  const slug = normalizeForUrl(raw);
  if (!slug) return null;
  const fincas = SCLASS_12_FINCAS_HOMOLOGADAS.filter(
    (f) => normalizeForUrl(f.provincia) === slug,
  );
  if (fincas.length === 0) return null;
  return { slug, display: fincas[0].provincia };
}

export function generateStaticParams() {
  const provincias = Array.from(
    new Set(SCLASS_12_FINCAS_HOMOLOGADAS.map((f) => normalizeForUrl(f.provincia))),
  );
  return provincias.map((provincia) => ({ provincia }));
}

export async function generateMetadata({ params }: ProvinciaFincasProps): Promise<Metadata> {
  const { provincia } = await params;
  const resolved = resolveProvincia(provincia);
  if (resolved) {
    const count = SCLASS_12_FINCAS_HOMOLOGADAS.filter(
      (f) => normalizeForUrl(f.provincia) === resolved.slug,
    ).length;

    return {
      title: `Fincas Homologadas S-Class en ${resolved.display} | Productora EAR`,
      description: `${count === 1 ? 'Finca certificada' : `${count} fincas certificadas`} para bodas y eventos en ${resolved.display}. RC 300.000 €, acometida CETAC 32A/16A y rider Bose F1 con split 80/10/10.`,
      alternates: {
        canonical: `https://productoraear.com/fincas/${resolved.slug}`,
      },
      openGraph: {
        title: `Fincas Homologadas en ${resolved.display} — Productora EAR`,
        description: `Red certificada de fincas S-Class en ${resolved.display} para bodas de gala y eventos corporativos.`,
        url: `https://productoraear.com/fincas/${resolved.slug}`,
        type: 'website',
      },
    };
  }

  const intent = FINCA_SEO_INTENTS[provincia];
  if (intent) {
    return {
      title: intent.title,
      description: intent.description,
    };
  }

  return { title: 'Fincas | Productora EAR' };
}

function FincaProvincialCard({ finca }: { finca: FincaHomologada }) {
  const img = FINCA_IMAGES[finca.id] ?? FALLBACK_IMAGE;
  const facturables = Math.max(0, finca.distanciaHubMentridaKm - 50);

  return (
    <article className="group rounded-2xl overflow-hidden bg-[#050507] border border-white/10 hover:border-[#ecb613]/50 transition-all hover:-translate-y-1">
      <div className="h-52 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={finca.name}
          loading="lazy"
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/30 to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] uppercase tracking-widest">
          <ShieldCheck size={12} className="text-[#ecb613]" /> Certificada S-Class
        </span>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            {finca.location}
          </p>
          <h3 className="font-syne text-xl font-black text-white mt-1">{finca.name}</h3>
        </div>

        <p className="font-body text-sm text-white/60 leading-relaxed line-clamp-3">
          {finca.description}
        </p>

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="flex items-center gap-1.5 text-white/40 mb-1">
              <Users size={12} className="text-[#ecb613]" /> Aforo
            </span>
            <span className="text-white font-bold">{finca.capacidadMaxPax} pax</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="flex items-center gap-1.5 text-white/40 mb-1">
              <Zap size={12} className="text-[#ecb613]" /> Potencia
            </span>
            <span className="text-white font-bold">{finca.potenciaKw} kW</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 col-span-2">
            <span className="flex items-center gap-1.5 text-white/40 mb-1">
              <MapPin size={12} className="text-[#ecb613]" /> Logística Méntrida
            </span>
            <span className="text-white font-bold">
              {finca.distanciaHubMentridaKm} km
              {facturables > 0 ? ` · ${facturables} km facturables` : ' · 0 km facturables'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
            RC {finca.polizaRC.coberturaEuros.toLocaleString('es-ES')} €
          </span>
          <Link
            href={`/acg?finca=${finca.id}&step=ruta`}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#ecb613] font-bold uppercase tracking-widest hover:gap-3 transition-all"
          >
            Reservar <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function ProvinciaFincasPage({ params }: ProvinciaFincasProps) {
  const { provincia } = await params;
  const resolved = resolveProvincia(provincia);

  // Preserva los intents SEO de fincas publicados por el catch-all original.
  if (!resolved && FINCA_SEO_INTENTS[provincia]) {
    return <SemanticBlockRenderer vertical="fincas" intent={provincia} />;
  }

  if (!resolved) notFound();

  const fincas = SCLASS_12_FINCAS_HOMOLOGADAS.filter(
    (f) => normalizeForUrl(f.provincia) === resolved.slug,
  );
  const capacidadTotal = fincas.reduce((sum, f) => sum + f.capacidadMaxPax, 0);

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-28 pb-24 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] uppercase tracking-[0.3em]">
            <Building2 size={13} /> Red Homologada · {resolved.display}
          </div>
          <h1 className="font-syne text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]">
            Fincas S-Class en{' '}
            <span className="text-[#ecb613]">{resolved.display}</span>
          </h1>
          <p className="font-body text-lg text-white/60 leading-relaxed">
            {fincas.length === 1
              ? 'Finca certificada para bodas y eventos de gala.'
              : `${fincas.length} fincas certificadas para bodas y eventos de gala.`}{' '}
            Cobertura acústica 12 W/pax, acometida CETAC 32A/16A y liquidación de
            comisiones en 7 días hábiles.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/40">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Users size={12} className="text-[#ecb613]" /> {capacidadTotal} pax combinados
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#ecb613]" /> Certificación Gold Master
            </span>
          </div>
        </section>

        {/* Grid de fincas */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fincas.map((finca) => (
            <FincaProvincialCard key={finca.id} finca={finca} />
          ))}
        </section>

        {/* Cierre doctrinal */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
              Split Soberano
            </p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
              80% Artista / 10% EAR OS / 10% VIMUME. Inmutable en cada liquidación.
            </p>
          </div>
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
              Price-Lock 100 €
            </p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
              Firma SHA-256 emitida en servidor. Depósito reembolsable si no encaja la fecha.
            </p>
          </div>
          <div className="rounded-2xl bg-[#050507] border border-white/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
              Acústica Legal
            </p>
            <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
              Rider Bose F1 812 / S1 Pro y Shure Beta 87A. Límite B2G {'<'} 75 dB SPL.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/acg?step=ruta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ecb613] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] transition-all"
          >
            <CheckCircle2 size={16} /> Planificar ruta desde Méntrida
          </Link>
          <Link
            href="/fincasparaboda"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-[#ecb613]/40 text-[#ecb613] font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-[#ecb613]/10 transition-all"
          >
            <Building2 size={16} /> Ver Red fincasparaboda.com
          </Link>
          <a
            href={`https://wa.me/34693693048?text=${encodeURIComponent(
              `Hola Productora EAR, quiero consultar disponibilidad para una finca homologada en ${resolved.display}.`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
          >
            <MessageCircle size={16} className="text-emerald-400" /> Consultar por WhatsApp
          </a>
          <a
            href={CENTRALITA.tel}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
          >
            <Phone size={16} className="text-[#ecb613]" /> {CENTRALITA.display}
          </a>
        </section>
      </div>
    </main>
  );
}
import React from 'react';
import type { Metadata } from 'next';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { ShieldCheck, Heart, Sparkles, Music2, Clock, Users } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';
import { INITIAL_INVENTORY } from '@/lib/constants/inventory-catalog';

export const metadata: Metadata = generateArtistSEOMeta('bodas', 'España');

interface ProductOfferSchema {
  readonly '@type': 'Offer';
  readonly price: number;
  readonly priceCurrency: 'EUR';
  readonly availability: 'https://schema.org/InStock';
}

interface ProductBrandSchema {
  readonly '@type': 'Brand';
  readonly name: string;
}

interface ProductSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'Product';
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly brand: ProductBrandSchema;
  readonly offers: ProductOfferSchema;
}

interface InventoryItem {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly category?: string;
  readonly brand?: string;
  readonly dailyPrice?: number;
}

interface FormationSpec {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FALLBACK_LASER_NAME = 'Pack Show Láser RGB 3W + Máquina Humo LED Geyser';
const FALLBACK_LASER_DESCRIPTION =
  'Efecto pirotécnico frío y proyecciones 3D para bodas y celebraciones.';
const FALLBACK_LASER_CATEGORY = 'ILUMINACION_DJ';
const FALLBACK_LASER_BRAND = 'Chauvet';
const FALLBACK_LASER_PRICE_EUR = 160;

const FORMATION_SPECS: readonly FormationSpec[] = [
  {
    id: 'base',
    label: 'Formación Base',
    detail: '7 músicos · 2 violines · 2 trompetas · vihuela · guitarrón · voz',
    icon: Users,
  },
  {
    id: 'extended',
    label: 'Formación Extendida',
    detail: 'Hasta 12 músicos · arpa y sax opcionales',
    icon: Sparkles,
  },
  {
    id: 'repertoire',
    label: 'Repertorio',
    detail: '120 temas · vals nupcial · bolero · ranchera · son jalisciense',
    icon: Music2,
  },
  {
    id: 'timing',
    label: 'Montaje',
    detail: '90 minutos · set ceremonia 45 min · cóctel 60 min · fiesta 90 min',
    icon: Clock,
  },
];

export default function ArtistasBodasPage(): React.JSX.Element {
  const schema = generateEventSchema('bodas', 'España');

  // 📦 Show Láser RGB 3W + Máquina Humo Geyser — precio SSOT
  const inventory = INITIAL_INVENTORY as readonly InventoryItem[];
  const laserPack: InventoryItem | undefined = inventory.find(
    (item) => item.id === 'light-dj-laser-geyser',
  );
  const laserPriceEur: number = laserPack?.dailyPrice ?? FALLBACK_LASER_PRICE_EUR;

  const productSchema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: laserPack?.name ?? FALLBACK_LASER_NAME,
    description: laserPack?.description ?? FALLBACK_LASER_DESCRIPTION,
    category: laserPack?.category ?? FALLBACK_LASER_CATEGORY,
    brand: { '@type': 'Brand', name: laserPack?.brand ?? FALLBACK_LASER_BRAND },
    offers: {
      '@type': 'Offer',
      price: laserPriceEur,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans antialiased selection:bg-[#ecb613]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* 📦 ETIQUETA SCHEMA.ORG JSON-LD — OFFER SHOW LÁSER RGB 3W + GEYSER (PRECIO SSOT) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5 transition-all duration-500 hover:bg-red-500/20 hover:border-red-500/40 hover:scale-105">
              <Heart size={12} className="animate-pulse" /> Boda de Ensueño
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              ROMANTIC REPERTOIRE
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne bg-gradient-to-b from-white via-white to-white/60 bg-clip-text">
            Mariachis para Bodas &amp; Ceremonias
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Mariachi de gala de Edwin Agudelo: formación de 7 a 12 músicos, repertorio de 120
            temas entre vals nupcial, bolero y ranchera, y montaje en 90 minutos.
          </p>

          {/* CTA primario */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#reserva"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#ecb613] text-black text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#f5c93a] hover:scale-[1.03] hover:shadow-[0_0_40px_-8px_rgba(236,182,19,0.6)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <Sparkles
                size={14}
                className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
              />
              Reservar Fecha
            </a>
            <a
              href="#repertorio"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 text-white/80 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:border-white/40 hover:text-white hover:bg-white/5 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <Music2
                size={14}
                className="transition-transform duration-500 group-hover:-translate-y-0.5"
              />
              Ver Repertorio
            </a>
          </div>
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center transition-colors duration-500 hover:border-white/10">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Formaciones y Repertorio
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Formación base de 7 músicos (2 violines, 2 trompetas, vihuela, guitarrón y voz
              principal) ampliable a 12 con arpa y sax. Repertorio de 120 temas: vals nupcial,
              bolero, ranchera, son jalisciense y pop en versión mariachi. Set de ceremonia 45
              min + set de cóctel 60 min + set de fiesta 90 min.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {FORMATION_SPECS.map((spec) => {
                const Icon = spec.icon;
                return (
                  <li
                    key={spec.id}
                    className="group flex items-start gap-3 p-3 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-white/[0.04] hover:-translate-y-0.5"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ecb613]/10 text-[#ecb613] transition-colors duration-300 group-hover:bg-[#ecb613]/20">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/80">
                        {spec.label}
                      </p>
                      <p className="text-[11px] text-white/40 leading-snug mt-0.5">
                        {spec.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 transition-all duration-500 hover:bg-white/[0.07] hover:border-[#ecb613]/30 hover:shadow-[0_0_60px_-20px_rgba(236,182,19,0.35)]">
            <ShieldCheck
              className="text-[#ecb613] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              size={36}
            />
            <h3 className="text-lg font-black uppercase">Reserva Protegida</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Bloqueo de fecha con señal del 30%. Cancelación con reembolso íntegro hasta 30 días
              antes del enlace. Cobertura de sustitución garantizada por músicos de reserva en
              caso de baja médica.
            </p>
            <a
              href="#reserva"
              className="group/cta inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ecb613] transition-all duration-300 hover:text-[#f5c93a] hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 rounded"
            >
              Asegurar fecha
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />
      </div>
    </main>
  );
}
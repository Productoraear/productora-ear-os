import React from 'react';
import Link from 'next/link';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { ShieldCheck, Award, MessageCircle, CalendarCheck, ArrowRight } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata = generateArtistSEOMeta('ferias', 'España');

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
  'Hola, quiero reservar mariachis para una feria o fiesta popular.'
)}`;

const FERIAS_SPECS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'Formato', value: 'Solista · Trío · Mariachi completo' },
  { label: 'Duración set', value: '45 min por pase' },
  { label: 'Pases por feria', value: '2 a 4 según programa' },
  { label: 'Desplazamiento', value: 'Nacional (España peninsular)' },
  { label: 'Sonorización', value: 'PA 2.000 W + 4 micros inalámbricos' },
  { label: 'Repertorio', value: 'Ranchera, corrido, cumbia, bolero' },
];

const FERIAS_REQUISITOS: ReadonlyArray<string> = [
  'Alta en Seguridad Social de todos los músicos en activo',
  'Seguro de Responsabilidad Civil con cobertura mínima 600.000 €',
  'Documentación PRL entregada al ayuntamiento 15 días antes',
  'Ficha técnica y rider de sonido firmados en contrato',
  'Facturación con IVA desglosado y retención aplicable',
];

const FERIAS_TIMELINE: ReadonlyArray<{ step: string; detail: string }> = [
  { step: '01 · Consulta', detail: 'Confirmamos fecha, aforo y ubicación del escenario.' },
  { step: '02 · Contrato', detail: 'Firma digital y depósito de garantía por Stripe.' },
  { step: '03 · Logística', detail: 'Envío de rider técnico y documentación al consistorio.' },
  { step: '04 · Show', detail: 'Montaje 90 min antes, prueba de sonido y pases programados.' },
];

const FERIAS_AFORO_MIN = 500;
const FERIAS_AFORO_MAX = 5000;
const FERIAS_PA_WATTS = 2000;
const FERIAS_MICROFONOS = 4;
const FERIAS_MONTAJE_MIN = 90;
const FERIAS_RC_COBERTURA_EUR = 600000;
const FERIAS_PRL_DIAS_ANTES = 15;

const RESERVA_SOLISTA_HREF = '/reservar/solista';
const CHECKOUT_HREF = '/checkout';
const ALQUILER_HREF = '/alquiler';

interface OfferSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  brand: {
    '@type': string;
    name: string;
  };
  offers: {
    '@type': string;
    priceCurrency: string;
    price: string;
    availability: string;
    url: string;
    priceValidUntil: string;
    eligibleQuantity: {
      '@type': string;
      value: number;
      unitCode: string;
    };
  };
}

export default function ArtistasFeriasPage(): React.JSX.Element {
  const baseSchema = generateEventSchema('ferias', 'España');

  const offerSchema: OfferSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Mariachis para Ferias & Fiestas Populares',
    description:
      'Espectáculo de mariachis de gran formato para ferias, fiestas patronales y celebraciones populares en España. Homologación PRL y seguros incluidos.',
    brand: {
      '@type': 'Brand',
      name: 'EAR OS',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: 'https://ear-os.com/reservar/solista',
      priceValidUntil: '2026-12-31',
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: 'C62',
      },
    },
  };

  const mergedSchema: ReadonlyArray<unknown> = Array.isArray(baseSchema)
    ? [...baseSchema, offerSchema]
    : [baseSchema, offerSchema];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-40 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mergedSchema) }}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Award size={12} /> Fiestas Populares
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              PUBLIC SHOWS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Ferias &amp; Fiestas
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Formato solista, trío o mariachi completo con PA de{' '}
            {FERIAS_PA_WATTS.toLocaleString('es-ES')} W, {FERIAS_MICROFONOS} micros inalámbricos y
            repertorio ranchero, corrido, cumbia y bolero. Pases de 45 min programables de 2 a 4 por
            jornada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={RESERVA_SOLISTA_HREF}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#ecb613] text-black font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)]"
            >
              <CalendarCheck size={16} />
              Reservar desde {TARIFA_BASE_SOLISTA_EUR} €
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#09090d]/80 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:border-[#ecb613]/40 hover:bg-[#09090d] transition-all duration-300"
            >
              <MessageCircle size={16} className="text-[#ecb613]" />
              WhatsApp Directo
            </a>
          </div>

          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest pt-2">
            Depósito de reserva: {DEPOSITO_STRIPE_EUR} € · Tarifa Solista: {TARIFA_BASE_SOLISTA_EUR} €
          </p>
        </section>

        {/* Specs técnicas */}
        <section className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-10 md:p-16 space-y-8 hover:border-white/20 transition-all duration-500">
          <div className="space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Ficha técnica del espectáculo
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-3xl">
              Parámetros operativos del montaje para ferias y fiestas patronales. Todos los valores
              son contractuales y se entregan por escrito al organizador antes del evento.
            </p>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FERIAS_SPECS.map((spec) => (
              <div
                key={spec.label}
                className="bg-[#030305]/60 border border-white/10 rounded-2xl p-5 space-y-1.5 hover:border-[#ecb613]/30 transition-all duration-300"
              >
                <dt className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">
                  {spec.label}
                </dt>
                <dd className="text-sm font-bold text-white">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Requisitos legales + Timeline */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-10 space-y-6 hover:border-[#ecb613]/30 transition-all duration-500">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#ecb613]" size={32} />
              <h3 className="text-lg font-black uppercase tracking-tight font-syne">
                Requisitos legales cubiertos
              </h3>
            </div>
            <ul className="space-y-3">
              {FERIAS_REQUISITOS.map((req) => (
                <li
                  key={req}
                  className="flex items-start gap-3 text-white/60 text-xs leading-relaxed"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ecb613] shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-10 space-y-6 hover:border-[#ecb613]/30 transition-all duration-500">
            <h3 className="text-lg font-black uppercase tracking-tight font-syne">
              Proceso de contratación
            </h3>
            <ol className="space-y-4">
              {FERIAS_TIMELINE.map((item) => (
                <li key={item.step} className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#ecb613] font-mono">
                    {item.step}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA intermedio */}
        <section className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center hover:border-white/20 transition-all duration-500">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Espectáculos de Plaza Pública
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Montaje dimensionado para aforos de {FERIAS_AFORO_MIN.toLocaleString('es-ES')} a{' '}
              {FERIAS_AFORO_MAX.toLocaleString('es-ES')} asistentes. PA de{' '}
              {FERIAS_PA_WATTS.toLocaleString('es-ES')} W con {FERIAS_MICROFONOS} micros
              inalámbricos, monitores de escenario y mesa de mezclas digital. Repertorio de alta
              interacción coral con arreglos rancheros, corridos, cumbias y boleros.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={RESERVA_SOLISTA_HREF}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-3xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black uppercase tracking-widest hover:bg-[#ecb613]/20 transition-all duration-300"
              >
                Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
              </Link>
              <Link
                href={ALQUILER_HREF}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-3xl bg-white/5 border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest hover:border-white/30 hover:text-white transition-all duration-300"
              >
                Ver Packs de Inventario
              </Link>
            </div>
          </div>
          <div className="bg-[#030305]/60 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-[#ecb613]/30 transition-all duration-500">
            <ShieldCheck className="text-[#ecb613]" size={36} />
            <h3 className="text-lg font-black uppercase">Homologación y Seguros</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Alta en Seguridad Social de todos los músicos, seguro de Responsabilidad Civil con
              cobertura mínima de {FERIAS_RC_COBERTURA_EUR.toLocaleString('es-ES')} €, documentación
              PRL entregada al ayuntamiento {FERIAS_PRL_DIAS_ANTES} días antes del evento y
              facturación con IVA desglosado.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

        {/* CTA Final */}
        <section className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-10 md:p-14 text-center space-y-6 hover:border-[#ecb613]/30 transition-all duration-500">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter font-syne">
            Asegura tu fecha en feria
          </h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Bloquea la fecha con depósito de {DEPOSITO_STRIPE_EUR} € vía Stripe. El contrato digital
            incluye rider técnico, ficha de montaje y documentación PRL lista para presentar al
            consistorio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={CHECKOUT_HREF}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#ecb613] text-black font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)]"
            >
              Ir al Checkout
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#09090d]/80 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:border-[#ecb613]/40 transition-all duration-300"
            >
              <MessageCircle size={16} className="text-[#ecb613]" />
              +34 693 693 048
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
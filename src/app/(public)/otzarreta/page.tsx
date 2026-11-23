import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Award,
  Phone,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_ENTITY,
  OTZARRETA_SEATING_PRESET,
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';
import {
  SOVEREIGN_DEMAND_CHANNEL,
  buildDemandWhatsappUrl,
  sanitizeSchemaContact,
  supplierContactWithheldNotice,
  supplierLineMask
} from '@/lib/providers/sovereign-lead-gate';
import { EzkertzaVenueLanding as EzkertzaVenueListing } from '@/components/otzarreta/EzkertzaVenueLanding';
import BentoMenuSection from '@/components/otzarreta/BentoMenuSection';
import { SovereignWhatsAppButton } from '@/components/shared/SovereignWhatsAppButton';
import {
  HorizonXGlow
} from '@/components/harvested';
import {
  resolveProviderCalendarHref,
  resolveProviderContractHref,
} from '@/lib/providers/provider-cta-engine';
import {
  OTZARRETA_HUB,
  OTZARRETA_MUNICIPALITIES
} from '@/lib/seo/otzarreta-dominance-engine';

/**
 * Sujeto canÃ³nico de los CTAs de esta alianza. Vive en el Data Lake de
 * proveedores como `restaurante-otzarreta` (particiÃ³n `catering.json`), por lo
 * que su calendario soberano es `/calendario/catering/restaurante-otzarreta`.
 */
const OTZARRETA_CTA_SOURCE = {
  slug: 'restaurante-otzarreta',
  category: 'catering',
} as const;

const OTZARRETA_MENU_RANGE_LABEL = `${OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 0} € a ${OTZARRETA_WEDDING_MENUS[OTZARRETA_WEDDING_MENUS.length - 1]?.priceEur ?? 0} €`;

export const metadata: Metadata = {
  title: 'Restaurante Otzarreta | Bodas, Asador & Banquetes en Derio (Bizkaia)',
  description:
    `Banquetes nupciales exclusivos para hasta ${OTZARRETA_SEATING_PRESET.totalPax} comensales en caserío tradicional con jardines, carpa para ceremonias civiles y parrilla al carbón de encina y sarmiento de Eduardo Martínez. Parking privado cerrado de más de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas. ${OTZARRETA_WEDDING_MENUS_CLAIM}.`,
  alternates: {
    canonical: 'https://productoraear.com/otzarreta'
  },
  openGraph: {
    title: 'Restaurante Otzarreta | Bodas, Asador & Banquetes de Gala en Derio',
    description:
      `Caserío vasco con capacidad para ${OTZARRETA_SEATING_PRESET.totalPax} comensales, parking privado de más de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas, jardines y alta parrilla al carbón. ${OTZARRETA_WEDDING_MENUS_CLAIM}.`,
    url: 'https://productoraear.com/otzarreta',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Restaurante Otzarreta · Fachada Principal del Caserío en Derio'
      }
    ]
  }
};

export default async function OtzarretaFlagshipPage({
  searchParams,
}: {
  searchParams: Promise<{ malla?: string | string[] }>;
}): Promise<React.JSX.Element> {
  const sp = await searchParams;
  const mallaDemo = sp.malla === '1';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Restaurant', 'EventVenue'],
        '@id': 'https://productoraear.com/otzarreta#venue',
        name: 'Restaurante Otzarreta',
        alternateName: 'Restaurante Otzarreta Derio',
        description:
          `Caserío tradicional vasco para banquetes de boda y eventos corporativos para hasta ${OTZARRETA_SEATING_PRESET.totalPax} comensales con parrilla al carbón de Eduardo Martínez.`,
        url: 'https://productoraear.com/otzarreta',
        // PEAJE SOBERANO: la lÃ­nea del recinto NO viaja en el JSON-LD. El
        // saneador (`sanitizeSchemaContact`) inyecta el punto de contacto de la
        // ConserjerÃ­a EAR OS en el render.
        servesCuisine: ['Basque', 'Parrilla', 'Traditional Spanish', 'Seafood', 'Asador'],
        priceRange: '€€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Santo Domingo Hiribidea, 13',
          addressLocality: 'Derio',
          addressRegion: 'Bizkaia',
          postalCode: '48160',
          addressCountry: 'ES'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 43.2928,
          longitude: -2.8833
        },
        maximumAttendeeCapacity: OTZARRETA_SEATING_PRESET.totalPax,
        smokingAllowed: false,
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Jardines para Ceremonia Civil con Carpa', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Parrilla al Carbón de Encina', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Salones Climatizados e Insonorizados', value: true },
          { '@type': 'LocationFeatureSpecification', name: `Parking Privado Gratuito más de ${OTZARRETA_SEATING_PRESET.parkingSpaces} Plazas`, value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Parque Infantil con Columpios Homologados', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Accesibilidad Total PMR con Ascensor', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Sonorización Bose F1 Homologada (Ley 37/2003)', value: true }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Bizkaia',
            item: 'https://productoraear.com/otzarreta',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Restaurante Otzarreta',
            item: 'https://productoraear.com/otzarreta',
          },
        ]
      }
    ]
  };

  const whatsappConciergeUrl = buildDemandWhatsappUrl({
    entityName: 'Restaurante Otzarreta',
    intent: 'disponibilidad',
    detail: 'boda o banquete'
  });

  // â”€â”€ CTAs POR ENTIDAD (W48) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // El Â«Bloquear FechaÂ» de esta alianza deja de aterrizar en la agenda de
  // Edwin Agudelo: se resuelve contra el calendario real del proveedor
  // (`restaurante-otzarreta`, gremio catering del Data Lake) y el depÃ³sito
  // deducible se formaliza en el expediente contractual con importes del SSOT.
  const calendarBlockHref = resolveProviderCalendarHref(OTZARRETA_CTA_SOURCE, { intent: 'bloquear' });
  const calendarVisitHref = resolveProviderCalendarHref(OTZARRETA_CTA_SOURCE, { intent: 'ver' });
  const contractHref = resolveProviderContractHref(OTZARRETA_CTA_SOURCE);
  // ZERO-OVERFLOW (360–412 px): el lienzo nace cerrado en horizontal y con
  // holgura inferior para el SovereignMobileHUD, que mide ≈77 px + safe-area y
  // se ancla al borde inferior. `pb-32` (8rem) garantiza que jamás tape precios,
  // botones de fianza ni la línea de términos del pie.
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#030305] px-0 pt-24 pb-32 text-white selection:bg-[#ecb613] selection:text-black sm:pt-28 sm:pb-16">
      {/* Script Estructurado JSON-LD (saneado: cero líneas de proveedor) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            sanitizeSchemaContact(jsonLd, 'Derio (Bizkaia)')
          ).replace(/</g, '\\u003c')
        }}
      />

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 1. HERO EDITORIAL · FOTOGRAFÍA A SANGRE + TITULAR DISPLAY      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto mt-2 w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-panel border border-white/[0.08] bg-[#0A0A0E] shadow-elevation-3">

          {/* Fotografía a sangre. `fetchPriority` alto porque es el LCP. */}
          <img
            src={OTZARRETA_ENTITY.scrapedAssets.facade}
            alt="Fachada del caserío Restaurante Otzarreta en Derio (Bizkaia)"
            className="h-[clamp(380px,58svh,600px)] w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          {/* Velo inferior hacia el negro Aura Onyx: legibilidad sin lavar la foto. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/70 to-[#030305]/10"
          />
          {/* Grano mineral: superficie con textura, jamás un orbe borroso. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27140%27 height=%27140%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%273%27/%3E%3C/filter%3E%3Crect width=%27140%27 height=%27140%27 filter=%27url(%23n)%27 opacity=%270.5%27/%3E%3C/svg%3E")',
            }}
          />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-10 lg:p-14">
            <div className="max-w-3xl min-w-0 space-y-4 sm:space-y-6">
              <h1 className="font-syne text-[clamp(1.6rem,8.2vw,4.25rem)] font-black leading-[1.06] tracking-display-tight text-[#F4F1EA] [overflow-wrap:break-word] [min-width:0]">
                Asador Tradicional Otzarreta
                <span className="mt-1 block text-[clamp(0.9375rem,4vw,1.375rem)] font-medium leading-snug tracking-normal text-[#C9C4B8]">
                  Derio, Bizkaia desde 1902
                </span>
              </h1>

              <p className="max-w-[60ch] text-sm leading-relaxed text-[#D6D2C7] sm:text-base">
                Parrilla de carbón de encina y sarmiento, {OTZARRETA_SEATING_PRESET.interiorSalon.label.toLowerCase()} para{' '}
                {OTZARRETA_SEATING_PRESET.interiorSalon.standardRange} y hasta {OTZARRETA_SEATING_PRESET.totalPax}{' '}
                comensales en {OTZARRETA_SEATING_PRESET.exteriorGarden.label.toLowerCase()}, bajo la dirección de Eduardo Martínez.
              </p>

              {/* Tres insignias de gala: filo de 1 px semitransparente sobre
                  cristal, sentence case, sin iconos ni versalitas (Floor 9). */}
              <ul className="flex flex-wrap gap-2">
                {[
                  'Parrilla de carbón y sarmiento',
                  'Jardín y salón acristalado',
                  `Párking privado más de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas`,
                ].map((pill) => (
                  <li key={pill} className="hallmark-badge max-w-full text-left">
                    {pill}
                  </li>
                ))}
              </ul>

              {/* Botones transaccionales: full-width táctil en móvil (48 px),
                  fila compacta a partir de sm. */}
              <div className="flex w-full flex-col items-stretch gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={calendarBlockHref}
                  className="hallmark-btn-primary min-h-[48px] w-full px-4 text-center text-[0.8125rem] leading-tight sm:w-auto sm:px-6 sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] active:scale-[0.985] motion-reduce:active:scale-100"
                >
                  Asegurar fecha, fianza deducible {DEPOSITO_STRIPE_EUR} €
                </a>
                <a
                  href={calendarVisitHref}
                  className="hallmark-btn-secondary min-h-[48px] w-full px-4 text-center text-[0.8125rem] leading-tight sm:w-auto sm:px-6 sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 active:bg-white/[0.1] motion-reduce:transition-none"
                >
                  Reservar visita técnica
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Datos de la casa: una sola línea de hechos verificables. */}
        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 border-y border-white/[0.08] py-5 min-[400px]:grid-cols-2 sm:grid-cols-4">
          {[
            { term: 'Aforo', detail: `${OTZARRETA_SEATING_PRESET.totalPax} comensales máx.` },
            { term: 'Párking', detail: `más de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas cerradas` },
            { term: 'Menús', detail: OTZARRETA_WEDDING_MENUS_CLAIM },
            { term: 'Conserjería', detail: CENTRALITA_EAR_OS },
          ].map((fact) => (
            <div key={fact.term} className="min-w-0">
              <dt className="text-xs text-[#8E8A80]">{fact.term}</dt>
              <dd className="mt-1 text-sm font-semibold text-[#F4F1EA] [overflow-wrap:anywhere]">{fact.detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 max-w-[75ch] text-xs leading-relaxed text-[#8E8A80]">
          Línea directa de la casa {supplierLineMask(OTZARRETA_ENTITY.primaryPhone)} (verificada): se
          facilita al confirmar la visita técnica.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. CARTA DE MENÚS · REJILLA BENTO S-CLASS */}
      <BentoMenuSection blockHref={calendarBlockHref} contractHref={contractHref} />

      {/* 2. GALERÃA · RETIRADA EN W47_T02     */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* W47_T02 · sección 2 eliminada: galería duplicada que amputaba verticales como novios-1022x1536. */}


      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 2B. FICHA COMPLETA DEL VENUE — RESTAURANTE OTZARRETA (DERIO)  */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <EzkertzaVenueListing
        blockHref={calendarBlockHref}
        visitHref={calendarVisitHref}
        whatsappUrl={whatsappConciergeUrl}
      />

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 3. ANÁLISIS FINANCIERO: EAR OS VS DIRECTORIO PASIVO (SIN REBAJA) */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="mx-auto my-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-panel border border-[#ecb613]/30 bg-grad-gala p-5 shadow-elevation-3 sm:p-12 lg:p-16">
          {/* Resplandor perimetral de 1 px (anillo), jamás un orbe difuso:
              `shadow-2xl` + `rounded-full blur-[120px]` era fuga de estilo
              genérico (INV-21 / suelo 11 de Hallmark) y se retiró. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-panel shadow-perimeter-gold" />

          <div className="mx-auto mb-10 max-w-4xl space-y-4 text-center sm:mb-14">
            <div className="hallmark-badge max-w-full text-[#ecb613]">
              <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 text-left">Análisis de retorno de inversión · propuesta ejecutiva</span>
            </div>
            <h2 className="text-2xl font-syne font-extrabold leading-[1.08] tracking-display text-[#F4F1EA] [overflow-wrap:break-word] sm:text-4xl md:text-5xl">
              Por qué EAR OS rinde más que un directorio pasivo
              <span className="mt-2 block text-xl font-syne font-bold tracking-display text-[#ecb613] [overflow-wrap:break-word] sm:text-3xl md:text-4xl">
                Cero fuga de parejas y 126 landings propias
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#C9C4B8] sm:text-base">
              Un directorio pasivo cobra su cuota anual y te entrega un perfil entre miles.
              EAR OS te entrega un <strong className="text-[#F4F1EA]">activo tecnol&oacute;gico soberano</strong> que trabaja exclusivamente para ti las 24 horas del d&iacute;a.
            </p>
          </div>

          {/* Tabla / Grid comparativo de Alto Impacto */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Tarjeta directorio convencional (Modelo Alquiler Pasivo) */}
            <div className="relative flex min-w-0 flex-col justify-between space-y-6 rounded-3xl border border-red-500/25 bg-[#0e0a0a]/80 p-5 sm:p-8">
              <div className="space-y-5">
                <div className="space-y-3 border-b border-red-500/20 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-[#FF6B7D]">Modelo convencional</span>
                    <div className="rounded-pill border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs text-[#FF6B7D]">
                      Fuga de Clientes
                    </div>
                  </div>
                  <h3 className="text-xl font-syne font-bold leading-tight tracking-display text-[#F4F1EA] [overflow-wrap:break-word] sm:text-2xl">Directorio Convencional (Alquiler Pasivo)</h3>
                </div>

                <div className="space-y-4 text-xs text-gray-300 sm:text-sm">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">1 sola ficha compartida:</strong> Tu caserío compite en la misma página contra decenas de restaurantes y fincas de Bizkaia.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">Anuncios de tu competencia en tu perfil:</strong> Cuando una novia entra a ver Restaurante Otzarreta, la plataforma le recomienda fincas rivales en el lateral.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">Tú no eres dueño de los contactos:</strong> El portal custodia los datos; si dejas de pagar, pierdes todo tu histórico y tu posicionamiento.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">Presupuestos ciegos y lentos:</strong> Formularios genéricos que llegan a 10 restaurantes a la vez, obligándote a perder horas redactando cotizaciones que nunca responden.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">0% Garantía de Retorno:</strong> Pagas la cuota íntegra tanto si cierras 20 bodas como si cierras cero. Todo el riesgo económico es tuyo.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-red-500/20 text-xs font-mono text-red-300/80">
                Cuota anual íntegra del portal · Retorno incierto · Activo 0% tuyo
              </div>
            </div>

            {/* Tarjeta EAR OS (Activo Soberano) */}
            <div className="relative flex min-w-0 flex-col justify-between rounded-panel border-2 border-[#ecb613] bg-grad-gala p-5 shadow-perimeter-gold sm:p-8">
              <div className="hallmark-badge absolute right-4 -top-3.5 border-[#ecb613]/60 bg-[#ecb613] font-semibold text-[#120D00] sm:right-8">
                Recomendado
              </div>

              <div className="space-y-5">
                <div className="space-y-3 border-b border-[#ecb613]/30 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-[#ecb613]">Tecnología propia S-Class</span>
                    <div className="rounded-pill border border-[#ecb613]/40 bg-[#ecb613]/10 px-3 py-1 text-xs tabular-nums text-[#ecb613]">
                      <span className="font-syne font-bold">100 %</span> exclusivo
                    </div>
                  </div>
                  <h3 className="font-syne text-xl font-bold leading-tight tracking-display text-[#F4F1EA] [overflow-wrap:break-word] sm:text-2xl">EAR OS Engine (Activo Soberano)</h3>
                </div>

                <div className="space-y-4 text-xs text-gray-200 sm:text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">126 Landings Exclusivas y Propietarias:</strong> Páginas locales de intención en Derio, Bilbao, Txorierri (Loiu, Sondika, Zamudio, Lezama, Larrabetzu), Mungia, Uribe Kosta y Bizkaia central posicionadas en Google y motores IA (ChatGPT/Perplexity).
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">0% Fuga a Competidores:</strong> El 100% del tráfico, los clics y la atención de novios son para ti. Ni un solo anuncio ajeno.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">Cotizador con tu carta de gala vigente:</strong> Las parejas configuran su banquete al céntimo ({OTZARRETA_WEDDING_MENUS.map((menu) => `${menu.name.replace('Menú ', '')} ${formatOtzarretaMenuPrice(menu.priceEur) ?? 'a consultar'}`).join(', ')}).
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">Bloqueo Atómico con Depósito Stripe de 100 €:</strong> Depósito 100% deducible que filtra a los mirones y sella la fecha en exclusiva en tu calendario.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white">Leads filtrados y visibilidad medida:</strong> Cada petici&oacute;n llega pre-cualificada por la Conserjer&iacute;a (fecha, presupuesto y aforo verificados) antes de tocarte, con informe mensual de tr&aacute;fico y contactos entregados. Sin cuotas fijas ni letra peque&ntilde;a.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-[#ecb613]/30 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="min-w-0 text-xs font-mono text-[#ecb613]">
                  Tarifa equiparada a un directorio convencional · Leads filtrados y visibilidad medida
                </div>
                <SovereignWhatsAppButton
                  url={whatsappConciergeUrl}
                  providerName="Restaurante Otzarreta"
                  category="Finca y Banquetes"
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-5 py-2.5 text-xs font-extrabold text-black shadow-md shadow-[#ecb613]/20 transition-all hover:bg-[#ffe066] sm:w-auto"
                >
                  <span>Firmar Alianza Directa</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </SovereignWhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 4. SEDE GASTRONÓMICA: DERIO (BIZKAIA) */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="mx-auto my-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <span className="text-xs text-[#ecb613]">
            Enclave privilegiado en el País Vasco
          </span>
          <h2 className="font-syne text-2xl font-extrabold leading-tight tracking-display text-[#F4F1EA] [overflow-wrap:break-word] sm:text-4xl">
            Restaurante Otzarreta · Dirección Gastronómica de Eduardo Martínez (Derio)
          </h2>
          <p className="text-sm text-gray-400 sm:text-base">
            Espacio emblemático diseñado para celebraciones de ensueño: banquetes multitudinarios y bodas íntimas a tan solo 5 minutos del aeropuerto y 8 minutos de Bilbao.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          {OTZARRETA_ENTITY.affiliatedVenues.slice(0, 1).map((venue) => (
            <div
              key={venue.slug}
              className="min-w-0 space-y-6 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 shadow-2xl backdrop-blur-md transition-all hover:border-[#ecb613]/40 sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-white [overflow-wrap:break-word]">{venue.name}</h3>
                    <div className="text-xs text-[#ecb613] font-mono">{venue.municipality} ({venue.province})</div>
                  </div>
                </div>
                <span className="self-start whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-gray-300 sm:self-auto">
                  {venue.capacityPax} pax
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ecb613] shrink-0" />
                  <span>{venue.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {SOVEREIGN_DEMAND_CHANNEL.telDisplay} · {SOVEREIGN_DEMAND_CHANNEL.label}
                    <span className="block text-[11px] text-gray-500 font-mono mt-0.5">
                      Línea de la casa {supplierLineMask(venue.phones[0])} · se facilita al confirmar
                      la visita técnica
                    </span>
                  </span>
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono uppercase text-gray-400">Prestaciones Oficiales:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  {venue.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 5. EXPLORADOR INTERACTIVO DE EXPERIENCIAS & MENÃšS      */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 5. Ancla duplicada del cotizador eliminada en W47_T02: el cotizador vive en la ficha 2B. */}

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 6. RESEÃ‘AS REALES · RETIRADA EN W47_T02     */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 7. LA ALIANZA: EL CASERÍO & EDWIN AGUDELO        */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="mx-auto my-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-panel border border-white/[0.08] bg-grad-gala p-5 shadow-elevation-2 sm:p-12 lg:p-16">
          {/* Anillo perimetral de 1 px en lugar del orbe `blur-[100px]`. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-panel shadow-micro-border" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="min-w-0 space-y-6 lg:col-span-7">
              <div className="hallmark-badge max-w-full text-[#C9C4B8]">
                <Award className="h-3.5 w-3.5 shrink-0 text-[#ecb613]" aria-hidden="true" />
                <span className="min-w-0 text-left">Patrimonio y tradición desde 1902</span>
              </div>

              <h2 className="text-2xl font-syne font-extrabold leading-[1.12] tracking-display text-[#F4F1EA] [overflow-wrap:break-word] sm:text-4xl">
                Cuatro generaciones de alta cocina vasca
                <span className="mt-1 block text-lg text-[#ecb613] sm:text-2xl">Eduardo Martínez · Restaurante Otzarreta (Derio)</span>
              </h2>

              <p className="text-sm leading-relaxed text-[#C9C4B8] sm:text-base">
                Cuando <strong>Eduardo Martínez</strong> enciende las brasas en Restaurante Otzarreta en Derio, custodia más de
                un siglo de sabiduría en el trato de las carnes maduradas de ganado mayor, los rodaballos salvajes del Cantábrico a la brasa y la cocina de cazuela tradicional vasca.
              </p>

              <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                Cada banquete en el caserío cuenta con atención de sala personalizada, {OTZARRETA_WEDDING_MENUS_CLAIM} ({OTZARRETA_MENU_RANGE_LABEL} por comensal) elaborados al momento y salones insonorizados y climatizados con vistas a jardines botánicos.
              </p>

              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                <div className="min-w-0 space-y-1 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-xs text-[#ecb613]">La brasa de Eduardo</div>
                  <div className="text-sm font-bold text-white">Carbón de Encina y Sarmiento</div>
                  <p className="text-xs text-gray-400">
                    Cero catering recalentado en cubetas. Del fuego al plato de tus comensales.
                  </p>
                </div>

                <div className="min-w-0 space-y-1 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-xs text-[#ecb613]">Logística y confort</div>
                  <div className="text-sm font-bold text-white">Párking Privado más de {OTZARRETA_SEATING_PRESET.parkingSpaces} Plazas</div>
                  <p className="text-xs text-gray-400">
                    Recinto cerrado en Derio a 5 min del aeropuerto y 10 min de Bilbao.
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-4 lg:col-span-5">
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <img
                    src="https://www.ezkertzaberria.com/wp-content/uploads/elementor/thumbs/FIRMA-EDU-2-pd7ffeq4is8ls76r0oqflcg5itg2kf317ktmnwda8g.jpg"
                    alt="Firma de Eduardo Martínez · Dirección Gastronómica Restaurante Otzarreta"
                    className="h-12 shrink-0 rounded-lg bg-white/10 object-contain p-1"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white">Eduardo Martínez</h3>
                    <div className="text-xs text-[#ecb613] font-mono">Gerente & Maestro Asador</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  &ldquo;En nuestro caserío no admitimos atajos. El producto de primera calidad y el respeto a los comensales
                  son innegociables. Cada boda y banquete se atiende con la máxima solemnidad hostelera.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 8. MALLA DE DOMINANCIA: 126 LANDINGS ANTI-HUÃ‰RFANO     */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <details open={mallaDemo} className="group mx-auto my-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <summary className="mb-6 flex cursor-pointer list-none flex-col gap-2 rounded-3xl border border-[#ecb613]/25 bg-[#09090d]/80 p-5 transition-all duration-300 hover:border-[#ecb613]/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6">
          <span className="min-w-0 text-sm font-bold text-white">
            Malla de dominancia · {OTZARRETA_HUB.total} landings propietarias — demo interna de la alianza (oculta por defecto)
          </span>
          <span className="shrink-0 text-xs font-mono text-[#ecb613]">Mostrar / ocultar</span>
        </summary>
        <div className="hallmark-blueprint space-y-10 rounded-panel p-5 sm:p-12">
          <div className="space-y-2">
            <span className="text-xs text-[#ecb613]">
              Malla de dominancia · {OTZARRETA_HUB.total} páginas dedicadas
            </span>
            <h2 className="text-xl font-extrabold text-white [overflow-wrap:break-word] sm:text-3xl">
              {OTZARRETA_HUB.geoCount} Landings Geográficas + {OTZARRETA_HUB.intentCount} de Intención
            </h2>
            <p className="max-w-3xl text-xs text-gray-400 sm:text-sm">
              Cada enlace es una URL con entidad verificada detrás: {OTZARRETA_MUNICIPALITIES.length}{' '}
              municipios y comarcas de Bizkaia (Derio, Bilbao, Txorierri, Mungia, Uribe Kosta y Bizkaia central) × {OTZARRETA_HUB.groups.length} formatos de banquete,
              más las consultas con intención de reserva. Sin huérfanos: este hub reparte
              autoridad a todo el clúster.
            </p>
          </div>

          {OTZARRETA_HUB.groups.map((group) => (
            <div key={group.vertical.slug} className="space-y-3">
              <h3 className="text-xs text-[#ecb613]">
                {group.vertical.label} · {group.landings.length} municipios
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.landings.map((landing) => (
                  <Link
                    key={landing.slug}
                    href={landing.path}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 hover:text-white hover:border-[#ecb613]/50 hover:bg-[#ecb613]/5 transition-all duration-300 ease-out font-mono"
                  >
                    <span>{landing.municipalityName}</span>
                    <ArrowRight className="w-3 h-3 text-[#ecb613]" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-3 pt-2 border-t border-white/10">
            <h3 className="text-xs text-[#ecb613]">
              Intenciones provinciales en Bizkaia · {OTZARRETA_HUB.provinceIntents.length} URLs
            </h3>
            <div className="flex flex-wrap gap-2">
              {OTZARRETA_HUB.provinceIntents.map((landing) => (
                <Link
                  key={landing.slug}
                  href={landing.path}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 hover:text-white hover:border-[#ecb613]/50 hover:bg-[#ecb613]/5 transition-all duration-300 ease-out font-mono"
                >
                  <span>{landing.h1}</span>
                  <ArrowRight className="w-3 h-3 text-[#ecb613]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 9. GARANTÃA MUTUA: EL DEPÃ“SITO STRIPE DE 100 â‚¬         */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="mx-auto my-20 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <HorizonXGlow
          glowColor="gold"
          intensity="high"
          bordered={false}
          className="border border-amber-500/30 shadow-2xl shadow-amber-950/30"
        >
          <div className="space-y-6 p-5 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-white [overflow-wrap:break-word] sm:text-4xl">
            Bloquea Tu Fecha con {DEPOSITO_STRIPE_EUR} € Deducibles
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Sin cuotas abusivas ni riesgos. El depósito de garantía de <strong>{DEPOSITO_STRIPE_EUR} €</strong> sella la
            exclusividad de la fecha en el calendario oficial de Eduardo Martínez (Restaurante Otzarreta · Derio) y se descuenta al 100% de la liquidación final
            del banquete.
          </p>

          <div className="flex w-full flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href={calendarBlockHref}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-5 py-4 text-center text-sm font-extrabold text-black shadow-lg shadow-[#ecb613]/20 transition-all hover:bg-[#ffe066] sm:w-auto sm:px-8"
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              Bloquear Fecha en Exclusiva ({DEPOSITO_STRIPE_EUR} €)
            </a>

            <SovereignWhatsAppButton
              url={whatsappConciergeUrl}
              providerName="Restaurante Otzarreta"
              category="Finca y Banquetes"
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 text-center text-sm font-bold text-black shadow-lg transition-all hover:brightness-110 sm:w-auto sm:px-6"
            >
              <Phone className="w-4 h-4 shrink-0" />
              Hablar con Conserjería VIP
            </SovereignWhatsAppButton>
          </div>

            <div className="pt-4 text-xs text-gray-500 font-mono">
              Contrato respaldado por el Art. 1255 del Código Civil · Split Soberano 80/10/10 · Productora EAR
            </div>
          </div>
        </HorizonXGlow>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 10. DATOS DE CONTACTO & FICHA TÃ‰CNICA                  */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <footer className="mx-auto w-full max-w-7xl border-t border-white/10 px-4 pt-10 text-xs text-gray-400 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="min-w-0">
            <div className="font-bold text-white text-sm mb-1">Restaurante Otzarreta</div>
            <p>{OTZARRETA_ENTITY.affiliatedVenues[0].address}</p>
            <p className="mt-2 leading-relaxed text-gray-500">
              {supplierContactWithheldNotice('Restaurante Otzarreta')}
            </p>
          </div>

          <div className="min-w-0">
            <div className="font-bold text-white text-sm mb-1">Centralita Soberana Productora EAR</div>
            <p>Atención y Conserjería de Bodas: {CENTRALITA_EAR_OS}</p>
            <p className="mt-1">Párking privado cerrado más de {OTZARRETA_SEATING_PRESET.parkingSpaces} plazas</p>
            <p className="mt-1">Dirección Gastronómica: Eduardo Martínez</p>
            <p>Parrilla al carbón de encina y cocina de cazuela</p>
          </div>

          <div className="min-w-0 text-left md:text-right">
            <div className="font-bold text-white text-sm mb-1">Restaurante Otzarreta · Derio</div>
            <p>Bizkaia / Txorierri · Asador & Finca de Banquetes</p>
            <p className="mt-1">{OTZARRETA_WEDDING_MENUS_CLAIM}</p>
            <p>© {new Date().getFullYear()} Restaurante Otzarreta & Productora EAR</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

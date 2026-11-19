import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Award,
  Phone,
  Sparkles,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { OTZARRETA_ENTITY } from '@/lib/constants/otzarreta-entity';
import {
  SOVEREIGN_DEMAND_CHANNEL,
  buildDemandWhatsappUrl,
  sanitizeSchemaContact,
  supplierContactWithheldNotice,
  supplierLineMask
} from '@/lib/providers/sovereign-lead-gate';
import { EzkertzaVenueLanding as EzkertzaVenueListing } from '@/components/otzarreta/EzkertzaVenueLanding';
import { SovereignWhatsAppButton } from '@/components/shared/SovereignWhatsAppButton';
import {
  AudioReactiveVisualizer,
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

export const metadata: Metadata = {
  title: 'Restaurante Otzarreta | Bodas, Asador & Banquetes en Derio (Bizkaia)',
  description:
    'Banquetes nupciales exclusivos para hasta 350 comensales en caserío tradicional con jardines, carpa para ceremonias civiles y parrilla al carbón de encina y sarmiento de Eduardo Martínez. Parking privado cerrado de 150 plazas. Menús oficiales 2026 desde 100 € a 185 € + IVA.',
  alternates: {
    canonical: 'https://productoraear.com/otzarreta'
  },
  openGraph: {
    title: 'Restaurante Otzarreta | Bodas, Asador & Banquetes de Gala en Derio',
    description:
      'Caserío vasco con capacidad para 350 comensales, parking privado de 150 plazas, jardines y alta parrilla al carbón. Menús de boda oficiales desde 100 €.',
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
          'Caserío tradicional vasco para banquetes de boda y eventos corporativos para hasta 350 comensales con parrilla al carbón de Eduardo Martínez.',
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
        maximumAttendeeCapacity: 350,
        smokingAllowed: false,
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Jardines para Ceremonia Civil con Carpa', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Parrilla al Carbón de Encina', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Salones Climatizados e Insonorizados', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Parking Privado Gratuito 150 Plazas', value: true },
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
  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-28 pb-24 overflow-x-hidden">
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
      {/* 1. HERO S-CLASS CINEMATOGRÃFICO                        */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="space-y-6 text-center max-w-4xl mx-auto">
          {/* Badge de Gastronomía Soberana */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-[#ecb613]/10 to-amber-500/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider shadow-lg shadow-[#ecb613]/5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>ALTA GASTRONOMÍA VASCA & BRASAS · DERIO (BIZKAIA)</span>
          </div>

          <div className="flex justify-center mb-2">
            <img
              src="https://www.ezkertzaberria.com/wp-content/uploads/2021/04/LOGO-EZKERTZA-2.jpg"
              alt="Logo Oficial Restaurante Otzarreta"
              className="h-16 sm:h-20 object-contain rounded-xl bg-white/5 p-2 border border-white/10"
            />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans leading-[1.08]">
            Restaurante Otzarreta
            <span className="block text-xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] font-serif italic font-normal mt-2">
              Parrilla Vasca de Autor & Banquetes Nupciales en Derio
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            El caserío definitivo para bodas inolvidables: <strong>350 comensales</strong> en comedores climatizados e insonorizados,
            jardines botánicos con carpa y oficiante civil, parking privado gratuito de <strong>150 plazas</strong> y la auténtica parrilla al
            carbón de encina de <strong>Eduardo Martínez (Dirección Gastronómica de Restaurante Otzarreta)</strong>.
          </p>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={calendarBlockHref}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] text-black font-extrabold text-sm sm:text-base hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/25 flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CreditCard className="w-5 h-5" />
              <span>Bloquear Fecha con {DEPOSITO_STRIPE_EUR} € (Deducible)</span>
            </a>

            <SovereignWhatsAppButton
              url={whatsappConciergeUrl}
              providerName="Restaurante Otzarreta"
              category="Finca y Banquetes"
              className="px-6 py-4 rounded-2xl bg-[#09090d]/80 text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-all border border-white/15 flex items-center gap-2.5 backdrop-blur-md"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Hablar con Conserjería VIP</span>
            </SovereignWhatsAppButton>

            <a
              href={calendarVisitHref}
              className="px-6 py-4 rounded-2xl bg-[#00E5FF]/10 text-[#7DF0FF] font-semibold text-sm sm:text-base hover:bg-[#00E5FF]/20 transition-all border border-[#00E5FF]/40 flex items-center gap-2.5 backdrop-blur-md"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Solicitar visita técnica</span>
            </a>

            <Link
              href={contractHref}
              className="text-[11px] font-mono text-zinc-400 hover:text-[#ecb613] underline decoration-dotted underline-offset-4 transition-colors"
            >
              Ver condiciones del depósito deducible ({DEPOSITO_STRIPE_EUR} €) y split 80/10/10
            </Link>
          </div>

          {/* PEAJE SOBERANO: canal Ãºnico y lÃ­nea del recinto protegida */}
          <p className="max-w-3xl mx-auto text-[11px] sm:text-xs text-gray-500 font-mono leading-relaxed pt-1">
            Conserjería única: {SOVEREIGN_DEMAND_CHANNEL.telDisplay} · Línea directa de la casa{' '}
            {supplierLineMask(OTZARRETA_ENTITY.primaryPhone)} (verificada) — se facilita al confirmar
            la visita técnica.
          </p>

          {/* Micro TelemetrÃ­a de GarantÃ­a */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>Santo Domingo Hiribidea, 13 · Derio (Bizkaia)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Aforo Oficial: 350 Comensales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acústica Legal Homologada (Ley 37/2003)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Split Soberano 80/10/10</span>
            </div>
          </div>
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 2. GALERÃA · RETIRADA EN W47_T02     */}
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-24">
        <div className="rounded-3xl bg-gradient-to-b from-[#0e0e14] via-[#09090d] to-[#050507] border border-[#ecb613]/30 p-8 sm:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-amber-950/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-4 text-center max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#ecb613]" />
              <span>ANÁLISIS DE RETORNO DE INVERSIÓN (ROI) · PROPUESTA EJECUTIVA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Por Qué EAR OS Rinde Más que un Directorio Pasivo
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] text-2xl sm:text-4xl mt-2 font-serif italic">
                Cero Fuga de Parejas y 126 Landings Propias
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Un directorio pasivo cobra su cuota anual y te entrega un perfil entre miles.
              EAR OS te entrega un <strong>activo tecnol&oacute;gico soberano</strong> que trabaja exclusivamente para ti las 24 horas del d&iacute;a.
            </p>
          </div>

          {/* Tabla / Grid comparativo de Alto Impacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Tarjeta directorio convencional (Modelo Alquiler Pasivo) */}
            <div className="rounded-3xl bg-[#0e0a0a]/80 border border-red-500/25 p-8 space-y-6 relative flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider">MODELO CONVENCIONAL</span>
                    <h3 className="text-2xl font-bold text-white">Directorio Convencional (Alquiler Pasivo)</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    Fuga de Clientes
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">1 sola ficha compartida:</strong> Tu caserío compite en la misma página contra decenas de restaurantes y fincas de Bizkaia.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Anuncios de tu competencia en tu perfil:</strong> Cuando una novia entra a ver Restaurante Otzarreta, la plataforma le recomienda fincas rivales en el lateral.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Tú no eres dueño de los contactos:</strong> El portal custodia los datos; si dejas de pagar, pierdes todo tu histórico y tu posicionamiento.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Presupuestos ciegos y lentos:</strong> Formularios genéricos que llegan a 10 restaurantes a la vez, obligándote a perder horas redactando cotizaciones que nunca responden.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
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
            <div className="rounded-3xl bg-gradient-to-b from-[#141209] to-[#09090d] border-2 border-[#ecb613] p-8 space-y-6 relative flex flex-col justify-between shadow-xl shadow-[#ecb613]/10">
              <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-[#ecb613] text-black font-extrabold text-xs tracking-wider uppercase shadow-md">
                RECOMENDADO
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#ecb613]/30 pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">TECNOLOGÍA PROPIA S-CLASS</span>
                    <h3 className="text-2xl font-bold text-white">EAR OS Engine (Activo Soberano)</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono">
                    100% Exclusivo
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-gray-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">126 Landings Exclusivas y Propietarias:</strong> Páginas locales de intención en Derio, Bilbao, Txorierri (Loiu, Sondika, Zamudio, Lezama, Larrabetzu), Mungia, Uribe Kosta y Bizkaia central posicionadas en Google y motores IA (ChatGPT/Perplexity).
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">0% Fuga a Competidores:</strong> El 100% del tráfico, los clics y la atención de novios son para ti. Ni un solo anuncio ajeno.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Cotizador con tus 7 Menús Oficiales:</strong> Las parejas configuran su banquete al céntimo (Cantábrico 100 €, Paloma 125 €, Imperial 123,40 €, Temporada 142,50 €, Vasco 138 €, Ezkertza 155 €, Caserío Beko 173 €).
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Bloqueo Atómico con Depósito Stripe de 100 €:</strong> Depósito 100% deducible que filtra a los mirones y sella la fecha en exclusiva en tu calendario.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Leads filtrados y visibilidad medida:</strong> Cada petici&oacute;n llega pre-cualificada por la Conserjer&iacute;a (fecha, presupuesto y aforo verificados) antes de tocarte, con informe mensual de tr&aacute;fico y contactos entregados. Sin cuotas fijas ni letra peque&ntilde;a.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#ecb613]/30 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-[#ecb613]">
                  Tarifa equiparada a un directorio convencional · Leads filtrados y visibilidad medida
                </div>
                <SovereignWhatsAppButton
                  url={whatsappConciergeUrl}
                  providerName="Restaurante Otzarreta"
                  category="Finca y Banquetes"
                  className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs hover:bg-[#ffe066] transition-all flex items-center gap-2 shadow-md shadow-[#ecb613]/20"
                >
                  <span>Firmar Alianza Directa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </SovereignWhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 4. SEDE GASTRONÓMICA: DERIO (BIZKAIA) */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            ENCLAVE PRIVILEGIADO EN EL PAÍS VASCO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Restaurante Otzarreta · Dirección Gastronómica de Eduardo Martínez (Derio)
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Espacio emblemático diseñado para celebraciones de ensueño: banquetes multitudinarios y bodas íntimas a tan solo 5 minutos del aeropuerto y 8 minutos de Bilbao.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {OTZARRETA_ENTITY.affiliatedVenues.slice(0, 1).map((venue) => (
            <div
              key={venue.slug}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-6 backdrop-blur-md hover:border-[#ecb613]/40 transition-all shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{venue.name}</h3>
                    <div className="text-xs text-[#ecb613] font-mono">{venue.municipality} ({venue.province})</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
        <div className="rounded-3xl bg-gradient-to-b from-[#09090d]/90 to-[#050507] border border-white/10 p-8 sm:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#ecb613]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                <Award className="w-3.5 h-3.5 text-[#ecb613]" />
                <span>PATRIMONIO & TRADICIÓN DESDE 1902</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Cuatro Generaciones de Alta Cocina Vasca:
                <span className="block text-[#ecb613]">Eduardo Martínez · Restaurante Otzarreta (Derio)</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Cuando <strong>Eduardo Martínez</strong> enciende las brasas en Restaurante Otzarreta en Derio, custodia más de
                un siglo de sabiduría en el trato de las carnes maduradas de ganado mayor, los rodaballos salvajes del Cantábrico a la brasa y la cocina de cazuela tradicional vasca.
              </p>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Cada banquete en el caserío cuenta con atención de sala personalizada, menús canónicos de 100 € a 185 € + IVA elaborados al momento y salones insonorizados y climatizados con vistas a jardines botánicos.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-amber-400 uppercase">La Brasa de Eduardo</div>
                  <div className="text-sm font-bold text-white">Carbón de Encina y Sarmiento</div>
                  <p className="text-xs text-gray-400">
                    Cero catering recalentado en cubetas. Del fuego al plato de tus comensales.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-[#ecb613] uppercase">Logística & Confort</div>
                  <div className="text-sm font-bold text-white">Párking Privado 150 Plazas</div>
                  <p className="text-xs text-gray-400">
                    Recinto cerrado en Derio a 5 min del aeropuerto y 10 min de Bilbao.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://www.ezkertzaberria.com/wp-content/uploads/elementor/thumbs/FIRMA-EDU-2-pd7ffeq4is8ls76r0oqflcg5itg2kf317ktmnwda8g.jpg"
                    alt="Firma de Eduardo Martínez · Dirección Gastronómica Restaurante Otzarreta"
                    className="h-12 object-contain bg-white/10 rounded-lg p-1"
                  />
                  <div>
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
      <details open={mallaDemo} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20 group">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-4 rounded-3xl border border-[#ecb613]/25 bg-[#09090d]/80 p-6 mb-6 transition-all duration-300 hover:border-[#ecb613]/50">
          <span className="text-sm font-bold text-white">
            Malla de dominancia · {OTZARRETA_HUB.total} landings propietarias — demo interna de la alianza (oculta por defecto)
          </span>
          <span className="text-xs font-mono text-[#ecb613] shrink-0">Mostrar / ocultar</span>
        </summary>
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-12 backdrop-blur-md space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
              MALLA DE DOMINANCIA · {OTZARRETA_HUB.total} PÁGINAS DEDICADAS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {OTZARRETA_HUB.geoCount} Landings Geográficas + {OTZARRETA_HUB.intentCount} de Intención
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-3xl">
              Cada enlace es una URL con entidad verificada detrás: {OTZARRETA_MUNICIPALITIES.length}{' '}
              municipios y comarcas de Bizkaia (Derio, Bilbao, Txorierri, Mungia, Uribe Kosta y Bizkaia central) × {OTZARRETA_HUB.groups.length} formatos de banquete,
              más las consultas con intención de reserva. Sin huérfanos: este hub reparte
              autoridad a todo el clúster.
            </p>
          </div>

          {OTZARRETA_HUB.groups.map((group) => (
            <div key={group.vertical.slug} className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
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
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto my-20">
        <HorizonXGlow
          glowColor="gold"
          intensity="high"
          bordered={false}
          className="border border-amber-500/30 shadow-2xl shadow-amber-950/30"
        >
          <div className="p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Bloquea Tu Fecha con {DEPOSITO_STRIPE_EUR} € Deducibles
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sin cuotas abusivas ni riesgos. El depósito de garantía de <strong>{DEPOSITO_STRIPE_EUR} €</strong> sella la
            exclusividad de la fecha en el calendario oficial de Eduardo Martínez (Restaurante Otzarreta · Derio) y se descuenta al 100% de la liquidación final
            del banquete.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={calendarBlockHref}
              className="px-8 py-4 rounded-xl bg-[#ecb613] text-black font-extrabold text-sm hover:bg-[#ffe066] transition-all flex items-center gap-2 shadow-lg shadow-[#ecb613]/20"
            >
              <CreditCard className="w-4 h-4" />
              Bloquear Fecha en Exclusiva ({DEPOSITO_STRIPE_EUR} €)
            </a>

            <SovereignWhatsAppButton
              url={whatsappConciergeUrl}
              providerName="Restaurante Otzarreta"
              category="Finca y Banquetes"
              className="px-6 py-4 rounded-xl bg-[#25D366] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
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
      <footer className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 border-t border-white/10 text-xs text-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-white text-sm mb-1">Restaurante Otzarreta</div>
            <p>Sede Bizkaia: {OTZARRETA_ENTITY.affiliatedVenues[0].address}</p>
            <p className="mt-2 text-gray-500 leading-relaxed">
              {supplierContactWithheldNotice('Restaurante Otzarreta')}
            </p>
          </div>

          <div>
            <div className="font-bold text-white text-sm mb-1">Centralita Soberana Productora EAR</div>
            <p>Atención y Conserjería de Bodas: {CENTRALITA_EAR_OS}</p>
            <p className="mt-1">Párking privado cerrado 150 plazas</p>
            <p className="mt-1">Dirección Gastronómica: Eduardo Martínez</p>
            <p>Parrilla al carbón de encina y cocina de cazuela</p>
          </div>

          <div className="text-right">
            <div className="font-bold text-white text-sm mb-1">Restaurante Otzarreta · Derio</div>
            <p>Bizkaia / Txorierri · Asador & Finca de Banquetes</p>
            <p className="mt-1">Menús oficiales de 100 € a 185 € + IVA</p>
            <p>© {new Date().getFullYear()} Restaurante Otzarreta & Productora EAR</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

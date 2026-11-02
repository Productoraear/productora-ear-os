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
  Star,
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
import { OtzarretaExperienceExplorer } from '@/components/otzarreta/OtzarretaExperienceExplorer';
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
  title: 'Restaurante Ezkertza Berria & Otzarreta | Bodas & Banquetes en Bizkaia y Gipuzkoa',
  description:
    'Banquetes nupciales exclusivos para hasta 350 comensales en caserÃ­o tradicional con jardines, carpa para ceremonias civiles y parrilla al carbÃ³n de encina. ValoraciÃ³n 4,8/5 sobre 23 opiniones (el 96% de las parejas lo recomienda). MenÃºs oficiales 2026 desde 100 â‚¬ + IVA y sonorizaciÃ³n homologada Bose S-Class.',
  alternates: {
    canonical: 'https://productoraear.com/otzarreta'
  },
  openGraph: {
    title: 'Ezkertza Berria & Otzarreta | Bodas & Banquetes de Gala',
    description:
      'CaserÃ­o vasco con capacidad para 350 comensales, parking privado 150 plazas, jardines y alta parrilla al carbÃ³n. MenÃºs de boda oficiales desde 100 â‚¬.',
    url: 'https://productoraear.com/otzarreta',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Restaurante Jatetxea Ezkertza Berria Â· Fachada Principal del CaserÃ­o'
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
        name: 'Restaurante Jatetxea Ezkertza Berria & Otzarreta',
        alternateName: 'Ezkertza Berria Jatetxea',
        description:
          'CaserÃ­o tradicional vasco para banquetes de boda y eventos corporativos para hasta 350 comensales en alianza con Productora EAR.',
        url: 'https://productoraear.com/otzarreta',
        // PEAJE SOBERANO: la lÃ­nea del recinto NO viaja en el JSON-LD. El
        // saneador (`sanitizeSchemaContact`) inyecta el punto de contacto de la
        // ConserjerÃ­a EAR OS en el render.
        servesCuisine: ['Basque', 'Parrilla', 'Traditional Spanish', 'Seafood', 'Asador'],
        priceRange: 'â‚¬â‚¬â‚¬',
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
          { '@type': 'LocationFeatureSpecification', name: 'Parrilla al CarbÃ³n de Encina', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Salones Climatizados e Insonorizados', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Parking Privado Gratuito 150 Plazas', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Parque Infantil con Columpios Homologados', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Accesibilidad Total PMR con Ascensor', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'SonorizaciÃ³n Bose F1 Homologada (Ley 37/2003)', value: true }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://productoraear.com/' },
          { '@type': 'ListItem', position: 2, name: 'PaÃ­s Vasco', item: 'https://productoraear.com/bodas/guipuzcoa' },
          { '@type': 'ListItem', position: 3, name: 'Ezkertza Berria & Otzarreta', item: 'https://productoraear.com/otzarreta' }
        ]
      }
    ]
  };

  const whatsappConciergeUrl = buildDemandWhatsappUrl({
    entityName: 'Ezkertza Berria & Otzarreta',
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
      {/* Script Estructurado JSON-LD (saneado: cero lÃ­neas de proveedor) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            sanitizeSchemaContact(jsonLd, 'Derio (Bizkaia) & Zarautz (Gipuzkoa)')
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
          {/* Badge de Alianza Exclusiva */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-[#ecb613]/10 to-amber-500/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider shadow-lg shadow-[#ecb613]/5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>ALIANZA ESTRATÉGICA · EL CASERÍO & EDWIN AGUDELO</span>
          </div>

          <div className="flex justify-center mb-2">
            <img
              src="https://www.ezkertzaberria.com/wp-content/uploads/2021/04/LOGO-EZKERTZA-2.jpg"
              alt="Logo Oficial Ezkertza Berria Jatetxea"
              className="h-16 sm:h-20 object-contain rounded-xl bg-white/5 p-2 border border-white/10"
            />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans leading-[1.08]">
            Ezkertza Berria & Otzarreta
            <span className="block text-xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] font-serif italic font-normal mt-2">
              Parrilla Vasca de Autor & Banquetes Nupciales en Derio y Zarautz
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            El caserÃ­o definitivo para bodas inolvidables: <strong>350 comensales</strong> en comedores climatizados e insonorizados,
            jardines botÃ¡nicos con carpa y oficiante civil, parking privado gratuito de <strong>150 plazas</strong> y la autÃ©ntica parrilla al
            carbÃ³n de encina de <strong>la Dirección Gastronómica</strong>, con sonorizaciÃ³n homologada Bose S-Class de Productora EAR.
          </p>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={calendarBlockHref}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] text-black font-extrabold text-sm sm:text-base hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/25 flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CreditCard className="w-5 h-5" />
              <span>Bloquear Fecha con {DEPOSITO_STRIPE_EUR} â‚¬ (Deducible)</span>
            </a>

            <a
              href={whatsappConciergeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-[#09090d]/80 text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-all border border-white/15 flex items-center gap-2.5 backdrop-blur-md"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Hablar con ConserjerÃ­a VIP</span>
            </a>

            <a
              href={calendarVisitHref}
              className="px-6 py-4 rounded-2xl bg-[#00E5FF]/10 text-[#7DF0FF] font-semibold text-sm sm:text-base hover:bg-[#00E5FF]/20 transition-all border border-[#00E5FF]/40 flex items-center gap-2.5 backdrop-blur-md"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Solicitar visita tÃ©cnica</span>
            </a>

            <Link
              href={contractHref}
              className="text-[11px] font-mono text-zinc-400 hover:text-[#ecb613] underline decoration-dotted underline-offset-4 transition-colors"
            >
              Ver condiciones del depÃ³sito deducible ({DEPOSITO_STRIPE_EUR} â‚¬) y split 80/10/10
            </Link>
          </div>

          {/* PEAJE SOBERANO: canal Ãºnico y lÃ­nea del recinto protegida */}
          <p className="max-w-3xl mx-auto text-[11px] sm:text-xs text-gray-500 font-mono leading-relaxed pt-1">
            ConserjerÃ­a Ãºnica: {SOVEREIGN_DEMAND_CHANNEL.telDisplay} Â· LÃ­nea directa de la casa{' '}
            {supplierLineMask(OTZARRETA_ENTITY.primaryPhone)} (verificada) â€” se facilita al confirmar
            la visita tÃ©cnica.
          </p>

          {/* Micro TelemetrÃ­a de GarantÃ­a */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>Derio (Bizkaia) & Zarautz (Gipuzkoa)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Aforo Oficial: 350 Comensales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AcÃºstica Legal Homologada (Ley 37/2003)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Split Soberano 80/10/10</span>
            </div>
          </div>
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 2. GALERÃA VISUAL DE ACTIVOS OFICIALES VAMPIRIZADOS     */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Foto Principal: Fachada CaserÃ­o */}
          <div className="md:col-span-2 relative h-80 md:h-[460px] rounded-3xl overflow-hidden border border-white/10 group">
            <img
              src="https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg"
              alt="Fachada Principal del CaserÃ­o Ezkertza Berria en Derio (Bizkaia)"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
              <div>
                <span className="text-[11px] font-mono text-[#ecb613] uppercase tracking-wider">
                  CASERÃO DEL SIGLO XX Â· DERIO (BIZKAIA)
                </span>
                <h3 className="text-xl font-bold text-white">Instalaciones Exclusivas para 350 Personas</h3>
                <p className="text-xs text-gray-300">A 8 minutos del centro de Bilbao y 5 minutos del aeropuerto con parking para 150 coches</p>
              </div>
            </div>
          </div>

          {/* Dos fotos columna centro */}
          <div className="space-y-4 md:col-span-1">
            <div className="relative h-44 md:h-[218px] rounded-3xl overflow-hidden border border-white/10 group">
              <img
                src="https://www.ezkertzaberria.com/wp-content/uploads/2021/05/DSC03860-scaled.jpg"
                alt="Comedores Climatizados e Insonorizados de Ezkertza Berria"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">Salones Climatizados Insonorizados</span>
              </div>
            </div>

            <div className="relative h-44 md:h-[218px] rounded-3xl overflow-hidden border border-white/10 group">
              <img
                src="https://www.ezkertzaberria.com/wp-content/uploads/2021/04/beef-wagyu-steak-meat-with-asparagus-isolated-on-w-FDBG7AR.png"
                alt="ChuletÃ³n y parrilla de carbÃ³n de encina de ganado mayor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-black/40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">CarbÃ³n de Encina & Ganado Mayor</span>
              </div>
            </div>
          </div>

          {/* Foto Derecha: Novios y JardÃ­n */}
          <div className="relative h-80 md:h-[460px] rounded-3xl overflow-hidden border border-white/10 group md:col-span-1">
            <img
              src="https://www.ezkertzaberria.com/wp-content/uploads/2021/06/novios-1022x1536.jpg"
              alt="Ceremonia Civil en Jardines al Aire Libre"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-6">
              <div>
                <span className="text-[11px] font-mono text-[#ecb613] uppercase tracking-wider">
                  CEREMONIA & CÃ“CTEL
                </span>
                <h3 className="text-base font-bold text-white">Jardines & Carpa Civil</h3>
                <p className="text-xs text-gray-300">Oficiante, mÃºsica en vivo y zona Chill Out</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 2B. FICHA COMPLETA DEL VENUE â€” EZKERTZA BERRIA (DERIO)  */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <EzkertzaVenueListing
        blockHref={calendarBlockHref}
        visitHref={calendarVisitHref}
        whatsappUrl={whatsappConciergeUrl}
      />

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 3. ANÃLISIS FINANCIERO: EAR OS VS DIRECTORIO PASIVO (SIN REBAJA) */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-24">
        <div className="rounded-3xl bg-gradient-to-b from-[#0e0e14] via-[#09090d] to-[#050507] border border-[#ecb613]/30 p-8 sm:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-amber-950/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-4 text-center max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#ecb613]" />
              <span>ANÃLISIS DE RETORNO DE INVERSIÃ“N (ROI) Â· PROPUESTA EJECUTIVA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Por QuÃ© EAR OS Rinde MÃ¡s que un Directorio Pasivo
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
                      <strong className="text-white">1 sola ficha compartida:</strong> Tu caserÃ­o compite en la misma pÃ¡gina contra 400 restaurantes y fincas de Bizkaia y Gipuzkoa.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Anuncios de tu competencia en tu perfil:</strong> Cuando una novia entra a ver Ezkertza Berria, la plataforma le recomienda fincas rivales en el lateral.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">TÃº no eres dueÃ±o de los contactos:</strong> El portal custodia los datos; si dejas de pagar, pierdes todo tu histÃ³rico y tu posicionamiento.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Presupuestos ciegos y lentos:</strong> Formularios genÃ©ricos que llegan a 10 restaurantes a la vez, obligÃ¡ndote a perder horas redactando cotizaciones que nunca responden.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">0% GarantÃ­a de Retorno:</strong> Pagas la cuota Ã­ntegra tanto si cierras 20 bodas como si cierras cero. Todo el riesgo econÃ³mico es tuyo.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-red-500/20 text-xs font-mono text-red-300/80">
                Cuota anual &iacute;ntegra del portal Â· Retorno incierto Â· Activo 0% tuyo
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
                    <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">TECNOLOGÃA PROPIA S-CLASS</span>
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
                      <strong className="text-white">126 Landings Exclusivas y Propietarias:</strong> 72 pÃ¡ginas locales (18 municipios de Bizkaia y Gipuzkoa) + 54 de intenciÃ³n posicionadas en Google y motores IA (ChatGPT/Perplexity).
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">0% Fuga a Competidores:</strong> El 100% del trÃ¡fico, los clics y la atenciÃ³n de novios son para ti. Ni un solo anuncio ajeno.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Cotizador con tus 7 MenÃºs Oficiales:</strong> Las parejas configuran su banquete al cÃ©ntimo (CantÃ¡brico 100â‚¬, Paloma 125â‚¬, Imperial 123,40â‚¬, Temporada 142,50â‚¬, Vasco 138â‚¬, Ezkertza 155â‚¬, CaserÃ­o Beko 173â‚¬).
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Bloqueo AtÃ³mico con DepÃ³sito Stripe de 100 â‚¬:</strong> DepÃ³sito 100% deducible que filtra a los mirones y sella la fecha en exclusiva en tu calendario.
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
                  Tarifa equiparada a un directorio convencional Â· Leads filtrados y visibilidad medida
                </div>
                <a
                  href={whatsappConciergeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs hover:bg-[#ffe066] transition-all flex items-center gap-2 shadow-md shadow-[#ecb613]/20"
                >
                  <span>Firmar Alianza Directa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 4. SEDES DEL GRUPO: DERIO (BIZKAIA) & ZARAUTZ (GIPUZKOA)*/}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            DOS ENCLAVES PRIVILEGIADOS EN EL PAÃS VASCO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Las Sedes de la Dirección Gastronómica
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Dos espacios emblemÃ¡ticos diseÃ±ados para celebraciones de ensueÃ±o, desde bodas Ã­ntimas en la costa hasta banquetes multitudinarios a 5 minutos del aeropuerto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OTZARRETA_ENTITY.affiliatedVenues.map((venue) => (
            <div
              key={venue.slug}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-6 backdrop-blur-md hover:border-[#ecb613]/40 transition-all"
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
                    {SOVEREIGN_DEMAND_CHANNEL.telDisplay} Â· {SOVEREIGN_DEMAND_CHANNEL.label}
                    <span className="block text-[11px] text-gray-500 font-mono mt-0.5">
                      LÃ­nea de la casa {supplierLineMask(venue.phones[0])} Â· se facilita al confirmar
                      la visita tÃ©cnica
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            PROPUESTA GASTRONÃ“MICA OFICIAL 2026 & HARDWARE S-CLASS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            DiseÃ±a Tu Banquete al CÃ©ntimo
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Explora nuestros 7 menÃºs oficiales de boda, menÃºs de comuniÃ³n y grupos. Cotiza en tiempo real segÃºn el nÃºmero de comensales y verifica el blindaje acÃºstico.
          </p>
        </div>

        <OtzarretaExperienceExplorer />
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 6. RESEÃ‘AS REALES DE CLIENTES (GOOGLE LOCAL GUIDES)     */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            TESTIMONIOS REALES Y VERIFICADOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Lo Que Dicen Quienes Ya Han Celebrado con Nosotros
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OTZARRETA_ENTITY.reviews.slice(0, 3).map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-sm font-bold text-white">{rev.author}</div>
                <div className="text-xs text-[#ecb613] font-mono">{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
                <span>LA HISTORIA TRAS LA ALIANZA</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Dos Maestros, Una VisiÃ³n Soberana:
                <span className="block text-[#ecb613]">la Dirección Gastronómica & Edwin Agudelo</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Cuando <strong>la Dirección Gastronómica</strong> enciende las brasas en Ezkertza Berria y Otzarreta, custodia mÃ¡s de
                dos dÃ©cadas de sabidurÃ­a en el trato de las carnes seleccionadas de ganado mayor, los rodaballos salvajes del CantÃ¡brico y la cocina de cazuela tradicional.
              </p>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Su alianza con <strong>Edwin Agudelo</strong>, tenor lÃ­rico de conservatorio y fundador de Productora EAR,
                garantiza que cada banquete disfrute de un estÃ¡ndar impecable de sonorizaciÃ³n conforme a la <strong>Ley 37/2003 de Ruido</strong>,
                sin cortes intempestivos ni sanciones municipales.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-amber-400 uppercase">La Brasa de Eduardo</div>
                  <div className="text-sm font-bold text-white">CarbÃ³n de Encina al Minuto</div>
                  <p className="text-xs text-gray-400">
                    Cero catering recalentado en cubetas. Del fuego al plato de tus invitados.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-[#ecb613] uppercase">La AcÃºstica de Edwin</div>
                  <div className="text-sm font-bold text-white">Hardware Bose S-Class (12 W/pax)</div>
                  <p className="text-xs text-gray-400">
                    SonorizaciÃ³n calibrada con limitador telemÃ¡tico y fiesta garantizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://www.ezkertzaberria.com/wp-content/uploads/elementor/thumbs/FIRMA-EDU-2-pd7ffeq4is8ls76r0oqflcg5itg2kf317ktmnwda8g.jpg"
                    alt="Firma la Dirección Gastronómica"
                    className="h-12 object-contain bg-white/10 rounded-lg p-1"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">la Dirección Gastronómica</h3>
                    <div className="text-xs text-[#ecb613] font-mono">Gerente & Maestro Asador</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  &ldquo;En nuestros caserÃ­os no admitimos atajos. El producto de primera calidad y el respeto a los comensales
                  son innegociables. Esta alianza con Edwin blinda cada boda con la mÃ¡xima seriedad.&rdquo;
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg font-mono">
                    EA
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Edwin Agudelo</h3>
                    <div className="text-xs text-emerald-400 font-mono">Tenor Solista & Fundador Productora EAR</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  &ldquo;Eduardo es un amigo y un anfitriÃ³n extraordinario. Poner la infraestructura de Productora EAR y mi voz al
                  servicio de sus banquetes es la garantÃ­a definitiva de excelencia para las parejas.&rdquo;
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
              MALLA DE DOMINANCIA Â· {OTZARRETA_HUB.total} PÃGINAS DEDICADAS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {OTZARRETA_HUB.geoCount} Landings GeogrÃ¡ficas + {OTZARRETA_HUB.intentCount} de IntenciÃ³n
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-3xl">
              Cada enlace es una URL con entidad verificada detrÃ¡s: {OTZARRETA_MUNICIPALITIES.length}{' '}
              municipios reales de Gipuzkoa y Bizkaia Ã— {OTZARRETA_HUB.groups.length} formatos de banquete,
              mÃ¡s las consultas con intenciÃ³n de reserva. Sin huÃ©rfanos: este hub reparte
              autoridad a todo el clÃºster.
            </p>
          </div>

          {OTZARRETA_HUB.groups.map((group) => (
            <div key={group.vertical.slug} className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
                {group.vertical.label} Â· {group.landings.length} municipios
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
              Intenciones provinciales Â· {OTZARRETA_HUB.provinceIntents.length} URLs
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
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0e0e14] to-[#09090d] border border-amber-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-amber-950/30">
          <div className="w-16 h-16 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Bloquea Tu Fecha con {DEPOSITO_STRIPE_EUR} â‚¬ Deducibles
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sin cuotas abusivas ni riesgos. El depÃ³sito de garantÃ­a de <strong>{DEPOSITO_STRIPE_EUR} â‚¬</strong> sella la
            exclusividad de la fecha en el calendario oficial de la Dirección Gastronómica y se descuenta al 100% de la liquidaciÃ³n final
            del banquete.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={calendarBlockHref}
              className="px-8 py-4 rounded-xl bg-[#ecb613] text-black font-extrabold text-sm hover:bg-[#ffe066] transition-all flex items-center gap-2 shadow-lg shadow-[#ecb613]/20"
            >
              <CreditCard className="w-4 h-4" />
              Bloquear Fecha en Exclusiva ({DEPOSITO_STRIPE_EUR} â‚¬)
            </a>

            <a
              href={whatsappConciergeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-[#25D366] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Hablar con ConserjerÃ­a VIP
            </a>
          </div>

          <div className="pt-4 text-xs text-gray-500 font-mono">
            Contrato respaldado por el Art. 1255 del CÃ³digo Civil Â· Split Soberano 80/10/10 Â· Productora EAR
          </div>
        </div>
      </section>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* 10. DATOS DE CONTACTO & FICHA TÃ‰CNICA                  */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <footer className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 border-t border-white/10 text-xs text-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-white text-sm mb-1">Ezkertza Berria & Otzarreta</div>
            <p>Sede Bizkaia: {OTZARRETA_ENTITY.affiliatedVenues[0].address}</p>
            <p className="mt-1">Sede Gipuzkoa: {OTZARRETA_ENTITY.affiliatedVenues[1].address}</p>
            <p className="mt-2 text-gray-500 leading-relaxed">
              {supplierContactWithheldNotice('Ezkertza Berria & Otzarreta')}
            </p>
          </div>

          <div>
            <div className="font-bold text-white text-sm mb-1">Centralita VIP Productora EAR</div>
            <p>AtenciÃ³n y ConserjerÃ­a de Bodas: {CENTRALITA_EAR_OS}</p>
            <p className="mt-1">LÃ­nea de prensa y alianzas: bajo solicitud en la ConserjerÃ­a</p>
            <p className="mt-1">Director ArtÃ­stico: Edwin Agudelo</p>
            <p>Soporte TÃ©cnico de SonorizaciÃ³n Bose S-Class</p>
          </div>

          <div className="text-right">
            <div className="font-bold text-white text-sm mb-1">Alianza Homologada EAR OS</div>
            <p>GarantÃ­a de AcÃºstica Legal Â· Ley 37/2003</p>
            <p className="mt-1">Impacto Social VIMUME Â· Split 80/10/10</p>
            <p>Â© {new Date().getFullYear()} Ezkertza Berria, Restaurante Otzarreta & Productora EAR</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

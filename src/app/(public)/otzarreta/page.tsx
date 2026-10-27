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
import { OtzarretaExperienceExplorer } from '@/components/otzarreta/OtzarretaExperienceExplorer';
import {
  OTZARRETA_HUB,
  OTZARRETA_MUNICIPALITIES
} from '@/lib/seo/otzarreta-dominance-engine';

export const metadata: Metadata = {
  title: 'Restaurante Ezkertza Berria & Otzarreta · Eduardo Martínez | Bodas & Banquetes en Bizkaia y Gipuzkoa',
  description:
    'Banquetes nupciales exclusivos para hasta 350 comensales en caserío tradicional con jardines, carpa para ceremonias civiles y parrilla al carbón de encina. Menús oficiales 2026 desde 100 € + IVA y sonorización homologada Bose S-Class.',
  alternates: {
    canonical: 'https://productoraear.com/otzarreta'
  },
  openGraph: {
    title: 'Ezkertza Berria & Otzarreta · Eduardo Martínez | Bodas & Banquetes de Gala',
    description:
      'Caserío vasco con capacidad para 350 comensales, parking privado 150 plazas, jardines y alta parrilla al carbón. Menús de boda oficiales desde 100 €.',
    url: 'https://productoraear.com/otzarreta',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Restaurante Jatetxea Ezkertza Berria · Fachada Principal del Caserío'
      }
    ]
  }
};

export default function OtzarretaFlagshipPage(): React.JSX.Element {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Restaurant', 'EventVenue'],
        '@id': 'https://productoraear.com/otzarreta#venue',
        name: 'Restaurante Jatetxea Ezkertza Berria & Otzarreta',
        alternateName: 'Ezkertza Berria Jatetxea',
        description:
          'Caserío tradicional vasco para banquetes de boda y eventos corporativos para hasta 350 comensales, dirigido por Eduardo Martínez de la Fuente en alianza con Productora EAR.',
        url: 'https://productoraear.com/otzarreta',
        // PEAJE SOBERANO: la línea del recinto NO viaja en el JSON-LD. El
        // saneador (`sanitizeSchemaContact`) inyecta el punto de contacto de la
        // Conserjería EAR OS en el render.
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
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://productoraear.com/' },
          { '@type': 'ListItem', position: 2, name: 'País Vasco', item: 'https://productoraear.com/bodas/guipuzcoa' },
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

  const whatsappVisitUrl = buildDemandWhatsappUrl({
    entityName: 'Ezkertza Berria & Otzarreta',
    intent: 'visita-tecnica',
    detail: 'Derio / Zarautz'
  });

  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-28 pb-24 overflow-x-hidden">
      {/* Script Estructurado JSON-LD (saneado: cero líneas de proveedor) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            sanitizeSchemaContact(jsonLd, 'Derio (Bizkaia) & Zarautz (Gipuzkoa)')
          ).replace(/</g, '\\u003c')
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. HERO S-CLASS CINEMATOGRÁFICO                        */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="space-y-6 text-center max-w-4xl mx-auto">
          {/* Badge de Alianza Exclusiva */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-[#ecb613]/10 to-amber-500/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider shadow-lg shadow-[#ecb613]/5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>ALIANZA ESTRATÉGICA · D. EDUARDO MARTÍNEZ & EDWIN AGUDELO</span>
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
            El caserío definitivo para bodas inolvidables: <strong>350 comensales</strong> en comedores climatizados e insonorizados,
            jardines botánicos con carpa y oficiante civil, parking privado gratuito de <strong>150 plazas</strong> y la auténtica parrilla al
            carbón de encina de <strong>Eduardo Martínez de la Fuente</strong>, con sonorización homologada Bose S-Class de Productora EAR.
          </p>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/reservar/solista"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] text-black font-extrabold text-sm sm:text-base hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/25 flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CreditCard className="w-5 h-5" />
              <span>Bloquear Fecha con {DEPOSITO_STRIPE_EUR} € (Deducible)</span>
            </a>

            <a
              href={whatsappConciergeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-[#09090d]/80 text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-all border border-white/15 flex items-center gap-2.5 backdrop-blur-md"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Hablar con Conserjería VIP</span>
            </a>

            <a
              href={whatsappVisitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-[#25D366]/15 text-[#25D366] font-semibold text-sm sm:text-base hover:bg-[#25D366]/25 transition-all border border-[#25D366]/40 flex items-center gap-2.5 backdrop-blur-md"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Solicitar visita técnica</span>
            </a>
          </div>

          {/* PEAJE SOBERANO: canal único y línea del recinto protegida */}
          <p className="max-w-3xl mx-auto text-[11px] sm:text-xs text-gray-500 font-mono leading-relaxed pt-1">
            Conserjería única: {SOVEREIGN_DEMAND_CHANNEL.telDisplay} · Línea directa de la casa{' '}
            {supplierLineMask(OTZARRETA_ENTITY.primaryPhone)} (verificada) — se facilita al confirmar
            la visita técnica.
          </p>

          {/* Micro Telemetría de Garantía */}
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
              <span>Acústica Legal Homologada (Ley 37/2003)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Split Soberano 80/10/10</span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. GALERÍA VISUAL DE ACTIVOS OFICIALES VAMPIRIZADOS     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Foto Principal: Fachada Caserío */}
          <div className="md:col-span-2 relative h-80 md:h-[460px] rounded-3xl overflow-hidden border border-white/10 group">
            <img
              src="https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg"
              alt="Fachada Principal del Caserío Ezkertza Berria en Derio (Bizkaia)"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
              <div>
                <span className="text-[11px] font-mono text-[#ecb613] uppercase tracking-wider">
                  CASERÍO DEL SIGLO XX · DERIO (BIZKAIA)
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
                alt="Chuletón y parrilla de carbón de encina de ganado mayor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-black/40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">Carbón de Encina & Ganado Mayor</span>
              </div>
            </div>
          </div>

          {/* Foto Derecha: Novios y Jardín */}
          <div className="relative h-80 md:h-[460px] rounded-3xl overflow-hidden border border-white/10 group md:col-span-1">
            <img
              src="https://www.ezkertzaberria.com/wp-content/uploads/2021/06/novios-1022x1536.jpg"
              alt="Ceremonia Civil en Jardines al Aire Libre"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-6">
              <div>
                <span className="text-[11px] font-mono text-[#ecb613] uppercase tracking-wider">
                  CEREMONIA & CÓCTEL
                </span>
                <h3 className="text-base font-bold text-white">Jardines & Carpa Civil</h3>
                <p className="text-xs text-gray-300">Oficiante, música en vivo y zona Chill Out</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. ANÁLISIS FINANCIERO: EAR OS VS BODAS.NET (SIN REBAJA) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-24">
        <div className="rounded-3xl bg-gradient-to-b from-[#0e0e14] via-[#09090d] to-[#050507] border border-[#ecb613]/30 p-8 sm:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-amber-950/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-4 text-center max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#ecb613]" />
              <span>ANÁLISIS DE RETORNO DE INVERSIÓN (ROI) · PROPUESTA EJECUTIVA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Por Qué EAR OS Supera en un 1.000% a Bodas.net
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] text-2xl sm:text-4xl mt-2 font-serif italic">
                Cero Fuga de Parejas, 126 Landings Propias y 100% ROI Garantizado
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Eduardo, actualmente inviertes en portales de bodas entre <strong>2.500 € y 4.800 € al año</strong> por figurar en un directorio pasivo.
              EAR OS te entrega por la misma inversión un <strong>activo tecnológico soberano</strong> que trabaja exclusivamente para ti las 24 horas del día.
            </p>
          </div>

          {/* Tabla / Grid comparativo de Alto Impacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Tarjeta Bodas.net (Modelo Alquiler Pasivo) */}
            <div className="rounded-3xl bg-[#0e0a0a]/80 border border-red-500/25 p-8 space-y-6 relative flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider">MODELO CONVENCIONAL</span>
                    <h3 className="text-2xl font-bold text-white">Bodas.net (Alquiler Pasivo)</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    Fuga de Clientes
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">1 sola ficha compartida:</strong> Tu caserío compite en la misma página contra 400 restaurantes y fincas de Bizkaia y Gipuzkoa.
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
                      <strong className="text-white">Tú no eres dueño de los contactos:</strong> Bodas.net custodia los datos; si dejas de pagar, pierdes todo tu histórico y tu posicionamiento.
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
                Inversión media: 2.500 € – 4.800 €/año · Retorno incierto · Activo 0% tuyo
              </div>
            </div>

            {/* Tarjeta EAR OS (Activo Soberano) */}
            <div className="rounded-3xl bg-gradient-to-b from-[#141209] to-[#09090d] border-2 border-[#ecb613] p-8 space-y-6 relative flex flex-col justify-between shadow-xl shadow-[#ecb613]/10">
              <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-[#ecb613] text-black font-extrabold text-xs tracking-wider uppercase shadow-md">
                RECOMENDADO · 10x RETORNO
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
                      <strong className="text-white">126 Landings Exclusivas y Propietarias:</strong> 72 páginas locales (18 municipios de Bizkaia y Gipuzkoa) + 54 de intención posicionadas en Google y motores IA (ChatGPT/Perplexity).
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
                      <strong className="text-white">Cotizador con tus 7 Menús Oficiales:</strong> Las parejas configuran su banquete al céntimo (Cantábrico 100€, Paloma 125€, Imperial 123,40€, Temporada 142,50€, Vasco 138€, Ezkertza 155€, Caserío Beko 173€).
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
                      <strong className="text-white">Garantía 100% de Retorno (Riesgo Cero):</strong> Si no recuperas el 100% de la inversión con reservas demostrables de bodas en el primer ciclo, EAR OS asume el coste y sigue operando GRATIS.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#ecb613]/30 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-[#ecb613]">
                  Tarifa equiparada a Bodas.net · Valor entregado 10x · Sin riesgo
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. SEDES DEL GRUPO: DERIO (BIZKAIA) & ZARAUTZ (GIPUZKOA)*/}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            DOS ENCLAVES PRIVILEGIADOS EN EL PAÍS VASCO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Las Sedes de Eduardo Martínez de la Fuente
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Dos espacios emblemáticos diseñados para celebraciones de ensueño, desde bodas íntimas en la costa hasta banquetes multitudinarios a 5 minutos del aeropuerto.
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. EXPLORADOR INTERACTIVO DE EXPERIENCIAS & MENÚS      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            PROPUESTA GASTRONÓMICA OFICIAL 2026 & HARDWARE S-CLASS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Diseña Tu Banquete al Céntimo
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Explora nuestros 7 menús oficiales de boda, menús de comunión y grupos. Cotiza en tiempo real según el número de comensales y verifica el blindaje acústico.
          </p>
        </div>

        <OtzarretaExperienceExplorer />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 6. RESEÑAS REALES DE CLIENTES (GOOGLE LOCAL GUIDES)     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 7. LA ALIANZA: EDUARDO MARTÍNEZ & EDWIN AGUDELO        */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
                Dos Maestros, Una Visión Soberana:
                <span className="block text-[#ecb613]">Eduardo Martínez & Edwin Agudelo</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Cuando <strong>Eduardo Martínez</strong> enciende las brasas en Ezkertza Berria y Otzarreta, custodia más de
                dos décadas de sabiduría en el trato de las carnes seleccionadas de ganado mayor, los rodaballos salvajes del Cantábrico y la cocina de cazuela tradicional.
              </p>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Su alianza con <strong>Edwin Agudelo</strong>, tenor lírico de conservatorio y fundador de Productora EAR,
                garantiza que cada banquete disfrute de un estándar impecable de sonorización conforme a la <strong>Ley 37/2003 de Ruido</strong>,
                sin cortes intempestivos ni sanciones municipales.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-amber-400 uppercase">La Brasa de Eduardo</div>
                  <div className="text-sm font-bold text-white">Carbón de Encina al Minuto</div>
                  <p className="text-xs text-gray-400">
                    Cero catering recalentado en cubetas. Del fuego al plato de tus invitados.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-[#ecb613] uppercase">La Acústica de Edwin</div>
                  <div className="text-sm font-bold text-white">Hardware Bose S-Class (12 W/pax)</div>
                  <p className="text-xs text-gray-400">
                    Sonorización calibrada con limitador telemático y fiesta garantizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://www.ezkertzaberria.com/wp-content/uploads/elementor/thumbs/FIRMA-EDU-2-pd7ffeq4is8ls76r0oqflcg5itg2kf317ktmnwda8g.jpg"
                    alt="Firma Eduardo Martínez"
                    className="h-12 object-contain bg-white/10 rounded-lg p-1"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">Eduardo Martínez de la Fuente</h3>
                    <div className="text-xs text-[#ecb613] font-mono">Gerente & Maestro Asador</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  &ldquo;En nuestros caseríos no admitimos atajos. El producto de primera calidad y el respeto a los comensales
                  son innegociables. Esta alianza con Edwin blinda cada boda con la máxima seriedad.&rdquo;
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
                  &ldquo;Eduardo es un amigo y un anfitrión extraordinario. Poner la infraestructura de Productora EAR y mi voz al
                  servicio de sus banquetes es la garantía definitiva de excelencia para las parejas.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 8. MALLA DE DOMINANCIA: 126 LANDINGS ANTI-HUÉRFANO     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20">
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
              municipios reales de Gipuzkoa y Bizkaia × {OTZARRETA_HUB.groups.length} formatos de banquete,
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
              Intenciones provinciales · {OTZARRETA_HUB.provinceIntents.length} URLs
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
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 9. GARANTÍA MUTUA: EL DEPÓSITO STRIPE DE 100 €         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto my-20">
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0e0e14] to-[#09090d] border border-amber-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-amber-950/30">
          <div className="w-16 h-16 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Bloquea Tu Fecha con {DEPOSITO_STRIPE_EUR} € Deducibles
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sin cuotas abusivas ni riesgos. El depósito de garantía de <strong>{DEPOSITO_STRIPE_EUR} €</strong> sella la
            exclusividad de la fecha en el calendario oficial de Eduardo Martínez y se descuenta al 100% de la liquidación final
            del banquete.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="/reservar/solista"
              className="px-8 py-4 rounded-xl bg-[#ecb613] text-black font-extrabold text-sm hover:bg-[#ffe066] transition-all flex items-center gap-2 shadow-lg shadow-[#ecb613]/20"
            >
              <CreditCard className="w-4 h-4" />
              Bloquear Fecha en Exclusiva ({DEPOSITO_STRIPE_EUR} €)
            </a>

            <a
              href={whatsappConciergeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-[#25D366] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Hablar con Conserjería VIP
            </a>
          </div>

          <div className="pt-4 text-xs text-gray-500 font-mono">
            Contrato respaldado por el Art. 1255 del Código Civil · Split Soberano 80/10/10 · Productora EAR
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 10. DATOS DE CONTACTO & FICHA TÉCNICA                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
            <p>Atención y Conserjería de Bodas: {CENTRALITA_EAR_OS}</p>
            <p className="mt-1">Línea de prensa y alianzas: bajo solicitud en la Conserjería</p>
            <p className="mt-1">Director Artístico: Edwin Agudelo</p>
            <p>Soporte Técnico de Sonorización Bose S-Class</p>
          </div>

          <div className="text-right">
            <div className="font-bold text-white text-sm mb-1">Alianza Homologada EAR OS</div>
            <p>Garantía de Acústica Legal · Ley 37/2003</p>
            <p className="mt-1">Impacto Social VIMUME · Split 80/10/10</p>
            <p>© {new Date().getFullYear()} Ezkertza Berria, Restaurante Otzarreta & Productora EAR</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

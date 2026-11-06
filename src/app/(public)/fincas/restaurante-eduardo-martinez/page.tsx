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
  CalendarCheck,
  Star,
  TreePine,
  UtensilsCrossed,
  Volume2,
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR, TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';
import { OTZARRETA_ENTITY } from '@/lib/constants/otzarreta-entity';
import { EZKERTZA_DERIO_VENUE } from '@/lib/constants/ezkertza-derio-venue';
import {
  SOVEREIGN_DEMAND_CHANNEL,
  buildDemandWhatsappUrl,
  sanitizeSchemaContact,
  supplierContactWithheldNotice,
  supplierLineMask,
} from '@/lib/providers/sovereign-lead-gate';
import { EzkertzaVenueLanding as EzkertzaVenueListing } from '@/components/otzarreta/EzkertzaVenueLanding';
import {
  AudioReactiveVisualizer,
  HorizonXGlow,
} from '@/components/harvested';
import {
  resolveProviderCalendarHref,
  resolveProviderContractHref,
} from '@/lib/providers/provider-cta-engine';
import {
  OTZARRETA_HUB,
  OTZARRETA_MUNICIPALITIES,
} from '@/lib/seo/otzarreta-dominance-engine';
import { AlturaRestaurantInteractiveTour } from '@/components/venues/AlturaRestaurantInteractiveTour';
import { EZKERTZA_STORYTELLING_CHAPTERS } from '@/lib/constants/ezkertza-storytelling-chapters';
import { SovereignCollectiveEventBuilder } from '@/components/checkout/SovereignCollectiveEventBuilder';

const OTZARRETA_CTA_SOURCE = {
  slug: 'restaurante-otzarreta',
  category: 'catering',
} as const;

export const metadata: Metadata = {
  title: 'Restaurante Ezkertza Berria & Otzarreta · Eduardo Martínez | Finca Canónica EAR OS',
  description:
    'Dossier maestro para Eduardo Martínez: Caserío Ezkertza Berria (Derio) & Restaurante Otzarreta (Zarautz). Recorrido cinematográfico Altura, storytelling interactivo, análisis ROI vs portales pasivos y malla de 126 landings propietarias.',
};

export default async function EduardoMartinezMasterPage({
  searchParams,
}: {
  searchParams: Promise<{ malla?: string | string[] }>;
}): Promise<React.JSX.Element> {
  const sp = await searchParams;
  const mallaDemo = sp.malla === '1';

  const whatsappConciergeUrl = buildDemandWhatsappUrl({
    entityName: 'Ezkertza Berria & Otzarreta · Eduardo Martínez',
    intent: 'disponibilidad',
    detail: 'alianza estratégica y banquete',
  });

  const calendarBlockHref = resolveProviderCalendarHref(OTZARRETA_CTA_SOURCE, { intent: 'bloquear' });
  const calendarVisitHref = resolveProviderCalendarHref(OTZARRETA_CTA_SOURCE, { intent: 'ver' });
  const contractHref = resolveProviderContractHref(OTZARRETA_CTA_SOURCE);

  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-28 pb-24 overflow-x-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* ━━━ 1. CABECERA MAESTRA EDITORIAL CON LOGO OFICIAL ━━━ */}
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-[#ecb613]/10 to-amber-500/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider shadow-lg shadow-[#ecb613]/5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>PROPUESTA ESTRATÉGICA S-CLASS · EDUARDO MARTÍNEZ & EDWIN AGUDELO</span>
          </div>

          <div className="flex justify-center mb-2">
            <img
              src="https://www.ezkertzaberria.com/wp-content/uploads/2021/04/LOGO-EZKERTZA-2.jpg"
              alt="Logo Oficial Ezkertza Berria Jatetxea"
              className="h-16 sm:h-20 object-contain rounded-xl bg-white/5 p-2 border border-white/10"
            />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.08]">
            Ezkertza Berria & Otzarreta
            <span className="block text-xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] font-serif italic font-normal mt-2">
              Parrilla Vasca de Autor & Banquetes Nupciales en Derio y Zarautz
            </span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-sans">
            El caserío definitivo para bodas inolvidables: <strong>350 comensales</strong> en comedores climatizados e insonorizados,
            jardines botánicos con carpa y oficiante civil, parking privado gratuito de <strong>150 plazas</strong> y la auténtica parrilla al
            carbón de encina de <strong>Eduardo (Dirección Gastronómica de Ezkertza Berria & Otzarreta)</strong>, con sonorización homologada Bose S-Class de Productora EAR.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-2xl font-black text-white font-mono">{EZKERTZA_DERIO_VENUE.rating.toFixed(1)} / 5</div>
              <div className="text-[11px] font-mono text-zinc-400 mt-0.5">{EZKERTZA_DERIO_VENUE.reviewCount} Opiniones Verificadas</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-2xl font-black text-[#ecb613] font-mono">{EZKERTZA_DERIO_VENUE.recommendationPercent}%</div>
              <div className="text-[11px] font-mono text-zinc-400 mt-0.5">Parejas Recomiendan</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-2xl font-black text-[#00E5FF] font-mono">350 pax</div>
              <div className="text-[11px] font-mono text-zinc-400 mt-0.5">Aforo Máximo Grupo</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 text-center">
              <div className="text-2xl font-black text-emerald-400 font-mono">1 al Día</div>
              <div className="text-[11px] font-mono text-zinc-400 mt-0.5">Exclusividad Total</div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={calendarBlockHref}
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
              href={calendarVisitHref}
              className="px-6 py-4 rounded-2xl bg-[#00E5FF]/10 text-[#7DF0FF] font-semibold text-sm sm:text-base hover:bg-[#00E5FF]/20 transition-all border border-[#00E5FF]/40 flex items-center gap-2.5 backdrop-blur-md"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Solicitar visita técnica</span>
            </a>
          </div>

          <p className="max-w-3xl mx-auto text-[11px] sm:text-xs text-gray-500 font-mono leading-relaxed pt-1">
            Conserjería única: {SOVEREIGN_DEMAND_CHANNEL.telDisplay} · Línea directa de la casa{' '}
            {supplierLineMask(OTZARRETA_ENTITY.primaryPhone)} (verificada) — se facilita al confirmar la visita técnica.
          </p>
        </section>

        {/* ━━━ 2. VISOR CINEMÁTICO HERO FORMATO ALTURA (RECORRIDO FLUIDO) ━━━ */}
        <section aria-label="Visor Cinematográfico Altura">
          <AlturaRestaurantInteractiveTour />
        </section>

        {/* ━━━ 2B. CONSTRUCTOR COLECTIVO MULTI-PROVEEDOR S-CLASS ━━━ */}
        <SovereignCollectiveEventBuilder
          venueName="Restaurante Ezkertza Berria"
          title="Configura Tu Boda Integral en Ezkertza Berria"
          subtitle="Suma la finca, el directo lírico de Edwin Agudelo, la sonorización Bose F1, la brasa de Eduardo, la plataforma 360 y el transporte de invitados en un único expediente coordinado."
        />

        {/* ━━━ 3. STORYTELLING NARRATIVO A TRAVÉS DEL SCROLL ━━━ */}
        <section id="ficha-storytelling" className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>EL RECORRIDO DEL DÍA DE TU BODA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              Storytelling del Caserío: De la Llegada a la Noche
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Cada etapa del banquete tiene su propio espacio acústico, visual y gastronómico sin interferencias entre momentos.
            </p>
          </div>

          {/* Bloques de Storytelling paso a paso */}
          <div className="space-y-16">
            {EZKERTZA_STORYTELLING_CHAPTERS.map((chapter, idx) => (
              <article
                key={chapter.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 rounded-[36px] bg-zinc-950/60 border border-white/10 backdrop-blur-xl ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                    <img
                      src={chapter.imageUrl}
                      alt={chapter.roomName.replace('\n', ' ')}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                        {chapter.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-emerald-400">
                        {chapter.acousticDecibels}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-5 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="text-xs font-mono text-amber-400 font-bold tracking-widest uppercase">
                    {chapter.stepNumber}
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-snug whitespace-pre-line">
                    {chapter.roomName}
                  </h3>

                  <p className="text-xs sm:text-sm font-mono text-zinc-400">
                    {chapter.subtitle}
                  </p>

                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {chapter.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 text-xs font-sans text-zinc-400">
                    <strong className="text-white block mb-0.5 font-mono text-[11px] uppercase tracking-wider">
                      Detalle de Arquitectura & Operación:
                    </strong>
                    {chapter.highlight}
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href={whatsappConciergeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-mono font-bold transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Consultar esta Zona</span>
                    </a>
                    <Link
                      href="/booking?tier=vip&venue=restaurante-ezkertza-berria"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold transition-all"
                    >
                      <span>Bloquear Fecha VIP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ━━━ 4. ANÁLISIS FINANCIERO: POR QUÉ EAR OS RINDE MÁS QUE UN DIRECTORIO PASIVO (PROPUESTA PARA EDUARDO) ━━━ */}
        <section className="rounded-3xl bg-gradient-to-b from-[#0e0e14] via-[#09090d] to-[#050507] border border-[#ecb613]/30 p-8 sm:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-amber-950/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-4 text-center max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#ecb613]" />
              <span>ANÁLISIS DE RETORNO DE INVERSIÓN (ROI) · PROPUESTA EJECUTIVA PARA EDUARDO</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight font-display">
              Por Qué EAR OS es la Mejor Opción para Ezkertza & Otzarreta
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] text-2xl sm:text-4xl mt-2 font-serif italic font-normal">
                Cero Fuga de Parejas a la Competencia y 126 Landings Propietarias
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Un directorio pasivo cobra su cuota fija anual y te entrega un perfil entre miles.
              EAR OS te entrega un <strong>activo tecnológico soberano</strong> que trabaja exclusivamente para ti las 24 horas del día.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Modelo Directorio Convencional */}
            <div className="rounded-3xl bg-[#0e0a0a]/80 border border-red-500/25 p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider">MODELO CONVENCIONAL</span>
                    <h3 className="text-2xl font-bold text-white">Directorio Pasivo (Alquiler Compartido)</h3>
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
                      <strong className="text-white">Anuncios de competidores en tu propio perfil:</strong> Cuando una pareja entra a ver Ezkertza Berria, la plataforma le sugiere fincas rivales en el lateral.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Tú no eres dueño de los contactos:</strong> El portal custodia los datos de las parejas; si dejas de pagar su cuota, pierdes todo tu histórico y tu posicionamiento.
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
                      <strong className="text-white">Riesgo económico 100% tuyo:</strong> Pagas la cuota íntegra tanto si cierras 20 bodas como si cierras cero.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-red-500/20 text-xs font-mono text-red-300/80">
                Cuota anual íntegra del portal · Retorno incierto · Activo 0% tuyo
              </div>
            </div>

            {/* Modelo EAR OS Soberano */}
            <div className="rounded-3xl bg-gradient-to-b from-[#141209] to-[#09090d] border-2 border-[#ecb613] p-8 space-y-6 flex flex-col justify-between shadow-xl shadow-[#ecb613]/10">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#ecb613]/30 pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">TECNOLOGÍA PROPIA S-CLASS</span>
                    <h3 className="text-2xl font-bold text-white">EAR OS Engine (Activo Soberano)</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold">
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
                      <strong className="text-white">Cotizador con tus 7 Menús Oficiales:</strong> Las parejas configuran su banquete al céntimo (Cantábrico 100 €, Paloma 125 €, Imperial 123,40 €, Temporada 142,50 €, Vasco 138 €, Ezkertza 155 €, Caserío Beko 173 €).
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Bloqueo Atómico con Depósito Stripe de 100 €:</strong> Depósito 100% deducible que filtra a los curiosos y sella la fecha en exclusiva en tu calendario.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Leads filtrados y visibilidad medida:</strong> Cada petición llega pre-cualificada por la Conserjería (fecha, presupuesto y aforo verificados) antes de contactarte. Sin cuotas fijas ni letra pequeña.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#ecb613]/30 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-[#ecb613]">
                  Tarifa justa · Leads filtrados y visibilidad medida
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
        </section>

        {/* ━━━ 5. LAS DOS SEDES DE EDUARDO: DERIO (BIZKAIA) & ZARAUTZ (GIPUZKOA) ━━━ */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
              DOS ENCLAVES PRIVILEGIADOS EN EL PAÍS VASCO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Las Sedes de Eduardo: Ezkertza Berria & Otzarreta
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Dos espacios emblemáticos diseñados para celebraciones de ensueño, desde bodas íntimas en la costa de Zarautz hasta banquetes multitudinarios en el valle de Derio.
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
                      <h3 className="text-xl font-bold text-white font-display">{venue.name}</h3>
                      <div className="text-xs text-[#ecb613] font-mono">{venue.municipality} ({venue.province})</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                    {venue.capacityPax} pax
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-300 font-sans">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ecb613] shrink-0" />
                    <span>{venue.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {SOVEREIGN_DEMAND_CHANNEL.telDisplay} · {SOVEREIGN_DEMAND_CHANNEL.label}
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

        {/* ━━━ 6. LA ALIANZA: EL CASERÍO & EDWIN AGUDELO ━━━ */}
        <section className="rounded-3xl bg-gradient-to-b from-[#09090d]/90 to-[#050507] border border-white/10 p-8 sm:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                <Award className="w-3.5 h-3.5 text-[#ecb613]" />
                <span>LA HISTORIA TRAS LA ALIANZA</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight font-display">
                Dos Maestros, Una Visión Soberana:
                <span className="block text-[#ecb613]">Eduardo Martínez & Edwin Agudelo</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Cuando <strong>Eduardo Martínez</strong> enciende las brasas en Ezkertza Berria y Otzarreta, custodia más de
                dos décadas de sabiduría en el trato de las carnes seleccionadas de ganado mayor, los rodaballos salvajes del Cantábrico y la cocina tradicional.
              </p>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Su alianza con <strong>Edwin Agudelo</strong>, tenor solista de conservatorio y fundador de Productora EAR,
                garantiza que cada banquete disfrute de un estándar impecable de sonorización conforme a la <strong>Ley 37/2003 de Ruido</strong>,
                sin cortes intempestivos ni sanciones municipales.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-amber-400 uppercase font-bold">La Brasa de Eduardo</div>
                  <div className="text-sm font-bold text-white">Carbón de Encina al Minuto</div>
                  <p className="text-xs text-gray-400">
                    Cero catering recalentado en cubetas. Del fuego al plato de tus invitados.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-xs font-mono text-[#ecb613] uppercase font-bold">La Acústica de Edwin</div>
                  <div className="text-sm font-bold text-white">Hardware Bose S-Class (12 W/pax)</div>
                  <AudioReactiveVisualizer peakDba={85.0} theme="gold" className="mt-2" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://www.ezkertzaberria.com/wp-content/uploads/elementor/thumbs/FIRMA-EDU-2-pd7ffeq4is8ls76r0oqflcg5itg2kf317ktmnwda8g.jpg"
                    alt="Firma de Eduardo · Dirección Gastronómica"
                    className="h-12 object-contain bg-white/10 rounded-lg p-1"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Eduardo Martínez</h3>
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
                    <h3 className="text-base font-bold text-white font-display">Edwin Agudelo</h3>
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
        </section>

        {/* ━━━ 7. MALLA DE DOMINANCIA: 126 LANDINGS PROPIETARIAS PARA EDUARDO ━━━ */}
        <section className="rounded-3xl border border-[#ecb613]/25 bg-[#09090d]/80 p-8 sm:p-12 space-y-8 backdrop-blur-md">
          <div className="space-y-3">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider font-bold">
              MALLA DE DOMINANCIA · {OTZARRETA_HUB.total} PÁGINAS DEDICADAS EXCLUSIVAS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              {OTZARRETA_HUB.geoCount} Landings Geográficas + {OTZARRETA_HUB.intentCount} de Intención
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-3xl">
              Cada enlace es una URL real con entidad verificada detrás: {OTZARRETA_MUNICIPALITIES.length}{' '}
              municipios reales de Gipuzkoa y Bizkaia × {OTZARRETA_HUB.groups.length} formatos de banquete,
              más las búsquedas directas con intención de reserva. Todo el tráfico posiciona únicamente al grupo de Eduardo.
            </p>
          </div>

          {OTZARRETA_HUB.groups.map((group) => (
            <div key={group.vertical.slug} className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#ecb613] font-bold">
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

          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#ecb613] font-bold">
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
        </section>

        {/* ━━━ 8. GALERÍA PANORÁMICA DE TODAS LAS FOTOS REALES VAMPIRIZADAS ━━━ */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                GALERÍA COMPLETA OFICIAL
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white mt-1">
                Todas las Instalaciones de Ezkertza Berria
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {EZKERTZA_DERIO_VENUE.media.galleryPhotos.length} Fotografías Reales · Caserío & Jardines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {EZKERTZA_DERIO_VENUE.media.galleryPhotos.map((photoUrl, index) => (
              <figure
                key={photoUrl}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 aspect-[4/3] shadow-lg"
              >
                <img
                  src={photoUrl}
                  alt={`Instalaciones Ezkertza Berria Derio · Fotografía ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <span className="text-[10px] font-mono text-white bg-black/70 px-2.5 py-1 rounded-full border border-white/20">
                    Instalación {index + 1}
                  </span>
                </div>
              </figure>
            ))}
          </div>
        </section>

        {/* ━━━ 9. GARANTÍA MUTUA: EL DEPÓSITO STRIPE DE 100 € ━━━ */}
        <section className="max-w-5xl mx-auto">
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

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                Bloquea Tu Fecha con {DEPOSITO_STRIPE_EUR} € Deducibles
              </h2>

              <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Sin cuotas abusivas ni riesgos. El depósito de garantía de <strong>{DEPOSITO_STRIPE_EUR} €</strong> sella la
                exclusividad de la fecha en el calendario oficial de Eduardo Martínez y se descuenta al 100% de la liquidación final del banquete.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={calendarBlockHref}
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
          </HorizonXGlow>
        </section>

        {/* ━━━ 10. PIE DE PÁGINA INSTITUCIONAL & DATOS DE LA ALIANZA ━━━ */}
        <footer className="pt-10 border-t border-white/10 text-xs text-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-bold text-white text-sm mb-1 font-display">Ezkertza Berria & Otzarreta</div>
              <p>Sede Bizkaia: {OTZARRETA_ENTITY.affiliatedVenues[0].address}</p>
              <p className="mt-1">Sede Gipuzkoa: {OTZARRETA_ENTITY.affiliatedVenues[1].address}</p>
              <p className="mt-2 text-gray-500 leading-relaxed">
                {supplierContactWithheldNotice('Ezkertza Berria & Otzarreta')}
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-sm mb-1 font-display">Centralita VIP Productora EAR</div>
              <p>Atención y Conserjería de Bodas: {CENTRALITA_EAR_OS}</p>
              <p className="mt-1">Director Artístico: Edwin Agudelo</p>
              <p>Soporte Técnico de Sonorización Bose S-Class</p>
            </div>

            <div className="text-right">
              <div className="font-bold text-white text-sm mb-1 font-display">Alianza Homologada EAR OS</div>
              <p>Garantía de Acústica Legal · Ley 37/2003</p>
              <p className="mt-1">Impacto Social VIMUME · Split 80/10/10</p>
              <p>© {new Date().getFullYear()} Ezkertza Berria, Restaurante Otzarreta & Productora EAR</p>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}

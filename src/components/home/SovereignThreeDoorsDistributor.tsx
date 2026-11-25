'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Music,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Crown,
  Heart,
  LayoutGrid,
  Compass,
} from 'lucide-react';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_SPL_DB,
} from '@/lib/constants/ear-os-ssot';

const SEATING_PLANNER_COURTESY_EUR = 190;

interface DoorItem {
  readonly id: string;
  readonly code: string;
  readonly href: string;
  readonly kicker: string;
  readonly title: string;
  readonly atmosphere: string;
  readonly highlights: readonly string[];
  readonly cta: string;
  readonly icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const DOORS_CONFIG: readonly DoorItem[] = Object.freeze([
  {
    id: 'door-fincas',
    code: 'ESPACIOS',
    href: '/fincas',
    kicker: 'PUERTA 01 · ESPACIOS & GASTRONOMÍA',
    title: 'Fincas Singulares, Caseríos & Alta Brasa',
    atmosphere:
      'El aroma a sarmiento, salones acristalados entre árboles centenarios y menús cerrados sin sorpresas. Donde tus invitados se sienten en casa.',
    highlights: [
      'Aforos homologados de 50 a 350 comensales en las 52 provincias',
      'Caserío Otzarreta y espacios con cocina propia sin sorpresas',
      `Confort acústico garantizado (Ley 37/2003 · < ${LIMITE_SPL_DB} dB SPL)`,
    ],
    cta: 'Explorar Espacios y Menús →',
    icon: Building2,
  },
  {
    id: 'door-artistas',
    code: 'ARTISTAS',
    href: '/artistas',
    kicker: 'PUERTA 02 · MÚSICA & ESPECTÁCULOS',
    title: 'Música en Directo que Hace Llorar y Bailar',
    atmosphere:
      'Tenores que erizan la piel en la ceremonia, mariachis de gala que rompen el cóctel y orquestas que llenan la pista sin música enlatada.',
    highlights: [
      `Solistas de conservatorio desde ${TARIFA_BASE_SOLISTA_EUR} € (100 km incluidos)`,
      'Mariachis de gala, cuartetos de cuerda, pop y DJs residentes',
      'Rider sonoro Shure Axient & Bose directo sin intermediarios',
    ],
    cta: 'Sentir el Roster de Artistas →',
    icon: Music,
  },
  {
    id: 'door-produccion',
    code: 'TECNICA',
    href: '/produccion',
    kicker: 'PUERTA 03 · PRODUCCIÓN TÉCNICA',
    title: 'Ingeniería Escénica, Luces & Sonido Cristalino',
    atmosphere:
      'Iluminación arquitectónica que viste de gala la noche y acústica profesional calibrada para bailar sin cortes ni multas.',
    highlights: [
      'Presión sonora cálida 12 W/pax calibrada por espacio',
      'Iluminación arquitectónica y acometida 32A/63A garantizada',
      `Licitaciones y eventos B2G Art. 118 (< ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €)`,
    ],
    cta: 'Diseñar la Escenografía →',
    icon: Sliders,
  },
]);

/**
 * ════════════════════════════════════════════════════════════════════════════
 * DISTRIBUIDOR SOBERANO DE 3 PUERTAS · RESTAURACIÓN CHAMPAGNE & NOCHE DE GALA
 * ════════════════════════════════════════════════════════════════════════════
 * Experiencia emocional, cálida y cinematográfica sobre lienzo #040407
 * (compatibilidad Onyx #030305), con micro-respiración en oro suave (#ecb613)
 * y tipografía Syne + Montserrat/Inter.
 * ════════════════════════════════════════════════════════════════════════════
 */
export function SovereignThreeDoorsDistributor(): React.JSX.Element {
  const artistPct = Math.round(SPLIT_SOBERANO.artista * 100);
  const earOsPct = Math.round(SPLIT_SOBERANO.earOs * 100);
  const vimumePct = Math.round(SPLIT_SOBERANO.vimume * 100);
  const centralitaTelHref = `tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-14 sm:space-y-20">
      {/* ── HERO EMOCIONAL DE ALTO IMPACTO (HUMANO Y CÁLIDO) ──────────────── */}
      <header className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#ecb613]/10 border border-amber-500/20 text-[#ecb613] text-xs font-inter font-semibold tracking-[0.14em] uppercase">
          <span>✨ ALTA PRODUCCIÓN · GASTRONOMÍA DE CASERÍO · ARTISTAS DE CONSERVATORIO</span>
        </div>

        <h1 className="font-syne font-extrabold tracking-tight text-[#f4f4f5] text-4xl !text-[clamp(2rem,4.5vw,3.75rem)] sm:!text-[clamp(2.5rem,4.5vw,3.75rem)] lg:!text-[clamp(3rem,4.5vw,3.75rem)] !leading-[1.08] sm:!leading-[1.08] lg:!leading-[1.08]">
          Donde la emoción se convierte en memoria para toda la vida.
        </h1>

        <p className="font-montserrat text-base sm:text-lg text-[#f4f4f5]/90 max-w-3xl mx-auto leading-relaxed font-normal">
          No vendemos servicios sueltos ni te dejamos solo ante presupuestos fríos. Diseñamos, coordinamos y blindamos el día más importante de tu historia con el rigor de una productora nacional y la calidez de quien cuida a su propia familia.
        </p>

        {/* Insignias de confianza en cabecera */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#08080e]/90 border border-amber-500/20 text-[#f4f4f5] font-montserrat text-xs sm:text-sm font-medium inline-flex items-center">
            ⭐️ 4.9/5 en más de 248 celebraciones
          </span>
          <span className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#08080e]/90 border border-amber-500/20 text-[#f4f4f5] font-montserrat text-xs sm:text-sm font-medium inline-flex items-center">
            🔒 Fianza deducible de {DEPOSITO_STRIPE_EUR} € · Tarifa congelada al céntimo
          </span>
          <a
            href={centralitaTelHref}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#ecb613] text-[#040407] hover:bg-amber-300 transition-colors duration-200 font-montserrat text-xs sm:text-sm font-bold inline-flex items-center shadow-[0_0_24px_rgba(236,182,19,0.22)]"
          >
            📞 Centralita Directa: {CENTRALITA_EAR_OS}
          </a>
        </div>
      </header>

      {/* ── LAS 3 PUERTAS SENSORIALES (PORTALES CON ALMA) ─────────────────── */}
      <section aria-label="Portales de celebración" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {DOORS_CONFIG.map((door) => {
          const Icon = door.icon;
          return (
            <Link
              key={door.id}
              href={door.href}
              className="group flex flex-col justify-between rounded-3xl bg-[#08080e]/90 border border-amber-500/20 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:shadow-[0_0_32px_rgba(236,182,19,0.16)] hover:-translate-y-1"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-amber-500/20 flex items-center justify-center text-[#ecb613] transition-transform duration-300 group-hover:scale-105 shrink-0">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-inter font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-amber-500/20 text-amber-300 text-right">
                    {door.kicker}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="font-syne font-bold text-[#f4f4f5] !text-xl sm:!text-2xl !leading-snug tracking-tight group-hover:text-[#ecb613] transition-colors">
                    {door.title}
                  </h2>
                  <p className="font-montserrat text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                    {door.atmosphere}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-amber-500/15 font-inter text-xs sm:text-sm text-zinc-300">
                  {door.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={16}
                        strokeWidth={1.5}
                        className="text-[#ecb613] shrink-0 mt-0.5"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-amber-500/15">
                <span className="w-full min-h-[44px] px-5 py-3 rounded-2xl bg-[#ecb613] text-[#040407] group-hover:bg-amber-300 transition-colors duration-200 font-montserrat font-bold text-xs sm:text-sm flex items-center justify-center text-center">
                  {door.cta}
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ── SECCIÓN SOCIAL Y REGALO EMOCIONAL ─────────────────────────────── */}
      <section aria-label="Cortesía para novios y compromiso social" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Cortesía Pulpetti 3D */}
        <div className="rounded-3xl bg-[#08080e]/90 border border-amber-500/20 p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-[#ecb613]/45 transition-colors duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-amber-500/20 text-[#ecb613] font-inter text-xs font-semibold uppercase tracking-[0.12em]">
                <LayoutGrid size={14} strokeWidth={1.5} />
                <span>Cortesía para Novios · Valorado en {SEATING_PLANNER_COURTESY_EUR} €</span>
              </span>
            </div>
            <h2 className="font-syne font-bold text-[#f4f4f5] !text-xl sm:!text-2xl !leading-snug tracking-tight">
              Seating Planner 3D Pulpetti de Regalo
            </h2>
            <p className="font-montserrat text-sm sm:text-base text-zinc-300 leading-relaxed">
              Organiza cada mesa, las familias y las intolerancias alimentarias en un plano interactivo 3D sin hojas de cálculo interminables. Valorado en{' '}
              <strong className="text-[#ecb613] font-semibold">
                {SEATING_PLANNER_COURTESY_EUR} € bonificado para novios
              </strong>{' '}
              al confirmar tu celebración.
            </p>
          </div>
          <div>
            <Link
              href="/seating-planner"
              className="min-h-[44px] px-5 py-3 rounded-2xl bg-[#ecb613] text-[#040407] hover:bg-amber-300 transition-colors duration-200 font-montserrat font-bold text-xs sm:text-sm inline-flex items-center gap-2.5"
            >
              <span>Diseñar mis Mesas en 3D</span>
              <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {/* Bloque Humanitario VIMUME */}
        <div className="rounded-3xl bg-[#08080e]/90 border border-amber-500/20 p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-[#ecb613]/45 transition-colors duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-amber-500/20 text-amber-300 font-inter text-xs font-semibold uppercase tracking-[0.12em]">
                <Heart size={14} strokeWidth={1.5} />
                <span>Obra Social VIMUME · {vimumePct}% de Mediación</span>
              </span>
            </div>
            <h2 className="font-syne font-bold text-[#f4f4f5] !text-xl sm:!text-2xl !leading-snug tracking-tight">
              Celebrar con Sentido
            </h2>
            <p className="font-montserrat text-sm sm:text-base text-zinc-300 leading-relaxed">
              Celebrar con Sentido: El{' '}
              <strong className="text-[#ecb613] font-semibold">{vimumePct}%</strong> de nuestra mediación financia música terapéutica para personas mayores en residencias.
            </p>
            <p className="font-inter text-xs sm:text-sm text-zinc-300">
              Reparto transparente: {artistPct}% íntegro para el artista · {earOsPct}% plataforma · {vimumePct}% terapias sonoras VIMUME.
            </p>
          </div>
          <div>
            <Link
              href="/vimume"
              className="min-h-[44px] px-5 py-3 rounded-2xl bg-white/[0.04] border border-amber-500/30 text-[#f4f4f5] hover:bg-[#ecb613] hover:text-[#040407] transition-colors duration-200 font-montserrat font-bold text-xs sm:text-sm inline-flex items-center gap-2.5"
            >
              <span>Conocer el Proyecto VIMUME</span>
              <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GARANTÍAS DE TRANQUILIDAD (4 PILARES CHAMPAGNE & GALA) ───────────── */}
      <section aria-label="Garantías de celebración" className="pt-8 border-t border-amber-500/20 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-inter uppercase tracking-[0.18em] text-[#ecb613] font-semibold">
            TRATO DIRECTO · CONTRATO BLINDADO · CERO SORPRESAS
          </span>
          <h3 className="font-syne font-bold text-[#f4f4f5] !text-lg sm:!text-xl tracking-tight">
            Cuatro promesas firmadas antes de que suene el primer acorde
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. AIRBNB */}
          <div className="p-6 rounded-2xl bg-[#08080e]/90 border border-amber-500/20 space-y-3 hover:border-[#ecb613]/45 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-inter font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded-lg bg-[#ecb613]/10 border border-amber-500/20">
                <ShieldCheck size={14} strokeWidth={1.5} />
                <span>AIRBNB</span>
              </span>
              <span className="text-xs font-inter text-zinc-300">Confianza &amp; Sede</span>
            </div>
            <h4 className="font-syne font-bold text-[#f4f4f5]">Reserva Blindada</h4>
            <ul className="space-y-1.5 font-montserrat text-xs text-zinc-300">
              <li>• Calendario atómico con bloqueo en 1 clic</li>
              <li>• Fianza deducible de {DEPOSITO_STRIPE_EUR} € (Price-Lock)</li>
              <li>• Contrato eIDAS firmado con SHA-256</li>
              <li>• Menús auditados con celíacos a 0 €</li>
            </ul>
          </div>

          {/* 2. UBER */}
          <div className="p-6 rounded-2xl bg-[#08080e]/90 border border-amber-500/20 space-y-3 hover:border-[#ecb613]/45 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-inter font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded-lg bg-[#ecb613]/10 border border-amber-500/20">
                <Compass size={14} strokeWidth={1.5} />
                <span>UBER</span>
              </span>
              <span className="text-xs font-inter text-zinc-300">Despacho &amp; Flota</span>
            </div>
            <h4 className="font-syne font-bold text-[#f4f4f5]">Puntualidad Real</h4>
            <ul className="space-y-1.5 font-montserrat text-xs text-zinc-300">
              <li>• 100 km incluidos desde Méntrida</li>
              <li>• Montaje técnico y pruebas 2 horas antes</li>
              <li>• Acometida trifásica 32A/63A verificada</li>
              <li>• Split Soberano {artistPct}/{earOsPct}/{vimumePct} transparente</li>
            </ul>
          </div>

          {/* 3. TINDER */}
          <div className="p-6 rounded-2xl bg-[#08080e]/90 border border-amber-500/20 space-y-3 hover:border-[#ecb613]/45 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-inter font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded-lg bg-[#ecb613]/10 border border-amber-500/20">
                <Sparkles size={14} strokeWidth={1.5} />
                <span>TINDER</span>
              </span>
              <span className="text-xs font-inter text-zinc-300">Afinidad Real</span>
            </div>
            <h4 className="font-syne font-bold text-[#f4f4f5]">Selección a Medida</h4>
            <ul className="space-y-1.5 font-montserrat text-xs text-zinc-300">
              <li>• Triaje en 3 pasos: Fecha, Aforo y Presupuesto</li>
              <li>• Sin catálogos interminables de 500 opciones</li>
              <li>• Compatibilidad real de estilo y repertorio</li>
              <li>• Top 3 de máxima afinidad para tu celebración</li>
            </ul>
          </div>

          {/* 4. BODAS.NET */}
          <div className="p-6 rounded-2xl bg-[#08080e]/90 border border-amber-500/20 space-y-3 hover:border-[#ecb613]/45 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-inter font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded-lg bg-[#ecb613]/10 border border-amber-500/20">
                <Crown size={14} strokeWidth={1.5} />
                <span>BODAS.NET</span>
              </span>
              <span className="text-xs font-inter text-zinc-300">Censo Oficial</span>
            </div>
            <h4 className="font-syne font-bold text-[#f4f4f5]">Directo sin Comisiones</h4>
            <ul className="space-y-1.5 font-montserrat text-xs text-zinc-300">
              <li>• Ficha técnica unificada y verificada</li>
              <li>• Cachés reales sin sobreprecios ocultos</li>
              <li>• 0% comisión sobre el cubierto del banquete</li>
              <li>• Atención humana directa ({CENTRALITA_EAR_OS})</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOOTER DE GALA Y SALVAGUARDAS ─────────────────────────────────── */}
      <footer className="pt-8 border-t border-amber-500/20 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-inter text-zinc-300">
        <div className="flex items-center gap-2.5 shrink-0">
          <Crown size={16} strokeWidth={1.5} className="text-[#ecb613] shrink-0" />
          <span>Productora EAR · Contratación Directa (52 Provincias)</span>
        </div>
        <nav aria-label="Enlaces principales" className="flex flex-wrap items-center justify-center lg:justify-end gap-x-5 gap-y-2">
          <Link href="/fincas" className="min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-[#ecb613] transition-colors">
            Fincas
          </Link>
          <Link href="/artistas" className="min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-[#ecb613] transition-colors">
            Artistas
          </Link>
          <Link href="/produccion" className="min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-[#ecb613] transition-colors">
            Producción
          </Link>
          <Link href="/presupuesto" className="min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-[#ecb613] transition-colors">
            Cotizador
          </Link>
          <Link href="/seating-planner" className="min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-[#ecb613] transition-colors">
            Seating Planner
          </Link>
          <Link href="/confianza" className="min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-[#ecb613] transition-colors">
            Garantías
          </Link>
          <Link href="/portal/proveedor" className="min-h-[44px] inline-flex items-center whitespace-nowrap hover:text-[#ecb613] transition-colors">
            Área Proveedor
          </Link>
        </nav>
      </footer>
    </div>
  );
}

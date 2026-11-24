'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Calendar,
  Car,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Flame,
  Heart,
  Landmark,
  Lock,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  SOLISTA_KM_INCLUIDOS,
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_WEDDING_MENUS,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';
import { ALL_SPANISH_PROVINCES, type SpanishProvince } from '@/lib/geo/spanish-provinces';
import { getDistanceKmFromMentrida } from '@/features/search/utils/mentridaDistanceEngine';
import { computeSovereignLogistics } from '@/lib/pricing/logistics';
import { CENTRALITA } from '@/lib/phone-constants';
import {
  create14PartidasAllocation,
  rebalancePartidas,
  togglePartidaLock,
  addCustomPartidaToEngine,
  type PartidaItem,
} from '@/lib/budget/budget-allocator-engine';

// Componentes cosechados de Vanguardia (21st.dev & HorizonX)
import AmbientGlowOrb from '@/components/vanguardia/AmbientGlowOrb';
import MagneticCta from '@/components/vanguardia/MagneticCta';
import ParticleField from '@/components/vanguardia/ParticleField';
import TiltReviewCard, { type TiltReview } from '@/components/vanguardia/TiltReviewCard';
import SovereignDock, { type DockItem } from '@/components/vanguardia/SovereignDock';
import SeatingPlannerPreview from '@/components/vanguardia/SeatingPlannerPreview';
import { getVanguardiaTheme } from '@/components/vanguardia/vanguardia-theme';
import FourteenPartidasBudgetEngine from './FourteenPartidasBudgetEngine';
import B2GMinisterialConsole from './B2GMinisterialConsole';

/** Formato monetario es-ES determinista */
function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

export type PurchaseIntention = 'bodas' | 'musica' | 'b2g';

interface IntentionTabConfig {
  readonly id: PurchaseIntention;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly badge: string;
  readonly title: string;
  readonly highlight: string;
  readonly subtitle: string;
  readonly benefits: readonly string[];
  readonly primaryCta: { readonly label: string; readonly href: string };
  readonly secondaryCta: { readonly label: string; readonly href: string };
}

/** 3 Accesos Canónicos Exigidos por el CEO */
const INTENTION_CONFIGS: Record<PurchaseIntention, IntentionTabConfig> = {
  bodas: {
    id: 'bodas',
    label: 'Espacios & Gastronomía',
    icon: Heart,
    badge: 'ALTA GASTRONOMÍA · ASADOR EN EXCLUSIVA',
    title: 'Tu Boda en Asador Otzarreta:',
    highlight: 'Exclusividad Total y Brasa Tradicional',
    subtitle:
      'Un solo evento al día en finca privada (Derio, Bizkaia). Menús cerrados de 145 € a 185 € + IVA con protocolo celíaco a 0 €, 120 plazas de párking y confort acústico garantizado sin multas ni cortes.',
    benefits: [
      'Exclusividad absoluta de finca: un único evento al día para total privacidad',
      'Menús cerrados de 145 € a 185 € + IVA con celíacos a 0 € sin recargo alguno',
      'Garantía de confort acústico y cero multas en la finca (insonorización certificada)',
      '120 plazas de párking privado y vigilado gratuito para tus invitados',
      'Seating Planner interactivo de cortesía (valorado en 190 €) incluido con tu reserva',
    ],
    primaryCta: {
      label: `Bloquear Fecha en Otzarreta (${DEPOSITO_STRIPE_EUR}€ Deducibles)`,
      href: '/calendario/catering/restaurante-otzarreta',
    },
    secondaryCta: {
      label: 'Explorar Ficha y Menús del Asador',
      href: '/otzarreta',
    },
  },
  musica: {
    id: 'musica',
    label: 'Música & Roster de Gala',
    icon: Music,
    badge: 'ROSTER S-CLASS · CONTRATACIÓN DIRECTA',
    title: 'Edwin Agudelo & Solistas de Gala:',
    highlight: '100 km Incluidos en 52 Provincias',
    subtitle:
      'Música en directo de máxima categoría sin comisiones de agencia. Tarifa oficial de 550,00 € con suelo garantizado desde 350,00 €, sonido profesional propio de alta fidelidad y transporte incluido.',
    benefits: [
      '100 km de transporte incluidos a cualquiera de las 52 provincias españolas',
      'Tarifa oficial transparente de 550,00 € con suelo promocional desde 350,00 €',
      'Sonorización profesional propia de alta fidelidad: cero acoples ni distorsión',
      'Split 80/10/10: 80% directo al artista para garantizar máxima entrega y puntualidad',
      'Depósito Price-Lock 100% deducible de la liquidación final',
    ],
    primaryCta: {
      label: `Reservar Actuación VIP (${DEPOSITO_STRIPE_EUR}€ Fianza Deducible)`,
      href: '/reservar/solista',
    },
    secondaryCta: {
      label: 'Calcular Presupuesto con Kilometraje',
      href: '/presupuesto',
    },
  },
  b2g: {
    id: 'b2g',
    label: 'Producción & Ayuntamientos',
    icon: Landmark,
    badge: 'CONTRATACIÓN PÚBLICA · ART. 118 LCSP',
    title: 'Grandes Eventos y Licitación Municipal:',
    highlight: 'En 1 Clic sin Concurso Público',
    subtitle:
      'Adjudicación directa para comisiones de fiestas y ayuntamientos hasta 14.250,00 € bajo el Art. 118 LCSP. Sonorización Line Array (18.000W RMS), cobertura masiva y expediente administrativo en < 72h.',
    benefits: [
      'Contratación directa municipal en 1 clic sin concurso público (hasta 14.250 €)',
      'Expediente administrativo completo listo para secretaría e intervención en < 72h',
      'Sonorización Line Array (18.000W RMS) para aforos de hasta 5.000 personas con tiro > 80m',
      'Cumplimiento legal estricto: técnicos titulados, seguro de RC y memoria visada',
      'Garantía de confort acústico según normativa ambiental vigente',
    ],
    primaryCta: {
      label: `Tramitar Licitación B2G Directa (${formatEur(AJUSTE_PREVENTIVO_B2G_EUR)})`,
      href: '/gobiernos',
    },
    secondaryCta: {
      label: 'Consultar con Centralita Oficial',
      href: `tel:${CENTRALITA.phone}`,
    },
  },
};

const VERIFIED_REVIEWS: readonly TiltReview[] = [
  {
    author: 'Elena & Iñigo (Bilbao)',
    context: 'Boda en Restaurante Otzarreta · Derio',
    text: 'La exclusividad de la finca fue absoluta. La brasa de sarmiento y el protocolo para 4 invitados celíacos impecable sin sobrecoste. Ninguna multa ni problema de horario.',
    rating: 5,
  },
  {
    author: 'D. Marcos de la Riva',
    context: 'Concejalía de Festejos · Fiestas Patronales',
    text: 'Contratación directa bajo el Art. 118 LCSP tramitada en 48 horas sin concurso ni fricción. El sonido Line Array cubrió toda la plaza con nitidez cristalina.',
    rating: 5,
  },
  {
    author: 'Beatriz y Carlos (Toledo)',
    context: 'Celebración Privada · Finca en Los Yébenes',
    text: 'Edwin Agudelo y su equipo llegaron con más de dos horas de antelación. 100 km de transporte incluidos, montaje invisible y un repertorio de gala memorable.',
    rating: 5,
  },
];

export default function SovereignScrollytellingStage(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Selector de Intención Adaptativa (Fase 1: 3 Accesos Canónicos)
  const [activeIntention, setActiveIntention] = useState<PurchaseIntention>('bodas');
  const currentIntentionConfig = INTENTION_CONFIGS[activeIntention];

  // Fase 2: Estado del Configurador de las 14 Partidas Cardinales
  const [totalBudgetEur, setTotalBudgetEur] = useState<number>(25000);
  const [partidas, setPartidas] = useState<PartidaItem[]>(() =>
    create14PartidasAllocation(25000)
  );

  const handleTotalBudgetChange = useCallback((newTotal: number) => {
    setTotalBudgetEur(newTotal);
    setPartidas((prev) => {
      const customNames = prev.filter((p) => p.isCustom).map((p) => p.name);
      return create14PartidasAllocation(newTotal, customNames);
    });
  }, []);

  const handlePartidaAmountChange = useCallback(
    (id: string, newAmountEur: number) => {
      setPartidas((prev) => rebalancePartidas(prev, id, newAmountEur, totalBudgetEur));
    },
    [totalBudgetEur]
  );

  const handleToggleLock = useCallback((id: string) => {
    setPartidas((prev) => togglePartidaLock(prev, id));
  }, []);

  const handleAddCustomPartida = useCallback(
    (customName: string) => {
      setPartidas((prev) => addCustomPartidaToEngine(prev, customName, totalBudgetEur));
    },
    [totalBudgetEur]
  );

  // Selector de Provincia para cálculo kilométrico (Acto 2)
  const [selectedProvince, setSelectedProvince] = useState<SpanishProvince>('Madrid');
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);

  // Mapeo continuo del scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 200,
    mass: 0.5,
  });

  // Cálculo logístico para el selector de provincia
  const logisticsResult = useMemo(() => {
    const km = getDistanceKmFromMentrida(selectedProvince);
    const logistics = computeSovereignLogistics(km);
    const totalArtistPrice =
      TARIFA_ESTANDAR_SOLISTA_EUR +
      (km > SOLISTA_KM_INCLUIDOS ? logistics.travelCost : 0) +
      (logistics.requiresHotel ? logistics.hotelSupplement : 0);
    return {
      km,
      logistics,
      totalArtistPrice,
    };
  }, [selectedProvince]);

  // Transiciones de los 4 actos
  const act0Opacity = useTransform(smoothProgress, [0, 0.18, 0.26], [1, 1, 0]);
  const act0Y = useTransform(smoothProgress, [0, 0.26], [0, -60]);
  const act0Scale = useTransform(smoothProgress, [0, 0.26], [1, 0.94]);

  const act1Opacity = useTransform(smoothProgress, [0.24, 0.30, 0.48, 0.54], [0, 1, 1, 0]);
  const act1Y = useTransform(smoothProgress, [0.24, 0.30, 0.48, 0.54], [50, 0, 0, -50]);
  const act1Scale = useTransform(smoothProgress, [0.24, 0.30, 0.48, 0.54], [0.95, 1, 1, 0.95]);

  const act2Opacity = useTransform(smoothProgress, [0.52, 0.58, 0.72, 0.78], [0, 1, 1, 0]);
  const act2Y = useTransform(smoothProgress, [0.52, 0.58, 0.72, 0.78], [50, 0, 0, -50]);
  const act2Scale = useTransform(smoothProgress, [0.52, 0.58, 0.72, 0.78], [0.95, 1, 1, 0.95]);

  const act3Opacity = useTransform(smoothProgress, [0.75, 0.81, 1], [0, 1, 1]);
  const act3Y = useTransform(smoothProgress, [0.75, 0.81, 1], [50, 0, 0]);
  const act3Scale = useTransform(smoothProgress, [0.75, 0.81, 1], [0.95, 1, 1]);

  // Indicador numérico para el HUD flotante
  const [displayProgress, setDisplayProgress] = useState(0);
  React.useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      setDisplayProgress(Math.min(100, Math.max(0, Math.round(latest * 100))));
    });
  }, [smoothProgress]);

  // Dock items canónicos
  const dockItems: readonly DockItem[] = useMemo(
    () => [
      {
        id: 'presupuesto',
        label: 'Presupuesto + Seating Cortesía (190€)',
        icon: Calendar,
        href: '/presupuesto',
      },
      {
        id: 'fianza',
        label: `Bloquear Fecha (Stripe ${DEPOSITO_STRIPE_EUR.toFixed(0)}€ Deducible)`,
        icon: CreditCard,
        href: '/reservar',
      },
      {
        id: 'centralita',
        label: `Centralita Directa (${CENTRALITA.display})`,
        icon: Phone,
        href: `tel:${CENTRALITA.phone}`,
      },
      {
        id: 'maitre',
        label: 'Hablar con Maître 24/7',
        icon: MessageCircle,
        action: 'open-concierge',
      },
    ],
    []
  );

  const theme = getVanguardiaTheme('oro');

  return (
    <div ref={containerRef} className="relative w-full h-[540vh] bg-[#030305]">
      {/* ESCENARIO ANCLADO AL VIEWPORT */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* FASE 1: REPRODUCTOR DE VÍDEO LOCAL EN BUCLE (HERO.mp4) & FALLBACK OLED    */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden min-h-screen">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="w-full h-full object-cover opacity-30 transition-opacity duration-1000 motion-reduce:hidden"
          >
            <source src="/HERO.mp4" type="video/mp4" />
            <source src="/hero.mp4" type="video/mp4" />
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>

          {/* Velo Cinematográfico Degradado OLED #030305 (CLS = 0.000) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/85 via-[#030305]/75 to-[#030305]" />
        </div>

        {/* Partículas Cinemáticas */}
        <div className="absolute inset-0 z-[5] pointer-events-none opacity-40">
          <ParticleField count={50} rgb={theme.accentRgb} />
        </div>

        {/* Iluminación Ambiental Difusa */}
        <AmbientGlowOrb variant="oro" position="top-right" size={540} intensity={0.22} className="z-[6]" />
        <AmbientGlowOrb variant="oro" position="bottom-left" size={420} intensity={0.16} className="z-[6]" />

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* BARRA SUPERIOR CONSOLIDADA: EXACTAMENTE 3 ACCESOS POR INTENCIÓN          */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <header
          aria-label="Selector de intención de compra y seguimiento"
          className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] w-[min(94vw,980px)] flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#09090d]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        >
          {/* Los 3 Accesos Canónicos */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center">
            {(Object.keys(INTENTION_CONFIGS) as PurchaseIntention[]).map((key) => {
              const tab = INTENTION_CONFIGS[key];
              const isSelected = activeIntention === key;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveIntention(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold tracking-wider uppercase transition-all ${
                    isSelected
                      ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.4)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Estado de Progreso de la Experiencia */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10 text-xs font-mono">
            <span className="text-zinc-400 uppercase text-[10px] tracking-wider">Avance</span>
            <span className="font-bold text-[#ecb613]">{String(displayProgress).padStart(2, '0')}%</span>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* ACTO 0 (0.00 - 0.25): HERO NARRATIVO ADAPTATIVO CON VÍDEO LOCAL         */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            opacity: act0Opacity,
            y: act0Y,
            scale: act0Scale,
            pointerEvents: displayProgress < 24 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-[20] flex flex-col items-center justify-center px-4 sm:px-6 text-center"
        >
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIntention}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col items-center"
              >
                {/* Badge de Categoría */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs font-semibold uppercase tracking-widest mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentIntentionConfig.badge}</span>
                </div>

                {/* Gran Titular Syne */}
                <h1 className="font-[family-name:var(--font-src-syne)] font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-white uppercase leading-[1.05] max-w-5xl">
                  {currentIntentionConfig.title} <span className="text-[#ecb613]">{currentIntentionConfig.highlight}</span>
                </h1>

                {/* Subtítulo enfocado en la tranquilidad del cliente */}
                <p className="mt-5 text-sm sm:text-base md:text-lg text-zinc-300 max-w-3xl font-sans font-light leading-relaxed">
                  {currentIntentionConfig.subtitle}
                </p>

                {/* Botones Primarios con Atracción Magnética */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <MagneticCta
                    href={currentIntentionConfig.primaryCta.href}
                    label={currentIntentionConfig.primaryCta.label}
                    className="bg-[#ecb613] text-black shadow-[0_0_25px_rgba(236,182,19,0.35)]"
                  />
                  <Link
                    href={currentIntentionConfig.secondaryCta.href}
                    className="inline-flex min-h-[48px] items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {currentIntentionConfig.secondaryCta.label}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Desplazamiento */}
            <div className="mt-10 flex flex-col items-center gap-1.5 text-zinc-500 font-mono text-[11px] tracking-wider uppercase">
              <span className="text-zinc-400">Desliza para explorar la infraestructura</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-[#ecb613]" />
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* ACTO 1 (0.25 - 0.52): BIFURCACIÓN SEGÚN INTENCIÓN ACTIVA                */}
        {/* - B2G: CONSOLA MINISTERIAL DE LICITACIÓN EXPRÉS (ART. 118 LCSP)         */}
        {/* - BODAS / MÚSICA: OTZARRETA 4 MENÚS & MOTOR DE 14 PARTIDAS CON CANDADOS */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            opacity: act1Opacity,
            y: act1Y,
            scale: act1Scale,
            pointerEvents: displayProgress >= 24 && displayProgress < 53 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-[21] flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto py-12"
        >
          <div className="w-full max-w-5xl mx-auto space-y-5">
            {activeIntention === 'b2g' ? (
              /* FASE 4: CONSOLA MINISTERIAL B2G */
              <B2GMinisterialConsole />
            ) : (
              /* FASE 2 & 3: OTZARRETA & MOTOR DE 14 PARTIDAS */
              <>
                {/* Cabecera Ficha Soberana Otzarreta (Derio, Bizkaia) */}
                <div className="rounded-3xl bg-[#09090d]/85 border border-white/10 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Eduardo Martínez · Asador Tradicional Otzarreta (Caserío de 1902 · Derio)</span>
                      </div>
                      <h2 className="font-[family-name:var(--font-src-syne)] font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                        Los 4 Menús Oficiales Cerrados (Celíacos a 0,00 €)
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <Car className="w-4 h-4 text-orange-400" />
                      <span>120 Párking</span>
                      <span className="text-zinc-600">|</span>
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span>&lt; {LIMITE_SPL_DB} dB SPL</span>
                    </div>
                  </div>

                  {/* Selector de los 4 Menús */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {OTZARRETA_WEDDING_MENUS.map((menu, idx) => {
                      const isSelected = activeMenuIndex === idx;
                      return (
                        <button
                          key={menu.name}
                          type="button"
                          onClick={() => setActiveMenuIndex(idx)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-orange-500/15 border-orange-500/40 text-white shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                              : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            OPCIÓN 0{idx + 1}
                          </span>
                          <span className="block font-bold text-xs sm:text-sm text-white truncate mt-0.5">
                            {menu.name}
                          </span>
                          <span className="block font-mono text-xs font-bold text-[#ecb613] mt-1">
                            {formatOtzarretaMenuPrice(menu.priceEur)} <span className="text-[10px] text-zinc-500">+IVA</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Seating Planner de Cortesía (190 € Ahorro) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 rounded-2xl bg-black/40 border border-white/5 p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-orange-400 uppercase flex items-center gap-1.5">
                          <Users className="w-4 h-4" /> Seating Planner 3D Pulpetti (2-12 Pax)
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Incluido sin coste (190 € Cortesía)
                        </span>
                      </div>
                      <SeatingPlannerPreview theme={theme} />
                    </div>

                    <div className="rounded-2xl bg-black/40 border border-white/5 p-3.5 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                          Aforo Homologado Derio
                        </span>
                        <p className="text-xs text-white font-sans font-medium">
                          Comedor acristalado 50–200 comensales (ampliable a 350 en jardín exterior).
                        </p>
                      </div>
                      <Link
                        href="/otzarreta"
                        className="w-full py-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-xs font-mono font-bold text-orange-300 hover:bg-orange-500/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Ver Ficha Oficial Otzarreta</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* FASE 2: MOTOR DE LAS 14 PARTIDAS CARDINALES CON CANDADOS */}
                <FourteenPartidasBudgetEngine
                  totalBudgetEur={totalBudgetEur}
                  partidas={partidas}
                  onTotalBudgetChange={handleTotalBudgetChange}
                  onPartidaAmountChange={handlePartidaAmountChange}
                  onToggleLock={handleToggleLock}
                  onAddCustomPartida={handleAddCustomPartida}
                />
              </>
            )}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* ACTO 2 (0.52 - 0.76): MÚSICA DE GALA · 100 KM INCLUIDOS EN 52 PROVINCIAS */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            opacity: act2Opacity,
            y: act2Y,
            scale: act2Scale,
            pointerEvents: displayProgress >= 52 && displayProgress < 76 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-[22] flex flex-col items-center justify-center px-4 sm:px-6"
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                <Music className="w-3.5 h-3.5" />
                <span>Edwin Agudelo &amp; Roster S-Class de Gala</span>
              </div>
              <h2 className="font-[family-name:var(--font-src-syne)] font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
                100 km de Transporte Incluidos a Cualquiera de las 52 Provincias
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
                Tarifa transparente de {formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} con suelo garantizado desde {formatEur(TARIFA_BASE_SOLISTA_EUR)} y sonido profesional propio sin acoples.
              </p>
            </div>

            <div className="rounded-3xl bg-[#09090d]/85 border border-white/10 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="province-dropdown" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#ecb613]" />
                      <span>Selecciona tu Provincia (52 Provincias de España)</span>
                    </label>
                    <select
                      id="province-dropdown"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value as SpanishProvince)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#ecb613] transition-colors"
                    >
                      {ALL_SPANISH_PROVINCES.map((prov) => (
                        <option key={prov} value={prov} className="bg-[#09090d] text-white">
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 text-xs font-sans text-zinc-300">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Montaje y prueba acústica 2 horas antes de la llegada de invitados.</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Equipo de sonido profesional propio: cero acoples ni cables a la vista.</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Repertorio a medida pactado previamente para momentos clave del evento.</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-black/40 border border-white/5 p-4 sm:p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                      INVERSIÓN EN DESTINO · {selectedProvince.toUpperCase()}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-3xl font-black text-white">
                        {formatEur(logisticsResult.totalArtistPrice)}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">+IVA</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-sans mt-1">
                      {logisticsResult.km <= SOLISTA_KM_INCLUIDOS
                        ? `Tu evento en ${selectedProvince} está dentro de los ${SOLISTA_KM_INCLUIDOS} km incluidos sin coste adicional de transporte.`
                        : `Incluye ${SOLISTA_KM_INCLUIDOS} km de franquicia gratuita + ${formatEur(logisticsResult.logistics.travelCost)} de desplazamiento adicional.`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 font-bold">GARANTÍA DE RETRIBUCIÓN DIRECTA</span>
                      <span className="text-cyan-400 font-bold">80% al Artista</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden flex">
                      <div style={{ width: '80%' }} className="h-full bg-cyan-400" />
                      <div style={{ width: '10%' }} className="h-full bg-[#ecb613]" />
                      <div style={{ width: '10%' }} className="h-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Al recibir el 80% íntegro de los honorarios sin mordidas de intermediarios, el artista se entrega al 100% en tu celebración.
                    </p>
                  </div>

                  <Link
                    href={`/reservar/solista?provincia=${encodeURIComponent(selectedProvince)}`}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Reservar a Edwin en {selectedProvince}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* ACTO 3 (0.76 - 1.00): TESTIMONIOS 3D (TILT) & TERMINAL STRIPE PRICE-LOCK */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            opacity: act3Opacity,
            y: act3Y,
            scale: act3Scale,
            pointerEvents: displayProgress >= 76 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-[23] flex flex-col items-center justify-center px-4 sm:px-6"
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garantías Verificadas &amp; Cierre de Reserva</span>
              </div>
              <h2 className="font-[family-name:var(--font-src-syne)] font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
                Contratación Directa en 1 Clic con Fianza Deducible de {DEPOSITO_STRIPE_EUR} €
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
                Stripe Price-Lock 100% deducible de la liquidación final y Seating Planner de cortesía (190 € de regalo).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              {VERIFIED_REVIEWS.map((review) => (
                <TiltReviewCard key={review.author} review={review} variant="oro" maxTilt={8} />
              ))}
            </div>

            <div className="rounded-3xl bg-[#09090d]/90 border border-[#ecb613]/30 backdrop-blur-2xl p-5 shadow-[0_0_40px_rgba(236,182,19,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#ecb613] uppercase flex items-center gap-1.5 mb-1">
                  <Lock className="w-4 h-4" /> Bloqueo Atómico de Fecha
                </span>
                <p className="text-xs text-zinc-300 font-sans max-w-xl">
                  Deposita 100,00 € para congelar la fecha en el calendario. Ninguna otra pareja o ayuntamiento podrá reservar tu día mientras pruebas el menú o afinas detalles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
                <MagneticCta
                  href="/presupuesto"
                  label={`Bloquear Fecha (${DEPOSITO_STRIPE_EUR}€)`}
                  className="bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.3)] w-full sm:w-auto"
                />
                <a
                  href={`https://wa.me/${CENTRALITA.raw}?text=${encodeURIComponent('Hola, deseo consultar la disponibilidad de fecha para un evento con Productora EAR.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-full border border-white/15 bg-white/5 text-xs font-mono font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ecb613]" />
                  <span>Centralita Directa ({CENTRALITA.display})</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DOCK SOBERANO FLOTANTE */}
        <SovereignDock variant="oro" placement="fixed" stackClassName="z-[80]" items={dockItems} />
      </div>
    </div>
  );
}

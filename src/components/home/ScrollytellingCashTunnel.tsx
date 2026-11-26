'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { MoveDown } from 'lucide-react';
import {
  SovereignStickyCheckoutBar,
  type CashTunnelActIndex,
} from '@/components/checkout/SovereignStickyCheckoutBar';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCROLLYTELLING CASH-TUNNEL · 4 ACTOS → STRIPE (ZERO CLS)
 * ════════════════════════════════════════════════════════════════════════════
 * El 100% del scroll conduce a la pasarela. Cada acto tiene su BuyBox en el
 * dock inferior (`SovereignStickyCheckoutBar`), cuyo botón primario cambia de
 * destino según el acto activo: presupuesto de finca, price-lock del solista,
 * planner + fianza o pliego B2G.
 *
 * RELOJ: `framer-motion` `useScroll({ target })` sobre un track de 400 dvh con
 * stage `sticky` de 100 dvh. El progreso (0..1) se reparte en 4 tramos iguales
 * (0–25 / 25–50 / 50–75 / 75–100 %).
 *
 * ALTERNANCIA ESTRICTA (defecto corregido 2026-11-26): el copy de cada acto se
 * desvanece DENTRO de su propio tramo y el siguiente sólo empieza a subir cuando
 * el anterior ha llegado a 0 ⇒ jamás hay dos titulares legibles superpuestos. La
 * placa visual sí hace cross-fade: dos fotografías no compiten por legibilidad.
 *
 * GEOMETRÍA (INV-11 · INV-18 · G-7 · CLS 0.000): el track y el stage declaran
 * su altura desde el primer byte; las capas visual y tipográfica son `absolute`
 * y sólo mutan `opacity` / `translate` (transform), nunca dimensiones. El dock
 * es `fixed` ⇒ fuera del flujo. Resultado: cero layout shift por montaje,
 * hidratación o cambio de acto.
 *
 * SSOT (INV-10 · AF-4): ninguna cifra comercial se escribe a mano; todas se
 * derivan de `ear-os-ssot.ts` y se formatean de forma determinista (idéntica en
 * SSR y navegador).
 * ════════════════════════════════════════════════════════════════════════════
 */

interface CashTunnelAct {
  readonly index: 1 | 2 | 3 | 4;
  readonly slug: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly metricLabel: string;
  readonly metricValue: string;
  readonly image: string;
  readonly alt: string;
}

/** Formatea euros de forma determinista (idéntica en Node/SSR y navegador). */
function eur(value: number): string {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
}

/** Los cuatro actos del túnel, en orden de scroll. Cifras 100% SSOT. */
const ACTS: readonly CashTunnelAct[] = Object.freeze([
  {
    index: 1,
    slug: 'restauracion-fincas',
    eyebrow: 'Acto 01 · Restauración & Fincas Singulares',
    title: 'La mesa se cierra antes de la primera copa.',
    body: 'Salones acristalados, brasa de encina y menús de temporada 2026 en fincas homologadas (Otzarreta). Bloquea el sábado con la fianza deducible.',
    metricLabel: 'Depósito Price-Lock',
    metricValue: `${eur(DEPOSITO_STRIPE_EUR)} deducibles`,
    image: '/images/cinematic/acto-01-sala.webp',
    alt: 'Comedor acristalado de gala nocturno con mesas montadas y copas de cristal',
  },
  {
    index: 2,
    slug: 'musica-directo',
    eyebrow: 'Acto 02 · Música en Directo',
    title: 'Solista de gala con la fecha blindada.',
    body: 'Edwin Agudelo, voz y guitarra en directo. La tarifa nace del SSOT y el price-lock deja la agenda cerrada en el instante en que se paga la fianza.',
    metricLabel: 'Tarifa solista',
    metricValue: `${eur(TARIFA_BASE_SOLISTA_EUR)} – ${eur(TARIFA_ESTANDAR_SOLISTA_EUR)}`,
    image: '/images/cinematic/acto-02-directo.webp',
    alt: 'Intérprete en directo con guitarra bajo arcos iluminados por bokeh cálido',
  },
  {
    index: 3,
    slug: 'seating-planner',
    eyebrow: 'Acto 03 · Seating Planner & Maître Digital',
    title: 'El plano de mesas y el aforo, resueltos en cristal.',
    body: 'Monta el plano 3D, cierra aforos y vincula la fianza: el Maître Digital confirma en un clic y deja la huella registrada. El planner va de cortesía con la reserva.',
    metricLabel: 'Planner 3D',
    metricValue: 'Herramienta de cortesía',
    image: '/images/cinematic/acto-01-sala.webp',
    alt: 'Macro de cristalería de gala con refracción óptica sobre mesa montada',
  },
  {
    index: 4,
    slug: 'produccion-b2g',
    eyebrow: 'Acto 04 · Producción Técnica & Licitaciones B2G',
    title: 'La plaza se ilumina sin un solo reparo de intervención.',
    body: `Rider acústico (${LIMITE_SPL_DB} dB SPL) bajo Ley 37/2003, line array calibrado y expediente LCSP con facturación electrónica antes de la mesa de contratación.`,
    metricLabel: 'Techo Art. 118 LCSP',
    metricValue: `< ${eur(AJUSTE_PREVENTIVO_B2G_EUR)}`,
    image: '/images/cinematic/acto-04-plaza.webp',
    alt: 'Plaza pública monumental iluminada de noche con público congregado',
  },
]);

const ACT_COUNT = ACTS.length;

/** Duración del desvanecido, en fracción del progreso global. */
const FADE = 0.07;

/**
 * Ventana de scroll del acto `index`: `[start, end]` sobre el progreso global
 * (0–25 / 25–50 / 50–75 / 75–100 %). Las ventanas son CONTIGUAS y NUNCA se
 * solapan: es la base geométrica de la alternancia estricta del copy.
 */
function actWindow(index: number): { readonly start: number; readonly end: number } {
  return { start: index / ACT_COUNT, end: (index + 1) / ACT_COUNT };
}

/**
 * Opacidad de la PLACA VISUAL (backdrop). Aquí SÍ se permite cross-fade: dos
 * fotografías pueden convivir durante el relevo sin competir por legibilidad y
 * el cambio queda cinematográfico. El primer y el último acto quedan sólidos en
 * los extremos del track (sin parpadeo en el borde superior/inferior).
 */
function useBackdropOpacity(progress: MotionValue<number>, index: number): MotionValue<number> {
  const { start, end } = actWindow(index);
  const isFirst = index === 0;
  const isLast = index === ACT_COUNT - 1;

  const input: number[] = isFirst
    ? [0, Math.max(end - FADE, 0.02), end + FADE]
    : isLast
      ? [start - FADE, Math.min(start + FADE, 0.98), 1]
      : [start - FADE, start + FADE, end - FADE, end + FADE];
  const output: number[] = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  return useTransform(progress, input, output);
}

/**
 * Opacidad del COPY: alternancia ESTRICTA, sin cross-fade tipográfico.
 *
 * El acto N se desvanece DENTRO de su propio tramo (`end - FADE → end`) y el
 * acto N+1 sólo empieza a subir cuando el anterior ya ha llegado a 0
 * (`start → start + FADE`, siendo `start` = `end` del anterior). Por tanto en
 * ningún instante del scroll hay dos titulares legibles superpuestos: ésa era
 * la causa exacta del texto pisado que se veía en producción.
 *
 * El rango de entrada es estrictamente creciente y queda confinado en
 * `[start, end]`, así que `useTransform` nunca extrapola dentro de otro acto.
 */
function useCopyOpacity(progress: MotionValue<number>, index: number): MotionValue<number> {
  const { start, end } = actWindow(index);
  const isFirst = index === 0;
  const isLast = index === ACT_COUNT - 1;
  // El desvanecido jamás invade más de la mitad del tramo (acto corto = fade corto).
  const fade = Math.min(FADE, (end - start) / 2);

  const input: number[] = isFirst
    ? [0, end - fade, end]
    : isLast
      ? [start, start + fade, 1]
      : [start, start + fade, end - fade, end];
  const output: number[] = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  return useTransform(progress, input, output);
}

/** Capa visual del acto: placa WebP real con parallax de escala (solo transform). */
function ActBackdrop({
  act,
  index,
  progress,
}: {
  readonly act: CashTunnelAct;
  readonly index: CashTunnelActIndex;
  readonly progress: MotionValue<number>;
}): React.JSX.Element {
  const opacity = useBackdropOpacity(progress, index);
  const { start, end } = actWindow(index);
  const scale = useTransform(progress, [start, end], [1.14, 1.02]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 z-0" aria-hidden="true">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={act.image}
          alt={act.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Capa tipográfica del acto: copy + métrica trazable al SSOT (solo opacity/translate).
 *
 * `isActive` llega del orquestador (`Math.floor(progress * 4)`), que conmuta
 * EXACTAMENTE en el mismo punto en que el copy saliente ha llegado a opacidad 0
 * y el entrante aún vale 0. Se usa para dos cosas que la opacidad sola no
 * resuelve: `visibility` real (un texto a opacity 0 sigue existiendo en el DOM y
 * puede seleccionarse o repintarse) y `aria-hidden` (un lector de pantalla no
 * debe leer cuatro titulares a la vez).
 */
function ActCopy({
  act,
  index,
  progress,
  isActive,
}: {
  readonly act: CashTunnelAct;
  readonly index: CashTunnelActIndex;
  readonly progress: MotionValue<number>;
  readonly isActive: boolean;
}): React.JSX.Element {
  const opacity = useCopyOpacity(progress, index);
  const { start, end } = actWindow(index);
  const y = useTransform(progress, [start, end], [28, -28]);

  return (
    <motion.article
      style={{ opacity, y, visibility: isActive ? 'visible' : 'hidden' }}
      aria-hidden={isActive ? undefined : true}
      className="pointer-events-none absolute inset-x-0 bottom-52 z-20 mx-auto flex max-w-3xl flex-col gap-3 px-6 sm:bottom-56 lg:bottom-36 lg:px-0"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ecb613]">
        {act.eyebrow}
      </span>
      <h2 className="max-w-2xl text-3xl font-semibold leading-[1.05] text-white sm:text-4xl lg:text-5xl">
        {act.title}
      </h2>
      <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">{act.body}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
          {act.metricLabel}
        </span>
        <span className="font-mono text-xs font-semibold text-[#f5d97a]">{act.metricValue}</span>
      </div>
    </motion.article>
  );
}

/**
 * Orquestador del túnel: reloj de scroll, 4 actos y dock de pago persistente.
 * El stage es `sticky` sobre un track de 400 dvh ⇒ cada acto ocupa 100 dvh de
 * recorrido (0–25 / 25–50 / 50–75 / 75–100 %).
 */
export function ScrollytellingCashTunnel(): React.JSX.Element {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const [activeAct, setActiveAct] = useState<CashTunnelActIndex>(0);

  // Re-render sólo cuando cambia el acto (no en cada frame de scroll): INP intacto.
  useMotionValueEvent(scrollYProgress, 'change', (value: number) => {
    const next = Math.min(
      ACT_COUNT - 1,
      Math.max(0, Math.floor(value * ACT_COUNT))
    ) as CashTunnelActIndex;
    setActiveAct((current) => (current === next ? current : next));
  });

  return (
    <section
      className="relative w-full bg-[#030305]"
      aria-label="Scrollytelling de las cuatro verticales de Productora EAR"
    >
      <div ref={trackRef} className="relative h-[400dvh] w-full">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#030305]">
          {ACTS.map((act, i) => (
            <ActBackdrop
              key={act.slug}
              act={act}
              index={i as CashTunnelActIndex}
              progress={scrollYProgress}
            />
          ))}

          {/* Scrim de legibilidad: negro OLED, nunca color de acento. */}
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_20%_88%,rgba(3,3,5,0.94)_0%,rgba(3,3,5,0.6)_36%,rgba(3,3,5,0)_68%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-[#030305]/85 via-[#030305]/25 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[58%] bg-gradient-to-t from-[#030305]/95 via-[#030305]/55 to-transparent"
            aria-hidden="true"
          />

          {/* Un único copy visible por acto: `activeAct` conmuta justo en el
              punto donde el saliente ya vale 0 y el entrante aún vale 0. */}
          {ACTS.map((act, i) => (
            <ActCopy
              key={act.slug}
              act={act}
              index={i as CashTunnelActIndex}
              progress={scrollYProgress}
              isActive={activeAct === i}
            />
          ))}

          <div className="absolute bottom-24 right-6 z-30 hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40 sm:right-10 lg:right-16 lg:flex">
            Scroll
            <MoveDown size={12} strokeWidth={1.5} aria-hidden="true" />
          </div>

          {/* Hairline de progreso global (scaleX: capas compuestas, cero layout). */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px w-full bg-white/10"
            aria-hidden="true"
          >
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-px w-full origin-left bg-[#ecb613] will-change-transform"
            />
          </div>
        </div>
      </div>

      <SovereignStickyCheckoutBar activeAct={activeAct} />
    </section>
  );
}

export default ScrollytellingCashTunnel;

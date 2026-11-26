'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import type {
  CinematicActIndex,
  CinematicCameraMove,
  CinematicCopyStageProps,
  CinematicCta,
} from '@/types/cinematic-hero';
import { clamp01, smoothstep } from './cinematicMath';
import { progressForAct } from './cinematicSignal';
import { CinematicMaitrePanel } from './CinematicMaitrePanel';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAPA TIPOGRÁFICA CINEMATOGRÁFICA (copy de los 4 actos)
 * ════════════════════════════════════════════════════════════════════════════
 * Los 4 paneles están SIEMPRE montados, apilados en el mismo rectángulo
 * (`absolute inset-0`). El reloj sólo altera `opacity` y `translate3d`, jamás
 * geometría ⇒ CLS 0.000 (INV-18) y transiciones compuestas en la GPU.
 *
 * El CTA `open-maitre` dispara el evento que ya escucha el dock real del
 * asistente (`SovereignConciergeWidget`), no una fachada de chat.
 * ════════════════════════════════════════════════════════════════════════════
 */

const CAMERA_LABEL: Readonly<Record<CinematicCameraMove, string>> = {
  'travelling-rasante': 'Travelling rasante',
  'whip-pan': 'Whip-pan',
  'macro-refraccion': 'Macro · refracción',
  'grua-cenital': 'Grúa cenital',
};

/** Abre el dock del Maître Digital (asistente real montado en el layout raíz). */
function openMaitreDock(): void {
  window.dispatchEvent(new Event('open-ai-concierge'));
}

function invokeCta(cta: CinematicCta): void {
  if (cta.action === 'open-maitre') {
    openMaitreDock();
  }
}

export function CinematicCopyStage({ bus, scenes }: CinematicCopyStageProps): React.JSX.Element {
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const unsubscribe = bus.subscribe((signal) => {
      const progress = clamp01(signal.progress);
      const lastIndex = scenes.length - 1;

      for (let index = 0; index < scenes.length; index += 1) {
        const panel = panelRefs.current[index];
        if (!panel) continue;

        // Fundido ALINEADO AL LÍMITE DE ACTO: la salida termina exactamente
        // donde arranca la entrada del siguiente panel, de modo que nunca hay
        // dos claims superpuestos (el fantasma tipográfico es inaceptable).
        const start = progressForAct(index as CinematicActIndex);
        const end = index === lastIndex ? 1 : progressForAct((index + 1) as CinematicActIndex);
        const enter = index === 0 ? 1 : smoothstep(start, Math.min(start + 0.022, end), progress);
        const exit =
          index === lastIndex ? 1 : 1 - smoothstep(Math.max(end - 0.022, start), end, progress);
        const opacity = clamp01(enter * exit);
        const lift = (1 - opacity) * 22;

        panel.style.opacity = opacity.toFixed(3);
        panel.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0)`;
        panel.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
        panel.inert = opacity <= 0.5;
      }
    });

    return unsubscribe;
  }, [bus, scenes]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          ref={(node) => {
            panelRefs.current[index] = node;
          }}
          className="absolute inset-0 flex flex-col justify-between px-6 pb-24 pt-24 will-change-[opacity,transform] sm:px-10 sm:pb-28 sm:pt-28 lg:px-16"
          style={{ opacity: index === 0 ? 1 : 0 }}
          inert={index !== 0}
          data-cinematic-act={scene.index}
        >
          {/* Slate técnico del acto */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">
            <span className="text-white/70">
              Acto {scene.index} / {scenes.length}
            </span>
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <span>{CAMERA_LABEL[scene.camera]}</span>
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <span>Anamórfico 2.39:1</span>
          </div>

          {scene.id === 'acto-03-maitre' && (
            <div className="absolute right-6 top-32 hidden lg:right-24 lg:top-40 lg:block">
              <CinematicMaitrePanel />
            </div>
          )}

          {/* Bloque de copy */}
          <div className="max-w-[min(92vw,46rem)] pr-14 lg:pr-0">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#ecb613]/70" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ecb613] sm:text-[11px]">
                {scene.label}
              </span>
            </div>

            <h2 className="mt-5 font-syne !text-[clamp(1.7rem,3.1vw,2.9rem)] !leading-[1.06] font-extrabold tracking-[-0.035em] text-white">
              {scene.claim}
            </h2>

            <p className="mt-4 max-w-[36rem] font-montserrat text-[13px] leading-relaxed text-white/65 sm:text-[15px]">
              {scene.detail}
            </p>

            <dl className="mt-6 flex flex-wrap items-stretch gap-x-8 gap-y-4">
              {scene.telemetry.map((item) => (
                <div key={item.label} className="border-l border-white/15 pl-3">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-mono text-[12px] tabular-nums text-white/85">{item.value}</dd>
                </div>
              ))}
            </dl>

            {scene.ctas && scene.ctas.length > 0 && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {scene.ctas.map((cta) =>
                  cta.href ? (
                    <Link
                      key={cta.id}
                      href={cta.href}
                      className={
                        cta.emphasis === 'primary'
                          ? 'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#030305] transition-colors duration-200 hover:bg-[#f5c538]'
                          : 'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:border-white/40'
                      }
                    >
                      {cta.label}
                      <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  ) : (
                    <button
                      key={cta.id}
                      type="button"
                      onClick={() => invokeCta(cta)}
                      className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:border-[#ecb613]/60 hover:text-[#f5d97a]"
                    >
                      <MessageSquare size={14} strokeWidth={1.5} aria-hidden="true" />
                      {cta.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';

import React, { useEffect, useRef } from 'react';
import type { CinematicKeyframeStageProps } from '@/types/cinematic-hero';
import { clamp01 } from './cinematicMath';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * DEGRADACIÓN POR KEYFRAMES WEBP · MÓVIL DE BAJA GAMA / PREFERS-REDUCED-MOTION
 * ════════════════════════════════════════════════════════════════════════════
 * Cuatro capas absolutas (una por acto) de tamaño reservado idéntico: sólo
 * cambia `opacity`, nunca geometría ⇒ CLS 0.000 (INV-18). Las placas se
 * descargan de forma progresiva (acto activo + siguiente), ahorrando datos y
 * batería. Cero canvas, cero workers, cero JS de animación continua.
 * ════════════════════════════════════════════════════════════════════════════
 */
export function CinematicKeyframeStage({
  bus,
  scenes,
}: CinematicKeyframeStageProps): React.JSX.Element {
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const unsubscribe = bus.subscribe((signal) => {
      // Posición 0..(N-1): el Acto I es opaco en 0 y el Acto IV en 1.
      const position = clamp01(signal.progress) * (scenes.length - 1);

      for (let index = 0; index < scenes.length; index += 1) {
        const layer = layerRefs.current[index];
        if (!layer) continue;

        const opacity = clamp01(1 - Math.abs(position - index));

        // Carga diferida: sólo el acto activo y el siguiente piden su placa.
        if (opacity > 0 && !layer.style.backgroundImage) {
          const plate = scenes[index]?.frames[0];
          if (plate) {
            layer.style.backgroundImage = `url("${plate.src}")`;
          }
        }

        layer.style.opacity = opacity.toFixed(3);
      }
    });

    return unsubscribe;
  }, [bus, scenes]);

  return (
    <div
      className="absolute inset-0 z-0 bg-[#030305]"
      aria-hidden="true"
      data-cinematic-engine="keyframe"
    >
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          ref={(node) => {
            layerRefs.current[index] = node;
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 ease-out will-change-[opacity]"
          style={{ opacity: index === 0 ? 1 : 0 }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030305_95%)]" />
    </div>
  );
}
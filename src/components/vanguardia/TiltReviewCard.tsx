'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BadgeCheck, Star } from 'lucide-react';
import AmbientGlowOrb from './AmbientGlowOrb';
import { getVanguardiaTheme } from './vanguardia-theme';
import type { VanguardiaVariant } from './vanguardia-theme';

export interface TiltReview {
  author: string;
  /** Contexto del evento (p. ej. "Boda, Mayo 2026"). */
  context: string;
  text: string;
  /** Valoracion 1..5, proveniente de una valoracion real almacenada. */
  rating: number;
  /** Huella SHA-256 (64 hex) emitida por el servidor. Si falta, se calcula sobre el texto en cliente. */
  sha256?: string;
}

export interface TiltReviewCardProps {
  review: TiltReview;
  variant?: VanguardiaVariant;
  /** Grados maximos de inclinacion (por defecto 9). */
  maxTilt?: number;
  className?: string;
}

const HEX_64 = /^[a-f0-9]{64}$/i;

async function sha256Hex(input: string): Promise<string | null> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return null;
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Resuelve la huella a mostrar: la del servidor si es valida; si no, la calculada sobre autor+texto. */
function useReviewFingerprint(review: TiltReview): { hash: string | null; origin: 'servidor' | 'cliente' | null } {
  const serverHash = review.sha256 && HEX_64.test(review.sha256) ? review.sha256.toLowerCase() : null;
  const [computed, setComputed] = useState<string | null>(null);

  useEffect(() => {
    if (serverHash) return undefined;
    let cancelled = false;
    void sha256Hex(`${review.author}\n${review.text}`).then((value) => {
      if (!cancelled) setComputed(value);
    });
    return () => {
      cancelled = true;
    };
  }, [serverHash, review.author, review.text]);

  if (serverHash) return { hash: serverHash, origin: 'servidor' };
  return { hash: computed, origin: computed ? 'cliente' : null };
}

export default function TiltReviewCard({ review, variant = 'oro', maxTilt = 9, className }: TiltReviewCardProps) {
  const theme = getVanguardiaTheme(variant);
  const { hash, origin } = useReviewFingerprint(review);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 180, damping: 18 });
  const spy = useSpring(py, { stiffness: 180, damping: 18 });
  const rotateY = useTransform(spx, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(spy, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rating = Math.min(5, Math.max(1, Math.round(review.rating)));

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width - 0.5);
      py.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [px, py],
  );

  const onLeave = useCallback((): void => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return (
    <div className={`[perspective:1000px] ${className ?? ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.figure
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative m-0 flex min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl border p-6 ${theme.surface} ${theme.border}`}
      >
        <AmbientGlowOrb variant={variant} position="top-right" size={260} intensity={0.18} />

        <div className="relative" style={{ transform: 'translateZ(24px)' }}>
          <div className="mb-3 flex gap-0.5" role="img" aria-label={`${rating} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-4 w-4 ${n <= rating ? `${theme.accentText} fill-current` : theme.muted}`}
              />
            ))}
          </div>
          <blockquote className={`m-0 text-base leading-relaxed ${theme.text}`}>{review.text}</blockquote>
        </div>

        <figcaption className="relative mt-5" style={{ transform: 'translateZ(12px)' }}>
          <div className={`text-sm font-bold ${theme.text}`}>{review.author}</div>
          <div className={`text-xs ${theme.muted}`}>{review.context}</div>
          <div
            className={`mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold ${theme.badge}`}
            title={hash ? `SHA-256 (${origin}): ${hash}` : 'Calculando huella SHA-256'}
          >
            <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              SHA-256 {hash ? `${hash.slice(0, 10)}...${hash.slice(-6)}` : '...'}
            </span>
          </div>
        </figcaption>
      </motion.figure>
    </div>
  );
}

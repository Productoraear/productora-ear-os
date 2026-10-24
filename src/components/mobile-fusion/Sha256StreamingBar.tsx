'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sha256Hex } from '@/lib/crypto/sha256';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * HASH VISUALIZER EN STREAMING — SHA-256 MATRIX / JETBRAINS MONO
 * ════════════════════════════════════════════════════════════════════════════
 * A medida que el cliente escribe/dibuja su firma (el `payload` muta), los 64
 * caracteres del hash SHA-256 real se recalculan y "corren" caracter a caracter:
 *  - Onda de revelado izquierda → derecha (easeOutCubic vía rAF a 60 fps).
 *  - Los caracteres aún no revelados parpadean en hexadecimal aleatorio (efecto
 *    Matrix) y se clavan en su valor definitivo cuando la onda los alcanza.
 *  - Punto de estado: ámbar parpadeante mientras calcula, esmeralda al bloquear.
 * ════════════════════════════════════════════════════════════════════════════
 */

const HEX_CHARS = '0123456789abcdef';

export default function Sha256StreamingBar({
  payload,
  label = 'SHA-256 · SELLO CONTRACTUAL',
  className = '',
}: {
  payload: string;
  label?: string;
  className?: string;
}) {
  const target = useMemo(() => sha256Hex(payload), [payload]);
  const [display, setDisplay] = useState<string>(() => sha256Hex(payload));
  const displayRef = useRef<string>(display);

  useEffect(() => {
    const from = displayRef.current.split('');
    const to = target.split('');
    const start = performance.now();
    const durationMs = 1000;
    let rafId = 0;

    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const chars = to.map((targetChar, i) => {
        const fromChar = from[i] ?? '0';
        if (fromChar === targetChar) return targetChar;
        // La onda revela carácter a carácter; antes de llegar, parpadeo Matrix.
        if (eased >= i / 64) return targetChar;
        return HEX_CHARS[Math.floor(Math.random() * 16)];
      });
      const next = chars.join('');
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target]);

  const settled = display === target;

  return (
    <div
      className={`rounded-2xl bg-black/70 border border-white/10 p-3 space-y-1.5 overflow-hidden backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/50 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              settled ? 'bg-emerald-400' : 'bg-[#ecb613] animate-ping'
            }`}
          />
          {label}
        </span>
        <span className={`text-[9px] font-mono font-bold ${settled ? 'text-emerald-400' : 'text-[#ecb613]'}`}>
          {settled ? 'BLOQUEADO' : 'CALCULANDO…'}
        </span>
      </div>
      <p
        className="text-[11px] leading-relaxed font-mono break-all text-[#00E5FF] select-all tabular-nums"
        style={{ textShadow: '0 0 8px rgba(0,229,255,0.35)' }}
        aria-label={`Hash SHA-256 del contrato: ${display}`}
      >
        {display}
      </p>
    </div>
  );
}

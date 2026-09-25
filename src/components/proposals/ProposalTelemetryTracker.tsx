'use client';

/**
 * 👁️ EAR OS V2 — RASTREADOR DE TELEMETRÍA DE LECTURA S-CLASS
 * ------------------------------------------------------------------
 * Mide el tiempo de lectura por sección y avisa a Telegram cuando
 * el cliente abre la propuesta o se detiene en los importes.
 * Usa IntersectionObserver y navigator.sendBeacon al cerrar pestaña.
 */

import { useEffect, useRef } from 'react';

const ENDPOINT = '/api/proposals/telemetry';
const INTERVALO_VOLCADO_MS = 15000;

export function ProposalTelemetryTracker({ token }: { token: string }) {
  const registeredOpen = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const buzon = new Map<string, number>();
    const tiemposInicio = new Map<string, number>();

    const anotar = (seccion: string, ms: number) => {
      if (ms < 1000) return; // Filtrar scroll rápido accidental
      buzon.set(seccion, (buzon.get(seccion) ?? 0) + ms / 1000);
    };

    const cerrarAbiertas = () => {
      const now = performance.now();
      for (const [sec, start] of tiemposInicio) {
        anotar(sec, now - start);
      }
      tiemposInicio.clear();
    };

    const enviar = async (payload: Record<string, unknown>) => {
      try {
        await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, ...payload }),
          keepalive: true,
        });
      } catch {
        // Fallback silencioso sin interferir con la navegación del usuario
      }
    };

    const despedirse = () => {
      cerrarAbiertas();
      if (buzon.size === 0) return;
      const payload = JSON.stringify({
        token,
        secciones: Array.from(buzon.entries()).map(([sec, seg]) => ({
          seccion: sec,
          duracionSegundos: Math.round(seg),
        })),
      });
      buzon.clear();

      try {
        if (!navigator.sendBeacon?.(ENDPOINT, new Blob([payload], { type: 'application/json' }))) {
          void enviar({ beacon: true });
        }
      } catch {
        // Fallback
      }
    };

    // 1. Registro de apertura inicial
    if (!registeredOpen.current) {
      registeredOpen.current = true;
      void enviar({
        apertura: true,
        dispositivo: /Mobi|Android/i.test(navigator.userAgent) ? 'Smartphone' : 'Escritorio',
      });
    }

    // 2. Observador de intersección por sección
    let observer: IntersectionObserver | undefined;

    const observarBloques = () => {
      const bloques = document.querySelectorAll<HTMLElement>('[data-seccion]');
      if (bloques.length === 0) return false;

      observer = new IntersectionObserver(
        (entries) => {
          const now = performance.now();
          for (const entry of entries) {
            const sec = entry.target.getAttribute('data-seccion');
            if (!sec) continue;

            if (entry.isIntersecting) {
              tiemposInicio.set(sec, now);
            } else {
              const start = tiemposInicio.get(sec);
              if (start !== undefined) {
                anotar(sec, now - start);
                tiemposInicio.delete(sec);
              }
            }
          }
        },
        { threshold: 0.5 }
      );

      for (const b of bloques) observer.observe(b);
      return true;
    };

    const timer = setTimeout(observarBloques, 500);

    // 3. Volcados periódicos
    const intervalo = setInterval(() => {
      const now = performance.now();
      for (const [sec, start] of tiemposInicio) {
        anotar(sec, now - start);
        tiemposInicio.set(sec, now);
      }
      if (buzon.size > 0) {
        const datos = Array.from(buzon.entries()).map(([sec, seg]) => ({
          seccion: sec,
          duracionSegundos: Math.round(seg),
        }));
        buzon.clear();
        void enviar({ secciones: datos });
      }
    }, INTERVALO_VOLCADO_MS);

    const alOcultarse = () => {
      if (document.visibilityState === 'hidden') despedirse();
    };

    document.addEventListener('visibilitychange', alOcultarse);
    window.addEventListener('pagehide', despedirse);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalo);
      document.removeEventListener('visibilitychange', alOcultarse);
      window.removeEventListener('pagehide', despedirse);
      observer?.disconnect();
    };
  }, [token]);

  return null;
}

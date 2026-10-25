'use client';

import { useEffect, useRef } from 'react';

/**
 * SilentPanicDetector — Detector Soberano de Emergencia SOS Silencioso e Indetectable
 * 
 * ESPECIFICACIÓN:
 * - 40 segundos manteniendo pulsado el botón izquierdo del ratón (mousedown button 0).
 * - 60 segundos manteniendo pulsado el dedo sobre pantalla táctil (touchstart).
 * - REVERSIBLE: Si se suelta o cancela antes de cumplirse el tiempo, el temporizador se aborta inmediatamente sin enviar nada.
 * - TOTALMENTE SILENCIOSO: Cero efectos visuales, sonoros o alertas en el DOM para evitar alertar a terceros.
 * - Al cumplirse el temporizador, envía un beacon silencioso a `/api/security/panic-sos`.
 */
export function SilentPanicDetector() {
  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggerRef = useRef<number>(0);

  const triggerSilentSos = async (triggerSource: 'HOLD_40S_MOUSE' | 'HOLD_60S_TOUCH') => {
    // Evitar ráfagas accidentales (debounce de 5 minutos)
    const now = Date.now();
    if (now - lastTriggerRef.current < 300000) {
      return;
    }
    lastTriggerRef.current = now;

    try {
      // Disparo silencioso e indetectable vía beacon o fetch sin interferir con la UI
      await fetch('/api/security/panic-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: triggerSource,
          timestamp: new Date().toISOString(),
          context: window.location.pathname,
        }),
      });
    } catch {
      // Silencioso por diseño
    }
  };

  useEffect(() => {
    // 1. Detección de ratón: 40 segundos continuos (botón izquierdo = 0)
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Solo botón izquierdo
      
      if (mouseTimerRef.current) {
        clearTimeout(mouseTimerRef.current);
      }

      mouseTimerRef.current = setTimeout(() => {
        triggerSilentSos('HOLD_40S_MOUSE');
      }, 40000); // 40.000 ms
    };

    const handleMouseUp = () => {
      if (mouseTimerRef.current) {
        clearTimeout(mouseTimerRef.current);
        mouseTimerRef.current = null;
      }
    };

    // 2. Detección táctil: 60 segundos continuos (1 toque)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        // Si hay multi-touch cancelamos para evitar falsos positivos
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
        }
        return;
      }

      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }

      touchTimerRef.current = setTimeout(() => {
        triggerSilentSos('HOLD_60S_TOUCH');
      }, 60000); // 60.000 ms = 1 minuto
    };

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };

    // Registrar listeners pasivos globales a nivel de window
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('mouseleave', handleMouseUp, { passive: true });

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);

      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return null; // Componente completamente invisible en el DOM
}

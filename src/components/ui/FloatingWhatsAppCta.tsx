'use client';

import React, { useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CTA FLOTANTE DE WHATSAPP CON CAPTACIÓN DE LEAD (W44_T03)
 * ════════════════════════════════════════════════════════════════════════════
 * El clic abre WhatsApp SIEMPRE. La telemetría viaja en paralelo, en segundo
 * plano, con `fetch(..., { keepalive: true })`:
 *   · no hay `preventDefault()` ni espera de red: el handoff no se demora;
 *   · si el intake falla, el visitante no lo nota y el dispatcher canónico
 *     reintenta y encola en la DLQ (cero leads huérfanos);
 *   · sólo viaja el pathname (sin query, sin cookies: `credentials: 'omit'`),
 *     el teléfono PÚBLICO de centralita y un timestamp ISO-8601.
 *
 * INV-12: el número nace del SSOT (`CENTRALITA_EAR_OS`), nunca de un literal.
 *
 * Visibilidad permanente (`flex`, sin `hidden lg:flex`): la ficha insignia
 * `/otzarreta` canaliza el 100% de su conversión por este disparador directo a
 * la Centralita — sin modal web intermedio — y el resto del sitio conserva el
 * copy genérico. El destino se resuelve por ruta, nunca por un literal.
 * ════════════════════════════════════════════════════════════════════════════
 */

const LEAD_INTAKE_ENDPOINT = '/api/webhooks/call-center-intake';
const DOUBLE_CLICK_GUARD_MS = 800;
const DEFAULT_MESSAGE = 'Hola, me gustaría recibir información sobre los servicios de Productora EAR.';
/** Copy cualificado de la ficha insignia: el lead aterriza ya con contexto. */
const OTZARRETA_MESSAGE = 'Hola Conserjería EAR OS, solicito disponibilidad para Restaurante Otzarreta (Derio).';
/** Reconoce la ficha `/otzarreta` y su agenda (`restaurante-otzarreta`). */
const OTZARRETA_SURFACE_PATTERN = /(?:^|\/)(?:otzarreta|restaurante-otzarreta)(?:\/|$)/i;

const WHATSAPP_DIGITS = CENTRALITA_EAR_OS.replace(/\D/g, '');
const WHATSAPP_E164 = `+${WHATSAPP_DIGITS}`;

function createLeadId(): string {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  // Fallback para navegadores sin `crypto.randomUUID` (contexto no seguro).
  return `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function dispatchLeadIntake(origin: string): void {
  const payload = {
    leadId: createLeadId(),
    channel: 'whatsapp' as const,
    intent: 'whatsapp_click' as const,
    surface: 'floating_cta' as const,
    phone: WHATSAPP_E164,
    origin,
    timestamp: new Date().toISOString(),
  };

  void fetch(LEAD_INTAKE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
  }).catch(() => {
    // Silencio deliberado: la conversación nunca se bloquea por telemetría.
  });
}

export const FloatingWhatsAppCta: React.FC = React.memo(function FloatingWhatsAppCta() {
  const pathname = usePathname();
  // `useRef` (no `useState`): un guard anti doble-clic no debe re-renderizar.
  const lastDispatchRef = useRef(0);

  const handleClick = useCallback(() => {
    // El cliente se atiende por WhatsApp real: se registra el lead y se deja
    // que el enlace abra la conversación. Sin consola interna.
    const now = Date.now();
    if (now - lastDispatchRef.current >= DOUBLE_CLICK_GUARD_MS) {
      lastDispatchRef.current = now;
      dispatchLeadIntake(window.location.pathname || '/');
    }
  }, []);

  // Las zonas privadas no muestran superficie comercial (misma regla que
  // DynamicMobileExperienceOrchestrator). Todos los hooks ya se ejecutaron.
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/panel')) {
    return null;
  }

  // El destino se resuelve por ruta: `/otzarreta` entra ya cualificado a la
  // Centralita; el resto del sitio mantiene el copy genérico. El número sigue
  // naciendo del SSOT (INV-12), nunca de un literal.
  const message = OTZARRETA_SURFACE_PATTERN.test(pathname ?? '') ? OTZARRETA_MESSAGE : DEFAULT_MESSAGE;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      data-lead-intake="whatsapp_click"
      className="flex fixed bottom-[5.75rem] left-6 z-[45] items-center justify-center rounded-full border border-[#25D366]/60 bg-[#25D366] p-3.5 text-white shadow-[0_0_25px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-110 hover:brightness-110 group"
      aria-label={`Solicitar disponibilidad por WhatsApp a la Centralita EAR OS (${CENTRALITA_EAR_OS})`}
      title={`WhatsApp directo · Centralita ${CENTRALITA_EAR_OS}`}
    >
      <MessageCircle size={24} className="group-hover:animate-pulse" fill="currentColor" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-mono font-bold whitespace-nowrap">
        WHATSAPP DIRECTO · {CENTRALITA_EAR_OS}
      </span>
    </a>
  );
});
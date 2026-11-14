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
 * ════════════════════════════════════════════════════════════════════════════
 */

const LEAD_INTAKE_ENDPOINT = '/api/webhooks/call-center-intake';
const DOUBLE_CLICK_GUARD_MS = 800;
const DEFAULT_MESSAGE = 'Hola, me gustaría recibir información sobre los servicios de Productora EAR.';

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

  return (
    <a
      href={`https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      data-lead-intake="whatsapp_click"
      className="hidden lg:flex fixed bottom-[5.75rem] left-6 z-[45] bg-[#09090d]/95 border border-[#ecb613]/60 text-[#ecb613] p-3.5 rounded-full shadow-[0_0_25px_rgba(236,182,19,0.3)] hover:scale-110 hover:bg-[#ecb613] hover:text-black transition-all duration-300 items-center justify-center group"
      aria-label="Abrir Conserjería IA y Soporte Directo"
      title="Conserjería IA en Vivo · Clic para abrir o mantén 10s pulsado"
    >
      <MessageCircle size={24} className="group-hover:animate-pulse" fill="currentColor" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-mono font-bold whitespace-nowrap">
        CONSERJERÍA IA · {CENTRALITA_EAR_OS}
      </span>
    </a>
  );
});
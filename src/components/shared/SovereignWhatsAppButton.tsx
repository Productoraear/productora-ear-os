'use client';

import React, { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { buildClientWhatsAppHandoffUrl } from '@/lib/whatsapp/client-handoff';

export interface SovereignWhatsAppButtonProps {
  /** Texto precargado en el chat. Si falta, se genera uno contextual por ruta. */
  message?: string;
  /** URL wa.me ya construida (p. ej. mensaje firmado con huella). Tiene prioridad sobre `message`. */
  url?: string;
  providerName?: string;
  category?: string;
  asin?: string;
  estimatedTotal?: number;
  className?: string;
  children?: React.ReactNode;
}

const CLEAN_PHONE: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

/**
 * Enlace a WhatsApp con contexto. Al hacer clic envia en segundo plano
 * (fire-and-forget) la ruta y datos de la ficha a /api/concierge/webhook;
 * cualquier fallo es silencioso y nunca bloquea la navegacion a wa.me.
 */
export function SovereignWhatsAppButton({
  message,
  url,
  providerName,
  category,
  asin,
  estimatedTotal,
  className,
  children,
}: SovereignWhatsAppButtonProps) {
  const pathname = usePathname() ?? '/';

  const text = useMemo<string>(() => {
    if (message) return message;
    if (providerName) {
      return `Hola, estoy consultando la ficha de ${providerName}${category ? ` (${category})` : ''} en productoraear.com${pathname}. Quisiera verificar disponibilidad.`;
    }
    return `Hola Productora EAR, escribo desde productoraear.com${pathname} y necesito asistencia.`;
  }, [message, providerName, category, pathname]);

  const href =
    url && url.startsWith('https://wa.me/')
      ? url
      : buildClientWhatsAppHandoffUrl({ phoneDigits: CLEAN_PHONE, text, asin });

  const notifyConcierge = useCallback((): void => {
    try {
      const payload = JSON.stringify({
        pathname,
        providerName: providerName ?? null,
        category: category ?? null,
        estimatedTotal: typeof estimatedTotal === 'number' ? estimatedTotal : null,
        timestamp: new Date().toISOString(),
      });
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/concierge/webhook', new Blob([payload], { type: 'application/json' }));
        return;
      }
      void fetch('/api/concierge/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      /* fallback silencioso: nunca romper la navegacion */
    }
  }, [pathname, providerName, category, estimatedTotal]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={notifyConcierge}
      className={className}
      aria-label="Contactar por WhatsApp con contexto de la pagina"
    >
      {children ?? 'Hablar por WhatsApp'}
    </a>
  );
}

export default SovereignWhatsAppButton;

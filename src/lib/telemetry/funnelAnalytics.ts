'use client';

/**
 * 🛰️ FUNNEL ANALYTICS — CONVERSION EVENT ENGINE (S-CLASS)
 * ----------------------------------------------------------------------------
 * Tracker de cliente no bloqueante para el embudo de conversión.
 *  - sendBeacon: sobrevive a la navegación (depósito → Stripe) y no bloquea.
 *  - fetch keepalive: fallback best-effort que jamás rompe la interacción.
 *  - Session id persistido en sessionStorage (agrupación por sesión real).
 *  - UTM / referrer capturados una sola vez para atribución de campaña.
 * Cero `any`. ZONA CERO intacta: este módulo no calcula precios, solo telemetría.
 * ----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useRef } from 'react';
import type { FunnelEventName } from './funnelEventTypes';

export interface FunnelEventContext {
  step?: number;
  stepTag?: string;
  priceSnapshot?: number;
  orderId?: string;
  error?: string;
  leadName?: string;
  leadPhone?: string;
  leadEmail?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface FunnelTrackerOptions {
  funnelKey: string;
  archetype?: string;
}

interface UtmSnapshot {
  source: string | null;
  medium: string | null;
  campaign: string | null;
}

interface FunnelEventPayload {
  eventId: string;
  sessionId: string;
  funnelKey: string;
  archetype: string | null;
  step: number | null;
  stepTag: string | null;
  eventType: FunnelEventName;
  sourceUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  priceSnapshot: number | null;
  orderId: string | null;
  error: string | null;
  leadName: string | null;
  leadPhone: string | null;
  leadEmail: string | null;
  metadata: Record<string, string | number | boolean | null> | null;
  timestamp: string;
}

const SESSION_KEY = 'ear_os_funnel_session';
const INGEST_ENDPOINT = '/api/telemetry/funnel';

function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = newEventId();
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return newEventId();
  }
}

function readUtmSnapshot(): UtmSnapshot {
  if (typeof window === 'undefined') return { source: null, medium: null, campaign: null };
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
    };
  } catch {
    return { source: null, medium: null, campaign: null };
  }
}

class FunnelTracker {
  private readonly funnelKey: string;
  private readonly archetype: string | null;
  private readonly sessionId: string;
  private readonly utm: UtmSnapshot;

  constructor(options: FunnelTrackerOptions) {
    this.funnelKey = options.funnelKey;
    this.archetype = options.archetype ?? null;
    this.sessionId = readSessionId();
    this.utm = readUtmSnapshot();
  }

  track(name: FunnelEventName, context: FunnelEventContext = {}): void {
    const payload: FunnelEventPayload = {
      eventId: newEventId(),
      sessionId: this.sessionId,
      funnelKey: this.funnelKey,
      archetype: this.archetype,
      step: context.step ?? null,
      stepTag: context.stepTag ?? null,
      eventType: name,
      sourceUrl: typeof window !== 'undefined' ? window.location.pathname : null,
      utmSource: this.utm.source,
      utmMedium: this.utm.medium,
      utmCampaign: this.utm.campaign,
      referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : null,
      priceSnapshot: context.priceSnapshot ?? null,
      orderId: context.orderId ?? null,
      error: context.error ?? null,
      leadName: context.leadName ?? null,
      leadPhone: context.leadPhone ?? null,
      leadEmail: context.leadEmail ?? null,
      metadata: context.metadata ?? null,
      timestamp: new Date().toISOString(),
    };

    const body = JSON.stringify(payload);

    // 1) sendBeacon: sobrevive a navegación y no bloquea el render.
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(INGEST_ENDPOINT, blob)) return;
      } catch {
        // Cae al fallback fetch.
      }
    }

    // 2) Fallback keepalive: jamás rompe la interacción del funnel.
    if (typeof fetch === 'function') {
      void fetch(INGEST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }
  }
}

/**
 * Hook S-CLASS: emite `FUNNEL_STARTED` al montar y devuelve un `track`
 * estable (useCallback) para instrumentar el resto de pasos del embudo.
 */
export function useFunnelTracker(options: FunnelTrackerOptions): {
  track: (name: FunnelEventName, context?: FunnelEventContext) => void;
} {
  const trackerRef = useRef<FunnelTracker | null>(null);
  if (trackerRef.current === null) {
    trackerRef.current = new FunnelTracker(options);
  }
  const tracker = trackerRef.current;

  useEffect(() => {
    tracker.track('FUNNEL_STARTED', { step: 1 });
  }, [tracker]);

  const track = useCallback(
    (name: FunnelEventName, context?: FunnelEventContext): void => tracker.track(name, context),
    [tracker],
  );

  return { track };
}

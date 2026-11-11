'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * HOOK · EL CONCIERGE VE LAS CASILLAS (ORDEN 2026-11-11 §3)
 * ════════════════════════════════════════════════════════════════════════════
 * Publica el estado REAL del formulario (casillas marcadas, candados 🔒 y
 * total) en `/api/mcp/concierge` para que el agente cotice sobre él en lugar
 * de responder «no puedo ver las casillas».
 *
 * Garantías:
 *   · Debounce de 250 ms (INV-19): teclear en un slider no lanza una petición
 *     por pulsación.
 *   · `AbortController` + timeout de 8 s (INV-17): nunca queda una petición
 *     colgada; la anterior se cancela.
 *   · Fail-open silencioso: si el endpoint no responde, el formulario sigue
 *     funcionando. El fallo se expone en `error` para diagnóstico, no rompe UI.
 *   · Cero `any`: la respuesta se valida por forma antes de leerse.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import type { FormSnapshot } from '@/lib/budget/form-bridge';

/** Tiempo máximo de espera del endpoint MCP (INV-17). */
export const MCP_CONCIERGE_TIMEOUT_MS: number = 8_000;
/** Ventana de debounce del formulario (INV-19: 200-300 ms). */
export const MCP_CONCIERGE_DEBOUNCE_MS: number = 250;

/** Cotización resumida que el formulario puede pintar (céntimos enteros). */
export interface McpQuoteSummary {
  readonly totalCents: number;
  readonly selectedServicesCents: number;
  readonly balanced: boolean;
  readonly violations: readonly string[];
  readonly split: { readonly artista: number; readonly earOs: number; readonly vimume: number };
  readonly priceLockHref: string;
  readonly checkedAt: string;
}

/** Lectura defensiva: sólo se acepta lo que tiene la forma esperada. */
function readQuote(payload: unknown): McpQuoteSummary | null {
  if (payload === null || typeof payload !== 'object') return null;
  const result = (payload as { result?: unknown }).result;
  if (result === null || typeof result !== 'object') return null;
  const quote = (result as { quote?: unknown }).quote;
  if (quote === null || typeof quote !== 'object') return null;
  const envelope = quote as { checkedAt?: unknown; data?: unknown };
  const data = envelope.data;
  if (data === null || typeof data !== 'object') return null;

  const d = data as {
    tree?: { totalCents?: unknown; selectedServicesCents?: unknown; balanced?: unknown; violations?: unknown };
    split?: { artista?: unknown; earOs?: unknown; vimume?: unknown };
    priceLockHref?: unknown;
  };

  const violations: readonly string[] = Array.isArray(d.tree?.violations)
    ? (d.tree?.violations as Array<{ code?: unknown }>).map((v) => String(v?.code ?? 'UNKNOWN'))
    : [];

  return {
    totalCents: Number(d.tree?.totalCents ?? 0),
    selectedServicesCents: Number(d.tree?.selectedServicesCents ?? 0),
    balanced: d.tree?.balanced === true,
    violations,
    split: {
      artista: Number(d.split?.artista ?? 0),
      earOs: Number(d.split?.earOs ?? 0),
      vimume: Number(d.split?.vimume ?? 0),
    },
    priceLockHref: typeof d.priceLockHref === 'string' ? d.priceLockHref : '',
    checkedAt: typeof envelope.checkedAt === 'string' ? envelope.checkedAt : '',
  };
}

/**
 * Publica la instantánea y devuelve la última cotización del agente.
 * `enabled:false` desactiva el efecto (útil en SSR o en tests).
 */
export function useMcpConciergeBridge(
  snapshot: FormSnapshot,
  enabled: boolean = true,
): { readonly quote: McpQuoteSummary | null; readonly error: string | null; readonly pending: boolean } {
  const [quote, setQuote] = useState<McpQuoteSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const controllerRef = useRef<AbortController | null>(null);

  const publish = useCallback(async (payload: FormSnapshot, signal: AbortSignal): Promise<void> => {
    const response = await fetch('/api/mcp/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'form-bridge',
        method: 'tools/call',
        params: { name: 'calculate_quote', arguments: { form: payload } },
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${String(response.status)}`);
    const parsed: unknown = await response.json();
    const summary: McpQuoteSummary | null = readQuote(parsed);
    if (summary === null) throw new Error('RESPUESTA_NO_RECONOCIDA');
    setQuote(summary);
    setError(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // IN-19: debounce. IN-17: timeout + cancelación de la petición anterior.
    const timer = setTimeout(() => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const guard = setTimeout(() => controller.abort(), MCP_CONCIERGE_TIMEOUT_MS);
      setPending(true);
      publish(snapshot, controller.signal)
        .catch((err: unknown) => {
          // Un abort por debounce no es un error del usuario: no se pinta.
          if (controller.signal.aborted) return;
          setError(err instanceof Error ? err.message : 'MCP_UNAVAILABLE');
        })
        .finally(() => {
          clearTimeout(guard);
          setPending(false);
        });
    }, MCP_CONCIERGE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [snapshot, enabled, publish]);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return { quote, error, pending };
}

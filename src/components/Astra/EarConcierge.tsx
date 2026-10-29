'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePathname } from 'next/navigation';
import { Sparkles, Bot, Zap, Loader2, MessageSquare, ArrowRight, RotateCcw, Send, Link2, X } from 'lucide-react';
import { MAX_HISTORY_TURNS } from '@/lib/agents/consultationTypes';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import type {
  ConsultationPhase,
  ConsultationSnapshot,
  ConversationTurn,
} from '@/lib/agents/consultationTypes';

// Initialize Stripe (uses public key)
// 🔒 FAIL-CLOSED STRIPE CLIENT (BLINDAJE SESSION_SECRET P0): sin public key real, no hay cliente Stripe.
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLIC_KEY && STRIPE_PUBLIC_KEY !== 'pk_test_placeholder'
  ? loadStripe(STRIPE_PUBLIC_KEY)
  : null;

/* ─── Memoria del hilo (multi-turno persistente) ────────────────────────────
 * El cliente puede cerrar la pestaña y volver horas después: la conversación
 * se conserva en localStorage con caducidad de 7 días. Es su propio navegador,
 * así que no hay cesión de datos a terceros.
 * ------------------------------------------------------------------------- */
const THREAD_STORAGE_KEY: string = 'ear.concierge.thread.v1';
const THREAD_TTL_MS: number = 7 * 24 * 60 * 60 * 1000;
const MAX_SOURCES_PER_TURN: number = 4;

/** Turno del hilo con sus fuentes verificadas (solo estado de cliente). */
interface ChatTurn extends ConversationTurn {
  readonly sources: readonly string[];
}

interface PersistedThread {
  readonly savedAt: number;
  readonly messages: ChatTurn[];
  readonly consultation: ConsultationSnapshot | null;
}

/** Solo http(s): jamás se renderiza un enlace con esquema peligroso. */
function isSafeSourceUrl(raw: unknown): raw is string {
  if (typeof raw !== 'string') return false;
  const value: string = raw.trim();
  if (value.length === 0 || value.length > 2048) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Etiqueta corta del chip: dominio sin `www.` (fallback si la URL es rara). */
function sourceLabel(url: string): string {
  try {
    const host: string = new URL(url).hostname.replace(/^www\./i, '');
    return host.length > 0 ? host : 'fuente';
  } catch {
    return 'fuente';
  }
}

/** Etiqueta humana de la fase consultiva (máquina de estados S-Class). */
const PHASE_LABEL: Readonly<Record<ConsultationPhase, string>> = {
  DESCUBRIMIENTO: 'Diagnóstico',
  COTIZACION: 'Presupuesto',
  MANEJO_OBJECIONES: 'Objeciones',
  CIERRE_STRIPE: 'Cierre',
};

/** Recupera el hilo guardado, descartando cualquier entrada corrupta o caducada. */
function loadPersistedThread(): PersistedThread | null {
  try {
    const raw: string | null = window.localStorage.getItem(THREAD_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;

    const record = parsed as { savedAt?: unknown; messages?: unknown; consultation?: unknown };
    if (typeof record.savedAt !== 'number' || Date.now() - record.savedAt > THREAD_TTL_MS) {
      window.localStorage.removeItem(THREAD_STORAGE_KEY);
      return null;
    }
    if (!Array.isArray(record.messages)) return null;

    const messages: ChatTurn[] = [];
    for (const entry of record.messages as unknown[]) {
      if (!entry || typeof entry !== 'object') continue;
      const turn = entry as { role?: unknown; content?: unknown; sources?: unknown };
      if (turn.role !== 'user' && turn.role !== 'assistant') continue;
      if (typeof turn.content !== 'string' || turn.content.trim().length === 0) continue;

      // Tolerante a hilos antiguos (sin `sources`) y a URLs manipuladas a mano.
      const sources: string[] = Array.isArray(turn.sources)
        ? (turn.sources as unknown[]).filter(isSafeSourceUrl).slice(0, MAX_SOURCES_PER_TURN)
        : [];

      messages.push({ role: turn.role, content: turn.content.slice(0, 2000), sources });
    }

    const consultation: ConsultationSnapshot | null =
      record.consultation && typeof record.consultation === 'object'
        ? (record.consultation as ConsultationSnapshot)
        : null;

    return { savedAt: record.savedAt, messages, consultation };
  } catch {
    return null;
  }
}

interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

function StripeCheckoutForm({ onSuccess }: StripeCheckoutFormProps): React.JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-black/50 rounded-lg border border-[#258DCD]/30 mt-4"
      aria-label="Formulario de reserva y bloqueo de fecha S-Class"
      role="form"
      noValidate
    >
      <h3
        id="stripe-checkout-heading"
        className="text-[#AAD6CD] mb-4 text-sm uppercase tracking-widest font-bold"
      >
        Reserva &amp; Bloqueo ({DEPOSITO_STRIPE_EUR} €)
      </h3>
      <div
        className="bg-white p-3 rounded-md mb-4"
        role="group"
        aria-label="Datos de pago seguros"
        aria-describedby="stripe-checkout-heading"
      >
        <PaymentElement />
      </div>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="text-[#FF455B] text-xs mb-4"
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        aria-label={isProcessing ? 'Procesando pago de reserva' : 'Confirmar reserva S-Class por 100 euros'}
        aria-busy={isProcessing}
        aria-disabled={isProcessing || !stripe || !elements}
        className="w-full bg-[#258DCD] text-white py-3 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-[#258DCD]/80 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAD6CD] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {isProcessing ? 'Procesando...' : 'Confirmar Reserva S-Class'}
      </button>
    </form>
  );
}

export function EarConcierge(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isFetchingSecret, setIsFetchingSecret] = React.useState(false);
  const [isAskingAi, setIsAskingAi] = React.useState(false);
  const [aiModelUsed, setAiModelUsed] = React.useState<string | null>(null);
  // 🧠 Memoria real del hilo: sustituye al parpadeo de una única respuesta.
  const [messages, setMessages] = React.useState<ChatTurn[]>([]);
  const [consultation, setConsultation] = React.useState<ConsultationSnapshot | null>(null);
  const [threadHydrated, setThreadHydrated] = React.useState(false);

  const pathname = usePathname();

  const askConciergeAi = React.useCallback(async (text: string): Promise<void> => {
    const clean: string = text.trim();
    if (clean.length === 0 || isAskingAi) return;

    // El historial que viaja al servidor son los turnos ANTERIORES (sin el actual).
    // `sources` es estado de UI: al backend solo van role + content.
    const outboundHistory: ConversationTurn[] = messages
      .slice(-(MAX_HISTORY_TURNS - 1))
      .map((turn: ChatTurn): ConversationTurn => ({ role: turn.role, content: turn.content }));
    const userTurn: ChatTurn = { role: 'user', content: clean.slice(0, 2000), sources: [] };

    setMessages((prev: ChatTurn[]) => [...prev, userTurn]);
    setIsAskingAi(true);
    setQuery('');

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          pathname,
          history: outboundHistory,
        }),
      });

      if (!res.ok) {
        setMessages((prev: ChatTurn[]) => [
          ...prev,
          {
            role: 'assistant',
            content: 'No he podido conectar con el motor de consultoría ahora mismo. Escríbenos por WhatsApp (+34 693 693 048) y te atendemos al instante.',
            sources: [],
          },
        ]);
        return;
      }

      const data = (await res.json()) as {
        reply?: string;
        agentUsed?: string;
        consultation?: ConsultationSnapshot;
        webSources?: unknown;
      };
      const reply: string =
        typeof data.reply === 'string' && data.reply.trim().length > 0
          ? data.reply
          : 'Sin respuesta del motor consultivo.';

      // 🌐 Fuentes verificadas: se filtran por esquema seguro antes de renderizar.
      const sources: string[] = Array.isArray(data.webSources)
        ? (data.webSources as unknown[]).filter(isSafeSourceUrl).slice(0, MAX_SOURCES_PER_TURN)
        : [];

      setMessages((prev: ChatTurn[]) => [...prev, { role: 'assistant', content: reply, sources }]);
      setAiModelUsed(typeof data.agentUsed === 'string' ? data.agentUsed : 'deepseek-sclass');
      if (data.consultation) setConsultation(data.consultation);
    } catch {
      setMessages((prev: ChatTurn[]) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error de red al consultar al Asistente. Inténtalo de nuevo en unos segundos.',
          sources: [],
        },
      ]);
    } finally {
      setIsAskingAi(false);
    }
  }, [isAskingAi, messages, pathname]);

  /* Hidratación del hilo guardado (una sola vez, en cliente). */
  React.useEffect(() => {
    const persisted: PersistedThread | null = loadPersistedThread();
    if (persisted && persisted.messages.length > 0) {
      setMessages(persisted.messages);
      setConsultation(persisted.consultation);
    }
    setThreadHydrated(true);
  }, []);

  /* Persistencia con caducidad: el cliente vuelve y el Concierge recuerda. */
  React.useEffect(() => {
    if (!threadHydrated) return;
    try {
      if (messages.length === 0) {
        window.localStorage.removeItem(THREAD_STORAGE_KEY);
        return;
      }
      const payload: PersistedThread = {
        savedAt: Date.now(),
        messages: messages.slice(-MAX_HISTORY_TURNS),
        consultation,
      };
      window.localStorage.setItem(THREAD_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Almacenamiento no disponible (modo privado): el hilo vive solo en memoria.
    }
  }, [messages, consultation, threadHydrated]);

  /** Reinicia el hilo y borra la copia local (derecho del cliente a empezar de cero). */
  const resetThread = React.useCallback((): void => {
    setMessages([]);
    setConsultation(null);
    setAiModelUsed(null);
    setClientSecret(null);
    setQuery('');
    try {
      window.localStorage.removeItem(THREAD_STORAGE_KEY);
    } catch {
      // Sin almacenamiento disponible: nada que borrar.
    }
  }, []);

  // Web Audio API Sound Design
  const playSotaClick = React.useCallback((): void => {
    try {
      const AudioCtx: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime); // Deep sub frequency
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Fallback silencioso (Autoplay policy)
    }
  }, []);

  // Cmd+K shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent): void => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) playSotaClick();
          return !prev;
        });
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [playSotaClick]);

  // Contextual Placeholder
  let placeholder = 'Cmd+K para iniciar Concierge...';
  if (pathname.includes('/solista') || pathname.includes('/mariachi')) {
    placeholder = 'Verificar fechas para el próximo evento...';
  } else if (pathname.includes('/vimume')) {
    placeholder = 'Solicitar dossier clínico VIMUME...';
  }

  // Predictive Inference (Zero-Lag)
  // If user types 'reservar', trigger Stripe PaymentIntent fetch
  React.useEffect(() => {
    if (query.toLowerCase().includes('reservar') && !clientSecret && !isFetchingSecret) {
      setIsFetchingSecret(true);
      fetch('/api/astra/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: DEPOSITO_STRIPE_EUR, concept: 'Reserva vía Concierge' }),
      })
        .then((res) => res.json() as Promise<{ clientSecret?: string }>)
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
          setIsFetchingSecret(false);
        })
        .catch(() => setIsFetchingSecret(false));
    }
  }, [query, clientSecret, isFetchingSecret]);

  /** Último turno del hilo (para mostrar las acciones de cierre junto a la respuesta). */
  const lastTurn: ChatTurn | null =
    messages.length > 0 ? messages[messages.length - 1] ?? null : null;

  return (
    <>
      {/* Lanzador táctil — SOLO ESCRITORIO (≥1024px) y apilado en el carril derecho.
          Doctrina de Superficie Única del viewport: en móvil (<lg) la base de la
          pantalla pertenece en exclusiva al dock `SovereignMobileHUD` (z-80) y el
          asesor IA se abre desde su botón «Asesor» (evento `open-ai-concierge`).
          Un orbe flotante aquí a z-[1000] tapaba el dock y rompía el pulgar. */}
      <button
        type="button"
        onClick={(): void => {
          playSotaClick();
          setOpen(true);
        }}
        aria-label="Abrir el Concierge de EAR OS"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="hidden lg:flex fixed right-6 bottom-[10.5rem] z-[45] h-14 w-14 items-center justify-center rounded-full border border-[#ecb613]/40 bg-[#09090d]/90 text-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.25)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 hover:bg-[#ecb613] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
      >
        <MessageSquare className="h-6 w-6" aria-hidden="true" />
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="EAR Concierge"
        className="fixed inset-0 z-[1200] flex items-end justify-center sm:items-center sm:p-4"
        aria-label="Conserje inteligente EAR: busca acciones, reserva fechas y solicita dossiers"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="fixed inset-0 bg-[#030305]/80 backdrop-blur-xl"
          aria-hidden="true"
          role="presentation"
        />
        <span className="sr-only" role="note">
          Pulsa Escape para cerrar el concierge. Escribe tu consulta y pulsa Enter para hablar con el Concierge; usa las flechas arriba y abajo para navegar entre resultados.
        </span>

        <div
          className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden border border-[#258DCD]/20 bg-[#09090d]/95 text-[#FFFFFF] shadow-2xl backdrop-blur-md sm:h-auto sm:max-h-[85dvh] sm:max-w-xl sm:rounded-2xl"
          role="document"
          aria-label="Panel del conserje EAR"
        >
          {/* Cabecera fija */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#258DCD]/20 px-4 py-3">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              <Bot className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />
              Concierge EAR OS
            </span>
            <button
              type="button"
              onClick={(): void => setOpen(false)}
              aria-label="Cerrar el Concierge"
              className="rounded-lg p-2 text-zinc-400 transition-colors duration-300 ease-out hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

        {messages.length > 0 && (
          <div
            role="log"
            aria-live="polite"
            aria-label="Conversación con el Concierge de EAR OS"
            className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain border-b border-white/5 bg-black/30 px-3 py-3 scrollbar-hide sm:max-h-[42dvh] sm:flex-none"
          >
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Hilo · {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'}
                {consultation ? ` · ${PHASE_LABEL[consultation.phase]}` : ''}
              </span>
              <button
                type="button"
                onClick={resetThread}
                className="flex items-center gap-1 font-mono text-[10px] text-zinc-500 transition-colors duration-300 ease-out hover:text-[#FF2B44] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2B44]"
                aria-label="Reiniciar la conversación y borrar el historial guardado en este navegador"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" /> Nueva consulta
              </button>
            </div>

            {messages.map((turn: ChatTurn, index: number) => (
              <div
                key={`${turn.role}-${index}`}
                className={turn.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={
                    turn.role === 'user'
                      ? 'max-w-[85%] rounded-3xl rounded-br-md border border-[#ecb613]/30 bg-[#ecb613]/15 px-3.5 py-2 text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap'
                      : 'max-w-[90%] rounded-3xl rounded-bl-md border border-white/10 bg-[#09090d]/80 px-3.5 py-2 text-xs leading-relaxed text-zinc-200 backdrop-blur-md whitespace-pre-wrap'
                  }
                >
                  {turn.role === 'assistant' && (
                    <span className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#ecb613]">
                      <Bot className="w-3 h-3" aria-hidden="true" />
                      {aiModelUsed?.toUpperCase() || 'CONCIERGE S-CLASS'}
                    </span>
                  )}
                  {turn.content}
                  {turn.role === 'assistant' && turn.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2">
                      <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                        <Link2 className="w-3 h-3" aria-hidden="true" /> Fuentes
                      </span>
                      {turn.sources.map((url: string) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          title={url}
                          aria-label={`Abrir fuente verificada: ${sourceLabel(url)}`}
                          className="max-w-[10rem] truncate rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300 transition-all duration-300 ease-out hover:border-[#ecb613]/50 hover:text-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                        >
                          {sourceLabel(url)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAskingAi && (
              <div className="flex items-center gap-2 px-1 font-mono text-xs text-zinc-400" role="status">
                <Loader2 className="w-4 h-4 animate-spin text-[#ecb613]" aria-hidden="true" />
                <span>El Concierge está recordando tu evento...</span>
              </div>
            )}

            {!isAskingAi && lastTurn?.role === 'assistant' && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setQuery('reservar')}
                  className="flex items-center gap-1.5 rounded-xl bg-[#ecb613] px-3 py-1.5 font-mono text-[11px] font-bold text-black transition-all duration-300 ease-out hover:bg-[#d4a310] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" aria-hidden="true" />
                  Bloquear fecha ({DEPOSITO_STRIPE_EUR} €)
                </button>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Productora EAR, vengo del concierge: ${lastTurn.content.slice(0, 180)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 font-mono text-[11px] font-bold text-white transition-all duration-300 ease-out hover:bg-emerald-500"
                >
                  <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            )}
          </div>
        )}

        <Command.List
          id="ear-concierge-list"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 scrollbar-hide sm:max-h-[38dvh]"
          role="listbox"
          aria-label="Resultados y acciones del conserje"
        >
          <Command.Empty
            className="p-8 text-center text-gray-500 text-sm"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {isFetchingSecret ? 'Invocando motor transaccional...' : 'El Oráculo está analizando tu petición.'}
          </Command.Empty>

          {!clientSecret && query.length > 0 && !query.toLowerCase().includes('reservar') && (
            <Command.Group
              heading="Acciones Sugeridas"
              className="text-[#AAD6CD] text-xs px-2 py-3 uppercase tracking-widest"
              aria-label="Acciones sugeridas por el conserje"
            >
              <Command.Item
                onSelect={() => { void askConciergeAi(query); }}
                className="px-4 py-3 cursor-pointer text-white hover:bg-amber-500/20 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAD6CD] flex items-center justify-between"
                role="option"
                aria-label={`Preguntar a Astra IA DeepSeek: ${query}`}
              >
                <span className="flex items-center gap-2 text-[#ecb613] font-mono text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consultar a DeepSeek S-Class: &ldquo;{query}&rdquo;</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </Command.Item>
              <Command.Item
                onSelect={() => setQuery('reservar fecha')}
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#258DCD]/20 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAD6CD]"
                role="option"
                aria-label="Inyectar bloqueo de fecha S-Class por 100 euros"
              >
                Inyectar Bloqueo de Fecha S-Class ({DEPOSITO_STRIPE_EUR} €)
              </Command.Item>
              <Command.Item
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#258DCD]/20 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAD6CD]"
                role="option"
                aria-label="Auditar acústica de sala según rider S-Class"
              >
                Auditar acústica de sala <span className="opacity-50" aria-hidden="true">(Rider S-Class)</span>
              </Command.Item>
            </Command.Group>
          )}

          {/* Checkout Inyectado */}
          {clientSecret && (
            <div
              className="p-2 animate-in fade-in zoom-in duration-300"
              role="region"
              aria-label="Módulo de pago seguro Stripe"
            >
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                <StripeCheckoutForm
                  clientSecret={clientSecret}
                  onSuccess={() => {
                    setQuery('');
                    setClientSecret(null);
                    setOpen(false);
                    // trigger success redirect or animation
                    window.location.href = '/success?source=concierge';
                  }}
                />
              </Elements>
            </div>
          )}
        </Command.List>

          {/* Composer inferior: pegado al teclado, con safe-area y 16px de fuente
              (por debajo de 16px iOS hace zoom automático y rompe el layout). */}
          <div className="shrink-0 border-t border-[#258DCD]/20 bg-[#050507]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
            <div className="flex items-end gap-2">
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder={placeholder}
                aria-label="Campo de mensaje del conserje EAR"
                aria-autocomplete="list"
                aria-controls="ear-concierge-list"
                aria-expanded={open}
                role="combobox"
                enterKeyHint="send"
                autoComplete="off"
                autoCapitalize="sentences"
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {
                  if (event.key === 'Enter' && !event.shiftKey && query.trim().length > 0 && !isAskingAi) {
                    event.preventDefault();
                    event.stopPropagation();
                    void askConciergeAi(query);
                  }
                }}
                className="min-h-11 w-full flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base leading-snug text-white placeholder-gray-500 outline-none transition-colors duration-300 ease-out focus:border-[#ecb613]/60 focus:ring-1 focus:ring-[#ecb613]/40 sm:text-lg"
              />
              <button
                type="button"
                onClick={(): void => { void askConciergeAi(query); }}
                disabled={query.trim().length === 0 || isAskingAi}
                aria-label="Enviar mensaje al Concierge"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] disabled:opacity-30"
              >
                {isAskingAi
                  ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  : <Send className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-1.5 pb-0.5 text-center font-mono text-[10px] text-zinc-500">
              Enter envía · Escape cierra
            </p>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}
'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  REGISTERED_VOICES,
  getVoiceForAgent,
  getVoiceById,
} from '@/lib/voice/voiceRegistry';
import { toConversationalSpeech } from '@/lib/voice/speechNormalizer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  agentUsed?: string;
  traces?: Array<{
    message?: { to?: string; intent?: string };
    reply?: { ok?: boolean; summary?: string };
    rejected?: string;
    error?: string;
  }>;
  time: string;
}

interface SpeechRecResult {
  readonly isFinal: boolean;
  readonly 0: { readonly transcript: string };
}
interface SpeechRecEvent {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecResult>;
}
interface SpeechRec {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecCtor = new () => SpeechRec;

function renderBoldText(str: string, keyPrefix: string): React.ReactNode {
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span key={keyPrefix}>
      {parts.map((p, idx) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <strong key={idx} className="font-bold text-white">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return p;
      })}
    </span>
  );
}

/** Devuelve la URL solo si pertenece a un esquema seguro (anti-XSS / anti-javascript:). */
function safeHref(url: string): string | undefined {
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^(javascript:|data:|vbscript:|file:|blob:|about:|view-source:|chrome:|edge:)/i.test(trimmed)) {
    return undefined;
  }
  if (/^(https?:\/\/|tel:|mailto:|sms:)/i.test(trimmed)) return trimmed;
  if (/^(\/(?!\/)|#)/.test(trimmed)) return trimmed;
  return undefined;
}

function FormattedMessageContent({ text, isUser }: { text: string; isUser: boolean }): React.JSX.Element {
  if (isUser) {
    return <div className="whitespace-pre-wrap">{text}</div>;
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        const parts: React.ReactNode[] = [];
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match: RegExpExecArray | null = null;
        let lastIndex = 0;
        let partIdx = 0;

        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(renderBoldText(line.substring(lastIndex, match.index), `${lineIdx}-${partIdx++}`));
          }
          const label = match[1];
          const url = match[2];
          const href = safeHref(url);

          if (href) {
            const isExternal = /^https?:\/\//i.test(href);
            parts.push(
              <a
                key={`${lineIdx}-link-${partIdx++}`}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="my-1.5 inline-flex items-center gap-1.5 rounded-xl border border-[#ecb613]/50 bg-[#ecb613]/15 px-4 py-2 font-mono text-xs font-bold text-[#ecb613] shadow-[0_0_15px_rgba(236,182,19,0.2)] transition-all hover:scale-105 hover:bg-[#ecb613] hover:text-black"
              >
                <span>{label}</span>
              </a>
            );
          } else {
            parts.push(
              <span
                key={`${lineIdx}-nolink-${partIdx++}`}
                className="my-1.5 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-bold text-white/80"
              >
                {label}
              </span>
            );
          }
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < line.length) {
          parts.push(renderBoldText(line.substring(lastIndex), `${lineIdx}-${partIdx++}`));
        }

        return <div key={lineIdx}>{parts}</div>;
      })}
    </div>
  );
}

export function OmniAgentConsoleModal(): React.JSX.Element | null {
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [speakReplies, setSpeakReplies] = React.useState<boolean>(true);
  const [micError, setMicError] = React.useState<string>('');
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<SpeechSynthesisVoice | null>(null);
  const [selectedVoiceMode, setSelectedVoiceMode] = React.useState<string>('auto');
  const [isAudioLoading, setIsAudioLoading] = React.useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState<boolean>(false);
  const [currentlySpeakingMsgId, setCurrentlySpeakingMsgId] = React.useState<string | null>(null);
  const [lastPlaybackSource, setLastPlaybackSource] = React.useState<string | null>(null);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = React.useRef<string | null>(null);
  const synthAbortControllerRef = React.useRef<AbortController | null>(null);
  const recRef = React.useRef<SpeechRec | null>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [inputMessage, setInputMessage] = React.useState<string>('');
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome-0',
      sender: 'agent',
      text: 'Hola, soy el asistente de producción de Productora EAR para Edwin Agudelo. ¿En qué te puedo ayudar hoy?',
      agentUsed: 'omni-supervisor-daemon',
      time: '08:00',
    },
  ]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Estado para la pulsación larga secreta de 10 segundos (ratón o pantalla táctil)
  const [longPressProgress, setLongPressProgress] = React.useState<number | null>(null);
  const [longPressSecondsLeft, setLongPressSecondsLeft] = React.useState<number>(10);
  const [longPressCoords, setLongPressCoords] = React.useState<{ x: number; y: number } | null>(null);

  // Detección y priorización de voces realistas en español
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = (): void => {
      const allVoices = window.speechSynthesis.getVoices();
      const spanish = allVoices.filter((v) => v.lang.toLowerCase().startsWith('es'));
      setAvailableVoices(spanish);

      if (spanish.length > 0) {
        setSelectedVoice((current) => {
          if (current) return current;
          // Prioridad: 1. Voces "Natural/Neural" (Álvaro, Elvira, Jorge) | 2. Google español | 3. es-ES
          const natural = spanish.find((v) => /natural|neural|online/i.test(v.name));
          const google = spanish.find((v) => /google/i.test(v.name));
          const esES = spanish.find((v) => v.lang.toLowerCase() === 'es-es');
          return natural || google || esES || spanish[0];
        });
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // 1. Escuchar parámetro secreto en URL (?agent=true o ?nexus=1)
  React.useEffect(() => {
    if (searchParams) {
      const hasAgentParam = searchParams.get('agent') === 'true' || searchParams.get('nexus') === '1' || searchParams.get('agente') === 'true';
      if (hasAgentParam) {
        setIsOpen(true);
      }
    }
  }, [searchParams]);

  // 2. Escuchar atajo de teclado global (Ctrl + Shift + A o Cmd + Shift + A)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Ctrl + Shift + A o Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Esc para cerrar
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 3. Atajo secreto biométrico: Mantener pulsado 10 segundos (clic izq ratón o toque continuo en pantalla)
  React.useEffect(() => {
    if (isOpen) return; // Si ya está abierto, no capturar

    let pressTimer: ReturnType<typeof setInterval> | null = null;
    let startTimestamp = 0;
    let initialX = 0;
    let initialY = 0;
    const TARGET_DURATION_MS = 10000; // 10 segundos exactos

    const cancelLongPress = (): void => {
      if (pressTimer) {
        clearInterval(pressTimer);
        pressTimer = null;
      }
      setLongPressProgress(null);
      setLongPressCoords(null);
    };

    const handlePointerDown = (e: PointerEvent): void => {
      // Solo clic izquierdo en ratón o toque táctil / lápiz
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      // Ignorar si el usuario está interactuando con formularios o botones interactivos
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      startTimestamp = Date.now();
      initialX = e.clientX;
      initialY = e.clientY;
      setLongPressCoords({ x: e.clientX, y: e.clientY });

      pressTimer = setInterval(() => {
        const elapsed = Date.now() - startTimestamp;
        const remaining = Math.max(0, (TARGET_DURATION_MS - elapsed) / 1000);
        const progress = Math.min(100, (elapsed / TARGET_DURATION_MS) * 100);

        // Mostrar HUD solo tras 1 segundo de pulsación sostenida (evita destellos en clics normales)
        if (elapsed >= 1000) {
          setLongPressProgress(progress);
          setLongPressSecondsLeft(Math.ceil(remaining));
        }

        if (elapsed >= TARGET_DURATION_MS) {
          cancelLongPress();
          setIsOpen(true);
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([150, 50, 200]);
          }
        }
      }, 50);
    };

    const handlePointerMove = (e: PointerEvent): void => {
      if (!pressTimer) return;
      // Si el cursor o dedo se mueve más de 20 píxeles, es un desplazamiento/scroll, abortar
      const distance = Math.hypot(e.clientX - initialX, e.clientY - initialY);
      if (distance > 20) {
        cancelLongPress();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', cancelLongPress);
    window.addEventListener('pointercancel', cancelLongPress);

    return () => {
      cancelLongPress();
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', cancelLongPress);
      window.removeEventListener('pointercancel', cancelLongPress);
    };
  }, [isOpen]);

  // Auto-scroll al final del chat
  React.useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const stopAudio = React.useCallback((): void => {
    if (synthAbortControllerRef.current) {
      synthAbortControllerRef.current.abort();
      synthAbortControllerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAudioLoading(false);
    setIsAudioPlaying(false);
    setCurrentlySpeakingMsgId(null);
  }, []);

  React.useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const handleClose = (): void => {
    stopAudio();
    setIsOpen(false);
    // Limpiar el parámetro de la URL si estaba presente sin recargar
    if (searchParams?.get('agent') || searchParams?.get('nexus')) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete('agent');
      current.delete('nexus');
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.replace(`${pathname}${query}`);
    }
  };

  const toggleMic = (): void => {
    setMicError('');
    if (isListening) {
      recRef.current?.stop();
      return;
    }
    const w = window as unknown as { SpeechRecognition?: SpeechRecCtor; webkitSpeechRecognition?: SpeechRecCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setMicError('Tu navegador no soporta dictado por voz. Usa Chrome o Edge.');
      return;
    }
    const rec = new Ctor();
    rec.lang = 'es-ES';
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = '';
    rec.onresult = (e: SpeechRecEvent): void => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setInputMessage((finalText + interim).trim());
    };
    rec.onerror = (e: { error: string }): void => {
      setMicError(e.error === 'not-allowed' ? 'Permiso de micrófono denegado: pulsa el candado de la barra de direcciones y permite el micrófono.' : `Error de micrófono: ${e.error}`);
    };
    rec.onend = (): void => {
      setIsListening(false);
      if (finalText.trim()) void sendMessage(finalText.trim());
    };
    recRef.current = rec;
    setIsListening(true);
    rec.start();
  };

  const fallbackToBrowser = React.useCallback(
    (text: string, msgId?: string): void => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setIsAudioLoading(false);
        setIsAudioPlaying(false);
        setCurrentlySpeakingMsgId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const speechText = toConversationalSpeech(text);
      if (!speechText) {
        setIsAudioLoading(false);
        setIsAudioPlaying(false);
        setCurrentlySpeakingMsgId(null);
        return;
      }

      const u = new SpeechSynthesisUtterance(speechText);
      u.lang = selectedVoice?.lang || 'es-ES';
      if (selectedVoice) {
        u.voice = selectedVoice;
      }
      u.rate = 1.0;
      u.pitch = 1.0;
      u.onstart = () => {
        setIsAudioLoading(false);
        setIsAudioPlaying(true);
        if (msgId) setCurrentlySpeakingMsgId(msgId);
      };
      u.onend = () => {
        setIsAudioPlaying(false);
        setCurrentlySpeakingMsgId(null);
      };
      u.onerror = () => {
        setIsAudioLoading(false);
        setIsAudioPlaying(false);
        setCurrentlySpeakingMsgId(null);
      };
      window.speechSynthesis.speak(u);
    },
    [selectedVoice]
  );

  const speak = React.useCallback(
    async (rawText: string, agentUsed?: string, msgId?: string): Promise<void> => {
      if (!speakReplies) return;

      stopAudio();

      if (selectedVoiceMode === 'browser') {
        setLastPlaybackSource('browser');
        fallbackToBrowser(rawText, msgId);
        return;
      }

      const resolvedVoiceId =
        selectedVoiceMode === 'auto'
          ? getVoiceForAgent(agentUsed || 'omni-supervisor-daemon')
          : selectedVoiceMode;

      setIsAudioLoading(true);
      if (msgId) setCurrentlySpeakingMsgId(msgId);

      const abortController = new AbortController();
      synthAbortControllerRef.current = abortController;

      try {
        const res = await fetch('/api/voice/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: rawText,
            voiceId: resolvedVoiceId,
          }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          setLastPlaybackSource('browser-fallback');
          fallbackToBrowser(rawText, msgId);
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('audio') || contentType.includes('mpeg')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onended = () => {
            setIsAudioPlaying(false);
            setCurrentlySpeakingMsgId(null);
            if (audioUrlRef.current) {
              URL.revokeObjectURL(audioUrlRef.current);
              audioUrlRef.current = null;
            }
          };

          audio.onerror = () => {
            setIsAudioPlaying(false);
            setCurrentlySpeakingMsgId(null);
            if (audioUrlRef.current) {
              URL.revokeObjectURL(audioUrlRef.current);
              audioUrlRef.current = null;
            }
            setLastPlaybackSource('browser-fallback');
            fallbackToBrowser(rawText, msgId);
          };

          setLastPlaybackSource('cloud');
          setIsAudioLoading(false);
          setIsAudioPlaying(true);
          await audio.play();
        } else {
          const data = (await res.json()) as {
            mode?: string;
            normalizedText?: string;
            fallbackReason?: string;
          };
          setLastPlaybackSource(data.mode === 'browser' ? 'browser' : 'browser-fallback');
          setIsAudioLoading(false);
          fallbackToBrowser(data.normalizedText || rawText, msgId);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
        setIsAudioLoading(false);
        setLastPlaybackSource('browser-fallback');
        fallbackToBrowser(rawText, msgId);
      }
    },
    [fallbackToBrowser, selectedVoiceMode, speakReplies, stopAudio]
  );

function detectActiveDOMContext(): { name?: string; type?: string } | undefined {
  if (typeof document === 'undefined') return undefined;

  const FINCAS = [
    'Villa Escorial Park', 'Finca La Chopera', 'Soto de Mozanaque',
    'Finca El Regajal', 'Finca Aldea Santillana', 'La Casona de Torrelodones',
    'Finca Las Tenadas', 'Cigarral del Ángel', 'Finca Los Enebrales',
    'La Quinta de Jarama', 'Castillo de Viñuelas', 'Finca Valduerna', 'Dehesa de Valbueno'
  ];

  const modalHeading = document.querySelector('[role="dialog"] h2, [role="dialog"] h3, .finca-title');
  const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map((el) => el.textContent || '').join(' ');
  const combined = (modalHeading?.textContent || '') + ' ' + headings;

  for (const f of FINCAS) {
    if (combined.includes(f)) {
      return { name: f, type: 'finca' };
    }
  }

  return undefined;
}

  const sendMessage = async (customText?: string): Promise<void> => {
    const textToSend = customText ?? inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsSending(true);

    try {
      const activeEntity = detectActiveDOMContext();
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          pathname: typeof window !== 'undefined' ? window.location.pathname : '',
          activeEntity,
          history: messages.slice(-4).map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        agentUsed?: string;
        traces?: ChatMessage['traces'];
      };

      const replyText: string =
        typeof data.reply === 'string' && data.reply.trim()
          ? data.reply
          : typeof data.error === 'string' && data.error.trim()
            ? data.error
            : 'Sin respuesta del agente.';

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        agentUsed: data.agentUsed || 'omni-supervisor-daemon',
        traces: data.traces,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      void speak(agentMsg.text, agentMsg.agentUsed, agentMsg.id);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: '❌ Error de conexión con el Omni-Supervisor.',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return (
      <>
        {/* HUD SECRETO: Pulsación sostenida de 10 segundos (pantalla táctil o ratón) */}
        {longPressProgress !== null && (
          <div
            className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2 flex items-center gap-3.5 rounded-2xl border border-[#ecb613] bg-[#060609]/95 px-5 py-3.5 shadow-[0_0_50px_rgba(236,182,19,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: longPressCoords ? `${longPressCoords.x}px` : '50%',
              top: longPressCoords ? `${Math.max(70, longPressCoords.y - 75)}px` : '50%',
            }}
          >
            {/* Anillo de progreso SVG circular */}
            <div className="relative flex h-11 w-11 items-center justify-center">
              <svg className="h-11 w-11 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#ecb613] transition-all duration-75"
                  strokeDasharray={`${longPressProgress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-white">
                {longPressSecondsLeft}s
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-[#ecb613]">
                  INDUCING OMNI-AGENTS
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#ecb613] animate-ping" />
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-white/70">
                Mantén pulsado para invocar ({Math.round(longPressProgress)}%)
              </div>
            </div>
          </div>
        )}

        {/* Botón de acceso flotante discreto */}
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex fixed bottom-[10.25rem] right-6 z-[45] items-center gap-2 rounded-full border border-[#ecb613]/40 bg-[#09090d]/90 px-4 py-2.5 text-xs font-mono text-[#ecb613] shadow-[0_0_20px_rgba(236,182,19,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:border-[#ecb613] hover:bg-[#12121a]"
          title="Consola de Agentes (Atajos: Ctrl + Shift + A | Mantén 10s pulsado | URL: ?agent=true)"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ecb613] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ecb613]"></span>
          </span>
          <span className="font-bold tracking-wider">OMNI-AGENTS</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">Ctrl+Shift+A</kbd>
        </button>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#ecb613]/30 bg-[#060609] shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* HEADER S-CLASS */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0f] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ecb613]/20">
              <span className="h-2 w-2 rounded-full bg-[#ecb613] animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wider text-white">
                  ASISTENTE DE PRODUCCIÓN // EAR OS
                </span>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  ONLINE
                </span>
                <div className="flex items-center gap-1.5 rounded-lg border border-[#ecb613]/30 bg-[#ecb613]/10 px-2 py-0.5">
                  <span className="text-[10px] text-[#ecb613]">
                    {isAudioPlaying ? '🔊' : isAudioLoading ? '⚡' : '🎙️'} Voz:
                  </span>
                  <select
                    value={selectedVoiceMode}
                    onChange={(e) => {
                      stopAudio();
                      setSelectedVoiceMode(e.target.value);
                    }}
                    className="bg-transparent font-mono text-[10px] text-white focus:outline-none cursor-pointer"
                    title="Selecciona la voz para las respuestas de la flota"
                  >
                    <option value="auto" className="bg-[#0e0e16] text-[#ecb613]">
                      ✨ Auto (según Agente)
                    </option>
                    {REGISTERED_VOICES.map((v) => (
                      <option key={v.id} value={v.id} className="bg-[#0e0e16] text-white">
                        {v.profile.name}
                      </option>
                    ))}
                    <option value="browser" className="bg-[#0e0e16] text-white/70">
                      🌐 Síntesis Nativa Navegador
                    </option>
                  </select>
                  {isAudioLoading && (
                    <span className="font-mono text-[9px] text-[#ecb613] animate-pulse">
                      sintetizando...
                    </span>
                  )}
                  {isAudioPlaying && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                    </span>
                  )}
                  {lastPlaybackSource && (
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                      [{lastPlaybackSource}]
                    </span>
                  )}
                </div>
                {selectedVoiceMode === 'browser' && availableVoices.length > 0 && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5">
                    <span className="text-[10px] text-white/60">Tono:</span>
                    <select
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const v = availableVoices.find((item) => item.name === e.target.value);
                        if (v) setSelectedVoice(v);
                      }}
                      className="bg-transparent font-mono text-[10px] text-white focus:outline-none cursor-pointer"
                      title="Voz nativa del navegador"
                    >
                      {availableVoices.map((v) => (
                        <option key={v.name} value={v.name} className="bg-[#0e0e16] text-white">
                          {v.name.replace(/Microsoft |Online \(Natural\) - |Spanish \(Spain\)|Google /g, '').trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-0.5 flex gap-2 font-mono text-[11px] text-white/40">
                <span>Edwin Agudelo Solista & Flota de Producción</span>
                <span>•</span>
                <span className="text-[#ecb613]">Reglas SSOT Activas</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            ESC ✕
          </button>
        </div>

        {/* CHAT VIEW */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-lg ${
                  m.sender === 'user'
                    ? 'rounded-tr-sm bg-gradient-to-r from-[#ecb613] to-[#d4a010] font-sans font-medium text-black'
                    : 'rounded-tl-sm border border-white/10 bg-[#0e0e16] text-white/90'
                }`}
              >
                <FormattedMessageContent text={m.text} isUser={m.sender === 'user'} />

                {/* VISUALIZADOR DE TRAZAS EN VIVO */}
                {m.traces && m.traces.length > 0 && (
                  <div className="mt-3.5 border-t border-white/10 pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
                      ⚡ Trazas de Delegación en el Bus:
                    </span>
                    <div className="mt-2 space-y-1.5">
                      {m.traces.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 rounded border border-white/5 bg-black/40 p-2 font-mono text-xs text-white/70"
                        >
                          <span className="rounded bg-[#ecb613]/20 px-1.5 py-0.5 text-[10px] text-[#ecb613]">
                            {t.message?.to ?? 'bus'}
                          </span>
                          <span className="text-white/80">
                            {t.reply?.summary ?? t.rejected ?? t.error ?? ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`mt-1.5 flex items-center justify-between text-[10px] font-mono ${
                    m.sender === 'user' ? 'text-black/60' : 'text-white/40'
                  }`}
                >
                  <span>
                    {m.time} {m.agentUsed && `• ${m.agentUsed}`}
                  </span>
                  {m.sender === 'agent' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isAudioPlaying && currentlySpeakingMsgId === m.id) {
                          stopAudio();
                        } else {
                          void speak(m.text, m.agentUsed, m.id);
                        }
                      }}
                      className={`ml-2 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] transition-all ${
                        currentlySpeakingMsgId === m.id && (isAudioPlaying || isAudioLoading)
                          ? 'border-[#ecb613] bg-[#ecb613]/20 text-[#ecb613] animate-pulse'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-[#ecb613]'
                      }`}
                      title={currentlySpeakingMsgId === m.id && isAudioPlaying ? 'Detener locución' : 'Escuchar locución del agente'}
                    >
                      <span>{currentlySpeakingMsgId === m.id && isAudioPlaying ? '⏹' : '🔊'}</span>
                      <span className="font-mono text-[9px] uppercase">
                        {getVoiceById(getVoiceForAgent(m.agentUsed || ''))?.profile.name.split(' ')[0] || 'Voz'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-center gap-2 font-mono text-xs text-[#ecb613] animate-pulse">
              <span>●</span>
              <span>Omni-Supervisor coordinando a los agentes en el bus...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* CHIPS DE ACCIÓN RÁPIDA (ASISTENCIA CORPORATIVA S-CLASS) */}
        <div className="flex flex-wrap gap-2 border-t border-white/10 bg-[#09090d] px-6 py-2.5">
          <button
            onClick={() => sendMessage('¿Cómo funciona el depósito de 100 € de Stripe Price-Lock y por qué es 100% deducible?')}
            className="rounded-full border border-[#ecb613]/40 bg-[#ecb613]/10 px-3 py-1 font-mono text-[11px] font-semibold text-[#ecb613] hover:bg-[#ecb613] hover:text-black transition-colors"
          >
            🔒 Garantía Price-Lock 100 € Deducible
          </button>
          <button
            onClick={() => sendMessage('Presupuesto y disponibilidad para evento corporativo de gala con sonorización y música en vivo')}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white transition-colors"
          >
            🏛️ Producción Eventos & Gala Corporativa
          </button>
          <button
            onClick={() => sendMessage('Especificaciones técnicas del Rider acústico Bose y cumplimiento normativo Ley 37/2003')}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white transition-colors"
          >
            🔊 Rider Acústico & Normativa Ley 37/2003
          </button>
          <button
            onClick={() => sendMessage('Protocolo clínico VIMUME 40 Hz, certificación de impacto y deducción fiscal Ley 49/2002')}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white transition-colors"
          >
            🧠 VIMUME Impacto Clínico & Deducción Fiscal
          </button>
        </div>

        {/* INPUT FORM */}
        <div className="border-t border-white/10 bg-[#0a0a0f] p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Habla con el Omni-Supervisor o pide asistencia a la flota (ej. 'cotiza un bolo en Méntrida')..."
              className="flex-1 rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-sm text-white placeholder-white/40 focus:border-[#ecb613] focus:outline-none focus:ring-1 focus:ring-[#ecb613]"
              disabled={isSending}
              maxLength={2000}
            />
            <button
              type="button"
              onClick={toggleMic}
              aria-label={isListening ? 'Detener micrófono' : 'Hablar con el Omni-Supervisor'}
              title={isListening ? 'Escuchando… pulsa para detener' : 'Pulsa y habla (es-ES)'}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition-all ${
                isListening ? 'animate-pulse border-[#FF2B44] bg-[#FF2B44]/20 text-[#FF2B44]' : 'border-white/15 bg-black/60 text-white/70 hover:border-[#ecb613] hover:text-[#ecb613]'
              }`}
            >
              🎙
            </button>
            <button
              type="button"
              onClick={() => {
                if (speakReplies) {
                  stopAudio();
                  setSpeakReplies(false);
                } else {
                  setSpeakReplies(true);
                }
              }}
              aria-label="Activar o desactivar voz de respuesta"
              title={speakReplies ? 'Voz de respuesta: ON (pulsa para silenciar)' : 'Voz de respuesta: OFF (pulsa para activar)'}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition-all ${
                speakReplies
                  ? 'border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613]'
                  : 'border-white/15 bg-black/60 text-white/40'
              }`}
            >
              {speakReplies ? (isAudioPlaying ? '🔊' : '🔉') : '🔇'}
            </button>
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105 disabled:opacity-50"
            >
              <span>ENVIAR</span>
              <span>➔</span>
            </button>
          </form>
          {(micError || isListening) && (
            <div className={`mt-2 font-mono text-[11px] ${micError ? 'text-[#FF2B44]' : 'text-[#ecb613]'}`}>
              {micError || '🎙 Escuchando… habla ahora; se enviará solo al terminar.'}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-white/40">
            <span>Atajos: Ctrl+Shift+A • Mantén pulsado 10s (ratón / táctil) • URL: ?agent=true • Esc</span>
            <span>Persistencia DLQ: .antigravity/dlq.jsonl</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bot,
  Sparkles,
  X,
  MessageSquare,
  Calendar,
  FileText,
  Phone,
  ArrowRight,
  ShieldCheck,
  Loader2,
  CalendarDays,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_ENTITY,
  OTZARRETA_SEATING_PRESET,
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
} from '@/lib/constants/otzarreta-entity';
import { resolveVoiceProfile, type VoiceProfile } from '@/lib/voice/voice-profile-engine';
import { primeSpeechSynthesis, speakNatural, stopSpeaking } from '@/lib/voice/naturalVoice';
import { useCart, type ExtendedServiceCategory } from '@/components/checkout/CartContext';

const CLEAN_PHONE: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

interface RouteContextConfig {
  title: string;
  badge: string;
  greeting: string;
  category: string;
  providerName: string;
  suggestedWa: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    type: 'whatsapp' | 'dossier' | 'date_picker' | 'scraper' | 'add_to_cart';
    label: string;
    url?: string;
    cartItem?: {
      id: string;
      name: string;
      category: ExtendedServiceCategory;
      providerId?: string;
      providerName?: string;
      unitPriceEur: number;
      description?: string;
      badge?: string;
      distanceKm?: number;
      pax?: number;
    };
  };
}

/**
 * RUTAS DE LA FICHA INSIGNIA (Otzarreta).
 * La entidad tiene dos puertas vivas: el dossier `/otzarreta` y su agenda
 * `/calendario/<kind>/restaurante-otzarreta`. Si sólo se reconoce la primera,
 * quien llega por la agenda (que es lo que enlazan los CTA) pierde los chips
 * de contexto y el agente responde como una conserjería genérica.
 */
const OTZARRETA_SURFACE_PATTERN = /(?:^|\/)(?:otzarreta|restaurante-otzarreta)(?:\/|$)/i;

function isOtzarretaSurfaceRoute(pathname: string): boolean {
  return OTZARRETA_SURFACE_PATTERN.test(pathname);
}

function getContextForRoute(pathname: string): RouteContextConfig {
  if (pathname.includes('/reservar/solista') || pathname.includes('/artistas/e78903') || pathname.includes('/edwin-agudelo')) {
    return {
      title: 'Edwin Agudelo · Solista Exclusivo',
      badge: 'Tarifa Canónica 350 €',
      greeting: 'Hola, soy la Centralita de Edwin Agudelo. ¿Tienes fecha para tu evento? Consulta disponibilidad o reserva con precio congelado.',
      category: 'Solista',
      providerName: 'Edwin Agudelo',
      suggestedWa: 'Hola Edwin, estoy en tu ficha de solista y deseo consultar disponibilidad y precio para mi fecha.',
    };
  }
  if (pathname.includes('/ayuntamientos') || pathname.includes('/vimume/b2g') || pathname.includes('/b2g')) {
    return {
      title: 'Gabinete B2G Institucional',
      badge: 'Art. 118 LCSP',
      greeting: 'Gabinete B2G activo. ¿Deseas tramitar la memoria técnica, pliego o contrato menor Art. 118 LCSP para tu ayuntamiento?',
      category: 'B2G',
      providerName: 'Gabinete B2G EAR OS',
      suggestedWa: 'Hola Edwin, represento a un ayuntamiento/entidad pública y deseo tramitar expediente B2G bajo Art. 118 LCSP.',
    };
  }
  if (pathname.includes('/proveedores')) {
    return {
      title: 'Directorio de Proveedores EAR OS',
      badge: 'Catálogo Verificado · S-Class',
      greeting: 'Bienvenido al directorio de proveedores homologados en EAR OS. ¿Buscas fincas, restaurantes, música en directo o disponibilidad para tu evento?',
      category: 'Proveedor',
      providerName: 'Directorio Proveedores EAR OS',
      suggestedWa: 'Hola, estoy consultando el directorio de proveedores en EAR OS y necesito asesoramiento.',
    };
  }
  if (pathname.includes('/portal/proveedor') || pathname.includes('/fichas')) {
    return {
      title: 'Portal de Proveedores · EAR OS',
      badge: 'Gestión Soberana · S-Class',
      greeting: 'Conserjería de soporte para proveedores homologados. Contacta con la Centralita oficial para cualquier gestión de tu ficha.',
      category: 'Proveedor',
      providerName: 'Portal Proveedores EAR OS',
      suggestedWa: 'Hola, soy proveedor de eventos y deseo solicitar asistencia en EAR OS.',
    };
  }
  if (isOtzarretaSurfaceRoute(pathname)) {
    return {
      title: 'Ezkertza Berria & Otzarreta · Derio',
      badge: OTZARRETA_WEDDING_MENUS_CLAIM,
      greeting: `Bienvenido al Caserío Restaurante Ezkertza Berria & Otzarreta en Derio (tradición desde ${OTZARRETA_ENTITY.foundedYear}). Alta brasa de carbón de encina y sarmiento, ${OTZARRETA_WEDDING_MENUS.length} ${OTZARRETA_WEDDING_MENUS_CLAIM}, salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales), jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) y ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas de párking privado.`,
      category: 'Fincas',
      providerName: 'Ezkertza Berria & Otzarreta / Eduardo Martínez',
      suggestedWa: 'Hola, estoy en la ficha de Ezkertza Berria & Otzarreta (Derio) y deseo consultar disponibilidad y menús para mi evento.',
    };
  }
  if (pathname.includes('/fincas')) {
    return {
      title: 'Fincas & Espacios Homologados',
      badge: 'Garantía Acústica S-Class',
      greeting: `Bienvenido al catálogo de Fincas Homologadas. ¿Buscas aforo, limitador acústico o ${OTZARRETA_WEDDING_MENUS_CLAIM} en Otzarreta (Derio ${OTZARRETA_ENTITY.foundedYear})?`,
      category: 'Fincas',
      providerName: 'Fincas Homologadas',
      suggestedWa: 'Hola, estoy valorando fincas en EAR OS y deseo consultar aforo y condiciones técnicas.',
    };
  }
  if (pathname.includes('/seating-planner')) {
    return {
      title: 'Pulpetti Seating Planner SOTA',
      badge: 'Layout 3D / SVG',
      greeting: 'Organizador interactivo de mesas y aforos. ¿Necesitas exportar tu plano de mesas o sincronizar invitados?',
      category: 'Herramientas',
      providerName: 'Pulpetti Seating Planner',
      suggestedWa: 'Hola, estoy configurando mi plano de mesas en el Seating Planner y requiero asistencia técnica.',
    };
  }
  if (pathname.includes('/presupuesto') || pathname.includes('/calculadora')) {
    return {
      title: 'Planificador Presupuestario',
      badge: 'Split 80/10/10',
      greeting: 'Calculadora de presupuesto en céntimos exactos. ¿Deseas fijar fecha con depósito Stripe Price-Lock?',
      category: 'Presupuesto',
      providerName: 'Calculadora EAR OS',
      suggestedWa: 'Hola Edwin, he calculado un presupuesto en la web y deseo formalizar reserva garantizada.',
    };
  }

  // AF-1 / AF-3: ningún estado de presencia se afirma sin sonda. La Centralita
  // se declara con su horario contractual, verificable; el canal directo es la
  // línea oficial. Prohibido pintar "en línea" por defecto (verde por defecto).
  return {
    title: 'Conserjería IA · Centralita EAR OS',
    badge: 'Centralita 09:00–21:00',
    greeting: 'Bienvenido a Productora EAR. Esta conserjería resuelve catálogo, aforos y disponibilidad. Para una decisión de sala, la Centralita responde en la línea oficial.',
    category: 'General',
    providerName: 'Centralita EAR OS',
    suggestedWa: 'Hola Productora EAR, estoy navegando por productoraear.com y deseo consultar disponibilidad e información.',
  };
}

export function SovereignConciergeWidget({
  scraperSlot = null,
}: {
  readonly scraperSlot?: React.ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const { addItem, setIsOpen: setCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFastActions, setShowFastActions] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<'mediodia' | 'tarde' | 'noche'>('tarde');

  // Conversational Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Voice Interaction State (STT & TTS)
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const handleSendMessageRef = useRef<(textOverride?: string) => Promise<void>>(async () => {});

  const routeContext = useMemo(() => getContextForRoute(pathname), [pathname]);
  const isOtzarretaSurface = useMemo(() => isOtzarretaSurfaceRoute(pathname), [pathname]);
  const activeVoiceProfile: VoiceProfile = useMemo(() => resolveVoiceProfile(pathname), [pathname]);

  // Initialize Speech Recognition & Greeting
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript && transcript.trim()) {
            setInputQuery(transcript);
            void handleSendMessageRef.current(transcript);
          }
          setIsListening(false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Update greeting when route changes or initial load
  useEffect(() => {
    setMessages([
      {
        id: 'initial-greeting',
        role: 'assistant',
        text: routeContext.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [routeContext.greeting]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Listen to open-ai-concierge custom event from mobile HUD or buttons
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-ai-concierge', handleOpenEvent);
    return () => window.removeEventListener('open-ai-concierge', handleOpenEvent);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        stopSpeech();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Stop TTS speech
  const stopSpeech = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Speak text with natural Spanish Web Speech API engine (waitForVoices + es-ES + watchdogs)
  const speakText = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === 'undefined') return;
      setIsSpeaking(true);
      void speakNatural(text)
        .catch(() => {
          // Silencio controlado si el motor de voz del navegador no responde
        })
        .finally(() => {
          setIsSpeaking(false);
        });
    },
    [ttsEnabled]
  );

  // Toggle voice recognition
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeech();
      primeSpeechSynthesis();
      try {
        recognitionRef.current.lang = activeVoiceProfile.fallbackLang || 'es-ES';
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [isListening, stopSpeech, activeVoiceProfile.fallbackLang]);

  const notifyWebhook = useCallback(
    (action: string, extraData?: Record<string, unknown>) => {
      try {
        const payload = JSON.stringify({
          pathname,
          providerName: routeContext.providerName,
          category: routeContext.category,
          action,
          selectedDate: selectedDate || null,
          selectedSlot: selectedDate ? selectedSlot : null,
          timestamp: new Date().toISOString(),
          ...extraData,
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
          credentials: 'omit',
        }).catch(() => {
          // Fallback silencioso
        });
      } catch {
        // Silencio deliberado
      }
    },
    [pathname, routeContext, selectedDate, selectedSlot]
  );

  // Mensaje de recuperación: si la API no responde, la conversación NO puede
  // quedarse muda. Se ofrece el canal oficial con el texto del cliente ya
  // redactado (el agente humano recibe contexto, no una consulta ciega).
  const pushRecoveryMessage = useCallback(
    (failedQuestion: string) => {
      const recoveryText =
        'Ahora mismo no he podido confirmarte ese dato desde la Conserjería. Para no hacerte esperar, sigue la conversación con un agente humano por WhatsApp: recibirá tu pregunta tal cual y responde con voz o audio.';
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-recovery-${Date.now()}`,
          role: 'assistant',
          text: recoveryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: {
            type: 'whatsapp',
            label: `Hablar con un agente (${CENTRALITA_EAR_OS})`,
            url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
              `Hola, vengo de ${pathname} y mi consulta es: "${failedQuestion.slice(0, 140)}"`
            )}`,
          },
        },
      ]);
      notifyWebhook('concierge_api_failure', { question: failedQuestion.slice(0, 140) });
    },
    [notifyWebhook, pathname]
  );

  // Send message to conversational API
  const handleSendMessage = useCallback(
    async (textOverride?: string) => {
      const q = (textOverride || inputQuery).trim();
      if (!q || isSending) return;

      if (ttsEnabled) {
        primeSpeechSynthesis();
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputQuery('');
      setIsSending(true);

      try {
        const detectedSlug = isOtzarretaSurface ? 'otzarreta' : '';
        const historyPayload = messages
          .filter((m) => m.id !== 'initial-greeting')
          .slice(-8)
          .map((m) => ({
            role: m.role,
            content: m.text,
          }));

        const res = await fetch('/api/concierge/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: q,
            providerSlug: detectedSlug,
            history: historyPayload,
            routeContext: {
              pathname,
              providerName: routeContext.providerName,
              category: routeContext.category,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reply) {
            const assistantMsg: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              text: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: data.action,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            speakText(data.reply);

            // Si la respuesta incluye un ítem de reserva y el usuario expresó intención de reservar/carrito, lo añadimos al Carrito Soberano de inmediato
            if (
              data.action?.type === 'add_to_cart' &&
              data.action.cartItem &&
              /quiero reservar|reservar la fecha|bloquear la fecha|bloquear fecha|añadir al carrito|anadir al carrito|contratar/i.test(q)
            ) {
              addItem({
                ...data.action.cartItem,
                quantity: 1,
              });
            }
            return;
          }
        }

        // BUG P0 2026-11-21 «chip muerto»: cualquier respuesta no utilizable
        // (HTTP != 2xx, `success:false` o cuerpo vacío) se tragaba en silencio y
        // el chip parecía no responder. Nunca más: se pinta un aviso con el canal
        // humano ya abierto, de modo que la conversación siempre avanza.
        pushRecoveryMessage(q);
      } catch (err) {
        // Igual que arriba: un fallo de red no puede dejar al cliente a oscuras.
        console.warn('Error en consulta de concierge:', err);
        pushRecoveryMessage(q);
      } finally {
        setIsSending(false);
      }
    },
    [inputQuery, isSending, messages, pathname, routeContext, speakText, addItem, isOtzarretaSurface, pushRecoveryMessage, ttsEnabled]
  );

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  }, [handleSendMessage]);

  // Construct WhatsApp destination URL with contextual route, date and latest query
  const waUrl = useMemo(() => {
    let msg = routeContext.suggestedWa;
    if (selectedDate) {
      msg += ` He preseleccionado la fecha ${selectedDate} en turno ${selectedSlot.toUpperCase()}.`;
    }
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.text;
    if (lastUserMessage) {
      msg += ` Consulta actual (${pathname}): "${lastUserMessage.slice(0, 140)}"`;
    }
    return `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(msg)}`;
  }, [routeContext.suggestedWa, selectedDate, selectedSlot, messages, pathname]);

  const handleWhatsAppClick = useCallback(() => {
    notifyWebhook('whatsapp_click');
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }, [notifyWebhook, waUrl]);

  const handleDossierClick = useCallback(() => {
    notifyWebhook('dossier_print_click');
    if (pathname.includes('/portal/proveedor') || pathname.includes('/otzarreta')) {
      window.print();
    } else {
      window.open('/portal/proveedor', '_blank');
    }
  }, [notifyWebhook, pathname]);

  // Exclude from admin back-office routes
  if (!mounted || pathname.startsWith('/admin') || pathname.startsWith('/panel')) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(var(--ear-dock-h,5rem)+0.75rem)] lg:bottom-6 right-4 sm:right-6 z-[85] flex flex-col items-end select-none pointer-events-none">
      {/* ─── CHAT POPOVER S-CLASS ─── */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label="Conserjería IA Productora EAR"
          className="pointer-events-auto mb-3 flex h-[min(600px,85svh)] w-[calc(100%-2rem)] max-w-[420px] flex-col overflow-hidden rounded-card border border-white/[0.10] bg-[#08080C] text-[#F4F1EA] shadow-elevation-2 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-card border border-[#ecb613]/30 bg-[#0E0E14] text-[#ecb613] shadow-micro-border">
                <Bot size={18} aria-hidden="true" />
                {/* Indicador de canal: anillo de 1 px en oro, sin pulso continuo
                    (Floor 10) y sin punto verde de presencia no sondeada
                    (AF-1: prohibido el verde por defecto). */}
                <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#ecb613] ring-2 ring-[#08080C]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-[#F4F1EA]">{routeContext.title}</h3>
                <p className="text-xs leading-tight text-[#8E8A80]">{routeContext.badge} · atención humana en la Centralita</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Handoff al AGENTE humano por WhatsApp (voz o nota de audio).
                  Requisito del CEO: el canal conversacional por WhatsApp es el
                  agente; el widget no puede ser un chatbot cerrado. El mensaje
                  viaja ya redactado con el contexto exacto de la página. */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => notifyWebhook('whatsapp_agent_handoff')}
                className="rounded-lg p-1.5 text-emerald-300 transition-colors hover:bg-emerald-500/15 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                title="Hablar con un agente por WhatsApp (admite nota de voz)"
                aria-label="Hablar con un agente por WhatsApp"
              >
                <MessageSquare size={16} />
              </a>

              {/* Speaker TTS Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeech();
                  setTtsEnabled((prev) => !prev);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  ttsEnabled ? 'text-[#ecb613] bg-[#ecb613]/10 hover:bg-[#ecb613]/20' : 'text-[#8E8A80] hover:text-[#C9C4B8]'
                }`}
                title={ttsEnabled ? 'Voz activada (clic para silenciar)' : 'Voz desactivada (clic para activar)'}
                aria-label="Alternar voz del asistente"
              >
                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  stopSpeech();
                }}
                className="rounded-lg p-1.5 text-[#C9C4B8] transition-colors hover:bg-white/[0.06] hover:text-[#F4F1EA]"
                aria-label="Cerrar Conserjería"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-white/[0.08] bg-[#0A0A0E] px-3 py-2 text-xs">
            {isOtzarretaSurface ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Qué menús de celebración tienen y a partir de qué precio?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Menús desde {OTZARRETA_ENTITY.weddingPriceFromEur} €
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo es la parrilla de carbón de encina y sarmiento desde 1902?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Brasa carbón y sarmiento
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuál es el aforo del salón acristalado interior y del jardín exterior?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Salón {OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} · Jardín {OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo llego al caserío en Derio (1902) y cuánto párking privado hay?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Cómo llegar · {OTZARRETA_SEATING_PRESET.parkingSpaces} párking
                </button>
              </>
            ) : pathname.includes('/seating-planner') ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo configuro mesas redondas de 8 a 12 comensales?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Mesas de 8 a 12 pax
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo se exporta el plano de mesas en SVG y PDF?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Exportar el plano
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuál es el aforo máximo de invitados en el salón?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Aforo máximo
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuáles son las tarifas de Edwin Agudelo?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Tarifas de solista
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo es la contratación B2G para Ayuntamientos bajo Art. 118 LCSP?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Contrato menor B2G
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuáles son los menús y el aforo de Restaurante Otzarreta?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Menús de Otzarreta
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo puedo bloquear mi fecha con el depósito deducible de 100 €?')}
                  className="whitespace-nowrap rounded-full border border-white/[0.10] px-3 py-1.5 text-[#C9C4B8] transition-colors hover:border-[#ecb613]/50 hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                >
                  Bloquear mi fecha
                </button>
              </>
            )}
          </div>


          {/* Chat Messages Stream */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-[#141C18] text-[#EAF6EF]'
                      : 'rounded-bl-md border border-white/[0.08] bg-[#0F0F16] text-[#EDEAE2]'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#ecb613]">
                      <Sparkles size={12} aria-hidden="true" />
                      <span>Maître de sala</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Attached Action Pill */}
                  {m.action && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-700/50">
                      {m.action.type === 'whatsapp' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (m.action?.url) {
                              window.open(m.action.url, '_blank', 'noopener,noreferrer');
                            } else {
                              handleWhatsAppClick();
                            }
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <MessageSquare size={13} />
                            {m.action.label}
                          </span>
                          <ArrowRight size={13} />
                        </button>
                      )}

                      {m.action.type === 'dossier' && (
                        <button
                          type="button"
                          onClick={handleDossierClick}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-[#ecb613]/20 hover:bg-[#ecb613]/30 text-amber-300 border border-[#ecb613]/40 font-bold text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <FileText size={13} />
                            {m.action.label}
                          </span>
                          <ArrowRight size={13} />
                        </button>
                      )}

                      {m.action.type === 'date_picker' && (
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(true)}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            {m.action.label}
                          </span>
                          <ArrowRight size={13} />
                        </button>
                      )}

                      {m.action.type === 'scraper' && scraperSlot && (
                        <button
                          type="button"
                          onClick={() => setShowFastActions(true)}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-[#ecb613]/20 hover:bg-[#ecb613]/30 text-amber-300 border border-[#ecb613]/40 font-bold text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span>{m.action.label}</span>
                          <ArrowRight size={13} />
                        </button>
                      )}

                      {m.action.type === 'add_to_cart' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (m.action?.cartItem) {
                              addItem({
                                ...m.action.cartItem,
                                quantity: 1,
                              });
                            }
                            setCartOpen(true);
                            router.push(m.action?.url || '/checkout/presupuesto');
                          }}
                          className="w-full py-2 px-3 rounded-well bg-[#ecb613] hover:bg-[#f7cb45] text-black font-black text-[11px] flex items-center justify-between transition-colors duration-160 ease-hallmark cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShoppingCart size={13} />
                            {m.action.label}
                          </span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <span className="mt-1 px-1 text-xs text-[#6F6B62]">{m.timestamp}</span>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-1">
                <Loader2 size={14} className="animate-spin motion-reduce:animate-none text-[#ecb613]" />
                <span className="font-mono text-[10px]">Consultando Centralita…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Date Picker Toggle Section */}
          {showDatePicker && (
            <div className="shrink-0 space-y-2 border-t border-white/[0.10] bg-[#0C0C12] p-3">
              <div className="flex items-center justify-between text-zinc-200 font-bold text-[11px]">
                <span className="flex items-center gap-1 text-[#ecb613]">
                  <CalendarDays size={13} /> Seleccionar Fecha del Evento
                </span>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="text-zinc-400 hover:text-white text-[10px]"
                >
                  Cerrar
                </button>
              </div>
              <div className="space-y-1">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#ecb613] font-mono"
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['mediodia', 'tarde', 'noche'] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-well border py-1 font-mono text-[10px] uppercase font-bold transition-colors duration-160 ease-hallmark ${
                      selectedSlot === slot
                        ? 'bg-[#ecb613] text-black border-[#ecb613]'
                        : 'bg-white/[0.06] text-[#C9C4B8] border-white/[0.12] hover:bg-white/[0.10]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => {
                    handleSendMessage(`Deseo reservar la fecha ${selectedDate} en turno ${selectedSlot}. ¿Está libre?`);
                    setShowDatePicker(false);
                  }}
                  className="w-full py-1.5 bg-[#ecb613] text-black font-bold rounded-lg text-xs"
                >
                  Consultar Disponibilidad de {selectedDate}
                </button>
              )}
            </div>
          )}

          {/* Fast Actions Expandable Accordion */}
          <div className="border-t border-zinc-800/80 bg-black/50 shrink-0">
            <button
              type="button"
              onClick={() => setShowFastActions((prev) => !prev)}
              className="w-full px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-400 hover:text-zinc-200 uppercase font-bold"
            >
              <span>Acciones rápidas (1 clic)</span>
              {showFastActions ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronUp size={14} aria-hidden="true" />}
            </button>

            {showFastActions && (
              <div className="space-y-2 border-t border-white/[0.08] bg-[#08080C] p-3 text-xs">
                {/* Botón WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="w-full p-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-between text-[11px] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} />
                    <span>
                      {isOtzarretaSurface
                        ? 'Hablar con Conserjería por WhatsApp'
                        : routeContext.category === 'Solista'
                          ? 'Hablar directo con Edwin'
                          : 'Hablar con Centralita por WhatsApp'}
                    </span>
                  </div>
                  <ArrowRight size={13} />
                </button>

                {/* Botón Dossier */}
                <button
                  type="button"
                  onClick={handleDossierClick}
                  className="flex w-full items-center justify-between rounded-xl border border-white/[0.10] bg-[#0F0F16] p-2.5 text-xs font-semibold text-[#F4F1EA] transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#ecb613]" />
                    <span>Dossier Oficial A4 (Print)</span>
                  </div>
                  <ArrowRight size={13} />
                </button>

                {scraperSlot}
              </div>
            )}
          </div>

          {/* Input & Voice Controls Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage();
            }}
            className="p-2.5 bg-[#0d0d14] border-t border-zinc-800 flex items-center gap-1.5 shrink-0"
          >
            {/* Voice STT Button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`rounded-well p-2 transition-colors duration-160 ease-hallmark ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse motion-reduce:animate-none shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                    : 'bg-white/[0.06] text-[#C9C4B8] hover:bg-white/[0.10] hover:text-[#F4F1EA]'
                }`}
                title={isListening ? 'Escuchando tu voz... Clic para parar' : 'Hablar por voz (Speech-to-Text)'}
                aria-label="Hablar por micrófono"
              >
                {isListening ? <Mic size={16} /> : <MicOff size={16} />}
              </button>
            )}

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? 'Escuchando tu voz...' : 'Pregunta o escribe tu consulta...'}
              className="min-w-0 flex-1 rounded-xl border border-white/[0.12] bg-[#0F0F16] px-3 py-2 text-sm text-[#F4F1EA] placeholder:text-[#6F6B62] transition-colors focus:border-[#ecb613] focus:outline-none"
            />

            <button
              type="submit"
              disabled={isSending || !inputQuery.trim()}
              className="p-2 bg-[#ecb613] hover:bg-amber-400 text-black rounded-xl transition-colors disabled:opacity-40"
              aria-label="Enviar mensaje"
            >
              {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>

          {/* Footer */}
          <div className="px-3 py-1.5 border-t border-zinc-800/80 bg-black/60 flex items-center justify-between text-[9px] text-zinc-400 font-mono shrink-0">
            <div className="flex items-center gap-1">
              <ShieldCheck size={11} className="text-[#ecb613]" />
              <span>Garantía S-Class EAR OS</span>
            </div>
            <a href={`tel:+${CLEAN_PHONE}`} className="hover:text-[#ecb613] transition-colors flex items-center gap-1">
              <Phone size={9} />
              <span>{CENTRALITA_EAR_OS}</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── BURBUJA FLOTANTE PRINCIPAL (OLED S-CLASS) ─── */}
      <button
        type="button"
        id="concierge-trigger-button"
        data-testid="concierge-trigger"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (isOpen) stopSpeech();
        }}
        aria-label="Abrir el Maître de Sala"
        className="pointer-events-auto flex min-h-[52px] items-center gap-3 rounded-pill border border-white/[0.08] bg-[#08080C]/95 px-2 py-1.5 shadow-micro-border backdrop-blur-2xl transition-colors duration-160 ease-hallmark hover:bg-[#0E0E14] hover:shadow-perimeter-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transition-none"
      >
        {/* Indicador de canal: anillo de oro, estático. Cero punto verde de
            presencia no sondeada (AF-1) y cero pulso continuo (Floor 10). */}
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#ecb613]/30 bg-[#0E0E14] text-[#ecb613]">
          {isOpen ? <X size={17} aria-hidden="true" /> : <Bot size={18} aria-hidden="true" />}
          {!isOpen && (
            <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#ecb613] ring-2 ring-[#08080C]" />
          )}
        </span>

        {/* Etiqueta: quién responde y por qué canal, sin promesas de tiempo
            que ninguna sonda verifique. 14 px limpios. */}
        <span className="hidden pr-3 text-left sm:flex sm:flex-col">
          <span className="text-[0.875rem] font-semibold leading-tight text-[#F4F1EA]">Maître de Sala</span>
          <span className="text-xs leading-tight text-[#8E8A80]">
            {isOpen ? 'Conversación abierta' : routeContext.badge}
          </span>
        </span>
      </button>
    </div>
  );
}

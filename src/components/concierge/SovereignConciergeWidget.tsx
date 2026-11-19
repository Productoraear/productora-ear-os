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
  CheckCircle2,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
  Link2,
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
import { resolveVoiceProfile, type VoiceProfile } from '@/lib/voice/voice-profile-engine';
import { useCart, type ExtendedServiceCategory } from '@/components/checkout/CartContext';

const CLEAN_PHONE: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

interface RouteContextConfig {
  title: string;
  badge: string;
  greeting: string;
  category: string;
  providerName: string;
  suggestedWa: string;
  showScraper?: boolean;
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
  if (pathname.includes('/portal/proveedor') || pathname.includes('/fichas') || pathname.includes('/proveedores')) {
    return {
      title: 'Homologación de Proveedores',
      badge: 'Traslado Soberano · S-Class',
      greeting: '¿Vienes de Bodas.net? Pega tu enlace o habla con la Centralita para homologar tu ficha en EAR OS gratis.',
      category: 'Proveedor',
      providerName: 'Portal Proveedores EAR OS',
      suggestedWa: 'Hola, soy proveedor de eventos y deseo solicitar la homologación de mi ficha en EAR OS.',
      showScraper: true,
    };
  }
  if (pathname.includes('/otzarreta')) {
    return {
      title: 'Ezkertza Berria & Otzarreta · Derio',
      badge: '7 Menús 2026 desde 100 €',
      greeting: 'Bienvenido al Caserío Restaurante Ezkertza Berria & Otzarreta (Derio · Bizkaia). Soy el Maître Digital de sala de Eduardo Martínez. ¿Deseas consultar nuestros 7 menús oficiales de boda (desde 100 € + IVA), parrilla al carbón o aforos?',
      category: 'Fincas',
      providerName: 'Ezkertza Berria & Otzarreta / Eduardo Martínez',
      suggestedWa: 'Hola Eduardo, estoy en la ficha de Ezkertza Berria & Otzarreta y deseo consultar disponibilidad y menús para mi evento.',
    };
  }
  if (pathname.includes('/fincas')) {
    return {
      title: 'Fincas & Espacios Homologados',
      badge: 'Garantía Acústica S-Class',
      greeting: 'Bienvenido al catálogo de Fincas Homologadas. ¿Buscas aforo, limitador acústico o menús de temporada 2026 de Otzarreta?',
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

  return {
    title: 'Conserjería IA · Centralita EAR OS',
    badge: 'En línea · < 1 min',
    greeting: 'Bienvenido a Productora EAR. Estoy coordinando la centralita en tiempo real. ¿En qué podemos ayudarte hoy?',
    category: 'General',
    providerName: 'Centralita EAR OS',
    suggestedWa: 'Hola Productora EAR, estoy navegando por productoraear.com y deseo consultar disponibilidad e información.',
  };
}

export function SovereignConciergeWidget() {
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

  // Scraper simulator state
  const [scraperUrl, setScraperUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<{
    photos: number;
    menuPrice: number;
    capacity: number;
    name: string;
  } | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const routeContext = useMemo(() => getContextForRoute(pathname), [pathname]);
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
          const transcript = event.results[0][0].transcript;
          if (transcript && transcript.trim()) {
            setInputQuery(transcript);
            void handleSendMessage(transcript);
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Speak text with TTS calibrated by Multi-Tenant Voice Profile
  const speakText = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = activeVoiceProfile.fallbackLang || 'es-ES';
        utterance.rate = activeVoiceProfile.speedMultiplier || 1.0;
        utterance.pitch = activeVoiceProfile.pitch || 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    },
    [ttsEnabled, activeVoiceProfile]
  );

  // Toggle voice recognition
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeech();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [isListening, stopSpeech]);

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

  // Send message to conversational API
  const handleSendMessage = useCallback(
    async (textOverride?: string) => {
      const q = (textOverride || inputQuery).trim();
      if (!q || isSending) return;

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
        const detectedSlug = pathname.includes('/otzarreta') ? 'otzarreta' : '';
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
          }
        }
      } catch (err) {
        console.warn('Error en consulta de concierge:', err);
      } finally {
        setIsSending(false);
      }
    },
    [inputQuery, isSending, messages, pathname, routeContext, speakText, addItem]
  );

  // Construct WhatsApp destination URL
  const waUrl = useMemo(() => {
    let msg = routeContext.suggestedWa;
    if (selectedDate) {
      msg += ` He preseleccionado la fecha ${selectedDate} en turno ${selectedSlot.toUpperCase()}.`;
    }
    if (scrapeResult) {
      msg += ` [Enlace analizado: ${scraperUrl} | Aforo: ${scrapeResult.capacity} pax | Menú: ${scrapeResult.menuPrice} €]`;
    }
    return `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(msg)}`;
  }, [routeContext.suggestedWa, selectedDate, selectedSlot, scrapeResult, scraperUrl]);

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

  const handleScrapeSimulate = useCallback(() => {
    if (!scraperUrl.trim()) return;
    setIsScraping(true);
    setScrapeResult(null);

    setTimeout(() => {
      setIsScraping(false);
      const isE78903 = scraperUrl.includes('e78903') || scraperUrl.toLowerCase().includes('productora-ear');
      if (isE78903) {
        setScrapeResult({
          name: 'Productora EAR / Edwin Agudelo (Solista e78903)',
          photos: 24,
          menuPrice: 550,
          capacity: 250,
        });
        notifyWebhook('sovereign_showcase_migration', {
          showcaseUrl: scraperUrl,
          providerId: 'e78903',
          providerName: 'Productora EAR / Edwin Agudelo',
          category: 'MUSICA_DIRECTO',
        });
      } else {
        setScrapeResult({
          name: scraperUrl.replace(/^https?:\/\//i, '').split('/')[0] || 'Escaparate Detectado',
          photos: 14,
          menuPrice: 145,
          capacity: 350,
        });
        notifyWebhook('scraper_link_analyzed', { link: scraperUrl });
      }
    }, 600);
  }, [scraperUrl, notifyWebhook]);

  const handlePatientZeroPreset = useCallback(
    (preset: 'edwin' | 'otzarreta') => {
      setIsScraping(false);
      if (preset === 'edwin') {
        const canonicalUrl = 'https://www.bodas.net/musica/productora-ear--e78903';
        setScraperUrl(canonicalUrl);
        setScrapeResult({
          name: 'Productora EAR / Edwin Agudelo (Solista e78903)',
          photos: 24,
          menuPrice: 550,
          capacity: 250,
        });
        notifyWebhook('sovereign_showcase_migration', {
          showcaseUrl: canonicalUrl,
          providerId: 'e78903',
          providerName: 'Productora EAR / Edwin Agudelo',
          category: 'MUSICA_DIRECTO',
        });
      } else {
        setScraperUrl('https://productoraear.com/otzarreta');
        setScrapeResult({
          name: 'Eduardo Martínez (Otzarreta / Ezkertza Berria · Derio)',
          photos: 32,
          menuPrice: 145,
          capacity: 350,
        });
        notifyWebhook('patient_zero_preset', { preset: 'otzarreta_derio' });
      }
    },
    [notifyWebhook]
  );

  // Exclude from admin back-office routes
  if (!mounted || pathname.startsWith('/admin') || pathname.startsWith('/panel')) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(var(--ear-dock-h,5rem)+0.75rem)] lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end select-none">
      {/* ─── CHAT POPOVER S-CLASS ─── */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label="Conserjería IA Productora EAR"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#09090d]/98 backdrop-blur-2xl border border-[#ecb613]/40 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] text-white flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-zinc-800/80 bg-gradient-to-r from-[#0d0d14] via-[#09090d] to-[#121008] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ecb613]/20 to-amber-900/30 border border-[#ecb613]/50 flex items-center justify-center text-[#ecb613] shadow-[0_0_15px_rgba(236,182,19,0.2)]">
                  <Bot size={20} className={isSpeaking ? 'animate-bounce text-amber-300' : 'animate-pulse'} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-black"></span>
                </span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide font-montserrat leading-tight">
                  {routeContext.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                  <span className="text-[#ecb613] font-semibold">{routeContext.badge}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-emerald-400">
                    <Clock size={10} /> &lt; 1 min
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Speaker TTS Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeech();
                  setTtsEnabled((prev) => !prev);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  ttsEnabled ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'
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
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                aria-label="Cerrar Conserjería"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-black/60 border-b border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 text-[10px] font-mono">
            {pathname.includes('/otzarreta') ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuáles son los 7 menús de boda oficiales y precios en Ezkertza Berria?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  🍖 7 Menús desde 100 €
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo es la parrilla al carbón de encina y las carnes en Derio?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  🥩 Parrilla y Brasa Derio
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuál es el aforo del caserío y comedores en Derio?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  👥 Aforo (50-350 pax)
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo llegar al caserío en Derio y cuántas plazas de parking tiene?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  📍 Derio (150 parkings)
                </button>
              </>
            ) : pathname.includes('/seating-planner') ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo configuro mesas redondas de 8 a 12 comensales?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  🪑 Mesas de 8 a 12 pax
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo se exporta el plano de mesas en SVG y PDF?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  📐 Exportar plano SVG
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuál es el aforo máximo de invitados en el salón?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  👥 Aforo máximo salón
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuáles son las tarifas de Edwin Agudelo?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  🎵 Tarifas Edwin (350 €)
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo es la contratación B2G para Ayuntamientos bajo Art. 118 LCSP?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  🏛️ Licitación B2G Art. 118
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cuáles son los menús y aforo de Finca Otzarreta?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  🏰 Menús Otzarreta (145 €)
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo traslado mi escaparate de Bodas.net a EAR OS?')}
                  className="px-2 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 whitespace-nowrap transition-colors border border-zinc-700/60"
                >
                  🔄 Traslado Bodas.net
                </button>
              </>
            )}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs font-montserrat">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl leading-relaxed text-xs ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-600/90 to-teal-700/90 text-white rounded-br-none shadow-md'
                      : 'bg-zinc-900/95 border border-zinc-800 text-zinc-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-1 text-[#ecb613] font-mono text-[9px] uppercase font-bold mb-1">
                      <Sparkles size={11} />
                      <span>Agente EAR OS</span>
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

                      {m.action.type === 'scraper' && (
                        <button
                          type="button"
                          onClick={() => setShowFastActions(true)}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-[11px] flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Link2 size={13} />
                            {m.action.label}
                          </span>
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
                          className="w-full py-2 px-3 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-black text-[11px] flex items-center justify-between transition-all shadow-[0_0_15px_rgba(236,182,19,0.3)] cursor-pointer"
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
                <span className="text-[9px] text-zinc-500 mt-1 font-mono px-1">{m.timestamp}</span>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-1 animate-pulse">
                <Loader2 size={14} className="animate-spin text-[#ecb613]" />
                <span className="font-mono text-[10px]">Consultando Centralita...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Date Picker Toggle Section */}
          {showDatePicker && (
            <div className="p-3 bg-zinc-900/95 border-t border-amber-500/30 shrink-0 space-y-2 animate-in fade-in">
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
                    className={`py-1 text-[10px] font-mono uppercase font-bold rounded-md border transition-all ${
                      selectedSlot === slot
                        ? 'bg-[#ecb613] text-black border-[#ecb613]'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
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
              <span>⚡ Acciones Rápidas (1 Clic)</span>
              {showFastActions ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>

            {showFastActions && (
              <div className="p-3 space-y-2 bg-zinc-950/90 border-t border-zinc-800 text-xs animate-in fade-in">
                {/* Botón WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="w-full p-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-between text-[11px] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} />
                    <span>Hablar directo con Edwin</span>
                  </div>
                  <ArrowRight size={13} />
                </button>

                {/* Botón Dossier */}
                <button
                  type="button"
                  onClick={handleDossierClick}
                  className="w-full p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold rounded-xl flex items-center justify-between text-[11px] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#ecb613]" />
                    <span>Dossier Oficial A4 (Print)</span>
                  </div>
                  <ArrowRight size={13} />
                </button>

                {/* Scraper Simulator */}
                <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                  <div className="text-[10px] text-zinc-400 font-mono">Convertidor de escaparate (Bodas.net):</div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePatientZeroPreset('edwin')}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[#ecb613] font-mono text-[9px] border border-amber-500/20"
                    >
                      🎵 Edwin Agudelo
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePatientZeroPreset('otzarreta')}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[#ecb613] font-mono text-[9px] border border-amber-500/20"
                    >
                      🏰 Otzarreta
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="https://www.bodas.net/..."
                      value={scraperUrl}
                      onChange={(e) => setScraperUrl(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
                    />
                    <button
                      type="button"
                      onClick={handleScrapeSimulate}
                      disabled={isScraping || !scraperUrl.trim()}
                      className="px-2.5 py-1 bg-[#ecb613] hover:bg-amber-400 text-black font-bold rounded-lg text-xs disabled:opacity-50 flex items-center gap-1"
                    >
                      {isScraping ? <Loader2 size={11} className="animate-spin" /> : 'Analizar'}
                    </button>
                  </div>
                  {scrapeResult && (
                    <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-[10px]">
                      <span className="font-bold">{scrapeResult.name}:</span> Ficha lista para homologación oficial.
                    </div>
                  )}
                </div>
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
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                    : 'bg-zinc-800 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700'
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
              className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
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
            <a href={`tel:${CLEAN_PHONE}`} className="hover:text-[#ecb613] transition-colors flex items-center gap-1">
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
        aria-label="Abrir Conserjería IA Productora EAR"
        className="group relative flex items-center gap-3 bg-[#09090d]/95 hover:bg-[#12121a] border border-[#ecb613]/50 hover:border-[#ecb613] p-2.5 sm:p-3 rounded-full shadow-[0_8px_32px_rgba(236,182,19,0.25)] hover:shadow-[0_8px_36px_rgba(236,182,19,0.45)] transition-all duration-300 hover:scale-105"
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ecb613] via-amber-400 to-amber-200 text-black flex items-center justify-center shadow-md">
            {isOpen ? <X size={20} className="font-bold" /> : <Bot size={22} />}
          </div>
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#09090d]"></span>
            </span>
          )}
        </div>

        {/* Text pill for desktop & hover */}
        <div className="hidden sm:flex flex-col text-left pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide font-montserrat">
              Agente EAR OS
            </span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              En línea
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Voz & Chat 24/7
          </span>
        </div>
      </button>
    </div>
  );
}

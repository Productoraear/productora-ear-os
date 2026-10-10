'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Loader2,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { ProviderRecord } from '@/lib/data/vampire-service';

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  providers?: ProviderRecord[];
  rosterRecommendation?: {
    artist: string;
    soundSystem: string;
    startingPrice: number;
    split: string;
    holdDeposit: number;
    claimText: string;
  };
  suggestedChips?: string[];
  timestamp: string;
}

interface ProviderWithPrice extends ProviderRecord {
  price?: number;
}

const STORAGE_KEY = 'ear_concierge_history';
const MAX_HISTORY = 15;

function formatTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AIConciergeDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-concierge', handleOpen);
    return () => window.removeEventListener('open-ai-concierge', handleOpen);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved) as ChatMessage[]);
      } else {
        setMessages([
          {
            id: 'welcome-1',
            sender: 'concierge',
            text: '¡Hola! Soy el **Concierge Inteligente de Productora EAR**. Dime qué tipo de evento estás planeando (ej. *Finca para 150 personas en Toledo con catering* o *Mariachi en Madrid*) y te seleccionaré las mejores opciones disponibles con garantía de precio.',
            suggestedChips: [
              'Fincas para bodas en Toledo',
              'Catering a las brasas en Madrid',
              'Mariachi y Solista Edwin Agudelo',
              'Discomóvil Bose F1 en Segovia',
            ],
            timestamp: formatTimestamp(),
          },
        ]);
      }
    } catch {
      // Silently ignore storage read errors
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
      } catch {
        // Silently ignore storage write errors
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: formatTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'concierge',
          text: data.reply,
          providers: data.providers,
          rosterRecommendation: data.rosterRecommendation,
          suggestedChips: data.suggestedChips,
          timestamp: formatTimestamp(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: 'concierge',
          text:
            data.error ||
            'Lo siento, no pude procesar tu solicitud en este momento. Inténtalo de nuevo.',
          timestamp: formatTimestamp(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'concierge',
        text: 'Error de conexión. Verifica tu red e inténtalo nuevamente.',
        timestamp: formatTimestamp(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <div
          className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-3"
          role="region"
          aria-label="Acceso rápido al Concierge IA"
        >
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c0c14]/90 border border-[#ecb613]/30 text-[11px] font-mono text-[#ecb613] shadow-2xl backdrop-blur-md animate-pulse"
            role="status"
            aria-live="polite"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" focusable="false" />
            <span>AI Concierge Territorial</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ecb613] via-amber-400 to-amber-200 text-black font-bold flex items-center justify-center shadow-2xl shadow-[#ecb613]/30 hover:scale-105 transition-all group relative border-2 border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            aria-label="Abrir Asistente Conversacional del Concierge IA"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls="ai-concierge-dialog"
          >
            <MessageSquare
              className="w-6 h-6 text-black group-hover:rotate-12 transition-transform"
              aria-hidden="true"
              focusable="false"
            />
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black"
            />
            <span className="sr-only">Concierge IA disponible en línea</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div
          id="ai-concierge-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Asistente Concierge de Productora EAR"
          aria-describedby="ai-concierge-description"
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-4 md:inset-10'
              : 'bottom-4 right-4 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[88vh]'
          } rounded-[2rem] bg-[#09090f]/95 border border-[#ecb613]/30 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden`}
        >
          <p id="ai-concierge-description" className="sr-only">
            Panel de conversación con el Concierge Inteligente de Productora EAR. Puedes escribir
            tu solicitud de evento y recibir recomendaciones de proveedores y artistas.
          </p>

          <div className="px-6 py-4 bg-gradient-to-r from-[#12121e] to-[#0a0a10] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]"
                aria-hidden="true"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" focusable="false" />
              </div>
              <div>
                <h3
                  id="ai-concierge-title"
                  className="text-sm font-bold text-white font-syne flex items-center gap-1.5"
                >
                  <span>AI CONCIERGE S-CLASS</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono"
                    role="status"
                    aria-label="Estado: en línea"
                  >
                    LIVE
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-zinc-400">
                  Oráculo Territorial · 11.690 Fincas &amp; Roster
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1" role="group" aria-label="Controles del panel">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={
                  isExpanded ? 'Minimizar panel del concierge' : 'Expandir panel del concierge'
                }
                aria-pressed={isExpanded}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                title={isExpanded ? 'Minimizar' : 'Expandir'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" aria-hidden="true" focusable="false" />
                ) : (
                  <Maximize2 className="w-4 h-4" aria-hidden="true" focusable="false" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar panel del concierge"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                title="Cerrar"
              >
                <X className="w-5 h-5" aria-hidden="true" focusable="false" />
              </button>
            </div>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label="Historial de mensajes del concierge"
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } space-y-2`}
                role="article"
                aria-label={
                  msg.sender === 'user'
                    ? `Mensaje del usuario a las ${msg.timestamp}`
                    : `Mensaje del concierge a las ${msg.timestamp}`
                }
              >
                <div
                  className={`max-w-[88%] p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#ecb613] text-black font-semibold rounded-tr-none'
                      : 'bg-[#12121c] text-zinc-200 border border-white/10 rounded-tl-none space-y-2'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {msg.providers && msg.providers.length > 0 && (
                    <div
                      className="grid grid-cols-1 gap-2 pt-2"
                      role="list"
                      aria-label="Proveedores recomendados"
                    >
                      {msg.providers.map((prov) => {
                        const price = (prov as ProviderWithPrice).price ?? 650;
                        return (
                          <div
                            key={prov.id}
                            role="listitem"
                            className="p-3.5 rounded-xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between space-y-2.5"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-mono text-[#ecb613] uppercase tracking-wider block">
                                  {prov.category} · {prov.province}
                                </span>
                                <h4 className="text-xs font-bold text-white leading-tight">
                                  {prov.name}
                                </h4>
                              </div>
                              <div
                                className="flex items-center gap-1 text-[#ecb613] text-[10px] font-mono"
                                aria-label={`Valoración ${prov.rating ?? 4.9} sobre 5`}
                              >
                                <Star
                                  className="w-2.5 h-2.5 fill-current"
                                  aria-hidden="true"
                                  focusable="false"
                                />
                                <span aria-hidden="true">{prov.rating ?? 4.9}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                              {prov.telephone ? (
                                <span
                                  className="text-emerald-400 flex items-center gap-1"
                                  aria-label="Teléfono verificado"
                                >
                                  <CheckCircle2
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    focusable="false"
                                  />{' '}
                                  Tel. Verificado
                                </span>
                              ) : (
                                <span className="text-zinc-500">Hold &amp; Ping Activo</span>
                              )}

                              <Link
                                href={`/checkout/presupuesto?proveedor=${encodeURIComponent(
                                  prov.name
                                )}&base=${price}`}
                                className="py-1 px-2.5 rounded-md bg-[#ecb613] text-black font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-amber-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                aria-label={`Bloquear reserva de ${prov.name} por 100 euros`}
                              >
                                <span>Bloquear 100 €</span>
                                <ArrowRight
                                  className="w-2.5 h-2.5"
                                  aria-hidden="true"
                                  focusable="false"
                                />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {msg.rosterRecommendation && (
                    <div
                      className="p-3 rounded-xl bg-gradient-to-br from-[#1a1505] to-[#0d0b03] border border-[#ecb613]/40 space-y-1.5 mt-2"
                      role="region"
                      aria-label="Recomendación de venta cruzada oficial"
                    >
                      <span className="text-[9px] font-mono text-[#ecb613] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Zap
                          className="w-3 h-3 text-[#ecb613]"
                          aria-hidden="true"
                          focusable="false"
                        />{' '}
                        Venta Cruzada Oficial
                      </span>
                      <p className="text-[11px] font-bold text-white">
                        {msg.rosterRecommendation.artist}
                      </p>
                      <p className="text-[10px] text-zinc-400 leading-snug">
                        {msg.rosterRecommendation.soundSystem} (Desde{' '}
                        {msg.rosterRecommendation.startingPrice} €).
                      </p>
                      <Link
                        href="/artistas/edwin-agudelo"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#ecb613] hover:underline pt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] rounded"
                        aria-label={`Ver dossier y repertorio lírico de ${msg.rosterRecommendation.artist}`}
                      >
                        Ver Dossier y Repertorio Lírico{' '}
                        <ArrowRight
                          className="w-2.5 h-2.5"
                          aria-hidden="true"
                          focusable="false"
                        />
                      </Link>
                    </div>
                  )}

                  <span
                    className={`text-[9px] font-mono block ${
                      msg.sender === 'user' ? 'text-black/60 text-right' : 'text-zinc-500'
                    }`}
                    aria-hidden="true"
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.suggestedChips && msg.suggestedChips.length > 0 && (
                  <div
                    className="flex flex-wrap gap-1.5 pt-1"
                    role="group"
                    aria-label="Sugerencias de consulta"
                  >
                    {msg.suggestedChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 rounded-full bg-[#12121e] hover:bg-[#1a1a2c] text-zinc-300 hover:text-white border border-white/10 text-[10px] font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                        aria-label={`Enviar sugerencia: ${chip}`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div
                className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#12121c] border border-white/10 text-zinc-400 w-fit text-xs"
                role="status"
                aria-live="polite"
                aria-label="Consultando índice territorial y disponibilidad"
              >
                <Loader2
                  className="w-4 h-4 animate-spin text-[#ecb613]"
                  aria-hidden="true"
                  focusable="false"
                />
                <span>Consultando índice territorial y disponibilidad...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-[#0c0c14] border-t border-white/10 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
              aria-label="Formulario de envío de mensaje al concierge"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe: 'Finca para 180 pax en Toledo'..."
                aria-label="Escribe tu solicitud de evento"
                aria-required="true"
                aria-disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:border-[#ecb613] focus-visible:ring-2 focus-visible:ring-[#ecb613]/50 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Enviar mensaje al concierge"
              >
                <Send className="w-4 h-4" aria-hidden="true" focusable="false" />
              </button>
            </form>
            <div
              className="mt-2 flex items-center justify-between text-[9px] font-mono text-zinc-500 px-1"
              role="contentinfo"
              aria-label="Información de garantía y contacto"
            >
              <span>Garantía de Depósito Stripe 100 €</span>
              <span>
                Centralita:{' '}
                <a
                  href="tel:+34693693048"
                  className="hover:text-[#ecb613] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] rounded"
                  aria-label="Llamar a la centralita +34 693 693 048"
                >
                  +34 693 693 048
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
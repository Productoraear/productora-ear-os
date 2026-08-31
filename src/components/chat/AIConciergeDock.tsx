'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Music, 
  Zap, 
  Building2, 
  Loader2,
  Minimize2,
  Maximize2
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

export function AIConciergeDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar historial de LocalStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ear_concierge_history');
      if (saved) {
        setMessages(JSON.parse(saved));
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
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {}
  }, []);

  // Guardar en LocalStorage al actualizar
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('ear_concierge_history', JSON.stringify(messages.slice(-15)));
      } catch {}
    }
  }, [messages]);

  // Scroll al último mensaje
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: 'concierge',
          text: data.error || 'Lo siento, no pude procesar tu solicitud en este momento. Inténtalo de nuevo.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'concierge',
        text: 'Error de conexión. Verifica tu red e inténtalo nuevamente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón Flotante Tridimensional del Dock */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c0c14]/90 border border-[#ecb613]/30 text-[11px] font-mono text-[#ecb613] shadow-2xl backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Concierge Territorial</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ecb613] via-amber-400 to-amber-200 text-black font-bold flex items-center justify-center shadow-2xl shadow-[#ecb613]/30 hover:scale-105 transition-all group relative border-2 border-black"
            aria-label="Abrir Asistente Conversacional"
          >
            <MessageSquare className="w-6 h-6 text-black group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black"></span>
          </button>
        </div>
      )}

      {/* Modal / Panel Conversacional Slide-over */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-4 md:inset-10'
              : 'bottom-4 right-4 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[88vh]'
          } rounded-[2rem] bg-[#09090f]/95 border border-[#ecb613]/30 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden`}
        >
          {/* Header del Concierge */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#12121e] to-[#0a0a10] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-syne flex items-center gap-1.5">
                  <span>AI CONCIERGE S-CLASS</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    LIVE
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-zinc-400">
                  Oráculo Territorial · 11.690 Fincas & Roster
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:block"
                title={isExpanded ? 'Minimizar' : 'Expandir'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stream de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } space-y-2`}
              >
                <div
                  className={`max-w-[88%] p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#ecb613] text-black font-semibold rounded-tr-none'
                      : 'bg-[#12121c] text-zinc-200 border border-white/10 rounded-tl-none space-y-2'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Tarjetas de Proveedores Encontrados */}
                  {msg.providers && msg.providers.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {msg.providers.map((prov) => (
                        <div
                          key={prov.id}
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
                            <div className="flex items-center gap-1 text-[#ecb613] text-[10px] font-mono">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>{prov.rating ?? 4.9}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                            {prov.telephone ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Tel. Verificado
                              </span>
                            ) : (
                              <span className="text-zinc-500">Hold & Ping Activo</span>
                            )}

                            <Link
                              href={`/checkout/presupuesto?format=Solista&base=350&venue=${encodeURIComponent(prov.name)}`}
                              className="py-1 px-2.5 rounded-md bg-[#ecb613] text-black font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-amber-400 transition-all"
                            >
                              <span>Bloquear 100 €</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tarjeta de Venta Cruzada del Roster Soberano */}
                  {msg.rosterRecommendation && (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a1505] to-[#0d0b03] border border-[#ecb613]/40 space-y-1.5 mt-2">
                      <span className="text-[9px] font-mono text-[#ecb613] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#ecb613]" /> Venta Cruzada Oficial
                      </span>
                      <p className="text-[11px] font-bold text-white">
                        {msg.rosterRecommendation.artist}
                      </p>
                      <p className="text-[10px] text-zinc-400 leading-snug">
                        {msg.rosterRecommendation.soundSystem} (Desde {msg.rosterRecommendation.startingPrice} €).
                      </p>
                      <Link
                        href="/artistas/edwin-agudelo"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#ecb613] hover:underline pt-1"
                      >
                        Ver Dossier y Repertorio Lírico <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  )}

                  <span
                    className={`text-[9px] font-mono block ${
                      msg.sender === 'user' ? 'text-black/60 text-right' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Chips de Sugerencia Rápida */}
                {msg.suggestedChips && msg.suggestedChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 rounded-full bg-[#12121e] hover:bg-[#1a1a2c] text-zinc-300 hover:text-white border border-white/10 text-[10px] font-mono transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#12121c] border border-white/10 text-zinc-400 w-fit text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#ecb613]" />
                <span>Consultando índice territorial y disponibilidad...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar Conversacional */}
          <div className="p-3 bg-[#0c0c14] border-t border-white/10 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe: 'Finca para 180 pax en Toledo'..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:border-[#ecb613] transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Enviar Mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-zinc-500 px-1">
              <span>Garantía de Depósito Stripe 100 €</span>
              <span>Centralita: +34 693 693 048</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

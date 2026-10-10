"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Radio, ChevronUp, ChevronDown, Send, Trash2, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function OracleAmbientInterface() {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Oráculo S-Class en línea (Ollama 11434 / GPU Bare-Metal). Reglas SSOT activas (Tarifa Edwin 350€, Split 80/10/10, Méntrida 1.50€/km >50km, B2G <14.250€). ¿Qué operación auditamos hoy?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (expanded) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [expanded, messages]);

  const handleSubmit = async (e?: React.FormEvent, directPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = directPrompt || input.trim();
    if (!promptToSend || loading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: promptToSend }
    ];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: Fallo de comunicación con Ollama`);
      }

      if (!res.body) throw new Error('No se recibió stream del Oráculo');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantResponse += chunk;

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantResponse
          };
          return updated;
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ [ERROR BARE-METAL]: ${message}. Asegúrate de que Ollama está activo en el puerto 11434.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Historial purgado. Oráculo S-Class listo para nuevas instrucciones.'
      }
    ]);
  };

  return (
    <aside
      aria-label="Oráculo S-Class: asistente de auditoría financiera y operativa"
      className="fixed bottom-6 right-6 z-50 transition-all duration-300"
    >
      <div className="relative group">
        {/* Glow dorado ambiental */}
        <div
          className="absolute -inset-0.5 bg-gradient-to-r from-[#ecb613]/40 to-amber-600/20 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500"
          aria-hidden="true"
        />

        <div
          className={`relative bg-[#050508]/95 border border-[#ecb613]/30 backdrop-blur-xl rounded-2xl p-4 shadow-2xl text-white transition-all duration-300 ${expanded ? 'w-[420px] max-h-[580px] flex flex-col' : 'min-w-[300px]'
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-expanded={expanded}
              aria-controls="oracle-panel-body"
              aria-label={expanded ? 'Contraer panel del Oráculo S-Class' : 'Expandir panel del Oráculo S-Class'}
              onClick={() => setExpanded(!expanded)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpanded(!expanded);
                }
              }}
            >
              <div
                className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 shrink-0"
                aria-hidden="true"
              >
                <Sparkles className="w-4 h-4 text-[#ecb613] animate-pulse" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecb613] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ecb613]" />
                </span>
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase font-mono text-[#ecb613] font-semibold flex items-center gap-1.5">
                  ORÁCULO S-CLASS
                  <span
                    className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    role="status"
                    aria-label="Estado del servicio: Ollama en línea"
                  >
                    OLLAMA LIVE
                  </span>
                </div>
                <div
                  className="text-xs text-zinc-400 flex items-center gap-1.5 font-sans"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" aria-hidden="true" />
                  {loading ? 'Calculando inferencia...' : 'Enlace GPU Bare-Metal'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {expanded && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Limpiar chat"
                  aria-label="Limpiar historial de conversación del Oráculo"
                  className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "Contraer panel del oráculo" : "Expandir telemetría y chat"}
                aria-expanded={expanded}
                aria-controls="oracle-panel-body"
                className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
              >
                {expanded ? <ChevronDown className="w-4 h-4" aria-hidden="true" /> : <ChevronUp className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Body Expandido con Chat Real */}
          {expanded && (
            <div
              id="oracle-panel-body"
              className="flex flex-col flex-1 min-h-0 pt-3 gap-3"
              role="region"
              aria-label="Panel de conversación del Oráculo S-Class"
            >
              {/* Telemetría SSOT Compacta */}
              <div
                className="grid grid-cols-3 gap-1.5 text-[10px] font-mono bg-black/40 p-2 rounded-lg border border-white/5"
                role="group"
                aria-label="Telemetría de reglas SSOT activas"
              >
                <div className="text-center">
                  <span className="text-zinc-500 block">Tarifa Base</span>
                  <span className="text-[#ecb613] font-bold" aria-label="Tarifa base: 350 euros">350,00 €</span>
                </div>
                <div className="text-center border-x border-white/5">
                  <span className="text-zinc-500 block">Split</span>
                  <span className="text-emerald-400 font-bold" aria-label="Split: 80 10 10">80/10/10</span>
                </div>
                <div className="text-center">
                  <span className="text-zinc-500 block">B2G Máx</span>
                  <span className="text-cyan-400 font-bold" aria-label="Límite B2G máximo: 14.250 euros">14.250 €</span>
                </div>
              </div>

              {/* Mensajes con scroll */}
              <div
                className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1 text-xs font-sans"
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
                aria-label="Historial de conversación con el Oráculo"
                tabIndex={0}
              >
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    role="article"
                    aria-label={m.role === 'user' ? 'Mensaje del usuario' : 'Respuesta del Oráculo'}
                  >
                    {m.role === 'assistant' && (
                      <div
                        className="w-6 h-6 rounded bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#ecb613]" aria-hidden="true" />
                      </div>
                    )}
                    <div
                      className={`rounded-xl p-2.5 max-w-[85%] leading-relaxed ${m.role === 'user'
                        ? 'bg-[#ecb613]/20 border border-[#ecb613]/40 text-white font-medium'
                        : 'bg-white/5 border border-white/10 text-zinc-300 font-mono text-[11px]'
                        }`}
                    >
                      {m.content || (loading && idx === messages.length - 1 ? (
                        <span
                          className="flex items-center gap-1.5 text-zinc-400"
                          role="status"
                          aria-live="polite"
                          aria-label="Generando respuesta del Oráculo"
                        >
                          <Loader2 className="w-3 h-3 animate-spin text-[#ecb613]" aria-hidden="true" />
                          Generando...
                        </span>
                      ) : null)}
                    </div>
                    {m.role === 'user' && (
                      <div
                        className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <User className="w-3.5 h-3.5 text-zinc-300" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} aria-hidden="true" />
              </div>

              {/* Sugerencias Rápidas SSOT */}
              <div
                className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono no-scrollbar"
                role="group"
                aria-label="Sugerencias rápidas de consulta al Oráculo"
              >
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, 'Auditar split para servicio de 1.200€ en Madrid')}
                  aria-label="Consultar al Oráculo: auditar split para servicio de 1.200 euros en Madrid"
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
                >
                  Split 1.200€
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, 'Calcular kilometraje desde Méntrida a Cuenca (180 km)')}
                  aria-label="Consultar al Oráculo: calcular kilometraje desde Méntrida a Cuenca, 180 kilómetros"
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
                >
                  Logística Cuenca
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, 'Límite legal Art. 118 LCSP y acústica')}
                  aria-label="Consultar al Oráculo: límite legal artículo 118 LCSP y acústica"
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
                >
                  Regla B2G
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSubmit}
                className="flex gap-2"
                role="form"
                aria-label="Formulario de consulta al Oráculo S-Class"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta al Oráculo sobre finanzas, rutas o B2G..."
                  aria-label="Pregunta al Oráculo"
                  aria-required="true"
                  aria-disabled={loading}
                  disabled={loading}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]/50 focus:ring-1 focus:ring-[#ecb613]/50 disabled:opacity-50 font-sans"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label={loading ? 'Enviando consulta al Oráculo, espere por favor' : 'Enviar pregunta al Oráculo'}
                  aria-busy={loading}
                  className="bg-[#ecb613] hover:bg-amber-400 text-black font-semibold px-3 py-2 rounded-xl text-xs flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
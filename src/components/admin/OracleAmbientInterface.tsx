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
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ [ERROR BARE-METAL]: ${err.message}. Asegúrate de que Ollama está activo en el puerto 11434.`
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
    <aside aria-label="Oráculo S-Class" className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <div className="relative group">
        {/* Glow dorado ambiental */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ecb613]/40 to-amber-600/20 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />

        <div className={`relative bg-[#050508]/95 border border-[#ecb613]/30 backdrop-blur-xl rounded-2xl p-4 shadow-2xl text-white transition-all duration-300 ${
          expanded ? 'w-[420px] max-h-[580px] flex flex-col' : 'min-w-[300px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 shrink-0">
                <Sparkles className="w-4 h-4 text-[#ecb613] animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecb613] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ecb613]" />
                </span>
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase font-mono text-[#ecb613] font-semibold flex items-center gap-1.5">
                  ORÁCULO S-CLASS
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    OLLAMA LIVE
                  </span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-sans">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  {loading ? 'Calculando inferencia...' : 'Enlace GPU Bare-Metal'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {expanded && (
                <button
                  onClick={handleClear}
                  title="Limpiar chat"
                  className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "Contraer panel del oráculo" : "Expandir telemetría y chat"}
                className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Body Expandido con Chat Real */}
          {expanded && (
            <div className="flex flex-col flex-1 min-h-0 pt-3 gap-3">
              {/* Telemetría SSOT Compacta */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono bg-black/40 p-2 rounded-lg border border-white/5">
                <div className="text-center">
                  <span className="text-zinc-500 block">Tarifa Base</span>
                  <span className="text-[#ecb613] font-bold">350,00 €</span>
                </div>
                <div className="text-center border-x border-white/5">
                  <span className="text-zinc-500 block">Split</span>
                  <span className="text-emerald-400 font-bold">80/10/10</span>
                </div>
                <div className="text-center">
                  <span className="text-zinc-500 block">B2G Máx</span>
                  <span className="text-cyan-400 font-bold">14.250 €</span>
                </div>
              </div>

              {/* Mensajes con scroll */}
              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1 text-xs font-sans">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-6 h-6 rounded bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-[#ecb613]" />
                      </div>
                    )}
                    <div
                      className={`rounded-xl p-2.5 max-w-[85%] leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#ecb613]/20 border border-[#ecb613]/40 text-white font-medium'
                          : 'bg-white/5 border border-white/10 text-zinc-300 font-mono text-[11px]'
                      }`}
                    >
                      {m.content || (loading && idx === messages.length - 1 ? (
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <Loader2 className="w-3 h-3 animate-spin text-[#ecb613]" />
                          Generando...
                        </span>
                      ) : null)}
                    </div>
                    {m.role === 'user' && (
                      <div className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-zinc-300" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Sugerencias Rápidas SSOT */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono no-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, 'Auditar split para servicio de 1.200€ en Madrid')}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white shrink-0 transition-colors"
                >
                  Split 1.200€
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, 'Calcular kilometraje desde Méntrida a Cuenca (180 km)')}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white shrink-0 transition-colors"
                >
                  Logística Cuenca
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, 'Límite legal Art. 118 LCSP y acústica')}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white shrink-0 transition-colors"
                >
                  Regla B2G
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta al Oráculo sobre finanzas, rutas o B2G..."
                  disabled={loading}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]/50 focus:ring-1 focus:ring-[#ecb613]/50 disabled:opacity-50 font-sans"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-[#ecb613] hover:bg-amber-400 text-black font-semibold px-3 py-2 rounded-xl text-xs flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
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
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, X, Send, ShieldAlert, Lock, Phone, 
  ArrowRight, Bot, User, Volume2, Award, CreditCard,
  Sliders, MessageSquare
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface ChatMessage {
  id: string;
  sender: 'user' | 'oraculo';
  text: string;
  timestamp: string;
  isWarning?: boolean;
}

const INJECTION_PATTERNS = [
  /ignore.*instruction/i,
  /revela.*prompt/i,
  /system.*prompt/i,
  /codigo.*fuente/i,
  /código.*fuente/i,
  /dame.*todo.*el.*c[oó]digo/i,
  /dump.*database/i,
  /clonar/i,
  /export.*secret/i
];

const PRESET_QUESTIONS = [
  { label: '💰 Tarifa Solista Edwin Agudelo', query: '¿Cuánto cuesta contratar a Edwin Agudelo como solista?' },
  { label: '🔊 Potencia y Rider Acústico', query: '¿Qué equipo de sonido y potencia necesito para mi evento?' },
  { label: '🧠 Protocolo VIMUME Residencias', query: '¿Cómo funciona VIMUME en residencias de mayores?' },
  { label: '🔒 Depósito y Reserva de Fecha', query: '¿Cómo funciona el depósito de reserva de 100 €?' },
  { label: '🧛 Catálogo y Datos Vampirizados', query: '¿Qué es el sistema de vampirización de proveedores y arsenal?' }
];

export default function OraculoPublicDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'oraculo',
      text: '¡Saludos! Soy el Oráculo de EAR OS. Consulta cualquier parámetro sobre el repertorio lírico de Edwin Agudelo, tarifas nupciales, cálculo acústico 12 W/pax, el protocolo neuroacústico VIMUME o el simulador de éxito.',
      timestamp: 'Ahora'
    }
  ]);
  const [queryCount, setQueryCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Reset rate limiter every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setQueryCount(0);
      setIsRateLimited(false);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    if (queryCount >= 10) {
      setIsRateLimited(true);
      setMessages(prev => [
        ...prev,
        {
          id: `warn-${Date.now()}`,
          sender: 'oraculo',
          text: '⚠️ Has alcanzado el límite de consultas por minuto. Para asistencia personalizada inmediata, contacta directamente con nuestra Centralita al +34 693 693 048.',
          timestamp: 'Ahora',
          isWarning: true
        }
      ]);
      return;
    }

    setQueryCount(c => c + 1);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    // Guardrail Anti-Clonación / Anti-Injection
    const isMalicious = INJECTION_PATTERNS.some(pattern => pattern.test(query));

    let botResponse = '';
    if (isMalicious) {
      botResponse = '🛡️ [GUARDRAIL EAR OS]: Esta consulta contiene patrones protegidos por la gobernanza de propiedad intelectual y SSOT de Productora EAR. Para cotizaciones formales y dossiers técnicos, utiliza nuestro Configurador S-Class o contacta con la Dirección Artística.';
    } else if (/tarifa|precio|costo|solista|cuanto cuesta/i.test(query)) {
      botResponse = '👑 La Tarifa Base Solista de Edwin Agudelo parte desde 350,00 € (con pistas de alta fidelidad y microfonía Shure Beta 87A). El Split Soberano es 80% Artista / 10% Infraestructura EAR / 10% Fondo VIMUME. Paquetes nupciales integrales desde 850 € a 1.950 € con Price-Lock 72h.';
    } else if (/potencia|sonido|altavoz|bose|w\/pax|decibelios/i.test(query)) {
      botResponse = '🔊 Todos los eventos cuentan con una cobertura homologada de 12 W/pax mediante sistemas Bose F1 Model 812 o Bose S1 Pro. En residencias de mayores y centros de día, el protocolo VIMUME acota estrictamente la presión sonora a < 75 dB SPL para confort geriátrico.';
    } else if (/vimume|alzheimer|residencia|terapia|40hz/i.test(query)) {
      botResponse = '🧠 VIMUME es nuestro protocolo de neuroestimulación acústica a 40Hz Gamma para mayores, con biografía musical y reducción del deterioro cognitivo. Los contratos para ayuntamientos y residencias se tramitan bajo el Art. 118 LCSP (< 15.000 €).';
    } else if (/deposito|depósito|reserva|stripe|pagar|bloquear/i.test(query)) {
      botResponse = '🔒 La fecha se bloquea con un Depósito Transaccional de 100,00 € mediante Stripe, con firma criptográfica Price-Lock SHA-256 (validez 72h). Reembolsable con política de contingencia garantizada.';
    } else if (/vampiro|vampiriz|proveedor|arsenal|competencia/i.test(query)) {
      botResponse = '🧛 El Sistema de Vampirización EAR OS es nuestro crawler de inteligencia que audita y homóloga proveedores del sector (pantallas LED, catering, sonido, iluminación), garantizando precios competitivos y un split transparente sin comisiones ocultas.';
    } else {
      botResponse = `Gracias por tu consulta al Oráculo. En Productora EAR cubrimos desde música en directo de alta distinción (Edwin Agudelo y mariachis) hasta producción integral y bienestar cognitivo. Puedes acceder al simulador completo en /oraculo o llamarnos al +34 693 693 048.`;
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'oraculo',
      text: botResponse,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isWarning: isMalicious
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputQuery('');
  };

  return (
    <>
      {/* Botón Flotante Permanente del Oráculo */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <Link
          href="/oraculo"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold shadow-xl backdrop-blur-md transition-all hover:border-amber-400"
          title="Abrir Simulador The Oracle"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Simulador Oráculo</span>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir Oráculo de EAR OS"
          className="p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-bold shadow-[0_10px_35px_rgba(245,197,56,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer border border-amber-300"
        >
          <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs tracking-wider uppercase font-mono hidden sm:inline font-black">
            Oráculo EAR
          </span>
        </button>
      </div>

      {/* Drawer Overlay Lateral */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm transition-opacity flex justify-end">
          <div className="w-full max-w-md bg-[#09090d] border-l border-amber-500/30 h-full flex flex-col shadow-2xl relative">
            {/* Header del Drawer */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2 font-mono">
                    ORÁCULO EAR OS <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">AI Guardrail</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">Inteligencia predictiva, acústica y tarifas</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Rápidos */}
            <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/60">
              <span className="text-[10px] font-mono text-zinc-400 block mb-2 uppercase tracking-wider font-semibold">
                Consultas rápidas al Oráculo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(pq.query)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-amber-500/20 hover:border-amber-500/40 border border-zinc-800 text-zinc-300 hover:text-amber-300 transition-all text-left font-mono"
                  >
                    {pq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'oraculo' && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-black font-medium'
                        : msg.isWarning
                        ? 'bg-rose-950/50 border border-rose-500/40 text-rose-200'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[9px] font-mono mt-1 ${
                        msg.sender === 'user' ? 'text-black/70' : 'text-zinc-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Acceso Directo al Simulador Completo */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between">
              <Link
                href="/oraculo"
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Abrir Simulador de Éxito Acústico</span>
              </Link>
              <a
                href={CENTRALITA.href}
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{CENTRALITA.display}</span>
              </a>
            </div>

            {/* Input de Pregunta */}
            <div className="p-3.5 border-t border-zinc-800 bg-[#09090d]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregunta al Oráculo sobre acústica, artistas o VIMUME..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputQuery.trim()}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-xl text-xs transition-colors flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

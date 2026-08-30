'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldAlert, 
  Lock, 
  Phone, 
  ArrowRight, 
  Bot, 
  User, 
  HelpCircle, 
  Volume2, 
  Award,
  CreditCard
} from 'lucide-react';

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
  { label: '🔒 Depósito y Reserva de Fecha', query: '¿Cómo funciona el depósito de reserva de 100 €?' }
];

export function OraculoPublicDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'oraculo',
      text: '¡Hola! Soy el Oráculo de EAR OS. Pregúntame sobre el repertorio lírico de Edwin Agudelo, tarifas de gala, cálculo de sonido o el protocolo VIMUME.',
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

    if (queryCount >= 8) {
      setIsRateLimited(true);
      setMessages(prev => [
        ...prev,
        {
          id: `warn-${Date.now()}`,
          sender: 'oraculo',
          text: '⚠️ Has alcanzado el límite de consultas rápidas por minuto. Para atención personalizada inmediata, contacta directamente con Edwin Agudelo al +34 693 693 048.',
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
      botResponse = '🛡️ [GUARDRAIL EAR OS]: Esta consulta contiene instrucciones protegidas por la gobernanza de propiedad intelectual y SSOT de Productora EAR. Para cotizaciones formales y dossiers técnicos, utiliza nuestro Configurador S-Class o contacta con la Dirección Artística.';
    } else if (/tarifa|precio|costo|solista|cuanto cuesta/i.test(query)) {
      botResponse = '👑 La Tarifa Base Solista de Edwin Agudelo es de 350,00 € (con pistas de alta fidelidad y microfonía Shure Beta 87A). El Split Soberano es 80% Artista / 10% Infraestructura EAR / 10% Fondo VIMUME. Los desplazamientos desde Méntrida se tarifican a 1,50 €/km a partir del km 50.';
    } else if (/potencia|sonido|altavoz|bose|w\/pax|decibelios/i.test(query)) {
      botResponse = '🔊 Todos los eventos cuentan con una cobertura homologada de 12 W/pax mediante sistemas Bose F1 Model 812 o Bose S1 Pro. En residencias de mayores y centros de día, el protocolo VIMUME acota estrictamente la presión sonora a < 75 dB SPL.';
    } else if (/vimume|alzheimer|residencia|terapia|40hz/i.test(query)) {
      botResponse = '🧠 VIMUME es nuestro ecosistema de musicoterapia geriátrica basada en neurociencia (modulación 40Hz, escalas MMSE/GDS y SROI 4.85x). Los contratos menores para ayuntamientos y residencias se ajustan al Art. 118 LCSP (< 15.000 €).';
    } else if (/deposito|depósito|reserva|stripe|pagar|bloquear/i.test(query)) {
      botResponse = '🔒 La fecha se bloquea con un Depósito Transaccional de 100,00 € mediante Stripe, con firma criptográfica Price-Lock SHA-256 (validez 24h-72h). El depósito es 100% reembolsable hasta 15 días antes.';
    } else {
      botResponse = `Gracias por tu consulta. Edwin Agudelo ofrece formatos desde Solista (350 €) hasta Gran Ensamble Imperial (1.400 €). Puedes calcular tu presupuesto exacto en tiempo real en nuestro cotizador o pulsar el botón de WhatsApp para hablar directamente (+34 693 693 048).`;
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
      {/* Botón Flotante del Oráculo */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Oráculo de EAR OS"
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-[#ecb613] via-amber-500 to-[#ecb613] text-black font-bold shadow-[0_10px_35px_rgba(236,182,19,0.45)] hover:scale-105 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
      >
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
        <span className="text-xs tracking-wider uppercase font-mono hidden sm:inline font-black">
          Oráculo EAR
        </span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm transition-opacity flex justify-end animate-in fade-in">
          <div className="w-full max-w-md bg-[#09090d] border-l border-[#ecb613]/30 h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300">
            {/* Header del Drawer */}
            <div className="p-4 md:p-5 border-b border-white/10 flex justify-between items-center bg-[#0d0d14]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#ecb613]/15 border border-[#ecb613]/40 text-[#ecb613]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    Oráculo EAR OS <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ecb613]/20 text-[#ecb613]">AI Guardrail</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">Consultas rápidas, tarifas y protocolo acústico</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Rápidos */}
            <div className="p-3 border-b border-white/5 bg-black/40">
              <span className="text-[10px] font-mono text-gray-400 block mb-2 uppercase tracking-wider">
                Preguntas frecuentes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(pq.query)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#ecb613]/15 hover:border-[#ecb613]/40 border border-white/10 text-gray-300 hover:text-[#ecb613] transition-all text-left"
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
                    <div className="w-7 h-7 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#258DCD] text-white rounded-tr-none font-medium'
                        : msg.isWarning
                        ? 'bg-amber-950/80 border border-amber-500/50 text-amber-200 rounded-tl-none'
                        : 'bg-[#14141e] border border-white/10 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-50 block mt-1.5 text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-[#258DCD]/20 border border-[#258DCD]/40 text-[#258DCD] flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Acciones Rápidas (Cotizador & WhatsApp) */}
            <div className="p-3 border-t border-white/5 bg-black/60 grid grid-cols-2 gap-2">
              <Link
                href="/checkout/presupuesto"
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <CreditCard className="w-3.5 h-3.5" /> Cotizador S-Class
              </Link>
              <a
                href="https://wa.me/34693693048?text=Hola%20Edwin,%20vengo%20del%20Or%C3%A1culo%20EAR%20OS"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>

            {/* Input de Consulta */}
            <div className="p-3 border-t border-white/10 bg-[#0d0d14]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={isRateLimited ? 'Límite alcanzado temporalmente' : 'Escribe tu pregunta aquí...'}
                  disabled={isRateLimited}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 bg-[#161622] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ecb613]"
                />
                <button
                  type="submit"
                  disabled={isRateLimited || !inputQuery.trim()}
                  className="p-2.5 bg-[#ecb613] hover:bg-amber-400 disabled:opacity-40 text-black rounded-xl transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OraculoPublicDrawer;

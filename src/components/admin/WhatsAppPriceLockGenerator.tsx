'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Sparkles,
  Calendar,
  MapPin,
  User,
  Music,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

interface FormatOption {
  id: string;
  name: string;
  price: number;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { id: 'edwin-solista', name: 'Edwin Agudelo (Tenor Lírico)', price: TARIFA_BASE_SOLISTA_EUR },
  { id: 'mariachi-trio', name: "Mariachi 'Gala de Oro' (Trío Clásico)", price: 550 },
  { id: 'mariachi-quinteto', name: "Mariachi 'Imperial S-Class' (Quinteto)", price: 850 },
  { id: 'mariachi-ensamble', name: 'Gran Ensamble Mariachi (9 Músicos)', price: 1300 },
  { id: 'vimume-gala', name: 'VIMUME (Gala Senior & Terapia 40 Hz)', price: 450 },
];

export default function WhatsAppPriceLockGenerator() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('Madrid / Toledo');
  const [selectedFormatId, setSelectedFormatId] = useState('edwin-solista');
  const [copied, setCopied] = useState(false);
  const [sendingToN8n, setSendingToN8n] = useState(false);
  const [n8nSent, setN8nSent] = useState(false);

  const selectedFormat = FORMAT_OPTIONS.find((f) => f.id === selectedFormatId) || FORMAT_OPTIONS[0];

  // Generación de URL de Reserva Oficial
  const generatedUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/reservar/solista?fecha=${eventDate}&formato=${encodeURIComponent(selectedFormat.name)}&ref=wa_ceo`
    : `https://productoraear.com/reservar/solista?fecha=${eventDate}&formato=${encodeURIComponent(selectedFormat.name)}&ref=wa_ceo`;

  // Mensaje Persuasivo de WhatsApp para Novias / Ayuntamientos
  const rawMessage = `Hola ${clientName.trim() || 'estimad@ cliente'}, te saluda Edwin Agudelo de Productora EAR.

Para garantizar y bloquear de forma exclusiva tu fecha del *${eventDate}* en *${location}* para el formato *${selectedFormat.name}* (Presupuesto base: ${selectedFormat.price} €), puedes formalizar el bloqueo inmediato con el depósito oficial de *${DEPOSITO_STRIPE_EUR} €*.

🔒 *Garantía S-Class:*
• 100% deducible del importe total de tu evento.
• Bloqueo inmutable en nuestro calendario oficial.
• Cobertura legal acústica y seguro RC 1.000.000 €.

👉 *Enlace directo de reserva con Price-Lock (válido 72h):*
${generatedUrl}

Quedo a tu disposición si necesitas resolver cualquier detalle antes del bloqueo.`;

  const cleanPhone = clientPhone.replace(/\D/g, '');
  const whatsappTargetUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith('34') ? cleanPhone : '34' + cleanPhone}?text=${encodeURIComponent(rawMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(rawMessage)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleDispatchN8n = async () => {
    setSendingToN8n(true);
    try {
      await fetch('/api/webhooks/call-center-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'WHATSAPP_PRICE_LOCK_GENERATOR_ADMIN',
          clientName: clientName || 'Lead VIP WhatsApp',
          clientPhone: clientPhone || CENTRALITA_EAR_OS,
          eventDate,
          location,
          format: selectedFormat.name,
          baseRate: selectedFormat.price,
          deposit: DEPOSITO_STRIPE_EUR,
          generatedUrl,
          dispatchedAt: new Date().toISOString(),
        }),
      });
      setN8nSent(true);
      setTimeout(() => setN8nSent(false), 4000);
    } catch {
      // Degradación elegante
    } finally {
      setSendingToN8n(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#ecb613]/30 bg-[#09090d]/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ecb613]/10 blur-3xl"
      />

      {/* Cabecera del generador */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/40 bg-[#ecb613]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#ecb613] mb-2">
            <Lock size={12} />
            <span>Cierre Express WhatsApp · Stripe Price-Lock</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Generador de Enlaces de Reserva con Depósito de 100 €
          </h2>
          <p className="text-sm text-zinc-300 mt-1">
            Envía a una novia o concejal un enlace con fianza de 100 € deducible en 1 clic. El cliente paga en &lt; 1 min desde su móvil.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDispatchN8n}
          disabled={sendingToN8n}
          className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 px-3.5 py-2 text-xs font-mono font-semibold text-zinc-200 transition-all cursor-pointer"
        >
          <Send size={13} className={sendingToN8n ? 'animate-spin text-[#ecb613]' : 'text-[#ecb613]'} />
          <span>{n8nSent ? 'Lead registrado en n8n ✓' : sendingToN8n ? 'Sincronizando...' : 'Registrar en n8n'}</span>
        </button>
      </div>

      {/* Formulario de parámetros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <User size={13} className="text-[#ecb613]" />
            Nombre del Cliente
          </label>
          <input
            type="text"
            placeholder="Ej: Laura & Carlos (Boda)"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <MessageCircle size={13} className="text-[#ecb613]" />
            WhatsApp Destino
          </label>
          <input
            type="tel"
            placeholder="600 000 000"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#ecb613]" />
            Fecha del Evento
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <MapPin size={13} className="text-[#ecb613]" />
            Municipio / Espacio
          </label>
          <input
            type="text"
            placeholder="Ej: Finca Las Tinajas"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Selector de formato artístico */}
      <div className="mb-6">
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
          <Music size={13} className="text-[#ecb613]" />
          Selecciona el Formato Musical
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {FORMAT_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFormatId(f.id)}
              className={`rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                selectedFormatId === f.id
                  ? 'border-[#ecb613] bg-[#ecb613]/15 text-white shadow-[0_0_15px_rgba(236,182,19,0.2)]'
                  : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold font-sans line-clamp-1">{f.name}</div>
              <div className="text-sm font-mono font-bold text-[#ecb613] mt-1">{f.price} €</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vista previa del mensaje */}
      <div className="rounded-2xl border border-white/10 bg-black/60 p-4 mb-6">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
          Vista previa del mensaje a enviar por WhatsApp:
        </span>
        <pre className="text-xs text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed bg-[#030305] p-3.5 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
          {rawMessage}
        </pre>
      </div>

      {/* Acciones principales */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href={whatsappTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-mono text-sm font-bold px-6 py-3.5 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-[1.02]"
        >
          <MessageCircle size={16} />
          <span>Abrir y Enviar por WhatsApp</span>
          <ExternalLink size={14} />
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-mono text-sm font-semibold px-6 py-3.5 transition-all cursor-pointer"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar Texto y Enlace'}</span>
        </button>

        <div className="sm:ml-auto flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Fianza 100 € deducible · Stripe Price-Lock</span>
        </div>
      </div>
    </div>
  );
}

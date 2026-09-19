"use client";

import React, { useState } from 'react';
import {
  MessageSquare,
  PhoneCall,
  Send,
  Sparkles,
  Music,
  HeartPulse,
  Building2,
  Copy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  generateWhatsAppDispatchLink,
  CENTRAL_PHONE,
  DISPLAY_PHONE,
  DispatchTemplateType
} from '@/lib/whatsapp/whatsapp-dispatch';

export default function WhatsAppDispatchPage() {
  const [templateType, setTemplateType] = useState<DispatchTemplateType>('solista');
  const [clientName, setClientName] = useState<string>('');
  const [province, setProvince] = useState<string>('Madrid');
  const [eventDate, setEventDate] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<number>(350);
  const [copied, setCopied] = useState<boolean>(false);

  const dispatchData = generateWhatsAppDispatchLink({
    type: templateType,
    clientName: clientName || undefined,
    province,
    eventDate: eventDate || undefined,
    totalEur: customPrice
  });

  const handleCopyText = () => {
    navigator.clipboard.writeText(dispatchData.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white p-6 sm:p-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            Centralita SSOT WhatsApp
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-syne text-white">
            Despacho Central WhatsApp ({DISPLAY_PHONE})
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Plantillas contractuales deterministas para Solista (350 €), Mariachi, VIMUME y Licitaciones B2G.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${CENTRAL_PHONE}`}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2 transition-all"
          >
            <PhoneCall size={14} className="text-[#ecb613]" />
            Llamar Centralita
          </a>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario de Configuración */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-5 shadow-2xl">
          <h2 className="text-sm font-bold font-syne text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare size={16} className="text-[#ecb613]" />
            Configurar Plantilla
          </h2>

          {/* Selector de Plantilla */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400">Tipo de Contrato / Servicio</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setTemplateType('solista'); setCustomPrice(350); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${
                  templateType === 'solista'
                    ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Music size={14} />
                Solista 350 €
              </button>

              <button
                type="button"
                onClick={() => { setTemplateType('mariachi'); setCustomPrice(450); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${
                  templateType === 'mariachi'
                    ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles size={14} />
                Mariachi
              </button>

              <button
                type="button"
                onClick={() => { setTemplateType('vimume'); setCustomPrice(0); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${
                  templateType === 'vimume'
                    ? 'bg-violet-950/30 border-violet-500 text-violet-400'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <HeartPulse size={14} />
                VIMUME 14D
              </button>

              <button
                type="button"
                onClick={() => { setTemplateType('b2g'); setCustomPrice(14250); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${
                  templateType === 'b2g'
                    ? 'bg-cyan-950/30 border-cyan-500 text-cyan-400'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 size={14} />
                B2G Licitación
              </button>
            </div>
          </div>

          {/* Campos de Entrada */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Nombre del Cliente / Entidad</label>
              <input
                type="text"
                placeholder="Ej: Carmen Gómez / Ayto. de Toledo"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Provincia</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Fecha del Evento</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
              />
            </div>

            {templateType !== 'vimume' && (
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Importe Total (€)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Vista Previa y Disparo Directo */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613] flex items-center gap-1.5">
                <ShieldCheck size={14} /> Vista Previa del Mensaje SSOT
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1 transition-all"
              >
                {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copiado' : 'Copiar Texto'}
              </button>
            </div>

            <pre className="p-5 rounded-2xl bg-black/80 border border-white/10 text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {dispatchData.rawText}
            </pre>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <a
              href={dispatchData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold font-mono text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#25D366]/20 transition-all"
            >
              <Send size={18} />
              Abrir y Enviar por WhatsApp (+34 693 693 048)
              <ExternalLink size={14} />
            </a>
            <p className="text-[10px] text-center font-mono text-zinc-500">
              Garantía Price-Lock 100 € Stripe · Split Soberano 80/10/10 · Telemetría Auditoría EAR OS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
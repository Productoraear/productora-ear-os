'use client';

// ============================================================
// 🧭 VENDOR CRM — LeadsPipeline (Kanban S-Class OLED)
// Pipeline visual PENDING -> ACCEPTED -> INSTA_BOOKED.
// Cero `any`, estética OLED, layout 100% fluido.
// ============================================================

import { useState } from 'react';
import { Check, Clock, MessageCircle, Phone, X } from 'lucide-react';

import type { VendorBookingStatus } from '@/lib/vendor/vendorCrmTypes';

export type PipelineRespondStatus = 'ACCEPTED' | 'DECLINED';

/** Proyección serializable (wire) de `VendorLeadRecord` para el pipeline. */
export interface PipelineLead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventDate: string | null;
  pax: number;
  budgetEur: number;
  source: string;
  status: VendorBookingStatus;
}

export interface LeadsPipelineProps {
  leads: PipelineLead[];
  onRespond: (leadId: string, status: PipelineRespondStatus) => Promise<void>;
}

interface ColumnConfig {
  key: 'PENDING' | 'ACCEPTED' | 'INSTA_BOOKED';
  title: string;
  subtitle: string;
  dot: string;
  badge: string;
  badgeClass: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    key: 'PENDING',
    title: 'Entrantes',
    subtitle: 'Solicitudes por responder',
    dot: 'bg-[#00E5FF]',
    badge: 'SLA 24h',
    badgeClass: 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]',
  },
  {
    key: 'ACCEPTED',
    title: 'Aceptadas',
    subtitle: 'Listas para formalizar',
    dot: 'bg-[#ecb613]',
    badge: 'Formalizar',
    badgeClass: 'bg-[#ecb613]/10 border-[#ecb613]/30 text-[#ecb613]',
  },
  {
    key: 'INSTA_BOOKED',
    title: 'Reservadas',
    subtitle: 'Cerradas con depósito Stripe',
    dot: 'bg-emerald-400',
    badge: 'Depósito 100€',
    badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  },
];

const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatEventDate(value: string | null): string {
  if (!value) return 'Fecha a definir';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function toWaNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

function buildWhatsAppHref(lead: PipelineLead): string {
  const text = `Hola ${lead.clientName}, soy tu proveedor en EAR OS. He recibido tu solicitud para ${formatEventDate(lead.eventDate)}. ¿Hablamos de los detalles?`;
  return `https://wa.me/${toWaNumber(lead.clientPhone)}?text=${encodeURIComponent(text)}`;
}

export default function LeadsPipeline({ leads, onRespond }: LeadsPipelineProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grouped: Record<ColumnConfig['key'], PipelineLead[]> = {
    PENDING: leads.filter((lead) => lead.status === 'PENDING'),
    ACCEPTED: leads.filter((lead) => lead.status === 'ACCEPTED'),
    INSTA_BOOKED: leads.filter((lead) => lead.status === 'INSTA_BOOKED'),
  };

  const archived = leads.filter(
    (lead) => lead.status === 'DECLINED' || lead.status === 'ESCALATED',
  );

  const handleRespond = async (leadId: string, status: PipelineRespondStatus) => {
    setBusyId(leadId);
    setError(null);
    try {
      await onRespond(leadId, status);
    } catch {
      setError('No se pudo actualizar la solicitud. Inténtalo de nuevo.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-5">
      {error ? (
        <div className="px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {COLUMNS.map((column) => {
          const items = grouped[column.key];
          return (
            <div
              key={column.key}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4"
            >
              <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${column.dot} animate-pulse`} />
                  <div>
                    <h3 className="text-sm font-syne font-bold text-white">{column.title}</h3>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      {column.subtitle}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/40 border border-white/10 text-zinc-300">
                  {items.length}
                </span>
              </header>

              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-center text-[11px] font-mono text-zinc-600 py-8">
                    Sin solicitudes
                  </p>
                ) : (
                  items.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={column.badge}
                      badgeClass={column.badgeClass}
                      busy={busyId === lead.id}
                      onRespond={handleRespond}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {archived.length > 0 ? (
        <div className="rounded-3xl bg-[#09090d]/60 border border-white/5 p-4">
          <header className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-syne font-bold text-zinc-400">Archivadas</h3>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/40 border border-white/10 text-zinc-400">
              {archived.length}
            </span>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {archived.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                badge={lead.status === 'ESCALATED' ? 'Escalada' : 'Declinada'}
                badgeClass="bg-zinc-800/60 border-white/10 text-zinc-400"
                busy={false}
                onRespond={handleRespond}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function LeadCard({
  lead,
  badge,
  badgeClass,
  busy,
  onRespond,
}: {
  lead: PipelineLead;
  badge: string;
  badgeClass: string;
  busy: boolean;
  onRespond: (leadId: string, status: PipelineRespondStatus) => Promise<void>;
}) {
  return (
    <article className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3 transition-all duration-300 ease-out hover:border-white/20 hover:bg-black/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-syne font-bold text-white truncate">{lead.clientName}</h4>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${badgeClass}`}
          >
            {badge}
          </span>
        </div>
        <span className="text-lg font-mono font-bold text-[#ecb613] shrink-0">
          {eurFormatter.format(lead.budgetEur)}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Phone size={12} className="text-zinc-500 shrink-0" />
          <span className="truncate">{lead.clientPhone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-zinc-500 shrink-0" />
          <span>{formatEventDate(lead.eventDate)}</span>
        </div>
        <p className="text-zinc-600 truncate">
          {lead.source} · {lead.pax} pax
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <a
          href={buildWhatsAppHref(lead)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold transition-all"
        >
          <MessageCircle size={12} />
          WhatsApp
        </a>

        {lead.status === 'PENDING' ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onRespond(lead.id, 'ACCEPTED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ecb613]/15 hover:bg-[#ecb613]/25 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[11px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={12} />
              Aceptar (24h)
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onRespond(lead.id, 'DECLINED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[11px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={12} />
              Declinar
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}

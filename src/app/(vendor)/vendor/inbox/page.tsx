'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, Inbox, MessageCircle, Send, X } from 'lucide-react';

import type { VendorBookingStatus } from '@/lib/vendor/vendorCrmTypes';
import { respondToBookingAction, sendVendorMessageAction } from '../actions';

interface ThreadMessageWire {
  id: string;
  leadId: string;
  sender: string;
  body: string;
  createdAt: string;
}

interface LeadWire {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventDate: string | null;
  pax: number;
  budgetEur: number;
  source: string;
  status: VendorBookingStatus;
  lastMessage: { id: string; sender: string; body: string; createdAt: string } | null;
  messageCount: number;
  threads: ThreadMessageWire[];
}

interface LeadsApiResponse {
  success: boolean;
  leads: LeadWire[];
  error?: string;
}

type StatusFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'INSTA_BOOKED' | 'DECLINED';

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'Todas' },
  { key: 'PENDING', label: 'Pendientes' },
  { key: 'ACCEPTED', label: 'Aceptadas' },
  { key: 'INSTA_BOOKED', label: 'Reservadas' },
  { key: 'DECLINED', label: 'Declinadas' },
];

const STATUS_BADGE: Record<VendorBookingStatus, { label: string; cls: string }> = {
  PENDING: { label: 'Pendiente', cls: 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' },
  ACCEPTED: { label: 'Aceptada', cls: 'bg-[#ecb613]/10 border-[#ecb613]/30 text-[#ecb613]' },
  DECLINED: { label: 'Declinada', cls: 'bg-zinc-800 border-white/10 text-zinc-400' },
  INSTA_BOOKED: { label: 'Reservada 100€', cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  ESCALATED: { label: 'Escalada', cls: 'bg-rose-500/10 border-rose-500/30 text-rose-300' },
};

function toWaNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

function formatEventDate(value: string | null): string {
  if (!value) return 'Fecha a definir';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildWhatsAppHref(lead: LeadWire): string {
  const text = `Hola ${lead.clientName}, soy tu proveedor en EAR OS. He recibido tu solicitud para ${formatEventDate(lead.eventDate)}. ¿Hablamos de los detalles?`;
  return `https://wa.me/${toWaNumber(lead.clientPhone)}?text=${encodeURIComponent(text)}`;
}

export default function VendorInboxPage() {
  const [leads, setLeads] = useState<LeadWire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/crm/leads', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as LeadsApiResponse;
      if (data.success) {
        setLeads(data.leads);
        setError(null);
      } else {
        setError(data.error ?? 'Error al cargar la bandeja.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const filtered = useMemo(
    () => (filter === 'ALL' ? leads : leads.filter((lead) => lead.status === filter)),
    [leads, filter],
  );

  const selected = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? null,
    [leads, selectedId],
  );

  const orderedThreads = useMemo(() => {
    if (!selected) return [];
    return [...selected.threads].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [selected]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !draft.trim() || sending) return;
    setSending(true);
    setSendError(null);
    const res = await sendVendorMessageAction({
      leadId: selected.id,
      sender: 'VENDOR',
      body: draft.trim(),
    });
    if (res.ok) {
      setDraft('');
      await loadLeads();
    } else {
      setSendError(res.error);
    }
    setSending(false);
  };

  const handleRespond = async (leadId: string, status: 'ACCEPTED' | 'DECLINED') => {
    const res = await respondToBookingAction({ leadId, status });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await loadLeads();
  };

  // INBOX_RENDER


  return (
    <div className="space-y-6">
      <header className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-full text-[10px] font-mono text-[#00E5FF] font-bold uppercase mb-2">
          <Inbox size={12} />
          <span>CRM · Chat en vivo</span>
        </div>
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">
          Bandeja de Solicitudes y Mensajes
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Conversa con tus clientes por hilo, acepta o declina solicitudes y abre WhatsApp directo.
        </p>
      </header>

      {error ? (
        <div className="px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-500">
          Cargando bandeja de entradas...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <aside className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all border ${
                    filter === item.key
                      ? 'bg-[#ecb613]/15 border-[#ecb613]/40 text-[#ecb613]'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-[11px] font-mono text-zinc-600 py-8">
                  Sin solicitudes
                </p>
              ) : (
                filtered.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      selectedId === lead.id
                        ? 'bg-[#ecb613]/10 border-[#ecb613]/40'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-syne font-bold text-white text-sm truncate">
                        {lead.clientName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${STATUS_BADGE[lead.status].cls}`}
                      >
                        {STATUS_BADGE[lead.status].label}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-500 truncate mt-1">
                      {lead.lastMessage
                        ? `${lead.lastMessage.sender === 'VENDOR' ? 'Tú' : 'Cliente'}: ${lead.lastMessage.body}`
                        : formatEventDate(lead.eventDate)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>
          <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4 flex flex-col min-h-[480px]">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-xs font-mono text-zinc-600">
                Selecciona una solicitud para ver la conversación
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-syne font-bold text-white">{selected.clientName}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${STATUS_BADGE[selected.status].cls}`}
                      >
                        {STATUS_BADGE[selected.status].label}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                      {selected.clientPhone} · {formatEventDate(selected.eventDate)} ·{' '}
                      {selected.pax} pax
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.status === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRespond(selected.id, 'ACCEPTED')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ecb613]/15 hover:bg-[#ecb613]/25 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[11px] font-bold transition-all"
                        >
                          <Check size={12} />
                          Aceptar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespond(selected.id, 'DECLINED')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[11px] font-bold transition-all"
                        >
                          <X size={12} />
                          Declinar
                        </button>
                      </>
                    ) : null}
                    <a
                      href={buildWhatsAppHref(selected)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold transition-all"
                    >
                      <MessageCircle size={12} />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto py-4">
                  {orderedThreads.length === 0 ? (
                    <p className="text-center text-[11px] font-mono text-zinc-600 py-8">
                      Sin mensajes todavía
                    </p>
                  ) : (
                    orderedThreads.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'VENDOR' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                            message.sender === 'VENDOR'
                              ? 'bg-[#ecb613]/15 border border-[#ecb613]/30 text-white'
                              : 'bg-black/40 border border-white/10 text-zinc-200'
                          }`}
                        >
                          <p>{message.body}</p>
                          <span className="block text-[9px] font-mono text-zinc-500 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSend} className="border-t border-white/10 pt-4 space-y-3">
                  {sendError ? (
                    <p className="text-[11px] font-mono text-rose-300">{sendError}</p>
                  ) : null}
                  <div className="flex items-end gap-2">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Escribe un mensaje al cliente..."
                      rows={2}
                      className="flex-1 bg-black/50 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613] font-sans resize-none"
                    />
                    <button
                      type="submit"
                      disabled={sending || !draft.trim()}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#ecb613] text-black font-mono text-xs font-bold hover:bg-[#f4c63a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={14} />
                      Enviar
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}


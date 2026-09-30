'use client';

import { useState, useEffect } from 'react';
import { Inbox, MessageCircle, Calendar, MapPin } from 'lucide-react';
import { getVendorInboxAction, updateVendorInboxStatusAction, VendorInboxItem } from '@/app/actions/vendorActions';

export default function VendorInboxPage() {
  const [inbox, setInbox] = useState<VendorInboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    setLoading(true);
    const data = await getVendorInboxAction('edwin-agudelo');
    setInbox(data);
    setLoading(false);
  };

  const handleStatusChange = async (leadId: string, newStatus: VendorInboxItem['status']) => {
    const res = await updateVendorInboxStatusAction('edwin-agudelo', leadId, newStatus);
    if (res.success && res.inbox) {
      setInbox(res.inbox);
    }
  };

  const getStatusBadge = (status: VendorInboxItem['status']) => {
    switch (status) {
      case 'NUEVO':
        return <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold uppercase">NUEVO</span>;
      case 'CONTACTADO':
        return <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">CONTACTADO</span>;
      case 'PRESUPUESTADO':
        return <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">PRESUPUESTADO</span>;
      case 'RESERVADO':
        return <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">RESERVADO 100€</span>;
      case 'DECLINADO':
        return <span className="px-2.5 py-1 rounded-xl bg-zinc-800 text-zinc-400 border border-white/5 text-[10px] font-mono font-bold uppercase">DECLINADO</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <header className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
          <Inbox size={12} />
          <span>Gestión en Tiempo Real de Leads</span>
        </div>
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">
          Bandeja de Solicitudes y Mensajes
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Responde a parejas interesadas, actualiza el estado de las negociaciones o abre conversación directa por WhatsApp.
        </p>
      </header>

      {/* Lista de Solicitudes */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-500">Cargando bandeja de entradas...</div>
      ) : (
        <div className="space-y-4">
          {inbox.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-xl hover:border-[#ecb613]/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold font-syne text-white">{item.clientName}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#ecb613]" />
                      {item.eventDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-blue-400" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <a
                    href={`https://wa.me/${item.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hola ${item.clientName}, soy Edwin Agudelo. He recibido tu consulta para el evento del ${item.eventDate} en ${item.location}. ¿Hablamos?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Directo</span>
                  </a>
                </div>
              </div>

              {/* Detalle y Selector de Estado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-zinc-500 uppercase text-[10px]">Notas de la Solicitud:</span>
                  <p className="text-zinc-300 font-light leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
                    {item.notes || 'Sin notas adicionales.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-500 uppercase text-[10px]">Cambiar Estado:</span>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-[#ecb613] font-mono text-xs"
                  >
                    <option value="NUEVO">NUEVO</option>
                    <option value="CONTACTADO">CONTACTADO</option>
                    <option value="PRESUPUESTADO">PRESUPUESTADO</option>
                    <option value="RESERVADO">RESERVADO (100€ Price-Lock)</option>
                    <option value="DECLINADO">DECLINADO</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

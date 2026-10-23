'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Phone,
  Calendar,
  Euro,
  Users,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
} from 'lucide-react';
import type { ManagedVendorSummary, ManagedVendorLead } from '@/app/api/admin/managed-vendors/route';

export default function VendorManagedCareDesk() {
  const [vendors, setVendors] = useState<ManagedVendorSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<ManagedVendorSummary | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [activeReplyLeadId, setActiveReplyLeadId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchManagedVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/managed-vendors');
      const data = await res.json();
      if (data.success && Array.isArray(data.vendors)) {
        setVendors(data.vendors);
        if (data.vendors.length > 0 && !selectedVendor) {
          setSelectedVendor(data.vendors[0]);
        }
      }
    } catch (err) {
      console.error('[VendorManagedCareDesk] Error cargando proveedores gestionados:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedVendor]);

  useEffect(() => {
    fetchManagedVendors();
  }, [fetchManagedVendors]);

  const handleUpdateStatus = async (leadId: string, newStatus: 'ACCEPTED' | 'DECLINED') => {
    try {
      const res = await fetch('/api/admin/managed-vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          leadId,
          vendorId: selectedVendor?.id,
          newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback(`Reserva ${newStatus === 'ACCEPTED' ? 'ACEPTADA' : 'RECHAZADA'} con éxito en nombre del proveedor.`);
        // Actualizar localmente el estado del lead
        setVendors((prev) =>
          prev.map((v) => ({
            ...v,
            leads: v.leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
          }))
        );
        if (selectedVendor) {
          setSelectedVendor((prev) =>
            prev
              ? {
                  ...prev,
                  leads: prev.leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
                }
              : null
          );
        }
      }
    } catch {
      setActionFeedback('Error al actualizar el estado de la reserva.');
    } finally {
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  const handleSendConciergeMessage = async (leadId: string) => {
    const text = replyText[leadId] || '';
    if (!text.trim()) return;

    try {
      const res = await fetch('/api/admin/managed-vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_concierge_message',
          leadId,
          vendorId: selectedVendor?.stageName || 'EAR OS Concierge',
          replyMessage: text,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback('Mensaje Concierge enviado al cliente exitosamente.');
        setReplyText((prev) => ({ ...prev, [leadId]: '' }));
        setActiveReplyLeadId(null);
      }
    } catch {
      setActionFeedback('Error al enviar mensaje.');
    } finally {
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#ecb613]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613]">
              VENDOR MANAGED CARE // PLANES GESTIONADOS PRO & ELITE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              AGENCIA CONCIERGE 360
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-syne text-white uppercase tracking-tight">
            Gestión Delegada de Artistas y Proveedores
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Control de cuentas donde EAR OS asume la representación y despacho comercial directo: negociación de bolos, respuesta a clientes, cumplimiento de SLA (24h) y liquidación Split 80/10/10.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">
            {vendors.length} artistas bajo gestión
          </span>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* CUERPO PRINCIPAL: LISTA DE ARTISTAS GESTIONADOS + PANEL DE CONTROL DE LEADS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA 1: LISTA DE PROVEEDORES GESTIONADOS */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider px-1">
            Cartera de Artistas Gestionados
          </div>

          <div className="space-y-2">
            {vendors.map((v) => {
              const isSelected = selectedVendor?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVendor(v)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-zinc-900/90 border-[#ecb613] shadow-lg shadow-[#ecb613]/10'
                      : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{v.stageName}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{v.category}</div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        v.tier === 'PREMIUM'
                          ? 'bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {v.tier} PLAN
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-zinc-900">
                    <span className="text-zinc-500">Tarifa: {v.baseRateEur} €</span>
                    <div className="flex items-center gap-1.5">
                      {v.pendingLeadsCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                          {v.pendingLeadsCount} pendientes
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[10px]">Al día</span>
                      )}
                      {v.slaBreachRisk && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" title="Riesgo de SLA >18h" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2 Y 3: BANDEJA DE ENTRADA Y ACCIONES DELEGADAS */}
        <div className="lg:col-span-2 space-y-4">
          {selectedVendor ? (
            <div className="space-y-4">
              {/* FICHA RESUMEN DEL ARTISTA SELECCIONADO */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedVendor.stageName}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {selectedVendor.managedPlan}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    📍 {selectedVendor.location} · Límite acústico: {selectedVendor.soundLimitDba} dBA · Caché base: {selectedVendor.baseRateEur} €
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/vendor/escaparate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors border border-zinc-800"
                  >
                    <span>Escaparate</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola, hablas con EAR OS Concierge respecto a ${selectedVendor.stageName}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors border border-emerald-500/40"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* LISTADO DE SOLICITUDES DE CLIENTES PARA ESTE PROVEEDOR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Solicitudes de Clientes (Actuación Delegada)
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {selectedVendor.leads.length} solicitudes registradas
                  </span>
                </div>

                {selectedVendor.leads.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-500/60 mx-auto" />
                    <p className="text-sm font-bold text-zinc-300">Bandeja al día</p>
                    <p className="text-xs text-zinc-500">No hay solicitudes pendientes de respuesta para este artista.</p>
                  </div>
                ) : (
                  selectedVendor.leads.map((lead) => {
                    const isReplying = activeReplyLeadId === lead.id;
                    const isPending = lead.status === 'PENDING';
                    const isAccepted = lead.status === 'ACCEPTED';

                    return (
                      <div
                        key={lead.id}
                        className={`p-4 rounded-2xl transition-all border space-y-3 ${
                          isPending
                            ? 'bg-zinc-950/90 border-amber-500/30 shadow-md shadow-amber-500/5'
                            : 'bg-zinc-950/50 border-zinc-900'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  lead.status === 'PENDING'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : lead.status === 'ACCEPTED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {lead.status}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                Vía: {lead.source}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white">{lead.clientName}</h4>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                              <span>📞 {lead.clientPhone}</span>
                              {lead.eventDate && <span>📅 Evento: {lead.eventDate}</span>}
                              <span>💶 Presupuesto: {lead.budgetEur} €</span>
                              <span>👥 {lead.pax} invitados</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-zinc-500">
                              {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>

                        {/* ACCIONES DELEGADAS */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-900">
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(lead.id, 'ACCEPTED')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors border border-emerald-500/40"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>✓ Aceptar Reserva (24h)</span>
                                </button>

                                <button
                                  onClick={() => handleUpdateStatus(lead.id, 'DECLINED')}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-400 flex items-center gap-1.5 transition-colors border border-red-500/30"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>✕ Rechazar</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => setActiveReplyLeadId(isReplying ? null : lead.id)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors border border-zinc-800"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#ecb613]" />
                              <span>{isReplying ? 'Cerrar Respuesta' : 'Responder Concierge'}</span>
                            </button>
                          </div>

                          <a
                            href={`https://wa.me/${lead.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${lead.clientName}, le contactamos de Productora EAR respecto a su reserva para ${selectedVendor.stageName}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors border border-zinc-800"
                          >
                            <span>WhatsApp Cliente</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        {/* CAJA DE TEXTO PARA RESPUESTA CONCIERGE */}
                        {isReplying && (
                          <div className="pt-2 space-y-2 border-t border-zinc-900">
                            <textarea
                              rows={3}
                              placeholder="Escribe la respuesta en nombre del artista (ej: 'Estimados novios, hemos bloqueado la fecha preliminar y verificado el rider acústico...')"
                              value={replyText[lead.id] || ''}
                              onChange={(e) =>
                                setReplyText((prev) => ({ ...prev, [lead.id]: e.target.value }))
                              }
                              className="w-full p-2.5 text-xs font-mono bg-black/60 border border-white/10 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleSendConciergeMessage(lead.id)}
                                className="px-4 py-1.5 rounded-lg bg-[#ecb613] hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#ecb613]/20"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Enviar Respuesta Oficial</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs">
              Selecciona un proveedor de la lista para ver su despacho comercial.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

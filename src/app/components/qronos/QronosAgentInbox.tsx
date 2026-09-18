'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Clock, Check, X, Filter, ArrowUpDown, MessageCircle, DollarSign, ShieldAlert, Sparkles } from 'lucide-react';

interface InboxItem {
  id: string;
  avatar: string;
  avatarBg: string;
  avatarText: string;
  statusBadge: 'check' | 'warning' | 'alert' | 'sync';
  title: string;
  subtitle: string;
  timestamp: string;
  actionRequired?: boolean;
  actionPayload?: {
    type: 'whatsapp' | 'stripe' | 'b2g' | 'ztm';
    amount?: string;
    recipient?: string;
    details?: string;
  };
}

export function QronosAgentInbox({ className = '' }: { className?: string }) {
  const [filter, setFilter] = useState<'all' | 'actions' | 'completed'>('all');
  const [items, setItems] = useState<InboxItem[]>([
    {
      id: 'item-1',
      avatar: 'SH',
      avatarBg: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
      avatarText: 'Sourcing Hunter',
      statusBadge: 'check',
      title: 'Informe de Fincas y Novios Toledo Listo',
      subtitle: 'El agente de sourcing completó la prospección de 24 fincas activas en Illescas y Méntrida.',
      timestamp: '8m',
      actionRequired: false
    },
    {
      id: 'item-2',
      avatar: 'WA',
      avatarBg: 'border-yellow-400/20 bg-yellow-400/10 text-yellow-200',
      avatarText: 'WhatsApp Dispatcher',
      statusBadge: 'warning',
      title: 'Aprobación Requerida: Envío de Presupuesto',
      subtitle: 'El agente redactó la propuesta oficial para Finca Los Olivos (Solista 350€ + 30€ km + 100€ Stripe).',
      timestamp: '24m',
      actionRequired: true,
      actionPayload: {
        type: 'whatsapp',
        amount: '380,00 €',
        recipient: '+34 693 048 440',
        details: 'Edwin Agudelo Solista de Gala · Equipo Bose 12W/pax · Enlace Stripe Price-Lock'
      }
    },
    {
      id: 'item-3',
      avatar: 'B2G',
      avatarBg: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
      avatarText: 'Tender Engine',
      statusBadge: 'alert',
      title: 'Licitación Menor Acústica Detectada (<14.250€)',
      subtitle: 'Contrato menor en Ayuntamiento de Méntrida por 11.400 € para Fiestas del Vino. Límite < 75 dB SPL verificado.',
      timestamp: '2h',
      actionRequired: true,
      actionPayload: {
        type: 'b2g',
        amount: '11.400,00 €',
        recipient: 'Ayuntamiento de Méntrida',
        details: 'Cumple Art. 118 LCSP (< 14.250 €) · Sistema de Sonido Bose F1 812'
      }
    },
    {
      id: 'item-4',
      avatar: 'ZT',
      avatarBg: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
      avatarText: 'ZTM Reaper',
      statusBadge: 'sync',
      title: 'Sincronización de Memoria Zero-Token Exitosa',
      subtitle: 'La bóveda maestra absorbió 12 nuggets de inteligencia musical sin sobrecargar la ventana de contexto.',
      timestamp: '1d',
      actionRequired: false
    }
  ]);

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, actionRequired: false, title: `${it.title} (APROBADO)` } : it))
    );
  };

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'actions') return item.actionRequired;
    if (filter === 'completed') return !item.actionRequired;
    return true;
  });

  return (
    <div className={`relative flex flex-col rounded-xl border border-white/[0.09] bg-[linear-gradient(145deg,rgba(19,19,21,0.98),rgba(7,7,8,0.98))] p-0 shadow-2xl overflow-hidden ${className}`}>
      
      {/* HEADER DEL INBOX */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="text-base font-semibold text-white/90">Bandeja de Agentes (Action Queue)</div>
          <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#ecb613]">
            {items.filter((i) => i.actionRequired).length} PENDIENTES
          </span>
        </div>

        {/* BOTONES DE FILTRADO */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter(filter === 'actions' ? 'all' : 'actions')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
              filter === 'actions' ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-400 hover:text-white bg-white/[0.04]'
            }`}
          >
            Acciones
          </button>
          <button
            onClick={() => setFilter(filter === 'completed' ? 'all' : 'completed')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
              filter === 'completed' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-white bg-white/[0.04]'
            }`}
          >
            Historial
          </button>
        </div>
      </div>

      {/* LISTA DE ITEMS */}
      <div className="flex flex-col divide-y divide-white/[0.05] p-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg p-3 hover:bg-white/[0.025] transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              {/* AVATAR DE AGENTE */}
              <div className="relative shrink-0 mt-0.5">
                <span className={`flex size-9 items-center justify-center rounded-full border text-xs font-mono font-bold ${item.avatarBg}`}>
                  {item.avatar}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5">
                  {item.statusBadge === 'check' || item.statusBadge === 'sync' ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-400 text-black">
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                  ) : item.statusBadge === 'warning' ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-amber-400 text-black">
                      <AlertTriangle className="size-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-white">
                      <AlertTriangle className="size-2.5 stroke-[3]" />
                    </span>
                  )}
                </span>
              </div>

              {/* TEXTOS */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-white/90">{item.title}</p>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">{item.timestamp}</span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-400 line-clamp-2">{item.subtitle}</p>

                {/* DETALLES DEL PAYLOAD DE ACCIÓN */}
                {item.actionRequired && item.actionPayload && (
                  <div className="mt-2.5 inline-flex flex-wrap items-center gap-2 rounded-md bg-black/50 border border-zinc-800 px-2.5 py-1.5 font-mono text-[11px] text-zinc-300">
                    <span className="text-[#ecb613] font-bold">{item.actionPayload.amount}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-zinc-400">{item.actionPayload.recipient}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-emerald-400">Split 80/10/10</span>
                  </div>
                )}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN HUMANA */}
            {item.actionRequired && (
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                  title="Descartar tarea"
                >
                  <X className="size-4" />
                </button>
                <button
                  onClick={() => handleApprove(item.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Check className="size-3.5 stroke-[3]" /> Aprobar & Despachar
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-xs font-mono text-zinc-500">
            No hay notificaciones pendientes en este filtro.
          </div>
        )}
      </div>
    </div>
  );
}

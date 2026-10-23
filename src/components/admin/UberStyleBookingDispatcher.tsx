'use client';

import React, { useEffect, useState } from 'react';
import {
  Truck,
  Zap,
  Phone,
  Sparkles,
} from 'lucide-react';
import { DEPOSITO_STRIPE_EUR, LIMITE_SPL_DB, LOGISTICA_EUR_PER_KM, LOGISTICA_KM_EXENTOS, SPLIT_SOBERANO, SUPLEMENTO_HOTEL_EUR } from '@/lib/constants/ear-os-ssot';
import type { DispatchQueueItem } from '@/lib/dispatch/dispatchQueueTypes';

// La cola de despacho ya no es semilla demo: se lee de PostgreSQL vía
// GET /api/admin/dispatch (ProductionEvent + VendorBooking). Cero fachadas.

export default function UberStyleBookingDispatcher() {
  const [queue, setQueue] = useState<DispatchQueueItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DispatchQueueItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [lockingId, setLockingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/dispatch');
        const data = (await res.json()) as {
          success?: boolean;
          items?: DispatchQueueItem[];
          error?: string;
        };
        if (!active) return;
        if (res.ok && data.success) {
          const items = data.items ?? [];
          setQueue(items);
          setSelectedItem(items[0] ?? null);
        } else {
          setLoadError(data.error ?? 'No se pudo leer la cola de despacho.');
        }
      } catch {
        if (active) setLoadError('Error de red: PostgreSQL no responde. La cola queda vacía.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const calculateLogistics = (km: number, hotel: boolean) => {
    const extraKm = Math.max(0, km - LOGISTICA_KM_EXENTOS);
    const kmCost = extraKm * LOGISTICA_EUR_PER_KM; // 1.50 €/km
    const hotelCost = hotel ? SUPLEMENTO_HOTEL_EUR : 0; // 120 €
    return { kmCost, hotelCost, totalLogistics: kmCost + hotelCost };
  };

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatKm = (km: number | null): string => (km == null ? 'N/D' : `${km} km`);

  const formatDba = (dba: number | null): string => (dba == null ? 'N/D' : `${dba} dBA`);

  const acousticLabel = (dba: number | null): string => {
    if (dba == null) return 'Sin medición acústica registrada en origen.';
    if (dba <= LIMITE_SPL_DB) return `Cumple protocolo VIMUME no invasivo (<${LIMITE_SPL_DB} dB SPL)`;
    if (dba <= 90) return 'Apto para fincas, exteriores y bodas (Ley 37/2003)';
    return 'Apto para festejos y plazas con limitador telemático';
  };

  const handleAtomicLock = async (item: DispatchQueueItem) => {
    setLockingId(item.id);
    setNotification(null);
    try {
      const res = await fetch('/api/admin/dispatch/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventDate: item.eventDate,
          clientName: item.clientName,
          location: item.location,
          totalEur: item.totalEur,
          vendorName: item.assignedArtist,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'LOCKED_ACID' } : q))
        );
        setNotification(
          `✅ Lock atómico ACID sellado (ProductionEvent ${data.productionId}). Depósito ${DEPOSITO_STRIPE_EUR}€ deducible íntegro. Split 80/10/10 registrado.`
        );
      } else {
        setNotification(`⚠️ ${data.message || data.reason || 'No se pudo sellar la fecha'}`);
      }
    } catch {
      setNotification('⚠️ Error de red al sellar la fecha. Verifica el backend.');
    } finally {
      setLockingId(null);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              UBER-STYLE DISPATCHER & LOGÍSTICA // HUB MÉNTRIDA KM 0
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              SSOT V9 ACID
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-syne text-white uppercase tracking-tight">
            Mando de Asignación de Artistas, Portes y Rutas
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Despacho en tiempo real estilo Uber/Airbnb: cálculo automático de logística desde Hub Méntrida (1,50 €/km a partir del km 50 + 120 € hotel si &gt; 200 km), supervisión acústica dBA y cerrojo ACID de fechas.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            Hub Origen: <b className="text-white">Méntrida (Toledo)</b>
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            Split: <b className="text-white">80 / 10 / 10</b>
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* DISPATCH MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LISTADO DE EVENTOS EN COLA DE DESPACHO */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider px-1">
            Cola de Despacho & Asignación de Rutas
          </div>

          <div className="space-y-3">
            {loading && (
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900 text-xs font-mono text-zinc-500">
                Leyendo cola de despacho desde PostgreSQL (ProductionEvent + VendorBooking)…
              </div>
            )}
            {!loading && loadError && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                ⚠️ {loadError}
              </div>
            )}
            {!loading && !loadError && queue.length === 0 && (
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900 text-xs font-mono text-zinc-500">
                No hay eventos en la cola de despacho. Las reservas selladas aparecerán aquí.
              </div>
            )}
            {!loading && queue.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const { totalLogistics } = calculateLogistics(item.distanceKmFromMentrida ?? 0, item.hotelRequired);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border space-y-3 ${
                    isSelected
                      ? 'bg-zinc-900/90 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                      : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'LOCKED_ACID'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : item.status === 'DISPATCHED'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">📅 {formatDate(item.eventDate)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{item.eventName}</h4>
                      <p className="text-xs text-zinc-400">
                        Cliente: {item.clientName} · 📍 {item.location} ({formatKm(item.distanceKmFromMentrida)})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold font-mono text-white">{item.totalEur} €</div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        Depósito: {item.depositPaidEur} € Lock
                      </div>
                    </div>
                  </div>

                  {/* TELEMETRÍA DE RUTA Y SONIDO */}
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-2 border-t border-zinc-900">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <span>🎤 {item.assignedArtist}</span>
                      <span>🔊 {formatDba(item.soundDba)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">
                        Porte: +{totalLogistics.toFixed(2)} €
                      </span>
                      {item.hotelRequired && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          +{SUPLEMENTO_HOTEL_EUR}€ Hotel
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETALLE Y PALANCAS OPERATIVAS DEL EVENTO SELECCIONADO */}
        {selectedItem && (
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#ecb613] uppercase font-bold">
                  Inspección Operativa S-Class
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedItem.eventName}</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Cliente: <b className="text-white">{selectedItem.clientName}</b>
                </p>
              </div>

              {/* DESGLOSE LOGÍSTICO Y FINANCIERO */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Distancia Méntrida:</span>
                  <span className="text-white">{formatKm(selectedItem.distanceKmFromMentrida)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Km facturables (&gt;50km):</span>
                  <span className="text-white">{Math.max(0, (selectedItem.distanceKmFromMentrida ?? 0) - LOGISTICA_KM_EXENTOS)} km</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Porte Logístico (1,50€/km):</span>
                  <span className="text-cyan-400">
                    {calculateLogistics(selectedItem.distanceKmFromMentrida ?? 0, selectedItem.hotelRequired).kmCost.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Dieta Hotel (&gt;200km/3AM):</span>
                  <span className="text-cyan-400">
                    {selectedItem.hotelRequired ? `${SUPLEMENTO_HOTEL_EUR.toFixed(2)} €` : '0.00 €'}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-zinc-900">
                  <span>Split Artista (80%):</span>
                  <span className="text-emerald-400">
                    {(selectedItem.totalEur * SPLIT_SOBERANO.artista).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Comisión EAR OS (10%):</span>
                  <span className="text-[#ecb613]">{(selectedItem.totalEur * SPLIT_SOBERANO.earOs).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>VIMUME Social (10%):</span>
                  <span className="text-cyan-400">{(selectedItem.totalEur * SPLIT_SOBERANO.vimume).toFixed(2)} €</span>
                </div>
              </div>

              {/* AUDITORÍA ACÚSTICA */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Presión Sonora:</span>
                  <span className="font-bold text-white">{formatDba(selectedItem.soundDba)}</span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  {acousticLabel(selectedItem.soundDba)}
                </p>
              </div>
            </div>

            {/* BOTONES DE DISPACHO */}
            <div className="space-y-2 pt-2 border-t border-zinc-900">
              {selectedItem.status !== 'LOCKED_ACID' && (
                <button
                  onClick={() => handleAtomicLock(selectedItem)}
                  disabled={lockingId === selectedItem.id}
                  className={`w-full py-2.5 rounded-xl text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                    lockingId === selectedItem.id
                      ? 'bg-zinc-700 text-zinc-300 cursor-wait'
                      : 'bg-[#ecb613] hover:bg-amber-400 shadow-[#ecb613]/20'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{lockingId === selectedItem.id ? 'Sellando fecha atómicamente...' : 'Lock Atómico de Fecha ACID'}</span>
                </button>
              )}

              {selectedItem.clientPhone.trim().length > 0 && (
                <a
                  href={`https://wa.me/${selectedItem.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${selectedItem.clientName}, nos comunicamos desde la central de Productora EAR para coordinar el bolo ${selectedItem.eventName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-center gap-2 border border-emerald-500/40 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contactar Cliente WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ClientLiveTrackingDrawer, ClientLiveTrackingData } from '@/features/fleet/ui/ClientLiveTrackingDrawer';
import { ShieldCheck, MapPin, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface ReservaConfirmadaLiveViewProps {
  sessionId: string;
  productionId: string;
  initialData: ClientLiveTrackingData | null;
}

/**
 * Vista Cliente Post-Stripe: Mapa Leaflet HD a pantalla completa centrado en la finca
 * + ClientLiveTrackingDrawer flotante con fianza verificada, matrícula, conductor,
 * señas de acceso y botones 1-clic de llamada/WhatsApp.
 */
export function ReservaConfirmadaLiveView({
  sessionId,
  productionId,
  initialData
}: ReservaConfirmadaLiveViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [data, setData] = useState<ClientLiveTrackingData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar datos de tracking si no vienen del servidor
  useEffect(() => {
    if (initialData) return;

    let cancelled = false;
    async function fetchTracking() {
      try {
        const res = await fetch(
          `/api/fleet/client-tracking?production_id=${encodeURIComponent(productionId)}&session_id=${encodeURIComponent(sessionId)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('No se pudo recuperar el seguimiento del convoy.');
        const json = (await res.json()) as ClientLiveTrackingData;
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error de red');
          setLoading(false);
        }
      }
    }

    fetchTracking();
    return () => {
      cancelled = true;
    };
  }, [initialData, productionId, sessionId]);

  // 2. Inicializar mapa Leaflet HD centrado en la finca del cliente
  useEffect(() => {
    if (!data || !mapContainerRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapContainerRef.current) return;

      const dest = data!.destinationCoords;
      const origin = data!.originCoords;

      const map = L.map(mapContainerRef.current, {
        center: [dest.lat, dest.lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd'
      }).addTo(map);

      // Marcador de la finca (destino)
      const venueIcon = L.divIcon({
        className: 'venue-pin',
        html: `
          <div style="position: relative; transform: translate(-50%, -100%);">
            <div style="background: rgba(10,10,18,0.95); border: 2px solid #ecb613; color: #fff; font-family: monospace; font-size: 10px; font-weight: bold; padding: 5px 10px; border-radius: 10px; white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,0.85);">
              🏛️ ${data!.venueName}
            </div>
            <div style="width: 2px; height: 12px; background: #ecb613; margin: 0 auto;"></div>
          </div>
        `,
        iconSize: [120, 40],
        iconAnchor: [60, 40]
      });
      L.marker([dest.lat, dest.lng], { icon: venueIcon, zIndexOffset: 1000 }).addTo(map);

      // Marcador del convoy (origen actual)
      const convoyIcon = L.divIcon({
        className: 'convoy-pin',
        html: `
          <div style="position: relative; transform: translate(-50%, -50%);">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: #00E5FF; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px #00E5FF;">
              <span style="font-size: 16px;">🚐</span>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      L.marker([origin.lat, origin.lng], { icon: convoyIcon, zIndexOffset: 900 }).addTo(map);

      // Ruta origen -> destino
      L.polyline(
        [
          [origin.lat, origin.lng],
          [dest.lat, dest.lng]
        ],
        { color: '#00E5FF', weight: 3, opacity: 0.7, dashArray: '6, 8' }
      ).addTo(map);

      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [dest.lat, dest.lng]
      ]);
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 14 });

      setTimeout(() => map.invalidateSize(), 200);
    }

    initMap();

    return () => {
      cancelled = true;
      const map = mapInstanceRef.current as { remove?: () => void } | null;
      if (map && typeof map.remove === 'function') {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="animate-spin text-[#ecb613]" size={48} />
        <p className="font-mono text-sm text-zinc-400">Verificando fianza Stripe y localizando convoy...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-4 text-white p-8">
        <AlertTriangle className="text-rose-500" size={48} />
        <h1 className="font-syne font-black text-2xl">No pudimos localizar tu reserva</h1>
        <p className="font-mono text-sm text-zinc-400 max-w-md text-center">
          {error || 'La reserva no está disponible todavía. Si acabas de pagar, espera unos segundos y recarga.'}
        </p>
        <p className="font-mono text-[10px] text-zinc-600">Producción: {productionId}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#030305] overflow-hidden">
      {/* Mapa Leaflet HD a pantalla completa */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Header flotante superior */}
      <div className="absolute top-0 left-0 right-0 z-[400] p-4 sm:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="pointer-events-auto bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-syne font-black text-sm sm:text-base text-white uppercase tracking-tight">
                  Reserva Confirmada
                </h1>
                <Sparkles size={14} className="text-[#ecb613]" />
              </div>
              <p className="font-mono text-[10px] text-emerald-400">
                Fianza 100 € verificada en Stripe
              </p>
            </div>
          </div>

          <div className="pointer-events-auto hidden sm:flex bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-3 items-center gap-2 shadow-2xl">
            <MapPin size={16} className="text-[#00E5FF]" />
            <span className="font-mono text-[11px] text-zinc-300">
              {data.venueName}
            </span>
          </div>
        </div>
      </div>

      {/* Drawer flotante de tracking en vivo */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-[500] max-h-[85vh] overflow-y-auto">
        <ClientLiveTrackingDrawer data={data} />
      </div>
    </div>
  );
}

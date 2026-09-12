"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Navigation, Maximize2, RotateCcw, 
  Car, MapPin, Zap, AlertTriangle, Layers, 
  LocateFixed, ShieldCheck, Clock, Compass, Activity,
  Phone, MessageSquare, ExternalLink, Key, CheckCircle2,
  Search, Eye, UserCheck, Truck, Sparkles, Building
} from 'lucide-react';
import { MariachiSimulationReport, MariachiBookingSimulated } from '@/lib/matchmaker/mariachiHighTrafficSimulator';
import 'leaflet/dist/leaflet.css';

interface UberFleetVisualizerProps {
  report: MariachiSimulationReport;
  isRunning: boolean;
  onTogglePlay?: () => void;
  onToggleOvertime?: () => void;
  injectOvertime?: boolean;
}

type TileLayerMode = 'dark' | 'satellite' | 'street';

export function UberFleetVisualizer({ 
  report, 
  isRunning,
  onTogglePlay,
  onToggleOvertime,
  injectOvertime
}: UberFleetVisualizerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const labelLayerRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const accessPointMarkersRef = useRef<{ [key: string]: any }>({});
  const carMarkersRef = useRef<{ [key: string]: any }>({});
  const routesRef = useRef<{ [key: string]: any }>({});
  const animationFrameRef = useRef<number | null>(null);

  const [tileMode, setTileMode] = useState<TileLayerMode>('dark');
  const [selectedBooking, setSelectedBooking] = useState<MariachiBookingSimulated | null>(null);
  const [mapZoom, setMapZoom] = useState(10);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessPoints, setShowAccessPoints] = useState(true);

  const originLat = report.originBaseCoords.lat; // 40.3847 (Plaza Elíptica)
  const originLng = report.originBaseCoords.lng; // -3.7183

  // Servidores de mapas de alta resolución geográfica
  const TILE_SERVERS: Record<TileLayerMode, { url: string; labelUrl?: string; maxZoom: number }> = {
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      maxZoom: 20
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      labelUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 19
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19
    }
  };

  // 1. Inicializar mapa Leaflet interactivo completo
  useEffect(() => {
    let isCancelled = false;

    async function initLeaflet() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      if (isCancelled || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [originLat, originLng],
        zoom: 10,
        maxZoom: 20,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        boxZoom: true
      });

      mapInstanceRef.current = map;

      // Capa base
      const currentConfig = TILE_SERVERS[tileMode];
      const tileLayer = L.tileLayer(currentConfig.url, {
        maxZoom: currentConfig.maxZoom,
        subdomains: 'abcd'
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      map.on('zoomend', () => {
        setMapZoom(map.getZoom());
      });

      // Marcador Base Cero: Plaza Elíptica
      const baseIcon = L.divIcon({
        className: 'custom-base-pin',
        html: `
          <div style="position: relative; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(0, 229, 255, 0.25); border: 2px solid #00E5FF; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px #00E5FF;">
              <div style="width: 14px; height: 14px; border-radius: 50%; background: #00E5FF; box-shadow: 0 0 15px #00E5FF;"></div>
            </div>
            <div style="background: rgba(3,3,5,0.95); border: 1px solid #00E5FF; color: #00E5FF; font-family: monospace; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-top: 4px; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.9);">
              HUB BASE // PLAZA ELÍPTICA
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker([originLat, originLng], { icon: baseIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`
          <div style="background:#0a0a12; color:#fff; padding:12px; border-radius:12px; font-family:sans-serif; border:1px solid #00E5FF; min-width:200px;">
            <strong style="color:#00E5FF; font-size:13px; text-transform:uppercase; display:block;">Plaza Elíptica, Madrid</strong>
            <p style="margin:4px 0 0 0; font-size:11px; color:#ddd;">Base Oficial de Despacho Mariachis</p>
            <p style="margin:4px 0 0 0; font-size:10px; color:#888; font-family:monospace;">Flota de 32 Servicios • Radio Cobertura 200 km</p>
          </div>
        `);

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    initLeaflet();

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Cambio de capa de mapa
  useEffect(() => {
    async function updateTileLayer() {
      if (!mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;
      
      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
      if (labelLayerRef.current) map.removeLayer(labelLayerRef.current);

      const config = TILE_SERVERS[tileMode];
      const newLayer = L.tileLayer(config.url, {
        maxZoom: config.maxZoom,
        subdomains: 'abcd'
      }).addTo(map);
      tileLayerRef.current = newLayer;

      if (config.labelUrl) {
        const labelLayer = L.tileLayer(config.labelUrl, {
          maxZoom: config.maxZoom,
          subdomains: 'abcd'
        }).addTo(map);
        labelLayerRef.current = labelLayer;
      }
    }

    updateTileLayer();
  }, [tileMode]);

  // 3. Renderizar rutas, fincas de destino, señas de acceso y coches en movimiento
  useEffect(() => {
    async function updateFleetOnMap() {
      if (!mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Limpiar elementos previos
      Object.values(markersRef.current).forEach((m: any) => map.removeLayer(m));
      Object.values(accessPointMarkersRef.current).forEach((a: any) => map.removeLayer(a));
      Object.values(routesRef.current).forEach((r: any) => map.removeLayer(r));
      Object.values(carMarkersRef.current).forEach((c: any) => map.removeLayer(c));
      markersRef.current = {};
      accessPointMarkersRef.current = {};
      routesRef.current = {};
      carMarkersRef.current = {};

      report.bookings.forEach((booking, idx) => {
        const isReassigned = booking.status === 'UBER_REASSIGNED';
        const destLat = booking.lat;
        const destLng = booking.lng;
        const routeColor = isReassigned ? '#ef4444' : '#ecb613';

        // 🛣️ Línea de Ruta GPS real
        const polyline = L.polyline(
          [[originLat, originLng], [destLat, destLng]], 
          {
            color: routeColor,
            weight: isReassigned ? 3.5 : 2,
            opacity: 0.7,
            dashArray: isReassigned ? '6, 6' : '4, 8'
          }
        ).addTo(map);

        routesRef.current[booking.id] = polyline;

        // 📍 Marcador Principal de Destino (Finca / Venue)
        const venueShort = booking.venueName.split('(')[0].trim();
        const pinHtml = `
          <div style="position: relative; transform: translate(-50%, -100%); cursor: pointer;">
            <div style="background: ${isReassigned ? 'rgba(239,68,68,0.95)' : 'rgba(10,10,18,0.95)'}; border: 2px solid ${routeColor}; color: #fff; font-family: monospace; font-size: 9px; font-weight: bold; padding: 4px 8px; border-radius: 8px; white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,0.85); display: flex; flex-direction: column; gap: 1px;">
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="color:${isReassigned ? '#fff' : '#ecb613'}; font-size:8px;">#${idx + 1}</span>
                <span style="max-width:140px; overflow:hidden; text-overflow:ellipsis;">${venueShort}</span>
              </div>
              <span style="font-size:7.5px; color:#aaa; font-family:sans-serif;">${booking.municipality.replace(' (Madrid)', '')} • ${booking.timeSlot}</span>
            </div>
            <div style="width: 2px; height: 10px; background: ${routeColor}; margin: 0 auto;"></div>
          </div>
        `;

        const destIcon = L.divIcon({
          className: `custom-dest-pin-${booking.id}`,
          html: pinHtml,
          iconSize: [80, 40],
          iconAnchor: [40, 40]
        });

        const destMarker = L.marker([destLat, destLng], { icon: destIcon })
          .addTo(map)
          .on('click', () => {
            setSelectedBooking(booking);
          });

        markersRef.current[booking.id] = destMarker;

        // 🔑 Marcador de Detalle: Seña de Acceso / Carga del Cliente (Punto Micro-Geográfico)
        if (showAccessPoints) {
          const accessLat = destLat + 0.0012; // Ligeramente desplazado en la entrada de la finca
          const accessLng = destLng + 0.0010;

          const accessHtml = `
            <div style="position: relative; transform: translate(-50%, -50%); cursor: pointer;" title="Señas de Acceso Proveedores: ${booking.clientAccessNotes}">
              <div style="width: 22px; height: 22px; border-radius: 50%; background: #00E5FF; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px #00E5FF;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5 3.5-3.5 5 5-2 2z"/>
                  <circle cx="7.5" cy="16.5" r="4.5"/>
                  <path d="m10.5 13.5 3 3"/>
                </svg>
              </div>
            </div>
          `;

          const accessIcon = L.divIcon({
            className: `custom-access-pin-${booking.id}`,
            html: accessHtml,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          const accessMarker = L.marker([accessLat, accessLng], { icon: accessIcon, zIndexOffset: 300 })
            .addTo(map)
            .on('click', () => {
              setSelectedBooking(booking);
            });

          accessPointMarkersRef.current[booking.id] = accessMarker;
        }

        // 🏎️ Marcador Coche Móvil (Uber Mariachi)
        const etaMinutes = Math.max(8, Math.floor(booking.distanceFromPlazaElipticaKm * 1.4));
        const carHtml = `
          <div style="position: relative; transform: translate(-50%, -50%); pointer-events: auto; cursor: pointer;">
            <div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 4px; background: rgba(0,0,0,0.92); border: 1px solid ${isReassigned ? '#ef4444' : 'rgba(255,255,255,0.25)'}; color: #fff; font-family: monospace; font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 6px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.85); display: flex; align-items: center; gap: 3px;">
              <span>${isReassigned ? '⚡ RELEVO' : `ETA ${etaMinutes}m`}</span>
              <span style="color:#aaa;">•</span>
              <span style="color:${isReassigned ? '#fca5a5' : '#ecb613'};">${booking.mariachiLeadName.split(' ')[1] || 'Mariachi'}</span>
            </div>
            <div style="width: 30px; height: 30px; border-radius: 50%; background: ${isReassigned ? '#ef4444' : '#ffffff'}; border: 2.5px solid ${routeColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px ${isReassigned ? 'rgba(239,68,68,0.7)' : 'rgba(236,182,19,0.5)'};">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${isReassigned ? '#ffffff' : '#000000'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
          </div>
        `;

        const carIcon = L.divIcon({
          className: `custom-car-pin-${booking.id}`,
          html: carHtml,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const carMarker = L.marker([originLat, originLng], { icon: carIcon, zIndexOffset: 600 })
          .addTo(map)
          .on('click', () => {
            setSelectedBooking(booking);
          });

        carMarkersRef.current[booking.id] = carMarker;
      });

      // Animación continua GPS de los 32 coches
      let startTime: number | null = null;
      const animationDuration = (35000 / speedMultiplier);

      function animateCars(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        let progress = (elapsed % animationDuration) / animationDuration;

        if (!isRunning) {
          progress = 0;
        }

        report.bookings.forEach((booking) => {
          const marker = carMarkersRef.current[booking.id];
          if (!marker) return;

          const currentLat = originLat + (booking.lat - originLat) * progress;
          const currentLng = originLng + (booking.lng - originLng) * progress;

          marker.setLatLng([currentLat, currentLng]);
        });

        if (isRunning) {
          animationFrameRef.current = requestAnimationFrame(animateCars);
        }
      }

      if (isRunning) {
        animationFrameRef.current = requestAnimationFrame(animateCars);
      } else {
        report.bookings.forEach((booking) => {
          const marker = carMarkersRef.current[booking.id];
          if (marker) marker.setLatLng([originLat, originLng]);
        });
      }
    }

    updateFleetOnMap();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [report, isRunning, speedMultiplier, showAccessPoints]);

  // Controles de navegación de cámara estilo Google Maps
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([originLat, originLng], 12, { duration: 1.2 });
    }
  };

  const handleFitBounds = async () => {
    if (!mapInstanceRef.current) return;
    const L = (await import('leaflet')).default;
    const bounds = L.latLngBounds([[originLat, originLng]]);
    report.bookings.forEach((b) => bounds.extend([b.lat, b.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14, duration: 1.2 });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleFocusBooking = (booking: MariachiBookingSimulated) => {
    setSelectedBooking(booking);
    if (mapInstanceRef.current) {
      // Zoom hiper-detallado a nivel de calle/finca (Zoom 17)
      mapInstanceRef.current.flyTo([booking.lat, booking.lng], 17, { duration: 1.5 });
    }
  };

  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return report.bookings.filter(b => 
      b.municipality.toLowerCase().includes(q) || 
      b.venueName.toLowerCase().includes(q) ||
      b.mariachiLeadName.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [report.bookings, searchQuery]);

  return (
    <div className="w-full bg-[#030305]/95 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl space-y-0">
      
      {/* 🧭 BARRA SUPERIOR DE CONTROL TÁCTICO & BUSCADOR HIPER-DETALLADO */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-black/90 via-[#0a0a14] to-black/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] shadow-lg shadow-[#ecb613]/10">
            <Compass className="animate-spin-slow" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-syne font-black uppercase text-base sm:text-lg text-white tracking-tight">
                Consola Táctica GPS // Google Maps HD
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                MICROMAPAS & SEÑAS
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-2">
              <span>{report.totalBookings} Fincas & Bolos</span>
              <span>•</span>
              <span className="text-[#00E5FF]">Puntos de Acceso / Carga Activos</span>
              <span>•</span>
              <span className="text-amber-400">Zoom hasta Nivel 20</span>
            </p>
          </div>
        </div>

        {/* Buscador de fincas / municipios para vuelo directo */}
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input
              type="text"
              placeholder="Buscar finca, municipio o seña..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-all"
            />
          </div>

          {filteredBookings.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a14] border border-white/15 rounded-2xl shadow-2xl p-2 z-[600] space-y-1">
              {filteredBookings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    handleFocusBooking(b);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <strong className="text-white block truncate">{b.venueName.split('(')[0]}</strong>
                    <span className="text-[10px] text-zinc-500">{b.municipality} • {b.timeSlot}</span>
                  </div>
                  <span className="text-[10px] text-[#ecb613] whitespace-nowrap">Volar ➔</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botones de simulación y opciones */}
        <div className="flex items-center flex-wrap gap-2">
          {onTogglePlay && (
            <button
              onClick={onTogglePlay}
              className={`px-4 py-2 rounded-xl text-xs font-syne font-bold uppercase transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 text-black shadow-amber-500/20'
                  : 'bg-[#ecb613] text-black hover:bg-amber-300 shadow-[#ecb613]/20'
              }`}
            >
              <Car size={14} />
              <span>{isRunning ? 'Pausar Flota' : '▶ Desplegar Flota'}</span>
            </button>
          )}

          {onToggleOvertime && (
            <button
              onClick={onToggleOvertime}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all border flex items-center gap-1.5 cursor-pointer ${
                injectOvertime
                  ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
              }`}
            >
              <AlertTriangle size={13} className={injectOvertime ? 'animate-bounce' : ''} />
              <span>{injectOvertime ? '⚡ Relevos Activos' : 'Simular Relevo'}</span>
            </button>
          )}

          {/* Toggle de Señas de Acceso */}
          <button
            onClick={() => setShowAccessPoints(!showAccessPoints)}
            title="Mostrar / Ocultar Puntos de Acceso y Señas de Entrada"
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all border flex items-center gap-1.5 cursor-pointer ${
              showAccessPoints 
                ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/40' 
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Key size={13} />
            <span>Señas {showAccessPoints ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* 🗺️ CONTENEDOR DEL MAPA INTERACTIVO GOOGLE MAPS */}
      <div className="relative w-full h-[620px] sm:h-[700px] bg-[#050507]">
        
        {/* Canvas Leaflet */}
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

        {/* HUD SUPERIOR DERECHO: SELECTOR DE CAPAS */}
        <div className="absolute top-4 right-4 z-[400] flex items-center bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl p-1 shadow-2xl">
          <button
            onClick={() => setTileMode('dark')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tileMode === 'dark' 
                ? 'bg-[#ecb613] text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers size={12} />
            <span>Dark OLED</span>
          </button>
          <button
            onClick={() => setTileMode('satellite')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tileMode === 'satellite' 
                ? 'bg-[#00E5FF] text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Maximize2 size={12} />
            <span>Satélite HD</span>
          </button>
          <button
            onClick={() => setTileMode('street')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tileMode === 'street' 
                ? 'bg-white text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Callejero</span>
          </button>
        </div>

        {/* HUD SUPERIOR IZQUIERDO: TELEMETRÍA Y RESOLUCIÓN DE ZOOM */}
        <div className="absolute top-4 left-4 z-[400] pointer-events-none">
          <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </span>
              <span className="text-[11px] font-mono font-bold uppercase text-white tracking-wider">
                {isRunning ? 'GPS STREAMING VIVO' : 'SISTEMA EN ESPERA'}
              </span>
            </div>
            <div className="text-[9px] font-mono text-zinc-400 space-y-0.5">
              <p>Resolución: <strong className="text-white">Zoom {mapZoom}x</strong> (Micro-detalle activo)</p>
              <p className="text-emerald-400">Puntos de acceso a fincas: 32 verificados</p>
            </div>
          </div>
        </div>

        {/* HUD INFERIOR DERECHO: NAVEGACIÓN Y ZOOM ESTILO GOOGLE MAPS */}
        <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-2">
          <button
            onClick={handleRecenter}
            title="Centrar en Plaza Elíptica"
            className="w-11 h-11 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-white hover:text-[#00E5FF] hover:border-[#00E5FF] flex items-center justify-center transition-all shadow-xl cursor-pointer"
          >
            <LocateFixed size={18} />
          </button>
          <button
            onClick={handleFitBounds}
            title="Ajustar Toda la Flota (Madrid & Provincias)"
            className="w-11 h-11 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-white hover:text-[#ecb613] hover:border-[#ecb613] flex items-center justify-center transition-all shadow-xl cursor-pointer"
          >
            <Maximize2 size={18} />
          </button>
          <div className="bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl flex flex-col shadow-xl overflow-hidden">
            <button
              onClick={handleZoomIn}
              title="Acercar (+)"
              className="w-11 h-10 text-white hover:bg-white/10 flex items-center justify-center font-mono font-bold text-lg border-b border-white/10 cursor-pointer"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              title="Alejar (-)"
              className="w-11 h-10 text-white hover:bg-white/10 flex items-center justify-center font-mono font-bold text-lg cursor-pointer"
            >
              −
            </button>
          </div>
        </div>

        {/* 📱 DRAWER / FICHA TÁCTICA VIP DE CONTACTO DIRECTO CON EL MARIACHI & SEÑAS */}
        {selectedBooking && (
          <div className="absolute top-4 bottom-4 left-4 right-4 sm:right-auto sm:w-[420px] z-[500] animate-in fade-in slide-in-from-left-4 duration-300 overflow-y-auto pr-1">
            <div className="bg-[#0a0a14]/98 backdrop-blur-3xl border border-white/20 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-4 relative">
              
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xs font-mono font-bold bg-white/5 hover:bg-white/10 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>

              {/* Status Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase flex items-center gap-1.5 ${
                  selectedBooking.status === 'UBER_REASSIGNED'
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-[#ecb613] text-black font-black'
                }`}>
                  <ShieldCheck size={12} />
                  <span>{selectedBooking.status === 'UBER_REASSIGNED' ? 'RELEVO UBER EN CAMINO' : 'CONVOY CONFIRMADO'}</span>
                </span>
                
                <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>FIANZA 100€ STRIPE OK</span>
                </span>
              </div>

              {/* Finca / Venue & Dirección */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#ecb613] tracking-widest flex items-center gap-1">
                  <Building size={12} />
                  <span>Destino / Finca de Celebración</span>
                </div>
                <h4 className="font-syne font-black text-xl text-white leading-tight">
                  {selectedBooking.venueName}
                </h4>
                <p className="text-xs text-zinc-400 font-mono flex items-start gap-1 pt-0.5">
                  <MapPin size={13} className="text-rose-400 shrink-0 mt-0.5" />
                  <span>{selectedBooking.exactAddress}</span>
                </p>
              </div>

              {/* 🟢 SECCIÓN 1: CONTACTO DIRECTO CON EL MARIACHI (POST-PAGO) */}
              <div className="p-4 rounded-2xl bg-black/80 border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck size={16} className="text-emerald-400" />
                    <span className="text-xs font-syne font-bold uppercase text-white">
                      Contacto Directo con el Mariachi
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    CANAL ABIERTO
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>{selectedBooking.mariachiLeadName}</span>
                    <span className="text-[10px] text-zinc-400">Jefe Cuadrilla</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Truck size={12} className="text-[#ecb613]" />
                    <span>Vehículo: <strong>{selectedBooking.mariachiVehiclePlate}</strong></span>
                  </p>
                </div>

                {/* Botones 1-Clic de Teléfono y WhatsApp Directo */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${selectedBooking.mariachiPhone}`}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-syne font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Phone size={14} />
                    <span>Llamar Mariachi</span>
                  </a>

                  <a
                    href={`https://wa.me/${selectedBooking.mariachiPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(selectedBooking.mariachiLeadName)}%2C%20te%20escribo%20desde%20la%20reserva%20EAR%20OS%20para%20${encodeURIComponent(selectedBooking.venueName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-syne font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* 🔑 SECCIÓN 2: SEÑAS Y DETALLES DEL CLIENTE (LLEGADA Y APARCAMIENTO) */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#00E5FF] font-bold text-[11px] uppercase tracking-wider">
                  <Key size={14} />
                  <span>Señas de Acceso Proveedores (Cliente)</span>
                </div>
                
                <p className="text-zinc-300 leading-relaxed bg-black/50 p-2.5 rounded-xl border border-white/5 text-[11px]">
                  &ldquo;{selectedBooking.clientAccessNotes}&rdquo;
                </p>

                <div className="space-y-1.5 pt-1 text-[11px] text-zinc-400">
                  <p className="flex items-start gap-1.5">
                    <Truck size={13} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span><strong>Aparcamiento:</strong> {selectedBooking.parkingInstructions}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <Phone size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Contacto en Finca:</strong> {selectedBooking.clientContactPerson} ({selectedBooking.clientContactPhone})</span>
                  </p>
                </div>
              </div>

              {/* 📊 SECCIÓN 3: MÉTRICAS Y LOGÍSTICA S-CLASS */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px] bg-black/60 p-3 rounded-2xl border border-white/5">
                <div>
                  <span className="text-zinc-500 block uppercase">Distancia Base:</span>
                  <strong className="text-[#00E5FF]">{selectedBooking.distanceFromPlazaElipticaKm} km</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">ETA Estimado:</span>
                  <strong className="text-amber-300">{Math.floor(selectedBooking.distanceFromPlazaElipticaKm * 1.4)} min</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Pax / Invitados:</span>
                  <strong className="text-white">{selectedBooking.pax} personas</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Potencia 12W/Pax:</span>
                  <strong className="text-emerald-400">{selectedBooking.acousticWatts} W RMS</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Tarifa con IVA:</span>
                  <strong className="text-white">{selectedBooking.totalGrossPrice} €</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Split Artista 80%:</span>
                  <strong className="text-[#ecb613]">{Math.round(selectedBooking.basePrice * 0.8)} €</strong>
                </div>
              </div>

              {/* Botón Navegar en Google Maps Real */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${selectedBooking.lat},${selectedBooking.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all border border-white/15 cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Abrir Ruta en Google Maps App</span>
              </a>

            </div>
          </div>
        )}

      </div>

      {/* 🏷️ LEYENDA INFERIOR S-CLASS */}
      <div className="p-4 border-t border-white/10 bg-black/90 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-zinc-400">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00E5FF] border-2 border-white shadow-[0_0_10px_#00E5FF]" />
            <span className="text-white font-bold">Base: Plaza Elíptica</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00E5FF] border border-white" />
            <span>Punto Señas de Acceso (Cliente)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border border-[#ecb613]" />
            <span>Vehículo Mariachi en Ruta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300 shadow-[0_0_8px_#ef4444]" />
            <span className="text-rose-300 font-bold">Relevo Cascada Uber</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-zinc-500">Cartografía:</span>{' '}
          <strong className="text-white">Google Maps HD Architecture • Leaflet Engine</strong>
        </div>
      </div>

    </div>
  );
}

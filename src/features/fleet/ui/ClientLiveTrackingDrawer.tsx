"use client";

import React, { useState } from 'react';
import { 
  Phone, MessageSquare, MapPin, Navigation, 
  ShieldCheck, Truck, Clock, ExternalLink, Key, CheckCircle2, ChevronRight
} from 'lucide-react';

export interface ClientLiveTrackingData {
  bookingId: string;
  clientName: string;
  venueName: string;
  venueAddress: string;
  destinationCoords: { lat: number; lng: number };
  originPointName: string;
  originCoords: { lat: number; lng: number };
  currentLocationCoords: { lat: number; lng: number };
  assignedProviderName: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  currentStatus: 'EN_ORIGEN' | 'EN_TRANSITO' | 'EN_DESTINO' | 'COMPLETADO';
  etaMinutes: number;
  speedKmh: number;
  depositStripeConfirmed: boolean;
  clientAccessNotes: string;
}

interface ClientLiveTrackingDrawerProps {
  data: ClientLiveTrackingData;
  onClose?: () => void;
}

export function ClientLiveTrackingDrawer({ data, onClose }: ClientLiveTrackingDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-md bg-[#0a0a14]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-4 text-white font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h3 className="font-syne font-bold uppercase text-sm text-white">
            Seguimiento de Convoy en Vivo
          </h3>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xs bg-white/5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sello de Fianza Stripe */}
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-3 py-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <ShieldCheck size={14} />
          <span>RESERVA Y CONVOY CONFIRMADO</span>
        </div>
        <span className="text-zinc-400 text-[9px]">Fianza 100€ Stripe OK</span>
      </div>

      {/* Ficha del Destino */}
      <div className="space-y-1">
        <span className="text-[9px] uppercase text-[#ecb613] tracking-widest block">Destino Oficial:</span>
        <h4 className="font-syne font-black text-base text-white">{data.venueName}</h4>
        <p className="text-[11px] text-zinc-400 flex items-start gap-1">
          <MapPin size={12} className="text-rose-400 shrink-0 mt-0.5" />
          <span>{data.venueAddress}</span>
        </p>
      </div>

      {/* Métricas de Velocidad y ETA */}
      <div className="grid grid-cols-2 gap-2 bg-black/60 p-3 rounded-2xl border border-white/5 text-xs">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase block">Tiempo Estimado:</span>
          <strong className="text-xl text-amber-300 font-bold flex items-center gap-1">
            <Clock size={16} /> {data.etaMinutes} min
          </strong>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 uppercase block">Velocidad Tránsito:</span>
          <strong className="text-xl text-[#00E5FF] font-bold">
            {data.speedKmh} <span className="text-xs font-normal text-zinc-400">km/h</span>
          </strong>
        </div>
      </div>

      {/* Contacto Directo con el Conductor / Músico */}
      <div className="p-3.5 rounded-2xl bg-black/80 border border-emerald-500/20 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span>Vehículo Asignado:</span>
          <strong className="text-white">{data.vehiclePlate} ({data.vehicleModel})</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-white">{data.driverName}</span>
          <span className="text-[10px] text-emerald-400 font-bold">Conductor / Jefe Convoy</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={`tel:${data.driverPhone}`}
            className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-syne font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Phone size={13} />
            <span>Llamar Cabina</span>
          </a>

          <a
            href={`https://wa.me/${data.driverPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(data.driverName)}%2C%20seguimiento%20en%20vivo%20para%20${encodeURIComponent(data.venueName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-syne font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <MessageSquare size={13} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Señas de acceso confirmadas */}
      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1 text-[10px] text-zinc-400">
        <div className="flex items-center gap-1 text-[#00E5FF] font-bold">
          <Key size={12} />
          <span>Tus Señas de Acceso al Recinto:</span>
        </div>
        <p className="text-zinc-300 italic leading-snug">
          &ldquo;{data.clientAccessNotes}&rdquo;
        </p>
      </div>

      {/* Botón Ver en Google Maps */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&origin=${data.originCoords.lat},${data.originCoords.lng}&destination=${data.destinationCoords.lat},${data.destinationCoords.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10"
      >
        <ExternalLink size={13} />
        <span>Abrir Ruta Completa en Google Maps</span>
      </a>
    </div>
  );
}

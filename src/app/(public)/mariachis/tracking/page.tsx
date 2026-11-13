import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sala de Control y Radar en Vivo | Productora EAR",
  description: "Seguimiento en tiempo real de tu mariachi o artista contratado. Estado de ruta, contacto directo y confirmación de llegada.",
};

interface TrackingPageProps {
  searchParams: Promise<{ lead?: string }>;
}

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;
  const leadId = params.lead || "LEAD-DEMO";

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Encabezado y Navegación */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <Link 
            href="/mariachis/precios" 
            className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider"
          >
            ← Volver al Cotizador
          </Link>
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-widest animate-pulse">
            ● Radar Activo en Vivo
          </span>
        </div>

        {/* Tarjeta Principal de Estado */}
        <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Expediente de Despacho Oficial
              </span>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1">
                Sala de Control y Seguimiento
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Identificador: <span className="text-amber-400 font-bold">{leadId}</span>
              </p>
            </div>
            <div className="bg-zinc-900/80 px-4 py-2.5 rounded-2xl border border-zinc-800 text-right">
              <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Estado de Asignación</span>
              <span className="text-xs md:text-sm font-black text-emerald-400">Reserva Asegurada • En Ruta</span>
            </div>
          </div>

          {/* Radar Visual Simulado / Enlace GPS */}
          <div className="w-full h-56 md:h-64 rounded-2xl bg-zinc-900 border border-zinc-800 relative flex flex-col items-center justify-center text-center p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-2xl relative z-10 mb-3 animate-ping" />
            <div className="text-2xl absolute z-20">📍</div>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider relative z-10">
              Coordinando Ruta y Llegada al Recinto
            </p>
            <p className="text-[11px] text-zinc-400 max-w-sm mt-1 relative z-10">
              El artista y equipo de Productora EAR tienen confirmada tu dirección y señas de acceso. La telemetría en tiempo real se activa automáticamente antes del show.
            </p>
          </div>

          {/* Línea de Tiempo del Show */}
          <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">1. Reserva</span>
              <span className="text-xs font-semibold text-emerald-400">✓ Fecha y Fianza Bloqueada</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">2. En Ruta</span>
              <span className="text-xs font-semibold text-amber-400">● Desplazamiento y Señas</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">3. Llegada al Recinto</span>
              <span className="text-xs font-semibold text-zinc-400">○ Liquidación in Situ (50%)</span>
            </div>
          </div>

          {/* Botón WhatsApp de Contacto Central */}
          <div className="mt-6 text-center">
            <a
              href="[suspicious link removed]{leadId}"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-400 transition shadow-lg"
            >
              <span>💬 Contactar con la Central de Despacho (WhatsApp)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

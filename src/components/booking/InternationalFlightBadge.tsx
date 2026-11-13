"use client";

import React from "react";
import { calculateTourPricing } from "@/lib/geo/flightLogistics";

interface Props {
  cityKey?: string;
  artistName?: string;
  musicianCount?: number;
  eventDate?: string;
}

export default function InternationalFlightBadge({
  cityKey = "bruselas",
  artistName = "Edwin Agudelo",
  musicianCount = 1,
  eventDate = "2026-11-28",
}: Props) {
  const data = calculateTourPricing(musicianCount, cityKey, eventDate);
  const { hub, totalArtisticFee, totalViaticos, grandTotal, depositToPayNow, googleFlightsUrl } = data;

  return (
    <div className="my-6 p-6 rounded-3xl bg-zinc-950 border border-amber-500/40 text-white shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-5">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
            ✈️ Despacho Aéreo Internacional Oficial
          </span>
          <h2 className="text-lg md:text-xl font-bold mt-2 text-white">
            Gira y Vuelos a {hub.city} ({hub.country})
          </h2>
          <p className="text-xs text-zinc-400">
            {artistName} {musicianCount > 1 ? `+ Ensamble (${musicianCount} músicos)` : "Solista de Gala"}
          </p>
        </div>
        <div className="md:text-right bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Presupuesto Cerrado Todo Incluido</span>
          <span className="text-2xl font-black text-amber-400">{grandTotal} €</span>
          <span className="text-[10px] text-zinc-500 block">Anticipo en Custodia Stripe (50%): {depositToPayNow} €</span>
        </div>
      </div>

      {/* Tarjetas del Itinerario y Desglose */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-5">
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-zinc-500 block font-bold text-[10px] uppercase">Ruta de Vuelo I/V</span>
          <span className="font-bold text-white text-sm">MAD ➔ {hub.airportCode}</span>
          <p className="text-[11px] text-zinc-400 mt-1">Con equipaje de gala charra e instrumentos</p>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-zinc-500 block font-bold text-[10px] uppercase">Honorarios e Invariables</span>
          <span className="font-bold text-amber-300 text-sm">{totalArtisticFee} € Honorarios</span>
          <p className="text-[11px] text-zinc-400 mt-1">+{totalViaticos} € (Vuelos, Hotel Individual y Dietas)</p>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-zinc-500 block font-bold text-[10px] uppercase">Alojamiento Digno</span>
          <span className="font-bold text-emerald-400 text-sm">Camas Individuales</span>
          <p className="text-[11px] text-zinc-400 mt-1">Llegada y presencia 2h antes al recinto</p>
        </div>
      </div>

      {/* Botones de Acción: Google Flights + Bloqueo Stripe */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <a
          href={googleFlightsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-wider border border-zinc-700 transition inline-flex items-center justify-center gap-2"
        >
          <span>🛫 Ver Vuelos Coordinados en Google Flights</span>
          <span className="text-[10px] text-zinc-400 font-normal">↗</span>
        </a>

        <a
          href={`[suspicious link removed]${hub.city.toLowerCase()}&temp=hot`}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs tracking-wider hover:from-amber-300 hover:to-amber-400 transition shadow-xl text-center"
        >
          Bloquear Fecha con Fianza Stripe ({depositToPayNow} €)
        </a>
      </div>

      {/* Protocolo de Validación WhatsApp */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2">
        <span>💬</span>
        <span>
          <strong>Protocolo de Despacho Inmediato:</strong> Al pagar la fianza, la propuesta se envía con 1 clic al WhatsApp de Edwin Agudelo para confirmación en menos de 60 minutos antes de emitir pasajes.
        </span>
      </div>
    </div>
  );
}
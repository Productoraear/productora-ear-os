"use client";

import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Radio,
  Fuel,
  Hotel,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const VEHICLES = [
  {
    id: "FLEET-01",
    name: "Furgo Máster L2H2 // Sonido & Luz",
    driver: "Edwin Agudelo",
    status: "EN BASE",
    location: "Méntrida (Toledo)",
    equipment: "Bose F1 812 (2x) + Bose S1 Pro (2x) + Shure Beta 87A",
    dest: "Sin ruta asignada hoy"
  },
  {
    id: "FLEET-02",
    name: "Unidad Móvil VIMUME Silver",
    driver: "Técnico Certificado VIMUME",
    status: "EN RUTA",
    location: "A-5 km 28 sentido Madrid",
    equipment: "Sistema Neuroacústico Terapéutico < 75 dB SPL",
    dest: "Residencia Los Nogales (Madrid)"
  },
  {
    id: "FLEET-03",
    name: "Convoy Mariachi Monumental",
    driver: "Jefe de Banda",
    status: "EN RUTA",
    location: "Toledo Centro",
    equipment: "Instrumental Completo + Microfonía Inalámbrica",
    dest: "Cigarral del Ángel (Toledo)"
  }
];

export default function FlotaAdminPage() {
  const [km, setKm] = useState<number>(85);
  const [endHour, setEndHour] = useState<number>(23);

  // Reglas de negocio inmutables
  const baseKmFree = 50;
  const billableKm = Math.max(0, km - baseKmFree);
  const kmCost = billableKm * 1.50;
  const needsHotel = km > 200 || endHour >= 3;
  const hotelCost = needsHotel ? 120 : 0;
  const totalLogistics = kmCost + hotelCost;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#ecb613]" />
            Control Operativo S-Class
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Flota & Logística en Vivo
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Seguimiento de convoyes en tiempo real y motor de logística Méntrida Km 0 (1,50 €/km & hotel).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          3 Unidades Conectadas
        </div>
      </div>

      {/* Calculadora de Logística Méntrida Km 0 */}
      <div className="p-6 rounded-2xl bg-[#050508] border border-[#1a1a24] space-y-4">
        <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Fuel className="w-4 h-4 text-[#ecb613]" />
          Simulador de Sobrecoste Logístico Méntrida Km 0
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Distancia Total (km ida y vuelta)</label>
            <input
              type="number"
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#ecb613]/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Hora Estimada de Fin</label>
            <input
              type="number"
              min={0}
              max={23}
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#ecb613]/50"
            />
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 font-mono">RECARGO POR KM (&gt;50 KM)</span>
            <span className="text-base font-bold text-white font-mono">{kmCost.toFixed(2)} €</span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 font-mono">SUPLEMENTO HOTEL (&gt;200KM O &gt;3AM)</span>
            <span className="text-base font-bold text-[#ecb613] font-mono">{hotelCost.toFixed(2)} €</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">Total Recargo Logístico Automático:</span>
          <span className="text-emerald-400 font-bold text-sm">{totalLogistics.toFixed(2)} €</span>
        </div>
      </div>

      {/* Grid de Vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VEHICLES.map((v) => (
          <div key={v.id} className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-zinc-500">{v.id}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{v.name}</h3>
              </div>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                  v.status === 'EN RUTA'
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                {v.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-400 font-sans">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>{v.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Destino: <strong className="text-white">{v.dest}</strong></span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-400 font-mono">
              <div className="text-zinc-500 text-[9px] uppercase tracking-wider mb-1">RIDER ACÚSTICO CARGADO</div>
              {v.equipment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  AlertCircle,
  TrendingUp,
  DollarSign,
  Compass,
  Package,
  Layers,
  Lock,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { INITIAL_INVENTORY, InventoryEngine, InventoryItem } from '@/lib/constants/inventory-catalog';

const VEHICLES = [
  {
    id: "FLEET-01",
    name: "Furgo Máster L2H2 // Sonido & Luz",
    driver: "Edwin Agudelo",
    status: "EN BASE",
    location: "Méntrida (Toledo)",
    equipment: "Bose F1 812 (2x) + Bose S1 Pro (2x) + Shure Beta 87A",
    dest: "Base Central Méntrida"
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

export default function FlotaAdminCatminPage() {
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Operaciones</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Flota & Logística Méntrida</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Logística S-Class // Méntrida Km 0
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#ecb613]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Centro Logístico Méntrida (Toledo)</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI DE LOGÍSTICA                          */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Tarifa Portes S-Class</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">1,50 €/km</div>
          <p className="text-[11px] text-zinc-400 mt-1">A partir de los primeros 50 km</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Primeros 50 km Exentos
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Regla Suplemento Hotel</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Hotel className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">+120,00 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Si fin &gt;= 3:00 AM o &gt; 200 km</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Descanso del Artista Garantizado
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Unidades en Flota</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">3 Unidades</div>
          <p className="text-[11px] text-zinc-400 mt-1">Equipadas con rider Bose F1 y S1 Pro</p>
          <div className="mt-2 flex items-center text-xs font-mono text-[#ecb613] font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            100% Operativas
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Radio de Cobertura</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Compass className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">Nacional</div>
          <p className="text-[11px] text-zinc-400 mt-1">Madrid, Toledo, Guadalajara, Ávila</p>
          <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Respuesta &lt; 2h
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. CALCULADORA DINÁMICA & ESTADO DE UNIDADES EN RUTA                  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Calculadora (Span 6) */}
        <div className="lg:col-span-6 rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 space-y-5 shadow-sm">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Calculadora Oficial de Portes y Dietas
            </h2>
            <p className="text-xs text-zinc-500">Cálculo instantáneo según la distancia desde Méntrida Km 0</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-300 font-bold">Distancia del Evento (Solo Ida):</span>
                <span className="text-xl font-black text-[#ecb613]">{km} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="350"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>0 km (Méntrida)</span>
                <span>50 km (Exento)</span>
                <span>200 km (+Hotel)</span>
                <span>350 km</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-900">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-300 font-bold">Hora Prevista de Fin del Show:</span>
                <span className="text-base font-bold text-white">{endHour}:00 h</span>
              </div>
              <input
                type="range"
                min="18"
                max="29"
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>18:00</span>
                <span>23:00</span>
                <span>03:00 (Suplemento Hotel)</span>
                <span>05:00</span>
              </div>
            </div>
          </div>

          {/* Desglose de Gastos */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Kilómetros facturables ({billableKm} km):</span>
              <span>{kmCost.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Suplemento hotel y dietas:</span>
              <span className={needsHotel ? 'text-amber-400 font-bold' : 'text-zinc-600'}>
                {hotelCost.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between text-[#ecb613] pt-2 border-t border-zinc-900 font-bold text-sm">
              <span>TOTAL LOGÍSTICA:</span>
              <span>{totalLogistics.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Unidades en Ruta (Span 6) */}
        <div className="lg:col-span-6 rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 space-y-4 shadow-sm">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Estado de la Flota en Vivo
            </h2>
            <p className="text-xs text-zinc-500">Localización GPS y carga acústica asignada</p>
          </div>

          <div className="space-y-3">
            {VEHICLES.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#ecb613] font-bold bg-[#ecb613]/10 px-1.5 py-0.5 rounded border border-[#ecb613]/20">
                      {v.id}
                    </span>
                    <span className="text-xs font-bold text-white">{v.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                    v.status === 'EN BASE'
                      ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{v.location}</span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-zinc-200">{v.dest}</span>
                </div>

                <div className="text-[10px] text-zinc-500 border-t border-zinc-900 pt-1.5">
                  Rider: {v.equipment}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 4. INVENTARIO S-CLASS DE EQUIPOS & CONTROL DE FIANZAS (50% MÍNIMO)  */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20">
              <Package className="w-5 h-5 text-[#ecb613]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#ecb613] uppercase tracking-wider">
                  Arsenal Técnico Productora EAR
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  Fianza Obligatoria: 50% Mínimo
                </span>
              </div>
              <h3 className="text-lg font-bold font-syne text-white uppercase tracking-tight">
                Control de Stock, Alquileres y Fianzas Stripe
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/alquiler"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Cotizador Público /alquiler</span>
            </Link>
          </div>
        </div>

        {/* TABLA DE INVENTARIO Y FIANZAS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 pr-4">Categoría</th>
                <th className="pb-3 pr-4">Equipo / Marca</th>
                <th className="pb-3 pr-4 text-center">Stock Total</th>
                <th className="pb-3 pr-4 text-center">Disponible</th>
                <th className="pb-3 pr-4 text-right">Tarifa / Día</th>
                <th className="pb-3 text-right">Fianza Exigida (50% Mín)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {INITIAL_INVENTORY.map((item) => {
                const available = InventoryEngine.getAvailableStock(item.id);
                const fianzaMinima = Math.max(50, Math.round(item.dailyPrice * 0.5));
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 text-[10px] border border-zinc-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">{item.brand} • {item.description.slice(0, 60)}...</div>
                    </td>
                    <td className="py-3 pr-4 text-center text-zinc-400">
                      {item.totalStock} uds.
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        available > 2 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : available > 0
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {available} uds.
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-bold text-white">
                      {item.dailyPrice},00 €
                    </td>
                    <td className="py-3 text-right font-bold text-[#ecb613]">
                      {fianzaMinima},00 €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 text-zinc-400 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Fianza calculada al 50% del valor del alquiler diario con retención bancaria en Stripe y devolución en 48h tras revisión.</span>
          </span>
          <span className="font-mono text-[11px] text-[#ecb613] font-bold">
            Total Activos Catalogados: {INITIAL_INVENTORY.length} equipos
          </span>
        </div>
      </div>

    </div>
  );
}

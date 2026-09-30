'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Crown,
  Tag,
  Inbox,
  Calculator,
  CalendarDays
} from 'lucide-react';
import { calculateEdwinAgudeloQuoteAction } from '@/app/actions/vendorActions';

export default function VendorDashboard() {
  const [distanceKm, setDistanceKm] = useState<number>(60);
  const [endTimeHour, setEndTimeHour] = useState<number>(2);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  const [manualLogisticsFee, setManualLogisticsFee] = useState<number>(50);
  const [quote, setQuote] = useState<any>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await calculateEdwinAgudeloQuoteAction({
      distanceKm,
      endTimeHour,
      isManualOverride,
      manualLogisticsFee
    });
    setQuote(res);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* Header con Badge de Estado */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
            <Crown size={12} />
            <span>Proveedor Piloto Homologado · Edwin Agudelo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
            Panel de Control de Proveedor S-Class
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Gestión integral de cotización de logística (0,75€/km), ofertas destacadas e inbox de solicitudes.
          </p>
        </div>

        <Link
          href="/artistas/edwin-agudelo"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold rounded-2xl transition-all self-start sm:self-auto"
        >
          <span>Ver Ficha Pública</span>
          <ArrowRight size={14} className="text-[#ecb613]" />
        </Link>
      </header>

      {/* Grid de Accesos Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <Link href="/vendor/inbox" className="p-5 rounded-3xl bg-[#09090d]/80 border border-blue-500/30 hover:border-blue-500/60 transition-all flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <Inbox size={20} />
            </div>
            <div>
              <span className="font-bold text-white block">Bandeja de Leads</span>
              <span className="text-[10px] text-zinc-400 font-light">3 Solicitudes Nuevas</span>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link href="/vendor/promociones" className="p-5 rounded-3xl bg-[#09090d]/80 border border-amber-500/30 hover:border-amber-500/60 transition-all flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Tag size={20} />
            </div>
            <div>
              <span className="font-bold text-white block">Ofertas & Regalos</span>
              <span className="text-[10px] text-zinc-400 font-light">2 Promociones Activas</span>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-500 group-hover:text-amber-400 transition-colors" />
        </Link>

        <Link href="/vendor/calendar" className="p-5 rounded-3xl bg-[#09090d]/80 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <CalendarDays size={20} />
            </div>
            <div>
              <span className="font-bold text-white block">Calendario iCal</span>
              <span className="text-[10px] text-zinc-400 font-light">Price-Lock 100€ Activo</span>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>

      {/* CALCULADORA DE PRESUPUESTO Y LOGÍSTICA PARA EDWIN AGUDELO */}
      <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-[#ecb613]" />
            <h3 className="text-lg font-bold font-syne text-white">Calculadora Logística SSOT (Edwin Agudelo)</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
            Hub Méntrida km 0 · 0,75€/km
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div>
            <label className="block text-zinc-400 mb-2 font-bold uppercase">Distancia desde Méntrida (KM)</label>
            <input
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              required
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-2 font-bold uppercase">Hora Prevista de Finalización</label>
            <select
              value={endTimeHour}
              onChange={(e) => setEndTimeHour(Number(e.target.value))}
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-3.5 text-white focus:outline-none focus:border-[#ecb613]"
            >
              <option value={1}>01:00 AM</option>
              <option value={2}>02:00 AM</option>
              <option value={3}>03:00 AM (+120€ Hotel)</option>
              <option value={4}>04:00 AM (+120€ Hotel)</option>
              <option value={23}>23:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-2 font-bold uppercase">Ajuste Manual Excepcional</label>
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => setIsManualOverride(!isManualOverride)}
                className={`px-3 py-2 rounded-xl border text-[11px] font-bold ${isManualOverride ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
              >
                {isManualOverride ? 'Manual ON' : 'Auto (0,75€/km)'}
              </button>
              {isManualOverride && (
                <input
                  type="number"
                  value={manualLogisticsFee}
                  onChange={(e) => setManualLogisticsFee(Number(e.target.value))}
                  placeholder="Suplemento €"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2 text-white"
                />
              )}
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shadow-lg shadow-amber-950/40"
            >
              Calcular Presupuesto Completo
            </button>
          </div>
        </form>

        {quote && (
          <div className="mt-6 p-6 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Caché Base</span>
                <span className="text-xl font-bold text-white">{quote.basePrice.toFixed(2)} €</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Desplazamiento / Hotel</span>
                <span className="text-xl font-bold text-amber-300">{quote.logisticsTotal.toFixed(2)} €</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Total Evento</span>
                <span className="text-2xl font-black text-[#ecb613]">{quote.grandTotal.toFixed(2)} €</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Reserva Price-Lock</span>
                <span className="text-xl font-bold text-emerald-400">100,00 €</span>
              </div>
            </div>

            {/* Split 80/10/10 */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center pt-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-400 block">80% Net (Edwin)</span>
                <span className="text-white font-bold text-xs">{quote.split.artistShare.toFixed(2)} €</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-400 block">10% EAR Infra</span>
                <span className="text-white font-bold text-xs">{quote.split.earInfrastructureShare.toFixed(2)} €</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-purple-300 block">10% VIMUME RSC</span>
                <span className="text-purple-300 font-bold text-xs">{quote.split.vimumeSocialShare.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

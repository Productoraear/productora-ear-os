'use client';

import React, { useState } from 'react';
import { createCheckoutSession } from '@/lib/payments';
import { CouponBono150Complementos } from '@/components/promotions/CouponBono150Complementos';
import { Sparkles, MapPin, Calendar, ShieldCheck } from 'lucide-react';

interface BookingCalculatorProps {
  baseFare?: number;
  distanceFromMadrid?: number;
  eventEndTime?: string;
}

const BookingCalculator = ({ 
  baseFare = 350, 
  distanceFromMadrid = 0, 
  eventEndTime = '' 
}: BookingCalculatorProps) => {
  const [distance, setDistance] = useState(distanceFromMadrid);
  const [endTime, setEndTime] = useState(eventEndTime);
  const [selectedFormat, setSelectedFormat] = useState<'SOLISTA' | 'QUINTETO'>('SOLISTA');

  const currentBase = selectedFormat === 'SOLISTA' ? 350 : 750;

  const calculateTotal = () => {
    let total = currentBase;
    total += distance * 0.75; // Tarifa oficial 0.75 €/km
    if (distance > 200 && endTime && new Date(endTime).getHours() > 22) {
      total += 150; // Hospedaje
    }
    return Math.round(total);
  };

  const handleReservation = async () => {
    const totalFare = calculateTotal();
    try {
      await createCheckoutSession({ 
        amount: totalFare, 
        concept: selectedFormat === 'SOLISTA' 
          ? 'Edwin Agudelo · Solista Premium S-Class' 
          : 'Edwin Agudelo · Quinteto Pro Mariachi (Mínimo 5 Músicos)' 
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="bg-[#0a0a0f] text-white p-6 sm:p-8 rounded-3xl border border-[#ecb613]/30 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">COTIZADOR EN TIEMPO REAL</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">Calculadora de Reserva S-Class</h2>
        </div>
        <div className="p-2 rounded-xl bg-[#ecb613]/10 text-[#ecb613]">
          <ShieldCheck size={24} />
        </div>
      </div>

      {/* Selector de Formato */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedFormat('SOLISTA')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedFormat === 'SOLISTA'
              ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-lg'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-[10px] font-mono text-[#ecb613] uppercase block font-bold">PRODUCTO HERO</span>
          <span className="text-base font-black uppercase block">Solista Premium</span>
          <span className="text-xs text-white/50">350 € Base · Cumpleaños & Fechas</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedFormat('QUINTETO')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedFormat === 'QUINTETO'
              ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-lg'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">MÍNIMO 5 MÚSICOS</span>
          <span className="text-base font-black uppercase block">Quinteto Pro</span>
          <span className="text-xs text-white/50">750 € Base · Bodas & Galas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="distance" className="block text-xs font-mono text-white/60 uppercase mb-2">
            Distancia desde Madrid (km):
          </label>
          <input
            type="number"
            id="distance"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-[#ecb613] focus:outline-none"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-xs font-mono text-white/60 uppercase mb-2">
            Hora de finalización:
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-[#ecb613] focus:outline-none"
          />
        </div>
      </div>

      {/* Desglose */}
      <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 text-xs font-mono">
        <div className="flex justify-between text-white/70">
          <span>Tarifa Base Oficial ({selectedFormat === 'SOLISTA' ? 'Solista Premium' : 'Quinteto Pro'}):</span>
          <span className="text-white font-bold">{currentBase} €</span>
        </div>
        <div className="flex justify-between text-white/70">
          <span>Desplazamiento ({distance} km x 0,75 €/km):</span>
          <span className="text-white font-bold">{Math.round(distance * 0.75)} €</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-white/10 text-white font-bold">
          <span>Total Estimado con Garantía 0 Fallos:</span>
          <span className="text-[#ecb613] text-xl">{calculateTotal()} €</span>
        </div>
      </div>

      {/* Cupón 150€ si es Solista */}
      {selectedFormat === 'SOLISTA' && (
        <CouponBono150Complementos />
      )}

      <button
        type="button"
        onClick={handleReservation}
        className="w-full py-4 rounded-2xl bg-[#ecb613] hover:bg-[#d9a50f] text-black font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#ecb613]/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles size={18} />
        <span>Reservar con Stripe ({calculateTotal()} €)</span>
      </button>
    </div>
  );
};

export default BookingCalculator;
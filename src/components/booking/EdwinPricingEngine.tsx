'use client';
import React, { useState } from 'react';
import { Calculator, MapPin, CheckCircle2 } from 'lucide-react';

export function EdwinPricingEngine() {
  const [format, setFormat] = useState<'solista' | 'quinteto'>('solista');
  const [distance, setDistance] = useState<number>(0);

  // Lógica Matemática de Tarifas
  const basePrice = format === 'solista' ? 350 : 550;
  
  const calculateDisplacement = () => {
    if (distance <= 50) return 0; // Madrid Centro y aledaños
    const musicians = format === 'solista' ? 1 : 5;
    // Lógica escalonada de coste marginal por músico en desplazamiento exterior
    if (distance > 50 && distance <= 150) return musicians * 90;
    if (distance > 150 && distance <= 300) return musicians * 120;
    return musicians * 150; // > 300km
  };

  const total = basePrice + calculateDisplacement();

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl">
      <h3 className="text-xl font-fraunces font-black mb-6 uppercase text-[#ecb613] flex items-center gap-2">
        <Calculator size={20}/> Cotización Instantánea
      </h3>
      
      {/* Selector de Formato */}
      <div className="space-y-4 mb-6">
        <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Formato del Espectáculo</label>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setFormat('solista')}
            className={`p-4 rounded-xl border text-left transition-all ${format === 'solista' ? 'bg-[#ecb613]/10 border-[#ecb613] text-white' : 'bg-black/50 border-white/10 text-white/50'}`}
          >
            <span className="block font-bold mb-1">Solista Premium</span>
            <span className="text-xs">350€ Base</span>
          </button>
          <button 
            onClick={() => setFormat('quinteto')}
            className={`p-4 rounded-xl border text-left transition-all ${format === 'quinteto' ? 'bg-[#ecb613]/10 border-[#ecb613] text-white' : 'bg-black/50 border-white/10 text-white/50'}`}
          >
            <span className="block font-bold mb-1">Grupo (5 Músicos)</span>
            <span className="text-xs">550€ Base</span>
          </button>
        </div>
      </div>

      {/* Selector de Distancia */}
      <div className="space-y-4 mb-8">
        <label className="text-xs text-white/50 uppercase tracking-wider font-bold flex justify-between">
          <span>Distancia desde Madrid</span>
          <span className="text-[#ecb613]">{distance} km</span>
        </label>
        <input 
          type="range" 
          min="0" max="500" step="10"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full accent-[#ecb613]"
        />
        <div className="flex items-start gap-2 text-[10px] text-white/40">
          <MapPin size={12} className="shrink-0 mt-0.5" />
          <p>Los primeros 50km están incluidos. A partir del km 51, se aplica tarifa de desplazamiento por músico.</p>
        </div>
      </div>

      {/* Resumen e Inclusiones */}
      <div className="bg-black/60 rounded-xl p-4 mb-6 border border-white/5">
        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
          <span className="text-sm font-bold text-white/70">Presupuesto Estimado</span>
          <span className="text-3xl font-black text-white">{total}€</span>
        </div>
        
        <ul className="space-y-2 text-xs text-white/60">
          <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-[#ecb613]"/> Equipo de Sonido Profesional</li>
          {format === 'solista' && (
            <>
              <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-[#ecb613]"/> Ramo de Flores Incluido</li>
              <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-[#ecb613]"/> Sombrero Charro (Sesión de fotos)</li>
              <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-[#ecb613]"/> Canción personalizada a elegir</li>
            </>
          )}
          {format === 'quinteto' && (
            <li className="flex gap-2 items-start text-white/40 italic mt-2">
              * Flores y sombrero fotográfico no incluidos en formato grupal salvo contratación extra.
            </li>
          )}
        </ul>
      </div>

      <button className="w-full py-4 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-sm rounded-xl transition-colors shadow-lg shadow-[#ecb613]/20">
        Bloquear Fecha
      </button>
    </div>
  );
}

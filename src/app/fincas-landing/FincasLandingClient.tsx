'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar, Music, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FincasLandingClient() {
  const [province, setProvince] = useState('madrid');
  const [guests, setGuests] = useState('100-200');

  const handleSearch = () => {
    window.location.href = '/fincas?province=' + province + '&guests=' + guests;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Garantía de Acústica & Sin Exclusividades Ocultas</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Encuentra la Finca Perfecta para tu Boda en <span className="text-amber-400">Madrid y Toledo</span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-10">
          Espacios exclusivos con presupuesto transparente, auditoría de sonido en vivo y libertad total de proveedores para el día más importante de tu vida.
        </p>

        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ubicación / Silo GEO</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
                <select 
                  value={province} 
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="madrid">Madrid (Fincas VIP)</option>
                  <option value="toledo">Toledo (Fincas con Encanto)</option>
                  <option value="guadalajara">Guadalajara (Espacios con Estancia)</option>
                </select>
              </div>
            </div>

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número de Invitados</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="50-100">50 - 100 invitados</option>
                  <option value="100-200">100 - 200 invitados</option>
                  <option value="200+">Más de 200 invitados</option>
                </select>
              </div>
            </div>

            <div className="text-left flex flex-col justify-end">
              <button 
                onClick={handleSearch}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Search className="w-5 h-5" />
                <span>Buscar Fincas</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Cero Comisiones Ocultas</h3>
                <p className="text-sm text-slate-400 mt-1">Desglose transparente del coste real del alquiler y servicios de la finca.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Acústica Auditada (Productora EAR)</h3>
                <p className="text-sm text-slate-400 mt-1">Garantía de montaje sonoro perfecto para música en vivo y DJ sin multas de sonido.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <ArrowRight className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Libertad de Catering</h3>
                <p className="text-sm text-slate-400 mt-1">Elige los proveedores que tú quieras sin penalizaciones contractuales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

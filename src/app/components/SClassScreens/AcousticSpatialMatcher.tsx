'use client';

import React, { useState, useEffect } from 'react';
import { 
  Speaker, 
  Mic2, 
  Sliders, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Lock, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Info,
  Maximize2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InventoryEngine, InventoryItem } from '@/lib/constants/inventory-catalog';

export const AcousticSpatialMatcher: React.FC = () => {
  const [m2, setM2] = useState<number>(20);
  const [pax, setPax] = useState<number>(25);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [eventDate, setEventDate] = useState<string>(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [catalog, setCatalog] = useState<InventoryItem[]>([]);
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);

  useEffect(() => {
    setCatalog(InventoryEngine.getCatalog());
  }, []);

  const recommendation = InventoryEngine.recommendGearForSpace(m2, pax);

  // Filter items by brand if selected
  const availableItems = catalog.filter(item => 
    selectedBrand === 'All' ? true : item.brand === selectedBrand
  );

  const handleReserve = async (item: InventoryItem) => {
    setIsReserving(true);
    setReservationMessage(null);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          units: 1,
          eventDate,
          customerEmail: 'cliente-vip@earos.com'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setReservationMessage(`✅ ${data.message}`);
        // Refresh catalog state
        setCatalog([...InventoryEngine.getCatalog()]);

        // Proceed to Stripe checkout for the 0.50€ deposit
        const payRes = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 0.50,
            concept: `Reserva Inventario: ${item.name} (${eventDate})`,
            metadata: {
              itemId: item.id,
              m2,
              pax,
              eventDate,
              deposit: 0.50
            }
          })
        });
        const payData = await payRes.json();
        if (payData.url) {
          window.location.href = payData.url;
        }
      } else {
        setReservationMessage(`❌ ${data.error || 'Stock no disponible'}`);
      }
    } catch (err: any) {
      setReservationMessage(`❌ Error de conexión: ${err.message}`);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="w-full bg-[#08080a] border border-[#ecb613]/30 rounded-[3rem] p-6 md:p-12 shadow-[0_0_50px_rgba(236,182,19,0.1)] space-y-10 text-white font-sans">
      
      {/* HEADER MATCHMAKER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> RECOMENDADOR ACÚSTICO & INVENTARIO ACTIVO
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
            Match Acústico <span className="text-[#ecb613] italic">Por Espacio</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl">
            Ajusta los metros cuadrados de tu salón o finca. El algoritmo calcula la presión sonora requerida (12 W/pax) y te asigna el equipamiento exacto disponible en inventario.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-5 py-3 rounded-2xl">
          <Calendar className="w-4 h-4 text-[#ecb613]" />
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">Fecha del Evento</span>
            <input 
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* CONTROLES ESPACIALES SLIDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/40 border border-white/5 p-6 md:p-8 rounded-[2rem]">
        
        {/* SLIDER 1: METROS CUADRADOS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#ecb613]" /> Superficie del Espacio (m²)
            </label>
            <span className="text-2xl font-black text-[#ecb613] font-mono">{m2} m²</span>
          </div>
          <input 
            type="range"
            min="15"
            max="600"
            step="5"
            value={m2}
            onChange={(e) => setM2(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>15 m² (Salón Íntimo)</span>
            <span>150 m² (Finca/Boda)</span>
            <span>600 m² (Concierto)</span>
          </div>
        </div>

        {/* SLIDER 2: AFORO DE PERSONAS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ecb613]" /> Asistentes / Aforo (PAX)
            </label>
            <span className="text-2xl font-black text-white font-mono">{pax} PAX</span>
          </div>
          <input 
            type="range"
            min="10"
            max="800"
            step="10"
            value={pax}
            onChange={(e) => setPax(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10 pax</span>
            <span>200 pax</span>
            <span>800 pax</span>
          </div>
        </div>
      </div>

      {/* SELECTOR DE MARCAS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold shrink-0">Filtrar por Marca:</span>
        {['All', 'Bose', 'L-Acoustics', 'JBL', 'Electro-Voice', 'Shure', 'Behringer', 'Chauvet', 'Cameo'].map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
              selectedBrand === brand 
                ? 'bg-[#ecb613] text-black shadow-md' 
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* RESULTADO DEL CÁLCULO & RECOMENDACIÓN MATCH */}
      <div className="bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-[#ecb613]/20 rounded-[2.5rem] p-6 md:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-black">Configuración Óptima Detectada</span>
            <h3 className="text-2xl md:text-4xl font-black mt-1 text-white">
              {recommendation.recommendedSoundPack.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#ecb613] shrink-0" />
              {recommendation.explanation}
            </p>
          </div>

          <div className="text-left lg:text-right bg-black/50 p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Presupuesto Sugerido Pack</span>
            <span className="text-3xl font-display font-black text-[#ecb613]">{recommendation.estimatedBasePrice} €</span>
            <span className="text-[9px] text-slate-400 block font-mono">Garantía Reserva: 0.50 €</span>
          </div>
        </div>

        {/* COMPONENTES INCLUIDOS EN EL MATCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* P.A. */}
          <div className="bg-black/60 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-[#ecb613]">
              <Speaker className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold uppercase bg-[#ecb613]/10 px-2 py-0.5 rounded">P.A. Principal</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">{recommendation.recommendedSoundPack.name}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">{recommendation.recommendedSoundPack.powerWatts}W RMS</p>
            </div>
            <div className="flex justify-between text-[10px] font-mono pt-2 border-t border-white/5">
              <span className="text-slate-500">Stock Disponible:</span>
              <span className="text-emerald-400 font-bold">
                {InventoryEngine.getAvailableStock(recommendation.recommendedSoundPack.id)} / 10
              </span>
            </div>
          </div>

          {/* MESAS */}
          <div className="bg-black/60 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-[#ecb613]">
              <Sliders className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold uppercase bg-[#ecb613]/10 px-2 py-0.5 rounded">Mezcla Digital</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">{recommendation.recommendedMixer.name}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">{recommendation.recommendedMixer.brand}</p>
            </div>
            <div className="flex justify-between text-[10px] font-mono pt-2 border-t border-white/5">
              <span className="text-slate-500">Stock Disponible:</span>
              <span className="text-emerald-400 font-bold">
                {InventoryEngine.getAvailableStock(recommendation.recommendedMixer.id)} / 10
              </span>
            </div>
          </div>

          {/* MICRÓFONOS */}
          <div className="bg-black/60 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-[#ecb613]">
              <Mic2 className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold uppercase bg-[#ecb613]/10 px-2 py-0.5 rounded">Microfonía RF</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">{recommendation.recommendedMics.name}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">{recommendation.recommendedMics.brand}</p>
            </div>
            <div className="flex justify-between text-[10px] font-mono pt-2 border-t border-white/5">
              <span className="text-slate-500">Stock Disponible:</span>
              <span className="text-emerald-400 font-bold">
                {InventoryEngine.getAvailableStock(recommendation.recommendedMics.id)} / 10
              </span>
            </div>
          </div>

          {/* ILUMINACIÓN */}
          <div className="bg-black/60 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-[#ecb613]">
              <Zap className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold uppercase bg-[#ecb613]/10 px-2 py-0.5 rounded">Iluminación</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">{recommendation.recommendedLighting.name}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">{recommendation.recommendedLighting.brand}</p>
            </div>
            <div className="flex justify-between text-[10px] font-mono pt-2 border-t border-white/5">
              <span className="text-slate-500">Stock Disponible:</span>
              <span className="text-emerald-400 font-bold">
                {InventoryEngine.getAvailableStock(recommendation.recommendedLighting.id)} / 10
              </span>
            </div>
          </div>

        </div>

        {/* BOTÓN DE RESERVA Y DESCUENTO DE STOCK */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          {reservationMessage && (
            <p className="text-xs font-mono font-bold text-slate-200">{reservationMessage}</p>
          )}

          <button
            onClick={() => handleReserve(recommendation.recommendedSoundPack)}
            disabled={isReserving || InventoryEngine.getAvailableStock(recommendation.recommendedSoundPack.id) === 0}
            className={`w-full sm:w-auto px-10 py-4 font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer ${
              InventoryEngine.getAvailableStock(recommendation.recommendedSoundPack.id) > 0
                ? 'bg-[#ecb613] hover:bg-[#d4a210] text-black shadow-[#ecb613]/20 active:scale-95'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Lock size={16} /> 
            {InventoryEngine.getAvailableStock(recommendation.recommendedSoundPack.id) > 0
              ? `Bloquear Fecha y Reservar Pack (0.50 € Garantía)`
              : 'Sin Stock para Esta Fecha'}
          </button>
        </div>
      </div>

      {/* CATÁLOGO DE INVENTARIO COMPLETO (10 UNIDADES POR ÍTEM) */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ecb613]" /> Catálogo de Inventario en Tiempo Real
          </h3>
          <span className="text-xs font-mono text-slate-400">10 Unidades Base / Ítem</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableItems.map((item) => {
            const available = InventoryEngine.getAvailableStock(item.id);
            return (
              <div 
                key={item.id}
                className="bg-black/50 border border-white/10 hover:border-[#ecb613]/40 p-6 rounded-3xl space-y-4 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-wider">{item.category}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded">{item.brand}</span>
                  </div>
                  <h4 className="font-bold text-base text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{item.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Tarifa Diaria:</span>
                    <span className="font-bold text-white text-sm">{item.dailyPrice} €/día</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Unidades Disponibles:</span>
                    <span className={`font-bold ${available > 2 ? 'text-emerald-400' : available > 0 ? 'text-amber-400' : 'text-red-500'}`}>
                      {available} / {item.totalStock} Unidades
                    </span>
                  </div>

                  {/* Stock Bar */}
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${available > 2 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${(available / item.totalStock) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={() => handleReserve(item)}
                    disabled={isReserving || available === 0}
                    className={`w-full py-2.5 font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      available > 0 
                        ? 'bg-white/10 hover:bg-[#ecb613] hover:text-black text-white' 
                        : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    {available > 0 ? 'Reservar Unidad (0.50 €)' : 'Agotado'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

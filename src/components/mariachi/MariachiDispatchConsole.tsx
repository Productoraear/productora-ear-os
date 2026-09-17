"use client";

import React, { useState, useMemo } from 'react';
import { 
  Users, MapPin, Clock, ShieldCheck, CreditCard, 
  ArrowRight, Sparkles, Navigation, CheckCircle2, MessageCircle
} from 'lucide-react';
import { 
  MARIACHI_FORMATS, 
  MARIACHI_DISPATCH_HUBS, 
  calculateMariachiQuote, 
  MariachiFormat,
  MariachiHubBase
} from '@/lib/mariachi/mariachiDispatchCore';
import MariachiRepertoireSelector from './MariachiRepertoireSelector';

// Destinos de referencia frecuentes para cotización rápida
const SAMPLE_DESTINATIONS = [
  { name: 'Madrid Centro (Gran Vía / Retiro)', lat: 40.4168, lng: -3.7038, province: 'Madrid' },
  { name: 'Toledo Casco Histórico / Cigarrales', lat: 39.8628, lng: -4.0273, province: 'Toledo' },
  { name: 'Pozuelo de Alarcón / La Finca', lat: 40.4357, lng: -3.8133, province: 'Madrid' },
  { name: 'Méntrida (Fincas y Viñedos)', lat: 40.2383, lng: -4.1956, province: 'Toledo' },
  { name: 'Guadalajara Capital', lat: 40.6327, lng: -3.1669, province: 'Guadalajara' },
  { name: 'Barcelona Pedralbes / Eixample', lat: 41.3851, lng: 2.1734, province: 'Barcelona' },
  { name: 'Valencia Ciudad de las Artes', lat: 39.4699, lng: -0.3763, province: 'Valencia' },
  { name: 'Sevilla Real Alcázar / Triana', lat: 37.3891, lng: -5.9845, province: 'Sevilla' },
  { name: 'Bilbao Guggenheim / Abando', lat: 43.263, lng: -2.935, province: 'Bizkaia' }
];

export default function MariachiDispatchConsole() {
  const [selectedFormatId, setSelectedFormatId] = useState<MariachiFormat['id']>('cuarteto');
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<number>(0);
  const [customDestinationName, setCustomDestinationName] = useState<string>('');
  const [endHour, setEndHour] = useState<number>(2); // 2:00 AM (sin hotel) vs 3:00 AM (con hotel)
  const [selectedHubId, setSelectedHubId] = useState<string>('madrid-eliptica');
  const [autoNearestHub, setAutoNearestHub] = useState<boolean>(true);
  const [selectedSongs, setSelectedSongs] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);

  const destination = SAMPLE_DESTINATIONS[selectedDestinationIndex];

  const quote = useMemo(() => {
    return calculateMariachiQuote(
      selectedFormatId,
      { lat: destination.lat, lng: destination.lng },
      customDestinationName.trim() || destination.name,
      endHour,
      autoNearestHub ? undefined : selectedHubId
    );
  }, [selectedFormatId, destination, customDestinationName, endHour, autoNearestHub, selectedHubId]);

  const handleToggleSong = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleStripeDeposit = () => {
    setIsProcessingStripe(true);
    // Simular enlace seguro a Stripe Checkout con Price-Lock inmutable de 100€
    setTimeout(() => {
      const whatsappText = encodeURIComponent(
        `¡Hola! Quiero confirmar la reserva de Mariachi con EAR OS.\n\n` +
        `• Formato: ${quote.format.name} (${quote.format.members} integrantes)\n` +
        `• Destino: ${quote.destinationName}\n` +
        `• Base Logística: ${quote.hub.name} (${quote.distanceKm} km)\n` +
        `• Total Estimado: ${quote.totalGrossPrice.toLocaleString('es-ES')} € (IVA incl.)\n` +
        `• Fianza Inmutable: 100,00 € Stripe\n` +
        `• Canciones elegidas: ${selectedSongs.length} temas\n\n` +
        `Deseo proceder al Price-Lock y llamada de verificación con el mariachi.`
      );
      window.open(`https://wa.me/34693693048?text=${whatsappText}`, '_blank');
      setIsProcessingStripe(false);
    }, 600);
  };

  return (
    <div className="space-y-10">
      {/* SECCIÓN 1: SELECCIÓN DE FORMATO */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-syne text-white uppercase tracking-tight">
              1. Elige el Formato de Mariachi
            </h2>
            <p className="text-xs text-white/50">Todos los formatos incluyen fianza inmutable de 100 €</p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-3 py-1 rounded-full border border-[#ecb613]/20">
            Split Soberano 80% al Músico
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARIACHI_FORMATS.map((fmt) => {
            const isSelected = selectedFormatId === fmt.id;
            return (
              <div
                key={fmt.id}
                onClick={() => setSelectedFormatId(fmt.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-xl shadow-[#ecb613]/10'
                    : 'bg-[#050508] border-white/10 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-[#ecb613]">
                    <Sparkles size={16} />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    {fmt.members} Integrantes
                  </span>
                  <h3 className="text-lg font-bold text-white font-syne mt-1">{fmt.name}</h3>
                  <div className="text-3xl font-black text-white font-mono mt-3">
                    {fmt.basePrice} €
                  </div>
                  <p className="text-xs text-white/60 mt-3 leading-relaxed">{fmt.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-white/40">{fmt.recommendedFor}</span>
                  <span className="font-mono text-[#ecb613] font-bold">Fianza 100€</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: LOGÍSTICA GEODÉSICA Y DESTINO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-[2rem] border border-white/10 bg-[#050508] p-6 md:p-8 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#00E5FF]">
              <Navigation size={14} />
              Motor Geodésico Multisede (Haversine SSOT)
            </div>
            <h3 className="text-xl font-bold text-white font-syne mt-1">
              2. Ubicación del Evento y Horario
            </h3>
            <p className="text-xs text-white/50">
              Cálculo de 1,50 €/km desde la sede más cercana (a partir del km 50) + suplemento nocturno
            </p>
          </div>

          {/* Selector de Destinos Muestra */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
              Destino Frecuente o Provincia
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_DESTINATIONS.map((dest, i) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => {
                    setSelectedDestinationIndex(i);
                    setCustomDestinationName('');
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer truncate ${
                    selectedDestinationIndex === i && !customDestinationName
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white font-bold'
                      : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MapPin size={12} className="inline mr-1 text-[#00E5FF]" />
                  {dest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Input de dirección exacta personalizada */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
              O escribe tu finca / dirección exacta
            </label>
            <input
              type="text"
              placeholder="Ej: Finca La Romanée, Griñón (Madrid)"
              value={customDestinationName}
              onChange={(e) => setCustomDestinationName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          {/* Opciones de Base Logística */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60 font-mono uppercase tracking-wider">
                Despacho Logístico Inteligente
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#00E5FF]">
                <input
                  type="checkbox"
                  checked={autoNearestHub}
                  onChange={(e) => setAutoNearestHub(e.target.checked)}
                  className="rounded accent-[#00E5FF]"
                />
                Auto-seleccionar Sede Más Cercana
              </label>
            </div>

            {!autoNearestHub && (
              <select
                value={selectedHubId}
                onChange={(e) => setSelectedHubId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs text-white focus:border-[#00E5FF] focus:outline-none font-mono"
              >
                {MARIACHI_DISPATCH_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} — {hub.city} ({hub.province})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selector de Hora de Fin (Hotel si >= 03:00) */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60 font-mono uppercase tracking-wider">
                Hora Estimada de Finalización
              </span>
              <span className="font-mono text-[#ecb613] font-bold">
                {endHour.toString().padStart(2, '0')}:00 {endHour >= 3 ? '(+120 € Hotel Nocturno)' : '(Sin recargo hotel)'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="w-full accent-[#ecb613]"
            />
            <div className="flex justify-between text-[10px] text-white/30 font-mono">
              <span>00:00 (Estándar)</span>
              <span>02:00</span>
              <span className="text-rose-400">03:00 (Límite Hotel)</span>
              <span>06:00 (Madrugada)</span>
            </div>
          </div>
        </div>

        {/* TICKET DE COTIZACIÓN Y PRICE-LOCK */}
        <div className="lg:col-span-5 rounded-[2rem] border border-[#ecb613]/30 bg-[#030305] p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
                  EAR OS TICKET OFICIAL
                </span>
                <h3 className="text-lg font-bold text-white font-syne">Desglose Transparente</h3>
              </div>
              <ShieldCheck size={24} className="text-[#ecb613]" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-white/70">
                <span>Formato Seleccionado:</span>
                <span className="text-white font-bold">{quote.format.name}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Tarifa Base del Músico:</span>
                <span className="text-white font-bold">{quote.basePrice.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Sede Origen Asignada:</span>
                <span className="text-[#00E5FF] font-bold">{quote.hub.city}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Distancia Calculada:</span>
                <span className="text-white font-bold">{quote.distanceKm} km</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Kilometraje Facturable (&gt;50km):</span>
                <span className="text-white">{quote.logistics.billableKm} km ({quote.logistics.kmCost} €)</span>
              </div>
              {quote.logistics.requiresLodging && (
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>Suplemento Hotel Nocturno:</span>
                  <span>+120 €</span>
                </div>
              )}
              <div className="flex justify-between text-white/70 pt-2 border-t border-white/5">
                <span>Subtotal Logística + Show:</span>
                <span className="text-white font-bold">{quote.subtotal.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>IVA 21%:</span>
                <span>{quote.vatAmount.toLocaleString('es-ES')} €</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[10px] text-white/40 uppercase font-mono tracking-widest">
                Precio Total Cerrado (Sin Sorpresas)
              </div>
              <div className="text-3xl font-black text-[#ecb613] font-mono">
                {quote.totalGrossPrice.toLocaleString('es-ES')} €
              </div>
              <div className="text-[11px] text-emerald-400 font-mono pt-1 flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                Fianza para Price-Lock: <strong>100,00 €</strong> (Resto a liquidar el día del evento)
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStripeDeposit}
              disabled={isProcessingStripe}
              className="w-full py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-black font-syne uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#ecb613]/20 cursor-pointer disabled:opacity-50"
            >
              <CreditCard size={18} />
              <span>{isProcessingStripe ? 'Conectando Stripe...' : 'Bloquear Fecha con Fianza de 100 €'}</span>
            </button>

            <p className="text-[10px] text-center text-white/40 leading-relaxed font-sans">
              Pago 100% seguro con Stripe. Tras el depósito, se asigna tu mariachi y recibes sus datos de contacto directo.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: REPERTORIO INTERACTIVO */}
      <div>
        <MariachiRepertoireSelector
          selectedSongIds={selectedSongs}
          maxSelectable={quote.format.repertoireCount}
          onToggleSong={handleToggleSong}
        />
      </div>
    </div>
  );
}
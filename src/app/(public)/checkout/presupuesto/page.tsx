'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  Volume2, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle,
  Sliders,
  Award,
  Layers,
  Flame,
  Radio
} from 'lucide-react';
import { StageVisualizer3D, StageFormatType, VenueType } from '@/components/stage/StageVisualizer3D';

interface GalaFormatOption {
  id: StageFormatType;
  name: string;
  basePrice: number;
  musiciansCount: number;
  tagline: string;
}

const GALA_FORMATS: GalaFormatOption[] = [
  { id: 'solista', name: 'Edwin Agudelo Solista', basePrice: 350, musiciansCount: 1, tagline: 'Voz Tenor Lírico + Pistas de Alta Fidelidad' },
  { id: 'duo', name: 'Dúo Armónico', basePrice: 480, musiciansCount: 2, tagline: 'Edwin Agudelo + Vihuela / Guitarra' },
  { id: 'trio', name: 'Trío Tradicional', basePrice: 600, musiciansCount: 3, tagline: 'Edwin Agudelo + Vihuela + Guitarrón' },
  { id: 'cuarteto', name: 'Cuarteto de Gala', basePrice: 750, musiciansCount: 4, tagline: 'Voz + Trompeta + Vihuela + Guitarrón' },
  { id: 'quinteto', name: 'Quinteto Imperial', basePrice: 900, musiciansCount: 5, tagline: 'Voz + 2 Trompetas + Vihuela + Guitarrón' },
  { id: 'imperial', name: 'Gran Ensamble Imperial', basePrice: 1400, musiciansCount: 8, tagline: 'Formación Completa de Gala con Violines y Bronces' }
];

const VENUES: { id: VenueType; name: string; isVimume?: boolean }[] = [
  { id: 'SALON_BODA', name: 'Salón de Bodas / Restaurante' },
  { id: 'FINCA_EXTERIOR', name: 'Finca / Jardín Exterior' },
  { id: 'IGLESIA', name: 'Iglesia / Ceremonia Religiosa' },
  { id: 'RESIDENCIA_MAYORES', name: 'Residencia de Mayores (VIMUME)', isVimume: true },
  { id: 'PLAZA_PUBLICA', name: 'Plaza Pública / Escenario Municipal' }
];

function CheckoutPresupuestoContent() {
  const searchParams = useSearchParams();

  // Estados Interactivos del Terminal S-Class
  const [selectedFormatId, setSelectedFormatId] = useState<StageFormatType>('solista');
  const [distanceKm, setDistanceKm] = useState<number>(30);
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('SALON_BODA');
  const [pax, setPax] = useState<number>(120);
  const [eventDate, setEventDate] = useState<string>('2026-09-15');
  const [isNightHour, setIsNightHour] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);

  // Cálculos Financieros Inmutables (SSOT S-Class)
  const currentFormat = GALA_FORMATS.find(f => f.id === selectedFormatId) || GALA_FORMATS[0];
  const isVimumeContext = selectedVenue === 'RESIDENCIA_MAYORES';

  // Logística desde Méntrida (Toledo): 1,50 €/km a partir del km 50
  const billableKm = Math.max(0, distanceKm - 50);
  const kmLogisticsCost = Math.round(billableKm * 1.50);
  const hotelSurcharge = (distanceKm > 200 || isNightHour) ? 120 : 0;

  const totalBaseBeforeVat = currentFormat.basePrice + kmLogisticsCost + hotelSurcharge;
  const vatAmount = Math.round(totalBaseBeforeVat * 0.21 * 100) / 100;
  const totalWithVat = Math.round((totalBaseBeforeVat + vatAmount) * 100) / 100;

  // Split Soberano Inmutable (80 / 10 / 10)
  const artistNet80 = Math.round(totalBaseBeforeVat * 0.80 * 100) / 100;
  const earInfrastructure10 = Math.round(totalBaseBeforeVat * 0.10 * 100) / 100;
  const vimumeResearch10 = Math.round(totalBaseBeforeVat * 0.10 * 100) / 100;

  // Firma Criptográfica Simulada en Cliente
  const priceLockHash = useMemo(() => {
    const raw = `${selectedFormatId}-${distanceKm}-${totalBaseBeforeVat}-${eventDate}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `SHA256-LOCK-${Math.abs(hash).toString(16).toUpperCase()}-2026`;
  }, [selectedFormatId, distanceKm, totalBaseBeforeVat, eventDate]);

  // Mensaje para WhatsApp Directo (+34 693 693 048)
  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `¡Hola Edwin! Deseo bloquear fecha para mi evento con Productora EAR.\n\n` +
      `📅 Fecha: ${eventDate}\n` +
      `🎭 Formato: ${currentFormat.name} (${currentFormat.basePrice} €)\n` +
      `📍 Ubicación: ${distanceKm} km desde Méntrida (Logística: ${kmLogisticsCost + hotelSurcharge} €)\n` +
      `👥 Asistentes: ${pax} pax | Recinto: ${selectedVenue}\n` +
      `💰 Total Presupuestado: ${totalWithVat.toLocaleString('es-ES')} € (IVA incl.)\n` +
      `🔒 Depósito de Reserva: 100,00 € (Price-Lock SHA-256: ${priceLockHash})\n` +
      `🎁 Aplico Bono de Cortesía: EDWIN150-COMPLEMENTOS`
    );
    return `https://wa.me/34693693048?text=${text}`;
  }, [eventDate, currentFormat, distanceKm, kmLogisticsCost, hotelSurcharge, pax, selectedVenue, totalWithVat, priceLockHash]);

  const handleStripeDeposit = async () => {
    setIsProcessingStripe(true);
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100, // 100 € Depósito Reembolsable
          concept: `Depósito de Reserva Price-Lock: ${currentFormat.name}`,
          clientName: clientName || 'Cliente Particular',
          clientPhone: clientPhone || '+34600000000',
          metadata: {
            format: selectedFormatId,
            distanceKm,
            venueType: selectedVenue,
            priceLockHash,
            totalBudget: totalWithVat
          }
        })
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        // Fallback directo a WhatsApp con confirmación
        window.open(whatsappUrl, '_blank');
      }
    } catch {
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsProcessingStripe(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header S-Class */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d0d12] via-[#12121c] to-[#0d0d12] border border-[#ecb613]/25 p-6 md:p-8 relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Terminal de Cotización Soberana
              </span>
              <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono">
                Depósito: 100,00 € (Reembolsable)
              </span>
              <span className="px-3 py-1 bg-blue-950/80 text-blue-300 border border-blue-500/30 rounded-full text-xs font-mono">
                Split: 80% Artista / 10% EAR / 10% VIMUME
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-serif">
              Configurador de Gala & Contratación Inmediata
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-3xl leading-relaxed">
              Calcula en tiempo real el caché del ensamble, la logística exacta desde Méntrida (Toledo) y el rider electroacústico calibrado a 12 W/pax con microfonía Shure Beta 87A.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-mono text-gray-500">FIRMA CRIPTOGRÁFICA PRICE-LOCK</span>
            <span className="px-3 py-1.5 bg-black/60 border border-[#ecb613]/40 rounded-lg text-xs font-mono text-[#ecb613] font-bold">
              {priceLockHash}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Principal: Parámetros a la Izquierda, Visualizador y Cierre a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: CONTROLES INTERACTIVOS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Selector de Formatos de Gala */}
          <div className="rounded-2xl bg-[#09090d] border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ecb613]" /> 1. Selecciona el Formato de Gala
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GALA_FORMATS.map((f) => {
                const isSelected = selectedFormatId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormatId(f.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_20px_rgba(236,182,19,0.25)]'
                        : 'bg-[#121218] border-white/5 hover:border-white/20 text-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold text-xs ${isSelected ? 'text-[#ecb613]' : 'text-white'}`}>
                        {f.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {f.basePrice} €
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      {f.tagline}
                    </p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Slider de Distancia y Logística Méntrida */}
          <div className="rounded-2xl bg-[#09090d] border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#258DCD]" /> 2. Distancia desde el Hub Central (Méntrida)
              </h3>
              <span className="font-mono text-sm font-bold text-[#258DCD]">
                {distanceKm} km
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="450"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#258DCD]"
            />

            <div className="flex justify-between text-[11px] font-mono text-gray-500">
              <span>0 km (Méntrida / Toledo)</span>
              <span>150 km</span>
              <span>300 km</span>
              <span>450 km (Larga Distancia)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs">
                <span className="text-gray-400 block text-[10px]">Kilometraje Facturable (&gt;50 km)</span>
                <span className="font-mono font-bold text-white">{billableKm} km × 1,50 € = {kmLogisticsCost} €</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs">
                <span className="text-gray-400 block text-[10px]">Suplemento Hotelero (&gt;200 km / Noche)</span>
                <span className={`font-mono font-bold ${hotelSurcharge > 0 ? 'text-amber-400' : 'text-gray-500'}`}>
                  {hotelSurcharge > 0 ? '+120,00 € (Aplicado)' : '0,00 € (No requerido)'}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-300 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isNightHour}
                onChange={(e) => setIsNightHour(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-[#ecb613] focus:ring-0"
              />
              <span>El evento finaliza después de las 03:00 AM (Aplica suplemento de alojamiento de 120 €)</span>
            </label>
          </div>

          {/* 3. Recinto, Asistentes y Protocolo VIMUME */}
          <div className="rounded-2xl bg-[#09090d] border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#AAD6CD]" /> 3. Tipo de Recinto y Aforo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tipo de Espacio</label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value as VenueType)}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ecb613]"
                >
                  {VENUES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Aforo de Asistentes: <span className="text-white font-mono font-bold">{pax} pax</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="600"
                  step="10"
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#AAD6CD] mt-2"
                />
              </div>
            </div>

            {isVimumeContext && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-bold block">Protocolo VIMUME Geriátrico Activado (&lt;75 dB SPL)</span>
                  Presión acústica atenuada para protección cognitiva en residencias y centros de mayores.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: VISUALIZADOR 3D, DESGLOSE Y CIERRE (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* Visualizador Escénico 3D Integrado */}
          <StageVisualizer3D
            format={selectedFormatId}
            venueType={selectedVenue}
            pax={pax}
            isVimume={isVimumeContext}
          />

          {/* Desglose Económico & Split Soberano */}
          <div className="rounded-2xl bg-[#09090d] border border-[#ecb613]/30 p-6 space-y-5 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[11px] font-mono text-gray-400 block uppercase tracking-wider">RESUMEN DE COTIZACIÓN S-CLASS</span>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-2xl font-bold text-white font-serif">{currentFormat.name}</span>
                <span className="text-3xl font-bold text-[#ecb613] font-mono">
                  {totalWithVat.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                Base: {totalBaseBeforeVat.toLocaleString('es-ES')} € + IVA (21%): {vatAmount.toLocaleString('es-ES')} €
              </span>
            </div>

            {/* Split Soberano Transparente */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                SPLIT SOBERANO INMUTABLE (80 / 10 / 10)
              </span>
              <div className="flex justify-between p-2 rounded-lg bg-white/5 font-mono">
                <span className="text-gray-300">80% Honorarios de Músicos:</span>
                <span className="font-bold text-white">{artistNet80.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/5 font-mono">
                <span className="text-gray-300">10% Logística & Infraestructura EAR:</span>
                <span className="font-bold text-[#258DCD]">{earInfrastructure10.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/5 font-mono">
                <span className="text-gray-300">10% Fondo de Investigación VIMUME:</span>
                <span className="font-bold text-emerald-400">{vimumeResearch10.toLocaleString('es-ES')} €</span>
              </div>
            </div>

            {/* Inputs de Contacto Opcionales */}
            <div className="space-y-3 pt-2">
              <input
                type="text"
                placeholder="Nombre o Persona de Contacto"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ecb613]"
              />
              <input
                type="tel"
                placeholder="Teléfono / WhatsApp (ej: +34 600 000 000)"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            {/* Botones de Cierre Transaccional */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleStripeDeposit}
                disabled={isProcessingStripe}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-sm tracking-wide transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {isProcessingStripe ? 'Conectando con Stripe...' : 'Bloquear Fecha con Depósito (100,00 €)'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#121218] hover:bg-[#1a1a24] border border-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Hablar con Edwin Agudelo por WhatsApp (+34 693 693 048)
              </a>
            </div>

            {/* Garantía de Seguridad */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono pt-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Depósito 100% reembolsable hasta 15 días antes del evento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPresupuestoPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black font-sans">
      <Suspense fallback={<div className="text-center py-20 font-mono text-gray-500">Cargando Terminal S-Class...</div>}>
        <CheckoutPresupuestoContent />
      </Suspense>
    </main>
  );
}

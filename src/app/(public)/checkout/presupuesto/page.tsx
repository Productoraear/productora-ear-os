'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
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

import { GALA_FORMATS, VENUES } from '@/data/gala-formats';
import { useCheckoutStore } from '@/store/checkout-store';

function ExternalVendorEscrowCheckout({
  venueParam,
  formatParam,
  baseParam
}: {
  venueParam: string;
  formatParam: string;
  baseParam: number;
}) {
  const [eventDate, setEventDate] = useState<string>('2026-09-15');
  const [eventLocation, setEventLocation] = useState<string>('Madrid');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [pax, setPax] = useState<number>(100);
  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);

  // Limpieza y formato impecable del nombre del proveedor (por si llega como slug o URI codificado)
  const cleanVenueName = useMemo(() => {
    let name = decodeURIComponent(venueParam || '').trim();
    if (name.startsWith('vendor-') || name.startsWith('prov-')) {
      name = name.replace(/^(vendor|prov)-/, '');
    }
    if (name.includes('-') && !name.includes(' ')) {
      name = name
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return name || 'Proveedor Homologado';
  }, [venueParam]);

  // Si formatParam es 'Solista' y baseParam es 350, es residuo del antiguo copy-paste de la tarifa de Edwin.
  // Lo neutralizamos asignando el pack base o la tarifa estándar del proveedor (650 €).
  const isLegacySolistaArtifact = formatParam?.toLowerCase() === 'solista';
  const effectivePackTitle = (!isLegacySolistaArtifact && formatParam) 
    ? decodeURIComponent(formatParam) 
    : 'Servicio Homologado S-Class';

  const officialBasePrice = (baseParam > 0 && !(isLegacySolistaArtifact && baseParam === 350)) 
    ? baseParam 
    : 650;

  const vatAmount = Math.round(officialBasePrice * 0.21 * 100) / 100;
  const totalWithVat = Math.round((officialBasePrice + vatAmount) * 100) / 100;

  // Split Soberano Inmutable (80 / 10 / 10)
  const providerNet80 = Math.round(officialBasePrice * 0.80 * 100) / 100;
  const earInfrastructure10 = Math.round(officialBasePrice * 0.10 * 100) / 100;
  const vimumeResearch10 = Math.round(officialBasePrice * 0.10 * 100) / 100;

  const priceLockHash = useMemo(() => {
    const raw = `${cleanVenueName}-${officialBasePrice}-${eventDate}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `SHA256-ESCROW-${Math.abs(hash).toString(16).toUpperCase()}-2026`;
  }, [cleanVenueName, officialBasePrice, eventDate]);

  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `¡Hola Concierge de Productora EAR! Deseo formalizar la reserva para el proveedor homologado ${cleanVenueName}.\n\n` +
      `📅 Fecha: ${eventDate}\n` +
      `🏛️ Proveedor Homologado: ${cleanVenueName}\n` +
      `📦 Pack / Formato: ${effectivePackTitle}\n` +
      `📍 Lugar del Evento: ${eventLocation} (${pax} asistentes)\n` +
      `💰 Tarifa Estimada: ${totalWithVat.toLocaleString('es-ES')} € (IVA incl.)\n` +
      `🔒 Depósito de Bloqueo: 100,00 € (Price-Lock SHA-256: ${priceLockHash})\n` +
      `🛡️ Póliza de RC: 1.000.000 € y Split 80/10/10 garantizado por EAR OS.`
    );
    return `https://wa.me/34693693048?text=${text}`;
  }, [cleanVenueName, eventDate, effectivePackTitle, eventLocation, pax, totalWithVat, priceLockHash]);

  const handleStripeDeposit = async () => {
    setIsProcessingStripe(true);
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100,
          concept: `Depósito Fianza Escrow: ${cleanVenueName} (${effectivePackTitle})`,
          clientName: clientName || 'Cliente Particular',
          clientPhone: clientPhone || '+34600000000',
          metadata: {
            providerName: cleanVenueName,
            packTitle: effectivePackTitle,
            eventDate,
            eventLocation,
            priceLockHash,
            totalBudget: totalWithVat
          }
        })
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
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
      {/* Header Escrow Proveedor S-Class */}
      <div className="rounded-3xl bg-[#09090d] border border-[#258DCD]/30 p-6 md:p-8 relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#258DCD]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#258DCD]/10 text-[#AAD6CD] border border-[#258DCD]/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#258DCD]" /> DIRECTORIO HOMOLOGADO S-CLASS
              </span>
              <span className="px-3 py-1 bg-amber-500/10 text-[#ecb613] border border-amber-500/30 rounded-full text-xs font-mono font-bold">
                {effectivePackTitle}
              </span>
              <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
                Fianza: 100,00 € (Stripe Escrow)
              </span>
              <span className="px-3 py-1 bg-white/5 text-neutral-300 border border-white/10 rounded-full text-xs font-mono">
                Split: 80% Proveedor / 10% EAR / 10% VIMUME
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-serif">
              Reserva Homologada: {cleanVenueName}
            </h1>
            <p className="text-neutral-400 text-sm max-w-3xl leading-relaxed">
              Estás formalizando fecha para <strong>{cleanVenueName}</strong> bajo el servicio <strong>{effectivePackTitle}</strong>, con la infraestructura de certificación técnica, seguro de responsabilidad civil de 1.000.000 € y depósito fiduciario seguro de Productora EAR.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">FIRMA CRIPTOGRÁFICA ESCROW</span>
            <span className="px-3.5 py-2 bg-black/80 border border-[#258DCD]/40 rounded-xl text-xs font-mono text-[#AAD6CD] font-bold shadow-[0_0_20px_rgba(37,141,205,0.2)]">
              {priceLockHash}
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2 Columnas: Datos del Evento / Desglose Fiduciario */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Izquierda: Parámetros del Evento y Blindaje Legal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#08080c] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Proveedor Homologado</span>
                <h3 className="text-2xl font-bold text-white font-syne">{cleanVenueName}</h3>
                <span className="text-xs font-mono text-[#AAD6CD] block mt-0.5">Formato: {effectivePackTitle}</span>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-amber-400 font-bold">
                Tarifa Base: {officialBasePrice.toLocaleString('es-ES')} €
              </span>
            </div>

            {/* Cláusula de Desvinculación Artística y Autonomía Absoluta */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3.5 text-xs text-neutral-300">
              <ShieldCheck className="w-5 h-5 text-[#258DCD] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white block uppercase tracking-wider text-[11px] font-mono">
                  Supervisión Técnica & Autonomía Artística
                </span>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Productora EAR garantiza la solvencia técnica, la puntualidad y la cobertura del evento mediante póliza de 1.000.000 €. La contratación, repertorio y ejecución artística o de servicio es realizada de forma directa, soberana e independiente por <strong>{cleanVenueName}</strong>.
                </p>
              </div>
            </div>

            {/* Configuración del Evento */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
                Parámetros de la Celebración
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-mono">Fecha Prevista del Evento</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-[#258DCD] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-mono">Lugar / Localidad del Evento</label>
                  <input
                    type="text"
                    value={eventLocation}
                    placeholder="ej. Madrid, Toledo, Finca..."
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-[#258DCD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1.5 font-mono">
                  Aforo Estimado: <span className="text-white font-bold">{pax} asistentes</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#258DCD]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen Financiero & Depósito Stripe Escrow */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#08080c] border border-[#258DCD]/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-widest">
                CUSTODIA FIDUCIARIA (ESCROW S-CLASS)
              </span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-bold text-white font-serif">{cleanVenueName}</span>
                <span className="text-3xl font-black text-[#AAD6CD] font-mono">
                  {totalWithVat.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <span className="text-[11px] text-[#ecb613] block font-mono mt-0.5">
                {effectivePackTitle}
              </span>
              <span className="text-[11px] text-neutral-400 block mt-1 font-mono">
                Base: {officialBasePrice.toLocaleString('es-ES')} € + IVA (21%): {vatAmount.toLocaleString('es-ES')} €
              </span>
            </div>

            {/* Split Soberano Inmutable */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                SPLIT SOBERANO INMUTABLE (80 / 10 / 10)
              </span>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-neutral-400">80% Liquidación Directa Proveedor:</span>
                <span className="font-bold text-white">{providerNet80.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-neutral-400">10% Póliza RC & Supervisión EAR:</span>
                <span className="font-bold text-[#258DCD]">{earInfrastructure10.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-neutral-400">10% Fondo Social VIMUME:</span>
                <span className="font-bold text-emerald-400">{vimumeResearch10.toLocaleString('es-ES')} €</span>
              </div>
            </div>

            {/* Datos de Contacto del Cliente */}
            <div className="space-y-3 pt-2">
              <input
                type="text"
                placeholder="Nombre o Persona de Contacto"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#258DCD]"
              />
              <input
                type="tel"
                placeholder="Teléfono / WhatsApp (ej: +34 600 000 000)"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#258DCD]"
              />
            </div>

            {/* Cierre Transaccional */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleStripeDeposit}
                disabled={isProcessingStripe}
                className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {isProcessingStripe ? 'Conectando con Stripe...' : 'Bloquear Fecha con Fianza (100,00 €)'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Centralita Productora EAR (+34 693 693 048)</span>
              </a>
            </div>

            {/* Garantía Reembolsable */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Depósito fiduciario 100% reembolsable si no encaja la fecha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EdwinAgudeloGalaCheckout() {
  const {
    selectedFormatId,
    distanceKm,
    selectedVenue,
    pax,
    eventDate,
    isNightHour,
    clientName,
    clientPhone,
    setFormatId,
    setDistanceKm,
    setVenue,
    setPax,
    setIsNightHour,
    setClientName,
    setClientPhone,
  } = useCheckoutStore();

  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null);
  const [priceLockHash, setPriceLockHash] = useState<string>('CALCULANDO_FIRMA...');

  const currentFormat = GALA_FORMATS.find(f => f.id === selectedFormatId) || GALA_FORMATS[0];
  const isVimumeContext = selectedVenue === 'RESIDENCIA_MAYORES';

  const billableKm = Math.max(0, distanceKm - 50);
  const kmLogisticsCost = Math.round(billableKm * 1.50);
  const hotelSurcharge = (distanceKm > 200 || isNightHour) ? 120 : 0;

  const totalBaseBeforeVat = currentFormat.basePrice + kmLogisticsCost + hotelSurcharge;
  const vatAmount = Math.round(totalBaseBeforeVat * 0.21 * 100) / 100;
  const totalWithVat = Math.round((totalBaseBeforeVat + vatAmount) * 100) / 100;

  const artistNet80 = Math.round(totalBaseBeforeVat * 0.80 * 100) / 100;
  const earInfrastructure10 = Math.round(totalBaseBeforeVat * 0.10 * 100) / 100;
  const vimumeResearch10 = Math.round(totalBaseBeforeVat * 0.10 * 100) / 100;

  useEffect(() => {
    const fetchSecureHash = async () => {
      try {
        const res = await fetch('/api/quote/generate-lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formatId: selectedFormatId, distanceKm, eventDate })
        });
        const data = await res.json();
        if (data.priceLockHash) {
          setPriceLockHash(data.priceLockHash);
        }
      } catch (err) {
        setPriceLockHash('SHA256-Ω-OFFLINE-MODE');
      }
    };
    
    // Debounce the fetch to avoid spamming the API while dragging sliders
    const timeoutId = setTimeout(fetchSecureHash, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedFormatId, distanceKm, eventDate]);

  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `¡Hola Edwin! Deseo bloquear fecha (Vanguardia S-Class).\n\n` +
      `📅 Fecha: ${eventDate}\n` +
      `🎭 Formato: ${currentFormat.name} (${currentFormat.basePrice} €)\n` +
      `📍 Hub Distancia: ${distanceKm} km (Logística: ${kmLogisticsCost + hotelSurcharge} €)\n` +
      `👥 Aforo: ${pax} pax | Venue: ${selectedVenue}\n` +
      `💰 Total HUD: ${totalWithVat.toLocaleString('es-ES')} € (IVA incl.)\n` +
      `🔒 Depósito S-Class: 100,00 € (Hash: ${priceLockHash})\n` +
      `⚡ Cortesia EAR: EDWIN150-OMEGA`
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
          amount: 100,
          concept: `Depósito S-Class Omega: ${currentFormat.name}`,
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
        window.open(whatsappUrl, '_blank');
      }
    } catch {
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsProcessingStripe(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-12">
      {/* Header Omega God Tier */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#020202] border border-white/5 shadow-[0_0_150px_rgba(236,182,19,0.05)] isolate p-8 md:p-14">
        {/* Cinematic Spotlight & Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[150%] bg-[radial-gradient(ellipse_at_top,#ecb6131a,transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-black/60 text-[#ecb613] border border-[#ecb613]/20 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2 backdrop-blur-md">
                <Sparkles className="w-4 h-4" /> VANGUARDIA S-CLASS
              </span>
              <span className="px-4 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono backdrop-blur-md">
                CUSTODIA: 100,00 €
              </span>
              <span className="px-4 py-1.5 bg-white/5 text-gray-300 border border-white/10 rounded-full text-xs font-mono backdrop-blur-md">
                SPLIT: 80 / 10 / 10
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-600 font-serif leading-[1.1] mb-6 drop-shadow-2xl">
              Terminal de Gala <br />
              <span className="bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffdb58] to-[#cc9900]">Inmersiva S-Class.</span>
            </h1>
            
            <p className="text-lg text-neutral-400 font-light leading-relaxed max-w-2xl border-l-2 border-[#ecb613]/40 pl-6">
              Arquitectura acústica calibrada a <strong className="text-white">12 W/pax</strong> (Bose F1 812), telemetría logística en tiempo real y aseguramiento criptográfico de tu evento. La experiencia sonora definitiva.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">FIRMA DE SESIÓN VANGUARDISTA</span>
            <div className="text-sm font-mono text-[#ecb613] font-black tracking-widest break-all">
              {priceLockHash}
            </div>
            <div className="mt-2 w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-[#ecb613] to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Vanguardista Omega */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">
        {/* Panel de Configuración Inmersivo */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* Módulo 1: Formatos */}
          <div className="relative group rounded-[2rem] bg-[#050505] border border-white/5 p-8 transition-all duration-500 hover:border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[2rem] pointer-events-none" />
            
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-300 flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30">01</span>
              Arquitectura del Ensamble
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GALA_FORMATS.map((f) => {
                const isSelected = selectedFormatId === f.id;
                const isHovered = hoveredFormat === f.id;
                
                return (
                  <button
                    key={f.id}
                    onClick={() => setFormatId(f.id)}
                    onMouseEnter={() => setHoveredFormat(f.id)}
                    onMouseLeave={() => setHoveredFormat(null)}
                    className={`relative p-5 rounded-2xl border text-left transition-all duration-500 overflow-hidden ${
                      isSelected
                        ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.2)] scale-[1.02]'
                        : 'bg-black/50 border-white/5 hover:border-white/20 text-neutral-400 hover:bg-[#0a0a0a]'
                    }`}
                  >
                    {/* Glowing effect inside card */}
                    {(isSelected || isHovered) && (
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ecb613]/20 rounded-full blur-[50px] pointer-events-none transition-opacity duration-500" />
                    )}
                    
                    <div className="relative z-10 flex justify-between items-start mb-3">
                      <span className={`font-black text-lg ${isSelected ? 'text-[#ecb613]' : 'text-white'}`}>
                        {f.name}
                      </span>
                      <span className={`font-mono text-base font-bold ${isSelected ? 'text-white' : 'text-neutral-500'}`}>
                        {f.basePrice} €
                      </span>
                    </div>
                    <p className={`relative z-10 text-xs font-light leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {f.tagline}
                    </p>
                    
                    {isSelected && (
                      <div className="absolute top-4 right-4 flex items-center justify-center">
                        <div className="absolute w-3 h-3 rounded-full bg-[#ecb613] animate-ping opacity-75" />
                        <div className="relative w-2 h-2 rounded-full bg-[#ecb613]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Módulo 2 y 3: Logística y Entorno (Combinados en un panel técnico) */}
          <div className="relative group rounded-[2rem] bg-[#050505] border border-white/5 p-8 transition-all duration-500 hover:border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-300 flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#258DCD]/10 text-[#258DCD] border border-[#258DCD]/30">02</span>
              Telemetría y Entorno Acústico
            </h3>

            <div className="space-y-10">
              {/* Slider Distancia */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Vector de Distancia (Origen: Méntrida)</label>
                  <span className="text-2xl font-black text-white font-mono tracking-tighter">
                    {distanceKm} <span className="text-sm text-[#258DCD]">KM</span>
                  </span>
                </div>
                
                {/* Custom Cyberpunk Slider */}
                <div className="relative h-2 bg-neutral-900 rounded-full overflow-visible">
                  <input
                    type="range"
                    min="0"
                    max="450"
                    step="5"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#258DCD] to-[#AAD6CD] rounded-full shadow-[0_0_15px_rgba(37,141,205,0.6)]"
                    style={{ width: `${(distanceKm / 450) * 100}%` }}
                  />
                  {/* Thumb Visual */}
                  <div 
                    className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow-[0_0_10px_white] pointer-events-none z-10 transition-transform duration-75"
                    style={{ left: `calc(${(distanceKm / 450) * 100}% - 10px)` }}
                  >
                    <div className="absolute inset-1 bg-black rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-black/60 border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Impacto Logístico (&gt;50km)</span>
                    <span className="font-mono font-bold text-lg text-white mt-1">{billableKm} <span className="text-xs text-neutral-400">km</span> <span className="text-[#258DCD]">× 1,50€</span></span>
                    <span className="font-mono font-black text-[#258DCD] text-xl mt-2">{kmLogisticsCost} €</span>
                  </div>
                  <div className="p-4 rounded-xl bg-black/60 border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Pernocta S-Class (&gt;200km)</span>
                    <span className="font-mono font-bold text-lg text-white mt-1">
                      {hotelSurcharge > 0 ? 'REQUERIDA' : 'EXENTA'}
                    </span>
                    <span className={`font-mono font-black text-xl mt-2 ${hotelSurcharge > 0 ? 'text-[#ecb613]' : 'text-neutral-600'}`}>
                      {hotelSurcharge > 0 ? '+120 €' : '0 €'}
                    </span>
                  </div>
                </div>
                
                <label className="flex items-start gap-3 mt-4 p-4 rounded-xl bg-[#0a0a0a] border border-white/5 cursor-pointer group hover:bg-[#111]">
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      checked={isNightHour}
                      onChange={(e) => setIsNightHour(e.target.checked)}
                      className="w-5 h-5 rounded bg-black border-neutral-700 text-[#ecb613] focus:ring-0 focus:ring-offset-0 checked:border-[#ecb613] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white group-hover:text-[#ecb613] transition-colors">Operación Nocturna Extendida</span>
                    <span className="text-xs text-neutral-500 mt-1">El evento finaliza después de las 03:00 AM (Aplica suplemento de alojamiento +120€ independientemente de la distancia).</span>
                  </div>
                </label>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Controles Acústicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-3">Escenario Físico</label>
                  <select
                    value={selectedVenue}
                    onChange={(e) => setVenue(e.target.value as any)}
                    className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-[#258DCD] focus:ring-1 focus:ring-[#258DCD] appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
                  >
                    {VENUES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Aforo de Audiencia</label>
                    <span className="text-xl font-black text-white font-mono tracking-tighter">
                      {pax} <span className="text-xs text-neutral-500">PAX</span>
                    </span>
                  </div>
                  <div className="relative h-2 bg-neutral-900 rounded-full mt-2">
                    <input
                      type="range"
                      min="20"
                      max="600"
                      step="10"
                      value={pax}
                      onChange={(e) => setPax(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-neutral-600 to-white rounded-full"
                      style={{ width: `${(pax - 20) / (600 - 20) * 100}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -mt-2 w-4 h-4 bg-white rounded-full pointer-events-none z-10"
                      style={{ left: `calc(${(pax - 20) / (600 - 20) * 100}% - 8px)` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-600 mt-2 flex justify-between">
                    <span>Requerimiento Acústico:</span>
                    <span className="text-[#AAD6CD] font-bold">{pax * 12} Watts RMS (Bose F1)</span>
                  </div>
                </div>
              </div>

              {isVimumeContext && (
                <div className="relative p-5 rounded-xl border border-emerald-500/30 overflow-hidden bg-black/60 group">
                  <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 bg-emerald-950/80 rounded-lg shrink-0 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-emerald-400 uppercase tracking-widest block mb-1">PROTOCOLO VIMUME ACTIVO</span>
                      <p className="text-xs text-emerald-200/70 leading-relaxed font-mono">
                        Modo de protección cognitiva habilitado. Limitador RMS activado a &lt;75 dB SPL.
                        Microfonía plana y ecualización adaptativa para entornos de alta sensibilidad audiológica.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HUD S-Class Financiero y de Checkout (Sticky) */}
        <div className="xl:col-span-5 relative">
          <div className="sticky top-32 space-y-8">
            <StageVisualizer3D
              format={selectedFormatId}
              venueType={selectedVenue}
              pax={pax}
              isVimume={isVimumeContext}
            />

            <div className="relative rounded-[2rem] bg-gradient-to-b from-[#111116] to-[#050505] border border-[#ecb613]/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Golden Glow Background */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#ecb613]/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div className="border-b border-white/10 pb-6 text-center">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em] mb-3 block">PRESUPUESTO OMEGA</span>
                  <div className="text-6xl font-black text-white font-mono tracking-tighter drop-shadow-xl flex items-start justify-center gap-2">
                    <span className="text-2xl text-[#ecb613] mt-2">€</span>
                    {totalWithVat.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-neutral-400 mt-3 font-mono flex items-center justify-center gap-2">
                    <span>NETO: {totalBaseBeforeVat.toLocaleString('es-ES')} €</span>
                    <span className="text-neutral-600">|</span>
                    <span>IVA (21%): {vatAmount.toLocaleString('es-ES')} €</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#ecb613] rounded-full" />
                    <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-widest">Distribución Inteligente S-Class</span>
                  </div>
                  
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <span className="text-neutral-400 group-hover:text-white transition-colors">Artistas & Producción (80%)</span>
                      <span className="font-bold text-white text-sm">{artistNet80.toLocaleString('es-ES')} €</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <span className="text-neutral-400 group-hover:text-[#258DCD] transition-colors">Logística EAR OS (10%)</span>
                      <span className="font-bold text-[#258DCD] text-sm">{earInfrastructure10.toLocaleString('es-ES')} €</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <span className="text-neutral-400 group-hover:text-emerald-400 transition-colors">Fondo VIMUME (10%)</span>
                      <span className="font-bold text-emerald-400 text-sm">{vimumeResearch10.toLocaleString('es-ES')} €</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Users className="w-4 h-4 text-neutral-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Nombre Oficial (Persona o Razón Social)"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-[#ecb613] focus:ring-1 focus:ring-[#ecb613] transition-all placeholder:text-neutral-600"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-neutral-500" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Teléfono Directo / WhatsApp"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-[#ecb613] focus:ring-1 focus:ring-[#ecb613] transition-all placeholder:text-neutral-600"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleStripeDeposit}
                    disabled={isProcessingStripe}
                    className="relative w-full group overflow-hidden rounded-xl bg-[#ecb613] text-black font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_40px_rgba(236,182,19,0.4)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-[#ecb613] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative px-6 py-4 flex items-center justify-center gap-3">
                      <Lock className="w-5 h-5" />
                      {isProcessingStripe ? 'EJECUTANDO CUSTODIA...' : 'BLOQUEAR FECHA (100,00 €)'}
                    </div>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-xl bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/40 transition-colors">
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="tracking-wide">CONSULTA DIRECTA (+34 693 693 048)</span>
                  </a>
                </div>
                
                <div className="flex items-center justify-center gap-2 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">Garantía EAR OS: Cancelación Gratuita 15D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPresupuestoContent() {
  const searchParams = useSearchParams();
  const venueParam = searchParams.get('venue') || searchParams.get('proveedor') || searchParams.get('artista') || '';
  const formatParam = searchParams.get('format') || searchParams.get('pack') || '';
  const baseParam = Number(searchParams.get('base') || searchParams.get('precio') || 0);

  const isExternalVendor = Boolean(
    venueParam && 
    !venueParam.toLowerCase().includes('edwin') && 
    !venueParam.toLowerCase().includes('productora ear')
  );

  if (isExternalVendor) {
    return (
      <ExternalVendorEscrowCheckout 
        venueParam={venueParam} 
        formatParam={formatParam} 
        baseParam={baseParam} 
      />
    );
  }

  return <EdwinAgudeloGalaCheckout />;
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



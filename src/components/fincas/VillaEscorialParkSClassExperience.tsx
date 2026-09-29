'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Flame,
  Home,
  Waves,
  Film,
  Utensils,
  Car,
  CreditCard,
  X,
  Sun,
  Coffee,
  Check,
  Mail,
  Maximize2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import {
  VillaWeekendSlot,
  VillaDaySlot,
  VillaEscorialTelemetry,
  VILLA_ESCORIAL_HD_GALLERY,
  calculateCustomStayPrice
} from '@/lib/villas/villa-escorial-sync';

interface ExperienceProps {
  initialTelemetry?: VillaEscorialTelemetry | null;
}

export default function VillaEscorialParkSClassExperience({ initialTelemetry }: ExperienceProps) {
  const [telemetry, setTelemetry] = useState<VillaEscorialTelemetry | null>(initialTelemetry || null);
  const [loading, setLoading] = useState(!initialTelemetry);
  
  // Modos de reserva: 'WEEKEND' (Fin de semana 4.500€) | 'CUSTOM' (Todo el año día a día)
  const [activeMode, setActiveMode] = useState<'WEEKEND' | 'CUSTOM'>('WEEKEND');
  const [selectedSlot, setSelectedSlot] = useState<VillaWeekendSlot | null>(null);

  // Selector de fechas libre (365 días)
  const [customCheckIn, setCustomCheckIn] = useState<string>('');
  const [customCheckOut, setCustomCheckOut] = useState<string>('');
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);

  // Galería y Modales
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadAvailability() {
      try {
        const res = await fetch('/api/villas/villa-escorial/availability');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.telemetry) {
            setTelemetry(data.telemetry);
            const firstAvailable = data.telemetry.availableWeekends.find((w: VillaWeekendSlot) => w.isAvailable);
            if (firstAvailable) {
              setSelectedSlot(firstAvailable);
            }
          }
        }
      } catch (err) {
        console.warn('Error cargando disponibilidad en vivo:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAvailability();
  }, []);

  // Cálculo dinámico para la estancia personalizada
  const customCalculation = useMemo(() => {
    if (!telemetry || !customCheckIn || !customCheckOut) {
      return null;
    }
    return calculateCustomStayPrice(customCheckIn, customCheckOut, telemetry.occupiedDates);
  }, [telemetry, customCheckIn, customCheckOut]);

  // Manejo de clic en un día del calendario mensual
  const handleDayClick = (dateStr: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    if (!customCheckIn || (customCheckIn && customCheckOut)) {
      setCustomCheckIn(dateStr);
      setCustomCheckOut('');
    } else if (customCheckIn && !customCheckOut) {
      if (dateStr > customCheckIn) {
        setCustomCheckOut(dateStr);
      } else {
        setCustomCheckIn(dateStr);
        setCustomCheckOut('');
      }
    }
  };

  // Días del mes actual en vista
  const monthViewData = useMemo(() => {
    const baseDate = new Date();
    baseDate.setDate(1);
    baseDate.setMonth(baseDate.getMonth() + calendarMonthOffset);

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth(); // 0-indexed
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Lunes = 0

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayData = telemetry?.yearCalendar[dateStr];
      days.push({
        dayNumber: d,
        dateStr,
        isAvailable: dayData ? dayData.isAvailable : true,
        rate: dayData ? dayData.ratePerNightEur : 800,
        seasonType: dayData ? dayData.seasonType : 'MEDIA'
      });
    }

    return {
      title: `${monthNames[month]} ${year}`,
      firstDayOfWeek,
      days
    };
  }, [calendarMonthOffset, telemetry]);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const payload: any = {
        bookingMode: activeMode,
        clientName,
        clientEmail,
        clientPhone
      };

      if (activeMode === 'WEEKEND') {
        if (!selectedSlot) return;
        payload.weekendId = selectedSlot.weekendId;
      } else {
        if (!customCheckIn || !customCheckOut) return;
        payload.checkInDate = customCheckIn;
        payload.checkOutDate = customCheckOut;
      }

      const res = await fetch('/api/villas/villa-escorial/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
        // Fallback WhatsApp directo con Edwin Agudelo
        const datesText = activeMode === 'WEEKEND'
          ? `Fin de semana (${selectedSlot?.label}) por 4.500€`
          : `Estancia de ${customCalculation?.totalNights} noches (${customCheckIn} al ${customCheckOut}) por ${customCalculation?.totalPriceEur}€`;
        const text = encodeURIComponent(
          `Hola Edwin, deseo confirmar el bloqueo en Villa Escorial Park.\n\nModalidad: ${datesText}\nNombre: ${clientName}\nTeléfono: ${clientPhone}\nEmail: ${clientEmail}`
        );
        window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
        setBookingModalOpen(false);
      } else {
        alert(data.error || 'Error al procesar la reserva');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con la pasarela');
    } finally {
      setBookingLoading(false);
    }
  };

  const whatsappInquiryMessage = encodeURIComponent(
    activeMode === 'WEEKEND' && selectedSlot
      ? `Hola Edwin, deseo consultar disponibilidad para el fin de semana (${selectedSlot.label}) en Villa Escorial Park (4.500€ de Viernes 14:00h a Domingo 14:00h).`
      : customCheckIn && customCheckOut && customCalculation
      ? `Hola Edwin, deseo reservar Villa Escorial Park para las fechas del ${customCheckIn} al ${customCheckOut} (${customCalculation.totalNights} noches, ${customCalculation.totalPriceEur}€).`
      : `Hola Edwin, deseo consultar fechas para alquilar Villa Escorial Park durante el año.`
  );

  return (
    <div className="w-full bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black font-sans pb-24">
      {/* 👑 BREADCRUMB SOBERANO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/fincas" className="hover:text-zinc-300 transition-colors">Fincas S-Class</Link>
          <span>/</span>
          <span className="text-zinc-400">Madrid</span>
          <span>/</span>
          <span className="text-[#ecb613] font-bold">Villa Escorial Park (Posición nº 1 Nacional)</span>
        </div>
      </div>

      {/* 🏰 HERO CINEMATOGRÁFICO DE ALTA CONVERSIÓN */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#08080c] min-h-[540px] flex flex-col justify-end p-6 sm:p-10 md:p-14">
          <img
            src={VILLA_ESCORIAL_HD_GALLERY[activePhotoIdx].url}
            alt={VILLA_ESCORIAL_HD_GALLERY[activePhotoIdx].title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/65 to-black/30" />

          {/* Badges de Prestigio */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              FINCA HOMOLOGADA Nº 1 MADRID
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              DISPONIBLE LOS 365 DÍAS DEL AÑO
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
              20.000 m² FINCA PRIVADA • 30 HUÉSPEDES
            </span>
          </div>

          {/* Título Principal y Claim */}
          <div className="relative z-10 max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-mono uppercase">
              VILLA ESCORIAL PARK
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed">
              Exclusiva mansión y finca privada de 20.000 m² con 3.000 m² de jardines arbolados a los pies de San Lorenzo de El Escorial. 
              <strong className="text-white"> Alquiler íntegro todo el año</strong>: fines de semana completos, escapadas de domingo a jueves, semanas completas, retiros y celebraciones privadas.
            </p>

            {/* Acceso Rápido Directo con Edwin Agudelo */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://wa.me/34693693048?text=Hola%20Edwin%2C%20deseo%20informaci%C3%B3n%20para%20alquilar%20Villa%20Escorial%20Park"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Directo: +34 693 693 048
              </a>
              <a
                href="mailto:productoraear@gmail.com"
                className="px-3.5 py-1.5 rounded-xl bg-[#ecb613]/20 hover:bg-[#ecb613]/30 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold flex items-center gap-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                productoraear@gmail.com
              </a>
            </div>
          </div>

          {/* Barra de Especificaciones Rápidas */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs font-mono">
            <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">FIN DE SEMANA (VIE-DOM)</span>
              <span className="text-xl sm:text-2xl font-bold text-[#ecb613]">4.500 €</span>
              <span className="text-[10px] text-zinc-400 block">Viernes 14h - Domingo 14h</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">ENTRE SEMANA TODO EL AÑO</span>
              <span className="text-xl sm:text-2xl font-bold text-white">Desde 700 €</span>
              <span className="text-[10px] text-zinc-400 block">Tarifa por noche (Lun-Jue)</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">CAPACIDAD ALOJAMIENTO</span>
              <span className="text-xl sm:text-2xl font-bold text-white">30 Personas</span>
              <span className="text-[10px] text-zinc-400 block">9 habitaciones (3 en suite)</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">BLOQUEO PRICE-LOCK</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">500 €</span>
              <span className="text-[10px] text-zinc-400 block">Fianza / señal Stripe</span>
            </div>
          </div>

          {/* Selector de Fotos del Hero */}
          <div className="relative z-10 flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
            {VILLA_ESCORIAL_HD_GALLERY.slice(0, 8).map((img, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  activePhotoIdx === i ? 'border-[#ecb613] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              </button>
            ))}
            <button
              onClick={() => setLightboxOpen(true)}
              className="shrink-0 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              +12 Fotos
            </button>
          </div>
        </div>
      </section>

      {/* 📅 SELECTOR DE MODALIDAD Y CALENDARIO ANUAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        {/* Selector de Pestañas: Fin de Semana vs Todo el Año */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
          <div>
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider font-bold block">
              CALENDARIO EN VIVO SINCRONIZADO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mt-0.5">
              ELIGE TU FECHA DE ALQUILER
            </h2>
          </div>

          <div className="inline-flex p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveMode('WEEKEND')}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeMode === 'WEEKEND'
                  ? 'bg-[#ecb613] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Fin de Semana (4.500 €)
            </button>
            <button
              onClick={() => setActiveMode('CUSTOM')}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeMode === 'CUSTOM'
                  ? 'bg-[#ecb613] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4" />
              Todo el Año (365 Días)
            </button>
          </div>
        </div>

        {/* 🎛️ VISTA 1: FINES DE SEMANA COMPLETOS (VIE-DOM 4.500€) */}
        {activeMode === 'WEEKEND' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-1">
                <span>Fines de Semana Disponibles (Próximos 9 meses)</span>
                <span className="text-[#ecb613]">Viernes 14:00h ➔ Domingo 14:00h</span>
              </div>

              {loading ? (
                <div className="py-20 text-center space-y-3 bg-[#050508] border border-white/5 rounded-2xl">
                  <div className="w-8 h-8 border-2 border-[#ecb613] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono text-zinc-400">Consultando fechas ocupadas en tiempo real...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[540px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {telemetry?.availableWeekends.map((slot) => {
                    const isSelected = selectedSlot?.weekendId === slot.weekendId;
                    return (
                      <div
                        key={slot.weekendId}
                        onClick={() => slot.isAvailable && setSelectedSlot(slot)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          !slot.isAvailable
                            ? 'border-white/5 bg-[#050507] opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#ecb613] bg-[#ecb613]/10 shadow-lg shadow-[#ecb613]/10'
                            : 'border-white/10 bg-[#08080c] hover:border-white/30 hover:bg-[#0c0c12]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-sm font-bold text-white block">{slot.label}</span>
                            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-[#ecb613]" /> {slot.checkIn} - {slot.checkOut}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                              slot.isAvailable
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-zinc-800 text-zinc-500'
                            }`}
                          >
                            {slot.isAvailable ? 'DISPONIBLE' : 'OCUPADO'}
                          </span>
                        </div>

                        <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white">4.500 €</span>
                          <span className="text-[10px] font-mono text-zinc-500">Señal Stripe: 500 €</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tarjeta Lateral de Contratación Fin de Semana */}
            <div className="lg:col-span-4 bg-[#08080c] border border-[#ecb613]/30 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                  FIN DE SEMANA ÍNTEGRO
                </span>
                <h3 className="text-2xl font-bold font-mono text-white">4.500 €</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Hasta 30 huéspedes en 9 suites exclusivas
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Fecha elegida:</span>
                  <span className="text-white font-bold truncate max-w-[180px]">{selectedSlot?.label || 'Elige fecha'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Check-in:</span>
                  <span className="text-emerald-400 font-bold">Viernes a las 14:00h</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Check-out:</span>
                  <span className="text-amber-400 font-bold">Domingo a las 14:00h</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#ecb613] font-bold">Señal Price-Lock:</span>
                  <span className="text-white font-bold text-sm">500 €</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  disabled={!selectedSlot || !selectedSlot.isAvailable}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#ecb613] hover:bg-[#d8a510] disabled:opacity-40 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  BLOQUEAR CON 500 € (STRIPE)
                </button>

                <a
                  href={`https://wa.me/34693693048?text=${whatsappInquiryMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  CONSULTAR CON EDWIN (WHATSAPP)
                </a>

                <a
                  href="tel:+34693693048"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#ecb613]" />
                  Llamar a Centralita (+34 693 693 048)
                </a>

                <a
                  href="mailto:productoraear@gmail.com"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#ecb613]" />
                  productoraear@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 🌞 VISTA 2: CALENDARIO ANUAL 365 DÍAS (ENTRE SEMANA, SEMANAS COMPLETAS) */}
        {activeMode === 'CUSTOM' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#08080c] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCalendarMonthOffset((prev) => Math.max(0, prev - 1))}
                    disabled={calendarMonthOffset === 0}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:border-[#ecb613] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-xl font-bold font-mono text-white">
                    {monthViewData.title}
                  </h3>
                  <button
                    onClick={() => setCalendarMonthOffset((prev) => Math.min(11, prev + 1))}
                    disabled={calendarMonthOffset >= 11}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:border-[#ecb613] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-mono text-zinc-400 hidden sm:flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Libre</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-600" /> Ocupado</span>
                </div>
              </div>

              {/* Días de la Semana */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs text-zinc-500 font-bold uppercase">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {/* Grid Mensual de 365 días */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 font-mono">
                {/* Espaciadores del primer día */}
                {Array.from({ length: monthViewData.firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {monthViewData.days.map((day) => {
                  const isCheckIn = customCheckIn === day.dateStr;
                  const isCheckOut = customCheckOut === day.dateStr;
                  const isInRange = customCheckIn && customCheckOut && day.dateStr >= customCheckIn && day.dateStr <= customCheckOut;

                  return (
                    <div
                      key={day.dateStr}
                      onClick={() => handleDayClick(day.dateStr, day.isAvailable)}
                      className={`relative aspect-square rounded-xl p-1 sm:p-2 border flex flex-col justify-between transition-all select-none ${
                        !day.isAvailable
                          ? 'border-white/5 bg-[#050507] opacity-35 cursor-not-allowed text-zinc-600'
                          : isCheckIn || isCheckOut
                          ? 'border-[#ecb613] bg-[#ecb613] text-black font-bold shadow-lg shadow-[#ecb613]/30 cursor-pointer z-10'
                          : isInRange
                          ? 'border-[#ecb613]/50 bg-[#ecb613]/20 text-white cursor-pointer'
                          : 'border-white/5 bg-zinc-900/60 hover:border-white/30 hover:bg-zinc-800 cursor-pointer text-zinc-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold block">{day.dayNumber}</span>
                      <span className={`text-[9px] sm:text-[10px] block truncate ${isCheckIn || isCheckOut ? 'text-black' : 'text-zinc-400'}`}>
                        {day.isAvailable ? `${day.rate}€` : 'Ocupado'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>Haz clic para seleccionar fecha de Entrada y de Salida</span>
                <span className="text-[#ecb613]">Estancia mínima entre semana: 2 noches</span>
              </div>
            </div>

            {/* Tarjeta Lateral de Estancia Anual Personalizada */}
            <div className="lg:col-span-4 bg-[#08080c] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                  COTIZADOR EN TIEMPO REAL
                </span>
                <h3 className="text-2xl font-bold font-mono text-white mt-1">
                  {customCalculation && customCalculation.totalNights > 0
                    ? `${customCalculation.totalPriceEur.toLocaleString('es-ES')} €`
                    : 'Personalizado'}
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {customCalculation && customCalculation.totalNights > 0
                    ? `${customCalculation.totalNights} noches de estancia íntegra`
                    : 'Selecciona fechas en el calendario'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Entrada (Check-in):</span>
                  <span className="text-white font-bold">{customCheckIn || 'Seleccionar día'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-400">Salida (Check-out):</span>
                  <span className="text-white font-bold">{customCheckOut || 'Seleccionar día'}</span>
                </div>
                {customCalculation && (
                  <>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-zinc-400">Noches totales:</span>
                      <span className="text-white font-bold">{customCalculation.totalNights}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#ecb613] font-bold">Señal de Bloqueo:</span>
                      <span className="text-white font-bold text-sm">500 €</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  disabled={!customCalculation || !customCalculation.isAvailable || customCalculation.totalNights < 2}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#ecb613] hover:bg-[#d8a510] disabled:opacity-40 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  BLOQUEAR CON 500 € (STRIPE)
                </button>

                <a
                  href={`https://wa.me/34693693048?text=${whatsappInquiryMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  CONSULTAR CON EDWIN (WHATSAPP)
                </a>

                <a
                  href="tel:+34693693048"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#ecb613]" />
                  Llamar a Centralita (+34 693 693 048)
                </a>

                <a
                  href="mailto:productoraear@gmail.com"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#ecb613]" />
                  productoraear@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Banner de Producción Musical y Audiovisual */}
        <div className="mt-8 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#ecb613] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">COMPLEMENTOS DE PRODUCCIÓN EXCLUSIVA (DISPONIBLES TODO EL AÑO)</strong>
            Cualquier servicio complementario de sonido profesional Bose ShowMatch, iluminación arquitectónica exterior, actuación musical de Edwin Agudelo (Mariachi / Solista) o catering de alta gama se coordinará de manera personalizada y directa por WhatsApp con el artista.
          </div>
        </div>
      </section>

      {/* 🏰 ESPACIOS Y CARACTERÍSTICAS TÉCNICAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="border-b border-white/10 pb-4 mb-8">
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
            ESPACIOS &amp; CARACTERÍSTICAS DE LA VILLA
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            20.000 m² de privacidad total en la Sierra de Madrid (San Lorenzo de El Escorial)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Jardines &amp; Piscina Privada</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              3.000 m² de jardines arbolados con gran piscina vallada, bar exterior de madera, barbacoa de gran formato y pozo tradicional. Porche techado con mesas y sillas de gala.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ecb613]">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">9 Habitaciones (30 Huéspedes)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gran Suite Principal con vistas panorámicas, suites con baño integrado, dormitorios triples y cuádruples. Alojamiento confortable para hasta 30 personas durante todo el año.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Sala de Cine con Sofás Masaje</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Salón diáfano equipado con proyector de alta definición y 12 sofás de masaje reclinables. Espacio idóneo para proyecciones, sesiones de yoga, conferencias o relax.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Gran Comedor &amp; Cocina Doble Isla</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Comedor con dos mesas señoriales para 30 personas. Cocina completamente equipada con dos islas de preparación diseñadas específicamente para servicios de catering y cocineros privados.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Coworking &amp; Chimenea (80 m²)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Segunda planta con amplio salón diáfano con chimenea de piedra, sofás, escritorios de trabajo y vistas despejadas a las cumbres de la Sierra de Guadarrama.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Aparcamiento para 30 Coches</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Parking privado dentro del recinto vallado con capacidad para más de 30 vehículos y acceso fluido para furgonetas técnicas de producción y minibuses.
            </p>
          </div>
        </div>
      </section>

      {/* 🕶️ TOUR VIRTUAL 3D MATTERPORT INMERSIVO (DOLLHOUSE & 360°) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="border-b border-white/10 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              EXPERIENCIA DIGITAL S-CLASS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white uppercase">
              TOUR VIRTUAL 3D INTERACTIVO MATTERPORT
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Recorre el interior completo de la villa, suites, salones y exteriores en 360° con tecnología 3D Dollhouse
            </p>
          </div>

          <a
            href="https://my.matterport.com/show/?m=HiFvTbdbEHN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#ecb613] text-xs font-mono font-bold text-white transition-all shadow-lg shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-[#ecb613]" />
            Abrir Pantalla Completa
          </a>
        </div>

        {/* Contenedor del visor Matterport 3D */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-[#ecb613]/30 bg-black shadow-2xl aspect-[16/9] min-h-[440px] sm:min-h-[580px]">
          <iframe
            src="https://my.matterport.com/show/?m=HiFvTbdbEHN&play=1&qs=1&brand=0&title=0"
            title="Tour Virtual 3D Matterport - Villa Escorial Park"
            className="w-full h-full border-0 absolute inset-0"
            allow="fullscreen; vr; accelerometer; gyroscope"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>

      {/* 🖼️ GALERÍA DE FOTOS OFICIALES HD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="border-b border-white/10 pb-4 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
              GALERÍA FOTOGRÁFICA HD
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Imágenes reales de la propiedad en San Lorenzo de El Escorial
            </p>
          </div>
          <button
            onClick={() => setLightboxOpen(true)}
            className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1 font-bold"
          >
            Ver Pantalla Completa <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {VILLA_ESCORIAL_HD_GALLERY.map((photo, i) => (
            <div
              key={i}
              onClick={() => {
                setActivePhotoIdx(i);
                setLightboxOpen(true);
              }}
              className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/10 cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[11px] font-mono text-white font-semibold line-clamp-1">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 👑 DESPACHO DE ATENCIÓN DIRECTA Y ALQUILER TODO EL AÑO • PRODUCTORA EAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-gradient-to-b from-[#0e0e14] to-[#08080c] border border-[#ecb613]/30 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              DESPACHO OFICIAL DIRECTO • PRODUCTORA EAR
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-mono text-white tracking-tight uppercase">
              ALQUILER DIRECTO SIN INTERMEDIARIOS CON EDWIN AGUDELO
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              Atención directa sin comisiones parasitarias para particulares, parejas, empresas y productoras. 
              Alquiler de Villa Escorial Park disponible <strong className="text-white">los 365 días del año</strong>: fines de semana completos (4.500 € con check-in viernes 14:00h y check-out domingo 14:00h), escapadas entre semana desde 700 €/noche, retiros exclusivos y rodajes audiovisuales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <a
                href="https://wa.me/34693693048?text=Hola%20Edwin%2C%20deseo%20informaci%C3%B3n%20para%20alquilar%20Villa%20Escorial%20Park"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#08080c] border border-emerald-500/30 hover:border-emerald-500 flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    WHATSAPP DIRECTO
                  </span>
                  <span className="text-base font-bold font-mono text-white">
                    +34 693 693 048
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    Edwin Agudelo • Respuesta inmediata
                  </span>
                </div>
              </a>

              <a
                href="mailto:productoraear@gmail.com"
                className="p-5 rounded-2xl bg-[#08080c] border border-[#ecb613]/30 hover:border-[#ecb613] flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20 flex items-center justify-center text-[#ecb613] group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    CORREO ELECTRÓNICO OFICIAL
                  </span>
                  <span className="text-base font-bold font-mono text-white truncate block">
                    productoraear@gmail.com
                  </span>
                  <span className="text-[10px] text-[#ecb613] font-mono block">
                    Contratos, presupuestos & facturación
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ⚖️ TABLA COMPARATIVA: RESERVA DIRECTA PRODUCTORA EAR VS. INTERMEDIARIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="border-b border-white/10 pb-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            GARANTÍA DE PRECIO MÍNIMO SIN COMISIONES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white uppercase">
            POR QUÉ ALQUILAR DIRECTAMENTE CON PRODUCTORA EAR
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Comparativa transparente frente a portales intermediarios (Airbnb, Vrbo, agencias de eventos)
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#08080c] shadow-2xl">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/60">
                <th className="p-4 sm:p-5 text-zinc-400 font-bold uppercase tracking-wider">Concepto</th>
                <th className="p-4 sm:p-5 text-zinc-500 font-semibold uppercase">Portales Intermediarios (Airbnb / Vrbo)</th>
                <th className="p-4 sm:p-5 text-[#ecb613] font-bold uppercase bg-[#ecb613]/5 border-l border-r border-[#ecb613]/20">
                  Productora EAR (Canal Directo)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-4 sm:p-5 text-white font-semibold">Tarifa Fin de Semana (30 Pax)</td>
                <td className="p-4 sm:p-5 text-zinc-400">4.500 €</td>
                <td className="p-4 sm:p-5 text-white font-bold bg-[#ecb613]/5 border-l border-r border-[#ecb613]/20">
                  4.500 € (Tarifa Oficial)
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 text-white font-semibold">Comisión de Servicio / Plataforma</td>
                <td className="p-4 sm:p-5 text-rose-400 font-bold">+675 € a +950 € (15% - 20%)</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold bg-[#ecb613]/5 border-l border-r border-[#ecb613]/20">
                  0 € (0% Sin Comisiones)
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 text-white font-semibold">Bloqueo de Calendario</td>
                <td className="p-4 sm:p-5 text-zinc-400">Cobro íntegro adelantado (100%)</td>
                <td className="p-4 sm:p-5 text-[#ecb613] font-bold bg-[#ecb613]/5 border-l border-r border-[#ecb613]/20">
                  Señal de 500 € Price-Lock en Stripe
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 text-white font-semibold">Contacto y Visita Previa</td>
                <td className="p-4 sm:p-5 text-zinc-400">Chat restringido (teléfonos bloqueados)</td>
                <td className="p-4 sm:p-5 text-white font-bold bg-[#ecb613]/5 border-l border-r border-[#ecb613]/20">
                  WhatsApp Directo (+34 693 693 048) & Visitas
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 text-white font-semibold">Sonido, Luces & Producción Musical</td>
                <td className="p-4 sm:p-5 text-zinc-400">No disponible (gestión externa del cliente)</td>
                <td className="p-4 sm:p-5 text-white font-bold bg-[#ecb613]/5 border-l border-r border-[#ecb613]/20">
                  Equipos Bose ShowMatch & Mariachis en directo
                </td>
              </tr>
              <tr className="bg-white/[0.02]">
                <td className="p-4 sm:p-5 text-white font-bold text-sm">TOTAL COSTE CLIENTE</td>
                <td className="p-4 sm:p-5 text-rose-400 font-bold text-sm">5.175 € – 5.450 €</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold text-base bg-[#ecb613]/10 border-l border-r border-[#ecb613]/30">
                  4.500 € (Ahorro de hasta 950 €)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ❓ PREGUNTAS FRECUENTES (FAQ S-CLASS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="border-b border-white/10 pb-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#ecb613]" />
            RESOLUCIÓN DE DUDAS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white uppercase">
            PREGUNTAS FRECUENTES SOBRE VILLA ESCORIAL PARK
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Todo lo que necesitas saber antes de formalizar tu reserva con Productora EAR
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: '¿Cómo alquilar Villa Escorial Park directamente sin comisiones de intermediarios?',
              a: 'A través de Productora EAR tienes el canal directo oficial sin intermediarios (ahorrando entre un 15% y un 20% de recargo respecto a Airbnb o agencias, lo que supone un ahorro de hasta 950 €). Puedes consultar fechas y formalizar la fianza de 500 € en Stripe o contactar directamente por WhatsApp (+34 693 693 048).'
            },
            {
              q: '¿Cuánto cuesta alquilar Villa Escorial Park para fines de semana y entre semana?',
              a: 'El fin de semana íntegro (desde el viernes a las 14:00h hasta el domingo a las 14:00h) tiene un precio cerrado de 4.500 € para hasta 30 personas. Entre semana (domingo a jueves), la villa se alquila desde 700 € por noche en temporada baja, 800 € en temporada media y 1.400 € en temporada alta.'
            },
            {
              q: '¿Se puede alquilar la villa durante todo el año?',
              a: 'Sí, Villa Escorial Park está disponible los 365 días del año tanto para fines de semana de gala como para escapadas entre semana, semanas completas, retiros corporativos y rodajes cinematográficos.'
            },
            {
              q: '¿Qué capacidad de alojamiento tiene Villa Escorial Park?',
              a: 'La mansión cuenta con 9 dormitorios totalmente acondicionados (incluyendo 3 suites con baño privado) con capacidad homologada para alojar confortablemente a 30 huéspedes en 20.000 m² de finca privada.'
            },
            {
              q: '¿Cómo funciona la señal de reserva Price-Lock de 500 €?',
              a: 'Para bloquear tu fecha en el calendario oficial se realiza un depósito de 500 € a través de la pasarela segura Stripe Price-Lock. Esto garantiza la exclusividad total de la fecha sin riesgo de sobreventa ni modificaciones de precio.'
            },
            {
              q: '¿Se pueden contratar servicios de música en directo, sonido y catering?',
              a: 'Sí, Productora EAR ofrece coordinación integral con sonido profesional Bose ShowMatch de alta fidelidad, iluminación arquitectónica, catering gourmet y actuaciones musicales en vivo de Edwin Agudelo (Mariachi / Solista) personalizables para cada ocasión.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#08080c] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="font-mono text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#ecb613] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 💳 MODAL DE RESERVA CON SEÑAL PRICE-LOCK DE 500 € */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#08080c] border border-[#ecb613]/50 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                BLOQUEO DE FECHA EN VIVO
              </span>
              <h3 className="text-xl font-bold font-mono text-white mt-1">
                Villa Escorial Park
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {activeMode === 'WEEKEND' && selectedSlot ? (
                  <>Fin de semana: <strong className="text-white">{selectedSlot.label}</strong></>
                ) : (
                  <>Estancia: <strong className="text-white">{customCheckIn} al {customCheckOut} ({customCalculation?.totalNights} noches)</strong></>
                )}
              </p>
            </div>

            <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Total estancia:</span>
                <span className="text-white font-bold">
                  {activeMode === 'WEEKEND' ? '4.500 €' : `${customCalculation?.totalPriceEur.toLocaleString('es-ES')} €`}
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Señal de bloqueo hoy (Stripe):</span>
                <span>500 €</span>
              </div>
              <div className="text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                El resto se liquida 45 días antes de la fecha de entrada.
              </div>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Laura Martínez"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="laura@ejemplo.com"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 rounded-xl bg-[#ecb613] hover:bg-[#d8a510] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all cursor-pointer"
              >
                {bookingLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Procesando Bloqueo...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pagar Señal de 500 € (Stripe)
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔍 LIGHTBOX PANTALLA COMPLETA */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900/80"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : VILLA_ESCORIAL_HD_GALLERY.length - 1))}
            className="absolute left-6 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900/80"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
            <img
              src={VILLA_ESCORIAL_HD_GALLERY[activePhotoIdx].url}
              alt={VILLA_ESCORIAL_HD_GALLERY[activePhotoIdx].title}
              className="max-h-[75vh] w-auto object-contain rounded-2xl border border-white/10"
            />
            <p className="text-sm font-mono text-zinc-300 mt-4 text-center">
              {VILLA_ESCORIAL_HD_GALLERY[activePhotoIdx].title} ({activePhotoIdx + 1} / {VILLA_ESCORIAL_HD_GALLERY.length})
            </p>
          </div>

          <button
            onClick={() => setActivePhotoIdx((prev) => (prev < VILLA_ESCORIAL_HD_GALLERY.length - 1 ? prev + 1 : 0))}
            className="absolute right-6 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900/80"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Music, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Calendar as CalendarIcon, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Star,
  Search,
  Check,
  UserCheck,
  Filter,
  Sparkles
} from 'lucide-react';

export interface SClassArtistFormat {
  id: string;
  name: string;
  role: string;
  category: 'solista' | 'mariachi' | 'cuerdas' | 'fiesta';
  baseRate: number;
  rating: number;
  reviews: number;
  badge: string;
  img: string;
  description: string;
  repertoire: string[];
  rider: string;
}

export const ARTIST_FORMATS: SClassArtistFormat[] = [
  {
    id: 'edwin-solista',
    name: 'Edwin Agudelo (Tenor Lírico)',
    role: 'Solista Insignia S-Class',
    category: 'solista',
    baseRate: 350.00,
    rating: 5.0,
    reviews: 48,
    badge: 'Artista Insignia',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    description: 'Voz lírica de alta tesitura para ceremonias nupciales, boleros de gala y grandes celebraciones. Microfonía Shure Axient de estudio.',
    repertoire: ['Ave María (Schubert)', 'O Sole Mio', 'Nessun Dorma', 'Bésame Mucho', 'Por Ti Volaré'],
    rider: 'Bose S1 Pro / F1 + Shure Beta 87A'
  },
  {
    id: 'mariachi-gala-oro',
    name: "Mariachi 'Gala de Oro' (Trío Clásico)",
    role: 'Trío Charro Tradicional',
    category: 'mariachi',
    baseRate: 550.00,
    rating: 4.9,
    reviews: 34,
    badge: 'Favorito Bodas',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    description: 'Voz principal, guitarra y trompeta con auténtico traje charro de gala. Serenatas, cócteles de bienvenida y sorpresas nupciales.',
    repertoire: ['El Rey', 'Si Nos Dejan', 'Volver Volver', 'Cielito Lindo', 'La Bikina'],
    rider: 'Rider acústico puro + refuerzo Bose'
  },
  {
    id: 'mariachi-imperial',
    name: "Mariachi 'Imperial S-Class' (Quinteto)",
    role: 'Edwin Agudelo + 4 Maestros',
    category: 'mariachi',
    baseRate: 850.00,
    rating: 5.0,
    reviews: 29,
    badge: 'Top Selección',
    img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop',
    description: 'Quinteto estelar: tenor lírico, guitarrón mexicano, vihuela, violín y trompeta solista. Sonoridad y presencia inigualables.',
    repertoire: ['Serenata Huasteca', 'Amor Eterno', 'Échame a Mí la Culpa', 'Sombras'],
    rider: 'Bose F1 Model 812 (12 W/pax) + Microfonía inalámbrica'
  },
  {
    id: 'mariachi-gran-ensamble',
    name: 'Gran Ensamble Mariachi (9 Músicos)',
    role: 'Orquesta Completa de Gala',
    category: 'mariachi',
    baseRate: 1300.00,
    rating: 4.9,
    reviews: 18,
    badge: 'Gran Apoteosis',
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop',
    description: 'Sonoridad completa de gala mexicana: 2 trompetas, 3 violines, vihuela, guitarrón y 2 voces. Para recintos mayores y fincas.',
    repertoire: ['El Son de la Negra', 'Huapango de Moncayo', 'Guadalajara', 'El Cascabel'],
    rider: 'Sistema Bose F1 dual + subs 1.000W + mesa digital Midas'
  },
  {
    id: 'cuarteto-cuerdas',
    name: "Cuarteto de Cuerdas 'Sinfonía Nupcial'",
    role: '2 Violines, Viola & Violonchelo',
    category: 'cuerdas',
    baseRate: 650.00,
    rating: 4.9,
    reviews: 41,
    badge: 'Ceremonias de Gala',
    img: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=600&auto=format&fit=crop',
    description: 'Elegancia clásica para ceremonias religiosas y civiles. Piezas sacras, bandas sonoras de cine y adaptaciones pop elegantes.',
    repertoire: ['Canon de Pachelbel', 'Viva la Vida', 'Cello Suite Bach', 'Cinema Paradiso'],
    rider: 'Microfonía DPA 4099 para cuerdas'
  },
  {
    id: 'duo-lirico-piano',
    name: 'Dúo Lírico Clásico (Tenor + Piano Nord)',
    role: 'Edwin Agudelo & Pianista',
    category: 'solista',
    baseRate: 480.00,
    rating: 5.0,
    reviews: 26,
    badge: 'Alta Costura',
    img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=600&auto=format&fit=crop',
    description: 'Voz lírica acompañada de piano de escenario Nord Stage 3. Atmósfera íntima y refinada para firmas de acta y cócteles.',
    repertoire: ['Hasta Mi Final', 'Hallelujah (Cohen)', 'Intermezzo Cavalleria Rusticana'],
    rider: 'Piano Nord Stage 3 + Bose S1 Pro'
  },
  {
    id: 'dj-saxo-performance',
    name: 'DJ & Live Saxo Performance (Pack Fiesta)',
    role: 'DJ Productor + Saxofonista Live',
    category: 'fiesta',
    baseRate: 750.00,
    rating: 4.8,
    reviews: 37,
    badge: 'Barra Libre',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    description: 'Sonorización completa de fiesta y barra libre. Saxofón inalámbrico en pista de baile, puente de luces DMX y sonido Bose F1 < 75 dB.',
    repertoire: ['Deep House', 'Pop Español 80/90', 'Top 50 Hits', 'Ibiza Classics'],
    rider: 'Cabina Pioneer DJ + 2x Bose F1 + Iluminación DMX'
  },
  {
    id: 'guitarra-violin-duo',
    name: 'Dúo Guitarra Española & Violín Eléctrico',
    role: 'Fusión Flamenco-Chillout',
    category: 'cuerdas',
    baseRate: 520.00,
    rating: 4.9,
    reviews: 22,
    badge: 'Cóctel Chillout',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
    description: 'Melodías de guitarra española virtuosa combinadas con la calidez del violín eléctrico para cócteles al atardecer en jardines y fincas.',
    repertoire: ['Entre Dos Aguas', 'Asturias (Albéniz)', 'Shape of You (Fusión)'],
    rider: '2x Columnas Bose S1 Pro compactas a batería'
  }
];

interface CalendarDay {
  day: number;
  month: number; // 9 = Sept, 10 = Oct, etc.
  year: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  status: 'available' | 'blocked' | 'high_demand' | 'past';
  reason?: string;
}

export default function SolistaReservationPage() {
  const [distance, setDistance] = useState<number>(0);
  const [endTime, setEndTime] = useState<string>('23:00');
  
  // Advanced Calendar State
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 9 = Septiembre 2026
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-27');
  const [dayTypeFilter, setDayTypeFilter] = useState<'all' | 'weekends' | 'high_demand'>('all');
  
  // S-Class Multi-Artist Selection State
  const [selectedArtistId, setSelectedArtistId] = useState<string>('edwin-solista');
  const [artistCategoryFilter, setArtistCategoryFilter] = useState<'all' | 'mariachi' | 'solista' | 'cuerdas' | 'fiesta'>('all');
  const [artistSearch, setArtistSearch] = useState<string>('');
  const [blockedAlert, setBlockedAlert] = useState<string | null>(null);

  const selectedArtist = useMemo(() => {
    return ARTIST_FORMATS.find(a => a.id === selectedArtistId) || ARTIST_FORMATS[0];
  }, [selectedArtistId]);

  const filteredArtists = useMemo(() => {
    return ARTIST_FORMATS.filter(a => {
      const matchCat = artistCategoryFilter === 'all' || a.category === artistCategoryFilter;
      const matchSearch = artistSearch.trim() === '' || 
        a.name.toLowerCase().includes(artistSearch.toLowerCase()) ||
        a.role.toLowerCase().includes(artistSearch.toLowerCase()) ||
        a.repertoire.some(r => r.toLowerCase().includes(artistSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [artistCategoryFilter, artistSearch]);

  // Hesitation Engine State
  const [showHesitationBanner, setShowHesitationBanner] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Deposit checkout state (depósito real Stripe 100 €)
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  // Base constants sincronizados con el artista seleccionado
  const BASE_RATE = selectedArtist.baseRate;
  const DEPOSIT = 100.00;
  const KM_RATE = 1.50;
  const FREE_KM = 50;
  const HOTEL_FEE = 120.00;
  const HOTEL_DISTANCE_THRESHOLD = 200;

  // Logistics calculation
  const logisticsCost = useMemo(() => {
    if (distance <= FREE_KM) return 0;
    return (distance - FREE_KM) * KM_RATE;
  }, [distance]);

  const requiresHotel = useMemo(() => {
    if (distance > HOTEL_DISTANCE_THRESHOLD) return true;
    const hour = parseInt(endTime.split(':')[0], 10);
    if (hour >= 3 && hour <= 6) return true;
    return false;
  }, [distance, endTime]);

  const hotelCost = requiresHotel ? HOTEL_FEE : 0;
  const totalCost = BASE_RATE + logisticsCost + hotelCost;

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "34693693048";

  // Formatted date string in Spanish
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "Fecha no seleccionada";
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [selectedDate]);

  // Generate calendar days for the selected month (Year 2026)
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const daysInMonth = new Date(2026, selectedMonth, 0).getDate();
    const list: CalendarDay[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(2026, selectedMonth - 1, d);
      const dayOfWeek = dateObj.getDay(); // 0 = Dom, 1 = Lun, ... 6 = Sab

      let status: 'available' | 'blocked' | 'high_demand' | 'past' = 'available';
      let reason = undefined;

      // SPECIFIC S-CLASS RULES:
      // Septiembre 25 y 26 BLOQUEADOS
      if (selectedMonth === 9 && (d === 25 || d === 26)) {
        status = 'blocked';
        reason = 'Cerrado por Depósito S-Class (Confirmado)';
      } 
      // Fines de semana clave con alta demanda
      else if ((selectedMonth === 9 && [18, 19, 20, 27].includes(d)) || 
               (selectedMonth === 10 && [2, 3, 4, 9, 10, 11, 16, 17].includes(d))) {
        status = 'high_demand';
        reason = 'Alta Demanda — Último Cupo';
      }

      list.push({
        day: d,
        month: selectedMonth,
        year: 2026,
        dayOfWeek,
        status,
        reason
      });
    }

    return list;
  }, [selectedMonth]);

  // Filtered calendar days based on dynamic filters
  const filteredDays = useMemo(() => {
    return calendarDays.filter(item => {
      if (dayTypeFilter === 'weekends') {
        return item.dayOfWeek === 5 || item.dayOfWeek === 6 || item.dayOfWeek === 0; // Vie, Sab, Dom
      }
      if (dayTypeFilter === 'high_demand') {
        return item.status === 'high_demand' || item.status === 'blocked';
      }
      return true;
    });
  }, [calendarDays, dayTypeFilter]);

  // First day of month offset for grid alignment (0 = Lunes in Spain)
  const firstDayOffset = useMemo(() => {
    const first = new Date(2026, selectedMonth - 1, 1).getDay();
    return first === 0 ? 6 : first - 1; // Convert to Monday-first (0 = Mon, 6 = Sun)
  }, [selectedMonth]);

  // Handler for selecting date
  const handleDateSelect = (dayObj: CalendarDay) => {
    if (dayObj.status === 'blocked') {
      setBlockedAlert(`El día ${dayObj.day} de ${selectedMonth === 9 ? 'Septiembre' : 'este mes'} ya está bloqueado mediante depósito vinculante. Contacta por WhatsApp si deseas entrar en lista de espera prioritaria.`);
      return;
    }
    setBlockedAlert(null);
    const dateStr = `2026-${String(selectedMonth).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const whatsappMessage = useMemo(() => {
    const locText = distance > 0 ? `${distance} km de Méntrida` : 'zona centro';
    return encodeURIComponent(
      `Hola Edwin, he seleccionado a *${selectedArtist.name}* (${selectedArtist.role}) para la fecha del ${formattedSelectedDate} a ${locText} (finalización estimada ~${endTime}, presupuesto est. ${totalCost.toFixed(2)}€). Quiero verificar disponibilidad final y proceder al bloqueo con el depósito de 100€.`
    );
  }, [formattedSelectedDate, selectedArtist, distance, endTime, totalCost]);

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  // Crea el depósito vinculante real de 100 € vía Stripe Checkout (server-side).
  const handleDepositCheckout = async () => {
    setDepositError(null);
    setDepositLoading(true);
    try {
      const res = await fetch('/api/reservar/solista/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: selectedDate,
          formato: selectedArtist.name,
          distanciaKm: distance,
          horaFin: endTime,
          totalEstimado: Number(totalCost.toFixed(2)),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'No se pudo iniciar el depósito seguro.');
      }
      window.location.href = data.url;
    } catch (err) {
      setDepositError(err instanceof Error ? err.message : 'Error inesperado');
      setDepositLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#258DCD] selection:text-white pb-24">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#258DCD]" size={20} />
            <span className="font-bold text-sm tracking-widest uppercase">
              Edwin Agudelo <span className="text-[#258DCD]">S-Class</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <div className="hidden sm:flex items-center gap-1.5">
              <Phone size={14} className="text-[#AAD6CD]" />
              <span>+34 693 693 048</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#258DCD]/10 text-[#258DCD] border border-[#258DCD]/30 text-[11px] font-semibold">
              Temporada 2026/2027
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
        
        {/* HERO TITLE */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#258DCD]/10 border border-[#258DCD]/30 text-xs font-mono text-[#AAD6CD] mb-4">
            <Sparkles size={13} className="text-[#258DCD]" />
            SISTEMA OFICIAL DE BLOQUEO DE FECHAS S-CLASS
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Reserva Oficial de Artista & <span className="text-[#258DCD]">Disponibilidad en Vivo</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Consulta el calendario en tiempo real, bloquea tu fecha con garantía contractual y asegura rider Bose/Shure sin intermediarios ni cancelaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: ADVANCED SOTA CALENDAR & LOGISTICS */}
          <div className="lg:col-span-7 space-y-8">

            {/* SOTA CALENDAR CONTAINER */}
            <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              
              {/* CALENDAR HEADER & MONTH SWITCHER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-[#258DCD]" size={22} />
                  <div>
                    <h2 className="text-lg font-bold tracking-wide">Calendario de Actuaciones</h2>
                    <p className="text-xs text-zinc-500 font-mono">Zona Centro (Madrid, Toledo, Castilla)</p>
                  </div>
                </div>

                {/* MONTH SELECTOR */}
                <div className="flex items-center gap-1 bg-[#111] p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button 
                    onClick={() => setSelectedMonth(9)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${selectedMonth === 9 ? 'bg-[#258DCD] text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Septiembre
                  </button>
                  <button 
                    onClick={() => setSelectedMonth(10)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${selectedMonth === 10 ? 'bg-[#258DCD] text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Octubre
                  </button>
                  <button 
                    onClick={() => setSelectedMonth(11)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${selectedMonth === 11 ? 'bg-[#258DCD] text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Noviembre
                  </button>
                </div>
              </div>

              {/* DYNAMIC ADVANCED FILTERS BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#050505] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <Filter size={14} className="text-[#AAD6CD]" />
                  <span>Filtro de Días:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setDayTypeFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${dayTypeFilter === 'all' ? 'bg-white/10 text-white font-bold border border-white/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setDayTypeFilter('weekends')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${dayTypeFilter === 'weekends' ? 'bg-[#258DCD]/20 text-[#258DCD] font-bold border border-[#258DCD]/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Fines de Semana
                  </button>
                  <button 
                    onClick={() => setDayTypeFilter('high_demand')}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${dayTypeFilter === 'high_demand' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Alta Demanda
                  </button>
                </div>
              </div>

              {/* BLOCKED DATE ALERT BANNER */}
              {blockedAlert && (
                <div className="mb-6 p-4 rounded-xl bg-[#FF455B]/10 border border-[#FF455B]/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="text-[#FF455B] shrink-0 mt-0.5" size={18} />
                  <div className="text-xs">
                    <strong className="block text-[#FF455B] font-bold mb-0.5">FECHA NO DISPONIBLE</strong>
                    <span className="text-zinc-300">{blockedAlert}</span>
                  </div>
                </div>
              )}

              {/* CALENDAR WEEKDAYS HEADER */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-mono font-bold text-zinc-500">
                <span>LUN</span>
                <span>MAR</span>
                <span>MIÉ</span>
                <span>JUE</span>
                <span className="text-[#AAD6CD]">VIE</span>
                <span className="text-[#258DCD]">SÁB</span>
                <span className="text-[#258DCD]">DOM</span>
              </div>

              {/* CALENDAR DAYS GRID */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty offset days for start of month */}
                {dayTypeFilter === 'all' && Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-transparent opacity-10" />
                ))}

                {filteredDays.map((item) => {
                  const dateStr = `2026-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;

                  if (item.status === 'blocked') {
                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleDateSelect(item)}
                        title="Bloqueado por fianza confirmada"
                        className="h-14 sm:h-16 rounded-xl border border-[#FF455B]/30 bg-[#FF455B]/5 p-2 flex flex-col justify-between items-start cursor-not-allowed opacity-90 transition-all hover:bg-[#FF455B]/15 relative group"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-bold text-[#FF455B] font-mono">{item.day}</span>
                          <Lock size={12} className="text-[#FF455B]" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-tight text-[#FF455B] leading-none text-left">
                          RESERVADO
                        </span>
                      </button>
                    );
                  }

                  if (item.status === 'high_demand') {
                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleDateSelect(item)}
                        className={`h-14 sm:h-16 rounded-xl border p-2 flex flex-col justify-between items-start transition-all relative ${
                          isSelected 
                            ? 'bg-[#258DCD] border-white text-white shadow-[0_0_20px_rgba(37,141,205,0.5)] scale-[1.03] z-10' 
                            : 'border-amber-500/30 bg-amber-500/5 hover:border-amber-400 text-zinc-200'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-amber-400'}`}>{item.day}</span>
                          <Sparkles size={11} className={isSelected ? 'text-white' : 'text-amber-400'} />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-tight leading-none text-left ${isSelected ? 'text-white' : 'text-amber-400/90'}`}>
                          ÚLTIMO CUPO
                        </span>
                      </button>
                    );
                  }

                  // Default Available
                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateSelect(item)}
                      className={`h-14 sm:h-16 rounded-xl border p-2 flex flex-col justify-between items-start transition-all ${
                        isSelected 
                          ? 'bg-[#258DCD] border-white text-white shadow-[0_0_20px_rgba(37,141,205,0.5)] scale-[1.03] z-10' 
                          : 'border-white/10 bg-[#050505] hover:border-[#258DCD]/50 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold">{item.day}</span>
                      <span className={`text-[9px] uppercase tracking-tight leading-none ${isSelected ? 'text-white font-bold' : 'text-zinc-500'}`}>
                        DISPONIBLE
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* CALENDAR LEGEND */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#258DCD]" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Alta Demanda</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF455B]" />
                  <span>Bloqueado (Ej: 25-26 Sept)</span>
                </div>
              </div>
            </div>

            {/* S-CLASS VALIDATED MULTI-ARTIST DIRECTORY */}
            <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Music size={18} className="text-[#258DCD]" /> Catálogo de Artistas & Formatos Homologados
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    Selecciona tu formato escénico. Precios oficiales con rider técnico Bose/Shure incluido.
                  </p>
                </div>
                {/* Search input */}
                <div className="relative min-w-[220px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                    placeholder="Buscar artista, repertorio..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#258DCD]"
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: `Todos (${ARTIST_FORMATS.length})` },
                  { id: 'mariachi', label: 'Mariachis de Gala' },
                  { id: 'solista', label: 'Solistas & Piano' },
                  { id: 'cuerdas', label: 'Cuerdas & Clásica' },
                  { id: 'fiesta', label: 'Fiesta & DJs' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setArtistCategoryFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      artistCategoryFilter === tab.id
                        ? 'bg-[#258DCD] text-white font-bold shadow-[0_0_15px_rgba(37,141,205,0.4)]'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Artist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArtists.map((artist) => {
                  const isSelected = selectedArtistId === artist.id;
                  return (
                    <div
                      key={artist.id}
                      onClick={() => setSelectedArtistId(artist.id)}
                      className={`relative rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#258DCD]/15 border-[#258DCD] shadow-[0_0_25px_rgba(37,141,205,0.3)] ring-1 ring-[#258DCD]'
                          : 'bg-[#050505] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <img
                          src={artist.img}
                          alt={artist.name}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#AAD6CD] uppercase">
                              {artist.badge}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                              <Star size={11} fill="currentColor" />
                              <span>{artist.rating} ({artist.reviews})</span>
                            </div>
                          </div>
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-[#AAD6CD] transition-colors">
                            {artist.name}
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-mono truncate">
                            {artist.role}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 mt-3 line-clamp-2 font-light">
                        {artist.description}
                      </p>

                      {/* Repertoire tags */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {artist.repertoire.slice(0, 3).map((rep, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-zinc-400 border border-white/5">
                            {rep}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Tarifa Oficial</span>
                          <span className="text-sm font-bold font-mono text-[#AAD6CD]">Desde {artist.baseRate.toFixed(2)} €</span>
                        </div>
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#258DCD] text-white shadow'
                              : 'bg-white/5 text-zinc-300 group-hover:bg-white/10'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={13} />
                              <span>Seleccionado</span>
                            </>
                          ) : (
                            <span>Elegir</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CALCULATOR PANEL */}
            <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="text-[#AAD6CD]" size={20} />
                <h2 className="text-lg font-bold tracking-wide">Configuración Logística y Horaria</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-sm text-zinc-300">
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-zinc-500" /> Distancia desde Méntrida (Toledo)</span>
                    <span className="font-mono text-[#258DCD]">{distance} km</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="600" 
                    step="10"
                    value={distance} 
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full accent-[#258DCD]"
                  />
                  <p className="text-[11px] text-zinc-500 font-mono">Los primeros 50 km son gratuitos. Exceso a 1,50 €/km.</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <Clock size={16} className="text-zinc-500" /> Hora estimada de finalización
                  </label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#258DCD] font-mono text-sm"
                  />
                  <p className="text-[11px] text-zinc-500 font-mono">Finalizaciones post 03:00 AM requieren suplemento de pernoctación.</p>
                </div>
              </div>
            </div>

            {/* SPECS PANEL */}
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 sm:p-8">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Music size={16} /> Rider Técnico S-Class Incluido
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#258DCD] mt-2 shrink-0" />
                  <div>
                    <strong className="block text-sm text-white">Sistemas Bose F1 / S1 Pro</strong>
                    <span className="text-xs text-zinc-500">Presión acústica limpia de 12 W/pax. Cobertura uniforme sin distorsión armónica.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#258DCD] mt-2 shrink-0" />
                  <div>
                    <strong className="block text-sm text-white">Microfonía Shure Beta 87A / Axient RF</strong>
                    <span className="text-xs text-zinc-500">Captura vocal de grado estudio en entornos de directo. Cero acoples.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY & CHECKOUT */}
          <div className="lg:col-span-5">
            <div className="bg-[#0A0A0C] border border-[#258DCD]/30 rounded-2xl p-6 sm:p-8 sticky top-24 shadow-[0_0_50px_rgba(37,141,205,0.05)]">
              
              {/* SELECTED ARTIST PREVIEW CARD */}
              <div className="bg-[#111] border border-[#258DCD]/30 rounded-xl p-4 mb-4 flex items-center gap-3">
                <img
                  src={selectedArtist.img}
                  alt={selectedArtist.name}
                  className="w-12 h-12 rounded-lg object-cover border border-[#258DCD]/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono text-[#AAD6CD] uppercase block">
                    {selectedArtist.badge}
                  </span>
                  <strong className="text-sm text-white truncate block">
                    {selectedArtist.name}
                  </strong>
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    {selectedArtist.role} · Base {selectedArtist.baseRate.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* SELECTED DATE CARD */}
              <div className="bg-[#111] border border-white/10 rounded-xl p-4 mb-6">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  Fecha Seleccionada para Bloqueo:
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#258DCD]" />
                  <strong className="text-sm text-white capitalize">{formattedSelectedDate}</strong>
                </div>
              </div>

              {/* BUDGET BREAKDOWN */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Tarifa Base ({selectedArtist.name})</span>
                  <span className="font-mono text-white">{BASE_RATE.toFixed(2)} €</span>
                </div>
                
                {logisticsCost > 0 && (
                  <div className="flex justify-between items-center text-sm animate-in fade-in">
                    <span className="text-zinc-400">Logística ({distance - FREE_KM} km extra)</span>
                    <span className="font-mono text-white">+{logisticsCost.toFixed(2)} €</span>
                  </div>
                )}

                {requiresHotel && (
                  <div className="flex justify-between items-center text-sm animate-in fade-in">
                    <span className="text-zinc-400 flex items-center gap-1">Suplemento Hotelero</span>
                    <span className="font-mono text-white">+{hotelCost.toFixed(2)} €</span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-zinc-400 text-sm">Presupuesto Estimado</span>
                  <span className="font-mono text-2xl font-bold text-[#AAD6CD]">{totalCost.toFixed(2)} €</span>
                </div>
              </div>

              {/* DEPOSIT CARD */}
              <div className="bg-[#050505] rounded-xl p-5 mb-8 border border-[#258DCD]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">Depósito Vinculante de Reserva</span>
                  <span className="font-mono font-bold text-[#258DCD]">{DEPOSIT.toFixed(2)} €</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">
                  Pago seguro oficial vía Stripe (SHA-256). El abono de este depósito formaliza el bloqueo inmutable de tu fecha en nuestro calendario oficial. El importe restante se liquida el día del evento.
                </p>
              </div>

              {/* HESITATION ENGINE BANNER */}
              <AnimatePresence>
                {showHesitationBanner && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="bg-[#258DCD]/10 border border-[#258DCD]/30 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="text-[#258DCD] shrink-0 mt-0.5" size={18} />
                        <div className="text-xs">
                          <strong className="block text-[#258DCD] font-bold mb-0.5 uppercase tracking-widest">Aviso de Auditoría</strong>
                          <span className="text-zinc-300">El 85% de las fincas en esta zona exigen limitación acústica. Nuestro Rider S-Class garantiza 0 multas.</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STRIPE PAYMENT BUTTON */}
              <div 
                onMouseEnter={() => {
                  hoverTimerRef.current = setTimeout(() => {
                    setShowHesitationBanner(true);
                  }, 3500);
                }}
                onMouseLeave={() => {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                }}
              >
                <button
                  type="button"
                  onClick={handleDepositCheckout}
                  disabled={depositLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#258DCD] hover:bg-[#1E74A8] text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(37,141,205,0.3)] mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositLoading ? 'Creando depósito seguro…' : 'PAGAR RESERVA (100 €)'} <ArrowRight size={18} />
                </button>
              </div>

              {depositError && (
                <p className="mb-4 text-xs text-[#FF455B] font-mono">{depositError}</p>
              )}

              {/* DIRECT CONTACT BUTTONS */}
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a 
                  href="tel:+34693693048"
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  <Phone size={14} /> Llamar
                </a>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}


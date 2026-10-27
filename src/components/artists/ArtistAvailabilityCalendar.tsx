'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Calendar as CalendarIcon,
  ShieldAlert,
  Sparkles,
  Clock,
  ExternalLink,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import {
  buildEntityCalendarHref,
  buildEntityIcalHref,
} from '@/lib/calendar/entity-calendar-engine';
import type { CalendarEntityKind } from '@/lib/calendar/entity-calendar-types';

export interface RouteTimeSlot {
  id: string;
  startTime: string;
  timeRange: string;
  label: string;
  period: 'manana' | 'tarde' | 'noche';
  isLateNight?: boolean;
}

export const MAX_ACTIVITIES_PER_DAY = 6;
export const LOGISTICS_BUFFER_MINUTES = 30;

export const ROUTE_TIME_SLOTS: RouteTimeSlot[] = [
  { id: 'slot_1200', startTime: '12:00', timeRange: '12:00 - 13:30', label: 'Vermut / Cóctel Mediodía', period: 'manana' },
  { id: 'slot_1400', startTime: '14:00', timeRange: '14:00 - 15:30', label: 'Banquete Comida / Brindis', period: 'manana' },
  { id: 'slot_1700', startTime: '17:00', timeRange: '17:00 - 18:30', label: 'Ceremonia Tarde / Tardeo', period: 'tarde' },
  { id: 'slot_1800', startTime: '18:00', timeRange: '18:00 - 19:30', label: 'Cóctel Atardecer / Recepción', period: 'tarde' },
  { id: 'slot_2130', startTime: '21:30', timeRange: '21:30 - 23:00', label: 'Cena de Gala / Serenata', period: 'noche' },
  { id: 'slot_2330', startTime: '23:30', timeRange: '23:30 - 01:00', label: 'Fiesta / Barra Libre', period: 'noche' },
  { id: 'slot_0130', startTime: '01:30', timeRange: '01:30 - 03:00', label: 'Cierre Nocturno (+Suplemento)', period: 'noche', isLateNight: true }
];

interface ArtistAvailabilityCalendarProps {
  artistId: string;
  artistName: string;
  /** Tipología de la entidad dueña de la agenda (artista, catering, finca…). */
  entityKind?: CalendarEntityKind;
  /** Slug canónico de la entidad. Si se omite, se usa `artistId`. */
  entitySlug?: string;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  selectedTimeSlot?: string | null;
  onSelectTimeSlot?: (timeSlot: string) => void;
  customBlockedDates?: string[];
  tidyCalUrl?: string;
  readOnly?: boolean;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/**
 * Mapea la disponibilidad REAL servida por `/api/calendar/[kind]/[slug]`
 * a las estructuras que consume esta rejilla.
 *
 * SUSTITUYE a `getDeterministicBlockedData`, que inventaba bloqueos con un hash
 * del id y un generador pseudoaleatorio: el artista veía fechas ocupadas que
 * nunca reservó y el cliente veía libres días realmente cerrados.
 */
interface RemoteCalendarPayload {
  ok: boolean;
  blockedDates?: string[];
  reservedSlots?: Record<string, string[]>;
  month?: { days?: Array<{ date: string; fullDayBlocked: boolean; bookedSlots: string[] }> };
}

function mapRemoteAvailability(payload: RemoteCalendarPayload | null): {
  fullBlockedDates: Set<string>;
  partialBookedSlots: Record<string, Set<string>>;
} {
  const fullBlockedDates = new Set<string>();
  const partialBookedSlots: Record<string, Set<string>> = {};
  if (!payload || !payload.ok) return { fullBlockedDates, partialBookedSlots };

  (payload.blockedDates ?? []).forEach((date) => fullBlockedDates.add(date));

  const days = payload.month?.days ?? [];
  for (const day of days) {
    if (day.fullDayBlocked) {
      fullBlockedDates.add(day.date);
      continue;
    }
    if (day.bookedSlots.length === 0) continue;
    const slotIds = new Set<string>();
    for (const startTime of day.bookedSlots) {
      const slot = ROUTE_TIME_SLOTS.find((candidate) => candidate.startTime === startTime);
      if (slot) slotIds.add(slot.id);
    }
    if (slotIds.size >= MAX_ACTIVITIES_PER_DAY) {
      fullBlockedDates.add(day.date);
    } else if (slotIds.size > 0) {
      partialBookedSlots[day.date] = slotIds;
    }
  }

  return { fullBlockedDates, partialBookedSlots };
}

export default function ArtistAvailabilityCalendar({
  artistId,
  artistName,
  entityKind = 'artista',
  entitySlug,
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  customBlockedDates = [],
  tidyCalUrl,
  readOnly = false
}: ArtistAvailabilityCalendarProps) {
  const slug = (entitySlug ?? artistId).trim().toLowerCase();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [remotePayload, setRemotePayload] = useState<RemoteCalendarPayload | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(true);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthParam = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  // CERO FACHADAS: disponibilidad real del motor por entidad (nada inventado).
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    setLoadingAvailability(true);
    fetch(`/api/calendar/${entityKind}/${encodeURIComponent(slug)}?month=${monthParam}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((res) => res.json() as Promise<RemoteCalendarPayload>)
      .then((json) => {
        if (!cancelled) setRemotePayload(json);
      })
      .catch(() => {
        if (!cancelled) setRemotePayload(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingAvailability(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [entityKind, slug, monthParam]);

  // Fechas y franjas bloqueadas (motor + bloqueos puntuales heredados del padre)
  const { fullBlockedDates, partialBookedSlots } = useMemo(() => {
    const mapped = mapRemoteAvailability(remotePayload);
    customBlockedDates.forEach((d) => mapped.fullBlockedDates.add(d));
    return mapped;
  }, [remotePayload, customBlockedDates]);

  // Días del mes y desfase de inicio
  const { daysArray, startOffset } = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return { daysArray: days, startOffset: offset };
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setFeedbackMsg(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setFeedbackMsg(null);
  };

  const handleDayClick = (day: number) => {
    if (readOnly) return;
    const padM = String(currentMonth + 1).padStart(2, '0');
    const padD = String(day).padStart(2, '0');
    const dateString = `${currentYear}-${padM}-${padD}`;

    if (fullBlockedDates.has(dateString)) {
      setFeedbackMsg(`🔒 Día Completo Bloqueado: ${artistName} ya tiene su agenda cerrada para el ${day} de ${MONTH_NAMES[currentMonth]} para garantizar exclusividad y evitar incumplimientos.`);
      return;
    }

    setFeedbackMsg(null);
    onSelectDate(dateString);

    // Auto-seleccionar primer slot libre si hay selector de horas
    if (onSelectTimeSlot) {
      const bookedSlots = partialBookedSlots[dateString] || new Set();
      const firstAvailable = ROUTE_TIME_SLOTS.find((s) => !bookedSlots.has(s.id));
      if (firstAvailable && (!selectedTimeSlot || bookedSlots.has(selectedTimeSlot))) {
        onSelectTimeSlot(firstAvailable.startTime);
      }
    }
  };

  // Franjas ocupadas para la fecha actualmente seleccionada
  const activeDateBookedSlots = useMemo(() => {
    if (!selectedDate) return new Set<string>();
    return partialBookedSlots[selectedDate] || new Set<string>();
  }, [selectedDate, partialBookedSlots]);

  const pasesRestantes = Math.max(0, MAX_ACTIVITIES_PER_DAY - activeDateBookedSlots.size);

  return (
    <div className="w-full bg-[#07070c] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl font-sans space-y-4">
      {/* CABECERA DEL CALENDARIO + SINCRONIZACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#ecb613]" aria-hidden="true" />
          <span className="text-xs font-black uppercase text-white tracking-wider">
            Disponibilidad & Ruta por Horas
          </span>
          <span
            className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${
              loadingAvailability
                ? 'border-slate-700 text-slate-400 animate-pulse'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {loadingAvailability ? 'Sincronizando agenda…' : 'Agenda real'}
          </span>
        </div>

        {/* CONTROLES DE MES */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="text-xs font-bold text-[#ecb613] min-w-[120px] text-center">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* DÍAS DE LA SEMANA */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] uppercase text-slate-500 font-bold">
        {DAY_NAMES.map((name) => (
          <div key={name} className="py-0.5">
            {name}
          </div>
        ))}
      </div>

      {/* REJILLA DE DÍAS DEL MES */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOffset }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-8 sm:h-9 rounded-lg opacity-0 pointer-events-none" />
        ))}

        {daysArray.map((day) => {
          const padM = String(currentMonth + 1).padStart(2, '0');
          const padD = String(day).padStart(2, '0');
          const dateString = `${currentYear}-${padM}-${padD}`;
          const isFullBlocked = fullBlockedDates.has(dateString);
          const hasPartialSlots = Boolean(partialBookedSlots[dateString]);
          const isSelected = selectedDate === dateString;

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isFullBlocked && readOnly}
              aria-pressed={isSelected}
              aria-label={
                isFullBlocked
                  ? `Fecha bloqueada: ${dateString}`
                  : hasPartialSlots
                    ? `Ruta parcial disponible: ${day}`
                    : `Disponible: ${dateString}`
              }
              className={`h-8 sm:h-9 rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center relative ${isSelected
                  ? 'bg-[#ecb613] text-black shadow-[0_0_15px_rgba(236,182,19,0.5)] font-black scale-105 z-10'
                  : isFullBlocked
                    ? 'bg-slate-950 border border-red-950/40 text-slate-600 cursor-not-allowed'
                    : hasPartialSlots
                      ? 'bg-slate-900/90 border border-amber-500/40 text-slate-200 hover:border-[#ecb613]'
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              title={
                isFullBlocked
                  ? `Fecha Completa Bloqueada: ${artistName} ya tiene cupo completo o exclusividad asignada`
                  : hasPartialSlots
                    ? `Ruta activa: Horas disponibles para el ${day}`
                    : `Totalmente disponible: ${dateString}`
              }
            >
              <span>{day}</span>
              {isFullBlocked && (
                <Lock className="w-2 h-2 text-red-500/70 absolute top-0.5 right-0.5" aria-hidden="true" />
              )}
              {hasPartialSlots && !isSelected && !isFullBlocked && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613] absolute bottom-1" />
              )}
              {isSelected && (
                <CheckCircle2 className="w-2 h-2 text-black absolute top-0.5 right-0.5" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {/* FEEDBACK ERROR DE DÍA BLOQUEADO */}
      {feedbackMsg && (
        <div role="alert" className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-mono flex items-start gap-2 animate-fadeIn">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ⏰ SELECTOR DE TRAMOS HORARIOS POR RUTA (SE DESPLIEGA AL PULSAR LA FECHA) */}
      {selectedDate && onSelectTimeSlot && (
        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
            <span className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ecb613]" aria-hidden="true" />
              <span>Franja Horaria del Pase ({selectedDate})</span>
            </span>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-emerald-400">
                🟢 {pasesRestantes} pases libres hoy (Tope {MAX_ACTIVITIES_PER_DAY}/día)
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400">+{LOGISTICS_BUFFER_MINUTES} min buffer logístico</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono">
            {ROUTE_TIME_SLOTS.map((slot) => {
              const isSlotBooked = activeDateBookedSlots.has(slot.id);
              const isSlotSelected = selectedTimeSlot === slot.startTime || selectedTimeSlot === slot.timeRange;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isSlotBooked}
                  onClick={() => onSelectTimeSlot(slot.startTime)}
                  aria-pressed={isSlotSelected}
                  aria-label={`${slot.label} (${slot.timeRange})${isSlotBooked ? ', ocupado' : ', disponible'}`}
                  className={`p-2.5 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between gap-1.5 ${isSlotSelected
                      ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-[0_0_15px_rgba(236,182,19,0.35)] scale-[1.02] z-10'
                      : isSlotBooked
                        ? 'bg-slate-950/80 border-red-950/40 text-slate-600 cursor-not-allowed opacity-60'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-500/60 hover:text-white'
                    }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      {slot.period === 'manana' ? (
                        <Sun className={`w-3.5 h-3.5 ${isSlotSelected ? 'text-black' : isSlotBooked ? 'text-red-900' : 'text-amber-400'}`} aria-hidden="true" />
                      ) : slot.period === 'tarde' ? (
                        <Sunset className={`w-3.5 h-3.5 ${isSlotSelected ? 'text-black' : isSlotBooked ? 'text-red-900' : 'text-orange-400'}`} aria-hidden="true" />
                      ) : (
                        <Moon className={`w-3.5 h-3.5 ${isSlotSelected ? 'text-black' : isSlotBooked ? 'text-red-900' : 'text-indigo-400'}`} aria-hidden="true" />
                      )}
                      <span className="font-extrabold text-sm">
                        {isSlotBooked ? `🔒 ${slot.startTime} (Ocupado)` : isSlotSelected ? `🎯 ${slot.startTime}` : `🟢 ${slot.startTime} (Disponible)`}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isSlotSelected
                        ? 'bg-black/20 text-black font-black'
                        : isSlotBooked
                          ? 'bg-red-950/40 text-red-500/80 line-through'
                          : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                      }`}>
                      {isSlotBooked ? 'Ocupado' : slot.timeRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full text-[10px]">
                    <span className={isSlotSelected ? 'text-black/80 font-bold' : isSlotBooked ? 'text-slate-600 line-through' : 'text-slate-400'}>
                      {slot.label}
                    </span>
                    <span className={isSlotSelected ? 'text-black/70' : isSlotBooked ? 'text-red-500/60' : 'text-slate-500'}>
                      +{LOGISTICS_BUFFER_MINUTES}m buffer
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CONFIRMACIÓN DE SELECCIÓN FINAL */}
      {selectedDate && (
        <div className="p-2.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-xl text-[#ecb613] text-xs font-mono flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pase fijado: <strong>{selectedDate}</strong> {selectedTimeSlot ? `a las ${selectedTimeSlot} hrs` : ''}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Libre para Bloqueo 100€
          </span>
        </div>
      )}

      {/* LEYENDA Y ENLACE DE SINCRONIZACIÓN SOBERANA CON TIDYCAL */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 font-mono text-[10px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-700" /> Libre
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ecb613]" /> Ruta parcial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-950 border border-red-500/50" /> 🔒 Bloqueado
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={buildEntityCalendarHref(entityKind, slug, { intent: 'bloquear' })}
            className="text-[10px] text-[#ecb613] hover:text-white transition flex items-center gap-1 font-bold"
            title={`Abrir la agenda completa de ${artistName}`}
          >
            <span>Agenda de {artistName}</span>
            <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
          </a>
          <a
            href={buildEntityIcalHref(entityKind, slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-[#ecb613] transition flex items-center gap-1"
            title="Feed iCal propio de esta entidad (Google/Apple Calendar)"
          >
            <span>iCal propio</span>
            <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
          </a>
          {tidyCalUrl && (
            <a
              href={tidyCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-500 hover:text-slate-300 transition flex items-center gap-1"
              title="TidyCal del profesional (reuniones comerciales)"
            >
              <span>TidyCal</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

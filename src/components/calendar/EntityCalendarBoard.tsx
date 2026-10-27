'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

import type {
  CalendarEntityKind,
  EntityDayAvailability,
} from '@/lib/calendar/entity-calendar-types';
import {
  CALENDAR_MAX_SERVICES_PER_DAY,
  CALENDAR_TIME_SLOTS,
  getCalendarEntityKindMeta,
} from '@/lib/calendar/entity-calendar-types';

export interface EntityCalendarPayload {
  ok: boolean;
  entity: {
    kind: CalendarEntityKind;
    slug: string;
    displayName: string;
    source: 'artist' | 'provider' | 'unresolved';
    category: string | null;
  };
  summary: {
    blockedCount: number;
    confirmedCount: number;
    dailyCapacity: number;
    occupancyPercent: number;
    nextFreeDate: string | null;
  };
  month: {
    year: number;
    monthIndex: number;
    monthName: string;
    days: EntityDayAvailability[];
  };
  blockedDates: string[];
  confirmedDates: string[];
  reservedSlots: Record<string, string[]>;
  icalUrl: string;
  externalIcalUrl: string | null;
  updatedAt: string;
  today: string;
}

interface EntityCalendarBoardProps {
  kind: CalendarEntityKind;
  slug: string;
  canMutate: boolean;
  initialDate?: string | null;
  initialSlot?: string | null;
  initialIntent?: 'bloquear' | 'ver' | null;
}

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function monthKey(year: number, monthIndex: number): string {
  return `${year}-${pad(monthIndex + 1)}`;
}

function statusStyles(status: EntityDayAvailability['status']): string {
  switch (status) {
    case 'LIBRE':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/60';
    case 'PARCIAL':
      return 'border-[#ecb613]/40 bg-[#ecb613]/10 text-[#f5d273] hover:border-[#ecb613]';
    case 'BLOQUEADO':
      return 'border-rose-500/40 bg-rose-500/10 text-rose-300';
    default:
      return 'border-white/5 bg-white/[0.02] text-white/20';
  }
}


export default function EntityCalendarBoard({
  kind,
  slug,
  canMutate,
  initialDate = null,
  initialSlot = null,
}: EntityCalendarBoardProps) {
  const meta = getCalendarEntityKindMeta(kind);

  const [cursor, setCursor] = useState<{ year: number; monthIndex: number }>(() => {
    const base =
      initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)
        ? new Date(`${initialDate}T00:00:00`)
        : new Date();
    return { year: base.getFullYear(), monthIndex: base.getMonth() };
  });
  const [payload, setPayload] = useState<EntityCalendarPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(initialSlot);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/calendar/${kind}/${encodeURIComponent(slug)}?month=${monthKey(cursor.year, cursor.monthIndex)}`,
        { cache: 'no-store' },
      );
      const json = (await res.json()) as EntityCalendarPayload & { error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'No se pudo cargar el calendario.');
        return;
      }
      setPayload(json);
    } catch {
      setError('Fallo de red al consultar la disponibilidad.');
    } finally {
      setLoading(false);
    }
  }, [kind, slug, cursor.year, cursor.monthIndex]);

  useEffect(() => {
    void load();
  }, [load]);

  const mutate = useCallback(
    async (body: Record<string, unknown>): Promise<boolean> => {
      setPendingAction(String(body.action ?? 'mutation'));
      setFeedback(null);
      try {
        const res = await fetch(`/api/calendar/${kind}/${encodeURIComponent(slug)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setFeedback(json.error ?? 'Operación rechazada por el motor de disponibilidad.');
          return false;
        }
        await load();
        return true;
      } catch {
        setFeedback('Fallo de red al guardar el cambio.');
        return false;
      } finally {
        setPendingAction(null);
      }
    },
    [kind, slug, load],
  );

  const days = payload?.month.days ?? [];
  const leadingBlanks = useMemo(() => {
    const firstWeekday = (new Date(cursor.year, cursor.monthIndex, 1).getDay() + 6) % 7;
    return Array.from({ length: firstWeekday }, (_, index) => index);
  }, [cursor.year, cursor.monthIndex]);

  const selectedDay = useMemo(
    () => days.find((day) => day.date === selectedDate) ?? null,
    [days, selectedDate],
  );

  const shiftMonth = (delta: number): void => {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.monthIndex + delta, 1);
      return { year: next.getFullYear(), monthIndex: next.getMonth() };
    });
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border"
              style={{ borderColor: `${meta.accent}55`, color: meta.accent, backgroundColor: `${meta.accent}14` }}
            >
              <CalendarDays size={12} /> Agenda privada · {meta.label}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {payload?.entity.displayName ?? slug.replace(/-/g, ' ')}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {canMutate
                ? 'Eres el titular de esta agenda: puedes bloquear días y franjas en tiempo real.'
                : 'Disponibilidad pública en vivo. Cada profesional gestiona su propio calendario.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={payload?.icalUrl ?? `/api/calendar/${kind}/${encodeURIComponent(slug)}/ical`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 transition-all duration-300 ease-out"
            >
              <ExternalLink size={12} /> Feed iCal real
            </a>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 transition-all duration-300 ease-out"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refrescar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { label: 'Días bloqueados', value: String(payload?.summary.blockedCount ?? 0) },
            { label: 'Reservas confirmadas', value: String(payload?.summary.confirmedCount ?? 0) },
            { label: 'Tope diario', value: `${CALENDAR_MAX_SERVICES_PER_DAY} pases` },
            { label: 'Próxima fecha libre', value: payload?.summary.nextFreeDate ?? '—' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-black/40 border border-white/5 p-3">
              <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{stat.label}</div>
              <div className="text-sm font-bold text-white mt-1">{stat.value}</div>
            </div>
          ))}
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-mono text-rose-300">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-center">
              <div className="text-sm font-black text-white uppercase tracking-widest">
                {payload?.month.monthName ?? '—'} {cursor.year}
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                {loading ? 'Consultando motor ACID…' : `${days.filter((d) => d.status === 'LIBRE').length} días libres`}
              </div>
            </div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              aria-label="Mes siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>


          <div className="grid grid-cols-7 gap-1 text-center">
            {DAY_LABELS.map((label) => (
              <div key={label} className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 py-1">
                {label}
              </div>
            ))}
            {leadingBlanks.map((blank) => (
              <div key={`blank-${blank}`} />
            ))}
            {days.map((day) => {
              const dayNumber = Number(day.date.slice(8, 10));
              const isSelected = selectedDate === day.date;
              const isToday = payload?.today === day.date;
              return (
                <button
                  key={day.date}
                  type="button"
                  disabled={day.status === 'PASADO'}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedSlot(null);
                    setFeedback(null);
                  }}
                  className={`relative aspect-square rounded-xl border text-xs font-bold transition-all duration-300 ease-out ${statusStyles(day.status)} ${
                    isSelected ? 'ring-2 ring-[#ecb613] ring-offset-2 ring-offset-[#09090d]' : ''
                  }`}
                  aria-label={`${day.date} · ${day.status}`}
                >
                  {dayNumber}
                  {isToday && (
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ecb613]" />
                  )}
                  {day.status === 'BLOQUEADO' && <Lock size={9} className="absolute bottom-1 right-1" />}
                  {day.bookedSlots.length > 0 && day.status !== 'BLOQUEADO' && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-mono text-[#ecb613]">
                      {day.bookedSlots.length}/{CALENDAR_MAX_SERVICES_PER_DAY}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-emerald-500/40" /> Libre</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-[#ecb613]/50" /> Ruta parcial</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-rose-500/50" /> Bloqueado</span>
          </div>
        </div>

        <aside className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Franjas del día</h3>
            <span className="text-[10px] font-mono text-zinc-500">{selectedDate ?? 'Selecciona un día'}</span>
          </div>

          {!selectedDay && (
            <p className="text-xs text-zinc-400 font-mono">
              Elige un día del calendario para ver las {CALENDAR_TIME_SLOTS.length} franjas canónicas y su estado real.
            </p>
          )}

          {selectedDay && (
            <>
              <div className="rounded-2xl bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-zinc-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Estado</span>
                  <span className="font-bold text-white">{selectedDay.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ocupadas</span>
                  <span className="font-bold text-[#ecb613]">
                    {selectedDay.bookedSlots.length}/{CALENDAR_MAX_SERVICES_PER_DAY}
                  </span>
                </div>
                {selectedDay.reason && <p className="text-rose-300">{selectedDay.reason}</p>}
              </div>

              {canMutate && (
                <button
                  type="button"
                  disabled={pendingAction !== null || selectedDay.status === 'PASADO'}
                  onClick={() =>
                    void mutate({
                      action: selectedDay.fullDayBlocked ? 'unblock' : 'block',
                      date: selectedDay.date,
                    }).then((ok) => {
                      if (ok) {
                        setFeedback(
                          selectedDay.fullDayBlocked
                            ? 'Día desbloqueado en tu agenda.'
                            : 'Día bloqueado en tu agenda. Ya no recibirá reservas.',
                        );
                      }
                    })
                  }
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ease-out ${
                    selectedDay.fullDayBlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-[#FF2B44]/15 text-[#FF2B44] border border-[#FF2B44]/40 hover:bg-[#FF2B44]/25'
                  }`}
                >
                  {selectedDay.fullDayBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                  {selectedDay.fullDayBlocked ? 'Desbloquear este día' : 'Bloquear este día completo'}
                </button>
              )}

              <div className="space-y-2">
                {CALENDAR_TIME_SLOTS.map((slot) => {
                  const isBooked = selectedDay?.bookedSlots.includes(slot.startTime) ?? false;
                  const isSelected = selectedSlot === slot.startTime;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!selectedDay || selectedDay.fullDayBlocked || selectedDay.status === 'PASADO'}
                      onClick={() => setSelectedSlot(slot.startTime)}
                      className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-300 ease-out ${
                        isSelected
                          ? 'border-[#ecb613] bg-[#ecb613]/15'
                          : isBooked
                            ? 'border-rose-500/30 bg-rose-500/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-[#ecb613]/50'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-[11px] font-mono text-white">
                        <Clock size={12} className={isBooked ? 'text-rose-400' : 'text-[#ecb613]'} />
                        {slot.startTime} · {slot.label}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                          isBooked ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isBooked ? 'Reservada' : 'Libre'}
                      </span>
                    </button>
                  );
                })}
              </div>


              {canMutate && selectedSlot && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={pendingAction !== null}
                    onClick={() =>
                      void mutate({
                        action: 'reserve',
                        date: selectedDay?.date,
                        timeSlot: selectedSlot,
                      }).then((ok) => {
                        if (ok) setFeedback(`Franja ${selectedSlot} reservada en tu agenda.`);
                      })
                    }
                    className="py-2.5 rounded-xl bg-[#ecb613] text-black font-bold font-mono text-[11px] hover:bg-[#f5d273] transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={13} /> Reservar
                  </button>
                  <button
                    type="button"
                    disabled={pendingAction !== null}
                    onClick={() =>
                      void mutate({
                        action: 'release',
                        date: selectedDay?.date,
                        timeSlot: selectedSlot,
                      }).then((ok) => {
                        if (ok) setFeedback(`Franja ${selectedSlot} liberada.`);
                      })
                    }
                    className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold font-mono text-[11px] hover:bg-white/10 transition-all"
                  >
                    Liberar
                  </button>
                </div>
              )}
            </>
          )}

          {feedback && (
            <div className="flex items-start gap-2 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 p-3 text-[11px] font-mono text-[#f5d273]">
              <Sparkles size={13} className="mt-0.5 shrink-0" /> {feedback}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}



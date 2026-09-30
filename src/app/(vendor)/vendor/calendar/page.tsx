'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Lock, Unlock, Copy, Check, Link2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getVendorCalendarAction,
  toggleDateBlockAction,
  exportIcalUrlAction,
  syncExternalIcalAction
} from '@/app/actions/vendorCalendarActions';

export default function VendorCalendarPage() {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [externalIcalUrl, setExternalIcalUrl] = useState('');
  const [icalFeedUrl, setIcalFeedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    const data = await getVendorCalendarAction('edwin-agudelo');
    setBlockedDates(data.blockedDates);
    if (data.externalIcalUrl) setExternalIcalUrl(data.externalIcalUrl);

    const ical = await exportIcalUrlAction('edwin-agudelo');
    setIcalFeedUrl(ical.icalUrl);
  };

  const handleToggleDate = async (dateStr: string) => {
    const res = await toggleDateBlockAction('edwin-agudelo', dateStr);
    if (res.success) {
      setBlockedDates(res.blockedDates);
    }
  };

  const handleSyncIcal = async () => {
    if (!externalIcalUrl.trim()) return;
    await syncExternalIcalAction('edwin-agudelo', externalIcalUrl);
  };

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(icalFeedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Generar los días del mes actual
  const daysInMonth = useMemo(() => {
    const days: { date: string; dayNum: number; isToday: boolean; isPast: boolean }[] = [];
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = dateObj.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayNum: d,
        isToday: dateStr === today,
        isPast: dateObj < new Date(new Date().setHours(0, 0, 0, 0))
      });
    }
    return days;
  }, [currentMonth, currentYear]);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else { setCurrentMonth(m => m - 1); }
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else { setCurrentMonth(m => m + 1); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <header className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
          <CalendarDays size={12} />
          <span>Sincronización iCal Bidireccional · Google / Apple Calendar</span>
        </div>
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">Disponibilidad & Price-Lock 72h</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Bloquea fechas con 1 clic. Las parejas disponen de 72 horas con fianza de 100 € para confirmar.
        </p>
      </header>

      {/* Navegación de Mes */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold font-syne text-white">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Grid del Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
          <div key={d} className="text-center text-[10px] font-mono text-zinc-500 uppercase pb-2">{d}</div>
        ))}

        {/* Offset para el primer día del mes */}
        {Array.from({ length: (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {daysInMonth.map((day) => {
          const isBlocked = blockedDates.includes(day.date);
          return (
            <button
              key={day.date}
              onClick={() => !day.isPast && handleToggleDate(day.date)}
              disabled={day.isPast}
              className={`
                relative p-3 rounded-2xl text-center font-mono text-sm font-bold transition-all
                ${day.isPast ? 'opacity-30 cursor-not-allowed bg-white/5 text-zinc-600' : ''}
                ${day.isToday ? 'ring-2 ring-[#ecb613]' : ''}
                ${isBlocked && !day.isPast ? 'bg-[#FF2B44]/20 border border-[#FF2B44]/40 text-[#FF2B44] hover:bg-[#FF2B44]/30' : ''}
                ${!isBlocked && !day.isPast ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : ''}
              `}
            >
              {day.dayNum}
              {isBlocked && !day.isPast && <Lock size={10} className="absolute top-1 right-1 text-[#FF2B44]" />}
              {!isBlocked && !day.isPast && <Unlock size={10} className="absolute top-1 right-1 text-emerald-500/40" />}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" /> Disponible</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF2B44]/30 border border-[#FF2B44]/40" /> Bloqueado / Reservado</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded ring-2 ring-[#ecb613]" /> Hoy</span>
      </div>

      {/* Exportación e Importación iCal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Exportar */}
        <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
            <Link2 size={14} className="text-[#ecb613]" />
            <span>Exportar a Google / Apple Calendar</span>
          </h3>
          <p className="text-[11px] text-zinc-400 font-light">Copia este enlace iCal en tu aplicación de calendario para sincronizar fechas bloqueadas en tiempo real.</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={icalFeedUrl}
              readOnly
              className="flex-1 bg-black/60 border border-white/10 rounded-xl p-3 text-white text-[11px] font-mono"
            />
            <button
              onClick={handleCopyFeed}
              className={`px-4 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-1 transition-all ${
                copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#ecb613] text-black hover:bg-amber-400'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Importar */}
        <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
            <RefreshCw size={14} className="text-blue-400" />
            <span>Importar Calendario Externo</span>
          </h3>
          <p className="text-[11px] text-zinc-400 font-light">Pega la URL .ics de tu Google Calendar personal para importar las fechas ya ocupadas.</p>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={externalIcalUrl}
              onChange={(e) => setExternalIcalUrl(e.target.value)}
              placeholder="https://calendar.google.com/calendar/ical/..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl p-3 text-white text-[11px] font-mono"
            />
            <button
              onClick={handleSyncIcal}
              className="px-4 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono text-xs font-bold hover:bg-blue-500/30"
            >
              Sincronizar
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

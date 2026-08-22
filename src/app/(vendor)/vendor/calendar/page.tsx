import React from 'react';
import { CalendarDays, Lock } from 'lucide-react';

export default function VendorCalendarPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">Disponibilidad & Price-Lock 72h</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Gestiona las fechas reservadas y los bloqueos temporales de presupuestos.
        </p>
      </header>

      <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] font-bold">
          <Lock size={14} />
          <span>GARANTÍA DE BLOQUEO DE FECHA (PRICE-LOCK)</span>
        </div>
        <p className="text-xs text-zinc-300 font-light leading-relaxed">
          Las parejas disponen de un periodo de 72 horas con fianza de 10 € para confirmar su reserva antes de liberar la fecha en el catálogo público.
        </p>
      </div>
    </div>
  );
}

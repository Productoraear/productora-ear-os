'use client';

import React from 'react';
import { Sparkles, Clock, ShieldCheck } from 'lucide-react';

export interface AnticipationWidgetProps {
  vertical?: string;
  intent?: string;
  category?: string;
  leadTimeDays?: number;
}

export const AnticipationWidget: React.FC<AnticipationWidgetProps> = ({
  vertical,
  intent,
  category = 'Producción y Espectáculos',
  leadTimeDays = 21
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613]">
          <Clock size={20} />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
            Antelación Recomendada: {leadTimeDays} días
          </span>
          <span className="text-[10px] text-zinc-400">
            Bloqueo de fechas prioritarias para {vertical || category}
          </span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
        <ShieldCheck size={14} />
        <span>Disponibilidad Activa</span>
      </div>
    </div>
  );
};

export default AnticipationWidget;

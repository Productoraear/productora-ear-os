'use client';

import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Filter,
  DollarSign,
  Users,
} from 'lucide-react';

type BookingStatus = 'CONFIRMADO' | 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO';
type FilterType = 'todos' | 'CONFIRMADO' | 'PENDIENTE' | 'COMPLETADO';

interface Booking {
  id: string;
  eventDate: string;
  eventType: string;
  clientName: string;
  location: string;
  fee: number;
  status: BookingStatus;
  pax: number;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK-2026-0091', eventDate: '2026-09-20', eventType: 'Boda de Gala', clientName: 'María & Carlos', location: 'Finca El Olivar, Toledo', fee: 280, status: 'CONFIRMADO', pax: 180 },
  { id: 'BK-2026-0092', eventDate: '2026-09-27', eventType: 'Gala Benéfica', clientName: 'Fundación Esperanza', location: 'Hotel Palace, Madrid', fee: 350, status: 'CONFIRMADO', pax: 250 },
  { id: 'BK-2026-0093', eventDate: '2026-10-05', eventType: 'Evento Corporativo', clientName: 'Deloitte España', location: 'IFEMA, Madrid', fee: 450, status: 'PENDIENTE', pax: 400 },
  { id: 'BK-2026-0088', eventDate: '2026-08-15', eventType: 'Boda Íntima', clientName: 'Ana & Pablo', location: 'Cigarral de las Mercedes, Toledo', fee: 350, status: 'COMPLETADO', pax: 60 },
  { id: 'BK-2026-0085', eventDate: '2026-08-01', eventType: 'Sesión VIMUME', clientName: 'Residencia La Paz', location: 'Getafe, Madrid', fee: 280, status: 'COMPLETADO', pax: 30 },
];

const statusConfig: Record<BookingStatus, { color: string; bg: string; border: string; label: string }> = {
  CONFIRMADO: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Confirmado' },
  PENDIENTE: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Pendiente' },
  COMPLETADO: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'Completado' },
  CANCELADO: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Cancelado' },
};

export default function ArtistBookingsPage() {
  const [filter, setFilter] = useState<FilterType>('todos');

  const filtered = filter === 'todos' ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === filter);
  const totalRevenue = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETADO').reduce((sum, b) => sum + b.fee, 0);
  const upcomingCount = MOCK_BOOKINGS.filter(b => b.status === 'CONFIRMADO' || b.status === 'PENDIENTE').length;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Bookings & Giras</h1>
          <p className="text-white/40 text-sm font-medium italic">Calendario de actuaciones, estado de pagos y logística.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Próximos</span>
            <span className="text-2xl font-black text-[#ecb613]">{upcomingCount}</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Facturado</span>
            <span className="text-2xl font-black text-emerald-400">{totalRevenue} €</span>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 items-center">
        <Filter size={14} className="text-white/30" />
        {(['todos', 'CONFIRMADO', 'PENDIENTE', 'COMPLETADO'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
              filter === f
                ? 'bg-[#ecb613] text-black'
                : 'bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            {f === 'todos' ? 'Todos' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* BOOKINGS LIST */}
      <div className="space-y-4">
        {filtered.map(booking => {
          const cfg = statusConfig[booking.status];
          return (
            <div key={booking.id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:border-[#ecb613]/20 transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex gap-6">
                  {/* DATE BADGE */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center min-w-[80px]">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">
                      {new Date(booking.eventDate).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="text-3xl font-black text-white">{new Date(booking.eventDate).getDate()}</span>
                  </div>

                  {/* EVENT INFO */}
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition">{booking.eventType}</h3>
                    <p className="text-xs text-white/40 font-bold mt-1">{booking.clientName}</p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] text-white/30">
                      <span className="flex items-center gap-1"><MapPin size={10} /> {booking.location}</span>
                      <span className="flex items-center gap-1"><Users size={10} /> {booking.pax} PAX</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {booking.eventDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* FEE */}
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block">Caché Neto (80%)</span>
                    <span className="text-xl font-black text-[#ecb613]">{booking.fee} €</span>
                  </div>

                  {/* STATUS */}
                  <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                    {booking.status === 'CONFIRMADO' && <CheckCircle2 size={10} className="inline mr-1" />}
                    {booking.status === 'PENDIENTE' && <AlertCircle size={10} className="inline mr-1" />}
                    {cfg.label}
                  </div>
                </div>
              </div>

              {/* BOOKING ID */}
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-white/20">{booking.id}</span>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]/60 hover:text-[#ecb613] transition flex items-center gap-1">
                  Detalles <ArrowUpRight size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export interface ArtistBookingFlowProps {
  city?: string;
  eventType?: string;
}

export const ArtistBookingFlow: React.FC<ArtistBookingFlowProps> = ({ city, eventType }) => {
  const [selectedPack, setSelectedPack] = useState<'BASIC' | 'PREMIUM' | 'ROYAL'>('BASIC');
  const [eventDate, setEventDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[3.5rem] p-8 md:p-12 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/5 blur-[90px] rounded-full pointer-events-none" />

      <div>
        <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.25em] mb-2 block flex items-center gap-1.5">
          <Sparkles size={14} /> Reserva Instantánea S-Class
        </span>
        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-syne">Bloquear Fecha Oficial</h3>
        <p className="text-white/40 text-xs font-bold leading-relaxed mt-1">
          {city && eventType 
            ? `Bloquea tu fecha preferente para tu show de ${eventType} en ${city} con un depósito de seguridad de 100€.`
            : 'Bloquea tu fecha preferente con un depósito de seguridad de 100€ deducible del caché total.'}
        </p>
      </div>

      {success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center space-y-4">
          <ShieldCheck className="text-emerald-400 mx-auto" size={44} />
          <h4 className="text-xl font-black uppercase text-white tracking-tight">¡Fecha Bloqueada con Éxito!</h4>
          <p className="text-white/40 text-xs max-w-sm mx-auto leading-relaxed">
            Se ha registrado tu pre-reserva de fecha para el {eventDate} {eventType && city ? `para tu espectáculo de ${eventType} en ${city}` : ''}. Nuestro manager de booking se pondrá en contacto en menos de 2 horas.
          </p>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-6 pt-4 border-t border-white/5">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Fecha del Evento</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold font-mono focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Esquema Seleccionado</label>
              <div className="flex gap-2">
                {(['BASIC', 'PREMIUM', 'ROYAL'] as const).map((pack) => (
                  <button
                    key={pack}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      selectedPack === pack 
                        ? 'bg-white text-black' 
                        : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                    }`}
                  >
                    {pack}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ecb613] text-black font-black uppercase tracking-[0.25em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#ecb613]/5 disabled:opacity-60"
          >
            <CreditCard size={14} /> {loading ? 'Procesando Transacción...' : 'Pagar Depósito de Garantía (100€)'}
          </button>
        </form>
      )}
    </div>
  );
};

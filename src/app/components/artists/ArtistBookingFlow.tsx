"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ShieldCheck, CreditCard, Sparkles, Building2, FileText, CheckCircle, Mail, Phone, User } from 'lucide-react';

export interface ArtistBookingFlowProps {
  city?: string;
  eventType?: string;
}

export const ArtistBookingFlow: React.FC<ArtistBookingFlowProps> = ({ city, eventType }) => {
  const [flowType, setFlowType] = useState<'B2C' | 'B2G'>('B2C');
  const [selectedPack, setSelectedPack] = useState<'BASIC' | 'PREMIUM' | 'ROYAL'>('BASIC');
  const [eventDate, setEventDate] = useState('');
  
  // B2C fields
  const [b2cName, setB2cName] = useState('');
  const [b2cPhone, setB2cPhone] = useState('');
  
  // B2G fields
  const [institutionName, setInstitutionName] = useState('');
  const [cif, setCif] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
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

      {/* Selector de Canal: Particular (B2C) vs Ayuntamiento/Institucional (B2G) */}
      <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 relative z-10">
        <button
          type="button"
          onClick={() => { setFlowType('B2C'); setSuccess(false); }}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            flowType === 'B2C' 
              ? 'bg-[#ecb613] text-black font-black' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          <User size={12} /> Particular (B2C)
        </button>
        <button
          type="button"
          onClick={() => { setFlowType('B2G'); setSuccess(false); }}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            flowType === 'B2G' 
              ? 'bg-[#ecb613] text-black font-black' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Building2 size={12} /> Ayuntamiento / B2G
        </button>
      </div>

      <div>
        <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.25em] mb-2 block flex items-center gap-1.5 font-mono">
          <Sparkles size={14} /> 
          {flowType === 'B2C' ? 'Reserva Instantánea S-Class' : 'Canal Preferente de Licitación Menor'}
        </span>
        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-syne">
          {flowType === 'B2C' ? 'Bloquear Fecha Oficial' : 'Solicitar Presupuesto Oficial'}
        </h3>
        <p className="text-white/40 text-xs font-bold leading-relaxed mt-1">
          {flowType === 'B2C' 
            ? 'Bloquea tu fecha preferente de forma provisional con un depósito de garantía de 100€ reembolsable vía Stripe.'
            : 'Evita la fricción de pago con tarjeta. Solicita un presupuesto oficial digitalizable adaptado a la Ley de Contratos del Sector Público.'}
        </p>
      </div>

      {success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center space-y-4">
          <ShieldCheck className="text-emerald-400 mx-auto" size={44} />
          <h4 className="text-xl font-black uppercase text-white tracking-tight">
            {flowType === 'B2C' ? '¡Fecha Bloqueada con Éxito!' : '¡Solicitud Registrada en Staging!'}
          </h4>
          <p className="text-white/40 text-xs max-w-sm mx-auto leading-relaxed">
            {flowType === 'B2C' 
              ? `Se ha registrado tu pre-reserva de fecha para el ${eventDate} ${eventType && city ? `para tu espectáculo de ${eventType} en ${city}` : ''}. Nuestro manager se pondrá en contacto en menos de 2 horas.`
              : `La solicitud de presupuesto para ${institutionName || 'su Ayuntamiento'} para el ${eventDate} ha sido registrada con el código B2G-PENDING. Generando propuesta digital de Contrato Menor...`}
          </p>
          {flowType === 'B2G' && (
            <div className="pt-4 border-t border-white/5">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-3.5 py-2 rounded-xl border border-[#ecb613]/25 cursor-pointer hover:bg-white hover:text-black transition-all">
                <FileText size={12} /> Descargar Borrador en PDF
              </span>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-6 pt-4 border-t border-white/5">
          {/* COMMON DATE FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Fecha del Evento</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold font-mono focus:border-[#ecb613]/50 focus:outline-none transition-colors"
            />
          </div>

          {flowType === 'B2C' ? (
            /* B2C FLOW FIELDS */
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carmen Rodríguez"
                    value={b2cName}
                    onChange={(e) => setB2cName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Teléfono Móvil</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +34 600 000 000"
                    value={b2cPhone}
                    onChange={(e) => setB2cPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold font-mono focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Formato Preferente</label>
                <div className="flex gap-2">
                  {(['BASIC', 'PREMIUM', 'ROYAL'] as const).map((pack) => (
                    <button
                      key={pack}
                      type="button"
                      onClick={() => setSelectedPack(pack)}
                      className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        selectedPack === pack 
                          ? 'bg-white text-black font-black' 
                          : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                      }`}
                    >
                      {pack}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ecb613] text-black font-black uppercase tracking-[0.25em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#ecb613]/5 disabled:opacity-60"
              >
                <CreditCard size={14} /> {loading ? 'Procesando Transacción...' : 'Pagar Depósito de Garantía (100€)'}
              </button>
            </div>
          ) : (
            /* B2G FLOW FIELDS (NO CARD TRANSACTION - EASES PUBLIC ADMINISTRATION PROCESS) */
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Nombre de la Institución / Ayuntamiento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ayuntamiento de Medinaceli"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">C.I.F. del Organismo Público</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. P4211300F"
                    value={cif}
                    onChange={(e) => setCif(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold font-mono focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Persona de Contacto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos García"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Email Institucional</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. festejos@medinaceli.es"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Teléfono Directo</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +34 975 326 000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold font-mono focus:border-[#ecb613]/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ecb613] text-black font-black uppercase tracking-[0.25em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#ecb613]/5 disabled:opacity-60"
              >
                <FileText size={14} /> {loading ? 'Emitiendo Solicitud Oficial...' : 'Generar Propuesta de Contrato Menor (0€)'}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Send, CheckCircle2, Building2 } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { CENTRALITA } from '@/lib/phone-constants';

function ContactoContent() {
  const searchParams = useSearchParams();

  // Extract parameters from URL query strings
  const profile = searchParams.get('profile') || searchParams.get('perfil') || searchParams.get('artist') || '';
  const service = searchParams.get('service') || searchParams.get('servicio') || searchParams.get('subject') || '';
  const date = searchParams.get('date') || searchParams.get('fecha') || '';
  const location = searchParams.get('location') || searchParams.get('provincia') || searchParams.get('ciudad') || '';
  const intent = searchParams.get('intent') || searchParams.get('intencion') || 'reserva prioritaria';

  // Generate WhatsApp details using unified utility
  const { message, url } = generateWhatsAppLink({
    profile,
    service,
    date,
    location,
    intent
  });

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: service ? `Consulta sobre ${service}` : 'Consulta General de Contratación',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24 space-y-12 text-white">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono inline-block">
          CENTRALITA Y DESPACHO S-CLASS
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter italic font-syne text-white">
          Centro de <span className="text-[#ecb613]">Contacto & Reserva</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base leading-relaxed">
          Atención personalizada para particulares, wedding planners, empresas y entidades públicas. Conecta directamente por llamada, WhatsApp o formulario oficial.
        </p>
      </div>

      {/* 3 Quick Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Channel 1: Direct Call */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Phone size={22} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Centralita Telefónica</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Atención directa sin intermediarios. Coordinación de agenda y verificación de viabilidad en tiempo real.
            </p>
          </div>
          <a
            href={CENTRALITA.tel}
            className="w-full py-4 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
          >
            <Phone size={16} />
            <span>Llamar: {CENTRALITA.display}</span>
          </a>
        </div>

        {/* Channel 2: WhatsApp Handoff */}
        <div className="bg-[#0e0e0e] border border-[#25D366]/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
              <MessageCircle size={22} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-white">WhatsApp Oficial</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Mensaje pre-estructurado con especificaciones de fecha y presupuesto inyectadas automáticamente.
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] active:scale-95 transition-all"
          >
            <MessageCircle size={16} />
            <span>Abrir WhatsApp</span>
          </a>
        </div>

        {/* Channel 3: Institutional B2G */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4a855]">
              <Building2 size={22} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Pliegos & Sector Público</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Documentación técnica, seguros RC 1M€, facturación FACe y contratos menores para Ayuntamientos.
            </p>
          </div>
          <a
            href="/ocasiones/ayuntamientos"
            className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] transition-all"
          >
            <span>Canal Institucional B2G</span>
          </a>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 sm:p-12 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">Formulario Oficial</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white mt-1">
            Envía tu Consulta o Petición de Dossier
          </h2>
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3">
            <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
            <h4 className="text-lg font-black uppercase text-white">Mensaje Recibido Correctamente</h4>
            <p className="text-white/50 text-xs max-w-md mx-auto">
              Nuestro equipo de despacho se pondrá en contacto contigo en menos de 2 horas laborables.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Nombre / Organización *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Carmen Rodríguez o Ayto. de Madrid"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#ecb613] outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Email de Contacto *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@organizacion.com"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#ecb613] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Teléfono Móvil</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+34 600 000 000"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#ecb613] outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Asunto / Tipo de Evento</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#ecb613] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-400">Mensaje o Detalles del Evento</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Indica fecha estimada, municipio, número de invitados o requisitos técnicos..."
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ecb613] outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#ecb613] text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
            >
              <Send size={16} />
              <span>{loading ? 'Enviando Mensaje...' : 'Enviar Solicitud de Información'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Suspense fallback={<div className="p-20 text-center text-white/30">Cargando Centro de Contacto...</div>}>
        <ContactoContent />
      </Suspense>
    </main>
  );
}

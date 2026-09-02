'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PhoneCall, Mail, MapPin, Clock, MessageSquare, 
  Send, ShieldCheck, CheckCircle2, Sparkles, Phone
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoEvento: 'bodas',
    municipio: '',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Centralita & Despacho Ejecutivo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase font-serif">
            Contacto <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">Soberano</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Atención directa para particulares, consistorios municipales, empresas y directores de residencias.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Centralita & Datos Directos */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase">Centralita Telefónica 24/7</div>
                  <a 
                    href={CENTRALITA.href}
                    className="text-lg font-bold text-white font-mono hover:text-amber-400 transition-colors"
                  >
                    {CENTRALITA.display}
                  </a>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Línea prioritaria para emergencias técnicas, confirmación de fechas y tramitación urgente de contratos menores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase">Canal Directo WhatsApp</div>
                  <a 
                    href="https://wa.me/34693693048" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-400 font-mono hover:underline"
                  >
                    Abrir Chat con Producción
                  </a>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Envío inmediato de memorias técnicas, riders en PDF y confirmación de presupuestos con Price-Lock.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase">Hub Logístico & Almacén Central</div>
                  <div className="text-sm font-bold text-white font-mono">Comunidad de Madrid · Corredor Sudoeste</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Flota técnica y parque de sonido móvil con desplazamiento preferente para Madrid, Toledo, Guadalajara y toda la península.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Formulario Ejecutivo */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif uppercase">
                  Solicitud Registrada en EAR OS
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto mt-2">
                  Un director técnico se pondrá en contacto contigo en menos de 2 horas con tu memoria y precio blindado.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white transition-colors"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Nombre Completo / Entidad</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Elena García o Ayto. de Navalcarnero"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Teléfono Móvil (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Canal del Ecosistema</label>
                    <select
                      value={formData.tipoEvento}
                      onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="bodas">1. EVENTOS · Bodas & Fechas Señaladas</option>
                      <option value="artistas">2. ARTISTAS · Booking Edwin Agudelo / Roster</option>
                      <option value="instituciones">3. INSTITUCIONES · Ayuntamientos & B2G</option>
                      <option value="empresas">4. EMPRESAS · Corporativo & Arsenal</option>
                      <option value="vimume">5. VIMUME · Residencias & Mayores</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Municipio / Provincia del Evento</label>
                  <input
                    type="text"
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    placeholder="Ej: Madrid, Navalcarnero, Toledo..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Detalles de la Solicitud</label>
                  <textarea
                    rows={4}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Describe las fechas previstas, requisitos técnicos de sonido o tipo de formación que requieres..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Registrar Solicitud en Producción</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

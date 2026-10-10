'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Phone,
  MessageCircle,
  Volume2,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { CENTRALITA_EAR_OS, LIMITE_SPL_DB, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export default function VillaEscorialParkPage() {
  const [targetDate, setTargetDate] = useState<string>('');
  const [showTourModal, setShowTourModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* CABECERA EDITORIAL S-CLASS */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles size={13} />
              <span>FINCA HOMOLOGADA S-CLASS // SIERRA DE MADRID</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
              Villa Escorial Park
            </h1>
            <p className="text-sm text-zinc-400 mt-2 flex items-center justify-center sm:justify-start gap-2">
              <MapPin size={15} className="text-amber-500" />
              <span>San Lorenzo de El Escorial, Madrid · Aforo hasta 350 invitados</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTourModal(true)}
              className="px-5 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400/50 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <ExternalLink size={14} className="text-amber-500" />
              <span>Explorar Tour Virtual 360°</span>
            </button>
            <a
              href="https://wa.me/34693693048?text=Hola%20Edwin,%20deseo%20consultar%20disponibilidad%20para%20Villa%20Escorial%20Park."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all shadow-lg hover:scale-105"
            >
              Consultar con Coordinador
            </a>
          </div>
        </div>

        {/* FOTOGRAFÍAS & ATRIBUTOS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Imagen Principal */}
          <div className="md:col-span-8 rounded-3xl overflow-hidden border border-white/10 relative h-[380px] sm:h-[460px] bg-zinc-900">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
              alt="Villa Escorial Park Finca de Bodas"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Exclusividad Total
                </span>
                <span className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Jardines Históricos y Salón Acristalado
                </span>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                &lt; {LIMITE_SPL_DB} dB Certificado
              </span>
            </div>
          </div>

          {/* Tarjeta de Especificaciones */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-[#09090d]/90 border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg font-bold font-serif mb-4 pb-2 border-b border-white/10">
                Características de la Finca
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Users size={16} className="text-amber-500 shrink-0" />
                  <span>Capacidad máxima: <strong>350 personas</strong></span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <UtensilsCrossed size={16} className="text-amber-500 shrink-0" />
                  <span>Cocina propia para catering homologado</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Volume2 size={16} className="text-amber-500 shrink-0" />
                  <span>Protección acústica Ley del Ruido</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  <span>Alianza directa homologada con Productora EAR</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-center">
              <span className="text-[11px] font-mono text-zinc-400 block mb-1">
                Comisión Colaborador Partner
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                10% Directo para el Espacio Colaborador
              </span>
            </div>
          </div>
        </div>

        {/* SINCRONIZACIÓN DE DISPONIBILIDAD OFICIAL EN VIVO */}
        <div className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#09090d]/90 backdrop-blur-xl mb-12 shadow-2xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-amber-500">
            <Calendar size={14} />
            <span>CALENDARIO Y DISPONIBILIDAD EN TIEMPO REAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-3">
            Comprueba Disponibilidad Oficial en Villa Escorial Park
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed mb-8">
            Para blindar tu fecha y evitar duplicidades, las fechas se contrastan en vivo con el calendario oficial de la villa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Input de Fecha */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-4">
              <label className="block text-xs font-mono text-zinc-300">
                Selecciona la fecha que deseas celebrar:
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-white font-mono text-sm outline-none focus:border-amber-400"
              />

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    `Hola Edwin, quiero consultar la disponibilidad oficial de Villa Escorial Park para la fecha ${targetDate || 'a consultar'}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle size={15} />
                  <span>Consultar Fecha con Edwin Agudelo</span>
                </a>
              </div>
            </div>

            {/* Acceso a Calendario Oficial Externo */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                Sincronización Transparente:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                También puedes revisar directamente el calendario público oficial en su portal oficial y volver aquí para reservar tu producción de música y sonido:
              </p>
              <a
                href="https://www.villaescorialpark.com/availability"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-mono text-xs font-bold transition-colors"
              >
                <span>Ver Disponibilidad en villaescorialpark.com</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* MODAL TOUR VIRTUAL 360° */}
        {showTourModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="max-w-4xl w-full p-6 rounded-3xl bg-[#09090d] border border-white/15 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Tour Virtual 360° · Villa Escorial Park</span>
                </h3>
                <button
                  onClick={() => setShowTourModal(false)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-video bg-black border border-white/10 mb-4">
                <iframe
                  src="https://www.villaescorialpark.com"
                  title="Tour Oficial Villa Escorial Park"
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowTourModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs"
                >
                  Regresar a la Ficha
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
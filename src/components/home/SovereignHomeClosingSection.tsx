'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Lock,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

export function SovereignHomeClosingSection() {
  const cleanPhone = CENTRALITA_EAR_OS.replace(/[^0-9]/g, '');

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950/90 via-black to-[#030305] p-8 sm:p-12 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
        {/* Glow de Fondo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado del Cierre */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[11px] font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Compromiso S-Class · Cero Comisiones de Agencia</span>
          </div>

          <h2 className="text-[20px] font-bold font-syne text-white tracking-tight mb-2 leading-snug">
            ¿Listo para Garantizar la Música & Sonido de tu Evento?
          </h2>

          <p className="text-[13px] text-zinc-400 font-montserrat leading-relaxed">
            Bloquea tu fecha de forma atómica en el calendario oficial con fianza 100% deducible o consulta directamente con nuestra centralita técnica.
          </p>
        </div>

        {/* 2 Caminos de Conversión (BeeDigital Bifurcation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {/* Camino A: Reserva Oficial Inmediata */}
          <div className="p-6 rounded-2xl border border-amber-500/40 bg-zinc-900/70 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all shadow-[0_0_25px_rgba(236,182,19,0.12)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Ruta Blindaje VIP
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Stripe Price-Lock
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-white font-syne mb-1">
                Formalizar Acuerdo & Reserva de Fecha
              </h3>
              <p className="text-[12px] text-zinc-400 font-montserrat leading-relaxed">
                Selecciona tu día, especificaciones y formaliza la reserva con el depósito deducible de {DEPOSITO_STRIPE_EUR} € con bloqueo atómico de agenda.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/reservar/acuerdo"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-[13px] font-montserrat transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4 fill-black" />
                <span>Abrir Hoja de Acuerdo ({DEPOSITO_STRIPE_EUR} € Fianza)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Camino B: Asesoría Telefónica o WhatsApp */}
          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  Atención Inmediata
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sin Esperas
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-white font-syne mb-1">
                Habla con un Asesor Técnico
              </h3>
              <p className="text-[12px] text-zinc-400 font-montserrat leading-relaxed">
                Llámanos a la centralita o escríbenos por WhatsApp para coordinar riders especiales, repertorio a medida o visitar un espacio homologado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex-1 py-3 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-[12px] font-mono transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{CENTRALITA_EAR_OS}</span>
              </a>

              <a
                href={`https://wa.me/${cleanPhone}?text=Hola%2C%20solicito%20informaci%C3%B3n%20para%20un%20evento`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-[12px] font-montserrat transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barra de Prueba Social y Garantía Inviolable */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-montserrat text-zinc-400 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span><strong>4.9 / 5</strong> en 1.480+ bodas y galas auditadas</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ley 37/2003 Homologada</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Split Soberano 80/10/10</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  Music4,
  Volume2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Lock,
  Car,
  Users,
  Tv,
  Flame,
  Award,
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export function SovereignThreeDoorsDistributor(): React.JSX.Element {
  const formattedPhone = CENTRALITA_EAR_OS.replace(/[^0-9]/g, '');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* ━━━ HEADER SOBRIO AURA ONYX (#030305) ━━━ */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CENTRALITA DIRECTA EN LÍNEA · {CENTRALITA_EAR_OS}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          Productora EAR
          <span className="block text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] font-serif italic font-normal mt-2">
            Distribuidor de Contratación Directa
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Selecciona tu sector para acceder al catálogo verificado, cotización oficial en tiempo real y reserva blindada con fianza deducible de {DEPOSITO_STRIPE_EUR} €.
        </p>
      </div>

      {/* ━━━ LAS TRES PUERTAS MAESTRAS (ARQUITECTURA DE 3 ENTRADAS INDEPENDIENTES) ━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* ACCESO 1: RESTAURACIÓN & FINCAS SINGULARES */}
        <div className="group rounded-3xl bg-gradient-to-b from-[#09090d] to-[#040406] border border-white/10 hover:border-emerald-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                ACCESO 1
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Utensils className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Restauración & Fincas Singulares
              </h2>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                Restaurante Otzarreta · Derio (Bizkaia)
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Caserío tradicional para bodas y banquetes de alta gala. Parrilla tradicional de carbón de encina y sarmiento, comedores acristalados y jardines botánicos. Cero música en ficha.
            </p>

            {/* Ficha Técnica Rápida */}
            <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Menús Oficiales 2026:</strong> 145 € a 185 € + IVA</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Aforo:</strong> 50 a 350 comensales (salón y carpa)</span>
              </li>
              <li className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#ecb613] shrink-0" />
                <span><strong>Párking Privado:</strong> &gt;120 plazas cerradas</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Organizador digital de mesas & Maître 24/7</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 relative z-10">
            <Link
              href="/otzarreta"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 group-hover:scale-[1.02]"
            >
              <span>Acceder a Restaurante Otzarreta</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ACCESO 2: MÚSICA EN DIRECTO & ESPECTÁCULOS */}
        <div className="group rounded-3xl bg-gradient-to-b from-[#09090d] to-[#040406] border border-white/10 hover:border-amber-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_40px_rgba(236,182,19,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 border border-amber-500/30 text-[#ecb613]">
                ACCESO 2
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ecb613]">
                <Music4 className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                Música en Directo & Espectáculos
              </h2>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                Catálogo Artístico S-Class · Contratación Directa
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Formaciones musicales en vivo y artistas solistas para celebraciones privadas, macro-verbenas y festivales públicos. Cero intermediarios con cachés inflados.
            </p>

            {/* Ficha Técnica Rápida */}
            <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ecb613] shrink-0" />
                <span><strong>Edwin Agudelo:</strong> Tenor lírico de gala (Tarifa base 350 €)</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Mariachi de Gala:</strong> Formaciones de 3 a 8 músicos</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Gran Orquesta Latina:</strong> 13 músicos en vivo</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Habilitados LCSP Art. 118 (&lt; 14.250 € Ayuntamientos)</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 relative z-10">
            <Link
              href="/artistas"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#ecb613] hover:bg-[#ffe066] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#ecb613]/20 group-hover:scale-[1.02]"
            >
              <span>Explorar Catálogo de Artistas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ACCESO 3: PRODUCCIÓN TÉCNICA & SONIDO PROFESIONAL */}
        <div className="group rounded-3xl bg-gradient-to-b from-[#09090d] to-[#040406] border border-white/10 hover:border-cyan-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                ACCESO 3
              </span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                Producción Técnica & Sonido Profesional
              </h2>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                Alquiler de Sistemas Line Array · Iluminación · Pantallas LED
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Infraestructura técnica para recintos feriales, plazas, discotecas y convenciones. Equipos suspendidos de gran alcance y sonorización calibrada según Ley de Ruido.
            </p>

            {/* Ficha Técnica Rápida */}
            <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Line Array Suspendido:</strong> 18.000W RMS exteriores</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Sonido Club & Discoteca:</strong> Presión sonora para sala</span>
              </li>
              <li className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Pantallas LED P2.9 HDR:</strong> Gran formato para eventos</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Montaje certificado por técnicos de sonido titulados</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 relative z-10">
            <Link
              href="/alquiler-equipos-sonido-audiovisuales"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 group-hover:scale-[1.02]"
            >
              <span>Consultar Equipamiento Técnico</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ━━━ BARRA INFERIOR DE GARANTÍA S-CLASS & ACCESO DIRECTO ━━━ */}
      <div className="mt-12 sm:mt-16 rounded-2xl bg-zinc-950/80 border border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ecb613] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Garantía Stripe Price-Lock ({DEPOSITO_STRIPE_EUR} € Deducibles)
            </div>
            <div className="text-[11px] text-zinc-400">
              Bloqueo legal de fecha con idempotencia bancaria ACID y contrato bilateral vinculante.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/alianza-otzarreta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-semibold transition-all"
          >
            <span>Dossier Alianza Otzarreta</span>
          </Link>

          <a
            href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent('Hola, deseo consultar disponibilidad y presupuesto para un evento en Productora EAR.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp &lt; 5 min</span>
          </a>
        </div>
      </div>
    </div>
  );
}

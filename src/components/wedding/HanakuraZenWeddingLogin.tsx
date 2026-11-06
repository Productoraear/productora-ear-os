'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HanakuraZenPondCanvas } from './HanakuraZenPondCanvas';
import {
  Heart,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Music,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

/**
 * HanakuraZenWeddingLogin
 * Adaptación de Hanakura Zen para el Portal de Bodas y Acceso de Parejas de EAR OS:
 * - Jardín zen interactivo en Three.js / WebGL con estanque, ondas y pétalos de cerezo flotando.
 * - Atril de piedra noble donde se proyecta la fianza de 100 € deducible y el repertorio solista.
 * - Formulario nupcial sobrio con consulta de fecha atómica y acceso al dossier de boda.
 */
export function HanakuraZenWeddingLogin() {
  const [parejaNombres, setParejaNombres] = useState('');
  const [fechaBoda, setFechaBoda] = useState('2026-10-15');
  const [localidad, setLocalidad] = useState('Finca en Madrid / Toledo');
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);

  return (
    <section className="relative min-h-[640px] rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl overflow-hidden my-12 shadow-2xl">
      {/* Escena WebGL Viva del Jardín Zen de Cerezo y Estanque */}
      <HanakuraZenPondCanvas />

      {/* Grid Compuesto: Formulario Nupcial (Izquierda) + Atril Zen de Piedra Noble (Derecha) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] items-stretch">
        {/* Formulario Nupcial (Col-span 5) */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-zinc-950/70 backdrop-blur-md border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-mono uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal de Parejas & Alta Gala · Hanakura Zen</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              Diseña la Acústica de Vuestro Gran Día
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-sans leading-relaxed">
              Accede a la fecha exclusiva en el calendario de Edwin Agudelo, consulta la acústica de tu finca y bloquea con fianza deducible.
            </p>

            {/* Inputs del Portal */}
            <div className="space-y-4 my-6 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Nombres de la Pareja</label>
                <input
                  type="text"
                  placeholder="Ej: Lucía & Alejandro"
                  value={parejaNombres}
                  onChange={(e) => setParejaNombres(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Fecha Prevista del Enlace</label>
                  <input
                    type="date"
                    value={fechaBoda}
                    onChange={(e) => setFechaBoda(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Recinto o Municipio</label>
                  <input
                    type="text"
                    value={localidad}
                    onChange={(e) => setLocalidad(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
              </div>

              {/* Checkbox de Privacidad y Términos */}
              <label className="flex items-center gap-2 cursor-pointer pt-1 text-[11px] text-zinc-400 font-sans">
                <input
                  type="checkbox"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 accent-amber-400"
                />
                <span>Acepto la garantía Price-Lock SHA-256 y fianza 100% deducible</span>
              </label>
            </div>
          </div>

          {/* Botones de Acción Soberana */}
          <div className="pt-4 border-t border-white/10 space-y-3 font-mono">
            <Link
              href={`/booking?tier=vip&date=${fechaBoda}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] hover:scale-[1.01]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloquear Fecha VIP ({DEPOSITO_STRIPE_EUR.toFixed(2)} € Deducibles)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garantía Ley 37/2003</span>
              </span>
              <a
                href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola Edwin, queremos consultar la fecha ${fechaBoda} para nuestra boda.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline"
              >
                Consulta Directa WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Atril Zen de Piedra Noble (Derecha - Col-span 6) */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-end text-left pointer-events-none">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-amber-500/30 backdrop-blur-xl max-w-md ml-auto shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-2">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30" />
              <span>Atril de Piedra Noble · Gala Nupcial</span>
            </div>

            <div className="text-xl font-bold font-display text-white mb-1">
              Edwin Agudelo · Tenor Solista
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Repertorio litúrgico para ceremonia (Ave María de Schubert, Panis Angelicus) y serenata de gala para el cóctel.
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Suelo Canónico:</span>
              <span className="text-amber-400 font-bold">{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</span>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono mt-1">
              Fianza deducible de {DEPOSITO_STRIPE_EUR.toFixed(2)} € · Restante tras la gala
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


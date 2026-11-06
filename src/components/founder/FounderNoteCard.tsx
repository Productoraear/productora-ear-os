'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

/**
 * FounderNoteCard
 * Replicación 1:1 de HorizonX Founder Note adaptada a la ficha de Edwin Agudelo.
 * Carta personal con tipografía editorial 16px/26px, firma caligráfica SVG
 * y accesibilidad total (texto con lectura fluida y firma accesible).
 */
export function FounderNoteCard() {
  return (
    <article
      aria-labelledby="founder-letter-title"
      className="my-10 p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-black text-zinc-200 shadow-2xl relative overflow-hidden font-sans"
    >
      {/* Halo dorado perimetral sutil */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera de la Carta */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
            EA
          </div>
          <div>
            <h3 id="founder-letter-title" className="text-sm font-bold font-mono text-white tracking-wide">
              Carta Personal de Edwin Agudelo
            </h3>
            <span className="text-[11px] text-amber-400 font-mono">Fundador & Tenor Insignia · EAR OS</span>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
          Compromiso Soberano
        </span>
      </div>

      {/* Cuerpo de la Carta (16px con altura de línea de 26px) */}
      <div className="text-[16px] leading-[26px] text-zinc-300 font-normal space-y-4 max-w-3xl">
        <p>
          "Cuando fundé Productora EAR, lo hice con una certeza innegociable: la música en directo en una boda,
          una gala o una plaza pública no puede ser una lotería de intermediarios que inflan precios y desaparecen
          si hay problemas acústicos o cancelaciones de última hora.
        </p>
        <p>
          Por eso fijé mi <strong className="text-amber-400 font-mono">tarifa base en 350,00 €</strong> como suelo
          inviolable, con logística calculada al milímetro por GPS desde Méntrida y un blindaje acústico que protege a tu recinto
          bajo la Ley del Ruido. Además, cada vez que cantamos, el 10% soberano financia sesiones de musicoterapia
          40 Hz para mayores en VIMUME.
        </p>
        <p>
          Si decides confiarnos tu fecha, tienes mi palabra y mi voz. Tu fianza de 100 € se resta íntegra del total
          y la fecha queda bloqueada exclusivamente para ti."
        </p>
      </div>

      {/* Firma Caligráfica Dibujada (SVG con fallback accesible) */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Firma SVG animada (Oculta para lectores de pantalla porque el nombre está impreso debajo) */}
          <div aria-hidden="true" className="h-12 w-48 text-amber-400 mb-1">
            <svg viewBox="0 0 200 50" className="w-full h-full stroke-current fill-none stroke-[2.2]">
              <path
                d="M10,35 C25,15 45,10 60,30 C75,45 85,20 100,25 C120,32 140,15 160,28 C175,35 185,20 190,15"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
          </div>
          <div className="text-xs font-mono font-bold text-white tracking-wider">
            Edwin Agudelo
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Tenor Insignia & Director Ejecutivo · Productora EAR
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Garantía de Presencia & Voz en Vivo</span>
        </div>
      </div>
    </article>
  );
}


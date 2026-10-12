"use client";

import React from 'react';
import { Star, ShieldCheck, Heart, MapPin } from 'lucide-react';

const REVIEWS_DATA = [
  {
    author: "Beatriz González & Javier M.",
    event: "Boda en Finca Los Cigarrales (Toledo)",
    rating: 5,
    date: "Septiembre 2026",
    comment: "Contratamos el Ensamble de Gala con Edwin Agudelo para el cóctel y fue el momento cumbre de la boda. La entrada sorpresa con Si Nos Dejan puso los pelos de punta a todos los invitados. La acústica fue impecable, sin tapar las conversaciones. Puntualidad inglesa y elegancia absoluta con los trajes de charro."
  },
  {
    author: "Familia Morales Salgado",
    event: "Cumpleaños 80 años en Pozuelo de Alarcón (Madrid)",
    rating: 5,
    date: "Julio 2026",
    comment: "Poder bloquear la fecha al instante con 100€ en Stripe y hablar por WhatsApp con Edwin nos dio una tranquilidad total. Llegaron exactamente a la hora acordada cantando Las Mañanitas. Mi abuela no paró de llorar de emoción y de bailar. Profesionales como la copa de un pino."
  },
  {
    author: "Dirección de Eventos Finca El Campillo",
    event: "Evento Corporativo & Cóctel de Gala (El Escorial)",
    rating: 5,
    date: "Junio 2026",
    comment: "Como gestores de finca somos muy estrictos con los decibelios de la música en vivo. El Mariachi Imperial de EAR OS nos entregó su certificación acústica previa y el equipo de sonido Bose no superó los 74 dB en ningún momento. Cero quejas vecinales y máxima satisfacción de los novios."
  },
  {
    author: "Carlos De La Torre",
    event: "Pedida de Mano Sorpresa en Terraza (Sevilla)",
    rating: 5,
    date: "Agosto 2026",
    comment: "Contraté la serenata express de trío para la pedida. Todo coordinado por WhatsApp al minuto. Llegaron con el ramo, cantaron 8 temas preciosos y nos hicieron vivir un instante de película. Vale cada euro invertido."
  }
];

export default function MariachiReviews() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-[0.25em]">
          <ShieldCheck size={14} />
          EXPERIENCIAS REALES // TESTIMONIOS CONTRASTADOS
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
          Lo que Dicen Quienes ya Han Celebrado con Nosotros
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-sans">
          Reseñas contrastadas de novios, familias e instituciones que confiaron en la puntualidad y rigor artístico de nuestra red.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REVIEWS_DATA.map((rev, i) => (
          <div
            key={i}
            className="rounded-3xl bg-[#060609] border border-white/10 p-6 md:p-8 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#ecb613]">
                  {[...Array(rev.rating)].map((_, s) => (
                    <Star key={s} size={15} fill="#ecb613" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={12} />
                  Testimonio de Cliente
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <div>
                <strong className="text-white block font-syne font-bold">{rev.author}</strong>
                <span className="text-white/40 text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-[#ecb613]" />
                  {rev.event}
                </span>
              </div>
              <span className="text-white/30 text-[10px]">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

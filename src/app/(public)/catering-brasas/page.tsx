'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, CheckCircle2, Star, ShieldCheck, Sparkles, 
  MessageCircle, Lock, ArrowRight, ChevronRight, Check,
  Clock, MapPin, Users, Heart
} from 'lucide-react';

const CATERING_MENUS = [
  {
    id: 'bbq-iberico',
    title: 'Catering de Brasas: Ritual Ibérico',
    subtitle: 'Fuego Vivo & Showcooking de Alta Selección',
    price: 45,
    unit: 'Por Comensal',
    badge: 'BRASAS & LIVE FIRE',
    rating: 5.0,
    reviews: 48,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    description: 'Secreto, pluma, presa y panceta ibérica curada sobre brasas de carbón vegetal y leña de encina con tiempos de humo milimétricos.',
    specs: ['Registro Sanitario RGEAA', 'Sonorización Bose F1 de cortesía', 'Parrilleros titulados']
  },
  {
    id: 'bbq-argentino',
    title: 'Asado Argentino Tradicional & Espadas',
    subtitle: 'Cortes Nobles a la Brasa & Mollejas Crocantes',
    price: 55,
    unit: 'Por Comensal',
    badge: 'ALTA CONVIVENCIA',
    rating: 4.98,
    reviews: 36,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    description: 'Asado de tira, entraña, vacío y choripanes artesanales con chimichurri casero macerado 48h y espadas criollas.',
    specs: ['Asadores de campeonato', 'Servicio ágil por tiempos', 'Guarniciones al rescoldo']
  },
  {
    id: 'bbq-ancestral',
    title: 'Asado Ancestral al Fuego & a la Cruz',
    subtitle: 'Cocción Lenta de 8 Horas en Domo de Leña',
    price: 65,
    unit: 'Por Comensal',
    badge: 'MONUMENTO VISUAL',
    rating: 5.0,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80',
    description: 'Cordero lechal y costillares enteros en cruces de hierro forjado al aire libre. Espectáculo visual para grandes fincas y bodas.',
    specs: ['Estructura monumental exterior', '8 horas de fuego lento', 'Hortalizas en ceniza']
  },
  {
    id: 'bbq-low-slow',
    title: 'Ahumados Americanos: Low & Slow',
    subtitle: 'Brisket Black Angus Ahumado 14h con Roble',
    price: 50,
    unit: 'Por Comensal',
    badge: 'SMOKER OFFSET',
    rating: 4.96,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80',
    description: 'Ternura suprema: Brisket Angus y Pulled Pork jugoso preparados en ahumadores offset con salsa barbacoa de bourbon.',
    specs: ['Ahumadores profesionales', 'Madera de roble natural', 'Mac & cheese ahumado']
  },
  {
    id: 'bbq-huerto',
    title: 'Huerto al Carbón & Vegetariano Puro',
    subtitle: 'Calçots, Alcachofas y Frutas Caramelizadas',
    price: 40,
    unit: 'Por Comensal',
    badge: '100% HUERTO',
    rating: 4.95,
    reviews: 22,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&auto=format&fit=crop&q=80',
    description: 'Hortalizas de temporada a la parrilla, berenjenas con miso y piña asada con canela y ron.',
    specs: ['Parrilla vegetal separada', 'Aceites infusionados', 'Romesco artesano']
  }
];

export default function CateringBrasasPage() {
  const [selectedMenu, setSelectedMenu] = useState(CATERING_MENUS[0]);
  const [pax, setPax] = useState(80);
  const [distanceKm, setDistanceKm] = useState(25);
  const [locked, setLocked] = useState(false);

  const totalQuote = Math.round(selectedMenu.price * pax + (distanceKm > 30 ? (distanceKm - 30) * 0.95 : 0));
  const acousticWatts = pax * 12;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ecb613] selection:text-black pb-28 pt-24">
      {/* Background Glow */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ecb613]/10 to-transparent blur-[160px] pointer-events-none rounded-full" />

      {/* Header */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto text-center relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0d0d12] border border-[#ecb613]/30 shadow-[0_0_35px_rgba(236,182,19,0.15)] mb-4">
          <Flame size={14} className="text-[#ecb613] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-zinc-300">
            SHOWCOOKING // FUEGO VIVO & BRASAS DE AUTOR
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-syne max-w-4xl mx-auto leading-[1.1]">
          Catering de <span className="text-[#ecb613] italic">Brasas Ancestrales</span> para Fincas & Bodas
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl mx-auto mt-4 leading-relaxed">
          Espectáculo gastronómico al aire libre. Carnes ibéricas seleccionadas, asados a la cruz, leña de encina y sonorización Bose F1 incluida.
        </p>
      </section>

      {/* Grid of Menus */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATERING_MENUS.map((menu) => {
            const isSelected = selectedMenu.id === menu.id;
            return (
              <div
                key={menu.id}
                onClick={() => setSelectedMenu(menu)}
                className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  isSelected 
                    ? 'bg-gradient-to-b from-[#181822] via-[#0f0f15] to-[#0a0a0e] border-[#ecb613] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9),0_0_30px_rgba(236,182,19,0.2)] scale-[1.02]' 
                    : 'bg-[#0b0b10] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-mono font-black uppercase">
                      {menu.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                      <Star size={13} className="fill-amber-400" />
                      <span className="font-bold">{menu.rating}</span>
                      <span className="text-zinc-500">({menu.reviews})</span>
                    </div>
                  </div>

                  <div className="h-44 rounded-2xl overflow-hidden bg-black/60 relative mb-4 border border-white/10">
                    <img 
                      src={menu.image} 
                      alt={menu.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-xs font-mono text-white bg-black/80 px-2.5 py-1 rounded-lg border border-white/10">
                      {menu.price} € / comensal
                    </div>
                  </div>

                  <h3 className="text-lg font-black uppercase text-white font-syne group-hover:text-[#ecb613] transition-colors">
                    {menu.title}
                  </h3>
                  <p className="text-xs font-mono text-[#ecb613] mt-0.5">{menu.subtitle}</p>
                  <p className="text-xs text-zinc-400 font-light mt-2.5 line-clamp-2 leading-relaxed">
                    {menu.description}
                  </p>

                  <div className="space-y-1.5 mt-4 pt-3 border-t border-white/10">
                    {menu.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-[10px] font-mono text-zinc-300">
                        <Check size={12} className="text-emerald-400 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-lg font-black text-[#ecb613] font-mono">
                    {menu.price} € <span className="text-[10px] font-light text-zinc-400">/ pax</span>
                  </span>
                  <button className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
                    isSelected ? 'bg-[#ecb613] text-black shadow-md' : 'bg-white/5 text-white/80 hover:bg-white/15'
                  }`}>
                    {isSelected ? '✓ Seleccionado' : 'Cotizar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Live Quote Box */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-b from-[#111118] via-[#0c0c12] to-[#07070a] p-7 sm:p-10 rounded-[2.5rem] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-7">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ecb613] block">
                PRESUPUESTO EN VIVO // CATERING DE BRASAS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne mt-1">
                {selectedMenu.title}
              </h3>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 font-bold">
              Registro Sanitario RGEAA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-mono text-white">
                <span>Número de Comensales</span>
                <span className="text-[#ecb613] font-black text-sm">{pax} PAX</span>
              </div>
              <input 
                type="range" 
                min={20} 
                max={400} 
                value={pax} 
                onChange={e => setPax(Number(e.target.value))}
                className="w-full accent-[#ecb613] h-2 bg-[#1a1a24] rounded-lg cursor-pointer border border-white/10"
              />
              <span className="text-[10px] font-mono text-zinc-400 block">
                Sonorización Bose F1 de cortesía calibrada a {acousticWatts}W RMS
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-mono text-white">
                <span>Distancia Desplazamiento desde Madrid</span>
                <span className="text-[#ecb613] font-black text-sm">{distanceKm} KM</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={300} 
                value={distanceKm} 
                onChange={e => setDistanceKm(Number(e.target.value))}
                className="w-full accent-[#ecb613] h-2 bg-[#1a1a24] rounded-lg cursor-pointer border border-white/10"
              />
              <span className="text-[10px] font-mono text-zinc-400 block">
                Radio Provincial: {distanceKm <= 30 ? 'Desplazamiento Incluido' : `+${Math.round((distanceKm - 30) * 0.95)}€ Km`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-black/60 p-5 rounded-2xl border border-white/10">
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Presupuesto Total</span>
              <span className="text-xl font-black text-[#ecb613] font-mono">{totalQuote} €</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Depósito Stripe</span>
              <span className="text-xl font-black text-emerald-400 font-mono">100 €</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Resto en Evento</span>
              <span className="text-xl font-black text-white font-mono">{totalQuote - 100} €</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Price-Lock SHA-256</span>
              <span className="text-xs font-bold text-blue-400 font-mono">Bloqueo 72h</span>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div 
              onClick={() => setLocked(!locked)}
              className={`w-full py-4.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all ${
                locked 
                  ? 'bg-emerald-500 text-black shadow-2xl shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-[#ecb613] via-amber-400 to-[#d4a00e] text-black shadow-[0_0_40px_rgba(236,182,19,0.35)] hover:brightness-110 active:scale-98'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock size={18} />
                <span>{locked ? '✓ FECHA BLOQUEADA 72H EN STRIPE' : 'DESLIZAR PARA BLOQUEAR FECHA'}</span>
              </div>
              <span className="font-mono text-base font-black">100 €</span>
            </div>

            <a
              href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20quiero%20reservar%20${encodeURIComponent(selectedMenu.title)}%20para%20${pax}%20comensales%20(${totalQuote}%E2%82%AC).`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all"
            >
              <MessageCircle size={15} className="text-[#25D366]" />
              <span>Despachar Payload Directo a WhatsApp (+34 693 693 048)</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

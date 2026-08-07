'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Heart, X, Check, ShieldCheck, ArrowRight, BookOpen, CreditCard } from 'lucide-react';
import { createEliteCheckout } from '@/app/actions/checkoutActions';

export interface ArtistCard {
  id: string;
  name: string;
  category: 'B2C' | 'B2B' | 'B2G';
  format: string;
  price: string;
  tagline: string;
  specs: string[];
  image: string;
}

const ARTIST_FORMATS: ArtistCard[] = [
  {
    id: 'cuarteto-gala',
    name: 'Mariachi Edwin Agudelo — Cuarteto de Gala',
    category: 'B2C',
    format: '4 Músicos de Gala',
    price: '950€',
    tagline: 'Ideal para Serenatas, Bodas Íntimas y Aniversarios VIP',
    specs: ['2 Trompetas', '1 Vihuela', '1 Guitarrón', 'Sonido Autónomo Incluido'],
    image: '🎺'
  },
  {
    id: 'quinteto-imperial',
    name: 'Mariachi Edwin Agudelo — Quinteto Imperial',
    category: 'B2C',
    format: '5 Músicos de Alta Gala',
    price: '1.250€',
    tagline: 'Recomendado para Bodas Nupciales y Cócteles de Autor',
    specs: ['2 Trompetas', '1 Violín', '1 Vihuela', '1 Guitarrón', 'Traje de Charro de Gran Gala'],
    image: '🎻'
  },
  {
    id: 'octeto-oro',
    name: 'Mariachi Edwin Agudelo — Octeto de Oro B2B',
    category: 'B2B',
    format: '8 Músicos Gran Formato',
    price: '2.400€',
    tagline: 'Presencia Escénica Imponente para Convenciones y Galas de Empresa',
    specs: ['3 Violines', '2 Trompetas', 'Arpa', 'Vihuela', 'Guitarrón', 'Factura con IVA + Ledger ACID'],
    image: '🌟'
  },
  {
    id: 'sinfonico-b2g',
    name: 'Productora EAR — Espectáculo B2G Festejos Patronales',
    category: 'B2G',
    format: 'Orquesta & Mariachi 12+ Artistas',
    price: '4.800€',
    tagline: 'Licitación Pública Completa para Festejos Patronales de Ayuntamientos',
    specs: ['Sonido L-Acoustics K2', 'Rider de Luces DMX', 'Seguro RC 1.000.000€', 'Alta SS Músicos'],
    image: '🏛️'
  }
];

export default function TinderMatcherClient() {
  const [businessUnit, setBusinessUnit] = useState<'ALL' | 'B2C' | 'B2B' | 'B2G'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchSuccess, setMatchSuccess] = useState<ArtistCard | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredFormats = ARTIST_FORMATS.filter(
    f => businessUnit === 'ALL' || f.category === businessUnit
  );

  const currentCard = filteredFormats[currentIndex % filteredFormats.length];

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleMatch = (card: ArtistCard) => {
    setMatchSuccess(card);
  };

  const handleFastTrackCheckout = async (card: ArtistCard) => {
    setIsProcessing(true);
    try {
      const session = await createEliteCheckout({
        artistId: card.id,
        clientId: 'express-fast-track-user',
        origin: 'Madrid, España',
        destination: 'Servicio Express',
        eventDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
      });

      if (session?.url) {
        window.location.href = session.url;
      } else {
        alert('Error iniciando pasarela Stripe Fast-Track.');
      }
    } catch (err) {
      console.error(err);
      alert('Error en checkout express.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-zinc-950 border border-zinc-800 rounded-3xl text-white shadow-2xl">
      {/* Header & Unit Filter */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
          <Sparkles size={14} /> Smart Matcher & Express Profiler
        </div>
        <h2 className="text-2xl font-black tracking-tight uppercase italic">
          Encuentra tu Formato Artístico Ideal
        </h2>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto">
          Selecciona tu tipo de evento para filtrar los formatos recomendados. Elige entre acompañamiento educativo guiado o Reserva Express en 1-Click.
        </p>

        {/* Business Unit Segment Filter */}
        <div className="flex justify-center gap-2 pt-2">
          {(['ALL', 'B2C', 'B2B', 'B2G'] as const).map(unit => (
            <button
              key={unit}
              onClick={() => {
                setBusinessUnit(unit);
                setCurrentIndex(0);
                setMatchSuccess(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                businessUnit === unit
                  ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-400/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {unit === 'ALL' ? 'Todos los Eventos' : unit === 'B2C' ? '💍 Bodas & Particular' : unit === 'B2B' ? '🏢 Corporativo' : '🏛️ Ayuntamientos (B2G)'}
            </button>
          ))}
        </div>
      </div>

      {/* Tinder Card View */}
      <div className="relative min-h-[380px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {matchSuccess ? (
            <motion.div
              key="match-success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-zinc-900 border-2 border-amber-400 rounded-3xl p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="text-5xl">{matchSuccess.image}</div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                  MATCH CONFIRMADO
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mt-1">
                  {matchSuccess.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-2">{matchSuccess.tagline}</p>
              </div>

              {/* DUAL PATH BUTTONS */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                {/* Fast Track Route */}
                <button
                  onClick={() => handleFastTrackCheckout(matchSuccess)}
                  disabled={isProcessing}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                >
                  <CreditCard size={16} />
                  {isProcessing ? 'Procesando Stripe...' : 'Pagar Rápido / Express Checkout (30%)'}
                </button>

                {/* Educational Guided Route */}
                <a
                  href="/presupuesto"
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <BookOpen size={16} />
                  Acompañamiento Guiado & Dossier RAG
                </a>
              </div>
            </motion.div>
          ) : currentCard ? (
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl relative"
            >
              <div className="flex justify-between items-start">
                <span className="text-4xl">{currentCard.image}</span>
                <span className="px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-black tracking-widest uppercase rounded-full">
                  {currentCard.category} • {currentCard.format}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                  {currentCard.name}
                </h3>
                <p className="text-xs text-zinc-400 italic mt-1">"{currentCard.tagline}"</p>
              </div>

              <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  Especificaciones Técnicas:
                </div>
                <ul className="grid grid-cols-2 gap-1 text-[11px] text-zinc-300 font-medium">
                  {currentCard.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-amber-400 shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-2xl font-black text-white">{currentCard.price}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Tarifa Base Garantizada</div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 pt-4 border-t border-zinc-800">
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase text-xs rounded-xl flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <X size={16} /> Siguiente
                </button>
                <button
                  onClick={() => handleMatch(currentCard)}
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                >
                  <Heart size={16} fill="black" /> Hacer Match
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Compass, Sparkles, ChevronDown, ChevronUp, 
  HelpCircle, Shield, Music, Shirt, Landmark
} from 'lucide-react';

const CULTURE_TOPICS = [
  {
    id: 'origenes',
    icon: <Compass className="text-[#ecb613]" size={24} />,
    title: 'Orígenes del Mariachi (Siglo XVIII)',
    tagline: 'Patrimonio Cultural Inmaterial de la Humanidad (UNESCO 2011)',
    content: `
En el actual México, el proceso de conformación de las diversas manifestaciones del son (incluido el son jalisciense que influiría al mariachi contemporáneo) tiene al menos tres siglos de desarrollo, remontándose a la Nueva España. El mariachi nace en el occidente de México (Cocula y Tecalitlán, Jalisco) del mestizaje entre instrumentos de cuerda europeos (vihuela, guitarra de golpe, arpa, violines) y la lírica popular campesina. En la segunda mitad del siglo XVIII el término ya aparece documentado, adquiriendo con la trompeta en el siglo XX su dimensión sinfónica monumental.
    `.trim()
  },
  {
    id: 'festival',
    icon: <Landmark className="text-[#ecb613]" size={24} />,
    title: 'Festival Internacional de Guadalajara',
    tagline: 'El Encuentro Internacional del Mariachi y la Charrería en Jalisco',
    content: `
Guadalajara (Jalisco, México) celebra anualmente el más grande y simbólico festival en honor al género del mariachi. Es el epicentro donde se congregan las mejores agrupaciones del mundo (Mariachi Vargas de Tecalitlán, Mariachi Nuevo Tecalitlán) junto a orquestas filarmónicas. Edwin Agudelo traslada este rigor de conservatorio y pureza estilística a cada escenario y evento en España y Europa.
    `.trim()
  },
  {
    id: 'traje-charro',
    icon: <Shirt className="text-[#ecb613]" size={24} />,
    title: 'Trajes, Atuendos y Botonaduras de Plata',
    tagline: 'Diferencia histórica entre traje de campo y Gran Gala',
    content: `
Los músicos del mariachi adoptaron el traje de charro como máxima seña de identidad. Originalmente vestían mantas de algodón y sombreros de paja y palma en el campo, pero evolucionaron al traje del jinete vaquero de gala. El traje oficial de Gran Gala que viste Edwin Agudelo se compone de chaqueta corta entallada, pantalones con doble botonadura de plata cincelada a mano, cinturón piteado y sombrero charro de fieltro fino con galón bordado.
    `.trim()
  },
  {
    id: 'guia-contratacion',
    icon: <Shield className="text-[#ecb613]" size={24} />,
    title: 'Guía para Contratar un Mariachi de Élite',
    tagline: 'Formaciones de 5 a 13 Músicos · Precios Claros Sin Sorpresas',
    content: `
¿Cuántas personas conforman un mariachi profesional? En nuestro caso llevamos como base la figura del mariachi moderno: desde solista y cuarteto hasta formaciones completas de 5 a 13 maestros de conservatorio (2-4 violines, 2 trompetas, vihuela, guitarrón y voz tenor). El precio es transparente y cerrado, garantizando puntualidad milimétrica, trajes impecables y sonido de alta fidelidad 12 W/pax sin distorsión.
    `.trim()
  },
  {
    id: 'diferencia-charro',
    icon: <Music className="text-[#ecb613]" size={24} />,
    title: '¿Cuál es la Diferencia entre Charros y Mariachis?',
    tagline: 'Dos símbolos nacionales de gallardía y música',
    content: `
La regla de oro para dirigirse a un Charro es no confundirlo con un Mariachi. La charrería es el deporte y arte ecuestre tradicional de México (gallardía, doma y lazo nacidos en las haciendas coloniales), mientras que el mariachi es la manifestación musical y poética que adoptó el traje de charro de gala como estandarte ante el mundo. Edwin Agudelo rinde homenaje a ambos en sus espectáculos cantando a caballo.
    `.trim()
  }
];

const FAQS_MARIACHI = [
  {
    q: '¿Cuántos músicos integran una formación de mariachi profesional?',
    a: 'Una formación reglamentaria oscila entre 5 y 13 músicos. El formato mínimo equilibrado cuenta con 2 violines, 1 trompeta, 1 vihuela y 1 guitarrón. Para bodas y grandes eventos en fincas se recomienda el ensamble de 6 a 9 integrantes para lograr la plenitud acústica.'
  },
  {
    q: '¿Cómo garantizáis que el volumen no resulte excesivo en espacios cerrados o restaurantes?',
    a: 'Gracias a nuestra ingeniería acústica EAR a 12 W/pax y el uso de microfonía inalámbrica con control digital de sala, ecualizamos el directo para que la voz del tenor y los instrumentos suenen cristalinos y envolventes sin saturar la conversación de los invitados.'
  },
  {
    q: '¿Qué indumentaria visten los integrantes de la agrupación?',
    a: 'Todos los integrantes asisten uniformados con trajes de Gran Gala confeccionados en talleres tradicionales: botonaduras de plata cosidas a mano, corbatines de moño de seda, botines de charro y sombreros de gala reglamentarios.'
  },
  {
    q: '¿Se pueden solicitar canciones específicas no habituales o dedicatorias?',
    a: 'Por supuesto. Disponemos de un repertorio activo de más de 350 temas (rancheras, boleros, huapangos, música clásica y baladas en positivo). Coordinamos con 15-30 días de antelación cualquier petición especial.'
  }
];

export const EdwinMariachiCulture: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-[9px] font-black uppercase tracking-[0.4em]">
            <BookOpen size={14} /> Divulgación & Patrimonio Vivo
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
            El Mundo del <span className="text-[#ecb613]">Mariachi</span>
          </h2>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed">
            Comprender el mariachi es entender una liturgia de respeto, virtuosismo instrumental y tradición centenaria.
          </p>
        </div>

        {/* 5 TARJETAS DE CULTURA & DIVULGACIÓN HISTÓRICA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CULTURE_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="p-8 rounded-[2.5rem] bg-[#09090d] border border-white/10 space-y-5 hover:border-[#ecb613]/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {topic.icon}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase text-white tracking-tight font-syne">
                    {topic.title}
                  </h3>
                  <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] block">
                    {topic.tagline}
                  </span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed">
                  {topic.content}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-white/30 uppercase">
                Productora EAR • Conservatorio Tradicional
              </div>
            </div>
          ))}
        </div>

        {/* PREGUNTAS FRECUENTES (ACCORDION) */}
        <div className="max-w-4xl mx-auto space-y-6 pt-12 border-t border-white/5">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#ecb613] block font-mono">
              Resolución Técnica
            </span>
            <h3 className="text-2xl md:text-3xl font-black uppercase text-white font-syne">
              Preguntas Frecuentes sobre la Contratación
            </h3>
          </div>

          <div className="space-y-4">
            {FAQS_MARIACHI.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#09090d] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 text-white hover:text-[#ecb613] transition-colors"
                >
                  <span className="text-sm font-black uppercase tracking-tight font-syne">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp size={18} className="text-[#ecb613] shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-white/40 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-6 text-xs text-white/60 leading-relaxed border-t border-white/5 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

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
El mariachi nace en el occidente de México (región de Cocula y Tecalitlán, Jalisco) durante el siglo XVIII, fruto del mestizaje entre instrumentos de cuerda europeos traídos en el Virreinato de la Nueva España (vihuela, guitarra de golpe, arpa, violines) y la lírica popular campesina. Con la incorporación posterior de las trompetas a mediados del siglo XX en la época de oro del cine mexicano, el mariachi adquirió su proyección sinfónica monumental.
    `.trim()
  },
  {
    id: 'festival',
    icon: <Landmark className="text-[#ecb613]" size={24} />,
    title: 'Festival Internacional de Guadalajara',
    tagline: 'El epicentro mundial de la música y la charrería en Jalisco',
    content: `
Celebrado anualmente en Guadalajara (México), es el mayor encuentro global donde los mejores mariachis del planeta (Mariachi Vargas de Tecalitlán, Mariachi Nuevo Tecalitlán) se congregan. Edwin Agudelo bebe directamente de esta escuela canónica, adoptando las técnicas de afinación coral, arreglos de metales y respeto a las tonalidades tradicionales en cada actuación en España y Europa.
    `.trim()
  },
  {
    id: 'traje-charro',
    icon: <Shirt className="text-[#ecb613]" size={24} />,
    title: 'El Traje Charro & Botonadura de Plata',
    tagline: 'Diferencia histórica entre faena y gala imperial',
    content: `
El traje de charro no es un disfraz, es un atuendo de honor regulado por la Federación Mexicana de Charrería. Mientras que el traje de faena se utilizaba en el campo, el traje de Gran Gala que viste Edwin Agudelo se compone de paño fino de lana pura, chaquetilla corta ajustada, pantalón con doble botonadura de plata cincelada a mano, cinturón piteado y sombrero de fieltro con galón de oro y plata.
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

        {/* 3 TARJETAS DE CULTURA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

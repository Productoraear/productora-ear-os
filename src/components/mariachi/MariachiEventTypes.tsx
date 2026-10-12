"use client";

import React, { useState } from 'react';
import {
  Heart, Gift, Sparkles, Building2, Landmark,
  ArrowRight, ShieldCheck, CheckCircle2
} from 'lucide-react';

interface EventType {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  bulletPoints: string[];
  recommendedPack: string;
}

const EVENT_TYPES: EventType[] = [
  {
    id: 'bodas',
    title: 'Bodas & Fincas de Lujo',
    tagline: 'Elegancia nupcial y momentos inolvidables',
    badge: 'Más Solicitado',
    icon: <Heart className="text-[#FF2B44]" size={24} />,
    description: 'Música en vivo para cóctel, ceremonia religiosa/civil o apertura de fiesta. Adaptamos la formación al límite de ruido de cada finca.',
    bulletPoints: [
      'Entrada sorpresa de los novios o cóctel de bienvenida',
      'Ficha técnica previa según el límite dBA de la finca + medición con sonómetro',
      'Repertorio romántico: Si Nos Dejan, Motivos, El Milagro',
      'Traje de charro de gran gala impecable'
    ],
    recommendedPack: 'Gala Imperial Edwin Agudelo (mín. 6 integrantes)'
  },
  {
    id: 'serenatas',
    title: 'Serenatas & Pedidas de Mano',
    tagline: 'El detalle más romántico y memorable',
    badge: 'Sorpresa Garantizada',
    icon: <Sparkles className="text-[#ecb613]" size={24} />,
    description: 'Llegada sigilosa bajo el balcón, en terraza privada o restaurante. Emoción a flor de piel para aniversarios o declaración de amor.',
    bulletPoints: [
      'Coordinación secreta con el cómplice para la sorpresa',
      'Ramillete de boleros y rancheras románticas',
      'Opción de añadir canción personalizada o dedicatoria',
      'Puntualidad milimétrica para el instante exacto'
    ],
    recommendedPack: 'Solista Serenata Express o Trío Íntimo'
  },
  {
    id: 'cumpleanos',
    title: 'Cumpleaños & Las Mañanitas',
    tagline: 'La mayor sorpresa para quien más quieres',
    badge: 'Para Todas las Edades',
    icon: <Gift className="text-emerald-400" size={24} />,
    description: 'Desde los 18 hasta los 90 años. Canto de Las Mañanitas tradicionales al entrar, seguido de temas alegres y baile familiar.',
    bulletPoints: [
      'Entrada triunfal cantando Las Mañanitas',
      'Show participativo con brindis y fotos con los sombreros',
      'Temas festivos: El Rey, Cielito Lindo, Volver Volver',
      'A domicilio, chalet particular o salón reservado'
    ],
    recommendedPack: 'Cuarteto Tradicional Ranchero'
  },
  {
    id: 'patronales',
    title: 'Fiestas Patronales & Ayuntamientos',
    tagline: 'Del mariachi solo a la producción integral llave en mano',
    badge: 'Contrato menor · Art. 118 LCSP',
    icon: <Landmark className="text-[#00E5FF]" size={24} />,
    description: 'Ferias, plazas mayores, semanas culturales y verbenas. Contratamos el mariachi solo o el concierto completo con escenario, sonido, luces y técnicos, en una sola factura electrónica (FACe).',
    bulletPoints: [
      'Actuación de mariachi (solo artístico): presupuesto según formación',
      'Producción integral: escenario, PA de plaza, iluminación, técnicos y permisos',
      'Rider para festejos populares 90-102 dBA con limitador si el municipio lo exige',
      'Expediente de contrato menor: memoria, presupuesto desglosado y factura FACe'
    ],
    recommendedPack: 'Concierto de Feria (producción integral) — ver sección Ayuntamientos'
  },
  {
    id: 'empresa',
    title: 'Eventos Corporativos & Convenciones',
    tagline: 'Presencia de marca con impacto internacional',
    badge: 'B2B Enterprise',
    icon: <Building2 className="text-amber-400" size={24} />,
    description: 'Cenas de empresa, aniversarios corporativos, cócteles temáticos mexicanos y lanzamientos de producto con prestigio.',
    bulletPoints: [
      'Imagen corporativa sobria de etiqueta y elegancia',
      'Recepción de directivos y networking interactivo',
      'Facturación fiscal con desglose de IVA y soporte 24/7',
      'Flexibilidad de horarios y protocolo ejecutivo'
    ],
    recommendedPack: 'Gala Imperial o Mariachi Monumental'
  }
];

export default function MariachiEventTypes() {
  const [selectedId, setSelectedId] = useState<string>('bodas');

  const selectedEvent = EVENT_TYPES.find(e => e.id === selectedId) || EVENT_TYPES[0];

  const handleWhatsAppForEvent = (eventTitle: string) => {
    const text = encodeURIComponent(
      `¡Hola! Quiero consultar contratación de mariachis para un evento:\n\n` +
      `• Tipo de celebración: ${eventTitle}\n` +
      `• Deseo cotización exacta y disponibilidad.\n\n` +
      `¿Podéis ayudarme?`
    );
    window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
  };

  return (
    <div id="tipos-de-evento" className="space-y-8">
      {/* Cabecera */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
          <Sparkles size={14} />
          EXPERIENCIAS A MEDIDA // COBERTURA INTEGRAL
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
          ¿Qué Quieres Celebrar?
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-sans">
          Cada ocasión requiere un enfoque sonoro y escénico único. Adaptamos la formación y el repertorio a la solemnidad o euforia de tu fecha.
        </p>
      </div>

      {/* Tabs de Selección */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        {EVENT_TYPES.map((ev) => {
          const isActive = ev.id === selectedId;
          return (
            <button
              key={ev.id}
              onClick={() => setSelectedId(ev.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${isActive
                ? 'bg-[#ecb613] text-black font-bold shadow-lg shadow-[#ecb613]/20 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                }`}
            >
              {ev.icon}
              <span>{ev.title}</span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta Detallada del Evento Seleccionado */}
      <div className="rounded-3xl bg-[#07070b] border border-white/10 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/15 text-[#ecb613] text-[11px] font-mono uppercase">
            {selectedEvent.badge}
          </div>
          <h3 className="text-2xl sm:text-4xl font-black font-syne uppercase text-white">
            {selectedEvent.title}
          </h3>
          <p className="text-sm text-white/50 font-mono">
            {selectedEvent.tagline}
          </p>
          <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
            {selectedEvent.description}
          </p>

          <div className="space-y-2.5 pt-2">
            {selectedEvent.bulletPoints.map((bp, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/70 font-sans">
                <CheckCircle2 size={16} className="text-[#ecb613] shrink-0" />
                <span>{bp}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleWhatsAppForEvent(selectedEvent.title)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md shadow-[#ecb613]/20"
            >
              Consultar Disponibilidad para {selectedEvent.title}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Panel Lateral: Pack Recomendado */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-black/40 border border-[#ecb613]/20 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">
            FORMACIÓN RECOMENDADA
          </span>
          <h4 className="text-lg font-bold font-syne text-white">
            {selectedEvent.recommendedPack}
          </h4>
          <p className="text-xs text-white/60 font-sans leading-relaxed">
            Formación acústica y visual diseñada específicamente para maximizar la acústica y el disfrute en este tipo de celebración.
          </p>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-mono text-white/70 space-y-1">
            <div className="flex justify-between">
              <span>Depósito Reserva Stripe:</span>
              <strong className="text-[#ecb613]">100 € (Deducible)</strong>
            </div>
            <div className="flex justify-between">
              <span>Rider Acústico:</span>
              <span className="text-cyan-400">Según límite dBA del recinto</span>
            </div>
          </div>
          <a
            href="#precios"
            className="block text-center text-xs font-mono text-[#ecb613] hover:underline pt-1"
          >
            Ver tabla completa de precios y packs &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

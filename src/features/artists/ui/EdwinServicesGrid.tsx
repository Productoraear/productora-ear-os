"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cake, Heart, Sparkles, Users, Award, Video, 
  CheckCircle2, ArrowRight, ShieldCheck, Clock, Crown, Zap, Gift
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { CENTRALITA } from '@/lib/phone-constants';

interface HistoricalService {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  highlights: string[];
  repertoire: string;
  quoteSlug: string;
}

const HISTORICAL_SERVICES: HistoricalService[] = [
  {
    id: 'cumpleanos',
    title: 'Mariachis para Cumpleaños',
    badge: 'Sorpresa Emocional',
    icon: <Cake className="text-[#ecb613]" size={28} />,
    subtitle: 'Impacto directo en ventana, balcón, restaurante o salón',
    description: 'La sorpresa definitiva para celebrar la vida. Llegada coordinada con la complicidad de los organizadores para irrumpir cantando "Las Mañanitas" en el momento exacto.',
    highlights: [
      'Entrada sorpresa milimétricamente cronometrada',
      'Las Mañanitas, El Rey, Cielito Lindo y dedicatoria',
      'Fotos de recuerdo con trajes charros de gala',
      'Desplazamiento a domicilio o local privado'
    ],
    repertoire: 'Las Mañanitas, En Tu Día, El Rey, Felicidades',
    quoteSlug: 'cumpleanos'
  },
  {
    id: 'bodas',
    title: 'Regalo de Boda & Compromiso',
    badge: 'Máxima Distinción',
    icon: <Heart className="text-[#ecb613]" size={28} />,
    subtitle: 'La serenata inolvidable para la ceremonia o el cóctel',
    description: 'Un regalo de alta etiqueta para los novios. Ya sea como sorpresa tras el "Sí, quiero", apertura del cóctel en jardines o irrupción festiva en la barra libre.',
    highlights: [
      'Repertorio lírico romántico de autor',
      'Sonorización invisible Bose F1 sin cables a la vista',
      'Coordinación con el equipo de wedding planners',
      'Respeto a los limitadores acústicos de la finca'
    ],
    repertoire: 'Si Nos Dejan, Motivos, Sabes Una Cosa, Bésame Mucho',
    quoteSlug: 'bodas'
  },
  {
    id: 'quince-anos',
    title: 'Fiesta de Quince Años (XV)',
    badge: 'Rito Tradicional',
    icon: <Sparkles className="text-[#ecb613]" size={28} />,
    subtitle: 'El protocolo de gala tradicional para la quinceañera',
    description: 'El homenaje más solemne y emotivo para celebrar los 15 años. Entrada triunfal con el vals tradicional interpretado en directo por el mariachi imperial.',
    highlights: [
      'Vals de gala con el padre y padrinos en directo',
      'Serenata de entrega de ramo y última muñeca',
      'Formación de etiqueta con botonadura de plata',
      'Show alegre para abrir el baile con los invitados'
    ],
    repertoire: 'Quince Primaveras, De Niña a Mujer, Mi Niña Bonita',
    quoteSlug: 'quince-anos'
  },
  {
    id: 'madre-padre',
    title: 'Día de la Madre y del Padre',
    badge: 'Gratitud Familiar',
    icon: <Users className="text-[#ecb613]" size={28} />,
    subtitle: 'El abrazo musical que agradece toda una vida',
    description: 'Homenaje de profunda emoción para padres y abuelos. Canciones que tocan la fibra y celebran el esfuerzo de toda una familia reunida en torno a la música tradicional.',
    highlights: [
      'Interpretación de "Algún Día Mamá" por Edwin Agudelo',
      'Repertorio nostálgico de la época dorada mexicana',
      'Ambiente entrañable y cercano para todas las edades',
      'Formato adaptable a domicilios, jardines o restaurantes'
    ],
    repertoire: 'Amor Eterno, Mi Querido Viejo, Algún Día Mamá, Madrecita Querida',
    quoteSlug: 'dia-de-la-madre'
  },
  {
    id: 'caballo',
    title: 'Show Cantando a Caballo',
    badge: 'Espectáculo Ecuestre Único',
    icon: <Award className="text-[#ecb613]" size={28} />,
    subtitle: 'Fusión de alta escuela ecuestre y mariachi de gala',
    description: 'Un espectáculo único en Europa. Edwin Agudelo fusiona la doma clásica con el mariachi imperial a lomos de caballos de pura raza española y aztecas.',
    highlights: [
      'Paso español, piaffé y reverencia al compás de la trompeta',
      'Montura charra artesanal y traje de gran gala bordado',
      'Sonorización inalámbrica Shure Axient anti-viento',
      'Ideal para plazas de toros, fincas y festejos patronales'
    ],
    repertoire: 'El Patas Blancas, Caballo Prieto Azabache, La Mula Bronca',
    quoteSlug: 'show-caballo'
  },
  {
    id: 'serenata-virtual',
    title: 'Serenata Virtual & Canción a Medida',
    badge: 'Cobertura Global',
    icon: <Video className="text-[#ecb613]" size={28} />,
    subtitle: 'Vídeo-serenata en 4K y canciones personalizadas',
    description: 'Llega al corazón de tus seres queridos sin importar la distancia. Edwin Agudelo graba en estudio profesional un saludo personalizado y las canciones solicitadas.',
    highlights: [
      'Vídeo masterizado en 4K DCI con dedicatoria expresa',
      'Opción de composición de letra inédita a medida',
      'Entrega digital exprés en 24-48 horas por enlace privado',
      'Conexión en directo vía Zoom/Streaming si se desea'
    ],
    repertoire: 'Canción Inédita Personalizada o Clásicos a Petición',
    quoteSlug: 'serenata-virtual'
  }
];

const VALUE_PROPOSITIONS = [
  {
    icon: <Heart size={20} className="text-[#ecb613]" />,
    title: 'Empatía y Repertorio a Medida',
    desc: 'Cada homenaje es único. Acordamos contigo el orden de los temas y los momentos clave para asegurar lágrimas de alegría y diversión.'
  },
  {
    icon: <Clock size={20} className="text-[#ecb613]" />,
    title: 'Exclusividad en la Fecha (Sin Prisas)',
    desc: 'No solapamos actuaciones a contrarreloj. Bloqueamos el tiempo necesario para que tu evento disfrute de toda la atención que merece.'
  },
  {
    icon: <ShieldCheck size={20} className="text-[#ecb613]" />,
    title: 'Mariachi en Positivo',
    desc: 'Letras de calidad humana, eliminando cualquier vestigio de machismo o violencia. Música tradicional cantada con respeto y dignidad.'
  }
];

export const EdwinServicesGrid: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-[9px] font-black uppercase tracking-[0.4em]">
            <Crown size={14} /> Ecosistema de Ocasiones Históricas
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white font-syne">
            6 Formatos para Momentos <span className="text-[#ecb613]">Inolvidables</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            Desde serenatas íntimas bajo la ventana hasta espectáculos ecuestres de gran formato. Dos décadas llevando emoción pura a toda España y Europa.
          </p>
        </div>

        {/* PILARES DE VALOR ÉTICO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PROPOSITIONS.map((val, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-[#09090d] border border-white/5 space-y-3 relative overflow-hidden group hover:border-[#ecb613]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {val.icon}
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-white font-syne">
                {val.title}
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

        {/* GRID DE LOS 6 SERVICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HISTORICAL_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="rounded-[2.5rem] bg-[#09090d] border border-white/10 p-8 flex flex-col justify-between hover:border-[#ecb613]/40 transition-all duration-300 group hover:shadow-[0_15px_50px_rgba(236,182,19,0.1)] relative overflow-hidden"
            >
              {/* Resplandor hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ecb613]/10 blur-[80px] rounded-full group-hover:opacity-100 opacity-0 transition-opacity" />

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </div>
                  <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-3 py-1 rounded-full">
                    {srv.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white font-syne">
                    {srv.title}
                  </h3>
                  <p className="text-[10px] font-mono uppercase text-[#ecb613]/80 font-bold">
                    {srv.subtitle}
                  </p>
                </div>

                <p className="text-white/60 text-xs leading-relaxed">
                  {srv.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  {srv.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[11px] text-white/70">
                      <CheckCircle2 size={13} className="text-[#ecb613] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Repertorio clave */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[8px] font-mono uppercase text-white/40 block font-bold">Repertorio Destacado</span>
                  <span className="text-[10px] text-[#ecb613] font-mono italic block">{srv.repertoire}</span>
                </div>
              </div>

              {/* Botón de Cotización / Reserva */}
              <div className="pt-6 mt-6 border-t border-white/5 relative z-10">
                <a
                  href={`https://wa.me/34693693048?text=Hola%20Edwin,%20me%20gustaría%20solicitar%20información%20y%20reservar%20el%20servicio%20de%20${encodeURIComponent(srv.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#ecb613] hover:text-black hover:border-[#ecb613] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 group/btn"
                >
                  <span>Consultar Disponibilidad</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

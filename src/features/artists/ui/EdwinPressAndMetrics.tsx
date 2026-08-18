"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Award, Newspaper, Star, Globe2, Quote, 
  ExternalLink, CheckCircle, Sparkles, Building2
} from 'lucide-react';

interface CircularMetricProps {
  percentage: number;
  label: string;
  sublabel: string;
  color?: string;
}

const CircularMetric: React.FC<CircularMetricProps> = ({ 
  percentage, 
  label, 
  sublabel, 
  color = '#ecb613' 
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-3xl bg-[#09090d] border border-white/5 relative overflow-hidden group hover:border-[#ecb613]/30 transition-all">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/10"
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white font-mono tracking-tighter">
            {percentage}%
          </span>
          <span className="text-[7px] font-black uppercase tracking-widest text-[#ecb613]">Verificado</span>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-black uppercase text-white tracking-tight font-syne">
          {label}
        </h4>
        <p className="text-xs text-white/50 leading-relaxed max-w-[200px]">
          {sublabel}
        </p>
      </div>
    </div>
  );
};

const PRESS_CLIPPINGS = [
  {
    media: 'Premios Gladiadores en el Extranjero 2021',
    headline: 'Máximo Galardón al Emprendimiento & Cultura Hispana',
    excerpt: 'Reconocimiento unánime en Madrid a Edwin Agudelo por su liderazgo artístico, integración cultural y dirección del Mariachi Imperial.',
    category: 'Galardón de Oro',
    year: '2021',
    icon: <Trophy className="text-[#ecb613]" size={20} />
  },
  {
    media: 'Periódico Alnavio',
    headline: '"El mariachi colombiano que canta rancheras por la igualdad"',
    excerpt: 'Reportaje en profundidad sobre el repertorio en positivo de Edwin Agudelo, desterrando clichés machistas y elevando la poesía tradicional.',
    category: 'Prensa Escrita',
    year: '2019',
    icon: <Newspaper className="text-[#ecb613]" size={20} />
  },
  {
    media: 'Gala Máximo Orgullo Hispano',
    headline: 'Distinción de Honor en Las Vegas, Nevada',
    excerpt: 'Homenaje a la trayectoria internacional y proyección de la música ranchera de autor en escenarios europeos y americanos.',
    category: 'Proyección Internacional',
    year: '2018',
    icon: <Globe2 className="text-[#ecb613]" size={20} />
  },
  {
    media: 'Revista Reflejo Latino',
    headline: 'La Conquista de La Cubierta de Leganés',
    excerpt: 'Crónica del macro-concierto de soporte a Ana Gabriel ante más de 8.000 personas en la Plaza de Toros de Leganés (Madrid).',
    category: 'Crítica de Conciertos',
    year: '2016',
    icon: <Star className="text-[#ecb613]" size={20} />
  },
  {
    media: 'Periódico EScolombia',
    headline: 'Embajador del Folclore y la Dignidad Profesional',
    excerpt: 'Perfil editorial sobre el recorrido de 20 años de Edwin Agudelo en España, desde sus inicios hasta la fundación de Productora EAR.',
    category: 'Reportaje Central',
    year: '2017',
    icon: <Award className="text-[#ecb613]" size={20} />
  },
  {
    media: 'Consulado General de Colombia en Madrid',
    headline: 'Diploma de Honor al Mérito Artístico y Comunitario',
    excerpt: 'Certificación diplomática oficial concedida por el cuerpo consular en el Teatro La Latina con motivo del lanzamiento de "Mi Propia Realidad".',
    category: 'Certificación Diplomática',
    year: '2014',
    icon: <Building2 className="text-[#ecb613]" size={20} />
  }
];

export const EdwinPressAndMetrics: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-[#08080c] border-y border-white/5 relative overflow-hidden">
      {/* Luces difusas */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* 1. SECCIÓN DE MÉTRICAS CIRCULARES DE SATISFACCIÓN */}
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#ecb613] block font-mono">
              Auditoría de Experiencia
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
              Métricas de Satisfacción <span className="text-[#ecb613]">Verificadas</span>
            </h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">
              Datos consolidados a lo largo de más de dos décadas de eventos privados, bodas y galas institucionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CircularMetric
              percentage={95}
              label="Satisfacción de Clientes"
              sublabel="Calificación media de 5.0★ en puntualidad, vestuario y emoción en directo."
              color="#ecb613"
            />
            <CircularMetric
              percentage={75}
              label="Tasa de Recurrencia"
              sublabel="Familias y empresas que vuelven a contratar a Edwin Agudelo para aniversarios sucesivos."
              color="#10b981"
            />
            <CircularMetric
              percentage={80}
              label="Recomendación Activa"
              sublabel="Nuevas reservas originadas por invitados que presenciaron una actuación previa."
              color="#3b82f6"
            />
          </div>
        </div>

        {/* 2. SECCIÓN DE PRENSA Y RECONOCIMIENTOS */}
        <div className="space-y-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#ecb613] block font-mono">
                Cobertura en Medios & Premios
              </span>
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
                Prensa y Distinciones de Honor
              </h3>
            </div>
            <p className="text-white/50 text-xs max-w-md font-mono uppercase">
              La prensa internacional y los organismos oficiales han respaldado la trayectoria de Edwin Agudelo como referente del mariachi en Europa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRESS_CLIPPINGS.map((clip, i) => (
              <div
                key={i}
                className="p-8 rounded-[2rem] bg-[#09090d] border border-white/10 space-y-4 hover:border-[#ecb613]/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-2.5 py-1 rounded-full">
                      {clip.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">{clip.year}</span>
                  </div>

                  <h4 className="text-base font-black text-white uppercase tracking-tight font-syne group-hover:text-[#ecb613] transition-colors">
                    {clip.headline}
                  </h4>

                  <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">
                    Fuente: {clip.media}
                  </span>

                  <p className="text-xs text-white/60 leading-relaxed italic">
                    "{clip.excerpt}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/40">
                  <span className="flex items-center gap-1.5 text-[#ecb613]">
                    <CheckCircle size={12} /> Archivo Histórico Verificado
                  </span>
                  {clip.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Video,
  Sparkles,
  Camera,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clapperboard,
  Sliders,
  DollarSign,
  Phone
} from 'lucide-react';
import { DEPOSITO_STRIPE_EUR, CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

interface VideoPackage {
  level: number;
  name: string;
  priceEur: number;
  cameras: string;
  shootingHours: string;
  locations: string;
  deliverables: string[];
  idealFor: string;
}

const VIDEO_PACKAGES: VideoPackage[] = [
  {
    level: 1,
    name: 'Acústico Live',
    priceEur: 290,
    cameras: '1 Cámara 4K Cinema',
    shootingHours: '2 Horas de Rodaje',
    locations: '1 Locación (Estudio o Sala)',
    deliverables: ['Vídeo Musical 4K Masterizado', 'Audio Directo Sincronizado', '1 Teaser Vertical para Redes'],
    idealFor: 'Músicos solistas, covers acústicos y directos íntimos.'
  },
  {
    level: 2,
    name: 'Estudio Íntimo',
    priceEur: 450,
    cameras: '2 Cámaras 4K Multi-ángulo',
    shootingHours: '3 Horas de Rodaje',
    locations: '1 Estudio Profesional',
    deliverables: ['Edición Multi-cámara Dinámica', 'Etalonaje de Color Cinematográfico', '2 Teasers para TikTok/Reels'],
    idealFor: 'Singles promocionales y directos de estudio con alta definición.'
  },
  {
    level: 3,
    name: 'Escenario & Luces',
    priceEur: 690,
    cameras: '2 Cámaras 4K + Gimbal Estabilizador',
    shootingHours: '4 Horas de Rodaje',
    locations: '1 Escenario con Iluminación LED',
    deliverables: ['Efectos de Iluminación Escénica', 'Montaje Rítmico de Alto Impacto', 'Master 4K + 3 Clips Cortos'],
    idealFor: 'Bandas, grupos flamencos, orquestas y temas con coreografía.'
  },
  {
    level: 4,
    name: 'Exteriores 1 Locación',
    priceEur: 950,
    cameras: '2 Cámaras Cine + Ópticas Prime',
    shootingHours: '5 Horas de Rodaje',
    locations: '1 Exterior Natural o Finca Histórica',
    deliverables: ['Rodaje Golden Hour (Atardecer)', 'Color Grading Editorial', 'Fotografías de Portada en Alta Resolución'],
    idealFor: 'Videoclips con atmósfera cinematográfica en paisajes o monumentos.'
  },
  {
    level: 5,
    name: 'Dúo Creativo',
    priceEur: 1290,
    cameras: '3 Cámaras Cine + Slider Motorizado',
    shootingHours: '6 Horas de Rodaje',
    locations: '2 Locaciones (Interior + Exterior)',
    deliverables: ['Guión Visual Estructurado', 'Tomas Detalle en Slow-Motion', 'Pack de 5 Formatos de Redes'],
    idealFor: 'Colaboraciones entre artistas, duetos y lanzamientos oficiales.'
  },
  {
    level: 6,
    name: 'Dron 4K & Rodaje Dual',
    priceEur: 1690,
    cameras: 'Cámaras Cine + Dron 4K Homologado AESA',
    shootingHours: '8 Horas de Rodaje (Jornada Completa)',
    locations: '2 Locaciones con Tomas Aéreas',
    deliverables: ['Planos Aéreos Cinemáticos', 'Maquillaje y Estilismo Básico en Set', 'Edición Completa con Efectos Visuales'],
    idealFor: 'Artistas consolidados que buscan escala visual de alto presupuesto.'
  },
  {
    level: 7,
    name: 'Historia & Guión Actores',
    priceEur: 2190,
    cameras: 'Setup Completo Cinema Rig',
    shootingHours: '1 Día y Medio de Rodaje',
    locations: '3 Locaciones Escogidas',
    deliverables: ['Casting de 2 Actores Secundarios', 'Guión Narrativo con Trama Emotiva', 'Postproducción y Diseño Sonoro FX'],
    idealFor: 'Videoclips con historia dramática, narrativa romántica o acción.'
  },
  {
    level: 8,
    name: 'Cine Indie Multi-locación',
    priceEur: 2890,
    cameras: 'Doble Operador de Cámara + Foquista',
    shootingHours: '2 Días Completos de Rodaje',
    locations: '4 Locaciones',
    deliverables: ['Director de Fotografía Dedicado', 'Equipo Completo de Iluminación Arri', 'Estrategia de Estreno en YouTube'],
    idealFor: 'Producciones independientes de nivel festival y videoclips de gira.'
  },
  {
    level: 9,
    name: 'Superproducción Escénica',
    priceEur: 3750,
    cameras: 'Equipo de Rodaje Completo (6 Técnicos)',
    shootingHours: '3 Días de Rodaje',
    locations: 'Múltiples Sets con Escenografía',
    deliverables: ['Dirección de Arte y Atrezzo Exclusivo', 'Dron FPV + Dron Cine', 'Campaña Promocional Digital'],
    idealFor: 'Disqueras, artistas top y grandes lanzamientos de temporada.'
  },
  {
    level: 10,
    name: 'Cine Master 4K & Distribución',
    priceEur: 4900,
    cameras: 'Cámara de Cine Digital de Formato Completo',
    shootingHours: 'Plan de Rodaje Completo con Casting',
    locations: 'Sets Cerrados y Exteriores Singulares',
    deliverables: ['Producción Ejecutiva Llave en Mano', 'VFX y Efectos Visuales Avanzados', 'Distribución a Agregadoras y Medios'],
    idealFor: 'El máximo estándar de la industria discográfica europea sin intermediarios.'
  }
];

export default function VideoclipsPage() {
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const activePackage = VIDEO_PACKAGES.find((p) => p.level === selectedLevel) || VIDEO_PACKAGES[2];

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* CABECERA CON VÍDEO OFICIAL DE PRODUCCIÓN (SO_YgpKD4PQ) */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-mono font-medium border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Clapperboard size={13} />
            <span>PRODUCCIÓN AUDIOVISUAL CINEMATOGRÁFICA · EAR OS STUDIOS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif mb-4 leading-tight">
            Videoclips Musicales 4K.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              10 Niveles de Menor a Mayor con Precios Cerrados.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Desde directos acústicos puros hasta producciones de cine con actores, drones y etalonaje. Elige tu nivel con límites y entregables claros sin sorpresas de presupuesto.
          </p>

          {/* Vídeo de Referencia Audiovisual */}
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(236,182,19,0.15)] bg-black/80 aspect-video mb-12">
            <iframe
              src="https://www.youtube-nocookie.com/embed/SO_YgpKD4PQ?rel=0&modestbranding=1"
              title="Producción de Videoclips Oficial · Productora EAR"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>

        {/* SELECTOR INTERACTIVO DE LOS 10 NIVELES */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 text-xs font-mono">
            <span className="text-zinc-400 uppercase tracking-wider">Selecciona tu Nivel de Producción:</span>
            <span className="text-amber-400 font-bold">Nivel {activePackage.level}: {activePackage.name}</span>
          </div>

          {/* Botones de Selección 1 a 10 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-8">
            {VIDEO_PACKAGES.map((pkg) => (
              <button
                key={pkg.level}
                onClick={() => setSelectedLevel(pkg.level)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedLevel === pkg.level
                    ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-[0_0_20px_rgba(236,182,19,0.4)] scale-105'
                    : 'bg-zinc-900/60 text-zinc-300 border-white/5 hover:bg-zinc-800'
                }`}
              >
                <div className="text-[10px] opacity-75 font-mono">Nivel {pkg.level}</div>
                <div className="text-xs font-bold truncate">{pkg.name}</div>
                <div className="text-xs font-mono mt-1">{pkg.priceEur} €</div>
              </button>
            ))}
          </div>

          {/* FICHA DETALLADA DEL PAQUETE SELECCIONADO */}
          <div className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#09090d]/90 backdrop-blur-xl shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider mb-3 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Nivel {activePackage.level} · {activePackage.idealFor}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-4">
                  {activePackage.name} — {activePackage.priceEur.toLocaleString('es-ES')} €
                </h2>

                {/* Especificaciones Técnicas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                    <span className="block opacity-60 text-[10px]">Cámaras y Ópticas:</span>
                    <span className="font-bold text-white">{activePackage.cameras}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                    <span className="block opacity-60 text-[10px]">Tiempo de Rodaje:</span>
                    <span className="font-bold text-white">{activePackage.shootingHours}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                    <span className="block opacity-60 text-[10px]">Locaciones:</span>
                    <span className="font-bold text-white">{activePackage.locations}</span>
                  </div>
                </div>

                {/* Entregables Incluidos */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                    Entregables Garantizados:
                  </span>
                  {activePackage.deliverables.map((deliv) => (
                    <div key={deliv} className="flex items-center gap-2 text-xs text-zinc-200">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarjeta de Reserva */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-amber-500/30 text-center space-y-4">
                <div className="text-xs font-mono text-zinc-400 uppercase">Tarifa Oficial Cerrada</div>
                <div className="text-4xl font-extrabold font-mono text-amber-400">
                  {activePackage.priceEur.toLocaleString('es-ES')} €
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Reserva tu fecha de rodaje con fianza deducible de {DEPOSITO_STRIPE_EUR} € o consulta fechas disponibles directamente por WhatsApp.
                </p>

                <div className="space-y-2 pt-2">
                  <a
                    href={`https://wa.me/34693693048?text=${encodeURIComponent(
                      `Hola Edwin, deseo reservar el rodaje de un videoclip Nivel ${activePackage.level}: ${activePackage.name} (${activePackage.priceEur} €).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-all shadow-md hover:scale-105"
                  >
                    <span>Reservar Rodaje Nivel {activePackage.level}</span>
                    <ArrowRight size={14} />
                  </a>

                  <a
                    href={`tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 font-mono text-xs transition-colors"
                  >
                    <Phone size={13} className="text-amber-500" />
                    <span>Llamar a Centralita ({CENTRALITA_EAR_OS})</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

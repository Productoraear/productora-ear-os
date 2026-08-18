"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Video, Music, Sparkles, Youtube, ExternalLink, 
  Lock, X, Clock, Clapperboard, Award, Heart, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export interface GalleryItem {
  id: string;
  trackNumber: string;
  title: string;
  subtitle: string;
  duration: string;
  genre: string;
  year: string;
  youtubeId: string;
  youtubeUrl: string;
  badge: string;
  credits: string;
  isPrivate?: boolean;
  description: string;
}

const VAULT_ITEMS: GalleryItem[] = [
  {
    id: 'item-1',
    trackNumber: '01',
    title: 'Amantes y Amigos (Bachata)',
    subtitle: 'Feat. Andriu Mathyun • Dirección: Pablo Quispe',
    duration: '01:59',
    genre: 'Bachata Urbana / Fusión',
    year: '2022',
    youtubeId: 'tx3Jc5A-0Lk',
    youtubeUrl: 'https://youtu.be/tx3Jc5A-0Lk',
    badge: '165K+ REPRODUCCIONES',
    credits: 'Dirección de Fotografía: Pablo Quispe • Feat Andriu Mathyun',
    description: 'Primer hito de colaboración multi-artista y diversificación de género. Estética cinematográfica y versatilidad vocal.'
  },
  {
    id: 'item-2',
    trackNumber: '02',
    title: 'Mi Propia Realidad',
    subtitle: 'El himno oficial de resiliencia y retorno del emigrante',
    duration: '03:45',
    genre: 'Ranchera Lírica de Gala',
    year: '2014',
    youtubeId: '7yybH70StV0',
    youtubeUrl: 'https://youtu.be/7yybH70StV0',
    badge: 'HIMNO DE EMIGRANTES',
    credits: 'Autor e Intérprete: Edwin Agudelo • Teatro La Latina',
    description: 'Declaración de principios sobre la lucha del emigrante y la forja de la identidad artística con mariachi.'
  },
  {
    id: 'item-3',
    trackNumber: '03',
    title: 'Live Session San Valentín & Bodas',
    subtitle: 'Top 10 Rancheras Más Pedidas en Directo',
    duration: '10:15',
    genre: 'Mariachi Live Session 4K',
    year: '2024',
    youtubeId: 'fLT4-kqfdI4',
    youtubeUrl: 'https://youtu.be/fLT4-kqfdI4',
    badge: 'TOP 10 EN DIRECTO',
    credits: 'Ensamble Mariachi de Gala • Presión Acústica S-Class',
    description: '10 clásicos inmortales en riguroso directo con potencia vocal de tenor para eventos de gran formato.'
  },
  {
    id: 'item-4',
    trackNumber: '04',
    title: 'Algún Día Mamá',
    subtitle: 'Homenaje universal a las madres (Videoclip Oficial)',
    duration: '04:12',
    genre: 'Mariachi Tradicional Solemne',
    year: '2016',
    youtubeId: '0DSEsWA9JsA',
    youtubeUrl: 'https://youtu.be/0DSEsWA9JsA',
    badge: 'VIDEOCLIP OFICIAL',
    credits: 'Composición: Edwin Agudelo • La Cubierta de Leganés',
    description: 'La obra definitiva para serenatas a madres, aniversarios y bodas. Emoción lírica de alta intensidad.'
  },
  {
    id: 'item-5',
    trackNumber: '05',
    title: 'Acompáñame',
    subtitle: 'Balada Sinfónica de Esperanza y Superación',
    duration: '03:58',
    genre: 'Balada Sinfónica Positiva',
    year: '2020',
    youtubeId: 'jTU8aBsX2ik',
    youtubeUrl: 'https://youtu.be/jTU8aBsX2ik',
    badge: 'PRODUCCIÓN SINFÓNICA',
    credits: 'Prod: Silvio Ocaña • Metales: Over Vásquez • Dir: Ángeles Cepero',
    description: 'Himno de esperanza y resiliencia médica dedicado a la superación de dificultades y gratitud familiar.'
  },
  {
    id: 'item-6',
    trackNumber: '06',
    title: 'Piel de Niña (A Medida)',
    subtitle: 'Obra Personalizada & Encargo Privado • Evelin de Fonsi',
    duration: '04:30',
    genre: 'Serenata Personalizada VIP',
    year: '2026',
    youtubeId: 'xf2Cv6BsCkw',
    youtubeUrl: 'https://youtu.be/xf2Cv6BsCkw',
    badge: 'SERVICIO PRIVADO VIP',
    isPrivate: true,
    credits: 'Producción a Medida Productora EAR • Registro SGAE',
    description: 'Ejemplo de producción exclusiva personalizada para aniversarios y declaraciones de amor únicas.'
  }
];

interface EdwinVaultGalleryGridProps {
  onSelectTrack?: (index: number, mode: 'audio' | 'video') => void;
}

export const EdwinVaultGalleryGrid: React.FC<EdwinVaultGalleryGridProps> = ({ onSelectTrack }) => {
  const [activeModalVideo, setActiveModalVideo] = useState<GalleryItem | null>(null);

  const handleAction = (item: GalleryItem, index: number, mode: 'audio' | 'video') => {
    if (mode === 'video') {
      setActiveModalVideo(item);
    }
    if (onSelectTrack) {
      onSelectTrack(index, mode);
    }
  };

  return (
    <div className="space-y-12">
      {/* CABECERA DE LA CUADRÍCULA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-[#ecb613] bg-[#ecb613]/10 px-3 py-1 rounded-full border border-[#ecb613]/30">
              Catálogo Audiovisual S-Class
            </span>
            <span className="text-xs text-white/40 font-mono">6 Obras Canónicas</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-syne">
            Galería Multimedia de Autor
          </h3>
        </div>
        <p className="text-xs text-white/50 max-w-md text-left md:text-right">
          Explora la discografía, videoclips en 4K y directos de gala con reproducción asíncrona dual sin cortes.
        </p>
      </div>

      {/* CUADRÍCULA DE 6 TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VAULT_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className="group rounded-3xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/40 p-5 space-y-4 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between"
          >
            {/* MINIATURA Y BADGES */}
            <div className="space-y-3">
              <div 
                onClick={() => handleAction(item, idx, 'video')}
                className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black cursor-pointer border border-white/5 group-hover:border-purple-500/40 transition-all"
              >
                <img
                  src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* Overlay Oscuro con Botón Play */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/90 group-hover:bg-[#ecb613] text-white group-hover:text-black flex items-center justify-center shadow-2xl transition-all transform group-hover:scale-110">
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>

                {/* Badge Superior */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[8px] font-mono font-bold uppercase text-[#ecb613]">
                  <span>{item.trackNumber}</span>
                  <span>•</span>
                  <span>{item.badge}</span>
                </div>

                {/* Duración */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-white/80">
                  <Clock size={10} />
                  <span>{item.duration}</span>
                </div>
              </div>

              {/* TÍTULO Y DESCRIPCIÓN */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold uppercase">
                    {item.genre}
                  </span>
                  <span className="text-[9px] font-mono text-white/40">{item.year}</span>
                </div>
                <h4 className="text-base font-black uppercase text-white font-syne group-hover:text-[#ecb613] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* CRÉDITOS TÉCNICOS */}
              <div className="text-[9px] font-mono text-white/40 bg-white/5 border border-white/5 p-2 rounded-xl flex items-center gap-1.5 truncate">
                <Clapperboard size={12} className="text-[#ecb613] shrink-0" />
                <span className="truncate">{item.credits}</span>
              </div>
            </div>

            {/* BOTONES DUALES DE ACCIÓN [ESCUCHAR AUDIO | VER VÍDEO] */}
            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-white/5">
              <button
                onClick={() => {
                  handleAction(item, idx, 'video');
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Video size={13} />
                <span>Ver Vídeo</span>
              </button>

              <button
                onClick={() => {
                  handleAction(item, idx, 'audio');
                  // Desplazar suavemente hacia el reproductor
                  const playerEl = document.getElementById('legacy-player-section');
                  if (playerEl) {
                    playerEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-[#ecb613]/20 hover:bg-[#ecb613] text-[#ecb613] hover:text-black border border-[#ecb613]/30 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Music size={13} />
                <span>Escuchar Audio</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE VÍDEO CINEMATOGRÁFICO INTERACTIVO */}
      <AnimatePresence>
        {activeModalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setActiveModalVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#09090d] border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_0_80px_rgba(168,85,247,0.3)] overflow-hidden"
            >
              {/* Botón de Cerrar */}
              <button
                onClick={() => setActiveModalVideo(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>

              {/* Encabezado del Modal */}
              <div className="space-y-1 pr-12">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded font-bold uppercase">
                    {activeModalVideo.genre}
                  </span>
                  <span className="text-xs text-white/40 font-mono">• {activeModalVideo.year}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white font-syne">
                  {activeModalVideo.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {activeModalVideo.subtitle}
                </p>
              </div>

              {/* Contenedor IFrame de YouTube */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeModalVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeModalVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Pie de Créditos y CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                <div className="text-xs font-mono text-white/50">
                  <span className="text-purple-400 font-bold">Créditos:</span> {activeModalVideo.credits}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeModalVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono flex items-center gap-2 border border-white/10 transition-all"
                  >
                    <Youtube size={14} className="text-red-500" />
                    <span>Ver en YouTube</span>
                    <ExternalLink size={12} />
                  </a>

                  <Link
                    href="/cotizador"
                    className="px-5 py-2 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                  >
                    <span>Cotizar Serenata</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

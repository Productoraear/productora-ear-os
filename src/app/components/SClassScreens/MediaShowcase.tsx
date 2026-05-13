'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Image as ImageIcon, Music, Youtube } from 'lucide-react';

const SHOWCASE_VIDEOS = [
  { id: 'mP2D_J8f_mE', title: 'Mariachi de Gala - Live Session' },
  { id: 'D-m1r6V1Z2M', title: 'Acompáñame - Videoclip Oficial' },
];

const SHOWCASE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1514525253361-bee8d40d463d?auto=format&fit=crop&q=80&w=600', alt: 'Edwin Agudelo Escenario' },
  { url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=600', alt: 'Mariachi S-Class' },
  { url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600', alt: 'Protocolo Eventos' },
];

export const MediaShowcase: React.FC = () => {
  return (
    <section className="py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Youtube className="text-[#d4a855]" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Showcase de Autor</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Materialización <br />
              <span className="text-white/20">Audiovisual</span>
            </h2>
          </div>
          
          <p className="max-w-md text-sm text-white/40 font-medium uppercase leading-relaxed text-right">
            Activos multimedia de alto impacto, incluyendo el himno de reconexión "ACOMPÁÑAME", dedicado a los héroes de la pandemia y certificado como hito de soberanía emocional.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {SHOWCASE_VIDEOS.map((video, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative aspect-video rounded-[2rem] overflow-hidden glass-panel group"
            >
              <iframe
                className="w-full h-full grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                src={`https://www.youtube.com/embed/${video.id}?controls=1&rel=0`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              />
              <div className="absolute bottom-6 left-6 pointer-events-none group-hover:opacity-0 transition-opacity">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                  {video.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_IMAGES.map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-square rounded-[2rem] overflow-hidden glass-panel group"
            >
              <Image 
                src={img.url} 
                alt={img.alt}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855]">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

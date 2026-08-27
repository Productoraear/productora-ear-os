import React from 'react';

interface CinematicHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  mediaSrc: string;
  isVideo?: boolean;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  mediaSrc,
  isVideo = false,
}) => {
  return (
    <section className="relative w-full h-screen min-h-[650px] bg-obsidian text-paper overflow-hidden flex flex-col justify-between p-8 md:p-16">
      {/* Fondo Multimedia Full-Bleed */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
            src={mediaSrc}
          />
        ) : (
          <img
            src={mediaSrc}
            alt="Hero background"
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
      </div>

      {/* Header Vacío para Espaciado */}
      <div className="z-10 h-16" />

      {/* Titular y Acción Centrados */}
      <div className="z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="font-sans font-light text-5xl md:text-7xl lg:text-[72px] leading-[0.93] tracking-[-0.06em] text-paper mb-6">
          {title}
        </h1>
        <p className="font-sans font-normal text-sm md:text-base text-fog max-w-xl mb-8 tracking-[-0.01em]">
          {subtitle}
        </p>
        <a
          href={ctaLink}
          className="inline-block border border-paper bg-transparent text-paper font-sans font-normal text-sm uppercase tracking-wider px-8 py-4 rounded-none hover:bg-paper hover:text-obsidian transition-colors duration-300"
        >
          {ctaText}
        </a>
      </div>

      {/* Pie del Hero */}
      <div className="z-10 flex justify-between items-end text-xs text-ash font-sans tracking-tight uppercase">
        <span>EAR OS V2 — Ecosistema Digital</span>
        <span>Méntrida · Madrid · Toledo</span>
      </div>
    </section>
  );
};

export default CinematicHero;

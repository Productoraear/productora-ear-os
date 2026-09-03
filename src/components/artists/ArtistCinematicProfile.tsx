'use client';

import React from 'react';
import Link from 'next/link';

interface ArtistCinematicProfileProps {
  name: string;
  specialty: string;
  imageUrl?: string;
  videoUrl?: string;
}

export default function ArtistCinematicProfile({
  name,
  specialty,
  imageUrl,
  videoUrl,
}: ArtistCinematicProfileProps) {
  return (
    <article className="relative min-h-screen bg-[#050507] text-white selection:bg-[#ecb613] selection:text-black">
      {/* 3. Integración con el Grafo Neuronal: Breadcrumb / Back-button sutil */}
      <nav className="absolute top-6 left-6 z-50">
        <Link 
          href="/artistas" 
          className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-white/50 transition-colors hover:text-[#ecb613]"
        >
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Neural Graph
        </Link>
      </nav>

      {/* 1. Cabecera Inmersiva (Hero Section) */}
      <header className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden">
        {/* Fondo inmersivo */}
        <div className="absolute inset-0 z-0 bg-[#050507]">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
            />
          ) : imageUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#050507] opacity-60" />
          )}
          {/* Gradientes para fundido suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/40" />
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        </div>

        {/* Contenido Hero */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613]">
            S-Class Diamond Roster
          </span>
          <h1 className="font-syne text-6xl font-extrabold tracking-tighter sm:text-8xl md:text-9xl">
            {name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-light tracking-wide text-white/80 sm:text-2xl">
            {specialty}
          </p>

          {/* CTA Primario Flotante */}
          <div className="mt-12">
            <Link
              href="/checkout/presupuesto?format=solista&base=350"
              className="inline-flex h-16 items-center justify-center rounded-none border border-[#ecb613]/50 bg-[#ecb613]/10 px-10 text-sm font-bold uppercase tracking-[0.2em] text-[#ecb613] backdrop-blur-md transition-all hover:bg-[#ecb613] hover:text-[#050507] hover:shadow-[0_0_40px_rgba(236,182,19,0.3)]"
            >
              Bloquear Fecha — 100 €
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Inyección de Autoridad Técnica y Repertorio */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 py-32 sm:px-12">
        <div className="grid gap-16 lg:grid-cols-2">
          
          {/* Rider Técnico y Capacidades */}
          <div className="flex flex-col border-t border-white/10 pt-12">
            <h2 className="font-syne text-3xl font-bold uppercase tracking-tight text-white">
              Rider Técnico y <span className="text-[#ecb613]">Capacidades</span>
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Equipamiento homologado S-Class para garantizar presión acústica y pureza sonora en cualquier entorno arquitectónico.
            </p>
            <ul className="mt-10 flex flex-col gap-8">
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/5">
                  <svg className="h-6 w-6 text-[#ecb613]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-mono text-lg font-bold text-white">Microfonía Axient / GLXD4</h3>
                  <p className="mt-2 text-sm text-white/50">Sistema inalámbrico Shure con cápsula de condensador Beta 87A para precisión vocal absoluta.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/5">
                  <svg className="h-6 w-6 text-[#ecb613]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-mono text-lg font-bold text-white">Consola Behringer XR18</h3>
                  <p className="mt-2 text-sm text-white/50">Mezcla digital multicanal en directo con ecualización dinámica por sala.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/5">
                  <svg className="h-6 w-6 text-[#ecb613]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-mono text-lg font-bold text-white">Sistemas Bose F1 812</h3>
                  <p className="mt-2 text-sm text-white/50">Line Array flexible garantizando la exigencia matriz de 12 W/pax de la Productora EAR.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Repertorio y Atmósfera */}
          <div className="flex flex-col border-t border-white/10 pt-12">
            <h2 className="font-syne text-3xl font-bold uppercase tracking-tight text-white">
              Repertorio y <span className="text-[#ecb613]">Atmósfera</span>
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Diseño sonoro diseñado para esculpir el clímax emocional de su evento, fundamentado en una maestría vocal de grado Tenor.
            </p>
            
            <div className="mt-10 grid gap-6">
              <div className="group relative overflow-hidden border border-white/10 bg-[#0a0a0d] p-6 transition-colors hover:border-[#ecb613]/50">
                <h3 className="font-mono text-lg font-bold text-white group-hover:text-[#ecb613] transition-colors">Rancheras y Regional</h3>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">Picos de intensidad y desgarro vocal. La fuerza de la tradición ejecutada con control técnico absoluto para momentos cumbre.</p>
              </div>
              <div className="group relative overflow-hidden border border-white/10 bg-[#0a0a0d] p-6 transition-colors hover:border-[#ecb613]/50">
                <h3 className="font-mono text-lg font-bold text-white group-hover:text-[#ecb613] transition-colors">Boleros S-Class</h3>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">Atmósfera íntima y acústica envolvente para cenas de gala y recepciones. Sutileza armónica impecable.</p>
              </div>
              <div className="group relative overflow-hidden border border-white/10 bg-[#0a0a0d] p-6 transition-colors hover:border-[#ecb613]/50">
                <h3 className="font-mono text-lg font-bold text-white group-hover:text-[#ecb613] transition-colors">Baladas Universales</h3>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">Despliegue del rango tenor en himnos universales para el baile nupcial y cierres apoteósicos.</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </article>
  );
}

import React from 'react';
import Link from 'next/link';
import { Heart, Landmark, Building2, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* BACKGROUND IMPACTANTE (Parallax / Blur) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#050505]/80 to-[#050505] z-10" />
        <img 
          src="/images/hero-ambient.jpg" 
          alt="Productora EAR Eventos" 
          className="w-full h-full object-cover opacity-30 animate-pulse-slow"
          loading="lazy"
        />
      </div>

      {/* CONTENIDO CENTRAL (Túnel Neural) */}
      <div className="relative z-20 w-full max-w-7xl px-4 flex flex-col items-center justify-center space-y-12 mt-16">
        
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-fraunces font-black text-white tracking-tight">
            Producción de Eventos & <br className="hidden md:block"/> Espectáculos de Autor
          </h1>
          <p className="text-white/60 font-montserrat text-sm md:text-base">
            Seleccione su área de interés para acceder a nuestro catálogo de servicios, artistas y equipamiento.
          </p>
        </div>

        {/* 4 TARJETAS DE NAVEGACIÓN PRINCIPAL (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          
          {/* 1. PARTICULARES & BODAS */}
          <Link href="/bodas" className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-80 justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                <Heart size={20} />
              </div>
              <span className="text-[10px] text-[#ecb613] font-mono tracking-widest border border-[#ecb613]/20 px-2 py-1 rounded-full uppercase">Más Solicitado</span>
            </div>
            <div>
              <h2 className="text-2xl font-black font-fraunces text-white mb-2 uppercase group-hover:text-[#ecb613] transition-colors">Particulares & Bodas</h2>
              <p className="text-white/50 text-xs leading-relaxed mb-4">Música en vivo, ceremonias personalizadas y catering de brasas para celebraciones exclusivas.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Bodas</span>
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Cumpleaños</span>
              </div>
            </div>
          </Link>

          {/* 2. DIPLOMÁTICOS & B2G */}
          <Link href="/ocasiones/ayuntamientos" className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-80 justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Landmark size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black font-fraunces text-white mb-2 uppercase group-hover:text-blue-400 transition-colors">Institucional & B2G</h2>
              <p className="text-white/50 text-xs leading-relaxed mb-4">Producciones culturales y festejos para Ayuntamientos, Embajadas y Licitaciones Públicas.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Ayuntamientos</span>
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Licitaciones</span>
              </div>
            </div>
          </Link>

          {/* 3. CORPORATIVO & FINCAS */}
          <Link href="/alquiler-equipos-sonido-audiovisuales" className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-80 justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Building2 size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black font-fraunces text-white mb-2 uppercase group-hover:text-emerald-400 transition-colors">Corporativo & Fincas</h2>
              <p className="text-white/50 text-xs leading-relaxed mb-4">Soluciones integrales, alquiler de audiovisuales y alianzas estratégicas para Wedding Planners.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Audiovisuales</span>
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Fincas</span>
              </div>
            </div>
          </Link>

          {/* 4. VIMUME NEUROACÚSTICA */}
          <Link href="/vimume" className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-80 justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full border border-pink-400/30 flex items-center justify-center text-pink-400">
                <Activity size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black font-fraunces text-white mb-2 uppercase group-hover:text-pink-400 transition-colors">Vimume Salud</h2>
              <p className="text-white/50 text-xs leading-relaxed mb-4">Terapia musical y estimulación cognitiva diseñada para centros de mayores y residencias.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Centros de Día</span>
                <span className="text-[10px] bg-black/40 text-white/70 px-2 py-1 rounded border border-white/5">Terapia</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}

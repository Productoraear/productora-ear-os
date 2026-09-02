'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, ArrowRight, ExternalLink, 
  RotateCcw, Sliders, Check, Volume2, Sparkle
} from 'lucide-react';

export default function StyleguidePage() {
  const [viewMode, setViewMode] = useState<'luxury' | 'technical'>('luxury');
  const [justifiedText, setJustifiedText] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] selection:bg-[#ecb613] selection:text-black font-montserrat antialiased">
      
      {/* 🧭 MINIMALIST LUXURY FLOATING NAVIGATOR */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-[#0a0a0d]/90 backdrop-blur-2xl border border-white/[0.08] rounded-full px-6 py-2.5 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] shadow-[0_0_10px_#ecb613]" />
            <span className="font-francia font-black text-sm uppercase tracking-wider text-white">
              EAR OS <span className="text-[#ecb613]">Maison</span>
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/10" />

          {/* TOGGLE MODES */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'luxury' ? 'technical' : 'luxury')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${
                viewMode === 'luxury'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {viewMode === 'luxury' ? 'Puro Lujo (Espacio)' : 'Modo Métrico'}
            </button>

            <button
              onClick={() => setJustifiedText(!justifiedText)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${
                justifiedText
                  ? 'bg-[#ecb613]/15 text-[#ecb613] border border-[#ecb613]/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {justifiedText ? 'Justificado' : 'Izquierda'}
            </button>
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#ecb613] hover:text-[#f5c538] transition-colors"
          >
            <span>Home</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </header>

      {/* 🏛️ 1. HERO MONUMENTAL: EL PODER DEL ESPACIO EN BLANCO */}
      <section className="pt-44 pb-32 sm:pt-52 sm:pb-40 px-6 sm:px-12 max-w-5xl mx-auto text-center space-y-10">
        
        <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.4em] text-[#ecb613]">
          Alta Relojería & Acústica Determinista
        </p>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-francia font-black uppercase tracking-tight text-white leading-[1.05]">
          El Silencio <br className="hidden sm:block" />
          <span className="italic text-[#ecb613] font-normal">Entre las Notas.</span>
        </h1>

        <p className="text-zinc-400 font-light text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Las mayores casas de lujo no compiten por saturación, sino por serenidad. En EAR OS, cada píxel respira con la regla 60-30-10 y la tipografía de conservatorio Francia & Montserrat.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
          <button className="btn-gold-cta text-xs px-10 py-4">
            <span>Explorar Dossier Insignia</span>
            <ArrowRight size={15} />
          </button>
          <a 
            href="#manifiesto"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors py-3 px-6"
          >
            Leer Manifiesto S-Class
          </a>
        </div>
      </section>

      {/* 🎨 2. LA REGLA 60-30-10 EN EQUILIBRIO PERFECTO */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-6xl mx-auto space-y-20 border-t border-white/[0.06]">
        
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Armonía Cromática
          </span>
          <h2 className="text-3xl sm:text-5xl font-francia font-black uppercase text-white tracking-tight">
            60 · 30 · 10
          </h2>
          <p className="text-zinc-400 font-light text-sm leading-relaxed">
            Una sinfonía visual donde el 60% es lienzo inmóvil, el 30% arquitectura y el 10% pura autoridad dorada.
          </p>
        </div>

        {/* 3 MONOLITOS DE COLOR CON ESPACIO GENEROSO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          
          {/* 60% */}
          <div className="space-y-6 group">
            <div className="h-64 rounded-[2rem] bg-[#050505] border border-white/[0.08] p-8 flex flex-col justify-between transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <span className="text-4xl font-francia font-black text-white/30 group-hover:text-white transition-colors">
                60%
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white">Obsidian Black</p>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">#050505 // Lienzo</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-francia font-bold uppercase text-white">Profundidad Infinita</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Elimina la fatiga y otorga presencia tridimensional. El lienzo no compite: enmarca la excelencia.
              </p>
            </div>
          </div>

          {/* 30% */}
          <div className="space-y-6 group">
            <div className="h-64 rounded-[2rem] bg-[#0f0f14] border border-white/[0.08] p-8 flex flex-col justify-between transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <span className="text-4xl font-francia font-black text-white/30 group-hover:text-white transition-colors">
                30%
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-200">Estructuras Bento</p>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">#0f0f14 // Superficies</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-francia font-bold uppercase text-white">Arquitectura y Textos</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Paneles de soporte, jerarquía secundaria y tipografía de lectura en plata pulida sin saturación.
              </p>
            </div>
          </div>

          {/* 10% */}
          <div className="space-y-6 group">
            <div className="h-64 rounded-[2rem] bg-gradient-to-b from-[#1c1809] to-[#0c0a03] border border-[#ecb613]/30 p-8 flex flex-col justify-between transition-all duration-500 group-hover:border-[#ecb613]/60 group-hover:shadow-[0_20px_50px_rgba(236,182,19,0.15)]">
              <span className="text-4xl font-francia font-black text-[#ecb613]/40 group-hover:text-[#ecb613] transition-colors">
                10%
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ecb613]">Oro Imperial</p>
                <p className="text-[11px] text-[#ecb613]/70 font-mono mt-0.5">#ecb613 // Conversión</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-francia font-bold uppercase text-[#ecb613]">Puntos Focales</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Reservado con sobriedad para el Price-Lock SHA-256, el split 80/10/10 y las llamadas a la acción maestras.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 📖 3. MANIFIESTO EDITORIAL: STORYSELLING EN FRANCIA & MONTSERRAT */}
      <section id="manifiesto" className="py-28 sm:py-36 px-6 sm:px-12 max-w-4xl mx-auto space-y-16 border-t border-white/[0.06]">
        
        <div className="text-center space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ecb613]">
            Manifiesto de Criterio
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-francia font-black uppercase text-white tracking-tight leading-tight">
            La Pureza de la Ejecución
          </h2>
        </div>

        {/* BLOQUE EDITORIAL JUSTIFICADO */}
        <div className="space-y-8 text-zinc-300">
          
          <p className={`text-base sm:text-lg text-zinc-300 font-light ${justifiedText ? 'text-story-justified' : 'text-left leading-relaxed'}`}>
            En las más altas esferas del espectáculo y los eventos corporativos de gran escala, el error acústico no se perdona. Cada minuto de retraso o acople de frecuencias devalúa la reputación del anfitrión. Por esta razón, la arquitectura operativa de <strong className="text-white font-medium whitespace-nowrap">EAR OS</strong> sustituye la improvisación por una disciplina matemática: <strong className="text-[#ecb613] font-medium whitespace-nowrap">12 vatios por asistente</strong>, microfonía <strong className="text-white font-medium whitespace-nowrap">Shure Axient Digital</strong> de sincronización espectral y redundancia de sistema in situ.
          </p>

          {/* CITA DE HONOR DE ALTA COSTURA */}
          <blockquote className="my-14 py-8 px-8 sm:px-12 border-y border-white/10 text-center space-y-3">
            <p className="font-francia text-2xl sm:text-3xl lg:text-4xl italic text-white font-normal leading-snug">
              "No vendemos música; garantizamos la memoria intacta de un momento irrepetible."
            </p>
            <cite className="block text-[11px] font-montserrat font-bold uppercase tracking-[0.3em] text-[#ecb613] not-italic">
              — Edwin Agudelo, Tenor Lírico Insignia
            </cite>
          </blockquote>

          <p className={`text-base sm:text-lg text-zinc-300 font-light ${justifiedText ? 'text-story-justified' : 'text-left leading-relaxed'}`}>
            Bajo el liderazgo artístico de <strong className="text-white font-medium whitespace-nowrap">Edwin Agudelo</strong>, la plataforma consolida una trayectoria internacional de más de <span className="whitespace-nowrap text-white">37 conciertos solemnes</span>, galas presidenciales y bodas de alta nobleza en España. Cada cotización generada sella un compromiso inamovible con <strong className="text-[#ecb613] font-medium whitespace-nowrap">Price&#8209;Lock SHA&#8209;256</strong> durante <span className="whitespace-nowrap">72 horas</span> y un modelo de liquidación transparente <strong className="text-white font-medium whitespace-nowrap">split 80/10/10</strong>.
          </p>

        </div>

      </section>

      {/* 👑 4. LA TARJETA PACIENTE CERO: MONUMENTAL Y LIMPIA */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-5xl mx-auto border-t border-white/[0.06]">
        
        <div className="bg-gradient-to-b from-[#0e0e13] via-[#09090c] to-[#050505] rounded-[3rem] border border-white/[0.08] p-8 sm:p-16 space-y-12 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 border-b border-white/[0.06] pb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613]">
                Artista Titular Insignia
              </span>
              <h3 className="text-4xl sm:text-6xl font-francia font-black uppercase text-white tracking-tight mt-2">
                Edwin Agudelo
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
                Tenor Lírico & Mariachi de Gran Gala
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-zinc-400 uppercase tracking-widest block font-medium">Tarifa Base Solista</span>
              <span className="text-3xl sm:text-4xl font-francia font-black text-[#ecb613]">350 €</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Solista & Piano</span>
              <p className="text-2xl font-francia font-bold text-white">650 €</p>
              <p className="text-xs text-zinc-400 font-light">Ceremonia íntima y cóctel de bienvenida.</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ecb613]">Cuarteto Imperial</span>
              <p className="text-2xl font-francia font-bold text-[#ecb613]">950 €</p>
              <p className="text-xs text-zinc-400 font-light">Formato insignia para banquete nupcial.</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Gran Ensamble 8+</span>
              <p className="text-2xl font-francia font-bold text-white">2.800 €</p>
              <p className="text-xs text-zinc-400 font-light">Gran gala lírica y mariachi monumental.</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.06]">
            <div className="flex items-center gap-6 text-xs text-zinc-400 font-light">
              <span>Split Soberano: <strong className="text-white font-medium">80/10/10</strong></span>
              <span>•</span>
              <span>Presión Acústica: <strong className="text-white font-medium">12 W/pax</strong></span>
              <span>•</span>
              <span>Garantía: <strong className="text-[#ecb613] font-medium">0 Fallos</strong></span>
            </div>

            <button className="btn-gold-cta text-xs w-full sm:w-auto px-8 py-3.5">
              <span>Reservar Disponibilidad</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </section>

      {/* 🧭 5. FOOTER SOBERANO DE CIERRE */}
      <footer className="py-20 text-center space-y-6 border-t border-white/[0.06] text-xs text-zinc-400 font-light">
        <p className="font-francia font-black uppercase text-sm tracking-widest text-white">
          EAR OS <span className="text-[#ecb613]">Sovereign Suite</span>
        </p>
        <p className="max-w-md mx-auto leading-relaxed">
          Diseñado bajo los estándares de las marcas de lujo globales. Sin ruido, sin distracciones, con máxima autoridad de facturación.
        </p>
        <div className="pt-4 flex justify-center gap-6 text-[11px] font-bold uppercase tracking-widest">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home Principal</Link>
          <Link href="/bodas" className="text-zinc-400 hover:text-white transition-colors">Bodas S-Class</Link>
          <Link href="/artistas/dashboard" className="text-zinc-400 hover:text-white transition-colors">Talento & Riders</Link>
        </div>
      </footer>

    </div>
  );
}

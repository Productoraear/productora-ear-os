"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Zap, Play, Square, Users, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// 🏛️ DESIGN TOKENS (Shared with S-Class)
const TOKENS = {
  bg: '#050505',
  surface: '#0a0a0a',
  surface2: '#141414',
  text: '#f5f1e8',
  muted: '#666666',
  accent: '#ecb613', // S-Class Gold
  accent2: '#49d6b5', // VIMUME Mint/Emerald
  danger: '#ff4d4d',
  success: '#10b981',
};

export default function HermesPublicPage() {
  const [isPlaying40Hz, setIsPlaying40Hz] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // 🎵 PLAY/STOP 40Hz PURE SINE WAVE WITH AUDIO API (WOW FACTOR)
  const toggle40HzTone = () => {
    if (isPlaying40Hz) {
      // Stop oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      setIsPlaying40Hz(false);
    } else {
      try {
        // Initialize AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Create Oscillator (40Hz Sine)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, ctx.currentTime);

        // Create Gain Node (for smooth volume start/stop)
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.5); // safe volume level

        // Connect
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Save references & start
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        osc.start();
        setIsPlaying40Hz(true);
      } catch (err) {
        console.error("Audio Context failed to initialize", err);
      }
    }
  };

  return (
    <main className="bg-[#050505] min-h-screen text-[#f5f1e8] selection:bg-[#ecb613]/30 overflow-x-hidden relative font-sans">
      
      {/* 🌌 DYNAMIC BACKGROUND BLURS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#ecb613]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#49d6b5]/5 rounded-full blur-[100px]" />
      </div>

      {/* 🧭 NAVIGATION HEADER */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 md:px-16 bg-[#050505]/50 backdrop-blur-xl relative z-50">
        <div className="flex items-center gap-3">
          <Link href="/vimume" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ecb613] to-amber-600 rounded-xl flex items-center justify-center text-black font-black italic group-hover:scale-105 transition-transform">H</div>
            <div>
              <span className="font-extrabold uppercase tracking-tighter text-sm leading-none flex items-center gap-1.5 text-white group-hover:text-[#ecb613] transition-colors">
                HERMES <span className="text-[#ecb613]">OT</span>
              </span>
              <p className="text-[6px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Vimume Clinical OS</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            href="/vimume/hermes/dashboard" 
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            Acceso Profesional <ArrowRight size={12} className="text-[#ecb613]" />
          </Link>
        </div>
      </header>

      {/* 🏹 HERO SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center space-y-16">
        
        {/* Animated Hummingbird Emblem */}
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 bg-gradient-to-br from-[#ecb613] to-[#49d6b5] rounded-full p-0.5 flex items-center justify-center shadow-[0_0_40px_rgba(236,182,19,0.15)]"
        >
          <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
            <Sparkles size={32} className="text-[#ecb613]" />
          </div>
        </motion.div>

        <div className="space-y-6 max-w-3xl">
          <span className="px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[9px] font-black text-[#ecb613] uppercase tracking-[0.2em]">
            PROYECTO HERMES // TERAPIA OCUPACIONAL
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white italic font-syne">
            Sincronía Sónica <br/>
            <span className="text-[#ecb613]">contra el Olvido</span>
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 font-medium leading-relaxed italic max-w-2xl mx-auto pt-4">
            "Haciendo nuestra parte. Estimulación neuro-musical 40Hz diseñada para rescatar la identidad en centros piloto de España y México."
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 w-full max-w-md mx-auto">
          <Link 
            href="/vimume/hermes/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-[#ecb613] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all text-center shadow-[0_0_30px_rgba(236,182,19,0.2)]"
          >
            Entrar al Dashboard Clínico
          </Link>
          <a 
            href="#sonic-experience"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-xs font-black uppercase tracking-widest rounded-2xl transition-all text-center"
          >
            Experimentar 40Hz
          </a>
        </div>

      </section>

      {/* 🕊️ THE HUMMINGBIRD FABLE SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#49d6b5]">NUESTRA FILOSOFÍA DE CUIDADOS</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-syne text-white">La Fábula del Colibrí</h2>
            <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-wider font-bold">
              Un gran incendio asolaba la selva. Mientras todos los animales huían aterrorizados, un pequeño colibrí volaba hacia las llamas portando una gota de agua en su pico. El león, incrédulo, le preguntó: "¿Crees que vas a apagar el incendio con eso?". El colibrí respondió: "Sé que no puedo solo. Pero yo estoy haciendo mi parte".
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed italic">
              En VIMUME OS no pretendemos resolver de forma aislada la complejidad del deterioro cognitivo mundial, pero garantizamos que cada centro piloto, cada terapeuta ocupacional y cada sesión neuro-musical de 40Hz representan nuestra gota de agua soberana en la preservación de la memoria.
            </p>
          </div>

          <div className="lg:col-span-5 p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] relative overflow-hidden flex flex-col justify-center text-center">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Sparkles size={120} className="text-[#49d6b5]" />
            </div>
            <h3 className="text-4xl font-extrabold italic text-[#ecb613] tracking-tighter">14,240+</h3>
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block mt-2">Horas de Estimulación Sincrónica</span>
            
            <div className="border-t border-white/5 my-6 pt-6">
              <h3 className="text-4xl font-extrabold italic text-[#49d6b5] tracking-tighter">5 Centros</h3>
              <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block mt-2">Pilotos Activos en España y México</span>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h3 className="text-4xl font-extrabold italic text-white tracking-tighter">100% Soberano</h3>
              <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block mt-2">Consentimiento Híbrido Verificado</span>
            </div>
          </div>

        </div>
      </section>

      {/* 🎵 EXPERIMENTAL 40Hz PANEL (WOW FACTOR WITH SOUND GENERATION) */}
      <section id="sonic-experience" className="relative z-10 max-w-4xl mx-auto px-6 py-24 border-t border-white/5 text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-4 py-1.5 rounded-full inline-block">
            MÓDULO INTERACTIVO DE SINCRONÍA
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-syne text-white">Prueba Sónica de 40Hz</h2>
          <p className="text-xs text-zinc-400 uppercase leading-relaxed max-w-xl mx-auto font-bold tracking-wide">
            Use auriculares para percibir la estimulación Gamma pura a 40Hz. La frecuencia científica utilizada por terapeutas ocupacionales en la Silver Economy.
          </p>
        </div>

        {/* Audio control panel */}
        <div className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] max-w-md mx-auto space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-50 z-0" />
          
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-2xl flex items-center justify-center mx-auto text-[#ecb613]">
              <Zap size={24} className={isPlaying40Hz ? "animate-pulse text-[#49d6b5]" : ""} />
            </div>

            <div className="space-y-2">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Canal Activo</span>
              <span className="text-xl font-mono font-bold text-white tracking-tighter">
                {isPlaying40Hz ? "BINAURAL OSCILLATOR ACTIVE // 40Hz" : "STANDBY"}
              </span>
            </div>

            <button 
              onClick={toggle40HzTone}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                isPlaying40Hz 
                ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'bg-[#49d6b5] text-black hover:scale-105 shadow-[0_0_30px_rgba(73,214,181,0.2)]'
              }`}
            >
              {isPlaying40Hz ? (
                <>
                  <Square size={14} /> Detener Estimulación
                </>
              ) : (
                <>
                  <Play size={14} /> Activar Tono de 40Hz
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 📊 CLINICAL WORKFLOW */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-syne text-center text-white mb-16">
          Gobernanza del Dato y RGPD
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              step: "01", 
              title: "Consentimiento Híbrido", 
              desc: "Doble firma digital certificada europea y consentimiento informado firmado físicamente por el tutor legal antes de cualquier sincronización." 
            },
            { 
              step: "02", 
              title: "Privacidad Soberana", 
              desc: "Acceso regulado mediante UID y rol en la red del centro. Cifrado absoluto para cumplir con los estándares de B2B/B2G." 
            },
            { 
              step: "03", 
              title: "Auditoría en Ledger", 
              desc: "Historial completo de intervenciones neuro-musicales persistido e inmutable para facilitar reportes a universidades y fundaciones." 
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] space-y-4">
              <span className="text-[#ecb613] font-black text-2xl italic block">{item.step}</span>
              <h3 className="text-lg font-black uppercase text-white tracking-tight">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🚪 PORTAL FOOTER */}
      <footer className="border-t border-white/5 py-20 text-center px-6 relative z-10 bg-[#050505]">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-500">
            productoraear.com | Vimume Clinical OS
          </p>
          <div className="flex justify-center gap-6 text-[8px] font-black uppercase tracking-widest text-zinc-600">
            <Link href="/vimume" className="hover:text-white transition-colors">Inicio Vimume</Link>
            <span>•</span>
            <Link href="/vimume/hermes/dashboard" className="hover:text-white transition-colors">Acceso Profesional</Link>
            <span>•</span>
            <Link href="/vimume/gobernanza-del-dato" className="hover:text-white transition-colors">Seguridad RGPD</Link>
          </div>
          <p className="text-[8px] font-mono text-zinc-700">
            © 2026 | ALL RIGHTS RESERVED | C001-AURA-ONYX-HERMES
          </p>
        </div>
      </footer>

    </main>
  );
}

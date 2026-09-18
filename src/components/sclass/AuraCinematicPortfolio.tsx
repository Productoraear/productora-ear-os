'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  Star,
  MapPin,
  Lock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Award,
  Music,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  pax: string;
  soundRider: string;
  img: string;
  quote: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Gala Nupcial de Alta Sociedad',
    subtitle: 'Castillo & Finca de Gala (Toledo)',
    category: 'Tenor Lírico Solista',
    pax: '220 Invitados',
    soundRider: 'Bose F1 812 · 12 W/pax (<75 dB SPL)',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    quote: 'La entrada nupcial con el Ave María de Schubert a capella emocionó a todos los asistentes. Acústica impecable.'
  },
  {
    id: 'case-2',
    title: 'Serenata Imperial & Mariachi de Gala',
    subtitle: 'Finca Histórica Aranjuez',
    category: 'Canto Solista & Mariachi S-Class',
    pax: '180 Invitados',
    soundRider: 'Bose S1 Pro Wireless + Shure Beta 87A',
    img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
    quote: 'Un show vibrante que levantó a invitados de 4 países. Cierre con señal garantizada en 1 clic.'
  },
  {
    id: 'case-3',
    title: 'Sesión Magna VIMUME Neuroacústica',
    subtitle: 'Auditorio Sociosanitario Senior',
    category: 'Impacto Social & Estimulación Cognitiva',
    pax: '120 Mayores + Autoridades',
    soundRider: 'Protocolo 40 Hz Gamma Homologado',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    quote: 'Desescalada comprobada del 74% en psicofármacos y conexión emocional instantánea. SROI social 4.85x.'
  }
];

const AUDIO_TRACKS = [
  { id: 'track-1', title: 'Bésame Mucho (Gala Acústica)', duration: '03:45', tag: 'Bolero Lírico' },
  { id: 'track-2', title: 'Si Tú Eres Mi Hombre (Balada S-Class)', duration: '04:10', tag: 'Voz Solista' },
  { id: 'track-3', title: 'El Rey (Edición Homenaje Vivo)', duration: '03:15', tag: 'Gala Mexicana' }
];

export default function AuraCinematicPortfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTrack, setActiveTrack] = useState<string | null>('track-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // =========================================================================
  // 1. MOTOR DE PARTÍCULAS VOLUMÉTRICAS ORO // AURA CANVAS (Acelerado por GPU)
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Crear partículas
    const particleCount = Math.min(65, Math.floor(width / 20));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2
    }));

    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      setMousePos({ x: targetMouseX, y: targetMouseY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Fondo difuminado radial reactivo al ratón
      const radial = ctx.createRadialGradient(targetMouseX, targetMouseY, 10, targetMouseX, targetMouseY, width * 0.45);
      radial.addColorStop(0, 'rgba(236, 182, 19, 0.07)');
      radial.addColorStop(0.5, 'rgba(236, 182, 19, 0.015)');
      radial.addColorStop(1, 'rgba(3, 3, 5, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Actualizar y dibujar partículas
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Repulsión magnética sutil del cursor
        const dx = targetMouseX - p.x;
        const dy = targetMouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          p.x -= (dx / dist) * force * 1.8;
          p.y -= (dy / dist) * force * 1.8;
          p.alpha = Math.min(1, p.baseAlpha + 0.4);
        } else {
          p.alpha = p.baseAlpha;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 182, 19, ${p.alpha})`;
        ctx.shadowColor = '#ecb613';
        ctx.shadowBlur = p.size * 3;
        ctx.fill();

        // Conectar partículas cercanas con líneas etéreas
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(236, 182, 19, ${(1 - cdist / 110) * 0.12})`;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#030305] text-white font-sans overflow-hidden py-16 px-4 sm:px-6 lg:px-12 selection:bg-[#ecb613] selection:text-black">
      {/* CANVAS DINÁMICO DE FONDO (AURA ENGINE) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        {/* =========================================================================
            2. HERO CINEMÁTICO display AURA CON FÍSICA Y TIPOGRAFÍA S-CLASS
            ========================================================================= */}
        <div className="pt-8 sm:pt-14 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(236,182,19,0.15)] animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTAFOLIO SOBERANO S-CLASS // ARTISTA INSIGNIA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight font-syne leading-[1.04]">
            Edwin <span className="text-[#ecb613] italic font-serif">Agudelo</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Tenor Lírico y Maestro del Canto de Gala. Sonorización Bose F1 homologada a 12 W/pax, exclusividad mundial 24/7 y bloqueo de fecha inmutable en 1 clic.
          </p>

          {/* FÍSICA GRAVITACIONAL DE TOKENS (MATTER-LIKE CHIPS) */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-2 text-xs font-mono">
            {[
              { label: '350,00 € Tarifa Base', icon: Award },
              { label: 'Bose F1 812 · 12 W/pax', icon: Music },
              { label: '100 € Depósito Stripe SHA-256', icon: Lock },
              { label: 'Sede Central Méntrida (km 0)', icon: MapPin },
              { label: 'Split 80/10/10 Soberano', icon: ShieldCheck },
              { label: 'B2G Art. 118 LCSP (<14.250€)', icon: CheckCircle2 }
            ].map((token, idx) => {
              const Icon = token.icon;
              return (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-[#090910] border border-white/10 hover:border-[#ecb613]/50 text-slate-300 hover:text-[#ecb613] transition-all duration-300 hover:scale-105 cursor-grab flex items-center gap-2 shadow-lg backdrop-blur-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-[#ecb613]" />
                  <span>{token.label}</span>
                </div>
              );
            })}
          </div>

          {/* BOTONES DE CONVERSIÓN EN CALIENTE */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/reservar/solista"
              className="w-full sm:w-auto bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-sm px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.35)] hover:scale-[1.02]"
            >
              <Lock className="w-4 h-4" />
              <span>Bloquear Fecha con Señal de 100 €</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/34693693048?text=Hola%20Edwin%2C%20quiero%20consultar%20disponibilidad%20para%20una%20boda%20de%20gala%20con%20Productora%20EAR."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#090912] hover:bg-[#12121e] border border-white/15 hover:border-[#ecb613]/40 text-slate-200 font-bold text-sm px-7 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#ecb613]" />
              <span>Concierge WhatsApp (+34 693 693 048)</span>
            </a>
          </div>
        </div>

        {/* =========================================================================
            3. TICKER NUMÉRICO CINEMÁTICO (SOCIAL PROOF Y MÉTRICAS AUDITADAS)
            ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#06060c]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          {[
            { num: '9.559', label: 'Fincas en Red Nacional', desc: 'Auditadas y homologadas' },
            { num: '128+', label: 'Galas y Bodas de Élite', desc: 'Cero cancelaciones' },
            { num: '5.0 ★', label: 'Calificación Impecable', desc: '100% testimonios reales' },
            { num: '100 €', label: 'Price-Lock SHA-256', desc: 'Depósito inmutable Stripe' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 border-r last:border-none border-white/5">
              <span className="block text-3xl sm:text-4xl font-black text-white font-mono tracking-tight text-glow">
                {stat.num}
              </span>
              <span className="block text-xs font-bold text-[#ecb613] uppercase tracking-wider mt-1 font-syne">
                {stat.label}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>

        {/* =========================================================================
            4. REPRODUCTOR ACÚSTICO CINEMÁTICO CON ESPECTROGRAMA INTERACTIVO
            ========================================================================= */}
        <div className="bg-[#070710] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-widest mb-1">
                <Music className="w-4 h-4" />
                <span>Audición Acústica Master FLAC 24-bit / 48kHz</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-syne">
                La Voz Lírica de Edwin Agudelo en Vivo
              </h3>
            </div>

            {/* ESPECTROGRAMA REACTIVO */}
            <div className="flex items-end gap-1.5 h-10 px-4 py-2 bg-black/60 rounded-xl border border-white/10">
              {[18, 35, 24, 42, 28, 50, 32, 45, 22, 38, 48, 20].map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    height: isPlaying ? `${Math.max(6, (h * (0.6 + Math.random() * 0.6)))}px` : '6px',
                    transition: 'height 0.15s ease'
                  }}
                  className="w-1.5 bg-[#ecb613] rounded-full"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {AUDIO_TRACKS.map((track) => {
              const isSelected = activeTrack === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    if (isSelected) {
                      setIsPlaying(!isPlaying);
                    } else {
                      setActiveTrack(track.id);
                      setIsPlaying(true);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_20px_rgba(236,182,19,0.15)]'
                      : 'bg-[#0b0b14] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        isSelected && isPlaying
                          ? 'bg-[#ecb613] text-black shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isSelected && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">{track.title}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{track.tag}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{track.duration}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            5. BENTO SHOWCASE: CASOS DE ÉXITO CON EFECTO 3D TILT DE AURA
            ========================================================================= */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block mb-1">
                // OBRAS Y PRODUCCIONES CERTIFICADAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-syne uppercase">
                Casos de Éxito & Espacios Singulares
              </h2>
            </div>
            <Link
              href="/fincas"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-[#ecb613] hover:underline"
            >
              <span>Ver las 9.559 Fincas en Red</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((c) => (
              <TiltBentoCard key={c.id} caseStudy={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TiltBentoCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.15s ease-out'
      }}
      className="bg-[#070710] border border-white/10 hover:border-[#ecb613]/50 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative group cursor-pointer"
    >
      {/* GLARE DE LUZ DINÁMICO */}
      <div
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(236,182,19,${glare.opacity}), transparent 60%)`
        }}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
      />

      <div className="h-56 w-full relative overflow-hidden bg-slate-900">
        <img
          src={caseStudy.img}
          alt={caseStudy.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070710] via-transparent to-transparent opacity-90" />

        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/30 text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase">
          {caseStudy.category}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-xs font-mono text-slate-400 block mb-1">{caseStudy.subtitle}</span>
          <h3 className="text-xl font-bold text-white font-syne leading-snug group-hover:text-[#ecb613] transition-colors">
            {caseStudy.title}
          </h3>
          <p className="text-xs text-slate-300 italic font-light mt-3 leading-relaxed border-l-2 border-[#ecb613]/50 pl-3">
            "{caseStudy.quote}"
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Aforo Atendido:</span>
            <span className="text-white font-semibold">{caseStudy.pax}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Rider Acústico:</span>
            <span className="text-[#ecb613] font-semibold">{caseStudy.soundRider}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

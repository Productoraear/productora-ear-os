'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FRAMER_PHYSICS_PRESETS } from '@/lib/framer/framerDesignVault';

interface FramerMotionScrollCanvasProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  accentColor?: string;
  children?: React.ReactNode;
}

/**
 * ⚡ COMPONENTE ULTRA-ANIMACIÓN SCROLL CANVAS S-CLASS
 * Sincroniza la trayectoria del scroll del usuario con efectos de escala 3D,
 * rotación sutil y paraje glassmorphic de alta gama.
 */
export function FramerMotionScrollCanvas({
  title = 'EXPERIENCIA MUSICAL S-CLASS',
  subtitle = 'Ingeniería acústica y sonido en vivo de vanguardia para eventos exclusivos',
  badge = 'ANTIGRAVITY DESIGN ENGINE',
  mediaUrl = 'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg',
  mediaType = 'image',
  accentColor = '#ecb613',
  children,
}: FramerMotionScrollCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: FRAMER_PHYSICS_PRESETS.ultraSmoothScroll.stiffness,
    damping: FRAMER_PHYSICS_PRESETS.ultraSmoothScroll.damping,
  });

  // Transformaciones dinámicas sincronizadas con el scroll
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.02, 0.95]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -10]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.4]);
  const yOffset = useTransform(smoothProgress, [0, 1], [60, -60]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[80vh] w-full py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-[#030305]"
    >
      {/* Fondo Neón sutil de iluminación ambiental */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Tarjeta 3D interactiva animada por scroll */}
      <motion.div
        style={{
          scale,
          rotateX,
          opacity,
          y: yOffset,
          perspective: 1200,
        }}
        className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/10 bg-[#08080c]/80 p-8 md:p-12 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
      >
        {/* Badge S-Class */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border border-white/15 bg-white/5 font-semibold text-white/90"
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            {badge}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Framer Motion // 60 FPS
          </span>
        </div>

        {/* Título y Subtítulo */}
        <div className="max-w-3xl space-y-4 mb-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight font-syne text-white leading-none">
            {title}
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
            {subtitle}
          </p>
        </div>

        {/* Marco de Medio (Imagen / Video con animación de flotación) */}
        {mediaUrl && (
          <div className="relative w-full h-[320px] md:h-[450px] rounded-2xl overflow-hidden border border-white/10 group bg-black/40">
            {mediaType === 'image' ? (
              <img
                src={mediaUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <video
                src={mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent opacity-80" />
          </div>
        )}

        {/* Slot de Contenido personalizable */}
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </div>
  );
}

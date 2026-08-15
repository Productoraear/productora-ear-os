'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * 🕊️ HUMMINGBIRD FLIGHT PATH S-CLASS (AURA GOLD EDITION)
 * 
 * Un colibrí interactivo y etéreo que vuela reactivamente guiado por el scroll.
 * Se desplaza orgánicamente entre las secciones, textos, CTAs y botones del sitio,
 * con aleteo cinemático (flap) y estela dorada de partículas luminosas.
 */
export default function HummingbirdFlight() {
  const { scrollYProgress, scrollY } = useScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detección de velocidad de scroll para acelerar el aleteo
  useMotionValueEvent(scrollY, "change", () => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 200);
  });

  // Coordenadas orgánicas de vuelo (vuelo serpenteante por la pantalla)
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
    ['85vw', '15vw', '80vw', '20vw', '75vw', '50vw', '88vw']
  );

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
    ['18vh', '35vh', '50vh', '68vh', '45vh', '78vh', '90vh']
  );

  // Ángulo de inclinación del vuelo reactivo al recorrido
  const rawRotation = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
    [-25, 45, -35, 40, -20, 15, -10]
  );

  // Físicas suaves con Springs amortiguados (sensación ultra fluida de vuelo vivo)
  const springConfig = { damping: 20, stiffness: 85, mass: 0.6 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);
  const smoothRotation = useSpring(rawRotation, { damping: 15, stiffness: 100 });

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <motion.div
        style={{
          left: smoothX,
          top: smoothY,
          rotate: smoothRotation,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group"
        whileHover={{ scale: 1.3 }}
      >
        {/* HALO DE LUZ DORADA / ESTELA AURA */}
        <div className="absolute -inset-4 bg-gradient-radial from-[#ecb613]/30 via-[#ffd700]/10 to-transparent blur-xl rounded-full animate-pulse" />
        
        {/* SVG DEL COLIBRÍ DE ÉLITE */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 100 100"
          className="relative drop-shadow-[0_0_15px_rgba(236,182,19,0.8)] filter transition-transform"
        >
          <defs>
            <linearGradient id="goldFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff5c0" />
              <stop offset="40%" stopColor="#ecb613" />
              <stop offset="80%" stopColor="#b38706" />
              <stop offset="100%" stopColor="#634800" />
            </linearGradient>
            
            <linearGradient id="cyanAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ESTELA DE PARTÍCULAS LUMINOSAS */}
          <motion.circle
            cx="25"
            cy="70"
            r="3"
            fill="#ecb613"
            opacity={0.6}
            animate={{
              r: [2, 5, 0],
              opacity: [0.8, 0.4, 0],
              x: [-5, -25],
              y: [5, 15],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.circle
            cx="28"
            cy="65"
            r="2"
            fill="#67e8f9"
            opacity={0.7}
            animate={{
              r: [1.5, 4, 0],
              opacity: [0.9, 0.3, 0],
              x: [-4, -18],
              y: [4, 10],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0.2,
              ease: "easeOut",
            }}
          />

          {/* COLA DEL COLIBRÍ */}
          <path
            d="M 38 52 C 25 65, 10 75, 5 88 C 15 82, 30 70, 42 58 Z"
            fill="url(#goldFeatherGrad)"
            opacity="0.9"
          />
          <path
            d="M 40 54 C 28 68, 18 82, 12 92 C 22 84, 34 72, 44 60 Z"
            fill="url(#cyanAccentGrad)"
            opacity="0.8"
          />

          {/* CUERPO AERODINÁMICO */}
          <ellipse
            cx="52"
            cy="48"
            rx="16"
            ry="9"
            transform="rotate(-28 52 48)"
            fill="url(#goldFeatherGrad)"
          />

          {/* PECHO ESMERALDA/CYAN */}
          <ellipse
            cx="57"
            cy="44"
            rx="9"
            ry="6"
            transform="rotate(-25 57 44)"
            fill="url(#cyanAccentGrad)"
            opacity="0.9"
          />

          {/* CABEZA */}
          <circle
            cx="68"
            cy="36"
            r="7"
            fill="url(#goldFeatherGrad)"
          />

          {/* OJO BRILLANTE */}
          <circle
            cx="70"
            cy="34"
            r="1.8"
            fill="#050505"
          />
          <circle
            cx="70.5"
            cy="33.5"
            r="0.7"
            fill="#ffffff"
          />

          {/* PICO LARGO Y FINO (FIRMA DEL COLIBRÍ) */}
          <path
            d="M 73 35 L 98 28 L 74 38 Z"
            fill="#fff5c0"
          />

          {/* ALA SUPERIOR CON ALETEO ULTRA RÁPIDO (CSS FLAP ANIMATION) */}
          <motion.path
            d="M 50 45 C 42 25, 30 10, 22 2 C 34 14, 52 28, 58 40 Z"
            fill="url(#goldFeatherGrad)"
            animate={{
              d: isScrolling
                ? [
                    "M 50 45 C 42 25, 30 10, 22 2 C 34 14, 52 28, 58 40 Z",
                    "M 50 45 C 48 55, 35 68, 26 78 C 38 62, 54 52, 58 45 Z",
                    "M 50 45 C 42 25, 30 10, 22 2 C 34 14, 52 28, 58 40 Z"
                  ]
                : [
                    "M 50 45 C 42 25, 30 10, 22 2 C 34 14, 52 28, 58 40 Z",
                    "M 50 45 C 46 38, 38 25, 30 15 C 40 24, 53 34, 58 42 Z",
                    "M 50 45 C 42 25, 30 10, 22 2 C 34 14, 52 28, 58 40 Z"
                  ],
              opacity: [0.95, 0.75, 0.95]
            }}
            transition={{
              duration: isScrolling ? 0.08 : 0.22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* ALA INFERIOR */}
          <motion.path
            d="M 46 48 C 38 32, 28 20, 18 12 C 28 24, 44 38, 50 48 Z"
            fill="url(#cyanAccentGrad)"
            opacity="0.75"
            animate={{
              d: isScrolling
                ? [
                    "M 46 48 C 38 32, 28 20, 18 12 C 28 24, 44 38, 50 48 Z",
                    "M 46 48 C 42 58, 32 70, 22 78 C 32 64, 46 54, 50 48 Z",
                    "M 46 48 C 38 32, 28 20, 18 12 C 28 24, 44 38, 50 48 Z"
                  ]
                : [
                    "M 46 48 C 38 32, 28 20, 18 12 C 28 24, 44 38, 50 48 Z",
                    "M 46 48 C 40 40, 32 30, 24 22 C 32 32, 46 42, 50 48 Z",
                    "M 46 48 C 38 32, 28 20, 18 12 C 28 24, 44 38, 50 48 Z"
                  ],
            }}
            transition={{
              duration: isScrolling ? 0.08 : 0.22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.03
            }}
          />
        </svg>

        {/* TOOLTIP TÁCTICO FLOTANTE (ON HOVER) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 border border-[#ecb613]/50 text-[#ecb613] text-[9px] font-mono font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-xl">
          ✦ VUELO SOBERANO EAR
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 🎬 MOTOR VISUAL CINEMÁTICO - Lenis Smooth Scroll + GSAP ScrollTrigger
 * Provee scroll inercial y transiciones cinemáticas a todo el DOM.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Inicializar Lenis para scroll inercial
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Sincronizar Lenis con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
    };
  }, []);

  return <>{children}</>;
}

/**
 * Hook global de GSAP para transiciones de color cinemáticas.
 * Usalo en cualquier componente para animar fondos basados en scroll.
 */
export function useCinematicScrollColors(
  containerRef: React.RefObject<HTMLElement | null>,
  colors: string[] = ['#050505', '#0a0a14', '#0d0d0a', '#050505']
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('[data-cinema-section]');
    
    sections.forEach((section, index) => {
      const targetColor = colors[index % colors.length];
      
      gsap.to(section, {
        backgroundColor: targetColor,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1.5,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [containerRef, colors]);
}

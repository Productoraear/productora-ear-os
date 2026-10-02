/**
 * ⚡ ANTIGRAVITY OMEGA v7.0 — FRAMER DESIGN VAULT & MOTION ENGINE
 * Absorción S-Class de tokens de diseño, físicas de primavera y animaciones de scroll.
 * Inspiración: batcave.framer.website & motionsites.ai
 */

export interface FramerPhysicsPreset {
  type: 'spring' | 'tween';
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  ease?: any;
}

export interface FramerDesignToken {
  id: string;
  name: string;
  category: 'color' | 'typography' | 'glassmorphism' | 'shadow' | 'easing';
  value: string;
  cssVariable: string;
}

// ━━ 1. PRESETS DE FÍSICA DE MOVIMIENTO FRAMER S-CLASS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const FRAMER_PHYSICS_PRESETS: Record<string, FramerPhysicsPreset> = {
  // Animación ultra-suave para elementos al hacer scroll (batcave style)
  ultraSmoothScroll: {
    type: 'spring',
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  },
  // Rebote táctil responsivo para botones e íconos interactivos
  tactileSpring: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },
  // Revelación elegante de tarjetas y banners
  cardReveal: {
    type: 'tween',
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1], // Custom Cubic Bezier para alta gama
  },
  // Transición flotante para activos sin fondo (PNG Alpha / Canvas 3D)
  floatingAsset: {
    type: 'spring',
    stiffness: 120,
    damping: 14,
    mass: 1,
  },
};

// ━━ 2. TOKENS DE DISEÑO VISUAL OLED S-CLASS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const FRAMER_OLED_TOKENS: Record<string, string> = {
  bgVoid: '#030305',
  bgSurface: '#08080c',
  bgGlass: 'rgba(15, 15, 24, 0.65)',
  borderGlass: 'rgba(255, 255, 255, 0.08)',
  accentGold: '#ecb613',
  accentRuby: '#FF2B44',
  accentCyan: '#00E5FF',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  glowGold: '0 0 30px rgba(236, 182, 19, 0.25)',
  glowCyan: '0 0 30px rgba(0, 229, 255, 0.25)',
  glassFilter: 'backdrop-blur(16px) saturate(180%)',
};

// ━━ 3. HELPER PARA COMPOSICIÓN DINÁMICA DE ANIMACIONES ━━━━━━━━━━━━━━━━━━━━━━━━━━
export function getFramerScrollTransformConfig(
  scrollProgress: number,
  outputRange: [number, number]
): number {
  const [min, max] = outputRange;
  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  return min + (max - min) * clampedProgress;
}

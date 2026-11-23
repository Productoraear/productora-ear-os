/**
 * Tokens de tema compartidos por la biblioteca `vanguardia`.
 * Tres variantes: Modo Oscuro Pizarra, Acentos Oro Mate y Modo Dia.
 * Las clases se declaran como literales completos para que Tailwind las detecte.
 * Sin dependencias de runtime, sin secretos, sin precios.
 */

export type VanguardiaVariant = 'pizarra' | 'oro' | 'dia';

export interface VanguardiaTheme {
  readonly label: string;
  readonly isDark: boolean;
  /** Clase de fondo del lienzo. */
  readonly canvas: string;
  /** Color del lienzo en hexadecimal (referencia documental). */
  readonly canvasHex: string;
  /** Superficie de cristal ahumado. */
  readonly surface: string;
  readonly border: string;
  readonly text: string;
  readonly muted: string;
  readonly accentText: string;
  /** Canales RGB del acento ("r,g,b") para gradientes radiales y canvas. */
  readonly accentRgb: string;
  /** Clases del boton primario. */
  readonly cta: string;
  /** Clases del badge con borde reflectante. */
  readonly badge: string;
  /** Clases del boton secundario. */
  readonly ghost: string;
}

export const VANGUARDIA_VARIANTS: readonly VanguardiaVariant[] = ['pizarra', 'oro', 'dia'];

export const VANGUARDIA_THEMES: Readonly<Record<VanguardiaVariant, VanguardiaTheme>> = {
  pizarra: {
    label: 'Oscuro Pizarra',
    isDark: true,
    canvas: 'bg-[#030305]',
    canvasHex: '#030305',
    surface: 'bg-white/[0.04] backdrop-blur-xl',
    border: 'border-white/10',
    text: 'text-zinc-100',
    muted: 'text-zinc-400',
    accentText: 'text-slate-200',
    accentRgb: '148,163,184',
    cta: 'bg-slate-100 text-slate-900',
    badge:
      'border-slate-300/40 bg-white/[0.04] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_18px_rgba(148,163,184,0.18)]',
    ghost: 'border-white/15 text-zinc-200 hover:bg-white/[0.06]',
  },
  oro: {
    label: 'Acentos Oro Mate',
    isDark: true,
    canvas: 'bg-[#030305]',
    canvasHex: '#030305',
    surface: 'bg-white/[0.04] backdrop-blur-xl',
    border: 'border-[#ecb613]/20',
    text: 'text-zinc-100',
    muted: 'text-zinc-400',
    accentText: 'text-[#ecb613]',
    accentRgb: '236,182,19',
    cta: 'bg-[#ecb613] text-[#120D00]',
    badge:
      'border-[#ecb613]/50 bg-[#ecb613]/[0.06] text-[#ecb613] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_18px_rgba(236,182,19,0.22)]',
    ghost: 'border-[#ecb613]/30 text-zinc-200 hover:bg-[#ecb613]/10',
  },
  dia: {
    label: 'Modo Dia',
    isDark: false,
    canvas: 'bg-[#f6f4ee]',
    canvasHex: '#f6f4ee',
    surface: 'bg-white/70 backdrop-blur-xl',
    border: 'border-zinc-900/10',
    text: 'text-zinc-900',
    muted: 'text-zinc-600',
    accentText: 'text-[#7a5c00]',
    accentRgb: '138,106,0',
    cta: 'bg-zinc-900 text-zinc-50',
    badge:
      'border-[#7a5c00]/40 bg-white/60 text-[#7a5c00] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_14px_rgba(138,106,0,0.14)]',
    ghost: 'border-zinc-900/20 text-zinc-800 hover:bg-zinc-900/5',
  },
};

export function getVanguardiaTheme(variant: VanguardiaVariant | undefined): VanguardiaTheme {
  return VANGUARDIA_THEMES[variant ?? 'oro'];
}

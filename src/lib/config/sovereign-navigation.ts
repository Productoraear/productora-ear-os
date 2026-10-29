import { Building2, Music, Radio, Sliders, Sparkles, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SSOT DE NAVEGACIÓN PÚBLICA (S-Class) — ÚNICA fuente de menús.
 * La consumen `SovereignNavbar` (escritorio) y `SovereignMobileHUD` (móvil).
 * Prohibido duplicar esta estructura en componentes: si necesitas un enlace,
 * añádelo aquí y aparecerá en ambos formatos.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface SubmenuItem {
  title: string;
  desc: string;
  href: string;
  badge?: string;
  icon: LucideIcon;
}

export interface MenuFolder {
  id: string;
  label: string;
  shortLabel: string;
  href: string;
  subitems: SubmenuItem[];
}

export const MENU_FOLDERS: MenuFolder[] = [
  {
    id: 'fincas',
    label: 'Fincas & Espacios',
    shortLabel: 'Fincas',
    href: '/fincas',
    subitems: [
      {
        title: 'Directorio Unificado de Fincas y Espacios (9.559 Espacios)',
        desc: 'Catálogo nacional S-Class con Motor Omni-Builder 2030 en tiempo real y reserva Price-Lock de 100 €',
        href: '/fincas',
        badge: '9.559 Espacios',
        icon: Building2,
      },
    ],
  },
  {
    id: 'artistas',
    label: 'Artistas & Shows',
    shortLabel: 'Artistas',
    href: '/artistas',
    subitems: [
      {
        title: 'Directorio Nacional de Artistas & Shows (5.359 Auditados)',
        desc: 'Catálogo de música en directo: Solistas, Mariachis, DJs, Bandas y Lírico con Rider Bose F1',
        href: '/artistas',
        badge: '5.359 Artistas',
        icon: Music,
      },
      {
        title: 'Edwin Agudelo · Solista Premium (350 €)',
        desc: 'Show 1h (2 pases), Bose 2.000W, sombreros charros, flores y fotos',
        href: '/reservar/solista',
        badge: '350 €',
        icon: Sparkles,
      },
      {
        title: 'Mariachis & Cuartetos de Gala',
        desc: 'Packs Trío (450€), Quinteto Imperial (750€) o Monumental (1.300€)',
        href: '/simulacion-mariachis',
        badge: 'Packs',
        icon: Users,
      },
      {
        title: 'Experiencia 360° (Multirrol)',
        desc: 'Portal interactivo: Atmosphere Matcher, Split 80/10/10 y Licitaciones LCSP',
        href: '/experiencia',
        badge: 'Nuevo 360°',
        icon: Sparkles,
      },
    ],
  },
  {
    id: 'sonido',
    label: 'Audiovisuales & Equipamiento',
    shortLabel: 'Audiovisuales',
    href: '/alquiler-equipos-sonido-audiovisuales',
    subitems: [
      {
        title: 'Alquiler Sonido Bose F1 812 & S1 Pro',
        desc: 'Equipos de alta presión sonora con calibración acústica',
        href: '/alquiler-equipos-sonido-audiovisuales',
        badge: 'Bose F1',
        icon: Radio,
      },
    ],
  },
  {
    id: 'proveedores',
    label: 'Catering & Servicios',
    shortLabel: 'Catering',
    href: '/proveedores',
    subitems: [
      {
        title: 'Directorio Canónico de Proveedores Verificados',
        desc: 'Catering de Autor, Fotografía, Vídeo, Decoración y Planners',
        href: '/proveedores',
        badge: 'Catálogo Verificado',
        icon: Sliders,
      },
    ],
  },
];

export type SpotlightAccent = 'gold' | 'ruby' | 'cyan';

export interface SpotlightLink {
  id: string;
  label: string;
  hint: string;
  href: string;
  accent: SpotlightAccent;
}

/**
 * Enlaces de máxima conversión que deben estar a un toque en CUALQUIER vertical.
 * El HUD móvil los pinta con el acento declarado (un solo color por vista).
 */
export const SPOTLIGHT_LINKS: SpotlightLink[] = [
  { id: 'vimume', label: 'VIMUME OS', hint: 'Neuroacústica 40 Hz', href: '/vimume', accent: 'cyan' },
  { id: 'alianzas', label: 'Alianzas', hint: 'Red de fincas y partners', href: '/alianzas', accent: 'ruby' },
  { id: 'calculadora', label: 'Presupuestador', hint: '13 partidas · SSOT', href: '/calculadora', accent: 'gold' },
];

/** Evento global para abrir el menú móvil unificado desde cualquier disparador. */
export const MOBILE_MENU_EVENT = 'ear:toggle-mobile-menu';

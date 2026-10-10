/**
 * BRAND PALETTE & SOVEREIGN DESIGN SYSTEM - PRODUCTORA EAR
 * Fuente SSOT: Manual de Identidad Corporativa (LP / Productora EAR)
 * + Manual de Marca VIMUME (Sebastián Díaz, Feb 2025)
 * + Manifiesto Filosófico "Sin Igual" (Edwin Agudelo)
 *
 * S-Class Seal — Wave 6 / LIB-AUDIT
 * Tipado estricto, cero `any`, exports vivos únicamente.
 */

/* ------------------------------------------------------------------ */
/*  TIPOS ESTRICTOS                                                    */
/* ------------------------------------------------------------------ */

export interface ObsidianTokens {
  readonly pure: string;
  readonly core: string;
  readonly subtle: string;
  readonly surface: string;
  readonly card: string;
  readonly elevated: string;
  readonly border: string;
  readonly borderSubtle: string;
  readonly borderGold: string;
}

export interface DiamondRedTokens {
  readonly primary: string;
  readonly action: string;
  readonly highlight: string;
  readonly deep: string;
  readonly light: string;
  readonly glow: string;
  readonly gradient: string;
  readonly borderGlow: string;
}

export interface DiamondBlueTokens {
  readonly obsidian: string;
  readonly technical: string;
  readonly electric: string;
  readonly ice: string;
  readonly sky: string;
  readonly glow: string;
  readonly gradient: string;
  readonly borderGlow: string;
}

export interface GoldTokens {
  readonly base: string;
  readonly glow: string;
  readonly light: string;
  readonly deep: string;
  readonly dark: string;
  readonly gradient: string;
  readonly borderGlow: string;
  readonly boxGlow: string;
}

export interface AxisTokens {
  readonly name: string;
  readonly pantone: string;
  readonly hex: string;
  readonly primary: string;
  readonly accent: string;
  readonly glow: string;
  readonly gradient: string;
  readonly shadow: string;
}

export interface VimumeAxisTokens extends AxisTokens {
  readonly colibriTeal: string;
  readonly colibriYellow: string;
  readonly colibriOrange: string;
  readonly colibriViolet: string;
}

export interface AxesTokens {
  readonly artistas: AxisTokens;
  readonly eventos: AxisTokens;
  readonly empresas: AxisTokens;
  readonly instituciones: AxisTokens;
  readonly vimume: VimumeAxisTokens;
}

export interface TypographyTokens {
  readonly primary: string;
  readonly display: string;
  readonly script: string;
  readonly mono: string;
}

export interface ManifestoTokens {
  readonly lema: string;
  readonly lemaAlternativo: string;
  readonly tribu: string;
  readonly perfilTransformado: string;
  readonly filosofiaColibri: string;
}

export interface AssetsTokens {
  readonly diamondOfficialLogo: string;
  readonly earGoldIsotipo: string;
  readonly earWhiteIsotipo: string;
  readonly colibriIsotipo: string;
  readonly colibriLogoCompleto: string;
}

export interface EarPalette {
  readonly obsidian: ObsidianTokens;
  readonly diamondRed: DiamondRedTokens;
  readonly diamondBlue: DiamondBlueTokens;
  readonly gold: GoldTokens;
  readonly axes: AxesTokens;
  readonly typography: TypographyTokens;
  readonly manifesto: ManifestoTokens;
  readonly assets: AssetsTokens;
}

export type AxisKey = keyof AxesTokens;

/* ------------------------------------------------------------------ */
/*  PALETA SSOT                                                        */
/* ------------------------------------------------------------------ */

export const EAR_PALETTE: EarPalette = {
  // 1. Fondos y Superficies de Élite (Deep Space Obsidian)
  obsidian: {
    pure: '#000000',
    core: '#030305',
    subtle: '#06070a',
    surface: '#0c0d14',
    card: '#11131e',
    elevated: '#171a29',
    border: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderGold: 'rgba(236, 182, 19, 0.28)'
  },

  // 💎 2. PALETA ROJIZA PRODUCTORA EAR (DIAMANTE ROJO - PASIÓN / FUEGO / NÚCLEO)
  // Fuente: Cuaderno Manuscrito de Marca & Logotipo Oficial EAR
  diamondRed: {
    primary: '#E11D48',
    action: '#FF2B44',
    highlight: '#FF6B7D',
    deep: '#9F1239',
    light: '#FEE2E2',
    glow: 'rgba(255, 43, 68, 0.35)',
    gradient:
      'linear-gradient(135deg, #FF6B7D 0%, #FF2B44 50%, #E11D48 75%, #9F1239 100%)',
    borderGlow: '0 0 25px rgba(255, 43, 68, 0.4)'
  },

  // 💎 3. PALETA AZULADA VIMUME & ESTRUCTURA (DIAMANTE AZUL - NEUROACÚSTICA / CIENCIA)
  // Fuente: Cuaderno Manuscrito de Marca & Logotipo Oficial EAR
  diamondBlue: {
    obsidian: '#030712',
    technical: '#0284C7',
    electric: '#258DCD',
    ice: '#BAE6FD',
    sky: '#44A3D8',
    glow: 'rgba(37, 141, 205, 0.35)',
    gradient:
      'linear-gradient(135deg, #BAE6FD 0%, #44A3D8 35%, #258DCD 70%, #0284C7 100%)',
    borderGlow: '0 0 25px rgba(37, 141, 205, 0.35)'
  },

  // 4. Oro & Ámbar S-Class (Espectáculos & Núcleo Productora EAR)
  gold: {
    base: '#c3983c', // Pantone P 15-14 C
    glow: '#ecb613', // EAR S-Class Highlight
    light: '#faf08f', // Pantone 602 CP
    deep: '#744527', // Pantone 7588 CP
    dark: '#4d2a1f',
    gradient:
      'linear-gradient(135deg, #ffd000 0%, #ecb613 40%, #c3983c 75%, #744527 100%)',
    borderGlow: '0 0 25px rgba(236, 182, 19, 0.35)',
    boxGlow: '0 8px 32px rgba(236, 182, 19, 0.18)'
  },

  // 3. Ejes Operativos Soberanos (Los 5 Pilares)
  axes: {
    // Eje 1: Artistas (Pasión / Fuego Creativo / Categoría Adultos)
    artistas: {
      name: 'Artistas',
      pantone: 'p 48-8 C',
      hex: '#f43f5e',
      primary: '#e40e20',
      accent: '#fb7185',
      glow: 'rgba(244, 63, 94, 0.35)',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 60%, #881337 100%)',
      shadow: '0 0 25px rgba(244, 63, 94, 0.3)'
    },

    // Eje 2: Eventos (Sabor / Galas / Celebración / Categoría Abuelos)
    eventos: {
      name: 'Eventos',
      pantone: 'p 20-7 C',
      hex: '#f59e0b',
      primary: '#f6a02a',
      accent: '#fbbf24',
      glow: 'rgba(245, 158, 11, 0.35)',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #92400e 100%)',
      shadow: '0 0 25px rgba(245, 158, 11, 0.3)'
    },

    // Eje 3: Empresas (Estructura B2B / Proveedores / Prosperidad)
    empresas: {
      name: 'Empresas',
      pantone: 'p 120-6 C',
      hex: '#10b981',
      primary: '#059669',
      accent: '#34d399',
      glow: 'rgba(16, 185, 129, 0.35)',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #064e3b 100%)',
      shadow: '0 0 25px rgba(16, 185, 129, 0.3)'
    },

    // Eje 4: Instituciones (Solidez Cívica / Ayuntamientos / Gobiernos)
    instituciones: {
      name: 'Instituciones',
      pantone: 'p 135-8 C',
      hex: '#06b6d4',
      primary: '#0891b2',
      accent: '#38bdf8',
      glow: 'rgba(6, 182, 212, 0.35)',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 60%, #164e63 100%)',
      shadow: '0 0 25px rgba(6, 182, 212, 0.3)'
    },

    // Eje 5: Proyecto VIMUME (Neuroacústica 40Hz / El Colibrí / Residencias)
    vimume: {
      name: 'Proyecto VIMUME',
      pantone: 'p 84-13 C',
      hex: '#8b5cf6',
      primary: '#aa6794',
      accent: '#a78bfa',
      colibriTeal: '#27c3a8',
      colibriYellow: '#fdb927',
      colibriOrange: '#f37024',
      colibriViolet: '#5b51a5',
      glow: 'rgba(139, 92, 246, 0.35)',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 60%, #4c1d95 100%)',
      shadow: '0 0 25px rgba(139, 92, 246, 0.3)'
    }
  },

  // 4. Tipografías Oficiales del Manual de Marca
  typography: {
    primary: 'Montserrat, sans-serif',
    display: 'Blacker Pro Titling Bold, Georgia, serif',
    script: 'Shandora, cursive',
    mono: 'ui-monospace, monospace'
  },

  // 5. Vocabulario Sagrado & Código Inmutable
  manifesto: {
    lema: 'Mensajes de calidad para una sociedad de calidad',
    lemaAlternativo: 'Arte con propósito',
    tribu: 'Sin Igual',
    perfilTransformado: 'Artista Premium',
    filosofiaColibri:
      'La acción individual frente a problemas inmensos: Haz tu parte. Eso es suficiente para empezar.'
  },

  // 6. Activos Oficiales
  assets: {
    diamondOfficialLogo: '/images/brand/ear_logo_official_diamond.png',
    earGoldIsotipo: '/images/brand/ear_gold_isotipo.png',
    earWhiteIsotipo: '/images/brand/ear_white_isotipo.png',
    colibriIsotipo: '/images/brand/colibri_isotipo.png',
    colibriLogoCompleto: '/images/brand/colibri_logo_completo.png'
  }
};

/* ------------------------------------------------------------------ */
/*  HELPERS TIPADOS (consumidores vivos del SSOT)                      */
/* ------------------------------------------------------------------ */

/**
 * Devuelve los tokens de un eje operativo por su clave.
 * Tipado estricto: la clave está restringida a `AxisKey`.
 */
export function getAxisTokens(key: AxisKey): AxesTokens[AxisKey] {
  return EAR_PALETTE.axes[key];
}

/**
 * Devuelve el gradiente CSS de un eje operativo.
 */
export function getAxisGradient(key: AxisKey): string {
  return EAR_PALETTE.axes[key].gradient;
}

/**
 * Devuelve el color hex principal de un eje operativo.
 */
export function getAxisHex(key: AxisKey): string {
  return EAR_PALETTE.axes[key].hex;
}

/**
 * Lista inmutable de claves de ejes operativos.
 */
export const AXIS_KEYS: readonly AxisKey[] = [
  'artistas',
  'eventos',
  'empresas',
  'instituciones',
  'vimume'
] as const;

/**
 * Type guard para validar si un string arbitrario es un `AxisKey` válido.
 */
export function isAxisKey(value: string): value is AxisKey {
  return (AXIS_KEYS as readonly string[]).includes(value);
}
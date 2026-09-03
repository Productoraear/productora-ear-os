/**
 * BRAND PALETTE & SOVEREIGN DESIGN SYSTEM - PRODUCTORA EAR
 * Fuente SSOT: Manual de Identidad Corporativa (LP / Productora EAR)
 * + Manual de Marca VIMUME (Sebastián Díaz, Feb 2025)
 * + Manifiesto Filosófico "Sin Igual" (Edwin Agudelo)
 */

export const EAR_PALETTE = {
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

  // 2. Oro & Ámbar S-Class (Espectáculos & Núcleo Productora EAR)
  gold: {
    base: '#c3983c',       // Pantone P 15-14 C
    glow: '#ecb613',       // EAR S-Class Highlight
    light: '#faf08f',      // Pantone 602 CP
    deep: '#744527',       // Pantone 7588 CP
    dark: '#4d2a1f',
    gradient: 'linear-gradient(135deg, #ffd000 0%, #ecb613 40%, #c3983c 75%, #744527 100%)',
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
    filosofiaColibri: 'La acción individual frente a problemas inmensos: Haz tu parte. Eso es suficiente para empezar.'
  },

  // 6. Activos Oficiales
  assets: {
    earGoldIsotipo: '/images/brand/ear_gold_isotipo.png',
    earWhiteIsotipo: '/images/brand/ear_white_isotipo.png',
    colibriIsotipo: '/images/brand/colibri_isotipo.png',
    colibriLogoCompleto: '/images/brand/colibri_logo_completo.png'
  }
};

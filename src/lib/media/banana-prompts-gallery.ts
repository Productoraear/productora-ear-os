/**
 * BANANA PROMPTS XYZ — MOTOR DE ACTIVOS FOTOGRÁFICOS DE ALTA CONVERSIÓN S-CLASS
 * Dirección de Fotografía Cinematográfica Ultra-Realista & Minimalista
 * Inyección pedagógica no saturada (3 a 5 imágenes estratégicas por URL)
 */

export interface BananaMediaItem {
  url: string;
  alt: string;
  caption: string;
  role: 'hero' | 'acoustics' | 'artist' | 'catering' | 'logistics' | 'sanctuary';
  aspectRatio: string;
}

export const BANANA_MASTER_GALLERY: Record<string, BananaMediaItem[]> = {
  fincas: [
    {
      url: '/images/banana/finca_minimalist.jpg',
      alt: 'Patio claustral señorial minimalista al anochecer con vela solitaria y arquería de piedra arenisca',
      caption: 'Arquitectura histórica con acústica natural y luz crepuscular cinematográfica (Hasselblad X2D 100C).',
      role: 'hero',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/bose_minimal.jpg',
      alt: 'Columna acústica Bose F1 y micrófono Shure Axient con iluminación de recorte rasante en fondo OLED',
      caption: 'Presión sonora calibrada conforme a Ley 37/2003 (85-90 dBA exteriores / 80-85 dBA interiores).',
      role: 'acoustics',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/mariachi_minimal.jpg',
      alt: 'Retrato cinematográfico intimista de gala de Edwin Agudelo en traje de charro y guitarra clásica',
      caption: 'Actuación solista de alta distinción vocal a 75 dBA que permite la conversación elegante de los invitados.',
      role: 'artist',
      aspectRatio: '16:9'
    }
  ],
  bodas: [
    {
      url: '/images/banana/mariachi_minimal.jpg',
      alt: 'Retrato de gala en bajo perfil de Edwin Agudelo con bordados de plata y guitarra clásica de luthier',
      caption: 'Directo de gala con Split Soberano 80% Artista. Depósito Price-Lock 100€ en Stripe.',
      role: 'artist',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/finca_minimalist.jpg',
      alt: 'Arquería monumental iluminada con vela en patio de finca histórica',
      caption: 'Espacio singular homologado para ceremonias y banquetes sin contaminación acústica.',
      role: 'hero',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/bose_minimal.jpg',
      alt: 'Sonorización Bose F1 y microfonía inalámbrica Shure en tarima de madera oscura',
      caption: 'Dispersión acústica dirigida 12 W/pax para ceremonia y baile sin estridencias.',
      role: 'acoustics',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/catering_minimal.jpg',
      alt: 'Paella gourmet a la leña de encina con brasas incandescentes y humo aromático al anochecer',
      caption: 'Gastronomía al fuego vivo en directo como experiencia culinaria y sensorial.',
      role: 'catering',
      aspectRatio: '16:9'
    }
  ],
  catering: [
    {
      url: '/images/banana/catering_minimal.jpg',
      alt: 'Arroz gourmet cocinado a fuego lento sobre brasas vivas de roble y encina en recipiente de hierro',
      caption: 'Elaboración artesanal sobre leña de encina. Sabor puro de campo y presentación de alta cocina.',
      role: 'catering',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/finca_minimalist.jpg',
      alt: 'Patio de piedra iluminado con luz tenue de velas para cóctel de bienvenida',
      caption: 'Entornos rústicos y monumentales seleccionados para banquetes de brasas.',
      role: 'hero',
      aspectRatio: '16:9'
    }
  ],
  vimume: [
    {
      url: '/images/banana/vimume_minimal.jpg',
      alt: 'Violonchelo acústico sobre soporte en sala minimalista de paneles de roble con rayo de sol matutino',
      caption: 'Protocolo neuroacústico 40 Hz no invasivo para estimulación cognitiva en centros senior.',
      role: 'sanctuary',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/bose_minimal.jpg',
      alt: 'Altavoces Bose de ultra-baja distorsión calibrados a 65-75 dBA',
      caption: 'Presión acústica controlada para el descanso y la relajación de mayores.',
      role: 'acoustics',
      aspectRatio: '16:9'
    }
  ],
  arsenal: [
    {
      url: '/images/banana/bose_minimal.jpg',
      alt: 'Sistema de audio Bose F1 Model 812 y micrófono Shure Axient con iluminación de borde dorada',
      caption: 'Arsenal audiovisual disponible con transporte logístico y técnicos homologados.',
      role: 'acoustics',
      aspectRatio: '16:9'
    },
    {
      url: '/images/banana/finca_minimalist.jpg',
      alt: 'Patio claustral con acústica controlada para montajes técnicos',
      caption: 'Pruebas de sonido y calibración sonométrica previa con registro oficial.',
      role: 'hero',
      aspectRatio: '16:9'
    }
  ]
};

export function getBananaImagesForUrl(pathname: string): BananaMediaItem[] {
  const clean = pathname.toLowerCase();

  if (clean.includes('vimume') || clean.includes('alzheimer') || clean.includes('clinica')) {
    return BANANA_MASTER_GALLERY.vimume;
  }
  if (clean.includes('catering') || clean.includes('arroces') || clean.includes('brasas')) {
    return BANANA_MASTER_GALLERY.catering;
  }
  if (clean.includes('finca')) {
    return BANANA_MASTER_GALLERY.fincas;
  }
  if (clean.includes('arsenal') || clean.includes('sonido') || clean.includes('pantalla')) {
    return BANANA_MASTER_GALLERY.arsenal;
  }
  return BANANA_MASTER_GALLERY.bodas;
}

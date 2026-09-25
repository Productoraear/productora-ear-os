/**
 * 🏛️ EAR OS V2 — BANCO DE PRECIOS Y CATÁLOGO DETERMINISTA S-CLASS
 * ------------------------------------------------------------------
 * Fuente Única de la Verdad (SSOT) para cotizaciones de producción,
 * sonorización, bodas y eventos en Productora EAR.
 * 
 * Regla Innegociable: La IA nunca inventa precios. Si un concepto no
 * casa con este catálogo, nace en amarillo y sin precio hasta validación.
 * Todo el dinero se maneja en CÉNTIMOS ENTEROS para evitar errores de coma flotante.
 */

export interface PartidaCatalogo {
  codigo: string;
  capitulo: 'Artistas' | 'Sonorización' | 'Iluminación' | 'Efectos' | 'Logística' | 'Servicios';
  nombre: string;
  unidad: 'ud' | 'h' | 'km' | 'pa' | 'pax';
  precioCéntimos: number; // En céntimos (ej. 35000 = 350,00 €)
  margenObjetivoPct: number;
  descripcion: string;
  activo: boolean;
}

export const BANCO_PRECIOS_EAR: PartidaCatalogo[] = [
  // 1. ARTISTAS & SHOWS
  {
    codigo: 'ART-SOL-01',
    capitulo: 'Artistas',
    nombre: 'Solista Edwin Agudelo (Voz Lírica / Melódica)',
    unidad: 'ud',
    precioCéntimos: 35000, // 350,00 € (Tarifa Base Inmutable)
    margenObjetivoPct: 20,
    descripcion: 'Actuación en directo de solista lírico/pop lírico (Ceremonia o Cóctel)',
    activo: true,
  },
  {
    codigo: 'ART-DUO-01',
    capitulo: 'Artistas',
    nombre: 'Dúo Acústico (Voz / Piano o Voz / Violín)',
    unidad: 'ud',
    precioCéntimos: 60000, // 600,00 €
    margenObjetivoPct: 20,
    descripcion: 'Dúo instrumental o vocal para ceremonia religiosa/civil o cóctel 1h30',
    activo: true,
  },
  {
    codigo: 'ART-TRI-01',
    capitulo: 'Artistas',
    nombre: 'Trío de Cuerda / Clásico',
    unidad: 'ud',
    precioCéntimos: 75000, // 750,00 €
    margenObjetivoPct: 20,
    descripcion: 'Trío instrumental acústico con atril y repertorio ceremonial personalizado',
    activo: true,
  },
  {
    codigo: 'ART-CUA-01',
    capitulo: 'Artistas',
    nombre: 'Cuarteto de Cuerda Clásico',
    unidad: 'ud',
    precioCéntimos: 110000, // 1.100,00 €
    margenObjetivoPct: 20,
    descripcion: 'Cuarteto de cuerda profesional para grandes ceremonias y recepciones',
    activo: true,
  },
  {
    codigo: 'ART-MAR-01',
    capitulo: 'Artistas',
    nombre: 'Mariachis Élite (Formato 4 Músicos)',
    unidad: 'ud',
    precioCéntimos: 55000, // 550,00 €
    margenObjetivoPct: 20,
    descripcion: 'Agrupación tradicional de mariachi mexicano en vivo (pase 45-60 min)',
    activo: true,
  },

  // 2. SONORIZACIÓN & AUDIO PROFESIONAL
  {
    codigo: 'SND-CER-01',
    capitulo: 'Sonorización',
    nombre: 'Pack Sonorización Ceremonia Civil S-Class',
    unidad: 'pa',
    precioCéntimos: 25000, // 250,00 €
    descripcion: 'Columna activa Bose S1 Pro / Compact, 2 micrófonos inalámbricos Shure Beta 87A para oficiante y lecturas, mesa digital y técnico operador',
    margenObjetivoPct: 35,
    activo: true,
  },
  {
    codigo: 'SND-COC-01',
    capitulo: 'Sonorización',
    nombre: 'Sonorización y Música Ambiental Cóctel',
    unidad: 'pa',
    precioCéntimos: 20000, // 200,00 €
    descripcion: 'Sistema de audio autónomo con cobertura 360°, reproducción de playlist coordinada y soporte para músicos en directo',
    margenObjetivoPct: 35,
    activo: true,
  },
  {
    codigo: 'SND-DIS-01',
    capitulo: 'Sonorización',
    nombre: 'Pack Barra Libre S-Class (4 Horas)',
    unidad: 'pa',
    precioCéntimos: 65000, // 650,00 €
    descripcion: 'Sistema de sonido Bose F1 Model 812 (1.000W) + Subwoofer, cabina Pioneer DJ, puente de iluminación LED DMX y DJ profesional residente 4h',
    margenObjetivoPct: 30,
    activo: true,
  },
  {
    codigo: 'SND-HRX-01',
    capitulo: 'Sonorización',
    nombre: 'Hora Extra de Barra Libre y DJ',
    unidad: 'h',
    precioCéntimos: 12000, // 120,00 €
    descripcion: 'Ampliación de fiesta con DJ y sistema de sonido activo por hora adicional',
    margenObjetivoPct: 35,
    activo: true,
  },

  // 3. ILUMINACIÓN & AMBIENTACIÓN
  {
    codigo: 'ILU-PER-01',
    capitulo: 'Iluminación',
    nombre: 'Pack Iluminación Perimetral Wireless (12 Focos LED RGBW)',
    unidad: 'pa',
    precioCéntimos: 28000, // 280,00 €
    descripcion: 'Bañadores de pared inalámbricos a batería para realce de arquitectura de fincas y bodegas',
    margenObjetivoPct: 40,
    activo: true,
  },
  {
    codigo: 'ILU-GIR-01',
    capitulo: 'Iluminación',
    nombre: 'Cabezas Móviles Beam / Wash (Pareja)',
    unidad: 'pa',
    precioCéntimos: 18000, // 180,00 €
    descripcion: 'Efectos de iluminación dinámica programada para pista de baile',
    margenObjetivoPct: 35,
    activo: true,
  },

  // 4. EFECTOS ESPECIALES & SHOWS
  {
    codigo: 'EFE-CHI-01',
    capitulo: 'Efectos',
    nombre: 'Chispas Frías Cold Spark (2 Cabezas)',
    unidad: 'pa',
    precioCéntimos: 22000, // 220,00 €
    descripcion: 'Fuego frío no pirotécnico, 100% seguro para interiores y fincas para entrada o baile nupcial',
    margenObjetivoPct: 45,
    activo: true,
  },
  {
    codigo: 'EFE-HUM-01',
    capitulo: 'Efectos',
    nombre: 'Humo Denso Bajo (Baile en las Nubes)',
    unidad: 'pa',
    precioCéntimos: 18000, // 180,00 €
    descripcion: 'Generador de humo rasante criogénico para primer baile de novios',
    margenObjetivoPct: 40,
    activo: true,
  },

  // 5. LOGÍSTICA & DESPLAZAMIENTO S-CLASS
  {
    codigo: 'LOG-KM-01',
    capitulo: 'Logística',
    nombre: 'Kilometraje Operativo (a partir de 50 km desde Méntrida)',
    unidad: 'km',
    precioCéntimos: 150, // 1,50 € por km (Regla inmutable)
    descripcion: 'Desplazamiento técnico y de flota de transporte para montaje y desmontaje',
    margenObjetivoPct: 20,
    activo: true,
  },
  {
    codigo: 'LOG-HOT-01',
    capitulo: 'Logística',
    nombre: 'Suplemento Alojamiento Técnico / Artístico',
    unidad: 'ud',
    precioCéntimos: 12000, // 120,00 € (Regla inmutable si fin >= 3:00 AM o >200 km)
    descripcion: 'Alojamiento en hotel para equipo técnico cuando la operativa finaliza de madrugada o a larga distancia',
    margenObjetivoPct: 0,
    activo: true,
  },
];

/**
 * Busca en el banco de precios determinista por coincidencia de términos.
 */
export function buscarEnBancoPrecios(termino: string): PartidaCatalogo | null {
  const norm = termino.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // 1. Coincidencia exacta por código
  const porCodigo = BANCO_PRECIOS_EAR.find(p => p.codigo.toLowerCase() === norm);
  if (porCodigo) return porCodigo;

  // 2. Coincidencia por palabras clave clave
  if (norm.includes('solista') || norm.includes('edwin') || norm.includes('tenor') || norm.includes('cantante')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ART-SOL-01') || null;
  }
  if (norm.includes('duo') || norm.includes('dúo')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ART-DUO-01') || null;
  }
  if (norm.includes('trio') || norm.includes('trío')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ART-TRI-01') || null;
  }
  if (norm.includes('cuarteto')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ART-CUA-01') || null;
  }
  if (norm.includes('mariachi')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ART-MAR-01') || null;
  }
  if (norm.includes('ceremonia') && (norm.includes('sonor') || norm.includes('micro') || norm.includes('audio'))) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-CER-01') || null;
  }
  if (norm.includes('coctel') || norm.includes('cóctel') || norm.includes('aperitivo')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-COC-01') || null;
  }
  if (norm.includes('barra libre') || norm.includes('dj') || norm.includes('discoteca')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-DIS-01') || null;
  }
  if (norm.includes('hora extra') || norm.includes('horas extra')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-HRX-01') || null;
  }
  if (norm.includes('perimetral') || norm.includes('focos') || norm.includes('iluminacion') || norm.includes('iluminación')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ILU-PER-01') || null;
  }
  if (norm.includes('chispas') || norm.includes('fuego frio') || norm.includes('cold spark')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'EFE-CHI-01') || null;
  }
  if (norm.includes('humo') || norm.includes('nubes')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'EFE-HUM-01') || null;
  }
  if (norm.includes('km') || norm.includes('kilometraje') || norm.includes('desplazamiento')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'LOG-KM-01') || null;
  }
  if (norm.includes('hotel') || norm.includes('alojamiento')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'LOG-HOT-01') || null;
  }

  return null;
}

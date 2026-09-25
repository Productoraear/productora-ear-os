/**
 * 🏛️ EAR OS V2 — BANCO DE PRECIOS Y CATÁLOGO DETERMINISTA S-CLASS
 * ------------------------------------------------------------------
 * Fuente Única de la Verdad (SSOT) para cotizaciones de producción,
 * sonorización, bodas y eventos en Productora EAR.
 * 
 * Regla Innegociable del CEO: NUNCA se darán precios de terceros sin
 * previa validación en su ficha de proveedor. Los precios aquí presentes
 * corresponden exclusivamente al catálogo homologado directo de Productora EAR
 * y partners con acuerdo S-Class verificado.
 */

import type { EventPhase } from './proposal-types';

export interface PartidaCatalogo {
  codigo: string;
  fase: EventPhase;
  capitulo: 'Artistas' | 'Sonorización' | 'Iluminación' | 'Efectos' | 'Logística' | 'Fincas' | 'Catering' | 'Fotografía' | 'Decoración' | 'Transporte' | 'Wedding_Planning' | 'Servicios';
  nombre: string;
  unidad: 'ud' | 'h' | 'km' | 'pa' | 'pax';
  precioCéntimos: number; // En céntimos (ej. 35000 = 350,00 €)
  margenObjetivoPct: number;
  descripcion: string;
  proveedorVerificado: boolean; // Catálogo directo homologado
  activo: boolean;
  
  // Metadatos de proveedor y especificaciones técnicas
  proveedorId?: string;
  proveedorNombre?: string;
  proveedorGremio?: string;
  detallesTecnicos?: Record<string, string | number | boolean>;
}

export const BANCO_PRECIOS_EAR: PartidaCatalogo[] = [
  // 1. ARTISTAS & SHOWS HOMOLOGADOS
  {
    codigo: 'ART-SOL-01',
    fase: 'coctel',
    capitulo: 'Artistas',
    nombre: 'Solista Edwin Agudelo (Voz Lírica / Melódica en Directo)',
    unidad: 'ud',
    precioCéntimos: 35000, // 350,00 € (Tarifa Base Inmutable)
    margenObjetivoPct: 20,
    descripcion: 'Actuación en directo de solista lírico / pop lírico (Ceremonia o Cóctel)',
    proveedorVerificado: true,
    activo: true,
    proveedorNombre: 'Productora EAR • Edwin Agudelo',
    proveedorGremio: 'musica',
  },
  {
    codigo: 'ART-DUO-01',
    fase: 'ceremonia',
    capitulo: 'Artistas',
    nombre: 'Dúo Acústico (Voz / Piano o Voz / Violín)',
    unidad: 'ud',
    precioCéntimos: 60000, // 600,00 €
    margenObjetivoPct: 20,
    descripcion: 'Dúo instrumental o vocal para ceremonia religiosa/civil o cóctel 1h30',
    proveedorVerificado: true,
    activo: true,
    proveedorNombre: 'Música en Bodas Alba Lírica',
    proveedorGremio: 'musica',
  },
  {
    codigo: 'ART-TRI-01',
    fase: 'ceremonia',
    capitulo: 'Artistas',
    nombre: 'Trío de Cuerda / Clásico',
    unidad: 'ud',
    precioCéntimos: 75000, // 750,00 €
    margenObjetivoPct: 20,
    descripcion: 'Trío instrumental acústico con atril y repertorio ceremonial personalizado',
    proveedorVerificado: true,
    activo: true,
    proveedorNombre: 'Ensemble Clásico EAR',
    proveedorGremio: 'musica',
  },
  {
    codigo: 'ART-CUA-01',
    fase: 'ceremonia',
    capitulo: 'Artistas',
    nombre: 'Cuarteto de Cuerda Clásico',
    unidad: 'ud',
    precioCéntimos: 110000, // 1.100,00 €
    margenObjetivoPct: 20,
    descripcion: 'Cuarteto de cuerda profesional para grandes ceremonias y recepciones',
    proveedorVerificado: true,
    activo: true,
    proveedorNombre: 'Cuarteto Filarmónico S-Class',
    proveedorGremio: 'musica',
  },
  {
    codigo: 'ART-MAR-01',
    fase: 'fiesta',
    capitulo: 'Artistas',
    nombre: 'Mariachis Élite (Formato 4 Músicos Homologados)',
    unidad: 'ud',
    precioCéntimos: 55000, // 550,00 €
    margenObjetivoPct: 20,
    descripcion: 'Agrupación tradicional de mariachi mexicano en vivo con vestuario de gala',
    proveedorVerificado: true,
    activo: true,
    proveedorNombre: 'Mariachi Imperial Real',
    proveedorGremio: 'musica',
  },

  // 2. SONORIZACIÓN & AUDIO PROFESIONAL
  {
    codigo: 'SND-CER-01',
    fase: 'ceremonia',
    capitulo: 'Sonorización',
    nombre: 'Pack Sonorización Ceremonia Civil S-Class',
    unidad: 'pa',
    precioCéntimos: 25000, // 250,00 €
    descripcion: 'Columna activa Bose S1 Pro / Compact, 2 micrófonos inalámbricos Shure Beta 87A para oficiante y lecturas, mesa digital y técnico operador',
    margenObjetivoPct: 35,
    proveedorVerificado: true,
    activo: true,
  },
  {
    codigo: 'SND-COC-01',
    fase: 'coctel',
    capitulo: 'Sonorización',
    nombre: 'Sonorización y Música Ambiental Cóctel',
    unidad: 'pa',
    precioCéntimos: 20000, // 200,00 €
    descripcion: 'Sistema de audio autónomo con cobertura 360°, playlist coordinada y soporte para directos',
    margenObjetivoPct: 35,
    proveedorVerificado: true,
    activo: true,
  },
  {
    codigo: 'SND-BAN-01',
    fase: 'banquete',
    capitulo: 'Sonorización',
    nombre: 'Megafonía & Hilo Musical Banquete / Entrada Nupcial',
    unidad: 'pa',
    precioCéntimos: 18000, // 180,00 €
    descripcion: 'Microfonía inalámbrica para discursos de invitados y coordinación de canciones clave de entrada de platos y corte de tarta',
    margenObjetivoPct: 35,
    proveedorVerificado: true,
    activo: true,
  },
  {
    codigo: 'SND-DIS-01',
    fase: 'fiesta',
    capitulo: 'Sonorización',
    nombre: 'Pack Barra Libre S-Class (4 Horas)',
    unidad: 'pa',
    precioCéntimos: 65000, // 650,00 €
    descripcion: 'Sistema de sonido Bose F1 Model 812 (1.000W) + Subwoofer, cabina Pioneer DJ, puente de iluminación LED DMX y DJ profesional residente 4h',
    margenObjetivoPct: 30,
    proveedorVerificado: true,
    activo: true,
  },
  {
    codigo: 'SND-HRX-01',
    fase: 'fiesta',
    capitulo: 'Sonorización',
    nombre: 'Hora Extra de Barra Libre y DJ',
    unidad: 'h',
    precioCéntimos: 12000, // 120,00 €
    descripcion: 'Ampliación de fiesta con DJ y sistema de sonido activo por hora adicional',
    margenObjetivoPct: 35,
    proveedorVerificado: true,
    activo: true,
  },

  // 3. ILUMINACIÓN & AMBIENTACIÓN
  {
    codigo: 'ILU-PER-01',
    fase: 'iluminacion',
    capitulo: 'Iluminación',
    nombre: 'Pack Iluminación Perimetral Wireless (12 Focos LED RGBW)',
    unidad: 'pa',
    precioCéntimos: 28000, // 280,00 €
    descripcion: 'Bañadores de pared inalámbricos a batería para realce de arquitectura de fincas y bodegas',
    margenObjetivoPct: 40,
    proveedorVerificado: true,
    activo: true,
  },
  {
    codigo: 'ILU-GIR-01',
    fase: 'iluminacion',
    capitulo: 'Iluminación',
    nombre: 'Cabezas Móviles Beam / Wash (Pareja Programada)',
    unidad: 'pa',
    precioCéntimos: 18000, // 180,00 €
    descripcion: 'Efectos de iluminación dinámica programada para pista de baile',
    margenObjetivoPct: 35,
    proveedorVerificado: true,
    activo: true,
  },

  // 4. EFECTOS ESPECIALES & SHOWS
  {
    codigo: 'EFE-CHI-01',
    fase: 'baile',
    capitulo: 'Efectos',
    nombre: 'Chispas Frías Cold Spark (2 Cabezas)',
    unidad: 'pa',
    precioCéntimos: 22000, // 220,00 €
    descripcion: 'Fuego frío no pirotécnico, 100% seguro para interiores y fincas para entrada o baile nupcial',
    margenObjetivoPct: 45,
    proveedorVerificado: true,
    activo: true,
  },
  {
    codigo: 'EFE-HUM-01',
    fase: 'baile',
    capitulo: 'Efectos',
    nombre: 'Humo Denso Bajo (Baile en las Nubes)',
    unidad: 'pa',
    precioCéntimos: 18000, // 180,00 €
    descripcion: 'Generador de humo rasante criogénico para primer baile de novios',
    margenObjetivoPct: 40,
    proveedorVerificado: true,
    activo: true,
  },

  // 5. FINCAS & ESPACIOS (Cobertura con las 9.559 fincas de la base de datos)
  {
    codigo: 'FIN-ESP-01',
    fase: 'banquete',
    capitulo: 'Fincas',
    nombre: 'Alquiler Íntegro de Finca / Espacio Nupcial S-Class',
    unidad: 'pa',
    precioCéntimos: 250000, // 2.500,00 €
    margenObjetivoPct: 15,
    descripcion: 'Exclusividad de la finca por el día entero, jardines de ceremonia, salón climatizado, suite nupcial y parking vigilado',
    proveedorVerificado: true,
    activo: true,
    proveedorNombre: 'La Quinta de Jarama',
    proveedorGremio: 'finca',
    detallesTecnicos: {
      capacidadMaxPax: 400,
      exclusividadDia: true,
      horaLimite: '05:30 AM',
      cocinaPropia: true,
    },
  },

  // 6. CATERING & GASTRONOMÍA (Cobertura con los 4.096 caterings de la base de datos)
  {
    codigo: 'CAT-MEN-01',
    fase: 'banquete',
    capitulo: 'Catering',
    nombre: 'Menú Banquete Nupcial Alta Gastronomía (por persona)',
    unidad: 'pax',
    precioCéntimos: 13500, // 135,00 € por pax
    margenObjetivoPct: 15,
    descripcion: 'Cóctel 18 aperitivos gourmet + Entrante de marisco + Principal de carne con guarnición + Prepostre + Postre nupcial + Bodega D.O. seleccionada',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'catering',
    detallesTecnicos: {
      horasBarraLibre: 3,
      menuAdaptadoCeliacos: true,
      pruebaMenuIncluida: true,
    },
  },
  {
    codigo: 'CAT-JAM-01',
    fase: 'coctel',
    capitulo: 'Catering',
    nombre: 'Cortador Profesional de Jamón Ibérico & Venenciador',
    unidad: 'pa',
    precioCéntimos: 38000, // 380,00 €
    margenObjetivoPct: 25,
    descripcion: 'Cortador maestro uniformado con jamonero profesional, mesa de corte decorada y servicio en directo durante el cóctel',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'catering',
  },
  {
    codigo: 'CAT-REC-01',
    fase: 'fiesta',
    capitulo: 'Catering',
    nombre: 'Estación de Recena Gourmet (Mini Burgers & Churros con Chocolate)',
    unidad: 'pa',
    precioCéntimos: 45000, // 450,00 €
    margenObjetivoPct: 25,
    descripcion: 'Puesto buffet caliente durante la fiesta con mini hamburguesitas brioche y churritos recién hechos con chocolate a la taza',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'catering',
  },

  // 7. FOTOGRAFÍA & VÍDEO (Cobertura con los 35.153 fotógrafos de la base de datos)
  {
    codigo: 'FOT-REP-01',
    fase: 'banquete',
    capitulo: 'Fotografía',
    nombre: 'Reportaje Fotográfico Completo + USB Madera de Lujo & Galería HD',
    unidad: 'pa',
    precioCéntimos: 145000, // 1.450,00 €
    margenObjetivoPct: 20,
    descripcion: 'Cobertura íntegra de la jornada por 2 fotógrafos profesionales (preparativos novios hasta 2 horas de barra libre) con entrega de todas las fotos en alta resolución',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'foto',
    detallesTecnicos: {
      numeroFotografos: 2,
      plazoEntregaDias: 30,
      teaserRedes7Dias: true,
    },
  },
  {
    codigo: 'FOT-VID-01',
    fase: 'baile',
    capitulo: 'Fotografía',
    nombre: 'Película Documental de Boda + Dron Cinematográfico AESA 4K',
    unidad: 'pa',
    precioCéntimos: 125000, // 1.250,00 €
    margenObjetivoPct: 20,
    descripcion: 'Videógrafo dedicado con tomas aéreas autorizadas de dron, teaser cinematográfico de 1 minuto y película documental de 20 minutos con sonido directo masterizado',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'foto',
    detallesTecnicos: {
      resolucion: '4K',
      pilotoDronAesa: true,
    },
  },
  {
    codigo: 'FOT-ALB-01',
    fase: 'banquete',
    capitulo: 'Fotografía',
    nombre: 'Álbum Digital Nupcial Encuadernado en Lino Artesanal (30x30 cm)',
    unidad: 'pa',
    precioCéntimos: 45000, // 450,00 €
    margenObjetivoPct: 30,
    descripcion: 'Álbum de 60 páginas en papel fotográfico antihuellas, tapas en lino o piel y grabado de nombres novios + 2 réplicas para padres',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'foto',
  },

  // 8. DECORACIÓN & FLORES (Cobertura con las 1.650 empresas de la base de datos)
  {
    codigo: 'DEC-ARC-01',
    fase: 'ceremonia',
    capitulo: 'Decoración',
    nombre: 'Arco Floral Ceremonia Civil & Estructura con Flores de Temporada',
    unidad: 'pa',
    precioCéntimos: 55000, // 550,00 €
    margenObjetivoPct: 30,
    descripcion: 'Estructura circular o hexagonal vestida con flores frescas de temporada, verdes eucalipto, alfombra y pasillo con centros florales',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'decoracion',
  },
  {
    codigo: 'DEC-CEN-01',
    fase: 'banquete',
    capitulo: 'Decoración',
    nombre: 'Pack 12 Centros de Mesa Florales y Velas de Cristal',
    unidad: 'pa',
    precioCéntimos: 65000, // 650,00 €
    margenObjetivoPct: 30,
    descripcion: 'Composiciones florales bajas o suspendidas para mesas de comensales con candelabros de cristal y velas aromáticas',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'decoracion',
  },
  {
    codigo: 'DEC-RAM-01',
    fase: 'ceremonia',
    capitulo: 'Decoración',
    nombre: 'Ramo de Novia Personalizado + 2 Prendidos de Solapa Padrino/Novio',
    unidad: 'pa',
    precioCéntimos: 18000, // 180,00 €
    margenObjetivoPct: 35,
    descripcion: 'Ramo a medida con flores preservadas o naturales de diseño exclusivo entregado en el domicilio de la novia',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'decoracion',
  },
  {
    codigo: 'DEC-SEA-01',
    fase: 'coctel',
    capitulo: 'Decoración',
    nombre: 'Seating Plan & Rincón de Bienvenida Personalizado',
    unidad: 'pa',
    precioCéntimos: 28000, // 280,00 €
    margenObjetivoPct: 35,
    descripcion: 'Cartel de bienvenida de madera con caligrafía artesanal, soporte de forja y seating plan tematizado con la lista de invitados y mesas',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'decoracion',
  },

  // 9. TRANSPORTE & FLOTA (Cobertura con las 1.961 empresas de la base de datos)
  {
    codigo: 'TRA-BUS-01',
    fase: 'logistica',
    capitulo: 'Transporte',
    nombre: 'Autocar 55 Plazas (Ida desde Centro + 2 Horarios de Regreso)',
    unidad: 'pa',
    precioCéntimos: 65000, // 650,00 €
    margenObjetivoPct: 20,
    descripcion: 'Servicio de autocar de lujo para invitados con salida céntrica, espera durante la boda y dos regresos escalonados nocturnos (03:30h y 05:30h)',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'transporte',
    detallesTecnicos: {
      plazas: 55,
      regresosNocturnos: 2,
    },
  },
  {
    codigo: 'TRA-NOV-01',
    fase: 'ceremonia',
    capitulo: 'Transporte',
    nombre: 'Vehículo Clásico de Novios con Chófer de Gala (3 Horas)',
    unidad: 'pa',
    precioCéntimos: 45000, // 450,00 €
    margenObjetivoPct: 25,
    descripcion: 'Automóvil de época restaurado con chófer uniformado, decoración floral en manillas y botella de cava para el traslado nupcial',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'transporte',
  },

  // 10. WEDDING PLANNING & COORDINACIÓN (Cobertura con las 1.011 agencias en BBDD)
  {
    codigo: 'WED-COO-01',
    fase: 'ceremonia',
    capitulo: 'Wedding_Planning',
    nombre: 'Coordinación Integral y Control Minutado Día B (2 Coordinadores in situ)',
    unidad: 'pa',
    precioCéntimos: 85000, // 850,00 €
    margenObjetivoPct: 25,
    descripcion: 'Supervisión presencial del montaje, coordinación de todos los proveedores externos, recepción de invitados y resolución de contingencias de principio a fin',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'wedding',
    detallesTecnicos: {
      coordinadoresInSitu: 2,
      minutadoMinutoAMinuto: true,
    },
  },

  // 11. ANIMACIÓN & GUARDERÍA (Cobertura con las 8.617 empresas de servicios en BBDD)
  {
    codigo: 'ANI-FOT-01',
    fase: 'fiesta',
    capitulo: 'Servicios',
    nombre: 'Plataforma 360 Video Booth con Descarga Inmediata y Atrezzo (3h)',
    unidad: 'pa',
    precioCéntimos: 42000, // 420,00 €
    margenObjetivoPct: 35,
    descripcion: 'Plataforma giratoria para vídeos en cámara lenta con efectos personalizados, pistolas de burbujas, atrezzo divertido y código QR para descarga en el móvil',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'servicios',
  },
  {
    codigo: 'ANI-KID-01',
    fase: 'banquete',
    capitulo: 'Servicios',
    nombre: 'Monitora Infantil Titulada con Juegos y Cena Asistida de Niños (4h)',
    unidad: 'pa',
    precioCéntimos: 22000, // 220,00 €
    margenObjetivoPct: 30,
    descripcion: 'Cuidado y entretenimiento de los niños durante el banquete, dinamización con talleres, pintacaras y supervisión durante la comida',
    proveedorVerificado: true,
    activo: true,
    proveedorGremio: 'servicios',
  },

  // 12. LOGÍSTICA & DESPLAZAMIENTO S-CLASS
  {
    codigo: 'LOG-KM-01',
    fase: 'logistica',
    capitulo: 'Logística',
    nombre: 'Kilometraje Operativo (a partir de 50 km desde Méntrida)',
    unidad: 'km',
    precioCéntimos: 150, // 1,50 € por km (Regla inmutable)
    descripcion: 'Desplazamiento técnico y de flota de transporte para montaje y desmontaje',
    margenObjetivoPct: 20,
    proveedorVerificado: true,
    activo: true,
  },
  {
    codigo: 'LOG-HOT-01',
    fase: 'logistica',
    capitulo: 'Logística',
    nombre: 'Suplemento Alojamiento Técnico / Artístico',
    unidad: 'ud',
    precioCéntimos: 12000, // 120,00 € (Regla inmutable si fin >= 3:00 AM o >200 km)
    descripcion: 'Alojamiento en hotel para equipo técnico cuando la operativa finaliza de madrugada o a larga distancia',
    margenObjetivoPct: 0,
    proveedorVerificado: true,
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

  // 2. Coincidencia por palabras clave
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
  if (norm.includes('banquete') || norm.includes('cena') || norm.includes('comida') || norm.includes('megafonia') || norm.includes('megafonía')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'SND-BAN-01') || null;
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

  // Coincidencias de Finca, Catering, Foto, Flores, Transporte y Servicios
  if (norm.includes('alquiler') || norm.includes('finca') || norm.includes('espacio')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'FIN-ESP-01') || null;
  }
  if (norm.includes('menu') || norm.includes('menú') || norm.includes('catering') || norm.includes('comensal') || norm.includes('pax')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'CAT-MEN-01') || null;
  }
  if (norm.includes('jamon') || norm.includes('jamón') || norm.includes('cortador')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'CAT-JAM-01') || null;
  }
  if (norm.includes('recena') || norm.includes('burguer') || norm.includes('churros')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'CAT-REC-01') || null;
  }
  if (norm.includes('fotograf') || norm.includes('fotos') || norm.includes('reportaje')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'FOT-REP-01') || null;
  }
  if (norm.includes('video') || norm.includes('vídeo') || norm.includes('dron') || norm.includes('drone')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'FOT-VID-01') || null;
  }
  if (norm.includes('album') || norm.includes('álbum')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'FOT-ALB-01') || null;
  }
  if (norm.includes('arco floral') || (norm.includes('arco') && norm.includes('ceremonia'))) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'DEC-ARC-01') || null;
  }
  if (norm.includes('centros de mesa') || (norm.includes('centro') && norm.includes('mesa'))) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'DEC-CEN-01') || null;
  }
  if (norm.includes('ramo') || norm.includes('prendido')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'DEC-RAM-01') || null;
  }
  if (norm.includes('seating') || norm.includes('bienvenida')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'DEC-SEA-01') || null;
  }
  if (norm.includes('autobus') || norm.includes('autobús') || norm.includes('autocar') || norm.includes('bus')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'TRA-BUS-01') || null;
  }
  if (norm.includes('coche') || norm.includes('vehiculo') || norm.includes('chofer') || norm.includes('chófer')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'TRA-NOV-01') || null;
  }
  if (norm.includes('planner') || norm.includes('coordinador') || norm.includes('coordinacion') || norm.includes('coordinación') || norm.includes('dia b')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'WED-COO-01') || null;
  }
  if (norm.includes('360') || norm.includes('fotomaton') || norm.includes('fotomatón')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ANI-FOT-01') || null;
  }
  if (norm.includes('animacion infantil') || norm.includes('ninos') || norm.includes('niños') || norm.includes('monitora')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'ANI-KID-01') || null;
  }

  if (norm.includes('km') || norm.includes('kilometraje') || norm.includes('desplazamiento')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'LOG-KM-01') || null;
  }
  if (norm.includes('hotel') || norm.includes('alojamiento')) {
    return BANCO_PRECIOS_EAR.find(p => p.codigo === 'LOG-HOT-01') || null;
  }

  return null;
}

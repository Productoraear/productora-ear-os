/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🏛️ MATRIZ MAESTRA DE CATEGORÍAS Y SUBCATEGORÍAS 360° (ESTÁNDAR BODAS.NET + HORIZONX)
 * ════════════════════════════════════════════════════════════════════════════
 * Cobertura de todas las verticales de eventos, bodas, fiestas y conciertos.
 * Integra validación asistida por IA para evitar información ficticia o incompleta.
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface SovereignSubcategory {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly requiredAttributes: readonly string[]; // Lo que la IA exige para validar la subcategoría
  readonly description: string;
}

export interface SovereignMasterCategory {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly accent: string;
  readonly description: string;
  readonly subcategories: readonly SovereignSubcategory[];
}

export const SOVEREIGN_MASTER_TAXONOMY: readonly SovereignMasterCategory[] = Object.freeze([
  {
    id: 'fincas-espacios',
    name: 'Lugares para Boda & Espacios Singulares',
    icon: 'castle',
    accent: '#34D399',
    description: 'Fincas rústicas, palacios, hoteles con encanto, masías y espacios al aire libre.',
    subcategories: [
      {
        id: 'finca-rustica',
        name: 'Fincas Rústicas & Dehesas',
        slug: 'fincas-rusticas',
        requiredAttributes: ['aforoMaximo', 'planBClimatizado', 'licenciaAcustica', 'horarioCierre'],
        description: 'Fincas en plena naturaleza con espacios amplios y zona de ceremonia exterior.',
      },
      {
        id: 'palacios-castillos',
        name: 'Palacetes, Castillos & Monumentos',
        slug: 'palacios-castillos',
        requiredAttributes: ['aforoMaximo', 'protocoloMonumento', 'seguroRC'],
        description: 'Edificaciones históricas con arquitectura señorial y protocolo de alta gama.',
      },
      {
        id: 'masias-cortijos',
        name: 'Masías, Pazos & Cortijos',
        slug: 'masias-cortijos',
        requiredAttributes: ['aforoMaximo', 'alojamientoInvitados', 'cocinaPropia'],
        description: 'Casas solariegas y de labranza tradicionales con salones interiores y patios.',
      },
      {
        id: 'hoteles-bodas',
        name: 'Hoteles para Bodas & Resorts',
        slug: 'hoteles-bodas',
        requiredAttributes: ['habitacionesBloqueadas', 'suiteNupcial', 'parkingPax'],
        description: 'Complejos hoteleros con todo incluido para alojamiento y banquete.',
      },
      {
        id: 'restaurantes-bodas',
        name: 'Restaurantes con Salón Nupcial',
        slug: 'restaurantes-bodas',
        requiredAttributes: ['precioMenuDesde', 'barraLibreIncluida', 'exclusividadEspacio'],
        description: 'Restaurantes gastronómicos con jardín o salones dedicados para bodas.',
      },
      {
        id: 'bodegas-fincas',
        name: 'Bodegas & Viñedos',
        slug: 'bodegas-fincas',
        requiredAttributes: ['visitaBodega', 'cataIncluida', 'aforoComedor'],
        description: 'Espacios enológicos singulares entre viñedos y barricas.',
      },
    ],
  },
  {
    id: 'catering-gastronomia',
    name: 'Catering, Banquetes & Brasas',
    icon: 'utensils',
    accent: '#F97316',
    description: 'Alta cocina, parrillas en vivo, showcooking y barras libres de autor.',
    subcategories: [
      {
        id: 'catering-gala',
        name: 'Catering de Gala & Alta Cocina',
        slug: 'catering-gala',
        requiredAttributes: ['precioMenuMin', 'ratioCamarerosPax', 'vajillaIncluida', 'pruebaMenu'],
        description: 'Menús emplatados con técnica vanguardista y servicio de sala impecable.',
      },
      {
        id: 'asadores-brasas',
        name: 'Asadores de Brasa & Parrillas en Directo',
        slug: 'asadores-brasas',
        requiredAttributes: ['tipoLenaCarbon', 'corteCarne', 'equipamientoExtraccion'],
        description: 'Carnes a la brasa, cochinillos, corderos y showcooking de parrilla.',
      },
      {
        id: 'cortadores-jamon',
        name: 'Cortadores Profesionales de Jamón',
        slug: 'cortadores-jamon',
        requiredAttributes: ['denominacionOrigen', 'piezasPorPax', 'soporteJamonero'],
        description: 'Maestros cortadores con jamón 100% ibérico de bellota cortado al momento.',
      },
      {
        id: 'cocteleria-barras',
        name: 'Barras Móviles de Coctelería & Gin-Bars',
        slug: 'cocteleria-barras',
        requiredAttributes: ['marcasPremium', 'bartenderTitulado', 'hieloCristalino'],
        description: 'Coctelería acrobática, destilados premium y mocktails sin alcohol.',
      },
      {
        id: 'food-trucks',
        name: 'Food Trucks & Puestos Gourmet',
        slug: 'food-trucks',
        requiredAttributes: ['potenciaElectricaKw', 'registroSanitario', 'dimensionesVehiculo'],
        description: 'Caravanas vintage con hamburguesas gourmet, crepes, pizzas al horno o tacos.',
      },
      {
        id: 'mesas-dulces',
        name: 'Candy Bar, Mesas Dulces & Tartas Nupciales',
        slug: 'mesas-dulces',
        requiredAttributes: ['opcionesCeliacos', 'refrigeracion', 'decoracionTematica'],
        description: 'Repostería creativa, fuentes de chocolate y tartas de diseño.',
      },
    ],
  },
  {
    id: 'musica-artistas',
    name: 'Música en Directo & Animación Sonora',
    icon: 'music',
    accent: '#ecb613',
    description: 'Solistas de gala, mariachis, ensambles de cuerda, bandas y DJs profesionales.',
    subcategories: [
      {
        id: 'solistas-liricos',
        name: 'Tenores & Solistas Líricos / Gala',
        slug: 'solistas-liricos',
        requiredAttributes: ['repertorioFormal', 'formatoAcustico', 'riderSonidoMinimo', 'duracionPase'],
        description: 'Voz solista de ópera, boleros y temas icónicos de gala (Edwin Agudelo).',
      },
      {
        id: 'mariachis-gala',
        name: 'Mariachis de Élite & Show Imperial',
        slug: 'mariachis-gala',
        requiredAttributes: ['numeroIntegrantes', 'trajeCharroGala', 'tiempoActuacionMin'],
        description: 'Auténtica música mexicana con trompetas, violines y voces de conservatorio.',
      },
      {
        id: 'djs-bodas',
        name: 'DJs Especialistas en Bodas & Fiestas',
        slug: 'djs-bodas',
        requiredAttributes: ['mesaMezcla', 'microfoniaInalambrica', 'sistemaCabinaDJ'],
        description: 'Sesiones personalizadas de música comercial, Remember, Pop y electrónica.',
      },
      {
        id: 'cuartetos-cuerda',
        name: 'Cuartetos & Tríos de Cuerda Clásica',
        slug: 'cuartetos-cuerda',
        requiredAttributes: ['instrumentacion', 'partiturasCeremonia', 'necesidadSillasSinBrazo'],
        description: 'Violines, viola y violonchelo para ceremonias religiosas y civiles elegantes.',
      },
      {
        id: 'bandas-versiones',
        name: 'Bandas de Pop/Rock & Grupos de Versiones',
        slug: 'bandas-versiones',
        requiredAttributes: ['potenciaPaRequerida', 'tiempoMontajeMin', 'riderBateria'],
        description: 'Música de los 80, 90 y éxitos actuales en vivo para la barra libre.',
      },
      {
        id: 'saxo-violin-dj',
        name: 'Saxofonistas & Violinistas Eléctricos para Cóctel',
        slug: 'saxo-violin-dj',
        requiredAttributes: ['emisorInalambrico', 'pedestal', 'basesElectronicas'],
        description: 'Performers con movilidad total entre los invitados y sonido envolvente.',
      },
      {
        id: 'flamenco-gipsy',
        name: 'Grupos Flamencos, Rumbas & Coros Rocieros',
        slug: 'flamenco-gipsy',
        requiredAttributes: ['numeroArtistas', 'tarimaBaile', 'microfoniaCajaGuitarra'],
        description: 'Alegría flamenca, rumbas para bailar y sentimiento rociero.',
      },
    ],
  },
  {
    id: 'tecnica-audiovisual',
    name: 'Sonido, Iluminación & Pantallas LED',
    icon: 'tv',
    accent: '#00E5FF',
    description: 'Equipamiento técnico homologado bajo la Ley 37/2003 y microfonía de emisión.',
    subcategories: [
      {
        id: 'sonorizacion-bose',
        name: 'Sistemas Line Array & Sonorización (12 W/pax)',
        slug: 'sonorizacion-bose',
        requiredAttributes: ['potenciaRmsWatts', 'homologacionDb', 'tecnicoSonidoPresencial'],
        description: 'Equipos Bose F1, L-Acoustics y columnas colineares con cobertura balanceada.',
      },
      {
        id: 'pantallas-led-p2',
        name: 'Pantallas LED Gigantes Novastar P2.6 / P2.9',
        slug: 'pantallas-led-p2',
        requiredAttributes: ['resolucionNativa', 'brilloNits', 'estructuraTrussAluminio'],
        description: 'Pantallas modulares de alta definición para vídeos, directos y presentaciones.',
      },
      {
        id: 'iluminacion-dmx',
        name: 'Iluminación Escénica, Robótica & Bañadores LED',
        slug: 'iluminacion-dmx',
        requiredAttributes: ['cabezasMoviles', 'focosBateriaInalambricos', 'controladorDmx'],
        description: 'Atmósferas cálidas, focos de batería para árboles y efectos sincronizados.',
      },
      {
        id: 'microfonia-shure',
        name: 'Microfonía Digital RF de Grado Emisión',
        slug: 'microfonia-shure',
        requiredAttributes: ['bandaFrecuenciaLegal', 'antenasDireccionales', 'capsulaCondensador'],
        description: 'Sistemas Shure Axient / QLX-D con cero interferencias y cero acoples.',
      },
    ],
  },
  {
    id: 'fotografia-video',
    name: 'Fotografía & Cinematografía Nupcial',
    icon: 'camera',
    accent: '#FB7185',
    description: 'Reportajes fotográficos, teaser cinematográfico 4K, drones y álbumes de alta gama.',
    subcategories: [
      {
        id: 'fotografia-editorial',
        name: 'Fotografía Editorial & Documental de Boda',
        slug: 'fotografia-editorial',
        requiredAttributes: ['numeroFotografos', 'entregaFotosEditadas', 'galeriaOnlinePrivada'],
        description: 'Mirada natural y sin posados forzados, capturando la emoción real del día.',
      },
      {
        id: 'video-cine-4k',
        name: 'Cinematografía Nupcial 4K & Teaser Emocional',
        slug: 'video-cine-4k',
        requiredAttributes: ['grabacion4k', 'pilotoDronCertificado', 'duracionPeliculaMin'],
        description: 'Películas de boda con calidad cinematográfica, planos aéreos y audio nítido.',
      },
      {
        id: 'drones-aereos',
        name: 'Grabación con Dron Homologada AESA',
        slug: 'drones-aereos',
        requiredAttributes: ['licenciaAesa', 'seguroAeronautico', 'coordinacionEspacioAereo'],
        description: 'Vistas panorámicas espectaculares de la finca y la llegada de los novios.',
      },
    ],
  },
  {
    id: 'transporte-logistica',
    name: 'Transporte, Autobuses & Coches Clásicos',
    icon: 'car',
    accent: '#94A3B8',
    description: 'Autobuses de invitados (55 pax), limusinas, coches clásicos y transfer privado.',
    subcategories: [
      {
        id: 'autobuses-invitados',
        name: 'Autobuses & Minibuses para Invitados (15 a 55 pax)',
        slug: 'autobuses-invitados',
        requiredAttributes: ['plazasHomologadas', 'horariosRetornoFlexibles', 'tarjetaTransportes'],
        description: 'Traslado seguro de invitados desde el hotel o ciudad a la finca y regreso.',
      },
      {
        id: 'coches-clasicos-epoca',
        name: 'Coches Clásicos de Época con Chófer',
        slug: 'coches-clasicos-epoca',
        requiredAttributes: ['marcaModeloAno', 'choferUniformado', 'adornoFloralCoche'],
        description: 'Rolls Royce, Jaguar, Seat 600 o descapotables clásicos para la llegada nupcial.',
      },
      {
        id: 'coches-alta-gama',
        name: 'Vehículos de Lujo Modernos & Deportivos',
        slug: 'coches-alta-gama',
        requiredAttributes: ['gamaVehiculo', 'seguroTodoRiesgoSinFranquicia'],
        description: 'Mercedes Clase S, Tesla o Porsche con el máximo confort para los novios.',
      },
    ],
  },
  {
    id: 'decoracion-flores',
    name: 'Decoración, Floristería & Escenografía',
    icon: 'flower',
    accent: '#FBBF24',
    description: 'Diseño floral, arcos de ceremonia, centros de mesa y mobiliario chill-out.',
    subcategories: [
      {
        id: 'arcos-ceremonia',
        name: 'Arcos Florales & Altar Ceremonial',
        slug: 'arcos-ceremonia',
        requiredAttributes: ['estructuraMaderaMetal', 'floresPreservadasNaturales'],
        description: 'Estructuras florales personalizadas para el momento del "Sí, quiero".',
      },
      {
        id: 'centros-mesa',
        name: 'Centros de Mesa & Papelería de Banquete',
        slug: 'centros-mesa',
        requiredAttributes: ['minutasIncluidas', 'seatingPlan', 'velasHomologadas'],
        description: 'Composiciones florales bajas o altas y decoración integral de las mesas.',
      },
      {
        id: 'guirnaldas-luces',
        name: 'Cielos de Micro-Bombillas & Guirnaldas Festoon',
        slug: 'guirnaldas-luces',
        requiredAttributes: ['metrosLineales', 'temperaturaColorKelvin', 'certificacionExterior'],
        description: 'Techos de luz cálida estilo verbena de lujo sobre las mesas al aire libre.',
      },
    ],
  },
  {
    id: 'coordinacion-planners',
    name: 'Wedding Planners & Coordinación Integral',
    icon: 'heart',
    accent: '#F5C538',
    description: 'Dirección del evento, gestión de tiempos, protocolo y asesoramiento 360°.',
    subcategories: [
      {
        id: 'coordinacion-dia-boda',
        name: 'Coordinación Exclusiva del Día del Evento',
        slug: 'coordinacion-dia-boda',
        requiredAttributes: ['horasPresenciaDia', 'equipoAsistentes', 'escaletaTiempos'],
        description: 'Recepción de proveedores, control de música y resolución de imprevistos.',
      },
      {
        id: 'organizacion-integral-360',
        name: 'Organización Integral desde Cero (360°)',
        slug: 'organizacion-integral-360',
        requiredAttributes: ['gestionPresupuesto', 'negociacionProveedores', 'disenoVisual3d'],
        description: 'Acompañamiento desde la elección de fecha hasta el último baile.',
      },
      {
        id: 'oficiantes-ceremonia',
        name: 'Maestros de Ceremonia & Oficiantes Simbólicos',
        slug: 'oficiantes-ceremonia',
        requiredAttributes: ['guionPersonalizado', 'idiomasOficiante', 'ritoSimbolico'],
        description: 'Narrativa emotiva de la historia de los novios con discursos memorables.',
      },
    ],
  },
  {
    id: 'animacion-experiencias',
    name: 'Fotomatón 360°, Animación & Efectos',
    icon: 'sparkles',
    accent: '#A855F7',
    description: 'Plataformas 360°, fotomatones con atrezo, fuego frío, humo denso y animadores.',
    subcategories: [
      {
        id: 'plataforma-video-360',
        name: 'Plataforma Giratoria de Vídeo 360° Slow-Motion',
        slug: 'plataforma-video-360',
        requiredAttributes: ['capacidadPersonasPlataforma', 'descargaQrInmediata', 'atrezoGama'],
        description: 'Vídeos giratorios en alta velocidad con efectos de música y descarga al móvil.',
      },
      {
        id: 'fotomaton-espejo',
        name: 'Fotomatón Clásico & Espejo Mágico con Fotos Ilimitadas',
        slug: 'fotomaton-espejo',
        requiredAttributes: ['fotosImpresasIlimitadas', 'albumFirmasIncluido', 'impresionTermica'],
        description: 'Fotos impresas al instante en tiras con dedicatorias en el álbum de firmas.',
      },
      {
        id: 'efectos-fuego-frio',
        name: 'Fuegos Artificiales Fríos (Sparkular) & Humo Bajo',
        slug: 'efectos-fuego-frio',
        requiredAttributes: ['certificacionUsoInterior', 'humoSecoSinOlor', 'disparoDmx'],
        description: 'Chispas frías no pirotécnicas sin peligro de quemadura para el baile nupcial.',
      },
      {
        id: 'animacion-infantil',
        name: 'Monitores Infantiles, Juegos & Castillos Hinchables',
        slug: 'animacion-infantil',
        requiredAttributes: ['ratioNinosMonitor', 'seguroHinchable', 'titulacionOcioTiempoLibre'],
        description: 'Cuidado y entretenimiento de los más pequeños durante la comida y fiesta.',
      },
    ],
  },
  {
    id: 'moda-belleza',
    name: 'Moda Nupcial, Trajes & Belleza',
    icon: 'shirt',
    accent: '#E7C6A5',
    description: 'Vestidos de novia, sastrería a medida, peluquería y maquillaje profesional.',
    subcategories: [
      {
        id: 'vestidos-novia-autor',
        name: 'Vestidos de Novia & Alta Costura',
        slug: 'vestidos-novia-autor',
        requiredAttributes: ['pruebasAjusteIncluidas', 'tejidosProcedencia'],
        description: 'Diseños exclusivos confeccionados con las mejores sedas y encajes.',
      },
      {
        id: 'trajes-novio-medida',
        name: 'Sastrería de Novio a Medida & Chaqués',
        slug: 'trajes-novio-medida',
        requiredAttributes: ['confeccionArtesanal', 'chalecosComplementos'],
        description: 'Trajes de etiqueta, smokings y chaqués con corte impecable.',
      },
      {
        id: 'maquillaje-peluqueria',
        name: 'Make-Up & Peluquería Nupcial a Domicilio',
        slug: 'maquillaje-peluqueria',
        requiredAttributes: ['pruebaPreviaIncluida', 'productosResistentesAgua', 'desplazamientoFinca'],
        description: 'Estilismo integral para la novia y madrinas el día del enlace.',
      },
    ],
  },
]);

/**
 * Centinela de Validación Asistida por IA:
 * Analiza los datos que el proveedor introduce para evitar campos vacíos o ficticios.
 */
export function auditProviderDataIntegrity(
  subcategoryId: string,
  providedFields: Record<string, unknown>
): {
  isValid: boolean;
  missingAttributes: string[];
  recommendations: string[];
} {
  let subcat: SovereignSubcategory | undefined;

  for (const cat of SOVEREIGN_MASTER_TAXONOMY) {
    const found = cat.subcategories.find((s) => s.id === subcategoryId || s.slug === subcategoryId);
    if (found) {
      subcat = found;
      break;
    }
  }

  if (!subcat) {
    return {
      isValid: false,
      missingAttributes: ['subcategoria_no_reconocida'],
      recommendations: ['Selecciona una subcategoría válida de la Matriz Maestra de Productora EAR.'],
    };
  }

  const missing: string[] = [];
  const recs: string[] = [];

  for (const attr of subcat.requiredAttributes) {
    const val = providedFields[attr];
    if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
      missing.push(attr);
      recs.push(`El campo obligatorio "${attr}" es indispensable para que el Agente 24/7 responda a los clientes.`);
    }
  }

  return {
    isValid: missing.length === 0,
    missingAttributes: missing,
    recommendations: recs,
  };
}


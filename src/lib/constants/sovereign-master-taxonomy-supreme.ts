/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🏛️ MATRIZ SUPREMA DE CATEGORÍAS & SUBCATEGORÍAS 360° (PRODUCCIÓN REAL EAR OS)
 * ════════════════════════════════════════════════════════════════════════════
 * Cobertura de las 13.094 entidades reales indexadas en disco y anticipación
 * completa de todos los gremios artísticos, técnicos y de servicios para eventos.
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface SovereignMasterCategory {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly accent: string;
  readonly description: string;
  readonly subcategories: readonly {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly description: string;
    readonly requiredAttributes: readonly string[];
  }[];
}

export const SOVEREIGN_TOTAL_PUBLISHABLE_PROVIDERS = 13094;

export const SOVEREIGN_MASTER_TAXONOMY_SUPREME: readonly SovereignMasterCategory[] = Object.freeze([
  // 1. ESPACIOS & FINCAS
  {
    id: 'fincas-espacios',
    name: 'Lugares para Boda, Fincas & Espacios Singulares',
    icon: 'castle',
    accent: '#34D399',
    description: 'Espacios de celebración con licencia, aforo y plan B climatizado.',
    subcategories: [
      { id: 'fincas-rusticas', name: 'Fincas Rústicas & Dehesas', slug: 'fincas-rusticas', description: 'Grandes extensiones al aire libre.', requiredAttributes: ['aforoMaximo', 'planBClimatizado', 'licenciaAcustica'] },
      { id: 'palacios-castillos', name: 'Palacetes, Castillos & Monumentos', slug: 'palacios-castillos', description: 'Edificios señoriales e históricos protegidos.', requiredAttributes: ['aforoMaximo', 'protocoloMonumento', 'seguroRC'] },
      { id: 'masias-cortijos', name: 'Masías, Pazos & Cortijos', slug: 'masias-cortijos', description: 'Construcciones tradicionales de campo.', requiredAttributes: ['aforoMaximo', 'alojamientoInvitados', 'cocinaPropia'] },
      { id: 'hoteles-bodas', name: 'Hoteles para Bodas & Resorts', slug: 'hoteles-bodas', description: 'Alojamiento y celebración sin desplazamientos.', requiredAttributes: ['habitacionesBloqueadas', 'suiteNupcial', 'parkingPax'] },
      { id: 'restaurantes-bodas', name: 'Restaurantes con Salón Nupcial', slug: 'restaurantes-bodas', description: 'Espacios gourmet con exclusividad de servicio.', requiredAttributes: ['precioMenuDesde', 'barraLibreIncluida', 'exclusividadEspacio'] },
      { id: 'bodegas-vinedos', name: 'Bodegas & Viñedos', slug: 'bodegas-vinedos', description: 'Celebraciones enológicas entre viñas y barricas.', requiredAttributes: ['visitaBodega', 'cataIncluida', 'aforoComedor'] },
      { id: 'haciendas-rurales', name: 'Haciendas & Casas de Campo', slug: 'haciendas-rurales', description: 'Ambientes íntimos con encanto campestre.', requiredAttributes: ['aforoMaximo', 'planBClimatizado'] },
      { id: 'espacios-singulares', name: 'Espacios Singulares & Terrazas Urbanas', slug: 'espacios-singulares', description: 'Rooftops, naves industriales y pabellones de diseño.', requiredAttributes: ['aforoMaximo', 'horarioCierre'] },
    ],
  },

  // 2. CATERING & GASTRONOMÍA
  {
    id: 'catering-gastronomia',
    name: 'Catering, Banquetes & Showcooking',
    icon: 'utensils',
    accent: '#F97316',
    description: 'Cocina en directo, menús emplatados y barras libres de autor.',
    subcategories: [
      { id: 'catering-gala', name: 'Catering de Alta Cocina & Emplatado', slug: 'catering-gala', description: 'Menús de autor con servicio de sala de gala.', requiredAttributes: ['precioMenuMin', 'ratioCamarerosPax', 'vajillaIncluida'] },
      { id: 'asadores-brasas', name: 'Asadores de Brasa & Carnes al Carbón', slug: 'asadores-brasas', description: 'Showcooking de parrilla en vivo.', requiredAttributes: ['tipoLenaCarbon', 'corteCarne', 'equipamientoExtraccion'] },
      { id: 'cortadores-jamon', name: 'Cortadores Profesionales de Jamón Ibérico', slug: 'cortadores-jamon', description: 'Maestros cortadores con producto D.O.', requiredAttributes: ['denominacionOrigen', 'piezasPorPax', 'soporteJamonero'] },
      { id: 'paellas-arroces', name: 'Maestros Arroceros & Paellas Gigantes', slug: 'paellas-arroces', description: 'Arroces a la leña en directo para bodas.', requiredAttributes: ['tipoArroz', 'ingredientesOrigen', 'fogonesGasLena'] },
      { id: 'cocteleria-barras', name: 'Barras Móviles de Coctelería & Gin-Bars', slug: 'cocteleria-barras', description: 'Bebidas premium y coctelería acrobática.', requiredAttributes: ['marcasPremium', 'bartenderTitulado', 'hieloCristalino'] },
      { id: 'food-trucks', name: 'Food Trucks & Caravanas Gourmet', slug: 'food-trucks', description: 'Puestos de comida callejera premium.', requiredAttributes: ['potenciaElectricaKw', 'registroSanitario'] },
      { id: 'mesas-dulces', name: 'Candy Bar, Tartas de Diseño & Repostería', slug: 'mesas-dulces', description: 'Tartas nupciales de autor y fuentes de chocolate.', requiredAttributes: ['opcionesCeliacos', 'refrigeracion'] },
      { id: 'recenas-tematicas', name: 'Recenas Temáticas (Burgers, Churros, Tacos)', slug: 'recenas-tematicas', description: 'Snacks energéticos para el fin de fiesta.', requiredAttributes: ['horarioServicio', 'ingredientesCalidad'] },
    ],
  },

  // 3. MÚSICA & ARTISTAS
  {
    id: 'musica-artistas',
    name: 'Música en Directo, Solistas & Animación Sonora',
    icon: 'music',
    accent: '#ecb613',
    description: 'Catálogo de voces líricas, mariachis, ensambles clásicos, orquestas y DJs.',
    subcategories: [
      { id: 'solistas-liricos', name: 'Tenores & Solistas Líricos (Edwin Agudelo)', slug: 'solistas-liricos', description: 'Voz lírica de gala para ceremonias y cócteles.', requiredAttributes: ['repertorioFormal', 'formatoAcustico', 'riderSonidoMinimo'] },
      { id: 'mariachis-elite', name: 'Mariachis de Élite & Show Imperial', slug: 'mariachis-elite', description: 'Formaciones de gala con trompetas y violines.', requiredAttributes: ['numeroIntegrantes', 'trajeCharroGala', 'tiempoActuacionMin'] },
      { id: 'djs-animadores', name: 'DJs Profesionales con Sonorización Bose F1', slug: 'djs-animadores', description: 'Sesiones personalizadas y control acústico de pista.', requiredAttributes: ['mesaMezcla', 'microfoniaInalambrica', 'sistemaCabinaDJ'] },
      { id: 'cuartetos-cuerda', name: 'Cuartetos & Tríos de Cuerda Clásica', slug: 'cuartetos-cuerda', description: 'Música clásica y adaptaciones modernas para ceremonia.', requiredAttributes: ['instrumentacion', 'partiturasCeremonia'] },
      { id: 'saxofonistas-coctel', name: 'Saxofonistas & Violinistas Eléctricos', slug: 'saxofonistas-coctel', description: 'Actuación en movimiento con bases electrónicas.', requiredAttributes: ['emisorInalambrico', 'basesElectronicas'] },
      { id: 'bandas-versiones', name: 'Bandas de Pop/Rock & Grupos de Versiones', slug: 'bandas-versiones', description: 'Directo con canciones de los 80, 90 y actuales.', requiredAttributes: ['potenciaPaRequerida', 'tiempoMontajeMin'] },
      { id: 'flamenco-gipsy', name: 'Grupos Flamencos, Rumbas & Coros Rocieros', slug: 'flamenco-gipsy', description: 'Guitarras, cajón y baile flamenco.', requiredAttributes: ['numeroArtistas', 'tarimaBaile'] },
      { id: 'gospel-coros', name: 'Coros Gospel & Ensambles Polifónicos', slug: 'gospel-coros', description: 'Voces de gran potencia para ceremonias emotivas.', requiredAttributes: ['numeroVoces', 'amplificacionPolifonica'] },
      { id: 'arpa-piano', name: 'Pianistas & Arpistas de Concierto', slug: 'arpa-piano', description: 'Instrumentación noble y delicada.', requiredAttributes: ['transporteInstrumento', 'afinacionLugar'] },
      { id: 'orquestas-show', name: 'Grandes Orquestas & Big Bands', slug: 'orquestas-show', description: 'Espectáculo escénico de gran formato para fiestas patronales y macro-bodas.', requiredAttributes: ['escenarioMetros', 'potenciaTruss'] },
      { id: 'tributos-oficiales', name: 'Bandas Tributo Oficiales (Queen, Beatles, ABBA)', slug: 'tributos-oficiales', description: 'Homenajes escénicos idénticos a los originales.', requiredAttributes: ['atrezzoPersonaje', 'riderSonidoHomologado'] },
      { id: 'musica-etnica-celta', name: 'Música Étnica, Celta & Gaiteros', slug: 'musica-etnica-celta', description: 'Sonidos tradicionales para bodas temáticas.', requiredAttributes: ['instrumentosTradicionales', 'indumentariaEpoca'] },
    ],
  },

  // 4. SONIDO, ILUMINACIÓN & TÉCNICA
  {
    id: 'tecnica-audiovisual',
    name: 'Sonido Profesional, Pantallas LED & Robótica DMX',
    icon: 'tv',
    accent: '#00E5FF',
    description: 'Equipos homologados bajo Ley 37/2003 (< 75 dB SPL, 12 W/pax).',
    subcategories: [
      { id: 'pa-bose-linearray', name: 'Sistemas Line Array Bose F1 / L-Acoustics', slug: 'pa-bose-linearray', description: 'Cobertura sonora balanceada para grandes aforos.', requiredAttributes: ['potenciaRmsWatts', 'homologacionDb', 'tecnicoSonidoPresencial'] },
      { id: 'pantallas-led-p2', name: 'Pantallas LED Gigantes Novastar P2.6 / P2.9', slug: 'pantallas-led-p2', description: 'Muros de vídeo modulares de alta luminosidad.', requiredAttributes: ['resolucionNativa', 'brilloNits', 'estructuraTrussAluminio'] },
      { id: 'robotica-cabezas', name: 'Cabezas Móviles Beam/Wash & Bañadores Inalámbricos', slug: 'robotica-cabezas', description: 'Iluminación escénica y arquitectónica programada.', requiredAttributes: ['cabezasMoviles', 'focosBateriaInalambricos', 'controladorDmx'] },
      { id: 'microfonia-shure-rf', name: 'Microfonía Shure Axient / QLX-D Digital', slug: 'microfonia-shure-rf', description: 'Cero interferencias de radiofrecuencia y máxima fidelidad.', requiredAttributes: ['bandaFrecuenciaLegal', 'antenasDireccionales'] },
      { id: 'limitadores-homologados', name: 'Limitadores Registradores de Decibelios', slug: 'limitadores-homologados', description: 'Cumplimiento legal telemático para evitar sanciones.', requiredAttributes: ['homologacionMinisterio', 'sensorCalibrado'] },
    ],
  },

  // 5. FOTOGRAFÍA & VÍDEO
  {
    id: 'fotografia-video',
    name: 'Fotografía, Cinematografía 4K & Drones',
    icon: 'camera',
    accent: '#FB7185',
    description: 'Reportajes editoriales de autor y películas de boda cinematográficas.',
    subcategories: [
      { id: 'fotografia-editorial', name: 'Fotografía Editorial & Documental Nupcial', slug: 'fotografia-editorial', description: 'Imágenes espontáneas y naturales con entrega cuidada.', requiredAttributes: ['numeroFotografos', 'entregaFotosEditadas', 'galeriaOnlinePrivada'] },
      { id: 'cine-4k-dron', name: 'Cinematografía de Boda 4K & Teaser Redes', slug: 'cine-4k-dron', description: 'Vídeos con etalonaje de cine y sonido directo.', requiredAttributes: ['grabacion4k', 'pilotoDronCertificado', 'duracionPeliculaMin'] },
      { id: 'drones-aesa', name: 'Tomas Aéreas con Dron Certificado AESA', slug: 'drones-aesa', description: 'Perspectivas panorámicas del espacio.', requiredAttributes: ['licenciaAesa', 'seguroAeronautico'] },
      { id: 'fotolibros-costura', name: 'Álbumes Nupciales de Alta Costura & Copias Padres', slug: 'fotolibros-costura', description: 'Impresión artística en papel fotográfico de museo.', requiredAttributes: ['encuadernacionArtesanal', 'paginasMinimas'] },
    ],
  },

  // 6. TRANSPORTE & LOGÍSTICA
  {
    id: 'transporte-logistica',
    name: 'Transporte de Invitados & Vehículos de Época',
    icon: 'car',
    accent: '#94A3B8',
    description: 'Flota homologada de autocares y traslados nupciales de gala.',
    subcategories: [
      { id: 'autobuses-invitados', name: 'Autobuses de Gran Confort (55 pax)', slug: 'autobuses-invitados', description: 'Traslados colectivos de ida y vuelta coordinados.', requiredAttributes: ['plazasHomologadas', 'horariosRetornoFlexibles', 'tarjetaTransportes'] },
      { id: 'minibuses-vip', name: 'Minibuses & Transfers VIP (16 a 25 pax)', slug: 'minibuses-vip', description: 'Flexibilidad para grupos reducidos o accesos estrechos.', requiredAttributes: ['plazasHomologadas', 'aireAcondicionado'] },
      { id: 'coches-clasicos', name: 'Coches Clásicos de Época con Chófer', slug: 'coches-clasicos', description: 'Llegada ceremonial en automóviles históricos.', requiredAttributes: ['marcaModeloAno', 'choferUniformado', 'adornoFloralCoche'] },
      { id: 'coches-deportivos-lujo', name: 'Vehículos Deportivos & Alta Gama Contemporánea', slug: 'coches-deportivos-lujo', description: 'Mercedes Clase S, Porsche o Tesla para los novios.', requiredAttributes: ['gamaVehiculo', 'seguroTodoRiesgoSinFranquicia'] },
      { id: 'carruajes-caballos', name: 'Carruajes de Caballos & Enganches de Tradición', slug: 'carruajes-caballos', description: 'Elegancia clásica tirada por caballos pura raza.', requiredAttributes: ['guarnicioneriaGala', 'cocheroTitulado'] },
    ],
  },

  // 7. DECORACIÓN, FLORES & MOBILIARIO
  {
    id: 'decoracion-flores',
    name: 'Decoración Floral, Iluminación de Ambiente & Atrezo',
    icon: 'flower',
    accent: '#FBBF24',
    description: 'Diseño integral del espacio, ramos de novia y montajes de luces.',
    subcategories: [
      { id: 'arcos-ceremonia', name: 'Arcos Florales & Decoración de Altar', slug: 'arcos-ceremonia', description: 'Estructuras florales para el "Sí, quiero".', requiredAttributes: ['estructuraMaderaMetal', 'floresPreservadasNaturales'] },
      { id: 'centros-mesa-banquete', name: 'Centros de Mesa, Cristalería & Minutas', slug: 'centros-mesa-banquete', description: 'Diseño de mesa armónico y personalizado.', requiredAttributes: ['minutasIncluidas', 'seatingPlan', 'velasHomologadas'] },
      { id: 'cielos-microbombillas', name: 'Cielos de Microbombillas & Guirnaldas de Luz', slug: 'cielos-microbombillas', description: 'Iluminación cálida tipo verbena de gala.', requiredAttributes: ['metrosLineales', 'temperaturaColorKelvin', 'certificacionExterior'] },
      { id: 'mobiliario-chillout', name: 'Zonas Chill-Out & Carpas Bedouinas', slug: 'mobiliario-chillout', description: 'Mobiliario rústico, sofás y carpas tensadas.', requiredAttributes: ['materialEstructura', 'certificacionIgnifuga'] },
      { id: 'ramos-novia', name: 'Ramos de Novia Exclusivos & Prendidos', slug: 'ramos-novia', description: 'Arreglos florales a medida para novios y testigos.', requiredAttributes: ['conservacionFlores', 'entregaDiaBoda'] },
    ],
  },

  // 8. WEDDING PLANNERS & PROTOCOLO
  {
    id: 'wedding-planners',
    name: 'Wedding Planners, Coordinación & Protocolo 360°',
    icon: 'heart',
    accent: '#F5C538',
    description: 'Gestión integral de tiempos, proveedores y dirección del evento.',
    subcategories: [
      { id: 'coordinacion-dia-d', name: 'Coordinación Exclusiva del Día de la Boda', slug: 'coordinacion-dia-d', description: 'Presencia in situ para coordinar horarios y proveedores.', requiredAttributes: ['horasPresenciaDia', 'equipoAsistentes', 'escaletaTiempos'] },
      { id: 'organizacion-integral-360', name: 'Diseño & Organización Integral desde Cero', slug: 'organizacion-integral-360', description: 'Búsqueda de espacios, negociación y dirección de arte.', requiredAttributes: ['gestionPresupuesto', 'negociacionProveedores', 'disenoVisual3d'] },
      { id: 'oficiantes-simbolicos', name: 'Oficiantes de Ceremonia & Maestros de Protocolo', slug: 'oficiantes-simbolicos', description: 'Guion emotivo personalizado para enlaces civiles.', requiredAttributes: ['guionPersonalizado', 'idiomasOficiante', 'ritoSimbolico'] },
    ],
  },

  // 9. ANIMACIÓN, EFECTOS & FOTOMATÓN
  {
    id: 'animacion-efectos',
    name: 'Plataformas 360°, Fotomatón, Fuego Frío & Animación',
    icon: 'sparkles',
    accent: '#A855F7',
    description: 'Diversión interactiva, atrezo, fuego frío y entretenimiento.',
    subcategories: [
      { id: 'plataforma-360', name: 'Plataforma Giratoria de Vídeo 360° Slow-Motion', slug: 'plataforma-360', description: 'Grabación de vídeos con efectos y descarga por código QR.', requiredAttributes: ['capacidadPersonasPlataforma', 'descargaQrInmediata', 'atrezoGama'] },
      { id: 'fotomaton-espejo', name: 'Fotomatón Clásico & Espejo Mágico Impreso', slug: 'fotomaton-espejo', description: 'Impresión de tiras ilimitadas con dedicatorias.', requiredAttributes: ['fotosImpresasIlimitadas', 'albumFirmasIncluido', 'impresionTermica'] },
      { id: 'chispas-fuego-frio', name: 'Fuegos Fríos Sparkular & Humo Bajo Criogénico', slug: 'chispas-fuego-frio', description: 'Efectos pirotécnicos fríos autorizados en interior.', requiredAttributes: ['certificacionUsoInterior', 'humoSecoSinOlor', 'disparoDmx'] },
      { id: 'animacion-infantil', name: 'Monitores Infantiles, Talleres & Hinchables', slug: 'animacion-infantil', description: 'Cuidado y diversión de los niños durante el banquete.', requiredAttributes: ['ratioNinosMonitor', 'seguroHinchable', 'titulacionOcioTiempoLibre'] },
      { id: 'performers-zancudos', name: 'Performers, Zancudos & Hora Loca Temática', slug: 'performers-zancudos', description: 'Espectáculo festivo con disfraces y accesorios luminosos.', requiredAttributes: ['numeroArtistas', 'atrezzoLuminoso'] },
    ],
  },

  // 10. MODA, JOYERÍA & BELLEZA
  {
    id: 'moda-belleza',
    name: 'Moda Nupcial, Sastrería, Joyería & Estilismo',
    icon: 'shirt',
    accent: '#E7C6A5',
    description: 'Vestidos de novia de alta costura, trajes a medida y alianzas.',
    subcategories: [
      { id: 'vestidos-novia-costura', name: 'Vestidos de Novia & Alta Costura', slug: 'vestidos-novia-costura', description: 'Colecciones de atelier con pruebas de modistería.', requiredAttributes: ['pruebasAjusteIncluidas', 'tejidosProcedencia'] },
      { id: 'trajes-novio-medida', name: 'Trajes de Novio, Chaqués & Smokings a Medida', slug: 'trajes-novio-medida', description: 'Corte sastre tradicional y tejidos nobles.', requiredAttributes: ['confeccionArtesanal', 'chalecosComplementos'] },
      { id: 'alianzas-joyeria', name: 'Joyería Nupcial, Alianzas & Gemelos', slug: 'alianzas-joyeria', description: 'Oro de ley, platino y grabado artesanal.', requiredAttributes: ['quilatesOro', 'grabadoLaserIncluido'] },
      { id: 'maquillaje-peinado-domicilio', name: 'Maquillaje Nupcial & Peluquería a Domicilio', slug: 'maquillaje-peinado-domicilio', description: 'Tratamientos previos de belleza y prueba in situ.', requiredAttributes: ['pruebaPreviaIncluida', 'productosResistentesAgua', 'desplazamientoFinca'] },
    ],
  },
]);


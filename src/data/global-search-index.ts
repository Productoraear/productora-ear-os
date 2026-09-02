export interface SearchIndexItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'servicios' | 'flota' | 'arsenal' | 'artistas' | 'b2g' | 'vimume';
  categoryLabel: string;
  url: string;
  price?: string;
  badge?: string;
  keywords: string[];
  image?: string;
  isExternal?: boolean;
}

export const GLOBAL_SEARCH_INDEX: SearchIndexItem[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 0. ECOSISTEMA & ARQUITECTURA ORGANIZACIONAL (SSOT)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'srv-ecosistema',
    title: 'Ecosistema Productora EAR · Mapa Mental & Jerarquías',
    subtitle: 'Arquitectura organizacional de 6 macro-verticales, nodos operativos y mapeo de rutas web.',
    category: 'servicios',
    categoryLabel: 'Ecosistema',
    url: '/ecosistema',
    price: 'S-Class Core',
    badge: 'Arquitectura',
    keywords: ['ecosistema', 'estructura', 'organigrama', 'xmind', 'mapa mental', 'jerarquia', 'productora ear', 'verticales', 'paciente cero', 'vimume'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop'
  },
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. SERVICIOS & BODAS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'srv-bodas',
    title: 'Bodas de Alta Distinción & Arquitectura Nupcial',
    subtitle: 'Sonorización Pista-BPM Bose/Shure, Plan B redundante y Price-Lock 72h.',
    category: 'servicios',
    categoryLabel: 'Bodas & Nupcial',
    url: '/bodas',
    price: 'Desde 350 €',
    badge: 'S-Class',
    keywords: ['boda', 'bodas', 'novios', 'novias', 'nupcial', 'ceremonia', 'coctel', 'banquete', 'musica boda', 'madrid', 'toledo', 'fincas'],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'srv-eventos',
    title: 'Producción Audiovisual & Eventos Corporativos',
    subtitle: 'Sonido Line Array, Pantallas LED P2.9 y estructuras homologadas para empresas.',
    category: 'servicios',
    categoryLabel: 'Corporativo',
    url: '/eventos',
    price: 'A Medida',
    badge: 'Corporativo',
    keywords: ['eventos', 'corporativo', 'empresas', 'congresos', 'convenciones', 'ifema', 'escenarios', 'sonido profesional'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'srv-calculadora',
    title: 'Calculadora Inteligente de Presupuestos & Smart-Lock',
    subtitle: 'Cotiza al instante en base a distancia, músicos y equipamiento con bloqueo de tarifa 72h.',
    category: 'servicios',
    categoryLabel: 'Cotizador',
    url: '/calculadora',
    price: 'Depósito 10 €',
    badge: 'Stripe Seal',
    keywords: ['calculadora', 'cotizador', 'presupuesto', 'precio', 'tarifa', 'bloquear', 'reserva', 'cuanto cuesta', 'estimacion'],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'srv-infraestructura',
    title: 'Ingeniería Acústica & Presión Sonora 12 W/pax',
    subtitle: 'Garantía Cero Fallos acústicos con sistemas dB Technologies y Bose F1.',
    category: 'servicios',
    categoryLabel: 'Infraestructura',
    url: '/infraestructura',
    price: 'S-Class Rig',
    badge: 'Acústica',
    keywords: ['acustica', 'presion sonora', 'vatios', 'w/pax', 'insonorizacion', 'db technologies', 'bose', 'cero fallos'],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. FLOTA VIP & CHÓFER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'flota-chofer-vip',
    title: 'Servicio de Chófer VIP & Alquiler con Conductor',
    subtitle: 'Flota Mercedes-Benz Clase S, Clase V y Maybach con chóferes de estricto protocolo.',
    category: 'flota',
    categoryLabel: 'Flota VIP',
    url: '/servicios/chofer-vip',
    price: 'Desde 95 €',
    badge: 'Mercedes-Benz',
    keywords: ['chofer', 'conductor', 'coche con conductor', 'vtc', 'mercedes', 'clase s', 'clase v', 'maybach', 'transfer', 'aeropuerto', 'madrid', 'ibiza'],
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'flota-clase-s',
    title: 'Mercedes-Benz Clase S Lujo (Chófer VIP)',
    subtitle: 'El pináculo del confort y la representación institucional. Asientos de cuero nappa y minibar.',
    category: 'flota',
    categoryLabel: 'Flota VIP',
    url: '/servicios/chofer-vip',
    price: 'Desde 140 €',
    badge: 'Primera Clase',
    keywords: ['clase s', 'mercedes clase s', 'berlina de lujo', 'coche novios', 'diplomatico', 'alta direccion'],
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'flota-clase-v',
    title: 'Mercedes-Benz Clase V Extra Larga (7 Pasajeros)',
    subtitle: 'Salón ejecutivo rodante para comitivas, familias VIP, novios y giras de artistas.',
    category: 'flota',
    categoryLabel: 'Flota VIP',
    url: '/servicios/chofer-vip',
    price: 'Desde 130 €',
    badge: '7 Plazas VIP',
    keywords: ['clase v', 'mercedes van', 'furgoneta lujo', '7 plazas', 'gira', 'traslado grupo', 'maletas grandes'],
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'flota-maybach',
    title: 'Mercedes-Maybach & SUV Premium First-Class',
    subtitle: 'Exclusividad superlativa para dignatarios, cumbres y celebridades. Sonido Burmester.',
    category: 'flota',
    categoryLabel: 'Flota VIP',
    url: '/servicios/chofer-vip',
    price: 'Desde 220 €',
    badge: 'Maybach Ultra',
    keywords: ['maybach', 'suv lujo', 'blindado', 'celebridades', 'artistas internacionales', 'fbo barajas'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'flota-transfer-aeropuerto',
    title: 'Transfer Aeropuerto Madrid Barajas T1-T4 & Terminal FBO',
    subtitle: 'Recogida nominal con cartel, 60 min de cortesía y seguimiento de vuelo en directo.',
    category: 'flota',
    categoryLabel: 'Flota VIP',
    url: '/servicios/transfer-aeropuerto-madrid',
    price: 'Tarifa Fija',
    badge: 'Aeropuerto',
    keywords: ['barajas', 'aeropuerto', 'transfer barajas', 'terminal fbo', 'recogida aeropuerto', 't4', 't1'],
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. ALUMBRADO MONUMENTAL & ARSENAL TÉCNICO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'luces-navidad-general',
    title: 'Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2025',
    subtitle: '358 referencias HD en 11 categorías. Motivos 3D, conos gigantes y Twinkly Pro para Ayuntamientos.',
    category: 'arsenal',
    categoryLabel: 'Alumbrado B2G',
    url: '/arsenal/luces-navidad',
    price: '358 Referencias',
    badge: 'Catálogo HD',
    keywords: ['luces', 'luces de navidad', 'alumbrado navideño', 'alumbrado monumental', 'motivos 3d', 'arboles gigantes', 'navidad', 'iluminacion navidad', 'ayuntamientos'],
    image: '/images/demetrio/page_2.jpg'
  },
  {
    id: 'cat-motivos-3d',
    title: 'Motivos 3D Gigantes & Figuras Transitables',
    subtitle: 'Carrozas, osos, pingüinos, muñecos de nieve y portales transitables iluminados a 24V.',
    category: 'arsenal',
    categoryLabel: 'Alumbrado B2G',
    url: '/arsenal/luces-navidad/categoria/motivos-3d-gigantes',
    price: 'Desde 480 €',
    badge: '3D Transitables',
    keywords: ['motivos 3d', 'figuras gigantes', 'osos gigantes', 'pingüino', 'muñeco de nieve', 'carroza 3d', 'puerta 3d'],
    image: '/images/demetrio/page_2.jpg'
  },
  {
    id: 'cat-conos-arboles',
    title: 'Conos y Árboles Gigantes 3D para Plazas Mayores',
    subtitle: 'Estructuras cónicas monumentales de 6m a 24m para plazas consistoriales y centros comerciales.',
    category: 'arsenal',
    categoryLabel: 'Alumbrado B2G',
    url: '/arsenal/luces-navidad/categoria/conos-y-arboles-gigantes-3d',
    price: 'Licitación LCSP',
    badge: 'Plaza Mayor',
    keywords: ['arbol gigante', 'cono gigante', 'arbol de navidad plaza', 'cono 3d', 'arbol monumental', 'plaza consistorial'],
    image: '/images/demetrio/page_15.jpg'
  },
  {
    id: 'cat-arcos-calle',
    title: 'Motivos 2D y Arcos de Calle Navideños',
    subtitle: 'Arcos transversales de avenida y motivos decorativos para báculos de farola con marcado CE.',
    category: 'arsenal',
    categoryLabel: 'Alumbrado B2G',
    url: '/arsenal/luces-navidad/categoria/motivos-2d-y-arcos-de-calle',
    price: 'Suministro & Montaje',
    badge: 'Arcos Viales',
    keywords: ['arcos de calle', 'motivos 2d', 'farolas', 'avenidas', 'cielos estrellados', 'calles comerciales'],
    image: '/images/demetrio/page_35.jpg'
  },
  {
    id: 'cat-twinkly-pro',
    title: 'Twinkly Pro Smart LED (Control Inteligente Mapeable)',
    subtitle: 'Tecnología addressable RGB+AWW controlada por nube y sincronización musical en tiempo real.',
    category: 'arsenal',
    categoryLabel: 'Alumbrado B2G',
    url: '/arsenal/luces-navidad/categoria/twinkly-pro-smart-led',
    price: 'Smart Tech',
    badge: 'Twinkly Pro',
    keywords: ['twinkly', 'twinkly pro', 'smart led', 'rgb', 'iluminacion inteligente', 'mapeable', 'show de luces'],
    image: '/images/demetrio/page_70.jpg'
  },
  {
    id: 'arsenal-line-array',
    title: 'Sistema Line Array dB Technologies VIO L208',
    subtitle: 'Equipamiento concert-grade para festivales y grandes aforos con presión de 135 dB SPL.',
    category: 'arsenal',
    categoryLabel: 'Arsenal Sonido',
    url: '/arsenal/line-array-db-technologies/madrid',
    price: 'Desde 600 € / Día',
    badge: 'Line Array',
    keywords: ['line array', 'db technologies', 'vio l208', 'sonido festival', 'altavoces concierto', 'sonorizacion grandes aforos'],
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'arsenal-pantallas-led',
    title: 'Pantallas LED P2.9 Exterior & Interior (High-Brightness)',
    subtitle: 'Módulos LED modulares de 5.500 nits con procesadores NovaStar 4K para sol directo.',
    category: 'arsenal',
    categoryLabel: 'Arsenal Visual',
    url: '/arsenal/pantallas-led-p29/madrid',
    price: 'Desde 45 € / m²',
    badge: 'LED 4K',
    keywords: ['pantalla led', 'pantallas led', 'video wall', 'p2.9', 'novastar', 'pantalla exterior', 'escenario led'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. ARTISTAS & SHOWS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'art-edwin-agudelo-solista',
    title: 'Edwin Agudelo · Show Solista Acústico & Boleros',
    subtitle: 'Voz de autor, repertorio romántico y ambientación acústica de alta distinción con sonorización Bose.',
    category: 'artistas',
    categoryLabel: 'Roster Oficial',
    url: '/artistas/edwin-agudelo',
    price: '350 €',
    badge: 'Solista S-Class',
    keywords: ['edwin agudelo', 'cantante', 'solista', 'boleros', 'musica en directo', 'guitarra', 'voz', 'boda cantante', 'serenata'],
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'art-edwin-agudelo-duo',
    title: 'Edwin Agudelo · Dúo Armónico S-Class (Voz + Piano / Chelo)',
    subtitle: 'Formato íntimo para cócteles y ceremonias de gran elegancia con arreglos a medida.',
    category: 'artistas',
    categoryLabel: 'Roster Oficial',
    url: '/artistas/edwin-agudelo',
    price: '550 €',
    badge: 'Dúo Armónico',
    keywords: ['duo', 'piano y voz', 'chelo', 'ceremonia nupcial', 'coctel elegante', 'musicos en directo'],
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'art-edwin-agudelo-cuarteto',
    title: 'Edwin Agudelo · Cuarteto de Cuerdas y Piano',
    subtitle: 'Acústica majestuosa con violines, chelo, piano y voz de gala para recepciones exclusivas.',
    category: 'artistas',
    categoryLabel: 'Roster Oficial',
    url: '/artistas/edwin-agudelo',
    price: '900 €',
    badge: 'Cuarteto Clásico',
    keywords: ['cuarteto', 'cuerdas', 'violin', 'violonchelo', 'musica clasica', 'gala'],
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'art-edwin-agudelo-granshow',
    title: 'Edwin Agudelo · Gran Show de Representación',
    subtitle: 'Banda completa con sección de metales, percusión y escenografía lumínica sincronizada.',
    category: 'artistas',
    categoryLabel: 'Roster Oficial',
    url: '/artistas/edwin-agudelo',
    price: '1.800 €',
    badge: 'Gran Show',
    keywords: ['gran show', 'banda completa', 'orquesta', 'metales', 'concierto privado', 'fiesta patronal'],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'art-djs-boda',
    title: 'DJs de Bodas & Sesión de Gala S-Class',
    subtitle: 'Cabina de diseño, iluminación robotizada, microfonía y repertorio personalizado sin cortes.',
    category: 'artistas',
    categoryLabel: 'Roster Oficial',
    url: '/artistas/djs',
    price: 'Desde 400 €',
    badge: 'DJ Set',
    keywords: ['dj', 'dj boda', 'musica fiesta', 'barra libre', 'discoteca movil', 'sonido pista'],
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=400&auto=format&fit=crop'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. B2G & AYUNTAMIENTOS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'b2g-licitaciones',
    title: 'Producción Municipal B2G & Licitaciones Públicas',
    subtitle: 'Expedientes visados, cumplimiento estricto LCSP y suministro para festejos y eventos patronales.',
    category: 'b2g',
    categoryLabel: 'B2G Público',
    url: '/b2g',
    price: 'Garantía LCSP',
    badge: 'Contratación Pública',
    keywords: ['b2g', 'ayuntamiento', 'licitacion', 'lcsp', 'contrato menor', 'pliegos', 'festejos', 'fiestas patronales', 'concejalia'],
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'b2g-escenarios-patronales',
    title: 'Escenarios Homologados & Sonorización de Fiestas',
    subtitle: 'Estructuras layher certificadas, boletín eléctrico OCA y plan de seguridad acústico municipal.',
    category: 'b2g',
    categoryLabel: 'B2G Público',
    url: '/b2g',
    price: 'Homologado',
    badge: 'Seguridad OCA',
    keywords: ['escenario', 'layher', 'boletin electrico', 'oca', 'seguridad', 'plaza de toros', 'recinto ferial'],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. VIMUME & I+D NEUROFUNCIONAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'vimume-general',
    title: 'VIMUME · Musicoterapia Neurofuncional & Estimulación Auditiva',
    subtitle: 'Protocolos de estimulación neurocognitiva para Alzheimer, demencias y envejecimiento activo.',
    category: 'vimume',
    categoryLabel: 'I+D VIMUME',
    url: '/vimume',
    price: 'I+D Biomédica',
    badge: 'Neuroacústica',
    keywords: ['vimume', 'musicoterapia', 'alzheimer', 'demencia', 'neurofuncional', 'terapia ocupacional', 'residencias', 'envejecimiento activo'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'vimume-centros',
    title: 'VIMUME · Piloto en Centros Sociosanitarios y Residencias',
    subtitle: 'Implementación del programa clínico de estimulación sonora con métricas validadas.',
    category: 'vimume',
    categoryLabel: 'I+D VIMUME',
    url: '/vimume/centros',
    price: 'Convenio Sociosanitario',
    badge: 'Convenios',
    keywords: ['centros', 'residencias de ancianos', 'clinicas', 'estimulacion auditiva', 'salud cerebral'],
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400&auto=format&fit=crop'
  }
];

export const SEARCH_CATEGORY_PILLS = [
  { id: 'all', label: 'Todos', icon: 'Sparkles' },
  { id: 'servicios', label: 'Servicios & Bodas', icon: 'Briefcase' },
  { id: 'flota', label: 'Flota VIP & Chófer', icon: 'Car' },
  { id: 'arsenal', label: 'Alumbrado & Arsenal', icon: 'Zap' },
  { id: 'artistas', label: 'Artistas & Shows', icon: 'Music' },
  { id: 'b2g', label: 'B2G Ayuntamientos', icon: 'Building2' },
  { id: 'vimume', label: 'VIMUME Neuro', icon: 'Activity' },
] as const;

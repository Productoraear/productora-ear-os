// spanish-municipalities.ts - Arquitectura de Datos pSEO y Dominación Territorial EAR OS

export interface Municipality {
  id: string;
  name: string;
  slug: string;
  province: string;
  provinceSlug: string;
  autonomousCommunity: string;
  tier: 1 | 2 | 3;
  population?: number;
  hasFincas: boolean;
  hasPatronalEvents: boolean;
  searchIntentScore: number; // 1 - 100
  isCoreHub?: boolean;
  /** Comarca geografica real del municipio (dato verificado, jamas placeholder). */
  comarca?: string;
  /** Km por carretera desde el Hub Central de Méntrida (Toledo, 40.2369 N / 4.1942 W). */
  distanceFromMentrideKm?: number;
}

export interface EventService {
  id: string;
  title: string;
  slug: string;
  category: 'musica' | 'produccion' | 'catering' | 'estilo-vida';
  targetAudience: 'B2B' | 'B2C' | 'B2G';
  averageTicket: number;
}

export const SERVICES_DATABASE: EventService[] = [
  {
    id: 'sonido-iluminacion',
    title: 'Alquiler de Sonido e Iluminación Profesional',
    slug: 'sonido-iluminacion',
    category: 'produccion',
    targetAudience: 'B2B',
    averageTicket: 2500,
  },
  {
    id: 'fiestas-patronales',
    title: 'Organización de Fiestas Patronales y Ayuntamientos',
    slug: 'fiestas-patronales-ayuntamientos',
    category: 'produccion',
    targetAudience: 'B2G',
    averageTicket: 12000,
  },
  {
    id: 'pantallas-led',
    title: 'Alquiler de Pantallas LED Gigantes',
    slug: 'alquiler-pantallas-led',
    category: 'produccion',
    targetAudience: 'B2B',
    averageTicket: 3500,
  },
  {
    id: 'catering-brasas',
    title: 'Catering Premium a las Brasas y Showcooking',
    slug: 'catering-brasas',
    category: 'catering',
    targetAudience: 'B2C',
    averageTicket: 4500,
  },
  {
    id: 'bodas-lujo',
    title: 'Producción Audiovisual y Música para Bodas de Lujo',
    slug: 'bodas-lujo',
    category: 'estilo-vida',
    targetAudience: 'B2C',
    averageTicket: 6000,
  },
  {
    id: 'mariachi-gala',
    title: 'Mariachi de Gala y Espectáculo En Vivo',
    slug: 'mariachi-gala',
    category: 'musica',
    targetAudience: 'B2C',
    averageTicket: 750,
  },
  {
    id: 'serenatas-aniversarios',
    title: 'Serenatas Exclusivas y Aniversarios',
    slug: 'serenatas-aniversarios',
    category: 'musica',
    targetAudience: 'B2C',
    averageTicket: 400,
  },
];

// DATASET ESTRATÉGICO DE MUNICIPIOS DE ESPAÑA (TIERS 1, 2 Y 3)
export const MUNICIPALITIES_DATABASE: Municipality[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TIER 1: GRANDES METRÓPOLIS Y CAPITALES (>100.000 HABITANTES)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Madrid & Centro
  { id: 'mad-madrid', name: 'Madrid Capital', slug: 'madrid', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 100, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 54 },
  { id: 'mad-mostoles', name: 'Móstoles', slug: 'mostoles', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 45 },
  { id: 'mad-alcala', name: 'Alcalá de Henares', slug: 'alcala-de-henares', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Corredor del Henares', distanceFromMentrideKm: 75 },
  { id: 'mad-fuenlabrada', name: 'Fuenlabrada', slug: 'fuenlabrada', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 50 },
  { id: 'mad-leganes', name: 'Leganés', slug: 'leganes', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 52 },
  { id: 'mad-getafe', name: 'Getafe', slug: 'getafe', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 50 },
  { id: 'mad-alcorcon', name: 'Alcorcón', slug: 'alcorcon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 48 },
  { id: 'mad-parla', name: 'Parla', slug: 'parla', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Comarca Sur', distanceFromMentrideKm: 50 },
  { id: 'mad-torrejon', name: 'Torrejón de Ardoz', slug: 'torrejon-de-ardoz', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true, comarca: 'Corredor del Henares', distanceFromMentrideKm: 72 },
  { id: 'mad-alcobendas', name: 'Alcobendas', slug: 'alcobendas', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 62 },
  { id: 'mad-las-rozas', name: 'Las Rozas de Madrid', slug: 'las-rozas', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 60 },
  { id: 'mad-san-sebas', name: 'San Sebastián de los Reyes', slug: 'san-sebastian-de-los-reyes', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 66 },
  { id: 'mad-pozuelo', name: 'Pozuelo de Alarcón', slug: 'pozuelo-de-alarcon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 55 },
  { id: 'mad-coslada', name: 'Coslada', slug: 'coslada', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Corredor del Henares', distanceFromMentrideKm: 68 },
  { id: 'mad-valdemoro', name: 'Valdemoro', slug: 'valdemoro', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Comarca Sur', distanceFromMentrideKm: 55 },

  // Cataluña
  { id: 'cat-barcelona', name: 'Barcelona Capital', slug: 'barcelona', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 100, isCoreHub: true, comarca: 'Barcelonès', distanceFromMentrideKm: 665 },
  { id: 'cat-hospitalet', name: "L'Hospitalet de Llobregat", slug: 'hospitalet-de-llobregat', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Barcelonès', distanceFromMentrideKm: 665 },
  { id: 'cat-badalona', name: 'Badalona', slug: 'badalona', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Barcelonès', distanceFromMentrideKm: 670 },
  { id: 'cat-terrassa', name: 'Terrassa', slug: 'terrassa', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Vallès Occidental', distanceFromMentrideKm: 655 },
  { id: 'cat-sabadell', name: 'Sabadell', slug: 'sabadell', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Vallès Occidental', distanceFromMentrideKm: 655 },
  { id: 'cat-mataro', name: 'Mataró', slug: 'mataro', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Maresme', distanceFromMentrideKm: 665 },
  { id: 'cat-santa-coloma', name: 'Santa Coloma de Gramenet', slug: 'santa-coloma-de-gramenet', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'Barcelonès', distanceFromMentrideKm: 668 },
  { id: 'cat-sant-cugat', name: 'Sant Cugat del Vallès', slug: 'sant-cugat-del-valles', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Vallès Occidental', distanceFromMentrideKm: 660 },
  { id: 'cat-cornella', name: 'Cornellà de Llobregat', slug: 'cornella-de-llobregat', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Baix Llobregat', distanceFromMentrideKm: 665 },
  { id: 'cat-sant-boi', name: 'Sant Boi de Llobregat', slug: 'sant-boi-de-llobregat', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Baix Llobregat', distanceFromMentrideKm: 663 },
  { id: 'cat-rubi', name: 'Rubí', slug: 'rubi', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'Vallès Occidental', distanceFromMentrideKm: 655 },
  { id: 'cat-manresa', name: 'Manresa', slug: 'manresa', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Bages', distanceFromMentrideKm: 610 },
  { id: 'cat-tarragona', name: 'Tarragona Capital', slug: 'tarragona', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Tarragonès', distanceFromMentrideKm: 550 },
  { id: 'cat-reus', name: 'Reus', slug: 'reus', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Baix Camp', distanceFromMentrideKm: 540 },
  { id: 'cat-lleida', name: 'Lleida Capital', slug: 'lleida', province: 'Lérida', provinceSlug: 'lerida', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true, comarca: 'Segrià', distanceFromMentrideKm: 520 },
  { id: 'cat-girona', name: 'Girona Capital', slug: 'girona', province: 'Gerona', provinceSlug: 'gerona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Gironès', distanceFromMentrideKm: 715 },

  // Comunidad Valenciana & Murcia
  { id: 'val-valencia', name: 'Valencia Capital', slug: 'valencia', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true, comarca: 'Horta de València', distanceFromMentrideKm: 402 },
  { id: 'val-torrent', name: 'Torrent', slug: 'torrent', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Horta Sud', distanceFromMentrideKm: 400 },
  { id: 'val-gandia', name: 'Gandía', slug: 'gandia', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Safor', distanceFromMentrideKm: 460 },
  { id: 'val-alicante', name: 'Alicante Capital', slug: 'alicante', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Alacantí', distanceFromMentrideKm: 450 },
  { id: 'val-elche', name: 'Elche', slug: 'elche', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Baix Vinalopó', distanceFromMentrideKm: 460 },
  { id: 'val-torrevieja', name: 'Torrevieja', slug: 'torrevieja', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Vega Baja', distanceFromMentrideKm: 470 },
  { id: 'val-orihuela', name: 'Orihuela', slug: 'orihuela', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Vega Baja', distanceFromMentrideKm: 455 },
  { id: 'val-castellon', name: 'Castellón de la Plana', slug: 'castellon', province: 'Castellón', provinceSlug: 'castellon', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Plana Alta', distanceFromMentrideKm: 400 },
  { id: 'mur-murcia', name: 'Murcia Capital', slug: 'murcia', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Huerta de Murcia', distanceFromMentrideKm: 400 },
  { id: 'mur-cartagena', name: 'Cartagena', slug: 'cartagena', province: 'Murcia', provinceSlug: 'cartagena', autonomousCommunity: 'Región de Murcia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Campo de Cartagena', distanceFromMentrideKm: 420 },
  { id: 'mur-lorca', name: 'Lorca', slug: 'lorca', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Alto Guadalentín', distanceFromMentrideKm: 430 },

  // Andalucía
  { id: 'and-sevilla', name: 'Sevilla Capital', slug: 'sevilla', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true, comarca: 'Área Metropolitana de Sevilla', distanceFromMentrideKm: 515 },
  { id: 'and-dos-hermanas', name: 'Dos Hermanas', slug: 'dos-hermanas', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Bajo Guadalquivir', distanceFromMentrideKm: 505 },
  { id: 'and-malaga', name: 'Málaga Capital', slug: 'malaga', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true, comarca: 'Málaga-Costa del Sol', distanceFromMentrideKm: 530 },
  { id: 'and-marbella', name: 'Marbella', slug: 'marbella', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true, comarca: 'Costa del Sol Occidental', distanceFromMentrideKm: 560 },
  { id: 'and-mijas', name: 'Mijas', slug: 'mijas', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Costa del Sol Occidental', distanceFromMentrideKm: 550 },
  { id: 'and-velez-malaga', name: 'Vélez-Málaga', slug: 'velez-malaga', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'La Axarquía', distanceFromMentrideKm: 515 },
  { id: 'and-fuengirola', name: 'Fuengirola', slug: 'fuengirola', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Costa del Sol Occidental', distanceFromMentrideKm: 545 },
  { id: 'and-cordoba', name: 'Córdoba Capital', slug: 'cordoba', province: 'Córdoba', provinceSlug: 'cordoba', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Campiña de Córdoba', distanceFromMentrideKm: 430 },
  { id: 'and-granada', name: 'Granada Capital', slug: 'granada', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Vega de Granada', distanceFromMentrideKm: 480 },
  { id: 'and-jerez', name: 'Jerez de la Frontera', slug: 'jerez-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Marco de Jerez', distanceFromMentrideKm: 610 },
  { id: 'and-algeciras', name: 'Algeciras', slug: 'algeciras', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Campo de Gibraltar', distanceFromMentrideKm: 655 },
  { id: 'and-cadiz', name: 'Cádiz Capital', slug: 'cadiz', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Bahía de Cádiz', distanceFromMentrideKm: 625 },
  { id: 'and-san-fernando', name: 'San Fernando', slug: 'san-fernando', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Bahía de Cádiz', distanceFromMentrideKm: 635 },
  { id: 'and-el-puerto', name: 'El Puerto de Santa María', slug: 'el-puerto-de-santa-maria', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Bahía de Cádiz', distanceFromMentrideKm: 620 },
  { id: 'and-chiclana', name: 'Chiclana de la Frontera', slug: 'chiclana-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'La Janda', distanceFromMentrideKm: 640 },
  { id: 'and-almeria', name: 'Almería Capital', slug: 'almeria', province: 'Almería', provinceSlug: 'almeria', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Comarca Metropolitana de Almería', distanceFromMentrideKm: 505 },
  { id: 'and-roquetas', name: 'Roquetas de Mar', slug: 'roquetas-de-mar', province: 'Almería', provinceSlug: 'almeria', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Poniente Almeriense', distanceFromMentrideKm: 520 },
  { id: 'and-el-ejido', name: 'El Ejido', slug: 'el-ejido', province: 'Almería', provinceSlug: 'almeria', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Poniente Almeriense', distanceFromMentrideKm: 530 },
  { id: 'and-huelva', name: 'Huelva Capital', slug: 'huelva', province: 'Huelva', provinceSlug: 'huelva', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Comarca Metropolitana de Huelva', distanceFromMentrideKm: 590 },
  { id: 'and-jaen', name: 'Jaén Capital', slug: 'jaen', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Área Metropolitana de Jaén', distanceFromMentrideKm: 375 },

  // Aragón, Norte, Castilla y León, Baleares y Canarias
  { id: 'ara-zaragoza', name: 'Zaragoza Capital', slug: 'zaragoza', province: 'Zaragoza', provinceSlug: 'zaragoza', autonomousCommunity: 'Aragón', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true, comarca: 'Comarca Central', distanceFromMentrideKm: 368 },
  { id: 'vas-bilbao', name: 'Bilbao', slug: 'bilbao', province: 'Vizcaya', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true, comarca: 'Gran Bilbao', distanceFromMentrideKm: 435 },
  { id: 'vas-vitoria', name: 'Vitoria-Gasteiz', slug: 'vitoria', province: 'Álava', provinceSlug: 'vitoria', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Llanada Alavesa', distanceFromMentrideKm: 380 },
  { id: 'vas-san-sebas', name: 'San Sebastián - Donostia', slug: 'san-sebastian', province: 'Guipúzcoa', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Donostialdea', distanceFromMentrideKm: 460 },
  { id: 'vas-barakaldo', name: 'Barakaldo', slug: 'barakaldo', province: 'Vizcaya', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Margen Izquierda', distanceFromMentrideKm: 440 },
  { id: 'vas-getxo', name: 'Getxo', slug: 'getxo', province: 'Vizcaya', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Margen Derecha', distanceFromMentrideKm: 440 },
  { id: 'nav-pamplona', name: 'Pamplona - Iruña', slug: 'pamplona', province: 'Navarra', provinceSlug: 'pamplona', autonomousCommunity: 'Comunidad Foral de Navarra', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Cuenca de Pamplona', distanceFromMentrideKm: 400 },
  { id: 'ast-gijon', name: 'Gijón', slug: 'gijon', province: 'Asturias', provinceSlug: 'gijon', autonomousCommunity: 'Principado de Asturias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Comarca de Gijón', distanceFromMentrideKm: 470 },
  { id: 'ast-oviedo', name: 'Oviedo', slug: 'oviedo', province: 'Asturias', provinceSlug: 'oviedo', autonomousCommunity: 'Principado de Asturias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Comarca de Oviedo', distanceFromMentrideKm: 470 },
  { id: 'ast-aviles', name: 'Avilés', slug: 'aviles', province: 'Asturias', provinceSlug: 'oviedo', autonomousCommunity: 'Principado de Asturias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Comarca de Avilés', distanceFromMentrideKm: 480 },
  { id: 'can-santander', name: 'Santander', slug: 'santander', province: 'Cantabria', provinceSlug: 'santander', autonomousCommunity: 'Cantabria', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Comarca de Santander', distanceFromMentrideKm: 480 },
  { id: 'gal-vigo', name: 'Vigo', slug: 'vigo', province: 'Pontevedra', provinceSlug: 'vigo', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Comarca de Vigo', distanceFromMentrideKm: 640 },
  { id: 'gal-coruna', name: 'A Coruña', slug: 'a-coruna', province: 'A Coruña', provinceSlug: 'coruna', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'A Coruña', distanceFromMentrideKm: 620 },
  { id: 'gal-santiago', name: 'Santiago de Compostela', slug: 'santiago-de-compostela', province: 'A Coruña', provinceSlug: 'coruna', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Santiago', distanceFromMentrideKm: 600 },
  { id: 'gal-ourense', name: 'Ourense Capital', slug: 'ourense', province: 'Ourense', provinceSlug: 'orense', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true, comarca: 'Ourense', distanceFromMentrideKm: 520 },
  { id: 'gal-lugo', name: 'Lugo Capital', slug: 'lugo', province: 'Lugo', provinceSlug: 'lugo', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true, comarca: 'Lugo', distanceFromMentrideKm: 560 },
  { id: 'gal-pontevedra', name: 'Pontevedra Capital', slug: 'pontevedra', province: 'Pontevedra', provinceSlug: 'pontevedra', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Pontevedra', distanceFromMentrideKm: 640 },
  { id: 'cyl-valladolid', name: 'Valladolid Capital', slug: 'valladolid', province: 'Valladolid', provinceSlug: 'valladolid', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Comarca de Valladolid', distanceFromMentrideKm: 220 },
  { id: 'cyl-burgos', name: 'Burgos Capital', slug: 'burgos', province: 'Burgos', provinceSlug: 'burgos', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Alfoz de Burgos', distanceFromMentrideKm: 285 },
  { id: 'cyl-salamanca', name: 'Salamanca Capital', slug: 'salamanca', province: 'Salamanca', provinceSlug: 'salamanca', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Campo de Salamanca', distanceFromMentrideKm: 235 },
  { id: 'cyl-leon', name: 'León Capital', slug: 'leon', province: 'León', provinceSlug: 'leon', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Comarca de León', distanceFromMentrideKm: 380 },
  { id: 'cyl-palencia', name: 'Palencia Capital', slug: 'palencia', province: 'Palencia', provinceSlug: 'palma', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Campiña Palentina', distanceFromMentrideKm: 290 },
  { id: 'rio-logrono', name: 'Logroño Capital', slug: 'logrono', province: 'La Rioja', provinceSlug: 'logrono', autonomousCommunity: 'La Rioja', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Rioja Media', distanceFromMentrideKm: 330 },
  { id: 'ext-badajoz', name: 'Badajoz Capital', slug: 'badajoz', province: 'Badajoz', provinceSlug: 'badajoz', autonomousCommunity: 'Extremadura', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Tierra de Badajoz', distanceFromMentrideKm: 400 },
  { id: 'ext-caceres', name: 'Cáceres Capital', slug: 'caceres', province: 'Cáceres', provinceSlug: 'caceres', autonomousCommunity: 'Extremadura', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Tierra de Cáceres', distanceFromMentrideKm: 340 },
  { id: 'bal-palma', name: 'Palma de Mallorca', slug: 'palma-de-mallorca', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true, comarca: 'Mallorca', distanceFromMentrideKm: 600 },
  { id: 'bal-ibiza', name: 'Ibiza / Eivissa', slug: 'ibiza', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true, comarca: 'Ibiza y Formentera', distanceFromMentrideKm: 700 },
  { id: 'can-las-palmas', name: 'Las Palmas de Gran Canaria', slug: 'las-palmas-de-gran-canaria', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Gran Canaria', distanceFromMentrideKm: 1690 },
  { id: 'can-telde', name: 'Telde', slug: 'telde', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Gran Canaria', distanceFromMentrideKm: 1685 },
  { id: 'can-santa-cruz', name: 'Santa Cruz de Tenerife', slug: 'santa-cruz-de-tenerife', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Tenerife', distanceFromMentrideKm: 1711 },
  { id: 'can-la-laguna', name: 'San Cristóbal de La Laguna', slug: 'san-cristobal-de-la-laguna', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Tenerife', distanceFromMentrideKm: 1715 },
  { id: 'can-arona', name: 'Arona', slug: 'arona', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, comarca: 'Tenerife', distanceFromMentrideKm: 1710 },
  { id: 'ceu-ceuta', name: 'Ceuta', slug: 'ceuta', province: 'Ceuta', provinceSlug: 'ceuta', autonomousCommunity: 'Ceuta', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85, isCoreHub: true, comarca: 'Ceuta', distanceFromMentrideKm: 660 },
  { id: 'mel-melilla', name: 'Melilla', slug: 'melilla', province: 'Melilla', provinceSlug: 'melilla', autonomousCommunity: 'Melilla', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85, isCoreHub: true, comarca: 'Melilla', distanceFromMentrideKm: 730 },
  { id: 'clm-albacete', name: 'Albacete Capital', slug: 'albacete', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Los Llanos', distanceFromMentrideKm: 280 },
  { id: 'clm-guadalajara', name: 'Guadalajara Capital', slug: 'guadalajara', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Campiña del Henares', distanceFromMentrideKm: 90 },
  { id: 'clm-toledo', name: 'Toledo Capital', slug: 'toledo', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Comarca de Toledo', distanceFromMentrideKm: 58 },
  { id: 'clm-talavera', name: 'Talavera de la Reina', slug: 'talavera-de-la-reina', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Campana de Oropesa', distanceFromMentrideKm: 82 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TIER 2: CABECERAS COMARCALES Y CIUDADES MEDIANAS (20.000 - 100.000 HAB.)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Madrid Sur & Suroeste
  { id: 'mad-aranjuez', name: 'Aranjuez', slug: 'aranjuez', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Comarca de Las Vegas', distanceFromMentrideKm: 85 },
  { id: 'mad-arganda', name: 'Arganda del Rey', slug: 'arganda-del-rey', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Comarca del Sureste', distanceFromMentrideKm: 70 },
  { id: 'mad-pinto', name: 'Pinto', slug: 'pinto', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Comarca Sur', distanceFromMentrideKm: 52 },
  { id: 'mad-colmenar', name: 'Colmenar Viejo', slug: 'colmenar-viejo', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Cuenca Alta del Manzanares', distanceFromMentrideKm: 70 },
  { id: 'mad-tres-cantos', name: 'Tres Cantos', slug: 'tres-cantos', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 60 },
  { id: 'mad-majadahonda', name: 'Majadahonda', slug: 'majadahonda', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 58 },
  { id: 'mad-boadilla', name: 'Boadilla del Monte', slug: 'boadilla-del-monte', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true, comarca: 'Área Metropolitana de Madrid', distanceFromMentrideKm: 55 },
  { id: 'mad-villalba', name: 'Collado Villalba', slug: 'collado-villalba', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Cuenca del Guadarrama', distanceFromMentrideKm: 72 },
  { id: 'mad-navalcarnero', name: 'Navalcarnero', slug: 'navalcarnero', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Suroeste de Madrid', distanceFromMentrideKm: 19 },
  { id: 'mad-ciempozuelos', name: 'Ciempozuelos', slug: 'ciempozuelos', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Comarca Sur', distanceFromMentrideKm: 60 },
  { id: 'mad-mejorada', name: 'Mejorada del Campo', slug: 'mejorada-del-campo', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 83, comarca: 'Comarca de Las Vegas', distanceFromMentrideKm: 82 },
  { id: 'mad-torrelodones', name: 'Torrelodones', slug: 'torrelodones', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Cuenca del Guadarrama', distanceFromMentrideKm: 68 },
  { id: 'mad-algete', name: 'Algete', slug: 'algete', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'Corredor del Henares', distanceFromMentrideKm: 70 },
  { id: 'mad-arroyomolinos', name: 'Arroyomolinos', slug: 'arroyomolinos', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Suroeste de Madrid', distanceFromMentrideKm: 42 },
  { id: 'mad-san-martin-vega', name: 'San Martín de la Vega', slug: 'san-martin-de-la-vega', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Comarca de Las Vegas', distanceFromMentrideKm: 80 },
  { id: 'mad-humanes', name: 'Humanes de Madrid', slug: 'humanes-de-madrid', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'Suroeste de Madrid', distanceFromMentrideKm: 45 },
  { id: 'mad-villaviciosa', name: 'Villaviciosa de Odón', slug: 'villaviciosa-de-odon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'Suroeste de Madrid', distanceFromMentrideKm: 45 },

  // Toledo & Comarcas Estratégicas (Sagra, Torrijos, La Mancha, Mesa de Ocaña)
  { id: 'tol-illescas', name: 'Illescas', slug: 'illescas', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'La Sagra', distanceFromMentrideKm: 62 },
  { id: 'tol-sesena', name: 'Seseña', slug: 'sesena', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'La Sagra', distanceFromMentrideKm: 68 },
  { id: 'tol-torrijos', name: 'Torrijos', slug: 'torrijos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 35 },
  { id: 'tol-fuensalida', name: 'Fuensalida', slug: 'fuensalida', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 45 },
  { id: 'tol-quintanar', name: 'Quintanar de la Orden', slug: 'quintanar-de-la-orden', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'La Mancha', distanceFromMentrideKm: 115 },
  { id: 'tol-sonseca', name: 'Sonseca', slug: 'sonseca', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'La Sagra', distanceFromMentrideKm: 75 },
  { id: 'tol-madridejos', name: 'Madridejos', slug: 'madridejos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'La Mancha', distanceFromMentrideKm: 140 },
  { id: 'tol-consuegra', name: 'Consuegra', slug: 'consuegra', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'La Mancha', distanceFromMentrideKm: 130 },
  { id: 'tol-mora', name: 'Mora', slug: 'mora', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'La Mancha', distanceFromMentrideKm: 118 },
  { id: 'tol-villacanas', name: 'Villacañas', slug: 'villacanas', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'La Mancha', distanceFromMentrideKm: 150 },
  { id: 'tol-bargas', name: 'Bargas', slug: 'bargas', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 65 },
  { id: 'tol-olias', name: 'Olías del Rey', slug: 'olias-del-rey', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, isCoreHub: true, comarca: 'La Sagra', distanceFromMentrideKm: 70 },
  { id: 'tol-yuncos', name: 'Yuncos', slug: 'yuncos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'La Sagra', distanceFromMentrideKm: 72 },
  { id: 'tol-anover', name: 'Añover de Tajo', slug: 'anover-de-tajo', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 85 },
  { id: 'tol-ocana', name: 'Ocaña', slug: 'ocana', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Mesa de Ocaña', distanceFromMentrideKm: 95 },
  { id: 'tol-corral', name: 'Corral de Almaguer', slug: 'corral-de-almaguer', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83, comarca: 'Mesa de Ocaña', distanceFromMentrideKm: 105 },
  { id: 'tol-puebla-montalban', name: 'La Puebla de Montalbán', slug: 'la-puebla-de-montalban', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 55 },
  { id: 'tol-mocejon', name: 'Mocejón', slug: 'mocejon', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'La Sagra', distanceFromMentrideKm: 75 },
  { id: 'tol-navahermosa', name: 'Navahermosa', slug: 'navahermosa', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83, comarca: 'Montes de Toledo', distanceFromMentrideKm: 95 },
  { id: 'tol-escalona', name: 'Escalona', slug: 'escalona', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Comarca de Escalona', distanceFromMentrideKm: 60 },
  { id: 'tol-yeles', name: 'Yeles', slug: 'yeles', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'La Sagra', distanceFromMentrideKm: 65 },

  // Castilla-La Mancha Resto
  { id: 'clm-puertollano', name: 'Puertollano', slug: 'puertollano', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Valle de Alcudia', distanceFromMentrideKm: 260 },
  { id: 'clm-tomelloso', name: 'Tomelloso', slug: 'tomelloso', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'La Mancha', distanceFromMentrideKm: 175 },
  { id: 'clm-alcazar', name: 'Alcázar de San Juan', slug: 'alcazar-de-san-juan', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Campo de San Juan', distanceFromMentrideKm: 150 },
  { id: 'clm-valdepenas', name: 'Valdepeñas', slug: 'valdepenas', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Valdepeñas', distanceFromMentrideKm: 240 },
  { id: 'clm-manzanares', name: 'Manzanares', slug: 'manzanares', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'La Mancha', distanceFromMentrideKm: 200 },
  { id: 'clm-daimiel', name: 'Daimiel', slug: 'daimiel', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'La Mancha', distanceFromMentrideKm: 215 },
  { id: 'clm-la-roda', name: 'La Roda', slug: 'la-roda', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'Mancha de Montearagón', distanceFromMentrideKm: 270 },
  { id: 'clm-hellin', name: 'Hellín', slug: 'hellin', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Campos de Hellín', distanceFromMentrideKm: 330 },
  { id: 'clm-villarrobledo', name: 'Villarrobledo', slug: 'villarrobledo', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'La Mancha', distanceFromMentrideKm: 220 },
  { id: 'clm-tarancon', name: 'Tarancón', slug: 'tarancon', province: 'Cuenca', provinceSlug: 'cuenca', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Comarca de Tarancón', distanceFromMentrideKm: 120 },
  { id: 'clm-azuqueca', name: 'Azuqueca de Henares', slug: 'azuqueca-de-henares', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Campiña del Henares', distanceFromMentrideKm: 85 },
  { id: 'clm-siguenza', name: 'Sigüenza', slug: 'siguenza', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true, comarca: 'La Alcarria', distanceFromMentrideKm: 155 },
  { id: 'clm-cabanillas', name: 'Cabanillas del Campo', slug: 'cabanillas-del-campo', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Campiña del Henares', distanceFromMentrideKm: 100 },
  { id: 'clm-alovera', name: 'Alovera', slug: 'alovera', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Campiña del Henares', distanceFromMentrideKm: 88 },
  { id: 'clm-el-casar', name: 'El Casar', slug: 'el-casar', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Campiña del Henares', distanceFromMentrideKm: 95 },

  // Andalucía Cabeceras & Costa
  { id: 'and-estepona', name: 'Estepona', slug: 'estepona', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Costa del Sol Occidental', distanceFromMentrideKm: 585 },
  { id: 'and-benalmadena', name: 'Benalmádena', slug: 'benalmadena', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Costa del Sol Occidental', distanceFromMentrideKm: 540 },
  { id: 'and-torremolinos', name: 'Torremolinos', slug: 'torremolinos', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, comarca: 'Costa del Sol Occidental', distanceFromMentrideKm: 535 },
  { id: 'and-alhaurin', name: 'Alhaurín de la Torre', slug: 'alhaurin-de-la-torre', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Valle del Guadalhorce', distanceFromMentrideKm: 545 },
  { id: 'and-antequera', name: 'Antequera', slug: 'antequera', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Antequera', distanceFromMentrideKm: 495 },
  { id: 'and-ronda', name: 'Ronda', slug: 'ronda', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Serranía de Ronda', distanceFromMentrideKm: 585 },
  { id: 'and-nerja', name: 'Nerja', slug: 'nerja', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'La Axarquía', distanceFromMentrideKm: 530 },
  { id: 'and-alcala-guadaira', name: 'Alcalá de Guadaíra', slug: 'alcala-de-guadaira', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Sierra Sur de Sevilla', distanceFromMentrideKm: 530 },
  { id: 'and-utrera', name: 'Utrera', slug: 'utrera', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Campiña de Utrera', distanceFromMentrideKm: 540 },
  { id: 'and-mairena', name: 'Mairena del Aljarafe', slug: 'mairena-del-aljarafe', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Aljarafe', distanceFromMentrideKm: 520 },
  { id: 'and-ecija', name: 'Écija', slug: 'ecija', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Campiña de Écija', distanceFromMentrideKm: 470 },
  { id: 'and-carmona', name: 'Carmona', slug: 'carmona', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Los Alcores', distanceFromMentrideKm: 500 },
  { id: 'and-tomares', name: 'Tomares', slug: 'tomares', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Aljarafe', distanceFromMentrideKm: 518 },
  { id: 'and-bormujos', name: 'Bormujos', slug: 'bormujos', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Aljarafe', distanceFromMentrideKm: 522 },
  { id: 'and-sanlucar', name: 'Sanlúcar de Barrameda', slug: 'sanlucar-de-barrameda', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'Costa Noroeste de Cádiz', distanceFromMentrideKm: 645 },
  { id: 'and-arcos', name: 'Arcos de la Frontera', slug: 'arcos-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, comarca: 'Sierra de Cádiz', distanceFromMentrideKm: 640 },
  { id: 'and-rota', name: 'Rota', slug: 'rota', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Costa Noroeste de Cádiz', distanceFromMentrideKm: 630 },
  { id: 'and-conil', name: 'Conil de la Frontera', slug: 'conil-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true, comarca: 'La Janda', distanceFromMentrideKm: 660 },
  { id: 'and-tarifa', name: 'Tarifa', slug: 'tarifa', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Campo de Gibraltar', distanceFromMentrideKm: 680 },
  { id: 'and-lucena', name: 'Lucena', slug: 'lucena', province: 'Córdoba', provinceSlug: 'cordoba', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Subbética Cordobesa', distanceFromMentrideKm: 445 },
  { id: 'and-puente-genil', name: 'Puente Genil', slug: 'puente-genil', province: 'Córdoba', provinceSlug: 'cordoba', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Campiña Sur de Córdoba', distanceFromMentrideKm: 470 },
  { id: 'and-motril', name: 'Motril', slug: 'motril', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Costa Tropical', distanceFromMentrideKm: 520 },
  { id: 'and-almunecar', name: 'Almuñécar', slug: 'almunecar', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, comarca: 'Costa Tropical', distanceFromMentrideKm: 530 },
  { id: 'and-baza', name: 'Baza', slug: 'baza', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Altiplano de Granada', distanceFromMentrideKm: 455 },
  { id: 'and-linares', name: 'Linares', slug: 'linares', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Sierra Morena', distanceFromMentrideKm: 350 },
  { id: 'and-ubeda', name: 'Úbeda', slug: 'ubeda', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'La Loma', distanceFromMentrideKm: 400 },
  { id: 'and-baeza', name: 'Baeza', slug: 'baeza', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'La Loma', distanceFromMentrideKm: 395 },
  { id: 'and-lepe', name: 'Lepe', slug: 'lepe', province: 'Huelva', provinceSlug: 'huelva', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Costa Occidental de Huelva', distanceFromMentrideKm: 615 },
  { id: 'and-almonte', name: 'Almonte', slug: 'almonte', province: 'Huelva', provinceSlug: 'huelva', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true, comarca: 'El Condado', distanceFromMentrideKm: 605 },

  // Levante & Cataluña
  { id: 'cat-sitges', name: 'Sitges', slug: 'sitges', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true, comarca: 'Garraf', distanceFromMentrideKm: 650 },
  { id: 'cat-vilafranca', name: 'Vilafranca del Penedès', slug: 'vilafranca-del-penedes', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, comarca: 'Alt Penedès', distanceFromMentrideKm: 630 },
  { id: 'cat-blanes', name: 'Blanes', slug: 'blanes', province: 'Gerona', provinceSlug: 'gerona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Selva', distanceFromMentrideKm: 690 },
  { id: 'cat-lloret', name: 'Lloret de Mar', slug: 'lloret-de-mar', province: 'Gerona', provinceSlug: 'gerona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Selva', distanceFromMentrideKm: 685 },
  { id: 'cat-salou', name: 'Salou', slug: 'salou', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Tarragonès', distanceFromMentrideKm: 545 },
  { id: 'cat-cambrils', name: 'Cambrils', slug: 'cambrils', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, comarca: 'Baix Camp', distanceFromMentrideKm: 545 },
  { id: 'val-sagunto', name: 'Sagunto', slug: 'sagunto', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Camp de Morvedre', distanceFromMentrideKm: 420 },
  { id: 'val-alzira', name: 'Alzira', slug: 'alzira', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Ribera Alta', distanceFromMentrideKm: 430 },
  { id: 'val-cullera', name: 'Cullera', slug: 'cullera', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Ribera Baixa', distanceFromMentrideKm: 445 },
  { id: 'val-requena', name: 'Requena', slug: 'requena', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true, comarca: 'Requena-Utiel', distanceFromMentrideKm: 330 },
  { id: 'val-denia', name: 'Dénia', slug: 'denia', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true, comarca: 'Marina Alta', distanceFromMentrideKm: 480 },
  { id: 'val-javea', name: 'Jávea / Xàbia', slug: 'javea', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Marina Alta', distanceFromMentrideKm: 490 },
  { id: 'val-calpe', name: 'Calpe / Calp', slug: 'calpe', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Marina Alta', distanceFromMentrideKm: 485 },
  { id: 'val-altea', name: 'Altea', slug: 'altea', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Marina Baixa', distanceFromMentrideKm: 490 },
  { id: 'val-villajoyosa', name: 'Villajoyosa', slug: 'villajoyosa', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Marina Baixa', distanceFromMentrideKm: 470 },
  { id: 'val-elda', name: 'Elda', slug: 'elda', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Vinalopó Mitjà', distanceFromMentrideKm: 440 },
  { id: 'val-benidorm', name: 'Benidorm', slug: 'benidorm', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true, comarca: 'Marina Baixa', distanceFromMentrideKm: 480 },
  { id: 'mur-aguilas', name: 'Águilas', slug: 'aguilas', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Bajo Guadalentín', distanceFromMentrideKm: 460 },
  { id: 'mur-yecla', name: 'Yecla', slug: 'yecla', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Altiplano', distanceFromMentrideKm: 330 },
  { id: 'mur-caravaca', name: 'Caravaca de la Cruz', slug: 'caravaca-de-la-cruz', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true, comarca: 'Noroeste', distanceFromMentrideKm: 390 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TIER 3: MICRO-UBICACIONES DE FINCAS, BODAS DE LUJO & FIESTAS LOCALES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Sierra de Madrid & Comarca Oeste
  { id: 'mad-escorial-san', name: 'San Lorenzo de El Escorial', slug: 'san-lorenzo-de-el-escorial', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true, comarca: 'Sierra de Guadarrama', distanceFromMentrideKm: 80 },
  { id: 'mad-escorial-el', name: 'El Escorial', slug: 'el-escorial', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, comarca: 'Sierra de Guadarrama', distanceFromMentrideKm: 78 },
  { id: 'mad-guadarrama', name: 'Guadarrama', slug: 'guadarrama', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Sierra de Guadarrama', distanceFromMentrideKm: 72 },
  { id: 'mad-alpedrete', name: 'Alpedrete', slug: 'alpedrete', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Sierra de Guadarrama', distanceFromMentrideKm: 70 },
  { id: 'mad-moralzarzal', name: 'Moralzarzal', slug: 'moralzarzal', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Sierra de Guadarrama', distanceFromMentrideKm: 72 },
  { id: 'mad-manzanares-real', name: 'Manzanares el Real', slug: 'manzanares-el-real', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, comarca: 'Cuenca Alta del Manzanares', distanceFromMentrideKm: 78 },
  { id: 'mad-soto-del-real', name: 'Soto del Real', slug: 'soto-del-real', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Cuenca Alta del Manzanares', distanceFromMentrideKm: 80 },
  { id: 'mad-miraflores', name: 'Miraflores de la Sierra', slug: 'miraflores-de-la-sierra', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Cuenca Alta del Manzanares', distanceFromMentrideKm: 85 },
  { id: 'mad-chinchon', name: 'Chinchón', slug: 'chinchon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Comarca de Las Vegas', distanceFromMentrideKm: 70 },
  { id: 'mad-san-martin-valde', name: 'San Martín de Valdeiglesias', slug: 'san-martin-de-valdeiglesias', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Sierra Oeste', distanceFromMentrideKm: 65 },
  { id: 'mad-villa-del-prado', name: 'Villa del Prado', slug: 'villa-del-prado', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Sierra Oeste', distanceFromMentrideKm: 55 },
  { id: 'mad-cadalso', name: 'Cadalso de los Vidrios', slug: 'cadalso-de-los-vidrios', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Sierra Oeste', distanceFromMentrideKm: 70 },
  { id: 'mad-aldea-fresno', name: 'Aldea del Fresno', slug: 'aldea-del-fresno', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Sierra Oeste', distanceFromMentrideKm: 45 },
  { id: 'mad-pelayos', name: 'Pelayos de la Presa', slug: 'pelayos-de-la-presa', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Sierra Oeste', distanceFromMentrideKm: 52 },

  // Toledo (Ruta de Fincas & Viñedos - HUB CENTRAL EAR)
  { id: 'tol-mentrida', name: 'Méntrida (Hub Central EAR)', slug: 'mentrida', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 0 },
  { id: 'tol-esquivias', name: 'Esquivias', slug: 'esquivias', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'La Sagra', distanceFromMentrideKm: 62 },
  { id: 'tol-ugena', name: 'Ugena', slug: 'ugena', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'La Sagra', distanceFromMentrideKm: 68 },
  { id: 'tol-carranque', name: 'Carranque', slug: 'carranque', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'La Sagra', distanceFromMentrideKm: 66 },
  { id: 'tol-numancia', name: 'Numancia de la Sagra', slug: 'numancia-de-la-sagra', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'La Sagra', distanceFromMentrideKm: 70 },
  { id: 'tol-casarrubios', name: 'Casarrubios del Monte', slug: 'casarrubios-del-monte', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'La Sagra', distanceFromMentrideKm: 58 },
  { id: 'tol-valmojado', name: 'Valmojado', slug: 'valmojado', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, isCoreHub: true, comarca: 'La Sagra', distanceFromMentrideKm: 52 },
  { id: 'tol-ventas-retamosa', name: 'Las Ventas de Retamosa', slug: 'las-ventas-de-retamosa', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'La Sagra', distanceFromMentrideKm: 55 },
  { id: 'tol-camarena', name: 'Camarena', slug: 'camarena', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 55 },
  { id: 'tol-chozas-canales', name: 'Chozas de Canales', slug: 'chozas-de-canales', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84, comarca: 'Campana de Oropesa', distanceFromMentrideKm: 100 },
  { id: 'tol-santa-cruz-retamar', name: 'Santa Cruz del Retamar', slug: 'santa-cruz-de-retamar', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 12 },
  { id: 'tol-almorox', name: 'Almorox', slug: 'almorox', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Campana de Oropesa', distanceFromMentrideKm: 65 },
  { id: 'tol-hormigos', name: 'Hormigos', slug: 'hormigos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 40 },
  { id: 'tol-maqueda', name: 'Maqueda', slug: 'maqueda', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 30 },
  { id: 'tol-otero', name: 'Otero', slug: 'otero', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 82, comarca: 'Comarca de Torrijos', distanceFromMentrideKm: 35 },

  // Ávila y Segovia (Eventos de Destino Cercanos a Madrid)
  { id: 'avi-el-tiemblo', name: 'El Tiemblo', slug: 'el-tiemblo', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87, comarca: 'Comarca de El Tiemblo', distanceFromMentrideKm: 105 },
  { id: 'avi-cebreros', name: 'Cebreros', slug: 'cebreros', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86, comarca: 'Alto Alberche', distanceFromMentrideKm: 110 },
  { id: 'avi-navas-marques', name: 'Las Navas del Marqués', slug: 'las-navas-del-marques', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Alto Alberche', distanceFromMentrideKm: 120 },
  { id: 'avi-arenas-san-pedro', name: 'Arenas de San Pedro', slug: 'arenas-de-san-pedro', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true, comarca: 'Valle del Tiétar', distanceFromMentrideKm: 170 },
  { id: 'avi-candeleda', name: 'Candeleda', slug: 'candeleda', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Valle del Tiétar', distanceFromMentrideKm: 160 },
  { id: 'seg-la-granja', name: 'Real Sitio de San Ildefonso / La Granja', slug: 'real-sitio-de-san-ildefonso', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Sierra de Guadarrama', distanceFromMentrideKm: 95 },
  { id: 'seg-pedraza', name: 'Pedraza', slug: 'pedraza', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Sierra de Pedraza', distanceFromMentrideKm: 130 },
  { id: 'seg-sepulveda', name: 'Sepúlveda', slug: 'sepulveda', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, comarca: 'Sepúlveda', distanceFromMentrideKm: 150 },
  { id: 'seg-ayllon', name: 'Ayllón', slug: 'ayllon', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, comarca: 'Ayllón', distanceFromMentrideKm: 170 },
  { id: 'seg-cuellar', name: 'Cuéllar', slug: 'cuellar', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, comarca: 'Tierra de Pinares', distanceFromMentrideKm: 175 },

  // Baleares y Canarias Destino de Lujo
  { id: 'bal-sant-antoni', name: 'Sant Antoni de Portmany', slug: 'sant-antoni-de-portmany', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, comarca: 'Ibiza y Formentera', distanceFromMentrideKm: 705 },
  { id: 'bal-santa-eularia', name: 'Santa Eulària des Riu', slug: 'santa-eularia-des-riu', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Ibiza y Formentera', distanceFromMentrideKm: 700 },
  { id: 'bal-calvia', name: 'Calvià', slug: 'calvia', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Ponent de Mallorca', distanceFromMentrideKm: 610 },
  { id: 'bal-andratx', name: 'Andratx', slug: 'andratx', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, comarca: 'Ponent de Mallorca', distanceFromMentrideKm: 615 },
  { id: 'bal-alcudia', name: 'Alcúdia', slug: 'alcudia', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, comarca: 'Nord de Mallorca', distanceFromMentrideKm: 640 },
  { id: 'bal-pollensa', name: 'Pollença', slug: 'pollenca', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, comarca: 'Serra de Tramuntana', distanceFromMentrideKm: 650 },
  { id: 'can-adeje', name: 'Adeje', slug: 'adeje', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true, comarca: 'Tenerife', distanceFromMentrideKm: 1715 },
  { id: 'can-san-bartolome', name: 'San Bartolomé de Tirajana / Maspalomas', slug: 'san-bartolome-de-tirajana', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true, comarca: 'Gran Canaria', distanceFromMentrideKm: 1700 },
  { id: 'can-mogan', name: 'Mogán', slug: 'mogan', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, comarca: 'Gran Canaria', distanceFromMentrideKm: 1710 }
];

// Alias para compatibilidad hacia atrás
export const SPANISH_MUNICIPALITIES = MUNICIPALITIES_DATABASE;

/**
 * Generador de Slugs Dinámicos para pSEO
 */
export function generatePseoSlugs() {
  const routes: { params: { service: string; province: string; municipality: string } }[] = [];

  SERVICES_DATABASE.forEach((service) => {
    MUNICIPALITIES_DATABASE.forEach((muni) => {
      routes.push({
        params: {
          service: service.slug,
          province: muni.provinceSlug,
          municipality: muni.slug,
        },
      });
    });
  });

  return routes;
}

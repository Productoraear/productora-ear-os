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
  { id: 'mad-madrid', name: 'Madrid Capital', slug: 'madrid', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 100, isCoreHub: true },
  { id: 'mad-mostoles', name: 'Móstoles', slug: 'mostoles', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'mad-alcala', name: 'Alcalá de Henares', slug: 'alcala-de-henares', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'mad-fuenlabrada', name: 'Fuenlabrada', slug: 'fuenlabrada', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'mad-leganes', name: 'Leganés', slug: 'leganes', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'mad-getafe', name: 'Getafe', slug: 'getafe', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'mad-alcorcon', name: 'Alcorcón', slug: 'alcorcon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'mad-parla', name: 'Parla', slug: 'parla', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'mad-torrejon', name: 'Torrejón de Ardoz', slug: 'torrejon-de-ardoz', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true },
  { id: 'mad-alcobendas', name: 'Alcobendas', slug: 'alcobendas', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'mad-las-rozas', name: 'Las Rozas de Madrid', slug: 'las-rozas', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'mad-san-sebas', name: 'San Sebastián de los Reyes', slug: 'san-sebastian-de-los-reyes', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'mad-pozuelo', name: 'Pozuelo de Alarcón', slug: 'pozuelo-de-alarcon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true },
  { id: 'mad-coslada', name: 'Coslada', slug: 'coslada', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'mad-valdemoro', name: 'Valdemoro', slug: 'valdemoro', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },

  // Cataluña
  { id: 'cat-barcelona', name: 'Barcelona Capital', slug: 'barcelona', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 100, isCoreHub: true },
  { id: 'cat-hospitalet', name: "L'Hospitalet de Llobregat", slug: 'hospitalet-de-llobregat', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'cat-badalona', name: 'Badalona', slug: 'badalona', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'cat-terrassa', name: 'Terrassa', slug: 'terrassa', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'cat-sabadell', name: 'Sabadell', slug: 'sabadell', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'cat-mataro', name: 'Mataró', slug: 'mataro', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'cat-santa-coloma', name: 'Santa Coloma de Gramenet', slug: 'santa-coloma-de-gramenet', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'cat-sant-cugat', name: 'Sant Cugat del Vallès', slug: 'sant-cugat-del-valles', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'cat-cornella', name: 'Cornellà de Llobregat', slug: 'cornella-de-llobregat', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'cat-sant-boi', name: 'Sant Boi de Llobregat', slug: 'sant-boi-de-llobregat', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'cat-rubi', name: 'Rubí', slug: 'rubi', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'cat-manresa', name: 'Manresa', slug: 'manresa', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'cat-tarragona', name: 'Tarragona Capital', slug: 'tarragona', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'cat-reus', name: 'Reus', slug: 'reus', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'cat-lleida', name: 'Lleida Capital', slug: 'lleida', province: 'Lérida', provinceSlug: 'lerida', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true },
  { id: 'cat-girona', name: 'Girona Capital', slug: 'girona', province: 'Gerona', provinceSlug: 'gerona', autonomousCommunity: 'Cataluña', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },

  // Comunidad Valenciana & Murcia
  { id: 'val-valencia', name: 'Valencia Capital', slug: 'valencia', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true },
  { id: 'val-torrent', name: 'Torrent', slug: 'torrent', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'val-gandia', name: 'Gandía', slug: 'gandia', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'val-alicante', name: 'Alicante Capital', slug: 'alicante', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'val-elche', name: 'Elche', slug: 'elche', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'val-torrevieja', name: 'Torrevieja', slug: 'torrevieja', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'val-orihuela', name: 'Orihuela', slug: 'orihuela', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'val-castellon', name: 'Castellón de la Plana', slug: 'castellon', province: 'Castellón', provinceSlug: 'castellon', autonomousCommunity: 'Comunidad Valenciana', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'mur-murcia', name: 'Murcia Capital', slug: 'murcia', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'mur-cartagena', name: 'Cartagena', slug: 'cartagena', province: 'Murcia', provinceSlug: 'cartagena', autonomousCommunity: 'Región de Murcia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'mur-lorca', name: 'Lorca', slug: 'lorca', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },

  // Andalucía
  { id: 'and-sevilla', name: 'Sevilla Capital', slug: 'sevilla', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true },
  { id: 'and-dos-hermanas', name: 'Dos Hermanas', slug: 'dos-hermanas', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'and-malaga', name: 'Málaga Capital', slug: 'malaga', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true },
  { id: 'and-marbella', name: 'Marbella', slug: 'marbella', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true },
  { id: 'and-mijas', name: 'Mijas', slug: 'mijas', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'and-velez-malaga', name: 'Vélez-Málaga', slug: 'velez-malaga', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'and-fuengirola', name: 'Fuengirola', slug: 'fuengirola', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'and-cordoba', name: 'Córdoba Capital', slug: 'cordoba', province: 'Córdoba', provinceSlug: 'cordoba', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'and-granada', name: 'Granada Capital', slug: 'granada', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'and-jerez', name: 'Jerez de la Frontera', slug: 'jerez-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'and-algeciras', name: 'Algeciras', slug: 'algeciras', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'and-cadiz', name: 'Cádiz Capital', slug: 'cadiz', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'and-san-fernando', name: 'San Fernando', slug: 'san-fernando', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'and-el-puerto', name: 'El Puerto de Santa María', slug: 'el-puerto-de-santa-maria', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'and-chiclana', name: 'Chiclana de la Frontera', slug: 'chiclana-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'and-almeria', name: 'Almería Capital', slug: 'almeria', province: 'Almería', provinceSlug: 'almeria', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'and-roquetas', name: 'Roquetas de Mar', slug: 'roquetas-de-mar', province: 'Almería', provinceSlug: 'almeria', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'and-el-ejido', name: 'El Ejido', slug: 'el-ejido', province: 'Almería', provinceSlug: 'almeria', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'and-huelva', name: 'Huelva Capital', slug: 'huelva', province: 'Huelva', provinceSlug: 'huelva', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'and-jaen', name: 'Jaén Capital', slug: 'jaen', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },

  // Aragón, Norte, Castilla y León, Baleares y Canarias
  { id: 'ara-zaragoza', name: 'Zaragoza Capital', slug: 'zaragoza', province: 'Zaragoza', provinceSlug: 'zaragoza', autonomousCommunity: 'Aragón', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true },
  { id: 'vas-bilbao', name: 'Bilbao', slug: 'bilbao', province: 'Vizcaya', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true },
  { id: 'vas-vitoria', name: 'Vitoria-Gasteiz', slug: 'vitoria', province: 'Álava', provinceSlug: 'vitoria', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'vas-san-sebas', name: 'San Sebastián - Donostia', slug: 'san-sebastian', province: 'Guipúzcoa', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'vas-barakaldo', name: 'Barakaldo', slug: 'barakaldo', province: 'Vizcaya', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'vas-getxo', name: 'Getxo', slug: 'getxo', province: 'Vizcaya', provinceSlug: 'bilbao', autonomousCommunity: 'País Vasco', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'nav-pamplona', name: 'Pamplona - Iruña', slug: 'pamplona', province: 'Navarra', provinceSlug: 'pamplona', autonomousCommunity: 'Comunidad Foral de Navarra', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'ast-gijon', name: 'Gijón', slug: 'gijon', province: 'Asturias', provinceSlug: 'gijon', autonomousCommunity: 'Principado de Asturias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'ast-oviedo', name: 'Oviedo', slug: 'oviedo', province: 'Asturias', provinceSlug: 'oviedo', autonomousCommunity: 'Principado de Asturias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'ast-aviles', name: 'Avilés', slug: 'aviles', province: 'Asturias', provinceSlug: 'oviedo', autonomousCommunity: 'Principado de Asturias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'can-santander', name: 'Santander', slug: 'santander', province: 'Cantabria', provinceSlug: 'santander', autonomousCommunity: 'Cantabria', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'gal-vigo', name: 'Vigo', slug: 'vigo', province: 'Pontevedra', provinceSlug: 'vigo', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'gal-coruna', name: 'A Coruña', slug: 'a-coruna', province: 'A Coruña', provinceSlug: 'coruna', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'gal-santiago', name: 'Santiago de Compostela', slug: 'santiago-de-compostela', province: 'A Coruña', provinceSlug: 'coruna', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'gal-ourense', name: 'Ourense Capital', slug: 'ourense', province: 'Ourense', provinceSlug: 'orense', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true },
  { id: 'gal-lugo', name: 'Lugo Capital', slug: 'lugo', province: 'Lugo', provinceSlug: 'lugo', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true },
  { id: 'gal-pontevedra', name: 'Pontevedra Capital', slug: 'pontevedra', province: 'Pontevedra', provinceSlug: 'pontevedra', autonomousCommunity: 'Galicia', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'cyl-valladolid', name: 'Valladolid Capital', slug: 'valladolid', province: 'Valladolid', provinceSlug: 'valladolid', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'cyl-burgos', name: 'Burgos Capital', slug: 'burgos', province: 'Burgos', provinceSlug: 'burgos', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'cyl-salamanca', name: 'Salamanca Capital', slug: 'salamanca', province: 'Salamanca', provinceSlug: 'salamanca', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'cyl-leon', name: 'León Capital', slug: 'leon', province: 'León', provinceSlug: 'leon', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'cyl-palencia', name: 'Palencia Capital', slug: 'palencia', province: 'Palencia', provinceSlug: 'palma', autonomousCommunity: 'Castilla y León', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'rio-logrono', name: 'Logroño Capital', slug: 'logrono', province: 'La Rioja', provinceSlug: 'logrono', autonomousCommunity: 'La Rioja', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'ext-badajoz', name: 'Badajoz Capital', slug: 'badajoz', province: 'Badajoz', provinceSlug: 'badajoz', autonomousCommunity: 'Extremadura', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'ext-caceres', name: 'Cáceres Capital', slug: 'caceres', province: 'Cáceres', provinceSlug: 'caceres', autonomousCommunity: 'Extremadura', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'bal-palma', name: 'Palma de Mallorca', slug: 'palma-de-mallorca', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true },
  { id: 'bal-ibiza', name: 'Ibiza / Eivissa', slug: 'ibiza', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true },
  { id: 'can-las-palmas', name: 'Las Palmas de Gran Canaria', slug: 'las-palmas-de-gran-canaria', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'can-telde', name: 'Telde', slug: 'telde', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'can-santa-cruz', name: 'Santa Cruz de Tenerife', slug: 'santa-cruz-de-tenerife', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'can-la-laguna', name: 'San Cristóbal de La Laguna', slug: 'san-cristobal-de-la-laguna', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'can-arona', name: 'Arona', slug: 'arona', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91 },
  { id: 'ceu-ceuta', name: 'Ceuta', slug: 'ceuta', province: 'Ceuta', provinceSlug: 'ceuta', autonomousCommunity: 'Ceuta', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85, isCoreHub: true },
  { id: 'mel-melilla', name: 'Melilla', slug: 'melilla', province: 'Melilla', provinceSlug: 'melilla', autonomousCommunity: 'Melilla', tier: 1, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 85, isCoreHub: true },
  { id: 'clm-albacete', name: 'Albacete Capital', slug: 'albacete', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'clm-guadalajara', name: 'Guadalajara Capital', slug: 'guadalajara', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'clm-toledo', name: 'Toledo Capital', slug: 'toledo', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'clm-talavera', name: 'Talavera de la Reina', slug: 'talavera-de-la-reina', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 1, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TIER 2: CABECERAS COMARCALES Y CIUDADES MEDIANAS (20.000 - 100.000 HAB.)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Madrid Sur & Suroeste
  { id: 'mad-aranjuez', name: 'Aranjuez', slug: 'aranjuez', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'mad-arganda', name: 'Arganda del Rey', slug: 'arganda-del-rey', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'mad-pinto', name: 'Pinto', slug: 'pinto', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'mad-colmenar', name: 'Colmenar Viejo', slug: 'colmenar-viejo', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'mad-tres-cantos', name: 'Tres Cantos', slug: 'tres-cantos', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'mad-majadahonda', name: 'Majadahonda', slug: 'majadahonda', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'mad-boadilla', name: 'Boadilla del Monte', slug: 'boadilla-del-monte', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true },
  { id: 'mad-villalba', name: 'Collado Villalba', slug: 'collado-villalba', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'mad-navalcarnero', name: 'Navalcarnero', slug: 'navalcarnero', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'mad-ciempozuelos', name: 'Ciempozuelos', slug: 'ciempozuelos', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'mad-mejorada', name: 'Mejorada del Campo', slug: 'mejorada-del-campo', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: false, hasPatronalEvents: true, searchIntentScore: 83 },
  { id: 'mad-torrelodones', name: 'Torrelodones', slug: 'torrelodones', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'mad-algete', name: 'Algete', slug: 'algete', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'mad-arroyomolinos', name: 'Arroyomolinos', slug: 'arroyomolinos', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'mad-san-martin-vega', name: 'San Martín de la Vega', slug: 'san-martin-de-la-vega', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'mad-humanes', name: 'Humanes de Madrid', slug: 'humanes-de-madrid', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'mad-villaviciosa', name: 'Villaviciosa de Odón', slug: 'villaviciosa-de-odon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },

  // Toledo & Comarcas Estratégicas (Sagra, Torrijos, La Mancha, Mesa de Ocaña)
  { id: 'tol-illescas', name: 'Illescas', slug: 'illescas', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'tol-sesena', name: 'Seseña', slug: 'sesena', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'tol-torrijos', name: 'Torrijos', slug: 'torrijos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'tol-fuensalida', name: 'Fuensalida', slug: 'fuensalida', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'tol-quintanar', name: 'Quintanar de la Orden', slug: 'quintanar-de-la-orden', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'tol-sonseca', name: 'Sonseca', slug: 'sonseca', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'tol-madridejos', name: 'Madridejos', slug: 'madridejos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-consuegra', name: 'Consuegra', slug: 'consuegra', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'tol-mora', name: 'Mora', slug: 'mora', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-villacanas', name: 'Villacañas', slug: 'villacanas', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'tol-bargas', name: 'Bargas', slug: 'bargas', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'tol-olias', name: 'Olías del Rey', slug: 'olias-del-rey', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, isCoreHub: true },
  { id: 'tol-yuncos', name: 'Yuncos', slug: 'yuncos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'tol-anover', name: 'Añover de Tajo', slug: 'anover-de-tajo', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83 },
  { id: 'tol-ocana', name: 'Ocaña', slug: 'ocana', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'tol-corral', name: 'Corral de Almaguer', slug: 'corral-de-almaguer', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83 },
  { id: 'tol-puebla-montalban', name: 'La Puebla de Montalbán', slug: 'la-puebla-de-montalban', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-mocejon', name: 'Mocejón', slug: 'mocejon', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'tol-navahermosa', name: 'Navahermosa', slug: 'navahermosa', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83 },
  { id: 'tol-escalona', name: 'Escalona', slug: 'escalona', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'tol-yeles', name: 'Yeles', slug: 'yeles', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },

  // Castilla-La Mancha Resto
  { id: 'clm-puertollano', name: 'Puertollano', slug: 'puertollano', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'clm-tomelloso', name: 'Tomelloso', slug: 'tomelloso', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'clm-alcazar', name: 'Alcázar de San Juan', slug: 'alcazar-de-san-juan', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'clm-valdepenas', name: 'Valdepeñas', slug: 'valdepenas', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'clm-manzanares', name: 'Manzanares', slug: 'manzanares', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'clm-daimiel', name: 'Daimiel', slug: 'daimiel', province: 'Ciudad Real', provinceSlug: 'ciudad-real', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'clm-la-roda', name: 'La Roda', slug: 'la-roda', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'clm-hellin', name: 'Hellín', slug: 'hellin', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'clm-villarrobledo', name: 'Villarrobledo', slug: 'villarrobledo', province: 'Albacete', provinceSlug: 'albacete', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'clm-tarancon', name: 'Tarancón', slug: 'tarancon', province: 'Cuenca', provinceSlug: 'cuenca', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'clm-azuqueca', name: 'Azuqueca de Henares', slug: 'azuqueca-de-henares', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'clm-siguenza', name: 'Sigüenza', slug: 'siguenza', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true },
  { id: 'clm-cabanillas', name: 'Cabanillas del Campo', slug: 'cabanillas-del-campo', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'clm-alovera', name: 'Alovera', slug: 'alovera', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'clm-el-casar', name: 'El Casar', slug: 'el-casar', province: 'Guadalajara', provinceSlug: 'guadalajara', autonomousCommunity: 'Castilla-La Mancha', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },

  // Andalucía Cabeceras & Costa
  { id: 'and-estepona', name: 'Estepona', slug: 'estepona', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'and-benalmadena', name: 'Benalmádena', slug: 'benalmadena', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'and-torremolinos', name: 'Torremolinos', slug: 'torremolinos', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91 },
  { id: 'and-alhaurin', name: 'Alhaurín de la Torre', slug: 'alhaurin-de-la-torre', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'and-antequera', name: 'Antequera', slug: 'antequera', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'and-ronda', name: 'Ronda', slug: 'ronda', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'and-nerja', name: 'Nerja', slug: 'nerja', province: 'Málaga', provinceSlug: 'malaga', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'and-alcala-guadaira', name: 'Alcalá de Guadaíra', slug: 'alcala-de-guadaira', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'and-utrera', name: 'Utrera', slug: 'utrera', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'and-mairena', name: 'Mairena del Aljarafe', slug: 'mairena-del-aljarafe', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'and-ecija', name: 'Écija', slug: 'ecija', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'and-carmona', name: 'Carmona', slug: 'carmona', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'and-tomares', name: 'Tomares', slug: 'tomares', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'and-bormujos', name: 'Bormujos', slug: 'bormujos', province: 'Sevilla', provinceSlug: 'sevilla', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'and-sanlucar', name: 'Sanlúcar de Barrameda', slug: 'sanlucar-de-barrameda', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'and-arcos', name: 'Arcos de la Frontera', slug: 'arcos-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91 },
  { id: 'and-rota', name: 'Rota', slug: 'rota', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'and-conil', name: 'Conil de la Frontera', slug: 'conil-de-la-frontera', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93, isCoreHub: true },
  { id: 'and-tarifa', name: 'Tarifa', slug: 'tarifa', province: 'Cádiz', provinceSlug: 'cadiz', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'and-lucena', name: 'Lucena', slug: 'lucena', province: 'Córdoba', provinceSlug: 'cordoba', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'and-puente-genil', name: 'Puente Genil', slug: 'puente-genil', province: 'Córdoba', provinceSlug: 'cordoba', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'and-motril', name: 'Motril', slug: 'motril', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'and-almunecar', name: 'Almuñécar', slug: 'almunecar', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91 },
  { id: 'and-baza', name: 'Baza', slug: 'baza', province: 'Granada', provinceSlug: 'granada', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'and-linares', name: 'Linares', slug: 'linares', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'and-ubeda', name: 'Úbeda', slug: 'ubeda', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },
  { id: 'and-baeza', name: 'Baeza', slug: 'baeza', province: 'Jaén', provinceSlug: 'jaen', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },
  { id: 'and-lepe', name: 'Lepe', slug: 'lepe', province: 'Huelva', provinceSlug: 'huelva', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'and-almonte', name: 'Almonte', slug: 'almonte', province: 'Huelva', provinceSlug: 'huelva', autonomousCommunity: 'Andalucía', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92, isCoreHub: true },

  // Levante & Cataluña
  { id: 'cat-sitges', name: 'Sitges', slug: 'sitges', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 98, isCoreHub: true },
  { id: 'cat-vilafranca', name: 'Vilafranca del Penedès', slug: 'vilafranca-del-penedes', province: 'Barcelona', provinceSlug: 'barcelona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91 },
  { id: 'cat-blanes', name: 'Blanes', slug: 'blanes', province: 'Gerona', provinceSlug: 'gerona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'cat-lloret', name: 'Lloret de Mar', slug: 'lloret-de-mar', province: 'Gerona', provinceSlug: 'gerona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'cat-salou', name: 'Salou', slug: 'salou', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'cat-cambrils', name: 'Cambrils', slug: 'cambrils', province: 'Tarragona', provinceSlug: 'tarragona', autonomousCommunity: 'Cataluña', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91 },
  { id: 'val-sagunto', name: 'Sagunto', slug: 'sagunto', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'val-alzira', name: 'Alzira', slug: 'alzira', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'val-cullera', name: 'Cullera', slug: 'cullera', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'val-requena', name: 'Requena', slug: 'requena', province: 'Valencia', provinceSlug: 'valencia', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89, isCoreHub: true },
  { id: 'val-denia', name: 'Dénia', slug: 'denia', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94, isCoreHub: true },
  { id: 'val-javea', name: 'Jávea / Xàbia', slug: 'javea', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'val-calpe', name: 'Calpe / Calp', slug: 'calpe', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'val-altea', name: 'Altea', slug: 'altea', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'val-villajoyosa', name: 'Villajoyosa', slug: 'villajoyosa', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'val-elda', name: 'Elda', slug: 'elda', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'val-benidorm', name: 'Benidorm', slug: 'benidorm', province: 'Alicante', provinceSlug: 'alicante', autonomousCommunity: 'Comunidad Valenciana', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true },
  { id: 'mur-aguilas', name: 'Águilas', slug: 'aguilas', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'mur-yecla', name: 'Yecla', slug: 'yecla', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'mur-caravaca', name: 'Caravaca de la Cruz', slug: 'caravaca-de-la-cruz', province: 'Murcia', provinceSlug: 'murcia', autonomousCommunity: 'Región de Murcia', tier: 2, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91, isCoreHub: true },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TIER 3: MICRO-UBICACIONES DE FINCAS, BODAS DE LUJO & FIESTAS LOCALES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Sierra de Madrid & Comarca Oeste
  { id: 'mad-escorial-san', name: 'San Lorenzo de El Escorial', slug: 'san-lorenzo-de-el-escorial', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 97, isCoreHub: true },
  { id: 'mad-escorial-el', name: 'El Escorial', slug: 'el-escorial', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 92 },
  { id: 'mad-guadarrama', name: 'Guadarrama', slug: 'guadarrama', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'mad-alpedrete', name: 'Alpedrete', slug: 'alpedrete', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'mad-moralzarzal', name: 'Moralzarzal', slug: 'moralzarzal', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'mad-manzanares-real', name: 'Manzanares el Real', slug: 'manzanares-el-real', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 91 },
  { id: 'mad-soto-del-real', name: 'Soto del Real', slug: 'soto-del-real', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'mad-miraflores', name: 'Miraflores de la Sierra', slug: 'miraflores-de-la-sierra', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'mad-chinchon', name: 'Chinchón', slug: 'chinchon', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'mad-san-martin-valde', name: 'San Martín de Valdeiglesias', slug: 'san-martin-de-valdeiglesias', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'mad-villa-del-prado', name: 'Villa del Prado', slug: 'villa-del-prado', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'mad-cadalso', name: 'Cadalso de los Vidrios', slug: 'cadalso-de-los-vidrios', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'mad-aldea-fresno', name: 'Aldea del Fresno', slug: 'aldea-del-fresno', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'mad-pelayos', name: 'Pelayos de la Presa', slug: 'pelayos-de-la-presa', province: 'Madrid', provinceSlug: 'madrid', autonomousCommunity: 'Comunidad de Madrid', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },

  // Toledo (Ruta de Fincas & Viñedos - HUB CENTRAL EAR)
  { id: 'tol-mentrida', name: 'Méntrida (Hub Central EAR)', slug: 'mentrida', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 99, isCoreHub: true },
  { id: 'tol-esquivias', name: 'Esquivias', slug: 'esquivias', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'tol-ugena', name: 'Ugena', slug: 'ugena', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-carranque', name: 'Carranque', slug: 'carranque', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'tol-numancia', name: 'Numancia de la Sagra', slug: 'numancia-de-la-sagra', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-casarrubios', name: 'Casarrubios del Monte', slug: 'casarrubios-del-monte', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'tol-valmojado', name: 'Valmojado', slug: 'valmojado', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88, isCoreHub: true },
  { id: 'tol-ventas-retamosa', name: 'Las Ventas de Retamosa', slug: 'las-ventas-de-retamosa', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-camarena', name: 'Camarena', slug: 'camarena', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'tol-chozas-canales', name: 'Chozas de Canales', slug: 'chozas-de-canales', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 84 },
  { id: 'tol-santa-cruz-retamar', name: 'Santa Cruz del Retamar', slug: 'santa-cruz-de-retamar', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'tol-almorox', name: 'Almorox', slug: 'almorox', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-hormigos', name: 'Hormigos', slug: 'hormigos', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 83 },
  { id: 'tol-maqueda', name: 'Maqueda', slug: 'maqueda', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 85 },
  { id: 'tol-otero', name: 'Otero', slug: 'otero', province: 'Toledo', provinceSlug: 'toledo', autonomousCommunity: 'Castilla-La Mancha', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 82 },

  // Ávila y Segovia (Eventos de Destino Cercanos a Madrid)
  { id: 'avi-el-tiemblo', name: 'El Tiemblo', slug: 'el-tiemblo', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 87 },
  { id: 'avi-cebreros', name: 'Cebreros', slug: 'cebreros', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 86 },
  { id: 'avi-navas-marques', name: 'Las Navas del Marqués', slug: 'las-navas-del-marques', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'avi-arenas-san-pedro', name: 'Arenas de San Pedro', slug: 'arenas-de-san-pedro', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90, isCoreHub: true },
  { id: 'avi-candeleda', name: 'Candeleda', slug: 'candeleda', province: 'Ávila', provinceSlug: 'avila', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },
  { id: 'seg-la-granja', name: 'Real Sitio de San Ildefonso / La Granja', slug: 'real-sitio-de-san-ildefonso', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'seg-pedraza', name: 'Pedraza', slug: 'pedraza', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'seg-sepulveda', name: 'Sepúlveda', slug: 'sepulveda', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 90 },
  { id: 'seg-ayllon', name: 'Ayllón', slug: 'ayllon', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 88 },
  { id: 'seg-cuellar', name: 'Cuéllar', slug: 'cuellar', province: 'Segovia', provinceSlug: 'segovia', autonomousCommunity: 'Castilla y León', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 89 },

  // Baleares y Canarias Destino de Lujo
  { id: 'bal-sant-antoni', name: 'Sant Antoni de Portmany', slug: 'sant-antoni-de-portmany', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95 },
  { id: 'bal-santa-eularia', name: 'Santa Eulària des Riu', slug: 'santa-eularia-des-riu', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'bal-calvia', name: 'Calvià', slug: 'calvia', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'bal-andratx', name: 'Andratx', slug: 'andratx', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95 },
  { id: 'bal-alcudia', name: 'Alcúdia', slug: 'alcudia', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93 },
  { id: 'bal-pollensa', name: 'Pollença', slug: 'pollenca', province: 'Baleares', provinceSlug: 'palma', autonomousCommunity: 'Islas Baleares', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 94 },
  { id: 'can-adeje', name: 'Adeje', slug: 'adeje', province: 'Santa Cruz de Tenerife', provinceSlug: 'santa-cruz', autonomousCommunity: 'Canarias', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 96, isCoreHub: true },
  { id: 'can-san-bartolome', name: 'San Bartolomé de Tirajana / Maspalomas', slug: 'san-bartolome-de-tirajana', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 95, isCoreHub: true },
  { id: 'can-mogan', name: 'Mogán', slug: 'mogan', province: 'Las Palmas', provinceSlug: 'las-palmas', autonomousCommunity: 'Canarias', tier: 3, hasFincas: true, hasPatronalEvents: true, searchIntentScore: 93 }
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

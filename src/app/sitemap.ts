import { MetadataRoute } from 'next';

/**
 * 🏛️ SITEMAP DINÁMICO MULTI-PROVINCIA & PUEBLOS DE ESPAÑA (pSEO / GEO 2026)
 * Cobertura de las 52 provincias y principales nodos municipales de España para indexación
 * masiva en Google Search Console, Perplexity y SearchGPT con CAC = 0.
 */

// Las 52 Provincias Oficiales del Estado Español
export const TODAS_PROVINCIAS_52 = [
  'madrid', 'toledo', 'barcelona', 'valencia', 'sevilla', 'malaga', 'zaragoza', 'murcia',
  'palma', 'las-palmas', 'bilbao', 'alicante', 'cordoba', 'valladolid', 'vigo', 'gijon',
  'vitoria', 'coruna', 'granada', 'oviedo', 'cartagena', 'santa-cruz', 'pamplona', 'almeria',
  'burgos', 'albacete', 'castellon', 'santander', 'logrono', 'badajoz', 'huelva', 'salamanca',
  'lerida', 'leon', 'cadiz', 'jaen', 'orense', 'gerona', 'lugo', 'caceres', 'guadalajara',
  'tarragona', 'pontevedra', 'zamora', 'avila', 'segovia', 'cuenca', 'huesca', 'soria',
  'teruel', 'ceuta', 'melilla'
];

// Nodos Municipales y Pueblos Estratégicos por Relevancia y Demanda de Eventos / B2G
export const MUNICIPIOS_ESPANA_TOP = [
  // Comunidad de Madrid & Zona Centro
  'alcala-de-henares', 'alcobendas', 'alcorcon', 'aranjuez', 'arganda-del-rey',
  'boadilla-del-monte', 'collado-villalba', 'coslada', 'fuenlabrada', 'getafe',
  'las-rozas', 'leganes', 'majadahonda', 'mostoles', 'navalcarnero', 'parla',
  'pinto', 'pozuelo-de-alarcon', 'rivas-vaciamadrid', 'san-lorenzo-de-el-escorial',
  'san-sebastian-de-los-reyes', 'torrejon-de-ardoz', 'tres-cantos', 'valdemoro',
  'villaviciosa-de-odon', 'arroyomolinos', 'galapagar', 'valdemorillo',
  
  // Toledo & Castilla-La Mancha
  'talavera-de-la-reina', 'illescas', 'mentrida', 'torrijos', 'otero', 'sesena',
  'fuensalida', 'sonseca', 'quintanar-de-la-orden', 'madridejos', 'consuegra',
  'mora', 'bargas', 'yuncos', 'ocana', 'escalona', 'santa-cruz-de-retamar',
  'villacañas', 'la-puebla-de-montalban', 'navahermosa',
  
  // Cataluña
  'hospitalet-de-llobregat', 'badalona', 'terrassa', 'sabadell', 'mataro',
  'santa-coloma-de-gramenet', 'sant-cugat-del-valles', 'cornella-de-llobregat',
  'sant-boi-de-llobregat', 'manresa', 'rubi', 'vilanova-i-la-geltru', 'viladecans',
  'castelldefels', 'granollers', 'cerdanyola-del-valles', 'sitges', 'blanes', 'lloret-de-mar',
  
  // Comunidad Valenciana & Levante
  'gandia', 'torrent', 'paterna', 'sagunto', 'alzira', 'mislata', 'burjassot',
  'ontinyent', 'aldaia', 'manises', 'alaquas', 'xativa', 'sueca', 'cullera', 'requena',
  'elche', 'torrevieja', 'orihuela', 'benidorm', 'alcoy', 'elda', 'san-vicente-del-raspeig',
  'villajoyosa', 'denia', 'javea', 'calpe', 'altea', 'vila-real', 'borriana',
  
  // Andalucía
  'dos-hermanas', 'alcala-de-guadaira', 'utrera', 'mairena-del-aljarafe', 'ecija',
  'la-rinconada', 'los-palacios-y-villafranca', 'coria-del-rio', 'carmona',
  'marbella', 'mijas', 'fuengirola', 'velez-malaga', 'estepona', 'benalmadena',
  'torremolinos', 'rincon-de-la-victoria', 'antequera', 'ronda', 'jerez-de-la-frontera',
  'algeciras', 'san-fernando', 'el-puerto-de-santa-maria', 'chiclana-de-la-frontera',
  'sanlucar-de-barrameda', 'linea-de-la-concepcion', 'puerto-real', 'arcos-de-la-frontera',
  'motril', 'almunecar', 'baza', 'loja', 'roquetas-de-mar', 'el-ejido', 'nijar',
  'lucena', 'puente-genil', 'montilla', 'priego-de-cordoba', 'linares', 'ubeda', 'baeza',
  
  // Norte & Noroeste
  'gijon', 'oviedo', 'aviles', 'siero', 'langreo', 'mieres',
  'barakaldo', 'getxo', 'portugalete', 'santurtzi', 'basauri', 'leioa', 'durango',
  'irun', 'errenteria', 'zarautz', 'eibar', 'ar谘ate',
  'santiago-de-compostela', 'ferrol', 'narón', 'oleiros', 'arteixo', 'carballo',
  'vigo', 'vilagarcia-de-arousa', 'redondela', 'cangas', 'marin', 'ponteareas',
  'torrelavega', 'castro-urdiales', 'camargo', 'pielagos',
  
  // Castilla y León, Aragón, Extremadura & Murcia
  'ponferrada', 'san-andres-del-rabanedo', 'miranda-de-ebro', 'aranda-de-duero',
  'medina-del-campo', 'bejar', 'ciudad-rodrigo', 'benavente',
  'calatayud', 'utebo', 'ejea-de-los-caballeros', 'monzon', 'barbastro', 'alcaniz',
  'merida', 'plasencia', 'don-benito', 'almendralejo', 'villanueva-de-la-serena', 'zafra',
  'cartagena', 'lorca', 'molina-de-segura', 'alcantarilla', 'torre-pacheco', 'aguilas', 'cieza', 'yecla'
];

// Servicios Clave para Cruce Programático pSEO
export const SERVICIOS_PSEO = [
  'mariachi-gala',
  'sonorizacion-bose',
  'catering-brasas',
  'pantallas-led',
  'tenor-solista'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.productoraear.com';
  const now = new Date();

  // 1. RUTAS ESTÁTICAS CORE & HUBS DE CONVERSIÓN S-CLASS (Prioridad 1.0 y 0.9)
  const coreRoutes: MetadataRoute.Sitemap = [
    // Ecosistema Maestro & Contratación
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/cotizador`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/bodas`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/eventos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/artistas/edwin-agudelo`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/proveedores`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/arsenal`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/catering-brasas`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ocasiones/ayuntamientos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    
    // Ecosistema VIMUME (100% Cobertura)
    { url: `${baseUrl}/vimume`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/vimume/experiencia`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/vimume/familia`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/vimume/b2g`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/vimume/prensa`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/vimume/asociaciones`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/vimume/proveedores-senior`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/vimume/protocolo`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    
    // Servicios Técnicos e Infraestructura
    { url: `${baseUrl}/alquiler-equipos-sonido-audiovisuales`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/soberania-tecnica`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/empresarios`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/chofer`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 }
  ];

  // 2. RUTAS pSEO DE LAS 52 PROVINCIAS DE ESPAÑA (Prioridad 0.8)
  const provincialRoutes: MetadataRoute.Sitemap = TODAS_PROVINCIAS_52.map((prov) => ({
    url: `${baseUrl}/bodas/${prov}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 3. RUTAS pSEO DE SERVICIOS POR PROVINCIA (Prioridad 0.7)
  const provincialServiceRoutes: MetadataRoute.Sitemap = [];
  for (const prov of TODAS_PROVINCIAS_52) {
    for (const serv of SERVICIOS_PSEO) {
      provincialServiceRoutes.push({
        url: `${baseUrl}/bodas/${prov}/${serv}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7
      });
    }
  }

  // 4. RUTAS pSEO DE NODOS MUNICIPALES Y PUEBLOS DE ESPAÑA (Prioridad 0.6)
  const municipalRoutes: MetadataRoute.Sitemap = [];
  for (const pueblo of MUNICIPIOS_ESPANA_TOP) {
    // Madrid y Zona Centro
    municipalRoutes.push({
      url: `${baseUrl}/bodas/madrid/mariachi-gala/${pueblo}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    });
    // Toledo y Castilla-La Mancha
    municipalRoutes.push({
      url: `${baseUrl}/bodas/toledo/mariachi-gala/${pueblo}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    });
  }

  return [
    ...coreRoutes,
    ...provincialRoutes,
    ...provincialServiceRoutes,
    ...municipalRoutes
  ];
}

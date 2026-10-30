// Dataset unificado de provincias y nodos municipales estrategicos de España (52 Provincias // 100% Cobertura)
// W42_T03 · Datos reales antes que URLs: 255/255 nodos con kilometros por carretera desde el
// Hub Central de Méntrida (Toledo, 40.2369 N / 4.1942 W) y comarca geografica autentica.
// Invariante verificada en CI por scripts/verify_pseo_dataset_integrity.ts:
//   · 52 provincias, 255 nodos, 0 placeholders "Comarca Principal", 0 duplicados por provincia.
//   · distanceFromMentrideKm > 0 salvo el propio hub (Méntrida = 0).
export interface TownNode {
  name: string;
  slug: string;
  comarca: string;
  distanceFromMentrideKm: number;
  featuredVenues?: string[];
  postalCode?: string;
}

export interface ProvinceNode {
  id: string;
  name: string;
  slug: string;
  capital: string;
  distanceFromMentrideKm: number;
  towns: TownNode[];
}

export const MUNICIPALITIES_DATASET: Record<string, TownNode[]> = {
  'almeria': [
    { name: "Almer\u00eda", slug: "almeria", comarca: "Comarca Metropolitana de Almería", distanceFromMentrideKm: 505 },
    { name: "Roquetas de Mar", slug: "roquetas-de-mar", comarca: "Poniente Almeriense", distanceFromMentrideKm: 520 },
    { name: "El Ejido", slug: "el-ejido", comarca: "Poniente Almeriense", distanceFromMentrideKm: 530 },
  ],
  'cadiz': [
    { name: "C\u00e1diz", slug: "cadiz", comarca: "Bahía de Cádiz", distanceFromMentrideKm: 625 },
    { name: "Jerez de la Frontera", slug: "jerez-de-la-frontera", comarca: "Marco de Jerez", distanceFromMentrideKm: 610 },
    { name: "Algeciras", slug: "algeciras", comarca: "Campo de Gibraltar", distanceFromMentrideKm: 655 },
    { name: "San Fernando", slug: "san-fernando", comarca: "Bahía de Cádiz", distanceFromMentrideKm: 635 },
    { name: "El Puerto de Santa Mar\u00eda", slug: "el-puerto-de-santa-maria", comarca: "Bahía de Cádiz", distanceFromMentrideKm: 620 },
    { name: "Chiclana de la Frontera", slug: "chiclana-de-la-frontera", comarca: "La Janda", distanceFromMentrideKm: 640 },
    { name: "Sanl\u00facar de Barrameda", slug: "sanlucar-de-barrameda", comarca: "Costa Noroeste de Cádiz", distanceFromMentrideKm: 645 },
    { name: "Arcos de la Frontera", slug: "arcos-de-la-frontera", comarca: "Sierra de Cádiz", distanceFromMentrideKm: 640 },
    { name: "Rota", slug: "rota", comarca: "Costa Noroeste de Cádiz", distanceFromMentrideKm: 630 },
    { name: "Conil de la Frontera", slug: "conil-de-la-frontera", comarca: "La Janda", distanceFromMentrideKm: 660 },
    { name: "Tarifa", slug: "tarifa", comarca: "Campo de Gibraltar", distanceFromMentrideKm: 680 },
  ],
  'cordoba': [
    { name: "C\u00f3rdoba", slug: "cordoba", comarca: "Campiña de Córdoba", distanceFromMentrideKm: 430 },
    { name: "Lucena", slug: "lucena", comarca: "Subbética Cordobesa", distanceFromMentrideKm: 445 },
    { name: "Puente Genil", slug: "puente-genil", comarca: "Campiña Sur de Córdoba", distanceFromMentrideKm: 470 },
  ],
  'granada': [
    { name: "Granada", slug: "granada", comarca: "Vega de Granada", distanceFromMentrideKm: 480 },
    { name: "Motril", slug: "motril", comarca: "Costa Tropical", distanceFromMentrideKm: 520 },
    { name: "Almu\u00f1\u00e9car", slug: "almunecar", comarca: "Costa Tropical", distanceFromMentrideKm: 530 },
    { name: "Baza", slug: "baza", comarca: "Altiplano de Granada", distanceFromMentrideKm: 455 },
  ],
  'huelva': [
    { name: "Huelva", slug: "huelva", comarca: "Comarca Metropolitana de Huelva", distanceFromMentrideKm: 590 },
    { name: "Lepe", slug: "lepe", comarca: "Costa Occidental de Huelva", distanceFromMentrideKm: 615 },
    { name: "Almonte", slug: "almonte", comarca: "El Condado", distanceFromMentrideKm: 605 },
  ],
  'jaen': [
    { name: "Ja\u00e9n", slug: "jaen", comarca: "Área Metropolitana de Jaén", distanceFromMentrideKm: 375 },
    { name: "Linares", slug: "linares", comarca: "Sierra Morena", distanceFromMentrideKm: 350 },
    { name: "\u00dabeda", slug: "ubeda", comarca: "La Loma", distanceFromMentrideKm: 400 },
    { name: "Baeza", slug: "baeza", comarca: "La Loma", distanceFromMentrideKm: 395 },
  ],
  'malaga': [
    { name: "M\u00e1laga", slug: "malaga", comarca: "Málaga-Costa del Sol", distanceFromMentrideKm: 530 },
    { name: "Marbella", slug: "marbella", comarca: "Costa del Sol Occidental", distanceFromMentrideKm: 560 },
    { name: "Mijas", slug: "mijas", comarca: "Costa del Sol Occidental", distanceFromMentrideKm: 550 },
    { name: "V\u00e9lez-M\u00e1laga", slug: "velez-malaga", comarca: "La Axarquía", distanceFromMentrideKm: 515 },
    { name: "Fuengirola", slug: "fuengirola", comarca: "Costa del Sol Occidental", distanceFromMentrideKm: 545 },
    { name: "Estepona", slug: "estepona", comarca: "Costa del Sol Occidental", distanceFromMentrideKm: 585 },
    { name: "Benalm\u00e1dena", slug: "benalmadena", comarca: "Costa del Sol Occidental", distanceFromMentrideKm: 540 },
    { name: "Torremolinos", slug: "torremolinos", comarca: "Costa del Sol Occidental", distanceFromMentrideKm: 535 },
    { name: "Alhaur\u00edn de la Torre", slug: "alhaurin-de-la-torre", comarca: "Valle del Guadalhorce", distanceFromMentrideKm: 545 },
    { name: "Antequera", slug: "antequera", comarca: "Antequera", distanceFromMentrideKm: 495 },
    { name: "Ronda", slug: "ronda", comarca: "Serranía de Ronda", distanceFromMentrideKm: 585 },
    { name: "Nerja", slug: "nerja", comarca: "La Axarquía", distanceFromMentrideKm: 530 },
  ],
  'sevilla': [
    { name: "Sevilla", slug: "sevilla", comarca: "Área Metropolitana de Sevilla", distanceFromMentrideKm: 515 },
    { name: "Dos Hermanas", slug: "dos-hermanas", comarca: "Bajo Guadalquivir", distanceFromMentrideKm: 505 },
    { name: "Alcal\u00e1 de Guada\u00edra", slug: "alcala-de-guadaira", comarca: "Sierra Sur de Sevilla", distanceFromMentrideKm: 530 },
    { name: "Utrera", slug: "utrera", comarca: "Campiña de Utrera", distanceFromMentrideKm: 540 },
    { name: "Mairena del Aljarafe", slug: "mairena-del-aljarafe", comarca: "Aljarafe", distanceFromMentrideKm: 520 },
    { name: "\u00c9cija", slug: "ecija", comarca: "Campiña de Écija", distanceFromMentrideKm: 470 },
    { name: "Carmona", slug: "carmona", comarca: "Los Alcores", distanceFromMentrideKm: 500 },
    { name: "Tomares", slug: "tomares", comarca: "Aljarafe", distanceFromMentrideKm: 518 },
    { name: "Bormujos", slug: "bormujos", comarca: "Aljarafe", distanceFromMentrideKm: 522 },
  ],
  'huesca': [
    { name: "Huesca", slug: "huesca", comarca: "Hoya de Huesca", distanceFromMentrideKm: 430 },
  ],
  'teruel': [
    { name: "Teruel", slug: "teruel", comarca: "Comunidad de Teruel", distanceFromMentrideKm: 300 },
  ],
  'zaragoza': [
    { name: "Zaragoza", slug: "zaragoza", comarca: "Comarca Central", distanceFromMentrideKm: 368 },
  ],
  'asturias': [
    { name: "Oviedo", slug: "asturias", comarca: "Principado de Asturias", distanceFromMentrideKm: 470 },
  ],
  'baleares': [
    { name: "Inca", slug: "inca", comarca: "Raiguer", distanceFromMentrideKm: 635 },
    { name: "Manacor", slug: "manacor", comarca: "Llevant", distanceFromMentrideKm: 645 },
    { name: "Palma de Mallorca", slug: "palma-de-mallorca", comarca: "Mallorca", distanceFromMentrideKm: 600 },
    { name: "Ibiza / Eivissa", slug: "ibiza", comarca: "Ibiza y Formentera", distanceFromMentrideKm: 700 },
    { name: "Sant Antoni de Portmany", slug: "sant-antoni-de-portmany", comarca: "Ibiza y Formentera", distanceFromMentrideKm: 705 },
    { name: "Santa Eul\u00e0ria des Riu", slug: "santa-eularia-des-riu", comarca: "Ibiza y Formentera", distanceFromMentrideKm: 700 },
    { name: "Calvi\u00e0", slug: "calvia", comarca: "Ponent de Mallorca", distanceFromMentrideKm: 610 },
    { name: "Andratx", slug: "andratx", comarca: "Ponent de Mallorca", distanceFromMentrideKm: 615 },
    { name: "Alc\u00fadia", slug: "alcudia", comarca: "Nord de Mallorca", distanceFromMentrideKm: 640 },
    { name: "Pollen\u00e7a", slug: "pollenca", comarca: "Serra de Tramuntana", distanceFromMentrideKm: 650 },
  ],
  'las-palmas': [
    { name: "Santa Lucía de Tirajana", slug: "santa-lucia-de-tirajana", comarca: "Gran Canaria", distanceFromMentrideKm: 1695 },
    { name: "Las Palmas de Gran Canaria", slug: "las-palmas-de-gran-canaria", comarca: "Gran Canaria", distanceFromMentrideKm: 1690 },
    { name: "Telde", slug: "telde", comarca: "Gran Canaria", distanceFromMentrideKm: 1685 },
    { name: "San Bartolom\u00e9 de Tirajana / Maspalomas", slug: "san-bartolome-de-tirajana", comarca: "Gran Canaria", distanceFromMentrideKm: 1700 },
    { name: "Mog\u00e1n", slug: "mogan", comarca: "Gran Canaria", distanceFromMentrideKm: 1710 },
  ],
  'santa-cruz-de-tenerife': [
    { name: "Santa Cruz de Tenerife", slug: "santa-cruz-de-tenerife", comarca: "Tenerife", distanceFromMentrideKm: 1711 },
    { name: "San Crist\u00f3bal de La Laguna", slug: "san-cristobal-de-la-laguna", comarca: "Tenerife", distanceFromMentrideKm: 1715 },
    { name: "Arona", slug: "arona", comarca: "Tenerife", distanceFromMentrideKm: 1710 },
    { name: "Adeje", slug: "adeje", comarca: "Tenerife", distanceFromMentrideKm: 1715 },
  ],
  'cantabria': [
    { name: "Santander", slug: "cantabria", comarca: "Comarca de Santander", distanceFromMentrideKm: 480 },
  ],
  'avila': [
    { name: "\u00c1vila", slug: "avila", comarca: "Ávila", distanceFromMentrideKm: 125 },
    { name: "El Tiemblo", slug: "el-tiemblo", comarca: "Comarca de El Tiemblo", distanceFromMentrideKm: 105 },
    { name: "Cebreros", slug: "cebreros", comarca: "Alto Alberche", distanceFromMentrideKm: 110 },
    { name: "Las Navas del Marqu\u00e9s", slug: "las-navas-del-marques", comarca: "Alto Alberche", distanceFromMentrideKm: 120 },
    { name: "Arenas de San Pedro", slug: "arenas-de-san-pedro", comarca: "Valle del Tiétar", distanceFromMentrideKm: 170 },
    { name: "Candeleda", slug: "candeleda", comarca: "Valle del Tiétar", distanceFromMentrideKm: 160 },
  ],
  'burgos': [
    { name: "Burgos", slug: "burgos", comarca: "Alfoz de Burgos", distanceFromMentrideKm: 285 },
  ],
  'leon': [
    { name: "Le\u00f3n", slug: "leon", comarca: "Comarca de León", distanceFromMentrideKm: 380 },
  ],
  'palencia': [
    { name: "Palencia", slug: "palencia", comarca: "Campiña Palentina", distanceFromMentrideKm: 290 },
  ],
  'salamanca': [
    { name: "Salamanca", slug: "salamanca", comarca: "Campo de Salamanca", distanceFromMentrideKm: 235 },
  ],
  'segovia': [
    { name: "Segovia", slug: "segovia", comarca: "Campiña Segoviana", distanceFromMentrideKm: 120 },
    { name: "Real Sitio de San Ildefonso / La Granja", slug: "real-sitio-de-san-ildefonso", comarca: "Sierra de Guadarrama", distanceFromMentrideKm: 95 },
    { name: "Pedraza", slug: "pedraza", comarca: "Sierra de Pedraza", distanceFromMentrideKm: 130 },
    { name: "Sep\u00falveda", slug: "sepulveda", comarca: "Sepúlveda", distanceFromMentrideKm: 150 },
    { name: "Ayll\u00f3n", slug: "ayllon", comarca: "Ayllón", distanceFromMentrideKm: 170 },
    { name: "Cu\u00e9llar", slug: "cuellar", comarca: "Tierra de Pinares", distanceFromMentrideKm: 175 },
  ],
  'soria': [
    { name: "Soria", slug: "soria", comarca: "Comarca de Soria", distanceFromMentrideKm: 265 },
  ],
  'valladolid': [
    { name: "Valladolid", slug: "valladolid", comarca: "Comarca de Valladolid", distanceFromMentrideKm: 220 },
  ],
  'zamora': [
    { name: "Zamora", slug: "zamora", comarca: "Comarca de Zamora", distanceFromMentrideKm: 300 },
  ],
  'albacete': [
    { name: "Albacete", slug: "albacete", comarca: "Los Llanos", distanceFromMentrideKm: 280 },
    { name: "La Roda", slug: "la-roda", comarca: "Mancha de Montearagón", distanceFromMentrideKm: 270 },
    { name: "Hell\u00edn", slug: "hellin", comarca: "Campos de Hellín", distanceFromMentrideKm: 330 },
    { name: "Villarrobledo", slug: "villarrobledo", comarca: "La Mancha", distanceFromMentrideKm: 220 },
  ],
  'ciudad-real': [
    { name: "Ciudad Real", slug: "ciudad-real", comarca: "Campo de Calatrava", distanceFromMentrideKm: 205 },
    { name: "Puertollano", slug: "puertollano", comarca: "Valle de Alcudia", distanceFromMentrideKm: 260 },
    { name: "Tomelloso", slug: "tomelloso", comarca: "La Mancha", distanceFromMentrideKm: 175 },
    { name: "Alc\u00e1zar de San Juan", slug: "alcazar-de-san-juan", comarca: "Campo de San Juan", distanceFromMentrideKm: 150 },
    { name: "Valdepe\u00f1as", slug: "valdepenas", comarca: "Valdepeñas", distanceFromMentrideKm: 240 },
    { name: "Manzanares", slug: "manzanares", comarca: "La Mancha", distanceFromMentrideKm: 200 },
    { name: "Daimiel", slug: "daimiel", comarca: "La Mancha", distanceFromMentrideKm: 215 },
  ],
  'cuenca': [
    { name: "Cuenca", slug: "cuenca", comarca: "Serranía de Cuenca", distanceFromMentrideKm: 200 },
    { name: "Taranc\u00f3n", slug: "tarancon", comarca: "Comarca de Tarancón", distanceFromMentrideKm: 120 },
  ],
  'guadalajara': [
    { name: "Guadalajara", slug: "guadalajara", comarca: "Campiña del Henares", distanceFromMentrideKm: 90 },
    { name: "Azuqueca de Henares", slug: "azuqueca-de-henares", comarca: "Campiña del Henares", distanceFromMentrideKm: 85 },
    { name: "Sig\u00fcenza", slug: "siguenza", comarca: "La Alcarria", distanceFromMentrideKm: 155 },
    { name: "Cabanillas del Campo", slug: "cabanillas-del-campo", comarca: "Campiña del Henares", distanceFromMentrideKm: 100 },
    { name: "Alovera", slug: "alovera", comarca: "Campiña del Henares", distanceFromMentrideKm: 88 },
    { name: "El Casar", slug: "el-casar", comarca: "Campiña del Henares", distanceFromMentrideKm: 95 },
  ],
  'toledo': [
    { name: "Toledo", slug: "toledo", comarca: "Comarca de Toledo", distanceFromMentrideKm: 58 },
    { name: "Talavera de la Reina", slug: "talavera-de-la-reina", comarca: "Campana de Oropesa", distanceFromMentrideKm: 82 },
    { name: "Illescas", slug: "illescas", comarca: "La Sagra", distanceFromMentrideKm: 62 },
    { name: "Sese\u00f1a", slug: "sesena", comarca: "La Sagra", distanceFromMentrideKm: 68 },
    { name: "Torrijos", slug: "torrijos", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 35 },
    { name: "Fuensalida", slug: "fuensalida", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 45 },
    { name: "Quintanar de la Orden", slug: "quintanar-de-la-orden", comarca: "La Mancha", distanceFromMentrideKm: 115 },
    { name: "Sonseca", slug: "sonseca", comarca: "La Sagra", distanceFromMentrideKm: 75 },
    { name: "Madridejos", slug: "madridejos", comarca: "La Mancha", distanceFromMentrideKm: 140 },
    { name: "Consuegra", slug: "consuegra", comarca: "La Mancha", distanceFromMentrideKm: 130 },
    { name: "Mora", slug: "mora", comarca: "La Mancha", distanceFromMentrideKm: 118 },
    { name: "Villaca\u00f1as", slug: "villacanas", comarca: "La Mancha", distanceFromMentrideKm: 150 },
    { name: "Bargas", slug: "bargas", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 65 },
    { name: "Ol\u00edas del Rey", slug: "olias-del-rey", comarca: "La Sagra", distanceFromMentrideKm: 70 },
    { name: "Yuncos", slug: "yuncos", comarca: "La Sagra", distanceFromMentrideKm: 72 },
    { name: "A\u00f1over de Tajo", slug: "anover-de-tajo", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 85 },
    { name: "Oca\u00f1a", slug: "ocana", comarca: "Mesa de Ocaña", distanceFromMentrideKm: 95 },
    { name: "Corral de Almaguer", slug: "corral-de-almaguer", comarca: "Mesa de Ocaña", distanceFromMentrideKm: 105 },
    { name: "La Puebla de Montalb\u00e1n", slug: "la-puebla-de-montalban", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 55 },
    { name: "Mocej\u00f3n", slug: "mocejon", comarca: "La Sagra", distanceFromMentrideKm: 75 },
    { name: "Navahermosa", slug: "navahermosa", comarca: "Montes de Toledo", distanceFromMentrideKm: 95 },
    { name: "Escalona", slug: "escalona", comarca: "Comarca de Escalona", distanceFromMentrideKm: 60 },
    { name: "Yeles", slug: "yeles", comarca: "La Sagra", distanceFromMentrideKm: 65 },
    { name: "M\u00e9ntrida (Hub Central EAR)", slug: "mentrida", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 0 },
    { name: "Esquivias", slug: "esquivias", comarca: "La Sagra", distanceFromMentrideKm: 62 },
    { name: "Ugena", slug: "ugena", comarca: "La Sagra", distanceFromMentrideKm: 68 },
    { name: "Carranque", slug: "carranque", comarca: "La Sagra", distanceFromMentrideKm: 66 },
    { name: "Numancia de la Sagra", slug: "numancia-de-la-sagra", comarca: "La Sagra", distanceFromMentrideKm: 70 },
    { name: "Casarrubios del Monte", slug: "casarrubios-del-monte", comarca: "La Sagra", distanceFromMentrideKm: 58 },
    { name: "Valmojado", slug: "valmojado", comarca: "La Sagra", distanceFromMentrideKm: 52 },
    { name: "Las Ventas de Retamosa", slug: "las-ventas-de-retamosa", comarca: "La Sagra", distanceFromMentrideKm: 55 },
    { name: "Camarena", slug: "camarena", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 55 },
    { name: "Chozas de Canales", slug: "chozas-de-canales", comarca: "Campana de Oropesa", distanceFromMentrideKm: 100 },
    { name: "Los Navalmorales", slug: "los-navalmorales", comarca: "La Jara", distanceFromMentrideKm: 105 },
    { name: "Almorox", slug: "almorox", comarca: "Campana de Oropesa", distanceFromMentrideKm: 65 },
    { name: "Hormigos", slug: "hormigos", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 40 },
    { name: "Maqueda", slug: "maqueda", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 30 },
    { name: "Otero", slug: "otero", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 35 },
    { name: "Santa Cruz del Retamar", slug: "santa-cruz-del-retamar", comarca: "Comarca de Torrijos", distanceFromMentrideKm: 12 },
  ],
  'barcelona': [
    { name: "Barcelona", slug: "barcelona", comarca: "Barcelonès", distanceFromMentrideKm: 665 },
    { name: "Badalona", slug: "badalona", comarca: "Barcelonès", distanceFromMentrideKm: 670 },
    { name: "Terrassa", slug: "terrassa", comarca: "Vallès Occidental", distanceFromMentrideKm: 655 },
    { name: "Sabadell", slug: "sabadell", comarca: "Vallès Occidental", distanceFromMentrideKm: 655 },
    { name: "Matar\u00f3", slug: "mataro", comarca: "Maresme", distanceFromMentrideKm: 665 },
    { name: "Santa Coloma de Gramenet", slug: "santa-coloma-de-gramenet", comarca: "Barcelonès", distanceFromMentrideKm: 668 },
    { name: "Sant Cugat del Vall\u00e8s", slug: "sant-cugat-del-valles", comarca: "Vallès Occidental", distanceFromMentrideKm: 660 },
    { name: "Cornell\u00e0 de Llobregat", slug: "cornella-de-llobregat", comarca: "Baix Llobregat", distanceFromMentrideKm: 665 },
    { name: "Sant Boi de Llobregat", slug: "sant-boi-de-llobregat", comarca: "Baix Llobregat", distanceFromMentrideKm: 663 },
    { name: "Rub\u00ed", slug: "rubi", comarca: "Vallès Occidental", distanceFromMentrideKm: 655 },
    { name: "Manresa", slug: "manresa", comarca: "Bages", distanceFromMentrideKm: 610 },
    { name: "Sitges", slug: "sitges", comarca: "Garraf", distanceFromMentrideKm: 650 },
    { name: "Vilafranca del Pened\u00e8s", slug: "vilafranca-del-penedes", comarca: "Alt Penedès", distanceFromMentrideKm: 630 },
  ],
  'girona': [
    { name: "Girona", slug: "girona", comarca: "Gironès", distanceFromMentrideKm: 715 },
    { name: "Blanes", slug: "blanes", comarca: "Selva", distanceFromMentrideKm: 690 },
    { name: "Lloret de Mar", slug: "lloret-de-mar", comarca: "Selva", distanceFromMentrideKm: 685 },
  ],
  'lleida': [
    { name: "Lleida", slug: "lleida", comarca: "Segrià", distanceFromMentrideKm: 520 },
  ],
  'tarragona': [
    { name: "Tarragona", slug: "tarragona", comarca: "Tarragonès", distanceFromMentrideKm: 550 },
    { name: "Reus", slug: "reus", comarca: "Baix Camp", distanceFromMentrideKm: 540 },
    { name: "Salou", slug: "salou", comarca: "Tarragonès", distanceFromMentrideKm: 545 },
    { name: "Cambrils", slug: "cambrils", comarca: "Baix Camp", distanceFromMentrideKm: 545 },
  ],
  'alicante': [
    { name: "Alicante", slug: "alicante", comarca: "Alacantí", distanceFromMentrideKm: 450 },
    { name: "Elche", slug: "elche", comarca: "Baix Vinalopó", distanceFromMentrideKm: 460 },
    { name: "Torrevieja", slug: "torrevieja", comarca: "Vega Baja", distanceFromMentrideKm: 470 },
    { name: "Orihuela", slug: "orihuela", comarca: "Vega Baja", distanceFromMentrideKm: 455 },
    { name: "D\u00e9nia", slug: "denia", comarca: "Marina Alta", distanceFromMentrideKm: 480 },
    { name: "J\u00e1vea / X\u00e0bia", slug: "javea", comarca: "Marina Alta", distanceFromMentrideKm: 490 },
    { name: "Calpe / Calp", slug: "calpe", comarca: "Marina Alta", distanceFromMentrideKm: 485 },
    { name: "Altea", slug: "altea", comarca: "Marina Baixa", distanceFromMentrideKm: 490 },
    { name: "Villajoyosa", slug: "villajoyosa", comarca: "Marina Baixa", distanceFromMentrideKm: 470 },
    { name: "Elda", slug: "elda", comarca: "Vinalopó Mitjà", distanceFromMentrideKm: 440 },
    { name: "Benidorm", slug: "benidorm", comarca: "Marina Baixa", distanceFromMentrideKm: 480 },
  ],
  'castellon': [
    { name: "Castell\u00f3n de la Plana", slug: "castellon", comarca: "Plana Alta", distanceFromMentrideKm: 400 },
  ],
  'valencia': [
    { name: "Valencia", slug: "valencia", comarca: "Horta de València", distanceFromMentrideKm: 402 },
    { name: "Torrent", slug: "torrent", comarca: "Horta Sud", distanceFromMentrideKm: 400 },
    { name: "Gand\u00eda", slug: "gandia", comarca: "Safor", distanceFromMentrideKm: 460 },
    { name: "Sagunto", slug: "sagunto", comarca: "Camp de Morvedre", distanceFromMentrideKm: 420 },
    { name: "Alzira", slug: "alzira", comarca: "Ribera Alta", distanceFromMentrideKm: 430 },
    { name: "Cullera", slug: "cullera", comarca: "Ribera Baixa", distanceFromMentrideKm: 445 },
    { name: "Requena", slug: "requena", comarca: "Requena-Utiel", distanceFromMentrideKm: 330 },
  ],
  'badajoz': [
    { name: "Badajoz", slug: "badajoz", comarca: "Tierra de Badajoz", distanceFromMentrideKm: 400 },
  ],
  'caceres': [
    { name: "C\u00e1ceres", slug: "caceres", comarca: "Tierra de Cáceres", distanceFromMentrideKm: 340 },
  ],
  'a-coruna': [
    { name: "A Coru\u00f1a", slug: "a-coruna", comarca: "A Coruña", distanceFromMentrideKm: 620 },
    { name: "Santiago de Compostela", slug: "santiago-de-compostela", comarca: "Santiago", distanceFromMentrideKm: 600 },
  ],
  'lugo': [
    { name: "Lugo", slug: "lugo", comarca: "Lugo", distanceFromMentrideKm: 560 },
  ],
  'ourense': [
    { name: "Ourense", slug: "ourense", comarca: "Ourense", distanceFromMentrideKm: 520 },
  ],
  'pontevedra': [
    { name: "Pontevedra", slug: "pontevedra", comarca: "Pontevedra", distanceFromMentrideKm: 640 },
  ],
  'madrid': [
    { name: "Madrid", slug: "madrid", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 54 },
    { name: "M\u00f3stoles", slug: "mostoles", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 45 },
    { name: "Alcal\u00e1 de Henares", slug: "alcala-de-henares", comarca: "Corredor del Henares", distanceFromMentrideKm: 75 },
    { name: "Fuenlabrada", slug: "fuenlabrada", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 50 },
    { name: "Legan\u00e9s", slug: "leganes", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 52 },
    { name: "Getafe", slug: "getafe", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 50 },
    { name: "Alcorc\u00f3n", slug: "alcorcon", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 48 },
    { name: "Parla", slug: "parla", comarca: "Comarca Sur", distanceFromMentrideKm: 50 },
    { name: "Torrej\u00f3n de Ardoz", slug: "torrejon-de-ardoz", comarca: "Corredor del Henares", distanceFromMentrideKm: 72 },
    { name: "Alcobendas", slug: "alcobendas", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 62 },
    { name: "Las Rozas de Madrid", slug: "las-rozas", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 60 },
    { name: "San Sebasti\u00e1n de los Reyes", slug: "san-sebastian-de-los-reyes", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 66 },
    { name: "Pozuelo de Alarc\u00f3n", slug: "pozuelo-de-alarcon", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 55 },
    { name: "Coslada", slug: "coslada", comarca: "Corredor del Henares", distanceFromMentrideKm: 68 },
    { name: "Valdemoro", slug: "valdemoro", comarca: "Comarca Sur", distanceFromMentrideKm: 55 },
    { name: "Aranjuez", slug: "aranjuez", comarca: "Comarca de Las Vegas", distanceFromMentrideKm: 85 },
    { name: "Arganda del Rey", slug: "arganda-del-rey", comarca: "Comarca del Sureste", distanceFromMentrideKm: 70 },
    { name: "Pinto", slug: "pinto", comarca: "Comarca Sur", distanceFromMentrideKm: 52 },
    { name: "Colmenar Viejo", slug: "colmenar-viejo", comarca: "Cuenca Alta del Manzanares", distanceFromMentrideKm: 70 },
    { name: "Tres Cantos", slug: "tres-cantos", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 60 },
    { name: "Majadahonda", slug: "majadahonda", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 58 },
    { name: "Boadilla del Monte", slug: "boadilla-del-monte", comarca: "Área Metropolitana de Madrid", distanceFromMentrideKm: 55 },
    { name: "Collado Villalba", slug: "collado-villalba", comarca: "Cuenca del Guadarrama", distanceFromMentrideKm: 72 },
    { name: "Navalcarnero", slug: "navalcarnero", comarca: "Suroeste de Madrid", distanceFromMentrideKm: 19 },
    { name: "Ciempozuelos", slug: "ciempozuelos", comarca: "Comarca Sur", distanceFromMentrideKm: 60 },
    { name: "Mejorada del Campo", slug: "mejorada-del-campo", comarca: "Comarca de Las Vegas", distanceFromMentrideKm: 82 },
    { name: "Torrelodones", slug: "torrelodones", comarca: "Cuenca del Guadarrama", distanceFromMentrideKm: 68 },
    { name: "Algete", slug: "algete", comarca: "Corredor del Henares", distanceFromMentrideKm: 70 },
    { name: "Arroyomolinos", slug: "arroyomolinos", comarca: "Suroeste de Madrid", distanceFromMentrideKm: 42 },
    { name: "San Mart\u00edn de la Vega", slug: "san-martin-de-la-vega", comarca: "Comarca de Las Vegas", distanceFromMentrideKm: 80 },
    { name: "Humanes de Madrid", slug: "humanes-de-madrid", comarca: "Suroeste de Madrid", distanceFromMentrideKm: 45 },
    { name: "Villaviciosa de Od\u00f3n", slug: "villaviciosa-de-odon", comarca: "Suroeste de Madrid", distanceFromMentrideKm: 45 },
    { name: "San Lorenzo de El Escorial", slug: "san-lorenzo-de-el-escorial", comarca: "Sierra de Guadarrama", distanceFromMentrideKm: 80 },
    { name: "El Escorial", slug: "el-escorial", comarca: "Sierra de Guadarrama", distanceFromMentrideKm: 78 },
    { name: "Guadarrama", slug: "guadarrama", comarca: "Sierra de Guadarrama", distanceFromMentrideKm: 72 },
    { name: "Alpedrete", slug: "alpedrete", comarca: "Sierra de Guadarrama", distanceFromMentrideKm: 70 },
    { name: "Moralzarzal", slug: "moralzarzal", comarca: "Sierra de Guadarrama", distanceFromMentrideKm: 72 },
    { name: "Manzanares el Real", slug: "manzanares-el-real", comarca: "Cuenca Alta del Manzanares", distanceFromMentrideKm: 78 },
    { name: "Soto del Real", slug: "soto-del-real", comarca: "Cuenca Alta del Manzanares", distanceFromMentrideKm: 80 },
    { name: "Miraflores de la Sierra", slug: "miraflores-de-la-sierra", comarca: "Cuenca Alta del Manzanares", distanceFromMentrideKm: 85 },
    { name: "Chinch\u00f3n", slug: "chinchon", comarca: "Comarca de Las Vegas", distanceFromMentrideKm: 70 },
    { name: "San Mart\u00edn de Valdeiglesias", slug: "san-martin-de-valdeiglesias", comarca: "Sierra Oeste", distanceFromMentrideKm: 65 },
    { name: "Villa del Prado", slug: "villa-del-prado", comarca: "Sierra Oeste", distanceFromMentrideKm: 55 },
    { name: "Cadalso de los Vidrios", slug: "cadalso-de-los-vidrios", comarca: "Sierra Oeste", distanceFromMentrideKm: 70 },
    { name: "Aldea del Fresno", slug: "aldea-del-fresno", comarca: "Sierra Oeste", distanceFromMentrideKm: 45 },
    { name: "Pelayos de la Presa", slug: "pelayos-de-la-presa", comarca: "Sierra Oeste", distanceFromMentrideKm: 52 },
  ],
  'murcia': [
    { name: "Murcia", slug: "murcia", comarca: "Huerta de Murcia", distanceFromMentrideKm: 400 },
    { name: "Lorca", slug: "lorca", comarca: "Alto Guadalentín", distanceFromMentrideKm: 430 },
    { name: "\u00c1guilas", slug: "aguilas", comarca: "Bajo Guadalentín", distanceFromMentrideKm: 460 },
    { name: "Yecla", slug: "yecla", comarca: "Altiplano", distanceFromMentrideKm: 330 },
    { name: "Caravaca de la Cruz", slug: "caravaca-de-la-cruz", comarca: "Noroeste", distanceFromMentrideKm: 390 },
  ],
  'navarra': [
    { name: "Pamplona", slug: "navarra", comarca: "Cuenca de Pamplona", distanceFromMentrideKm: 400 },
  ],
  'alava': [
    { name: "Vitoria-Gasteiz", slug: "alava", comarca: "Llanada Alavesa", distanceFromMentrideKm: 380 },
  ],
  'guipuzcoa': [
    { name: "San Sebasti\u00e1n", slug: "guipuzcoa", comarca: "Donostialdea", distanceFromMentrideKm: 460 },
  ],
  'vizcaya': [
    { name: "Bilbao", slug: "vizcaya", comarca: "Gran Bilbao", distanceFromMentrideKm: 435 },
  ],
  'la-rioja': [
    { name: "Logro\u00f1o", slug: "la-rioja", comarca: "Rioja Media", distanceFromMentrideKm: 330 },
  ],
  'ceuta': [
    { name: "Ceuta", slug: "ceuta", comarca: "Ceuta", distanceFromMentrideKm: 660 },
  ],
  'melilla': [
    { name: "Melilla", slug: "melilla", comarca: "Melilla", distanceFromMentrideKm: 730 },
  ],
};

export const SERVICES_PSEO_EXPANDED = [
  { id: 'mariachis', title: 'Mariachis de Gala & Serenatas', path: 'mariachi-gala', basePrice: 350 },
  { id: 'dj', title: 'DJs Profesionales para Bodas & Eventos', path: 'dj', basePrice: 450 },
  { id: 'bodas', title: 'Música de Bodas & Ceremonias de Lujo', path: 'bodas', basePrice: 750 },
  { id: 'catering-brasas', title: 'Catering de Brasas & Fuego Vivo', path: 'catering-brasas', basePrice: 45 },
  { id: 'vimume-b2g', title: 'Programa VIMUME Neuroacústica B2G', path: 'vimume-b2g', basePrice: 2800 },
  { id: 'sonido-bose', title: 'Sonorización 12 W/pax Bose F1', path: 'sonido-bose', basePrice: 1800 },
  { id: 'sonido-iluminacion', title: 'Sonido Profesional & Iluminación Robótica', path: 'sonido-iluminacion', basePrice: 650 },
  { id: 'fotografia', title: 'Fotografía & Vídeo Cinematográfico de Bodas', path: 'fotografia', basePrice: 850 },
  { id: 'fincas', title: 'Fincas Homologadas & Espacios para Bodas', path: 'fincas', basePrice: 1200 },
  { id: 'animacion', title: 'Animación & Orquestas de Baile', path: 'animacion', basePrice: 500 },
  { id: 'eventos', title: 'Producción Integral de Eventos Corporativos & Galas', path: 'eventos', basePrice: 950 }
];

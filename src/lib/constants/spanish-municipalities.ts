// Dataset unificado de provincias y nodos municipales estratégicos de España (52 Provincias // 100% Cobertura)
export interface TownNode {
  name: string;
  slug: string;
  comarca?: string;
  distanceFromMentrideKm?: number;
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
    { name: "Almer\u00eda", slug: "almeria", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Roquetas de Mar", slug: "roquetas-de-mar", comarca: "Comarca Principal" },
    { name: "El Ejido", slug: "el-ejido", comarca: "Comarca Principal" },
  ],
  'cadiz': [
    { name: "C\u00e1diz", slug: "cadiz", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Jerez de la Frontera", slug: "jerez-de-la-frontera", comarca: "Comarca Principal" },
    { name: "Algeciras", slug: "algeciras", comarca: "Comarca Principal" },
    { name: "San Fernando", slug: "san-fernando", comarca: "Comarca Principal" },
    { name: "El Puerto de Santa Mar\u00eda", slug: "el-puerto-de-santa-maria", comarca: "Comarca Principal" },
    { name: "Chiclana de la Frontera", slug: "chiclana-de-la-frontera", comarca: "Comarca Principal" },
    { name: "Sanl\u00facar de Barrameda", slug: "sanlucar-de-barrameda", comarca: "Comarca Principal" },
    { name: "Arcos de la Frontera", slug: "arcos-de-la-frontera", comarca: "Comarca Principal" },
    { name: "Rota", slug: "rota", comarca: "Comarca Principal" },
    { name: "Conil de la Frontera", slug: "conil-de-la-frontera", comarca: "Comarca Principal" },
    { name: "Tarifa", slug: "tarifa", comarca: "Comarca Principal" },
  ],
  'cordoba': [
    { name: "C\u00f3rdoba", slug: "cordoba", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Lucena", slug: "lucena", comarca: "Comarca Principal" },
    { name: "Puente Genil", slug: "puente-genil", comarca: "Comarca Principal" },
  ],
  'granada': [
    { name: "Granada", slug: "granada", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Motril", slug: "motril", comarca: "Comarca Principal" },
    { name: "Almu\u00f1\u00e9car", slug: "almunecar", comarca: "Comarca Principal" },
    { name: "Baza", slug: "baza", comarca: "Comarca Principal" },
  ],
  'huelva': [
    { name: "Huelva", slug: "huelva", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Lepe", slug: "lepe", comarca: "Comarca Principal" },
    { name: "Almonte", slug: "almonte", comarca: "Comarca Principal" },
  ],
  'jaen': [
    { name: "Ja\u00e9n", slug: "jaen", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Linares", slug: "linares", comarca: "Comarca Principal" },
    { name: "\u00dabeda", slug: "ubeda", comarca: "Comarca Principal" },
    { name: "Baeza", slug: "baeza", comarca: "Comarca Principal" },
  ],
  'malaga': [
    { name: "M\u00e1laga", slug: "malaga", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Marbella", slug: "marbella", comarca: "Comarca Principal" },
    { name: "Mijas", slug: "mijas", comarca: "Comarca Principal" },
    { name: "V\u00e9lez-M\u00e1laga", slug: "velez-malaga", comarca: "Comarca Principal" },
    { name: "Fuengirola", slug: "fuengirola", comarca: "Comarca Principal" },
    { name: "Estepona", slug: "estepona", comarca: "Comarca Principal" },
    { name: "Benalm\u00e1dena", slug: "benalmadena", comarca: "Comarca Principal" },
    { name: "Torremolinos", slug: "torremolinos", comarca: "Comarca Principal" },
    { name: "Alhaur\u00edn de la Torre", slug: "alhaurin-de-la-torre", comarca: "Comarca Principal" },
    { name: "Antequera", slug: "antequera", comarca: "Comarca Principal" },
    { name: "Ronda", slug: "ronda", comarca: "Comarca Principal" },
    { name: "Nerja", slug: "nerja", comarca: "Comarca Principal" },
  ],
  'sevilla': [
    { name: "Sevilla", slug: "sevilla", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Dos Hermanas", slug: "dos-hermanas", comarca: "Comarca Principal" },
    { name: "Alcal\u00e1 de Guada\u00edra", slug: "alcala-de-guadaira", comarca: "Comarca Principal" },
    { name: "Utrera", slug: "utrera", comarca: "Comarca Principal" },
    { name: "Mairena del Aljarafe", slug: "mairena-del-aljarafe", comarca: "Comarca Principal" },
    { name: "\u00c9cija", slug: "ecija", comarca: "Comarca Principal" },
    { name: "Carmona", slug: "carmona", comarca: "Comarca Principal" },
    { name: "Tomares", slug: "tomares", comarca: "Comarca Principal" },
    { name: "Bormujos", slug: "bormujos", comarca: "Comarca Principal" },
  ],
  'huesca': [
    { name: "Huesca", slug: "huesca", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'teruel': [
    { name: "Teruel", slug: "teruel", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'zaragoza': [
    { name: "Zaragoza", slug: "zaragoza", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'asturias': [
    { name: "Oviedo", slug: "asturias", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'baleares': [
    { name: "Palma de Mallorca", slug: "baleares", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Palencia", slug: "palencia", comarca: "Comarca Principal" },
    { name: "Palma de Mallorca", slug: "palma-de-mallorca", comarca: "Comarca Principal" },
    { name: "Ibiza / Eivissa", slug: "ibiza", comarca: "Comarca Principal" },
    { name: "Sant Antoni de Portmany", slug: "sant-antoni-de-portmany", comarca: "Comarca Principal" },
    { name: "Santa Eul\u00e0ria des Riu", slug: "santa-eularia-des-riu", comarca: "Comarca Principal" },
    { name: "Calvi\u00e0", slug: "calvia", comarca: "Comarca Principal" },
    { name: "Andratx", slug: "andratx", comarca: "Comarca Principal" },
    { name: "Alc\u00fadia", slug: "alcudia", comarca: "Comarca Principal" },
    { name: "Pollen\u00e7a", slug: "pollenca", comarca: "Comarca Principal" },
  ],
  'las-palmas': [
    { name: "Las Palmas de Gran Canaria", slug: "las-palmas", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Las Palmas de Gran Canaria", slug: "las-palmas-de-gran-canaria", comarca: "Comarca Principal" },
    { name: "Telde", slug: "telde", comarca: "Comarca Principal" },
    { name: "San Bartolom\u00e9 de Tirajana / Maspalomas", slug: "san-bartolome-de-tirajana", comarca: "Comarca Principal" },
    { name: "Mog\u00e1n", slug: "mogan", comarca: "Comarca Principal" },
  ],
  'santa-cruz-de-tenerife': [
    { name: "Santa Cruz de Tenerife", slug: "santa-cruz-de-tenerife", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "San Crist\u00f3bal de La Laguna", slug: "san-cristobal-de-la-laguna", comarca: "Comarca Principal" },
    { name: "Arona", slug: "arona", comarca: "Comarca Principal" },
    { name: "Adeje", slug: "adeje", comarca: "Comarca Principal" },
  ],
  'cantabria': [
    { name: "Santander", slug: "cantabria", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'avila': [
    { name: "\u00c1vila", slug: "avila", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "El Tiemblo", slug: "el-tiemblo", comarca: "Comarca Principal" },
    { name: "Cebreros", slug: "cebreros", comarca: "Comarca Principal" },
    { name: "Las Navas del Marqu\u00e9s", slug: "las-navas-del-marques", comarca: "Comarca Principal" },
    { name: "Arenas de San Pedro", slug: "arenas-de-san-pedro", comarca: "Comarca Principal" },
    { name: "Candeleda", slug: "candeleda", comarca: "Comarca Principal" },
  ],
  'burgos': [
    { name: "Burgos", slug: "burgos", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'leon': [
    { name: "Le\u00f3n", slug: "leon", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'palencia': [
    { name: "Palencia", slug: "palencia", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'salamanca': [
    { name: "Salamanca", slug: "salamanca", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'segovia': [
    { name: "Segovia", slug: "segovia", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Real Sitio de San Ildefonso / La Granja", slug: "real-sitio-de-san-ildefonso", comarca: "Comarca Principal" },
    { name: "Pedraza", slug: "pedraza", comarca: "Comarca Principal" },
    { name: "Sep\u00falveda", slug: "sepulveda", comarca: "Comarca Principal" },
    { name: "Ayll\u00f3n", slug: "ayllon", comarca: "Comarca Principal" },
    { name: "Cu\u00e9llar", slug: "cuellar", comarca: "Comarca Principal" },
  ],
  'soria': [
    { name: "Soria", slug: "soria", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'valladolid': [
    { name: "Valladolid", slug: "valladolid", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'zamora': [
    { name: "Zamora", slug: "zamora", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'albacete': [
    { name: "Albacete", slug: "albacete", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "La Roda", slug: "la-roda", comarca: "Comarca Principal" },
    { name: "Hell\u00edn", slug: "hellin", comarca: "Comarca Principal" },
    { name: "Villarrobledo", slug: "villarrobledo", comarca: "Comarca Principal" },
  ],
  'ciudad-real': [
    { name: "Ciudad Real", slug: "ciudad-real", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Puertollano", slug: "puertollano", comarca: "Comarca Principal" },
    { name: "Tomelloso", slug: "tomelloso", comarca: "Comarca Principal" },
    { name: "Alc\u00e1zar de San Juan", slug: "alcazar-de-san-juan", comarca: "Comarca Principal" },
    { name: "Valdepe\u00f1as", slug: "valdepenas", comarca: "Comarca Principal" },
    { name: "Manzanares", slug: "manzanares", comarca: "Comarca Principal" },
    { name: "Daimiel", slug: "daimiel", comarca: "Comarca Principal" },
  ],
  'cuenca': [
    { name: "Cuenca", slug: "cuenca", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Taranc\u00f3n", slug: "tarancon", comarca: "Comarca Principal" },
  ],
  'guadalajara': [
    { name: "Guadalajara", slug: "guadalajara", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Azuqueca de Henares", slug: "azuqueca-de-henares", comarca: "Comarca Principal" },
    { name: "Sig\u00fcenza", slug: "siguenza", comarca: "Comarca Principal" },
    { name: "Cabanillas del Campo", slug: "cabanillas-del-campo", comarca: "Comarca Principal" },
    { name: "Alovera", slug: "alovera", comarca: "Comarca Principal" },
    { name: "El Casar", slug: "el-casar", comarca: "Comarca Principal" },
  ],
  'toledo': [
    { name: "Toledo", slug: "toledo", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Talavera de la Reina", slug: "talavera-de-la-reina", comarca: "Comarca Principal" },
    { name: "Illescas", slug: "illescas", comarca: "Comarca Principal" },
    { name: "Sese\u00f1a", slug: "sesena", comarca: "Comarca Principal" },
    { name: "Torrijos", slug: "torrijos", comarca: "Comarca Principal" },
    { name: "Fuensalida", slug: "fuensalida", comarca: "Comarca Principal" },
    { name: "Quintanar de la Orden", slug: "quintanar-de-la-orden", comarca: "Comarca Principal" },
    { name: "Sonseca", slug: "sonseca", comarca: "Comarca Principal" },
    { name: "Madridejos", slug: "madridejos", comarca: "Comarca Principal" },
    { name: "Consuegra", slug: "consuegra", comarca: "Comarca Principal" },
    { name: "Mora", slug: "mora", comarca: "Comarca Principal" },
    { name: "Villaca\u00f1as", slug: "villacanas", comarca: "Comarca Principal" },
    { name: "Bargas", slug: "bargas", comarca: "Comarca Principal" },
    { name: "Ol\u00edas del Rey", slug: "olias-del-rey", comarca: "Comarca Principal" },
    { name: "Yuncos", slug: "yuncos", comarca: "Comarca Principal" },
    { name: "A\u00f1over de Tajo", slug: "anover-de-tajo", comarca: "Comarca Principal" },
    { name: "Oca\u00f1a", slug: "ocana", comarca: "Comarca Principal" },
    { name: "Corral de Almaguer", slug: "corral-de-almaguer", comarca: "Comarca Principal" },
    { name: "La Puebla de Montalb\u00e1n", slug: "la-puebla-de-montalban", comarca: "Comarca Principal" },
    { name: "Mocej\u00f3n", slug: "mocejon", comarca: "Comarca Principal" },
    { name: "Navahermosa", slug: "navahermosa", comarca: "Comarca Principal" },
    { name: "Escalona", slug: "escalona", comarca: "Comarca Principal" },
    { name: "Yeles", slug: "yeles", comarca: "Comarca Principal" },
    { name: "M\u00e9ntrida (Hub Central EAR)", slug: "mentrida", comarca: "Comarca Principal" },
    { name: "Esquivias", slug: "esquivias", comarca: "Comarca Principal" },
    { name: "Ugena", slug: "ugena", comarca: "Comarca Principal" },
    { name: "Carranque", slug: "carranque", comarca: "Comarca Principal" },
    { name: "Numancia de la Sagra", slug: "numancia-de-la-sagra", comarca: "Comarca Principal" },
    { name: "Casarrubios del Monte", slug: "casarrubios-del-monte", comarca: "Comarca Principal" },
    { name: "Valmojado", slug: "valmojado", comarca: "Comarca Principal" },
    { name: "Las Ventas de Retamosa", slug: "las-ventas-de-retamosa", comarca: "Comarca Principal" },
    { name: "Camarena", slug: "camarena", comarca: "Comarca Principal" },
    { name: "Chozas de Canales", slug: "chozas-de-canales", comarca: "Comarca Principal" },
    { name: "Santa Cruz del Retamar", slug: "santa-cruz-de-retamar", comarca: "Comarca Principal" },
    { name: "Almorox", slug: "almorox", comarca: "Comarca Principal" },
    { name: "Hormigos", slug: "hormigos", comarca: "Comarca Principal" },
    { name: "Maqueda", slug: "maqueda", comarca: "Comarca Principal" },
    { name: "Otero", slug: "otero", comarca: "Comarca Principal" },
    { name: "Santa Cruz del Retamar", slug: "santa-cruz-del-retamar", comarca: "Torrijos", distanceFromMentrideKm: 10 },
  ],
  'barcelona': [
    { name: "Barcelona", slug: "barcelona", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Badalona", slug: "badalona", comarca: "Comarca Principal" },
    { name: "Terrassa", slug: "terrassa", comarca: "Comarca Principal" },
    { name: "Sabadell", slug: "sabadell", comarca: "Comarca Principal" },
    { name: "Matar\u00f3", slug: "mataro", comarca: "Comarca Principal" },
    { name: "Santa Coloma de Gramenet", slug: "santa-coloma-de-gramenet", comarca: "Comarca Principal" },
    { name: "Sant Cugat del Vall\u00e8s", slug: "sant-cugat-del-valles", comarca: "Comarca Principal" },
    { name: "Cornell\u00e0 de Llobregat", slug: "cornella-de-llobregat", comarca: "Comarca Principal" },
    { name: "Sant Boi de Llobregat", slug: "sant-boi-de-llobregat", comarca: "Comarca Principal" },
    { name: "Rub\u00ed", slug: "rubi", comarca: "Comarca Principal" },
    { name: "Manresa", slug: "manresa", comarca: "Comarca Principal" },
    { name: "Sitges", slug: "sitges", comarca: "Comarca Principal" },
    { name: "Vilafranca del Pened\u00e8s", slug: "vilafranca-del-penedes", comarca: "Comarca Principal" },
  ],
  'girona': [
    { name: "Girona", slug: "girona", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Blanes", slug: "blanes", comarca: "Comarca Principal" },
    { name: "Lloret de Mar", slug: "lloret-de-mar", comarca: "Comarca Principal" },
  ],
  'lleida': [
    { name: "Lleida", slug: "lleida", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'tarragona': [
    { name: "Tarragona", slug: "tarragona", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Reus", slug: "reus", comarca: "Comarca Principal" },
    { name: "Salou", slug: "salou", comarca: "Comarca Principal" },
    { name: "Cambrils", slug: "cambrils", comarca: "Comarca Principal" },
  ],
  'alicante': [
    { name: "Alicante", slug: "alicante", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Elche", slug: "elche", comarca: "Comarca Principal" },
    { name: "Torrevieja", slug: "torrevieja", comarca: "Comarca Principal" },
    { name: "Orihuela", slug: "orihuela", comarca: "Comarca Principal" },
    { name: "D\u00e9nia", slug: "denia", comarca: "Comarca Principal" },
    { name: "J\u00e1vea / X\u00e0bia", slug: "javea", comarca: "Comarca Principal" },
    { name: "Calpe / Calp", slug: "calpe", comarca: "Comarca Principal" },
    { name: "Altea", slug: "altea", comarca: "Comarca Principal" },
    { name: "Villajoyosa", slug: "villajoyosa", comarca: "Comarca Principal" },
    { name: "Elda", slug: "elda", comarca: "Comarca Principal" },
    { name: "Benidorm", slug: "benidorm", comarca: "Comarca Principal" },
  ],
  'castellon': [
    { name: "Castell\u00f3n de la Plana", slug: "castellon", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'valencia': [
    { name: "Valencia", slug: "valencia", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Torrent", slug: "torrent", comarca: "Comarca Principal" },
    { name: "Gand\u00eda", slug: "gandia", comarca: "Comarca Principal" },
    { name: "Sagunto", slug: "sagunto", comarca: "Comarca Principal" },
    { name: "Alzira", slug: "alzira", comarca: "Comarca Principal" },
    { name: "Cullera", slug: "cullera", comarca: "Comarca Principal" },
    { name: "Requena", slug: "requena", comarca: "Comarca Principal" },
  ],
  'badajoz': [
    { name: "Badajoz", slug: "badajoz", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'caceres': [
    { name: "C\u00e1ceres", slug: "caceres", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'a-coruna': [
    { name: "A Coru\u00f1a", slug: "a-coruna", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Santiago de Compostela", slug: "santiago-de-compostela", comarca: "Comarca Principal" },
  ],
  'lugo': [
    { name: "Lugo", slug: "lugo", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'ourense': [
    { name: "Ourense", slug: "ourense", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'pontevedra': [
    { name: "Pontevedra", slug: "pontevedra", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'madrid': [
    { name: "Madrid", slug: "madrid", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "M\u00f3stoles", slug: "mostoles", comarca: "Comarca Principal" },
    { name: "Alcal\u00e1 de Henares", slug: "alcala-de-henares", comarca: "Comarca Principal" },
    { name: "Fuenlabrada", slug: "fuenlabrada", comarca: "Comarca Principal" },
    { name: "Legan\u00e9s", slug: "leganes", comarca: "Comarca Principal" },
    { name: "Getafe", slug: "getafe", comarca: "Comarca Principal" },
    { name: "Alcorc\u00f3n", slug: "alcorcon", comarca: "Comarca Principal" },
    { name: "Parla", slug: "parla", comarca: "Comarca Principal" },
    { name: "Torrej\u00f3n de Ardoz", slug: "torrejon-de-ardoz", comarca: "Comarca Principal" },
    { name: "Alcobendas", slug: "alcobendas", comarca: "Comarca Principal" },
    { name: "Las Rozas de Madrid", slug: "las-rozas", comarca: "Comarca Principal" },
    { name: "San Sebasti\u00e1n de los Reyes", slug: "san-sebastian-de-los-reyes", comarca: "Comarca Principal" },
    { name: "Pozuelo de Alarc\u00f3n", slug: "pozuelo-de-alarcon", comarca: "Comarca Principal" },
    { name: "Coslada", slug: "coslada", comarca: "Comarca Principal" },
    { name: "Valdemoro", slug: "valdemoro", comarca: "Comarca Principal" },
    { name: "Aranjuez", slug: "aranjuez", comarca: "Comarca Principal" },
    { name: "Arganda del Rey", slug: "arganda-del-rey", comarca: "Comarca Principal" },
    { name: "Pinto", slug: "pinto", comarca: "Comarca Principal" },
    { name: "Colmenar Viejo", slug: "colmenar-viejo", comarca: "Comarca Principal" },
    { name: "Tres Cantos", slug: "tres-cantos", comarca: "Comarca Principal" },
    { name: "Majadahonda", slug: "majadahonda", comarca: "Comarca Principal" },
    { name: "Boadilla del Monte", slug: "boadilla-del-monte", comarca: "Comarca Principal" },
    { name: "Collado Villalba", slug: "collado-villalba", comarca: "Comarca Principal" },
    { name: "Navalcarnero", slug: "navalcarnero", comarca: "Comarca Principal" },
    { name: "Ciempozuelos", slug: "ciempozuelos", comarca: "Comarca Principal" },
    { name: "Mejorada del Campo", slug: "mejorada-del-campo", comarca: "Comarca Principal" },
    { name: "Torrelodones", slug: "torrelodones", comarca: "Comarca Principal" },
    { name: "Algete", slug: "algete", comarca: "Comarca Principal" },
    { name: "Arroyomolinos", slug: "arroyomolinos", comarca: "Comarca Principal" },
    { name: "San Mart\u00edn de la Vega", slug: "san-martin-de-la-vega", comarca: "Comarca Principal" },
    { name: "Humanes de Madrid", slug: "humanes-de-madrid", comarca: "Comarca Principal" },
    { name: "Villaviciosa de Od\u00f3n", slug: "villaviciosa-de-odon", comarca: "Comarca Principal" },
    { name: "San Lorenzo de El Escorial", slug: "san-lorenzo-de-el-escorial", comarca: "Comarca Principal" },
    { name: "El Escorial", slug: "el-escorial", comarca: "Comarca Principal" },
    { name: "Guadarrama", slug: "guadarrama", comarca: "Comarca Principal" },
    { name: "Alpedrete", slug: "alpedrete", comarca: "Comarca Principal" },
    { name: "Moralzarzal", slug: "moralzarzal", comarca: "Comarca Principal" },
    { name: "Manzanares el Real", slug: "manzanares-el-real", comarca: "Comarca Principal" },
    { name: "Soto del Real", slug: "soto-del-real", comarca: "Comarca Principal" },
    { name: "Miraflores de la Sierra", slug: "miraflores-de-la-sierra", comarca: "Comarca Principal" },
    { name: "Chinch\u00f3n", slug: "chinchon", comarca: "Comarca Principal" },
    { name: "San Mart\u00edn de Valdeiglesias", slug: "san-martin-de-valdeiglesias", comarca: "Comarca Principal" },
    { name: "Villa del Prado", slug: "villa-del-prado", comarca: "Comarca Principal" },
    { name: "Cadalso de los Vidrios", slug: "cadalso-de-los-vidrios", comarca: "Comarca Principal" },
    { name: "Aldea del Fresno", slug: "aldea-del-fresno", comarca: "Comarca Principal" },
    { name: "Pelayos de la Presa", slug: "pelayos-de-la-presa", comarca: "Comarca Principal" },
  ],
  'murcia': [
    { name: "Murcia", slug: "murcia", comarca: "Centro", distanceFromMentrideKm: 60 },
    { name: "Lorca", slug: "lorca", comarca: "Comarca Principal" },
    { name: "\u00c1guilas", slug: "aguilas", comarca: "Comarca Principal" },
    { name: "Yecla", slug: "yecla", comarca: "Comarca Principal" },
    { name: "Caravaca de la Cruz", slug: "caravaca-de-la-cruz", comarca: "Comarca Principal" },
  ],
  'navarra': [
    { name: "Pamplona", slug: "navarra", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'alava': [
    { name: "Vitoria-Gasteiz", slug: "alava", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'guipuzcoa': [
    { name: "San Sebasti\u00e1n", slug: "guipuzcoa", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'vizcaya': [
    { name: "Bilbao", slug: "vizcaya", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'la-rioja': [
    { name: "Logro\u00f1o", slug: "la-rioja", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'ceuta': [
    { name: "Ceuta", slug: "ceuta", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
  'melilla': [
    { name: "Melilla", slug: "melilla", comarca: "Centro", distanceFromMentrideKm: 60 },
  ],
};

export const SERVICES_PSEO_EXPANDED = [
  { id: 'mariachis', title: 'Mariachis de Gala & Serenatas', path: 'mariachi-gala', basePrice: 350 },
  { id: 'bodas', title: 'Música de Bodas & Ceremonias de Lujo', path: 'bodas', basePrice: 750 },
  { id: 'catering-brasas', title: 'Catering de Brasas & Fuego Vivo', path: 'catering-brasas', basePrice: 45 },
  { id: 'vimume-b2g', title: 'Programa VIMUME Neuroacústica B2G', path: 'vimume-b2g', basePrice: 2800 },
  { id: 'sonido-bose', title: 'Sonorización 12 W/pax Bose F1', path: 'sonido-bose', basePrice: 1800 }
];

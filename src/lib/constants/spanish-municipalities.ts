// Dataset unificado de provincias y nodos municipales estratégicos de España
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
  madrid: [
    { name: "Navalcarnero", slug: "navalcarnero", comarca: "Suroeste", distanceFromMentrideKm: 25, featuredVenues: ["Finca La Alquería", "Plaza de Segovia"] },
    { name: "Aranjuez", slug: "aranjuez", comarca: "Las Vegas", distanceFromMentrideKm: 55, featuredVenues: ["Palacio Real", "Finca El Regajal"] },
    { name: "Móstoles", slug: "mostoles", comarca: "Sur", distanceFromMentrideKm: 35, featuredVenues: ["Teatro del Bosque", "Fincas de Celebraciones Sur"] },
    { name: "Alcorcón", slug: "alcorcon", comarca: "Sur", distanceFromMentrideKm: 38, featuredVenues: ["Castillo de San José de Valderas"] },
    { name: "Fuenlabrada", slug: "fuenlabrada", comarca: "Sur", distanceFromMentrideKm: 40, featuredVenues: ["Plaza de España", "Salones Gala"] },
    { name: "Getafe", slug: "getafe", comarca: "Sur", distanceFromMentrideKm: 45, featuredVenues: ["Cerro de los Ángeles", "Hotel Fénix"] },
    { name: "Leganés", slug: "leganes", comarca: "Sur", distanceFromMentrideKm: 42, featuredVenues: ["La Cubierta", "Auditorio Padre Soler"] },
    { name: "Majadahonda", slug: "majadahonda", comarca: "Oeste", distanceFromMentrideKm: 48, featuredVenues: ["Finca Las Tenadas", "Monte del Pilar"] },
    { name: "Las Rozas", slug: "las-rozas", comarca: "Oeste", distanceFromMentrideKm: 50, featuredVenues: ["Las Rozas Village", "Finca Monteviejo"] },
    { name: "Pozuelo de Alarcón", slug: "pozuelo-de-alarcon", comarca: "Oeste", distanceFromMentrideKm: 45, featuredVenues: ["La Finca VIP", "Zoco Pozuelo"] },
    { name: "Boadilla del Monte", slug: "boadilla-del-monte", comarca: "Oeste", distanceFromMentrideKm: 40, featuredVenues: ["Palacio del Infante Don Luis", "Finca Las Jarillas"] },
    { name: "San Martín de Valdeiglesias", slug: "san-martin-de-valdeiglesias", comarca: "Sierra Oeste", distanceFromMentrideKm: 38, featuredVenues: ["Castillo de la Coracera", "Pantano de San Juan"] },
    { name: "Villa del Prado", slug: "villa-del-prado", comarca: "Sierra Oeste", distanceFromMentrideKm: 22, featuredVenues: ["Ermita de la Poveda", "Huerta de Madrid"] },
    { name: "Aldea del Fresno", slug: "aldea-del-fresno", comarca: "Sierra Oeste", distanceFromMentrideKm: 18, featuredVenues: ["Riberas del Alberche", "Safari Madrid"] },
    { name: "Brunete", slug: "brunete", comarca: "Oeste", distanceFromMentrideKm: 32, featuredVenues: ["Plaza Mayor de Brunete"] },
    { name: "Sevilla la Nueva", slug: "sevilla-la-nueva", comarca: "Oeste", distanceFromMentrideKm: 28, featuredVenues: ["Palacio de Baena"] },
    { name: "Alcalá de Henares", slug: "alcala-de-henares", comarca: "Cuenca del Henares", distanceFromMentrideKm: 75, featuredVenues: ["Parador de Alcalá", "Finca El Retamar"] },
    { name: "San Lorenzo de El Escorial", slug: "san-lorenzo-de-el-escorial", comarca: "Sierra de Guadarrama", distanceFromMentrideKm: 60, featuredVenues: ["Monasterio de El Escorial", "Finca El Campillo"] }
  ],
  toledo: [
    { name: "Méntrida", slug: "mentrida", comarca: "Torrijos", distanceFromMentrideKm: 0, featuredVenues: ["Sede Central Productora EAR", "Bodegas D.O. Méntrida", "Fincas de Viñedos"] },
    { name: "Valmohado", slug: "valmohado", comarca: "Torrijos", distanceFromMentrideKm: 6, featuredVenues: ["Fincas El Romeral", "Plaza de España"] },
    { name: "Casarrubios del Monte", slug: "casarrubios-del-monte", comarca: "La Sagra", distanceFromMentrideKm: 12, featuredVenues: ["Castillo de Casarrubios", "Aeródromo"] },
    { name: "Illescas", slug: "illescas", comarca: "La Sagra", distanceFromMentrideKm: 30, featuredVenues: ["Santuario de la Caridad", "Finca La Casona"] },
    { name: "Torrijos", slug: "torrijos", comarca: "Torrijos", distanceFromMentrideKm: 24, featuredVenues: ["Palacio de Pedro I", "Plaza de Toros"] },
    { name: "Talavera de la Reina", slug: "talavera-de-la-reina", comarca: "Tierras de Talavera", distanceFromMentrideKm: 65, featuredVenues: ["Basílica del Prado", "Teatro Victoria"] },
    { name: "Fuensalida", slug: "fuensalida", comarca: "Torrijos", distanceFromMentrideKm: 18, featuredVenues: ["Finca Los Laureles", "Plaza del Generalísimo"] },
    { name: "Santa Cruz del Retamar", slug: "santa-cruz-del-retamar", comarca: "Torrijos", distanceFromMentrideKm: 10, featuredVenues: ["Finca Retamar Golf", "Calalberche"] },
    { name: "Escalona", slug: "escalona", comarca: "Torrijos", distanceFromMentrideKm: 14, featuredVenues: ["Castillo-Palacio de Escalona", "Riberas del Alberche"] },
    { name: "Almorox", slug: "almorox", comarca: "Torrijos", distanceFromMentrideKm: 16, featuredVenues: ["Pinar de Almorox", "Finca La Dehesa"] },
    { name: "Ocaña", slug: "ocana", comarca: "Mesa de Ocaña", distanceFromMentrideKm: 70, featuredVenues: ["Plaza Mayor Monumental"] },
    { name: "Quintanar de la Orden", slug: "quintanar-de-la-orden", comarca: "Mancha Alta", distanceFromMentrideKm: 110, featuredVenues: ["Ermita de la Virgen de la Piedad"] },
    { name: "Madridejos", slug: "madridejos", comarca: "Mancha Alta", distanceFromMentrideKm: 105, featuredVenues: ["Molino del Tío Genaro"] },
    { name: "Consuegra", slug: "consuegra", comarca: "Mancha Alta", distanceFromMentrideKm: 115, featuredVenues: ["Castillo de Consuegra", "Molinos de Viento"] },
    { name: "Mora", slug: "mora", comarca: "La Mancha", distanceFromMentrideKm: 60, featuredVenues: ["Castillo de Peñas Negras"] }
  ]
};

export const SERVICES_PSEO_EXPANDED = [
  { id: 'mariachis', title: 'Mariachis de Gala & Serenatas', path: 'mariachi-gala', basePrice: 350 },
  { id: 'bodas', title: 'Música de Bodas & Ceremonias de Lujo', path: 'bodas', basePrice: 750 },
  { id: 'catering-brasas', title: 'Catering de Brasas & Fuego Vivo', path: 'catering-brasas', basePrice: 45 },
  { id: 'vimume-b2g', title: 'Programa VIMUME Neuroacústica B2G', path: 'vimume-b2g', basePrice: 2800 },
  { id: 'sonido-bose', title: 'Sonorización 12 W/pax Bose F1', path: 'sonido-bose', basePrice: 1800 }
];

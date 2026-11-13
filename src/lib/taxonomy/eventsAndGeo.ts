// Taxonomía Exhaustiva de Ocasiones y Eventos EAR OS
export interface EventOccasion {
  id: string;
  name: string;
  category: "familiar" | "romance" | "corporativo" | "institucional" | "homenaje";
  recommendedFormat: string;
  defaultDuration: number;
}

export const EVENT_OCCASIONS: EventOccasion[] = [
  // Románticas / Serenatas
  { id: "serenata-amor", name: "Serenata Sorpresa de Amor", category: "romance", recommendedFormat: "Trío Clásico (3 Músicos)", defaultDuration: 1 },
  { id: "pedida-mano", name: "Pedida de Mano / Compromiso", category: "romance", recommendedFormat: "Cuarteto Imperial (4 Músicos)", defaultDuration: 1 },
  { id: "reconciliacion", name: "Reconciliación Romántica", category: "romance", recommendedFormat: "Solista Edwin Agudelo", defaultDuration: 1 },
  { id: "bodas-plata-oro", name: "Bodas de Plata / Oro", category: "romance", recommendedFormat: "Quinteto Monumental (5 Músicos)", defaultDuration: 1.5 },

  // Familiares y Personales
  { id: "cumpleanos-sorpresa", name: "Cumpleaños Sorpresa", category: "familiar", recommendedFormat: "Trío Clásico (3 Músicos)", defaultDuration: 1 },
  { id: "cumpleanos-adulto", name: "Cumpleaños (40, 50, 60, 70, 80+)", category: "familiar", recommendedFormat: "Cuarteto Imperial (4 Músicos)", defaultDuration: 1.5 },
  { id: "boda-ceremonia", name: "Boda: Entrada y Ceremonia", category: "familiar", recommendedFormat: "Quinteto Monumental (5 Músicos)", defaultDuration: 1.5 },
  { id: "boda-coctel", name: "Boda: Cóctel o Banquete", category: "familiar", recommendedFormat: "Cuarteto Imperial (4 Músicos)", defaultDuration: 2 },
  { id: "boda-barra-libre", name: "Boda: Barra Libre / Fiesta", category: "familiar", recommendedFormat: "Quinteto Monumental (5 Músicos)", defaultDuration: 2 },
  { id: "bautizo-comunion", name: "Bautizo / Primera Comunión", category: "familiar", recommendedFormat: "Trío Clásico (3 Músicos)", defaultDuration: 1 },
  { id: "despedida-soltera", name: "Despedida de Soltera / Soltero", category: "familiar", recommendedFormat: "Trío Clásico (3 Músicos)", defaultDuration: 1 },

  // Corporativos y Empresa
  { id: "cena-navidad", name: "Cena de Navidad de Empresa", category: "corporativo", recommendedFormat: "Quinteto Monumental (5 Músicos)", defaultDuration: 2 },
  { id: "aniversario-empresa", name: "Aniversario Corporativo", category: "corporativo", recommendedFormat: "Quinteto Monumental (5 Músicos)", defaultDuration: 2 },
  { id: "inauguracion", name: "Inauguración de Sede / Negocio", category: "corporativo", recommendedFormat: "Cuarteto Imperial (4 Músicos)", defaultDuration: 1.5 },
  { id: "feria-congreso", name: "Feria / Congreso / Stand VIP", category: "corporativo", recommendedFormat: "Solista Edwin Agudelo", defaultDuration: 2 },

  // Institucional y Fiestas
  { id: "fiesta-patronal", name: "Fiestas Patronales / Ayuntamientos", category: "institucional", recommendedFormat: "Quinteto Monumental (5 Músicos)", defaultDuration: 2 },
  { id: "recepcion-diplomatica", name: "Gala Consular / Diplomática", category: "institucional", recommendedFormat: "Quinteto Monumental (5 Músicos)", defaultDuration: 2 },

  // Homenajes y Respeto
  { id: "homenaje-vida", name: "Homenaje en Vida / Jubilación", category: "homenaje", recommendedFormat: "Trío Clásico (3 Músicos)", defaultDuration: 1 },
  { id: "sepelio-solemne", name: "Despedida Solemne / Sepelio", category: "homenaje", recommendedFormat: "Solista Edwin Agudelo", defaultDuration: 1 },
];

// Municipios cabecera y hubs por provincia (ampliable a base de datos completa)
export const MUNICIPIOS_ESPANA: Record<string, string[]> = {
  madrid: ["Madrid", "Alcalá de Henares", "Móstoles", "Fuenlabrada", "Leganés", "Getafe", "Alcorcón", "Torrejón de Ardoz", "Parla", "Alcobendas", "Las Rozas", "San Sebastián de los Reyes", "Pozuelo de Alarcón", "Rivas-Vaciamadrid", "Valdemoro", "Majadahonda", "Collado Villalba", "Aranjuez", "Arganda del Rey", "Boadilla del Monte", "Pinto", "Colmenar Viejo", "San Fernando de Henares", "Tres Cantos", "Galapagar", "Villaviciosa de Odón", "Navalcarnero", "Ciempozuelos", "Torrelodones", "Arroyomolinos", "Algete", "Mejorada del Campo", "Villanueva de la Cañada", "San Martín de la Vega", "Humanes de Madrid", "Chinchón", "Méntrida"],
  toledo: ["Toledo", "Talavera de la Reina", "Illescas", "Seseña", "Torrijos", "Sonseca", "Fuensalida", "Quintanar de la Orden", "Madridejos", "Consuegra", "Bargas", "Ocaña", "Méntrida", "Yuncos", "Santa Cruz de la Retamar", "Escalona", "Casarrubios del Monte"],
  barcelona: ["Barcelona", "L'Hospitalet de Llobregat", "Badalona", "Terrassa", "Sabadell", "Mataró", "Santa Coloma de Gramenet", "Sant Cugat del Vallès", "Cornellà de Llobregat", "Sant Boi de Llobregat", "Manresa", "Rubí", "Vilanova i la Geltrú", "Viladecans", "Castelldefels", "Granollers"],
  valencia: ["Valencia", "Torrent", "Gandia", "Paterna", "Sagunto", "Alzira", "Mislata", "Burjassot", "Ontinyent", "Aldaia", "Manises", "Alaquàs", "Xàtiva", "Xirivella", "Sueca", "Catarroja"],
  sevilla: ["Sevilla", "Dos Hermanas", "Alcalá de Guadaíra", "Utrera", "Mairena del Aljarafe", "Écija", "La Rinconada", "Los Palacios y Villafranca", "Coria del Río", "Carmona", "Lebrija", "Camas"],
  malaga: ["Málaga", "Marbella", "Mijas", "Fuengirola", "Vélez-Málaga", "Torremolinos", "Benalmádena", "Estepona", "Rincón de la Victoria", "Antequera", "Alhaurín de la Torre", "Ronda"],
  guadalajara: ["Guadalajara", "Azuqueca de Henares", "Alovera", "El Casar", "Cabanillas del Campo", "Marchamalo", "Villanueva de la Torre", "Torrejón del Rey", "Sigüenza"],
};

// Resolver la temperatura del lead para determinar la pestaña inicial
export function resolveLeadTemperature(tempParam?: string | null, stepParam?: string | null): 1 | 2 | 3 | 4 {
  if (stepParam === "4" || tempParam === "hot" || tempParam === "emergency") return 4;
  if (stepParam === "3" || tempParam === "warm") return 3;
  if (stepParam === "2") return 2;
  return 1; // cold / inspiracional por defecto
}

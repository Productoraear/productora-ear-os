export interface ArtistFormat {
  id: string;
  name: string;
  subtitle: string;
  musiciansCount: number;
  basePrice: number;
  duration: string;
  acousticPowerWatts: number;
  maxPaxRecommended: number;
  matchScore: number; // e.g. 98%
  rating: number; // e.g. 4.98
  reviewCount: number;
  image: string;
  tags: string[];
  repertoire: string[];
  riderEquipment: string[];
  description: string;
}

export interface WeddingMilestone {
  id: string;
  name: string;
  iconName: string;
  timeSlot: string;
  defaultFormatId: string;
  selectedFormatId: string | null;
  volumeLimitDb: number;
  notes: string;
}

export const SOVEREIGN_ARTIST = {
  name: "Edwin Agudelo",
  title: "Tenor Lírico & Mariachi XXI de Gran Gala",
  badge: "PACIENTE CERO // MASTER ARTIST",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
  phone: "+34 693 693 048",
  phoneClean: "34693693048",
  guaranteeText: "Garantía '0 Fallos' Acústica homologada a 12 W/pax y Seguro RC 1M€.",
  split: {
    artistPercent: 80,
    earOsPercent: 10,
    vimumePercent: 10
  }
};

export const ARTIST_FORMATS: ArtistFormat[] = [
  {
    id: "solista-gala",
    name: "Solista Imperial & Tenor",
    subtitle: "Edwin Agudelo + Sonido Bose F1",
    musiciansCount: 1,
    basePrice: 350,
    duration: "2 salidas de 30 min",
    acousticPowerWatts: 2000,
    maxPaxRecommended: 150,
    matchScore: 99,
    rating: 4.99,
    reviewCount: 47,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    tags: ["Paciente Cero", "Tenor Lírico", "Bose F1", "Photocall Sombreros"],
    repertoire: ["Si Nos Dejan", "El Rey", "Nessun Dorma", "Cielito Lindo", "La Bikina"],
    riderEquipment: ["Bose F1 Model 812", "Microfonía Shure Axient Digital", "Iluminación Escénica LED"],
    description: "La esencia del Mariachi XXI y ópera crossover. Voz en directo con potencia de hasta 2000W para bodas y recepciones selectas."
  },
  {
    id: "cuarteto-imperial",
    name: "Cuarteto de Gala Charro",
    subtitle: "Voz, 2 Trompetas, Vihuela y Guitarrón",
    musiciansCount: 4,
    basePrice: 950,
    duration: "60 min continuos",
    acousticPowerWatts: 3000,
    maxPaxRecommended: 250,
    matchScore: 96,
    rating: 4.97,
    reviewCount: 38,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80",
    tags: ["Equilibrio VIP", "Armonía Acústica", "Botonadura Plata"],
    repertoire: ["Volver, Volver", "El Mariachi Loco", "Bésame Mucho", "Granada", "Serenata Huasteca"],
    riderEquipment: ["Sistema Electro-Voice / Bose", "Microfonía inalámbrica para trompetas", "Ramillete floral protocolario"],
    description: "El formato de oro para cócteles y ceremonias. Armonía completa tradicional mexicana con arreglos líricos contemporáneos."
  },
  {
    id: "ensamble-gala-6",
    name: "Ensamble Mariachi Gala 6+",
    subtitle: "6 Músicos de Alta Escuela",
    musiciansCount: 6,
    basePrice: 1450,
    duration: "60-75 min en 2 partes",
    acousticPowerWatts: 4500,
    maxPaxRecommended: 400,
    matchScore: 94,
    rating: 4.98,
    reviewCount: 29,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    tags: ["Potencia Escénica", "Violines de Gala", "Traje de Autor"],
    repertoire: ["El Cascabel", "Caminos de Michoacán", "Amor Eterno", "Guadalajara", "México Lindo y Querido"],
    riderEquipment: ["Line Array Bose", "Mesa digital Allen & Heath", "Monitorización In-Ear Sennheiser"],
    description: "Despliegue monumental para bodas de alto copete y eventos corporativos de élite. Presencia imponente y sonido cinematográfico."
  },
  {
    id: "gran-gala-monumental",
    name: "Gran Gala Monumental (9 a 16 Músicos)",
    subtitle: "Orquesta Mariachi Sinfónica & Espectáculo",
    musiciansCount: 12,
    basePrice: 2800,
    duration: "90 min espectáculo total",
    acousticPowerWatts: 8000,
    maxPaxRecommended: 800,
    matchScore: 98,
    rating: 5.0,
    reviewCount: 16,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80",
    tags: ["Sinfónico", "Exclusividad Absoluta", "Showrunner Dedicado"],
    repertoire: ["Huapango de Moncayo", "Popurrí Juan Gabriel", "Granada Sinfónica", "O Sole Mio Mariachi"],
    riderEquipment: ["Line Array d&b audiotechnik", "Técnico FOH y Monitores dedicados", "Show de luces DMX"],
    description: "El culmen de la música en vivo en España. Despliegue orquestal con sección de cuerda, vientos y solistas de primer nivel."
  }
];

export const WEDDING_MILESTONES_DEFAULT: WeddingMilestone[] = [
  {
    id: "ceremonia",
    name: "1. Ceremonia Nupcial (Civil o Religiosa)",
    iconName: "Heart",
    timeSlot: "12:30 - 13:30",
    defaultFormatId: "solista-gala",
    selectedFormatId: "solista-gala",
    volumeLimitDb: 75,
    notes: "Entrada de la novia con Ave María / Voz Tenor íntima"
  },
  {
    id: "coctel",
    name: "2. Cóctel de Bienvenida",
    iconName: "Sparkles",
    timeSlot: "14:00 - 15:30",
    defaultFormatId: "cuarteto-imperial",
    selectedFormatId: "cuarteto-imperial",
    volumeLimitDb: 85,
    notes: "Mariachi dinámico entre los invitados con repertorio alegre y animado"
  },
  {
    id: "banquete",
    name: "3. Entrada al Banquete & Brindis",
    iconName: "Crown",
    timeSlot: "16:00 - 16:30",
    defaultFormatId: "cuarteto-imperial",
    selectedFormatId: null,
    volumeLimitDb: 80,
    notes: "Momento clímax con canción especial elegida por los novios"
  },
  {
    id: "fiesta",
    name: "4. Barra Libre & Fin de Fiesta",
    iconName: "Music",
    timeSlot: "19:00 - 20:30",
    defaultFormatId: "ensamble-gala-6",
    selectedFormatId: null,
    volumeLimitDb: 95,
    notes: "Show interactivo bailable con sombreros y fotos"
  }
];

export const MOODBOARD_AESTHETICS = [
  {
    id: "black-tie",
    name: "Black Tie & Velvet Gala",
    badge: "LUXURY & MINIMAL",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    color: "#ecb613",
    acousticTarget: "Presión Acústica Cristalina 12 W/pax",
    recommendedFormat: "cuarteto-imperial",
    quoteBonus: 0
  },
  {
    id: "rustique-charro",
    name: "Finca Imperial & Charro Romántico",
    badge: "TRADICIÓN NOBLE",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80",
    color: "#e67e22",
    acousticTarget: "Sonido Abierto con Cobertura 360° Bose",
    recommendedFormat: "solista-gala",
    quoteBonus: 50
  },
  {
    id: "imperial-gold",
    name: "Gala Monumental S-Class",
    badge: "MÁXIMA EXCLUSIVIDAD",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    color: "#f5c538",
    acousticTarget: "Line Array d&b 8000W + Iluminación Escénica",
    recommendedFormat: "gran-gala-monumental",
    quoteBonus: 200
  },
  {
    id: "intimate-candles",
    name: "Acústico Íntimo a la Luz de Velas",
    badge: "ROMANCE DISCRETO",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
    color: "#ec4899",
    acousticTarget: "Sonorización VIMUME Suave <75 dB",
    recommendedFormat: "solista-gala",
    quoteBonus: -50
  }
];

export function calculateQuote(params: {
  basePrice: number;
  extraMusicians: number;
  distanceKm: number;
  pax: number;
  hasBoseSound: boolean;
  hasPhotocall: boolean;
}) {
  const musicianMultiplier = params.extraMusicians * 180;
  const kmFee = params.distanceKm > 30 ? (params.distanceKm - 30) * 0.95 : 0;
  const soundFee = params.hasBoseSound ? Math.max(120, params.pax * 0.9) : 0;
  const photocallFee = params.hasPhotocall ? 80 : 0;

  const total = Math.round(params.basePrice + musicianMultiplier + kmFee + soundFee + photocallFee);
  const deposit = 100; // Depósito estándar de reserva Stripe
  const restAtEvent = total - deposit;
  const requiredWatts = params.pax * 12; // 12 W/pax

  const splitArtist = Math.round(total * 0.8);
  const splitEar = Math.round(total * 0.1);
  const splitVimume = total - splitArtist - splitEar;

  return {
    total,
    deposit,
    restAtEvent,
    requiredWatts,
    kmFee: Math.round(kmFee),
    split: {
      artist: splitArtist,
      ear: splitEar,
      vimume: splitVimume
    }
  };
}

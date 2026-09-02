export type ArtistRole = 'SOLO_ARTIST' | 'BAND' | 'PRODUCER' | 'COMPOSER';
export type ArtistStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type ReleaseFormat = 'SINGLE' | 'EP' | 'ALBUM' | 'REMIX';
export type ContractStatus = 'DRAFT' | 'NEGOTIATION' | 'SIGNED' | 'EXPIRED';
export type CampaignStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface ArtistRider {
  version: number;
  title: string;
  url: string;
  isSigned: boolean;
}

export interface ArtistRelease {
  id: string;
  title: string;
  format: ReleaseFormat;
  releaseDate: string;
  upc?: string;
  isrc?: string;
  coverUrl?: string;
  spotifyStreams?: number;
  appleStreams?: number;
}

export interface ArtistContract {
  id: string;
  title: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  commissionRate: number; // e.g., 20%
  advanceAmount: number; // e.g., 10000 EUR
  documentUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: 'BLOCKED' | 'PENDING' | 'CONFIRMED';
  location: string;
}

export interface CampaignNode {
  id: string;
  title: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  roi: number;
}

export interface AnalyticsSummary {
  monthlyListeners: number;
  totalStreams: number;
  playlistReach: number;
  growthRate: number; // e.g., 8.5%
}

export interface ArtistProfileData {
  id: string;
  slug: string;
  displayName: string;
  legalName: string;
  role: ArtistRole;
  bioShort: string;
  bioLong: string;
  genres: string[];
  status: ArtistStatus;
  mediaKitUrl?: string;
  homeBase: string;
  language: string;
  territories: string[];
  socials: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    twitter?: string;
  };
  releases: ArtistRelease[];
  contracts: ArtistContract[];
  calendar: CalendarEvent[];
  campaigns: CampaignNode[];
  analytics: AnalyticsSummary;
  notes: string[];
  tasksPending: string[];
}

export const SEED_ARTISTS: ArtistProfileData[] = [
  {
    id: "ART-WAG-001",
    slug: "edwin-agudelo",
    displayName: "Edwin Agudelo",
    legalName: "Edwin Agudelo Agudelo",
    role: "PRODUCER",
    bioShort: "CEO de Productora EAR, artista de gala, cantante, compositor y empresario del entretenimiento.",
    bioLong: "Nacido en Amagá-Antioquia y formado en las exigentes ligas musicales de Medellín, Edwin Agudelo inició su ascenso a los 16 años. Tras emigrar a España, dominó el sector del ocio como director de salas y orquestó 37 grandes conciertos internacionales. Hoy lidera la revolución del Mariachi de gala y el diseño sonoro como CEO de Productora EAR, fusionando la maestría tradicional con las soluciones acústicas avanzadas de VIMUME.",
    genres: ["Mariachi de Gala", "Balada Sinfónica", "Estimulación Cognitiva"],
    status: "PUBLISHED",
    mediaKitUrl: "https://productoraear.com/assets/media/edwin-agudelo-kit.jpg",
    homeBase: "Madrid, España",
    language: "Español",
    territories: ["Europa", "América Latina", "EE.UU."],
    socials: {
      instagram: "instagram.com/edwin.productoraear",
      youtube: "youtube.com/c/productoraear",
      spotify: "open.spotify.com/artist/edwin_ear"
    },
    releases: [
      {
        id: "REL-001",
        title: "Las Mañanitas de Gala (Live)",
        format: "ALBUM",
        releaseDate: "2026-02-15",
        upc: "889030102031",
        isrc: "ES-A01-26-00045",
        spotifyStreams: 840210,
        appleStreams: 349120
      },
      {
        id: "REL-002",
        title: "El Rey (Sinfónico)",
        format: "SINGLE",
        releaseDate: "2026-05-10",
        upc: "889030102099",
        isrc: "ES-A01-26-00088",
        spotifyStreams: 120500,
        appleStreams: 45800
      }
    ],
    contracts: [
      {
        id: "CON-MAD-2026",
        title: "Contrato de Co-Edición y Management Exclusivo",
        status: "SIGNED",
        startDate: "2026-01-01",
        endDate: "2031-12-31",
        commissionRate: 15,
        advanceAmount: 25000
      }
    ],
    calendar: [
      {
        id: "EV-001",
        title: "Inauguración Festival Modular Madrid",
        startsAt: "2026-06-12T21:00:00Z",
        endsAt: "2026-06-13T01:00:00Z",
        status: "CONFIRMED",
        location: "Matadero Madrid, España"
      }
    ],
    campaigns: [
      {
        id: "CAM-001",
        title: "Lanzamiento Nacional Mariachi Sol de Oro",
        status: "COMPLETED",
        budget: 5000,
        spent: 4890,
        roi: 185
      }
    ],
    analytics: {
      monthlyListeners: 154200,
      totalStreams: 2490000,
      playlistReach: 4850000,
      growthRate: 12.4
    },
    notes: [
      "Prefiere monitores in-ear de alta gama Shure SE846 para directos.",
      "Requiere una toma monofónica balanceada XLR directa para su sintetizador Eurorack."
    ],
    tasksPending: [
      "Aprobar la mezcla final del remix de Colibri",
      "Actualizar el rider técnico de la gira de verano"
    ]
  },
  {
    id: "ART-WAG-002",
    slug: "colibri-symphony",
    displayName: "Colibrí Symphony Project",
    legalName: "Orquesta de Estimulación Cognitiva VIMUME",
    role: "BAND",
    bioShort: "Ensamble clínico y artístico dedicado a la creación de paisajes neuro-musicales.",
    bioLong: "Colibrí Symphony es el brazo orquestal de VIMUME, especializado en el desarrollo y reproducción en vivo de sinfonías moduladas a 40Hz para la regeneración microglial de pacientes cognitivos.",
    genres: ["Ambient", "Healing", "Classical Therapy"],
    status: "PUBLISHED",
    homeBase: "Barcelona, España",
    language: "Español",
    territories: ["Europa", "Japón"],
    socials: {
      spotify: "open.spotify.com/artist/colibri_vimume"
    },
    releases: [
      {
        id: "REL-003",
        title: "Fábula del Colibrí (40Hz Neuro-Cut)",
        format: "SINGLE",
        releaseDate: "2026-04-01",
        upc: "889030105001",
        isrc: "ES-A01-26-00074",
        spotifyStreams: 450120,
        appleStreams: 198200
      }
    ],
    contracts: [
      {
        id: "CON-BCN-2026",
        title: "Contrato de Adquisición de Catálogo Clínico",
        status: "SIGNED",
        startDate: "2026-03-01",
        endDate: "2036-03-01",
        commissionRate: 10,
        advanceAmount: 50000
      }
    ],
    calendar: [
      {
        id: "EV-002",
        title: "Concierto de Estimulación Cognitiva",
        startsAt: "2026-07-05T17:00:00Z",
        endsAt: "2026-07-05T19:00:00Z",
        status: "CONFIRMED",
        location: "Auditori de Barcelona, España"
      }
    ],
    campaigns: [
      {
        id: "CAM-002",
        title: "Campaña RAG & Música en Centros Clínicos",
        status: "ACTIVE",
        budget: 8000,
        spent: 3400,
        roi: 95
      }
    ],
    analytics: {
      monthlyListeners: 89000,
      totalStreams: 920000,
      playlistReach: 1200000,
      growthRate: 8.9
    },
    notes: [
      "Requiere acoplar el oscilador purificador Gamma de 40Hz al sistema general de PA del teatro."
    ],
    tasksPending: [
      "Firmar anexo de distribución en territorios asiáticos"
    ]
  }
];

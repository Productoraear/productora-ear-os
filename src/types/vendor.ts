/**
 * 🏛️ EAR OS V2 — CANONICAL VENDOR SCHEMA (S-CLASS)
 * Estándar de tipado para los 8.352 proveedores homologados del Ecosistema EAR OS.
 */

export type VendorCategory = 
  | 'FINCAS_Y_ESPACIOS'
  | 'AUDIO_LUCES'
  | 'MUSICA_VIVO'
  | 'WEDDING_PLANNER'
  | 'FOTOGRAFIA_VIDEO'
  | 'CATERING'
  | 'DECORACION'
  | 'MODA_BELLEZA'
  | 'TRANSPORTE'
  | 'SERVICIOS_EVENTOS';

export interface VendorPricing {
  minPricePerPax?: number;
  rentalBasePrice: number;
  currency: string;
}

export interface VendorMetrics {
  rating: number;
  reviewCount: number;
  verificationLevel: 'S_CLASS_AUDITED' | 'SOVEREIGN_VERIFIED' | 'CLAIM_PENDING';
}

export interface VendorLocation {
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  country: string;
  lat?: number | null;
  lng?: number | null;
  googleMapsUrl: string;
}

export interface VendorMedia {
  coverImage: string;
  gallery: string[];
}

export interface VendorTechnicalSpecs {
  maxPax: number;
  acousticPowerRequiredWatts: number;
  subwoofersIncluded: boolean;
  noiseLimiterDba: number;
}

export interface VendorFAQ {
  q?: string;
  question?: string;
  a?: string;
  answer?: string;
}

export interface VendorProfileSovereign {
  id: string;
  name: string;
  slug: string;
  category: VendorCategory;
  phone: string;
  whatsapp: string;
  pricing: VendorPricing;
  metrics: VendorMetrics;
  location: VendorLocation;
  media: VendorMedia;
  technicalSpecs: VendorTechnicalSpecs;
  description: string;
  faqs?: VendorFAQ[];
  claimToken: string;
  purgedBodasUrl: boolean;
}

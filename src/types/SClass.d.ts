/**
 * 🌌 EAR OS GOLD - S-CLASS TYPE DEFINITIONS
 */

export interface SClassVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  description?: string;
  original_url?: string;
  is_claimed: boolean;
  claim_token?: string;
  owner_id?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface SClassOrder {
  id: string;
  client: string;
  amount: number;
  status: string;
  location: string;
  createdAt: string;
}

export interface SClassFleetUnit {
  id: string;
  unit: string;
  status: 'MISSION_ACTIVE' | 'STANDBY' | 'MAINTENANCE';
  location: string;
  lastUpdate: string;
}

export type OmnibusTab = 'CRM' | 'FLOTA' | 'DISPATCH' | 'VIMUME' | 'MARKET';

export interface MarketService {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  keywords: string[];
  basePrice?: number;
}

// src/types/multi-service.ts

export type ServiceCategory = 'MUSICA_LIVE' | 'DJ' | 'MARIACHI' | 'FOTOGRAFIA' | 'VIDEO' | 'CATERING' | 'DECORACION' | 'ILUMINACION' | 'WEDDING_PLANNER' | 'TRANSPORTE' | 'FINCA';

export type ServiceStatus = 'DRAFT' | 'PENDING_PROVIDER_ACCEPTANCE' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface ServiceLineItem {
  id: string;
  category: ServiceCategory;
  providerId: string | null; // null si aún no se ha asignado un proveedor específico
  name: string;
  basePrice: number;
  providerSplit: number;     // 80%
  platformSplit: number;     // 10%
  vimumeSplit: number;       // 10%
  status: ServiceStatus;
  requirements: string[];
  waybillId?: string;        // Para tracking logístico si aplica
}

export interface OrchestratorState {
  eventId: string;
  totalBudget: number;
  totalDepositRequired: number;
  services: ServiceLineItem[];
  allConfirmed: boolean;
  lockHash?: string;
}

export interface TelemetryFrame {
  unitId: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

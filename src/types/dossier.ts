/**
 * 📂 DOSSIER CONTRACTS - S-CLASS LEAD ROUTING
 */

export type LeadChannel = 'INSTITUTIONAL' | 'B2B' | 'OPERATIVE';

export interface DossierProposal {
  id: string;
  token: string; // Acceso controlado
  status: 'draft' | 'sent' | 'approved' | 'pre-closed' | 'expired';
  createdAt: string;
  expiresAt: string;
  approvedAt?: string;
  reservationExpiresAt?: string;
  
  // Información de Contacto
  contactName: string;
  contactEmail: string;
  organizationName?: string;
  
  // Contexto de Mercado
  occasionSlug: string;
  province?: string;
  
  // Selección de Activos
  selectedAssets: string[]; // IDs de servicios
  priorityScore: number; // 0-100
  
  // Ruteo Operativo
  channel: LeadChannel;
  routingReason: string;
  telegramTarget: string; // Canal o Chat ID específico
}

export interface LeadRoutingResult {
  channel: LeadChannel;
  reason: string;
  priority: number;
}

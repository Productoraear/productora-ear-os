// Stub de alta fidelidad generado para desbloquear compilación de LeadRouter
export type LeadChannel = 'INSTITUTIONAL' | 'B2B' | 'OPERATIVE' | 'B2G' | 'B2C' | 'VIP';

export interface LeadRoutingResult {
  success?: boolean;
  route?: string;
  assignedTo?: string;
  channel?: LeadChannel;
  reason?: string;
  priority?: number;
}

export interface DossierProposal {
  id: string;
  occasion?: string;
  totalAmount?: number;
  depositAmount?: number;
  expires_at?: string;
  [key: string]: any;
}

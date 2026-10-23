// ==========================================
// 📇 VENDOR CRM — Tipos puros (cero `any`)
// Interfaces TypeScript estrictas para la capa de datos del
// CRM propio del proveedor. Sin dependencia del cliente Prisma.
// ==========================================

/** Estados del ciclo de vida de un lead/reserva del proveedor. */
export type VendorBookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'INSTA_BOOKED'
  | 'ESCALATED';

/** Lead entrante del CRM del proveedor (modelo `VendorLead`). */
export interface VendorLeadRecord {
  id: string;
  vendorId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  eventDate: string | null;
  pax: number;
  budgetEur: number;
  source: string;
  status: VendorBookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

/** Mensaje de hilo conversacional asociado a un lead (`VendorThread`). */
export interface VendorThreadMessage {
  id: string;
  leadId: string;
  sender: string;
  body: string;
  createdAt: Date;
}

/** Cliente del CRM del proveedor (`VendorCrmClient`). */
export interface VendorCrmClientRecord {
  id: string;
  vendorId: string;
  fullName: string;
  phone: string;
  email: string | null;
  eventDate: Date | null;
  eventType: string;
  venue: string | null;
  budgetEur: number | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Reserva del proveedor (`VendorBooking`). */
export interface VendorBookingRecord {
  id: string;
  vendorId: string;
  clientId: string | null;
  eventTitle: string;
  eventDate: Date;
  location: string;
  totalPriceEur: number;
  depositPaidEur: number;
  splitArtistEur: number;
  splitEarEur: number;
  splitVimumeEur: number;
  isLockedAcid: boolean;
  contractHash: string | null;
  status: string;
  createdAt: Date;
}

/** Activo multimedia del proveedor (reutiliza `MediaAsset`). */
export interface VendorMediaAssetRecord {
  id: string;
  providerId: string | null;
  vendorId: string | null;
  url: string;
  type: string;
  sizeBytes: number;
  fileName: string | null;
  fileHashSha256: string | null;
  displayOrder: number;
  createdAt: Date;
}

// ---- Inputs de creación (tipado estricto) ----

export interface CreateLeadInput {
  vendorId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventDate?: string;
  pax?: number;
  budgetEur?: number;
  source: string;
  status?: VendorBookingStatus;
}

export interface CreateClientInput {
  vendorId: string;
  fullName: string;
  phone: string;
  email?: string;
  eventDate?: Date;
  eventType: string;
  venue?: string;
  budgetEur?: number;
  status?: string;
  notes?: string;
}

export interface CreateBookingInput {
  vendorId: string;
  clientId?: string;
  eventTitle: string;
  eventDate: Date;
  location: string;
  totalPriceEur: number;
  depositPaidEur?: number;
  isLockedAcid?: boolean;
  contractHash?: string;
  status?: string;
}

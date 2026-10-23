// ==========================================
// 📇 VENDOR CRM — Repositorio server-only
// Capa de datos del CRM propio del proveedor con inyección de
// PrismaClient. Solo debe importarse desde Server Components o
// Route Handlers (nunca desde el cliente).
// ==========================================

import type { PrismaClient } from '@prisma/client';

import { SPLIT_SOBERANO } from '@/lib/constants/ear-os-ssot';

import type {
  CreateBookingInput,
  CreateClientInput,
  CreateLeadInput,
  VendorBookingRecord,
  VendorBookingStatus,
  VendorCrmClientRecord,
  VendorLeadRecord,
  VendorMediaAssetRecord,
  VendorThreadMessage,
} from './vendorCrmTypes';

export class VendorCrmRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // ---- Leads ----

  async listLeads(vendorId: string): Promise<VendorLeadRecord[]> {
    return this.prisma.vendorLead.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLead(input: CreateLeadInput): Promise<VendorLeadRecord> {
    return this.prisma.vendorLead.create({
      data: {
        vendorId: input.vendorId,
        clientName: input.clientName,
        clientPhone: input.clientPhone,
        clientEmail: input.clientEmail,
        eventDate: input.eventDate,
        pax: input.pax ?? 0,
        budgetEur: input.budgetEur ?? 0,
        source: input.source,
        status: input.status ?? 'PENDING',
      },
    });
  }

  async updateLeadStatus(
    leadId: string,
    status: VendorBookingStatus,
  ): Promise<VendorLeadRecord> {
    return this.prisma.vendorLead.update({
      where: { id: leadId },
      data: { status },
    });
  }

  async appendMessage(
    leadId: string,
    sender: string,
    body: string,
  ): Promise<VendorThreadMessage> {
    return this.prisma.vendorThread.create({
      data: { leadId, sender, body },
    });
  }

  async addThreadMessage(
    leadId: string,
    sender: string,
    body: string,
  ): Promise<VendorThreadMessage> {
    return this.appendMessage(leadId, sender, body);
  }

  // ---- Clientes ----

  async listClients(vendorId: string): Promise<VendorCrmClientRecord[]> {
    return this.prisma.vendorCrmClient.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createClient(input: CreateClientInput): Promise<VendorCrmClientRecord> {
    return this.prisma.vendorCrmClient.create({
      data: {
        vendorId: input.vendorId,
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
        eventDate: input.eventDate,
        eventType: input.eventType,
        venue: input.venue,
        budgetEur: input.budgetEur,
        status: input.status ?? 'LEAD',
        notes: input.notes,
      },
    });
  }

  // ---- Reservas ----

  async listBookings(vendorId: string): Promise<VendorBookingRecord[]> {
    return this.prisma.vendorBooking.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Crea una reserva garantizando el Split Soberano 80/10/10
   * (Artista / EAR OS / VIMUME) calculado desde el SSOT verificado.
   */
  async createBooking(input: CreateBookingInput): Promise<VendorBookingRecord> {
    const totalPriceEur = input.totalPriceEur;

    return this.prisma.vendorBooking.create({
      data: {
        vendorId: input.vendorId,
        clientId: input.clientId,
        eventTitle: input.eventTitle,
        eventDate: input.eventDate,
        location: input.location,
        totalPriceEur,
        depositPaidEur: input.depositPaidEur ?? 0,
        splitArtistEur: totalPriceEur * SPLIT_SOBERANO.artista,
        splitEarEur: totalPriceEur * SPLIT_SOBERANO.earOs,
        splitVimumeEur: totalPriceEur * SPLIT_SOBERANO.vimume,
        isLockedAcid: input.isLockedAcid ?? true,
        contractHash: input.contractHash,
        status: input.status ?? 'CONFIRMED',
      },
    });
  }

  // ---- Media (reutiliza MediaAsset existente) ----

  async listMedia(vendorId: string): Promise<VendorMediaAssetRecord[]> {
    return this.prisma.mediaAsset.findMany({
      where: { vendorId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async reorderMedia(vendorId: string, orderedIds: string[]): Promise<number> {
    return this.prisma.$transaction(async (tx) => {
      let updated = 0;

      for (let index = 0; index < orderedIds.length; index += 1) {
        const result = await tx.mediaAsset.updateMany({
          where: { id: orderedIds[index], vendorId },
          data: { displayOrder: index },
        });
        updated += result.count;
      }

      return updated;
    });
  }
}

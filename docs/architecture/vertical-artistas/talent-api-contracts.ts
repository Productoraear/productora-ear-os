import { z } from 'zod';

/**
 * 🏛️ TALENT OS: API CONTRACTS (V1.0.0)
 * The Law: Interfaces TS y esquemas Zod
 */

// --- 🧬 BASE TYPES ---

export const ArtistStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type ArtistStatus = z.infer<typeof ArtistStatusSchema>;

export const ContractStatusSchema = z.enum([
  'PENDING',
  'RESERVED',
  'SIGNED',
  'PAID',
  'CANCELLED',
  'EXECUTED'
]);
export type ContractStatus = z.infer<typeof ContractStatusSchema>;

// --- 🎨 ARTIST PROFILE ---

export const ArtistProfileSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(3).max(50),
  displayName: z.string().min(2),
  bio: z.string().optional(),
  genres: z.array(z.string()).default([]),
  mediaKitUrl: z.string().url().optional(),
  status: ArtistStatusSchema.default('DRAFT'),
  socialLinks: z.record(z.string(), z.string().url()).default({}),
  metadata: z.record(z.any()).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ArtistProfile = z.infer<typeof ArtistProfileSchema>;

// --- 📋 TECHNICAL RIDER ---

export const TechnicalRiderSchema = z.object({
  id: z.string().uuid(),
  artistId: z.string().uuid(),
  version: z.number().int().positive(),
  contentUrl: z.string().url().optional(),
  requirements: z.object({
    inputs: z.array(z.string()).optional(),
    monitors: z.array(z.string()).optional(),
    lighting: z.string().optional(),
    hospitality: z.string().optional(),
  }).default({}),
  lastUpdated: z.date().optional(),
});

export type TechnicalRider = z.infer<typeof TechnicalRiderSchema>;

// --- 📜 SMART CONTRACT (BOOKING) ---

export const SmartContractSchema = z.object({
  id: z.string().uuid(),
  artistId: z.string().uuid(),
  clientId: z.string().uuid(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  totalAmount: z.number().positive(),
  depositAmount: z.number().default(1.00),
  status: ContractStatusSchema.default('PENDING'),
  ledgerId: z.string().optional(),
  metadata: z.record(z.any()).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type SmartContract = z.infer<typeof SmartContractSchema>;

// --- 📅 CALENDAR BLOCK ---

export const CalendarBlockSchema = z.object({
  id: z.string().uuid(),
  artistId: z.string().uuid(),
  blockDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.enum(['BOOKING', 'PERSONAL', 'EXTERNAL', 'MAINTENANCE']).default('BOOKING'),
  contractId: z.string().uuid().optional(),
  createdAt: z.date().optional(),
});

export type CalendarBlock = z.infer<typeof CalendarBlockSchema>;

// --- 🚀 ACTION SCHEMAS ---

export const ProcessBookingSchema = z.object({
  artistId: z.string().uuid(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalAmount: z.number().positive(),
  metadata: z.record(z.any()).optional(),
});

export type ProcessBookingInput = z.infer<typeof ProcessBookingSchema>;

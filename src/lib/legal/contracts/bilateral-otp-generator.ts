/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — GENERADOR CRIPTOGRÁFICO DE CONTRATOS BILATERALES OTP
 * ════════════════════════════════════════════════════════════════════════════
 * Cumplimiento estricto de contratación electrónica (Ley 34/2002 LSSI-CE):
 *  - Generación de tokens OTP bilaterales (Cliente y Proveedor/Artista).
 *  - Cláusula de depósito Price-Lock y suelo canónico inviolable.
 *  - Sellado criptográfico inmutable SHA-256.
 * ════════════════════════════════════════════════════════════════════════════
 */

import crypto from 'node:crypto';
import { z } from 'zod';

export const ContractPartySchema = z.object({
  name: z.string().min(2),
  taxId: z.string().min(8), // DNI/NIE/CIF
  email: z.string().email(),
  phone: z.string().min(9),
  role: z.enum(['CLIENT', 'PROVIDER', 'ARTIST'])
});

export const GenerateContractInputSchema = z.object({
  contractId: z.string().optional(),
  eventId: z.string(),
  eventDate: z.string(),
  municipality: z.string(),
  client: ContractPartySchema,
  provider: ContractPartySchema,
  totalAmountEur: z.number().min(350), // Suelo canónico mínimo
  depositAmountEur: z.number().min(100),
  clauses: z.array(z.string()).optional()
});

export type GenerateContractInput = z.infer<typeof GenerateContractInputSchema>;

export interface BilateralContractDocument {
  contractId: string;
  eventId: string;
  eventDate: string;
  municipality: string;
  client: z.infer<typeof ContractPartySchema>;
  provider: z.infer<typeof ContractPartySchema>;
  financials: {
    totalAmountEur: number;
    depositAmountEur: number;
    balanceDueEur: number;
    depositStatus: 'HELD_PRICE_LOCK' | 'PENDING';
  };
  otpTokens: {
    clientOtp: string;
    clientSignedAt?: string;
    providerOtp: string;
    providerSignedAt?: string;
  };
  legalClauses: string[];
  sha256Seal: string;
  createdAt: string;
  status: 'DRAFT' | 'PARTIALLY_SIGNED' | 'FULLY_EXECUTED' | 'REVOKED';
}

function generateOtpToken(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateBilateralOtpContract(input: GenerateContractInput): BilateralContractDocument {
  const contractId = input.contractId ?? `CTR-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const clientOtp = generateOtpToken();
  const providerOtp = generateOtpToken();

  const legalClauses = input.clauses ?? [
    'Cláusula Price-Lock: Depósito de 100,00 € deducible garantizando tarifa y reserva.',
    'Suelo Canónico EAR OS: Retribución del artista sujeta a aislamiento de catálogo.',
    'Logística Homologada: 0,50 €/km adicional superados los 100 km y 80,00 € de dieta/hotel si procede.',
    'Alineamiento Social: Donación del 10% con certificación de impacto social VIMUME (Ley 49/2002).'
  ];

  const payloadToHash = `${contractId}:${input.eventId}:${input.client.taxId}:${input.provider.taxId}:${input.totalAmountEur}:${input.depositAmountEur}:${clientOtp}:${providerOtp}`;
  const sha256Seal = crypto.createHash('sha256').update(payloadToHash).digest('hex');

  return {
    contractId,
    eventId: input.eventId,
    eventDate: input.eventDate,
    municipality: input.municipality,
    client: input.client,
    provider: input.provider,
    financials: {
      totalAmountEur: input.totalAmountEur,
      depositAmountEur: input.depositAmountEur,
      balanceDueEur: input.totalAmountEur - input.depositAmountEur,
      depositStatus: 'HELD_PRICE_LOCK'
    },
    otpTokens: {
      clientOtp,
      providerOtp
    },
    legalClauses,
    sha256Seal,
    createdAt: new Date().toISOString(),
    status: 'DRAFT'
  };
}

export function verifyContractOtpSignature(
  contract: BilateralContractDocument,
  partyRole: 'CLIENT' | 'PROVIDER',
  enteredOtp: string
): { success: boolean; updatedContract: BilateralContractDocument } {
  const updated = { ...contract };
  const now = new Date().toISOString();

  if (partyRole === 'CLIENT') {
    if (enteredOtp !== contract.otpTokens.clientOtp) {
      return { success: false, updatedContract: contract };
    }
    updated.otpTokens.clientSignedAt = now;
  } else {
    if (enteredOtp !== contract.otpTokens.providerOtp) {
      return { success: false, updatedContract: contract };
    }
    updated.otpTokens.providerSignedAt = now;
  }

  if (updated.otpTokens.clientSignedAt && updated.otpTokens.providerSignedAt) {
    updated.status = 'FULLY_EXECUTED';
  } else {
    updated.status = 'PARTIALLY_SIGNED';
  }

  // Recompute seal
  const payloadToHash = `${updated.contractId}:${updated.status}:${updated.otpTokens.clientSignedAt ?? ''}:${updated.otpTokens.providerSignedAt ?? ''}`;
  updated.sha256Seal = crypto.createHash('sha256').update(payloadToHash).digest('hex');

  return { success: true, updatedContract: updated };
}

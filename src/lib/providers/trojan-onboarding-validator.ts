import { z } from 'zod';
import {
  validateCifNif,
  validateIbanIso13616,
  ProviderProfileCategoryEnum,
} from '@/lib/providers/trojan-horse-schema';

/**
 * Esquema de validación para Onboarding Rápido Caballo de Troya
 * con validación formal de Cédula/NIF/CIF (Módulo 23) e IBAN (Módulo 97 BigInt).
 */
export const TrojanOnboardingFormSchema = z.object({
  providerSlug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  businessName: z.string().min(2, 'El nombre comercial es obligatorio').max(160),
  category: ProviderProfileCategoryEnum,
  cifNif: z
    .string()
    .min(8, 'Identificador fiscal incompleto')
    .max(20)
    .refine((val) => validateCifNif(val), {
      message: 'NIF/CIF/NIE inválido según comprobación fiscal (Módulo 23 / Algoritmo AEAT)',
    }),
  contactPhone: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, 'Número de teléfono inválido (debe tener entre 9 y 15 dígitos)'),
  billingIban: z
    .string()
    .min(15, 'IBAN demasiado corto')
    .max(34, 'IBAN demasiado largo')
    .refine((val) => validateIbanIso13616(val), {
      message: 'Código de cuenta IBAN inválido según norma ISO 13616 (Módulo 97 BigInt)',
    }),
  membershipTier: z.enum(['DIRECTORY_UNCLAIMED', 'CLAIMED_PRO', 'SOVEREIGN_FOUNDER']),
  acceptsAntiFraudPolicy: z.literal(true),
});

export type TrojanOnboardingFormData = z.infer<typeof TrojanOnboardingFormSchema>;

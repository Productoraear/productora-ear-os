/**
 * @file parseStripeProp.ts
 * @description Utilidad para normalizar propiedades de Stripe (moneda, formatos).
 */

export const parseStripeAmount = (amount: number | string): number => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 0;
  // Convertimos a céntimos si es necesario (Stripe estándar)
  return Math.round(num * 100);
};

export const formatCurrency = (amountInCents: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(amountInCents / 100);
};

export const parseStripeMetadata = (obj: any): Record<string, string> => {
  const metadata: Record<string, string> = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      metadata[key] = String(obj[key]);
    }
  }
  return metadata;
};

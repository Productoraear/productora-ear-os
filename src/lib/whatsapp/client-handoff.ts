/**
 * Client-safe WhatsApp Handoff URL builder (ZERO `node:crypto`, INV-07).
 *
 * Ensures client components (`"use client"`) and public Server Components
 * emit deterministic `wa.me/34693693048?text=...&ref=<ASIN>` links with
 * `[Ref: <ASIN>]` embedded inside the prefilled message text.
 */

import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { isValidEarAsin } from '@/lib/entities/asin';

const DEFAULT_CENTRALITA_DIGITS = CENTRALITA_EAR_OS.replace(/\D/g, '') || '34693693048';

export interface ClientWhatsAppHandoffOptions {
  readonly phoneDigits?: string | null;
  readonly text: string;
  readonly asin?: string | null;
}

export function buildClientWhatsAppHandoffUrl(options: ClientWhatsAppHandoffOptions): string {
  const cleanPhone =
    typeof options.phoneDigits === 'string' && options.phoneDigits.replace(/\D/g, '').length >= 9
      ? options.phoneDigits.replace(/\D/g, '')
      : DEFAULT_CENTRALITA_DIGITS;

  const rawAsin = typeof options.asin === 'string' ? options.asin.trim().toUpperCase() : '';
  const validAsin = isValidEarAsin(rawAsin) ? rawAsin : '';

  const baseText = options.text.trim() || 'Hola Productora EAR, deseo consultar disponibilidad.';
  const hasRefTag = validAsin.length > 0 && baseText.toUpperCase().includes(`[REF: ${validAsin}]`);
  const finalText = validAsin && !hasRefTag ? `${baseText}\n[Ref: ${validAsin}]` : baseText;

  const encodedText = encodeURIComponent(finalText);
  if (validAsin) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}&ref=${encodeURIComponent(validAsin)}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

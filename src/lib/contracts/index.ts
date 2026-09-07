/**
 * 📝 Contracts Engine
 * Shared contract generation utilities used by:
 * - /api/contracts/generate (Contract PDF generation)
 * - Studio Artist views
 * 
 * Generates EAR OS standard contracts with:
 * - Split Soberano 80/10/10
 * - Depósito de 100 € con Price-Lock SHA-256
 * - Rider técnico de referencia
 */

export interface ContractData {
  contractId: string;
  clientName: string;
  clientEmail: string;
  artistName: string;
  eventDate: string;
  eventType: string;
  location: string;
  totalAmount: number;
  depositAmount: number;
  priceLockHash: string;
  createdAt: string;
}

export interface ContractLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Generates a contract ID with the EAR OS format.
 */
export function generateContractId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `EAR-${year}-${seq}`;
}

/**
 * Generates the SHA-256 Price-Lock hash for a contract.
 */
export async function generatePriceLockHash(
  contractId: string,
  totalAmount: number,
  eventDate: string
): Promise<string> {
  const payload = `${contractId}:${totalAmount}:${eventDate}:${Date.now()}`;
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Server-side fallback
  const cryptoModule = await import('crypto');
  return cryptoModule.createHash('sha256').update(payload).digest('hex');
}

/**
 * Formats contract data for PDF generation or display.
 */
export function formatContractSummary(contract: ContractData): string {
  return [
    `CONTRATO DE SERVICIOS ARTÍSTICOS`,
    `ID: ${contract.contractId}`,
    `Fecha: ${contract.createdAt}`,
    ``,
    `PARTES:`,
    `  Cliente: ${contract.clientName} (${contract.clientEmail})`,
    `  Artista: ${contract.artistName}`,
    ``,
    `EVENTO:`,
    `  Tipo: ${contract.eventType}`,
    `  Fecha: ${contract.eventDate}`,
    `  Ubicación: ${contract.location}`,
    ``,
    `CONDICIONES ECONÓMICAS:`,
    `  Inversión Total: ${contract.totalAmount.toLocaleString('es-ES')} €`,
    `  Depósito de Bloqueo: ${contract.depositAmount} €`,
    `  Price-Lock: ${contract.priceLockHash.substring(0, 16)}...`,
    `  Split: 80% Artista / 10% EAR OS / 10% VIMUME`,
    ``,
    `© ${new Date().getFullYear()} Productora EAR — EAR OS V2`,
  ].join('\n');
}

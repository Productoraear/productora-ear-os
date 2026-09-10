"use server";

import { ServerResponse } from '@/app/(nexus)/admin/sourcing/actions/server-actions';

export interface B2GContractPayload {
  entityName: string;
  cif: string;
  projectedAmount: number;
}

export async function validateAndGenerateLCSPContract(payload: B2GContractPayload): Promise<ServerResponse<{ contractId: string, margin: number }>> {
  try {
    // REGLA DETERMINISTA (Art 118. LCSP: Contrato Menor < 15.000€ IVA excluido)
    const LIMIT_LCSP = 14250; // Margen de seguridad operativo
    
    if (payload.projectedAmount > LIMIT_LCSP) {
      throw new Error(`Rechazado: El importe de ${payload.projectedAmount}€ supera el umbral del Art. 118 LCSP para Contratos Menores.`);
    }

    // Cálculo Determinista de Tramos
    const margin = Number((payload.projectedAmount * 0.30).toFixed(2));
    const contractId = `LCSP-${payload.cif}-${Date.now()}`;

    // Aquí iría el INSERT a Supabase (Sourcing)
    
    return { success: true, data: { contractId, margin } };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Error B2G Validation" };
  }
}

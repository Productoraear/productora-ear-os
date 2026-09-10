"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Tipos Estrictos (Cero 'any')
export interface ServerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  stage: 'prospect' | 'negotiation' | 'contracted' | 'paid';
  projected_cost: number;
  paid_amount: number;
}

// Inicialización de Supabase Server Client (Zero Mocks)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ACCIONES DE PROVEEDORES ---
export async function getSuppliers(): Promise<ServerResponse<Supplier[]>> {
  try {
    const { data, error } = await supabase
      .from('sourcing_suppliers')
      .select('id, name, category, stage, projected_cost, paid_amount')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    
    return { success: true, data: data as Supplier[] };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido en getSuppliers";
    return { success: false, error: msg };
  }
}

export async function updateSupplierStage(id: string, stage: Supplier['stage']): Promise<ServerResponse<void>> {
  try {
    const { error } = await supabase
      .from('sourcing_suppliers')
      .update({ stage })
      .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/sourcing'); // Refresca la caché del App Router
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar stage";
    return { success: false, error: msg };
  }
}

// --- ACCIONES DE CHECKLIST ---
export async function toggleTaskStatus(id: string, currentStatus: 'pending' | 'completed'): Promise<ServerResponse<void>> {
  try {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

    const { error } = await supabase
      .from('sourcing_checklist')
      .update({ status: newStatus, completed_at: completedAt })
      .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/sourcing');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Error en toggleTask" };
  }
}

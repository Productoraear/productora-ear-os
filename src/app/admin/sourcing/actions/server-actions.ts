'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface BudgetRecord {
    id?: string;
    event_id?: string;
    category: string;
    item_name: string;
    estimated_cost: number;
    actual_cost: number;
    paid_amount: number;
    currency?: string;
    status?: string;
}

export interface SupplierRecord {
    id?: string;
    event_id?: string;
    name: string;
    category: string;
    stage: 'identified' | 'contacted' | 'shortlisted' | 'approved' | 'rejected';
    rating?: number;
    contact_email?: string;
    phone_number?: string;
    quoted_price?: number;
}

export interface ChecklistRecord {
    id?: string;
    event_id?: string;
    task_name: string;
    status: 'pending' | 'in_progress' | 'completed';
    deadline?: string;
    priority?: string;
    assigned_to?: string;
}

export async function getBudgets(eventId?: string): Promise<BudgetRecord[]> {
    const supabase = createClient();
    let query = supabase.from('sourcing_budgets').select('*').order('created_at', { ascending: true });
    if (eventId) query = query.eq('event_id', eventId);
    
    const { data, error } = await query;
    if (error) {
        console.error('[EAR OS] Error al obtener presupuestos:', error.message);
        return [];
    }
    return data as BudgetRecord[];
}

export async function upsertBudget(budget: BudgetRecord): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const { error } = await supabase.from('sourcing_budgets').upsert([budget]);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/sourcing');
    return { success: true };
}

export async function getSuppliers(eventId?: string): Promise<SupplierRecord[]> {
    const supabase = createClient();
    let query = supabase.from('sourcing_suppliers').select('*').order('created_at', { ascending: true });
    if (eventId) query = query.eq('event_id', eventId);

    const { data, error } = await query;
    if (error) {
        console.error('[EAR OS] Error al obtener proveedores:', error.message);
        return [];
    }
    return data as SupplierRecord[];
}

export async function updateSupplierStage(id: string, stage: SupplierRecord['stage']): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const { error } = await supabase.from('sourcing_suppliers').update({ stage }).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/sourcing');
    return { success: true };
}

export async function getChecklist(eventId?: string): Promise<ChecklistRecord[]> {
    const supabase = createClient();
    let query = supabase.from('sourcing_checklist').select('*').order('created_at', { ascending: true });
    if (eventId) query = query.eq('event_id', eventId);

    const { data, error } = await query;
    if (error) {
        console.error('[EAR OS] Error al obtener checklist:', error.message);
        return [];
    }
    return data as ChecklistRecord[];
}

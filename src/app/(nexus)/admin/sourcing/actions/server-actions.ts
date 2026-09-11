"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { queryLocalOllama } from "@/lib/ollama-copilot";

// ─── TIPOS ESTRICTOS (Cero 'any') ───────────────────────────────────────────

export interface ServerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type SupplierStage =
  | "identified"
  | "contacted"
  | "shortlisted"
  | "approved"
  | "rejected"
  | "contracted";

export type ChecklistStatus = "pending" | "in_progress" | "completed";

export type BudgetStatus = "draft" | "approved" | "locked";

export interface Supplier {
  id: string;
  event_id: string | null;
  name: string;
  category: string;
  stage: SupplierStage;
  rating: number;
  lead_source: string | null;
  contact_email: string | null;
  phone_number: string | null;
  quoted_price: number;
  projected_cost: number;
  paid_amount: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  event_id: string | null;
  category: string;
  item_name: string;
  target_budget: number;
  estimated_cost: number;
  actual_cost: number;
  paid_amount: number;
  pending_amount: number;
  total_guests: number;
  currency: string;
  status: BudgetStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  event_id: string | null;
  task_name: string;
  category: string;
  status: ChecklistStatus;
  priority: "low" | "medium" | "high" | "critical";
  assigned_to: string | null;
  depends_on: string | null;
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OutreachResult {
  message: string;
  model: string;
  latency_ms: number;
}

// ─── PAYLOADS DE MUTACIÓN ────────────────────────────────────────────────────

export interface UpsertSupplierPayload {
  id?: string;
  name: string;
  category: string;
  stage?: SupplierStage;
  rating?: number;
  lead_source?: string | null;
  contact_email?: string | null;
  phone_number?: string | null;
  quoted_price?: number;
  projected_cost?: number;
  paid_amount?: number;
  metadata?: Record<string, unknown>;
}

export interface UpsertBudgetPayload {
  id?: string;
  category: string;
  item_name: string;
  target_budget?: number;
  estimated_cost?: number;
  actual_cost?: number;
  paid_amount?: number;
  pending_amount?: number;
  total_guests?: number;
  currency?: string;
  status?: BudgetStatus;
  notes?: string | null;
}

export interface UpsertChecklistPayload {
  id?: string;
  task_name: string;
  category?: string;
  status?: ChecklistStatus;
  priority?: "low" | "medium" | "high" | "critical";
  assigned_to?: string | null;
  depends_on?: string | null;
  deadline?: string | null;
}

// ─── CLIENTE SUPABASE (Server Component) ─────────────────────────────────────

const getSupabase = () => createClient();

// ─── ACCIONES DE PROVEEDORES ─────────────────────────────────────────────────

export async function getSuppliers(): Promise<ServerResponse<Supplier[]>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("sourcing_suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { success: true, data: (data ?? []) as Supplier[] };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido en getSuppliers";
    console.error("[SOURCING][getSuppliers]", msg);
    return { success: false, error: msg };
  }
}

export async function upsertSupplier(
  payload: UpsertSupplierPayload
): Promise<ServerResponse<Supplier>> {
  try {
    const supabase = getSupabase();
    const row = {
      name: payload.name,
      category: payload.category,
      stage: payload.stage ?? "identified",
      rating: payload.rating ?? 5,
      lead_source: payload.lead_source ?? null,
      contact_email: payload.contact_email ?? null,
      phone_number: payload.phone_number ?? null,
      quoted_price: payload.quoted_price ?? 0,
      projected_cost: payload.projected_cost ?? 0,
      paid_amount: payload.paid_amount ?? 0,
      metadata: payload.metadata ?? {},
    };

    let result;
    if (payload.id) {
      const { data, error } = await supabase
        .from("sourcing_suppliers")
        .update(row)
        .eq("id", payload.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      result = data;
    } else {
      const { data, error } = await supabase
        .from("sourcing_suppliers")
        .insert(row)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      result = data;
    }

    revalidatePath("/admin/sourcing");
    return { success: true, data: result as Supplier };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en upsertSupplier";
    console.error("[SOURCING][upsertSupplier]", msg);
    return { success: false, error: msg };
  }
}

export async function updateSupplierStage(
  id: string,
  stage: SupplierStage
): Promise<ServerResponse<void>> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("sourcing_suppliers")
      .update({ stage })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/sourcing");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar stage";
    console.error("[SOURCING][updateSupplierStage]", msg);
    return { success: false, error: msg };
  }
}

export async function deleteSupplier(id: string): Promise<ServerResponse<void>> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("sourcing_suppliers").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/sourcing");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en deleteSupplier";
    console.error("[SOURCING][deleteSupplier]", msg);
    return { success: false, error: msg };
  }
}

// ─── ACCIONES DE PRESUPUESTO ─────────────────────────────────────────────────

export async function getBudgets(): Promise<ServerResponse<Budget[]>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("sourcing_budgets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { success: true, data: (data ?? []) as Budget[] };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido en getBudgets";
    console.error("[SOURCING][getBudgets]", msg);
    return { success: false, error: msg };
  }
}

export async function upsertBudget(
  payload: UpsertBudgetPayload
): Promise<ServerResponse<Budget>> {
  try {
    const supabase = getSupabase();
    const row = {
      category: payload.category,
      item_name: payload.item_name,
      target_budget: payload.target_budget ?? 0,
      estimated_cost: payload.estimated_cost ?? 0,
      actual_cost: payload.actual_cost ?? 0,
      paid_amount: payload.paid_amount ?? 0,
      pending_amount: payload.pending_amount ?? 0,
      total_guests: payload.total_guests ?? 0,
      currency: payload.currency ?? "EUR",
      status: payload.status ?? "draft",
      notes: payload.notes ?? null,
    };

    let result;
    if (payload.id) {
      const { data, error } = await supabase
        .from("sourcing_budgets")
        .update(row)
        .eq("id", payload.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      result = data;
    } else {
      const { data, error } = await supabase
        .from("sourcing_budgets")
        .insert(row)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      result = data;
    }

    revalidatePath("/admin/sourcing");
    return { success: true, data: result as Budget };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en upsertBudget";
    console.error("[SOURCING][upsertBudget]", msg);
    return { success: false, error: msg };
  }
}

export async function deleteBudget(id: string): Promise<ServerResponse<void>> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("sourcing_budgets").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/sourcing");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en deleteBudget";
    console.error("[SOURCING][deleteBudget]", msg);
    return { success: false, error: msg };
  }
}

// ─── ACCIONES DE CHECKLIST ───────────────────────────────────────────────────

export async function getChecklist(): Promise<ServerResponse<ChecklistItem[]>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("sourcing_checklist")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { success: true, data: (data ?? []) as ChecklistItem[] };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido en getChecklist";
    console.error("[SOURCING][getChecklist]", msg);
    return { success: false, error: msg };
  }
}

export async function upsertChecklist(
  payload: UpsertChecklistPayload
): Promise<ServerResponse<ChecklistItem>> {
  try {
    const supabase = getSupabase();
    const row = {
      task_name: payload.task_name,
      category: payload.category ?? "general",
      status: payload.status ?? "pending",
      priority: payload.priority ?? "medium",
      assigned_to: payload.assigned_to ?? null,
      depends_on: payload.depends_on ?? null,
      deadline: payload.deadline ?? null,
    };

    let result;
    if (payload.id) {
      const { data, error } = await supabase
        .from("sourcing_checklist")
        .update(row)
        .eq("id", payload.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      result = data;
    } else {
      const { data, error } = await supabase
        .from("sourcing_checklist")
        .insert(row)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      result = data;
    }

    revalidatePath("/admin/sourcing");
    return { success: true, data: result as ChecklistItem };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en upsertChecklist";
    console.error("[SOURCING][upsertChecklist]", msg);
    return { success: false, error: msg };
  }
}

export async function toggleTaskStatus(
  id: string,
  currentStatus: ChecklistStatus
): Promise<ServerResponse<void>> {
  try {
    const supabase = getSupabase();
    const nextStatus: ChecklistStatus =
      currentStatus === "pending"
        ? "in_progress"
        : currentStatus === "in_progress"
          ? "completed"
          : "pending";

    const completedAt = nextStatus === "completed" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("sourcing_checklist")
      .update({ status: nextStatus, completed_at: completedAt })
      .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/sourcing");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en toggleTaskStatus";
    console.error("[SOURCING][toggleTaskStatus]", msg);
    return { success: false, error: msg };
  }
}

export async function deleteChecklistItem(id: string): Promise<ServerResponse<void>> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("sourcing_checklist").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/sourcing");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en deleteChecklistItem";
    console.error("[SOURCING][deleteChecklistItem]", msg);
    return { success: false, error: msg };
  }
}

// ─── ACCIÓN DE OUTREACH LTV (IA LOCAL) ──────────────────────────────────────

export async function generateOutreachLTV(
  coupleName: string,
  weddingDate: string,
  eventDetails: string
): Promise<ServerResponse<OutreachResult>> {
  const start = performance.now();
  try {
    const prompt = `Eres el Copiloto de Retención LTV de EAR OS. Redacta un mensaje cálido, elegante y personalizado de aniversario para la pareja "${coupleName}" cuya boda fue el ${weddingDate}. Contexto del evento: ${eventDetails}. El mensaje debe:
1. Evocar la emoción del día especial.
2. Ofrecer una experiencia de aniversario exclusiva (cena íntima, sesión de fotos, o actuación musical en directo).
3. Incluir una llamada a la acción clara con el teléfono +34 693 693 048.
4. Tono: sofisticado, cercano, sin ser vendedor. Máximo 120 palabras.
Responde SOLO con el texto del mensaje, sin prefijos ni explicaciones.`;

    const model = process.env.OLLAMA_MODEL || "qwen3.8-27b-fast";
    const message = await queryLocalOllama({
      prompt,
      model,
    });

    const latency_ms = Math.round(performance.now() - start);
    return {
      success: true,
      data: { message, model, latency_ms },
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error en generateOutreachLTV";
    console.error("[SOURCING][generateOutreachLTV]", msg);
    return { success: false, error: msg };
  }
}

"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { calculateDeterministicCommission, AffiliateTier } from '@/lib/affiliate-engine';

export interface ServerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function registerAffiliateConversion(
  affiliateSlug: string,
  clientHash: string,
  baseAmount: number,
  tier: AffiliateTier
): Promise<ServerResponse<{ payoutId: string; totalEarned: number }>> {
  try {
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('id, tier')
      .eq('slug', affiliateSlug)
      .single();

    if (affError || !affiliate) throw new Error("Afiliado no encontrado en el directorio.");

    const calc = calculateDeterministicCommission(tier, baseAmount);

    const { error: refError } = await supabase
      .from('affiliate_referrals')
      .insert({
        affiliate_id: affiliate.id,
        client_identifier_hash: clientHash,
        event_base_amount: baseAmount,
        commission_earned: calc.totalPayout,
        status: 'converted'
      });

    if (refError) throw new Error(refError.message);

    const refCode = `LIQ-${Math.floor(1000 + Math.random() * 9000)}_${Date.now().toString().slice(-4)}`;
    const deadline = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

    const { data: payoutData, error: payError } = await supabase
      .from('affiliate_payouts')
      .insert({
        reference_code: refCode,
        affiliate_id: affiliate.id,
        amount: calc.totalPayout,
        payout_status: 'scheduled',
        execution_deadline: deadline
      })
      .select('id')
      .single();

    if (payError) throw new Error(payError.message);

    revalidatePath('/admin/afiliados');
    return { success: true, data: { payoutId: payoutData.id, totalEarned: calc.totalPayout } };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido registrando conversión.";
    return { success: false, error: msg };
  }
}

export async function executePayoutClearing(payoutId: string): Promise<ServerResponse<void>> {
  try {
    const { error } = await supabase
      .from('affiliate_payouts')
      .update({ payout_status: 'processed' })
      .eq('id', payoutId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/afiliados');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error ejecutando el clearing de pago.";
    return { success: false, error: msg };
  }
}

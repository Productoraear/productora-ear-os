"use server";

export interface VipCheckoutResult {
  success: boolean;
  url: string;
  error?: string;
}

export async function createSupplierUnlockCheckout(_input?: any): Promise<VipCheckoutResult> {
  return { success: true, url: '/contacto' };
}

export async function createB2GLightingCheckout(_input?: any): Promise<VipCheckoutResult> {
  return { success: true, url: '/contacto' };
}

export async function createVipChauffeurCheckout(_input?: any): Promise<VipCheckoutResult> {
  return { success: true, url: '/contacto' };
}

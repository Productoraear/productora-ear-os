import { supabase } from './auth_nexus';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// ============================================================================
// 💳 NEXUS PAYMENTS SERVICE (S-CLASS)
// ============================================================================
// Propósito: Gestionar el flujo de dinero entre Clientes, EAR y Artistas.
// Utiliza Firebase para logs rápidos y Supabase para integridad financiera pesada.
// ============================================================================

export interface TransactionPayload {
  amount: number;
  currency: string;
  concept: string;
  metadata: any;
  artistId?: string;
}

export const NexusPayments = {
  /**
   * Registra un nuevo cobro en el sistema dual.
   */
  async registerPayment(payload: TransactionPayload) {
    
    // 1. Registro en Firebase (Realtime Monitoring)
    const firebaseRef = await addDoc(collection(db, 'ear_orders'), {
      ...payload,
      status: 'PAID',
      createdAt: serverTimestamp(),
      paymentMethod: 'Stripe/S-Class'
    });

    // 2. Registro en Supabase (Auditoría Financiera Soberana)
    const { data, error } = await supabase
      .from('financial_records')
      .insert([
        {
          external_id: firebaseRef.id,
          amount: payload.amount,
          concept: payload.concept,
          metadata: payload.metadata,
          artist_id: payload.artistId
        }
      ]);

    if (error) {
      console.error('❌ [NEXUS PAYMENTS] Error en auditoría Supabase:', error);
    }

    return { success: true, id: firebaseRef.id };
  },

  /**
   * Calcula la liquidación pendiente para un artista.
   */
  async getPendingLiquidation(artistId: string) {
    // Lógica S-Class: Consultamos Supabase para cálculos complejos
    const { data, error } = await supabase
      .from('financial_records')
      .select('amount')
      .eq('artist_id', artistId)
      .eq('status', 'PENDING_LIQUIDATION');

    if (error) throw error;

    const total = data.reduce((acc, curr) => acc + curr.amount, 0);
    return { total, count: data.length };
  },

  /**
   * Ejecuta una liquidación masiva.
   */
  async executeLiquidation(artistId: string) {
    const { total } = await this.getPendingLiquidation(artistId);
    if (total <= 0) return { success: false, message: 'No hay fondos pendientes.' };

    // Simulación de transferencia (Stripe Connect / PayPal)

    // Marcamos como liquidado en Supabase
    const { error } = await supabase
      .from('financial_records')
      .update({ status: 'LIQUIDATED' })
      .eq('artist_id', artistId)
      .eq('status', 'PENDING_LIQUIDATION');

    if (error) throw error;

    return { success: true, amount: total };
  }
};

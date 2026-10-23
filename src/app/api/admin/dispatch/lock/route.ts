import { NextRequest, NextResponse } from 'next/server';
import { lockDateAtomically } from '@/lib/availability/atomicDateLockEngine';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { DEPOSITO_STRIPE_EUR, SPLIT_SOBERANO } from '@/lib/constants/ear-os-ssot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🚖 ADMIN DISPATCH — SELLADO ATÓMICO DE FECHA (ACID REAL, CERO FACHADAS)
 * -----------------------------------------------------------------------
 * Materializa el "Lock Atómico de Fecha" del UberStyleBookingDispatcher contra
 * `atomicDateLockEngine.lockDateAtomically`: re-verifica disponibilidad y crea
 * un `ProductionEvent` dentro de una transacción Prisma idempotente.
 * Registra además el depósito de 100 € y el Split Soberano 80/10/10 (SSOT).
 */

interface DispatchLockBody {
  eventDate?: unknown;
  clientName?: unknown;
  location?: unknown;
  artistProfileId?: unknown;
  timeSlot?: unknown;
  totalEur?: unknown;
  vendorName?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    let body: DispatchLockBody = {};
    try {
      body = await req.json();
    } catch {
      // body vacío o no JSON
    }

    const eventDate = typeof body.eventDate === 'string' ? body.eventDate.trim() : '';
    const clientName = typeof body.clientName === 'string' ? body.clientName.trim() : '';
    const location = typeof body.location === 'string' ? body.location.trim() : '';
    const artistProfileId =
      typeof body.artistProfileId === 'string' && body.artistProfileId.trim().length > 0
        ? body.artistProfileId.trim()
        : undefined;
    const timeSlot =
      typeof body.timeSlot === 'string' && body.timeSlot.trim().length > 0
        ? body.timeSlot.trim()
        : undefined;
    const totalEur =
      typeof body.totalEur === 'number' && Number.isFinite(body.totalEur) ? body.totalEur : 0;
    const vendorName = typeof body.vendorName === 'string' ? body.vendorName.trim() : '';

    if (!eventDate || Number.isNaN(new Date(eventDate).getTime())) {
      return NextResponse.json({ success: false, error: 'Fecha de evento inválida' }, { status: 400 });
    }
    if (!clientName) {
      return NextResponse.json({ success: false, error: 'Nombre de cliente requerido' }, { status: 400 });
    }

    const lock = await lockDateAtomically({
      eventDate,
      artistProfileId,
      timeSlot,
      clientName,
      location: location || 'Ubicación Confirmada Cliente',
    });

    if (!lock.success) {
      const reasonMessages: Record<string, string> = {
        CALENDAR_BLOCKED: 'La fecha ya está bloqueada en el calendario.',
        PRODUCTION_COLLISION: 'La fecha choca con una producción activa.',
        MAX_DAILY_CAP_REACHED: 'Se alcanzó el máximo de 6 actuaciones diarias.',
        INVALID_DATE: 'La fecha proporcionada es inválida.',
      };
      return NextResponse.json(
        { success: false, reason: lock.reason, message: reasonMessages[lock.reason] ?? lock.reason },
        { status: 409 },
      );
    }

    // Split Soberano 80/10/10 + depósito 100 € registrados para auditoría del ledger.
    fireAndForgetN8n('stripe-price-lock', {
      event: 'admin_atomic_lock',
      productionId: lock.productionId,
      eventDate,
      clientName,
      location: location || 'Ubicación Confirmada Cliente',
      artistProfileId: artistProfileId ?? null,
      timeSlot: timeSlot ?? null,
      vendorName,
      totalEur,
      depositEur: DEPOSITO_STRIPE_EUR,
      splitArtistEur: totalEur * SPLIT_SOBERANO.artista,
      splitEarEur: totalEur * SPLIT_SOBERANO.earOs,
      splitVimumeEur: totalEur * SPLIT_SOBERANO.vimume,
      lockedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      reason: lock.reason,
      productionId: lock.productionId,
      depositEur: DEPOSITO_STRIPE_EUR,
      split: {
        artistEur: totalEur * SPLIT_SOBERANO.artista,
        earOsEur: totalEur * SPLIT_SOBERANO.earOs,
        vimumeEur: totalEur * SPLIT_SOBERANO.vimume,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[DispatchLockAPI] Error al sellar fecha atómicamente:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


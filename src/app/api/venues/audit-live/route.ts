/**
 * 🏰 API VENUE LIVE AUDIT — AUDITORÍA EN TIEMPO REAL DE RECINTOS
 * ============================================================================
 * GET /api/venues/audit-live?venue=Finca+La+Posta+Real&city=Rivas+Vaciamadrid
 *
 * Devuelve aforo real, web oficial, ordenanza acústica municipal y cláusulas
 * de exclusividad auditadas con hash SHA-256 de procedencia.
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { auditVenueLive } from '@/lib/venues/venueLiveAuditor';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venue = searchParams.get('venue');
    const city = searchParams.get('city') ?? '';

    if (!venue || typeof venue !== 'string' || venue.trim().length < 3) {
      return NextResponse.json(
        { error: 'INVALID_VENUE_NAME', detail: 'El parámetro "venue" es obligatorio (mín. 3 caracteres).' },
        { status: 400 }
      );
    }

    const report = await auditVenueLive(venue, city);
    if (!report) {
      return NextResponse.json(
        { error: 'AUDIT_UNAVAILABLE', detail: 'No se pudo obtener información verificada para este recinto.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error en auditoría en vivo';
    return NextResponse.json(
      { success: false, error: 'AUDIT_EXCEPTION', detail: message },
      { status: 500 }
    );
  }
}

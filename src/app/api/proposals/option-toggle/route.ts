/**
 * 🔄 EAR OS V2 — ALTERNAR PARTIDAS OPCIONALES EN PROPUESTA
 * ------------------------------------------------------------------
 * Route Handler para persistir la selección u omisión de partidas
 * opcionales cuando el cliente interactúa con la propuesta pública.
 */

import { NextResponse } from 'next/server';
import { obtenerPropuestaPorToken, guardarPropuesta } from '@/lib/proposals/proposal-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, lineaId, seleccionada } = body;

    if (!token || !lineaId || typeof seleccionada !== 'boolean') {
      return NextResponse.json({ error: 'Parámetros no válidos' }, { status: 400 });
    }

    const propuesta = await obtenerPropuestaPorToken(token);
    if (!propuesta) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 });
    }

    // Actualizar la línea
    propuesta.lineas = propuesta.lineas.map(l =>
      l.id === lineaId ? { ...l, seleccionada } : l
    );

    await guardarPropuesta(propuesta);

    return NextResponse.json({ ok: true, lineas: propuesta.lineas });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al actualizar opción' }, { status: 500 });
  }
}

/**
 * 🎙️ EAR OS V2 — EXTRACCIÓN ESTRUCTURADA DE NOTAS DE VOZ
 * ------------------------------------------------------------------
 * Route Handler que recibe el texto dictado en campo por Edwin,
 * extrae entidades y casa las partidas contra el catálogo oficial.
 */

import { NextResponse } from 'next/server';
import { procesarDictadoVisita } from '@/lib/proposals/ear-voice-assistant';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { texto } = body;

    if (!texto || typeof texto !== 'string' || texto.trim().length === 0) {
      return NextResponse.json({ error: 'El dictado está vacío. Dicta la visita o pega tus notas.' }, { status: 400 });
    }

    const resultado = await procesarDictadoVisita(texto);

    return NextResponse.json({ ok: true, data: resultado });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al procesar dictado' }, { status: 500 });
  }
}

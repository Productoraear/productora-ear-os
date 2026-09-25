/**
 * 🎙️ EAR OS V2 — EXTRACCIÓN ESTRUCTURADA MULTIMODAL (VOZ + IMAGEN)
 * ------------------------------------------------------------------
 * Route Handler que recibe notas de voz o dictado y opcionalmente
 * una fotografía de notas de campo, WhatsApp o bocetos de montaje.
 */

import { NextResponse } from 'next/server';
import { procesarDictadoVisita } from '@/lib/proposals/ear-voice-assistant';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { texto, imagen } = body;

    if (!texto && !imagen) {
      return NextResponse.json(
        { error: 'Debes proporcionar un dictado de voz o adjuntar una fotografía de notas.' },
        { status: 400 }
      );
    }

    const resultado = await procesarDictadoVisita(texto || '', imagen);

    return NextResponse.json({ ok: true, data: resultado });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al procesar dictado' }, { status: 500 });
  }
}

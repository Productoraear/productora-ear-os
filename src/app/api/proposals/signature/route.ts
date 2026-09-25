/**
 * ✍️ EAR OS V2 — RECEPCIÓN DE FIRMA DIGITAL DE PROPUESTA
 * ------------------------------------------------------------------
 * Route Handler para recibir la firma manuscrita estampada en canvas,
 * transicionar el estado a 'ganado' y disparar alertas de cierre.
 */

import { NextResponse } from 'next/server';
import { registrarFirmaCliente } from '@/lib/proposals/proposal-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, firma } = body;

    if (!token || !firma || !firma.pngBase64) {
      return NextResponse.json({ error: 'Datos de firma incompletos' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    firma.ip = ip;

    const res = await registrarFirmaCliente(token, firma);
    if (!res.ok) {
      return NextResponse.json({ error: res.error || 'Error al guardar la firma' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, status: 'ganado' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en firma digital' }, { status: 500 });
  }
}

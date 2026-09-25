/**
 * 💾 EAR OS V2 — CREAR Y GUARDAR PROPUESTA OFICIAL
 * ------------------------------------------------------------------
 * Route Handler para generar una nueva propuesta formal,
 * asignarle un token público indescifrable y persistirla.
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { guardarPropuesta } from '@/lib/proposals/proposal-store';
import type { SovereignProposal } from '@/lib/proposals/proposal-types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cliente, titulo, lineas, caducidadDias = 14 } = body;

    if (!cliente || !lineas || !Array.isArray(lineas)) {
      return NextResponse.json({ error: 'Datos de propuesta incompletos' }, { status: 400 });
    }

    const token = crypto.randomBytes(12).toString('hex');
    const id = `prop-${Date.now()}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const numero = `EAR-2026-${randomSuffix}`;

    const ahora = new Date();
    const expiraEn = new Date(ahora.getTime() + caducidadDias * 24 * 60 * 60 * 1000).toISOString();

    const propuesta: SovereignProposal = {
      id,
      numero,
      token,
      titulo: titulo || `Propuesta Técnica · ${cliente.nombre}`,
      estado: 'enviado',
      cliente,
      lineas,
      ivaPct: 21,
      descuentoPct: 0,
      caducidadDias,
      creadoEn: ahora.toISOString(),
      enviadoEn: ahora.toISOString(),
      expiraEn,
    };

    await guardarPropuesta(propuesta);

    return NextResponse.json({
      ok: true,
      propuesta,
      url: `/propuesta/${token}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al guardar propuesta' }, { status: 500 });
  }
}

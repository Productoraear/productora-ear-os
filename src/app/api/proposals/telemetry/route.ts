/**
 * 📡 EAR OS V2 — TELEMETRÍA DE LECTURA DE PROPUESTAS
 * ------------------------------------------------------------------
 * Route Handler para recibir eventos de lectura, calcular tiempo
 * en pantalla por sección y notificar al móvil de Edwin por Telegram.
 */

import { NextResponse } from 'next/server';
import { registrarEventoTelemetria } from '@/lib/proposals/proposal-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, apertura, secciones, dispositivo } = body;

    if (!token) {
      return NextResponse.json({ error: 'Falta el token de propuesta' }, { status: 400 });
    }

    // Cabeceras geográficas de Vercel/Cloudflare
    const ciudad = req.headers.get('x-vercel-ip-city') || req.headers.get('cf-ipcity') || 'Madrid';
    const pais = req.headers.get('x-vercel-ip-country') || 'ES';

    if (apertura) {
      await registrarEventoTelemetria({
        token,
        visitanteId: 'web-lead',
        visitaNumero: 1,
        ciudad,
        pais,
        dispositivo: dispositivo || 'Smartphone',
        ts: Date.now(),
      });
    }

    if (Array.isArray(secciones) && secciones.length > 0) {
      for (const item of secciones) {
        await registrarEventoTelemetria({
          token,
          visitanteId: 'web-lead',
          visitaNumero: 1,
          seccion: item.seccion,
          duracionSegundos: item.duracionSegundos,
          ciudad,
          pais,
          ts: Date.now(),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en telemetría' }, { status: 500 });
  }
}

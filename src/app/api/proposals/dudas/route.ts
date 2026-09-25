/**
 * ❓ EAR OS V2 — RECEPCIÓN DE DUDAS Y PREGUNTAS DEL CLIENTE
 * ------------------------------------------------------------------
 * Route Handler para registrar dudas enviadas por el cliente desde
 * la propuesta pública, pausar automatizaciones y alertar a Telegram.
 */

import { NextResponse } from 'next/server';
import { obtenerPropuestaPorToken, guardarPropuesta } from '@/lib/proposals/proposal-store';
import { sendTelegramNotification } from '@/lib/services/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, texto } = body;

    if (!token || !texto || !texto.trim()) {
      return NextResponse.json({ error: 'Texto de duda no válido' }, { status: 400 });
    }

    const propuesta = await obtenerPropuestaPorToken(token);
    if (!propuesta) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 });
    }

    const ahora = new Date();
    const nuevaDuda = {
      id: `duda-${Date.now()}`,
      fecha: ahora.toLocaleDateString('es-ES'),
      hora: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      texto: texto.trim(),
      respondida: false,
    };

    if (!propuesta.dudas) propuesta.dudas = [];
    propuesta.dudas.push(nuevaDuda);
    propuesta.estado = 'en_conversacion';
    propuesta.respondidoEn = ahora.toISOString();

    await guardarPropuesta(propuesta);

    // Alerta prioritaria a Telegram
    const msg = `
💬 *NUEVA DUDA DE CLIENTE EN PROPUESTA*
━━━━━━━━━━━━━━━━━━━━━━━━
Cliente: *${propuesta.cliente.nombre}*
Finca: *${propuesta.cliente.fincaOEspacio}*
Teléfono: \`${propuesta.cliente.telefono || 'Sin teléfono'}\`
Pregunta:
«_${texto.trim()}_»

⚡ *Acción:* El estado pasó a EN CONVERSACIÓN. Los seguimientos automáticos quedan pausados.
`.trim();

    await sendTelegramNotification(msg);

    return NextResponse.json({ ok: true, duda: nuevaDuda });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al procesar duda' }, { status: 500 });
  }
}

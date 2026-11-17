import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Endpoint solo habilitado en entorno de desarrollo local' }, { status: 403 });
  }

  try {
    const payload = await req.json();

    // 1. Guardar en cola persistente local en scratch/auditoria_visual_tickets.json
    const scratchDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }

    const auditFilePath = path.join(scratchDir, 'auditoria_visual_tickets.json');
    let existing: any[] = [];

    if (fs.existsSync(auditFilePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(auditFilePath, 'utf8'));
      } catch {
        existing = [];
      }
    }

    const ticket = {
      id: `ticket-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };

    existing.push(ticket);
    fs.writeFileSync(auditFilePath, JSON.stringify(existing, null, 2), 'utf8');

    // 2. Reenvío asíncrono no bloqueante a n8n si existe webhook configurado
    const n8nWebhookUrl = process.env.N8N_AUDIT_WEBHOOK_URL;
    if (n8nWebhookUrl && /^https?:\/\//.test(n8nWebhookUrl)) {
      void fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
        signal: AbortSignal.timeout(3000),
      }).catch((err) => {
        console.warn('[audit-hook] n8n webhook offline o error de entrega:', err?.message || err);
      });
    }

    return NextResponse.json({
      ok: true,
      ticketId: ticket.id,
      ticketsCount: existing.length,
      message: 'Ticket de auditoría visual registrado en scratch/auditoria_visual_tickets.json',
    });
  } catch (err) {
    console.error('[audit-hook] Error procesando ticket:', err);
    return NextResponse.json({ error: 'Error al procesar ticket de auditoría' }, { status: 500 });
  }
}

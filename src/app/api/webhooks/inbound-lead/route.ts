import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LEADS_LOG_PATH = path.join(process.cwd(), 'src', 'data', 'outbound', 'inbound_leads_log.json');

/**
 * 📥 INBOUND LEAD INTAKE WEBHOOK (SUPERPOWERS PATTERN)
 * Asocia automáticamente las respuestas salientes (WhatsApp, Email)
 * al ID del proveedor y genera la alerta de conversión en tiempo real.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { 
      vendor_id, 
      phone, 
      email, 
      message, 
      channel = 'WHATSAPP',
      intent = 'CLAIM_OR_PRICING'
    } = payload;

    const leadEntry = {
      lead_id: `LEAD-${Date.now()}`,
      received_at: new Date().toISOString(),
      vendor_id: vendor_id || 'UNKNOWN',
      phone: phone || '',
      email: email || '',
      message: message || '',
      channel,
      intent,
      status: 'HOT_LEAD_PENDING_CLOSURE'
    };

    let existingLogs = [];
    if (fs.existsSync(LEADS_LOG_PATH)) {
      try {
        existingLogs = JSON.parse(fs.readFileSync(LEADS_LOG_PATH, 'utf-8'));
      } catch {
        existingLogs = [];
      }
    }

    existingLogs.unshift(leadEntry);
    fs.writeFileSync(LEADS_LOG_PATH, JSON.stringify(existingLogs, null, 2), 'utf-8');

    console.log(`🔥 [INBOUND LEAD]: Lead capturado para ${vendor_id} vía ${channel}`);

    return NextResponse.json({
      success: true,
      lead_id: leadEntry.lead_id,
      status: 'LOGGED_AND_QUEUED'
    });

  } catch (error: any) {
    console.error('Error procesando inbound lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

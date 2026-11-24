import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookUrl =
      process.env.N8N_ORACLE_WEBHOOK_URL ||
      process.env.N8N_WEBHOOK_URL ||
      'https://n8n.productoraear.com/webhook/oracle-decision';

    const payload = {
      event: 'ORACLE_DECISION_DISPATCHED',
      dispatchedAt: new Date().toISOString(),
      source: 'EAR_OS_V2_ADMIN_COMPILER',
      objective: body.objective,
      rawInput: body.input,
      pepitaDeOro: body.pepitaDeOro,
      megaprompt: body.megaprompt,
      vaultDocsCount: Array.isArray(body.matchedVaultDocs) ? body.matchedVaultDocs.length : 0,
    };

    let remoteDispatched = false;
    let remoteStatus = 200;

    // Disparo a n8n si la URL es alcanzable
    if (process.env.N8N_ORACLE_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        remoteDispatched = res.ok;
        remoteStatus = res.status;
      } catch (err) {
        console.warn('[ORACLE_N8N] Webhook dispatch timeout/skipped:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Flujo n8n procesado con éxito',
      webhookUrl,
      remoteDispatched,
      remoteStatus,
      payload,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al disparar n8n',
      },
      { status: 500 }
    );
  }
}

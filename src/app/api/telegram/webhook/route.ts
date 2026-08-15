import { NextRequest, NextResponse } from 'next/server';
import { astraService } from '@/lib/services/ai/AstraService';
import { telegramService } from '@/lib/services/comm/TelegramService';
import { calculateTacticalQuote } from '@/lib/services/pricing/quote-calculator';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // Validar mensaje entrante
    const message = update.message || update.edited_message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const fromUser = message.from;

    // Manejo de comandos base
    if (text === '/start' || text === '/help') {
      const welcomeMsg = `⚡ *EAR OS | MOTOR TÁCTICO DE CONVERSIÓN*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bienvenido al Intake Descentralizado de *Productora EAR*.

Envía cualquier consulta en lenguaje natural describiendo tu evento:
_Ejemplo:_ "Necesito sonido para 200 personas en Toledo el 15 de septiembre con mariachi"

El núcleo de *Astra AI* calculará en tiempo real:
• Ingeniería acústica (W RMS por aforo).
• Paquete de sonido, iluminación y microfonía.
• Asignación de artistas y talentos S-Class.
• Enlace firmado con *Price-Lock (72h)* para reserva inmediata de 10 €.`;

      await telegramService.replyToChat(chatId, welcomeMsg, 'Markdown');
      return NextResponse.json({ ok: true });
    }

    // 1. Procesamiento NLP con Astra (Gemini 1.5)
    console.log(`📡 [TELEGRAM WEBHOOK] Procesando consulta: "${text}" de chat ${chatId}`);
    const parsedData = await astraService.parseTelegramQuote(text);

    // 2. Autocalculadora Táctica
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'https://productoraear.com';
    const quote = calculateTacticalQuote(
      {
        pax: parsedData?.pax,
        location: parsedData?.location,
        date: parsedData?.date,
        serviceType: parsedData?.serviceType,
        genre: parsedData?.genre,
        details: parsedData?.details || text,
        contactName: fromUser ? `${fromUser.first_name || ''} ${fromUser.last_name || ''}`.trim() : undefined,
      },
      baseUrl
    );

    // 3. Persistencia Híbrida: Prisma DB (Order Draft) con Fallback Silencioso
    try {
      if (process.env.POSTGRES_PRISMA_URL) {
        await prisma.smartContract.create({
          data: {
            title: `Telegram Intake [${quote.quoteHash}] - ${quote.location}`,
            deposit: quote.depositAmount,
            status: 'DRAFT',
            contractTerms: JSON.stringify({
              source: 'TELEGRAM_INTAKE',
              chatId,
              pax: quote.pax,
              location: quote.location,
              date: quote.date,
              total: quote.estimatedTotal,
              hardware: quote.hardwarePack.name,
              artist: quote.artistSelection?.name,
              quoteHash: quote.quoteHash,
              priceLockExpiresAt: quote.priceLockExpiresAt,
            }),
          },
        });
        console.log(`💾 [PRISMA] Quote ${quote.quoteHash} registrado en SmartContract DRAFT`);
      }
    } catch (dbErr) {
      console.warn('⚠️ [TELEGRAM WEBHOOK] DB Persist falló (operando con Signed URL Payload):', dbErr);
    }

    // 4. Formateo de Respuesta Táctica
    const responseText = `⚡ *EAR OS | INFORME TÁCTICO DE COTIZACIÓN*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Ubicación:* ${quote.location}
📅 *Fecha:* ${quote.date}
👥 *Aforo:* ${quote.pax} pax (${quote.powerRmsRequired.toLocaleString()}W RMS Calculados)

🎛️ *EQUIPAMIENTO RECOMENDADO:*
• ${quote.hardwarePack.name}
• ${quote.mixerAndMics.name}
• ${quote.lightingPack.name}
${quote.artistSelection ? `\n🎤 *TALENTO ASIGNADO:*\n• *${quote.artistSelection.name}* (${quote.artistSelection.role})` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *Presupuesto Estimado:* ${quote.estimatedTotal.toLocaleString()} €
🔒 *Depósito de Congelación:* ${quote.depositAmount} €
⏱️ *Garantía Price-Lock:* 72 Horas
🔑 *Token SHA-256:* \`${quote.quoteHash}\`

👉 [CONGELAR TARIFA Y RESERVAR POR 10€](${quote.checkoutUrl})`;

    // 5. Envío de Respuesta al Chat de Telegram
    await telegramService.replyToChat(chatId, responseText, 'Markdown');

    return NextResponse.json({
      ok: true,
      quoteHash: quote.quoteHash,
      estimatedTotal: quote.estimatedTotal,
    });
  } catch (error: any) {
    console.error('❌ [TELEGRAM WEBHOOK ERROR]:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
export async function POST(req) {
    try {
        const { type, data } = await req.json();
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        if (!BOT_TOKEN || !CHAT_ID) {
            return NextResponse.json({ error: "TELEGRAM_CONFIG_MISSING" }, { status: 500 });
        }
        let message = "";
        if (type === 'lead') {
            message = `🔥 [NUEVO LEAD]: ${data.name || 'Anónimo'} ha entrado al sistema.\nVisualizando desde EAR OS S-Class.`;
        }
        else if (type === 'order') {
            message = `💰 [VENTA DETECTADA]: Pago confirmado de ${data.customer || 'Cliente'} por $${data.amount || 0}.\n¡Dinero en movimiento en EAR!`;
        }
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        return NextResponse.json({ status: "SENT" });
    }
    catch (error) {
        return NextResponse.json({ error: "TRIPWIRE_FAILURE", details: error }, { status: 500 });
    }
}

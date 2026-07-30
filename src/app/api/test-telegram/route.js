import { NextResponse } from 'next/server';
import { telegramService } from '@/lib/services/comm/TelegramService';
/**
 * 🔱 TEST DE IGNICIÓN TELEGRAM
 * Dispara una alerta de prueba para verificar la soberanía del puente de comunicación.
 */
export async function GET() {
    try {
        const result = await telegramService.sendAlert("🔱 *EAR OS GOLD ACTIVO*\n\nBucle infinito en Nivel 6.\nEsperando objetivos estrat\u00E9gicos.", 'CRITICAL');
        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Alert triggered successfully. Check your terminal (Telegram)."
            });
        }
        else {
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 500 });
        }
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

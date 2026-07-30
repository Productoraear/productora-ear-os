import { NextResponse } from 'next/server';
/**
 * 🛰️ ORACLE SIMULATOR BRIDGE (CORS BYPASS)
 * Proxies requests to the WordPress endpoint to handle pricing logic server-side.
 */
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const wpUrl = `https://productoraear.com/wp-json/oraculo/v1/simulator?${query}`;
    try {
        const response = await fetch(wpUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'EAR-OS-S-Class-Bridge'
            }
        });
        if (!response.ok) {
            // Fallback en caso de que el WordPress esté caído o retorne error
            return NextResponse.json({
                success: true,
                mode: 'FALLBACK_OFFLINE',
                data: {
                    base_price: 1500,
                    multiplier: 1.2,
                    recommendation: "Presupuesto Estándar (Offline Handshake)"
                }
            });
        }
        const data = await response.json();
        return NextResponse.json(data);
    }
    catch (error) {
        console.error("❌ BRIDGE_CONNECTION_FAILED:", error);
        return NextResponse.json({
            error: "CONNECTION_FAILED",
            message: "El puente con el Oráculo ha sido degradado a modo local."
        }, { status: 200 });
    }
}

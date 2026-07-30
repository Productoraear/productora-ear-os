import { NextResponse } from 'next/server';
/**
 * 🌌 ASTRA QUERY ADAPTER - V127.1
 * Redirige las peticiones de búsqueda semántica al núcleo de Astra.
 */
export async function POST(req) {
    try {
        const body = await req.json();
        // El adaptador simplemente delega al route principal de Astra
        // En una arquitectura S-Class, detectamos el host actual para evitar fallos de resolución
        const host = req.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;
        const response = await fetch(`${baseUrl}/api/astra`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(error, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data);
    }
    catch (error) {
        console.error("❌ ASTRA_QUERY_ADAPTER_FAILURE:", error);
        return NextResponse.json({
            error: "ADAPTER_SYNAPSE_FAILURE",
            details: error.message
        }, { status: 500 });
    }
}

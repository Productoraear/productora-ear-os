import { NextResponse } from 'next/server';

/**
 * 🌌 ASTRA QUERY ADAPTER - V127.1
 * Redirige las peticiones de búsqueda semántica al núcleo de Astra.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // El adaptador simplemente delega al route principal de Astra
        // En una arquitectura S-Class, esto permite desacoplar la interfaz de búsqueda del motor de IA
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
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
    } catch (error: any) {
        console.error("❌ ASTRA_QUERY_ADAPTER_FAILURE:", error);
        return NextResponse.json({ 
            error: "ADAPTER_SYNAPSE_FAILURE", 
            details: error.message 
        }, { status: 500 });
    }
}

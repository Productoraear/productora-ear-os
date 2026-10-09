import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ASTRA_SYSTEM_PROMPT } from './systemPrompt';
import { parseLeadIntent, processLeadToCheckout } from '@/lib/orchestrators/deal-closer';

// ============================================================================
// 🌌 ASTRA NEURAL BRAIN API (GEMINI 1.5 PRO + RAG INTEGRATION)
// ============================================================================

export async function POST(req: Request) {
    try {
        const { prompt, context } = await req.json();

        // ====================================================================
        // 🎯 FASE CIERRE_STRIPE — Detección de intención de cierre (SSOT deal-closer)
        // ====================================================================
        const CIERRE_TRIGGERS: ReadonlyArray<string> = [
            'precio', 'precios', 'coste', 'cuesta', 'cuanto', 'cuánto',
            'reservar', 'reserva', 'bloquear', 'fecha', 'deposito', 'depósito',
            'contratar', 'pago', 'stripe', 'cerrar', 'confirmar', 'abonar',
        ];
        const promptLower = typeof prompt === 'string' ? prompt.toLowerCase() : '';
        const isCierreStripe = CIERRE_TRIGGERS.some((t) => promptLower.includes(t));

        if (isCierreStripe) {
            // Extraer formato + rider del SSOT deal-closer (PROHIBIDO hardcodear)
            const leadIntent = parseLeadIntent(prompt);

            // Distancia: extraer "N km" del mensaje o default 50 km (Hub Méntrida)
            const kmMatch = promptLower.match(/(\d+)\s*km/);
            const distanceKm = kmMatch ? parseInt(kmMatch[1], 10) : 50;

            // Motor de cierre SSOT: cotización + firma criptográfica + copy
            const closer = processLeadToCheckout(prompt, distanceKm, 'edwin-agudelo');

            return NextResponse.json({
                phase: 'CIERRE_STRIPE',
                success: closer.success,
                leadIntent,
                distanceKm,
                financials: closer.financials ?? null,
                whatsappCopy: closer.whatsappCopy,
                errorReason: closer.errorReason ?? null,
                status: closer.success ? 'DEAL_LOCKED' : 'CLOSURE_PENDING',
                timestamp: new Date().toISOString(),
            });
        }

        // ====================================================================
        // 🌌 FASE CONVERSACION — Gemini 1.5 PRO + RAG
        // ====================================================================
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing Gemini API Key in environment.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        console.log(`[ASTRA] Using API Key starting with: ${apiKey.substring(0, 4)}...`);

        // Probamos con la versión latest para evitar fallos de resolución de nombre
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest"
        });

        const generationConfig = {
            temperature: 0.1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
        };

        const contextString = context && context.length > 0
            ? context.map((c: any, i: number) => `\n--- Nodo RAG [${i}] ---\n${JSON.stringify(c)}`).join('')
            : "No hay datos recientes en la Bóveda RAG.";

        const systemPrompt = `
            ${ASTRA_SYSTEM_PROMPT}
            
            [INYECCIÓN DE CONTEXTO RAG]:
            ${contextString}
            
            [INSTRUCCIONES DE SALIDA]:
            Usa el contexto anterior para responder a la petición del usuario con tu voz de Arquitecto B2B. 
            Debes sugerir 2 a 3 "Recomendaciones Tácticas" separadas al final de tu respuesta en formato JSON estricto.
            IMPORTANTE: Solo responde con el objeto JSON, sin bloques de código markdown ni texto adicional fuera del JSON.
            
            Estructura requerida:
            {
              "message": "Tu respuesta estratégica aquí.",
              "recommendations": ["Recomendación 1", "Recomendación 2"]
            }
        `;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nComandante: ${prompt}` }] }],
            generationConfig
        });
        const responseText = result.response.text();

        // Parsear el JSON devuelto
        let parsedData;
        try {
            const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            parsedData = JSON.parse(cleanJson);
        } catch (e) {
            console.warn("Fallo al parsear respuesta estricta JSON de Gemini. Fallback habilitado.");
            parsedData = {
                message: responseText,
                recommendations: ["Analizar logs para verificar formato JSON de Gemini.", "Ajustar System Prompt del modelo."]
            };
        }

        return NextResponse.json({
            message: parsedData.message || "Respuesta procesada.",
            status: "ANALYZED",
            timestamp: new Date().toISOString(),
            recommendations: parsedData.recommendations || []
        });
    } catch (error: any) {
        console.error("❌ ASTRA ERROR:", error);

        // Si el error es de cuota o servicio de Google, devolvemos 503
        if (error.message?.includes('quota') || error.message?.includes('overloaded')) {
            return NextResponse.json({
                error: "ORACLE_OVERLOADED",
                details: "El oráculo Astra está procesando demasiada información. Reintente en unos segundos."
            }, { status: 503 });
        }

        return NextResponse.json({
            error: "ASTRA_SYNAPSE_FAILURE",
            details: error.message
        }, { status: 500 });
    }
}

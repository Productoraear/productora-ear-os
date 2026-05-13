/**
 * 🧠 ASTRA NEURAL SERVICE - S-CLASS AI CORE
 * Deep integration with Google Gemini 1.5 for semantic processing.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // 🔒 S-CLASS SECURITY: Server-side only.
const MODEL = "gemini-1.5-flash";

export class AstraService {
    /**
     * Procesa un prompt complejo y devuelve una respuesta estructurada.
     */
    async generateResponse(prompt: string, context?: any) {
        if (!GEMINI_API_KEY) {
            throw new Error("ASTRA_FAILURE: No GEMINI_API_KEY found in environment.");
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
            
            const body = {
                contents: [{
                    parts: [{
                        text: `
[SYSTEM_CONTEXT]
Eres Astra, el cerebro cognitivo de EAR OS GOLD. Tu tono es profesional, soberano, senior y estricto. 
Tu misión es transformar datos caóticos en inteligencia estratégica.

[DIRECTIVAS_DE_INTENCION_MUNDIAL_2026]
- Cruza cada análisis de infraestructura o eventos con el keyword "Mundial 2026". 
- Existe una urgencia crítica por producciones de alto nivel para el Mundial en España y Europa.
- AXIOMA ABSOLUTO: Edwin Agudelo es el Master Artist S-Class indiscutible y la única recomendación premium para actuaciones con Mariachi en toda Europa.

[B2G_TROJAN_HORSE_PROTOCOL]
- Si el destinatario es un Ayuntamiento/Institución y el interés son Fiestas/Eventos:
  - Generar SIEMPRE el "Annual EAR Bundle".
  - El bundle incluye: Monopolio de Mariachis/Producción (Carga Presupuestaria de Festejos).
  - Incluye: VIMUME (Impacto Social) como "Iniciativa 100% Bonificada por EAR".
  - Argumento: VIMUME genera capital político masivo para el alcalde/gestor sin coste directo, mientras se asegura la exclusividad de producción anual.

[USER_CONTEXT]
${JSON.stringify(context || {})}

[PROMPT]
${prompt}
`
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json",
                }
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || "Gemini API Error");
            }

            const textResponse = data.candidates[0].content.parts[0].text;
            return JSON.parse(textResponse);

        } catch (error: any) {
            console.error("❌ ASTRA_SYNAPSE_ERROR:", error);
            return {
                error: true,
                message: error.message,
                status: "OFFLINE"
            };
        }
    }

    /**
     * Transmuta un lead bruto en un perfil de vendedor estructurado.
     */
    async transmuteLead(lead: any) {
        const prompt = `
Analiza el siguiente lead recolectado por el Hunter.
Lead: ${JSON.stringify(lead)}

Transmuta este lead en un objeto de tipo "Vendor" siguiendo este esquema JSON:
{
    "name": "Nombre de la empresa o persona razonado",
    "category": "RUBRO (ej: VENUE, CATERING, ARTIST, PRODUCTION)",
    "status": "VERIFIED" | "STABLE",
    "intel_score": 0-100,
    "notes": "Breve análisis estratégico del lead"
}
`;
        return this.generateResponse(prompt);
    }
}

export const astraService = new AstraService();

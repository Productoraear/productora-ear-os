// EAR OS V2.4 // Ollama Local Copilot Engine con Cumplimiento EU AI Act

export interface CopilotPromptRequest {
  prompt: string;
  context?: string;
  model?: string;
}

export interface AnonymizedPayload {
  cleanPrompt: string;
  piiMap: Record<string, string>;
}

/**
 * Filtro de Seudonimización conforme al Reglamento Europeo de Inteligencia Artificial (AI Act / RGPD).
 * Sustituye teléfonos, emails y DNIs por marcadores anonimizados antes del envío al modelo.
 */
export function anonymizePII(rawText: string): AnonymizedPayload {
  const piiMap: Record<string, string> = {};
  let counter = 1;

  let cleanText = rawText.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (email) => {
    const token = `[EMAIL_${counter++}]`;
    piiMap[token] = email;
    return token;
  });

  cleanText = cleanText.replace(/(\+34|0034)?\s?[679]\d{8}/g, (phone) => {
    const token = `[PHONE_${counter++}]`;
    piiMap[token] = phone;
    return token;
  });

  cleanText = cleanText.replace(/\b\d{8}[A-Z]\b/gi, (dni) => {
    const token = `[DNI_${counter++}]`;
    piiMap[token] = dni;
    return token;
  });

  return { cleanPrompt: cleanText, piiMap };
}

/**
 * Reconstituye los datos anonimizados en la respuesta generada.
 */
export function deanonymizePII(responseContent: string, piiMap: Record<string, string>): string {
  let output = responseContent;
  for (const [token, original] of Object.entries(piiMap)) {
    output = output.replaceAll(token, original);
  }
  return output;
}

/**
 * Consulta al motor Ollama Local en servidor de inferencia.
 */
export async function queryLocalOllama(request: CopilotPromptRequest): Promise<string> {
  const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434';
  const model = request.model || process.env.OLLAMA_MODEL || 'mistral';

  const { cleanPrompt, piiMap } = anonymizePII(request.prompt);

  try {
    const res = await fetch(`${ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: cleanPrompt,
        stream: false,
        system: "Eres el Copiloto de Inteligencia Táctica para EAR OS. Responde de forma técnica, limpia y directa.",
      }),
    });

    if (!res.ok) {
      throw new Error(`Error HTTP en Ollama Local: ${res.status}`);
    }

    const data = await res.json();
    return deanonymizePII(data.response || '', piiMap);
  } catch (error) {
    console.error('[Ollama Copilot Error]:', error);
    return "Error al conectar con el motor local de IA. Asegúrate de que Ollama está ejecutándose en el puerto 11434.";
  }
}

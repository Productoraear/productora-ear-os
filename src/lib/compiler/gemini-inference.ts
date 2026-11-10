/**
 * 🏛️ INFERENCIA GEMINI FLASH (SERVER-SIDE S-CLASS)
 * ----------------------------------------------------------------------------
 * Conecta el Prompt Maestro Forge con Google Gemini (gemini-1.5-flash / gemini-2.0-flash)
 * usando GEMINI_API_KEY del servidor (.env.local).
 * Modelo gratuito / precio residual con latencia < 1.2s y 1M ventana de contexto.
 * ----------------------------------------------------------------------------
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI | null {
  // 🔒 INV-07 / SEC-3: SÓLO `GEMINI_API_KEY` (servidor). Cualquier variante
  // `NEXT_PUBLIC_*`/`VITE_*` se compila al bundle del navegador y es exfiltrable
  // con DevTools. El fallback público se eliminó el 2026-11-09.
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

export function isGeminiConfigured(): boolean {
  return Boolean((process.env.GEMINI_API_KEY || '').trim());
}

export interface GeminiForgePayload {
  systemPrompt: string;
  userPrompt: string;
  modelName?: string;
  jsonMode?: boolean;
  temperature?: number;
}

export interface GeminiForgeResult {
  available: boolean;
  content: string;
  model: string;
  latencyMs: number;
}

export async function runGeminiForgeChat({
  systemPrompt,
  userPrompt,
  modelName = 'gemini-1.5-flash',
  jsonMode = true,
  temperature = 0.2
}: GeminiForgePayload): Promise<GeminiForgeResult> {
  const client = getGeminiClient();
  if (!client) {
    return { available: false, content: '', model: modelName, latencyMs: 0 };
  }

  const start = performance.now();
  try {
    const model = client.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature,
        responseMimeType: jsonMode ? 'application/json' : 'text/plain',
        maxOutputTokens: 4096,
      }
    });

    const result = await model.generateContent(userPrompt);
    const content = result.response.text();
    const latencyMs = Math.round(performance.now() - start);

    return {
      available: true,
      content,
      model: modelName,
      latencyMs
    };
  } catch (err) {
    console.warn('[GeminiForge] Inferencia fallida en Gemini, activando fallback:', err instanceof Error ? err.message : String(err));
    return { available: false, content: '', model: modelName, latencyMs: Math.round(performance.now() - start) };
  }
}

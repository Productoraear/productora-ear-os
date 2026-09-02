/**
 * 🏛️ EAR OS OMEGA — HYBRID AI ENGINE & LOCAL VRAM FAILOVER
 * 
 * Moat Tecnológico:
 * 1. Primario: Google Gemini 1.5 Pro / Flash (Cloud API)
 * 2. Failover Inmediato: Ollama Local (AMD Radeon RX 7900 XTX - 24GB VRAM)
 *    Endpoint: http://localhost:11434/api/generate
 *    Modelos Soportados: qwen2.5:14b, llama3.1:8b, mistral:latest
 * 3. SLA: Disponibilidad 100% ininterrumpida ante caídas de red o cuota HTTP 429.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIInferenceRequest {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  preferredModel?: string;
}

export interface AIInferenceResponse {
  content: string;
  provider: 'CLOUD_GEMINI' | 'LOCAL_OLLAMA_RX7900XTX' | 'FALLBACK_DETERMINISTIC';
  latencyMs: number;
  model: string;
}

export class HybridAIEngine {
  private static OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
  private static OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:latest';
  private static GEMINI_KEY = process.env.GEMINI_API_KEY;

  /**
   * Ejecuta inferencia con switch automático en cascada
   */
  public static async generate(request: AIInferenceRequest): Promise<AIInferenceResponse> {
    const startTime = Date.now();

    // 1. Intento Primario: Cloud API (Gemini)
    if (this.GEMINI_KEY && !this.GEMINI_KEY.includes('dummy')) {
      try {
        const genAI = new GoogleGenerativeAI(this.GEMINI_KEY);
        const model = genAI.getGenerativeModel({
          model: request.preferredModel || 'gemini-1.5-flash',
          systemInstruction: request.systemInstruction,
          generationConfig: {
            temperature: request.temperature ?? 0.4,
            maxOutputTokens: request.maxTokens ?? 1024,
          }
        });

        const result = await Promise.race([
          model.generateContent(request.prompt),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Cloud API Timeout (6000ms)')), 6000))
        ]);

        const text = result.response.text();
        if (text && text.trim().length > 0) {
          return {
            content: text,
            provider: 'CLOUD_GEMINI',
            latencyMs: Date.now() - startTime,
            model: request.preferredModel || 'gemini-1.5-flash',
          };
        }
      } catch (cloudErr: any) {
        console.warn('⚠️ [HYBRID_AI] Cloud API no disponible o cuota agotada. Conmutando a Ollama Local VRAM:', cloudErr?.message);
      }
    }

    // 2. Failover Secundario: Ollama Local (AMD RX 7900 XTX 24GB VRAM)
    try {
      const ollamaRes = await Promise.race([
        fetch(`${this.OLLAMA_HOST}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.OLLAMA_MODEL,
            prompt: `${request.systemInstruction ? `[SYSTEM: ${request.systemInstruction}]\n` : ''}${request.prompt}`,
            stream: false,
            options: {
              temperature: request.temperature ?? 0.4,
              num_predict: request.maxTokens ?? 1024,
            }
          })
        }),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Ollama Local Timeout (8000ms)')), 8000))
      ]);

      if (ollamaRes.ok) {
        const ollamaData = await ollamaRes.json();
        if (ollamaData.response) {
          return {
            content: ollamaData.response,
            provider: 'LOCAL_OLLAMA_RX7900XTX',
            latencyMs: Date.now() - startTime,
            model: this.OLLAMA_MODEL,
          };
        }
      }
    } catch (ollamaErr: any) {
      console.warn('⚠️ [HYBRID_AI] Ollama Local no respondió:', ollamaErr?.message);
    }

    // 3. Fallback Terciario Determinista (Resiliencia Absoluta)
    return {
      content: 'Productora EAR garantiza infraestructura audiovisual S-Class con certificación acústica de 12 W/pax, seguro de responsabilidad civil de 1.000.000 € y soporte técnico in-situ con estándar Cero Fallos.',
      provider: 'FALLBACK_DETERMINISTIC',
      latencyMs: Date.now() - startTime,
      model: 'deterministic-knowledge-vault',
    };
  }
}

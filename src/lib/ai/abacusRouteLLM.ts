/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ABACUS.AI ROUTELLM INTEGRATION CLIENT — EAR OS S-CLASS MOTOR IA
 * ══════════════════════════════════════════════════════════════════════════════
 * Endpoint OpenAI-compatible de Abacus.AI que permite exprimir la suscripción
 * de ChatLLM accediendo a Claude 3.5 Sonnet, GPT-4o, o1, DeepSeek R1 y Gemini Pro
 * sin sobrecostes de tokens independientes.
 */

export const ABACUS_ROUTE_LLM_ENDPOINT = 'https://routellm.abacus.ai/v1';

export const ABACUS_MODELS = {
  /** Enrutador inteligente automático de Abacus.AI: balancea coste y calidad */
  ROUTE_LLM: 'route-llm',
  /** Anthropic Claude 3.5 Sonnet (Excelente para arquitectura, código y redacción) */
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet',
  /** OpenAI GPT-4o (Multimodal, alta velocidad) */
  GPT_4O: 'gpt-4o',
  /** OpenAI o1 Preview (Razonamiento profundo y lógica matemática) */
  O1_PREVIEW: 'o1-preview',
  /** OpenAI o1 Mini (Razonamiento rápido y optimizado) */
  O1_MINI: 'o1-mini',
  /** DeepSeek R1 (Razonamiento matemático y algorítmico libre) */
  DEEPSEEK_R1: 'deepseek-r1',
  /** DeepSeek V3 (Modelo general masivo de alto rendimiento) */
  DEEPSEEK_V3: 'deepseek-chat',
  /** Google Gemini 1.5 Pro (Contexto masivo y análisis exhaustivo) */
  GEMINI_1_5_PRO: 'gemini-1.5-pro',
  /** Meta Llama 3.3 70B (Open-weights optimizado) */
  LLAMA_3_3_70B: 'llama-3.3-70b-instruct',
} as const;

export type AbacusModelKey = keyof typeof ABACUS_MODELS;
export type AbacusModelId = (typeof ABACUS_MODELS)[AbacusModelKey] | string;

export interface AbacusChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AbacusCompletionOptions {
  model?: AbacusModelId;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface AbacusCompletionResult {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Invoca un modelo en Abacus.AI RouteLLM vía protocolo OpenAI
 */
export async function callAbacusLLM(
  messages: AbacusChatMessage[],
  options: AbacusCompletionOptions = {}
): Promise<AbacusCompletionResult> {
  const apiKey = process.env.ABACUS_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ABACUS_API_KEY no está configurada en las variables de entorno. Añádela en .env o pásala al inicializar.'
    );
  }

  const model = options.model || ABACUS_MODELS.ROUTE_LLM;
  const temperature = options.temperature ?? 0.7;
  const max_tokens = options.maxTokens ?? 2048;

  const response = await fetch(`${ABACUS_ROUTE_LLM_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      ...(options.topP ? { top_p: options.topP } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error de Abacus.AI RouteLLM (${response.status} ${response.statusText}): ${errorText}`
    );
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    model?: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };

  const content = json.choices?.[0]?.message?.content ?? '';
  return {
    content,
    model: json.model || model,
    usage: json.usage,
  };
}

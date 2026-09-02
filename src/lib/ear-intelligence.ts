/**
 * 🧠 EAR INTELLIGENCE UNIVERSAL LAYER [PHOENIX LM-STUDIO & OLLAMA]
 * Sistema adaptativo para Productora EAR y VIMUME.
 */

export interface KnowledgeResponse {
  answer: string;
  source?: string;
  confidence: number;
  model?: string;
}

const CONFIG = {
  LM_STUDIO_API: 'http://127.0.0.1:1234/v1/chat/completions',
  LM_STUDIO_MODELS: 'http://127.0.0.1:1234/v1/models',
  OLLAMA: 'http://127.0.0.1:11434/api/generate',
  DEFAULT_MODEL: 'qwen2.5-coder-14b'
};

// Roles Estratégicos y Dinámicos para el Sistema EAR OS
export type EAR_ROLE = 
  | 'DIPLOMATICO' 
  | 'AYUNTAMIENTO' 
  | 'COORDINADOR_BODA' 
  | 'ARTISTA' 
  | 'GUEST';

export interface AuditResult {
  matchLabel: string;
  confidenceScore: number;
  frictionPoints: string[];
  recommendations: string[];
  nextSteps: string[];
}

/**
 * 🛰️ DETECCIÓN DINÁMICA DE MODELO
 */
const fetchActiveModel = async (): Promise<string> => {
  try {
    const response = await fetch(CONFIG.LM_STUDIO_MODELS);
    if (!response.ok) return "Modelo Desconocido";
    const data = await response.json();
    // LM Studio suele devolver el modelo cargado en la primera posición
    return data.data[0]?.id || "Modelo Desconocido";
  } catch {
    return "Offline / Fallback";
  }
};

/**
 * 🎭 SISTEMA DE PERSONAS BASADO EN MODELO Y ROL
 */
const getSystemPrompt = (modelName: string, role: EAR_ROLE = 'GUEST') => {
  let basePrompt = `Eres el Oráculo de Inteligencia Forense de EAR OS. 
  Model Activo: ${modelName}. 
  TONO: Silicon Valley High-End, Precisión Sonora, Humanity Radical.`;

  const roles: Record<EAR_ROLE, string> = {
    'DIPLOMATICO': 'Foco en protocolos, institucionalidad y excelencia diplomática. Eres un asesor de protocolo y atmósfera para embajadas.',
    'AYUNTAMIENTO': 'Foco en impacto social, optimización de recursos y eventos de gran escala para el ciudadano.',
    'COORDINADOR_BODA': 'Foco en los detalles, la emoción y la logística invisible. Eres el perfeccionismo nupcial personificado.',
    'ARTISTA': 'Foco en la soberanía creativa, monetización inmutable y la marca Hu-manizarte.',
    'GUEST': 'Foco en la exploración de las verticales EAR OS.'
  };

  return `${basePrompt}\n\nDIRECTRIZ DE ROL: ${roles[role]}`;
};

/**
 * Motor 1: LM STUDIO (OpenAI Format)
 */
const queryLMStudio = async (prompt: string, role: EAR_ROLE = 'ENTRY'): Promise<KnowledgeResponse | null> => {
  try {
    const model = await fetchActiveModel();
    const systemPrompt = getSystemPrompt(model, role);

    const response = await fetch(CONFIG.LM_STUDIO_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return {
      answer: data.choices[0].message.content,
      source: 'LM_STUDIO_LOCAL',
      model: model,
      confidence: 0.95
    };
  } catch { return null; }
};

/**
 * Motor 2: OLLAMA (Fallback)
 */
const queryOllama = async (prompt: string): Promise<KnowledgeResponse | null> => {
  try {
    const response = await fetch(CONFIG.OLLAMA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: CONFIG.DEFAULT_MODEL, prompt: prompt, stream: false }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return { answer: data.response, source: 'OLLAMA_LOCAL', confidence: 0.90, model: CONFIG.DEFAULT_MODEL };
  } catch { return null; }
};

export const earIntelligence = {
  query: async (prompt: string, role: EAR_ROLE = 'ENTRY'): Promise<KnowledgeResponse> => {
    console.log(`[EAR_INTEL] Routing with Role: ${role}...`);

    // 🛡️ PASO 1: LM Studio (DeepSeek R1 / Otros)
    const lmResult = await queryLMStudio(prompt, role);
    if (lmResult) return lmResult;

    // 🛡️ PASO 2: Ollama Fallback
    const ollamaResult = await queryOllama(prompt);
    if (ollamaResult) return ollamaResult;

    // 🛡️ PASO 3: Mock Fallback
    return { 
      answer: "Sistema operando en modo MOCK. Conecta LM Studio para activar el cerebro VIMUME.", 
      source: 'MOCK', 
      confidence: 0.5 
    };
  }
};


// ... existing imports
import { GoogleGenAI, Type } from "@google/genai";
import {
    AnalysisParameters,
    Persona,
    PersonaAnalysis,
    AllAnalysisResults,
    SynthesisResult,
    AIAssistantAction,
    CulturalAtlasResult,
    NarrativeResult,
    ValuePropositionResult,
    CounterArgumentResult,
    SWOTAnalysisResult,
    IkigaiInputs,
    ImpactNugget,
    KnowledgeCategory,
    UserProfileSummary,
    NextAction,
    PlaybookStep,
    UserRole,
    AnalysisResponse,
    CouncilSynthesis,
    MarketingCampaign,
    PsychometricQuestion,
    BudgetPredictionResult,
    PredictiveInsight,
    Project,
    CourseFormData,
    CourseArchitecture
} from '../types';
import { getPrompts, ASTRA_CORE_KERNEL } from '../locales/prompts';
import { despegueMethodologyDocument } from "../locales/despegueMethodologyDocument";
import { managerProfileDocument } from "../locales/managerProfileDocument";
import { projectManagerDocument } from "../locales/projectManagerDocument";
import { bookAuthorDocument } from "../locales/bookAuthorDocument";
import { strategicCommunicatorDocument } from "../locales/strategicCommunicatorDocument";
import { entrepreneurProfileDocument } from "../locales/entrepreneurProfileDocument";
import { telemetry } from "./telemetryService";
import { ragService } from "./ragService"; 

const getApiKey = () => {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
           process.env.GEMINI_API_KEY || 
           process.env.API_KEY || 
           "AIzaSyDummyClientSafeFallbackKey00000000";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

// --- UTILITIES (safeJSONParse, retryWithBackoff, getModel, getRoleContext) remain same ---
const safeJSONParse = <T>(jsonString: string, fallback: T): T => {
    if (!jsonString) return fallback;
    try {
        // Remove markdown code blocks if present
        let cleanedString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleanedString);
    } catch (error) {
        console.error("Failed to parse JSON:", error, "Raw string:", jsonString);
        telemetry.log('SYSTEM_ERROR', { error: 'JSON Parse Failure', raw: jsonString.substring(0, 100) }, 'WARNING');
        return fallback;
    }
};

async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
    contextName = 'Unknown Operation'
): Promise<T> {
    const startTime = Date.now();
    try {
        const result = await fn();
        telemetry.log('AI_REQUEST', { context: contextName, success: true }, 'INFO', Date.now() - startTime);
        return result;
    } catch (error: any) {
        const duration = Date.now() - startTime;
        const isQuotaError = error.message?.includes('429') || error.status === 429;
        
        telemetry.log('AI_REQUEST', { context: contextName, success: false, error: error.message }, isQuotaError ? 'WARNING' : 'CRITICAL', duration);

        if (retries === 0) {
            telemetry.log('SYSTEM_ERROR', { context: contextName, message: 'Max retries reached' }, 'CRITICAL');
            throw error;
        }
        
        const nextDelay = isQuotaError ? delay * 2 + (Math.random() * 1000) : delay * 2;
        console.warn(`API call failed (${contextName}). Retrying in ${Math.round(nextDelay)}ms... (${retries} retries left)`);
        
        await new Promise(resolve => setTimeout(resolve, nextDelay));
        return retryWithBackoff(fn, retries - 1, nextDelay, contextName);
    }
}

const getModel = (prioritizeSpeed: boolean): string => {
    return prioritizeSpeed ? 'gemini-2.5-flash' : 'gemini-2.5-pro';
};

const MUSIC_INDUSTRY_REALITY_CHECK = `
### DATOS DUROS DE LA INDUSTRIA MUSICAL (REFERENCIA)
1. LA ECUACIÃ“N DEL Ã‰XITO: Ã‰xito = Talento (20%) Ã— Estrategia (80%) Ã— Tiempo (5-10 aÃ±os).
2. SATURACIÃ“N: 99,000 canciones diarias. 87% < 1,000 plays.
3. SALUD MENTAL: 73% mÃºsicos sufren ansiedad por inestabilidad financiera.
4. COSTOS: InversiÃ³n inicial $20k-$40k.
`;

const getRoleContext = (role: UserRole): string => {
    switch (role) {
        case UserRole.ENTREPRENEUR:
            return `\n\n### DOCUMENTACIÃ“N TÃ‰CNICA: METODOLOGÃA DESPEGUE\n${entrepreneurProfileDocument}\n${despegueMethodologyDocument}`;
        case UserRole.ARTIST:
            return `\n\n### DOCUMENTACIÃ“N TÃ‰CNICA: REALIDAD MUSICAL\n${MUSIC_INDUSTRY_REALITY_CHECK}`;
        case UserRole.MANAGER:
            return `\n\n### DOCUMENTACIÃ“N TÃ‰CNICA: GESTIÃ“N Y NEGOCIO\n${managerProfileDocument}\n${MUSIC_INDUSTRY_REALITY_CHECK}`;
        case UserRole.PROJECT_MANAGER:
            return `\n\n### DOCUMENTACIÃ“N TÃ‰CNICA: GESTIÃ“N DE PROYECTOS\n${projectManagerDocument}`;
        case UserRole.BOOK_AUTHOR:
            return `\n\n### DOCUMENTACIÃ“N TÃ‰CNICA: INDUSTRIA EDITORIAL\n${bookAuthorDocument}`;
        case UserRole.STRATEGIC_COMMUNICATOR:
            return `\n\n### DOCUMENTACIÃ“N TÃ‰CNICA: COMUNICACIÃ“N ESTRATÃ‰GICA\n${strategicCommunicatorDocument}`;
        default:
            return "";
    }
};

// --- KNOWLEDGE ARCHITECT (NEW) ---
const COURSE_BUILDER_PROMPT = `
ActÃºa como un estratega de negocios de alto nivel y arquitecto de sistemas (Estilo Amplify/Velocity Media).
Tu objetivo NO es crear un "curso" acadÃ©mico estÃ¡ndar, sino diseÃ±ar una ARQUITECTURA ESTRATÃ‰GICA para dominar el tema indicado.

FILOSOFÃA Y TONO (ESTRICTO):
1.  **Enfoque Binario ("El Gran Divisor"):** El mercado se divide entre Arquitectos (piensan, construyen sistemas) y Operarios (usan herramientas, son reemplazables). Habla al Arquitecto.
2.  **Contrarian (A Contracorriente):** DesafÃ­a el sentido comÃºn superficial. (Ej: "La velocidad te estÃ¡ matando", "La eficiencia sin direcciÃ³n es ruido").
3.  **LÃ©xico Propietario:** Usa tÃ©rminos sofisticados.
    *   En lugar de "LecciÃ³n" usa "Protocolo TÃ¡ctico".
    *   En lugar de "TeorÃ­a" usa "Modelo Mental" o "Infraestructura de Contexto".
    *   En lugar de "BibliografÃ­a" usa "Cadena de Evidencia".
4.  **Storytelling HistÃ³rico:** Comienza las unidades con analogÃ­as histÃ³ricas, filosÃ³ficas o paradojas (Paradoja de Jevons, Efecto Cobra, Estoicismo) para validar el punto de negocio.
5.  **Menos es MÃ¡s:** SÃ© denso, directo y profundo. Evita el relleno corporativo.

ESTRUCTURA DE RESPUESTA JSON:
Devuelve un JSON VÃLIDO con esta estructura:
{
  "title": "TÃ­tulo de alto impacto (ej: 'IngenierÃ­a de [Tema]')",
  "subtitle": "SubtÃ­tulo que plantee una verdad incÃ³moda o una promesa de transformaciÃ³n identidad.",
  "level": "string",
  "durationText": "string",
  "objectives": ["string"],
  "units": [
    {
      "id": "1",
      "title": "Nombre de la Fase o Unidad (ej: 'Fase 1: DeconstrucciÃ³n')",
      "summary": "Resumen filosÃ³fico/estratÃ©gico.",
      "lessons": [
        {
          "id": "1.1",
          "title": "Nombre del Protocolo",
          "summary": "El 'gancho' intelectual.",
          "blocks": [
            {
              "type": "idea" | "ejemplo" | "actividad" | "test",
              "title": "string",
              "content": "string (Usa narrativa potente)",
              "question": { "q": "string", "options": ["string"], "answerIndex": number }
            }
          ]
        }
      ]
    }
  ],
  "finalEvaluation": [{ "q": "string", "options": ["string"], "answerIndex": number }],
  "finalProjects": [{ "title": "string", "description": "string" }],
  "sources": ["string"]
}

IMPORTANTE: Utiliza Google Search (Grounding) para encontrar ejemplos reales, estudios psicolÃ³gicos o casos histÃ³ricos que fundamenten la estrategia.
`;

export const generateCourseArchitecture = async (data: CourseFormData): Promise<CourseArchitecture> => {
    return retryWithBackoff<any>(async () => {
        const prompt = `
        ${COURSE_BUILDER_PROMPT}

        DATOS DEL PROTOCOLO:
        Tema Central: ${data.tema}
        Nivel: ${data.nivel}
        Perfil del Arquitecto (Usuario): ${data.perfil}
        Objetivo EstratÃ©gico: ${data.objetivo}
        RestricciÃ³n Temporal: ${data.tiempo}
        Formato: ${data.formato}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
            },
        });

        if (!response.text || '{}') throw new Error("No content generated");

        const parsedCourse = safeJSONParse<CourseArchitecture>(response.text || '{}', {} as CourseArchitecture);

        // Extract Grounding Metadata
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const groundingUrls = groundingChunks
            .map(chunk => chunk.web?.uri)
            .filter((uri): uri is string => !!uri);

        const allSources = Array.from(new Set([...(parsedCourse.sources || []), ...groundingUrls]));
        
        return {
            ...parsedCourse,
            sources: allSources
        };
    }, 2, 2000, 'Knowledge Architect Generation');
};

// ... existing functions (generatePredictiveAnalysis, generateBudgetPrediction, etc.)
export const generatePredictiveAnalysis = async (
    projects: Project[], 
    contextString: string, 
    language: string
): Promise<PredictiveInsight> => {
// ... rest of the file
    return retryWithBackoff<any>(async () => {
        // Prepare Context with Deep Knowledge
        const pmKnowledge = projectManagerDocument; // Using the heavy PM document
        const projectsSummary = projects.map(p => 
            `Proyecto: ${p.name}, Estado: ${p.status}, Presupuesto: ${p.presupuesto || 'N/A'}, Tareas: ${p.tasks?.length || 0}`
        ).join('\n');

        const prompt = `
        ACTÃšA COMO: Un Motor de Inteligencia Predictiva Empresarial (ActionCOACH + Project Manager Senior).
        
        CONTEXTO DE CONOCIMIENTO (Base de datos PM):
        ${pmKnowledge.substring(0, 3000)}... (Extracto clave sobre riesgos y planificaciÃ³n)

        DATOS DEL USUARIO:
        ${contextString}
        
        PROYECTOS ACTIVOS:
        ${projectsSummary}

        TU MISIÃ“N:
        1. Analiza los patrones de datos actuales.
        2. Detecta una "Fuga de EnergÃ­a/Dinero" o una "Oportunidad Oculta" basada en la teorÃ­a del Project Manager (ej. Scope Creep, falta de contratos, saturaciÃ³n de tareas).
        3. Predice el resultado si no se toma acciÃ³n.
        4. Genera una micro-acciÃ³n correctiva inmediata.

        Devuelve JSON estricto.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        trend: { type: Type.STRING, enum: ['POSITIVE', 'NEGATIVE', 'STABLE'] },
                        probability: { type: Type.NUMBER },
                        insight: { type: Type.STRING },
                        actionableTrigger: { type: Type.STRING },
                        focusArea: { type: Type.STRING, enum: ['FINANCE', 'TIMELINE', 'SCOPE', 'MARKET'] }
                    }
                }
            }
        });

        return safeJSONParse<PredictiveInsight>(response.text || '{}' || '{}', {
            trend: 'STABLE',
            probability: 50,
            insight: "Recopilando mÃ¡s datos para predicciÃ³n precisa.",
            actionableTrigger: "ContinÃºa registrando actividad.",
            focusArea: "TIMELINE"
        });
    }, 2, 2000, 'Predictive Engine Analysis');
};

// --- NEW FUNCTION ---
export const generateBudgetPrediction = async (amount: number, type: string, priorities: string, language: string): Promise<BudgetPredictionResult> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        
        // RAG Injection
        const ragMemory = ragService.getContext(`${type} budget finance cost`);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM] - DATOS FINANCIEROS PREVIOS\n${ragMemory}\n` : '';

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Use Pro for better math/logic reasoning
            contents: prompts.budgetPredictor.user(amount, type, priorities),
            config: {
                systemInstruction: prompts.budgetPredictor.system + ragBlock,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        totalBudget: { type: Type.NUMBER },
                        currency: { type: Type.STRING },
                        categories: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    percentage: { type: Type.NUMBER },
                                    amount: { type: Type.NUMBER },
                                    rationale: { type: Type.STRING },
                                    trendModifier: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] }
                                }
                            }
                        },
                        strategicInsight: { type: Type.STRING },
                        viabilityScore: { type: Type.NUMBER }
                    }
                }
            }
        });

        return safeJSONParse<BudgetPredictionResult>(response.text || '{}' || '{}', {
            totalBudget: amount,
            currency: 'EUR',
            categories: [],
            strategicInsight: "Error al generar el presupuesto.",
            viabilityScore: 0
        });
    }, 3, 1000, 'Budget Prediction');
};

export const generateAnalysis = async (
    params: AnalysisParameters,
    persona: Persona,
    language: string,
    dilemma: string,
    context: string,
    userRole: UserRole
): Promise<PersonaAnalysis> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const personaPrompt = prompts.personas[persona];
        const ragMemory = ragService.getContext(`${dilemma} ${context}`);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM] - HISTORIAL DEL USUARIO\nUtiliza estos datos para personalizar la respuesta:\n${ragMemory}\n` : '';
        const systemInstruction = `${personaPrompt}${getRoleContext(userRole)}${ragBlock}`;
        const model = getModel(params.prioritizeSpeed || false);
        
        let userMessage = `
            Dilema Central: "${dilemma}"
            Contexto Adicional: "${context || 'Ninguno'}"
            ---
            Basado en tu perfil y el marco estratÃ©gico obligatorio, analiza este dilema.
        `;
        if (params.analysisMode === 'COMPARATIVE') userMessage += `\nConsidera las siguientes opciones: ${params.options?.join(', ')}.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: userMessage,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysisResult: { type: Type.STRING },
                        scenarios: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    strategy: { type: Type.STRING },
                                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    potentialImpact: { type: Type.NUMBER },
                                    confidenceScore: { type: Type.NUMBER }
                                }
                            }
                        }
                    }
                },
            },
        });
        const analysis = safeJSONParse<Omit<PersonaAnalysis, 'error' | 'sources'>>(response.text || '{}', { analysisResult: "Error.", scenarios: [] });
        return { ...analysis, sources: [], error: null };
    }, 3, 1000, `Persona Analysis (${persona})`);
};

export const generateProaAnalysis = async (prompt: string): Promise<AnalysisResponse> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts('es');
        const ragMemory = ragService.getContext(prompt);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM]\n${ragMemory}\n` : '';
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                assumptionAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
                counterpoints: { type: Type.OBJECT, properties: { role: { type: Type.STRING }, points: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                reasoningTest: { type: Type.ARRAY, items: { type: Type.STRING } },
                alternativePerspectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                actionableRoadmap: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            },
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { systemInstruction: prompts.proa.system + ragBlock, responseMimeType: "application/json", responseSchema: responseSchema as any },
        });
        return safeJSONParse<AnalysisResponse>(response.text || '{}', {} as AnalysisResponse);
    }, 3, 1000, 'Proa Analysis');
};

export const generateMarketingContent = async (campaign: MarketingCampaign, prompt: string, language: string): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const ragMemory = ragService.getContext(`${campaign.nombre} ${campaign.descripcion} ${prompt}`);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM] - BRAND CONTEXT\n${ragMemory}\n` : '';
        const userMessage = prompts.marketingEngine.contentGeneration
            .replace('{campaignName}', campaign.nombre)
            .replace('{campaignDesc}', campaign.descripcion)
            .replace('{prompt}', prompt);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: { systemInstruction: prompts.marketingEngine.system + ragBlock },
        });
        return response.text || '{}';
    }, 3, 1000, 'Marketing Content');
};

export const generateProfileQuestions = async (language: string): Promise<PsychometricQuestion[]> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.strategicProfileGenerator.user,
            config: {
                systemInstruction: prompts.strategicProfileGenerator.system,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { text: { type: Type.STRING }, value: { type: Type.STRING } }
                                }
                            }
                        }
                    }
                }
            }
        });
        return safeJSONParse<PsychometricQuestion[]>(response.text || '{}', []);
    }, 3, 1000, 'Profile Questions');
};

export const generateDiscProfileAnalysis = async (answers: { [key: string]: number }, language: string): Promise<string> => {
    try {
        return await retryWithBackoff(async () => {
            const prompts = getPrompts(language);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', 
                contents: prompts.strategicProfileLab.user(answers),
                config: { systemInstruction: prompts.strategicProfileLab.system },
            });
            return response.text || '{}';
        }, 1, 2000, 'DISC Analysis (Pro)'); 
    } catch (error) {
        console.warn("Pro model failed, falling back to Flash for DISC analysis");
        return await retryWithBackoff(async () => {
             const prompts = getPrompts(language);
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: prompts.strategicProfileLab.user(answers),
                config: { systemInstruction: prompts.strategicProfileLab.system },
            });
            return response.text || '{}';
        }, 2, 1000, 'DISC Analysis (Flash)');
    }
};

export const generateCouncilSynthesis = async (dilemma: string, context: string, analyses: AllAnalysisResults, language: string): Promise<CouncilSynthesis> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const ragMemory = ragService.getContext(`${dilemma} ${context}`);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM]\n${ragMemory}\n` : '';
        const analysesText = Object.entries(analyses).map(([persona, analysis]) => {
            return `Advisor: ${persona}\nInput: ${analysis?.analysisResult || 'No output'}\n`;
        }).join('\n---\n');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompts.councilSynthesis.user(dilemma, context, analysesText),
            config: {
                systemInstruction: prompts.councilSynthesis.system + ragBlock,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        verdict: { type: Type.STRING },
                        executiveSummary: { type: Type.STRING },
                        unifiedStrategy: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, keySteps: { type: Type.ARRAY, items: { type: Type.STRING } } } },
                        riskMitigationPlan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { risk: { type: Type.STRING }, mitigation: { type: Type.STRING } } } },
                        consensusLevel: { type: Type.NUMBER },
                        dissentingVoices: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return safeJSONParse<CouncilSynthesis>(response.text || '{}', { 
            verdict: "Error", 
            executiveSummary: "", 
            unifiedStrategy: { title: "", description: "", keySteps: [] }, 
            riskMitigationPlan: [], 
            consensusLevel: 0, 
            dissentingVoices: [],
            strategicRecommendation: { strategy: "Error", justification: "Error", confidence: 0 },
            risks: []
        });
    }, 3, 1000, 'Council Synthesis');
};

export const generateAIAssistantResponse = async (text: string, action: AIAssistantAction, language: string): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const ragMemory = ragService.getContext(text);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM]\n${ragMemory}\n` : '';
        let userMessage = '';
        switch (action) {
            case AIAssistantAction.SUMMARIZE: userMessage = prompts.ai_assistant.summarize; break;
            case AIAssistantAction.EXTRACT_KEY_POINTS: userMessage = prompts.ai_assistant.extract; break;
            case AIAssistantAction.GENERATE_SOCIAL_POST: userMessage = prompts.ai_assistant.social; break;
        }
        userMessage += `\n\n--- TEXTO A PROCESAR ---\n${text}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: { systemInstruction: prompts.ai_assistant.system + ragBlock },
        });
        return response.text || '{}';
    }, 3, 1000, 'AI Assistant');
};

export const generateCulturalTrends = async (language: string): Promise<CulturalAtlasResult> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.atlasCultural.user,
            config: {
                systemInstruction: prompts.atlasCultural.system,
                responseMimeType: "application/json",
            }
        });
        return safeJSONParse(response.text || '{}', { visualTrends: [], sonicTrends: [], conceptualTrends: [] });
    }, 3, 1000, 'Cultural Atlas');
};

export const enhanceTextWithAI = async (text: string, language: string): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.textEnhancer.user.replace('{text}', text),
            config: { systemInstruction: prompts.textEnhancer.system },
        });
        return response.text || '{}';
    }, 3, 1000, 'Text Enhancer');
};

export const generateNarrative = async (elements: string, language: string): Promise<NarrativeResult> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompts.narrativeBuilder.user.replace('{elements}', elements),
            config: {
                systemInstruction: prompts.narrativeBuilder.system,
                responseMimeType: "application/json",
            }
        });
        return safeJSONParse(response.text || '{}', { narrativeTitle: '', biography: '', manifesto: '', interviewTips: [], simulatedAudienceReaction: '' });
    }, 3, 1000, 'Narrative Builder');
};

export const generateValueProposition = async (product: string, stakeholder: string, value: string, language: string): Promise<ValuePropositionResult> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const userMessage = prompts.valueProposition.user.replace('{product}', product).replace('{stakeholder}', stakeholder).replace('{value}', value);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: { systemInstruction: prompts.valueProposition.system, responseMimeType: "application/json" }
        });
        return safeJSONParse(response.text || '{}', { title: '', stakeholder: '', problem: '', solution: '', benefits: [], differentiation: '' });
    }, 3, 1000, 'Value Proposition');
};

export const generateExtremeAudit = async (directive: string, language: string): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompts.extremeAudit.user.replace('{directive}', directive),
            config: { systemInstruction: prompts.extremeAudit.system },
        });
        return response.text || '{}';
    }, 3, 1000, 'Extreme Audit');
};

export const generateCounterArgument = async (strategy: string, language: string): Promise<CounterArgumentResult> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompts.robustnessLab.user.replace('{strategy}', strategy),
            config: { systemInstruction: prompts.robustnessLab.system },
        });
        return { counterArgument: response.text || '{}' };
    }, 3, 1000, 'Robustness Lab');
};

export const generateSWOTAnalysis = async (strengths: string, weaknesses: string, opportunities: string, threats: string, language: string): Promise<SWOTAnalysisResult> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const userMessage = prompts.swotAnalysis.user.replace('{strengths}', strengths).replace('{weaknesses}', weaknesses).replace('{opportunities}', opportunities).replace('{threats}', threats);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: { systemInstruction: prompts.swotAnalysis.system, responseMimeType: 'application/json' }
        });
        return safeJSONParse(response.text || '{}', { conclusions: { maintain: [], exploit: [], correct: [], confront: [] } });
    }, 3, 1000, 'SWOT Analysis');
};

export const generateIkigaiResponse = async (inputs: IkigaiInputs, language: string, userRole: UserRole = UserRole.ARTIST): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        // Inject role context and RAG for better personalization
        const ragMemory = ragService.getContext("ikigai purpose career");
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM] - HISTORIAL\n${ragMemory}\n` : '';
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompts.ikigai.user(inputs),
            config: { 
                systemInstruction: prompts.ikigai.system(userRole) + ragBlock 
            }
        });
        return response.text || '{}';
    }, 3, 1000, 'Ikigai');
};

export const generateWheelOfLifeSynthesis = async (scores: Record<string, number>, reflections: Record<string, string>, language: string): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompts.wheelOfLife.synthesis.user(scores, reflections),
            config: { systemInstruction: prompts.wheelOfLife.synthesis.system },
        });
        return response.text || '{}';
    }, 3, 1000, 'Wheel of Life Synthesis');
};

export const generateStrategicPlaybook = async (synthesis: string, language: string): Promise<PlaybookStep[]> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompts.strategicPlaybookGenerator.user(synthesis),
            config: { systemInstruction: prompts.strategicPlaybookGenerator.system, responseMimeType: 'application/json' }
        });
        return safeJSONParse(response.text || '{}', []);
    }, 3, 1000, 'Strategic Playbook');
};

export const generateVisionBoardImage = async (prompt: string): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages?.[0]?.image?.imageBytes || '';
        }
        throw new Error('Image generation failed.');
    }, 3, 1000, 'Vision Board Image');
};

export const extractWisdomNuggets = async (reflection: string, language: string): Promise<ImpactNugget[]> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.wisdomNuggetExtractor.user.replace('{reflection}', reflection),
            config: { systemInstruction: prompts.wisdomNuggetExtractor.system, responseMimeType: 'application/json' }
        });
        return safeJSONParse(response.text || '{}', []);
    }, 3, 1000, 'Wisdom Nuggets');
};

export const generateFollowUp = async (prompt: string, persona: string, contextMessage: string, language: string): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const userMessage = `Regarding your statement: "${contextMessage}"\n\nMy follow-up question is: "${prompt}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: { systemInstruction: `You are ${persona}. Respond to the follow-up question concisely and directly in Spanish.`}
        });
        return response.text || '{}';
    }, 3, 1000, 'Deliberation Follow-up');
};

export const generateNextStepSuggestions = async (analysis: string, language: string): Promise<string[]> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const userMessage = prompts.nextStepSuggester.user.replace('{analysis}', analysis);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: { systemInstruction: prompts.nextStepSuggester.system, responseMimeType: 'application/json' }
        });
        const parsed = safeJSONParse<{ suggestions: string[] }>(response.text || '{}', { suggestions: [] });
        return parsed.suggestions;
    }, 3, 1000, 'Next Step Suggestions');
};

export const generateUserProfileSummary = async (context: string, language: string, userRole: UserRole): Promise<UserProfileSummary> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const ragMemory = ragService.getContext(context);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM]\n${ragMemory}\n` : '';
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.userProfileSynthesizer.user(context),
            config: { systemInstruction: prompts.userProfileSynthesizer.system(userRole) + ragBlock },
        });
        return { narrative: response.text || '{}' };
    }, 3, 1000, 'User Profile Summary');
};

export const generateStrategicInsight = async (context: string, userProfile: UserProfileSummary, language: string, userRole: UserRole): Promise<string> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const ragMemory = ragService.getContext(context);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM]\n${ragMemory}\n` : '';
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.strategicObserver.user(context, userProfile.narrative),
            config: { systemInstruction: prompts.strategicObserver.system(userRole) + ragBlock },
        });
        return response.text || '{}';
    }, 3, 1000, 'Strategic Insight');
};

export const generateNextAction = async (context: string, userProfile: UserProfileSummary, language: string, userRole: UserRole): Promise<NextAction> => {
    return retryWithBackoff<any>(async () => {
        const prompts = getPrompts(language);
        const ragMemory = ragService.getContext(context);
        const ragBlock = ragMemory ? `\n\n### [RAG MEMORY STREAM]\n${ragMemory}\n` : '';
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts.strategicPartner.user(context, userProfile.narrative),
            config: { systemInstruction: prompts.strategicPartner.system(userRole) + ragBlock, responseMimeType: "application/json" },
        });
        return safeJSONParse(response.text || '{}', { action: "Error", toolId: '', reasoning: '' });
    }, 3, 1000, 'Next Best Action');
};

export const generateProfileAlternatives = async () => [];
export const refineProfileWithFeedback = async () => ({ narrative: '' });
export const generateNextActionAlternatives = async () => [];

export async function* streamGeminiResponse(prompt: string) {
    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7
            }
        });
        for await (const chunk of response) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("AI Streaming Error:", error);
        yield " Error de conexiÃ³n con Astra AI.";
    }
}
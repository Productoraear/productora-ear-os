"use client";

import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfileSummary, AIAssistantAction, UserRole, Persona, Scenario, SynthesisResult } from '../types';

let genAIClient: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY)) || '';
  if (apiKey) {
    try {
      genAIClient = new GoogleGenerativeAI(apiKey);
    } catch (e) {
      console.warn('Failed to initialize GoogleGenerativeAI client', e);
    }
  }
  return genAIClient;
}

export async function generateUserProfileSummary(
  contextString: string,
  language: string = 'en',
  userRole?: UserRole | null
): Promise<UserProfileSummary> {
  const ai = getGenAI();
  if (ai) {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json', temperature: 0.7 } });
      const prompt = `You are the core intelligence of Astra OS, a strategic decision platform.
Generate a concise, inspiring, and sharp strategic user profile summary based on the following role and context:
Role: ${userRole || 'Strategic Professional'}
Context: ${contextString}
Language: ${language}

Return a JSON object matching this exact structure:
{
  "narrative": "A 2-3 sentence executive assessment of their strategic trajectory and focus",
  "archetype": "A title archetype (e.g., The Visionary Architect, The Pragmatic Scaler, The Narrative Alchemist)",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"]
}`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (e) {
      console.warn('Gemini generateUserProfileSummary failed, falling back to local heuristic', e);
    }
  }

  // Fallback profile summary
  const roleTitle = userRole ? userRole.replace('_', ' ') : 'STRATEGIC LEADER';
  return {
    narrative: language === 'es'
      ? `Operando en el epicentro de la estrategia como ${roleTitle}, impulsando iniciativas de alto impacto y calibrando decisiones críticas en tiempo real.`
      : `Operating at the focal nexus of strategic leadership as ${roleTitle}, orchestrating high-leverage initiatives and navigating market opportunities with systematic discipline.`,
    archetype: language === 'es' ? 'Arquitecto Estratégico' : 'The Strategic Architect',
    keyStrengths: language === 'es' 
      ? ['Pensamiento de Primeros Principios', 'Mitigación de Riesgos Sistémicos', 'Alineación de Stakeholders']
      : ['First-Principles Reasoning', 'Systemic Risk Mitigation', 'Multi-Stakeholder Alignment']
  };
}

export async function generateAIAssistantResponse(
  text: string,
  action?: AIAssistantAction | string,
  language: string = 'en'
): Promise<string> {
  const ai = getGenAI();
  if (ai) {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { temperature: 0.6 } });
      const prompt = `You are Astra AI, the elite executive strategic copilot.
User Query / Text: "${text}"
Action Intent: ${action || 'ADVISE'}
Language: ${language}

Provide a structured, insightful, high-density strategic answer with clear bullet points, risk identification, and concrete next actions.`;

      const response = await model.generateContent(prompt);
      const outputText = response.response.text();
      if (outputText) {
        return outputText;
      }
    } catch (e) {
      console.warn('Gemini generateAIAssistantResponse fallback', e);
    }
  }

  if (action === AIAssistantAction.SUMMARIZE || action === 'SUMMARIZE') {
    return language === 'es'
      ? `### Resumen Ejecutivo Estratégico\n- **Objetivo Central**: Clarificación de objetivos y alineación de recursos clave.\n- **Palancas de Valor**: Enfoque en diferenciación competitiva y captura de valor no lineal.\n- **Puntos de Fricción**: Monitoreo de contingencias operativas y asignación de presupuesto.`
      : `### Executive Strategic Summary\n- **Core Objective**: Sharp objective alignment and asymmetric resource allocation.\n- **Value Levers**: Direct focus on defensible differentiation and non-linear upside capture.\n- **Friction Points**: Mitigating execution drag and preserving capital efficiency.`;
  } else if (action === AIAssistantAction.EXTRACT_KEY_POINTS || action === 'EXTRACT_KEY_POINTS') {
    return language === 'es'
      ? `### Puntos Clave & Hallazgos\n1. **Ventaja Competitiva**: Aprovechamiento de barreras de entrada únicas.\n2. **Mitigación**: Protección legal y contractual previa a la fase de escalado.\n3. **Próximo Paso**: Validación de demanda con micro-experimento en 14 días.`
      : `### Strategic Key Takeaways\n1. **Competitive Moat**: Capitalizing on proprietary positioning and unique distribution.\n2. **Risk Barrier**: Contractual & IP safeguards prior to scale expansion.\n3. **Next Step**: Rapid micro-validation experiment within 14 execution days.`;
  } else if (action === AIAssistantAction.GENERATE_SOCIAL_POST || action === 'GENERATE_SOCIAL_POST') {
    return `🚀 Strategic Update: Navigating the next frontier of growth through deliberate execution and relentless focus on value creation. #Strategy #Leadership #AstraOS`;
  }

  return language === 'es'
    ? `### Recomendación Estratégica Astra\n\nAnalizando la consulta bajo una perspectiva de valor compuesta:\n\n1. **Diagnóstico**: Identifica el cuello de botella más restrictivo antes de comprometer capital.\n2. **Hipótesis de Prueba**: Define métricas claras de éxito y criterios de parada rápida.\n3. **Plan de Acción**: Ejecuta con cadencias de revisión semanal para ajustar dirección sin perder inercia.`
    : `### Astra Strategic Advisory\n\nAnalyzing the dilemma through compound value lenses:\n\n1. **Diagnosis**: Identify the single binding constraint before deploying substantial capital.\n2. **Test Hypothesis**: Establish quantifiable validation metrics and early-kill thresholds.\n3. **Action Cadence**: Execute with weekly review loops to pivot dynamically while preserving forward momentum.`;
}

export async function generatePersonaDebate(
  problem: string,
  persona: Persona,
  language: string = 'en'
): Promise<{ analysis: string; scenarios: Scenario[] }> {
  const ai = getGenAI();
  if (ai) {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json', temperature: 0.7 } });
      const prompt = `You are embodying the persona: ${persona} in a strategic council.
Problem / Strategic Dilemma: "${problem}"
Language: ${language}

Provide your expert analysis, 2 distinct tactical scenarios with pros, cons, potential impact (1-10), and confidence score (1-10).
Return valid JSON:
{
  "analysis": "Your rigorous persona critique and strategic stance...",
  "scenarios": [
    {
      "strategy": "Scenario Title",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "potentialImpact": 8,
      "confidenceScore": 9
    }
  ]
}`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (e) {
      console.warn('Persona debate generation failed', e);
    }
  }

  return {
    analysis: `As ${persona.replace('_', ' ')}, the critical factor is maintaining asymmetric upside while strictly bounding tail risks. We must evaluate customer sentiment and structural sustainability.`,
    scenarios: [
      {
        strategy: 'High-Conviction Focused Rollout',
        pros: ['Maximizes speed-to-market', 'Direct feedback loop'],
        cons: ['Higher upfront resource dedication'],
        potentialImpact: 9,
        confidenceScore: 8
      },
      {
        strategy: 'Staged Milestone Gateways',
        pros: ['Limits downside exposure', 'Iterative calibration'],
        cons: ['Slower initial market penetration'],
        potentialImpact: 7,
        confidenceScore: 9
      }
    ]
  };
}

export const ASTRA_CORE_KERNEL = `Eres ASTRA, el Motor Estratégico Neural de Productora EAR.
Tu misión es transformar artistas en empresarios de alto rendimiento.
Actúa con la autoridad de un consultor de Silicon Valley y la sensibilidad de un manager de élite.`;

export const getPrompts = (role: string) => {
  const basePrompts = {
    system: ASTRA_CORE_KERNEL,
    role_context: `Estás asesorando a un ${role}.`,
    budgetPredictor: {
      system: "Experto en finanzas.",
      user: (amount: any, type: any, priorities: any) => `Analiza presupuesto: ${amount}€.`
    },
    proa: { system: "Sistema PROA activo." },
    marketingEngine: {
      system: "Motor de marketing activo.",
      contentGeneration: "Genera contenido."
    },
    strategicProfileGenerator: {
      system: "Generador de perfiles activo.",
      user: "Analiza perfil."
    },
    strategicProfileLab: {
      system: "Laboratorio estratégico activo.",
      user: (answers: any) => `Analiza: ${JSON.stringify(answers)}`
    },
    councilSynthesis: {
      system: "Sintetizador activo.",
      user: (d: any, c: any, a: any) => `Dilema: ${d}.`
    },
    ai_assistant: {
      system: "Asistente activo.",
      summarize: "Resume.", extract: "Extrae.", social: "Post."
    },
    atlasCultural: { system: "Atlas activo.", user: "Análisis." },
    textEnhancer: { system: "Optimizador activo.", user: "Optimiza: {text}" },
    narrativeBuilder: {
      system: "Eres el Arquitecto Narrativo. Crea historias de marca poderosas.",
      user: "Construye una narrativa con estos elementos: {elements}"
    },
    personas: {
      CREATIVE_ORACLE: "Oráculo.",
      BRAND_ARCHITECT: "Arquitecto.",
      TREASURY_GUARDIAN: "Guardián.",
      MARKET_CONQUEROR: "Conquistador."
    } as Record<string, string>
  };

  // Truco S-Class Final: Retornamos un Proxy que evita errores por propiedades faltantes
  return new Proxy(basePrompts, {
    get: (target: any, prop: string) => {
      if (prop in target) return target[prop];
      return { system: "Módulo activo.", user: "Instrucción genérica." };
    }
  });
};
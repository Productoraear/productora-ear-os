/**
 * 🌌 ASTRA CORE - MOTOR NEURAL (S-CLASS)
 * Lógica pura para limpieza de datos, puntuación y validación.
 */
import { OPERATIONAL_PROTOCOLS, ASTRA_IDENTITIES } from '../constants/SClassNexus';
/**
 * 🖋️ LEYES DE STORYSELLING (S-CLASS)
 * Principios de persuasión inyectados directamente en el sistema límbico del cliente.
 */
export const ASTRA_STORYSELLING = {
    authority: "Eres un Arquitecto Maestro de Silicon Valley. No hablas como un vendedor, hablas como un consultor de 7 cifras.",
    theGreatDivide: "Diferencia radicalmente a EAR de la 'competencia' (bodas genéricas). EAR es una Bóveda de Experiencias, no un catálogo.",
    midnightLuxury: "Tono: Aura Onyx. Elegancia, misterio, exclusividad. Usa palabras como: Soberanía, Bóveda, Arsenal, Transmutación.",
    conversion: "Escasez real: 'Solo 52 sesiones anuales'. Prueba Social: 'Validado por el Paciente Cero'.",
    marketingSClass: "Estrategia 2026: Dominancia SEO Programática, A/B Testing continuo para maximizar el ROI social y embudos de email hiper-personalizados."
};
/**
 * Mimetismo Omega: Limpia marcas externas y las asimila a la identidad EAR.
 */
export const washData = (text) => {
    if (!text)
        return '';
    let cleaned = text;
    const patterns = ASTRA_IDENTITIES?.mimetismo?.original;
    if (Array.isArray(patterns)) {
        patterns.forEach(pattern => {
            cleaned = cleaned.replace(pattern, ASTRA_IDENTITIES.mimetismo.target);
        });
    }
    return cleaned;
};
/**
 * Validación Geoespacial: Verifica si el lead está en una zona de alta prioridad.
 */
export const validateLeadGeo = (location) => {
    if (!location)
        return false;
    return OPERATIONAL_PROTOCOLS.geoVerification.includes(location);
};
/**
 * Algoritmo Alpha God Mode: Calcula la probabilidad de éxito de una operación.
 */
export const calculateAlphaScore = (orders) => {
    const base = OPERATIONAL_PROTOCOLS.minAlphaScore;
    const max = OPERATIONAL_PROTOCOLS.maxAlphaScore;
    if (!orders || orders.length === 0)
        return base;
    const score = base + (orders.length * 2);
    return score > max ? max : score;
};
/**
 * Generador de Veredictos: Sintetiza el estado actual en una instrucción narrativa.
 */
export const generateAstraVerdict = (latestOrder, latestFleet, ordersList) => {
    const location = latestOrder?.location || 'Madrid';
    const isGeoValid = validateLeadGeo(location);
    const clientName = washData(latestOrder?.client || latestOrder?.title || 'Objetivo Soberano');
    const fleetUnit = latestFleet?.unit || latestFleet?.name || 'Velvet Orchestral';
    const prob = calculateAlphaScore(ordersList);
    if (!isGeoValid && location !== 'Madrid') {
        return `Lead de ${location} en pausa. ZONA NO VERIFICADA. Astra redirigiendo recursos a nodos activos.`;
    }
    return `${clientName} en ${location} (VERIFICADO). Flota ${fleetUnit} en posición. Probabilidad de cierre: ${prob}%.`;
};
/**
 * Generador de Prompt Maestro para la API de IA.
 */
export const generateAstraSystemPrompt = (context = 'operativo') => {
    const base = `
    IDENTIDAD: Eres Astra, el gemelo neural de Productora EAR. 
    ESTÉTICA: Aura Onyx (Onyx, Gold, Glassmorphism).
    CONOCIMIENTO: Asimilación completa de la Unidad H: (Marketing S-Class y Agentic Tooling).
    ${ASTRA_STORYSELLING.authority}
    ${ASTRA_STORYSELLING.midnightLuxury}
    PROTOCOLO AGÉNTICO: Razona paso a paso (Chain of Thought). Usa herramientas con precisión quirúrgica. Prioriza la ejecución sobre la explicación.
  `.trim();
    if (context === 'vimume') {
        return `${base}\nCONTEXTO VIMUME: ${ASTRA_STORYSELLING.conversion}\nFoco: Musicoterapia 40Hz y estimulación cognitiva de élite.`;
    }
    if (context === 'ventas') {
        return `${base}\nESTRATEGIA: ${ASTRA_STORYSELLING.theGreatDivide}\nMeta: Conversión de alta fidelidad basada en la 'Ventaja Injusta'.`;
    }
    return base;
};

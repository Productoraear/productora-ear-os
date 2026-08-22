/**
 * 🧼 WASH DATA - EL FILTRO DE PUREZA S-CLASS
 * Propósito: Eliminar cualquier rastro de branding de competidores (Bodas.net, Zankyou, etc.)
 * y normalizar el lenguaje hacia el ecosistema soberano EAR.
 */
export const washData = (input) => {
    if (!input)
        return "";
    let clean = input;
    // 1. ELIMINACIÓN DE BRANDING EXTERNO (Vampirización Atómica)
    const competitors = [
        /bodas\.net/gi,
        /zankyou/gi,
        /matrimonios\.cl/gi,
        /weddingwire/gi,
        /casamientos\.com\.ar/gi
    ];
    competitors.forEach(regex => {
        clean = clean.replace(regex, "EAR Network");
    });
    // 2. NORMALIZACIÓN TÁCTICA
    // Transformamos términos genéricos en terminología S-Class
    const dictionary = {
        "proveedor": "Activo Táctico",
        "cliente": "Soberano",
        "boda": "Evento de Alta Fidelidad",
        "presupuesto": "Inversión Estratégica",
        "contacto": "Enlace de Inteligencia"
    };
    Object.entries(dictionary).forEach(([key, val]) => {
        const regex = new RegExp(key, 'gi');
        clean = clean.replace(regex, val);
    });
    // 3. LIMPIEZA DE DOM & ARTEFACTOS DE SCRAPING
    clean = clean.replace(/<[^>]*>?/gm, ''); // Eliminar HTML residual
    clean = clean.trim();
    return clean;
};
/**
 * Procesa un objeto completo de inteligencia.
 */
export const washIntelObject = (obj) => {
    if (typeof obj !== 'object' || obj === null)
        return obj;
    const washed = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            washed[key] = washData(obj[key]);
        }
        else if (typeof obj[key] === 'object') {
            washed[key] = washIntelObject(obj[key]);
        }
        else {
            washed[key] = obj[key];
        }
    }
    return washed;
};

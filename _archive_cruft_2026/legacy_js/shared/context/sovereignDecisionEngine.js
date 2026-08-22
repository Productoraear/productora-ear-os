/**
 * SOVEREIGN DECISION ENGINE - V128.2
 * Transforma señales en decisiones estratégicas de UI.
 */
export const deriveIntentClass = (context, query) => {
    const q = query?.toLowerCase() || "";
    // B2G Detection (Gobernanza e Institucional)
    const b2gKeywords = ['ayuntamiento', 'licitacion', 'pliego', 'ayto', 'diputacion', 'municipal', 'festejos', 'protocolo'];
    if (b2gKeywords.some(kw => q.includes(kw)))
        return "B2G_HIGH";
    // B2B Detection (Corporativo y Premium)
    const b2bKeywords = ['corporativo', 'empresa', 'vip', 'premium', 'booking', 'cache', 'contratacion', 'mariachis'];
    if (b2bKeywords.some(kw => q.includes(kw)))
        return "B2B_HIGH";
    // Qualified Interest
    if (context.lastSearches.length > 2 || context.intentScore > 50)
        return "QUALIFIED";
    return "GENERIC";
};
export const deriveHeroVariant = (context, route) => {
    const r = route.toLowerCase();
    if (r.includes('mundial-2026') || r.includes('world-cup'))
        return "WORLD_CUP_2026";
    if (context.intentClass === "B2G_HIGH")
        return "INSTITUTIONAL";
    if (context.lastNiches.includes('mariachis') || context.intentClass === "B2B_HIGH")
        return "EDWIN_AGUDELO";
    return "DEFAULT";
};
export const deriveCatalogMode = (context) => {
    // Siempre priorizamos abundancia (HYBRID) para no romper percepción de escala
    if (context.intentScore > 80)
        return "PRECISION";
    if (context.intentScore > 30)
        return "HYBRID";
    return "ABUNDANCE";
};
export const calculateIntentScore = (context, newQuery) => {
    let score = context.intentScore || 0;
    if (newQuery)
        score += 10;
    if (context.lastRoutes.length > 3)
        score += 20;
    if (context.lastProvinces.length > 1)
        score += 15;
    return Math.min(score, 100);
};

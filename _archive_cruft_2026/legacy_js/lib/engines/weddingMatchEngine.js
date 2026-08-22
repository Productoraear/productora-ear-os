/**
 * EAR Wedding Match Engine v2.0
 * Motor de Scoring Multi-Variable para Matching Inteligente de Proveedores
 */
const MATCH_WEIGHTS = {
    aura: 0.30,
    budget: 0.25,
    proximity: 0.15,
    rating: 0.15,
    availability: 0.10,
    responseSpeed: 0.05,
};
const MAX_RESULTS_PER_CATEGORY = 3;
const AURA_CLIMAX_COMPAT = {
    elite_luxury: ['elegancia_eterna'],
    boutique_intimate: ['elegancia_eterna', 'disrupcion_cool'],
    modern_hightech: ['efecto_festival', 'disrupcion_cool'],
    fiesta_salvaje: ['efecto_festival'],
};
const BUDGET_DISTRIBUTION = {
    MUSICA_LIVE: 0.15,
    DJ: 0.08,
    MARIACHI: 0.12,
    FOTOGRAFIA: 0.18,
    VIDEO: 0.12,
    CATERING: 0.30,
    DECORACION: 0.10,
    ILUMINACION: 0.05,
    WEDDING_PLANNER: 0.15,
};
function calculateAuraScore(provider, prefs) {
    let score = 0;
    if (provider.auraFit.includes(prefs.aura))
        score += 70;
    const compatibleClimaxes = AURA_CLIMAX_COMPAT[prefs.aura] || [];
    const climaxMatch = provider.climaxFit.some(c => compatibleClimaxes.includes(c));
    if (climaxMatch)
        score += 20;
    if (provider.climaxFit.includes(prefs.climax))
        score += 10;
    return Math.min(100, score);
}
function calculateBudgetScore(provider, prefs) {
    const weight = BUDGET_DISTRIBUTION[provider.category] || 0.10;
    const categoryBudget = prefs.budget * weight;
    const avgPrice = (provider.priceRange.min + provider.priceRange.max) / 2;
    if (avgPrice <= categoryBudget * 0.5)
        return 60 + (avgPrice / (categoryBudget * 0.5)) * 20;
    if (avgPrice <= categoryBudget)
        return 80 + (1 - (avgPrice / categoryBudget)) * 20;
    if (avgPrice <= categoryBudget * 1.3) {
        const overage = (avgPrice - categoryBudget) / (categoryBudget * 0.3);
        return 80 - (overage * 30);
    }
    const excess = avgPrice / categoryBudget;
    return Math.max(0, 50 - (excess - 1.3) * 100);
}
function calculateProximityScore(provider, prefs) {
    const city = prefs.city.toLowerCase().trim();
    if (provider.territory.some(t => t.toLowerCase().trim() === city))
        return 100;
    const REGIONS = {
        'centro': ['madrid', 'toledo', 'guadalajara', 'segovia', 'ávila', 'cuenca'],
        'sur': ['sevilla', 'málaga', 'cádiz', 'córdoba', 'granada', 'marbella', 'huelva', 'jaén'],
        'levante': ['valencia', 'alicante', 'murcia', 'castellón'],
        'noreste': ['barcelona', 'tarragona', 'girona', 'lleida'],
        'norte': ['bilbao', 'san sebastián', 'santander', 'oviedo', 'vitoria'],
    };
    for (const [, cities] of Object.entries(REGIONS)) {
        if (cities.includes(city) && provider.territory.some(t => cities.includes(t.toLowerCase().trim()))) {
            return 70;
        }
    }
    return 30;
}
function calculateRatingScore(provider) {
    const ratingComponent = (provider.rating / 5) * 70;
    const experienceComponent = Math.min(30, provider.totalEvents * 0.5);
    return Math.min(100, ratingComponent + experienceComponent);
}
function calculateAvailabilityScore(provider, prefs) {
    if (!provider.availability || provider.availability.length === 0)
        return 50;
    return provider.availability.includes(prefs.date) ? 100 : 0;
}
function calculateResponseSpeedScore(provider) {
    if (provider.responseTimeHours <= 1)
        return 100;
    if (provider.responseTimeHours <= 4)
        return 85;
    if (provider.responseTimeHours <= 12)
        return 70;
    if (provider.responseTimeHours <= 24)
        return 50;
    if (provider.responseTimeHours <= 48)
        return 25;
    return 10;
}
function generateMatchReason(provider, breakdown, prefs) {
    const reasons = [];
    if (breakdown.auraScore >= 80)
        reasons.push(`Encaja perfectamente con tu Aura "${prefs.aura.replace(/_/g, ' ')}"`);
    if (breakdown.ratingScore >= 80)
        reasons.push(`${provider.rating}★ en ${provider.totalEvents} eventos`);
    if (breakdown.proximityScore >= 70)
        reasons.push(`Disponible en tu zona`);
    if (breakdown.budgetScore >= 80)
        reasons.push(`Dentro de tu presupuesto`);
    if (breakdown.responseSpeedScore >= 85)
        reasons.push(`Respuesta en menos de 4h`);
    return reasons.join(' · ') || 'Match recomendado por ASTRA';
}
function estimatePrice(provider, prefs) {
    const base = (provider.priceRange.min + provider.priceRange.max) / 2;
    const dateObj = new Date(prefs.date);
    const isSaturday = dateObj.getDay() === 6;
    const isHighSeason = dateObj.getMonth() >= 4 && dateObj.getMonth() <= 9;
    const datePremium = (isSaturday ? 1.1 : 1) * (isHighSeason ? 1.1 : 1);
    const guestPremium = prefs.guestCount > 150 ? 1.1 : 1;
    const venuePremium = prefs.venueType === 'outdoor' ? 1.05 : 1;
    return Math.round(base * datePremium * guestPremium * venuePremium);
}
export function runMatchEngine(preferences, providers) {
    const resultsByCategory = new Map();
    const providersByCategory = new Map();
    for (const provider of providers) {
        const list = providersByCategory.get(provider.category) || [];
        list.push(provider);
        providersByCategory.set(provider.category, list);
    }
    for (const [category, categoryProviders] of providersByCategory) {
        const scored = categoryProviders.map(provider => {
            const auraScore = calculateAuraScore(provider, preferences);
            const budgetScore = calculateBudgetScore(provider, preferences);
            const proximityScore = calculateProximityScore(provider, preferences);
            const ratingScore = calculateRatingScore(provider);
            const availabilityScore = calculateAvailabilityScore(provider, preferences);
            const responseSpeedScore = calculateResponseSpeedScore(provider);
            const breakdown = {
                auraScore, budgetScore, proximityScore, ratingScore, availabilityScore, responseSpeedScore,
                weights: MATCH_WEIGHTS,
            };
            const totalScore = Math.round(auraScore * MATCH_WEIGHTS.aura +
                budgetScore * MATCH_WEIGHTS.budget +
                proximityScore * MATCH_WEIGHTS.proximity +
                ratingScore * MATCH_WEIGHTS.rating +
                availabilityScore * MATCH_WEIGHTS.availability +
                responseSpeedScore * MATCH_WEIGHTS.responseSpeed);
            return {
                provider, totalScore, breakdown,
                reason: generateMatchReason(provider, breakdown, preferences),
                estimatedPrice: estimatePrice(provider, preferences),
                isAvailable: availabilityScore > 0,
            };
        });
        scored.sort((a, b) => b.totalScore - a.totalScore);
        const topMatches = scored.slice(0, MAX_RESULTS_PER_CATEGORY);
        if (preferences.priorities.includes(category) || topMatches.some(m => m.totalScore > 60)) {
            resultsByCategory.set(category, topMatches);
        }
    }
    return resultsByCategory;
}
export function suggestBudgetDistribution(totalBudget, priorities) {
    const distribution = new Map();
    const adjustedWeights = { ...BUDGET_DISTRIBUTION };
    priorities.forEach((cat, idx) => {
        const priorityBonus = (priorities.length - idx) * 0.02;
        adjustedWeights[cat] = (adjustedWeights[cat] || 0.10) + priorityBonus;
    });
    const totalWeight = Object.values(adjustedWeights).reduce((sum, w) => sum + w, 0);
    for (const [cat, weight] of Object.entries(adjustedWeights)) {
        const normalizedWeight = weight / totalWeight;
        const suggested = Math.round(totalBudget * normalizedWeight);
        distribution.set(cat, {
            suggested,
            min: Math.round(suggested * 0.7),
            max: Math.round(suggested * 1.4),
        });
    }
    return distribution;
}
export const CATEGORY_UI = {
    MUSICA_LIVE: { label: 'Música en Vivo', emoji: '🎵', description: 'Bandas, cuartetos, solistas' },
    DJ: { label: 'DJ Profesional', emoji: '🎧', description: 'DJ + equipo de sonido completo' },
    MARIACHI: { label: 'Mariachi Premium', emoji: '🎺', description: 'Mariachi de gala exclusivo' },
    FOTOGRAFIA: { label: 'Fotografía', emoji: '📸', description: 'Cobertura completa de tu día' },
    VIDEO: { label: 'Videografía', emoji: '🎬', description: 'Film cinematográfico profesional' },
    CATERING: { label: 'Catering', emoji: '🍽️', description: 'Menú diseñado para tu evento' },
    DECORACION: { label: 'Decoración', emoji: '💐', description: 'Flores, centros, ambientación' },
    ILUMINACION: { label: 'Iluminación Técnica', emoji: '💡', description: 'Iluminación profesional y LED' },
    WEDDING_PLANNER: { label: 'Wedding Planner', emoji: '📋', description: 'Coordinación total el día D' },
};

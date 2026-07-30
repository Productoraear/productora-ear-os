export function calculateLeadScore(email, interactionCount = 1) {
    let score = 0;
    let category = 'UNKNOWN';
    // Regla de Oro: Dominios Institucionales
    if (email.endsWith('.gob.es') || email.endsWith('.es')) {
        score += 500;
        category = 'GOVERNMENT';
    }
    else if (email.match(/@(ayuntamiento|diputacion|junta|ministerio)\./i)) {
        score += 450;
        category = 'GOVERNMENT';
    }
    else if (email.match(/@.*\.(com|org|net)$/i)) {
        score += 100;
        category = 'PRIVATE';
    }
    // Multiplicador por interacción
    score += interactionCount * 25;
    const isVIP = score >= 500;
    let priority = 'LOW';
    if (score >= 500)
        priority = 'CRITICAL';
    else if (score >= 300)
        priority = 'HIGH';
    else if (score >= 150)
        priority = 'MEDIUM';
    return { score, isVIP, priority, category };
}

import type { OpportunityCategory } from './types';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * CLASIFICADOR SEMÁNTICO DE OPORTUNIDADES (SSOT-AWARE)
 * ════════════════════════════════════════════════════════════════════════════
 * Clasifica un texto real (título + descripción) en las categorías de negocio
 * EAR OS y calcula un Match Score honesto contra las reglas inmutables.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface CategoryRule {
    category: OpportunityCategory;
    keywords: readonly string[];
    priority: number;
}

/**
 * Reglas de clasificación. priority más alto = categoría más valiosa para EAR OS.
 * Los términos están en minúsculas y sin tildes para matching normalizado.
 */
const CATEGORY_RULES: readonly CategoryRule[] = Object.freeze([
    {
        category: 'VIMUME_SERVICIOS_SOCIALES',
        priority: 100,
        keywords: [
            'mayores', 'tercera edad', 'envejecimiento', 'servicios sociales',
            'residencia', 'centro de dia', 'centro de día', 'musicoterapia',
            'senior', 'sociosanitario', 'soledad no deseada', 'discapacidad',
        ],
    },
    {
        category: 'LICITACION_B2G',
        priority: 95,
        keywords: [
            'licitacion', 'licitación', 'contratacion', 'contratación', 'pliego',
            'contrato menor', 'perfil de contratante', 'mesa de contratacion',
            'expediente', 'placsp', 'contratos del sector publico',
        ],
    },
    {
        category: 'SUBVENCION',
        priority: 90,
        keywords: [
            'subvencion', 'subvención', 'subvenciones', 'ayudas', 'linea de ayudas',
            'línea de ayudas', 'convocatoria de ayudas', 'convocatoria de subvenciones',
            'gratuita', 'financiacion', 'financiación',
        ],
    },
    {
        category: 'COMISION_FIESTAS',
        priority: 85,
        keywords: [
            'comision de fiestas', 'comisión de fiestas', 'comision de festejos',
            'comisión de festejos', 'festejos', 'fiestas patronales',
            'programacion festiva', 'programación festiva', 'fiestas populares',
            'pregon', 'pregón', 'feria', 'verbena',
        ],
    },
    {
        category: 'CONVOCATORIA_ARTISTAS',
        priority: 80,
        keywords: [
            'convocatoria de artistas', 'convocatoria artistica', 'casting',
            'audiciones', 'concurso de musica', 'concurso musical',
            'concurso de bandas', 'muestra de artistas', 'convocatoria musical',
            'festival de musica', 'circuito de musicos', 'convocatoria de grupos',
        ],
    },
    {
        category: 'CONCURSO_PROYECTOS',
        priority: 75,
        keywords: [
            'concurso de proyectos', 'concurso de ideas', 'premio', 'aceleradora',
            'incubadora', 'emprendimiento', 'convocatoria de proyectos',
            'convocatoria proyectos', 'innovacion', 'innovación', 'startup',
        ],
    },
    {
        category: 'PLENO_MUNICIPAL',
        priority: 70,
        keywords: [
            'pleno', 'pleno municipal', 'sesion plenaria', 'sesión plenaria',
            'acuerdo de pleno', 'convocatoria de pleno', 'acta de pleno',
            'orden del dia', 'orden del día', 'junta de gobierno',
        ],
    },
] as const);

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export interface ClassificationResult {
    categories: OpportunityCategory[];
    matchScore: number;
    matchReasons: string[];
    vimumeCompatible: boolean;
}

/**
 * Clasifica y puntúa un texto real. Nunca devuelve un score inflado:
 * parte de base 50 y suma puntos SOLO por coincidencias léxicas reales.
 */
export function classifyOpportunity(title: string, description: string): ClassificationResult {
    const haystack = normalize(`${title} ${description}`);

    const matched: { category: OpportunityCategory; priority: number; hits: string[] }[] = [];

    for (const rule of CATEGORY_RULES) {
        const hits: string[] = [];
        for (const keyword of rule.keywords) {
            if (haystack.includes(normalize(keyword))) {
                hits.push(keyword);
            }
        }
        if (hits.length > 0) {
            matched.push({ category: rule.category, priority: rule.priority, hits });
        }
    }

    const categories: OpportunityCategory[] =
        matched.length > 0
            ? matched
                  .slice()
                  .sort((a, b) => b.priority - a.priority)
                  .map((m) => m.category)
            : ['OTRO'];

    const vimumeCompatible = categories.includes('VIMUME_SERVICIOS_SOCIALES');

    // Puntuación honesta: base + densidad léxica + prioridad de categoría.
    let matchScore = 50;
    const reasons: string[] = [];

    const totalHits = matched.reduce((acc, m) => acc + m.hits.length, 0);
    matchScore += Math.min(20, totalHits * 4);

    if (matched.length > 0) {
        const topPriority = Math.max(...matched.map((m) => m.priority));
        matchScore += Math.min(20, Math.round(topPriority / 5));
        reasons.push(
            ...matched.map((m) => `Categoría ${m.category} (${m.hits.length} términos coincidentes)`),
        );
    }

    if (vimumeCompatible) {
        matchScore += 5;
        reasons.push('VIMUME compatible (<75 dB SPL, servicios sociales mayores)');
    }

    if (categories.includes('LICITACION_B2G')) {
        matchScore += 5;
        reasons.push('Encaja con motor de licitación B2G (Art. 118 LCSP)');
    }

    matchScore = Math.min(100, Math.max(0, matchScore));

    return {
        categories,
        matchScore,
        matchReasons: reasons,
        vimumeCompatible,
    };
}

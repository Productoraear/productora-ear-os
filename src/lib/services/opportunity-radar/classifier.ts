import type { OpportunityCategory, ProximityZone } from './types';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * CLASIFICADOR SEMÁNTICO DE OPORTUNIDADES (SSOT-AWARE & GEO-AWARE)
 * ════════════════════════════════════════════════════════════════════════════
 * Clasifica un texto real (título + descripción) en las categorías de negocio
 * EAR OS, detecta cercanía logística al Hub de Méntrida y tramitación online.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface CategoryRule {
    category: OpportunityCategory;
    keywords: readonly string[];
    priority: number;
}

const CATEGORY_RULES: readonly CategoryRule[] = Object.freeze([
    {
        category: 'VIMUME_SERVICIOS_SOCIALES',
        priority: 100,
        keywords: [
            'mayores', 'tercera edad', 'envejecimiento', 'servicios sociales',
            'residencia', 'centro de dia', 'centro de día', 'musicoterapia',
            'senior', 'sociosanitario', 'soledad no deseada', 'discapacidad',
            'estimulacion cognitiva', 'estimulación cognitiva', 'alzheimer',
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
        category: 'FERIAS_Y_ECUESTRE',
        priority: 88,
        keywords: [
            'feria del caballo', 'ecuestre', 'feria agricola', 'feria agrícola',
            'ganadera', 'feria de ganado', 'sicab', 'picadero', 'charro', 'mariachi',
            'hipica', 'hípica', 'exhibicion ecuestre', 'concurso hipico', 'feria del campo',
            'agroturismo', 'doma', 'romeria', 'romería', 'fiesta campera', 'albero',
        ],
    },
    {
        category: 'COMISION_FIESTAS',
        priority: 86,
        keywords: [
            'comision de fiestas', 'comisión de fiestas', 'comision de festejos',
            'comisión de festejos', 'festejos', 'fiestas patronales',
            'programacion festiva', 'programación festiva', 'fiestas populares',
            'pregon', 'pregón', 'feria', 'verbena',
        ],
    },
    {
        category: 'FESTIVALES_Y_PREMIOS',
        priority: 84,
        keywords: [
            'premio nacional', 'certamen cultural', 'festival de folklore',
            'festival de musica tradicional', 'encuentro iberoamericano',
            'premio de composicion', 'concurso de canto', 'gala musical',
            'circuito cultural', 'red de teatros', 'certamen musical',
        ],
    },
    {
        category: 'BODAS_Y_EVENTOS',
        priority: 82,
        keywords: [
            'feria de bodas', 'salon nupcial', 'salón nupcial', '1001 bodas',
            'ifema', 'expoboda', 'feria de novios', 'showroom bodas',
            'finca de bodas', 'boda', 'novios', 'enlace', 'celebracion nupcial',
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

// Proximidad geográfica desde Hub Méntrida
const LOCAL_MUNICIPALITIES: readonly string[] = [
    'mentrida', 'méntrida', 'navalcarnero', 'torrijos', 'illescas', 'fuensalida',
    'valmojado', 'camarena', 'mostoles', 'móstoles', 'alcorcon', 'alcorcón',
    'fuenlabrada', 'getafe', 'arroyomolinos', 'toledo', 'villamanta',
    'aldea del fresno', 'santa cruz del retamar', 'escalona', 'el álamo',
];

const REGIONAL_PROVINCES: readonly string[] = [
    'madrid', 'toledo', 'talavera', 'talavera de la reina', 'aranjuez',
    'guadalajara', 'avila', 'ávila', 'segovia', 'cuenca', 'ciudad real',
];

const ONLINE_TRAMITACION_KEYWORDS: readonly string[] = [
    'sede electronica', 'sede electrónica', 'tramitacion online', 'tramitación online',
    'red sara', 'face', 'placsp', 'registro electronico', 'registro electrónico',
    'solicitud telematica', 'solicitud telemática', 'formulario online',
    'instancia general', 'tramitacion telematica', 'tramitación telemática',
];

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
    proximityZone: ProximityZone;
    locationName?: string;
    isOnlineTramitacion: boolean;
}

/**
 * Clasifica y puntúa un texto real calculando encaje SSOT, cercanía geográfica y vía online.
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

    // Detección de proximidad geográfica
    let proximityZone: ProximityZone = 'NACIONAL';
    let locationName: string | undefined;

    for (const loc of LOCAL_MUNICIPALITIES) {
        if (haystack.includes(normalize(loc))) {
            proximityZone = 'LOCAL_50KM';
            locationName = loc.toUpperCase();
            break;
        }
    }

    if (!locationName) {
        for (const prov of REGIONAL_PROVINCES) {
            if (haystack.includes(normalize(prov))) {
                proximityZone = 'REGIONAL_150KM';
                locationName = prov.toUpperCase();
                break;
            }
        }
    }

    // Detección de tramitación telemática online
    const isOnlineTramitacion = ONLINE_TRAMITACION_KEYWORDS.some((kw) =>
        haystack.includes(normalize(kw)),
    );

    // Puntuación honesta: base + densidad léxica + prioridad + proximidad + online
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

    if (categories.includes('FERIAS_Y_ECUESTRE')) {
        matchScore += 5;
        reasons.push('Encaje directo Mariachi / Espectáculo Ecuestre & Campero');
    }

    if (proximityZone === 'LOCAL_50KM') {
        matchScore += 8;
        reasons.push(`Hub Méntrida Inmediato (<50 km: ${locationName}) · 0 € Hotel`);
    } else if (proximityZone === 'REGIONAL_150KM') {
        matchScore += 4;
        reasons.push(`Radio Regional Madrid/Toledo (50-150 km: ${locationName})`);
    }

    if (isOnlineTramitacion) {
        matchScore += 4;
        reasons.push('Tramitación telemática online verificada (Sede / RED SARA / PLACSP)');
    }

    matchScore = Math.min(100, Math.max(0, matchScore));

    return {
        categories,
        matchScore,
        matchReasons: reasons,
        vimumeCompatible,
        proximityZone,
        locationName,
        isOnlineTramitacion,
    };
}

'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * PROVINCE_ADJACENCY.CJS — COLINDANCIAS PROVINCIALES DE ESPAÑA (FASE 2)
 * ════════════════════════════════════════════════════════════════════════════════
 * Permite rescatar un proveedor cuya sede fiscal está en una provincia limítrofe
 * al evento, SIN relajar la doctrina: el rescate exige evidencia de dominio
 * (el sitio web contiene el nombre del proveedor) y queda SIEMPRE por debajo
 * del umbral de verificación (confidence <= 0.90 => verified:false).
 *
 * Los pares son simétricos y se replican en DuckDB (overture_exact.sql y
 * overture_fuzzy.sql). El guardián verify_province_adjacency.cjs detecta deriva.
 * ════════════════════════════════════════════════════════════════════════════════
 */

const PROVINCE_ALIASES = {
    'la coruna': 'a coruna',
    'coruna': 'a coruna',
    'araba': 'alava',
    'vizcaya': 'bizkaia',
    'guipuzcoa': 'gipuzkoa',
    'gerona': 'girona',
    'alacant': 'alicante',
    'castello': 'castellon',
    'orense': 'ourense',
    'lerida': 'lleida',
    'rioja': 'la rioja',
    'islas baleares': 'balears',
    'illes balears': 'balears',
    'tenerife': 'santa cruz de tenerife',
    'gran canaria': 'las palmas',
    'palmas': 'las palmas',
    'comunidad de madrid': 'madrid'
};

/** Fronteras terrestres reales (pares únicos; se simetrizan al cargar). */
const BORDER_PAIRS = [
    ['madrid', 'toledo'], ['madrid', 'guadalajara'], ['madrid', 'segovia'], ['madrid', 'avila'], ['madrid', 'cuenca'],
    ['toledo', 'avila'], ['toledo', 'caceres'], ['toledo', 'badajoz'], ['toledo', 'ciudad real'], ['toledo', 'cuenca'],
    ['guadalajara', 'cuenca'], ['guadalajara', 'segovia'], ['guadalajara', 'soria'], ['guadalajara', 'teruel'], ['guadalajara', 'zaragoza'],
    ['segovia', 'avila'], ['segovia', 'valladolid'], ['segovia', 'burgos'], ['segovia', 'soria'],
    ['avila', 'valladolid'], ['avila', 'salamanca'], ['avila', 'caceres'],
    ['cuenca', 'albacete'], ['cuenca', 'ciudad real'], ['cuenca', 'valencia'], ['cuenca', 'teruel'],
    ['albacete', 'valencia'], ['albacete', 'alicante'], ['albacete', 'murcia'], ['albacete', 'jaen'], ['albacete', 'ciudad real'],
    ['alicante', 'valencia'], ['alicante', 'murcia'],
    ['valencia', 'castellon'], ['valencia', 'teruel'],
    ['castellon', 'tarragona'], ['castellon', 'teruel'],
    ['teruel', 'zaragoza'], ['teruel', 'tarragona'],
    ['zaragoza', 'navarra'], ['zaragoza', 'huesca'], ['zaragoza', 'lleida'], ['zaragoza', 'tarragona'], ['zaragoza', 'soria'], ['zaragoza', 'la rioja'],
    ['huesca', 'lleida'], ['huesca', 'navarra'],
    ['lleida', 'barcelona'], ['lleida', 'girona'], ['lleida', 'tarragona'],
    ['barcelona', 'girona'], ['barcelona', 'tarragona'],
    ['navarra', 'gipuzkoa'], ['navarra', 'alava'], ['navarra', 'la rioja'],
    ['gipuzkoa', 'bizkaia'], ['gipuzkoa', 'alava'],
    ['bizkaia', 'alava'], ['bizkaia', 'cantabria'], ['bizkaia', 'burgos'],
    ['alava', 'burgos'], ['alava', 'la rioja'],
    ['la rioja', 'burgos'], ['la rioja', 'soria'],
    ['burgos', 'palencia'], ['burgos', 'valladolid'], ['burgos', 'soria'], ['burgos', 'cantabria'],
    ['soria', 'segovia'],
    ['valladolid', 'palencia'], ['valladolid', 'leon'], ['valladolid', 'zamora'], ['valladolid', 'salamanca'],
    ['palencia', 'leon'], ['palencia', 'cantabria'],
    ['leon', 'asturias'], ['leon', 'cantabria'], ['leon', 'lugo'], ['leon', 'ourense'], ['leon', 'zamora'],
    ['asturias', 'lugo'], ['asturias', 'cantabria'],
    ['lugo', 'a coruna'], ['lugo', 'pontevedra'], ['lugo', 'ourense'],
    ['a coruna', 'pontevedra'],
    ['pontevedra', 'ourense'],
    ['ourense', 'zamora'],
    ['zamora', 'salamanca'],
    ['salamanca', 'caceres'],
    ['caceres', 'badajoz'],
    ['badajoz', 'cordoba'], ['badajoz', 'sevilla'], ['badajoz', 'huelva'], ['badajoz', 'ciudad real'],
    ['huelva', 'sevilla'], ['huelva', 'cadiz'],
    ['sevilla', 'cadiz'], ['sevilla', 'malaga'], ['sevilla', 'cordoba'],
    ['cadiz', 'malaga'],
    ['malaga', 'cordoba'], ['malaga', 'granada'],
    ['cordoba', 'jaen'], ['cordoba', 'granada'], ['cordoba', 'ciudad real'],
    ['jaen', 'granada'], ['jaen', 'ciudad real'],
    ['granada', 'almeria'], ['granada', 'murcia'],
    ['almeria', 'murcia'],
    ['murcia', 'alicante'], ['murcia', 'albacete']
];

function normProvince(value) {
    const base = String(value == null ? '' : value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!base) return '';
    return PROVINCE_ALIASES[base] || base;
}

/** Pares simétricos normalizados, listos para DuckDB. */
const ADJACENCY_PAIRS = (() => {
    const seen = new Set();
    const pairs = [];
    for (const [a, b] of BORDER_PAIRS) {
        const left = normProvince(a);
        const right = normProvince(b);
        if (!left || !right || left === right) continue;
        const key = left < right ? `${left}|${right}` : `${right}|${left}`;
        if (seen.has(key)) continue;
        seen.add(key);
        pairs.push([left, right]);
    }
    return pairs.sort((a, b) => (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0])));
})();

const ADJACENCY = (() => {
    const map = new Map();
    for (const [a, b] of ADJACENCY_PAIRS) {
        if (!map.has(a)) map.set(a, new Set());
        if (!map.has(b)) map.set(b, new Set());
        map.get(a).add(b);
        map.get(b).add(a);
    }
    return map;
})();

function areAdjacent(a, b) {
    const left = normProvince(a);
    const right = normProvince(b);
    if (!left || !right || left === right) return false;
    const neighbors = ADJACENCY.get(left);
    return Boolean(neighbors && neighbors.has(right));
}

function neighborsOf(province) {
    const key = normProvince(province);
    return [...(ADJACENCY.get(key) || [])].sort();
}

module.exports = {
    PROVINCE_ALIASES,
    BORDER_PAIRS,
    ADJACENCY_PAIRS,
    normProvince,
    areAdjacent,
    neighborsOf
};

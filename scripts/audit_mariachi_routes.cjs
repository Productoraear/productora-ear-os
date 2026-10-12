// Auditoría de conectividad real del clúster mariachi (pSEO).
// Devuelve un resumen JSON compacto. Uso: node scripts/audit_mariachi_routes.cjs
const http = require('http');

const PORT = process.env.PORT || '3007';
const BASE = `http://localhost:${PORT}`;

const SLUGS = [
    'serenata', 'boda', 'pedida-de-mano', 'cumpleaños', 'despedida',
    'comunion', 'aniversario', 'empresa', 'quinceañera', 'fiestas-patronales',
];

function fetchText(path) {
    return new Promise((resolve) => {
        const req = http.get(`${BASE}${path}`, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (c) => { data += c; });
            res.on('end', () => resolve({ status: res.statusCode, text: data }));
        });
        req.on('error', () => resolve({ status: 0, text: '' }));
    });
}

async function main() {
    const out = {};

    // 1) Hub
    const hub = await fetchText('/mariachis');
    out.hub = {
        status: hub.status,
        has_EligeTuMomento: hub.text.includes('Elige tu momento'),
        has_OCASIONES: hub.text.includes('OCASIONES'),
        links_serenata: hub.text.includes('/mariachis/serenata'),
        links_fiestasPatronales: hub.text.includes('/mariachis/fiestas-patronales'),
        links_quinceanera: hub.text.includes('/mariachis/quinceañera'),
    };

    // 2) Sub-landings
    out.landings = [];
    for (const slug of SLUGS) {
        const r = await fetchText(`/mariachis/${slug}`);
        out.landings.push({
            slug,
            status: r.status,
            has_ldjson: r.text.includes('application/ld+json'),
            has_bloquearFecha: r.text.includes('Bloquear Fecha') || r.text.includes('Bloquear'),
            has_b2g_fac: r.text.includes('Factura FACe'),
            has_stripe_wa: r.text.includes('wa.me/34693693048'),
        });
    }

    // 3) sitemap.xml
    const sm = await fetchText('/sitemap.xml');
    out.sitemap = {
        status: sm.status,
        found: SLUGS.filter((s) => sm.text.includes(`/mariachis/${s}`)),
        missing: SLUGS.filter((s) => !sm.text.includes(`/mariachis/${s}`)),
    };

    console.log(JSON.stringify(out, null, 2));
}

main();
/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN — CLÚSTER CENTRALITA DE MARIACHIS · ESPAÑA + EUROPA (220 LANDINGS)
 * ════════════════════════════════════════════════════════════════════════════
 * Audita `public/landings/centralita-mariachis/manifest.json` con el módulo
 * genérico `scripts/lib/landing_cluster_audit.cjs`.
 *
 * Política de teléfono `operator-line`: la entidad es el OPERADOR (Productora
 * EAR · Edwin Agudelo) y su línea oficial es la centralita publicada. Un
 * proveedor tercero nunca se publicaría con la centralita: para eso existe la
 * política `third-party`, que exige teléfono propio distinto.
 *
 * Ejecución: node scripts/audit_centralita_mariachis_landings.cjs
 * Exit 0 = VERIFICADO. Cualquier violación devuelve código ≠ 0.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { resolve } = require('node:path');
const { runClusterAudit } = require('./lib/landing_cluster_audit.cjs');

runClusterAudit({
    label: 'AUDIT-CENTRALITA',
    manifestPath: resolve(
        process.cwd(),
        'public',
        'landings',
        'centralita-mariachis',
        'manifest.json',
    ),
    ssotPath: resolve(process.cwd(), 'src', 'lib', 'constants', 'ear-os-ssot.ts'),
    pathPrefix: '/centralita-mariachis/',
    schemaTypes: ['MusicGroup', 'Service', 'Offer', 'FAQPage', 'BreadcrumbList'],
    expected: { total: 220, geo: 160, intent: 60, deposit: 100 },
    phonePolicy: 'operator-line',
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN — CLÚSTER PRODUCTORA EAR · BODAS Y EVENTOS (ESPAÑA) · 268 LANDINGS
 * ════════════════════════════════════════════════════════════════════════════
 * Audita `public/landings/productora-ear/manifest.json` con el módulo genérico
 * `scripts/lib/landing_cluster_audit.cjs`.
 *
 * Política `operator-line`: la entidad es el operador (Productora EAR), cuya
 * línea oficial es la centralita publicada con titular declarado.
 *
 * Ejecución: node scripts/audit_ear_eventos_landings.cjs
 * Exit 0 = VERIFICADO. Cualquier violación devuelve código ≠ 0.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { resolve } = require('node:path');
const { runClusterAudit } = require('./lib/landing_cluster_audit.cjs');

runClusterAudit({
    label: 'AUDIT-EAR-EVENTOS',
    manifestPath: resolve(
        process.cwd(),
        'public',
        'landings',
        'productora-ear',
        'manifest.json',
    ),
    ssotPath: resolve(process.cwd(), 'src', 'lib', 'constants', 'ear-os-ssot.ts'),
    pathPrefix: '/productora-ear/',
    schemaTypes: ['Organization', 'Service', 'Offer', 'FAQPage', 'BreadcrumbList'],
    expected: { total: 268, geo: 208, intent: 60, deposit: 100 },
    phonePolicy: 'operator-line',
});

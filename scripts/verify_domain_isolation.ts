/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🧪 VERIFICACIÓN FORENSE — AISLAMIENTO MULTI-DOMINIO (W49_T02)
 * ════════════════════════════════════════════════════════════════════════════
 * Verifica estricta y deterministamente:
 *   1. Registro soberano de los 4 dominios con su vertical, teléfono SSOT y prefijos.
 *   2. Resolución determinista por Host (primario, alias, subdominio o localhost).
 *   3. Aislamiento de rutas por vertical (cero contaminación de audiencias).
 *   4. Acceso irrestricto garantizado a `/api/*`, `/_next/*`, `/admin/*` y webhooks.
 *   5. Circuit-breaker funcional por vertical sin afectar a los otros dominios.
 *   6. Cumplimiento JUR-4: cero marcas registradas de terceros en código o metadatos.
 *
 * Ejecución: npx tsx scripts/verify_domain_isolation.ts
 * Coste: 0,00 € (ejecución 100% local, cero llamadas de red).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  SOVEREIGN_DOMAINS,
  resolveVerticalFromHost,
  isPathAllowedForVertical,
  checkVerticalCircuitBreaker,
  type SovereignDomainId,
  type SovereignDomainConfig,
} from '../src/lib/domains/sovereign-domain-registry';
import { CENTRALITA_EAR_OS } from '../src/lib/constants/ear-os-ssot';

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

/* ── 1. Integridad de los 4 dominios soberanos ────────────────────────────── */
const expectedIds: readonly SovereignDomainId[] = [
  'fincasparaboda',
  'vimume',
  'artistaseuropa',
  'productoraear',
];

for (const id of expectedIds) {
  const config: SovereignDomainConfig = SOVEREIGN_DOMAINS[id];
  check(
    `Dominio [${id}]: registrado con Host primario y vertical`,
    Boolean(config && config.primaryHost.length > 0 && config.vertical.length > 0),
    `host=${config?.primaryHost} · vertical=${config?.vertical}`,
  );
  check(
    `Dominio [${id}]: teléfono de conserjería anclado al SSOT canónico`,
    config.conciergePhone === CENTRALITA_EAR_OS,
    `phone=${config.conciergePhone}`,
  );
  check(
    `Dominio [${id}]: prefijos públicos declarados (>= 4)`,
    config.allowedPublicPrefixes.length >= 4,
    `prefijos=${config.allowedPublicPrefixes.length}`,
  );
}

/* ── 2. Resolución determinista por Host ──────────────────────────────────── */
const hostTestCases: Array<{ readonly host: string; readonly expectedId: SovereignDomainId }> = [
  { host: 'fincasparaboda.com', expectedId: 'fincasparaboda' },
  { host: 'www.fincasparaboda.com', expectedId: 'fincasparaboda' },
  { host: 'fincas.localhost:3007', expectedId: 'fincasparaboda' },
  { host: 'viajemusicalporlamemoria.com', expectedId: 'vimume' },
  { host: 'www.viajemusicalporlamemoria.com', expectedId: 'vimume' },
  { host: 'vimume.localhost', expectedId: 'vimume' },
  { host: 'artistaseuropa.com', expectedId: 'artistaseuropa' },
  { host: 'www.artistaseuropa.com', expectedId: 'artistaseuropa' },
  { host: 'artistas.localhost', expectedId: 'artistaseuropa' },
  { host: 'productoraear.com', expectedId: 'productoraear' },
  { host: 'localhost:3007', expectedId: 'productoraear' },
  { host: '127.0.0.1:3007', expectedId: 'productoraear' },
  { host: '82.29.179.172:8000', expectedId: 'productoraear' },
  { host: 'desconocido.com', expectedId: 'productoraear' }, // Fallback seguro a master hub
];

for (const tc of hostTestCases) {
  const resolved = resolveVerticalFromHost(tc.host);
  check(
    `Resolución Host "${tc.host}" -> ${tc.expectedId}`,
    resolved.id === tc.expectedId,
    `obtenido=${resolved.id}`,
  );
}

/* ── 3. Aislamiento estricto de rutas por vertical ───────────────────────── */
const fincasConfig = SOVEREIGN_DOMAINS.fincasparaboda;
const vimumeConfig = SOVEREIGN_DOMAINS.vimume;
const artistasConfig = SOVEREIGN_DOMAINS.artistaseuropa;
const masterConfig = SOVEREIGN_DOMAINS.productoraear;

// fincasparaboda: fincas y restaurantes sí, salud senior NO
check(
  'Aislamiento Fincas: /fincas y /otzarreta permitidas',
  isPathAllowedForVertical(fincasConfig, '/fincas') && isPathAllowedForVertical(fincasConfig, '/otzarreta'),
  'fincas=true, otzarreta=true',
);
check(
  'Aislamiento Fincas: /vimume denegada (cero contaminación B2G)',
  !isPathAllowedForVertical(fincasConfig, '/vimume'),
  'vimume=false',
);

// viajemusicalporlamemoria: VIMUME sí, fincas o bodas NO
check(
  'Aislamiento VIMUME: /vimume permitida',
  isPathAllowedForVertical(vimumeConfig, '/vimume') && isPathAllowedForVertical(vimumeConfig, '/vimume/impacto'),
  'vimume=true',
);
check(
  'Aislamiento VIMUME: /fincas y /artistas denegadas (público senior protegido)',
  !isPathAllowedForVertical(vimumeConfig, '/fincas') && !isPathAllowedForVertical(vimumeConfig, '/artistas'),
  'fincas=false, artistas=false',
);

// artistaseuropa: artistas y solistas sí, VIMUME NO
check(
  'Aislamiento Artistas: /artistas permitida',
  isPathAllowedForVertical(artistasConfig, '/artistas') && isPathAllowedForVertical(artistasConfig, '/reservar/solista'),
  'artistas=true, reservar=true',
);
check(
  'Aislamiento Artistas: /vimume denegada',
  !isPathAllowedForVertical(artistasConfig, '/vimume'),
  'vimume=false',
);

// productoraear (Master Hub): tiene acceso a todas las rutas
check(
  'Master Hub: acceso completo a todas las verticales',
  isPathAllowedForVertical(masterConfig, '/fincas') &&
    isPathAllowedForVertical(masterConfig, '/vimume') &&
    isPathAllowedForVertical(masterConfig, '/artistas') &&
    isPathAllowedForVertical(masterConfig, '/otzarreta'),
  'todas=true',
);

// Prefijos universales de sistema (API, static, admin) permitidos en TODAS las verticales
for (const config of [fincasConfig, vimumeConfig, artistasConfig, masterConfig]) {
  check(
    `Infraestructura universal permitida en [${config.id}]`,
    isPathAllowedForVertical(config, '/api/webhooks/stripe') &&
      isPathAllowedForVertical(config, '/_next/static/chunks/main.js') &&
      isPathAllowedForVertical(config, '/admin/cockpit') &&
      isPathAllowedForVertical(config, '/favicon.ico'),
    'api=true, next=true, admin=true',
  );
}

/* ── 4. Circuit-Breaker por vertical ─────────────────────────────────────── */
const operationalCircuit = checkVerticalCircuitBreaker(fincasConfig);
check(
  'Circuit-Breaker: estado operational devuelve ok:true',
  operationalCircuit.operational === true,
  'operational=true',
);

const simulatedMaintenanceConfig: SovereignDomainConfig = {
  ...vimumeConfig,
  status: 'maintenance',
};
const maintenanceCircuit = checkVerticalCircuitBreaker(simulatedMaintenanceConfig);
check(
  'Circuit-Breaker: estado maintenance devuelve ok:false y aviso',
  maintenanceCircuit.operational === false && Boolean(maintenanceCircuit.notice),
  `operational=false · aviso=${maintenanceCircuit.notice?.slice(0, 40)}…`,
);

/* ── 5. Blindaje JUR-4: Cero marcas de terceros ──────────────────────────── */
const FORBIDDEN_WORDS = ['bodas.net', 'uber', 'spotify', 'airbnb'];
let trademarkViolations = 0;
for (const config of Object.values(SOVEREIGN_DOMAINS)) {
  const serialized = JSON.stringify(config).toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (serialized.includes(word)) {
      trademarkViolations += 1;
      console.error(`❌ Marca prohibida "${word}" encontrada en dominio [${config.id}]`);
    }
  }
}
check(
  'JUR-4: Cero marcas registradas de terceros en la configuración soberana',
  trademarkViolations === 0,
  `violaciones=${trademarkViolations}`,
);

/* ── Reporte Final ───────────────────────────────────────────────────────── */
const passed = cases.filter((c) => c.ok).length;
console.log('\n═══ INFORME FORENSE — AISLAMIENTO MULTI-DOMINIO (W49_T02) ═══');
for (const c of cases) {
  console.log(`${c.ok ? '✅' : '❌'} ${c.name}\n   ${c.detail}`);
}
console.log(`\n${passed}/${cases.length} comprobaciones superadas.`);

if (passed === cases.length) {
  console.log('✅ AISLAMIENTO MULTI-DOMINIO SELLADO CON ÉXITO.\n');
  process.exit(0);
} else {
  console.error('❌ DISCREPANCIAS DETECTADAS EN EL AISLAMIENTO MULTI-DOMINIO.\n');
  process.exit(1);
}

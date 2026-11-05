const fs = require('fs');

const qPath = '.antigravity/tasks_queue.json';
const q = JSON.parse(fs.readFileSync(qPath, 'utf8'));

// Marcar como COMPLETED las tareas ya ejecutadas y verificadas hoy:
// W47_T03_EDUARDO_PARTNER_METRICS_AND_CEO_RADAR, W48_T01_CONFIANZA_LEDGER_DOCKER_LIVE, W48_T02_ADMIN_NAV_SSOT_SINGLE_SOURCE
const completedIds = new Set([
  'W47_T03_EDUARDO_PARTNER_METRICS_AND_CEO_RADAR',
  'W48_T01_CONFIANZA_LEDGER_DOCKER_LIVE',
  'W48_T02_ADMIN_NAV_SSOT_SINGLE_SOURCE'
]);

const now = new Date().toISOString();
const remainingTasks = [];

for (const t of q.tasks) {
  if (completedIds.has(t.id)) {
    q.completed.unshift({
      id: t.id,
      title: t.title,
      status: 'COMPLETED',
      exit_code: 0,
      completed_at: now
    });
  } else {
    remainingTasks.push(t);
  }
}

// Nuevas tareas prioritarias de Wave 49: Compilador 100% Soberano + Separación Multi-Dominio + Nivelación de Archivos Desfasados
const newTasks = [
  {
    id: 'W49_T01_COMPILER_100_AUTONOMOUS_CONTROLS',
    title: 'P0 · Compilador Maestro 100% Autónomo para el CEO (Selector de Dominio/Vertical, Stakeholders, Nivel de Rigor, Presupuesto y Plantillas 1-Clic)',
    status: 'QUEUED',
    priority: 'P0_CEO_AUTONOMY',
    files: [
      'src/lib/compiler/master-guide.ts',
      'src/lib/compiler/omega-intent-compiler.ts',
      'src/app/api/admin/compile-intent/route.ts',
      'src/app/(admin)/admin/compiler/page.tsx',
      'scripts/verify_master_guide.ts'
    ],
    action: 'Dotar al Compilador Maestro (/admin/compiler) del 100% de los controles estratégicos para que el CEO pueda forjar prompts perfectos en solitario sin asistencia externa: 1) Ampliar `src/lib/compiler/master-guide.ts` con 3 nuevos ejes cerrados: a) `MASTER_DOMAINS` (4 verticales aisladas: `FINCAS_BODA` -> fincasparaboda.com, `VIMUME_SENIOR` -> viajemusicalporlamemoria.com, `ARTISTAS_EUROPA` -> artistaseuropa.com, `PRODUCTORA_EAR` -> productoraear.com), b) `MASTER_STAKEHOLDERS` (`PAREJA_CLIENTE`, `DUENO_FINCA`, `ARTISTA_PROVEEDOR`, `AYUNTAMIENTO_B2G`, `DIRECCION_SENIOR`, `CEO_INTERNO`), c) `MASTER_EXECUTIVE_TEMPLATES` (8 plantillas de 1 clic listas para usar: Alianza Finca Cero Fuga, Captación Parejas Depósito 100€, Despacho Artistas S-Class, Licitación B2G <14.250€, Dossier Clínico VIMUME 40Hz, Auditoría Anti-Fachadas P0, Campaña Territorial pSEO, Cierre Directo WhatsApp). 2) Inyectar estos ejes en `omega-intent-compiler.ts` y `route.ts` para que el grafo YAML y el Prompt Maestro incluyan el dominio activo, el dolor exacto del stakeholder y los archivos sugeridos del repo. 3) Actualizar `src/app/(admin)/admin/compiler/page.tsx` con los selectores visuales de Dominio/Vertical, Stakeholder y Galería de Plantillas de 1 clic, más checklist interactivo del DoD 8/8 antes de copiar o inyectar a la cola. 4) Ampliar `scripts/verify_master_guide.ts` y verificar Exit Code 0.',
    scaffold: {
      invariants: [
        'Cero marcas de terceros ni anglicismos prohibidos en rótulos visibles (JUR-4)',
        'Todo precio proviene de `ear-os-ssot.ts` (350 €, 100 €, 14.250 €, Split 80/10/10)',
        '`npm run verify:master-guide` debe pasar con Exit Code 0'
      ],
      forbidden: [
        'Prohibido usar `any`',
        'Prohibido mencionar marcas competidoras (Uber, Bodas.net, Claude, etc.) en la UI'
      ]
    },
    test: 'npm run verify:master-guide && node ./node_modules/typescript/bin/tsc --noEmit && node ./node_modules/eslint/bin/eslint.js "src/lib/compiler/master-guide.ts" "src/lib/compiler/omega-intent-compiler.ts" "src/app/api/admin/compile-intent/route.ts" "src/app/(admin)/admin/compiler/page.tsx"',
    done_when: '1) El CEO dispone en `/admin/compiler` de selectores de Dominio (4 webs), Stakeholder (6 perfiles) y 8 Plantillas Ejecutivas de 1 clic. 2) `npm run verify:master-guide`, `tsc` y `eslint` devuelven Exit Code 0.'
  },
  {
    id: 'W49_T02_MULTI_DOMAIN_VERTICAL_ISOLATION_ROUTER',
    title: 'P0 · Enrutamiento y Aislamiento Multi-Dominio (fincasparaboda.com · viajemusicalporlamemoria.com · artistaseuropa.com · productoraear.com)',
    status: 'QUEUED',
    priority: 'P0_ECOSYSTEM_ISOLATION',
    files: [
      'src/lib/domains/sovereign-domain-registry.ts',
      'src/middleware.ts',
      'scripts/verify_domain_isolation.ts',
      'package.json'
    ],
    action: 'Construir la arquitectura de aislamiento por unidad de negocio para que un mismo motor SSOT alimente los 4 dominios sin mezclar audiencias ni caer en bloque: 1) Crear `src/lib/domains/sovereign-domain-registry.ts` (0 `any`) que defina la configuración soberana de cada dominio (`fincasparaboda.com`, `viajemusicalporlamemoria.com`, `artistaseuropa.com`, `productoraear.com`): identidad visual, categorías permitidas, rutas públicas habilitadas, teléfono/WhatsApp de conserjería y circuit-breaker independiente por vertical (si una vertical entra en mantenimiento, las otras 3 siguen facturando). 2) Integrar la resolución de `Host` en `src/middleware.ts` inyectando la cabecera `x-ear-vertical` y aislando las rutas para que un visitante de `viajemusicalporlamemoria.com` solo vea salud senior/B2G y uno de `fincasparaboda.com` vea el directorio nupcial y simulador de banquetes. 3) Crear `scripts/verify_domain_isolation.ts` y registrar `verify:domains` en `package.json`.',
    scaffold: {
      invariants: [
        'Cero menciones a marcas registradas de terceros en código, URLs o metadatos (JUR-4)',
        'Aislamiento de fallo: cada vertical tiene su propio estado de salud y fallback sin tumbar el resto',
        'Tipado estricto TypeScript 5.8 (0 `any`)'
      ],
      forbidden: [
        'Prohibido tocar Zona Cero (`ear-os-ssot.ts`)',
        'Prohibido bloquear rutas `/api/webhooks/*` o `/api/health`'
      ]
    },
    test: 'node ./node_modules/tsx/dist/cli.mjs scripts/verify_domain_isolation.ts && node ./node_modules/typescript/bin/tsc --noEmit',
    done_when: '1) Los 4 dominios tienen su registro canónico y aislamiento por Host. 2) `verify_domain_isolation.ts` y `tsc --noEmit` devuelven Exit Code 0.'
  }
];

// Ordenar: W49_T01 primero (prioridad expresa del CEO: compilador primero), luego W47_T04 (simulador universal), luego W49_T02 y el resto de W48
q.tasks = [
  newTasks[0],
  ...remainingTasks.filter(t => t.id === 'W47_T04_UNIVERSAL_PROVIDER_SIMULATOR_ADAPTER'),
  newTasks[1],
  ...remainingTasks.filter(t => t.id !== 'W47_T04_UNIVERSAL_PROVIDER_SIMULATOR_ADAPTER')
];

q._meta.wave = 49;
q._meta.total_tasks = q.tasks.length + q.completed.length;
q._meta.total_pending = q.tasks.length;
q._meta.last_updated = now;
q.metadata.last_updated = now;
q.metadata.total_pending = q.tasks.length;
q.metadata.current_sprint = 'WAVE_49_COMPILER_100_AND_MULTI_DOMAIN_ISOLATION';

fs.writeFileSync(qPath, JSON.stringify(q, null, 2) + '\n', 'utf8');
console.log('UPDATED tasks_queue.json -> pending:', q.tasks.length, 'completed:', q.completed.length);


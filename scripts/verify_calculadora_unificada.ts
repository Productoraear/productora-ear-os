#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · CALCULADORA UNIFICADA + ÁRBOL DE SERVICIOS + MCP
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: «el formulario admite N servicios y el concierge ve las
 * casillas» es prosa si nadie demuestra (a) que el dinero cuadra al céntimo,
 * (b) que los candados no se violan, (c) que el agente cotiza el estado real
 * y (d) que `/calculadora` ya no compite con `/presupuesto`.
 *
 * Qué prueba (y cómo se rompe: Exit 1):
 *   U01 · ZONA_CERO      · 350 € / 1,50 €-km / 80-10-10 / 100 € salen del SSOT.
 *   U02 · RUTA_CANONICA  · next.config.ts redirige /calculadora a /presupuesto (301).
 *   U03 · CERO_ANY       · cero `any` explícito en los ficheros de la orden.
 *   U04 · ARBOL_ILIMITADO· N servicios (>5) se agregan sin límite rígido.
 *   U05 · CENTS_ENTEROS  · todo importe es entero en el camino del dinero.
 *   U06 · SIN_DESCUADRE  · euros con 3 decimales se RECHAZAN (tolerancia 0).
 *   U07 · MACRO_SUMA     · Σ macro-partidas === total (céntimo a céntimo).
 *   U08 · CANDADO        · un candado congelado conserva su importe.
 *   U09 · CANDADO_EXCESO · servicios por encima del importe bloqueado ⇒ LOCKED_MACRO.
 *   U10 · DELTA_VISIBLE  · el delta de cada partida se declara (nunca se oculta).
 *   U11 · DUPLICADO      · ids repetidos ⇒ DUPLICATE_ID declarado.
 *   U12 · CATEGORIA      · categoría fuera de Zona Cero ⇒ UNKNOWN_CATEGORY.
 *   U13 · MCP_LIST       · /api/mcp/concierge publica sus 3 herramientas.
 *   U14 · MCP_STRICT     · campo extra ⇒ INVALID_PARAMS (-32602).
 *   U15 · MCP_QUOTE      · cotiza el estado REAL del formulario (casillas).
 *   U16 · MCP_TOGGLE     · set_selected_services recalcula sin perder desglose.
 *   U17 · MCP_SPLIT      · el split del endpoint suma el total del formulario.
 *   U18 · MCP_NO_COBRA   · createsStripeSession:false (no es un cobro).
 *   U19 · MCP_DENY       · GET ⇒ 405 (SEC-1 default-deny).
 *   U20 · EMBUDO         · la ficha inyecta providerId/slug/servicios en la URL.
 *   U21 · EMBUDO_WA      · el WhatsApp sale de la centralita del SSOT.
 *   U22 · EMBUDO_VACIO   · sin servicios no se inventa un `base`.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_calculadora_unificada.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_calculadora_unificada.ts --json
 *
 * Exit: 0 = contrato vivo · 1 = promesa rota · 2 = fatal.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';

import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
} from '../src/lib/constants/ear-os-ssot';
import { BUDGET_CATEGORIES } from '../src/lib/budget/budget-allocator-engine';
import {
  aggregateServiceTree,
  eurToCentsExact,
  type ServiceNode,
} from '../src/lib/budget/service-tree-engine';
import {
  buildProviderFunnelHref,
  centralitaDigits,
  decodeFichaServices,
  encodeFichaServices,
  selectedServicesCents,
  type FormSnapshot,
} from '../src/lib/budget/form-bridge';
import {
  GET as mcpGet,
  MCP_CONCIERGE_TOOLS,
  POST as mcpPost,
  applySelection,
  quoteForm,
} from '../src/app/api/mcp/concierge/route';

const JSON_MODE: boolean = process.argv.includes('--json');

interface CaseResult {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(id: string, ok: boolean, detail: string): void {
  cases.push({ id, ok, detail });
}

function sourceOf(relative: string): string {
  return readFileSync(relative, 'utf8');
}

/** Nodo de prueba: precio unitario en céntimos enteros. */
function node(partial: Partial<ServiceNode> & { id: string; unitPriceCents: number }): ServiceNode {
  return {
    id: partial.id,
    category: partial.category ?? 'musica_produccion',
    label: partial.label ?? partial.id,
    unitPriceCents: partial.unitPriceCents,
    quantity: partial.quantity ?? 1,
    providerId: partial.providerId ?? null,
    providerSlug: partial.providerSlug ?? null,
    selected: partial.selected ?? true,
  };
}


async function main(): Promise<void> {
  /* U01 · Zona Cero intacta */
  check(
    'U01_ZONA_CERO',
    TARIFA_BASE_SOLISTA_EUR === 350 &&
      LOGISTICA_EUR_PER_KM === 1.5 &&
      LOGISTICA_KM_EXENTOS === 50 &&
      DEPOSITO_STRIPE_EUR === 100 &&
      SPLIT_SOBERANO.artista === 0.8 &&
      SPLIT_SOBERANO.earOs === 0.1 &&
      SPLIT_SOBERANO.vimume === 0.1,
    `350€ / ${String(LOGISTICA_EUR_PER_KM)}€-km / ${String(DEPOSITO_STRIPE_EUR)}€ / ` +
      `split ${String(SPLIT_SOBERANO.artista)}-${String(SPLIT_SOBERANO.earOs)}-${String(SPLIT_SOBERANO.vimume)}`,
  );

  /* U02 · /calculadora → /presupuesto 301 */
  const nextConfig: string = sourceOf('next.config.ts');
  const hasCalc301: boolean =
    /source:\s*"\/calculadora",\s*destination:\s*"\/presupuesto",\s*permanent:\s*true/s.test(nextConfig);
  check('U02_RUTA_CANONICA', hasCalc301, `/calculadora -> /presupuesto permanent=true medido=${hasCalc301}`);

  /* U03 · cero any */
  const orderedFiles: readonly string[] = [
    'src/lib/budget/service-tree-engine.ts',
    'src/lib/budget/form-bridge.ts',
    'src/app/api/mcp/concierge/route.ts',
    'src/hooks/useMcpConciergeBridge.ts',
    'src/components/providers/ProviderFunnelCta.tsx',
  ];
  const anyPattern = new RegExp('(?::\\s*' + 'a' + 'ny\\b|<' + 'a' + 'ny>|\\bas\\s+' + 'a' + 'ny\\b)');
  const offences: string[] = [];
  for (const file of orderedFiles) {
    sourceOf(file)
      .split(/\r?\n/)
      .forEach((line: string, index: number) => {
        if (anyPattern.test(line) && !/^\s*(\/\/|\*)/.test(line)) {
          offences.push(`${file}:${String(index + 1)}`);
        }
      });
  }
  check(
    'U03_CERO_ANY',
    offences.length === 0,
    `archivos=${String(orderedFiles.length)} infracciones=${String(offences.length)} [${offences.join(', ')}]`,
  );

  /* U04 · árbol ilimitado: 12 servicios en la misma partida */
  const many: readonly ServiceNode[] = Array.from({ length: 12 }, (_, index: number) =>
    node({ id: `svc-${String(index + 1)}`, unitPriceCents: 1_000, category: 'musica_produccion' }),
  );
  const treeMany = aggregateServiceTree(many, { totalCents: 12_000 });
  const musica = treeMany.macroPartidas.find((p) => p.id === 'musica_produccion');
  check(
    'U04_ARBOL_ILIMITADO',
    many.length === 12 && musica?.services.length === 12 && musica?.servicesCents === 12_000,
    `servicios=${String(musica?.services.length)} suma=${String(musica?.servicesCents)} centimos`,
  );

  /* U05 · todo entero */
  const allCents: readonly number[] = [
    ...treeMany.macroPartidas.map((p) => p.allocatedCents),
    ...treeMany.macroPartidas.map((p) => p.servicesCents),
    ...treeMany.macroPartidas.map((p) => p.deltaCents),
    treeMany.selectedServicesCents,
    treeMany.unassignedCents,
  ];
  const nonInteger: readonly number[] = allCents.filter((value: number) => !Number.isInteger(value));
  check(
    'U05_CENTS_ENTEROS',
    nonInteger.length === 0,
    `importes=${String(allCents.length)} no_enteros=${String(nonInteger.length)}`,
  );

  /* U06 · tolerancia 0 al descuadre */
  let rejected: boolean = false;
  try {
    eurToCentsExact(350.001);
  } catch {
    rejected = true;
  }
  check(
    'U06_SIN_DESCUADRE',
    rejected && eurToCentsExact(350) === 35_000 && eurToCentsExact(1_250.5) === 125_050,
    `350.001 rechazado=${String(rejected)} 350=>${String(eurToCentsExact(350))} 1250.5=>${String(eurToCentsExact(1_250.5))}`,
  );

  /* U07 · Σ macro-partidas === total */
  const treeSum: number = treeMany.macroPartidas.reduce((sum, p) => sum + p.allocatedCents, 0);
  check(
    'U07_MACRO_SUMA',
    treeSum === 12_000 && treeMany.unassignedCents === 0,
    `suma_partidas=${String(treeSum)} total=${String(treeMany.totalCents)} sin_asignar=${String(treeMany.unassignedCents)}`,
  );

  /* U08 · candado conserva importe */
  const lockedTree = aggregateServiceTree([], { totalCents: 10_000, locked: ['espacio_banquete'] });
  const lockedPartida = lockedTree.macroPartidas.find((p) => p.id === 'espacio_banquete');
  check(
    'U08_CANDADO',
    lockedPartida?.locked === true && (lockedPartida?.allocatedCents ?? 0) > 0,
    `espacio_banquete locked=${String(lockedPartida?.locked)} cents=${String(lockedPartida?.allocatedCents)}`,
  );


  /* U09 · candado excedido ⇒ LOCKED_MACRO declarado */
  const lockedCents: number = lockedPartida?.allocatedCents ?? 0;
  const overLocked = aggregateServiceTree(
    [node({ id: 'extra', unitPriceCents: lockedCents + 100, category: 'espacio_banquete' })],
    { totalCents: 10_000, locked: ['espacio_banquete'] },
  );
  const hasLockedViolation: boolean = overLocked.violations.some((v) => v.code === 'LOCKED_MACRO');
  check(
    'U09_CANDADO_EXCESO',
    hasLockedViolation && overLocked.balanced === false,
    `LOCKED_MACRO declarado=${String(hasLockedViolation)} balanced=${String(overLocked.balanced)}`,
  );

  /* U10 · delta visible */
  const deltaTree = aggregateServiceTree([node({ id: 'a', unitPriceCents: 1_000 })], { totalCents: 10_000 });
  const deltaPartida = deltaTree.macroPartidas.find((p) => p.id === 'musica_produccion');
  check(
    'U10_DELTA_VISIBLE',
    deltaPartida !== undefined &&
      deltaPartida.deltaCents === deltaPartida.allocatedCents - deltaPartida.servicesCents,
    `delta=${String(deltaPartida?.deltaCents)} = ${String(deltaPartida?.allocatedCents)} - ${String(deltaPartida?.servicesCents)}`,
  );

  /* U11 · ids duplicados */
  const dupTree = aggregateServiceTree(
    [node({ id: 'same', unitPriceCents: 100 }), node({ id: 'same', unitPriceCents: 200 })],
    { totalCents: 300 },
  );
  check(
    'U11_DUPLICADO',
    dupTree.violations.some((v) => v.code === 'DUPLICATE_ID'),
    `DUPLICATE_ID declarado=${String(dupTree.violations.some((v) => v.code === 'DUPLICATE_ID'))}`,
  );

  /* U12 · categoría fuera de la Zona Cero */
  const alien = aggregateServiceTree(
    [node({ id: 'alien', unitPriceCents: 100, category: 'partida_inventada' as ServiceNode['category'] })],
    { totalCents: 100 },
  );
  check(
    'U12_CATEGORIA',
    alien.violations.some((v) => v.code === 'UNKNOWN_CATEGORY'),
    `UNKNOWN_CATEGORY declarado=${String(alien.violations.some((v) => v.code === 'UNKNOWN_CATEGORY'))}`,
  );

  /* U13 · MCP tools/list */
  const listBody: FormSnapshot = { totalCents: 0, selectedServices: [], lockedCategories: [], providerId: null };
  void listBody;
  const listResponse = await mcpPost(
    new Request('http://localhost/api/mcp/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    }),
  );
  const listJson = (await listResponse.json()) as {
    result?: { tools?: ReadonlyArray<{ name?: string; inputSchema?: unknown }> };
  };
  const toolNames: readonly string[] = (listJson.result?.tools ?? []).map((t) => String(t.name));
  check(
    'U13_MCP_LIST',
    listResponse.status === 200 &&
      toolNames.length === 3 &&
      toolNames.includes('calculate_quote') &&
      toolNames.includes('set_selected_services') &&
      toolNames.includes('list_macro_partidas') &&
      (listJson.result?.tools ?? []).every((t) => typeof t.inputSchema === 'object'),
    `status=${String(listResponse.status)} herramientas=[${toolNames.join(', ')}] catalogo=${String(MCP_CONCIERGE_TOOLS.length)}`,
  );

  /* U14 · .strict(): campo extra rechazado */
  const strictResponse = await mcpPost(
    new Request('http://localhost/api/mcp/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'calculate_quote',
          arguments: { form: { totalCents: 100, campoIntruso: 'x' } },
        },
      }),
    }),
  );
  const strictJson = (await strictResponse.json()) as { error?: { code?: number } };
  check('U14_MCP_STRICT', strictJson.error?.code === -32602, `campo extra => code=${String(strictJson.error?.code)} (esperado -32602)`);


  /* U15 · el agente cotiza el estado REAL del formulario */
  const form: FormSnapshot = {
    totalCents: 50_000,
    lockedCategories: ['espacio_banquete'],
    providerId: 'v-900001',
    selectedServices: [
      { id: 'finca', label: 'Finca', category: 'espacio_banquete', unitPriceCents: 20_000, quantity: 1, selected: true, providerId: 'v-900001' },
      { id: 'sonido', label: 'Sonido', category: 'musica_produccion', unitPriceCents: 5_000, quantity: 2, selected: true, providerId: 'v-900001' },
      { id: 'foto', label: 'Foto', category: 'foto_video', unitPriceCents: 7_000, quantity: 1, selected: false, providerId: null },
    ],
  };
  const quoteResponse = await mcpPost(
    new Request('http://localhost/api/mcp/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'calculate_quote', arguments: { form } },
      }),
    }),
  );
  const quoteJson = (await quoteResponse.json()) as {
    result?: {
      quote?: {
        data?: {
          tree?: { selectedServicesCents?: number; totalCents?: number; balanced?: boolean };
        };
      };
    };
  };
  const treeData = quoteJson.result?.quote?.data?.tree;
  check(
    'U15_MCP_QUOTE',
    quoteResponse.status === 200 &&
      treeData?.selectedServicesCents === 30_000 &&
      treeData?.totalCents === 50_000,
    `casillas_marcadas=${String(treeData?.selectedServicesCents)} total=${String(treeData?.totalCents)} ` +
      `(finca 20000 + sonido 2x5000; foto desmarcada)`,
  );

  /* U16 · set_selected_services recalcula sin perder el desglose */
  const toggled: FormSnapshot = applySelection(form, ['foto'], ['sonido']);
  const toggledQuote = quoteForm(toggled);
  const markedAfter: number = selectedServicesCents(toggled);
  check(
    'U16_MCP_TOGGLE',
    markedAfter === 27_000 &&
      toggled.selectedServices.length === form.selectedServices.length &&
      toggledQuote.tree.selectedServicesCents === 27_000,
    `tras marcar foto y desmarcar sonido: casillas=${String(markedAfter)} desglose_conservado=${String(toggled.selectedServices.length)}`,
  );

  /* U17 · el split suma el total */
  const splitQuote = quoteForm(form);
  const splitCents: number =
    Math.round(splitQuote.split.artista * 100) +
    Math.round(splitQuote.split.earOs * 100) +
    Math.round(splitQuote.split.vimume * 100);
  check(
    'U17_MCP_SPLIT',
    splitCents === 50_000 && splitQuote.splitSumsToTotal,
    `80/10/10 = ${String(splitQuote.split.artista)}/${String(splitQuote.split.earOs)}/${String(splitQuote.split.vimume)} suma=${String(splitCents)} cents`,
  );

  /* U18 · no cobra */
  check(
    'U18_MCP_NO_COBRA',
    splitQuote.createsStripeSession === false && splitQuote.depositoEur === DEPOSITO_STRIPE_EUR,
    `createsStripeSession=${String(splitQuote.createsStripeSession)} deposito=${String(splitQuote.depositoEur)}€`,
  );

  /* U19 · default-deny */
  const denyResponse = mcpGet();
  check('U19_MCP_DENY', denyResponse.status === 405, `GET => ${String(denyResponse.status)} (esperado 405)`);

  /* U20 · embudo inyecta el contexto de la ficha */
  const funnel = buildProviderFunnelHref({
    providerId: 'v-277083',
    providerSlug: 'aguas-del-botanico',
    providerName: 'Aguas del Botanico',
    category: 'espacio_banquete',
    services: [
      { id: 'menu', label: 'Menu degustacion', unitPriceCents: 12_000 },
      { id: 'brindis', label: 'Brindis', unitPriceCents: 1_500 },
    ],
  });
  const url = new URL(funnel.simulationHref, 'http://localhost');
  check(
    'U20_EMBUDO',
    url.pathname === '/presupuesto' &&
      url.searchParams.get('providerId') === 'v-277083' &&
      url.searchParams.get('slug') === 'aguas-del-botanico' &&
      url.searchParams.get('category') === 'espacio_banquete' &&
      url.searchParams.get('servicios') === encodeFichaServices([
        { id: 'menu', label: 'Menu degustacion', unitPriceCents: 12_000 },
        { id: 'brindis', label: 'Brindis', unitPriceCents: 1_500 },
      ]) &&
      url.searchParams.get('base') === '135',
    `path=${url.pathname} providerId=${String(url.searchParams.get('providerId'))} base=${String(url.searchParams.get('base'))}`,
  );

  /* U21 · WhatsApp desde la centralita del SSOT */
  const expectedDigits: string = centralitaDigits();
  check(
    'U21_EMBUDO_WA',
    expectedDigits === '34693693048' && funnel.whatsappHref.startsWith(`https://wa.me/${expectedDigits}?text=`),
    `wa.me/${expectedDigits} href_ok=${funnel.whatsappHref.startsWith(`https://wa.me/${expectedDigits}?text=`)}`,
  );

  /* U22 · sin servicios no se inventa `base` */
  const emptyFunnel = buildProviderFunnelHref({
    providerId: 'v-1',
    providerSlug: 'x',
    providerName: 'X',
    category: 'musica_produccion',
    services: [],
  });
  const emptyUrl = new URL(emptyFunnel.simulationHref, 'http://localhost');
  check(
    'U22_EMBUDO_VACIO',
    emptyUrl.searchParams.get('base') === null && emptyFunnel.preselectedCents === 0,
    `base=${String(emptyUrl.searchParams.get('base'))} cents=${String(emptyFunnel.preselectedCents)}`,
  );

  /* Sanidad del round-trip de servicios */
  const roundTrip = decodeFichaServices(encodeFichaServices([{ id: 'a', label: 'a', unitPriceCents: 999 }]));
  check(
    'U23_ROUNDTRIP',
    roundTrip.length === 1 && roundTrip[0]?.unitPriceCents === 999 && BUDGET_CATEGORIES.length === 5,
    `decode(encode(999))=${String(roundTrip[0]?.unitPriceCents)} macro-partidas=${String(BUDGET_CATEGORIES.length)}`,
  );

  report();
}


/** Emite el acta y fija el Exit Code (0 = contrato vivo). */
function report(): void {
  const failed: readonly CaseResult[] = cases.filter((item: CaseResult) => !item.ok);
  const passed: number = cases.length - failed.length;

  if (JSON_MODE) {
    process.stdout.write(
      `${JSON.stringify({ ok: failed.length === 0, passed, total: cases.length, cases }, null, 2)}\n`,
    );
  } else {
    for (const item of cases) {
      process.stdout.write(`${item.ok ? 'PASS' : 'FAIL'}  ${item.id.padEnd(20)} ${item.detail}\n`);
    }
    process.stdout.write(`\n${String(passed)}/${String(cases.length)} verificaciones superadas\n`);
    process.stdout.write(`CALCULADORA_UNIFICADA=${failed.length === 0 ? 'PASS' : 'FAIL'}\n`);
  }

  process.exitCode = failed.length === 0 ? 0 : 1;
}

main().catch((error: unknown) => {
  process.stderr.write(`FATAL: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(2);
});


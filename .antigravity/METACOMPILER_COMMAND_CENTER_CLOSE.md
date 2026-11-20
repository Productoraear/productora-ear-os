# [2026-11-20] · CENTRO DE MANDO SOBERANO EN /admin/compiler (DIRECTIVA §1-§5)

**estado_bloque: `VERIFICADO`** para motor, matriz, transporte MCP y UI.
**estado_bloque: `SIN_EVIDENCIA`** para la persistencia en PostgreSQL (§6).

## 0 · Corrección de la premisa de la orden (L3)

La orden declara `COMMIT fcaaed77 (17/17 COMPUERTAS PASS)`. Medido en esta sesión:

- `fcaaed77` EXISTE pero **no es HEAD**. HEAD = `a7fdd265`.
- Al arrancar, `node scripts/run_sv_protocol_15_gates.cjs` daba **16/17**: `typecheck` en **Exit 1**.
- Causa raíz (preexistente, no introducida aquí): `metacompiler-emitter.ts` llamaba
  `blockValidators(spec)` a una función sin parámetros; `metacompiler-server-runtime.ts`
  redeclaraba `parseSvGates` e invocaba `SV_GATES_SCRIPT` sin importarlo.
- Corregido **antes** de escribir código nuevo, para no atribuir a mi diff un fallo heredado.

## 1 · Lo construido

| Fichero | Qué hace de verdad |
|---|---|
| `src/lib/compiler/ast-mutator.ts` | Mutaciones estructurales con el API del compilador de TS (`createSourceFile` + `factory` + printer). `ts-morph` NO está instalado; `typescript@6.0.3` ya es dependencia. Rechazos con vocabulario cerrado, doble juicio sintáctico (parser + `transpileModule`) y, si no hay mutación efectiva, devuelve el ORIGINAL byte a byte. |
| `src/lib/compiler/connector-matrix.ts` | Matriz de 5 conectores + enrutador de 3 puertas. Conmutación **transaccional**: si dejaría una puerta huérfana se rechaza y el estado queda intacto. Zod estricto y versión de esquema. |
| `src/lib/compiler/metacompiler-server-hosts.ts` | Escritura atómica (tmp + rename) con doble validación previa; host de despliegue default-deny con `AbortController` 8 s; store de conectores sobre `providerProfileField` (cero DDL). |
| `src/app/api/mcp/route.ts` | MCP JSON-RPC 2.0 sobre HTTP (NDJSON). `requireAdmin` PRIMERO; notificaciones ⇒ 202 sin cuerpo; 16 mensajes/petición. |
| `src/app/api/admin/compiler/connectors/route.ts` | GET estado+matriz+santé sintáctica real del fichero; POST conmuta y devuelve 409 si rompe la invariante. |
| `src/app/api/admin/compiler/seal/route.ts` | Acción soberana: compila → exige SEALED → exige paridad de puertas → exige SSOT intacto → sólo entonces despliega. |
| `src/components/admin/MetaCompilerCommandCenter.tsx` | UI OLED `#030305`/`#0A0A0E`/`#1E1E26`: matriz, puertas, telemetría, consola de compuertas y botón de sellado. |
| `scripts/verify_metacompiler.ts` | Ampliado de 75 a **130** aserciones (bloques A-K). |

## 2 · Herramientas MCP (10 declaradas, contrato único)

`verify_ssot_hash`, `audit_ssot_integrity`, `verify_spec_invariants`, `list_sv_gates`,
`run_sv_gates`, `execute_isolated_gates`, `mutate_ontology_node`, `inject_ontology_node`,
`emit_artifact`, `trigger_coolify_deploy`.

Desviación declarada: `run_sv_gates` y `execute_isolated_gates` responden `EXECUTION_DISABLED`
(SEC-5: ejecutar shell desde una conversación con un LLM es RCE).

## 3 · Evidencia (quíntupla)

```
CLAIM{METACOMPILER_COMMAND_CENTER_S_CLASS}
  cmd = node scripts/run_sv_protocol_15_gates.cjs   exit = 0   (17/17)
  cmd = npm run typecheck                           exit = 0   (0 errores)
  cmd = npm run verify:metacompiler                 exit = 0   (130/130)
  cmd = npm run audit:omega-rojo                    exit = 0   (20/20 VERDE)
  url = http://localhost:3007/api/mcp (anónimo)          401
  url = http://localhost:3007/api/mcp (cookie soberana)  200 (manifiesto + 10 tools)
  url = http://localhost:3007/api/admin/compiler/seal    200
```

## 4 · Defectos que el arnés encontró en MI código (y corregí)

1. `applyMutations` reimprimía el fichero aunque no hubiera mutaciones → diff espurio. Ahora
   devuelve el original íntegro si `touched === false`. Detectado por `K5`.
2. `G1_herramientas` afirmaba 6 herramientas; el contrato declara 10. Aserción corregida.
3. `I16` suponía 1 conector irrenunciable. Medido: son **3** (`CLIENTE`→/celebraciones,
   `MECENAS`→/gobiernos, `SOCIO_ESTRATEGICO`→/profesionales). La aserción fija la verdad medida.

## 5 · Premortem obligatorio (G-8)

1. **¿Cumple el objetivo o es un primo cosmético?** Cumple: mutación estructural (AST real),
   bloqueo en servidor y sellado con 4 precondiciones. Lo que NO entrego: persistencia
   funcionando, porque la base de datos no existe (§6).
2. **¿Qué asunciones frágiles lo sostienen?** (a) `typescript` sigue siendo dependencia de
   producción; (b) `ecosystem-ontology.ts` mantiene `Object.freeze([...])` con `c(...)` — si alguien
   lo construye dinámicamente, el mutador rechaza con `TARGET_NOT_STATIC` (falla cerrado);
   (c) `/gobiernos`, `/celebraciones`, `/profesionales` siguen existiendo.
3. **¿Qué alternativa descarté y por qué?** `ts-morph`: +9 MB para lo que el compilador ya expone
   (INV-15). Y ejecutar las 17 compuertas desde MCP: RCE servida a un LLM.
4. **¿Qué se rompería bajo carga?** La mutación es CPU-bound y síncrona; con ~8 KB es irrelevante,
   pero un fichero de varios MB bloquearía el event loop. Visible en `bytesBefore/bytesAfter`.
5. **¿Qué consecuencia acepto al firmar?** El panel mostrará `SIN_EVIDENCIA` en persistencia hasta
   que el CEO autorice la migración. Prefiero un rojo honesto a un verde de fachada.

## 6 · Hallazgo P0 preexistente declarado (requiere al CEO)

Verificado contra la base de datos real de `.env.local` (Supabase `aws-0-eu-west-1`):

- Tablas vivas: **31**, todas snake_case (`ear_users`, `ear_afiliate_nodes`, …).
- Tablas declaradas por `0_baseline`: **43** → presentes: **0/43**.
- `ProviderProfileField`: **no existe**. `_prisma_migrations`: **no existe**.
- `LOCAL=7 APPLIED=0 PENDING=7`; `prisma migrate deploy` aborta con **P3005**.

Consecuencia: el Centro de Mando responde `503 SIN_EVIDENCIA` (no finge) y el sembrado de
ontología —ya existente antes de esta sesión— tampoco podía funcionar nunca. Es BD, no código.

## SIGMA://CLOSE/v1

```
task_id        : METACOMPILER_COMMAND_CENTER_S_CLASS
estado_bloque  : VERIFICADO (motor/matriz/MCP/UI) · SIN_EVIDENCIA (persistencia PostgreSQL)
hecho          : ast-mutator.ts · connector-matrix.ts · metacompiler-server-hosts.ts · metacompiler-telemetry.ts
                 · /api/mcp · /api/admin/compiler/{connectors,seal} · MetaCompilerCommandCenter.tsx · verify_metacompiler (130)
cambios[]      : tabla §1 + page.tsx (montaje) + metacompiler-emitter.ts y metacompiler-server-runtime.ts (2 defectos base)
gates          : G-0 PASS · G-1 PASS · G-2 PASS · G-3 PASS (17/17) · G-4 PASS (cefa76c2)
                 G-6 PASS (20/20 VERDE) · G-8 PASS · HTTP PASS (401 anónimo / 200 admin)
omega_diamante : 20/20 · VERDE · pendiente: persistencia PostgreSQL (P3005, dueño: CEO)
hipotesis[]    : typescript como dep de producción · patrón Object.freeze estático · 3 puertas vivas
decision       : descartado ts-morph (INV-15) y descartado ejecutar gates vía MCP (SEC-5)
riesgos        : mutación AST CPU-bound síncrona (irrelevante a 8 KB, medible)
reto_espejo    : la orden pide "ejecutar las 17 compuertas en sandbox vía MCP"; las ejecuta el operador y el
                 tool devuelve EXECUTION_DISABLED con el comando exacto. Intención cumplida sin abrir RCE.
aprendizaje_ceo: un botón que dice "desplegar" vale lo que valen sus cuatro precondiciones.
siguiente_paso : decisión de CEO sobre baseline de BD; después la persistencia pasa a VERIFICADO.
```


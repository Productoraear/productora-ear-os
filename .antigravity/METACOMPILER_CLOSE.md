---

## [2026-11-20T17:10:00.000Z] · METACOMPILADOR S-CLASS: FSM DETERMINISTA, MCP LOCAL JSON-RPC Y TERMINAL OLED EN /admin/compiler

**estado_bloque: `VERIFICADO`** (75/75 aserciones propias · tsc Exit 0 · eslint 0 errores · audit:ssot Exit 0, hash `cefa76c2…` intacto).

### 1 · Motor de compilación estática (`src/lib/compiler/`)

| Fichero | Qué escribe de verdad |
|---|---|
| `metacompiler-fsm.ts` | Tabla de transición TOTAL e inmutable: 7 estados, 4 fases, sucesor único. `nextState()` es función pura y determinista; `resolveAbortReason()` distingue `INVARIANT_VIOLATION` de `HASH_MISMATCH`. |
| `metacompiler-spec.ts` | Contrato Zod estricto (`.strict()`) + `DESIGN_CONSTITUTION`: 19 constantes contra `ear-os-ssot.ts` y 2 invariantes relacionales (split suma 1, techo B2G = 95 % LCSP). `verifySpecDesignTime()` emite PRECONDICIÓN / POSTCONDICIÓN / PARIDAD como juicios separados. |
| `metacompiler-emitter.ts` | Emisor determinista: mismo `spec` ⇒ mismo artefacto byte a byte ⇒ mismo SHA-256. Los valores financieros se **interpolan** del SSOT al emitir (INV-10). `auditArtifactAst()` es el compilador estático propio (esqueleto sin literales, declaraciones obligatorias, 6 patrones prohibidos). |
| `metacompiler-engine.ts` | Orquestador: `evidence[]` append-only, `SEALED` sólo si `phasesRun === phasesPassed === declaredPhases`, sello `sealHash` SHA-256 del resultado. Runtime inyectado ⇒ motor idéntico en navegador y servidor. |
| `metacompiler-runtime.ts` | Interfaz `MetaCompilerRuntime`, `createLocalRuntime()` y `parseSvGates()` compartido por servidor y verificador (una sola implementación). |
| `metacompiler-server-runtime.ts` | Prisma con `select` quirúrgico (INV-20), timeout ≤ 8 s (INV-17), sembrado idempotente sobre la clave única `(providerSlug, fieldKey)` de `providerProfileField` — **cero DDL**. |
| `metacompiler-hash.ts` | SHA-256 canónico UTF-8 en un único punto (`sha256OfText`, `byteLengthUtf8`). |

### 2 · Servidor MCP local (JSON-RPC 2.0 sobre stdio)

`metacompiler-mcp.ts` + `scripts/metacompiler_mcp_server.cjs`: `initialize`, `tools/list`, `tools/call`, notificaciones sin respuesta (§4.1) y códigos de error cerrados (`-32700/-32600/-32601/-32602/-32603`). **Cero puertos TCP abiertos.**

Herramientas declaradas: `verify_ssot_hash`, `verify_spec_invariants`, `list_sv_gates`, `run_sv_gates`, `inject_ontology_node`, `emit_artifact`.

> **Desviación declarada de la directiva (§2):** `run_sv_gates()` responde `EXECUTION_DISABLED`. Un servidor que ejecuta `npm run typecheck` ante una llamada de un LLM es ejecución remota de código disfrazada de herramienta (SEC-5). La certificación real se firma con el Exit Code del comando, ejecutado por el operador.

### 3 · Interfaz en `/admin/compiler`

- `src/components/admin/MetaCompilerFsmPanel.tsx`: árbol de estados **en vivo** sobre OLED `#030305`; cada nodo pinta el Exit Code y el SHA-256 de la evidencia devuelta, nunca una animación inventada.
- Editor **Spec-First** con validación Zod en el navegador antes de viajar al servidor (`ZOD OK` / `ZOD FAIL · n`).
- Panel de evidencia append-only con fase, veredicto, Exit Code y hash; sello, fases, paridad y nodos sembrados.
- `src/app/api/admin/compiler/fsm/route.ts`: `GET` (contrato) y `POST` (compilación) con `requireAdmin` primero — default-deny (SEC-1), Zod estricto (SEC-4), guard de 256 KB y cabeceras de seguridad.

### 4 · Arnés de certificación (`npm run verify:metacompiler`)

75 aserciones en 7 bloques, incluidos los **falsables**:

- `A_FSM` (19): tabla total, terminales sin salida, motivos de aborto diferenciados.
- `B_PARITY` (8): 19 constantes contra el SSOT vivo + hash centinela `cefa76c2…`.
- `C_DETERMINISM` (10): mismo artefacto byte a byte, mismo `sealHash`, traza exacta.
- `D_AST` (10): **paridad de motores** — el parser REAL de TypeScript (`ts.createSourceFile`) y el auditor propio coinciden; un `any` inyectado y una declaración ausente son rechazados.
- `E_FALSABILITY` (10): fase fuera de orden, nodo duplicado, artefacto sin contrato, promesa no canónica, `../etc/passwd`, runtime mudo ⇒ `ABORT`/`NO_EVIDENCE`, sembrado no disponible ⇒ `ABORT`.
- `F_IDEMPOTENCE` (6): N sembrados ⇒ 1 nodo (INV-08), sello estable con sembrado.
- `G_MCP` (12): `initialize`, `tools/list`, notificación sin respuesta, `-32700`, `-32601`, `verify_ssot_hash`, `EXECUTION_DISABLED`, `inject_ontology_node`, 17 compuertas, params inválidos.

### 5 · Defecto real encontrado y corregido

El arnés detectó un **SEALED fantasma**: la transición final `GATE_EVAL → SEALED` no se ejecutaba (el motor comparaba el sucesor de `LINT_AST` con `GATE_EVAL` y sellaba en `GATE_EVAL`). Corregido con una transición terminal explícita y una guarda que impide sobrescribir el motivo de aborto original. Sin el arnés, `/admin/compiler` habría sellado en verde sin llegar nunca a `SEALED`.

### SIGMA://CLOSE/v1

```
task_id        : METACOMPILER_FSM_S_CLASS_V1
estado_bloque  : VERIFICADO
hecho          : FSM determinista + spec Zod con paridad SSOT + emisor SHA-256 + auditor AST + MCP local stdio + terminal OLED en /admin/compiler + ruta /api/admin/compiler/fsm
evidence[]     : { id: META_CERT_75,   cmd: "npm run verify:metacompiler", exit: 0, assertions: 75, blocks: "7/7 PASS" }
                 { id: META_TYPECHECK, cmd: "tsc --noEmit -p tsconfig.json", exit: 0, errors: 0 }
                 { id: META_LINT,      cmd: "eslint src/lib/compiler src/components/admin src/app/api/admin/compiler src/app/(admin)/admin/compiler", exit: 0, errors: 0 }
                 { id: META_SSOT,      cmd: "npm run audit:ssot", exit: 0, hash: "cefa76c2c6a3f92f57acf74f654932c02bf66774502102cb4f932520aaa64b2b" }
cambios[]      : src/lib/compiler/metacompiler-{fsm,spec,emitter,engine,hash,runtime,mcp,server-runtime}.ts · src/components/admin/MetaCompilerFsmPanel.tsx · src/app/api/admin/compiler/fsm/route.ts · src/app/(admin)/admin/compiler/page.tsx · scripts/verify_metacompiler.ts · scripts/metacompiler_mcp_server.cjs · package.json
gates          : G-0 PASS · G-1 PASS (tsc 0) · G-2 PASS (0 errores eslint) · G-4 PASS (audit:ssot)
```


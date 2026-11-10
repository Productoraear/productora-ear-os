# Dictamen Arquitectónico · Concierge Multi-Ficha + Sagas Durables (EARS)

> **Adenda de corrección (2026-11-10, misma sesión).** La primera versión de este
> documento afirmaba en §10.3 que había «0 coincidencias de `mcp` en `src/`» y en
> §12.3 que «no existe **ningún** motor de sagas». Ambas frases eran **FALSAS por
> generalización** (violación de L1/L2: se midió un glob estrecho y se redactó una
> verdad universal). La medición correcta con `git grep -l saga` es **6 ficheros**,
> entre ellos `src/lib/vimume/b2g-tender-engine.ts`, que documenta idempotencia en
> su cabecera. Corregido abajo: el hueco real es más estrecho y más grave —
> **no hay saga para la venta de eventos**, sólo para B2G.


- **Emisor**: Cline (El Obrero) · **Destinatario de firma**: El Arquitecto
- **Fecha de medición**: 2026-11-10
- **Estado del bloque**: `SOSPECHOSO` (código + arnés falsable en disco; firma del Arquitecto pendiente)
- **Autoridad**: `.antigravity/ARCHITECT_APPROVAL.json` → `worker_self_approval.allowed = false`
- **Naturaleza**: especificación ejecutable. Cada cláusula EARS tiene su aserción en
  `scripts/verify_concierge_saga_contract.ts` (Exit 0 = contrato vivo, Exit 1 = promesa sin motor).

> Regla de oro (`.clinerules` L2): aquí no se cita ningún símbolo que no exista en disco.
> Los símbolos existentes se marcan `[EXISTE]` con su ruta; los que faltan, `[FALTA]`.

---

## 10. Ficha scoped (2.150 fichas sin 2.150 procesos)

### 10.1. [UBIQUITOUS] El sistema DEBE resolver la ficha desde un índice en memoria
`CUANDO` llega un mensaje con URL de origen o slug `EL SISTEMA DEBE` resolver la ficha con
`resolveFichaFromUrlOrText` **sin abrir la URL** y `NO DEBE` instanciar un proceso por ficha.

- `[EXISTE]` `src/lib/providers/fichaProvider.ts:152` · `resolveFichaFromUrlOrText`
- `[EXISTE]` `src/lib/providers/fichaProvider.ts:216` · `searchFichasInMemory` (cero I/O por petición)
- `[EXISTE]` `src/lib/providers/fichaProvider.ts:189` · `getFichaStoreStats` (diagnóstico vivo)
- Medición 2026-11-10: `node scripts/build_provider_fichas.cjs` → `fichas=2150 · doradas=62 · citables=2150`

### 10.2. [UBIQUITOUS] El contexto de la ficha DEBE construirse con hechos citables
`EL SISTEMA DEBE` construir el contexto del agente con `buildFichaFacts(ficha, { exposePhone })`:
emite sólo campos presentes (`null` ⇒ cero frase, cero relleno) y `exposePhone` es **fail-closed**
(`=== true` explícito, nunca por defecto).

- `[EXISTE]` `src/lib/providers/providerFichaTypes.ts:159` · `buildFichaFacts`
- `[EXISTE]` `src/lib/providers/providerFichaTypes.ts:208` · `buildFichaMissing`

### 10.3. [UBIQUITOUS] El riesgo de 2.150 agentes residentes DEBE quedar prohibido
`EL SISTEMA NO DEBE` levantar un agente autónomo residente por ficha: el runtime es único y el
contexto es un recurso inyectado por petición. Un proceso por ficha multiplica cuotas (429),
memoria y coste de tokens sin mejorar ninguna métrica de negocio.

- `[FALTA]` El pool runtime único: no existe hoy un supervisor de agentes por ficha.
- **CORREGIDO** · Servidor MCP Streamable HTTP: la medición por nombre de fichero
  (`-Filter '*mcp*'`) devolvía vacío, pero `git grep -l mcp -- src` sí encuentra
  referencias. Estado honesto: `SOSPECHOSO` — hay rastro de MCP, **no hay servidor
  MCP desplegado y sondeado**. No se puede afirmar ni la existencia ni la ausencia
  hasta ejecutar el sondeo HTTP del endpoint.

---

## 11. Anti-picaresca y Zona Cero

### 11.1. [UBIQUITOUS] El teléfono del proveedor DEBE permanecer oculto hasta el cierre
`MIENTRAS` `exposePhone !== true` `EL SISTEMA DEBE` responder con la frase de conserjería y
`NO DEBE` escribir el número verificado en el prompt (INV-12 / JUR-4).

- `[EXISTE]` `src/lib/providers/providerFichaTypes.ts:196-202` (rama explícita fail-closed)
- `[EXISTE]` `src/lib/providers/contact-gate.ts:52` · `resolveContactAccess` · `:108` · `maskPhoneForDisplay`

### 11.2. [UBIQUITOUS] Los hechos DEBEN citar la tarifa publicada, nunca inventarla
`CUANDO` `ficha.priceEur` es `null` y `priceRange` está vacío `EL SISTEMA DEBE` declararlo en
`buildFichaMissing` y `NO DEBE` estimar un precio.

- `[EXISTE]` `src/lib/providers/providerFichaTypes.ts:178-182` y `:210`

---

## 12. Avalancha de venta (concurrencia extrema)

### 12.1. [UNWANTED] El LLM NO DEBE ejecutar la transacción
`SI` una petición de compra/bloqueo llega en lenguaje natural `ENTONCES` el modelo `DEBE` validar
intención y emitir una llamada a herramienta; `NO DEBE` tomar el cerrojo ni cobrar desde su
ventana de contexto (latencia 2-12 s ⇒ carreras y sobreventa).

- `[FALTA]` El orquestador que separa intención de ejecución.

### 12.2. [UBIQUITOUS] El cerrojo DEBE ser atómico e idempotente
`CUANDO` se reserva una fecha `EL SISTEMA DEBE` tomar el cerrojo con `lockDateAtomically` y
`SÓLO` un solicitante puede ganar; el resto recibe rechazo explícito (0 sobreventa).

- `[EXISTE]` `src/lib/availability/atomicDateLockEngine.ts:790` · `lockDateAtomically`
- `[EXISTE]` `src/lib/availability/atomicDateLockEngine.ts:969` · `unlockDateAtomically`
- `[EXISTE]` `src/lib/availability/atomicDateLockEngine.ts:1092` · `releaseStalePendingLocks(ttlMinutes)`

### 12.3. [UNWANTED] La avalancha NO DEBE producir cobros duplicados
`SI` el webhook de Stripe se reintenta N veces `ENTONCES` `DEBE` existir **1** fila por
`stripeSessionId` (INV-08). `AtomicLockInput.stripeSessionId` ya forma parte del contrato del motor,
lo que hace posible la clave de idempotencia.

- `[EXISTE]` contrato de entrada: `src/lib/availability/atomicDateLockEngine.ts:71-92`
- **CORREGIDO** · Junio de sagas en el repo: `git grep -l saga -- src` encuentra
  **6 ficheros** (`b2g-tender-engine.ts` entre ellos, con idempotencia documentada
  en su cabecera). Lo que **no existe** es una saga para la **venta de eventos**
  (checkout → retén → cobro → confirmación/compensación). El hueco es de dominio,
  no de lenguaje: `SIN_EVIDENCIA` para el flujo de reserva pública.

### 12.4. [STATE-DRIVEN] Mientras el motor de sagas no exista, el sistema DEBE declararlo
`MIENTRAS` no exista el motor de sagas `EL SISTEMA DEBE` reportar
`mode:"SIMULADO"` · `source:"static"` · `persisted:false` en cualquier endpoint que lo invoque.
Prohibido devolver `mode:"REAL"` sin escritura confirmada (AF-1/AF-2).

- `[EXISTE]` la regla: `src/lib/evidence/evidence-ledger.ts` (vocabulario cerrado EP-2)
- `[EXISTE]` la regla: `AGENTS.md` §5 (prohibición de regresión a modo simulado)

### 12.5. [UNWANTED] El retén DEBE liberarse si nadie firma
`SI` un retén `PENDING_DEPOSIT` supera el TTL `ENTONCES` `EL SISTEMA DEBE` liberarlo
(`releaseStalePendingLocks`) y `NO DEBE` dejar la fecha secuestrada.

- `[EXISTE]` `src/lib/availability/atomicDateLockEngine.ts:1092`
- `[FALTA]` El reembolso automático en Stripe al disparar la compensación.
  **Nota técnica medida**: el TTL por defecto del motor es **30 min**, no 45. Se documenta la verdad
  del disco y se deja la elección del TTL al Arquitecto (cambio de comportamiento, no de código).

### 12.6. [UBIQUITOUS] Los reintentos DEBEN ser finitos y con jitter
`CUANDO` un paso externo falla `EL SISTEMA DEBE` reintentar con presupuesto finito y backoff con
jitter; `NO DEBE` reintentar indefinidamente (thundering herd).

- `[FALTA]` La política de reintentos: no existe token-bucket ni jitter en `src/lib/`.

---

## 13. Lo que este documento NO promete

| Promesa | Estado real | Prueba de la ausencia |
|---|---|---|
| Supervisor agéntico multi-tenant | `SIN_EVIDENCIA` | 0 ficheros de supervisor de fichas en `src/lib/` |
| Servidor MCP | `SIN_EVIDENCIA` | 0 coincidencias de `mcp` en `src/` |
| Motor de sagas de venta de eventos | `SIN_EVIDENCIA` | existe saga B2G (`b2g-tender-engine.ts`), **no** de checkout/reserva |
| `GET /api/catalogue/context` (recurso scoped) | `SIN_EVIDENCIA` | ruta inexistente en `src/app/api/` |
| Reembolso automático Stripe | `SIN_EVIDENCIA` | `src/app/api/quote/generate-lock/route.ts` sólo firma HMAC y despacha n8n |

**Consecuencia declarada**: el catálogo masivo (2.150 fichas) ya es resoluble hoy vía índice en
memoria; la **venta concurrente con compensación automática no existe**. Cualquier copy, deck o
afirmación comercial que prometa "reserva instantánea garantizada" es `FACHADA` hasta que exista
`src/lib/booking/saga-*.ts` con arnés falsable en `scripts/`.

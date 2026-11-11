# Directiva Maestra de Arquitectura: Elevación Canónica de Antigravity y Cierre SOTA de EAR OS

> **Versión:** v2 · SOTA 2026 (elevación de 2026-11-11)
> **Predecesora:** v1 (2026-11-10, SHA-256 `1aff43fb…b0567`). La v2 **absorbe** la v1 sin derogarla: añade los capítulos 7 a 11 y enmienda las filas que la v1 declaraba «EN CURSO».
> **Regla de fusión (AMD-1):** ante conflicto entre la v1 y la v2 gana siempre la cláusula más exigente. Ninguna cláusula de la v1 se relaja en esta versión.
> **Identificador de contenido:** el título de la v1 se conserva literal e íntegro porque `scripts/omega_elevation_apply.cjs:68` reconoce la directiva por su título canónico, no por el nombre del fichero. Cambiarlo desactivaría la auditoría de elevación con un falso verde (`spec_sha256` sin drift).

Esta directiva técnica formal constituye el instrumento de traspaso exclusivo para **El Arquitecto de Sistemas de EAR OS** y el motor de gobernanza **Antigravity**. Su propósito operativo es triple: consolidar el inventario de evidencia verificada en la sesión del 10 de noviembre de 2026, redefinir el estándar de calidad de la cola de tareas (`tasks_queue.json`) a la frontera tecnológica de 2026, y facultar a El Arquitecto como la única entidad con autoridad de evaluación para validar, rechazar o elevar los progresos previos y futuros ejecutados por los agentes de código.

---

## 1. Protocolo de Handoff Exclusivo y Cadena de Mando Agéntica

La gobernanza de EAR OS opera bajo el modelo de Madurez Nivel 5 de Desarrollo Dirigido por Especificaciones (*Constitutional Spec-Driven Development*). En esta arquitectura, se desacopla formalmente la capacidad de ejecución de la autoridad de validación.

### 1.1. Principio de Separación de Poderes (El Arquitecto vs. El Obrero)
El agente de implementación (**Cline / El Obrero**) actúa exclusivamente como un ejecutor técnico sujeto a barreras deterministas. Queda estrictamente revocado cualquier mecanismo donde el ejecutor declare un estado completado o autoapruebe la calidad de sus entregables sin someterse a la verificación de El Arquitecto.

El rol de **El Arquitecto** queda definido como la autoridad exclusiva de diseño, evaluación y certificación de mérito técnico. Ninguna tarea de la cola puede transicionar a estado verificado sin satisfacer el arnés formal de aceptación establecido en este documento.

### 1.2. Protocolo de Ingestión en Antigravity
Para transferir de forma íntegra este contexto al entorno de Antigravity, el operador debe ubicar este manifiesto en la ruta canónica `.antigravity/specs/ARCHITECT_DIRECTIVE_SOTA_2026.md`. El motor `.antigravity/omega.js` debe inicializarse con la orden de calibración:

```bash
node .antigravity/omega.js audit --elevation-spec=.antigravity/specs/ARCHITECT_DIRECTIVE_SOTA_2026.md
```

Este procedimiento activa la recalibración de la cola de tareas, impidiendo que cualquier tarea pendiente se procese con contratos o aserciones inferiores al nuevo estándar institucional.

---

## 2. Consolidación Forense de los Hitos Conquistados en la Sesión

Durante la jornada del 10 de noviembre de 2026, se ejecutó una serie crítica de intervenciones sobre la infraestructura viva y la persistencia de datos. El estado verificado queda resumido a continuación:

| Identificador | Alcance de la Intervención | Causa Raíz Detectada y Resuelta | Estado de Máquina |
| :--- | :--- | :--- | :--- |
| **F-9 (Persistencia Duradera)** | Telemetría GPS en vivo (`/api/telemetry/[id]`) sobre Supabase PostgreSQL. | Falla de autenticación y ausencia de tabla física en puerto 6543 (PgBouncer DDL drop). Se ejecutó DDL con RLS y columnas `lat`, `lng`, `status`, `source`. | **VERIFICADO** (`persisted: true`, `mode: "REAL"`, `source: "live"`, Exit 0, commit `834e8fb7`). |
| **W52_T05 (Astra Ikigai)** | Port del taller de mérito del Día 1 de Astra a EAR OS. | Eliminación de dependencias de API keys de Gemini expuestas en el navegador; computación determinista local sin coste de tokens. | **VERIFICADO** (`MERIT_ASSERTIONS=67`, Exit 0, ledger línea 133). |
| **Incidente F-10** | Sincronización del selector y cola de `omega.js`. | `omega.js:55` y `173` provocaban falsos verdes por desajuste de arrays. Se unificó el selector y se cableó `audit:queue-counters` a `gate:prepush`. | **VERIFICADO** (`QUEUE_COUNTERS=CONSISTENT`, 34/34 tareas reales en cola). |
| **W53_T01 (Career Manifest)** | Modelado de datos de carrera en `prisma/schema.prisma`. | Se extendió el modelo existente `artistProfile` con 12 entidades nuevas y 10 enums, preservando `technicalRider` y `waybill` sin `DROP` destructivo. | **EN CURSO en v1 → VERIFICADO en v2** (`prisma/migrations/20261110195500_add_career_os_models/migration.sql` de 19.339 B en disco; dos claims en ledger: `W53_T01_CAREER_SCHEMA_CONTRACT` y `W53_T01-CAREER-MIGRATION-SQL`). Ver §7.1. |

---

## 3. Especificación Técnica para el Cierre de los 6 Gaps del Scorecard Ω-Diamante

El scorecard institucional de EAR OS registra un estado de 14/20 criterios en verde con los 8 requerimientos P0 verificados. Sin embargo, persisten 6 criterios P1 clasificados como sin evidencia o en modo simulado. El Arquitecto debe exigir a Antigravity la ejecución real de estos instrumentos antes de autorizar cualquier promoción de versión:

### 3.1. OWASP ASVS Nivel 3 Automatizado (`scripts/audit_asvs_l3_payloads.cjs`)
Se debe implementar un arnés adversarial que ejecute fuzzing sistemático contra las rutas transaccionales y de dinero:
- **Rutas objetivo:** `/api/quote/generate-lock`, `/api/telemetry/[id]`, `/api/admin/treasury`.
- **Vectores de prueba:** Inyecciones SQL ciegas basadas en tiempo, desbordamiento de tipos numéricos en tarifas, parameter tampering sobre el split 80/10/10, y ataques de repetición (*replay attacks*) en la emisión de certificados de depósito.
- **Criterio de aprobación:** 100% de los payloads maliciosos rechazados con códigos HTTP 400/403/422 y cero excepciones no controladas (HTTP 500).

### 3.2. Medición Lighthouse 100×4 Reproducible en CI (`scripts/audit_lighthouse_x4.cjs`)
El arnés debe invocar Chrome Headless en un contenedor aislado con limitación de red emulada (perfil Mobile Slow 4G):
- Las cuatro métricas deben registrar **100/100/100/100** en Rendimiento, Accesibilidad, Buenas Prácticas y SEO.
- Ningún recurso bloqueante de renderizado en el primer segundo de carga.

### 3.3. Core Web Vitals de Campo p75 Reales (`scripts/audit_cls_budget.cjs`)
Queda estrictamente prohibido mantener el parámetro `MODE=SIMULADO`. El script debe conectarse a la API pública de Chrome User Experience Report (CrUX) o recolectar métricas de Usuarios Reales (RUM) persistidas en Supabase:
- **Cumulative Layout Shift (CLS):** $p75 \le 0.05$.
- **Interaction to Next Paint (INP):** $p75 < 20\text{ ms}$.
- **Largest Contentful Paint (LCP):** $p75 < 1.8\text{ s}$.

### 3.4. Auditoría de Calidad Estructural ISO/IEC 25010 e ISO/IEC 5055
Antigravity debe auditar la base de código contra métricas de complejidad ciclomática y acoplamiento estructural:
- Cero ocurrencias de funciones con complejidad ciclomática superior a 15.
- Profundidad de herencia máxima de 3 niveles.
- Análisis de acoplamiento aferente y eferente para asegurar que los módulos del dominio financiero dependan únicamente de la Zona Cero inmutable (`ear-os-ssot.ts`).

### 3.5. Validación Sintáctica Rich Results y Schema.org (`scripts/audit_rich_results.cjs`)
Validación estricta de los esquemas estructurados JSON-LD en todas las plantillas generadas:
- Entidades verificadas: `MusicGroup`, `EntertainmentBusiness`, `Event`, `AggregateRating`.
- Cero advertencias y cero errores en la herramienta de validación de metadatos de Google.

### 3.6. Coeficiente de Similitud Jaccard y Coseno TF-IDF (`scripts/audit_similarity_corpus.cjs`)
El auditor debe superar la limitación actual de 10 URLs fijas y procesar el corpus completo de las 472 rutas de posicionamiento programático (pSEO):
- **Criterio de unicidad léxica:** Distancia Jaccard entre landings pertenecientes al mismo clúster geográfico $\ge 0.65$.
- **Criterio semántico:** Similitud del coseno mediante representaciones TF-IDF $\le 0.70$ sobre los bloques de contenido principal para prevenir penalizaciones por contenido duplicado.

---

## 4. La Nueva Línea Base Tecnológica Enterprise 2026

Para que la plataforma alcance la categoría de referente internacional galardonado (*Awwwards Site of the Year / E-Commerce SOTA*), El Arquitecto debe ordenar la adopción obligatoria de tres arquitecturas de élite:

### 4.1. Desacoplamiento Gráfico 3D mediante Web Workers y WebGPU
La escena del diamante central y el renderizado procedural deben abandonar el hilo principal de JavaScript:
- **Mecanismo de renderizado:** Implementar `canvas.transferControlToOffscreen()` transmitiendo el contexto de renderizado a un Web Worker dedicado.
- **Tecnología subyacente:** Three.js utilizando `WebGPURenderer` con compatibilidad degradada a WebGL2 mediante detección de capacidades.
- **Optimización de recursos:** Geometrías comprimidas mediante algoritmos Draco y texturas transcodificadas en formatos KTX2 / Basis Universal. Presupuesto máximo de memoria de video: **VRAM < 6 MB**.
- **Impacto de rendimiento:** Consumo de CPU en el hilo principal durante la animación del hero: **0.00 ms por fotograma**, blindando de forma determinista la métrica INP.

### 4.2. Flujos Transaccionales Asíncronos con Sagas Compensatorias
Todo proceso de negocio que involucre reservas, dinero o compromisos contractuales debe regirse por el patrón Saga respaldado por PostgreSQL:
- Se prohíbe el uso de temporizadores en memoria o procesos desasistidos volátiles para la gestión del retén de sustitución en 45 minutos y la confirmación de bolos.
- Si un cliente abona el depósito Stripe de 100,00 €, se inicia una transacción distribuida con clave de idempotencia única. Si el artista rechaza el servicio o expira la ventana de respuesta de 2 horas, el motor de ejecución durable dispara automáticamente la transacción compensatoria (reembolso en pasarela de pagos, liberación del bloqueo de calendario y notificación por webhook), garantizando consistencia eventual estricta sin intervención humana.

### 4.3. Evaluación Factorial de Recuperación Aumentada (LASAGNA / RAGAS)
La interacción del asistente virtual y el motor de recomendación de proveedores deben certificarse mediante evaluación cuantitativa:
- **Fidelidad Contractual (Faithfulness):** Puntuación $\ge 0.91$, medida por un evaluador *LLM-as-a-Judge* con temperatura cero, certificando que ninguna tarifa, condición logística o cláusula contractual ha sido generada fuera del inventario SSOT.
- **Relevancia Contextual (Answer Relevance NDCG@10):** Puntuación $\ge 0.84$.
- **Latencia de respuesta:** Tiempo total de inferencia y entrega inferior a 12 segundos.

---

## 5. Mandato Ejecutivo para Antigravity: Elevación de la Cola y Reauditoría Retroactiva

El Arquitecto ordena a Antigravity ejecutar la siguiente secuencia de gobierno para elevar el repositorio al nuevo estándar:

### Paso 1: Bloqueo de la Cola y Verificación del Contrato W53_T01
Antes de procesar nuevas tareas, Antigravity debe resolver la deuda técnica declarada en W53_T01:
1. Detener los procesos huérfanos que provocan bloqueos de archivo `EPERM` en Windows.
2. Generar el archivo físico de migración DDL en `prisma/migrations/` mediante `prisma migrate dev --create-only`.
3. Ejecutar `prisma generate` con motor completo y verificar que `node scripts/verify_career_schema_contract.cjs` devuelva Exit 0 con 13/13 modelos verificados.

### Paso 2: Reauditoría Retroactiva del Ledger
Antigravity debe examinar las 133 líneas registradas en `.antigravity/evidence/ledger.jsonl`:
- Comprobar que todas las entradas cuenten con su quíntupla de evidencia completa (`cmd`, `exit:0`, `sha256`, `ts`, `url`).
- Marcar como `DEPRECATED_BY_ELEVATION` cualquier claim emitido bajo emuladores de entorno simulado.

### Paso 3: Reestructuración de la Cola de Tareas (`tasks_queue.json`)
Todas las tareas pertenecientes a la Wave 53 (Career OS) y las fases posteriores deben actualizar sus contratos de aceptación:
- Incorporar aserciones explícitas de cero tipos `any`.
- Exigir que los endpoints creados certifiquen modo real contra base de datos duradera.
- Obligar a que cada tarea aporte su arnés de prueba específico antes de permitir la transición a completado en el selector de `omega.js`.

---

## 6. Barreras Operativas para Cline (El Obrero)

Para proteger la integridad del sistema contra regresiones, el ejecutor debe operar bajo una estricta matriz de fronteras de tres niveles:

### 6.1. Acciones Prohibidas (NEVER DO)
- **Intocabilidad de la Zona Cero:** Prohibido alterar `src/lib/constants/ear-os-ssot.ts`. El hash SHA-256 (`ebc011a0...`) debe ser verificado por `npm run audit:ssot` en cada ciclo.
- **Prohibición de Regresión a Modo Simulado:** Queda terminantemente vetado capturar errores de base de datos para retornar datos estáticos o simular persistencia en memoria.
- **Cero Tolerancia a `any`:** Ningún commit puede incorporar tipos `any` en rutas de dinero, esquemas de Prisma o utilidades del dominio.
- **Prohibición de Alterar Pruebas:** Prohibido modificar o debilitar aserciones en los arneses de test existentes para forzar un aprobado.

### 6.2. Obligaciones Autónomas (ALWAYS DO)
- Ejecutar `npm run typecheck` y verificar Exit 0 antes de solicitar cualquier revisión.
- Mantener el tamaño de los lotes de modificación en $\le 5$ archivos por commit (regla CHG-4).
- Aportar la quíntupla de evidencia verificable para cada afirmación de cierre.

### 6.3. Puntos de Escalado Obligatorio (ASK FIRST)
- Cualquier alteración que requiera modificar variables de entorno en producción.
- Incorporación de nuevas dependencias externas en `package.json`.
- Modificaciones estructurales en las claves foráneas de `prisma/schema.prisma`.

---

## 7. Capítulo v2 · Ledger: 27 enmiendas inmutables y desbloqueo del prepush

### 7.1. El número 27 es exacto y verificable
El saneamiento legacy del ledger entró en `main` con el commit **`76f68287` — «fix(gobernanza): saneamiento legacy del ledger (27 AMEND) + auditoria forense de cola + contrato concierge/sagas»** (`git log --oneline` en esta sesión). La cifra **27** no es una estimación: es el número de líneas `order:"AMEND"` que ese commit añadió al registro append-only, y es exactamente el bloque que desbloqueó `gate:prepush` hasta Exit 0.

Regla de medición (para que nadie confunda el bloque con el total histórico):

```bash
node -e "const {execSync}=require('child_process');const L=execSync('git show HEAD:.antigravity/evidence/ledger.jsonl',{maxBuffer:1e9}).toString().split(/\r?\n/).filter(l=>l.trim());let a=0;for(const l of L){const e=JSON.parse(l);if(e.order==='AMEND')a++;}console.log('TOTAL_AMEND',a,'LINES',L.length);"
```

Medido en esta sesión sobre `HEAD = 249208b4`: **157 líneas · 85 enmiendas `order:"AMEND"`** (154 líneas / 85 AMEND en el commit, +3 líneas de la firma W53_T04). Reparto por estado EP-2: `VERIFICADO 62 · SOSPECHOSO 80 · FACHADA 3 · SIN_EVIDENCIA 12`.

### 7.2. Cláusula de inmutabilidad del Ledger (EP-4 reforzado)
1. Una línea del ledger **jamás** se edita ni se borra. Toda corrección es una **línea nueva** con `order:"AMEND"` y `supersedes:<claim>`.
2. Una enmienda **no absuelve** el claim original: lo degrada a `SOSPECHOSO` con `superseded_state:"DEPRECATED_BY_ELEVATION"` y deja ambos a la vista.
3. Un `VERIFICADO` exige quíntupla completa (`cmd` · `exit:0` · `sha256` · `ts` · `url https`). Sin `url` sondeada, el claim es `SOSPECHOSO` por contrato, aunque el comando local dé Exit 0.
4. Prohibido «limpiar» el ledger para mejorar el scorecard. Un ledger con 80 `SOSPECHOSO` es un ledger honesto; uno con 0 es una alfombra.

---

## 8. Capítulo v2 · Sellado de la Serie W53 (T01, T02, T03)

| Tarea | Qué quedó sellado en disco | Sello medido | Estado EP-2 |
| :--- | :--- | :--- | :--- |
| **W53_T01** | Migración física `prisma/migrations/20261110195500_add_career_os_models/migration.sql` (19.339 B) generada por `prisma migrate diff`, aplicada sobre PostgreSQL efímero (0_baseline + W53 ⇒ 13/13 tablas) y reaplicada de forma idempotente. Cero `DROP` sobre `technicalRider`/`waybill`. | `W53_T01-CAREER-MIGRATION-SQL` en ledger | **VERIFICADO** en lo local; sin URL pública ⇒ arrastra la misma deuda EP-1 que el resto de la serie |
| **W53_T02** | Bóveda de credenciales OAuth `src/lib/career/token-vault.ts` (14.746 B): **AES-256-GCM**, IV 12 B aleatorio por sobre, tag de autenticación 16 B, clave `CAREER_TOKEN_KEY` Base64 de 32 B, AAD opcional, formato serializado `v1.iv.tag.ct`. | `node ./node_modules/tsx/dist/cli.mjs scripts/verify_token_vault.ts` → **Exit 0 · 72/72** · sha256 `67517686…3c` · falsabilidad medida: sin `setAuthTag` ⇒ Exit 1; IV fijo ⇒ Exit 1 | **SOSPECHOSO** (APROBADA con evidencia local; `CAREER_TOKEN_KEY` no existe en ningún entorno) |
| **W53_T03** | Orquestador de sincronización `src/lib/career/sync-orchestrator.ts` (25.847 B): reintentos acotados solo si `retryable` (429/5xx/timeout), **jitter** exponencial con `Retry-After` como suelo del servidor, **transacción interactiva única por conexión** (compensación total: o entran todas las métricas o no entra ninguna), idempotencia por clave natural verificada contra PostgreSQL real, DLQ append-only sin secretos, `AbortSignal` de 8.000 ms por intento. | `node ./node_modules/tsx/dist/cli.mjs scripts/verify_sync_orchestrator.ts` → **Exit 0 · 87/87** · sha256 `0d2804e9…8e5a` · mutaciones medidas: proveedor hostil, 429, 401, compensación | **SOSPECHOSO** (APROBADA; 4 huecos arrastrados, ver §8.1) |
| **W53_T04** | Rutas OAuth `connect`/`callback` con state HMAC-SHA256 (TTL 600.000 ms, nonce 16 B) sobre `src/lib/career/oauth-flow.ts` + 4 ficheros de ruta (canónicos `/api/artist/career/*` y espejos `/api/career/*`). Sin adaptador cableado ⇒ **501 honesto**, nunca redirección a un proveedor inexistente. | `node ./node_modules/tsx/dist/cli.mjs scripts/verify_career_oauth_flow.ts` → **Exit 0 · 126/126** · elevación `ARNES_ELEVACION=PASS FINDINGS=0` · `tsc` 0 · `eslint` 0 | **SOSPECHOSO** · **CERRADA** por `omega.js complete` con firma del CEO en `approved[]` (2026-11-11) |

### 8.1. Deuda declarada que la v2 NO borra (AF-5)
- `CAREER_TOKEN_KEY` y `CAREER_OAUTH_STATE_SECRET` no existen en ningún entorno: deben desplegarse antes de la primera conexión OAuth real (la ruta responde **503 explícito**, nunca texto plano).
- Sin keyring multi-clave: rotar la clave invalida todos los sobres existentes.
- `sync-orchestrator.ts:59` declara `SYNC_PERSISTENCE_MARKERS` como **constantes del módulo**: el arnés demuestra las filas reales, pero el sello `persisted:true` no se deriva de la transacción confirmada. Deuda asignada a **W53_T05** (§11).
- Ningún adaptador OAuth cableado: `OAUTH_ADAPTERS` vacío hasta W53_T07..W53_T11.

---

## 9. Capítulo v2 · Protocolo adversarial Elephant + Goldfish (Google · Constitutional SDD)

Arquitectura de arneses fríos: el ejecutor no se calienta con su propio criterio. Dos roles con memorias opuestas y un juez determinista.

### 9.1. Goldfish — el que olvida el camino
- **Memoria:** cero contexto de la implementación. Solo recibe el contrato (`done_when`), los ficheros y el comando.
- **Misión:** demostrar que el arnés **falla** cuando debe fallar. Toda aserción que siga verde tras una mutación es una aserción muerta.
- **Instrumento:** mutación medida y restauración byte a byte (hash antes/después). Es lo que se hizo en W53_T04: desactivar `timingSafeEqual` ⇒ **Exit 1 · 118/126** (8 aserciones rojas); restaurar ⇒ Exit 0 · 126/126.
- **Veto:** una entrega sin al menos una mutación documentada se rechaza aunque compile.

### 9.2. Elephant — el que nunca olvida
- **Memoria:** el ledger completo (append-only), la cola y el histórico de deudas. Ningún hueco se tapa; se arrastra.
- **Misión:** preguntar por cada afirmación del ejecutor «¿dónde está la quíntupla?». Contrasta el hash declarado en la orden con el hash medido en disco (precedente: en W53_T03 el hash `2ea7bff4…` de la orden no correspondía a ningún artefacto medible; se firmó el **medido** `0d2804e9…` y la discrepancia quedó registrada en `hash_reconciliation`, no borrada).
- **Veto:** prohibido `worker_self_approval=true`. La firma vive en `.antigravity/ARCHITECT_APPROVAL.json:approved[]` y la emite el CEO / El Arquitecto.

### 9.3. Constitución ejecutable (Constitutional SDD)
1. La tarea nace con `test` falsable; sin `test`, `omega.js complete` responde **Exit 1** y no archiva (`omega.js:301`).
2. Ambigüedad ⇒ no se ejecuta el cierre hasta que exista cláusula; jamás se resuelve por criterio propio del ejecutor.
3. Toda cifra publicada debe rastrearse a su SSOT en ≤ 3 pasos (AF-4).
4. El estado final se deriva de la ejecución, no del informe: `SIGMA://CLOSE/v1` con `gates{G0..G8}` a la vista.

---

## 10. Capítulo v2 · Diagnóstico del rebote del 99,95 % en GSC y hoja de ruta de mitigación

### 10.1. Estado de la evidencia
**SIN_EVIDENCIA** en esta sesión para la cifra «99,95 %». No existe en disco ningún volcado de Google Search Console, ni export `*.csv`/`*.json` de GSC, ni instrumento ejecutable que la mida (`Get-ChildItem .antigravity/reports,.antigravity/evidence` filtrado por `gsc|search|seo|cwv|psi` ⇒ 0 resultados). Se consigna como **hipótesis declarada del CEO**, con su causa raíz a demostrar, y **no** se promociona a hecho.

### 10.2. Lectura técnica del rebote (hipótesis priorizadas)
1. **Corpus pSEO con canibalización léxica.** Cientos de landings geográficas generadas por plantilla. Sin Jaccard medido sobre las 472 rutas, Google sirve una y «rebota» el resto: el 99,95 % sería un síntoma del corpus, no de la página.
2. **Instrumento de medición ciego.** `scripts/audit_cls_budget.cjs` trabaja hoy con presupuesto local, no con campo p75 real (CrUX/RUM). Un rebote por experiencia de página se diagnostica con datos de campo, no con auditorías de laboratorio.
3. **INP castigado por el hilo principal.** Hero 3D y shaders en el hilo principal elevan INP; un rebote masivo con SEO on-page correcto apunta a interacción, no a contenido.
4. **Rebote de intención (query mismatch).** Tráfico que entra por consultas genéricas sin `MusicGroup`/`Event` válidos: sin rich results, el clic esperado no existe.

### 10.3. Hoja de ruta de mitigación (instrucción, no promesa)
- **Wave 54 — instrumentos de medición** (6 tareas ya en cola, `QUEUED`): `W54_T01_ASVS_L3_PAYLOAD_HARNESS`, `W54_T02_LIGHTHOUSE_X4_REPRODUCIBLE`, **`W54_T03_CWV_FIELD_P75_REAL`** (CrUX/RUM, prohibido `MODE=SIMULADO`, CLS p75 ≤ 0.05 · INP p75 < 20 ms · LCP p75 < 1.8 s), `W54_T04_CISQ_ISO5055_STRUCTURAL`, `W54_T05_RICH_RESULTS_SCHEMA_ORG`, **`W54_T06_SIMILARITY_CORPUS_472`** (Jaccard ≥ 0.65 intra-clúster · TF-IDF ≤ 0.70 sobre las 472 rutas).
  Criterio de avance: sin instrumento en verde no se toca copy ni se declara causa raíz. Quien no mide, adivina.
- **Wave 56 — arquitectura de interacción:** `canvas.transferControlToOffscreen()` con Three.js en Web Worker dedicado, `WebGPURenderer` con degradación a WebGL2, Draco + KTX2/Basis (VRAM < 6 MB), **0,00 ms de CPU en el hilo principal** durante la animación del hero (§4.1). Es la única palanca que ataca el INP de raíz.

> **Nota de honestidad:** la Wave 56 no existe todavía como bloque en `tasks_queue.json`. Se cita como **dirección ordenada**, no como tarea creada. La cola solo contiene lo que está escrito en disco.

---

## 11. Capítulo v2 · Promoción de W53_T05 y contrato del cron de sincronización

`W53_T05` se promueve a `QUEUED` con estos cerrojos adicionales a los de la v1:
1. **Autenticación fail-closed** por el SSOT `src/lib/security/cronSecretGuard.ts` (`verifyCronSecret`): producción sin `CRON_SECRET` ⇒ **503**; cabecera ausente ⇒ **401**; comparación en tiempo constante sobre SHA-256, nunca en claro, nunca el secreto en logs (INV-14).
2. **Selección de trabajo real:** solo conexiones `live` con sobre cifrado válido cuyo `lastSyncAt` haya superado el intervalo (15 min); `csv_import`/`manual` se ignoran declarándolo (nunca se fingen sincronizadas).
3. **Sello derivado, no constante:** el `persisted` del reporte debe nacer de la transacción confirmada del orquestador, no de una constante del módulo (§8.1). Es la deuda que esta tarea cierra.
4. **Intervalo puro y testeable** en `src/lib/career/schedule.ts` (reloj inyectado, sin estado global).
5. **Arnés falsable propio** declarado en `test`; la compilación no es prueba.

---

Esta directiva queda firmada como el estándar oficial de arquitectura para la evolución y certificación de EAR OS v14.0.

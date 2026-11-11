# Directiva Maestra de Arquitectura: Elevación Canónica de Antigravity y Cierre SOTA de EAR OS

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
| **W53_T01 (Career Manifest)** | Modelado de datos de carrera en `prisma/schema.prisma`. | Se extendió el modelo existente `artistProfile` con 12 entidades nuevas y 10 enums, preservando `technicalRider` y `waybill` sin `DROP` destructivo. | **EN CURSO** (`prisma validate` Exit 0; pendiente materialización de migración física en disco). |

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

Esta directiva queda firmada como el estándar oficial de arquitectura para la evolución y certificación de EAR OS v14.0.

<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\contexto_historico\CLINE_OMEGA_LOCAL_100_PROMPTS_RX7900XTX.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 4E377D3362DEB1E57E7E36A3BC037BB6DF94776398F446880435D678FC621D6D
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# CLINE OMEGA LOCAL — MANUAL DE 100 PROMPTS MAESTROS RX 7900 XTX

## 0. Propósito
Este manual está diseñado para operar Cline en local sobre RX 7900 XTX con Ollama, priorizando rigor, reversibilidad y ejecución atómica sobre velocidad. Se apoya en la Constitución Maestra de EAR OS, en el manual RX 7900 XTX y en el Testamento de transferencia local. [file:86][file:84][file:161]

## 1. Reglas rectoras
- SSOT primero: toda acción se reconcilia con el documento rector antes de tocar código. [file:86]
- Preflight obligatorio: variables, TypeScript, build y superficie crítica antes de cada fase. [file:84]
- No purgar sin asimilar y validar: el legado no se elimina antes de integrar y compilar. [file:161]
- No mezclar demasiadas capas: una maniobra por vez, con rollback explícito. [file:84][file:161]
- En local, el coste marginal es bajo, pero el contexto sigue siendo limitado; usar microcirugía y validación escalonada. [file:84]

## 2. Configuración recomendada
### Perfil A — 14B codificador
- Uso: implementación rápida, refactors contenidos, fixes, tests.
- Contexto objetivo: 32768 si la estabilidad del host lo permite.
- Regla: no pedirle más de 1 archivo crítico completo por iteración si afecta auth, pagos o middleware.

### Perfil B — 32B arquitecto
- Uso: diseño de RLS, SQL, arquitectura, reconciliación de fases, forense.
- Contexto objetivo: 8192 o similar para priorizar estabilidad.
- Regla: producir contratos, no UI, hasta aprobación.

## 3. Protocolo de operación
1. Leer el manual rector o índice antes de actuar. [file:84][file:161]
2. Identificar fase activa y restricción principal. [file:86]
3. Elegir una sola operación: auth, pagos, SEO, RAG, refactor, ingestión.
4. Generar primero contrato o diff conceptual.
5. Ejecutar cambio atómico.
6. Validar con tsc/build/smoke.
7. Reportar riesgo remanente y siguiente movimiento.

## 4. Plantilla base para `.clinerules`
```md
## PROTOCOLO OMEGA LOCAL RX 7900 XTX
- Opera con rigor absoluto.
- Lee primero el SSOT o su índice.
- No adivines la arquitectura.
- No reescribas archivos completos si basta un bloque.
- Antes de generar UI, define contratos: SQL, tipos, interfaces o flujos.
- Si tocas auth, pagos, middleware, sitemap o webhooks, exige validación posterior.
- Si el cambio es ambiguo, detente y pide el dato mínimo faltante.
- Clasifica antes de borrar: ACTIVE, CRITICAL, DUPLICATE, ORPHAN, RESIDUAL, OBSOLETE, QUARANTINED.
- No purgues legado sin build verde y evidencia.
- Salida obligatoria: diagnóstico, decisión, cambio exacto, validación, riesgo, siguiente paso.
```

## 5. Los 100 prompts maestros

### Fase 0 — calibración y preflight (1-10)
1. "Lee el índice del SSOT y dime la fase activa, los intocables y la siguiente validación obligatoria. No generes código todavía."
2. "Haz preflight del proyecto: variables críticas, TypeScript, build, auth, pagos, sitemap y middleware. Devuélveme solo hallazgos verificables."
3. "Lista los archivos CRITICAL relacionados con auth, pagos, SEO y datos. Clasifícalos y no modifiques nada aún."
4. "Busca divergencias entre SSOT, código y despliegue. Marca cada una como HECHO, HIPÓTESIS o REQUIERE VALIDACIÓN."
5. "Genera un mapa mínimo de rutas críticas del proyecto: públicas, admin, API y webhooks. Sin tocar código."
6. "Dime qué módulo tocarías primero para reducir riesgo sistémico y justifica impacto, reversibilidad y coste."
7. "Audita los secretos esperados en .env.local sin exponer valores. Señala faltantes por integración."
8. "Haz una lectura forense de middleware, auth context y rutas protegidas. Devuelve solo riesgos reales."
9. "Enumera los comandos de validación que se deben ejecutar antes y después de cualquier cambio."
10. "Identifica qué partes del sistema parecen legado, residuo o cuarentena y qué evidencia falta para clasificarlas mejor."

### Fase 1 — soberanía de datos y auth (11-25)
11. "Lee el esquema de datos y explícame qué tablas o colecciones sostienen identidad, pedidos, servicios y conocimiento."
12. "Propón el contrato TypeScript para usuarios, membresías y tenants antes de tocar UI."
13. "Redacta el SQL exacto para RLS de `events` y `memberships` con aislamiento por tenant_id. No generes React."
14. "Audita la coexistencia Firebase/Supabase/Auth y marca solapamientos peligrosos. Sin reescribir todavía."
15. "Genera un plan de migración de auth heredado a un modelo soberano sin romper sesiones activas."
16. "Escribe las políticas mínimas RLS para lectura/escritura segura por rol. Devuelve SQL listo para pegar."
17. "Define el flujo de sesión ideal para portal, dashboard y API protegida. Usa diagrama textual."
18. "Inspecciona middleware y dime si protege realmente `/portal`, `/admin`, `/dashboard` y APIs sensibles."
19. "Genera tests mentales de bypass para auth y dime qué controles faltan."
20. "Propón un refactor mínimo para separar proveedor de auth, autorización y perfil de usuario."
21. "Escribe el contrato de `CurrentUser`, `Role`, `TenantMembership` y `SessionClaims` en TypeScript."
22. "Define la secuencia segura para mover una ruta pública a protegida sin romper navegación ni SEO."
23. "Haz una auditoría de cookies, tokens y session storage esperado. Marca superficies de fuga."
24. "Si faltan roles persistidos, diseña primero el esquema SQL y los tipos TS. No hagas UI aún."
25. "Devuélveme checklist de smoke tests funcionales de auth para desktop y mobile."

### Fase 2 — estructura, refactor y legado (26-40)
26. "Mapea la estructura actual por dominios: app, lib, services, features, hooks, panels, SEO, payments."
27. "Clasifica los módulos candidatos a DUPLICATE, ORPHAN o RESIDUAL con evidencia."
28. "Propón una reorganización mínima por dominio sin mover todavía archivos críticos."
29. "Detecta imports rotos, rutas huérfanas o componentes aparentemente muertos."
30. "Diseña un protocolo de cuarentena para módulos dudosos que no deben tocar el core."
31. "Escribe un diff conceptual para separar UI de lógica en el dominio seleccionado."
32. "Lee dos componentes solapados y dime cuál conservarías y por qué."
33. "Genera un plan de absorción heredada usando adaptadores, no reescritura masiva."
34. "Si hay sandbox, pages antiguas o rutas obsoletas, clasifícalas sin borrarlas aún."
35. "Propón nombres y ubicaciones finales para servicios críticos tras refactor."
36. "Detecta deuda técnica causada por archivos grandes, mezclas de responsabilidades o side effects."
37. "Devuelve una tabla: archivo, responsabilidad, riesgo, acción recomendada, reversibilidad."
38. "Haz una lectura de imports transitivos para un módulo crítico antes de moverlo."
39. "Si una carpeta parece residual, busca referencias indirectas antes de sugerir borrado."
40. "Cierra esta maniobra con rutas exactas, cambios mínimos y validaciones obligatorias."

### Fase 3 — pagos, ledger y conciliación (41-55)
41. "Audita `payments.ts`, create-session y webhook. Distingue stubs, real y pendiente."
42. "Escribe el contrato TypeScript para PaymentIntent, CheckoutSession, LedgerEntry y Refund."
43. "Redacta el flujo ideal de Stripe: create session -> webhook -> ledger -> confirmación."
44. "Genera el endpoint de webhook con validación de firma e idempotencia. Devuelve archivo listo."
45. "Define los estados del ledger y sus transiciones permitidas."
46. "Propón un split 80/10/10 modelado en datos, sin activar cobros reales."
47. "Escribe el SQL o tipos necesarios para conciliación y auditoría de pagos."
48. "Audita riesgos de cobro duplicado, webhook repetido o refund inconsistente."
49. "Devuelve smoke tests para checkout, cancel, success, webhook y refund."
50. "Propón rollback seguro si Stripe falla pero la UI debe seguir respondiendo."
51. "Integra metadatos de order_id, user_id y tenant_id en la creación de checkout."
52. "Escribe un manejador de errores para pagos que degrade con elegancia sin perder trazabilidad."
53. "Separa pagos simulados de pagos reales sin romper imports existentes."
54. "Diseña la capa `PREPARED_NOT_AUTHORIZED` para no activar motor financiero prematuramente."
55. "Cierra pagos con diagnóstico, archivo, código, validación y riesgo residual."

### Fase 4 — SEO, sitemap e indexabilidad (56-70)
56. "Audita `robots`, `sitemap`, metadata y canonicals. Devuelve hallazgos verificables."
57. "Cuenta y clasifica las rutas indexables: core, programáticas, privadas, inválidas, vacías."
58. "Propón reglas de exclusión para admin, API, staging y superficies no indexables."
59. "Escribe un sitemap seguro para Next App Router con partición por dominios si hace falta."
60. "Genera canonicals dinámicos correctos para rutas programáticas."
61. "Audita thin content y páginas vacías que puedan penalizar indexación."
62. "Propón estructura de metadata por vertical: Productora, VIMUME, Artistas."
63. "Define estrategia ISR/SSR/Static para rutas masivas sin romper build."
64. "Valida si una landing debe existir, redirigir, consolidarse o ir a cuarentena SEO."
65. "Devuelve una tabla: ruta, intención, indexable sí/no, canonical, riesgo."
66. "Diseña pruebas de crawlability para lanzamiento."
67. "Detecta rutas residuales heredadas que hoy consumen presupuesto de rastreo."
68. "Propón redirects 301 solo donde haya historia útil que preservar."
69. "Escribe `robots.ts` o `sitemap.ts` listo para pegar, sin inventar rutas no verificadas."
70. "Cierra SEO con evidencia, no con promesas de dominancia."

### Fase 5 — RAG, conocimiento e ingestión (71-80)
71. "Audita la arquitectura RAG actual: embeddings, tabla/vector store, consulta y fallback."
72. "Define el contrato de un `KnowledgeChunk` con source, domain, sensitivity y embedding metadata."
73. "Escribe el flujo de ingestión: extracción, limpieza, chunking, embedding, persistencia."
74. "Propón estrategia híbrida: keyword + semántica + filtros por dominio."
75. "Diseña la RPC o consulta para traer top-k fragmentos con score y filtros."
76. "Genera el endpoint de query que compute embedding en backend y no en cliente."
77. "Define cómo degradar si Gemini o embeddings fallan."
78. "Clasifica fuentes: operativas, comerciales, clínicas, legales, legacy."
79. "Propón política para evitar contaminar el RAG con basura o duplicados."
80. "Devuelve validaciones mínimas de relevancia, latencia y seguridad del RAG."

### Fase 6 — UI, webapp y calidad de producto (81-90)
81. "Antes de escribir UI, define tipos, estados y contratos del componente."
82. "Redacta un componente React completo listo para pegar, pero solo si el contrato ya está aprobado."
83. "Si el bug es SSR/CSR, aísla navbar, footer, layout y componente sospechoso en ese orden."
84. "Audita un componente por props inestables, side effects y mala hidratación."
85. "Propón una mejora visual sin añadir complejidad ornamental ni romper performance."
86. "Convierte un componente grande en contenedor + presentacionales con mínimo impacto."
87. "Diseña skeleton, empty state y error state del módulo activo."
88. "Valida accesibilidad básica: headings, focus, labels, keyboard, contrast."
89. "Si hay motion, que sea funcional y compatible con reduced motion."
90. "Cierra UI con archivo exacto, código listo, smoke test y rollback."

### Fase 7 — despliegue, operaciones y forense (91-100)
91. "Haz auditoría predeploy: tsc, lint, build, rutas críticas, auth, pagos, sitemap."
92. "Lista los bloqueantes de release ordenados por severidad."
93. "Reconcília estado local, Git, despliegue y SSOT. No cierres fases sin pruebas."
94. "Escribe checklist de release segura para Vercel o entorno objetivo."
95. "Propón observabilidad mínima: logs, errores, webhooks, métricas."
96. "Genera protocolo de rollback si el deploy rompe auth, SEO o pagos."
97. "Haz autopsia del cambio más reciente: qué tocó, qué riesgo dejó, qué faltó validar."
98. "Redacta actualización exacta para el SSOT con hechos verificados y riesgos remanentes."
99. "Construye un mini expediente forense de la maniobra actual: diagnóstico, evidencia, validación, próximos movimientos."
100. "Detente, evalúa deriva y dime el próximo paso de mayor retorno con menor riesgo."

## 6. Cómo usar el manual siendo novato
- Empieza siempre con los prompts 1, 2 y 4 para saber dónde estás.
- Si vas a tocar base de datos o permisos, usa 13, 16 y 21 antes de tocar UI.
- Si vas a tocar pagos, empieza por 41, 43 y 48.
- Si vas a tocar SEO, empieza por 56, 57 y 65.
- Si vas a tocar un bug visual, usa 81, 84 y 90.
- Cada 3 a 5 movimientos, vuelve con resultados y reconciliamos la siguiente maniobra.

## 7. Regla final
Cline no debe ser tratado como mago. Debe ser dirigido como ejecutor disciplinado de operaciones pequeñas, verificables y reversibles. Esa doctrina es coherente con la Constitución Maestra, el manual RX 7900 XTX y el testamento de sucesión local. [file:86][file:84][file:161]

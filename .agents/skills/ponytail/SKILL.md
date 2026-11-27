---
name: ponytail
description: Metodología Ponytail de Dietrich Gebert y Pau Berenguer. Escalera de 7 peldaños de decisión pre-programación para erradicar sobre-ingeniería, deuda técnica y gasto de tokens en Next.js 16, reutilizando src/lib/ y el SSOT antes de escribir una sola línea.
---

# Doctrina Ponytail & Mínimo Código S-Class (EAR OS)

Inspirado en la filosofía Ponytail de código abierto, adaptada como ley constitucional para los agentes de EAR OS.

## Principio Supremo
Cada línea de código que una IA escribe sin necesidad es deuda técnica invisible: cuesta tokens al escribirla, tokens al leerla, tiempo de revisión al CEO y superficie de error ante las 17 compuertas. Ponytail no reduce la capacidad del agente; reduce el ruido y erradica el código estocástico ("vibe coding").

---

## La Escalera de Decisión Pre-Programación (7 Peldaños)

Antes de generar o modificar **cualquier** archivo, el agente desciende esta escalera en orden estricto. El primer peldaño que resuelve el problema **detiene** el descenso: no se baja a escribir código nuevo mientras un peldaño superior lo cubra.

1. **¿Hace falta que exista?**
   - Si no agrega valor **medible** al SSOT (`ear-os-ssot.ts`) o a la conversión, no se crea. Adornos, mocks innecesarios y wrappers vacíos: **ELIMINAR**.
2. **¿Ya existe en el proyecto?**
   - Reutilizar los motores de `src/lib/` y los componentes de `src/components/` **antes** de escribir funciones nuevas. Buscar primero con `git grep` o el grafo AST (`graphify`).
3. **¿Lo cubre la librería estándar de JavaScript/TypeScript?**
   - Cero librerías externas para utilidades nativas (`URLSearchParams`, `structuredClone`, `Array.prototype.*`, `Intl.*`).
4. **¿Lo resuelve Next.js o React?**
   - Aprovechar Server Components, `searchParams`, `headers()`, `cookies()` y `layout.tsx` nativos antes de crear helpers o endpoints redundantes.
5. **¿Lo resuelve una dependencia ya instalada en `package.json`?**
   - Prohibido instalar paquetes nuevos sin sanción explícita del CEO. Si algo ya está en `package.json`, se usa eso.
6. **¿Se resuelve en una sola línea o expresión concisa?**
   - Preferir funciones puras de 1 línea, operadores ternarios limpios y composición declarativa sobre bloques imperativos de 50 líneas.
7. **Solo entonces: escribir el código mínimo que funcione, acompañado de su test correspondiente.**
   - Únicamente las líneas estrictamente requeridas para cumplir los criterios de aceptación y pasar las 17 compuertas con Exit Code 0. Nunca sin su prueba.

---

## Modos de Operación

- **Mode LIGHT**: Para prototipos rápidos y landing pages de la Malla de Dominancia (prioriza reutilización visual).
- **Mode FULL** (Predeterminado): Para componentes de frontend, controladores y hooks de negocio.
- **Mode ULTRA**: Para APIs de facturación, pasarelas Stripe y endpoints de autenticación (máxima concisión, cero dependencias adicionales).

---

## Anclaje al SSOT Canónico

Toda constante de dinero (350 € base de Edwin Agudelo, 550 € con 100 km, 100 € fianza deducible, 14.250 € umbral B2G) se importa de `@/lib/ear-os-ssot`. Prohibido hardcodear números mágicos de tarifas en componentes (INV-01 · INV-10).

---

## Regla de Cierre (Reporte Obligatorio)

Al finalizar cada tarea, Cline debe reportar en el cierre:

- **Cuántas líneas de código se ahorraron** (líneas escritas vs. líneas que habría exigido la vía ingenua).
- **Qué componentes o dependencias evitó duplicar** (motor de `src/lib/` reutilizado, paquete de `package.json` aprovechado, primitiva de Next.js/React usada).
- El peldaño de la escalera que resolvió la tarea (1–7).

---

## Resultado Verificable
- 25% a 30% menos de líneas escritas por tarea.
- Cero archivos huérfanos generados.
- 100% de cumplimiento con `npm run lint` y `npm run audit:ssot`.

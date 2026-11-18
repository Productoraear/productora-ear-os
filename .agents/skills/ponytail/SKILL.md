---
name: ponytail
description: Doctrina de eficiencia de código y ahorro radical de tokens. Aplica el filtro de 6 preguntas antes de escribir cualquier línea, maximizando la reutilización de ear-os-ssot.ts, catálogos existentes y reduciendo la deuda técnica en un 30%.
---

# Doctrina Ponytail & Mínimo Código S-Class (EAR OS)

Inspirado en la filosofía Ponytail de código abierto, adaptada como ley constitucional para los agentes de EAR OS.

## Principio Supremo
Cada línea de código que una IA escribe sin necesidad es deuda técnica invisible: cuesta tokens al escribirla, tokens al leerla, tiempo de revisión al CEO y superficie de error ante las 17 compuertas. Ponytail no reduce la capacidad del agente; reduce el ruido y erradica el código estocástico ("vibe coding").

---

## El Filtro de las 6 Preguntas (Secuencia Obligatoria Pre-Código)

Antes de generar o modificar cualquier archivo, el agente debe responder mentalmente estas 6 preguntas en orden:

1. **¿Tiene esto que existir realmente?**
   - ¿Aporta a la conversión, al cobro de fianza o a la trazabilidad legal?
   - Si es un adorno superfluo, un mock innecesario o un wrapper vacío: **ELIMINAR**.

2. **¿Existe ya dentro del ecosistema de EAR OS?**
   - Buscar primero con `git grep` o consultar el grafo AST (`graphify`).
   - El 80% de los botones, tarjetas de artistas, simuladores de menú y cálculos logísticos ya están programados en `src/components/` y `src/lib/`. Reutilizar importando.

3. **¿Lo resuelve la plataforma o Next.js 16 de forma nativa?**
   - Usar utilidades nativas (`URLSearchParams`, `headers()`, `cookies()`, Tailwind classes estándar) antes de instalar paquetes npm o crear helpers redundantes.

4. **¿Pertenece al SSOT Canónico (`ear-os-ssot.ts`)?**
   - Toda constante de dinero (350 € base de Edwin Agudelo, 550 € con 100 km, 100 € fianza deducible, 14.250 € umbral B2G) se importa de `@/lib/ear-os-ssot`.
   - Prohibido hardcodear números mágicos de tarifas en componentes.

5. **¿Se puede resolver en una sola línea o expresión concisa?**
   - Preferir funciones puras de 1 línea, operadores ternarios limpios y composición declarativa sobre bloques de 50 líneas de código imperativo.

6. **Si no hay alternativa: escribir el código nuevo mínimo necesario.**
   - Escribir únicamente las líneas estrictamente requeridas para cumplir los criterios de aceptación y pasar las 17 compuertas con Exit Code 0.

---

## Modos de Operación

- **Mode LIGHT**: Para prototipos rápidos y landing pages de la Malla de Dominancia (prioriza reutilización visual).
- **Mode FULL** (Predeterminado): Para componentes de frontend, controladores y hooks de negocio.
- **Mode ULTRA**: Para APIs de facturación, pasarelas Stripe y endpoints de autenticación (máxima concisión, cero dependencias adicionales).

---

## Resultado Verificable
- 25% a 30% menos de líneas escritas por tarea.
- Cero archivos huérfanos generados.
- 100% de cumplimiento con `npm run lint` y `npm run audit:ssot`.

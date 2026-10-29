# WAVE 45 · Ω-SPATIAL KERNEL + DEEPSEEK REASONING ROUTER
**Fecha:** 2026-10-27 · **Rol:** Arquitecto Forense (Antigravity) · **Estado:** VERIFICADO

---

## 1. VEREDICTO FORENSE: LA MISIÓN CITABA DOS HERRAMIENTAS FANTASMA

Antes de picar una línea se auditó la existencia real de lo pedido. Resultado en disco y registro:

| Afirmación recibida | Evidencia máquina | Veredicto |
|---|---|---|
| Descargar «Claude Web Kit» | `GET registry.npmjs.org/claude-web-kit` → **HTTP 404** | ❌ NO EXISTE |
| …y exprimir su WebGL | GitHub: 175 repos, ninguno oficial ni de UI (`solanabr/ai-kit` = configs de Solana) | ❌ SIN OBJETO |
| Ir a «HorizonX» | `GET registry.npmjs.org/horizonx` → **HTTP 404**. GitHub `HorizonX` = **servidor privado de Final Fantasy XI** (`HorizonXI-Linux-Installation`, `HorizonXServer`) | ❌ NO ES UI |
| Conectar DeepSeek | `src/lib/compiler/deepseek-inference.ts` (chat + search + fetch) **ya en producción** | ✅ YA EXISTE |
| Base WebGL | `three@0.186.0`, `@react-three/fiber@9.7.0`, `@react-three/drei@10.7.9`, `shadergradient@1.3.5` **ya instalados** | ✅ YA EXISTE |

**Conclusión:** no faltaba herramienta. Faltaba **gobernanza**: nadie medía cuántos canvas,
rAF y `devicePixelRatio` sin recortar estaban sangrando la conversión. Instalar otro paquete
habría sido una fachada más cara.

`RETO_ESPEJO` aplicado: se sustituyó «descarga X» por «construye el kernel que hace medible X».

---

## 2. LO ENTREGADO (7 ficheros, 0 modificaciones a ZONA CERO)

| Fichero | Función | Por qué importa |
|---|---|---|
| `src/lib/spatial/gpuCapability.ts` | SSOT de capacidad GPU: sondeo WebGL con `WEBGL_lose_context`, 4 tiers, DPR/partículas/octavas/FPS por tier | Una sola fuente de verdad; cero `devicePixelRatio` salvaje |
| `src/lib/hooks/useSpatialBudget.ts` | Presupuesto reactivo, SSR determinista | El primer render siempre es `STATIC_BUDGET` → **0 hydration mismatch** |
| `src/lib/hooks/useStageActivation.ts` | Puerta IntersectionObserver + Page Visibility | Mata el rAF zombi fuera de viewport |
| `src/components/spatial/SovereignWebGLStage.tsx` | Escenario gobernado con `aspect-ratio` + póster debajo | **CLS 0** por construcción, no por suerte |
| `src/lib/ai/sovereignReasoningRouter.ts` | Cascada DeepSeek → Claude 3.5 → Ollama → aviso determinístico, con provenance SHA-256 | Un solo punto de verdad para la IA; ningún proveedor bloquea la UX |
| `scripts/audit_webgl_friction.cjs` | 6 reglas de fricción WebGL, baseline declarada, `--strict` | **El comando** que convierte «CLS corregido» en un Exit Code |
| `scripts/verify_spatial_budget.ts` | 6 casos + DPR + partículas + SSR | Prueba máquina del kernel |

---

## 3. CÓMO SE EXPRIME AL 100% (ORDENADO POR EUROS, NO POR ESTÉTICA)

### P0 — Deuda ya medida (40 hallazgos reales, `.antigravity/webgl_friction_baseline.json`)
| Regla | Nº | Qué cuesta hoy | Pago |
|---|---|---|---|
| `R03_MOTION_UNGOVERNED` | 18 | Escenas que ignoran `prefers-reduced-motion`: accesibilidad WCAG 2.2 y batería | Envolver en `<SovereignWebGLStage>` |
| `R02_RAF_UNGUARDED` | 16 | Bucles vivos con la pestaña en segundo plano → CPU/batería | `useStageActivation` |
| `R01_DPR_UNCLAMPED` | 3 | Render a 3x en móvil = 9× píxeles | `effectiveDevicePixelRatio` |
| `R06_CANVAS_NO_RESERVE` | 3 | `<canvas>` sin reserva → CLS al montar | `aspect-ratio` en el contenedor |

**Comando de verdad:** `npm run audit:webgl` (Exit 0 = no hay deuda nueva) · `npm run audit:webgl:strict` (deuda total).

### P1 — Palancas de rendimiento con retorno inmediato
1. **`frameloop="demand"`** en R3F para todo lo que no sea animación continua: se pinta solo cuando cambia algo.
2. **`gl={{ antialias: false, powerPreference: 'high-performance' }}`** y `dpr` recortado: en OLED el antialias nativo apenas se percibe y cuesta ~40% de fill-rate.
3. **Instancing obligatorio** por encima de ~200 objetos (`InstancedMesh`, ya usado en `GravityEngine`). 2.000 `Mesh` sueltos = 2.000 draw calls.
4. **Texturas `KTX2`/`Basis`** y geometría comprimida (`meshopt`): −70% de VRAM en móvil.
5. **`highp` → `mediump`** en fragment shaders de móvil: el `fbm` de 5 octavas en `highp` es el mayor coste por píxel de `VanguardFluidBackground`.
6. **`fbmOctaves` del presupuesto**: el shader debe recibir las octavas como `#define`, no tener 5 fijas.

### P2 — Percepción premium sin coste
7. Animar **solo `transform`/`opacity`** (nunca `height`, `width`, `top`, `left`).
8. Hover con `will-change` puntual y `translateZ(0)`, liberado al terminar.
9. Póster con `fetchpriority="high"` + `width`/`height` reales: es el LCP, no el canvas.

### P3 — Vanguardia real (experimental, no bloquea ventas)
10. **WebGPU** vía `three/webgpu` (r186 lo incluye) con detección de `navigator.gpu` y caída a WebGL2. Solo cuando P0 esté a cero: hoy sería joyería sobre un motor que gotea.

---

## 4. «HORIZON» — QUÉ SE EXTRAE Y QUÉ NO SE INSTALA

El objetivo real detrás de «HorizonX» es una estética de **panel de datos premium**
(KPI cards, shell con sidebar, data grid, gráficas). Eso NO se compra: se destila.

**Decisión:** no se instala ningún template ajeno.
- Horizon UI es **MIT**, pero se apoya en **Chakra UI**: meterlo aquí sería un **segundo design system**
  conviviendo con Tailwind 3 + `#09090d` OLED, inflando el bundle y violando §7
  («prohibido subir al cliente una librería entera para una sola interacción»).
- Un template copiado arrastra su paleta lavada y su tipografía genérica: es **AI-Slop por diseño**.

**Se extraen PATRONES, no dependencias** (coste 0 kB, licencia 0):

| Patrón de panel premium | Dónde se materializa en EAR OS | Ya existe |
|---|---|---|
| KPI card con delta y sparkline | `recharts` + `chart.js` ya instalados | ✅ |
| Shell con sidebar colapsable | `admin` layout + `SovereignMobileHUD` | ✅ |
| Data grid con filtros | tabla propia admin + Prisma | ✅ |
| Command palette (⌘K) | `cmdk@1.1.1` instalado | ✅ |
| Tabla comparativa de tiers | `SClassIrresistibleOffer` | ✅ |
| Escaparate inmersivo | `SovereignWebGLStage` (nuevo) | ✅ |

> Regla: si un patrón necesita un paquete nuevo, se rechaza salvo que sustituya a otro.
> Hoy EAR OS tiene **todo lo necesario** para un panel de nivel estudio de caso.

---

## 5. DEEPSEEK: CÓMO SE CONECTA Y CÓMO SE MIDE

### Cableado (ya existente, ahora orquestado)
```
runSovereignReasoning({ prompt, system?, history?, allowCloud? })
   ├─ 1. DeepSeek          DEEPSEEK_API_KEY      (deepseek-chat / deepseek-reasoner)
   ├─ 2. Claude 3.5 Sonnet ABACUS_API_KEY        (RouteLLM, OpenAI-compatible)
   ├─ 3. Ollama local      OLLAMA_HOST/:11434    (RX 7900 XTX, 24 GB)
   └─ 4. Aviso determinístico                    (honesto: NO simula IA)
```

### Garantías del router
- **Nunca lanza.** Toda excepción se convierte en un `attempt` fallido y se pasa al siguiente escalón.
- **Provenance SHA-256** por respuesta (`provider|model|content|intentos`): sin esto no hay auditoría ni caso de estudio.
- **`allowCloud: false`** corta toda salida a Internet en una demo con cliente delante (RGPD).
- **Timeout duro** (8 s DeepSeek / 9 s Abacus / 9 s Ollama): ningún proveedor bloquea la UX.
- **Cero cifras en el prompt.** El preámbulo prohíbe inventar precios, comisiones, depósitos y
  teléfonos: esos datos salen del SSOT. Hardcodear un 350 € aquí sería Veto §11.1.

### Consumo correcto
```ts
// route handler o Server Action — NUNCA en un componente cliente
import { runSovereignReasoning } from '@/lib/ai/sovereignReasoningRouter';

const result = await runSovereignReasoning({
  prompt: consulta,
  history: turnosPrevios,
  allowCloud: true,
});
// result.provenance → se persiste junto al lead para auditoría
```

> ⚠️ El módulo importa `node:crypto`. Jamás debe entrar en un bundle de cliente.

---

## 6. EL CASO DE ESTUDIO: 6 MÉTRICAS PUBLICABLES (Y CÓMO SE CAPTURAN)

Un caso de estudio sin máquina es marketing. Estas seis tienen instrumento:

| # | Métrica | Instrumento real | Dónde vive |
|---|---|---|---|
| 1 | Tier asignado por dispositivo | `data-spatial-tier` en el DOM | `SovereignWebGLStage` |
| 2 | Escenas realmente activas vs. montadas | `data-spatial-active="0/1"` | `SovereignWebGLStage` |
| 3 | Motivo de degradación (a11y/save-data/GPU) | `data-spatial-reason` | `SovereignWebGLStage` |
| 4 | Deuda WebGL por regla | `npm run audit:webgl:strict` | `scripts/audit_webgl_friction.cjs` |
| 5 | Corrección del kernel (tiers, DPR, SSR) | `npm run test:spatial` | `scripts/verify_spatial_budget.ts` |
| 6 | Latencia y proveedor real de cada respuesta IA | `attempts[]` + `provenance` | `sovereignReasoningRouter` |

**Narrativa honesta del caso de estudio:** «medimos la fricción, la convertimos en comandos,
y el comando bloquea la regresión». Eso es lo que ninguna agencia puede copiar con un template.

---

## 7. SCORECARD Ω-DIAMANTE (LEY DEL AUDITOR REAL)

| # | Ítem | Comando | Estado |
|---|---|---|---|
| 1 | tsc Exit 0 | `node ./node_modules/typescript/bin/tsc --noEmit` | ✅ |
| 2 | eslint Exit 0 | `node ./node_modules/eslint/bin/eslint.js <5 ficheros>` | ✅ |
| 3 | 0 `any` | diff + eslint | ✅ |
| 4 | 0 `verified:true` falso | `npm run audit:phone` (no tocado) | ✅ n/a |
| 5 | 0 handler huérfano | `npm run verify:leadgate` (no tocado) | ✅ n/a |
| 6 | 0 precio hardcodeado | el preámbulo del router **prohíbe** cifras; ninguna nueva | ✅ |
| 7 | 0 TODO | diff | ✅ |
| 8 | 0 secretos en cliente | `node:crypto` solo server; `DEEPSEEK_API_KEY` server-only | ✅ |
| 9-10 | ISO 25010 / CISQ | — | ❌ SIN EVIDENCIA |
| 11 | ASVS L3 | escape por API endurecida, no auditado en este bloque | ❌ |
| 12-13 | Lighthouse 100×4 / CWV p75 | — | ❌ SIN EVIDENCIA |
| 14 | WCAG 2.2 | `prefers-reduced-motion` respetado por diseño, sin auditoría de contraste | ⚠️ parcial |
| 15 | Rich Results | — | ❌ |
| 16-17 | Duplicación / provenance | `node scripts/audit_landing_duplication.cjs` (no tocado) + provenance SHA-256 **nuevo** | ⚠️ |
| 18 | build <60 s · edge <1 MB | `npm run audit:residues` (no ejecutado en este bloque) | ⚠️ |
| 19 | Idempotencia Stripe | `npm run sim:event` (no tocado) | ✅ n/a |
| 20 | n8n no bloqueante | — | ❌ |

**Firma:** `SELLO CONDICIONADO 8/20` del Núcleo. Bloque P1, no P0-dinero.
Fingir 20/20 aquí sería el fraude que el propio §9 prohíbe.

---

## 8. DEUDA DECLARADA Y PLAN DE PAGO

`40 hallazgos` sellados en `.antigravity/webgl_friction_baseline.json`. **La baseline no crece
sin sanción del CEO**; solo se paga.

| Oleada | Objetivo | Hallazgos que caen | Verificación |
|---|---|---|---|
| W46 | `VanguardFluidBackground` + `GravityEngine` al kernel | −6 | `npm run audit:webgl` |
| W47 | Canvas de firma y VIMUME (`DigitalSignaturePad`, `VimumeOscilloscope40Hz`) | −6 | idem |
| W48 | Resto de móvil-fusion y neural | −16 | idem |
| W49 | Sanbox visual (no comercial, último) | −12 | idem |

Cada oleada cierra con `--seal-baseline` y el contador **debe bajar**. Si sube, se rechaza el bloque.

---

## 9. CIERRE

```
HECHO_VERIFICADO:  Kernel Ω-Spatial con 4 tiers + escenario CLS 0 + router DeepSeek→Claude→Ollama
                   con provenance SHA-256. 7 ficheros nuevos, ZONA CERO intacta.
RETO_ESPEJO:       «Claude Web Kit» y «HorizonX» no existen (npm 404 / FFXI server).
                   Criterio más duro: auditor ejecutable que bloquee regresión. Lo hay.
HIPÓTESIS:         El LCP mejora solo si el póster declara width/height. Los 40 hallazgos
                   del baseline son deuda real, no ruido (revisados uno a uno por regla).
DECISIÓN:          No instalar Horizon UI (Chakra + 2º design system + bundle). Se extraen
                   patrones sobre lo ya instalado (recharts, cmdk, Tailwind).
RIESGOS:           Montar el escenario sin póster dimensionado empeora el LCP aunque el CLS sea 0.
VALIDACIONES:      audit --strict Exit 1 (deuda real) · --seal-baseline Exit 0 (40) ·
                   audit default Exit 0 · audit --include nuevo Exit 0 · test:spatial Exit 0 ·
                   eslint Exit 0 · tsc --noEmit Exit 0.
Ω-DIAMANTE:        8/20 · ❌ 9,10,11,12,13,15,16,18,20 (sin evidencia máquina)
ESTADO_BLOQUE:     VERIFICADO (kernel y router). Deuda de despliegue declarada: 0 consumidores.
SIGUIENTE_PASO:    W46 — migrar VanguardFluidBackground al kernel y re-sellar baseline.
```

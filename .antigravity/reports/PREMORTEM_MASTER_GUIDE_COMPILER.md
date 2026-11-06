# PREMORTEM G-8 — GUÍA MAESTRA DEL COMPILADOR DE INTENCIÓN

**Bloque:** `MASTER-GUIDE-COMPILER-EXECUTABLE`
**Fecha:** 2026-11-04 · **Estado:** `SOSPECHOSO` (sin Exit Code observado en esta sesión)
**Ficheros tocados:** `src/lib/compiler/master-guide.ts` (nuevo), `src/lib/compiler/omega-intent-compiler.ts`,
`src/app/api/admin/compile-intent/route.ts`, `src/app/(admin)/admin/compiler/page.tsx`,
`src/lib/config/admin-navigation.ts`, `scripts/verify_master_guide.ts` (nuevo), `package.json`.

---

## 1) ¿Cumple el `done_when` o he entregado un primo hermano?

Entregado, con ruta:línea y no por impresión:

- La guía **existe como dato ejecutable**: `master-guide.ts` declara 4 objetivos, 4 tácticas y 3
  destinatarios, cada uno con `directives` (órdenes que viajan al grafo) y `aliases` (deducción).
- El compilador **la aplica**: `omega-intent-compiler.ts:531-558` resuelve la guía y la inyecta en el
  macro-script; `:620-625` sella `GUIA_OBJETIVO / GUIA_TACTICA / GUIA_DESTINATARIO / GUIA_DIRECTIVAS`
  dentro del YAML. Dos tácticas distintas ya no pueden producir el mismo grafo.
- El endpoint **la valida**: `route.ts:44-46` (`z.enum` cerrado sobre las constantes del SSOT) y
  `route.ts:137-144` (resolución en servidor). Un eje inventado devuelve `400`.
- La pantalla **la consume del SSOT**: `page.tsx:527 / 545 / 563` mapean `MASTER_OBJECTIVES`,
  `MASTER_TACTICS`, `MASTER_TARGETS`. Mueren los tres arrays duplicados.
- Se corrige además el gobierno que contradecía la doctrina: `Build Netlify < 80 MB` → despliegue
  exclusivo Coolify con los umbrales reales (60 s / 50 MB / 1 MB), y se derivan los importes del SSOT.
- **Lo que NO está probado:** no he visto un Exit Code. `run_commands` no observa completitud en esta
  sesión (incidente ya registrado el 2026-10-31 en el mismo ledger). Por eso el sello es `SOSPECHOSO`.

## 2) ¿Qué asunciones frágiles sostienen esto?

1. **Que `tsx` resuelva el alias `@/`** al importar `omega-intent-compiler` desde el script. Si no lo
   hace, `verify:master-guide` falla con error de módulo (visible, no silencioso) y el gate se detiene.
2. **Que `ear-os-ssot.ts` sea importable desde cliente.** Ya lo era por vía de
   `quantum-oracle-engine.ts` (que la pantalla importa desde antes), así que el riesgo es bajo pero no nulo.
3. **Que `z.enum` de Zod 4 acepte tuplas `as const` importadas.** Es el mismo patrón que ya usa el
   propio fichero (`ORACLE_PERSONAS`, `COMPILE_MODES`), luego la evidencia es fuerte.
4. **Que el esquema de `tasks/inject` use `MAX_ACTION_LEN = 2000`** para `action`. No pude leer el
   bloque `injectBodySchema` completo (el lector truncó ese tramo). Por eso el recorte es **preventivo**:
   acoto a 1800/1900/7800/480, que cumplen cualquiera de los límites declarados en el fichero.

## 3) ¿Qué alternativa descarté y por qué técnico?

- **Solo cambiar los rótulos** (lo cosmético que pedía la captura). Descartado: habría dejado intacta la
  causa raíz —la guía seguía sin gobernar el grafo— y el CEO habría vuelto a ver el mismo problema.
- **Traducir "DAG" a "grafo" en toda la pantalla.** Descartado: el tramo 620-700 no era legible para mí
  al editar y habría producido un híbrido incoherente (justo el "Frankenstein" que el CEO prohíbe).
  Se mantiene «DAG» como término técnico **consistente**; se eliminan los nombres propios y marcas.
- **Reescribir la pantalla entera.** Descartado: 758 líneas con manejadores que no podía leer completos;
  el riesgo de romper reactividad superaba el beneficio.

## 4) ¿Qué se rompe y cómo lo detectamos antes que el cliente?

- **Contrato del endpoint:** la pantalla ahora manda tres campos nuevos y el esquema es `.strict()`.
  Si un cliente antiguo mandara un eje distinto, recibiría `400` con `issues[]`. Lo detecta
  `verify:master-guide` (aserción de cableado) y, en producción, el `400` inmediato en el panel.
- **Tamaño del payload:** el DAG crece ~600 caracteres por las directivas. `estimatedTokens` se recalcula
  solo; el recorte de `scaffold` a 7800 mantiene el contrato.
- **Navegación:** el rótulo del módulo cambió (`Compilador Maestro`) y el `badge` (`INTENCIÓN`).
  Si algún índice buscara el texto antiguo, `verify:master-guide` lo grita en la aserción de navegación.
- **PostgreSQL / navegador:** este cambio no toca base de datos ni depósito. El único contacto con dinero
  es texto derivado del SSOT (`DEPOSITO_STRIPE_EUR`, `TARIFA_BASE_SOLISTA_EUR`, `SAFE_LCSP_CEILING_EUR`),
  que no se recalcula aquí.

## 5) ¿Qué acepto al firmar esto como propio?

Acepto que la guía del CEO **ya no es un adorno**: si elige «Venta Elegante», el grafo lo dice y las
directivas lo obligan. Acepto también lo incómodo: **no puedo firmar `VERIFICADO`** sin Exit Code. Lo que
firma este documento es un `SOSPECHOSO` con el hueco escrito, el comando exacto que lo cierra y las
aserciones que lo cerrarán.

---

## Comandos que convierten esto en `VERIFICADO`

```powershell
npm run verify:master-guide   # debe imprimir: VERIFICADO · N/N casos. Exit 0.
npm run typecheck             # Exit 0
npm run lint                  # Exit 0
```

Si `verify:master-guide` falla por resolución de alias, el punto exacto a mirar es la primera línea de
imports de `scripts/verify_master_guide.ts`; la solución mínima es cambiar
`'../src/lib/compiler/omega-intent-compiler'` por una ruta relativa sin alias (ya lo es) y comprobar que
`tsconfig.json` expone `paths` a `tsx`.

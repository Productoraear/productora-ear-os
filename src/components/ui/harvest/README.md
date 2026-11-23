# src/components/ui/harvest/

> Zona de aterrizaje de componentes de **conversión pública** saneados (21st.dev).
> Material crudo en `scratch/harvest_inbox/` → transpirado por
> `scripts/batch_harvest_transpiler.cjs` → aquí.

## Ley de esta carpeta
1. **Nada entra a mano.** Todo fichero de aquí es salida de
   `node scripts/batch_harvest_transpiler.cjs --target=ui-harvest --write`.
2. **Paleta canónica Aura Onyx.** Fondo `#030305`, bordes `border-white/10`, acentos
   por defecto `diamondRed` (`#E11D48`). Fuente única: `src/lib/brand-palette.ts`.
3. **Prohibido el morado** (UNSLOP / INV-21): `purple-*`, `violet-*`, `indigo-*`,
   `#8b5cf6`, gradientes `from-purple-500` no entran.
4. **Sin dependencias externas.** Solo `react`, `next`, `@/lib/utils` y la familia
   `@/components/ui/*`. Un componente cosechado que arrastre `framer-motion`, `gsap` o
   `three` se rechaza: el coste de bundle es presupuesto (INV-15).
5. **Geometría fija.** Si el componente carga datos, debe traer skeleton con
   `min-h-*` reservado (INV-18: CLS ≤ 0,02 · INV-11: CLS ≤ 0,05).
6. **Cero texto de marca ajena** (JUR-4): nombres, logos o testimonios del estudio
   original se sustituyen por copy propio de Productora EAR.
7. **Solo componentes hoja.** Nunca `page.tsx`, `layout.tsx` ni `route.ts` aquí:
   las rutas públicas viven en `src/app/` y las audita `audit:cta-matrix`.

## Cómo consumirlo
```ts
import { MiComponente } from '@/components/ui/harvest/MiComponente';
```
Los componentes de aquí son **borradores de estudio**: el CEO los promociona al
Theme &amp; Component Studio (`/admin`) antes de que toquen una landing en producción (JUR-1).

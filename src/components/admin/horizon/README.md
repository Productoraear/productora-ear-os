# src/components/admin/horizon/

> Zona de aterrizaje de **pantallas y widgets de panel** saneados (HorizonX PRO).
> Material crudo en `scratch/horizon_inbox/` → transpirado por
> `scripts/batch_harvest_transpiler.cjs` → aquí.

## Ley de esta carpeta
1. **Nunca `page.tsx`.** Los widgets de aquí son componentes hoja que el cockpit importa.
   Una `page.tsx` bajo `src/app/(admin)/admin/` sin registrar en
   `src/lib/config/admin-navigation.ts` rompe la **puerta B** de `audit:admin-ecosystem`
   (módulo huérfano) y tumba el arnés de 22 compuertas.
2. **Prohibido un registro de navegación paralelo** (regla C). No declares aquí
   `const X_NAV = [...]`, `X_TABS`, `X_ROUTES`, `X_URLS` ni `X_DIRECTORY` con rutas
   `/admin…`: la fuente única es `admin-navigation.ts`.
3. **Telemetría honesta (AF-1 / AF-2 / INV-16 / INV-3 en doctrina).** Todo widget que
   muestre métricas debe declarar su procedencia: `source="live"` con sonda real, o
   `mode="SIMULADO"` cuando los datos son sintéticos. **Prohibido el verde por defecto:**
   si no se ejecutó la sonda, el estado es `SIN_EVIDENCIA`, nunca `OK`.
4. **Cero cifras tecleadas a mano** (regla E de `audit:admin-ecosystem`): «22 pantallas»,
   «84K B2B» o similares se derivan de la fuente, no del copy.
5. **Cronómetros sin layout shift** (INV-18): `tabular-nums` obligatorio para que el
   contador no cambie de ancho entre frames (CLS ≤ 0,05 · INV-11).
6. **Accesibilidad sin trampas:** nada de `aria-hidden` sobre datos de negocio, ni
   `role="progressbar"` estático presentando un 100 % decorativo. Usa
   `aria-live="polite"`, `role="timer"` o `role="status"` con `aria-busy` real.
7. **Cero secretos de servidor** (INV-07 / SEC-3): aquí solo `NEXT_PUBLIC_*` no sensibles;
   un widget `"use client"` nunca importa `prisma`, `server-only` ni claves.
8. **Paleta Aura Onyx:** fondo `#030305`, superficies `#0c0d14` / `#11131e`,
   bordes `border-white/10`, textos `neutral-*`. Prohibido el morado (INV-21).

## Relación con el Theme &amp; Component Studio
Estos widgets son la **materia prima visual** del estudio de temas del CEO. El control
soberano del diseño vive en `/admin` y se apoya en `src/lib/brand-palette.ts` como SSOT
de tokens; un widget de esta carpeta nunca declara su propia paleta.

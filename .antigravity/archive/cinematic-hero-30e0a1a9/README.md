# ARCHIVO · HERO CINEMATOGRÁFICO «TASTE ENGINE VELOCITY» (commit 30e0a1a9)

**Estado:** `ARCHIVADO` · **Fecha:** 2026-11-26 · **Autoridad:** CEO (Opción B aprobada)
**Sustituido por:** `src/components/home/ScrollytellingCashTunnel.tsx` (commit `79fb6a14`)

---

## Por qué está aquí

El commit `30e0a1a9` introdujo un hero cinematográfico de 4 actos (motor Canvas 2D)
que se montaba en la Home. El commit `79fb6a14` lo **sustituyó** por el Scrollytelling
Cash-Tunnel. Al quedar desmontado, sus 16 ficheros eran **código muerto**:

- `npm run verify:cinematic` pasó a `verdict: SOSPECHOSO` / **Exit 1**
  (0 canvas, 0 capas, `act4Cta: null`): una puerta huérfana en rojo.
- Publicar 2.760 líneas huérfanas en producción viola CHG-3 (higiene de repo).

Se archiva **con historia preservada** (`git mv`) en lugar de borrarse: el
rollback queda ensayado y a un comando de distancia (CHG-2).

## Contenido (16 ficheros)

| Ruta original | Nota |
|---|---|
| `src/components/home/CinematicHeroSpot.tsx` | Componente raíz del hero |
| `src/components/home/cinematic/*` | 11 ficheros (stage, rail, maitre, sprites, math…) |
| `src/types/cinematic-hero.ts` | Tipos del motor |
| `scripts/verify_cinematic_hero.cjs` | Verificador (puppeteer) — obsoleto |
| `scripts/build_cinematic_frames.cjs` | Generador de frames — obsoleto |
| `public/images/cinematic/acto-01-brasa.webp` | Huérfano (sólo lo usaba `cinematicScenes.ts`) |
| `public/images/cinematic/acto-02-escena.webp` | Huérfano (sólo lo usaba `cinematicScenes.ts`) |

> **NO archivados** (siguen vivos, los usa el Cash-Tunnel):
> `public/images/cinematic/acto-01-sala.webp`,
> `public/images/cinematic/acto-02-directo.webp`,
> `public/images/cinematic/acto-04-plaza.webp`.

## Restauración (rollback < 5 min · CHG-2)

```powershell
# 1 · Devolver los ficheros a su ruta original
git mv .antigravity/archive/cinematic-hero-30e0a1a9/src/components/home/CinematicHeroSpot.tsx src/components/home/CinematicHeroSpot.tsx
git mv .antigravity/archive/cinematic-hero-30e0a1a9/src/components/home/cinematic src/components/home/cinematic
git mv .antigravity/archive/cinematic-hero-30e0a1a9/src/types/cinematic-hero.ts src/types/cinematic-hero.ts
git mv .antigravity/archive/cinematic-hero-30e0a1a9/scripts/verify_cinematic_hero.cjs scripts/verify_cinematic_hero.cjs
git mv .antigravity/archive/cinematic-hero-30e0a1a9/scripts/build_cinematic_frames.cjs scripts/build_cinematic_frames.cjs
git mv .antigravity/archive/cinematic-hero-30e0a1a9/public/images/cinematic/acto-01-brasa.webp public/images/cinematic/acto-01-brasa.webp
git mv .antigravity/archive/cinematic-hero-30e0a1a9/public/images/cinematic/acto-02-escena.webp public/images/cinematic/acto-02-escena.webp

# 2 · Remontar en la Home (sustituir <ScrollytellingCashTunnel /> por <CinematicHeroSpot />)
# 3 · Restaurar el mapa de rutas de scripts/audit_cls_budget.cjs (bloque W52)
# 4 · Restaurar "verify:cinematic" en package.json
```

Atajo nuclear (si el archivo se corrompe):

```powershell
git checkout 30e0a1a9 -- src/components/home/CinematicHeroSpot.tsx src/components/home/cinematic src/types/cinematic-hero.ts scripts/verify_cinematic_hero.cjs scripts/build_cinematic_frames.cjs
```

## Trazabilidad

- Commit de archivo: `feat(archive): retirar hero cinematográfico muerto y aislar idempotencia del Cash-Tunnel`
- Invariantes afectados: INV-08 (idempotencia), CHG-2 (rollback), CHG-3 (higiene de repo)
- Guardián activo del sustituto: `scripts/verify_cashtunnel_idempotency_scope.cjs`

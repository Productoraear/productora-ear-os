---
name: git-atomic-commit
description: Genera commits convencionales y atómicos sobre árbol limpio. Exige prefijo feat fix refactor docs test chore perf, compuertas verificadas con Exit 0 antes de firmar, una sola responsabilidad por commit y cero mezclas de formato con lógica.
lifecycle_phase: SHIP (Deploy | Prod)
command: /ship
framework: Conventional Commits · CHG-1..CHG-4 (.clinerules §9)
governance: ANTIGRAVITY OMEGA v11.0 (S-CLASS)
---

# Git Atomic Commit · Commits Convencionales y Árbol Limpio (EAR OS)

## Misión
Que cada commit sea reversible en menos de 5 minutos y explicable en una línea: un cambio, una responsabilidad, una prueba que lo respalda.

## Reglas de Oro

### 1. Prefijo convencional obligatorio
`feat:` nueva capacidad · `fix:` corrección de defecto · `refactor:` misma salida, mejor estructura · `docs:` documentación y doctrina · `test:` arnés y pruebas · `chore:` infraestructura y mantenimiento · `perf:` rendimiento.

Formato: `<tipo>(<ámbito opcional>): <imperativo en presente> <qué cambia>`

Ejemplo correcto:
`feat(skills): registra seo-optimizer, security-auditor, wcag-accessibility y git-atomic-commit`

Ejemplo prohibido:
`varios cambios y arreglos`

### 2. Atomicidad estricta
- Un commit = una responsabilidad. Prohibido mezclar formateo masivo con cambio de lógica en el mismo commit (imposibilita el `git revert` quirúrgico).
- Prohibido mezclar ficheros de negocio con refactors de estilo en el mismo commit.
- Si una tarea toca más de 5 ficheros con responsabilidades distintas, se descompone en commits en serie (FLUENCY-2).

### 3. Compuertas antes de firmar (Exit 0 exigido)
```powershell
npm run typecheck   # tsc --noEmit → Exit 0
npm run lint        # 0 errores en los ficheros tocados
npm run gate:prepush
```
Un commit con `Exit ≠ 0` en cualquiera de las tres no se firma: se declara `SOSPECHOSO` (SIG-1).

### 4. Inspección previa obligatoria (CHG-4)
```powershell
git --no-pager status
git --no-pager diff --stat
```
- 0 ficheros > 1 MB · repo < 50 MB · 0 bóvedas pesadas · 0 secretos (CHG-3).
- Los ficheros sin intención de commitear (`reports/`, capturas, artefactos de auditoría) no se añaden al índice.

### 5. Destino único y rollback ensayado
- Deploy exclusivamente a `origin` (`main`) → Coolify VPS Bare-Metal (CHG-1).
- Todo commit debe poder revertirse en < 5 minutos: si el mensaje no permite identificar qué se revierte, el commit es demasiado grande (CHG-2).

## Tabla Anti-Racionalización
| Excusa común del agente | Réplica de ingeniería senior |
| :--- | :--- |
| *"Hago un commit con todo y ya lo ordeno luego."* | Un commit monolítico convierte el rollback en una auditoría manual. |
| *"El lint tarda, lo dejo para el push."* | El prepush bloqueante ya existe: adelantar la compuerta cuesta segundos, saltarla cuesta un deploy roto. |
| *"Son solo cambios de formato."* | El formato mezclado con lógica contamina el `git blame` y oculta el cambio real. |

## Criterios de salida (Done)
1. Mensaje con prefijo convencional y alcance identificable.
2. `npm run typecheck` y `npm run lint` con Exit 0 sobre los ficheros tocados, citados en el log.
3. `git --no-pager diff --stat` revisado: un solo tema por commit.
4. Entrada en `CLINE_EXECUTION_LOG.md` con rutas y línea comprobables.

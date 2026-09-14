# GOBERNANZA AGENT SKILLS :: CICLO DE VIDA DE INGENIERÍA S-CLASS
Basado en `addyosmani/agent-skills` (Addy Osmani, Google Chrome).

Toda tarea ejecutada en Productora EAR OS por cualquier agente (Antigravity, Cline, Qwen, Claude) debe transitar por las 7 compuertas de calidad canónicas:

```
[DEFINE]      [PLAN]       [BUILD]      [VERIFY]     [REVIEW]     [SIMPLIFY]     [SHIP]
 Idea | Refine -> Spec | PRD -> Code | Impl -> Test | Debug -> QA | Gate -> Refactor | Clean -> Deploy | Prod
   /spec        /plan        /build       /test        /review    /code-simplify    /ship
```

---

## 1. /spec — FASE DEFINE (Idea | Refine)
- **Principio**: Spec before code. No implementation without unambiguous acceptance criteria.
- **Acción**: Capturar los requerimientos, los tipos de entrada y salida, y los límites del sistema antes de modificar archivos.
- **Anti-Rationalization**: Ninguna tarea es "demasiado simple" para omitir la definición de criterios de éxito.

---

## 2. /plan — FASE PLAN (Spec | PRD)
- **Principio**: Small, atomic, dependency-ordered tasks.
- **Acción**: Desglosar en tareas atómicas registradas en `.antigravity/tasks_queue.json` con estado `PENDING`.
- **Anti-Rationalization**: Desglosar una tarea compleja en 3-5 pasos secuenciales previene el colapso del contexto (ZTM).

---

## 3. /build — FASE BUILD (Code | Impl)
- **Principio**: Build incrementally, one slice at a time.
- **Acción**: Implementar componentes modulares bajo Next.js App Router (Server Components por defecto, `"use client"` únicamente para reactividad DOM).
- **Anti-Rationalization**: Prohibidos los tipos `any` implícitos. Resolver parámetros dinámicos con `await params`.

---

## 4. /test — FASE VERIFY (Test | Debug)
- **Principio**: Tests are proof. Zero tolerance for unverified assumptions.
- **Acción**: Toda tarea debe ser validada con `npx tsc --noEmit` garantizando **Exit Code 0** (cero errores sintácticos o de tipos).
- **Anti-Rationalization**: Asumir que "seguro que compila" cuesta horas de depuración en CI/CD. La prueba es obligatoria.

---

## 5. /review — FASE REVIEW (QA | Gate)
- **Principio**: Gate quality before merge. Senior engineer adversarial review.
- **Acción**: Auditoría de seguridad (HSTS, CSP estricto, protección de claves `process.env.STRIPE_SECRET_KEY`) y anti-slop visual.
- **Reglas Inmutables SSOT**:
  - Base Solista: 350,00 €.
  - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
  - Cierre: 100,00 € depósito en Stripe (Price-Lock).
  - Límite B2G: < 14.250,00 € preventivo y < 75 dB SPL.

---

## 6. /code-simplify — FASE SIMPLIFY (Refactor | Clean)
- **Principio**: Clarity over cleverness.
- **Acción**: Poda de imports no utilizados, eliminación de props huérfanas y erradicación de sobre-ingeniería (YAGNI).
- **Anti-Rationalization**: Si una solución requiere un párrafo para descifrarla, es una mala solución.

---

## 7. /ship — FASE SHIP (Deploy | Prod)
- **Principio**: Faster is safer with verified quality gates.
- **Acción**: Auditoría de tamaño Git (`git status`, peso total del repositorio < 50 MB, cero binarios > 1 MB commiteados).
- **Despliegue**: Despliegue a Netlify Edge / Vercel con rutas verificadas HTTP 200.

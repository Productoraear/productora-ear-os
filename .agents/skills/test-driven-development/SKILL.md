---
name: test-driven-development
description: Construcción incremental con comprobación de tipos y validación de interfaces.
lifecycle_phase: BUILD (Code | Impl)
command: /build
framework: addyosmani/agent-skills
governance: ANTIGRAVITY OMEGA v7.0 (S-CLASS)
---

# BUILD (Code | Impl) :: Test-Driven Development & Incremental Build

## 🎯 Principle
> **Build incrementally, one slice at a time. Red-Green-Refactor with strict typing.**

## ⚡ When to Use
Invoca `/build` para ejecutar las tareas planificadas.

## 📋 Step-by-Step Workflow
1. **Verificar el Estado Previo**: Asegurar que la rama y el árbol de código están limpios.
2. **Implementar una Rodaja a la Vez**: No tocar 10 archivos no relacionados a la vez.
3. **Next.js 14/15 App Router Doctrine**:
   - Server Components por defecto.
   - `"use client"` únicamente en componentes que requieren reactividad DOM o hooks (`useState`, `useEffect`, `useRef`).
   - Parámetros dinámicos siempre asíncronos: `const resolvedParams = await params;`.
4. **Cero Tipos `any`**: Tipos exhaustivos y seguros.

## 🛡️ Anti-Rationalization Table
| Excusa Común del Agente | Réplica de Ingeniería Senior |
| :--- | :--- |
| *"Usar any acelera el desarrollo y no rompe nada."* | any oculta incompatibilidades de API y causa excepciones en tiempo de ejecución en producción. |
| *"Probaré todo al final en el navegador."* | Probar continuamente en cada paso evita tener que deshacer horas de trabajo. |

## ✅ Exit Criteria
- Código implementado cumpliendo al 100% la especificación de tipos.

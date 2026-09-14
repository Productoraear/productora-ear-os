---
name: planning-and-task-breakdown
description: Desglose atómico de tareas en orden estricto de dependencias. Sincronizado con tasks_queue.json.
lifecycle_phase: PLAN (Spec | PRD)
command: /plan
framework: addyosmani/agent-skills
governance: ANTIGRAVITY OMEGA v7.0 (S-CLASS)
---

# PLAN (Spec | PRD) :: Planning & Task Breakdown

## 🎯 Principle
> **Small, atomic, dependency-ordered tasks. Max 20-30 min per execution slice.**

## ⚡ When to Use
Invoca `/plan` una vez aprobada la especificación para construir la "Autopista de Código" (Scaffold) en `.antigravity/tasks_queue.json`.

## 📋 Step-by-Step Workflow
1. **Desglose de Tareas Atómicas**: Dividir el desarrollo en rodajas no mayores de 20-30 minutos de trabajo continuo.
2. **Orden de Dependencias**:
   - Fase 1: Interfaces, tipos y contratos (`src/lib/types/` o engine).
   - Fase 2: Lógica de negocio pura y conectores API (`src/lib/`).
   - Fase 3: Componentes de interfaz de usuario S-Class (`src/app/` o `src/components/`).
   - Fase 4: Enrutamiento, validación y testing (`npx tsc --noEmit`).
3. **Inyección en la Cola**: Escribir en `.antigravity/tasks_queue.json` con estado `PENDING`.

## 🛡️ Anti-Rationalization Table
| Excusa Común del Agente | Réplica de Ingeniería Senior |
| :--- | :--- |
| *"Puedo programar todo en un solo bloque gigante."* | Los monolitos saturan el contexto de tokens y hacen imposible aislar los errores. |
| *"El plan es obvio, no hace falta escribirlo."* | Si es obvio, documentar los 3 pasos toma 30 segundos y garantiza un Exit Code 0. |

## ✅ Exit Criteria
- Tareas registradas en `tasks_queue.json` con rutas exactas y firmas de funciones.

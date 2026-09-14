---
name: spec-driven-development
description: Especificación exhaustiva antes de codificar. Define user stories, contratos de datos y casos límite sin ambigüedades.
lifecycle_phase: DEFINE (Idea | Refine)
command: /spec
framework: addyosmani/agent-skills
governance: ANTIGRAVITY OMEGA v7.0 (S-CLASS)
---

# DEFINE (Idea | Refine) :: Spec-Driven Development

## 🎯 Principle
> **Spec before code. No implementation without unambiguous acceptance criteria.**

## ⚡ When to Use
Invoca `/spec` al inicio de cualquier nuevo módulo, endpoint, refactor o integración técnica en Productora EAR OS.

## 📋 Step-by-Step Workflow
1. **Definir el Problema Real**: Describir la necesidad de negocio (ej. ROI, conversión de leads, automatización de caché).
2. **Contratos de Datos Estrictos**: Definir interfaces TypeScript, tipos de entrada/salida y códigos de respuesta.
3. **Casos Límite y Errores**: Listar qué ocurre si falla el servidor local, si no hay conexión o si los datos vienen vacíos.
4. **Criterios de Aceptación Inmutables**: Reglas de negocio SSOT (Base 350€, Split 80/10/10, Depósito 100€).

## 🛡️ Anti-Rationalization Table
| Excusa Común del Agente | Réplica de Ingeniería Senior |
| :--- | :--- |
| *"Esta tarea es demasiado pequeña para necesitar una spec."* | Las tareas pequeñas sin spec crecen en complejidad oculta y regresiones silenciosas. |
| *"Prefiero programar el código y documentarlo al final."* | La spec define el contrato de éxito comprobable. Sin spec, no hay criterio objetivo de terminado. |

## ✅ Exit Criteria
- Documento de especificación completado sin ambigüedades.
- Contratos de tipos y firmas de funciones redactados.

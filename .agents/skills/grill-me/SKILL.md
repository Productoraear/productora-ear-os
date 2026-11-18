---
name: grill-me
description: Protocolo de interrogatorio socrático previo al desarrollo. Extrae supuestos no escritos de negocio del CEO (tarifas, excepciones territoriales, menús, márgenes de fincas) y genera checkpoints persistentes en disco antes de codificar.
---

# Protocolo Grill Me & Checkpointing de Contexto (EAR OS)

## Principio Supremo
El error más costoso en el desarrollo agéntico no es la falta de herramientas, sino arrancar con un contexto pobre. Cuanto más pobre es el contexto inicial, más suposiciones arbitrarias hace la IA. Grill Me no construye código de inmediato: interroga metódicamente al Director Generalista (Edwin Agudelo) para extraer la verdad de negocio tácita.

---

## 1. El Árbol de Preguntas Socráticas

Antes de iniciar una funcionalidad compleja, el agente formula preguntas ramificadas sobre 4 dimensiones clave:

1. **La Dimensión de Negocio (Monetización)**:
   - ¿A qué puerta pertenece? (`/celebraciones`, `/gobiernos`, `/profesionales`).
   - ¿Qué precio canónico aplica? (Suelo 350 €, Menú Otzarreta 145-185 €, Contratación B2G < 14.250 €).
   - ¿Quién cobra y cómo se divide el split? (80% artista/proveedor, 10% EAR OS, 10% plataforma).

2. **La Dimensión Operativa y Humana (HITL)**:
   - ¿Requiere intervención humana inmediata (+34 693 693 048)?
   - ¿Hasta qué punto se automatiza la respuesta al cliente (5%, 25%, 60%, 90%)?

3. **La Dimensión Territorial y Logística**:
   - ¿Es un servicio en Bizkaia (Otzarreta Derio) o en la zona centro (Méntrida, Madrid, Toledo)?
   - ¿Qué kilometraje está incluido antes del recargo métrico?

4. **La Dimensión de Seguridad y Riesgo**:
   - ¿Afecta a pasarelas bancarias (Stripe), contratos públicos o expedientes clínicos VIMUME?

---

## 2. Checkpointing y Memoria Persistente en Disco

Una sesión de definición estratégica nunca debe perderse en el historial efímero del chat.

- Toda respuesta del CEO se consolida en un documento vivo en:
  `.antigravity/brainstorms/YYYY-MM-DD_<tema>_DECISIONS.md`
- Estructura del Checkpoint:
  - **Fecha y Estado**: [VIGENTE / EN REVISIÓN].
  - **Decisiones Cerradas e Inmutables**: Reglas aprobadas por el CEO.
  - **Dudas Abiertas / Puntos HITL**: Elementos que requieren confirmación presencial.
  - **Siguientes Pasos**: Tareas atómicas listas para descomposición.

Cualquier subagente posterior lee este archivo antes de intervenir, erradicando preguntas repetitivas y suposiciones frágiles.

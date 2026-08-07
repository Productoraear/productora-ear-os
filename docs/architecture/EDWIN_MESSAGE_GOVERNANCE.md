# 🛡️ EAR OS — MESSAGE GOVERNANCE SPECIFICATION

> **Gobernanza del Sistema de Mensajes:** Protocolo para garantizar la coherencia del lenguaje premium a través de todos los canales (Web, RAG, CRM, Fleet OS, Redes Sociales).

## 1. Single Source of Truth (SSOT) Semántico
El archivo `docs/knowledge/EDWIN_ALLOWED_FORBIDDEN_LANGUAGE.md` es la **única fuente de verdad semántica** de Productora EAR. 

Cualquier nuevo prompt de LLM (ChatGPT, Claude, RAG Agent) o plantilla de WhatsApp comercial DEBE compilarse directamente desde esta matriz.

## 2. Puntos de Control de Gobernanza (Checkpoints)

1. **Prompt Ingestion Guard:** El RAG inyecta el `EDWIN_ALLOWED_FORBIDDEN_LANGUAGE.md` en el System Prompt inmutable del agente de atención al cliente.
2. **CRM Template Guard:** Toda plantilla de automatización de WhatsApp/Email pasa por un linter estático que detecta palabras prohibidas como "barato" u "oferta" antes de ser aprobada.
3. **SEO Copy Guard:** Ninguna nueva landing programática puede publicarse si contiene términos del diccionario prohibido.

## 3. Matriz de Escalado de Tono
- Si la interacción pasa de Web -> WhatsApp -> Llamada Comercial, el tono mantiene el nivel de formalidad definido por el Stakeholder (B2C Emotivo vs B2G Oficial).

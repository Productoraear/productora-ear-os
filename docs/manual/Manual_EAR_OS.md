# 📘 MANUAL OPERATIVO Y DE ARQUITECTURA DE EAR OS (DOCUMENTO VIVO SSOT)

> **Manual de Arquitectura y Reconstrucción del Sistema:** Documento maestro inmutable para auditar, operar y reconstruir EAR OS desde cero sin pérdida de contexto, rutas, pagos ni gobernanza de marca.

---

## 1. Arquitectura General y Principios del Sistema
EAR OS es un **Vertical SaaS + RAG Engine** concebido para la industria del entretenimiento y eventos de gala en España y Europa.

- **Stack Tecnológico:** Next.js 14 (App Router), TypeScript 5.x (Strict Path Mapping), Tailwind CSS, Stripe API, Supabase / Prisma DB, RAG Engine con 4.357 chunks semánticos y Fleet OS.
- **Gobernanza Semántica:** Posicionamiento premium (lenguaje sobrio, cero mención de "barato/económico", foco en valor emocional y solvencia escénica).

---

## 2. Inventario de Módulos Core & Estado de Madurez

| Módulo / Dominio | Descripción | Estado Actual | Archivo SSOT |
|:---|:---|:---|:---|
| **Arquitectura Base** | App Router, tsconfig moderno, middleware JWT | ✅ HECHO | `src/app/` |
| **Gobernanza Semántica** | Diccionario de lenguaje, matriz por stakeholder | ✅ HECHO | `docs/brand/EAR_SEMANTIC_DICTIONARY.md` |
| **SEO Geo-Programático** | Reglas anti-doorway (> 45% variación) | ✅ HECHO | `docs/seo/EDWIN_LOCAL_PAGE_UNIQUENESS_RULES.md` |
| **Bóveda RAG** | 4.357 chunks, fallback local, eval 97.8% Recall | ✅ HECHO | `src/data/ear-rag-database.json` |
| **Fleet OS & Tracking** | Centro de mando, latencia 12ms, dead reckoning | ✅ HECHO | `docs/ops/EAR_COMMAND_CENTER_STATE_AUDIT.md` |
| **Hardening & Staging** | Pruebas de estrés (850 req/sec, 10k usrs), GO | ✅ HECHO | `docs/staging/EAR_GO_NO_GO_DECISION.md` |

---

## 3. Instrucciones de Reconstrucción Total
1. **Clonar Repositorio:** `git clone https://github.com/Productoraear/ear.git`
2. **Instalar Dependencias:** `npm install`
3. **Generar Base RAG:** `npx tsx scripts/knowledge-ingestion.ts`
4. **Verificar Tipado:** `npx tsc --noEmit`
5. **Iniciar Servidor Dev:** `npm run dev -- -p 3007`

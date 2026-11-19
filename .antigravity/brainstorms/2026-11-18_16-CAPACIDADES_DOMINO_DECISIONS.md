# Checkpoint Grill Me: 16 Capacidades, Ejecución en Dominó y Territorio Otzarreta

## Fecha y Estado
- **Fecha**: 2026-11-18
- **Estado**: VIGENTE
- **Propósito**: Consolidar en disco las decisiones estratégicas del CEO y los invariantes constitucionales de `AGENTS.md` (v12.1 S-Class) antes de ejecutar el ciclo autónomo `/goal` en dominó, evitando bloqueos por interrogatorio interactivo y blindando la arquitectura local, adaptadores externos y el territorio canónico de Eduardo Martínez / Restaurante Otzarreta en Derio (Bizkaia).

---

## Las 4 Dimensiones Socráticas (Pre-Resueltas)

### 1. Dimensión de Negocio (Monetización y SSOT)
- **Zona Cero Inmutable**: `src/lib/constants/ear-os-ssot.ts` permanece intacto (SHA-256 `cefa76c2c6a3f92f57acf74f654932c02bf66774502102cb4f932520aaa64b2b`, auditado por `npm run audit:ssot`).
- **Puertas Canónicas**: `/celebraciones`, `/gobiernos`, `/profesionales`.
- **Ley del Paciente Cero — Edwin Agudelo (`e78903`)**:
  - Suelo canónico irrevocable: **350,00 €** (`TARIFA_BASE`).
  - Tarifa estándar: **550,00 €** con 100 km incluidos.
  - Logística desde Méntrida (Toledo): **1,50 €/km** a partir del km 50 (`LOGISTICA_EUR_PER_KM`); suplemento hotel **+120,00 €** si finaliza >= 03:00 AM o supera 200 km.
  - Otros artistas y proveedores configuran sus propias tarifas desde su panel interno sin heredar los parámetros de Edwin Agudelo.
- **Split Soberano y Depósito**: **80%** Artista/Proveedor · **10%** EAR OS · **10%** VIMUME; depósito oficial **100,00 €** Stripe Price-Lock SHA-256 (100% deducible).
- **Contratación Pública B2G y VIMUME**: Techo preventivo **< 14.250,00 €** (Art. 118 LCSP < 15.000,00 €) y límite acústico **< 75 dB SPL** en centros clínicos/VIMUME.
- **Catálogo Aislado — Eduardo Martínez / Restaurante Ezkertza Berria & Otzarreta**: 7 menús oficiales de temporada 2026 desde **100,00 € a 173,00 € + IVA** (`Cantábrico 100 €`, `Especial Imperial 123,40 €`, `Paloma 125 €`, `Vasco 138 €`, `Temporada 142,50 €`, `Ezkertza 155 €`, `Caserío Ezkertza Beko 173 €`), exclusivos de su ficha.

### 2. Dimensión Operativa y Humana (HITL `AGENTS.md` § 2)
- **0% Prohibición Total**: Cierre contractual sin consentimiento bilateral explícito de proveedor y cliente.
- **5% HITL Total**: Litigios, cancelaciones de eventos, contratos B2G **> 5.000,00 €**, expedientes clínicos VIMUME.
- **25% Revisión Humana Obligatoria**: Formalización de depósitos Stripe Price-Lock, cotizaciones con logística **> 300 km**, envíos o mutaciones externas sensibles vía `gws` (`gmail.compose` envío final, borrado/compartición Drive), automatizaciones externas en Zapier MCP y ejecución de jobs pagos de generación de vídeo (`fal.ai` / Kling O1).
- **60% Semi-Autónomo**: Cotizaciones express, cualificación de leads, generación de borradores internos en `gws` y despacho público de dossier multimedia (`evaluateProviderMediaDeliveryPolicy`) **únicamente** para categorías de pago (`SOVEREIGN` o `CLAIMED`).
- **Canalización de Fichas Gratuitas (`DIRECTORY_UNCLAIMED`)**: Sin contacto directo expuesto ni despacho público automático vía n8n (`publicPreviewLimit: 3`, `exposeVideosPublicly: false`); atención canalizada obligatoriamente a la **Centralita EAR OS (`+34 693 693 048`)**.
- **90% Autónomo Supervisado**: FAQ estándar de catálogo, consulta de disponibilidad de agenda, horarios y aforos, y lectura pasiva (`gmail.readonly`, consulta de calendario/hojas en `gws`).

### 3. Dimensión Territorial y Logística (R5 + `AGENTS.md` § 3)
- **Sede Canónica Única de Eduardo Martínez / Restaurante Otzarreta (`ezkertza-berria`)**:
  - Dirección exclusiva: **Santo Domingo Hiribidea, 13, 48160 Derio, Bizkaia** (`geo: 43.2928, -2.8833`).
  - Comarca: **Txorierri / Gran Bilbao (Bizkaia)**.
  - Capacidad y dotación: 50–200 comensales en banquete nupcial (hasta 350 en finca ampliada), exclusividad de 1 evento al día, parking privado gratuito de 150 plazas, sonorización Bose S-Class (Ley 37/2003).
- **Área de Influencia Cubierta (Exclusivamente Bizkaia)**:
  - **Derio**, **Bilbao**, **Txorierri** (**Loiu**, **Sondika**, **Zamudio**, **Lezama**), **Mungia**, **Uribe Kosta** (**Sopela**, **Plentzia**, **Gorliz**, **Berango**, **Getxo**) y **Bizkaia central**.
- **Integridad Territorial**: Cero atribuciones externas ni fusiones geográficas fuera de Bizkaia en rutas principales, JSON-LD, sitemap, contexto de conserjería o documentación maestra.
- **Zona Centro (Edwin Agudelo)**: Base logística en Méntrida (Toledo), cobertura hacia Madrid y Toledo con franquicia métrica según tarifa seleccionada (50 km base / 100 km estándar).

### 4. Dimensión de Seguridad, Stack y Riesgo (R3 / R4)
- **Stack Técnico Obligatorio**: Exclusivamente **`npm`** (`pnpm`, `yarn` y `bun` prohibidos), Node.js v26+, Next.js 16.3.5 (App Router), React 19.2.6, TypeScript 6.0.3 (`strict`), Prisma 6.19.3 + PostgreSQL 16.
- **Entorno de Producción**: Coolify Bare-Metal en VPS Hostinger KVM 1 (`82.29.179.172:8000`, **1 vCPU / 4 GB RAM**) con compilación offload en GitHub Actions -> GHCR (`deploy-ghcr.yml`), `output: "standalone"` y `--max-old-space-size=2048`.
- **Adaptadores Externos Fail-Closed (R3)**: `gws`, `Zapier MCP` y `fal.ai / Kling O1` resuelven variables vía `EnvSource` inyectable en tiempo de ejecución (nunca lanzan en top-level import), devuelven `UNCONFIGURED` / HTTP `503` si faltan credenciales, `HITL_BLOCKED` / HTTP `403` si violan `AGENTS.md` § 2, validan con Zod `.strict()`, aplican `AbortSignal.timeout(8000)` y redactan PII/secretos (`INV-14`).

---

## Decisiones Cerradas e Inmutables
1. **Priorización Local de 6 Capacidades (R1)**: Se priorizan y consolidan en local **Ponytail** (`.agents/skills/ponytail/SKILL.md`), **Graphify** (`graphifyy 0.9.112` + `graphify-out/graph.json`), **Impeccable** (implementado nativamente por `.agents/skills/unslop/SKILL.md` + `audit:slop` / `audit:webgl` / `audit:contrast:core`), **Grill Me** (este checkpoint persistente), **Superpowers** (nueva skill local nativa `.agents/skills/superpowers/SKILL.md`, dejando constancia expresa de que `obra/superpowers` no existía en el baseline) y **GWS** (puente tipado con scopes mínimos y HITL gate).
2. **Clasificación Honesta del Resto de Capacidades**: `Playwright Browser` (parcial vía Chrome/Edge del sistema en Windows, skip descarga Chromium en Docker) y `Obsidian` (parcial vía `ObsidianIngestor` en Node sobre `docs/memoria EAR OS`) quedan como soporte local parcial; las 9 capacidades restantes (`Claude Video`, `NotebookLM Py/CLI`, `Last30days`, `Skill Theory`, `GBrain`, `Google Stitch`, `Scroll World / fal.ai / Kling O1`, `HyperFrames`) más `Zapier MCP` se clasifican como diferidas/externas, dejando contratos tipados para `Zapier MCP` y `fal.ai / Kling O1` y aprovechando `Remotion` local para render MP4 de $0.
3. **Ejecución en Dominó con Serialización Única**: La exploración, auditoría y diseño de pruebas pueden paralelizarse en ondas de solo lectura mediante Agent Teams; toda mutación registrada en la cola de `omega.js` se serializa en slot único (`MISSION_ACTIVE.json`, lotes <= 5 archivos `CHG-4`) con validación obligatoria (`typecheck`, `lint`, `audit:ssot`, `run_sv_protocol_15_gates.cjs` 17/17) y firma del Arquitecto (`ARCHITECT_APPROVAL.json`, `worker_self_approval: false`).
4. **Cero Bloqueo Local por Falta de Secretos**: La ausencia de credenciales de Google Cloud Console (`gws`), Zapier MCP, `fal.ai` o Kling O1 nunca bloquea el desarrollo local, la compilación ni las 17 compuertas.
5. **Anclaje Único de Otzarreta en Derio (Bizkaia)**: Toda mención en planes maestros, rutas, metadatos y catálogo pertenece exclusivamente a Derio, Bizkaia (Txorierri / Gran Bilbao) y su área de influencia en Bizkaia.

---

## Dudas Abiertas / Puntos HITL
1. **Provisión de OAuth Google Cloud Console para `gws` (CEO)**: Creación del proyecto GCP, consentimiento OAuth y alta de credenciales restringidas estrictamente a los 6 scopes mínimos (`gmail.readonly`, `gmail.compose`, `drive.file`, `documents`, `spreadsheets`, `calendar.events`).
2. **Provisión de Secretos de Integración Externa (CEO)**: Emisión y carga segura en Coolify / `.env.local` de `ZAPIER_MCP_TOKEN`, `FAL_KEY` y `KLING_ACCESS_KEY` / `KLING_SECRET_KEY` cuando se autorice su activación productiva.
3. **Provisión de `COOLIFY_API_TOKEN` y Paridad de Secretos en Producción (CEO / HITL)**: Configurar `COOLIFY_API_TOKEN` en GitHub Secrets para eliminar el `HTTP 401` del webhook en `.github/workflows/deploy-ghcr.yml` y validar paridad de `CRON_SECRET`, `EAR_SOVEREIGN_MASTER_PASSWORD`, `EAR_ADMIN_2FA_SECRET` y `NEXTAUTH_SECRET`.
4. **Higiene de Packs Git (`verify:git-pack`) y Limpieza de Deriva en `skillsRegistry.ts` / `manage_mcp.cjs`**: Autorizar ventana de mantenimiento para `git gc --prune=now` (4.879 objetos sueltos > límite de 500) y alinear el registro estático de `src/lib/skillsRegistry.ts` con las skills reales en `.agents/skills/`.

---

## Siguientes Pasos
1. Activar el grafo AST local (`graphify update .`) y desbloquear la compuerta 11 (`scripts/audit_tariff_copy_drift.cjs`) sin debilitar patrones SSOT.
2. Publicar la skill local `.agents/skills/superpowers/SKILL.md` y el Plan Maestro integral en `docs/specs/PLAN_MAESTRO_16_CAPACIDADES_DOMINO_EAR_OS.md`.
3. Converger las entregas paralelas de **M1** (unificación territorial Derio / Bizkaia / Uribe Kosta en rutas y entidades Otzarreta) y **M2** (adaptadores tipados fail-closed en `src/lib/integrations/` + `/api/integrations/readiness`).
4. Ejecutar verificación integral en **M4**: refresco `graphify update .`, suite E2E de caja opaca (Tiers 1–5) y certificación completa de las 4 puertas (`typecheck`, `lint`, `audit:ssot`, `17/17 sv_protocol`).

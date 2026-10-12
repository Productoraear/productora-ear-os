# Auditoría Forense EAR OS — Bot Telegram B2G, Absorción bodas.net y Estado de Datos

> Generado: 2026-10-10 · Modo: Arquitecto Forense (cero fachadas)
> Doctrina: cada botón/terminal debe conectar con un motor real. Nada simulado en la ruta de dinero.

---

## 1. VEREDICTO SOBRE EL EAR INTEL BOT (Telegram B2G)

**El bot de licitaciones es una FACHADA confirmada. No escanea ninguna fuente real.**

Evidencia (sustancia, no nombres):

| Motor | Archivo | Estado real |
|---|---|---|
| Radar TS | `src/lib/services/b2g-hunter.ts` | `runHunterB2GScan()` itera **4 licitaciones hardcodeadas** en un array estático. Cero red a PLACSP. |
| Notificador TS | `src/lib/b2g/telegram-notifier.ts` | Formatea y envía bien, pero recibe payloads **fabricados**. |
| Auto-bidder | `scripts/b2g_placsp_bidder.py` | `SAMPLE_MUNICIPALITIES` + `random.choice` → genera expedientes falsos. |
| Tender hunter | `scripts/b2g_tender_hunter.py` | `MUNICIPIOS_TARGET` hardcodeado, estado `AUTO_GENERATED_READY_TO_DISPATCH`. |
| Scanner | `scripts/b2g_hunter_scanner.py` | `MOCK_PLACE_DATA` (el propio nombre delata). |
| Cron Vercel | `src/app/api/cron/b2g-telegram-hunter/route.ts` | Dispara cada 09:00 la fachada anterior. |

**Prueba de fuego — la fuente oficial:**
`https://contrataciondelestado.es/sindicacion/sindicacion_664` devuelve:
`Su certificado no está autorizado a acceder a la Plataforma.`

**Conclusión:** PLACSP exige certificado digital FNMT/empleado público. Sin un certificado autorizado **no existe scraping real de PLACSP**. Por eso el obrero anterior mockeó: no había credencial, y en lugar de declararlo, simuló. Esto es el veto estratégico §7.4 (motores simulados).

**Opciones reales de dominio (requieren decisión del CEO):**
- **A)** Certificado FNMT activo → sindicación oficial PLACSP (la más completa y limpia).
- **B)** Fuentes abiertas sin certificado: API REST de **TED (UE)**, BOCM, perfiles de contratante/sedes electrónicas de ayuntamientos target.
- **C)** Híbrido: TED + BOCM + sedes ya, certificado PLACSP cuando esté disponible.

Ninguna de las 3 existe hoy en el código. Debe construirse un **conector real** con `fetch`, parseo de RSS/XML/JSON, filtro por CPV y Match Score contra SSOT, idempotencia y DLQ.

---

## 2. ESTADO DE LA ABSORCIÓN BODAS.NET

**Lo que SÍ hay (virtud):**
- Bóveda HTML física: **2.150 archivos** en 9 categorías (`Musica` 618, `Fotografia_Video` 376, `Animacion_Espectaculos` 354, `Decoracion_Flores` 299, `Transporte_Coches` 171, `Catering_Banquetes` 139, `Moda_Belleza` 117, `Fincas_Espacios` 64, `Servicios_Regalos` 12).
- Edge CDN: **6.674 registros / 7,22 MB** en 14 particiones (`public/data/providers/`).
- Scripts de absorción existentes: `absorb_html_vault.cjs`, `absorb_bodasnet_providers.cjs`, `bodas_net_intel_extractor.py`.
- Doctrina del dato verificado implementada: `verified:true` solo con teléfono real, centralita `+34 693 693 048` ⇒ `false`.

**Defectos críticos (lo que NO está):**
1. **NO se vampirizó el 100% usable.** `absorb_bodasnet_providers.cjs` hace **muestreo** con `cap` 25-30 registros por categoría. La bóveda completa (2.150 HTML) no está volcada a datos canónicos con teléfono real.
2. **Las imágenes apuntan al origen** (`cdn*.bodas.net`). Regla del CEO: tomar todo **excepto lo que apunta al origen**. Hay que re-escribir los `imageUrls` a rutas locales/espejo o descartarlas, no enlazar CDN de terceros.
3. **`absorb_html_vault.cjs` guarda `vault_mirror_url` y `target.vault_mirror_url`** re-enlazando espejos locales, pero la cobertura real no está medida ni auditada al 100%.

---

## 3. ESTADO DE SINCRONIZACIÓN DE BASES DE DATOS

**Fuentes de verdad (SSOT) en disco:**

| Archivo | Tamaño | Veredicto |
|---|---|---|
| `src/data/all_providers_database.json` | **392,74 MB** | ❌ Monolito incontrolable. Viola anti-bloat. |
| `src/data/vampirized_providers.json` | **54,06 MB** | ❌ Igual. |
| `src/data/ear-rag-database.json` | **13,70 MB** (18.116 nodos) | ❌ Aún pesado y con nodos mock B2G. |
| `public/data/providers/all_featured.json` | **1,37 MB** (718 regs) | ❌ Supera el límite de 1 MB. |
| `src/data/b2g/fitur_institutional_leads.json` | 1,67 MB | ❌ Cruft, no es motor de venta. |
| `public/data/providers/providers_canonical.json` | 310 regs | ⚠️ Huérfano: no es el SSOT, duplica edge. |
| `src/data/b2g/*.json` | 9/8/8/4 regs | ❌ Mock (AUTO_GENERATED). |

**Nivel Omega Diamante: NO alcanzado.** Faltan 3 pilares:
1. **PostgreSQL 16 como SSOT real** (la tarea W21-003 "bodas.net a Postgres idempotente" sigue `QUEUED`). Hoy todo es JSON estático.
2. **Poda del monolito** a una partición curada < 1 MB que alimente `build_lean_verified_edge.cjs`.
3. **Auditoría de `verified` real** con `audit_placeholder_phones.cjs` ⇒ 0 placeholders en edge.

---

## 4. MATRIZ DE VIRTUDES Y DEFECTOS (SWOT DE DOMINANCIA)

### Virtudes (ventaja competitiva real)
- ✅ **SSOT canónico tipado estricto e inmutable** (`ear-os-ssot.ts`), congelado, exports completos: 80/10/10, depósito 100 €, 1,50 €/km, techo 14.250 €, rider <75 dB / 12 W-pax, VAT 21 %.
- ✅ **Motores Zona Cero presentes**: `ssotIntegrityGuard`, `atomicDateLockEngine`, `b2g-tender-engine`, `astra-conversation-engine`.
- ✅ **Doctrina del dato verificado** ya codificada (centralita ⇒ `verified:false`).
- ✅ **Infraestructura híbrida definida**: Coolify+Postgres, n8n con 5 webhooks, Vercel cron.
- ✅ **Bóveda HTML bodas.net** físicamente capturada (2.150 archivos) — material base disponible.
- ✅ **`omega.js`** con purga ZTM e idempotencia de cierre.
- ✅ `.env` con `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `STRIPE_SECRET_KEY`, `DATABASE_URL` seteados.

### Defectos (lo que hoy frena la dominancia)
- ❌ **P0 — Bot Telegram B2G 100% fachada** (4 motores mock + cron que los dispara).
- ❌ **P0 — Sin certificado PLACSP/FNMT** → sin fuente real de licitaciones.
- ❌ **P0 — SSOT de proveedores ausente en Postgres** (todo JSON estático, 392 MB de monolito sin poda).
- ❌ **P0 — Ruta de dinero con simulaciones potenciales**: hay que barrer Stripe/n8n/lock (W21-004 pendiente).
- ❌ **P1 — Absorción bodas.net incompleta** (muestreo, no 100 %; imágenes apuntan al origen).
- ❌ **P1 — Violaciones anti-bloat**: `all_providers_database` 392 MB, `all_featured` 1,37 MB, `fitur` 1,67 MB.
- ❌ **P1 — `verified` no auditado en edge** (falta ejecutar guardián).
- ❌ **P2 — Duplicación de fuentes** (`providers_canonical.json` vs edge vs SSOT).

---

## 5. BATERÍA DE TAREAS SUGERIDA (PRÓXIMA OLA — PRIORIZADA)

Orden estricto de dependencias (lo comercial primero, cero fachadas):

**P0 — Dinero y verdad**
1. **Conector B2G real** (sustituir la fachada): fetch a TED API (UE) + BOCM/sedes, filtro CPV (`92300000-4`, `79952000-2`, `85311100-3`), Match Score contra SSOT, idempotencia + DLQ. *Decisión CEO: certificado PLACSP ahora o solo fuentes abiertas.*
2. **Poda del monolito** `all_providers_database.json` (392 MB → partición curada < 1 MB) y regeneración de edge con `build_lean_verified_edge.cjs`.
3. **Ingesta bodas.net → PostgreSQL 16 idempotente** (reanudar W21-003). Rutas de venta leen de DB, no de JSON.
4. **Purgar mock B2G y cruft** (`fitur_institutional_leads`, excesos > 1 MB) fuera de `git`.
5. **Idempotencia ACID Stripe + DLQ n8n** (W21-004).

**P1 — Blindaje**
6. **Vampirizar bodas.net al 100 % usable**: volcar los 2.150 HTML a canónicos con teléfono real, re-escribiendo todo lo que apunte al origen (CDN bodas.net) a espejo local.
7. **Auditoría `verified` con `audit_placeholder_phones.cjs`** ⇒ 0 placeholders en edge.

**P2 — Excelencia**
8. **Matriz de trazabilidad Ω-Diamante** (scorecard 20/20): Vista→handler→endpoint→motor→SSOT→persistencia/webhook.

---

## 6. BLOQUEANTES QUE REQUIEREN DECISIÓN DEL CEO

1. **Certificado PLACSP/FNMT**: sin él, no hay fuente oficial de licitaciones; solo TED/BOCM/sedes.
2. **Aceptar poda del monolito de 392 MB** (no es reversible sin re-absorber).
3. **Migrar SSOT de proveedores a PostgreSQL 16** (fin del JSON estático como fuente de venta).
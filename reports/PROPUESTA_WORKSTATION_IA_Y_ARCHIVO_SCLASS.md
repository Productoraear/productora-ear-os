# PROPUESTA S-CLASS — WORKSTATION IA LOCAL + ARCHIVO BIG-DATA PURISTA
**Autor:** Antigravity (Arquitecto Forense) — 10/08/2026
**Alcance:** (1) Dónde estamos, (2) Qué tenemos, (3) Cómo llevarlo al máximo, (4) Cómo ordenar sin tocar EAR OS.

---

## 1. RESUMEN EJECUTIVO (LO QUE HAY)

**Máquina (alta gama para IA local):**
- CPU: Intel 8 núcleos / 16 hilos @ 2.60 GHz
- RAM: **64 GB DDR4 @ 2400 MHz** (2×32 Kingston) → permite modelos grandes con offload
- GPU: **AMD Radeon RX 7900 XTX — 24 GB VRAM GDDR6** → el activo clave. Un modelo ~35B en Q4_K_M (~20 GB) cabe **entero en VRAM** y va muy rápido.
- WMI reporta "4 GB" por truncado de 32 bits; la VRAM real es 24 GB.

**Discos:**
| Drive | Total | Libre | Uso | Tipo | Estado |
|-------|-------|-------|-----|------|--------|
| C: | 476 GB | 21 GB | 95.6% | SSD M.2 sistema | ⚠️ SATURADO |
| D: | 1863 GB | 155 GB | 91.7% | HDD 2 TB | OK |
| E: | 288 GB | 137 GB | 52% | SSD/Vol | OK |
| G: | 643 GB | 1.6 GB | 99.7% | HDD 1 TB | 🔴 CRÍTICO (casi lleno) |
| H: | 931 GB | 346 GB | 63% | SSD 1 TB | OK — destino ideal |

---

## 2. DIAGNÓSTICO: POR QUÉ C: ESTÁ AL 95%

**Los tres grandes consumidores de C: (no son "tus archivos"):**

1. **AppData del usuario (~160 GB)** — el verdadero elefante:
   - `AppData\Local` = **126,55 GB**:
     - `Programs` 18,48 GB (Ollama + LM Studio + apps instaladas)
     - `Amuse` 15,43 GB · `AMD` 13,41 GB · `audacity` 12,70 GB · `Google` 10,14 GB · `CapCut` 7,42 GB · `Waves Audio` 6,56 GB
     - `pip` 6,35 GB · `npm-cache` 5,11 GB · `Ollama` 1,47 GB
   - `AppData\Roaming` = **33,58 GB**
2. **`pagefile.sys` = 32 GB** (memoria virtual)
3. **`hiberfil.sys` = 25,54 GB** (hibernación)

**Tu contenido real de usuario en C: es PEQUEÑO:**
- Desktop 1,75 GB · Documents 0,45 GB · Downloads y Music están **redirigidos/empty** (junction a otro disco).

> **Conclusión:** C: no se libera moviendo "tus archivos" (son casi nada). Se libera atacando AppData/pip/npm caches, y ajustando pagefile/hibernación — SIN tocar Windows ni programas instalados.

---

## 3. INVENTARIO DE IA (LO QUE YA TENEMOS)

**Motores presentes:**
- ✅ **Ollama 0.40.0** (en `AppData\Local\Programs\Ollama`)
- ✅ **LM Studio** (usa el motor **llama.cpp** por dentro, vía **Vulkan** → aquí la 7900 XTX acelera de verdad)
- ❌ **llama.cpp standalone:** NO hay binario suelto (`llama-cli`/`llama-server`) encontrado. El motor llama.cpp **sí está** (embebido en Ollama y LM Studio).

**Modelos registrados en Ollama (`ollama list`):**
| Modelo | Tamaño | Función |
|--------|--------|---------|
| `ear-32b-arquitecto-sclass` | 19 GB | Arquitecto / orquestador |
| `ear-27b-apis-sclass` | 16 GB | APIs / código |
| `ear-14b-textos-sclass` | 9 GB | Textos / redacción |
| `nimble` | 9,5 GB | Rápido / tareas ligeras |

**`H:\AI_MODELS_HUB` (~111 GB):**
| Carpeta | Tamaño | Veredicto |
|---------|--------|-----------|
| `blobs` | 51,39 GB | ⚠️ **ACTIVOS** — son los pesos GGUF de Ollama (los `ear-*` + nimble). NO borrar (rompe Ollama). |
| `LM_STUDIO_MODELS` | 31,39 GB | Qwen2.5-Coder-32B (18,49) + Coder-14B (8,37) + VL-7B (4,36) + SmolLM2 + nomic-embed |
| `qwen` | 16,52 GB | `qwen3.8-27b` Q4_K_M (15,66) + mmproj ⇒ aquí se descargará el nuevo modelo |
| `LM_STUDIO_CACHE` | 2,95 GB | 🟡 Borrable (cache regenera) |
| dirs vacíos | ~0 GB | 🟢 Borrables: `gguf_models`, `huggingface_cache`, `lm_studio`, `Modelfiles`, `ollama_models` |

**Respuesta directa a tus preguntas:**
1. **¿Tenemos llama.cpp?** No como binario standalone; **sí** como motor dentro de Ollama/LM Studio (Vulkan). → Para exprimir la 7900 XTX es vía LM Studio/llama.cpp-Vulkan.
2. **¿Tenemos Qwen 35B?** **No.** Lo más cercano: Qwen2.5-Coder-32B (18,49 GB). *Ojo:* "Qwen 3.5 35B" no es un nombre canónico del catálogo Qwen. El equivalente real de ~35B es **Qwen3-32B** (denso, ~20 GB en Q4_K_M) o Qwen2.5-32B.
3. **¿Se puede correr?** **Sí.** Un ~35B Q4_K_M (~20 GB) cabe completo en los 24 GB de VRAM de la 7900 XTX.

---

## 4. TRIAGE DE `H:\AI_MODELS_HUB` (USAR O ELIMINAR)

**A ELIMINAR (seguro, sin riesgo):**
- `LM_STUDIO_CACHE` (2,95 GB) — cache, se regenera.
- Directorios vacíos: `gguf_models`, `huggingface_cache`, `lm_studio`, `Modelfiles`, `ollama_models`.
- `desktop.ini` (basura de sistema).

**POSIBLE DEDUPLICACIÓN (~42 GB) — requiere tu OK:**
- Los GGUF sueltos de `qwen/qwen3.8-27b` (15,66 GB) y de `LM_STUDIO_MODELS` (Coder-32B 18,49 + Coder-14B 8,37) **ya están absorbidos como blobs de Ollama** (mismos pesos/tamaños). Si ya no los usas como GGUF standalone (p.ej. fine-tuning o LM Studio), se pueden borrar y quedarte SOLO con los blobs de Ollama.

**A CONSERVAR sí o sí:**
- `blobs` (51 GB) — pesos activos de Ollama.
- `manifests` / `manifests-v2` / `metadata` — registro de Ollama (diminutos).
- `LM_STUDIO_MODELS` si usas LM Studio.

> ⚠️ **Verificación previa obligatoria antes de tocar `blobs`:** confirmar `OLLAMA_MODELS` apunta a `H:\AI_MODELS_HUB`. Lo haré con `reg query` (1 segundo) antes de cualquier borrado.

---

## 5. PROPUESTA: SCRIPT UNIFICADO DE ARCHIVISTA (PERSONAL vs EMPRESARIAL)

**He revisado los scripts existentes** (`scripts/`):
- Organización/archivo: `02_inventario_etiquetado_dinamico.ps1`, `organize_root_pure.py`, `organize_photos_exif.py`, `organize_despegue_catalog.js`, `organize_campus_magnets.cjs`, `clasificadorForense.py`, `ClasificadorForense.py`.
- Big-data purista: `big_data_purist_archivist.js`, `purist_archivist_daemon.py`, `ztm_purist_archivist.py`, `semantic_n1_consolidator.py`.
- Bóvedas/dedupe: `7179..._organizer.py`, `8b48..._move_dups.py`, `condensar_inventario.py`, `batch_recycle_vault.py`, `archive_old_vampires.py`.

**Diagnóstico:** hay ~10+ scripts solapados, con filosofías distintas y sin un "plan maestro" único. Ninguno distingue claramente **personal** vs **empresarial** a nivel de raíz.

**Propuesta (NO toca `src/` ni EAR OS):**
Un solo motor `scripts/archivista_unico.cjs` que:
1. **Lee** un manifiesto de reglas en `.antigravity/archivo_maestro.json` (rutas origen/destino, categorías, excepciones).
2. **Clasifica** en 3 dominios: `PERSONAL` / `EMPRESA (EAR OS)` / `TERCEROS-DESCONOCIDO`.
3. **Etiqueta con metadatos** (origen, fecha, dominio, hash) en un índice ligero `.antigravity/indice_archivo.jsonl` (no copia masiva, solo indexa).
4. **Modo dry-run por defecto** (nunca mueve/borra sin tu aprobación explícita).
5. **Respeta Zona Cero:** excluye `H:\EAR_OS_V2\EAR_OS_V2\src`, `public`, `prisma`, `.git` — migra solo datos/documentos/media, nunca código ni motores.

**Pendiente de tu input:** qué carpetas raíz consideras PERSONAL y cuáles EMPRESA (ej. `D:\MUSICA_PERSONAL`, bóvedas H:, descargas).

---

## 6. PLAN PARA LLEVAR LA WORKSTATION AL MÁXIMO (IA LOCAL)

1. **Fijar `OLLAMA_MODELS=H:\AI_MODELS_HUB`** (si no lo está ya) → los modelos viven en el SSD de 1 TB, no en C:.
2. **Ruta GPU AMD:** usar **llama.cpp vía Vulkan** (LM Studio o `llama-server -ngl 99`). En Windows, AMD en Ollama va limitado; Vulkan es lo que desbloquea los 24 GB de la 7900 XTX.
3. **Descargar el modelo ~35B en `H:\AI_MODELS_HUB\qwen\`** (petición explícita del CEO).
4. **Estabilizar Ollama** (ya hay scripts: `estabilizar_ollama_sclass.ps1`, `OPTIMIZAR_VRAM_AMD_7900XTX.bat`).
5. **Purgar caches** `pip` (6,35 GB) + `npm-cache` (5,11 GB) con `pip cache purge` / `npm cache clean --force` → recupera ~11 GB en C: sin romper nada.
6. **Ajustar pagefile/hibernación** (opcional, previa confirmación): hibernación apagada libera 25,5 GB; pagefile a tamaño fijo menor.

---

## 7. LIBERAR C: (SIN TOCAR WINDOWS NI PROGRAMAS)

| Acción | Recupera | Riesgo |
|--------|----------|--------|
| Purge pip + npm caches | ~11 GB | Ninguno |
| Apagar hibernación (`powercfg /h off`) | 25,5 GB | Bajo (pierdes "arranque rápido") |
| Reducir pagefile a 8-16 GB | 16-24 GB | Bajo (tienes 64 GB RAM) |
| Purgar `LM_STUDIO_CACHE` + dirs vacíos | ~3 GB | Ninguno |
| Limpiar Temp / updates antiguos | ~2-5 GB | Ninguno |

> La música FLAC en `D:` **no es necesaria para liberar C:** — está en otro disco (D). Solo se borra si QUIRES recuperar esos 33,84 GB en D, no por el problema de C:.

---

## 8. DECISIONES QUE NECESITO DE TI (preguntas)

1. **Modelo a descargar:** "Qwen 3.5 35B" no es canónico. ¿Bajo a **Qwen3-32B** (el 35B real más cercano) o tienes un enlace/GGUF concreto? ¿Quantización Q4_K_M (~20 GB, todo en VRAM) o Q6_K/Q8?
2. **Dedupe de modelos:** ¿Puedo borrar los GGUF sueltos (`qwen/qwen3.8-27b` y `LM_STUDIO_MODELS` Coder-32B/14B) si ya están en los blobs de Ollama? (~42 GB) — ¿o usas LM Studio con ellos?
3. **Borrado seguro de `LM_STUDIO_CACHE` + dirs vacíos** — ¿OK?
4. **C: — ¿apruebo** purge caches (pip/npm) + apagar hibernación + ajustar pagefile?
5. **Archivista:** dime cuáles son las carpetas raíz PERSONAL vs EMPRESA para generar las reglas del script unificado.
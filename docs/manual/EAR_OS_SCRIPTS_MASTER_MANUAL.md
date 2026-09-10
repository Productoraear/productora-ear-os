# MANUAL MAESTRO DE SCRIPTS // EAR OS v2.0
## ARQUITECTURA DE UNIFICACIÓN, AUDITORÍA Y GUÍA OPERATIVA PARA ADMINISTRADORES
**Titular y Sistema:** Edwin Agudelo // Productora EAR  
**Sede Central:** Méntrida (Toledo), España  
**Entorno Mandatorio:** PowerShell 7 Nativo (`pwsh`) | Python 3.10+ con Aceleración GPU RX 7900 XTX  
**Ubicación SSOT de Scripts Auditados:** `H:\EAR_OS_V2\EAR_OS_V2\scripts\unified\` y `H:\EAR_OS_V2\EAR_OS_V2\scripts\`  

---

## 1. MAPA DE UNIFICACIÓN Y DIRECCIÓN DE ACCESO
Para resolver la dispersión de los ~343 scripts históricos que operaban de forma fragmentada, la arquitectura de EAR OS ha consolidado todas las capacidades aditivas en **6 MACRO-MOTORES SOBERANOS**:

```
H:\EAR_OS_V2\EAR_OS_V2\
 ├── scripts/
 │    ├── unified/
 │    │    ├── master_purist_archivist.py    <-- [MACRO-MOTOR 1] Archivista Purista & Limpieza Total
 │    │    └── provider_seduction_engine.py  <-- [MACRO-MOTOR 3] Seducción "Demanda en Mano"
 │    ├── vampire-sweep.ps1                  <-- [MACRO-MOTOR 2] Scraper & Vampirizador Universal
 │    ├── ear_os_terminal_profile.ps1        <-- [MACRO-MOTOR 4] Telemetría Digital Terminal HUD
 │    ├── terminal_telemetry.ps1             <-- [MACRO-MOTOR 4] Módulo de Barra y Badges en PS7
 │    ├── terminal_telemetry.py              <-- [MACRO-MOTOR 4] Módulo de Barra y Badges en Python
 │    ├── b2g_tender_hunter.py               <-- [MACRO-MOTOR 5] Cazador B2G PLACSP & VIMUME
 │    └── whisper_gpu_batch_transcriber.py   <-- [MACRO-MOTOR 6] Minero Whisper GPU Local
```

---

## 2. GUÍA OPERATIVA DETALLADA DE CADA MACRO-MOTOR

### 🔱 MACRO-MOTOR 1: EL ARCHIVISTA PURISTA MASTER
- **Ruta Oficial Auditada:** `H:\EAR_OS_V2\EAR_OS_V2\scripts\unified\master_purist_archivist.py`
- **Scripts Históricos Unificados:**
  1. `scripts/ztm_purist_archivist.py` (Lógica ZTM de clasificación multidimensional).
  2. `scripts/big_data_purist_archivist.js` (Estrategia de hashing masivo).
  3. `scripts/purist_archivist_daemon.py` (Mapeo de rutas).
  4. `scripts/organize_root_pure.py` (Detección de cruft en raíz).
  5. `scripts/7179a7d0c0dbabf7c4a090c75a02a329_organizer.py` y `8b48933..._move_dups.py` (Gestión de duplicados).
- **Poder y Capacidades:**
  - **Saneamiento Quirúrgico de la Raíz de EAR OS:** Identifica cualquier archivo o carpeta huérfana en `H:\EAR_OS_V2\EAR_OS_V2\` que no forme parte del núcleo Next.js protegido (`src`, `public`, `docs`, etc.) y la desplaza inmediatamente a la Bóveda.
  - **Desplazamiento Real (Move, no Copy):** Corrige el fallo de versiones anteriores que duplicaban archivos. Mueve físicamente el activo a `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\{Categoria}\`.
  - **Hashing Criptográfico SHA-256:** Registra cada archivo en `scripts/.archived_manifest.json` y `scripts/.processed_hashes.json`.
  - **Telemetría Digital HUD:** Muestra la barra de progreso en vivo `[██████████░░░░░] %` y emite `[EXIT CODE 0]` al culminar.
- **Cómo lo usa el Administrador:**
  ```powershell
  # 1. Situarse en la raíz de EAR OS
  cd H:\EAR_OS_V2\EAR_OS_V2

  # 2. Ejecutar el Archivista Purista
  python scripts/unified/master_purist_archivist.py
  ```
- **Resultado Esperado:**
  - Consola limpia con HUD animado.
  - La raíz de `EAR_OS_V2` queda perfectamente despejada (solo archivos de código fuente y configuración).
  - El manifiesto `.archived_manifest.json` queda sellado con hashes SHA-256.

---

### 🧛 MACRO-MOTOR 2: EL MOTOR VAMPIRO & SCRAPER TOTAL
- **Ruta Oficial Auditada:** `H:\EAR_OS_V2\EAR_OS_V2\scripts\vampire-sweep.ps1`
- **Scripts Históricos Unificados:**
  1. `scripts/vampirize_all_local_providers.py` (Extracción de proveedores locales).
  2. `scripts/vampirize_massive_html_vaults.py` (Lectura de volcados HTML).
  3. `scripts/vampirize_demetrio_catalog.py` (Catálogos de sonido e iluminación).
  4. `scripts/night_vampire_scraper.py` y `smoke_test_bodas_net.py`.
- **Poder y Capacidades:**
  - Escanea todas las unidades montadas con espacio libre (`C:`, `D:`, `H:`) omitiendo carpetas del sistema.
  - Extrae fichas técnicas, tarifas, riders de sonido (Bose F1, Shure Beta 87A) y datos de proveedores.
  - Purga metodologías de academia Danny Aragón bajo el estándar SSOT `EAR Academy Protocol`.
  - Exporta automáticamente el catálogo consolidado en:
    - Bóveda: `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\Providers\vampirized-providers.json`
    - Frontend Next.js: `src\data\vampirized-providers.json`
  - Renderiza telemetría digital animada en tiempo real.
- **Cómo lo usa el Administrador:**
  ```powershell
  # Ejecución en PowerShell 7
  pwsh -File scripts/vampire-sweep.ps1
  ```
- **Resultado Esperado:**
  - Barra de progreso interactiva.
  - Generación del archivo JSON de proveedores sin bloquear ni saturar la memoria RAM.

---

### 💌 MACRO-MOTOR 3: EL MOTOR DE SEDUCCIÓN OUTBOUND & DEMANDA EN MANO
- **Ruta Oficial Auditada:** `H:\EAR_OS_V2\EAR_OS_V2\scripts\unified\provider_seduction_engine.py`
- **Scripts Históricos Unificados:**
  1. `scripts/outbound_b2b_microbatch_agent.py`
  2. `scripts/outbound_dispatcher_queue.py`
- **Poder y Capacidades:**
  - Aplica la filosofía "Demanda en Mano": el promotor no roba fotos ni suplanta identidades; ofrece peticiones reales de clientes con presupuesto en firme.
  - **Esquema Freemium de 3 Niveles:**
    * **Nivel 1 (Directorio Base):** 100% GRATIS DE POR VIDA. Ficha técnica pública protegida con datos de contacto ofuscados; el proveedor recibe solicitudes sin comisiones fijas ni exclusividad.
    * **Nivel 2 (Roster Técnico & Rider Unificado):** Si el evento contrata producción técnica EAR (sonido Bose / Shure), el artista cobra su tarifa íntegra y EAR factura la producción técnica al cliente final.
    * **Nivel 3 (Licitaciones B2G VIMUME & High-Ticket):** Acceso a contratos públicos con ayuntamientos (< 15.000 € Art. 118 LCSP) y posicionamiento preferente en el cotizador. Solo aquí aplica el Split Soberano (80/10/10).
  - Genera enlaces seguros de 1-clic:
    * Reclamación de cuenta: `https://www.productoraear.com/proveedores/[slug]?unlocked=true`
    * Retirada inmediata (Opt-out): `https://www.productoraear.com/api/providers/opt-out?slug=[slug]`
  - Salida estructurada lista para envíos directos: `src/data/outbound/provider_seduction_campaign.json`.
- **Cómo lo usa el Administrador:**
  ```powershell
  python scripts/unified/provider_seduction_engine.py
  ```

---

### ⚡ MACRO-MOTOR 4: TELEMETRÍA DIGITAL UNIVERSAL & PERFIL DE CONSOLA
- **Rutas Oficiales Auditadas:**
  - Perfil de Consola: `scripts/ear_os_terminal_profile.ps1`
  - Módulo PowerShell: `scripts/terminal_telemetry.ps1`
  - Módulo Python: `scripts/terminal_telemetry.py`
- **Poder y Capacidades:**
  - Restaura la barra digital interactiva `[██████████░░░░░] %` en cualquier comando o script.
  - Modifica el prompt de PowerShell para mostrar en tiempo real el tiempo de ejecución del último comando y el código de salida (`[EXIT CODE 0 | 0.42s] [EAR OS OMEGA v5.0] PS>`).
  - Proporciona la función `Invoke-Telemetry { ... }` para envolver cualquier comando largo.
- **Cómo lo usa el Administrador:**
  ```powershell
  # Cargar el perfil de telemetría en la sesión activa de PowerShell 7
  . H:\EAR_OS_V2\EAR_OS_V2\scripts\ear_os_terminal_profile.ps1

  # A partir de este momento, cada comando mostrará su estado de salida y telemetría por defecto.
  ```

---

### 🏛️ MACRO-MOTOR 5: CAZADOR DE LICITACIONES B2G & VIMUME
- **Ruta Oficial Auditada:** `H:\EAR_OS_V2\EAR_OS_V2\scripts\b2g_tender_hunter.py`
- **Scripts Históricos Unificados:**
  1. `scripts/b2g_hunter_scanner.py`
  2. `scripts/antigravity_municipal_hunter.py`
  3. `scripts/b2g_placsp_bidder.py`
- **Poder y Capacidades:**
  - Escanea la Plataforma de Contratación del Sector Público (PLACSP).
  - Filtra pliegos de contratos menores culturales y sociosanitarios con importe estrictamente inferior a 15.000,00 € (Ajuste preventivo: 14.250,00 € según Art. 118 LCSP).
  - Aplica auditoría acústica preventiva: calcula si el aforo requerido cumple la norma biológica VIMUME (< 75 dB SPL con 12 W/pax).
  - Emite alertas estructuradas por Telegram / Webhook a la centralita de Productora EAR.
- **Cómo lo usa el Administrador:**
  ```powershell
  python scripts/b2g_tender_hunter.py --check-pliegos --max-budget 14250
  ```

---

### 🎙️ MACRO-MOTOR 6: MINERO DE AUDIO LOCAL WHISPER GPU
- **Ruta Oficial Auditada:** `H:\EAR_OS_V2\EAR_OS_V2\scripts\whisper_gpu_batch_transcriber.py`
- **Scripts Históricos Unificados:**
  1. `scripts/Whisper_Wisdom_Injection.py`
  2. `scripts/run_transcription_engine.js`
  3. `scripts/whisper_live_hud.py`
  4. `scripts/transcribe_pending_media.js`
- **Poder y Capacidades:**
  - Transcribe grabaciones de audio, notas de voz de clientes y entrevistas comerciales directamente en la tarjeta gráfica local (AMD Radeon RX 7900 XTX de 24 GB VRAM).
  - Cero consumo de tokens ni peticiones a APIs externas.
  - Convierte el texto transcrito en nodos de conocimiento limpios para la base de datos RAG (`src/data/ear-rag-database.json`).
- **Cómo lo usa el Administrador:**
  ```powershell
  python scripts/whisper_gpu_batch_transcriber.py --input-dir "H:\00_PRODUCTORA_EAR\00_AVE_FENIX" --model large-v3
  ```

---

## 3. CHECKLIST PARA NUEVAS INCORPORACIONES O AUDITORÍAS
1. **Regla de No Duplicación:** Antes de redactar un script nuevo, el administrador debe verificar si la función encaja en uno de los 6 Macro-Motores.
2. **Telemetría Obligatoria:** Todo script debe importar `terminal_telemetry.ps1` o `terminal_telemetry.py` para proyectar el HUD animado.
3. **Destino Inmutable de Residuos:** Ningún archivo crudo o temporal debe permanecer en la raíz de `H:\EAR_OS_V2\EAR_OS_V2`. Todo activo debe ser depositado en `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\`.
4. **Verificación Estricta de Compilación:** Finalizada cualquier modificación, se debe garantizar `npx tsc --noEmit` -> Exit Code 0.

---
**Certificado y Aprobado por la Dirección de Operaciones // Productora EAR**  
*Méntrida (Toledo) — Sistema Operativo EAR OS v2.0*

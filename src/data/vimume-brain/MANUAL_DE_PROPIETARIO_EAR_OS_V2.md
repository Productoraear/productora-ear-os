# 📖 MANUAL DE PROPIETARIO & OPERACIÓN ATÓMICA · EAR OS V2 GOLD
**Sistema Operativo Integral para la Industria de la Música, Eventos S-Class, FinTech de Regalías y Archivo Soberano**
*Versión de Plataforma:* **v4.22 (Release Tag: `v4.21-cuebridge-sclass`)**  
*Dominio Canónico Soberano:* **https://www.productoraear.com**  
*Fecha de Compilación:* **2026-08-23 19:40:51 CEST**  
*Clasificación de Seguridad:* **S-Class Enterprise High-Signal (SSOT / Modo CEO)**

---

## 📑 ÍNDICE GENERAL DEL MANUAL DE PROPIETARIO

1. [CAPÍTULO 1: MANIFIESTO, VISIÓN Y MODELO DE NEGOCIO S-CLASS](#capítulo-1-manifiesto-visión-y-modelo-de-negocio-s-class)
2. [CAPÍTULO 2: ARQUITECTURA DE ROLES, ACCESOS Y PERMISOS](#capítulo-2-arquitectura-de-roles-accesos-y-permisos)
3. [CAPÍTULO 3: MOTOR FINTECH & PASARELA DE COBRO STRIPE](#capítulo-3-motor-fintech--pasarela-de-cobro-stripe)
4. [CAPÍTULO 4: UNIVERSAL CUE BRIDGE & VIGILANTE DE CABINA EN TIEMPO REAL](#capítulo-4-universal-cue-bridge--vigilante-de-cabina-en-tiempo-real)
5. [CAPÍTULO 5: PROTOCOLO ZERO-TOKEN MEMORY (ZTM) & BÓVEDA COGNITIVA](#capítulo-5-protocolo-zero-token-memory-ztm--bóveda-cognitiva)
6. [CAPÍTULO 6: CATÁLOGO ATÓMICO DE HERRAMIENTAS Y SCRIPTS LOCALES](#capítulo-6-catálogo-atómico-de-herramientas-y-scripts-locales)
7. [CAPÍTULO 7: INVENTARIO INTEGRAL DE RUTAS Y ENDPOINTS DE LA PLATAFORMA](#capítulo-7-inventario-integral-de-rutas-y-endpoints-de-la-plataforma)
8. [CAPÍTULO 8: GUÍAS DE OPERACIÓN PASO A PASO POR ROL](#capítulo-8-guías-de-operación-paso-a-paso-por-rol)
9. [CAPÍTULO 9: FÓRMULAS ACÚSTICAS, MATEMÁTICAS DE PRICING Y BLINDAJE LEGAL](#capítulo-9-fórmulas-acústicas-matemáticas-de-pricing-y-blindaje-legal)
10. [CAPÍTULO 10: PROCEDIMIENTOS DE MANTENIMIENTO, ROLLBACK Y HARDWARE OFFLOADING](#capítulo-10-procedimientos-de-mantenimiento-rollback-y-hardware-offloading)

---

## CAPÍTULO 1: MANIFIESTO, VISIÓN Y MODELO DE NEGOCIO S-CLASS

### 1.1 Identidad y Estándar Estético
EAR OS V2 ha sido diseñado bajo los estándares más estrictos del lujo contemporáneo y la alta ingeniería de software:
- **Paleta OLED Dark Mode:** True Black (`#050505`), Fondos de Cristal (`#0e0e14`/80), Bordes de Alta Definición (`rgba(255,255,255,0.08)`).
- **Acento Soberano:** Oro Imperial (`#ecb613`, `#d4a855`).
- **Tipografía Institucional:** Syne (Titulares monumentales con peso 800), Inter (Cuerpo de lectura ultra-legible), JetBrains Mono (Datos forenses, firmas criptográficas SHA-256 y finanzas).
- **Garantía Visual:** Cero "AI Slop", cero interfaces genéricas, micro-animaciones inmersivas y Storyselling persuasivo de alto impacto.

### 1.2 Reglas Core de Monetización & Algoritmo de Pricing
El modelo financiero de EAR OS elimina la fricción de intermediación y asegura márgenes recurrentes:
1. **Tarifa Base Solista (Edwin Agudelo):** 350 € (Gala estándar solista).
2. **Multiplicadores Dinámicos de Producción:**
   - Suma lineal por cada músico o ejecutante adicional.
   - Desplazamiento kilométrico: 0.35 €/km (o billete aéreo + alojamiento de representación para distancias > 200 km).
   - Equipamiento S-Class: Line Array dB Technologies, Bose F1 Model 812 + Subwoofer, Microfonía inalámbrica Shure Axient / SLXD.
3. **Split Soberano de Liquidación:**
   - **80%:** Proveedor o Artista directo (a través de Stripe Connect Express).
   - **10%:** Canon de Infraestructura EAR OS (servidores, redundancia N+1 y desarrollo).
   - **10%:** Fondo Social y de Investigación VIMUME.
4. **Módulo de Blindaje Anti-Fuga (Supplier Blur-Lock):**
   - Cobro de 10 € (Smart-Lock de 72 horas) para desbloquear el contacto directo, teléfono auditado y contratación sin intermediarios de cualquier proveedor del catálogo.
5. **Garantía Legal Inmutable:** Cumplimiento estricto del Art. 108 de la Ley de Propiedad Intelectual española y convenios con SGAE, AIE y AGEDI.

---

## CAPÍTULO 2: ARQUITECTURA DE ROLES, ACCESOS Y PERMISOS

EAR OS V2 implementa un control de acceso basado en roles (RBAC) granular y criptográficamente sellado:

### 2.1 Rol: Artista / DJ de Cabina
- **Nivel Freemium (0 € / Zero-CAC):**
  - Acceso al instalador silencioso Cue Bridge en 1-Clic (`install-ear-cue-bridge.ps1`).
  - Carga de historiales de cabina (`.m3u, .csv, .xml, .nml, .txt`) con extracción sub-100ms.
  - Visor en tiempo real de canciones ejecutadas y simulación de canon SGAE/AIE acumulado.
  - Perfil público con datos sensibles protegidos mediante `SupplierBlurLock`.
- **Nivel Pro S-Class (10 €/mes o 99 €/año):**
  - Retirada completa del Blur-Lock (Ficha 100% visible con insignia Gold).
  - Pasarela activa para recibir reservas directas de clientes mediante Split Soberano 80/10/10.
  - Emisión de actas oficiales con firma criptográfica SHA-256 para reclamación formal ante entidades de gestión.

### 2.2 Rol: Dueño de Recinto / Venue / Finca de Bodas
- **Póliza Legal Anti-Multas SGAE:** Emisión de actas de comunicación pública que demuestran qué obras sonaron exactamente y desgravan inspecciones abusivas.
- **Suscripción de Hilo Musical B2B:**
  - *Tier Esencial (49 €/mes):* Licencia para 1 zona / terraza.
  - *Tier Pro Sala (99 €/mes):* Hasta 3 zonas con emisión automática de expedientes mensuales.
  - *Tier Dominio Finca (199 €/mes):* Cobertura ilimitada multiespacio, despacho automático a la gestoría y asesoría jurídica 24/7.

### 2.3 Rol: Proveedor de Producción & Alquiler
- Ficha técnica de Rider con catálogo de iluminación, sonido y carpas.
- Protección Blur-Lock: Los clientes pagan 10 € para acceder a su teléfono y solicitar disponibilidad en tiempo real.

### 2.4 Rol: CEO & Administrador Soberano (EAR OS Admin)
- Panel Maestro **Fénix Dashboard** (`/admin/dashboard` y `/admin/s-class`).
- Monitor de facturación Stripe en tiempo real y conciliación de splits.
- Módulo **B2G Hunter** (`b2g-hunter.ts`): Búsqueda y análisis de licitaciones públicas de fiestas patronales e iluminación de navidad en municipios españoles.
- Gestor ZTM: Monitor de la Bóveda de 147.000+ archivos y sincronización de base cognitiva RAG.

---

## CAPÍTULO 3: MOTOR FINTECH & PASARELA DE COBRO STRIPE

Todas las transacciones de EAR OS se procesan mediante Stripe Checkout Sessions y Webhooks securizados con firma HMAC SHA-256.

### 3.1 Server Actions de Facturación
1. `createArtistRoyaltyTrackerCheckout(input)`:
   - **Ruta:** `src/app/actions/stripeBillingActions.ts`
   - **Importe:** 10,00 €/mes o 99,00 €/año (-20% descuento).
   - **Metadatos:** `type: "ARTIST_ROYALTY_TRACKER_SUBSCRIPTION"`, `artisticName`, `nifDni`, `sgaeCode`.
   - **Retorno:** Sesión de suscripción recurrente con Stripe Billing.
2. `createVenueSubscriptionCheckout(input)`:
   - **Ruta:** `src/app/actions/stripeBillingActions.ts`
   - **Importe:** 49 €, 99 € o 199 €/mes (o anual equivalente).
   - **Metadatos:** `type: "VENUE_MUSIC_LICENSE_SUBSCRIPTION"`, `venueName`, `venueNif`, `tierId`.
3. `createSupplierUnlockCheckout(input)`:
   - **Ruta:** `src/app/actions/vipCheckoutActions.ts`
   - **Importe:** 10,00 € (Pago único).
   - **Metadatos:** `type: "SUPPLIER_CONTACT_UNLOCK"`, `supplierId`, `depositPaid: "10"`.
4. `createVipChauffeurCheckout(input)`:
   - **Ruta:** `src/app/actions/vipCheckoutActions.ts`
   - **Importe:** 10,00 € (Reserva de chófer de representación S-Class).

### 3.2 Webhook de Liquidación & Validación de Firma
- **Ruta del Endpoint:** `/api/webhooks/stripe`
- **Seguridad:** Verificación obligatoria de `stripe-signature` con `STRIPE_WEBHOOK_SECRET`.
- **Eventos Manejados:**
  - `checkout.session.completed`: Aprovisiona la suscripción o desbloquea el token del proveedor.
  - `invoice.payment_succeeded`: Renueva la licencia legal del local y emite el certificado mensual.
  - `invoice.payment_failed`: Notifica al local y suspende la emisión del visado legal.

---

## CAPÍTULO 4: UNIVERSAL CUE BRIDGE & VIGILANTE DE CABINA EN TIEMPO REAL

### 4.1 Arquitectura del Motor Universal (`UniversalCueBridge.ts`)
Parser polimórfico capaz de procesar cualquier formato de software de DJ en < 1 milisegundo:
- **Formatos Soportados:** `.m3u`, `.m3u8`, `.csv`, `.xml`, `.nml`, `.txt`.
- **Softwares Reconocidos:** VirtualDJ (`#EXTVDJ`), Rekordbox XML (`<TRACK>`), Serato DJ (`play time, artist, name`), Traktor Pro NML (`<ENTRY>`), Denon Engine CSV.
- **Saneamiento de Metadatos (`cleanArtistAndTitle`):** Elimina de forma automática números de pista, guiones dobles, prefijos de álbum y etiquetas de ripeo.
- **Algoritmo de Desduplicación S-Class (`deduplicateTracklist`):**
  - Fusiona cabeceras `#EXTINF` con sus rutas físicas asociadas para evitar doble contabilización.
  - Filtra precargas de platos (Deck A/B Cue) consecutivas idénticas.
  - Consolida la duración máxima observada.

### 4.2 Generador de Certificados Criptográficos (`cue-sheet-generator.ts`)
- **Fórmula del Hash Inmutable:**
  `SHA-256(certificateId | venueNif | gpsCoordinates | totalTracks | issuedAt | EAR_OS_SOVEREIGN)`
- **Salida Visual S-Class:** Renderizado en HTML5 con tipografía Syne y JetBrains Mono, preparado para impresión física o visualización en alta definición.

### 4.3 Vigilante en Segundo Plano (`ear_session_watcher.js`)
- **Monitoreo Multi-Ruta Simultáneo:**
  - `C:\Users\M2-W10\Documents\VirtualDJ\History\`
  - `C:\Users\M2-W10\OneDrive\Documents\VirtualDJ\History\`
  - `C:\Users\M2-W10\OneDrive - Personal\Documents\VirtualDJ\History\`
  - Directorios de Rekordbox, Serato y Traktor.
- **Cerrojo Debounce Hash Lock (10 Segundos):** Si OneDrive y la carpeta local vuelcan el mismo contenido simultáneamente, el cerrojo descarta el duplicado y emite una sola acta limpia.
- **Guardado Atómico Multi-Destino:**
  1. Escritorio de Windows (Local y OneDrive).
  2. Bóveda Central: `C:\Users\M2-W10\.ear-os\certificates\`.
  3. Backup Raw: `C:\Users\M2-W10\.ear-os\session-history\`.

### 4.4 Instalador DJ en 1-Clic (`install-ear-cue-bridge.ps1`)
- Menú interactivo para 6 marcas: VirtualDJ, Rekordbox, Serato, Traktor, Denon y Genérico.
- Autodetección de GPU AMD Radeon RX 7900 XTX y servidor local Ollama.
- Registro silencioso en la carpeta de Inicio de Windows (`EAR_OS_Session_Watcher.vbs`).

### 4.5 Editor Visual de Configuración (`open-config-ui.ps1` & `config_server.js`)
- Micro-servidor HTTP local en el puerto **3008** (`http://127.0.0.1:3008`).
- Interfaz gráfica en 3 pestañas (Perfil DJ, Recinto de Gala, Opciones de Vigilancia) para modificar `~/.ear-os/ear-dj-config.json` sin tocar código.

### 4.6 Generador de Códigos QR (`/api/tools/qr-cue-bridge`)
- Endpoint que entrega el código QR en SVG vectorial o PNG de alta densidad apuntando a la descarga directa del conector para escaneo en cabinas o pegatinas de controladoras.

---

## CAPÍTULO 5: PROTOCOLO ZERO-TOKEN MEMORY (ZTM) & BÓVEDA COGNITIVA

### 5.1 Regla Inmutable de Token Ceiling
- Prohibido volcar archivos brutos > 2.000 tokens en el contexto del modelo.
- Toda digestión documental se delega a scripts locales (`ztm_purist_archivist.py`) o a la GPU local AMD Radeon RX 7900 XTX vía Ollama (`http://localhost:11434`).

### 5.2 Estructura de la Bóveda Central (`H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\`)
Los archivos analizados se mueven físicamente a 7 categorías inmutables:
1. `ACADEMIA_ASTRA/` (Roadmaps, directivas y prompts maestros).
2. `CONTRATOS_Y_LEGAL/` (Contratos 360, precontratos, cláusulas de exclusividad y riders).
3. `DOCUMENTOS_HISTORICOS/` (Backups generales y chats pasados).
4. `INCUBADORA_VAMPIRIZADA/` (Scraping de proveedores, fincas y directorios de bodas).
5. `METRICAS_Y_VENTAS/` (Balances, presupuestos y auditorías de ROI).
6. `PROPIEDAD_INTELECTUAL_DNDA/` (Registros de obras, certificados DNDA y fichas de autor).
7. `TRANSCRIPCIONES_AUDIO/` (Transcripciones de voz de sesiones y directivas del CEO).

### 5.3 Base de Datos RAG (`src/data/ear-rag-database.json`)
- Almacena **más de 30.000 nodos semánticos** con resumen comprimido (< 300 palabras), SHA-256, categoría y ruta de bóveda para consultas instantáneas.

---

## CAPÍTULO 6: CATÁLOGO ATÓMICO DE HERRAMIENTAS Y SCRIPTS LOCALES

A continuación se detalla cada script operativo disponible en la carpeta `/scripts`:

| Script | Lenguaje | Comando de Invocación | Entrada / Parámetros | Salida / Resultado | Descripción Operativa |
|---|---|---|---|---|---|
| `install-ear-cue-bridge.ps1` | PowerShell | `.\scripts\install-ear-cue-bridge.ps1` | `-Brand <VIRTUALDJ\|REKORDBOX...>`, `-OpenUI`, `-SkipWatcher` | Configura `ear-dj-config.json` y registra watcher | Instalador maestro de cabina en 1-clic con menú interactivo de 6 marcas. |
| `register_autostart_watcher.ps1` | PowerShell | `.\scripts\register_autostart_watcher.ps1 -Register` | `-Register`, `-Unregister`, `-Status` | Registra/Consulta `EAR_OS_Session_Watcher.vbs` | Gestor de arranque silencioso en Windows Startup (Hidden Window). |
| `ear_session_watcher.js` | Node.js | `node scripts/ear_session_watcher.js` | Monitoreo continuo de directorios DJ | Genera acta en Desktop y Bóveda | Vigilante en tiempo real con soporte multi-ruta y Debounce Hash Lock de 10s. |
| `quick_vdj_live_test.js` | Node.js | `node scripts/quick_vdj_live_test.js` | Pistas FLAC de Adalberto Santiago en `G:\` | `EAR_OS_VDJ_QUICK_TEST.html` en Desktop | Test runner forense de alta velocidad (0.53 ms) con assertion de unicidad. |
| `test_multipath_vdj_trigger.js` | Node.js | `node scripts/test_multipath_vdj_trigger.js` | Simula escritura en Local y OneDrive | 2 actas en Desktop y Bóveda | Prueba forzada de disparo simultáneo verificando bloqueo de duplicados. |
| `config_server.js` | Node.js | `node scripts/config_server.js` | Puerto 3008 | Servidor HTTP de la GUI | Micro-servidor local zero-dependencies para la interfaz web de configuración. |
| `open-config-ui.ps1` | PowerShell | `.\scripts\open-config-ui.ps1` | Ninguno | Abre `http://127.0.0.1:3008` en el navegador | Lanzador visual de 1-clic para el editor de identidad DJ y recintos. |
| `ztm_purist_archivist.py` | Python 3 | `python scripts/ztm_purist_archivist.py` | `--continuous` o ejecución única | Bóveda Vault + `ear-rag-database.json` | Motor de archivo físico, delta-indexing SHA-256 y vaciado de discos. |
| `test_virtualdj_bridge.js` | Node.js | `node scripts/test_virtualdj_bridge.js` | Historial M3U sintético | `VIRTUALDJ_TEST_REPORT.json` y PDF | Suite de pruebas unitarias (8/8 assertions) para UniversalCueBridge. |
| `clean_redundant_files.py` | Python 3 | `python scripts/clean_redundant_files.py` | Rutas huérfanas de trabajo | Eliminación o reubicación segura | Limpieza de archivos temporales y residuos de pruebas. |

---

## CAPÍTULO 7: INVENTARIO INTEGRAL DE RUTAS Y ENDPOINTS DE LA PLATAFORMA

### 7.1 Páginas Públicas & Embudo de Conversión
- `/` — Portada Principal S-Class con cotizador neural y selector de experiencias.
- `/artistas` — Hub unificado de artistas con Roster S-Class, The Signal Onboarding y acceso a Cabina Freemium.
- `/artistas/dashboard` — Portal de Artistas & DJs Freemium (Acceso gratuito 0 € con Cue Bridge y checkout Pro 10 €/mes).
- `/artistas/reclamar-regalias` — Landing Page de captación masiva ("El Vengador de Regalías") con calculadora de dinero no reclamado y descarga directa del conector.
- `/artistas/edwin-agudelo` — Dossier de representación del artista solista Edwin Agudelo.
- `/arsenal` & `/arsenal/luces-navidad` — Catálogo técnico de iluminación, sonido y producción para eventos corporativos y B2G.
- `/proveedores` — Directorio de proveedores de boda y eventos con protección `SupplierBlurLock`.

### 7.2 Endpoints API & Herramientas
- `/api/tools/download-cue-bridge` — Descarga directa del script instalador `install-ear-cue-bridge.ps1` con cabeceras `Content-Disposition: attachment`.
- `/api/tools/qr-cue-bridge` — Generador dinámico de código QR en formato SVG vectorial o PNG de alta resolución.
- `/api/webhooks/stripe` — Webhook de procesamiento de eventos financieros de Stripe con firma HMAC SHA-256.
- `/api/quote/calculate` — Motor de cálculo dinámico de presupuestos en tiempo real.

---

## CAPÍTULO 8: GUÍAS DE OPERACIÓN PASO A PASO POR ROL

### 8.1 Guía Rápida para el DJ / Músico en Cabina
1. **Paso 1:** Escanea el código QR de la cabina o visita `https://www.productoraear.com/artistas/reclamar-regalias`.
2. **Paso 2:** Haz clic en *"Descargar Conector 1-Clic"* y ejecuta el script PowerShell en tu portátil de cabina.
3. **Paso 3:** Realiza tu sesión con normalidad en VirtualDJ, Rekordbox, Serato o Traktor.
4. **Paso 4:** Al cerrar el software, el acta con la firma criptográfica SHA-256 aparecerá depositada automáticamente en tu Escritorio de Windows.
5. **Paso 5:** Para recibir liquidaciones directas, suscríbete al Plan Pro en `/artistas/dashboard` vinculando tu cuenta de Stripe Connect.

### 8.2 Guía para el Propietario de Sala / Finca de Eventos
1. **Paso 1:** Entra en `https://www.productoraear.com/artistas/reclamar-regalias` y selecciona *"Planes B2B para Salas"*.
2. **Paso 2:** Selecciona tu suscripción (Esencial 49 €/mes, Pro 99 €/mes o Dominio 199 €/mes).
3. **Paso 3:** Descarga y activa el reproductor de hilo musical homologado.
4. **Paso 4:** Cada fin de mes, el sistema despacha a tu correo el acta oficial visada para desgravar y anular inspecciones de la SGAE.

---

## CAPÍTULO 9: FÓRMULAS ACÚSTICAS, MATEMÁTICAS DE PRICING Y BLINDAJE LEGAL

### 9.1 Presión Acústica & Física de Eventos
- **Fórmula de Potencia Mínima:** $P_{\text{min}} = N_{\text{invitados}} \times 12 \text{ W/pax}$.
- **Garantía 0 Fallos:** Cobertura estéreo balanceada con presión sonora continua de $98 \text{ dBA}$ en pista de baile y $78 \text{ dBA}$ en zona lounge / cóctel.
- **Rider Tipo S-Class:**
  - 2x Bose F1 Model 812 (Array Flexible 1.000W).
  - 2x Bose F1 Subwoofer (1.000W con cajón de graves integrado).
  - 2x Monitores de cabina dB Technologies Opera 12.
  - Microfonía Shure Axient Digital o SLX-D con cápsula Beta 58A.

### 9.2 Marco Legal y Protección de Derechos
- **Artículo 108 de la Ley de Propiedad Intelectual (RDL 1/1996):** Ampara la remuneración equitativa de artistas e intérpretes por la comunicación pública de fonogramas.
- **Validez del Hash SHA-256:** La firma digital generada vincula de forma inmutable el identificador de sesión, NIF del local, coordenadas GPS y listado de pistas ejecutadas, constituyendo prueba documental fehaciente ante cualquier tribunal o entidad de gestión.

---

## CAPÍTULO 10: PROCEDIMIENTOS DE MANTENIMIENTO, ROLLBACK Y HARDWARE OFFLOADING

### 10.1 Verificación de Integridad del Código
Antes de cualquier despliegue o modificación, ejecutar:
```powershell
npx tsc --noEmit
```
Debe devolver **Exit Code 0 (0 errores)**.

### 10.2 Hardware Offloading Local (AMD Radeon RX 7900 XTX 24GB)
- **Servidor Ollama:** `http://localhost:11434`
- **Modelos Recomendados:** `qwen2.5-coder:32b` para análisis de código y `llama3.1:latest` para extracción semántica RAG.
- **Uso:** Todas las tareas de indexación de textos masivos se delegan a la GPU local mediante llamadas HTTP locales sin consumir cuota de tokens en la nube.

---
*Fin del Manual de Propietario · Productora EAR S.L. · Todos los derechos reservados.*

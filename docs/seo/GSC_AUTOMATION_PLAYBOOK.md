# 📡 PLAYBOOK DE AUTOMATIZACIÓN DE GOOGLE SEARCH CONSOLE (GSC)
## Pipeline de Inteligencia de Tráfico, Oportunidades SEO & Consola del Paciente Cero

> **Misión:** Transformar los volcados periódicos de Google Search Console en un dataset de inteligencia estructurado (`src/data/telemetry/gsc-performance-data.json`) que alimenta la Consola del Paciente Cero, el Oráculo RAG y el motor de enrutamiento semántico sin intervención técnica manual.

---

## 1. Arquitectura de Ingesta & Archivos GSC

```mermaid
flowchart TD
    GSC[Google Search Console] -->|Export ZIP / API| Folder[g s console/]
    Folder --> IngestScript[scripts/ingest_gsc_data.ts]
    IngestScript --> Dataset[src/data/telemetry/gsc-performance-data.json]
    Dataset --> API[/api/telemetry/gsc]
    Dataset --> Dashboard[/dashboard/paciente-cero]
    Dataset --> SemanticEngine[src/lib/seo/semantic-engine.ts]
```

### ¿Qué contiene cada archivo exportado?
| Archivo | Contenido | Uso en EAR OS V2 |
|---|---|---|
| **`Consultas.csv`** | Términos reales que busca la gente en Google con Clics, Impresiones, CTR y Posición media | Detección de clústeres de alta oportunidad (ej: *pantalla led gigante madrid*, *wedding planners a coruña*) |
| **`Páginas.csv`** | URLs exactas que Google tiene indexadas o en rastreo | Mapeo de canibalizaciones y reglas de redirección 301 en `src/app/[...slug]/page.tsx` |
| **`Dispositivos.csv`** | Distribución Móvil vs. Ordenador vs. Tablet | Ajuste de UX y priorización mobile-first en cotizadores |
| **`Países.csv`** | Tráfico por país (España, Latam, USA, Europa) | Filtrado geográfico de presupuestos y enrutamiento B2B/B2G |
| **`Gráfico.csv`** | Histórico temporal día a día de clics e impresiones | Gráfica de tendencias en la consola del Paciente Cero |
| **`Filtros.csv`** | Metadatos de la exportación (rango temporal y tipo) | Timestamping del dataset |
| **`Aparición en búsquedas.csv`** | Rich Snippets y fragmentos enriquecidos | Validación de microformatos Schema.org |

---

## 2. Los 2 Modos de Alimentación (Tu Función vs Automatización)

### MODO A: Semiautomático (Recomendado — 10 Segundos)
**Tu única función:**
1. Entra en [Google Search Console](https://search.google.com/search-console) -> Propiedad `https://www.productoraear.com`.
2. Ve a la pestaña **Rendimiento** en el menú izquierdo.
3. Haz clic en el botón superior derecho **Exportar** -> **Descargar archivo ZIP**.
4. Descomprime el ZIP y mueve los 7 archivos CSV a la carpeta:
   `C:\EAR_OS_V2\g s console\` (o déjalos dentro de la carpeta con la fecha que crea GSC).
5. Abre tu terminal de PowerShell y ejecuta:
   ```powershell
   npm run gsc:ingest
   ```

**Lo que hace el sistema de forma 100% automática:**
- Detecta automáticamente la carpeta más reciente por fecha.
- Parsea y normaliza todos los formatos numéricos y porcentajes.
- Calcula el **Score de Oportunidad** para cada consulta.
- Actualiza el archivo SSOT `src/data/telemetry/gsc-performance-data.json`.
- Refresca en tiempo real la pestaña de Telemetría de la Consola del Paciente Cero (`/dashboard/paciente-cero`).

---

### MODO B: 100% Automático vía API (Zero Clics)
Si prefieres que no haya ninguna descarga manual de archivos:

1. **Paso Único (Configuración Inicial en 2 minutos):**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/).
   - Activa la **Google Search Console API**.
   - Crea una **Service Account**, genera una clave en formato JSON y guárdala en `scripts/gsc_credentials.json` (este archivo está protegido en `.gitignore`).
   - Copia el email de la Service Account (ej: `ear-gsc-reader@...gserviceaccount.com`) y añádelo como usuario con permisos de **Lector** en Google Search Console.
2. **Automatización:**
   - Se ejecuta el cron semanal que consulta la API de Google, descarga las últimas métricas de rendimiento y llama automáticamente a `ingestGscData()`.

---

## 3. Comandos Operativos

```powershell
# Ingesta y actualización manual del dataset
npm run gsc:ingest

# Verificación de integridad de TypeScript
npx tsc --noEmit

# Despliegue de actualización
git add .
git commit -m "feat(telemetry): gsc performance auto-ingestion pipeline"
git push origin main
```

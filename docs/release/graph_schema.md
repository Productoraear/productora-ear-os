# 📊 GRAPH SCHEMA SPECIFICATION — EAR OS V2
> **Root Canónico:** `C:\EAR_OS_V2`  
> **Rol:** Especificación del Esquema del Grafo de Conocimiento Gravitacional

---

## 1. NODO RAÍZ
- **ID:** `EAR_OS_ROOT`
- **Ruta:** `C:\EAR_OS_V2`
- **Tipo:** Gravitational Mass Center
- **Atributos:** `is_canonical: true`, `score: 100`, `status: EAR_OS_CORE`

---

## 2. ESQUEMA DE NODOS (NODE TYPES & STATUS)

### Tipos de Nodo (`type`)
- `SSOT`: Documento de verdad inmutable o kernel de gobernanza.
- `Orchestrator`: Script de ignición y orquestación.
- `Script`: Script de utilidad, pipeline o mantenimiento.
- `Dashboard`: Interfaz visual de observabilidad.
- `Document`: Documentación, notas o especificaciones de diseño.
- `Asset`: Recurso multimedia, imagen, audio o vector.
- `Storage`: Directorio o contenedor de almacenamiento/cuarentena.
- `External`: Servicio, API o infraestructura externa (Firebase, Vercel, Supabase, Stripe).

### Estados de Nodo (`status`)
- `EAR_OS_CORE`: Integrante activo del núcleo canónico (Score >= 80 en root).
- `HIGH_CONFIDENCE_RELATED`: Detectado en PC con pertenencia confirmada (Score >= 80).
- `RELATED`: Pertenencia moderada (Score 60 - 79).
- `POSSIBLY_RELATED`: Pertenencia débil (Score 40 - 59).
- `ORPHAN`: Sin conexiones vivas identificadas.
- `LEGACY`: Artefacto de versiones anteriores mantenido por compatibilidad.
- `QUARANTINED`: Aislado en depósitos de seguridad.

---

## 3. ESQUEMA DE ARISTAS (RELATION TYPES & WEIGHTS)

| Tipo de Arista | Dirección | Descripción | Peso |
|---|---|---|---|
| `contiene` | Padre -> Hijo | Relación jerárquica de directorio/archivo | `1.0` |
| `depende-de` | A -> B | Invocación de código o import de módulo | `1.0` |
| `observado-en` | A -> B | Telemetría registrada en consola o log | `0.9` |
| `reemplaza` | Nuevo -> Antiguo | Sustitución formal de versión previa | `0.8` |
| `deriva-de` | Nuevo -> Origen | Transformación de datos o conocimiento | `0.7` |
| `referencia` | A -> B | Mención explícita en SSOT/documentación | `0.6` |
| `duplica` | A -> B | Identidad de firma hash SHA256 | `0.5` |
| `cuarentenado-en` | Objeto -> Depósito | Aislamiento en carpeta de preservación | `0.3` |

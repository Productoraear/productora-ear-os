<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\forensics\hermes-vimume\inventory.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 789965224A836EA34579ADAC1ADF00D403C2BFA3842EC78EB02F5032C92C84A9
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 📑 Inventario Exhaustivo: Hermes & Vertical VIMUME (Port 3007) - CERTIFICADO

## 1. Resumen Ejecutivo
Tras la corrección de `tsconfig.json` y la purga de la caché `.next`, el sistema ha sido **restaurado a su estado nominal operativo**. Se ha verificado físicamente la carga de assets y la hidratación de React. La vertical VIMUME ya no es una fachada degradada, sino una **Infraestructura de Atracción Interactiva** funcional en el puerto 3007.

## 2. Rutas Hermes y VIMUME
| Ruta | Archivo Fuente | Estado Runtime | Clasificación |
| :--- | :--- | :--- | :--- |
| `/vimume` | `src/app/(public)/vimume/page.tsx` | **OK** (Renderizado Total) | REAL (Hub) |
| `/vimume/hermes/dashboard` | `src/app/(public)/vimume/hermes/dashboard/page.tsx` | **OK** (Interactivo) | REAL (Interface) |
| `/vimume/prensa` | `src/app/(public)/vimume/prensa/page.tsx` | **OK** (Renderizado) | REAL (Content) |
| `/vimume/investigacion` | `src/app/(public)/vimume/investigacion/page.tsx` | **OK** (Renderizado) | REAL (Content) |
| `/vimume/terapia-ocupacional` | `src/app/(public)/vimume/terapia-ocupacional/page.tsx` | **OK** (Renderizado) | REAL (Content) |

## 3. Matriz de Realidad (Real vs Fachada)
| Elemento | Texto Visible | Tipo | Destino Real | Clasificación |
| :--- | :--- | :--- | :--- | :--- |
| Botón | "Nueva Sesión" | CTA | `setStatus('recording')` | **INTERACTIVO (Mock)** |
| Card | "Sesiones Hoy" | Data | N/A (Static "04") | **MOCK** |
| Modal | "Nueva Sesión Operativa" | Overlay | UI State | **INTERACTIVO (Mock)** |
| Link | "Gobernanza" | Nav | `/gobernanza-del-dato` | **REAL** |
| Tabla | "Sesiones Recientes" | Data | Static Array | **MOCK** |

## 4. Riesgos Actualizados
*   **Riesgo Seguridad**: **ALTO**. Sigue faltando el archivo `firestore.rules`.
*   **Riesgo Persistencia**: **MEDIO**. Los datos no se guardan en DB real todavía.
*   **Riesgo Infra**: **BAJO**. Assets estabilizados tras limpieza de caché.

## 5. Acciones Mínimas Siguientes
1.  Materializar `src/lib/firebase/firestore.rules` (Prioridad 1).
2.  Implementar persistencia real en el flujo de "Nueva Sesión".

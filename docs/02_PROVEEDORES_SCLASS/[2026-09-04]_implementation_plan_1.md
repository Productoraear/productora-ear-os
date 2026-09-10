# Purga de Alucinaciones y Despliegue del Motor Forense

El modelo LLM generó de forma espontánea una narrativa falsa para rellenar los vacíos en el contexto (Zero-Token Memory). Esta alucinación compromete la autoridad S-Class y el posicionamiento de Productora EAR. Procederemos con la erradicación inmediata, el rediseño del Hero y el despliegue del script de minería.

## Open Questions

Para calibrar el Motor de Minería Forense (`vampire_bio_and_objections_miner.py`), necesito que me confirmes los siguientes puntos de operación:

> [!IMPORTANT]
> **Ruta de Ingesta:** ¿En qué ruta exacta, carpeta maestra o disco (por ejemplo, `H:\EAR_INGESTION_HUB` o `D:\Documentos_Estrategicos`) se encuentran concentrados tus documentos biográficos reales y las transcripciones de la Incubadora/Dani Aragón?

> [!IMPORTANT]
> **Flujo de Publicación:** ¿Prefieres que los datos extraídos se publiquen automáticamente en el frontend sobrescribiendo los archivos JSON, o prefieres que pasen primero por una "Bandeja de Aprobación" en tu panel de administrador?

> [!IMPORTANT]
> **Hitos Innegociables:** Para asegurar que el sistema nunca vuelva a inventar tu pasado, ¿cuáles son los 3 hitos reales más importantes de tu carrera artística o personal que debemos blindar permanentemente en el código fuente de tu biografía oficial?

## Proposed Changes

---

### UI & UX: Silicon Valley Hero Section

#### [MODIFY] src/app/vimume/page.tsx
- Inyectar módulo de Hero 100vh usando `framer-motion` (efecto Reveal Up).
- Tipografía display gigante (True Black / Violeta).
- Botón "Cotizar" pulsante de acción inmediata.

#### [MODIFY] src/app/artistas/edwin-agudelo/page.tsx (o archivo raíz de perfil)
- Hero 100vh con Video Muted en bucle y `framer-motion`.
- Reemplazar texto narrativo con ganchos ultra-cortos S-Class.

---

### Depuración de Narrativa y "Efecto Fénix"

#### [MODIFY] src/components/artists/ArtistCinematicProfile.tsx
- **[DELETE]** Toda mención a "Amagá", "Taxi", "Corte de Aluminio", "Mecánica", "Ana Gabriel".
- **[NEW]** Inyectar la narrativa real del "Efecto Fénix" (El Tenor que domina el escenario y diseña sistemas soberanos).

#### [MODIFY] src/features/artists/ui/EdwinEcosystemHero.tsx
- Eliminar extractos de biografía alucinada y reemplazar con retórica S-Class.

#### [MODIFY] src/features/artists/ui/EdwinArtistVault.tsx
- Limpieza de datos espurios y reescritura.

#### [MODIFY] src/lib/artists/schema.ts
- Actualizar `bioLong` con la narrativa depurada.

#### [MODIFY] src/widgets/about/AboutWidget.tsx
- Eliminar la historia del taxi y aluminio.

---

### Lobotomía del Asistente Local (Modo Closer)

#### [MODIFY] src/app/api/chat/concierge/route.ts
- Ajustar `temperature: 0.1` para forzar determinismo.
- Modificar el `System Prompt`: "*ERES UN CLOSER DE VENTAS S-CLASS, NO UNA WIKIPEDIA. Si el usuario pregunta PRECIOS, debes consultar el catálogo SSOT, dar la cifra y preguntar: '¿Para qué fecha y en qué espacio deseas bloquear este servicio?'*".

---

### Motor Forense de Minería

#### [NEW] scripts/vampire_bio_and_objections_miner.py
- Script de escaneo recursivo mediante Regex.
- Extracción de Target 1 (Biografía de Edwin Agudelo) y Target 2 (300 Objeciones y Tácticas de Cierre).
- Generación de `src/data/edwin-true-bio-ssot.json` y `src/data/oraculo-300-objeciones-ssot.json`.

## Verification Plan

### Automated Tests
- Compilación estricta: `npx tsc --noEmit`
- Verificación de Bundle: `npx next build`

### Manual Verification
- Visualizar los endpoints `/artistas/edwin-agudelo` y `/vimume` para confirmar el efecto 100vh de Framer Motion.
- Interactuar con el asistente virtual para verificar su comportamiento determinista (Temperature 0.1) ante preguntas de precios.

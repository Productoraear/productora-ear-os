---
name: seo-optimizer
description: Auditoría y optimización de metadatos SEO en streaming sobre páginas Next.js 16 de EAR OS. Fija el título a 50-60 caracteres, la meta description a 140-160 con doctrina Velocity, el JSON-LD sin alucinaciones y detecta canibalizaciones y URLs huérfanas con scripts/audit_seo_metadata.cjs a 0 tokens.
lifecycle_phase: REVIEW (QA | Gate)
command: /review
framework: EAR OS S-CLASS · Velocity Copy · Ley del Auditor Real
governance: ANTIGRAVITY OMEGA v11.0 (S-CLASS)
---

# SEO Optimizer · Metadatos en Streaming S-Class (EAR OS)

## Misión
Auditar y optimizar los metadatos (`export const metadata` / `generateMetadata`) de las rutas de `src/app/` **sin construir el proyecto, sin red y sin coste de tokens**: la medición corre en local contra el código fuente real.

## Reglas de Oro

### 1. Título (50-60 caracteres)
Formato canónico:

`[Servicio] en [Municipio] · [Propuesta de Valor] | EAR OS`

- Un solo separador interno `·` y un `|` final de marca.
- No repetir el municipio si ya está dentro del servicio.
- En las rutas vivas el sufijo medido es `| Productora EAR`; el auditor acepta el token de marca `EAR` en cualquiera de las dos formas. No se reescribe copy en producción para satisfacer una plantilla (AMD-1: gana la cláusula más exigente, no la más cosmética).

### 2. Meta Description (140-160 caracteres) — Doctrina Velocity
- Cero adjetivos vacíos ("increíble", "único", "el mejor", "revoluciona").
- Certeza técnica verificable: cifra del SSOT (`350,00 €` · `14.250,00 €` · split `80/10/10` · `< 75 dB SPL`) o hecho operativo medible.
- Llamada de contacto explícita o implícita (Centralita oficial `+34 693 693 048`).
- Prohibido prometer lo que no responde en una URL pública (EP-3).

### 3. JSON-LD (schema.org)
- Tipos admitidos: `LocalBusiness`, `Service`, `Product`, `Offer`, `FAQPage`, `AggregateRating`, `GovernmentService`.
- **Prohibida la alucinación**: cada valor (`price`, `aggregateRating`, `areaServed`, `telephone`) sale del SSOT (`src/lib/constants/ear-os-ssot.ts`) o de un dataset real del repositorio.
- Fuente canónica del grafo: `src/lib/seo/schemaOrgGenerator.ts` (`generateSchemaOrgJsonLd`). **Extender, nunca duplicar** (doctrina Ponytail).
- `AggregateRating` solo con reseña real verificable: JUR-4 prohíbe reseñas fabricadas.

### 4. Canibalización y URLs huérfanas
- Dos rutas con el mismo `<title>` normalizado = canibalización → fusionar, diferenciar intención o canonicalizar.
- `alternates.canonical` debe apuntar a una ruta que exista de verdad en `src/app/`.
- Ruta que vende sin `metadata` propio = URL huérfana de intención: hereda copy genérico y pierde SERP.

## Protocolo de ejecución
```powershell
node scripts/audit_seo_metadata.cjs               # informe completo · exit 0
node scripts/audit_seo_metadata.cjs --public-only # sólo superficie SERP (258 de 322 rutas medidas)
node scripts/audit_seo_metadata.cjs --json        # resumen máquina
node scripts/audit_seo_metadata.cjs --strict      # exit 1 si hay violaciones
npm run audit:seo                                 # atajo npm
```
Informe en disco: `.antigravity/reports/seo_metadata_audit.json`.

Alcance medido del auditor:
- `src/app/**/page.tsx` (los `layout.tsx` se cuentan aparte: su `title` suele ser una plantilla `%s`, no una promesa de SERP).
- Separación de superficies: **pública** (compite en SERP) vs **interna** (`/admin`, `/portal`, `/panel`, `/vendor`, `/studio`, `/register`, `/login`, `/api`). La canibalización sólo se evalúa en superficie pública; las violaciones se reportan desglosadas para no mezclar back-office con escaparate.
- Valores no literales (`title: SITE_TITLE`, plantillas con `${…}`) se declaran `SIN_EVIDENCIA`, nunca se inventan.

## Tabla Anti-Racionalización
| Excusa común del agente | Réplica de ingeniería senior |
| :--- | :--- |
| *"Google reescribe los títulos, da igual el largo."* | Google trunca a ~60 caracteres: lo que se corta es la propuesta de valor, no la marca. |
| *"Ya tengo description, es descriptiva."* | Descriptiva no es convertible: sin cifra del SSOT y sin contacto no hay clic. |
| *"El JSON-LD lo genera el motor, yo no lo toco."* | Un `price` inventado en el grafo es un claim falso (JUR-1) con responsabilidad comercial. |
| *"Solo he cambiado el texto de un título."* | El `<title>` es el contrato de indexación: cambiarlo sin medir canibaliza otra ruta que ya posicionaba. |

## Criterios de salida (Done)
1. `node scripts/audit_seo_metadata.cjs` ejecutado en la sesión, con su salida citada.
2. 0 violaciones en las rutas tocadas (`--strict` limpio sobre el diff).
3. 0 precios ni teléfonos escritos a mano fuera del SSOT (INV-10 · INV-12).

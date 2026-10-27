# WAVE 39 — CONCIERGE CON CONTEXTO DE PÁGINA + UX MÓVIL REAL

> Fecha: 2026-10-27 · Reproduce la conversación real del CEO en `http://localhost:3007/otzarreta`.

## HECHO_VERIFICADO (causas raíz)

1. **Ceguera de contexto**: la ruta `/api/agents/chat` solo usaba `pathname` para dos heurísticas. No existía resolución `ruta → entidad`, así que estando en la ficha de Otzarreta el agente respondía *«no tengo datos de ningún restaurante»*.
2. **URL localhost bloqueada como ataque**: `SSRF_ABUSE_RE` incluía `\b(localhost|127\.0\.0\.1)\b`. Al pegar `http://localhost:3007/otzarreta`, el guardián devolvía el mensaje genérico de inyección (por eso el Concierge dijo *«Gracias por escribirnos…»*).
3. **Kilometraje inventado**: sin localidad, la ruta caía en `Méntrida (0 km)` y luego en `FINCA_DISTANCE_KM = 58 km`. De ahí el *«¿por qué lo vas a calcular desde Méntrida?»*.
4. **Falsa creencia de producto**: el prompt no distinguía *recinto colaborador* de *servicio propio*, y el modelo concluyó que «un restaurante no lo cubre Productora EAR» cuando Otzarreta/Ezkertza es un venue homologado con ficha verificada.
5. **Móvil sin lanzador**: el Concierge solo se abría con `Cmd/Ctrl+K` (inexistente en móvil) y el panel usaba `pt-[15vh]` + alturas `vh` fijas, con el composer dentro del flujo (se ocultaba tras el teclado).

## DECISIÓN

1. **`src/lib/agents/pageContext.ts`** (nuevo, server-safe, cero fetch): normaliza `pathname`/URL pegado (solo se extrae la ruta), resuelve la entidad contra fichas canónicas y emite hechos verificados + datos que faltan + guía de respuesta.
2. **Fichas soportadas**: `/otzarreta` (grupo Ezkertza Berria + Otzarreta), `/fincas/<slug>` (red homologada), `/artistas/<slug>`, `/reservar/*`.
3. **Kilometraje honesto**: `distanceKm` pasa a `number | null`. Si la entidad está fuera de la matriz del Hub, **no se cotiza logística** (ni 0 ni 58 km); el prompt declara «PENDIENTE de GPS real» y el enlace de reserva omite `km`.
4. **Anti-inyección con matiz**: las URLs pegadas se neutralizan antes del escaneo; los comandos SSRF reales (`curl`, `fetch`, `rm -rf`…) siguen bloqueados. Cero fetch de URLs del cliente.
5. **Prompt endurecido**: bloque obligatorio `FICHA VERIFICADA — ENTIDAD EN PANTALLA`, prohibición explícita de negar datos existentes y regla «recinto colaborador ≠ servicio que EAR alquila».
6. **Respuesta determinista de recinto**: si el LLM no está disponible, el fallback responde con 2 hechos verificados + pendientes de visita técnica + pregunta de fecha/invitados. Nunca más «no tengo datos».
7. **UX móvil**: lanzador flotante de 56 px con safe-area, bottom-sheet `100dvh`, cabecera con cierre, log/listado con scroll propio, composer fijo inferior con `text-base` (evita el zoom de iOS) y botón de envío de 44 px.
8. **Conflicto de capas detectado en la prueba móvil real**: el CTA flotante de WhatsApp de la landing usa `z-[995]` y `w-[calc(100%-1.5rem)]`, por lo que **tapaba el lanzador** (`z-40`) y habría flotado sobre el panel. Se elevó el Concierge a `z-[1200]` y el lanzador a `z-[1000]`, desplazándolo por encima del CTA (`bottom: 6rem + safe-area` en móvil).

## VALIDACIONES

- `verify:context` → **21/21 PASS** (ruta/URL, ficha, kilometraje null, anti-SSRF, prompt, fichas de finca/artista).
- `tsc --noEmit` → **Exit 0**.
- `eslint` (4 archivos del bloque) → **0 problemas**.
- **E2E real contra `http://localhost:3007/api/agents/chat`** (servidor del CEO): 4/4 respuestas correctas, con hechos verificados y sin ninguna negativa de datos.
- **Auditoría móvil Playwright (390×844, Edge real, toque)**: **7/7 PASS**
  - FAB 56×56 en (318, 692) — objetivo táctil correcto.
  - Input 312×48 en y=760 → composer visible dentro del viewport (844).
  - Botón enviar 44×44 · botón cerrar 36×36.
  - `font-size: 16px` (sin zoom iOS) · panel 844 px (`100dvh`) · `horizontalOverflow: false`.

## CÓMO PULIR SOBRE LA MARCHA (bucle operativo)

1. **Añadir conocimiento de una página nueva** = una entrada en `resolvePageContext()` (`src/lib/agents/pageContext.ts`) con sus hechos verificados y sus `missing`. No hay que tocar el prompt.
2. **Detectar huecos**: el servidor registra `[CONCIERGE_CONTEXT_UNRESOLVED] <pathname>` cuando entra una consulta desde una página sin ficha. Ese log es la lista de trabajo priorizada.
3. **Validar antes de tocar producción**: `npm run verify:context` (21 aserciones, $0) + `npm run verify:pricing` dentro de `gate:prepush`.
4. **Probar en caliente** sin desplegar: el dev server de :3007 recarga con Turbopack; el E2E de este bloque está en `.omni_tmp/e2e_concierge.ps1` y la auditoría móvil en `.omni_tmp/mobile_check.cjs`.
5. **Nunca pegar fichas a mano en el prompt**: los datos viven en `otzarreta-entity.ts` / `fincas-catalog.ts` y la ruta solo proyecta lo que existe (cero invención).

## RIESGOS ABIERTOS

1. Playwright no trae Chromium descargado en este equipo: la auditoría móvil usa el canal `msedge` (funciona). Si se quiere CI headless, ejecutar `npx playwright install chromium` en el runner.
2. Las fichas de recinto son estáticas (SSOT local). Para proveedores del marketplace con ficha dinámica, el cliente debe enviar `activeEntity` o ampliar el registro por slug.
3. Los teléfonos del recinto siguen fuera del chat por doctrina anti-picaresca; se comparten al confirmar visita.



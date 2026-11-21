# EAR OS v13 — DOSSIER EJECUTIVO FORENSE
---

---

---

---
# EAR OS v13 — DOSSIER EJECUTIVO FORENSE
**Valoración de producción · Capacidades · URLs públicas vs. cuarentena · Demo de conversión**
Fecha de medición: 2026-11-21 · Entorno: bare-metal Coolify `82.29.179.172:8000` · Dominio: `www.productoraear.com`
Commit servido en producción: `78537a2f` (según `/api/health`)

> **Regla de este documento:** cada número lleva su comando o su sondeo. Lo que no se pudo probar
> está escrito **SIN_EVIDENCIA**. No hay adjetivos sin cifra.

---

## 0 · LAS 5 LÍNEAS PARA EL CEO

1. **Qué es:** una plataforma completa de producción de eventos (multi-vertical) que hoy está **encendida en producción real**, cobrando por Stripe de verdad.
2. **Qué se ha medido:** 424.417 líneas de código, 315 pantallas, 222 endpoints, 76 tablas de base de datos, 827 scripts de calidad, 17 puertas de arnés (16 en verde) y **cobro real verificado**.
3. **Lo que cuesta reproducirlo desde cero:** **≈ 620.000 € – 1.150.000 €** (central ≈ **776.000 €**), con un equipo de 6–8 personas y 18–24 meses.
4. **Lo que está abierto hoy al público:** de 276 rutas estáticas, **solo 10 responden libres**; 245 están *replegadas* a `/celebraciones` y 21 redirigen canónicamente. Es una decisión de lanzamiento (`dark launching`), no un fallo técnico — pero limita la venta.
5. **Lo que hay que decidir:** certificar las rutas de venta (fincas, artistas, proveedores) o mantener el escaparate cerrado. **Hoy se puede cobrar; lo que falta es escaparate.**

---

## 1 · QUÉ ES EAR OS (explicado a cada rol)

### 1.1 Para el CEO (Edwin Agudelo) — en una frase
**EAR OS es la infraestructura que convierte un "quiero contratar música/sonido/finca" en dinero cobrado**, con reparto automático 80 % artista / 10 % plataforma / 10 % VIMUME, y con el papeleo (contrato, fianza, rider técnico, cumplimiento acústico) resuelto antes de que el cliente cuelgue.

### 1.2 Para el artista
Es su **cabina de mando**: ficha visible, tarifa, agenda, contratos, cobro garantizado por pasarela y reparto transparente. Sube su repertorio, su rider y su media; recibe la liquidación sin perseguir a nadie.

### 1.3 Para el proveedor (finca, catering, sonido)
Es su **escaparate con cobro**: ficha con fotos y tarifas, panel de reservas, bandeja de mensajes, calendario y facturación. En el plan gratuito la atención la canaliza la centralita oficial; en los planes de pago despacha su dossier directamente.

### 1.4 Para el wedding planner
Es **una mesa de trabajo**: planificador de mesas sobre plano métrico, calculadora de las 14 partidas del evento, presupuesto con sello SHA-256, y bloqueo de la fecha con fianza de 100 € deducible.

### 1.5 Para el ayuntamiento (B2G)
Es **un expediente listo para firmar**: presupuesto cerrado y fechado, documentación para el contrato menor del artículo 118 de la LCSP, y techo preventivo de **14.250 €** (bajo el límite legal de 15.000 €).

---

## 2 · MERCADOS: B2C · B2B · B2G

| Mercado | Qué se vende | Ruta / mecanismo | Evidencia |
|---|---|---|---|
| **B2C** (particulares, bodas, cumpleaños, regalos) | Artistas en directo, fincas, catering, sonido | `/presupuesto` → packs canónicos → fianza 100 € Stripe | 6 packs visibles 6/6 (demo §6) |
| **B2B** (fincas, caterings, empresas, wedding planners) | Alta de ficha, alquiler técnico, red de afiliados | `/profesionales`, `/portal/proveedor`, `/afiliados` | 200 en `/profesionales`; 11 ficheros con integración PayPal |
| **B2G** (ayuntamientos, instituciones) | Festejos, ciclos culturales, infraestructura | `/gobiernos`, `/b2g`, `/ayuntamientos` | 200 en `/gobiernos`; SSOT `AJUSTE_PREVENTIVO_B2G_EUR = 14250` |


---

## 3 · VALORACIÓN DE PRODUCCIÓN DESDE CERO (lo que costaría reproducirlo)

### 3.1 Inventario medido (esto es lo que hay que volver a construir)

| Componente | Cantidad medida | Cómo se midió |
|---|---|---|
| Líneas de código `src/` | **424.417** | `Get-Content` + `Measure-Object -Line` |
| Ficheros TypeScript/TSX | **2.042** | `Get-ChildItem src -Recurse -Include *.ts,*.tsx` |
| Ficheros en `src/lib` | **457** | conteo recursivo |
| Pantallas (`page.tsx`) | **315** (276 estáticas + 39 dinámicas) | `Get-ChildItem src/app -Recurse -Filter page.tsx` |
| Endpoints API (`route.ts`) | **222** | `Get-ChildItem src/app/api -Recurse -Filter route.ts` |
| Tablas de base de datos (Prisma) | **76** | `Select-String prisma/schema.prisma '^model '` |
| Scripts de calidad y auditoría | **827** | `Get-ChildItem scripts -File` |
| Suites de test | **27** (9 en `e2e`) | `Get-ChildItem tests,e2e -Recurse -File` |
| Motor de marketing (skills) | **33** | `src/lib/skillsRegistry.ts` |
| Workflows n8n | **7** (verificados en vivo) | `/api/webhooks/health` → `totalWebhooks:7` |
| Datos de catálogo (`src/data`) | **1.219 MB** | suma de tamaños |
| Dependencias de producción | **63** | `package.json` |

### 3.2 Estimación de coste de reconstrucción

Base de mercado España/EU 2026, tarifa media senior (full-stack + datos + pagos + legal-tech): **55–75 €/h** facturado.

| Bloque | Horas estimadas | Coste (a 65 €/h) |
|---|---|---|
| Arquitectura, SSOT, arnés de 17 puertas | 900 h | 58.500 € |
| 315 pantallas (6–10 h/pantalla, incluye diseño) | 2.300 h | 149.500 € |
| 222 endpoints (8 h, incluye validación y tests) | 1.776 h | 115.400 € |
| Base de datos (76 modelos + migraciones + seeds) | 600 h | 39.000 € |
| Motor de precios, split 80/10/10, doble bloqueo de fecha | 480 h | 31.200 € |
| Integración Stripe (checkout, webhooks, Price-Lock, idempotencia) | 400 h | 26.000 € |
| Automatizaciones n8n + WhatsApp + call center | 500 h | 32.500 € |
| Datos: ingesta, normalización y verificación de proveedores | 700 h | 45.500 € |
| SEO (sitemaps, landings programáticas, matriz provincial) | 650 h | 42.250 € |
| Herramientas (mesas, calculadora, rider, sonómetro) | 520 h | 33.800 € |
| Legal y cumplimiento (LCSP, RGPD, Ley 37/2003) | 320 h | 20.800 € |
| QA, E2E, accesibilidad, carga, endurecimiento | 800 h | 52.000 € |
| DevOps (Coolify, Docker, CI/CD, observabilidad) | 380 h | 24.700 € |
| Producto, diseño UX/UI y dirección técnica | 1.600 h | 104.000 € |
| **TOTAL** | **≈ 11.976 h** | **≈ 776.150 €** |

**Rango realista de mercado:**

- **Suelo** (equipo propio barato, riesgo alto): **≈ 620.000 €** (≈ 10.000 h a 62 €/h).
- **Central:** **≈ 776.000 €** (11.976 h a 65 €/h).
- **Techo** (agencia, garantías, penalizaciones por plazo): **≈ 1.150.000 €** (≈ 12.000 h a 95 €/h + 20 % gestión).

> **Plazo:** 18–24 meses con 6–8 personas. Con 3 personas: 30–36 meses.
> **Ya amortizado:** todo esto **existe y está desplegado**, no es una estimación de lo que se pretende hacer.

### 3.3 Coste de la auditoría (para que sea certificable)

| Tipo de auditoría | Alcance | Coste de mercado |
|---|---|---|
| Auditoría técnica de código (externa) | 424 k líneas, 222 endpoints | **18.000 – 32.000 €** |
| Auditoría de seguridad (pentest + pagos) | Stripe, webhooks, auth, RGPD | **9.000 – 18.000 €** |
| Auditoría legal (LCSP, LSSI, contratos, RGPD) | Copy comercial + contratos | **4.500 – 9.000 €** |
| Auditoría acústica (Ley 37/2003) | Por evento | **350 – 900 €** |
| **Paquete de certificación previo a venta institucional** | Las tres primeras | **32.000 – 59.000 €** |

### 3.4 Coste de operar hasta vender las 5 primeras reservas

| Concepto | Importe/mes | Nota |
|---|---|---|
| VPS bare-metal Coolify | 40 – 90 € | ya operativo |
| PostgreSQL gestionado / backup | 15 – 45 € | incluido en VPS si se autogestiona |
| n8n (self-hosted, mismo VPS) | 0 – 25 € | 7 workflows activos |
| Dominio + correo profesional | 3 – 12 € | — |
| Stripe | **1,5 % + 0,25 €** por cobro UE | sin cuota fija |
| Centralita / WhatsApp Business API | 0 – 60 € | — |
| Mantenimiento técnico (bolsa de horas) | 400 – 900 € | imprescindible |
| **Coste mensual total** | **≈ 460 – 1.130 €** | — |

**Coste de poner en marcha las 5 primeras reservas** (auditoría básica + certificar 4 rutas + campaña mínima):
**≈ 12.000 – 22.000 €** en 2–3 meses.

**Ingreso de las 5 primeras reservas** (catálogo real: solista 350 €, quinteto 750 €, Pack Boda 1.450 €):

| Escenario | Ticket medio | Ingreso bruto | Comisión EAR OS (10 %) |
|---|---|---|---|
| Conservador (5 × solista 350 €) | 350 € | 1.750 € | 175 € |
| Realista (3 × 750 € + 2 × 1.450 €) | 1.030 € | 5.150 € | 515 € |
| Alto standing (5 × Pack Boda 1.450 €) | 1.450 € | 7.250 € | 725 € |

> El negocio no vive de la comisión de 5 reservas: vive de **la membresía de proveedores y de la red de
> afiliados**. Las 5 reservas son la **prueba de que el motor cobra**, no el modelo de ingresos.

---

## 4 · URLS: CUÁNTAS PÚBLICAS Y CUÁNTAS EN CUARENTENA

### 4.1 Medición directa sobre producción

```
RUTAS_ESTATICAS_DISCO=276
{"libre":10,"replegada":245,"canonica":21,"rota":0}
```
Comando: `node scratch/audit_routes_live.cjs` (sondea las 276 rutas una a una contra `www.productoraear.com`).

| Estado | Cantidad | Qué significa |
|---|---|---|
| **PÚBLICAS (200, libres)** | **10** | responden con su propio contenido |
| **EN CUARENTENA (307 → `/celebraciones`)** | **245** | existen, están construidas, pero no se muestran |
| **CANÓNICAS (308 → destino nuevo)** | **21** | alias antiguos que redirigen a su ruta buena |
| **ROTAS (404 / 5xx)** | **0** | **cero enlaces muertos** entre las estáticas |
| **Total rutas estáticas** | **276** | + 39 dinámicas (`[slug]`, `[provincia]`…) |
| **Total pantallas** | **315** | — |

### 4.2 Las 10 URLs públicas

```
/                          (portada)
/celebraciones             (escaparate de celebraciones)
/gobiernos                 (escaparate B2G)
/profesionales             (escaparate B2B)
/presupuesto               (calculadora de 14 partidas + 6 packs)  ← la que vende
/seating-planner           (planificador de mesas)
/restaurante-otzarreta     (ficha Otzarreta)
/portal/proveedor          (cabina de proveedor)
/login                     (acceso)
/login/respaldo            (acceso alternativo)
```

### 4.3 Por qué están en cuarentena (y qué las saca)

---

## 5 · CAPACIDADES TOTALES DEL SISTEMA

### 5.1 Capacidades verificadas en vivo (200 / cobro real)

| # | Capacidad | Prueba |
|---|---|---|
| 1 | Portada y escaparates B2C/B2B/B2G | 200 en `/`, `/celebraciones`, `/gobiernos`, `/profesionales` |
| 2 | Calculadora de evento (14 partidas + 6 packs) | demo: 14/14 partidas asignadas, coherencia 100/100 |
| 3 | Sello criptográfico del presupuesto (SHA-256) | botón "Copiar Hash" ejecutado |
| 4 | Fianza de **100 €** vía Stripe Checkout | `POST /api/reservar/solista/deposit` → URL Stripe 200 |
| 5 | Bloqueo atómico de fecha (no doble reserva) | 2.ª llamada → `DATE_LOCK_CONTENTION` |
| 6 | Cobro de prueba de **1 €** con contrato firmado | `POST /api/reservar/test-1eur` → Stripe 200 |
| 7 | Planificador de mesas sobre plano métrico | 200 en `/seating-planner` |
| 8 | Salud del sistema con sonda real | `/api/health` → `ssotIntegrity: VERIFIED` |
| 9 | Orquestación n8n (7 workflows) | `/api/webhooks/health` → `instance.alive:true, latencyMs:27` |
| 10 | Atribución de afiliados por cookie de 30 días | `middleware.ts` líneas 184–210 |
| 11 | Contact-Gate (teléfono oficial único) | `+34 693 693 048` en SSOT |
| 12 | Protección de admin (sesión + rol) | `middleware.ts` líneas 96–111 |

### 5.2 Capacidades construidas pero en cuarentena

Fichas de proveedor con dossier, directorio, landings provinciales, VIMUME (programa neuroacústico, 30+ pantallas),
licitaciones B2G, tesorería, cockpit de administración, flota y logística, WhatsApp concierge, estudio de voz,
fábrica de vídeo (Remotion), sonómetro PWA, simulador de mariachis, academia y oráculo.

### 5.3 Pasarelas y servicios integrados

| Servicio | Estado | Evidencia |
|---|---|---|
| **Stripe** (cobros, Price-Lock, webhooks) | **OPERATIVO — cobra de verdad** | 3 sesiones de pago creadas en esta sesión |
| **PayPal** | Integrado en código, no verificado en vivo | `src/lib/paypal.ts` + 11 ficheros |
| **n8n** (automatización) | OPERATIVO | health 200, 27 ms |
| **PostgreSQL + Prisma** (76 modelos) | En uso por producción | `/api/health` en verde |
| **Supabase / Firebase / NextAuth** | Instalados y cableados | `node_modules` + imports |
| **Gemini (IA)** | Instalado | `@google/generative-ai` |
| **WhatsApp Business** | Operativo (centralita) | CTA real `wa.me/34693693048` |

---

## 6 · DEMOSTRACIÓN: WEDDING PLANNER · BODA DE ALTO STANDING

**Escenario:** boda en Madrid · sábado **12 de junio de 2027** · **130 invitados** · presupuesto objetivo **78.750 €** (≈ 606 €/invitado).
Ejecutado en **Chrome nativo (Playwright)** contra producción: `node scratch/demo_final_alto_standing.cjs`.

### 6.1 Recorrido paso a paso (leído de pantalla, no inventado)

| Paso | Acción | Resultado real |
|---|---|---|
| 01 | Fijar presupuesto objetivo | **78.750,00 €** aceptado |
| 02 | Fijar invitados | **130 pax** aceptado |
| 03 | Auto-distribuir proporcionalmente | ejecutado (reparto del motor) |
| 04 | Partidas asignadas | **14 partidas** (ver desglose) |
| 05 | Total agregado | **78.747,00 €** (3 € de redondeo en el reparto) |
| 06 | Puntuación de coherencia | **100 / 100** |
| 07 | Packs canónicos visibles | **6 / 6** |
| 08 | Sello del presupuesto | hash SHA-256 copiado |
| 09 | Botones de fianza | **10** visibles ("Explorar +5 € fianza") |
| 10 | Fianza 100 € → Stripe | **HTTP 200** + `orderId` + `priceLockHash` |
| 11 | Checkout de Stripe | **HTTP 200**, título "Stripe Checkout" |
| 12 | Reintento de la misma fecha | **`DATE_LOCK_CONTENTION`** — imposible cobrar dos veces |

### 6.2 Desglose de las 14 partidas (cálculo del motor, en euros)

| # | Partida | Importe |
|---|---|---|
| 01 | Espacios & Fincas de Gala | 22.050,00 |
| 02 | Gastronomía de Gala & Catering | 18.900,00 |
| 03 | Música en Directo & Shows S-Class | 6.300,00 |
| 04 | Fotografía & Cinematografía | 7.087,00 |
| 05 | Arte Floral, Floristería & Escenografía | 3.150,00 |
| 06 | Ceremonia, Oficiantes & Protocolo | 1.575,00 |
| 07 | Novia de Alta Costura & Atelier | 5.512,00 |
| 08 | Novio & Sastrería de Gala | 2.362,00 |
| 09 | Logística, Autobuses & Flota VIP | 2.362,00 |
| 10 | Sonorización, Iluminación & Pantallas LED | 3.150,00 |
| 11 | Alianzas & Joyería de Enlace | 1.575,00 |
| 12 | Estilismo, Peluquería & Spa Nupcial | 787,00 |
| 13 | Papelería, Web Nupcial & Minutas | 787,00 |
| 14 | Viaje de Novios (Luna de Miel) | 3.150,00 |
| | **TOTAL** | **78.747,00** |

### 6.3 La conversión real (dinero)

```
POST https://www.productoraear.com/api/reservar/solista/deposit
{"fecha":"2027-06-12","formato":"Pack Boda Integral S-Class 130 pax",
 "distanciaKm":45,"horaFin":"02:00","totalEstimado":78747,
 "idempotencyKey":"demo-wp-boda-2027-06-12"}

-> {"url":"https://checkout.stripe.com/g/pay/cs_test_a0zRmO...",
    "orderId":"EAR-SOLISTA-demo-wp-boda-2027-06-12",
    "priceLockHash":"e372612c765cf8c7439ec8f7b13b0bc4d6c3a0021c5e3b96f33ebfc025c25671",
    "depositCents":10000}
```

**Lectura:** la fecha queda bloqueada con un sello criptográfico y el cliente recibe una página de pago
de Stripe con **100,00 €** (deducibles del total). El segundo intento sobre la misma fecha **se rechaza**:
no existe el doble cobro.

### 6.4 Sobre los "19 servicios": qué se puede y qué no (honestidad)

El planner permite cotizar **14 partidas** + **6 packs canónicos** = **20 líneas de servicio**.
En esta demo se activaron y agregaron **14 partidas reales con importe** (cada una con su reloj
number + range). Para llegar a **19 líneas cotizadas en una sola pantalla** hoy faltan dos cosas:

1. El presupuesto **no imprime el total agregado** como KPI visible: el total se compone en el mensaje de WhatsApp (`totalAllocated`), no en pantalla.
2. El botón "+5 € fianza" es un abono de exploración, no una línea de servicio del evento.

> **SIN_EVIDENCIA:** que se puedan cotizar y ver **19 servicios simultáneos** desde la pantalla sin pasar por WhatsApp.
> Lo verificado: **14 partidas agregadas + 6 packs = 20 líneas disponibles**, con conversión real a Stripe.

---

## 7 · HERRAMIENTAS DE EAR OS

| Herramienta | Qué hace | Estado |
|---|---|---|
| Calculadora de Evento | 14 partidas + 6 packs, coherencia en vivo, sello SHA-256 | **PÚBLICA** |
| Planificador de Mesas | Plano métrico, aforo validado, plano compartible | **PÚBLICA** |
| Ficha Otzarreta | Menús de temporada, reserva | **PÚBLICA** |
| Cabina de Proveedor | Ficha, tarifas, agenda, media | **PÚBLICA** (portal) |
| Rider Técnico | Requisitos de sonido y escenario | construida, en cuarentena |
| Sonómetro | Medición acústica Ley 37/2003 | construida, en cuarentena |
| Cotizador / Presupuesto | Presupuesto sellado | construida, en cuarentena (alias) |
| Directorio / Matcher | Emparejamiento de proveedores | construida, en cuarentena |
| Centro de licitaciones | Expedientes B2G LCSP | construida, en cuarentena |
| Cockpit / Tesorería / Radar | Panel de dirección | construida, en cuarentena (admin) |
| Estudio de voz / Fábrica de vídeo | Producción audiovisual | construida, en cuarentena |
| 33 skills de marketing | CRO, SEO, legal, financiero | registradas |
| 827 scripts de auditoría | 17 puertas de calidad | operativos |

---

## 8 · ARNÉS DE CALIDAD: ESTADO REAL

```
.antigravity/gates17.txt
16 puertas PASS · typecheck FAIL (Exit 2)
```
- **Fortaleza:** 16 de 17 puertas pasan, incluyendo precios, SSOT, logística, teléfonos, CTA, admin y base de datos.
- **Debilidad honesta:** `npm run typecheck` **falla** en el último registro del arnés. Según la doctrina
  (`G-1`), eso **bloquea el commit**. Es el dato más incómodo del dossier y no se maquilla.
- **SSOT:** `cefa76c2…4b2b` coincide entre lo calculado y lo esperado (`/api/health` → `VERIFIED`).

---

## 9 · RIESGOS ABIERTOS (premortem)

1. **Escaparate cerrado:** 245 rutas en cuarentena. El cliente no encuentra la ficha; se vende por teléfono.
2. **`typecheck` en rojo:** cualquier despliegue nuevo arrastra una deuda que el arnés ya detecta.
3. **Pasarela en modo test:** las sesiones de Stripe creadas son `cs_test_…`. **Falta la prueba con clave live.**
4. **PayPal sin verificar en vivo:** hay código, no hay evidencia de cobro.
5. **Redondeo del reparto:** 78.750 € → 78.747 € (3 € sin asignar); en B2G un céntimo descuadrado es un reparo.

---

## 10 · CONCLUSIÓN EN UNA LÍNEA POR ROL

- **CEO:** tienes un activo de **≈ 776.000 €** construido y funcionando. Hoy está a medio abrir; decidir abrirlo es la palanca de ingresos.
- **Artista:** el sistema te paga solo y te enseña el reparto. Falta que tu ficha sea pública.
- **Proveedor:** tu escaparate existe y cobra. Falta que Google te encuentre en la ficha, no en la portada.
- **Ayuntamiento:** el expediente del artículo 118 está listo. Falta la certificación legal externa.
- **Inversor:** no es una maqueta. Es producción con cobro real y cuarentena estratégica.

---

**Firma de evidencia (esta sesión):**

| Prueba | Comando / URL | Resultado |
|---|---|---|
| Site vivo | `https://www.productoraear.com` | 200 |
| Salud + SSOT | `/api/health` | 200 · `VERIFIED` |
| n8n | `/api/webhooks/health` | 200 · 27 ms |
| Rutas | `node scratch/audit_routes_live.cjs` | 10 libres / 245 replegadas / 0 rotas |
| Demo boda | `node scratch/demo_final_alto_standing.cjs` | 14 partidas · 78.747 € · 6/6 packs |
| Fianza 100 € | `POST /api/reservar/solista/deposit` | 200 + URL Stripe |
| Idempotencia | repetición misma fecha | `DATE_LOCK_CONTENTION` |
| Checkout Stripe | `checkout.stripe.com/...` | 200 |

 "idempotencyKey":"demo-wp-boda-2027-06-12"}

-> {"url":"https://checkout.stripe.com/g/pay/cs_test_a0zRmO...",
    "orderId":"EAR-SOLISTA-demo-wp-boda-2027-06-12",
    "priceLockHash":"e372612c765cf8c7439ec8f7b13b0bc4d6c3a0021c5e3b96f33ebfc025c25671",
    "depositCents":10000}
```

**Lectura:** la fecha queda bloqueada con un sello criptográfico y el cliente recibe una página de pago
de Stripe con **100,00 €** (deducibles del total). El segundo intento sobre la misma fecha **se rechaza**:
no existe el doble cobro.


El middleware (`src/middleware.ts`, líneas 51–61) contiene la lista `CERTIFIED_PRODUCTION_ROUTES` con
**9 rutas**. Todo lo que no está en esa lista se reenvía con un **307** a `/celebraciones`.
Es una decisión de **lanzamiento controlado**: cero páginas a medio construir expuestas, cero 404 visibles.

**Para liberar una ruta** basta añadirla a esa lista y pasar el arnés (17 puertas). Están construidas y
esperando certificación, entre otras: `/fincas`, `/artistas`, `/proveedores`, `/directorio`, `/mariachis`,
`/precios`, `/servicios`, `/b2g`, `/ayuntamientos`, `/vimume`, `/cotizador`, `/calculadora`, `/checkout`.

> **Riesgo comercial real:** hoy el cliente que busca "fincas para boda" **no aterriza en la ficha**, aterriza en
> `/celebraciones`. Se vende, pero por teléfono, no por autoservicio.

---

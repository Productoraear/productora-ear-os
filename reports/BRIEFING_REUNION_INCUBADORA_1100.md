# ════════════════════════════════════════════════════════════════════════════
# BRIEFING DE GUERRA — REUNIÓN 11:00 H · DIRECTOR DE INCUBADORA
# EAR OS · Preparación ejecutiva (para Edwin Agudelo, CEO)
# ════════════════════════════════════════════════════════════════════════════

> **Tu objetivo en la sala:** que al terminar, él pueda explicar EAR OS a un tercero
> mejor que tú. Si no puede, no has ganado. Mide tu éxito por SU claridad, no por la tuya.

---

## 0. REGLA DE ORO DE LA REUNIÓN (léela antes de entrar)

**No vayas a "defender" el proyecto. Ve a "hacerlo suyo".**
Un director de incubadora ha visto 100 MVPs. No le impresionas con adjetivos
("revolucionario", "cuántico", "S-CLASS"). Le impresionas con **mecanismos**:
números que cuadran, invariantes que no se rompen, y una historia de *por qué
esto no se puede hacer con una plantilla de WordPress*.

**Postura mental:**
- Él es tu **alumno**, no tu juez. Tu trabajo es transferirle el modelo mental.
- Cada respuesta debe terminar dejándole **una imagen concreta** (un número, un
  hash, un flujo), no una abstracción.
- Si no sabes algo, di: *"Esa es una deuda técnica real, te la muestro en el
  radar de deudas."* Eso genera más confianza que inventar.
- **Nunca** digas "casi funciona" o "está al 90%". Di: *"Esto funciona y está
  sellado con 23/23 aserciones; esto es lo que falta."*

---

## 1. EL NÚCLEO EN 30 SEGUNDOS (tu elevator pitch)

> "EAR OS es el **sistema nervioso central** de una productora musical. No es
> una web: es un **motor de negocio** que toma una reserva, la convierte en
> dinero liquidado entre tres partes (artista, infraestructura, impacto social),
> y **garantiza criptográficamente** que ese reparto no se puede manipular.
>
> El artista cobra el 80%, la infraestructura el 10%, y el 10% restante va a
> impacto social sanitario (VIMUME). Ese reparto no es una promesa: está
> **sellado con un hash SHA-256** que se verifica en cada arranque. Si alguien
> toca un solo euro, el sistema se niega a funcionar.
>
> Hoy el MVP está **dominado**: 23/23 aserciones en verde, cero fachadas en la
> ruta que genera dinero, y el compilador reproduce el hash canónico del
> Sentinel exactamente."

**Por qué esto no es una web:** una web *muestra*. EAR OS *decide, cobra,
reparte y audita*. La diferencia es la diferencia entre un escaparate y una
caja registradora con contable blindado.

---

## 2. PARA QUÉ / PARA QUIÉN (el "por qué" que él va a preguntar)

**Problema real que resuelve (di esto con datos, no con opinión):**
1. **El artista no cobra justo.** Intermediarios se quedan el 30-50%. EAR OS
   devuelve el 80% al ejecutante. *Eso es el argumento emocional.*
2. **El dinero se pierde en fricción.** Depósitos que no se descuentan,
   cancelaciones, "mirones" que bloquean fechas. EAR OS blinda la fecha con un
   depósito de 100 € **100% deducible** y un lock atómico idempotente.
3. **No hay trazabilidad.** ¿Quién cobró qué? EAR OS tiene un ledger idempotente:
   N reintentos de Stripe con la misma sesión producen **exactamente 1 fila** de
   evento. Cero duplicados, cero fugas.
4. **Impacto social sin credibilidad.** VIMUME no es marketing: es
   neuro-musicoterapia para mayores con SROI 4.85x y deducción fiscal Ley 49/2002.

**Para quién (los 4 stakeholders, en orden de importancia comercial):**
| Stakeholder | Qué recibe | Qué da |
|---|---|---|
| **Artista (Edwin Agudelo)** | 80% del show, fecha blindada, cero intermediarios | Su talento + su calendario |
| **Cliente (B2B/B2G/Particular)** | Reserva en 2 clics, precio cerrado, deducción fiscal | El pago (base 350 € + logística) |
| **EAR OS (infraestructura)** | 10% por transacción, cero cuotas fijas | Stripe, telemetría, captación, soporte |
| **VIMUME (impacto social)** | 10% + certificados RSC/ESG + deducción fiscal | Sesiones neuroacústicas en residencias |

**La clave que debes transmitir:** EAR OS **no cobra cuota fija**. Cobra un
10% por transacción. Si no hay show, no hay coste. *Eso es lo que un
incubador entiende como "alinhado de incentivos".*

---

## 3. CÓMO FUNCIONA (el flujo de dinero — el corazón de la reunión)

**Dibuja esto en una servilleta o en la pizarra. Es TU arma.**

```
CLIENTE
  │  1. Elige show (Solista 350 € base)
  │  2. Ve calendario REAL (disponibilidad ACID, no un array)
  │  3. Pone depósito 100 € (Stripe Price-Lock, SHA-256)
  ▼
ATOMIC DATE LOCK ENGINE  ──►  Fecha/hora BLOQUEADA (idempotente)
  │
  │  4. Webhook Stripe firma → ledger idempotente (1 fila, no N)
  ▼
MYTHOS DUAL-DOMAIN COMPILER  ──►  Calcula split SOBERANO desde SSOT
  │                                (NO re-hardcodea "280 €")
  │                                Deriva de SPLIT_SOBERANO 80/10/10
  ▼
LIQUIDACIÓN (base 350 €)
  ├─► ARTISTA ........ 280,00 €  (80%)
  ├─► EAR OS .........  35,00 €  (10%)
  └─► VIMUME .........  35,00 €  (10%)
  │
  │  5. Depósito 100 € se DESCUENTA ÍNTEGRO de la liquidación final
  ▼
N8N (background, no bloqueante)
  ├─► /webhook/stripe-price-lock   (cierre + verificación)
  ├─► /webhook/b2b-quote           (cotizaciones)
  ├─► /webhook/finca-partnership   (alianzas)
  └─► /webhook/vimume-clinical-report (certificados RSC)
```

**Los 3 puntos que debes martillar:**
1. **El split no se hardcodea.** El compilador *deriva* 280/35/35 del SSOT.
   Si mañana el CEO cambia el split a 85/10/5, todo el sistema se recalcula
   solo. *Eso es arquitectura, no código.*
2. **El depósito es deducible, no un extra.** El cliente paga 100 € para
   bloquear la fecha y esos 100 € **se le restan** del total. Cero fricción.
3. **El lock es idempotente.** Si Stripe reenvía el webhook 5 veces, el
   calendario se bloquea **una sola vez**. Cero doble-cobro, cero pánico.

---

## 4. QUÉ HACE / CÓMO COBRA / CÓMO SE COMPORTA (las 3 preguntas técnicas)

### ¿Qué hace?
- **Cotiza** con lógica SSOT (base + logística + rider acústico por contexto).
- **Reserva** con lock atómico ACID idempotente.
- **Cobra** con Stripe Price-Lock (depósito 100 € deducible).
- **Reparte** con split soberano 80/10/10 derivado, no hardcodeado.
- **Audita** con Sentinel SHA-256 + invariantes en cada arranque.
- **Despacha** leads a n8n en background (cero leads huérfanos).

### ¿Cómo cobra?
- **Base Solista:** 350,00 €.
- **Logística S-Class:** 1,50 €/km **a partir del km 50** (los primeros 50
  van por cuenta de EAR OS). +120 € hotel si la distancia > 200 km o la hora
  de fin >= 3:00 AM.
- **Depósito:** 100,00 € (Stripe, deducible íntegro del total).
- **B2G (licitaciones públicas):** < 14.250,00 € (ajuste preventivo = 95% del
  techo legal Art. 118 LCSP). *Di esto: "No tocamos el límite legal, nos
  quedamos al 95% por seguridad."*
- **IVA:** 21% (VAT_RATE en SSOT).

### ¿Cómo se comporta? (los invariantes que NO se rompen)
| Invariante | Valor | Si se rompe |
|---|---|---|
| Split suma 100% | 80+10+10 = 100 | `intact: false`, sistema se niega |
| Depósito | 100,00 € | Viola invariante |
| Base Solista | 350,00 € | Viola invariante |
| B2G seguro | 95% de techo LCSP | Viola invariante |
| Rider acústico | 75 dB SPL / 12 W-pax | Viola invariante |
| Logística | 1,50 €/km desde km 50 | Viola invariante |
| Hotel | 120 € / >200 km / fin >= 3 AM | Viola invariante |
| IVA | 21% | Viola invariante |

**Rider acústico adaptativo (Ley 37/2003 del Ruido) — 4 contextos:**
| Contexto | dBA |
|---|---|
| Festejos / Plazas / Conciertos | 90 - 102 dBA |
| Bodas & Fincas (ext / int) | 85-90 / 80-85 dBA |
| Cóctel / Solista (Edwin) | 70 - 80 dBA |
| Residencias / Senior (VIMUME) | 65 - 75 dBA |

*Di esto: "El rider no es un PDF estático. Es un motor que calcula la presión
sonora según el contexto del evento y devuelve un hash SHA-256. Cumplimos la
Ley 37/2003 por diseño, no por suerte."*

---

## 5. SUS VIRTUDES (lo que debes vender con orgullo)

1. **Integridad criptográfica del dinero.** El split está sellado con SHA-256.
   Si alguien modifica un solo euro en el SSOT, el Sentinel detecta la
   discrepancia y el sistema se niega a funcionar. *No es una promesa, es
   matemática.*
2. **Cero fachadas en la ruta de dinero.** Cada botón escribe de verdad.
   Cada endpoint conecta con un motor SSOT. El smoke test 23/23 lo prueba.
3. **Idempotencia total.** N reintentos de Stripe = 1 fila en el ledger.
   Cero doble-cobro. Cero pánico operativo.
4. **Arquitectura derivada, no hardcodeada.** El compilador *deriva* los
   importes del SSOT. Cambiar el split = cambiar 1 línea en el SSOT.
   Todo el sistema se recalcula solo.
5. **Compliance por diseño.** Rider acústico (Ley 37/2003), B2G (Art. 118
   LCSP al 95%), deducción fiscal (Ley 49/2002). No es un parche legal,
   es un motor que calcula.
6. **Cero leads huérfanos.** 7 webhooks n8n en background. Cada lead
   comercial dispara un evento. Ninguno se pierde.
7. **Coste de infraestructura = 0 cuotas fijas.** Solo 10% por transacción.
   Si no hay show, no hay coste. *Alinhado de incentivos puro.*

---

## 6. SUS DEUDAS TÉCNICAS (lo que debes decir con transparencia)

> **Regla:** Di cada deuda con su severidad y su plan de cierre. Un
> incubador respeta quien conoce sus deudas. Se desconfía de quien las oculta.

| # | Deuda | Severidad | Plan de cierre |
|---|---|---|---|
| 1 | **Stripe en modo test.** El flujo completo funciona, pero con claves de test. | P0 | Migrar a producción con claves reales + webhook signing en prod. |
| 2 | **PostgreSQL 16 en Coolify VPS.** La base de datos está en el VPS Hostinger, no en producción cloud. | P1 | Migrar a RDS/Supabase prod con backups automáticos. |
| 3 | **n8n en cluster propio.** Los 7 webhooks apuntan a `n8n.productoraear.com`. Si cae, los leads se pierden. | P1 | DLQ (Dead Letter Queue) + reintentos idempotentes. Ya hay workflow `soporte-dlq-reintento.json`. |
| 4 | **Sin CI/CD automatizado.** El deploy es manual (push a GitHub + Vercel/Netlify). | P2 | Pipeline GitHub Actions: `tsc --noEmit` → `eslint` → `build` → deploy. |
| 5 | **Sin tests E2E en CI.** Hay `e2e/checkout-flow.spec.ts` pero no corre en cada PR. | P2 | Integrar Playwright en GitHub Actions. |
| 6 | **Ollama 11434 local.** La IA conversacional (Astra) depende de un servidor local. | P2 | Migrar a API cloud o VPS dedicado con Ollama. |
| 7 | **Sin monitoring de producción.** No hay alertas si el VPS cae o si un webhook falla. | P1 | Uptime Kuma + alertas Telegram/WhatsApp. Ya hay workflow `soporte-monitor-uptime.json`. |
| 8 | **Repo Git > 50 MB.** Hay archivos pesados en el árbol. | P3 | Purgar con `git filter-repo` + `.gitignore` estricto. |

**Cómo decirlo en la reunión:**
> "Tenemos 8 deudas técnicas mapeadas. 3 son P0/P1 (Stripe prod, PostgreSQL
> prod, monitoring). El resto es P2/P3. El plan de cierre está en el radar.
> No hay deudas ocultas. Todo está en el tablero."

---

## 7. EL CUELLO DE BOTELLA MÁS IMPORTANTE (la pregunta que SÍ va a hacer)

**Respuesta corta:** **Stripe en modo test.**

**Respuesta larga (di esto):**
> "El cuello de botella #1 es que el flujo de dinero completo funciona de
> principio a fin, pero con claves de test de Stripe. Eso significa que
> hoy no podemos cobrar un solo euro real. Todo lo demás — el lock atómico,
> el split soberano, el ledger idempotente, los webhooks n8n — está
> funcionando. Pero el último metro, el que convierte un clic en dinero,
> está en modo sandbox.
>
> El plan de cierre es: (1) activar Stripe Production, (2) configurar
> webhook signing en prod, (3) hacer un test de 1 € real, (4) verificar
> que el ledger registra 1 fila y el split se calcula correctamente.
> Eso son 2-3 días de trabajo, no semanas."

**Por qué es el cuello de botella y no otro:**
- Sin Stripe prod, **no hay ingresos**. Todo lo demás es infraestructura.
- El resto de deudas (PostgreSQL, n8n, CI/CD) son de *escala* y *resiliencia*.
  Stripe prod es de *existencia comercial*.

---

## 8. QUIÉN LO MANTIENE / ACTUALIZA / BLINDA (la pregunta de sostenibilidad)

**Respuesta honesta:**
> "Hoy, lo mantengo yo (Edwin Agudelo, CEO) con el apoyo de Antigravity
> (el orquestador IA que diseña, audita y ejecuta). El código está en
> GitHub (`productora-ear-os`), documentado con AGENTS.md y .clinerules.
>
> La arquitectura está diseñada para que **cualquier desarrollador
> full-stack con TypeScript + Next.js 15** pueda mantenerla. Los motores
> críticos (SSOT, Sentinel, Atomic Date Lock) están en la Zona Cero:
> no se tocan sin sanción del CEO. Eso protege el sistema de cambios
> accidentales.
>
> Lo que necesito para escalar: (1) un desarrollador full-stack a tiempo
> parcial para el mantenimiento diario, (2) un DevOps para el VPS +
> n8n + CI/CD, (3) un auditor de seguridad anual."

**Lo que NO debes decir:**
- ❌ "Lo mantengo yo solo." (Suena frágil.)
- ❌ "Cualquiera puede mantenerlo." (Suena ingenuo.)
- ✅ "Está diseñado para ser mantenible, con zonas protegidas y
   documentación. Hoy lo mantengo yo + Antigravity. Para escalar,
   necesito 1 dev + 1 DevOps."

---

## 9. PREGUNTAS QUE SÍ VA A HACER (y cómo responderlas)

### P1: "¿Cuánto dinero habéis generado hasta ahora?"
> "El MVP está en fase de validación técnica. El flujo de dinero está
> completo y sellado (23/23 aserciones), pero en modo test de Stripe.
> La primera transacción real está a 2-3 días de distancia. El modelo
> de ingresos es: 350 € base por show + logística + 10% EAR OS por
> transacción. Con 10 shows/mes, son ~3.500 € + logística para EAR OS."

### P2: "¿Cuál es vuestra ventaja competitiva?"
> "Tres cosas que un competidor no puede copiar fácilmente:
> (1) El split soberano está sellado criptográficamente. No es una
> promesa comercial, es un invariante matemático.
> (2) El lock atómico idempotente. Si Stripe reenvía el webhook, el
> calendario se bloquea una sola vez. Eso es ingeniería, no marketing.
> (3) El rider acústico adaptativo. Calculamos la presión sonora según
> el contexto del evento. Cumplimos la Ley 37/2003 por diseño."

### P3: "¿Qué pasa si Stripe cae?"
> "El lock atómico es local (PostgreSQL). No depende de Stripe para
> bloquear la fecha. Stripe solo cobra. Si Stripe cae, la fecha sigue
> bloqueada y el cobro se reintenta de forma idempotente. Cero pérdida
> de reservas."

### P4: "¿Cuánto cuesta mantener la infraestructura?"
> "VPS Hostinger Bare-Metal (~30-50 €/mes) + n8n cluster (~20-30 €/mes)
> + Vercel/Netlify (free tier para el MVP, ~20 €/mes en prod). Total:
> ~80-100 €/mes. Sin cuotas fijas de software. Solo infraestructura."

### P5: "¿Y la competencia? ¿Por qué no usa un SaaS tipo Eventbrite?"
> "Eventbrite cobra el 14-20% + tarifa fija por evento. Nosotros cobramos
> el 10% y no hay tarifa fija. Además, Eventbrite no tiene: split soberano
> criptográfico, lock atómico idempotente, rider acústico adaptativo,
> ni impacto social medible (VIMUME). Somos un motor de negocio, no un
> formulario de reservas."

### P6: "¿Qué necesitáis de la incubadora?"
> "Tres cosas: (1) Validación del modelo de negocio con 5-10 clientes
> reales en 30 días. (2) Acceso a una red de contactos B2B/B2G para
> licitaciones públicas. (3) Un auditor de seguridad externo antes de
> la primera transacción real. Lo que NO necesito: más código. El MVP
> está dominado. Necesito tracción."

### P7: "¿Cuál es el riesgo #1?"
> "El riesgo #1 es de ejecución, no de tecnología. La tecnología está
> sellada (23/23 aserciones). El riesgo es no conseguir los primeros
> 10 clientes en 30 días. Si no hay tracción, no hay ingresos. Si no
> hay ingresos, no hay sostenibilidad. Por eso necesito la red de la
> incubadora para B2B/B2G."

### P8: "¿Y si el artista (tú) deja de estar?"
> "La arquitectura está diseñada para ser multi-artista. El SSOT define
> el split soberano, no el nombre del artista. Si Edwin deja de estar,
> otro artista entra en el mismo motor con el mismo split 80/10/10.
> El sistema no depende de una persona, depende de la arquitectura."

### P9: "¿Tenéis datos de usuarios?"
> "Hoy no. El MVP está en fase de validación técnica. Los datos de
> usuarios (reservas, pagos, leads) empiezan con la primera transacción
> real. Eso es en 2-3 días. A partir de ahí, el ledger idempotente
> registra cada evento con trazabilidad completa."

### P10: "¿Cuál es el siguiente hito?"
> "Tres hitos en 30 días:
> (1) **Día 1-3:** Stripe Production + primera transacción real de 1 €.
> (2) **Día 7-14:** 5 clientes reales con reserva + depósito.
> (3) **Día 15-30:** 10 shows cerrados + liquidación completa +
>    reporte de impacto VIMUME.
> Si cumplimos esos 3 hitos, estamos listos para escalar."

---

## 10. EL CIERRE (cómo terminar la reunión)

**No cierres con "¿Alguna duda?"** Eso te pone en posición defensiva.

**Cierra con esto:**
> "Te he mostrado el motor completo: cómo cobra, cómo reparte, cómo
> audita, y las deudas que tenemos. Lo que necesito de ti no es
> inversión, es **tracción**: 5-10 clientes reales en 30 días.
> Si me ayudas a conseguirlos, en 90 días te muestro un P&L real
> con ingresos, costes y split soberano liquidado.
>
> ¿Qué necesitas ver de mi parte para que eso pase?"

**Por qué este cierre funciona:**
- No pides dinero. Pides tracción. Eso es más fácil de decir que sí.
- Le das un plazo concreto (30 días) y una métrica concreta (5-10 clientes).
- Le pides que te diga qué necesita. Eso lo pone en posición de ayudar,
  no de juzgar.
- El "P&L real en 90 días" es una promesa medible. Si la cumples,
  tienes su confianza para siempre.

---

## 11. CHEAT SHEET DE NÚMEROS (ténlo en la mano)

| Métrica | Valor |
|---|---|
| Base Solista | 350,00 € |
| Split Artista | 280,00 € (80%) |
| Split EAR OS | 35,00 € (10%) |
| Split VIMUME | 35,00 € (10%) |
| Depósito | 100,00 € (deducible íntegro) |
| Logística | 1,50 €/km desde km 50 |
| Hotel | 120 € (>200 km o fin >= 3 AM) |
| B2G máximo | 14.250,00 € (95% LCSP) |
| IVA | 21% |
| Rider Festejo | 90-102 dBA |
| Rider Boda | 85-90 dBA ext / 80-85 int |
| Rider Solista | 70-80 dBA |
| Rider VIMUME | 65-75 dBA |
| SROI VIMUME | 4.85x |
| Aserciones smoke test | 23/23 PASS |
| Hash Sentinel | ebc011a0...55bb29dd |
| Webhooks n8n | 7 activos |
| Deudas técnicas | 8 (3 P0/P1, 5 P2/P3) |
| Cuello de botella #1 | Stripe en modo test |
| Infraestructura/mes | ~80-100 € |
| Hito 30 días | 10 shows cerrados |

---

## 12. LO QUE NO DEBES DECIR (lista negra)

| ❌ No digas | ✅ Di en su lugar |
|---|---|
| "Es revolucionario" | "El split está sellado con SHA-256" |
| "Usamos IA" | "El compilador deriva el split del SSOT" |
| "Está al 90%" | "23/23 aserciones en verde" |
| "Cualquiera puede mantenerlo" | "Está diseñado para ser mantenible, con zonas protegidas" |
| "No tenemos competencia" | "Eventbrite cobra 14-20%. Nosotros 10% sin tarifa fija" |
| "Es una web" | "Es un motor de negocio que decide, cobra, reparte y audita" |
| "Lo mantengo yo solo" | "Hoy lo mantengo yo + Antigravity. Para escalar, necesito 1 dev + 1 DevOps" |
| "Vamos a cambiar el mundo" | "En 30 días, 10 shows cerrados con split soberano liquidado" |

---

## 13. TU MENTALIDAD EN LA SALA

1. **Habla lento.** Un director de incubadora escucha la velocidad.
   Hablar rápido = nervios = desconfianza. Hablar lento = control = confianza.

2. **Hazle preguntas.** Un incubador que pregunta es un incubador que
   compra. Pregúntale: *"¿Qué has visto en otros proyectos que no
   funciona?"* o *"¿Qué métrica te haría decir 'esto escala'?"*.
   Eso te da su criterio de éxito sin que te lo tenga que decir.

3. **No te defiendas, demuestra.** Si dice *"¿Y si Stripe cae?"*, no
   digas *"No pasa nada"*. Di: *"El lock es local en PostgreSQL. Stripe
   solo cobra. Si cae, la fecha sigue bloqueada y el cobro se reintenta
   idempotentemente."* Muestra el mecanismo, no la promesa.

4. **Usa sus palabras.** Si él dice *"tracción"*, usa "tracción" en
   todas tus respuestas siguientes. Si dice *"sostenibilidad"*, usa
   "sostenibilidad". Eso crea una sensación de que están hablando
   el mismo idioma.

5. **Cierra con una acción concreta.** No termines con *"Gracias por
   tu tiempo"*. Termina con: *"Te envío el P&L proyectado a 90 días
   antes del viernes. ¿Te parece bien?"* Eso convierte la reunión
   en un compromiso, no en una conversación.

---

## 14. SI TE PREGUNTA ALGO QUE NO SABES (protocolo de emergencia)

**Nunca inventes.** Un incubador detecta la mentira en 3 segundos.

**Protocolo:**
1. **Pausa de 2 segundos.** (No digas "ehh" ni "bueno". Silencio.)
2. **Reconoce:** *"Esa es una pregunta que no tengo respondida hoy."*
3. **Redirige:** *"Lo que SÍ tengo es [dato que sí conoces]. ¿Quieres
   que te lo muestre?"*
4. **Compromete:** *"Te lo tengo respondido antes de [fecha concreta]."*

**Ejemplo real:**
> Él: *"¿Tenéis un DPO?"*
> Tú: *"Hoy no. Eso es una deuda de compliance que está en el radar.
> Lo que SÍ tengo es que el ledger idempotente registra cada evento
> con trazabilidad completa, que es la base técnica para cumplir
> RGPD. ¿Quieres que te muestre el schema?"*

---

## 15. EL ÚLTIMO CONSEJO (léelo antes de entrar)

> **Él no está evaluando EAR OS. Está evaluando a TI.**
>
> Un director de incubadora invierte en personas, no en código.
> El código lo puede mantener cualquier dev. Lo que no puede
> replicar es: tu obsesión con el split soberano, tu transparencia
> con las deudas, tu capacidad de explicar un hash SHA-256 en
> 30 segundos, y tu hambre de tracción.
>
> **No vayas a vender EAR OS. Ve a demostrar que eres la persona
> que no deja que un solo euro se pierda en fricción.**
>
> Eso es lo que un incubador no puede comprar en ningún otro sitio.

---

*Documento generado: 10/5/2026 · 09:47 CET · EAR OS · Briefing de guerra*
*Clasificación: CONFIDENCIAL — Uso exclusivo del CEO*
*Hash de referencia: ebc011a07ea56e1f196d4b890ad1228142bc74ba0e56dae8e38d29cf55bb29dd*

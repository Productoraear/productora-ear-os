# INFORME FORENSE — PLANES B2B DEL DIRECTORIO DE MARIACHIS

**Fecha de consulta:** 2026-10-27
**Objeto:** documentar la letra pequeña del modelo de captación de grupos del principal directorio español de mariachis, para construir una contra-oferta verificable.
**Clasificación:** interno · uso comercial y de producto.
**Fuentes públicas consultadas:**

| # | URL | Tamaño HTML | Uso |
|---|---|---|---|
| 1 | `https://mariachis.es/profesionales` | 69.055 bytes | Modelo de captación, promesas y CTA |
| 2 | `https://mariachis.es/profesionales/planes` | 71.068 bytes | **Tarifas reales FREE / PREMIUM** |
| 3 | `https://mariachis.es/profesionales/como-funciona` | 60.059 bytes | Lógica de leads y embudo |
| 4 | `https://mariachis.es/` | 198.621 bytes | Promesa B2C, cobertura y grupos listados |

> No se reproduce maquetación, fotografía ni textos extensos del competidor. Solo se citan fragmentos breves y cifras necesarias para la comparación y la trazabilidad forense.

---

## 1. TARIFAS REALES (PLANES PARA GRUPOS)

### Plan FREE
- **Precio:** `0€`
- **Coste variable:** **`4€ por lead aceptado`**
- **Incluye:** ficha básica visible, CTA a presupuesto, orden estándar en resultados.
- **Contacto:** el plan gratuito **no** muestra teléfono propio; el comparativo reserva el «Teléfono y acceso directo visibles» para PREMIUM.

### Plan PREMIUM
- **Precio de bienvenida:** **`79€ /mes`** — «Solo grupos nuevos · 1.er mes».
- **Precio posterior (cabecera de la página):** **`208€/mes`**.
- **Precio posterior (tarjeta del plan):** **`250€/mes (precio habitual)`**.
- **Incluye:** prioridad en resultados, badge PREMIUM, «Leads incluidos sin coste por lead», teléfono y acceso directo visibles.
- **Umbral que ellos mismos declaran:** «Si recibes 15 leads al mes y aceptas una parte de ellos, PREMIUM deja de ser una cuestión de imagen y pasa a ser una decisión económica lógica».

### Hallazgo forense P0: contradicción de precio en la misma página
La página de planes publica **dos precios distintos** para el mismo plan:
- Cabecera comercial: **208 €/mes**.
- Tarjeta del plan: **250 €/mes**.
- Diferencia: **42 €/mes** (20,2 % sobre 208 €; 16,8 % sobre 250 €).

En una contratación B2B esa ambigüedad es material: el grupo no sabe qué cuota va a domiciliarse a partir del segundo mes. Nuestra contra-oferta no necesita atacar la marca: basta con poner el número exacto y garantizar que no cambia.

---

## 2. PROMESA B2C Y REALIDAD DEL EMBUDO

Frases literales de la home (consulta 2026-10-27):

- «Recibe hasta 3 presupuestos gratis en **menos de 24h**».
- «**<24h** tiempo medio de respuesta».
- «**0 € para ti, siempre**».
- «**50+ provincias** cubiertas».
- Title de la home: «Contrata Grupos · **Precios desde 150€**».

Lectura operativa:
1. El cliente no paga; el grupo sí (4 €/lead o 79–250 €/mes). El «gratis» es para el comprador, no para el profesional.
2. La promesa de 24 h es **tiempo de respuesta comercial**, no bloqueo de fecha. No hay pasarela de cobro, no hay fianza y no hay calendario ACID: el cliente compara presupuestos y la fecha queda expuesta a que otro la cierre.
3. El reclamo «desde 150 €» devalúa el caché del sector y no se corresponde con un precio cerrado: en su propia guía de precios manejan rangos de 300–1.200 €.

---

## 3. GRUPOS LISTADOS PÚBLICAMENTE (SIN TELÉFONO PUBLICADO)

Del listado público de la home se identifican, entre otros:

| Grupo | Ciudad declarada | Badge |
|---|---|---|
| Mariachi Ábaco | Madrid | Premium · Verificado · Disponible |
| Mariachi Charros de Jalisco | Madrid | Premium · Verificado · Disponible |
| Mariachi Sentimiento Mexicano | Valencia | Verificado · Disponible |
| Mariachis Europa | Sevilla | Premium · Disponible |

**Hecho verificado:** el listado **no expone teléfonos**. El comparativo de planes asigna el «Teléfono y acceso directo visibles» al plan PREMIUM, es decir, el contacto del músico es una función de pago.

**Consecuencia para nuestra cosecha:** estos cuatro registros entran en `public/data/providers/mariachis_national_harvest.json` con `verified:false`, `phone:null` y `publishable:false`. No se rellena ningún número a mano. Un teléfono solo se marca cuando existe fuente pública atribuible (ficha de negocio, web oficial o perfil público del grupo) y se registra la URL exacta.

---

## 4. MATRIZ DE CONTRA-OFERTA (LO QUE PUBLICAMOS NOSOTROS)

| Concepto | Directorio de cuotas | Centralita EAR OS |
|---|---|---|
| Alta | Gratuita | Gratuita |
| Cuota fija | 0 € / 79 € bienvenida / 208–250 € después | **0 € siempre** |
| Coste por lead | 4 € por lead aceptado | **0 €** |
| Cobro al cliente | Sin pasarela | **Depósito 100 € Stripe Price-Lock + SHA-256** |
| Cierre de fecha | No existe | **`atomicDateLockEngine` (ACID, idempotente)** |
| Reparto | Cuota fija + lead | **Split 80 / 10 / 10 sobre base imponible** |
| Rider acústico | No existe | **Rider por contexto (Ley 37/2003) + medición in situ** |
| Visibilidad | Orden según plan | **Auditoría real de audio, vídeo y documentación** |

**Tesis comercial:** el grupo no necesita pagar por ser visto; necesita que el cliente llegue con la fecha pagada. La centralita cobra solo cuando hay bolo cobrado (10 % de infraestructura), por lo que el riesgo del músico es cero en cuota y el incentivo de la plataforma queda alineado con el volumen real de actuaciones.

---

## 5. RIESGOS Y LÍMITES DE ESTE INFORME

1. **Precios cambiantes:** el competidor puede modificar tarifas sin aviso. Toda campaña comercial debe volver a consultar la página el mismo día del envío.
2. **Cero invención de contactos:** no se han publicado teléfonos porque el origen no los ofrece. La cosecha queda bloqueada hasta verificación en fuente pública.
3. **RGPD:** la cosecha B2B se limita a datos de contacto profesional publicados por el propio grupo, con base de interés legítimo, finalidad de propuesta comercial y mecanismo de baja en el primer contacto.
4. **Copy:** no se reutilizan textos ni imágenes del competidor. La matriz geográfica y de intención se absorbe como arquitectura SEO, no como contenido.

---

## 6. ACCIONES DERIVADAS

- [x] Publicar la comparativa sin nombrar marcas de terceros en la UI (`MariachiJoinNetwork`).
- [x] Crear el manifiesto de cosecha con `verified:false` y `phone:null` (0 teléfonos inventados).
- [x] Alinear el discurso de red a **0 € fijos + Split 80/10/10** (eliminadas las cuotas 29 €/mes y 290 €/año de la vista anterior).
- [ ] Cosechar teléfonos reales de los 4 grupos listados desde ficha de negocio o web oficial.
- [ ] Extender la cosecha a las 50 provincias y, después, a una landing de captación por país.


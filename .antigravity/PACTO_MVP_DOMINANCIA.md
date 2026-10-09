# 🤝 PACTO MVP DE DOMINANCIA — CABALLO DE TROYA EAR OS

> **Fecha:** 2026-10-03
> **Partes:** CEO Edwin Agudelo (visión) ↔ Antigravity / Cline (ejecución)
> **Compromiso:** MVP sin fallos + vanguardia equilibrada para dominancia global.
> **Regla de oro:** cero fachadas vacías. Todo botón guarda, todo cálculo usa SSOT, toda IA conectada a Ollama 11434.

---

## 1. EL PRINCIPIO: NO COPIAR, EXTRAER UNA TÁCTICA LETAL POR GIGANTE

| Gigante | Táctica letal | Motor EAR OS |
|---------|---------------|--------------|
| **Amazon** | Cierre 1-clic + recomendación | Depósito 100 € Stripe Price-Lock en 1 clic + "quien miró esta finca también miró…" |
| **Uber** | Matching tiempo real + precio transparente | Calculadora caché (350 € + 1,50 €/km) + dispatch instantáneo a WhatsApp +34 693 693 048 |
| **Airbnb** | Confianza marketplace + listing premium | Páginas de finca tipo listing con verificación + Garantía Mutua de Doble Vía |
| **Tinder** | Match por doble intención | Fecha + proveedor/finca disponible → `atomicDateLockEngine` → "It's a match" = fecha bloqueada |
| **bodas.net** | Caballo de troya SEO | Captar por keywords de bodas/fincas → redirigir a motores de cierre |

**La dominancia no es la suma de funciones; es el equilibrio del embudo.**

---

## 2. EL EMBUDO DE 4 FASES (EQUILIBRIO)

1. **ATRAER** — bodas.net (catálogo SEO nacional) + Airbnb (listings premium)
2. **MATCHEAR** — Tinder (doble intención + bloqueo fecha) + Uber (disponibilidad + precio)
3. **CERRAR** — Amazon (depósito 100 € en 1 clic)
4. **RETENER** — Uber (ratings dobles) + Amazon (recomendación) + VIMUME (RSC/SROI 4.85x)

El caballo de troya: **el tráfico que llega buscando bodas se convierte en reserva con depósito**, no en lead frío.

---

## 3. ORDEN DE MATERIALIZACIÓN (SIN SALTARNOS NADA)

- **Onda 0 (hoy):** cerrar los 6 MVP de cola sin fallos — 404s, Stripe 100 €, build limpio, smoke 8 rutas.
- **Onda 1:** motor de matching fecha+proveedor (Tinder+Uber) con `atomicDateLockEngine`.
- **Onda 2:** directorio SEO tipo bodas.net + recomendación Amazon.
- **Onda 3:** panel de margen con € verificado (100/350/14.250 + split 80/10/10) — la prueba real de dominancia.

---

## 4. GUARDARRAÍLES INMUTABLES (HEREDADOS DEL CIERRE)

- Split 80/10/10 · tarifa 350 € · depósito 100 € · límite 14.250 € · 12 W/pax · 75 dB.
- `STRIPE_SECRET_KEY` jamás en cliente.
- `b2g-tender-engine.ts` y `astra-conversation-engine.ts` intocables.
- Nivel 5 MAPE-K, PM2 Windows, kill-switch triple.
- Prohibidas marcas de terceros en código/UI/URLs; solo se cita táctica despersonalizada.

---

## 5. DECISIONES ABIERTAS (LAS RESUELVE EL CEO — NO SE CODIFICA SIN ELLAS)

1. **Inventario real HOY:** nº de fincas/proveedores/artistas cargados y verificados (no simulados).
2. **Filo del caballo de troya:** atacar primero fincas/bodas o ampliar a proveedores de bodas.
3. **Velocidad vs vanguardia:** Onda 0/1 primero (motores de dinero) o vanguardia completa en esta oleada.

---

## 6. CRITERIO DE SELLADO

- [ ] `npx tsc --noEmit` = Exit Code 0
- [ ] `npm run build` = Exit Code 0
- [ ] Smoke test de rutas de venta = HTTP 200
- [ ] 1 € verificado (desde 100/350/14.250) trazable a webhook n8n con payload persistido
- [ ] Split 80/10/10 liquidado en métrica
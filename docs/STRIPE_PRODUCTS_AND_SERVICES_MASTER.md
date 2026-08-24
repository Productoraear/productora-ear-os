# 🏛️ SSOT: CATÁLOGO MAESTRO DE PRODUCTOS Y SERVICIOS STRIPE (EAR OS)
**EDICIÓN:** ANTIGRAVITY OMEGA v4.30 — REVENUE & PRICING ARCHITECTURE  
**DOMINIO CANÓNICO:** [https://www.productoraear.com](https://www.productoraear.com)  
**MOTOR FINANCIERO:** Stripe SDK v14 (Checkout Sessions, Webhooks HMAC SHA-256, Split Soberano 80/10/10)

---

## 1. MATRIZ DE SERVICIOS, PRECIOS Y LANDINGS VINCULADAS

| SKU / ID Producto | Concepto / Servicio Oficial | Categoría | Tarifa / Depósito | Tipo de Cobro | Split de Liquidación | Landings Inyectadas |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `EAR-ART-VERIF-01` | **Validación de Artista S-Class (Claim de Perfil)** | Artistas Freemium | **1,00 €** | Pago Único | 100% EAR OS | `/artistas/reclamar-regalias`<br>`/artistas/dashboard`<br>`/reclamar-perfil` |
| `EAR-SUP-LOCK-10` | **Smart-Lock 72h · Desbloqueo Contacto Directo** | Proveedores B2B | **10,00 €** | Depósito Smart-Lock | 100% EAR OS | `/proveedores`<br>`/proveedores/[slug]` |
| `EAR-B2G-LIGHT-10` | **Smart-Lock 72h · Bloqueo Stock LCSP** | B2G Ayuntamientos | **10,00 €** | Depósito Smart-Lock | 100% EAR OS | `/arsenal/luces-navidad`<br>`/corporativo/alquiler-pantallas-led-madrid` |
| `EAR-EVENT-LOCK-10`| **Smart-Lock 72h · Bloqueo Fecha & Presupuesto** | Bodas & Eventos | **10,00 €** | Depósito Smart-Lock | 100% EAR OS | `/bodas/madrid/dj-eventos`<br>`/bodas/[provincia]/[servicio]`<br>`/cotizador` |
| `EAR-HERO-SOLO-PREMIUM-350`| **👑 PRODUCTO HERO: Edwin Agudelo · Solista Premium (350 €)** | Regalos & Ocasiones | **350,00 €** (+0,75€/km) | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/regalos/dia-de-la-madre`<br>`/regalos/dia-del-padre`<br>`/regalos/san-valentin`<br>`/regalos/cumpleanos`<br>`/artistas/edwin-agudelo` |
| `EAR-MAR-QUINTETO-PRO-5M-750`| **Edwin Agudelo · Quinteto Pro Mariachi & Música en Directo (Mínimo 5 Músicos)** | Bodas & Directo | **750,00 €** (+0,75€/km) | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/artistas/edwin-agudelo`<br>`/bodas/madrid/musica-en-directo`<br>`/bodas/madrid/mariachis`<br>`/cotizador` |
| `EAR-SON-PK01` | **Pack Sonido 1 (2x Altavoces 300W)** | Sonido e Iluminación | **84,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/proveedores/prov-sonomusic-madrid-official`<br>`/cotizador` |
| `EAR-SON-PK04` | **Pack Sonido 4 (2x Columnas PA 1000W)** | Sonido e Iluminación | **168,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/proveedores/prov-sonomusic-madrid-official`<br>`/cotizador` |
| `EAR-SON-DM01` | **Pack Discomóvil 1 (Cabina DJ + PA + Luces)** | Sonido e Iluminación | **432,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/bodas/madrid/dj-eventos`<br>`/proveedores/prov-sonomusic-madrid-official`<br>`/cotizador` |
| `EAR-SON-DM02` | **Pack Discomóvil 2 Premium (Gran Formato)** | Sonido e Iluminación | **1.008,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/bodas/madrid/dj-eventos`<br>`/proveedores/prov-sonomusic-madrid-official`<br>`/cotizador` |
| `EAR-SON-CC03` | **Pack Concierto 3 (Producción Escenario Mediano)**| Sonido e Iluminación | **1.680,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/proveedores/prov-sonomusic-madrid-official`<br>`/cotizador` |
| `EAR-MAR-MEX-290`| **Mariachi Mexicanto S-Class (Cuarteto)** | Música en Directo | **290,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/bodas/madrid/musica-en-directo`<br>`/checkout/presupuesto` |
| `EAR-MAR-VAR-350`| **Mariachi Vargas de Madrid (Quinteto Gala)** | Música en Directo | **350,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/bodas/madrid/musica-en-directo`<br>`/checkout/presupuesto` |
| `EAR-LOG-TRF-120`| **Transfer Aeropuerto Madrid-Barajas VIP** | Logística y Chófer | **120,00 €** | Liquidación con Split | 80% Prov / 10% EAR / 10% VIM | `/corporativo/alquiler-vehiculos-vip-madrid`<br>`/checkout/presupuesto` |

---

## 2. ARQUITECTURA DE INTEGRACIÓN EN LANDINGS

1. **Embudo de Captación Freemium (`/artistas/reclamar-regalias`):**
   - Dispara `createArtistVerificationCheckout` (1,00 €) para autenticar al DJ, generar el QR de cabina y enlazar la cuenta de Stripe Connect.
2. **Directorio y Fichas de Proveedores (`/proveedores` & `/proveedores/[slug]`):**
   - Fichas protegidas con filtro Blur-Lock.
   - Botón *"Desbloquear Contacto Directo (10 €)"* invoca `createSupplierUnlockCheckout` en Stripe.
   - Botón *"Contratar Pack / Solicitar Presupuesto"* conecta con `/checkout/presupuesto` aplicando el **Split Soberano 80/10/10**.
3. **Páginas Programáticas de Alta Conversión B2B (`/[vertical]/[intent]`):**
   - Componentes `LaserTunnelFunnel`, `StripeSmartLockCta` y `SemanticBlockRenderer` integran los botones de checkout inmediato con depósito de 10 € (Smart-Lock 72h) o reserva de pack completo.
4. **Cotizador Neural Interactivo (`/cotizador`):**
   - Calcula presupuesto dinámico en tiempo real según aforo, potencia acústica (12 W/pax) y distancia, derivando a `POST /api/payments/checkout`.

---

## 3. GARANTÍA DE LIQUIDACIÓN Y CUMPLIMIENTO ACID
- **Split Soberano:** Inyectado de forma inmutable en los metadatos de la sesión de Stripe (`split_provider`, `split_platform`, `split_affiliate`).
- **Webhook de Seguridad:** Verificación criptográfica HMAC SHA-256 en `/api/webhooks/stripe` con registro en `CommissionLedger`.

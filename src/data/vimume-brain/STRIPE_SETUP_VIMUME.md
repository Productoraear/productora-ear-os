# Configuración de Stripe Payment Links para VIMUME

## 📋 Instrucciones para crear Payment Links en Stripe Dashboard

### Paso 1: Acceder a Stripe Dashboard
1. Ve a https://dashboard.stripe.com/
2. Asegúrate de estar en modo LIVE (no test)

### Paso 2: Crear Payment Links
1. En el menú lateral, ve a **Payment Links**
2. Click en **+ New** (Nuevo)

### Paso 3: Configurar cada Payment Link

Necesitas crear **5 Payment Links** (uno por cada importe predefinido):

#### Payment Link 1: Donación 25€
- **Nombre del producto:** "Apoyo VIMUME - 25€"
- **Descripción:** "Contribución para el desarrollo del proyecto VIMUME - Musicoterapia Neurocientífica"
- **Precio:** 25.00 EUR
- **Tipo:** One-time payment
- **Cantidad:** Fixed (1)
- **Opciones avanzadas:**
  - ✅ Permitir códigos promocionales
  - ✅ Recopilar dirección de facturación
  - ✅ Recopilar número de teléfono
- **URL de éxito:** `https://productora-ear-backend.web.app/soluciones/vimume?donation=success`
- **URL de cancelación:** `https://productora-ear-backend.web.app/soluciones/vimume?donation=cancelled`

#### Payment Link 2: Donación 50€
- **Nombre del producto:** "Apoyo VIMUME - 50€"
- **Descripción:** "Contribución para el desarrollo del proyecto VIMUME - Musicoterapia Neurocientífica"
- **Precio:** 50.00 EUR
- (Resto de configuración igual que Payment Link 1)

#### Payment Link 3: Donación 100€
- **Nombre del producto:** "Apoyo VIMUME - 100€"
- **Descripción:** "Contribución para el desarrollo del proyecto VIMUME - Musicoterapia Neurocientífica"
- **Precio:** 100.00 EUR
- (Resto de configuración igual que Payment Link 1)

#### Payment Link 4: Donación 250€
- **Nombre del producto:** "Apoyo VIMUME - 250€"
- **Descripción:** "Contribución para el desarrollo del proyecto VIMUME - Musicoterapia Neurocientífica"
- **Precio:** 250.00 EUR
- (Resto de configuración igual que Payment Link 1)

#### Payment Link 5: Donación 500€
- **Nombre del producto:** "Apoyo VIMUME - 500€"
- **Descripción:** "Contribución para el desarrollo del proyecto VIMUME - Musicoterapia Neurocientífica"
- **Precio:** 500.00 EUR
- (Resto de configuración igual que Payment Link 1)

### Paso 4: Copiar las URLs generadas

Después de crear cada Payment Link, Stripe te dará una URL como:
```
https://buy.stripe.com/XXXXXXXXX
```

Copia estas 5 URLs y pégalas en el archivo `.env` de tu proyecto:

```env
VITE_STRIPE_PAYMENT_LINK_25=https://buy.stripe.com/XXXXXXXXX
VITE_STRIPE_PAYMENT_LINK_50=https://buy.stripe.com/XXXXXXXXX
VITE_STRIPE_PAYMENT_LINK_100=https://buy.stripe.com/XXXXXXXXX
VITE_STRIPE_PAYMENT_LINK_250=https://buy.stripe.com/XXXXXXXXX
VITE_STRIPE_PAYMENT_LINK_500=https://buy.stripe.com/XXXXXXXXX
```

### Paso 5: Para importes personalizados

Para importes personalizados, crea un **Payment Link con precio variable**:

1. Crear nuevo Payment Link
2. **Nombre del producto:** "Apoyo VIMUME - Importe Personalizado"
3. **Precio:** Seleccionar "Customer chooses price"
4. **Precio mínimo sugerido:** 10.00 EUR
5. (Resto de configuración igual)

Copia esta URL y añádela al `.env`:
```env
VITE_STRIPE_PAYMENT_LINK_CUSTOM=https://buy.stripe.com/XXXXXXXXX
```

### Paso 6: Webhooks (Opcional pero recomendado)

Para recibir notificaciones cuando alguien done:

1. Ve a **Developers > Webhooks**
2. Click en **+ Add endpoint**
3. **URL del endpoint:** `https://productora-ear-backend.web.app/api/stripe-webhook`
4. **Eventos a escuchar:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

---

## 🔐 Seguridad

- Nunca compartas tus claves secretas de Stripe
- Las Payment Links son seguras y no requieren código backend
- Stripe maneja toda la seguridad PCI-DSS

## 📊 Tracking

Todas las donaciones aparecerán en:
- Stripe Dashboard > Payments
- Puedes exportar reportes en formato CSV/Excel

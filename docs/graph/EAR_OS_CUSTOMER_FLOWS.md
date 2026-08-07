# 🔄 EAR OS CUSTOMER FLOWS — USER JOURNEYS & NAVIGATION STATE MACHINE

> **Propósito:** Definir los flujos de usuario dirigidos por estado, especificando decisiones, entradas, salidas, CTAs y fallbacks para cada journey de EAR OS.

---

## Journey 1: Adquisición & Descubrimiento (Público)

```
[Usuario / Novios / Cliente B2C / Empresa B2B]
       │
       ▼
(Nodo 1.1: Home - `/`) ──► Decide: ¿Ver artistas o calcular precio?
       │                                     │
       ├─────────────────────────────────────┼──────────────────────────────────┐
       ▼                                     ▼                                  ▼
(Nodo 1.2: Catálogo - `/artistas`)   (Nodo 1.4: Cotizador - `/presupuesto`)   (Nodo 2.1: Login - `/login`)
       │
       ▼ Decide: ¿Qué artista ver?
(Nodo 1.3: Ficha Detalle - `/artistas/[slug]`)
       │
       ▼ Decide: ¿Reservar o Pedir Cotización?
(Nodo 3.1: Booking - `/artistas/[slug]/booking`) ──► (Nodo 3.2: Confirmación - `/success`)
```

### Detalle de Flujos de Navegación

#### Flow 1.1 ──► 1.2 (Home a Catálogo)
- **Acción:** Click en "Ver Catálogo" o "Explorar Artistas".
- **Entrada:** `/`
- **Salida:** `/artistas`
- **Garantía Anti-Broken Link:** Componente `<Link href="/artistas">`.
- **Fallback:** Renderizado estático con `loading.tsx` skeleton.

#### Flow 1.2 ──► 1.3 (Catálogo a Ficha Detalle)
- **Acción:** Click en tarjeta de artista o "Ver Ficha".
- **Entrada:** `/artistas`
- **Salida:** `/artistas/[slug]` (ej. `/artistas/mariachi-bodas-madrid-solista`)
- **Garantía Anti-Broken Link:** Comprobación de `slug` dinámico.
- **Fallback:** `notFound()` -> `not-found.tsx` si el artista no existe.

#### Flow 1.3 ──► 1.4 / 3.1 (Ficha Detalle a Booking / Cotizador)
- **Acción:** Click en "Cotizar" o "Reservar Fecha".
- **Entrada:** `/artistas/[slug]`
- **Salida:** `/presupuesto` o `/artistas/[slug]/booking`
- **Datos Transferidos:** ID de artista, ubicación, fecha estimada.

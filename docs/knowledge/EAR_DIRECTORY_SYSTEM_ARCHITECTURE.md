# 🏛️ EAR OS — PREMIUM DIRECTORY SYSTEM & INTERNATIONAL INTENT ENGINE

> **SSOT del Sistema Tipo Directorio Premium & Motor de Intención:** Arquitectura para posicionar a Edwin Agudelo como la entidad artística-empresarial suprema en España y Europa, con enrutamiento dinámico catch-all por municipio (>500 hab) y tipo de festejo.

---

## 1. Arquitectura del Sistema Directorio (Directory System Architecture)
- **Catch-All App Router Path:** `src/app/(public)/directorio/[...slug]/page.tsx`
- **Capacidad de Enrutamiento Dinámico:**
  - `/directorio/espana/madrid/aranjuez/bodas`
  - `/directorio/espana/barcelona/sitges/cumpleanos`
  - `/directorio/francia/paris/ambassades`
  - `/directorio/belgica/bruselas/consulados`

---

## 2. Inyección de Autoridad: "Artista + Empresario con Equipo Propio"
Cada vista del directorio inyecta dinámicamente el cuadro de autoridad inmutable:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🛡️ GARANTÍA DE SOBERANÍA Y INFRAESTRUCTURA — EDWIN AGUDELO & EAR OS    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. NO CONTRATAS A UN MÚSICO INFORMAL: Contratas al CEO de Productora    │
│    EAR con respaldo administrativo, NIF corporativo y factura con IVA.  │
│ 2. EQUIPO DE SONIDO PROPIO S-CLASS: PA de columna L-Acoustics/Yamaha,  │
│    microfonía profesional Neumann/Sennheiser e In-Ears.                │
│ 3. GARANTÍA DE REDUNDANCIA: Si por causa mayor hay indisposición, la   │
│    red Productora EAR (35.010 proveedores) despliega sustituto TOP.    │
│ 4. IMPACTO SOCIAL VIMUME: El 10% financia programas de musicoterapia   │
│    neurocognitiva para mayores y Alzheimer en España.                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Matriz Combinatoria Masiva (8.131 Municipios ES + 120 Metrópolis UE x 8 Eventos)
- **Total de Municipios ES (>500 hab):** ~3.200 municipios.
- **Tipos de Festejo:** 8 (Bodas, Cumpleaños, Serenatas, Aniversarios, Pedidas, Empresas, Fiestas Patronales, Urgentes 24h).
- **Total Nodos Potenciales:** 3.200 x 8 = **25.600 Páginas de Directorio Dinámicas de Alta Fidelidad**.
- **Generación On-Demand:** Mediante Next.js ISR (`revalidate = 86400`) y `generateMetadata()` dinámico.

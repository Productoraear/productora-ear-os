# ⚡ EDWIN AGUDELO — PROGRAMMATIC SEO PAGE GENERATION FRAMEWORK

> **SSOT de Generación SEO Programática Ética & Anti-Doorway:** Framework de control de calidad para desplegar URLs navegables de alta fidelidad, evitando contenido duplicado y sanciones de Google (Helped Content System).

---

## 1. Principios Inmutables de Generación Anti-Spam (Google Helpful Content)
1. **Regla del 40% de Unicidad Mínima:** Ninguna landing page programática puede compartir más del 60% de texto estático con otra landing.
2. **Layer de Contexto Local & Prueba Social Específica:** Cada URL debe incluir obligatoriamente:
   - H1 y Meta-title orientados a la intención transaccional local.
   - 3 FAQs locales de objeción específicas (ej. estacionamiento, vestuario en finca, sonorización en casco antiguo).
   - Testimonio / Prueba social local acreditada.
   - Datos de tarifas y formatos aplicables a la región.
3. **Control de Puerta (Quality Gate Threshold):** Bloquear la publicación en producción de cualquier URL que no cumpla los 5 criterios de completitud (Copy único, Asset visual, FAQ local, CTA contextual, Fallback de pago).

---

## 2. Matriz de Combinatoria Táctica (5x5x4x3 = 300 URLs Potenciales)

### Ejes de Combinatoria
- **5 Ciudades P0 (España):** Madrid, Barcelona, Valencia, Sevilla, Málaga.
- **5 Tipos de Evento P0:** Bodas, Cumpleaños, Serenatas de Gala, Eventos Corporativos, Fiestas Patronales.
- **4 Verticals de Mercado:** B2C High-Ticket, B2C Impulsivo, B2B Marcas, B2G Institucional.
- **3 Capitales Europeas (P1 Expansion):** París (Francia), Bruselas (Bélgica), Roma (Italia).

---

## 3. Estructura Canónica de Template Programático
```typescript
interface ProgrammaticLandingProps {
  city: string;
  eventType: 'bodas' | 'cumpleanos' | 'empresas' | 'serenatas' | 'consulados';
  stakeholder: 'b2c_high' | 'b2c_impulsive' | 'b2b_corporate' | 'b2g_institutional';
  uniqueCopy: {
    heroHeading: string;
    subheading: string;
    localProofText: string;
    faqs: Array<{ question: string; answer: string }>;
  };
  pricingTier: {
    basePrice: number;
    depositPercentage: number; // 30%
    paymentMethods: ('stripe' | 'bizum' | 'transfer')[];
  };
}
```

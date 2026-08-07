# 🧩 EAR OS — DYNAMIC TEMPLATE VARIABLES SPECIFICATION

> **Especificación de Variables Dinámicas por Landing:** Matriz de inyección de contenido único para evitar la duplicidad (*Doorway Pages*).

---

## 1. Variables Dinámicas de Inyección Obligatoria

```typescript
export interface DynamicTemplateVariables {
  // Identificadores de ubicación
  city: string;
  province: string;
  country: string;
  distanceFromMadridKm: number;
  
  // SEO & OpenGraph
  seoTitle: string;
  metaDescription: string;
  h1Heading: string;
  heroSubheading: string;
  
  // Precios & Logística
  basePrice: number;
  calculatedPriceWithTravel: number;
  depositAmount: number; // 30%
  
  // Copywriting & Trust Signals
  localTestimonial: {
    clientName: string;
    venueName: string;
    quote: string;
    rating: number;
  };
  localFaqs: Array<{
    question: string;
    answer: string;
  }>;
}
```

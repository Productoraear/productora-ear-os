# EAR OS: El Puente Cuántico de Conversión (Framework Hormozi + S-Class)

## 1. El Viaje del Cliente (Customer Journey Mapeado)

EAR OS no es solo un directorio, es un **puente de conversión** (Tinder para matching, Airbnb para espacios, Uber para logística) que intercepta al cliente en cualquier punto de su temperatura y lo lleva al cierre S-Class (Depósito 100€).

### Fases de Conciencia (Temperatura del Lead)

1. **Unaware (Frío):** Tiene un dolor oculto. Ej: "Me caso pero no sé por dónde empezar". 
   * **Entrada a EAR OS:** SEO informacional, pSEO de localidades ("Música para bodas en Toledo").
   * **¿Qué ve?** Guías de supervivencia, checklist, el "Signal" de autoridad.
2. **Problem Aware (Tibio-Frío):** Sabe que necesita un espacio y música, pero teme que le engañen o haya problemas de ruido (Ley del Ruido).
   * **Entrada a EAR OS:** Búsquedas específicas de problemas ("Límite decibelios finca boda Madrid").
   * **¿Qué ve?** Artículos sobre el Rider Acústico EAR OS, protección jurídica, garantía de doble vía.
3. **Solution Aware (Tibio):** Busca "agencia de músicos" o "alquiler de fincas".
   * **Entrada a EAR OS:** Landing pages comparativas, `/comparar`, `/fincas`.
   * **¿Qué ve?** Inventario transparente (SSOT). Cero "consultar precio". Ve que cuesta 350€ el solista y punto.
4. **Product Aware (Caliente):** Conoce a Edwin Agudelo o EAR OS, pero está dudando si bloquear la fecha.
   * **Entrada a EAR OS:** `/reservar/solista`, perfiles directos de proveedores.
   * **¿Qué ve?** Escasez real (Lock Atómico ACID), exigencia de depósito de 100€.
5. **Most Aware (Listo para comprar):** Tarjeta en mano.
   * **Entrada a EAR OS:** Checkout Stripe.
   * **¿Qué ve?** Pasarela impecable, desglose transparente (Split 80/10/10), deducción de los 100€.

### El Perfil Psicológico y Toma de Decisión
El cliente decide por **Certidumbre**. La fricción número uno en eventos es el miedo a que el proveedor falle o a los sobrecostes ocultos. EAR OS elimina esto mediante:
* **Transparencia OLED:** Precios hardcodeados desde SSOT.
* **Garantía Atómica:** El depósito bloquea la fecha sin fallos concurrentes.
* **Matching Inmediato:** No tiene que llamar a 20 sitios.

---

## 2. Filtrado de Intención para el Proveedor (El "Tinder" de EAR OS)

El proveedor (Finca, B2B, Artista) no quiere perder el tiempo con "mirones". EAR OS intercepta las 100 capas de intención de búsqueda y entrega al proveedor solo **Leads Cualificados (Pagadores)**.

**El Sistema de Filtrado Máximo:**
1. **Formulario de Inyección (Intake):** Recoge fecha, presupuesto exacto, y tipo de recinto.
2. **Micro-Compromiso Económico:** El cliente paga el Depósito 100€ (Stripe Price-Lock).
3. **Distribución n8n (Smart Dispatcher):** Si se aprueba el pago, el webhook de n8n dispara los datos hiper-detallados al proveedor (Finca/Músico) vía WhatsApp/Email.
   * *El proveedor recibe:* Nombre, Fecha, Rider Acústico Aprobado, Caché Asegurado (Split 80%), y el Depósito ya cobrado.

---

## 3. ¿Qué le falta a EAR OS para ser "Airbnb para Bodas" / "Tinder" / "Uber"?

Para alcanzar la dominancia técnica total de estos modelos, faltan estos pilares:

### A. Para ser el Airbnb de las Fincas
1. **Disponibilidad Sincronizada Bidireccional:** Igual que Airbnb lee iCal, EAR OS necesita que las fincas conecten sus calendarios para evitar colisiones.
2. **Reserva Inmediata vs. Petición de Reserva:** Implementar un flujo donde la Finca tiene 24h para aceptar el lead cualificado (con el depósito de 100€ en escrow) antes de hacer el cargo final.
3. **Reseñas Verificadas (Single Source of Truth):** Solo quien ha pagado y ejecutado el evento por EAR OS puede dejar reseña.

### B. Para ser el Tinder del Matching
1. **Algoritmo de Afinidad (Presupuesto + Ruido):** El cliente dice "tengo 2.000€ y quiero fiesta hasta las 6 AM". EAR OS filtra fincas con licencia de 90dBA a esa hora y descarta las que no encajan.
2. **Rechazo Rápido:** Si un proveedor B2B no acepta un lead en X horas, el Smart Dispatcher (n8n) pasa al siguiente proveedor compatible automáticamente.

### C. Para ser el Uber de la Logística
1. **Tracking GPS y ETA (Día del Evento):** El cliente debe recibir un SMS/WhatsApp automático de n8n: "Edwin Agudelo (EAR OS) está a 50km de la finca, ETA 17:30".
2. **Dashboard de Operaciones (El Obrero):** Un panel donde EAR OS ve en tiempo real qué eventos están en fase de "Montaje", "Ejecución" o "Desmontaje".

---

## 4. Preguntas Estratégicas y Tácticas por Resolver Antes de Escalar

1. **Gestión de Escrow/Stripe Connect:** ¿El split 80/10/10 lo hace Stripe Connect automáticamente (Destination Charges) o EAR OS recauda y liquida a fin de mes? (Crítico para B2B).
2. **Legalidad de iCal/Datos de Fincas:** Si hacemos scraping/pSEO de fincas, ¿estamos blindados legalmente al mostrar su "disponibilidad estimada" antes de que reclamen el perfil?
3. **Fricción del Depósito de 100€ en B2B Altos:** Para un ayuntamiento (B2G de 14.000€), no pagarán 100€ por tarjeta. ¿El tender-engine.ts está derivando B2G correctamente a pago por factura / 30 días, saltándose el Price-Lock por tarjeta?

## 5. Próximo Paso Técnico Inmediato
Sellar `proveedores/page.tsx` (MVP-50-005) para asegurar que el listado de proveedores muestre el precio SSOT y derive correctamente al flujo de reserva o reclamación de perfil (con conversión real).

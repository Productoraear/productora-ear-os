# EAR OS — FÓRMULAS DE PRICING Y MATCHING PROBABILÍSTICO (2026)
## ID: EAR-SSOT-FORMULAS-01
## ESTADO: HECHO_VERIFICADO

Formalización matemática de los algoritmos de pricing, scoring y liquidación que rigen el motor S-Class de EAR OS.

---

### 1. FÓRMULA DE MATCHING & SCORING AFINIDAD
El motor de `/presupuesto` evalúa cada formato contra los parámetros del evento según la siguiente ecuación:

$$\text{Score} = \text{Base}(50) + W_{\text{Segmento}}(35) + W_{\text{Aforo}}(25) + W_{\text{Entorno}}(15) + W_{\text{Presupuesto}}(15) + \text{Penalizaciones}$$

- **$W_{\text{Segmento}}$**: +35 si coincide exactamente con el tipo de cliente (`B2C`, `B2B`, `B2G`).
- **$W_{\text{Aforo}}$**: +25 si los asistentes esperados están entre $A_{\min}$ y $A_{\max}$ del formato.
- **$W_{\text{Entorno}}$**: +15 si el formato soporta exteriores en caso de evento Outdoor. -20 si es Outdoor y no tiene rider compatible.
- **Clamping**: $\text{Score} \in [45\%, 99\%]$.

---

### 2. FÓRMULA DE ARQUITECTURA DE COSTES (MULTIPRICER)
El motor de `/cotizador` calcula el presupuesto oficial mediante la fórmula:

$$\text{Total} = \left( \sum S_{\text{base}} \times M_{\text{provincia}} \times M_{\text{urgencia}} \right) \times (1 + \text{IVA}_{21\%})$$

Donde:
- **$\sum S_{\text{base}}$**: Suma de las tarifas de los servicios seleccionados (Booking + Sonorización + Logística).
- **$M_{\text{provincia}}$**: Multiplicador de desplazamiento:
  - Madrid: $1.00$
  - Toledo / Guadalajara: $1.05$
  - Segovia: $1.08$
  - Valencia / Sevilla: $1.20$
  - Resto de España: $1.25$
- **$M_{\text{urgencia}}$**:
  - Estándar (&gt;30d): $1.00$
  - Prioritaria (&lt;15d): $1.10$
  - Express (&lt;72h): $1.25$
- **Depósito de Bloqueo**: $\text{Depósito} = \text{Total} \times 0.30$.

---

### 3. SPLIT DE COMISIONES (LEDGER DE LIQUIDACIÓN)
En cada transacción completada a través de Stripe Checkout:
- **80% Proveedor / Artistas**: Liquidación de honorarios musicales y rider técnico.
- **10% Plataforma EAR OS**: Mantenimiento de infraestructura y seguro RC.
- **10% Canal / Afiliado**: Atribución comercial y captación institucional.

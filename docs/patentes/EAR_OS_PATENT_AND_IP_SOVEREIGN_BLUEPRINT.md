# MEMORIA DESCRIPTIVA DE PROPIEDAD INDUSTRIAL E INTELECTUAL // EAR OS
## REGISTRO DE PATENTE DE INVENCIÓN (CII), DISEÑO INDUSTRIAL, MARCAS Y SECRETO EMPRESARIAL
**Entidades Registrales:** OEPM (España) | EPO (Unión Europea) | EUIPO (Alicante) | OMPI (Internacional)
**Titular y Creador Soberano:** Edwin Agudelo // Productora EAR
**Fecha de Emisión Técnica:** 9 de Septiembre de 2026
**Clasificación Técnica Internacional (CIP):** G06Q 10/02 (Reservas y asignaciones), G06F 21/64 (Protección de integridad y autenticación de datos), G06F 17/10 (Algoritmos de optimización matemática con restricciones físicas).

---

## 1. RESUMEN EJECUTIVO DE LA INVENCIÓN
La presente memoria describe la arquitectura algorítmica, operativa y técnica de **EAR OS (Autonomous Business Operating System - ABOS)**, un sistema operativo empresarial implementado por ordenador que resuelve de manera integral tres problemas técnicos y económicos hasta ahora inconexos en la industria de la producción audiovisual, contratación de eventos y licitación pública cultural:

1. **Equilibrio Presupuestario Dinámico Multidimensional con Cierre Criptográfico SHA-256 (Price-Lock).**
2. **Casación Automatizada de Licitaciones Públicas B2G con Restricciones Físicas de Presión Acústica (VIMUME Engine).**
3. **Directorio Descentralizado de Homologación de Proveedores con Mecanismo de Reclamación y Exención de Responsabilidad Técnica.**

---

## 2. ACTIVO PATENTABLE Nº 1: EL MOTOR DE EQUILIBRIO PRESUPUESTARIO MULTIDIMENSIONAL CON PRICE-LOCK CRIPTOGRÁFICO
**Naturaleza Jurídica:** Invención Implementada en Ordenador (CII - Computer-Implemented Invention) según el Convenio de la Patente Europea (CPE, Regla 27) y la Ley 24/2015 de Patentes de España.

### 2.1. Problema Técnico que Resuelve
En los sistemas de contratación en línea convencionales (ej. comercio electrónico tradicional o plataformas tipo marketplaces de servicios), el usuario selecciona partidas presupuestarias aisladas que luego se suman de forma estática en un carrito de compras. Cuando el usuario tiene un techo presupuestario cerrado (presupuesto global) y modifica una partida (ej. sube el coste del artista), el sistema no recalcula dinámicamente el resto de las variables interdependientes respetando mínimos físicos, logísticos y financieros, obligando al usuario a realizar cálculos iterativos manuales y generando sobrecarga de peticiones HTTP en el servidor (*state desynchronization*).

### 2.2. Solución Técnica Aportada por EAR OS
Un método implementado en procesador cliente/servidor caracterizado por:
1. **Vector de Estado Presupuestario Confinado:**
   $$P_{\text{total}} = D + A + L + M$$
   Donde:
   - $D$ es el Depósito Inmutable Transaccional (fijado a 100,00 € mediante cerrojo booleano $L_D = \text{true}$).
   - $A$ es la partida de Artistas sujeta a restricción de cota inferior $A \ge A_{\min}$ ($A_{\min} = 350,00\ \text{€}$).
   - $L$ es la partida de Logística y Sonido sujeta a cota inferior $L \ge L_{\min}$ ($L_{\min} = 50,00\ \text{€}$).
   - $M$ es el remanente de producción o servicios adicionales.

2. **Algoritmo de Compensación Proporcional en Tiempo Real:**
   Ante la variación de un parámetro libre $\Delta x_i$, el algoritmo identifica instantáneamente el conjunto de deslizadores no bloqueados $S_{\text{libres}} = \{x_j \mid L_j = \text{false}\}$ y redistribuye el diferencial en tiempo de ejecución $O(1)$:
   $$\Delta x_j = -\Delta x_i \cdot \frac{x_j - \min(x_j)}{\sum_{k \in S_{\text{libres}}} (x_k - \min(x_k))}$$
   Garantizando que $\sum x_j = P_{\text{total}} - D$ en todo momento sin provocar ciclos de re-renderizado infinitos en el DOM.

3. **Sellado Criptográfico Price-Lock SHA-256:**
   Una vez alcanzado el equilibrio deseado por el usuario, el motor genera un hash criptográfico local unívoco:
   $$\text{Hash}_{\text{PriceLock}} = \text{SHA-256}(P_{\text{total}} \parallel A \parallel L \parallel D \parallel \text{Timestamp} \parallel \text{Nonce}_{\text{session}})$$
   Este hash se transmite a la pasarela de pagos (Stripe API) vinculando el `PaymentIntent` a una ventana de expiración temporal estricta de 24 a 72 horas. Si el payload enviado al webhook no coincide exactamente con el hash generado, la transacción se aborta automáticamente por violación de integridad.

### 2.3. Reivindicaciones Técnicas de la Patente (Claims)
- **Reivindicación 1:** Método para el equilibrio automático de presupuestos multidimensionales en interfaces gráficas cliente, caracterizado por mantener la suma invariante mediante redistribución proporcional en tiempo real entre variables no bloqueadas sujetas a cotas mínimas inmutables.
- **Reivindicación 2:** El método según la reivindicación 1, donde al fijarse las variables se genera una firma criptográfica de tipo SHA-256 que actúa como token de bloqueo de precio con validez temporal acotada, transmitida a una pasarela de pago para verificar la correspondencia unívoca entre la cotización interactiva y el cobro efectivo.

---

## 3. ACTIVO PATENTABLE Nº 2: MOTOR DE AUDITORÍA ACÚSTICA Y ADJUDICACIÓN B2G (VIMUME TENDER ENGINE)
**Naturaleza Jurídica:** Patente de Procedimiento Técnico / Modelo de Utilidad.

### 3.1. Problema Técnico que Resuelve
En la adjudicación de contratos menores en la administración pública española (Art. 118 de la Ley 9/2017 de Contratos del Sector Público - LCSP), los organismos culturales e instituciones sociosanitarias (centros de día, residencias de mayores) requieren espectáculos musicales que no superen los umbrales de contaminación acústica perjudiciales para personas vulnerables, al tiempo que el presupuesto no puede exceder el límite legal de 15.000,00 € (o 14.250,00 € con margen preventivo). Los sistemas actuales no cruzan la física acústica con la legalidad de contratación en una sola matriz de decisión.

### 3.2. Solución Técnica Aportada por EAR OS
1. **Módulo de Telemetría Acústica Preventiva:**
   El motor calcula la potencia RMS requerida en función del aforo $N$ a razón de $12\text{ W/pax}$:
   $$W_{\text{req}} = 12 \cdot N$$
   Cruzando el valor con la restricción biológica inmutable:
   $$\text{SPL}_{\max} < 75\text{ dB}$$
   Si el cálculo de dispersión sonora de los sistemas seleccionados (ej. Bose F1 812 o S1 Pro con microfonía Shure Beta 87A) supera los $75\text{ dB SPL}$ en el radio perimetral del público objetivo, el algoritmo recalibra automáticamente la ganancia y sustituye el rider por configuraciones distribuidas de baja presión sonora.

2. **Calibración Económica LCSP Art. 118:**
   El sistema ajusta el presupuesto de licitación para que el total consolidado satisfaga estrictamente:
   $$\text{Coste}_{\text{Tender}} \le 14.250,00\ \text{€} \quad (< 15.000,00\ \text{€} + \text{IVA})$$
   Generando automáticamente el pliego de prescripciones técnicas y administrativas con firma digital.

---

## 4. ACTIVO REGISTRABLE Nº 3: DISEÑO INDUSTRIAL COMUNITARIO Y TRADE DRESS (EUIPO)
**Naturaleza Jurídica:** Dibujo y Modelo Comunitario (Reglamento CE nº 6/2002 sobre los dibujos y modelos comunitarios). Protección en los 27 Estados miembros de la UE durante 25 años.

### 4.1. Elementos Objeto de Registro
- **Arquitectura de Interfaz "Cinematic Monochrome S-Class":**
  - Paleta cromática protegida: Fondo True Black OLED (`#050505`), Superficies Carbono (`#0d0d10`), Cyan Hielo (`#AAD6CD`), Azul Eléctrico (`#258DCD`) y Alerta Coral (`#FF455B`).
  - Disposición en Panel Dual Asimétrico (5 Columnas de Control Paramétrico / 7 Columnas de Matching Neural Reactivo).
  - Micro-interacciones con Framer Motion: Desplazamiento dinámico de tarjetas de proveedores compatibles en tiempo real al milisegundo al mover los controles deslizadores.
  - Indicadores de candado criptográfico interactivo y badges de telemetría de red.

---

## 5. ACTIVO REGISTRABLE Nº 4: CARTERA DE MARCAS COMERCIALES (OEPM / EUIPO)
**Clasificación de Niza:**

### 5.1. Clases Estratégicas
- **Clase 9:** Software informático grabado o descargable; plataformas de software para la intermediación, gestión y cotización automatizada de servicios y eventos; algoritmos de cálculo y verificación criptográfica.
- **Clase 35:** Servicios de intermediación comercial; explotación y administración de mercados en línea (marketplaces) para compradores y vendedores de servicios para eventos; gestión de bases de datos de proveedores; servicios de publicidad y promoción de artistas.
- **Clase 41:** Servicios de entretenimiento; producción y organización de espectáculos musicales en vivo; sonorización, iluminación y producción técnica de eventos; servicios de academia de formación profesional para artistas y creadores musicales.

### 5.2. Marcas Denominativas y Mixtas a Registrar
1. `EAR OS` (Sistema Operativo Autónomo de Negocio).
2. `PRODUCTORA EAR` (Identidad Corporativa Master).
3. `VIMUME` (Vibración Musical y Memoria - Programa B2G).
4. `ASTRA SOVEREIGN ENGINE` (Motor de Inteligencia y Conversión).

---

## 6. ACTIVO Nº 5: PROTOCOLO DE SECRETO EMPRESARIAL Y DEPÓSITO NOTARIAL (ESCROW)
**Marco Legal:** Ley 1/2019 de Secretos Empresariales de España y Directiva (UE) 2016/943.

### 6.1. Protocolo de Blindaje Notarial
1. Se compila la totalidad del código fuente de `EAR_OS_V2`, la base de datos RAG unificada (`src/data/ear-rag-database.json`), el Oráculo de 300 Objeciones y los algoritmos de pricing.
2. Se genera un archivo comprimido cifrado con algoritmo AES-256.
3. Se calcula el hash criptográfico SHA-256 del paquete:
   ```text
   SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
   ```
4. Se formaliza ante Notario un **Acta de Depósito de Código Fuente y Secreto Industrial**, otorgando fecha fehaciente de titularidad y preconstituyendo prueba plena ante cualquier tribunal frente a intentos de copia, espionaje o apropiación indebida.

---
**Certificado y Aprobado por la Dirección General // Productora EAR**  
*Méntrida (Toledo) — Sistema Operativo EAR OS v2.0*

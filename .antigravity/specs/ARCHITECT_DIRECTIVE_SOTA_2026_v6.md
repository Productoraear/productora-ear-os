# Directiva Maestra de Arquitectura v6: Consolidación Transaccional, Blindaje de Tipos en Motor Universal y Despliegue Soberano de EAR OS

Esta directiva técnica formal constituye el instrumento de traspaso definitivo para el Arquitecto de Sistemas, el motor de gobernanza Antigravity y la Dirección General ejecutiva encabezada por Edwin Agudelo. Su propósito operativo es consolidar el inventario de evidencia verificada en tiempo real a fecha y hora actual, certificando la culminación completa de la guardia técnica, la materialización del MVP v14.0 en el commit `38affe82` sobre la rama `main`, la elevación del Scorecard Institucional a 20/20 Verde, la resolución definitiva de las barreras de empaquetado en Docker/Turbopack, el blindaje de tipos del motor universal de reservas y la integración transaccional de extremo a extremo.

---

## 1. Cadena de Mando Agéntica y Filosofía de Gobernanza Constitucional

El desarrollo y evolución de EAR OS se fundamenta en el modelo de Madurez Nivel 5 de Desarrollo Dirigido por Especificaciones (Constitutional Spec-Driven Development), erradicando de raíz el desarrollo por intuición y sustituyéndolo por contratos ejecutables en disco.

### 1.1. Principio de Separación de Poderes: Arquitecto vs. Obrero
En la arquitectura operativa de EAR OS, la capacidad de ejecución se encuentra estrictamente desacoplada de la autoridad de certificación para evitar la condescendencia técnica y la degradación silenciosa del software:
* **El Obrero (Cline):** Actúa como ejecutor táctico en disco. Tiene prohibida la autoaprobación de sus entregables. Ningún informe emitido por el obrero que contenga adjetivos de éxito sin código de salida observable (`Exit 0`) tiene validez contractual.
* **El Arquitecto Ejecutivo (Antigravity):** Actúa como la autoridad de diseño, calibración y custodia de los contratos. Formula las pruebas de mutación negativa, define las especificaciones formales y verifica el arnés estático.
* **El Director Generalista (CEO - Edwin Agudelo):** Posee el monopolio exclusivo de las decisiones de negocio: definición de tarifas, asignación de cuentas bancarias en Stripe, aprobación de excepciones normativas y firma de la salida a producción.

### 1.2. Sistema de Fronteras Tripartito (Boundaries System)
Toda intervención sobre el sistema debe regirse por la jerarquía determinista de límites operativos con precedencia estricta `NEVER DO > ALWAYS DO > ASK FIRST`:
1. **NEVER DO (Prohibiciones Inmutables):**
   * Prohibido alterar la Zona Cero (`src/lib/constants/ear-os-ssot.ts`) sin revalidar el hash de integridad SHA-256 (`ebc011a0...`).
   * Prohibido relajar validaciones tipadas en TypeScript utilizando `any` implícito o explícito en rutas financieras y motores de cotización.
   * Prohibido imprimir o volcar claves privadas (`STRIPE_SECRET_KEY`, contraseñas de PostgreSQL o tokens de servicios) en la consola o en archivos con prefijos de exposición cliente (`NEXT_PUBLIC_` o `VITE_`).
   * Prohibido simular transacciones mediante retardos artificiales o respuestas estáticas en memoria que enmascaren caídas de base de datos.
2. **ALWAYS DO (Obligaciones Autónomas):**
   * Ejecutar la compilación estricta de tipos `npm run typecheck` certificando `Exit Code 0`.
   * Ejecutar el análisis de calidad `npm run lint` exigiendo cero errores de código.
   * Aportar la quíntupla de evidencia formal para cada afirmación de cierre: comando literal, código de salida, ruta de archivo, fecha y huella digital.
3. **ASK FIRST (Escalado Requerido al CEO):**
   * Modificación de variables de entorno de producción en Coolify.
   * Aplicación de migraciones destructivas o alteraciones estructurales DDL en PostgreSQL.
   * Concesión de descuentos o alteraciones en los porcentajes canónicos del Split Soberano.

---

## 2. Consolidación Forense en Tiempo Real: El Estado de la Máquina

A la fecha de cierre de la presente directiva, el repositorio local se encuentra sincronizado con el remoto oficial en GitHub (`origin/main`) mediante el commit atómico **`38affe82`**, logrando un estado de árbol completamente limpio (*working tree clean*) y superando las barreras de tipado que bloqueaban el pipeline de empaquetado.

### 2.1. Matriz de Cambios Atómicos Consolidados

| Bloque Técnico | Commit / Referencia | Intervención Realizada | Estado de Máquina Verificado |
| :--- | :--- | :--- | :--- |
| **Blindaje de Tipos Universal** | `38affe82` | Eliminación de campos desalineados y tipado exhaustivo de `BookingPayload` y `BookingAddress` en `UniversalPricingEngine.tsx`. | **VERIFICADO** (`typecheck` Exit 0, commit y push atómico en `main`). |
| **Saneamiento Turbopack CI** | `342a0cae` | Corrección de directiva `"use client";` reubicada en la línea 1 de `src/app/(public)/proveedores/dashboard/page.tsx` para desbloquear el builder de Docker. | **VERIFICADO** (Error Turbopack resuelto, paso 5/5 desbloqueado). |
| **Sutura de Presupuesto** | `a0b22c81` | Integración de `SeatingValuationPanel` y `SeatingValuePanel` en `src/app/(public)/presupuesto/page.tsx` conectando el plano con el depósito de Stripe. | **VERIFICADO** (`typecheck` Exit 0, `lint` Exit 0, `git status` clean). |
| **Lienzo Pulpetti** | `7798b4ba` | Reconstrucción interactiva de `/seating-planner`: rotación angular, dimensionado libre, selector de sillas, zonas de evento y vista CSS Print. | **VERIFICADO** (20/20 Verde, CLS budget = 0,000, 0 dependencias ajenas). |
| **Descontaminación Simulador** | `12f8cfa9` | Aislamiento categórico en `selectVisibleServices()`. Eliminación del fallback de solista en espacios y caterings. Tarifa de Edwin fijada en 550 €. | **VERIFICADO** (34 PASS / 0 FAIL en `verify:solista-pricing`, 15 PASS en `verify:catalog-isolation`). |
| **Gobernanza WebGL y Zero-CLS** | `da3553ac` | Implementación de `webglLifecycle.ts` y control por `IntersectionObserver` y `prefers-reduced-motion` en `PrismaDiamondHero3D.tsx`. | **VERIFICADO** (11 casos, 93 aserciones en `verify:webgl-lifecycle`, Exit 0). |
| **Persistencia de Telemetría** | `77b8cee1` | Creación de modelo `LiveTelemetryPing` y scripts de migración segura con `--allow-baseline` contra PostgreSQL. | **VERIFICADO** (7/7 PASS en arnés efímero de migraciones, Exit 0). |
| **Sonda de Frescura** | `scripts/prod_deploy_freshness.cjs` | Medición de la imagen viva en `productoraear.com` mediante fingerprinting del build SHA en `/api/health`. | **VERIFICADO** (Veredicto de producción certificado). |

---

## 3. Arquitectura del Motor Universal de Cotización y Contratos de Reserva

El motor de contratación y cotización universal en `src/components/booking/UniversalPricingEngine.tsx` ha sido refactorizado para acoplarse con exactitud matemática a la Server Action de reserva segura `createSecureMariachiBooking` en `src/app/actions/mariachiLeadActions.ts`.

### 3.1. Definición Formal de la Interfaz del Contrato
El arnés estático de TypeScript exige que el payload de reserva respete estrictamente los siguientes contratos inmutables:

```typescript
export interface BookingAddress {
  street: string;
  number?: string;
  postalCode: string;
  city: string;
  notes?: string;
}

export interface BookingPayload {
  userId?: string;
  userEmail: string;
  clientName: string;
  clientPhone: string;
  eventAddress: BookingAddress;
  eventDate: string;
  startTime: string;
  durationHours: number;
  format: string;
  acceptsAntiFraudPolicy: boolean;
}
```

### 3.2. Erradicación de Deuda Técnica y Normalización
Durante la auditoría forense y el proceso de compilación, se identificaron y erradicaron discrepancias que violaban el contrato tipado:
* **Eliminación de campos inventados:** Se purgaron propiedades no reconocidas en el esquema raíz como `eventTime`, `formatId`, `formatLabel`, `ocasionSlug`, `ocasionLabel`, `calculatedPrice`, `depositAmount` y `arrivalInstructions`.
* **Subordinación de la dirección física:** Los datos de ubicación territorial e instrucciones de llegada fueron encapsulados dentro de la estructura formal `eventAddress`, asignando `street`, `city`, `postalCode` y `notes`.
* **Inyección de campos obligatorios de seguridad:** Se incorporaron formalmente `userEmail` (derivado sanitizado del teléfono o fallback estructurado), `startTime` predeterminado, `durationHours` unitario y `acceptsAntiFraudPolicy: true` para activar las salvaguardas antifraude.
* **Normalización tipográfica:** Se corrigieron incoherencias de mayúsculas en llamadas al prototipo de cadena, reemplazando métodos inexistentes por `.trim()`.

---

## 4. Elevación Funcional del Seating Planner (Estándar Pulpetti)

El analizador visual del plano de mesas en `src/app/seating-planner/` y `SeatingBoard.tsx` ha superado la fase de maqueta estática, convirtiéndose en una aplicación de diseño espacial completa para eventos privados y bodas de alta gama.

### 4.1. Capacidades de Manipulación Geométrica
* **Geometría de Mobiliario:** Soporta mesas circulares, mesas rectangulares y mesa presidencial de banquete.
* **Control de Plazas y Aforo:** Selector dinámico de comensales que permite graduar de 2 a 12 asientos por mesa, recalculando el aforo total del salón en tiempo real frente al número de invitados confirmados.
* **Manipulación Directa:** Soporta rotación de elementos en ángulos canónicos (0°, 45°, 90°, 180° y giro libre) y ajuste dimensional para reproducir fielmente la escala del recinto.
* **Zonas de Evento Específicas:** Permite posicionar libremente sobre el canvas la pista de baile, el escenario de música en directo, la barra de cóctel, la mesa de regalos y la mesa de tarta nupcial.

### 4.2. Gestión Inteligente de Invitados y Protocolo
* **Etiquetado por Familias:** Clasificación de asistentes por etiquetas cromáticas específicas (Familia de la Novia, Familia del Novio, Círculo de Amigos, Niños, Protocolo VIP).
* **Gestión de Respuestas (RSVP):** Control individual de estado (Asiste, Pendiente, No Asiste). Ante una cancelación de última hora, el sistema permite marcar la baja y reasignar únicamente las plazas liberadas sin descomponer el resto de mesas acordadas.

### 4.3. Exportación y Entrega sin Fricción
* **Impresión Profesional (@media print):** Mediante estilos CSS dedicados, genera en hojas estándar A4 la lista de entrada alfabética con indicación de número de mesa para la recepción, los carteles identificativos de cada mesa y las tarjetas de sitio plegables para comensales.
* **Puente Comercial Inmediato:** El botón principal de acción serializa el plano actual en un hash determinista y redirige al usuario hacia `/presupuesto?seatingPlan=${hash}&pax=${n}&leadMagnet=true`. En la pantalla de presupuesto, el usuario visualiza el incentivo comercial: *«Herramienta Seating Planner Pro (190 €) incluida de cortesía con tu depósito de reserva»*.

---

## 5. Descontaminación del Simulador y Reglas Comerciales de Edwin Agudelo

El motor de cotización y reserva ha sido blindado contra anomalías de estado compartido, asegurando que cada gremio del catálogo mantenga sus reglas propias de tarificación.

### 5.1. Aislamiento por Categoría
* **Erradicación del Fallback Indebido:** El simulador ya no precarga a Edwin Agudelo como artista por defecto en presupuestos donde el usuario cotiza restaurantes, fincas, haciendas, fotógrafos o empresas de catering.
* **Tratamiento de Proveedores sin Precio Declarado:** Queda terminantemente prohibido estampar la tarifa de 350 € del solista a otros proveedores del catálogo. Si una ficha no cuenta con un precio fijo cerrado, el sistema renderiza la etiqueta oficial *«Cotización personalizada»*, canalizando el lead hacia la centralita.

### 5.2. Parametrización Oficial de Tarifas de Edwin Agudelo
Las constantes comerciales de Edwin Agudelo quedan formalmente establecidas en el motor `solista-pricing.ts`:
* **Tarifa Estándar Oficial de Catálogo:** **550,00 €** para actuaciones de solista.
* **Radio Logístico Incluido:** La tarifa estándar incluye de serie **100 kilómetros de desplazamiento** desde la base operativa. Los kilómetros adicionales a partir de dicha demarcación se liquidan a razón de **1,50 € por kilómetro**.
* **Condición de Reserva de Fecha:** El bloqueo atómico de la agenda exige un anticipo del **50% del total presupuestado**, abandonando el modelo de depósito plano de 100 € para actuaciones de gran formato.
* **Régimen de Descuento por Afiliación o Redes:** La introducción de un código de afiliado válido o cupón verificado de redes sociales desbloquea el precio promocional con suelo firme en **350,00 €** (Pack Solista Premium).
* **Alta de Afiliados en Un Clic:** Coordinadores de bodas, salones de celebración y fincas asociadas pueden darse de alta de forma autónoma mediante el endpoint `/api/affiliates/register`, obteniendo su enlace personalizado para aplicar el descuento y devengar su comisión tecnológica.

---

## 6. Arquitectura Financiera y Desglose de Liquidación

La plataforma garantiza el rigor contable a nivel de céntimo entero mediante contratos inmutables respaldados por el centinela de integridad.

### 6.1. El Split Soberano 80/10/10
Cada transacción económica generada a través de la plataforma se desglosa matemáticamente según la partición canónica:
* **80% para el Artista / Proveedor Adjudicatario:** Retención directa del caché del profesional, garantizando la retribución más competitiva del sector frente a las agencias intermediarias tradicionales que detraen hasta un cincuenta por ciento.
* **10% para EAR OS:** Tarifa de mediación tecnológica, mantenimiento de la infraestructura digital y cobertura del soporte operativo.
* **10% para VIMUME:** Asignación de impacto social vinculada a programas de musicoterapia hospitalaria y geriátrica en centros públicos, dotando a la contratación de un factor diferencial de responsabilidad social corporativa.

### 6.2. Contratación Administrativa Menor (Sector Público B2G)
Para contratos de fiestas patronales y eventos institucionales con corporaciones locales bajo la Ley de Contratos del Sector Público (Ley 9/2017):
* **Límite Legal Máximo (Art. 118 LCSP):** 15.000,00 € antes de impuestos para contratos menores de servicios.
* **Techo Preventivo Operativo EAR OS:** **14.250,00 €** (ajuste preventivo del 95% para blindar el expediente frente a reparos de fiscalización por parte de las Intervenciones Municipales).
* **Compatibilidad de Facturación Electrónica:** Generación instantánea de memorias económicas con desglose de precios unitarios y campos oficiales para códigos DIR3 (Oficina Contable, Órgano Gestor y Unidad Tramitadora) para tramitación ante el punto general de entrada FACe.

---

## 7. Resiliencia de Datos, Persistencia de Telemetría y Gobernanza WebGL

Para superar las fragilidades de estado en memoria y evitar degradaciones de rendimiento durante la navegación, la arquitectura ha integrado salvaguardas durables en los niveles de datos y visualización.

### 7.1. Persistencia de Telemetría y Mitigación de Pérdida de Estado
* **Modelo LiveTelemetryPing en PostgreSQL:** La telemetría de navegación y seguimiento de flota se consolida mediante el modelo Prisma `LiveTelemetryPing`, estructurado con índices optimizados por identificador de misión y marcas temporales.
* **Estrategia Fail-Closed con Caché de Contingencia:** El endpoint `/api/telemetry/[id]` opera contra la base de datos relacional como fuente primaria de verdad. En caso de indisponibilidad temporal de la base, el sistema degrada a memoria local declarando formalmente el estado simulado en la cabecera de respuesta, evitando falsos positivos de sincronización.
* **Despliegue Seguro de Migraciones (`--allow-baseline`):** Para sortear el error P3005 de Prisma cuando el esquema contiene tablas preexistentes, el procedimiento `deploy_production_migrations.cjs` verifica previamente la existencia de tipos y tablas mediante consultas directas a `information_schema.tables`, ejecutando únicamente las migraciones delta pendientes sin emitir sentencias DDL destructivas.

### 7.2. Gobernanza de Gráficos 3D y Control Zero-CLS
* **Ciclo de Vida Espacial Determinista:** Mediante `webglLifecycle.ts`, las escenas tridimensionales se gestionan en tres estados unívocos: `static`, `paused` y `running`.
* **Desactivación Fuera de Viewport:** El componente `PrismaDiamondHero3D.tsx` suspende la ejecución de los bucles de animación `requestAnimationFrame` cuando el elemento queda fuera de la vista del usuario o la pestaña pasa a segundo plano mediante `IntersectionObserver` y eventos de visibilidad de página.
* **Respeto a la Accesibilidad:** Si el sistema detecta la preferencia de reducción de movimiento (`prefers-reduced-motion`), el lienzo WebGL desactiva el renderizador dinámico y proyecta una alternativa 2D optimizada en CSS puro con reserva fija de espacio, garantizando un presupuesto de desplazamiento acumulativo de diseño (CLS) inferior a 0.05.

---

## 8. Manual Táctico de Venta: Protocolos de Cierre Inmediato

Con la infraestructura digital plenamente operativa, el operador comercial dispone de cuatro guiones de captación directa estructurados por dolor específico y solución técnica.

### 8.1. Protocolo 1: Captación de Novios y Eventos Privados
* **Punto de Dolor:** Estrés organizativo por cancelaciones de última hora en el salón y falta de claridad en las condiciones de los músicos de directo.
* **Gancho de Entrada (Lead Magnet):** *«Accede de forma gratuita a nuestro Seating Planner interactivo para diseñar la distribución de tus mesas e imprimir la lista de entrada de tus invitados en A4 sin coste alguno»*.
* **Palanca de Conversión:** *«Al confirmar la contratación musical de tu ceremonia o cóctel con Edwin Agudelo, la herramienta profesional valorada en 190 € queda bonificada de cortesía al cien por cien»*.
* **Cierre Transaccional:** Envío del presupuesto verificado con huella criptográfica a WhatsApp (+34 693 693 048) y formalización del depósito a través de la pasarela Stripe Checkout.

### 8.2. Protocolo 2: Alianzas con Fincas y Hoteles de Celebración
* **Punto de Dolor:** Riesgo de sanciones administrativas, multas y órdenes de cese de actividad derivadas de denuncias por exceso de ruido bajo la Ley 37/2003 del Ruido.
* **Propuesta de Valor:** Integración preferente de los espacios en el catálogo oficial de EAR OS con homologación acústica.
* **Garantía Técnica:** Compromiso contractual de que las actuaciones gestionadas por EAR OS respetan estrictamente el umbral máximo de 75 dB SPL y la dotación acústica controlada de 12 vatios por asistente, aportando certificación técnica de recinto responsable y alianza de comisión como afiliados.

### 8.3. Protocolo 3: Afiliación de Artistas y Orquestas de Catálogo
* **Punto de Dolor:** Comisiones abusivas del 30% al 50% aplicadas por representantes tradicionales y retrasos crónicos en la liquidación de las actuaciones.
* **Propuesta de Valor:** Registro sin cuotas iniciales bajo el Split Soberano 80/10/10, donde el artista retiene el ochenta por ciento neto de su caché y cuenta con cobro garantizado mediante depósito previo del cliente.

### 8.4. Protocolo 4: Contratación Ágil con Ayuntamientos (B2G)
* **Punto de Dolor:** Complejidad burocrática y miedo de los Concejales de Festejos a incurrir en fraccionamiento de contratos o recibir objeciones de la Secretaría Municipal.
* **Propuesta de Valor:** Expediente integral de contratación menor confeccionado en menos de quince minutos, ajustado estrictamente por debajo de los 14.250 € con memoria técnica, compromiso de rider y certificación de impacto social positivo mediante VIMUME.

---

## 9. Blindaje Jurídico y Mercantil: España vs. Internacional

Para salvaguardar el patrimonio del fundador y asegurar la viabilidad de la operativa bancaria y pública, se establece la siguiente estructura mercantil:

### 9.1. Figura Recomendada: Sociedad de Responsabilidad Limitada (S.L.)
Para la explotación ordinaria en el territorio nacional, la constitución de una S.L. española representa la única vía que satisface los requisitos operativos:
* **Acceso a Licitaciones B2G:** Las administraciones públicas locales exigen identificación mediante NIF societario español y certificados de estar al corriente de pagos con la Agencia Tributaria y la Seguridad Social para formalizar contratos menores.
* **Operativa Fiscal Local:** La totalidad de los eventos y ceremonias tienen su hecho imponible de IVA en territorio español. La S.L. actúa formalmente como comisionista mediadora mercantil, practicando las liquidaciones correspondientes.
* **Estabilidad Bancaria en Stripe:** La tramitación de cobros directos y transferencias SEPA hacia cuentas bancarias españolas de los artistas exige un perfil corporativo comunitario plenamente verificado bajo protocolos de prevención de blanqueo de capitales.

### 9.2. Evaluación de Entidades Extranjeras (LLC de EE.UU.)
El empleo de una LLC estadounidense queda descartado para la facturación directa de eventos físicos en España:
* La Dirección General de Tributos califica fiscalmente a las LLC operadas por residentes en España bajo el régimen de transparencia fiscal internacional si la sede de dirección efectiva radica en el país, derivando en liquidaciones en el IRPF con recargos.
* Los ayuntamientos rechazan la adjudicación de contratos menores a sociedades extranjeras sin establecimiento permanente o NIF de operador intracomunitario formalizado.
* Una LLC únicamente resultará de utilidad estratégica en una fase ulterior de internacionalización, constituyéndose como matriz tenedora de la propiedad intelectual (*Holding*) para licenciar la tecnología a filiales operativas locales.

---

## 10. Procedimiento Operativo de Despliegue en Coolify y Verificación en Vivo

Para garantizar que el entorno de producción en `productoraear.com` refleje con fidelidad matemática el último commit del repositorio, el operador debe ejecutar secuencialmente el protocolo de despliegue sin caché:

1. **Panel Coolify (`http://82.29.179.172:8000`):** Acceder a la aplicación `productora-ear-os` y ejecutar la acción *«Redeploy without cache»*.
2. **Compilación en Entorno Linux Aislado:** El VPS construye la imagen Docker limpia y ejecuta las migraciones correspondientes en el arranque del contenedor mediante el Dockerfile saneado.
3. **Certificación de Frescura por Sonda (EP-1):** En consola local, ejecutar `node scripts/prod_deploy_freshness.cjs` para verificar que la respuesta del endpoint `/api/health` emita el veredicto `VERDICT=FRESH` coincidente con el commit `38affe82`.
4. **Registro en Google Search Console:** Inspeccionar el archivo canónico `sitemap.xml` asegurando respuesta en código HTTP 200 y solicitar indexación prioritaria para `/seating-planner` y `/presupuesto`.

Con la culminación de este procedimiento, EAR OS sella su condición de sistema transaccional de alta fidelidad, con contratos rigurosamente tipados, gobernanza ejecutable en disco y arquitectura lista para producción continua.


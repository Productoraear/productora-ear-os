-38, nivel socioeconómico medio-alto

* **Geográfico**: Madrid, Toledo, Castilla-La Mancha

* **Comportamiento**: Planifica boda con 12-18 meses antelación, busca online, lee reseñas, valora recomendaciones

* **Necesidades**: Transparencia de precios, garantía de cumplimiento, facilidad de comparación, comunicación directa con músicos

* **Pain points**: Miedo a ser estafado, incertidumbre sobre calidad, dificultad para coordinar, falta de referencias

**Persona 2 \- Proveedor (Músico/Banda)**:

* **Demográfico**: Hombre 30-50 años (mariachi), músico profesional o semiprofesional

* **Geográfico**: Madrid, Toledo, ciudades intermedias centro España

* **Comportamiento**: Busca canales de promoción eficientes, invierte tiempo en redes sociales, gestiona calendario manualmente

* **Necesidades**: Flujo constante de solicitudes cualificadas, cobro garantizado, herramientas de gestión simples

* **Pain points**: Tiempo invertido en presupuestos sin resultado, impagos, dificultad para destacar en mercado saturado, gestión administrativa

## **5\. Alcance del MVP (Features In)**

**Módulo de Registro y Perfiles**:

* Registro diferenciado: Cliente vs Proveedor

* Perfil de músico: bio, fotos, videos, repertorio, zona de cobertura, idiomas, precio orientativo

* Verificación básica: email, teléfono, documento identidad (KYC simplificado)

* Portfolio multimedia: hasta 10 fotos, 3 videos YouTube/Vimeo embebidos

**Módulo de Búsqueda y Descubrimiento**:

* Filtros: tipo de música (mariachi, clásica, jazz, pop/rock, DJ), ubicación (radio 50km), precio (rangos), fecha disponibilidad

* Ordenamiento: relevancia, precio, mejor valorados, más contratados

* Vista lista y vista tarjeta con información clave

* Mapa de proveedores cercanos (Google Maps API)

**Módulo de Solicitud y Presupuesto**:

* Formulario de solicitud: fecha, ubicación exacta, tipo de evento, duración, número de invitados, momento del evento (ceremonia/cóctel/banquete), presupuesto estimado, detalles adicionales

* Notificación push/email a proveedores coincidentes

* Dashboard de músico: bandeja de solicitudes, opción "Enviar presupuesto" o "No disponible"

* Template de presupuesto: precio base, desglose (músicos, equipo, desplazamiento), vigencia 7 días

* Sistema de mensajería: chat cliente-músico dentro de plataforma (máx 20 mensajes por solicitud en MVP)

**Módulo de Reserva Instantánea (Opcional)**:

* Músico crea "Paquete estándar": descripción, precio fijo, duración, incluido/no incluido, calendario disponibilidad

* Cliente ve paquetes disponibles su fecha

* Click "Reservar ahora" → confirmación inmediata → pago adelanto 30%

**Módulo de Pagos y Escrow**:

* Integración con Stripe Connect (Express Accounts para músicos)

* Flujo: Cliente paga → fondos en escrow → evento ocurre → liberación automática 24-72h post-evento

* Adelanto 30% al confirmar \+ 70% 7 días antes evento

* Dashboard de músico: historial pagos, saldo disponible, solicitar transferencia (payout semanal)

* Gestión de reembolsos: automática según política cancelación

**Módulo de Reseñas y Reputación**:

* Solo clientes con reserva completada pueden reseñar

* Calificación 1-5 estrellas \+ comentario texto (max 500 caracteres)

* Categorías: profesionalidad, calidad musical, puntualidad, relación calidad-precio

* Músico puede responder (max 300 caracteres)

* Promedio visible en perfil \+ número total reseñas

**Módulo de Administración (Backend)**:

* Dashboard admin: usuarios totales, transacciones, GMV, comisiones, solicitudes pendientes

* Gestión de disputas: timeline, chat admin-cliente-músico, decisión manual liberación/reembolso

* Moderación de contenido: aprobar/rechazar fotos, videos, reseñas

* Reportes: financieros semanales/mensuales, KPIs de negocio

## **6\. Fuera de Alcance del MVP (Features Out)**

* Sistema de suscripciones premium para músicos (lanzar en v2 si conversión es baja)

* App móvil nativa (solo web responsive en MVP)

* Integración con calendarios externos (Google Calendar, iCal)

* Sistema de recomendaciones con IA/ML

* Multi-idioma (solo español en MVP)

* Expansión a otros tipos de proveedores (fotógrafos, catering, etc.)

* Programa de referidos/afiliación

* Contratación de seguros de cancelación integrada (ofrecer como opción externa)

* Facturación automática con IVA (músicos gestionan facturas independientemente en MVP)

## **7\. Requerimientos No Funcionales**

**Seguridad**:

* Cumplimiento RGPD: consentimientos explícitos, derecho al olvido, portabilidad datos, cifrado en reposo y tránsito (HTTPS/TLS 1.3)[dlapiperdataprotection+2](https://www.dlapiperdataprotection.com/index.html?t=law&c=ES)​

* Autenticación: email \+ contraseña (min 8 caracteres, 1 mayúscula, 1 número), opción SSO Google/Facebook

* PCI-DSS compliance: delegado a Stripe, plataforma nunca almacena datos tarjetas

**Performance**:

* Tiempo carga página \<3 segundos

* Búsqueda con filtros \<2 segundos

* Uptime 99.5% (objetivo MVP, no crítico 24/7)

**Escalabilidad**:

* Arquitectura cloud (AWS/GCP/Azure) con capacidad para 1000 usuarios concurrentes

* Base de datos relacional (PostgreSQL) con opción de sharding futuro

**Usabilidad**:

* Diseño responsive: desktop (1920x1080), tablet (768x1024), mobile (375x667)

* Accesibilidad WCAG 2.1 nivel AA mínimo

* Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versiones)

**Legal y Compliance**:

* Términos y Condiciones específicos España

* Política de Privacidad RGPD-compliant

* Política de Cookies con banner consent

* Aviso legal con datos fiscales empresa

## **8\. Cronograma y Fases (6 meses)**

**Mes 1-2: Diseño y Desarrollo**

* Wireframes y prototipos UX

* Diseño UI marca e identidad

* Desarrollo backend (API REST)

* Desarrollo frontend (React/Vue)

* Integración Stripe Connect

**Mes 3: Testing y Onboarding Alpha**

* Testing funcional y seguridad

* Onboarding 5 músicos piloto (tu red actual)

* Simulación de transacciones test

* Ajustes UX basados en feedback

**Mes 4: Lanzamiento Beta Privado**

* Onboarding 15 músicos adicionales (total 20\)

* Campaña promocional soft: Instagram, Facebook Ads, Google Ads localizado Toledo-Madrid

* Primeras 10 transacciones reales monitorizadas

* Sistema de invitaciones para novios (invite-only)

**Mes 5-6: Lanzamiento Público y Optimización**

* Apertura registro público

* Campaña marketing intensiva: colaboraciones con Bodas.net, blogs nupciales, influencers bodas

* Objetivo 50 transacciones completadas

* Iteración basada en data: NPS, tasa conversión, motivos abandono

## **9\. Riesgos y Mitigaciones**

**Riesgo 1: Baja adopción músicos** → Mitigación: Programa de incentivos early adopters (comisión 8% primeros 3 meses), onboarding personalizado, materiales marketing gratuitos

**Riesgo 2: Problema del "huevo y gallina"** (sin músicos no hay clientes, sin clientes no hay músicos) → Mitigación: Empezar con tu red actual Productora Ear como músicos seed, campañas B2B dirigidas a músicos antes de lanzar B2C

**Riesgo 3: Disputas de pago/servicio** → Mitigación: SLA claro, sistema escrow robusto, proceso mediación definido, fondo de contingencia 5% GMV para casos excepcionales

**Riesgo 4: Competencia de plataformas gratuitas** (Fander, Gigstarter) → Mitigación: Diferenciación en seguridad de pago, escrow, badges calidad, SEO focalizado "contratar mariachi boda Madrid"

**Riesgo 5: Fraude o perfiles falsos** → Mitigación: Verificación KYC básica, sistema de reseñas verificadas (solo post-transacción), moderación manual perfiles en MVP

## **10\. Preguntas Abiertas y Decisiones Pendientes**

* ¿Permitiremos negociación de precio dentro de la plataforma o solo aceptar/rechazar presupuesto?

* ¿Comisión diferenciada por tipo de servicio (mariachi premium 12%, DJ estándar 15%)?

* ¿Incluir opción "Cotización express 2h" con premium fee para el músico?

* ¿Sistema de penalización por cancelaciones repetidas del cliente?

* ¿Ofrecer financiación/pago en cuotas para servicios \>1.500€ (integrar con Sequra/Aplazame)?

## **Consideraciones Adicionales para España**

## **Facturación y Fiscalidad**

Como marketplace establecido en España, debes considerar:

**Emisión de facturas**: En el MVP, cada músico emite su propia factura al cliente por el servicio prestado. La plataforma emite factura independiente por la comisión al músico.[periscopiofiscalylegal.pwc+1](https://periscopiofiscalylegal.pwc.es/se-publican-en-el-doue-las-normas-para-adaptar-el-iva-a-la-era-digital-que-se-implantaran-de-forma-progresiva-hasta-2035/)​

**IVA en comisiones**: Tu comisión del 12-15% estará sujeta a IVA del 21%, que debes repercutir al músico. Ejemplo: Servicio de 1.000€ → Comisión 150€ \+ IVA 31.5€ \= 181.5€ que el músico recibe menos.[immoabroad](https://www.immoabroad.com/es/comision-de-airbnb-en-espana-cuanto-se-paga-realmente)​

**Retenciones IRPF**: Si el músico es autónomo (no sociedad), podrías estar obligado a aplicar retención del 15% sobre su factura de servicios profesionales. Consultar con asesor fiscal para determinar si aplica en modelo marketplace.

**Preparación para ViDA (2028+)**: Aunque tu MVP opera solo en España, si en el futuro expandes a Francia, Italia o Portugal, deberás adaptarte al sistema de facturación electrónica obligatoria y reporte en tiempo real de operaciones transfronterizas.[sede.agenciatributaria+5](https://sede.agenciatributaria.gob.es/Sede/iva/novedades-iva/novedades-normativa-2025/directiva-2025-516-consejo-11-2025.html)​

## **Protección de Datos (RGPD)**

**Datos que procesarás**:

* Clientes: nombre, email, teléfono, dirección evento, datos de pago (delegados a Stripe)

* Músicos: nombre, email, teléfono, DNI/NIE (verificación), datos bancarios (delegados a Stripe), ubicación, fotos, videos

**Obligaciones RGPD**:[acelerapyme+4](https://www.acelerapyme.gob.es/en/news/pill/gdpr-2025-updated-guide-smes)​

* **Consentimiento explícito**: Checkboxes separados para recibir newsletter vs uso de datos para servicio

* **Registro de actividades**: Documento que detalla qué datos procesas, por qué, cuánto tiempo los conservas, quién tiene acceso

* **DPO (Data Protection Officer)**: No obligatorio para MVP con \<250 empleados y procesamiento de datos no masivo ni sensible, pero recomendable consultoría externa

* **Derechos de los usuarios**: Implementar funcionalidades para ejercer derecho de acceso, rectificación, supresión ("derecho al olvido"), portabilidad

* **Brechas de seguridad**: Protocolo para notificar a AEPD (Agencia Española de Protección de Datos) en \<72h si ocurre brecha que comprometa datos personales[mailcommsgroup+1](https://mailcommsgroup.com/en/blog/3-keys-what-you-need-to-know-about-rgpd-and-its-application-in-spain/)​

**Herramientas de la AEPD**: Utiliza "Facilita RGPD" para generar documentación adaptada a tu negocio.[aepd](https://www.aepd.es/en/guides-and-tools/tools/facilita-rgpd)​

## **Marketing y Adquisición**

**Canales prioritarios para MVP**:

**SEO local**: Optimizar para "contratar mariachi boda Madrid", "músicos para bodas Toledo", "banda música boda Castilla-La Mancha"

**Google Ads**: Campañas de búsqueda hiperfocalizadas con presupuesto pequeño (300-500€/mes) para términos de alta intención ("contratar \+ músico/mariachi \+ boda \+ ciudad")

**Facebook/Instagram Ads**: Audiencias personalizadas: mujeres 25-35 
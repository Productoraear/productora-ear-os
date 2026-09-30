# 📦 FASE 2: INVENTARIO, UPSELLS Y LOGÍSTICA DINÁMICA (SSOT)
> **Aprobado por CEO — Octubre 2026**

Este documento define la arquitectura algorítmica para la gestión del inventario y la movilidad de los proveedores en EAR OS V2.

## 1. CATÁLOGO Y ESTRUCTURA DE VENTA
- **Catálogo Base:** Plantillas y categorías cerradas dictadas por EAR OS (Mantiene la UI limpia, estandarizada y premium).
- **Estructura de Venta (Despiece Total):** Sistema modular. El cliente puede alquilar un pack completo o componentes individuales (Ej: un solo altavoz).
- **Montaje/Desmontaje:** Opcional. El cliente puede decidir si asume el montaje él mismo (para abaratar costes) o lo contrata.
- **Peticiones Extra (Custom):** Un campo libre en la UI. El cliente lo escribe, pero la cotización manual se hace desde el *Admin Panel (Call Center)* y se envía el link de Stripe.

## 2. LOGÍSTICA Y DESPLAZAMIENTO S-CLASS
- **Tarifa por Vehículo:** El proveedor configura su propia tarifa kilométrica según el tipo de vehículo necesario.
- **Enrutamiento:** Los cálculos de distancia siempre parten de la "Base Km 0" del proveedor (Evita colapsos de lógica).
- **Islas y Ferris:** El cruce a Baleares/Canarias se factura a posteriori al cliente según el coste real del billete.
- **Filtros Condicionales:** El proveedor puede definir reglas lógicas en su calendario (Ej: "Viernes solo bolos a <50km").

## 3. UPSELLS Y CROSS-SELLING
- **Timing del Upsell:** Estrategia agresiva. En el Checkout (Estilo Amazon) y recordatorio automático por WhatsApp días antes del evento.
- **Cross-Selling de Afiliados:** Cada proveedor/artista tiene un "Enlace de Afiliado". Si traen un cliente o hacen upsell cruzado, el proveedor gana un 5% automático, y EAR OS retiene un 15% (El 20% sigue intocable).
- **Dietas (Comidas):** Recargo automático de +30€/pax SOLO si el evento dura >4h o está a >100km de distancia. (Proveedores Premium pueden editar esto).
- **Complejidad del Evento:** Multiplicador S-Class activado. Las bodas tienen un recargo base del +25% por el estrés y responsabilidad que conllevan.

## 4. RIESGOS, CONTRATOS Y PENALIZACIONES
- **Subcontratación Clandestina:** Totalmente PROHIBIDA (Expulsión inmediata del sistema).
- **Riesgo Clima/Exteriores:** El proveedor asume el riesgo (Debe proteger su equipo o tener seguro).
- **Fianza por Daños (Alquiler):** Autorización de tarjeta retenida (Stripe Hold) por 72 horas para cubrir posibles roturas.
- **Contrato Legal:** Innegociable. Si el contrato (Stripe/DocuSign) no está firmado, la reserva queda bloqueada en el Front-End.
- **Retrasos del Cliente (Esperas):** Las reglas exactas deben ser estipuladas por los proveedores en las categorías de pago en sus T&C.

## 5. MODELO DE SUSCRIPCIÓN Y UX VENDOR
- **Freemium a Premium (Caballo de Troya):** Modelo SaaS vía Stripe con precios calcados a Bodas.net, pero entregando tecnología S-Class.
- **Almacenamiento (AWS S3):** Escalado progresivo. Tiers más altos = Más espacio para fotos/vídeos.
- **Auditoría Media:** Subida directa sin filtros (El libre mercado regula si el contenido es pobre).
- **Asistente de Precios:** No hay intromisión. Los precios son privados y el algoritmo no sugiere bajadas ni subidas.
- **Solapamiento (Stock):** Permitido si el proveedor marca "Stock = 2" y asume la responsabilidad logística del doble equipo.
- **Distintivo S-CLASS:** Badge "Certificado S-Class" para proveedores con 0 fallos (Aumenta su conversión dramáticamente).
- **Botón de Pánico (Last Minute):** Opcional desde el panel para que el proveedor rebaje precios y llene un fin de semana vacío.

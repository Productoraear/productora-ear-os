# 🏗️ VENDOR ARCHITECTURE MANIFESTO (SSOT)
> **Definición Estructural del Área de Proveedores (Vendor Dashboard)**
> Aprobado por CEO — Octubre 2026

Este documento constituye la fuente de verdad (SSOT) para la construcción de todas las interfaces, bases de datos y flujos del sistema de Proveedores en EAR OS V2.

---

## 1. NIVELES DE SUSCRIPCIÓN (TIERS)
El sistema se divide en **Categorías Gratuitas (Free)** y **Categorías de Pago (Premium)**, alterando radicalmente los privilegios del proveedor:

| Característica | Tier GRATUITO | Tier PAGO (PREMIUM) |
| :--- | :--- | :--- |
| **Límite de Media (Fotos/Vídeos)** | Restringido (Base) | Límites generosos y escalables |
| **Chat con el Cliente** | Intermediado por EAR OS (Oculto) | Libertad de Chat Directo tras filtro |
| **Fidelidad (Non-Compete)** | Cláusula estricta de 1 año | Total Libertad |
| **Algoritmo de Posicionamiento** | Basado en rendimiento (Conversión/Reviews) | Rotación aleatoria (Equidad de visibilidad) |

## 2. REGLAS FINANCIERAS Y COMISIONES (ACTUALIZACIÓN S-CLASS)
- **Comisión EAR OS:** EAR OS actúa como mánager digital y retiene el **20% de la transacción** (incluyendo Upsells) para artistas. En proveedores estándar, se mantiene el % fijado. Esta comisión se cobra de forma incondicional y debe ser transparente para cliente y proveedor.
- **VIMUME (RSC):** La aportación solidaria (10% de SROI) es **OPCIONAL**. El proveedor tiene un toggle en su panel para activarla o desactivarla según considere.
- **Logística (Desplazamientos):** Se establece en **1,00 €/km** a partir del Km 50 para todos los proveedores artísticos.
- **Hotel/Pernocta:** El proveedor podrá elegir desde su panel exigir 1 noche (si es necesario) o hasta 3 noches según el evento.
- **Libertad de Precios (Tarifa Base):** Absoluta. Cada proveedor fija sus propias tarifas, penalizaciones, T&C y preguntas frecuentes. EAR OS proporcionará plantillas editables premium para facilitarles la configuración.
- **Depósito Price-Lock:** Sigue siendo inmutable (100 €) o gestionado por el sistema de reservas.

## 3. IDENTIDAD, BRANDING Y MEDIA
- **Estética del Panel:** Claro / Oscuro intercambiable (User Toggle).
- **Ficha Pública:** Plantilla estructurada inmutable de EAR OS para garantizar impacto visual unificado.
- **Nombre Artístico:** Libertad total, pero auditado por IA/Sistema para verificar que sus perfiles externos (redes) coinciden y así transmitir solidez de marca.
- **Logo de Proveedor:** Permitido. Procesado por IA (recorte y aspecto 1:1 / 16:9).
- **Biografía (Bio):** 500-1000 palabras máximo. Bloqueo Regex de links/teléfonos para evitar fugas (Anti-Sabotaje).
- **Audio/Vídeo:** Reproductor integrado minimalista sin distracciones. Cero restricciones previas de calidad (el libre mercado y las bajas reservas castigarán al contenido "Slop").

## 4. FLUJO DE RESERVA Y CALENDARIO
- **Calendario Obligatorio:** El proveedor DEBE mantener su calendario actualizado en su panel.
- **Booking Flow:** Sistema híbrido. Primero un "Booking Request" (24h para aceptar/filtrar), que tras el chat de validación en tiers de pago, puede convertirse en "Insta-Book".
- **Plan B (Emergencias):** Si el proveedor falla, EAR OS asignará automáticamente al "Segundo en cola" del algoritmo para proteger al cliente.

## 5. AUDITORÍA Y ANTI-SABOTAJE
- **Aprobación de Onboarding:** Auditoría obligatoria (Humana o IA) antes de que la ficha sea pública.
- **Strikes:** Sistema estricto. Al tercer strike (cancelación injustificada, mala praxis), baneo total de IP y CIF.
- **Sabotaje Crítico (Inyecciones/Links de pago externos):** Deshabilitación inmediata del perfil, cancelación de payouts y aviso legal automatizado.

## 6. TELEMETRÍA Y SOPORTE
- **Estadísticas:** Telemetría S-Class (Vistas, Tasa de Conversión, LTV, Ganancias).
- **Alertas de Reserva:** WhatsApp (Notificación crítica) + Email de respaldo.
- **Equipamiento Técnico:** El proveedor puede no tener equipo propio (Opcional). EAR OS lo provee si es necesario.
- **Facturación Final:** EAR OS es un intermediario puro (no factura el 80% al cliente, salvo que se active un módulo de auto-facturación sin sobrecostes).

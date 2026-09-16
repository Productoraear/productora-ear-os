"""
GENERATE 50 S-CLASS MVP MICRO-ACTIONS (CHAINED IN 5 BLOCKS OF 10)
Inyecta las 50 micro-acciones atómicas en .antigravity/tasks_queue.json
encadenadas en bloques de 10 con instrucciones de salto directo.
"""
import json
import os

QUEUE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".antigravity", "tasks_queue.json")

def generate_tasks():
    tasks = [
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # BLOQUE 1: MARIANCHIS & BODAS DIRECT CONVERSION (Tareas 1 a 10)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            "id": "mvp-01-mariachi-quote-lock",
            "title": "B1.01: Cotizador Instantáneo de Mariachis con Packs y Price-Lock SHA-256",
            "block": 1,
            "status": "PENDING",
            "description": "Configurar packs de mariachis (Trío 450€ / Quinteto 750€ / Monumental 1300€) en /simulacion-mariachis con bloqueo de precio SHA-256 válido por 48 horas.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/simulacion-mariachis/page.tsx", "src/lib/pricing/mariachi-packs.ts"],
                "macro_script": "Definir interfaz MariachiPack con precios fijos y depósito de 100€ en Stripe. Integrar botón de reserva directa."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-02-mentrida-logistics-live",
            "title": "B1.02: Motor de Logística Méntrida Km 0 en Tiempo Real",
            "block": 1,
            "status": "PENDING",
            "description": "Comprobar y fijar el cálculo de 1,50 €/km a partir del km 50 desde Méntrida, más recargo de 120 € de hotel si la distancia > 200 km o fin >= 3:00 AM.",
            "scaffold": {
                "files_to_touch": ["src/lib/seo/searchIntentEngine.ts", "src/components/widgets/BookingCalculator.tsx"],
                "macro_script": "Verificar función calculateMentridaLogistics(distanceKm, endHour) y reflejar el desglose en el resumen de reserva."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-03-acoustic-rider-12w-spl",
            "title": "B1.03: Selector Acústico 12 W/pax y Limitador < 75 dB SPL",
            "block": 1,
            "status": "PENDING",
            "description": "Conectar el selector de invitados en el cotizador con la asignación automática de equipo (Bose S1 Pro para <50 pax, Bose F1 812 para >50 pax) respetando el límite legal de 75 dB SPL.",
            "scaffold": {
                "files_to_touch": ["src/components/widgets/BookingCalculator.tsx", "src/lib/audio/acousticProfiles.ts"],
                "macro_script": "Garantizar que wattsPerPax = 12 se calcule en vivo y se muestre en un badge verde acústico."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-04-stripe-checkout-price-lock",
            "title": "B1.04: Checkout Stripe Directo con Depósito Inmutable de 100,00 €",
            "block": 1,
            "status": "PENDING",
            "description": "Asegurar que el botón de reserva dirija a la sesión de Stripe con precio fijo de 100 € como depósito de señal y metadatos del evento.",
            "scaffold": {
                "files_to_touch": ["src/app/api/astra/payment-intent/route.ts", "src/components/checkout/StripeDepositButton.tsx"],
                "macro_script": "Forzar amount: 10000 en Stripe payment intent y registrar lead con estado 'deposit_pending'."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-05-whatsapp-concierge-instant",
            "title": "B1.05: Concierge Flotante de WhatsApp con Payload Pre-cargado",
            "block": 1,
            "status": "PENDING",
            "description": "Configurar botón de WhatsApp en la esquina inferior derecha que pre-rellene: 'Hola Edwin, quiero consultar disponibilidad para [Servicio] el [Fecha] en [Provincia]'.",
            "scaffold": {
                "files_to_touch": ["src/components/ui/WhatsAppConciergeFab.tsx", "src/app/(public)/layout.tsx"],
                "macro_script": "Utilizar NEXT_PUBLIC_WHATSAPP_PHONE=34693693048 y codificar el texto con encodeURIComponent."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-06-audio-demos-zero-latency",
            "title": "B1.06: Reproductor de Demos de Audio Sin Latencia para Móviles",
            "block": 1,
            "status": "PENDING",
            "description": "Optimizar el reproductor de audio del cóctel de bodas en /reservar/solista para que arranque instantáneamente sin descargas pesadas.",
            "scaffold": {
                "files_to_touch": ["src/components/audio/QuickAudioPlayer.tsx", "src/app/reservar/solista/page.tsx"],
                "macro_script": "Usar audio HTML5 con preload='none' o streaming ligero y selector de 3 canciones representativas."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-07-flash-booking-modal",
            "title": "B1.07: Modal de Reserva Flash de 3 Campos para Bodas Inminentes",
            "block": 1,
            "status": "PENDING",
            "description": "Crear modal simplificado (Nombre, Teléfono, Fecha) que guarde el lead en PostgreSQL y envíe alerta inmediata por Telegram.",
            "scaffold": {
                "files_to_touch": ["src/components/modals/FlashBookingModal.tsx", "src/app/api/leads/flash/route.ts"],
                "macro_script": "Crear endpoint POST /api/leads/flash con notificación a TELEGRAM_BOT_TOKEN y guardado en Supabase/PostgreSQL."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-08-proof-badge-guarantee",
            "title": "B1.08: Insignias de Confianza 'Garantía Zero Acople' y Sustitución S-Class",
            "block": 1,
            "status": "PENDING",
            "description": "Añadir bloque visual con micro-copia persuasiva de garantía técnica absoluta bajo el formulario de contratación de solista y mariachi.",
            "scaffold": {
                "files_to_touch": ["src/components/trust/TrustBadgesGrid.tsx", "src/app/reservar/solista/page.tsx"],
                "macro_script": "Insertar 3 badges: 'Rider Bose Garantizado', 'Técnico de Sonido Titulado', 'Contrato con Devolución de Señal'."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-09-contract-auto-pdf",
            "title": "B1.09: Generador Automático de Pre-Contrato Digital",
            "block": 1,
            "status": "PENDING",
            "description": "Generar borrador de contrato con datos de fecha, honorarios (350€ solista o pack mariachi) y firma digital para el cliente.",
            "scaffold": {
                "files_to_touch": ["src/lib/contracts/contractGenerator.ts", "src/app/boda/reserva-confirmada/page.tsx"],
                "macro_script": "Crear plantilla de contrato PDF descargable con cláusula de protección acústica y términos de pago."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-10-boda-cashflow-relay",
            "title": "B1.10: Auditoría Final Bloque 1 y Salto Automático a Bloque 2 (Fincas B2B)",
            "block": 1,
            "status": "PENDING",
            "description": "Verificar flujo de caja completo de bodas y mariachis, validar compilación TypeScript y activar la ejecución continua hacia el Bloque 2 (Fincas B2B).",
            "scaffold": {
                "files_to_touch": ["src/app/reservar/solista/page.tsx", "src/app/(public)/simulacion-mariachis/page.tsx"],
                "macro_script": "Validar compilación npx tsc --noEmit y emitir reporte de transición: SIGUIENTE_PASO: Transición automática al Bloque 2 (Tareas 11-20: Activación de Fincas y Red de Partners B2B)."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # BLOQUE 2: FINCAS B2B & RECLAMACIÓN DE PERFILES (Tareas 11 a 20)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            "id": "mvp-11-fincas-landing-refine",
            "title": "B2.11: Optimización de Landings de Fincas con Propuesta de Homologación",
            "block": 2,
            "status": "PENDING",
            "description": "Refinar /fincas y /fincasparaboda destacando el beneficio para propietarios: 'Cero problemas de ruido (<75 dB) y 10% de ingresos adicionales por cada boda'.",
            "scaffold": {
                "files_to_touch": ["src/app/fincas/page.tsx", "src/app/fincasparaboda/page.tsx"],
                "macro_script": "Actualizar hero section con propuesta de valor para directores de fincas y wedding planners."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-12-partner-commission-simulator",
            "title": "B2.12: Simulador Interactivo de Comisiones para Fincas y Planners",
            "block": 2,
            "status": "PENDING",
            "description": "Crear calculadora visual de comisiones en /alianzas: permite elegir número de bodas al año y calcula el pago anual garantizado por el Split 80/10/10.",
            "scaffold": {
                "files_to_touch": ["src/components/calculators/PartnerCommissionCalculator.tsx", "src/app/(public)/alianzas/page.tsx"],
                "macro_script": "Multiplicar eventos × ticket medio × 0.10 y mostrar el retorno neto en euros anuales."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-13-reclamar-perfil-streamline",
            "title": "B2.13: Proceso Express de Reclamación de Perfil (/reclamar-perfil)",
            "block": 2,
            "status": "PENDING",
            "description": "Conectar el botón '¿Eres el dueño de este negocio? Reclama tu perfil' de los 65.000 proveedores a un flujo de verificación rápida por SMS/WhatsApp.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/reclamar-perfil/page.tsx", "src/app/api/providers/claim/route.ts"],
                "macro_script": "Recibir slug del proveedor, email y teléfono de contacto, registrando solicitud de verificación en base de datos."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-14-split-sovereign-display",
            "title": "B2.14: Desglose Transparente del Split Soberano 80/10/10",
            "block": 2,
            "status": "PENDING",
            "description": "Diseñar tarjeta gráfica explicando el reparto: 80% Artista Ejecutor, 10% Finca/Prescriptor, 10% Plataforma EAR OS.",
            "scaffold": {
                "files_to_touch": ["src/components/governance/SplitSovereignCard.tsx", "src/app/(public)/alianzas/page.tsx"],
                "macro_script": "Renderizar barras porcentuales OLED con estética S-Class y tipografía JetBrains Mono para datos de comisiones."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-15-acoustic-homologation-cert",
            "title": "B2.15: Generador del Certificado 'Finca con Protección Acústica <75 dB'",
            "block": 2,
            "status": "PENDING",
            "description": "Generar documento PDF descargable que el dueño de la finca puede mostrar al ayuntamiento y vecinos para acreditar que no supera 75 dB SPL.",
            "scaffold": {
                "files_to_touch": ["src/lib/certificates/acousticCertificate.ts", "src/app/api/certificates/acoustic/route.ts"],
                "macro_script": "Generar certificado con sello de Productora EAR, firma técnica y normativa acústica legal."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-16-affiliate-portal-link",
            "title": "B2.16: Generador de Enlaces de Afiliado para Wedding Planners",
            "block": 2,
            "status": "PENDING",
            "description": "Permitir a planners generar enlaces con su código (?ref=planner_id) que fijen la cookie de atribución por 90 días en el navegador del novio.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/panel/afiliados/page.tsx", "src/lib/affiliates/trackingEngine.ts"],
                "macro_script": "Crear lector de cookie de referencia 'ear_partner_ref' en middleware y asociar a la orden de Stripe."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-17-fincas-exclusive-lighting-pack",
            "title": "B2.17: Catálogo de Iluminación Arquitectónica para Fincas",
            "block": 2,
            "status": "PENDING",
            "description": "Sección con dossier fotográfico de guirnaldas micro-led, iluminación de fachadas y senderos para elevar el valor del espacio.",
            "scaffold": {
                "files_to_touch": ["src/app/(nexus)/admin/iluminacion/page.tsx", "src/data/luces-navidad.ts"],
                "macro_script": "Presentar paquetes cerrados de iluminación para jardines y bodas de noche con precios B2B."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-18-b2b-outbound-leads-pipeline",
            "title": "B2.18: Pipeline de Fincas y Planners en /admin/sourcing",
            "block": 2,
            "status": "PENDING",
            "description": "Conectar el CRM de fincas con estados: Descubierta, Contactada, Propuesta Enviada, Homologada y Activa.",
            "scaffold": {
                "files_to_touch": ["src/app/(nexus)/admin/sourcing/components/SupplierPipeline.tsx", "src/app/(nexus)/admin/sourcing/page.tsx"],
                "macro_script": "Permitir mover tarjetas de fincas entre columnas y ver el valor estimado de comisión anual."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-19-finca-direct-calendar",
            "title": "B2.19: Widget Incrustable de Disponibilidad para Fincas",
            "block": 2,
            "status": "PENDING",
            "description": "Crear vista iframe/widget que las fincas puedan colocar en su intranet o enviar a sus parejas para ver fechas libres de Edwin Agudelo.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/embed/calendario/page.tsx", "src/components/calendar/AvailabilityCalendar.tsx"],
                "macro_script": "Crear vista ligera en /embed/calendario con estilos adaptativos y sin cabeceras del sitio."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-20-fincas-network-relay",
            "title": "B2.20: Auditoría Bloque 2 y Salto Automático a Bloque 3 (VIMUME B2G)",
            "block": 2,
            "status": "PENDING",
            "description": "Validar compilación TypeScript, verificar enlaces del ecosistema de fincas y pasar el testigo al Bloque 3 (VIMUME B2G Senior Care).",
            "scaffold": {
                "files_to_touch": ["src/app/fincas/page.tsx", "src/app/(public)/alianzas/page.tsx"],
                "macro_script": "Validar npx tsc --noEmit y emitir reporte: SIGUIENTE_PASO: Transición automática al Bloque 3 (Tareas 21-30: VIMUME B2G Residencias & Licitaciones Menores)."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # BLOQUE 3: VIMUME B2G SENIOR CARE & ART. 118 LCSP (Tareas 21 a 30)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            "id": "mvp-21-vimume-proposal-oneclick",
            "title": "B3.21: Descarga en 1 Clic del Protocolo Neuroacústico 40 Hz (/vimume/propuesta)",
            "block": 3,
            "status": "PENDING",
            "description": "Asegurar que los directores de residencias puedan descargar el dossier de evidencia clínica en PDF sin fricción de registro.",
            "scaffold": {
                "files_to_touch": ["src/app/vimume/propuesta/page.tsx", "src/components/vimume/ProposalDownloadButton.tsx"],
                "macro_script": "Enlazar directamente con el PDF consolidado del protocolo clínico de estimulación cognitiva."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-22-senior-care-roi-calc",
            "title": "B3.22: Calculadora de Retorno por Residente para Geriátricos",
            "block": 3,
            "status": "PENDING",
            "description": "Herramienta que calcula el coste unitario por residente según plazas (ej. 80 residentes = 3,75 €/residente/mes) en /vimume/centros.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/vimume/centros/page.tsx", "src/components/calculators/VimumeCostCalculator.tsx"],
                "macro_script": "Mostrar el desglose mensual y la justificación para partidas de terapia ocupacional."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-23-pilot-5-centers-apply",
            "title": "B3.23: Formulario de Adhesión al Piloto de 5 Centros",
            "block": 3,
            "status": "PENDING",
            "description": "Formulario de postulación en /vimume/piloto-5-centros para centros de Toledo y Madrid con 14 días de intervención demostrativa.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/vimume/piloto-5-centros/page.tsx", "src/app/api/vimume/pilot-apply/route.ts"],
                "macro_script": "Recoger nombre del centro, responsable médico, número de usuarios y emitir acuse de recibo."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-24-b2g-tender-auto-pliego",
            "title": "B3.24: Generador de Pliego B2G < 14.250 € para Ayuntamientos",
            "block": 3,
            "status": "PENDING",
            "description": "Generador de propuesta técnica ajustada exactamente a 14.250 € (95% del tope del Art. 118 LCSP) para contratación menor directa.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/instituciones/catalogo-360/page.tsx", "src/lib/b2g/tenderProposalGenerator.ts"],
                "macro_script": "Generar documento con códigos CPV, memoria técnica, solvencia y precio ajustado a 14.250 € + IVA."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-25-spl-75db-environmental-badge",
            "title": "B3.25: Ficha de Conformidad Acústica Municipal (< 75 dB SPL)",
            "block": 3,
            "status": "PENDING",
            "description": "Ficha técnica que garantiza que los conciertos de fiestas patronales y eventos en plazas públicas cumplen estrictamente con la normativa de ruidos.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/ocasiones/ayuntamientos/page.tsx", "src/components/b2g/AcousticComplianceDoc.tsx"],
                "macro_script": "Incorporar certificados de limitadores homologados y mapas de cobertura de presión acústica."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-26-clinical-case-studies",
            "title": "B3.26: Sección de Casos de Estudio Clínico en /blog/casos-clinicos",
            "block": 3,
            "status": "PENDING",
            "description": "Publicar 3 casos documentados de reminiscencia en pacientes con deterioro cognitivo leve y moderado con métricas de reactivación motora.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/blog/casos-clinicos/page.tsx", "src/data/vimume-cases.ts"],
                "macro_script": "Diseñar fichas científicas con gráficos de escala MEC y testimonios de equipos de enfermería."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-27-digital-agreement-signature",
            "title": "B3.27: Firma Digital de Carta de Adhesión Institucional",
            "block": 3,
            "status": "PENDING",
            "description": "Módulo interactivo para que alcaldes o directores de residencias puedan firmar la manifestación de interés en pantalla.",
            "scaffold": {
                "files_to_touch": ["src/components/vimume/DigitalSignaturePad.tsx", "src/app/api/vimume/sign-agreement/route.ts"],
                "macro_script": "Capturar trazo SVG de firma y estamparlo en el convenio digital con timestamp UTC."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-28-nextgen-eu-silver-economy",
            "title": "B3.28: Memoria de Justificación de Fondos Europeos NextGenerationEU",
            "block": 3,
            "status": "PENDING",
            "description": "Documento descargable en /vimume/fondos-europeos que vincula la intervención musical con los objetivos de resiliencia y digitalización social.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/vimume/fondos-europeos/page.tsx"],
                "macro_script": "Redactar justificación alineada con convocatorias de innovación en cuidados y envejecimiento activo."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-29-institutional-priority-inbox",
            "title": "B3.29: Alerta Prioritaria B2G en Telegram y Dashboard",
            "block": 3,
            "status": "PENDING",
            "description": "Disparar mensaje prioritario al bot de Telegram del CEO cada vez que un dominio institucional (.es o .gob.es) o residencia solicita presupuesto.",
            "scaffold": {
                "files_to_touch": ["src/lib/notifications/telegramAlerts.ts", "src/app/api/leads/institutional/route.ts"],
                "macro_script": "Filtrar por dominio de email y enviar alerta con etiqueta [URGENTE B2G] al TELEGRAM_CHAT_ID."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-30-vimume-b2g-relay",
            "title": "B3.30: Auditoría Bloque 3 y Salto Automático a Bloque 4 (VoiceStudio AI)",
            "block": 3,
            "status": "PENDING",
            "description": "Validar compilación TypeScript en todos los módulos VIMUME y B2G, y activar automáticamente el Bloque 4 de VoiceStudio y Contenidos IA.",
            "scaffold": {
                "files_to_touch": ["src/app/vimume/page.tsx", "src/app/(public)/instituciones/catalogo-360/page.tsx"],
                "macro_script": "Validar npx tsc --noEmit y emitir reporte: SIGUIENTE_PASO: Transición automática al Bloque 4 (Tareas 31-40: VoiceStudio AI & Viral Content Engine)."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # BLOQUE 4: VOICESTUDIO AI & CONTENIDOS VIRALES (Tareas 31 a 40)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            "id": "mvp-31-story-extraction-form",
            "title": "B4.31: Cuestionario Emocional de 5 Preguntas en /voice-studio",
            "block": 4,
            "status": "PENDING",
            "description": "Formulario que extrae los datos clave para componer la canción: nombres de los protagonistas, lugar donde se conocieron, anécdota divertida y frase especial.",
            "scaffold": {
                "files_to_touch": ["src/app/(admin)/voice-studio/page.tsx", "src/components/voicestudio/StoryForm.tsx"],
                "macro_script": "Construir asistente paso a paso con validación de campos y barra de progreso."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-32-musical-genre-selector",
            "title": "B4.32: Selector de Géneros Musicales Populares (Balada, Mariachi, Pop)",
            "block": 4,
            "status": "PENDING",
            "description": "Selector de estilo con tarjetas sonoras interactivas que previsualizan la base instrumental antes de personalizar la letra.",
            "scaffold": {
                "files_to_touch": ["src/components/voicestudio/GenreSelector.tsx"],
                "macro_script": "Añadir 5 géneros: Balada Romántica, Mariachi Tradicional, Pop Acústico, Bolero Gala y Vals Matrimonial."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-33-voice-cloning-preview",
            "title": "B4.33: Selector de Timbre Vocal S-Class (Edwin Agudelo & Voces Gala)",
            "block": 4,
            "status": "PENDING",
            "description": "Permitir al usuario escuchar cómo sonará la voz principal con muestras grabadas en estudio profesional.",
            "scaffold": {
                "files_to_touch": ["src/components/voicestudio/VoiceTimbreSelector.tsx"],
                "macro_script": "Integrar perfiles vocales de voiceStudioEngine.ts con botón de preview de 15 segundos."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-34-digital-product-checkout",
            "title": "B4.34: Checkout para Producto Digital Fijo (49 € / 99 €)",
            "block": 4,
            "status": "PENDING",
            "description": "Integrar botón de compra directa con Apple Pay, Google Pay y tarjeta para pedidos de canciones personalizadas de entrega en 24h.",
            "scaffold": {
                "files_to_touch": ["src/app/api/digital-checkout/route.ts", "src/components/voicestudio/DigitalPayButton.tsx"],
                "macro_script": "Crear sesión de Stripe Checkout con modo 'payment' y redirección a la página de seguimiento del encargo."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-35-ai-lyrics-generator",
            "title": "B4.35: Generador de Letras Métricas Profesionales con IA",
            "block": 4,
            "status": "PENDING",
            "description": "Prompt estructurado que convierte las respuestas del cliente en estrofas de 8 sílabas y estribillo memorable listo para grabación.",
            "scaffold": {
                "files_to_touch": ["src/lib/ai/lyricsGenerator.ts", "src/app/api/ai/generate-lyrics/route.ts"],
                "macro_script": "Crear endpoint que llame a Gemini/Claude con reglas estrictas de rima consonante y métrica musical."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-36-audio-rendering-pipeline",
            "title": "B4.36: Pipeline de Renderizado y Entrega de Archivo WAV",
            "block": 4,
            "status": "PENDING",
            "description": "Proceso automatizado que combina la pista instrumental, la voz sintetizada y la mezcla final en formato WAV 24-bit.",
            "scaffold": {
                "files_to_touch": ["src/lib/audio/voiceStudioEngine.ts", "src/app/api/audio/render-song/route.ts"],
                "macro_script": "Implementar llamada a VoiceStudio local o motor de síntesis y almacenar resultado en storage seguro."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-37-higgsfield-video-upsell",
            "title": "B4.37: Oferta Up-sell de Videoclip Cinemático (+49 €)",
            "block": 4,
            "status": "PENDING",
            "description": "Módulo en el checkout que ofrece montar la canción con 10 fotos familiares en un vídeo cinemático generado con transiciones profesionales.",
            "scaffold": {
                "files_to_touch": ["src/components/voicestudio/VideoUpsellCard.tsx"],
                "macro_script": "Añadir casilla 'Añadir Videoclip Cinemático por +49 €' que actualiza el total en el Stripe intent."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-38-gift-countdown-page",
            "title": "B4.38: Página de Regalo Digital con Cuenta Atrás y Enlace Privado",
            "block": 4,
            "status": "PENDING",
            "description": "Página donde la persona homenajeada desbloquea su canción con un mensaje sorpresa y animación de confeti.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/regalo/[token]/page.tsx"],
                "macro_script": "Construir landing personalizada con reproductor de audio, letra sincronizada y botón de descarga."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-39-wedding-vows-suite",
            "title": "B4.39: Módulo de Votos Matrimoniales Cantados para Bodas",
            "block": 4,
            "status": "PENDING",
            "description": "Plantilla específica para novios que quieren cantar sus votos con la voz guiada o playback profesional en el momento del sí quiero.",
            "scaffold": {
                "files_to_touch": ["src/app/(public)/votos-cantados/page.tsx"],
                "macro_script": "Diseñar landing de alta emoción con ejemplos reales de votos convertidos en balada."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-40-voicestudio-relay",
            "title": "B4.40: Auditoría Bloque 4 y Salto Automático a Bloque 5 (Infraestructura Final)",
            "block": 4,
            "status": "PENDING",
            "description": "Validar compilación TypeScript en VoiceStudio y saltar al bloque final de infraestructura, sitemaps y sellado del MVP.",
            "scaffold": {
                "files_to_touch": ["src/app/(admin)/voice-studio/page.tsx"],
                "macro_script": "Validar npx tsc --noEmit y emitir reporte: SIGUIENTE_PASO: Transición automática al Bloque 5 (Tareas 41-50: Infraestructura Edge, Indexación Sitemaps & Dashboard Soberano)."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },

        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        # BLOQUE 5: INFRAESTRUCTURA EDGE, SITEMAPS & SELLADO MVP (Tareas 41 a 50)
        # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            "id": "mvp-41-sitemaps-rfc3986-audit",
            "title": "B5.41: Auditoría de las 5 Particiones del Sitemap (RFC 3986)",
            "block": 5,
            "status": "PENDING",
            "description": "Comprobar que ninguna URL en las particiones 0, 1, 2, 3 y 4 del sitemap contenga espacios o caracteres no codificados.",
            "scaffold": {
                "files_to_touch": ["src/app/sitemap.ts"],
                "macro_script": "Ejecutar validación de sanitizeSlug en las 5 particiones asegurando formato XML puro."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-42-pseo-provinces-200-test",
            "title": "B5.42: Test Automatizado de Respuesta HTTP 200 en las 52 Provincias",
            "block": 5,
            "status": "PENDING",
            "description": "Script que verifica que las rutas clave (/servicios/mariachis/toledo, /bodas/madrid/dj, /b2g/toledo) respondan HTTP 200 sin errores 500.",
            "scaffold": {
                "files_to_touch": ["scripts/test_provinces_routes.py"],
                "macro_script": "Hacer ping HTTP en localhost o staging a 10 combinaciones territoriales y certificar código 200."
            },
            "validation": "python scripts/test_provinces_routes.py && npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-43-mobile-cwv-lcp-boost",
            "title": "B5.43: Optimización de Core Web Vitals en Móviles (LCP < 1.2s)",
            "block": 5,
            "status": "PENDING",
            "description": "Verificar precarga de fuentes Google Fonts (Syne, Inter) e imágenes WebP en el viewport inicial.",
            "scaffold": {
                "files_to_touch": ["src/app/layout.tsx"],
                "macro_script": "Revisar etiquetas link rel='preload' de fuentes y fetchPriority='high' en logos y hero banners."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-44-realtime-telemetry-hud",
            "title": "B5.44: Panel de Telemetría Global en /admin/telemetria",
            "block": 5,
            "status": "PENDING",
            "description": "Comprobar métricas en tiempo real de latencia de base de datos, memoria VRAM de Ollama y estado de la pasarela de pagos.",
            "scaffold": {
                "files_to_touch": ["src/app/(nexus)/admin/telemetria/page.tsx"],
                "macro_script": "Conectar indicadores de salud con los servicios locales y remotos."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-45-sovereign-bypass-admin",
            "title": "B5.45: Verificación de Contraseña Soberana Ear2024Ear* y Visibilidad",
            "block": 5,
            "status": "PENDING",
            "description": "Certificar que el usuario pueda autenticarse sin trabas con Ear2024Ear* y que el icono de ojo permita revisar la contraseña.",
            "scaffold": {
                "files_to_touch": ["src/app/api/auth/admin-verify/route.ts", "src/app/(public)/(auth)/login/page.tsx"],
                "macro_script": "Verificar que el login acepte Ear2024Ear* para roles Admin y Editor y redirija a /admin."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-46-treasury-csv-export",
            "title": "B5.46: Exportador CSV de Facturación y Liquidaciones en /admin/sourcing",
            "block": 5,
            "status": "PENDING",
            "description": "Botón de exportación en 1 clic que descarga el resumen de ingresos brutos, depósitos de 100€ y comisiones devengadas para la gestoría.",
            "scaffold": {
                "files_to_touch": ["src/app/(nexus)/admin/sourcing/components/BudgetMatrix.tsx"],
                "macro_script": "Generar archivo CSV descargable con formato compatible con Excel y software contable."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-47-stripe-webhook-sig-guard",
            "title": "B5.47: Blindaje Criptográfico del Webhook de Stripe",
            "block": 5,
            "status": "PENDING",
            "description": "Asegurar que el endpoint /api/stripe/webhook valide el stripe-signature header antes de confirmar cualquier reserva.",
            "scaffold": {
                "files_to_touch": ["src/app/api/stripe/webhook/route.ts"],
                "macro_script": "Verificar stripe.webhooks.constructEvent con STRIPE_WEBHOOK_SECRET protegiendo contra pagos falsos."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-48-edge-security-cache-audit",
            "title": "B5.48: Auditoría de Cabeceras de Seguridad y Políticas Edge",
            "block": 5,
            "status": "PENDING",
            "description": "Garantizar que las cabeceras HSTS, X-Frame-Options: DENY y no-store en /admin funcionen sin penalizar la caché pública en CDN.",
            "scaffold": {
                "files_to_touch": ["src/middleware.ts"],
                "macro_script": "Revisar applySecurityHeaders y encabezados Cache-Control en middleware.ts."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-49-opengraph-dynamic-cards",
            "title": "B5.49: Tarjetas OpenGraph Enriquecidas para Compartir en WhatsApp",
            "block": 5,
            "status": "PENDING",
            "description": "Verificar que al enviar un enlace de solista o mariachi por WhatsApp aparezca la foto en alta resolución y el título 'Productora EAR'.",
            "scaffold": {
                "files_to_touch": ["src/app/reservar/solista/page.tsx", "src/app/(public)/simulacion-mariachis/page.tsx"],
                "macro_script": "Asegurar metadatos openGraph (title, description, images) en las páginas de venta directa."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        },
        {
            "id": "mvp-50-mvp-omega-final-seal",
            "title": "B5.50: Sellado Final del MVP Omega S-Class (Exit Code 0 Total)",
            "block": 5,
            "status": "PENDING",
            "description": "Compilación total y certificación de salida a producción con 0 errores TypeScript y 0 deuda técnica.",
            "scaffold": {
                "files_to_touch": ["src/config/master_system_graph.json"],
                "macro_script": "Ejecutar npx tsc --noEmit, registrar timestamp de certificación en master_system_graph.json y sellar con: ESTADO_FINAL: MVP 100% OPERATIVO, DESPLEGADO Y MONETIZABLE."
            },
            "validation": "npx tsc --noEmit -> Exit Code 0"
        }
    ]

    # Cargar cola actual si existe para no borrar tareas de usuario que no estén terminadas
    existing_tasks = []
    if os.path.exists(QUEUE_PATH):
        try:
            with open(QUEUE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                existing_tasks = data.get("tasks", [])
        except Exception:
            existing_tasks = []

    # Mantener tareas que ya estén en cola si tienen ID distinto
    existing_pending = [t for t in existing_tasks if not t.get("id", "").startswith("mvp-")]
    all_tasks = tasks + existing_pending

    with open(QUEUE_PATH, "w", encoding="utf-8") as f:
        json.dump({"tasks": all_tasks}, f, indent=2, ensure_ascii=False)

    print(f"Éxito: 50 micro-acciones inyectadas en .antigravity/tasks_queue.json ({len(all_tasks)} tareas totales en cola).")

if __name__ == "__main__":
    generate_tasks()

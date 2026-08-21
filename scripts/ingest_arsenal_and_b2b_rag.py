import json
import os

RAG_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"

new_nodes = [
    {
        "id": "ARSENAL-MURO-LED-P26",
        "title": "Muro LED Interior P2.6 High-Refresh — Arsenal Técnico EAR",
        "category": "ARSENAL_PANTALLAS_LED",
        "content": "Muro LED Interior P2.6 High-Refresh. Resolución cristalina para distancias cortas. Ideal para congresos, convenciones e IFEMA. Inversión Base: 120€ / m². Pitch: P2.6mm, Refresh Rate: 3840Hz, Brillo: 1000 nits, Chasis de aluminio fundido modular. Canonical: productoraear.com/alquiler-pantalla-led/pantalla-led-interior.",
        "tags": ["pantalla_led", "p2_6", "ifema", "congresos", "alquiler_pantalla_led", "arsenal_tecnico"]
    },
    {
        "id": "ARSENAL-LIENZO-LED-EXTERIOR",
        "title": "Lienzo LED Exterior IP65 High-Brightness — Arsenal Técnico EAR",
        "category": "ARSENAL_PANTALLAS_LED",
        "content": "Lienzo LED Exterior IP65 High-Brightness. Visibilidad total bajo luz solar directa. Estructura reforzada para festivales y escenarios masivos. Inversión Base: 150€ / m². Protección IP65 waterproof, Brillo: 5500 nits, Resistencia al viento: 20m/s. Canonical: productoraear.com/alquiler-pantalla-led/pantallas-led-exterior.",
        "tags": ["pantalla_led_exterior", "ip65", "festivales", "high_brightness", "alquiler_pantalla_led"]
    },
    {
        "id": "ARSENAL-SUELO-LED-INTERACTIVO",
        "title": "Suelo LED Interactivo Reforzado — Arsenal Técnico EAR",
        "category": "ARSENAL_PANTALLAS_LED",
        "content": "Suelo LED Interactivo Reforzado. Soporta peso de vehículos (hasta 2.000 kg/m²). Vidrio templado antideslizante con sensores capacitivos para stands de automoción, pasarelas y galas. Inversión Base: 200€ / m². Canonical: productoraear.com/alquiler-pantalla-led/pantalla-led-suelo.",
        "tags": ["suelo_led", "interactivo", "automocion", "stands", "alquiler_pantalla_led"]
    },
    {
        "id": "ARSENAL-PANTALLA-LED-CURVA",
        "title": "Pantalla LED Curva / Flexible — Arsenal Técnico EAR",
        "category": "ARSENAL_PANTALLAS_LED",
        "content": "Pantalla LED Curva / Flexible. Arquitectura visual orgánica para escenarios de autor y diseños inmersivos. Curvatura convexa y cóncava ±15°. Inversión Base: 180€ / m². Canonical: productoraear.com/alquiler-pantalla-led/pantallas-led-curva-flexibles.",
        "tags": ["pantalla_led_curva", "flexible", "escenarios_autor", "inmersivo", "alquiler_pantalla_led"]
    },
    {
        "id": "ARSENAL-MONITOR-98-4K",
        "title": "Monitor Gran Formato 98\" 4K Ultra-Thin — Arsenal Técnico EAR",
        "category": "ARSENAL_MONITORES_TV",
        "content": "Monitor Gran Formato 98\" 4K Ultra-Thin. Sustituye la proyección con máxima nitidez y brillo profesional para salas de juntas y ferias 24/7. Inversión Base: 450€. Resolución 3840x2160. Canonical: productoraear.com/alquiler-tv-monitor-led-madrid/alquiler-monitores-98.",
        "tags": ["monitor_98", "4k", "tv_madrid", "ferias", "ifema", "monitores_led"]
    },
    {
        "id": "ARSENAL-MONITOR-85-4K",
        "title": "Monitor 85\" 4K Smart HDR — Arsenal Técnico EAR",
        "category": "ARSENAL_MONITORES_TV",
        "content": "Monitor 85\" 4K Smart HDR. Equilibrio perfecto entre tamaño e impacto visual para salas VIP y conferencias. Inversión Base: 320€. Panel HDR10+ Pro. Canonical: productoraear.com/alquiler-tv-monitor-led-madrid/alquiler-monitores-85.",
        "tags": ["monitor_85", "4k_hdr", "smart_tv", "conferencias", "monitores_led"]
    },
    {
        "id": "ARSENAL-PANTALLA-TACTIL-65",
        "title": "Pantalla Táctil Interactiva 65\" — Arsenal Técnico EAR",
        "category": "ARSENAL_MONITORES_TV",
        "content": "Pantalla Táctil Interactiva 65\". Navegación fluida para catálogos digitales en ferias comerciales y presentaciones interactivas. Inversión Base: 180€. 20 puntos táctiles simultáneos. Canonical: productoraear.com/alquiler-tv-monitor-led-madrid/alquiler-pantallas-tactiles.",
        "tags": ["pantalla_tactil", "touchscreen", "ferias", "catalogos", "monitores_led"]
    },
    {
        "id": "ARSENAL-LINE-ARRAY-VTX-A8",
        "title": "Sistema Line Array VTX A8 — Arsenal Técnico EAR",
        "category": "ARSENAL_SONIDO_PRO",
        "content": "Sistema Line Array VTX A8. Presión sonora controlada de 12 W/pax para eventos de alta gama con dispersión milimétrica. Etapas Crown I-Tech HD. Inversión Base: 850€. Canonical: productoraear.com/alquilar-equipos-de-sonido-en-madrid/alquiler-altavoces.",
        "tags": ["line_array", "vtx_a8", "12w_pax", "sonido_profesional", "altavoces_madrid"]
    },
    {
        "id": "ARSENAL-SHURE-AXIENT-DIGITAL",
        "title": "Microfonía Digital Shure Axient — Arsenal Técnico EAR",
        "category": "ARSENAL_SONIDO_PRO",
        "content": "Microfonía Digital Shure Axient. Blindaje contra interferencias de espectro RF para ponentes VIP y directos críticos. Cápsulas KSM9 / Beta 58. Inversión Base: 95€. Canonical: productoraear.com/alquilar-equipos-de-sonido-en-madrid/microfonos.",
        "tags": ["shure_axient", "microfonia_digital", "ksm9", "sonido_profesional", "microfonos_madrid"]
    },
    {
        "id": "ARSENAL-TRADUCCION-SIMULTANEA",
        "title": "Sistema de Traducción Simultánea Bosch — Arsenal Técnico EAR",
        "category": "ARSENAL_SONIDO_PRO",
        "content": "Sistema de Traducción Simultánea Bosch. Infrarrojos inmunes a interferencias lumínicas para cumbres internacionales y cabinas bilingües. Hasta 32 canales de idioma. Inversión Base: 450€. Canonical: productoraear.com/alquilar-equipos-de-sonido-en-madrid/alquiler-traduccion-simultanea.",
        "tags": ["traduccion_simultanea", "bosch", "cumbres_internacionales", "sonido_profesional"]
    },
    {
        "id": "ARSENAL-CABEZA-MOVIL-15R",
        "title": "Cabeza Móvil Beam/Spot 15R Pro — Arsenal Técnico EAR",
        "category": "ARSENAL_ILUMINACION",
        "content": "Cabeza Móvil Beam/Spot 15R Pro. Efectos aéreos definidos, prismas rotativos 8+16 caras y gobos para galas corporativas y directos. Inversión Base: 75€. Control DMX512. Canonical: productoraear.com/alquiler-iluminacion-eventos/alquiler-cabezas-moviles.",
        "tags": ["cabeza_movil", "beam_15r", "iluminacion_eventos", "dmx512", "galas"]
    },
    {
        "id": "ARSENAL-SISTEMA-LASER-RGB",
        "title": "Sistema Láser RGB 10W Pangolin — Arsenal Técnico EAR",
        "category": "ARSENAL_ILUMINACION",
        "content": "Sistema Láser RGB 10W. Geometría lumínica de alta precisión para branding corporativo y proyecciones aéreas de impacto. Escáner 40 kpps. Inversión Base: 180€. Canonical: productoraear.com/alquiler-iluminacion-eventos/iluminacion-laser.",
        "tags": ["laser_rgb", "laser_10w", "pangolin", "iluminacion_eventos", "branding"]
    },
    {
        "id": "ARSENAL-BLACKMAGIC-URSA",
        "title": "Cámara Blackmagic URSA Broadcast 4K — Arsenal Técnico EAR",
        "category": "ARSENAL_VIDEO_IT",
        "content": "Cámara Blackmagic URSA Broadcast. Calidad televisiva 4K HDR para streaming profesional, realización multicámara y grabaciones oficiales. Sensor 4K, 12G-SDI. Inversión Base: 350€. Canonical: productoraear.com/alquiler-camaras-profesionales/alquiler-blackmagic-ursa.",
        "tags": ["blackmagic_ursa", "streaming_4k", "camaras_profesionales", "video_it"]
    },
    {
        "id": "ARSENAL-ESTACION-EDICION-LAPTOP",
        "title": "Estación de Edición / Laptop Pro — Arsenal Técnico EAR",
        "category": "ARSENAL_VIDEO_IT",
        "content": "Estación de Edición / Laptop Pro (GPU RTX 4080 / Apple M3 Max). Equipos informáticos configurados para producción técnica, software vMix y Resolume Arena. Inversión Base: 120€. Canonical: productoraear.com/alquiler-equipos-informaticos.",
        "tags": ["laptop_pro", "estacion_edicion", "vmix", "resolume", "equipos_informaticos"]
    },
    {
        "id": "ARSENAL-TARIMA-ROSCO-2X1",
        "title": "Tarima Rosco 2x1m Reforzada — Arsenal Técnico EAR",
        "category": "ARSENAL_ESCENARIOS",
        "content": "Tarima Rosco 2x1m Reforzada. Certificación de carga pesada 750 kg/m², madera de abedul 22mm antideslizante con patas telescópicas regulables. Inversión Base: 25€. Canonical: productoraear.com/alquiler-escenarios/alquiler-tarima.",
        "tags": ["tarima_rosco", "escenarios", "tarimas_madrid", "alquiler_escenarios"]
    },
    {
        "id": "ARSENAL-ESTRUCTURA-TRUSS-SQ4112",
        "title": "Estructura Truss Global SQ-4112 — Arsenal Técnico EAR",
        "category": "ARSENAL_ESCENARIOS",
        "content": "Estructura Truss Global SQ-4112. Soporte modular de aluminio estructural EN-AW 6082 T6 para rigging de iluminación y pantallas LED. Inversión Base: 15€ / metro. Canonical: productoraear.com/alquiler-estructuras-truss.",
        "tags": ["truss_global", "rigging", "estructuras_aluminio", "alquiler_estructuras_truss"]
    },

    # B2B CONSULTING & PROMESAS RECTORAS
    {
        "id": "B2B-ACOMPANAMIENTO-EMPRESARIOS",
        "title": "Plan Ejecución Empresarios (1000€/mes) — Productora EAR",
        "category": "CONSULTORIA_B2B",
        "content": "Plan Ejecución Empresarios: 1000€ / Mensual. No solo diseñamos la estrategia; bajamos al barro contigo para implementarla. Resultados que superan expectativas con ROI garantizado por escrito. Incluye: Implementación de tácticas de marketing, acompañamiento estratégico semanal, auditoría continua de procesos y garantía de resultados por escrito. Agenda cita de 30 min gratis. URL: productoraear.com/empresarios.",
        "tags": ["plan_empresarios", "consultoria_1000", "roi_garantizado", "estrategia_tactica", "empresarios"]
    },
    {
        "id": "B2B-ESCALADO-PREMIUM-BUSINESS",
        "title": "Plan Escalado Máximo Premium Business (Desde 3000€/mes) — Productora EAR",
        "category": "CONSULTORIA_B2B",
        "content": "Plan Escalado Máximo Premium Business: Desde 3000€ / Mensual. Full-service VIP. Incluye todo lo del Plan Empresarios + Gestión de activos digitales full-service, estructura de ingeniería emocional para ventas, reportes forenses mensuales de ROI y auditoría estratégica dedicada de 30 min. URL: productoraear.com/empresarios.",
        "tags": ["premium_business", "consultoria_3000", "full_service", "ingenieria_emocional", "empresarios"]
    },
    {
        "id": "PROMESA-SOBERANA-EDWIN-AGUDELO",
        "title": "Nuestra Promesa Soberana de Transformación Empresarial — Edwin Agudelo",
        "category": "FILOSOFIA_RECTORA",
        "content": "Promesa Soberana de Productora EAR y Edwin Agudelo: 'A través de nuestra metodología te acercamos a un nivel de conciencia superior desde la neutralidad profesional. No queremos solo tu presupuesto, queremos tu transformación empresarial.'",
        "tags": ["promesa_soberana", "edwin_agudelo", "transformacion_empresarial", "filosofia_ear"]
    }
]

def main():
    if not os.path.exists(RAG_PATH):
        print(f"Error: {RAG_PATH} not found")
        return

    with open(RAG_PATH, "r", encoding="utf-8") as f:
        database = json.load(f)

    existing_ids = {node.get("id") for node in database}
    added = 0
    for node in new_nodes:
        if node["id"] not in existing_ids:
            database.append(node)
            existing_ids.add(node["id"])
            added += 1
        else:
            # Update existing node
            for i, n in enumerate(database):
                if n.get("id") == node["id"]:
                    database[i] = node
                    added += 1
                    break

    with open(RAG_PATH, "w", encoding="utf-8") as f:
        json.dump(database, f, ensure_ascii=False, indent=2)

    print(f"RAG Base Ingested Successfully: Total Nodes = {len(database)} (Processed {added} Arsenal & B2B nodes)")

if __name__ == "__main__":
    main()

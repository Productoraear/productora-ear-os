// ==============================================================================
// VIMUME ECOSYSTEM MATRIX: 11 STAKEHOLDERS & 30 RELATIONAL CONNECTORS (SSOT)
// ==============================================================================

export interface VimumeStakeholderFlow {
  id: string;
  role: 'seniors' | 'families' | 'clinicians' | 'media' | 'associations' | 'vendors' | 'b2g' | 'rsc_sponsors' | 'artists' | 'venues' | 'affiliates';
  name: string;
  landingUrl: string;
  heroTagline: string;
  interactiveTool: string;
  narrativeThread: string;
  conversionMechanism: string;
}

export const VIMUME_11_STAKEHOLDERS_MATRIX: VimumeStakeholderFlow[] = [
  {
    id: "flow-seniors",
    role: "seniors",
    name: "1. Pacientes Senior & Guías de la Memoria",
    landingUrl: "/vimume/centros",
    heroTagline: "El mapa sonoro que reconecta tu historia",
    interactiveTool: "Consola Neuroacústica Gamma 40Hz",
    narrativeThread: "No eres un paciente; eres el director de tu propia memoria musical.",
    conversionMechanism: "Sesiones individuales con auriculares de alta fidelidad y sonido inmersivo."
  },
  {
    id: "flow-families",
    role: "families",
    name: "2. Familias & Cuidadores",
    landingUrl: "/vimume/familia",
    heroTagline: "Recupera la mirada de quien amas",
    interactiveTool: "Formulario de Mapeo de la Banda Sonora Vital™",
    narrativeThread: "Construye el archivo sonoro definitivo con las 10 canciones clave de su juventud.",
    conversionMechanism: "Acceso a la Bóveda Privada de vídeo-documentales de reactivación."
  },
  {
    id: "flow-clinicians",
    role: "clinicians",
    name: "3. Terapeutas, Geriatras & Directores Médicos",
    landingUrl: "/vimume/protocolo",
    heroTagline: "Rigor neurocientífico y evidencia clínica no farmacológica",
    interactiveTool: "Calculadora de Parámetros Acústicos de Seguridad (<75 dB)",
    narrativeThread: "Estimulación cognitiva Gamma 40Hz sin efectos secundarios.",
    conversionMechanism: "Solicitud de prueba piloto de 30 días en centros sanitarios o residencias."
  },
  {
    id: "flow-media",
    role: "media",
    name: "4. Medios de Comunicación & Prensa",
    landingUrl: "/vimume/prensa",
    heroTagline: "Innovación neuroacústica en el tratamiento del deterioro cognitivo",
    interactiveTool: "Sala de Prensa Interactiva & Descarga de Material 4K",
    narrativeThread: "Casos de éxito documentados de reconexión emocional mediante música de memoria.",
    conversionMechanism: "Acreditación de periodistas y kits de prensa con datos de impacto SROI."
  },
  {
    id: "flow-associations",
    role: "associations",
    name: "5. Asociaciones de Alzheimer (AFAs) & Fundaciones",
    landingUrl: "/vimume/asociaciones",
    heroTagline: "Alianzas estratégicas con AFAs y Fundaciones de Alzheimer",
    interactiveTool: "Solicitud de Talleres e Intervenciones Apadrinadas",
    narrativeThread: "Llevamos el programa VIMUME a asociaciones de familiares sin coste directo.",
    conversionMechanism: "Firma de convenios de colaboración interinstitucional."
  },
  {
    id: "flow-vendors",
    role: "vendors",
    name: "6. Empresarios & Proveedores de la Silver Economy",
    landingUrl: "/vimume/proveedores-senior",
    heroTagline: "Ecosistema de soluciones para la Silver Economy",
    interactiveTool: "Marketplace Homologado de Servicios y Dispositivos Senior",
    narrativeThread: "Unimos tecnología, audífonos, domótica y bienestar al protocolo VIMUME.",
    conversionMechanism: "Registro de empresas colaboradoras con sello de homologación clínica."
  },
  {
    id: "flow-b2g",
    role: "b2g",
    name: "7. Ayuntamientos & Concejalías (B2G)",
    landingUrl: "/ocasiones/ayuntamientos",
    heroTagline: "Programa municipal contra la Soledad No Deseada y Envejecimiento Activo",
    interactiveTool: "Generador de Memoria Técnica Justificativa (Art. 118 LCSP)",
    narrativeThread: "Adjudicación directa para ayuntamientos en menos de 24h (<15.000 €).",
    conversionMechanism: "Descarga de pliego de prescripciones técnicas listo para firmar."
  },
  {
    id: "flow-rsc",
    role: "rsc_sponsors",
    name: "8. Patrocinadores RSC, Banca & Seguros",
    landingUrl: "/vimume/inversion",
    heroTagline: "Financia la memoria de la Silver Economy en la España Vaciada",
    interactiveTool: "Simulador de Retorno Social de la Inversión (SROI)",
    narrativeThread: "Alineación con criterios ESG y apadrinamiento de centros residenciales.",
    conversionMechanism: "Contratación de Tiers de Apadrinamiento Corporativo (3.000 € / 5.000 €)."
  },
  {
    id: "flow-artists",
    role: "artists",
    name: "9. Artistas, Músicos & Equipo Técnico",
    landingUrl: "/artistas/edwin-agudelo",
    heroTagline: "Excelencia vocal y lírica de autor aplicada a la salud",
    interactiveTool: "Bóveda de Repertorio Histórico & Gestión AIE/SGAE",
    narrativeThread: "Interpretación profesional con empatía absoluta y calidez sonora.",
    conversionMechanism: "Contratación de actuaciones en directo y personalizaciones líricas."
  },
  {
    id: "flow-venues",
    role: "venues",
    name: "10. Fincas, Recintos & Catering B2B",
    landingUrl: "/proveedores",
    heroTagline: "Red de Fincas y Espacios de Eventos Solidarios",
    interactiveTool: "Calculadora del Split Soberano de Impacto (80/10/10)",
    narrativeThread: "El 10% de cada evento comercial se destina a sesiones en residencias locales.",
    conversionMechanism: "Homologación de recintos con distintivo de Impacto Social Garantizado."
  },
  {
    id: "flow-affiliates",
    role: "affiliates",
    name: "11. Afiliados, Prescriptores & Agentes",
    landingUrl: "/login",
    heroTagline: "Red de Embajadores y Prescriptores Territoriales",
    interactiveTool: "Generador de Tokens de Atribución claim_{slug}_10x",
    narrativeThread: "Recompensamos a quienes conectan residencias y ayuntamientos con VIMUME.",
    conversionMechanism: "Liquidación automática de comisiones por adopción de centros."
  }
];

export interface VimumeRelationalConnector {
  level: number;
  code: string;
  name: string;
  category: 'CORE' | 'MARKET' | 'PRODUCT' | 'COMMERCE' | 'ACOUSTICS' | 'EMOTION' | 'OPERATIONS' | 'FINANCE' | 'CLINICAL' | 'LEGAL' | 'INFRASTRUCTURE' | 'LEGACY';
  stakeholders: Array<VimumeStakeholderFlow['role']>;
  landingUrl: string;
  interactiveTool: string;
  narrativeThread: string;
  conversionTrigger: string;
  technicalSpec: string;
}

export const VIMUME_30_CONNECTORS_MATRIX: VimumeRelationalConnector[] = [
  {
    level: 1,
    code: "L1_ECOSISTEMA_ROOT",
    name: "Ecosistema Soberano Raíz",
    category: "CORE",
    stakeholders: ["b2g", "artists", "venues"],
    landingUrl: "/",
    interactiveTool: "Túnel Neural de Ignición 3D Spline",
    narrativeThread: "Plataforma central y soberanía técnica/económica de Productora EAR.",
    conversionTrigger: "Acceso instantáneo multi-rol y despacho de presupuestos en tiempo real.",
    technicalSpec: "Next.js App Router, SSR/ISR con renderizado bare-metal ultrarrápido."
  },
  {
    level: 2,
    code: "L2_MACRO_DOMINIO",
    name: "Macro Dominio de Negocio",
    category: "MARKET",
    stakeholders: ["venues", "b2g", "rsc_sponsors"],
    landingUrl: "/servicios",
    interactiveTool: "Selector de 6 Macro Dominios Estratégicos",
    narrativeThread: "Conexión integral entre B2C Lujo, B2B Corporativo, B2G Institucional y Silver Economy VIMUME.",
    conversionTrigger: "Segmentación sin fricción de intenciones de búsqueda.",
    technicalSpec: "Enrutamiento semántico bidireccional con clasificación automática."
  },
  {
    level: 3,
    code: "L3_VERTICAL_MERCADO",
    name: "Vertical de Mercado",
    category: "MARKET",
    stakeholders: ["venues", "clinicians", "b2g"],
    landingUrl: "/ocasiones",
    interactiveTool: "Matriz de Ocasiones y Momentos Vitales",
    narrativeThread: "Especialización por nicho: Bodas de Élite, Galas Corporativas, Residencias y Festivales.",
    conversionTrigger: "Filtrado facetado por tipo de recinto y aforo estimado.",
    technicalSpec: "Filtrado contextual con píldoras de 100px y persistencia en estado."
  },
  {
    level: 4,
    code: "L4_LINEA_SERVICIO",
    name: "Línea de Servicio",
    category: "PRODUCT",
    stakeholders: ["artists"],
    landingUrl: "/servicios/mariachis",
    interactiveTool: "Buscador Inteligente de Catálogo de Servicios",
    narrativeThread: "Mariachi de Gala, Ensamble Clásico, Producción Escénica y Terapia Neuroacústica.",
    conversionTrigger: "Visualización de formatos y disponibilidad en calendario en vivo.",
    technicalSpec: "Catálogo estructurado con Schema.org Service y MusicGroup."
  },
  {
    level: 5,
    code: "L5_FAMILIA_PRODUCTO",
    name: "Familia de Producto",
    category: "PRODUCT",
    stakeholders: ["b2g", "artists"],
    landingUrl: "/artistas/edwin-agudelo",
    interactiveTool: "Selector de Formatos (Solista a Banda Monumental)",
    narrativeThread: "Desde la intimidad de un solista lírico hasta el despliegue de 16 músicos en escenario.",
    conversionTrigger: "Comparativa visual de impacto escénico y dotación instrumental.",
    technicalSpec: "Modelos escalables con multiplicadores dinámicos de aforo."
  },
  {
    level: 6,
    code: "L6_PRODUCTO_HOMOLOGADO",
    name: "Producto Homologado & SKUs",
    category: "PRODUCT",
    stakeholders: ["clinicians"],
    landingUrl: "/cotizador",
    interactiveTool: "Bespoke Pricer con Tarifas Inmutables",
    narrativeThread: "Tarifas base transparentes: Solista 350€, Sexteto 750€, Imperial 1250€, Sesión VIMUME 450€.",
    conversionTrigger: "Cálculo instantáneo sin sorpresas ni presupuestos opacos.",
    technicalSpec: "Validación estricta Zod en cliente y servidor con hash SHA-256."
  },
  {
    level: 7,
    code: "L7_VARIANTE_CONFIGURACION",
    name: "Variante de Configuración Acústica",
    category: "ACOUSTICS",
    stakeholders: ["artists", "venues"],
    landingUrl: "/arsenal",
    interactiveTool: "Configurador Acústico (Acústico / Bose F1 / Line Array)",
    narrativeThread: "Adaptación acústica milimétrica al recinto (interior, jardín o plaza mayor).",
    conversionTrigger: "Garantía de inteligibilidad vocal sin distorsión ni feedback.",
    technicalSpec: "Curvas de ecualización digital calibradas según volumetría del espacio."
  },
  {
    level: 8,
    code: "L8_ARQUITECTURA_RIDER",
    name: "Arquitectura Rider Técnico",
    category: "ACOUSTICS",
    stakeholders: ["artists", "b2g"],
    landingUrl: "/arsenal",
    interactiveTool: "Visor Interactivo de Rider S-Class y Pantallas LED P2.9",
    narrativeThread: "Microfonía inalámbrica Shure Axient, consolas digitales Midas y procesado 4K Novastar.",
    conversionTrigger: "Descarga de ficha técnica homologada para técnicos municipales.",
    technicalSpec: "Cumplimiento de estándares de compatibilidad electromagnética y radiofrecuencia."
  },
  {
    level: 9,
    code: "L9_CALIBRACION_ACUSTICA",
    name: "Calibración Acústica & Seguridad Física",
    category: "ACOUSTICS",
    stakeholders: ["clinicians", "seniors"],
    landingUrl: "/vimume/protocolo",
    interactiveTool: "Calculadora de Presión Sonora (12 W/pax vs <75 dB Safe)",
    narrativeThread: "12 W/pax para eventos masivos al aire libre y limitación estricta <75 dB en residencias.",
    conversionTrigger: "Certificado de Confort Acústico y Cuidado Otológico para mayores.",
    technicalSpec: "Medición dBA/dBC ponderada con limitadores analógicos/DSP."
  },
  {
    level: 10,
    code: "L10_NECESIDAD_CLIENTE",
    name: "Intención & Necesidad del Cliente",
    category: "EMOTION",
    stakeholders: ["families", "b2g"],
    landingUrl: "/cotizador",
    interactiveTool: "Motor de Diagnóstico de Intención de Búsqueda",
    narrativeThread: "Sorpresa de bodas, homenaje a padres, soledad no deseada o licitación municipal.",
    conversionTrigger: "Solución personalizada que ataca el punto de dolor exacto en <3 clics.",
    technicalSpec: "Algoritmo de matching conductual de 50 preguntas parametrizadas."
  },
  {
    level: 11,
    code: "L11_DISPARADOR_EMOCIONAL",
    name: "Disparador Emocional & Storyselling",
    category: "EMOTION",
    stakeholders: ["families"],
    landingUrl: "/artistas/edwin-agudelo",
    interactiveTool: "Bóveda de Testimonios y Momentos WOW en Vídeo 4K",
    narrativeThread: "Gratitud intergeneracional, euforia nupcial y reconexión de recuerdos olvidados.",
    conversionTrigger: "Vídeos emotivos reales que eliminan cualquier objeción de precio.",
    technicalSpec: "Streaming optimizado WebP/HLS con entrega CDN de baja latencia."
  },
  {
    level: 12,
    code: "L12_REPERTORIO_SUITE",
    name: "Suite de Repertorio Temático",
    category: "EMOTION",
    stakeholders: ["seniors", "families"],
    landingUrl: "/vimume/familia",
    interactiveTool: "Formulario de Mapeo de la Banda Sonora Vital™",
    narrativeThread: "Las 10 canciones que marcaron su juventud: Copla, Bolero, Pasodoble y Clásicos Charros.",
    conversionTrigger: "Personalización del repertorio interpretado en vivo nota a nota.",
    technicalSpec: "Base de datos de más de 500 partituras y letras homologadas sin lenguaje ofensivo."
  },
  {
    level: 13,
    code: "L13_BARRERA_ETICA_FILTRO",
    name: "Barrera Ética & Filtro de Calidad",
    category: "OPERATIONS",
    stakeholders: ["clinicians", "b2g"],
    landingUrl: "/vimume",
    interactiveTool: "Manifiesto de Integridad y Cero Narcocorridos",
    narrativeThread: "0% Machismo, 0% Violencia, 100% Mensaje Constructivo y Dignidad Humana.",
    conversionTrigger: "Tranquilidad total para familias, directores de residencias y concejalías.",
    technicalSpec: "Auditoría lírica previa en todas las obras del repertorio autorizado."
  },
  {
    level: 14,
    code: "L14_PROTOCOLO_OPERATIVO",
    name: "Protocolo Operativo S-Class 0 Fallos",
    category: "OPERATIONS",
    stakeholders: ["venues", "b2g"],
    landingUrl: "/protocolo-operativo",
    interactiveTool: "Simulador de Cronograma de Montaje y Backup",
    narrativeThread: "Llegada 60 minutos antes, traje charro de botonadura de plata y doble línea eléctrica.",
    conversionTrigger: "Puntualidad suiza y ejecución impecable sin improvisaciones técnicas.",
    technicalSpec: "Checklist digital interactivo firmado por el jefe de producción in situ."
  },
  {
    level: 15,
    code: "L15_MATRIZ_GEOGRAFICA",
    name: "Matriz Geográfica & 52 Provincias",
    category: "OPERATIONS",
    stakeholders: ["b2g", "venues"],
    landingUrl: "/bodas/madrid",
    interactiveTool: "Calculadora de Rutas y Desplazamientos desde Hub Méntrida",
    narrativeThread: "Cobertura total en Madrid, Castilla-La Mancha y las 52 provincias españolas.",
    conversionTrigger: "Cálculo transparente de kilometraje a 0,40€/km desde el centro logístico.",
    technicalSpec: "API de rutas y geolocalización Haversine con caché ISR."
  },
  {
    level: 16,
    code: "L16_MODELO_PRICING_LOCK",
    name: "Modelo de Pricing & Smart-Lock SHA-256",
    category: "FINANCE",
    stakeholders: ["venues"],
    landingUrl: "/checkout/presupuesto",
    interactiveTool: "Price-Lock SHA-256 con Bloqueo de Tarifa 72h",
    narrativeThread: "Depósito reembolsable de 100€ que congela el precio y la fecha de tu evento.",
    conversionTrigger: "Reserva inmediata con pasarela Stripe sin riesgo financiero.",
    technicalSpec: "Firma criptográfica HMAC-SHA256 del payload de cotización."
  },
  {
    level: 17,
    code: "L17_CANAL_CONTRATACION",
    name: "Canal de Contratación & Pasarela Stripe",
    category: "FINANCE",
    stakeholders: ["b2g"],
    landingUrl: "/checkout",
    interactiveTool: "Pasarela de Pago Stripe Checkout v14 Multi-Divisa",
    narrativeThread: "Pago con tarjeta, Apple Pay, Google Pay o transferencia oficial para B2G.",
    conversionTrigger: "Emisión automática de factura legal desglosada con IVA.",
    technicalSpec: "Webhooks con verificación de firma rawBody y conciliación contable."
  },
  {
    level: 18,
    code: "L18_SLA_GARANTIA_REVERSIVA",
    name: "SLA & Garantía Reversiva Total",
    category: "FINANCE",
    stakeholders: ["families"],
    landingUrl: "/garantia",
    interactiveTool: "Panel de Activación de Garantía 100% Reembolsable",
    narrativeThread: "Reembolso íntegro en <24h si la llamada técnica inicial no satisface tus expectativas.",
    conversionTrigger: "Cero fricción de compra y confianza absoluta en la contratación.",
    technicalSpec: "Reembolsos automatizados vía Stripe API con 1 clic en el portal cliente."
  },
  {
    level: 19,
    code: "L19_COMPLEMENTO_UPSELL",
    name: "Complementos VIP & Bonos de Fidelización",
    category: "COMMERCE",
    stakeholders: ["venues"],
    landingUrl: "/cotizador",
    interactiveTool: "Inyector de Bono EDWIN150 y Grabación 4K HDR",
    narrativeThread: "150€ de regalo en complementos escénicos al contratar formato completo.",
    conversionTrigger: "Aumento del ticket medio y satisfacción con extras de alto valor percibido.",
    technicalSpec: "Motor de cupones y descuentos automáticos en el resumen de compra."
  },
  {
    level: 20,
    code: "L20_IMPACTO_SOCIAL_VIMUME",
    name: "Impacto Social VIMUME (Split Soberano 80/10/10)",
    category: "CLINICAL",
    stakeholders: ["seniors", "rsc_sponsors"],
    landingUrl: "/vimume",
    interactiveTool: "Simulador de Split Soberano e Impacto en Residencias",
    narrativeThread: "El 10% de cada contratación comercial financia directamente sesiones VIMUME.",
    conversionTrigger: "Sello de Responsabilidad Social que otorga propósito ético a cada fiesta.",
    technicalSpec: "División matemática inmutable de fondos en cada transacción cerrada."
  },
  {
    level: 21,
    code: "L21_ALIANZA_ACADEMICA",
    name: "Alianza Académica & Coordinación Médica",
    category: "CLINICAL",
    stakeholders: ["clinicians", "rsc_sponsors"],
    landingUrl: "/vimume/protocolo",
    interactiveTool: "Repositorio de Estudios Clínicos y Convenios Universitarios",
    narrativeThread: "Convenios con facultades de Musicoterapia, Terapia Ocupacional y Neurología.",
    conversionTrigger: "Aval científico de universidades que respalda la intervención terapéutica.",
    technicalSpec: "Documentación clínica descargable con validación por pares."
  },
  {
    level: 22,
    code: "L22_VALIDACION_METRICA",
    name: "Validación & Métricas de Respuesta Cognitiva",
    category: "CLINICAL",
    stakeholders: ["clinicians", "families"],
    landingUrl: "/vimume/familia",
    interactiveTool: "Dashboard de Evolución Emocional del Paciente",
    narrativeThread: "Métricas de estimulación de la memoria episódica y reducción de la ansiedad.",
    conversionTrigger: "Trazabilidad continua del bienestar para familias y equipos médicos.",
    technicalSpec: "Escalas estandarizadas de observación conductual en demencias (GDS/FAST)."
  },
  {
    level: 23,
    code: "L23_FINANCIACION_PUBLICA",
    name: "Vehículos de Financiación Pública & Subvenciones",
    category: "LEGAL",
    stakeholders: ["b2g", "rsc_sponsors"],
    landingUrl: "/vimume/b2g",
    interactiveTool: "Buscador de Subvenciones IMSERSO y Fondos NextGenEU",
    narrativeThread: "Alineación con el 0,7% IRPF social y premios de innovación social y salud.",
    conversionTrigger: "Acceso a financiación pública para municipios que contraten el programa.",
    technicalSpec: "Modelos de solicitud y memorias de justificación técnica prediseñadas."
  },
  {
    level: 24,
    code: "L24_COMPLIANCE_LEGAL",
    name: "Compliance Jurídico & Art. 118 LCSP",
    category: "LEGAL",
    stakeholders: ["b2g", "artists"],
    landingUrl: "/ocasiones/ayuntamientos",
    interactiveTool: "Generador de Pliegos Menores Art. 118 LCSP (<15.000€)",
    narrativeThread: "Adjudicación directa para ayuntamientos en <24h y seguro RC de 600.000€.",
    conversionTrigger: "Tramitación administrativa ultrarrápida sin riesgo de reparo municipal.",
    technicalSpec: "Plantillas oficiales adaptadas a la Ley de Contratos del Sector Público."
  },
  {
    level: 25,
    code: "L25_INFRAESTRUCTURA_LOCAL",
    name: "Infraestructura Bare-Metal & IA Soberana",
    category: "INFRASTRUCTURE",
    stakeholders: ["artists"],
    landingUrl: "/admin/nexus",
    interactiveTool: "Consola de Telemetría Bare-Metal con AMD RX 7900 XTX 24GB",
    narrativeThread: "Procesado Whisper local y RAG de 30.000 nodos con cero coste SaaS.",
    conversionTrigger: "Máxima velocidad de respuesta y soberanía tecnológica total.",
    technicalSpec: "Hardware dedicado local con aceleración DirectML y TypeScript estricto."
  },
  {
    level: 26,
    code: "L26_TELEMETRIA_FORENSE",
    name: "Telemetría ForeNSE & Criptografía SHA-256",
    category: "INFRASTRUCTURE",
    stakeholders: ["rsc_sponsors", "b2g"],
    landingUrl: "/admin/telemetria",
    interactiveTool: "Visor de TruthNuggets y Bloques Criptográficos de Actuación",
    narrativeThread: "Actas de actuación auditables con sello inmutable de fecha y ejecución.",
    conversionTrigger: "Auditoría transparente para patronatos, banca y tribunales de cuentas.",
    technicalSpec: "Encadenamiento de hashes SHA-256 en logs de telemetría."
  },
  {
    level: 27,
    code: "L27_ECOSISTEMA_B2B_VENUES",
    name: "Ecosistema B2B & Venues Homologadas",
    category: "COMMERCE",
    stakeholders: ["venues"],
    landingUrl: "/proveedores",
    interactiveTool: "Portal de Fincas y Catering con SupplierBlurLock",
    narrativeThread: "Alianzas estratégicas con fincas de bodas y recintos singulares.",
    conversionTrigger: "Venta cruzada de espectáculos y comisiones directas para recintos.",
    technicalSpec: "Protección de datos de proveedores y sincronización de disponibilidad."
  },
  {
    level: 28,
    code: "L28_MOTOR_ANTICIPACION_GEO",
    name: "Motor de Anticipación & SEO/GEO de Precisión",
    category: "INFRASTRUCTURE",
    stakeholders: ["b2g"],
    landingUrl: "/bodas/madrid",
    interactiveTool: "Matriz pSEO 52 Provincias & Archivo Canónico /llms.txt",
    narrativeThread: "Dominio absoluto en Google, SearchGPT y Perplexity para búsquedas de alta intención.",
    conversionTrigger: "Captación orgánica continua con CAC = 0.",
    technicalSpec: "Marcado semántico JSON-LD LocalBusiness con coordenadas geográficas exactas."
  },
  {
    level: 29,
    code: "L29_COMUNIDAD_TRIBU",
    name: "Comunidad de Fans Cualificados & Club VIMUME",
    category: "LEGACY",
    stakeholders: ["seniors", "families"],
    landingUrl: "/comunidad",
    interactiveTool: "Portal de la Tribu de 100 Fans y Talleres de Canto",
    narrativeThread: "Encuentros musicales periódicos y comunidad de apoyo intergeneracional.",
    conversionTrigger: "Fidelización de por vida y recomendaciones boca a boca.",
    technicalSpec: "Sistema de membresía privado y notificaciones directas por WhatsApp."
  },
  {
    level: 30,
    code: "L30_LEGADO_TRANSCENDENTE",
    name: "Arquitectura de Legado Eterno",
    category: "LEGACY",
    stakeholders: ["seniors", "families", "clinicians", "b2g", "rsc_sponsors", "artists", "venues", "affiliates"],
    landingUrl: "/legado",
    interactiveTool: "Manifiesto del Legado Musical Intergeneracional",
    narrativeThread: "La música como puente indestructible entre generaciones: lo último que se olvida.",
    conversionTrigger: "Impacto duradero que trasciende la transacción comercial.",
    technicalSpec: "Archivo histórico sonoro persistente con acceso hereditario familiar."
  }
];

// Helper functions
export const getVimumeStakeholderByRole = (
  role: VimumeStakeholderFlow['role']
): VimumeStakeholderFlow | undefined => {
  return VIMUME_11_STAKEHOLDERS_MATRIX.find(flow => flow.role === role);
};

export const getConnectorByLevel = (level: number): VimumeRelationalConnector | undefined => {
  return VIMUME_30_CONNECTORS_MATRIX.find(conn => conn.level === level);
};

export const getConnectorsByStakeholder = (
  stakeholder: VimumeStakeholderFlow['role']
): VimumeRelationalConnector[] => {
  return VIMUME_30_CONNECTORS_MATRIX.filter(conn => conn.stakeholders.includes(stakeholder));
};

export const getConnectorsByCategory = (
  category: VimumeRelationalConnector['category']
): VimumeRelationalConnector[] => {
  return VIMUME_30_CONNECTORS_MATRIX.filter(conn => conn.category === category);
};

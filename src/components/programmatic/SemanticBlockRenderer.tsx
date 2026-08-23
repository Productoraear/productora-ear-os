'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Zap, Mic2, Volume2, Lock, ArrowRight } from 'lucide-react';
import LaserTunnelFunnel from './LaserTunnelFunnel';
import AnticipationWidget from './AnticipationWidget';

interface SemanticBlockRendererProps {
  vertical: string;
  intent: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RAG Semántico — Mapa de Contenido Dinámico Hiper-Adaptado por INTENT
// Garantiza 100% de coherencia contextual y respuestas inteligentes en cada URL.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface SemanticBlockContent {
  hero: string;
  sub: string;
  gear: string;
  gearDetail: string;
  priceBase: number;
  priceMax: number;
  guaranteeBadge: string;
  painPoints: string[];
  solutions: string[];
  faq: Array<{ q: string; a: string }>;
}

const SPECIFIC_INTENT_MAP: Record<string, SemanticBlockContent> = {
  // ── 1. Bodas / Música en Directo Madrid ──
  'madrid-precios-musica-directo': {
    hero: 'Música en Directo para Bodas en Madrid · Tarifas Oficiales 2026',
    sub: 'Tarifa solista con Edwin Agudelo desde 350€ (45-60 min). Dúos líricos, tríos y Gran Show Mariachi con sonido Bose F1 y microfonía Shure Axient. Desplazamiento incluido en Madrid.',
    gear: 'Line Array Bose F1 Model 812 + Shure Beta 87A + Behringer XR18',
    gearDetail: 'Sonorización 12 W/pax calibrada in-situ para salones y fincas de Madrid sin silencios incómodos.',
    priceBase: 350,
    priceMax: 1800,
    guaranteeBadge: 'Garantía 0 Fallos Madrid',
    painPoints: [
      'Micrófonos que acoplan durante el intercambio de votos y arruinan el momento más emotivo.',
      'Músicos informales que no respetan el timing pactado con el wedding planner.',
      'Presupuestos opacos con sobrecostes ocultos por transporte o montaje en la finca.',
    ],
    solutions: [
      'Microfonía digital Shure Axient con conmutación dinámica RF: cero cortes audibles.',
      'Edwin Agudelo con repertorio a la carta (12-14 temas/hora) y presencia escénica de conservatorio.',
      'Tarifa transparente con desplazamiento bonificado en toda la Comunidad de Madrid.',
    ],
    faq: [
      { q: '¿Cuánto cuesta contratar a Edwin Agudelo o mariachis en Madrid?', a: 'La tarifa base solista (Edwin Agudelo) es de 350€ para 45-60 min. El dúo/trío lírico desde 550€ y el Gran Show completo (6-8 músicos con trajes charros de gala) desde 1.800€. El transporte en Madrid está 100% bonificado.' },
      { q: '¿Se puede personalizar el repertorio de la ceremonia y cóctel?', a: 'Absolutamente. Incluimos una sesión previa para elegir las canciones imprescindibles (rancheras, boleros, temas líricos o baladas pop acústicas) y coordinar los momentos clave con el oficiante.' },
      { q: '¿El equipo de sonido Bose F1 está incluido en el precio?', a: 'Sí. Todo montaje incluye sistema Line Array Bose F1 (hasta 300 invitados), microfonía inalámbrica para discursos de familiares y técnico FOH durante el servicio.' },
    ],
  },

  // ── 2. Coche de Boda con Chófer Madrid ──
  'alquiler-coche-boda-chofer-madrid': {
    hero: 'Alquiler de Coches de Boda con Chófer en Madrid · Calidad S-Class',
    sub: 'Vehículos nupciales de representación (Mercedes Clase S, Maybach y Clase V) con chófer de gala uniformado. Traslado de novios, sesión fotográfica y llegada triunfal a la finca desde 450€.',
    gear: 'Mercedes-Benz Clase S / Mercedes-Maybach / Mercedes Clase V',
    gearDetail: 'Tapicería en cuero nappa, botella de champán frío, agua mineral, toallitas refrescantes y Wi-Fi 5G a bordo.',
    priceBase: 450,
    priceMax: 950,
    guaranteeBadge: 'Protocolo Nupcial S-Class',
    painPoints: [
      'Retrasos del vehículo por conductores que no conocen los accesos a fincas aisladas de Madrid.',
      'Vehículos descuidados, sin climatización óptima o sin espacio para vestidos voluminosos.',
      'Sobrecostes sorpresa por minutos extra durante el reportaje fotográfico.',
    ],
    solutions: [
      'Chóferes profesionales con protocolo de gala, apertura de puertas y ruta previa auditada.',
      'Flota de última generación con espacio XL para vestidos de cola y champán a bordo.',
      'Hasta 4 horas y 100 km incluidos con margen de cortesía sin penalizaciones abusivas.',
    ],
    faq: [
      { q: '¿Qué recorrido incluye el servicio de boda con chófer?', a: 'Recogida de la novia/novio en el domicilio u hotel, traslado a la ceremonia religiosa/civil, espera durante el reportaje fotográfico y traslado final a la finca o salón de banquetes.' },
      { q: '¿El chófer viste de gala y conoce el protocolo de bodas?', a: 'Sí, todos nuestros conductores visten traje oscuro de gala con corbata, abren puertas, sostienen sombrillas si llueve y coordinan los tiempos con el fotógrafo.' },
      { q: '¿Qué ocurre si la ceremonia se alarga más de lo previsto?', a: 'Incluimos 30 minutos de cortesía sin coste extra. Las horas adicionales se contratan a precio cerrado garantizado en contrato.' },
    ],
  },

  // ── 3. Pantallas LED Madrid ──
  'alquiler-pantallas-led-madrid': {
    hero: 'Alquiler de Pantallas LED en Madrid · Gran Formato P2.6 / P3.9',
    sub: 'Muros LED gigantes de interior y exterior con procesadores Novastar 4K, escaladores y técnicos especialistas in-situ. Emisión perfecta sin parpadeos.',
    gear: 'Cabinets LED P2.6 Interior (1.000 nits) / P3.9 Exterior (>4.500 nits IP65)',
    gearDetail: 'Procesadores Novastar VX1000, streaming HDMI/SDI redundante y estructuras truss certificadas con cálculo de carga.',
    priceBase: 450,
    priceMax: 3500,
    guaranteeBadge: 'Emisión 0 Fallos 4K',
    painPoints: [
      'Pantallas de baja luminosidad que resultan invisibles con la luz del día o luz solar directa.',
      'Cortes de señal o problemas de escalado de imagen durante ponencias o vídeos corporativos.',
      'Estructuras inestables que no cumplen la normativa de seguridad de recintos feriales e IFEMA.',
    ],
    solutions: [
      'Cabinets de alto brillo (>4.500 nits) con protección IP65 aptos para pleno sol y lluvia.',
      'Procesadores Novastar VX con escalado automático 4K y entradas redundantes (HDMI, SDI, DP).',
      'Montaje homologado en truss con certificado de solidez y seguro de RC de 600.000 €.',
    ],
    faq: [
      { q: '¿Qué resolución de pantalla LED necesito para mi evento?', a: 'Para interiores y distancias cortas (1.5m a 8m) recomendamos P2.6 para nitidez de texto en presentaciones. Para exteriores y grandes aforos, P3.9 ofrece brillo de >4.500 nits visible bajo sol directo.' },
      { q: '¿El alquiler incluye transporte, montaje y operador de vídeo?', a: 'Sí, entregamos proyecto llave en mano con transporte en Madrid, montaje estructural, calibración de color in-situ y técnico operador durante todo el evento.' },
      { q: '¿Se pueden proyectar múltiples fuentes a la vez (Picture-in-Picture)?', a: 'Sí, nuestros procesadores admiten multipantalla simultánea: ponente en directo por cámara SDI, diapositivas PowerPoint y vídeo corporativo 4K.' },
    ],
  },

  // ── 4. Mercedes Clase V Chófer Madrid ──
  'alquiler-mercedes-clase-v-chofer-madrid': {
    hero: 'Alquiler de Mercedes Clase V con Chófer en Madrid · Quality VIP',
    sub: 'Minivan VIP de 7 plazas para eventos corporativos, congresos IFEMA, traslados de directivos y roadshows. Conductor bilingüe, Wi-Fi 5G y factura con NIF.',
    gear: 'Mercedes-Benz Clase V Extra Larga VIP (7 Plazas)',
    gearDetail: 'Asientos individuales en piel con configuración salón, tomas 230V/USB, cristales tintados y espacio para 8 maletas grandes.',
    priceBase: 250,
    priceMax: 850,
    guaranteeBadge: 'Flota VIP Homologada',
    painPoints: [
      'Taxis insuficientes para grupos directivos que necesitan viajar juntos y trabajar en trayecto.',
      'Pérdida de tiempo en recogidas de aeropuertos por falta de monitorización de vuelos.',
      'Proveedores de transporte sin factura formal desglosada para la contabilidad corporativa.',
    ],
    solutions: [
      'Habitáculo configurado como sala de reuniones rodante con mesas plegables y Wi-Fi 5G.',
      'Monitorización telemática de vuelos en Barajas: el chófer espera en la terminal con tablet con logo.',
      'Facturación electrónica con NIF, desglose de IVA y liquidación inmediata.',
    ],
    faq: [
      { q: '¿Cuántos pasajeros y maletas caben en la Clase V?', a: 'Hasta 7 pasajeros con total amplitud en butacas de cuero independientes y capacidad de carga para 8 maletas de gran tamaño en nuestra versión Extra Larga.' },
      { q: '¿Se puede reservar por horas para ferias en IFEMA o congresos?', a: 'Sí. Ofrecemos traslados punto a punto (desde 120€), disposiciones por horas (mínimo 3h) y jornadas completas de 8 a 12 horas con chófer a disposición.' },
      { q: '¿El conductor habla inglés?', a: 'Disponemos de conductores bilingües (Español / Inglés) con protocolo corporativo para recibir delegaciones internacionales y directivos extranjeros.' },
    ],
  },

  // ── 5. Alumbrado Navideño / Luces LCSP ──
  'alumbrado-navideno-luces-licitacion-lcsp': {
    hero: 'Alumbrado Navideño para Ayuntamientos · Licitaciones y Contratos LCSP',
    sub: 'Instalación integral de arcos de calle LED, motivos en farolas y figuras 3D gigantes transitables. Expediente técnico visado bajo contrato menor (<15.000€) y seguro RC 600.000€.',
    gear: 'Conos Gigantes 3D hasta 10.6m + Arcos LED IP67 + Cuadros Estancos',
    gearDetail: 'Sistemas de bajo consumo energético A++, anclajes certificados contra viento y cuadros de mando con reloj astronómico.',
    priceBase: 2500,
    priceMax: 14500,
    guaranteeBadge: 'LCSP Compliant 100%',
    painPoints: [
      'Pliegos técnicos complejos que retrasan la adjudicación y dejan calles a oscuras en Navidad.',
      'Materiales de baja calidad que sufren cortocircuitos con lluvias intensas.',
      'Empresas que no ofrecen mantenimiento de guardia durante los festivos navideños.',
    ],
    solutions: [
      'Expediente completo listo para contrato menor LCSP (<15.000€) con memoria técnica y factura FACe.',
      'Materiales 100% LED de alta densidad con protección estanca IP67 y cable de goma reforzado.',
      'Servicio técnico de guardia 24/7 para reparación o sustitución en <4 horas ante cualquier avería.',
    ],
    faq: [
      { q: '¿Los proyectos se ajustan al marco de Contrato Menor LCSP (<15.000€)?', a: 'Sí. Diseñamos paquetes cerrados de iluminación para calles principales, plazas y fachadas consistoriales específicamente estructurados para adjudicación directa bajo LCSP.' },
      { q: '¿El servicio incluye montaje, acometida eléctrica y desmontaje tras Reyes?', a: 'Sí, el presupuesto es cerrado y llave en mano: incluye transporte, elevadores de montaje nocturno, cuadros de protección estancos, mantenimiento durante la campaña y desmontaje completo.' },
      { q: '¿Aportan seguro de responsabilidad civil y certificados de seguridad?', a: 'Entregamos póliza de seguro RC de 600.000 €, certificados CE/RoHS de las luminarias y memoria de cálculo de cargas sobre farolas y fachadas.' },
    ],
  },

  // ── 6. Decoración Navideña Centros Comerciales ──
  'decoracion-navidena-centros-comerciales': {
    hero: 'Decoración Navideña e Iluminación 3D para Centros Comerciales',
    sub: 'Proyectos llave en mano de iluminación monumental. Árboles transitables hasta 10.6m, photocalls 3D inmersivos y tecnología Twinkly Pro para generar tráfico masivo de visitantes.',
    gear: 'Árboles Cónicos 3D + Cortinas Micro-LED + Mapping Lumínico',
    gearDetail: 'Programación de espectáculos de luz y sonido sincronizados por DMX y control inteligente por app.',
    priceBase: 3500,
    priceMax: 18000,
    guaranteeBadge: 'Tracción WOW Asegurada',
    painPoints: [
      'Decoraciones obsoletas que no generan interés ni fotos en redes sociales de los compradores.',
      'Montajes ruidosos o peligrosos que interfieren en el horario comercial de las tiendas.',
      'Consumo eléctrico desmedido que penaliza la huella de sostenibilidad del centro.',
    ],
    solutions: [
      'Photocalls y figuras gigantes transitables diseñadas específicamente para viralizar en Instagram/TikTok.',
      'Montajes nocturnos 100% invisibles sin impacto en la actividad comercial del centro.',
      'Tecnología Micro-LED de ultra bajo consumo con ahorro energético certificado superior al 85%.',
    ],
    faq: [
      { q: '¿Cómo ayuda la decoración navideña a incrementar las ventas del centro?', a: 'Nuestros elementos 3D transitables y shows de luces programadas aumentan el tiempo medio de permanencia de las familias hasta un 35%, impulsando el ticket medio en restauración y tiendas.' },
      { q: '¿Cuándo se realiza la instalación para no molestar a los clientes?', a: 'Las cuadrillas especializadas realizan el montaje íntegramente en horario nocturno (de 22:00 a 08:00), dejando el centro limpio y operativo cada mañana.' },
      { q: '¿Se puede alquilar en modalidad renting para una sola temporada?', a: 'Sí, disponemos de modalidad de alquiler de temporada con montaje, mantenimiento y recogida incluidos, evitando inmovilizar capital en compras de stock.' },
    ],
  },

  // ── 7. Mariachi en Barcelona ──
  'mariachi-para-bodas-en-barcelona': {
    hero: 'Mariachi y Tenor para Bodas en Barcelona · Edwin Agudelo',
    sub: 'La elegancia y potencia vocal de Edwin Agudelo para ceremonias religiosas, civiles y cócteles en Barcelona, Sitges y toda Cataluña. Sonido Bose F1 y repertorio a la carta.',
    gear: 'Line Array Bose F1 Model 812 + Shure Axient Digital + XR18',
    gearDetail: 'Sonorización 12 W/pax in-situ con microfonía inalámbrica para ceremonia, cóctel y banquete.',
    priceBase: 350,
    priceMax: 1800,
    guaranteeBadge: 'Garantía 0 Fallos Cataluña',
    painPoints: [
      'Mariachis informales con sonido deficiente o vestuario descuidado en bodas de alta gama.',
      'Sobrecostes desmedidos por desplazamiento desde fuera de Cataluña.',
      'Repertorios rígidos que no se adaptan a los gustos de los novios e invitados.',
    ],
    solutions: [
      'Edwin Agudelo (Tenor S-Class) con formación charra de alta gala y dicción perfecta.',
      'Logística optimizada con infraestructura acústica in-situ para evitar fletes pesados.',
      'Repertorio versátil que combina rancheras clásicas, boleros, temas líricos y baladas románticas.',
    ],
    faq: [
      { q: '¿Cómo se organiza la actuación de Edwin Agudelo en Barcelona y comarcas?', a: 'Coordinamos el viaje y disponemos de soporte técnico de sonido directo in-situ en Cataluña. Esto permite mantener la tarifa base solista desde 350€ y dúos desde 550€ sin sobrecostes desproporcionados.' },
      { q: '¿Qué temas incluye el repertorio de bodas en Barcelona?', a: 'Desde clásicos inmortales como "Si nos dejan", "El Rey", "Cielito Lindo" y "Motivos", hasta arias líricas como "Nessun Dorma", "O Sole Mio" o temas pop a petición.' },
      { q: '¿Incluyen equipo de megafonía para la ceremonia?', a: 'Sí, instalamos microfonía inalámbrica Shure y columna Bose F1 para que los votos matrimoniales y lecturas se escuchen con nitidez cristalina en todo el recinto.' },
    ],
  },

  // ── 8. Serenata Sorpresa Pedida de Mano ──
  'serenata-sorpresa-pedida-mano': {
    hero: 'Serenata Sorpresa para Pedida de Mano · Edwin Agudelo',
    sub: 'El momento del "Sí, quiero" orquestado con máxima emoción. Llegada secreta sincronizada por GPS, repertorio romántico y sonido HiFi a batería desde 350€.',
    gear: 'Columna PA Autónoma a Batería + Microfonía Shure Beta 87A',
    gearDetail: 'Equipo 100% inalámbrico autónomo sin necesidad de enchufes para playas, miradores, azoteas o jardines privados.',
    priceBase: 350,
    priceMax: 750,
    guaranteeBadge: 'Sorpresa 100% Garantizada',
    painPoints: [
      'Que la pareja descubra al músico antes de tiempo y se rompa el factor sorpresa.',
      'Lugares románticos al aire libre (miradores, parques) sin tomas de corriente eléctrica.',
      'Músicos que no se coordinan con la persona encargada de grabar o fotografiar la pedida.',
    ],
    solutions: [
      'Protocolo invisible: el artista espera oculto en un radio de 50 metros y aparece en el segundo exacto.',
      'Equipo autónomo a batería de alta definición: cero cables ni generadores ruidosos.',
      'Contacto directo por WhatsApp en tiempo real para sincronizar la señal de entrega del anillo.',
    ],
    faq: [
      { q: '¿Cómo se ejecuta el operativo secreto de la sorpresa?', a: 'Mantenemos contacto en tiempo real por WhatsApp o ubicación compartida. Cuando te arrodillas o sacas el anillo, das la señal convenida y Edwin Agudelo entra cantando la canción elegida.' },
      { q: '¿Se puede hacer en un mirador o restaurante sin enchufe cercano?', a: 'Sí. Contamos con columnas de sonido profesionales a batería de litio que entregan audio HiFi de 120W durante 4 horas en cualquier entorno natural o azotea.' },
      { q: '¿Qué canciones son las más recomendadas para pedir matrimonio?', a: 'Las más demandadas son "Si nos dejan", "Gema", "Contigo aprendí", "Hermoso Cariño" o la canción especial que defina vuestra historia de amor.' },
    ],
  },

  // ── 9. Fincas Toledo / Fincas Singulares ──
  'fincas-toledo-sonorizacion-gala': {
    hero: 'Sonorización de Gala y Música en Fincas de Toledo · Cobertura 12 W/pax',
    sub: 'Diseño acústico para espacios abiertos, salones rústicos de piedra y jardines en fincas de Toledo. Cero eco, cero distorsión y música en directo S-Class.',
    gear: 'Line Array Bose F1 Model 812 + Subwoofers F1 + Shure Axient Digital',
    gearDetail: 'Líneas de retardo acústico y estabilizadores de corriente para fincas con limitadores o acometidas monofásicas.',
    priceBase: 350,
    priceMax: 2200,
    guaranteeBadge: 'Garantía Acústica Fincas',
    painPoints: [
      'Salones de piedra con reverberación excesiva que vuelven la música ininteligible y ruidosa.',
      'Viento en jardines abiertos que dispersa el sonido de la ceremonia y los votos de los novios.',
      'Cortes de luz por sobrecarga en fincas con potencia eléctrica limitada.',
    ],
    solutions: [
      'Matrices Bose F1 de dispersión vertical controlada que enfocan la presión sonora a la altura del oído.',
      'Microfonía Shure Axient con filtros antiviento profesionales para ceremonias exteriores.',
      'Sistemas de amplificación digital de alta eficiencia Clase D con mínimo consumo eléctrico.',
    ],
    faq: [
      { q: '¿Cómo resuelven el problema del eco en salones rústicos o bodegas?', a: 'Utilizamos procesadores DSP que calibran la curva de frecuencias in-situ, recortando las reflexiones de medias-altas y enfocando el haz sonoro directamente sobre los comensales.' },
      { q: '¿Tienen experiencia en fincas de Toledo (Quinta Malpica, Finca Los Afligidos, etc.)?', a: 'Sí. Conocemos la distribución, orientación solar y acometidas de las principales fincas toledanas y de la comarca, asegurando tiempos de montaje récord.' },
      { q: '¿El desplazamiento a fincas de Toledo tiene sobrecoste?', a: 'Las fincas situadas dentro del radio de 50km desde la base tienen el desplazamiento 100% bonificado. Para distancias mayores, el recargo es de solo 0.35€/km.' },
    ],
  },

  // ── 10. Sonorización Mallorca ──
  'alquiler-equipo-sonido-mallorca': {
    hero: 'Alquiler de Equipos de Sonido en Mallorca · Bodas y Eventos S-Class',
    sub: 'Sonorización concert-grade para villas privadas, hoteles boutique y fincas rústicas en Mallorca. Line Arrays Bose F1, microfonía Shure y técnico residente.',
    gear: 'Bose F1 Model 812 + Subgraves + Microfonía Shure + Mixer Digital',
    gearDetail: 'Logística insular con embalaje de vuelo homologado y redundancia de equipos in-situ en Baleares.',
    priceBase: 450,
    priceMax: 2400,
    guaranteeBadge: 'Garantía Baleares 0 Fallos',
    painPoints: [
      'Dificultad para encontrar proveedores locales con riders técnicos de alta gama.',
      'Altos costes de transporte marítimo o cancelaciones por mala logística en islas.',
      'Limitaciones de volumen por normativas acústicas estrictas en municipios costeros.',
    ],
    solutions: [
      'Infraestructura técnica homologada con base operativa directa en Palma y alrededores.',
      'Garantía de disponibilidad con backup de reemplazo inmediato en <60 minutos.',
      'Medición SPL y ajuste de directividad para cumplir las ordenanzas sin perder contundencia.',
    ],
    faq: [
      { q: '¿Ofrecen servicio en cualquier punto de Mallorca (Calvià, Pollença, Sóller, Santanyí)?', a: 'Sí, cubrimos toda la isla de Mallorca, tanto en villas de difícil acceso como en hoteles de lujo y fincas rurales.' },
      { q: '¿El montaje incluye técnico de sonido durante la fiesta o boda?', a: 'Todos nuestros paquetes para Mallorca incluyen transporte, montaje temprano, prueba de sonido y presencia de técnico operador durante todo el evento.' },
    ],
  },

  // ── 11. Sonorización Galicia ──
  'equipos-de-sonido-para-eventos-galicia': {
    hero: 'Equipos de Sonido para Eventos en Galicia · Protección Climática y 12 W/pax',
    sub: 'Sonorización profesional para pazos, bodas y eventos en Pontevedra, A Coruña, Ourense y Lugo. Resistencia a la humedad e inteligibilidad total.',
    gear: 'Sistemas PA con Protección IP + Shure Axient + Consola Digital',
    gearDetail: 'Conexionado estanco y carpas técnicas para control FOH en jardines de pazos gallegos.',
    priceBase: 450,
    priceMax: 2500,
    guaranteeBadge: 'Garantía Outdoor Galicia',
    painPoints: [
      'Humedad o lluvia repentina que puede dañar equipos electrónicos y cortar la música.',
      'Pazos con jardines muy extensos donde el sonido no llega a las zonas de cóctel.',
    ],
    solutions: [
      'Equipos con sellado IP para intemperie y líneas de audio balanceadas de alta inmunidad.',
      'Distribución multizona inalámbrica para cubrir cóctel, ceremonia y banquete simultáneamente.',
    ],
    faq: [
      { q: '¿Qué pasa si llueve durante la celebración en el jardín del pazo?', a: 'Nuestros equipos para exteriores cuentan con fundas acústicas impermeables y cuadros estancos, permitiendo trasladar el sonido al porche o interior en <15 minutos.' },
      { q: '¿Cubren las cuatro provincias gallegas?', a: 'Sí, prestamos servicio en Pontevedra (Rías Baixas), A Coruña, Ourense y Lugo con logística adaptada.' },
    ],
  },

  // ── 12. VIMUME Musicoterapia ──
  'musicoterapia-centros-mayores-madrid': {
    hero: 'Musicoterapia para Centros de Mayores · Programa VIMUME Madrid',
    sub: 'Estimulación neurocognitiva y evocación de memoria autobiográfica a través de música en directo. Control riguroso de presión acústica (<75 dB) validado en 5 centros.',
    gear: 'Monitores de Campo Cercano HiFi Flat-Response (<75 dB)',
    gearDetail: 'Frecuencias armónicas controladas aptas para audífonos y prótesis auditivas sin saturación neurosensorial.',
    priceBase: 290,
    priceMax: 990,
    guaranteeBadge: 'Validado en 5 Centros',
    painPoints: [
      'Apatía, aislamiento y desconexión afectiva en personas con deterioro neurodegenerativo.',
      'Actividades recreativas genéricas sin base científica ni medición de respuesta clínica.',
    ],
    solutions: [
      'Cancionero biográfico personalizado en directo que activa conexiones neuronales del hipocampo.',
      'Telemetría de respuesta emocional con informe de evolución para el equipo médico del centro.',
    ],
    faq: [
      { q: '¿Por qué la música es tan eficaz en personas con Alzheimer?', a: 'La memoria musical se almacena en áreas cerebrales profundas que se conservan hasta estadios muy avanzados de la enfermedad. Escuchar temas de su juventud reduce la agitación y reactiva la comunicación verbal.' },
      { q: '¿Las sesiones son seguras para residentes con audífonos?', a: 'Totalmente. El protocolo VIMUME opera con monitores de respuesta plana calibrados a menos de 75 dB, evitando distorsiones que puedan molestar a prótesis auditivas.' },
      { q: '¿Se puede contratar una sesión piloto de prueba?', a: 'Sí. Disponemos de sesión diagnóstica inicial desde 290€ para que la dirección y terapeutas ocupacionales evalúen el impacto en los residentes.' },
    ],
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERADOR DINÁMICO HEURÍSTICO (FALLBACK INTELIGENTE)
// Adapta cualquier INTENT no explícito calculando semántica, ciudad y equipo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function resolveSemanticContent(vertical: string, intent: string): SemanticBlockContent {
  // 1. Coincidencia exacta de intent
  if (SPECIFIC_INTENT_MAP[intent]) {
    return SPECIFIC_INTENT_MAP[intent];
  }

  // 2. Extracción de ciudad/provincia y tema desde el slug
  const cleanSlug = intent.toLowerCase().replace(/-/g, ' ');
  const parts = cleanSlug.split(' ');
  const formattedIntent = intent.replace(/-/g, ' ');

  let extractedCity = 'Madrid';
  const cities = ['madrid', 'toledo', 'barcelona', 'valencia', 'sevilla', 'malaga', 'mallorca', 'galicia', 'pontevedra', 'cadiz', 'zaragoza', 'alicante'];
  for (const c of cities) {
    if (cleanSlug.includes(c)) {
      extractedCity = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Vertical: Bodas
  if (vertical === 'bodas') {
    return {
      hero: `Música en Directo y Sonorización S-Class · ${extractedCity}`,
      sub: `Producción acústica milimétrica para bodas y celebraciones en ${extractedCity}. Protocolo 12 W/pax, artistas de conservatorio y garantía Cero Fallos desde 350€.`,
      gear: 'Line Array Bose F1 Model 812 + Microfonía Shure Axient',
      gearDetail: `Calibración SPL in-situ para espacios de ${extractedCity} con técnico FOH dedicado.`,
      priceBase: 350,
      priceMax: 1800,
      guaranteeBadge: `Garantía 0 Fallos ${extractedCity}`,
      painPoints: [
        'Micrófonos que acoplan durante la ceremonia arruinando el recuerdo de los votos.',
        'Músicos informales que no coordinan la llegada con el wedding planner.',
        'Presupuestos opacos con recargos imprevistos de transporte.',
      ],
      solutions: [
        'Microfonía Shure con conmutación digital y protocolo de redundancia N+1.',
        'Edwin Agudelo y ensambles de conservatorio con repertorio a la carta.',
        `Tarifa cerrada y transparente con cálculo kilométrico auditado para ${extractedCity}.`,
      ],
      faq: [
        { q: `¿Cuánto cuesta contratar música en directo para bodas en ${extractedCity}?`, a: `La tarifa solista (Edwin Agudelo) es de 350€ para 45-60 min. El dúo/trío desde 550€ y el Gran Show mariachi completo (6-8 músicos) desde 1.800€.` },
        { q: `¿Cómo funciona la sonorización en recintos de ${extractedCity}?`, a: `Desplegamos sistemas Line Array Bose F1 con presión de 12 W/pax, garantizando inteligibilidad vocal y cobertura uniforme sin ecos.` },
        { q: '¿Se puede personalizar el repertorio?', a: 'Sí. Diseñamos el setlist a medida con vuestras canciones imprescindibles para la entrada, votos, cóctel y banquete.' },
      ],
    };
  }

  // Vertical: Corporativo
  if (vertical === 'corporativo') {
    return {
      hero: `Producción Audiovisual y Sonido Corporativo en ${extractedCity}`,
      sub: `Nitidez vocal absoluta, pantallas LED y ambientación musical para presentaciones, juntas directivas y galas en ${extractedCity}. Factura NIF inmediata y SLA S-Class.`,
      gear: 'Consola Digital Behringer XR18 + Shure Axient Dual Channel',
      gearDetail: `Línea de retardo acústico, conmutación backup <50ms y soporte técnico in-situ en ${extractedCity}.`,
      priceBase: 500,
      priceMax: 4500,
      guaranteeBadge: 'SLA Corporativo S-Class',
      painPoints: [
        'Un fallo de sonido en el atril durante la presentación ante directivos o inversores.',
        'Problemas de sincronización entre vídeo, iluminación y la música de apertura.',
        'Proveedores sin capacidad de facturación electrónica o seguros de RC exigidos por el recinto.',
      ],
      solutions: [
        'Redundancia de señal dual con conmutación automática en <50ms.',
        'Sincronización Timecode de audio, visuales LED e iluminación robótica.',
        'Factura electrónica inmediata con NIF, desglose de IVA y seguro RC de 600.000 €.',
      ],
      faq: [
        { q: `¿Emiten factura oficial para empresas en ${extractedCity}?`, a: 'Sí. Emitimos factura electrónica con NIF, desglose de IVA y certificado de prestación de servicios en menos de 24h.' },
        { q: '¿Qué garantía técnica ofrecen durante el evento corporativo?', a: 'Nuestro SLA S-Class incluye técnico FOH presencial y equipos de respaldo (backup N+1) conectados permanentemente.' },
      ],
    };
  }

  // Vertical: Fincas
  if (vertical === 'fincas') {
    return {
      hero: `Acústica y Música en Directo para Fincas en ${extractedCity}`,
      sub: `Estudios de cobertura sonora 12 W/pax para espacios singulares, jardines y bodegas en ${extractedCity}. Solista desde 350€ con sistemas Bose F1.`,
      gear: 'Line Array Bose F1 + Subwoofers + Shure Beta 87A',
      gearDetail: 'Control acústico direccional que anula el viento y evita sanciones por decibelios.',
      priceBase: 350,
      priceMax: 2200,
      guaranteeBadge: 'Garantía Acústica Fincas',
      painPoints: [
        'Viento en zonas abiertas que dispersa la voz durante ceremonias y discursos.',
        'Salones rústicos con eco excesivo que vuelven la música molesta.',
      ],
      solutions: [
        'Line Arrays con curvatura flexible que enfocan la presión sonora en la zona de audiencia.',
        'Procesadores DSP calibrados in-situ para neutralizar resonancias de piedra o cristal.',
      ],
      faq: [
        { q: `¿Cómo sonorizan fincas al aire libre en ${extractedCity}?`, a: 'Realizamos un estudio de cobertura y desplegamos matrices Bose F1 de dispersión controlada a 12 W/pax.' },
        { q: '¿El montaje incluye equipo para ceremonia y banquete?', a: 'Sí. Diseñamos montajes multizona independientes para ceremonia, cóctel y banquete sin tiempos muertos de traslado.' },
      ],
    };
  }

  // Fallback Universal
  return {
    hero: `Servicio Oficial S-Class · ${formattedIntent}`,
    sub: `Producción técnica homologada y artistas de élite para ${formattedIntent} en ${extractedCity}. Garantía de solvencia y cero fallos desde 350€.`,
    gear: 'Equipamiento Oficial Homologado Productora EAR',
    gearDetail: 'Montaje profesional, seguro de RC de 600.000€ y cobertura técnica completa.',
    priceBase: 350,
    priceMax: 1800,
    guaranteeBadge: 'Estándar Oficial EAR OS',
    painPoints: [
      'Contratación de proveedores sin referencias ni equipamiento técnico homologado.',
      'Falta de compromiso con los horarios pactados.',
    ],
    solutions: [
      'Garantía contractual de Productora EAR con NIF: B87910311 y seguro de cobertura.',
      'Artistas y técnicos con acreditación oficial y riders de primera línea.',
    ],
    faq: [
      { q: `¿Cómo se formaliza la reserva para ${formattedIntent}?`, a: 'Puedes bloquear la fecha de inmediato con el Price-Lock de 10€ (72 horas) o realizar la reserva formal del 30% vía pasarela segura Stripe.' },
      { q: '¿Qué garantías legales se incluyen?', a: 'Todo servicio cuenta con contrato mercantil, factura electrónica oficial, seguro RC de 600.000€ y soporte 24/7.' },
    ],
  };
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function SemanticBlockRenderer({ vertical, intent }: SemanticBlockRendererProps) {
  // Resolver dinámico por INTENT específico + Vertical
  const data = React.useMemo(() => resolveSemanticContent(vertical, intent), [vertical, intent]);
  const formattedIntent = intent.replace(/-/g, ' ');

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#ecb613]/30">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: ['-20%', '25%', '-15%', '-20%'], y: ['-10%', '35%', '5%', '-10%'], scale: [1, 1.2, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/15 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{ x: ['10%', '-15%', '20%', '10%'], y: ['20%', '-15%', '25%', '20%'], scale: [1.1, 0.85, 1.15, 1.1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#ecb613]/8 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ x: ['-5%', '10%', '-15%', '-5%'], y: ['10%', '-20%', '15%', '10%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-blue-900/12 blur-[120px] rounded-full"
        />
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: `radial-gradient(#ecb613 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">

        {/* ━━━ Block 1: Hero Intent Block ━━━ */}
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>Respuesta Adaptada: {formattedIntent}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-400 font-syne leading-tight">
            {data.hero}
          </h1>
          <p className="text-sm sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            {data.sub}
          </p>
        </motion.div>

        {/* ━━━ Block 2: TÚNEL LÁSER DE RESERVA INLINE (ANTI-DISTRACTION FUNNEL) ━━━ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <LaserTunnelFunnel
            vertical={vertical}
            intentSlug={intent}
            basePrice={data.priceBase}
          />
        </motion.div>

        {/* ━━━ Block 3: Pain Points & Solutions (Diagnostic View) ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {/* Pain Points */}
          <div className="bg-rose-950/15 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-rose-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Fricciones que Eliminamos de Raíz
            </h3>
            <ul className="space-y-3">
              {data.painPoints.map((pain, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  <span className="text-rose-400 font-mono font-bold mt-0.5">0{i + 1}</span>
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="bg-emerald-950/15 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-emerald-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Garantía S-Class & {data.guaranteeBadge}
            </h3>
            <ul className="space-y-3">
              {data.solutions.map((sol, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ━━━ Block 4: Rider Técnico y Equipamiento Oficial ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto bg-[#0a0a0d] border border-white/10 rounded-3xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mic2 className="w-5 h-5 text-[#ecb613]" />
            <h3 className="text-lg sm:text-xl font-bold font-syne text-white">Infraestructura y Equipamiento Homologado</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-300 font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-500 block text-xs">Configuración Principal:</span>
              <strong className="text-white">{data.gear}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-500 block text-xs">Detalle Operativo:</span>
              <strong className="text-white">{data.gearDetail}</strong>
            </div>
          </div>
        </motion.div>

        {/* ━━━ Block 5: Preguntas Frecuentes Directas ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">Respuestas Claras &amp; Precios</span>
            <h3 className="text-xl font-bold font-syne text-white mt-1">Preguntas Frecuentes</h3>
          </div>

          <div className="space-y-3">
            {data.faq.map((item, i) => (
              <details
                key={i}
                open={i === 0}
                className="group bg-[#09090d]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
              >
                <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between text-white font-medium text-xs sm:text-sm">
                  <span>{item.q}</span>
                  <span className="text-neutral-500 group-open:rotate-45 transition-transform text-base">+</span>
                </summary>
                <div className="px-5 pb-4 text-xs text-neutral-300 leading-relaxed border-t border-white/5 pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Anticipation Widget Adaptativo por Intent */}
      <AnticipationWidget vertical={vertical} intent={intent} />
    </div>
  );
}

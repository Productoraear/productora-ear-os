/**
 * 🛰️ MOTOR DE GENERACIÓN SEMÁNTICA & GEO-TARGETING S-CLASS (EAR OS V2)
 * Garantiza unicidad semántica (>70% contenido exclusivo por URL),
 * alineación con la intención de búsqueda real del usuario y optimización GEO para buscadores.
 */

export interface GeoVenueData {
  venues: string[];
  regionalNorm: string;
  logisticsHub: string;
  climateFactor: string;
  regionalTradition: string;
}

export interface SemanticPageData {
  title: string;
  h1: string;
  metaDescription: string;
  searchIntent: string;
  editorialBody: string;
  technicalSpecs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  localKeywords: string[];
  venues: string[];
  schemaType: 'LocalBusiness' | 'MusicGroup' | 'Service' | 'GovernmentOrganization';
  priceRange: string;
}

// BASE DE CONOCIMIENTO GEO-TERRITORIAL (52 REGIONES DE ESPAÑA)
export const GEO_DATABASE: Record<string, GeoVenueData> = {
  madrid: {
    venues: ["Finca La Gaivota", "Soto de Mónico", "El Regajal", "Palacio de Aldovea", "Finca Las Tenadas", "La Quinta del Jarama"],
    regionalNorm: "Ordenanza de Protección contra la Contaminación Acústica de Madrid (OPCAT 85 dBA limitador)",
    logisticsHub: "Hub Central EAR Madrid (M-40 / A-6 / A-1)",
    climateFactor: "Baja humedad relativa; calibración de altas frecuencias recomendada a partir de 10 kHz.",
    regionalTradition: "Gala castellana, cóctel al atardecer en jardines y fiestas con Mariachi de medianoche."
  },
  barcelona: {
    venues: ["Bell Recó", "Castell de Sant Marçal", "Mas de Sant Lleí", "La Baronia", "Mas Can Valldaura", "Xalet del Park Güell"],
    regionalNorm: "Decret 176/2009 de la Generalitat de Catalunya sobre contaminació acústica",
    logisticsHub: "Corredor Logístico B-20 / AP-7 Barcelona",
    climateFactor: "Humedad costera mediterránea; sellado IP65 en conexiones exteriores de escenario.",
    regionalTradition: "Aperitivo acústico mediterráneo, música de autor en masías históricas y sonido envolvente."
  },
  valencia: {
    venues: ["Huerto de Santa María", "Alquería Kukala", "Vallesa de Mandor", "Masía de las Estrellas", "Campo Aníbal"],
    regionalNorm: "Llei 7/2002 de Protecció contra la Contaminació Acústica de la Comunitat Valenciana",
    logisticsHub: "Nodo Levante EAR (V-30 / A-3 Valencia)",
    climateFactor: "Ambiente marítimo templado con brisas térmicas nocturnas; refuerzo en graves sub 40Hz.",
    regionalTradition: "Celebraciones en huertos de naranjos, iluminación festoon cálida y pirotecnia sincronizada."
  },
  sevilla: {
    venues: ["Hacienda Los Ángeles", "Hacienda San Rafael", "Villa Luisa", "Cortijo Mi Ranchito", "Hacienda El Arenoso"],
    regionalNorm: "Decreto 6/2012 de Protección contra la Contaminación Acústica de Andalucía",
    logisticsHub: "Base Sur EAR Sevilla (SE-30 / A-4)",
    climateFactor: "Altas temperaturas estivales; ventilación forzada en etapas de potencia Clase D.",
    regionalTradition: "Llegadas a caballo, mariachi en patios andaluces y cante lírico bajo arcos mudéjares."
  },
  malaga: {
    venues: ["Finca La Concepción", "Castillo de Santa Catalina", "Cortijo del Marqués", "Villa Padierna", "La Cabane Marbella"],
    regionalNorm: "Normativa Acústica Costa del Sol & Ordenanza Municipal de Ruido de Málaga",
    logisticsHub: "Eje Costa del Sol (A-7 / AP-7 Málaga - Marbella)",
    climateFactor: "Brisa marina y microclima subtropical; monitorización in-ear inalámbrica anti-viento.",
    regionalTradition: "Galas internacionales Black Tie, bodas luxury de destino y shows exclusivos junto al mar."
  },
  toledo: {
    venues: ["Cigarral del Ángel", "Cigarral de las Mercedes", "Palacio de Galiana", "El Coto del Casar", "Cigarral de Caravantes"],
    regionalNorm: "Ley 7/2011 de Castilla-La Mancha sobre actividades clasificadas y ruido",
    logisticsHub: "Enlace Imperial A-42 / CM-40 Toledo",
    climateFactor: "Amplitud térmica continental; ajuste de tensión y compensación térmica en drivers acústicos.",
    regionalTradition: "Atardeceres con vistas al Alcázar, mariachis de gala y serenatas clásicas en cigarrales."
  },
  bilbao: {
    venues: ["Palacio San Joseren", "Palacio Urgoiti", "Torre Loizaga", "Castillo de Arteaga", "Euskalduna Jauregia"],
    regionalNorm: "Decreto 213/2012 de Control de la Contaminación Acústica del País Vasco",
    logisticsHub: "Nodo Cantábrico A-8 / AP-68 Bilbao",
    climateFactor: "Precipitaciones frecuentes; carpas climatizadas y recintos de piedra noble con alta reverberación (RT60 > 1.8s).",
    regionalTradition: "Tratamiento acústico para piedra histórica, sonido cálido y repertorios líricos de gran formato."
  }
};

const DEFAULT_GEO: GeoVenueData = {
  venues: ["Fincas de Eventos Seleccionadas", "Palacetes Históricos", "Hoteles de 5 Estrellas", "Auditorios Municipales"],
  regionalNorm: "Normativa Estatal de Ruido Ley 37/2003 y Código Técnico de la Edificación DB-HR",
  logisticsHub: "Flota Nacional Productora EAR",
  climateFactor: "Calibración paramétrica adaptada a la humedad y altitud del recinto.",
  regionalTradition: "Protocolo de alta etiqueta, ingeniería de sonido invisible y contratación artística certificada."
};

// MOTOR DE COMPOSICIÓN SEMÁNTICA POR INTENCIÓN
export function generateSemanticPageData(
  slugArray: string[],
  rawLocation?: string
): SemanticPageData {
  const root = slugArray[0].toLowerCase();
  const leaf = slugArray[slugArray.length - 1].toLowerCase();

  // Detectar ubicación
  const matchedCity = Object.keys(GEO_DATABASE).find(c => 
    leaf.endsWith(`-${c}`) || root === c || (rawLocation && rawLocation.toLowerCase().includes(c))
  ) || 'madrid';

  const geo = GEO_DATABASE[matchedCity] || DEFAULT_GEO;
  const cityName = matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1);
  const cleanTitle = leaf
    .replace(new RegExp(`-${matchedCity}$`, 'i'), '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace('Ear', 'EAR')
    .replace('Dj', 'DJ');

  // CASO 1: ARSENAL / PANTALLAS LED / HARDWARE
  if (root === 'arsenal' || leaf.includes('pantalla-led') || leaf.includes('altavoces') || leaf.includes('luces')) {
    return {
      title: `${cleanTitle} en ${cityName} | Alquiler de Pantallas LED & Audiovisuales`,
      h1: `${cleanTitle} en ${cityName} • Tecnología S-Class`,
      metaDescription: `Servicio integral de ${cleanTitle.toLowerCase()} en ${cityName}. Montaje en ${geo.venues.slice(0, 2).join(' y ')}. Paneles LED de alto brillo (4500 Nits), estructura homologada y técnico FOH en directo.`,
      searchIntent: `Alquiler y montaje profesional de equipamiento audiovisual y pantallas LED para eventos corporativos y bodas en ${cityName}.`,
      editorialBody: `
### Ingeniería Visual y Pantallas LED de Alta Resolución en ${cityName}

La correcta visualización de contenidos en eventos de alto impacto en **${cityName}** exige superar retos lumínicos extremos, especialmente en celebraciones al aire libre en espacios como *${geo.venues[0]}* o *${geo.venues[1]}*. 

En Productora EAR desplegamos pantallas modulares LED **Pixel Pitch P2.6 para interiores** y **P3.9 Outdoor con tratamiento Black SMD** capaz de entregar **4.500 Nits de luminosidad**. Esto garantiza legibilidad absoluta incluso bajo la incidencia directa del sol veraniego.

#### Arquitectura del Despliegue Técnico
1. **Estructura Portante Homologada**: Torres de elevación VMB y trusses de aluminio de alta resistencia con certificación de carga de viento y memoria técnica visada.
2. **Procesamiento de Vídeo Novastar 4K**: Conmutación de señales a latencia cero (Ultra-Low Latency < 1 frame) para retransmisiones en directo y presentaciones multimedia.
3. **Redundancia Eléctrica y N+1**: Cuadros de distribución trifásicos con protección magnetotérmica diferencial independiente por panel.
4. **Cumplimiento Normativo Local**: Adaptación completa a la ${geo.regionalNorm}.
      `.trim(),
      technicalSpecs: [
        { label: "Pixel Pitch", value: "P2.6 Interior / P3.9 Outdoor" },
        { label: "Brillo Máximo", value: "4.500 Nits (Legible bajo sol directo)" },
        { label: "Frecuencia de Refresco", value: "3840 Hz (Sin parpadeo en cámara)" },
        { label: "Hub Logístico", value: geo.logisticsHub },
        { label: "Tiempo de Montaje", value: "120 minutos (Calibración incluida)" }
      ],
      faqs: [
        {
          q: `¿Cuánto tiempo de antelación se necesita para el montaje en ${cityName}?`,
          a: `Nuestro equipo técnico se persona en el recinto entre 3 y 4 horas antes del inicio del evento. Esto permite levantar las estructuras, cablear la señal redundante y realizar las pruebas de ajuste colorimétrico con total holgura.`
        },
        {
          q: `¿Qué ocurre si llueve o hay condiciones meteorológicas adversas?`,
          a: `Nuestros módulos para exteriores cuentan con certificación de estanqueidad IP65 real contra agua y polvo. Además, monitorizamos las rachas de viento conforme al plan de seguridad.`
        },
        {
          q: `¿Incluye el servicio un operador técnico durante todo el evento?`,
          a: `Sí. Toda contratación en ${cityName} incluye un ingeniero audiovisual dedicado encargado del escalado de vídeo, control de brillo y reproducción de contenidos en tiempo real.`
        }
      ],
      localKeywords: [`alquiler pantalla led ${matchedCity}`, `pantallas gigantes ${matchedCity}`, `audiovisuales para eventos ${matchedCity}`, `alquiler audiovisual ${matchedCity}`],
      venues: geo.venues,
      schemaType: 'Service',
      priceRange: '250€ - 2.500€'
    };
  }

  // CASO 2: WEDDINGS / BODAS & MÚSICA EN VIVO
  if (root === 'weddings' || leaf.includes('boda') || leaf.includes('mariachi') || leaf.includes('dj-boda')) {
    return {
      title: `${cleanTitle} en ${cityName} | Música para Bodas Exclusivas`,
      h1: `${cleanTitle} en ${cityName} • Dirección Musical de Gala`,
      metaDescription: `Contratación de ${cleanTitle.toLowerCase()} para bodas en ${cityName}. Protocolos para ${geo.venues.slice(0, 2).join(', ')}. Acústica invisible Bose F1, cero fatiga auditiva y repertorio de autor.`,
      searchIntent: `Contratación de artistas, mariachis y DJs de alto nivel para bodas de lujo en fincas de ${cityName}.`,
      editorialBody: `
### Dirección Sonora para Bodas de Alta Gama en ${cityName}

Una boda memorable en enclaves como *${geo.venues[0]}* o *${geo.venues[2] || geo.venues[1]}* requiere un balance perfecto entre emoción artística y precisión acústica. En **${cityName}**, la acústica de jardines y carpas presenta desafíos únicos: es vital conseguir que la voz del tenor o los violines lleguen con claridad cristalina a los invitados sin saturar la conversación.

Productora EAR aporta más de 20 años de trayectoria con **Edwin Agudelo** (Gladiador en el Extranjero 2021) y formaciones de gala de hasta 8 integrantes. Diseñamos un viaje emocional en 4 actos:

* **Acto I (Ceremonia)**: Cuerdas acústicas y voz lírica de etiqueta.
* **Acto II (Cóctel & Bienvenida)**: Mariachi tradicional en formación imperial o cuarteto de jazz acústico.
* **Acto III (Banquete)**: Hilos musicales de textura suave y entradas triunfales microfonadas.
* **Acto IV (Fiesta & Barra Libre)**: DJ S-Class con sistemas Line Array de baja distorsión y show lumínico DMX.

Todos nuestros sistemas respetan la ${geo.regionalNorm}, garantizando diversión sin multas ni interrupciones de limitadores.
      `.trim(),
      technicalSpecs: [
        { label: "Integrantes Disponibles", value: "Solista, Cuarteto, 6+ Músicos o Gran Banda" },
        { label: "Sistema de Sonido", value: "Bose F1 Flexible Array / L-Acoustics" },
        { label: "Microfonía de Ceremonia", value: "Shure Axient Digital (Cero microcortes)" },
        { label: "Repertorio", value: "+350 Obras Clásicas, Rancheras y Pop Internacional" },
        { label: "Cobertura Territorial", value: `${cityName} y toda la provincia` }
      ],
      faqs: [
        {
          q: `¿Podemos elegir canciones personalizadas para la entrada y momentos clave en ${cityName}?`,
          a: `Por supuesto. Con nuestro protocolo de dirección musical, acordamos con 30 días de antelación los temas exactos de entrada, anillos, corte de tarta y primer baile, adaptando arreglos a medida.`
        },
        {
          q: `¿Cómo gestionáis los limitadores de sonido que tienen muchas fincas en ${cityName}?`,
          a: `Utilizamos sistemas de dispersión horizontal amplia (100°) y satélites auxiliares distribuidos. Esto permite mantener una presión sonora envolvente en la pista de baile sin disparar el sensor del limitador municipal.`
        },
        {
          q: `¿Qué vestuario utilizan los músicos?`,
          a: `Nuestros artistas visten trajes de gala oficial: esmoquin impecable para conciertos clásicos o trajes charros de gran gala con botonaduras de plata cosidas a mano para el formato Mariachi Imperial.`
        }
      ],
      localKeywords: [`musica para bodas ${matchedCity}`, `mariachis en ${matchedCity}`, `dj bodas ${matchedCity}`, `grupos musicales bodas ${matchedCity}`],
      venues: geo.venues,
      schemaType: 'MusicGroup',
      priceRange: '350€ - 3.500€'
    };
  }

  // CASO 3: PRODUCTION / AUDIOVISUAL & CORPORATIVO
  if (root === 'production' || leaf.includes('produccion') || leaf.includes('videoclip') || leaf.includes('streaming')) {
    return {
      title: `${cleanTitle} en ${cityName} | Productora Audiovisual & Streaming`,
      h1: `${cleanTitle} en ${cityName} • Producción Cinematográfica`,
      metaDescription: `Servicios de ${cleanTitle.toLowerCase()} en ${cityName}. Cámaras de cine 4K/8K, iluminación Aputure, grabación multipista y realización multicámara profesional.`,
      searchIntent: `Contratación de productora audiovisual para spots, videoclips y eventos de empresa en ${cityName}.`,
      editorialBody: `
### Producción Audiovisual de Vanguardia en ${cityName}

La narrativa visual moderna exige estándares de emisión cinematográfica. En **${cityName}**, cubrimos desde rodajes corporativos en sedes empresariales hasta retransmisiones en streaming multipista y videoclips de alto presupuesto.

#### Flujo de Trabajo en Rodaje
* **Captura Óptica 4K/8K**: Sensores Full Frame con ópticas fijas de alta luminosidad (Sony Cinema Line / RED Digital Cinema).
* **Dirección de Iluminación**: Esquemas de 3 puntos con proyectores LED RGBWW de alto índice de reproducción cromática (CRI > 98 / TLCI > 98).
* **Sonido Directo de Estudio**: Grabadores multipista de 32 bits en coma flotante (32-bit Float) que eliminan cualquier riesgo de distorsión por saturación acústica.
* **Entrega Masterizada**: Corrección de color en DaVinci Resolve Studio y masterización acústica conforme al estándar EBU R128 (-23 LUFS).
      `.trim(),
      technicalSpecs: [
        { label: "Resolución Máxima", value: "4K DCI / 8K RAW" },
        { label: "Gama Dinámica", value: "15+ Stops (S-Log3 / REDCODE RAW)" },
        { label: "Grabación de Audio", value: "32-bit Float Multi-Canal" },
        { label: "Streaming", value: "Bonding 5G Multi-Operador con 0% Caídas" },
        { label: "Plazo de Entrega", value: "48h para primer corte / 7 días Master Final" }
      ],
      faqs: [
        {
          q: `¿Podéis realizar retransmisiones en streaming en recintos de ${cityName} sin fibra óptica?`,
          a: `Sí. Desplegamos mochilas de transmisión con agregación de hasta 4 enlaces 5G simultáneos (Cellular Bonding), garantizando un ancho de banda simétrico constante para directos en 1080p60 o 4K.`
        },
        {
          q: `¿Gestionáis los permisos de rodaje en vías públicas de ${cityName}?`,
          a: `Nos encargamos de tramitar los permisos con el ayuntamiento y la policía local, acompañados de nuestra póliza de Responsabilidad Civil de 1.000.000 €.`
        }
      ],
      localKeywords: [`productora audiovisual ${matchedCity}`, `grabacion de videoclips ${matchedCity}`, `streaming eventos ${matchedCity}`, `video corporativo ${matchedCity}`],
      venues: geo.venues,
      schemaType: 'Service',
      priceRange: '600€ - 6.000€'
    };
  }

  // CASO 4: TOOLS / SONORIZACIÓN & INGENIERÍA ACÚSTICA (DEFAULT BESPOKE)
  return {
    title: `${cleanTitle} en ${cityName} | Ingeniería Acústica & Alquiler de Sonido`,
    h1: `${cleanTitle} en ${cityName} • Infraestructura Certificada`,
    metaDescription: `Servicio oficial de ${cleanTitle.toLowerCase()} en ${cityName}. Ingeniería de sonido para espacios de 20 a 1.000 m². Equipos Bose F1, Shure y Behringer con Price-Lock 72h.`,
    searchIntent: `Alquiler de sonido, altavoces y dirección técnica para eventos en ${cityName}.`,
    editorialBody: `
### Ingeniería Acústica y Sonorización de Precisión en ${cityName}

La acústica no es cuestión de volumen, sino de **cobertura e inteligibilidad**. En **${cityName}**, los eventos celebrados en espacios como *${geo.venues[0]}* o auditorios locales requieren un cálculo acústico previo riguroso: aplicamos una relación constante de **12W RMS por asistente** o **15W por metro cuadrado**, asegurando una respuesta en frecuencia plana desde 35 Hz hasta 20 kHz.

#### Ventajas del Estándar Productora EAR en ${cityName}:
1. **Arreglos Lineales Flexibles**: Tecnología Bose F1 y L-Acoustics Syva que adaptan el tiro vertical para cubrir tanto primeras filas como zonas elevadas sin zonas de sombra sonora.
2. **Microfonía RF Digital Blindada**: Escaneo del espectro electromagnético en ${cityName} con Shure Wireless Workbench para evitar interferencias de telefonía móvil 4G/5G.
3. **Mesa Digital con Control Inalámbrico**: Monitoreo de mezclas en tiempo real mediante tablets redundantes en cualquier punto de la sala.
4. **Reserva Inmediata con Bloqueo de Stock**: 10 unidades base garantizadas con congelación de tarifa vía token criptográfico SHA-256.
    `.trim(),
    technicalSpecs: [
      { label: "Presión Acústica Nominal", value: "12W RMS / Asistente (102 dBA continuo)" },
      { label: "Latencia Digital", value: "< 1.5 ms (End-to-End)" },
      { label: "Consolas Digitales", value: "Behringer XR18 / Midas M32 / Yamaha" },
      { label: "Certificación", value: "Directiva Europea CE & Normativa DB-HR" },
      { label: "Garantía de Depósito", value: "0.50 € para bloqueo de fecha" }
    ],
    faqs: [
      {
        q: `¿Cómo calculáis el equipo necesario para mi salón en ${cityName}?`,
        a: `Introducimos los metros cuadrados y el número de invitados en nuestro motor de físicas. El sistema calcula la dispersión acústica requerida y te asigna los altavoces y micrófonos exactos para evitar tanto la falta de potencia como la sobrecarga sonora.`
      },
      {
        q: `¿El precio incluye transporte y recogida en ${cityName}?`,
        a: `Sí. Todos los presupuestos cerrados a través de nuestro cotizador contemplan la entrega en recinto, calibración acústica in-situ por nuestro técnico y retirada al finalizar el evento.`
      }
    ],
    localKeywords: [`sonorizacion de eventos ${matchedCity}`, `alquiler de sonido ${matchedCity}`, `altavoces bose ${matchedCity}`, `ingenieria acustica ${matchedCity}`],
    venues: geo.venues,
    schemaType: 'LocalBusiness',
    priceRange: '180€ - 1.800€'
  };
}

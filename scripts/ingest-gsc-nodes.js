const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'ear-rag-database.json');
console.log('Reading database from:', filePath);

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const newNodes = [
  {
    id: 'NODO_BARCELONA_MARIACHI',
    title: 'Contratación directa de Mariachi y Tenor S-Class para bodas en Barcelona y Cataluña con Edwin Agudelo',
    category: 'SEO_PROGRAMATICO_GSC',
    summary: 'Contratación directa de Mariachi y Tenor S-Class para bodas en Barcelona y Cataluña con Edwin Agudelo.',
    content: '# Contratación Directa de Mariachi y Tenor S-Class en Barcelona y Cataluña\n\n## Perfil Artístico y Repertorio\nEdwin Agudelo, Tenor y Director Artístico de Productora EAR, ofrece un servicio de alta gama musical para bodas y celebraciones en Barcelona, El Vallès, Girona, Tarragona y Lleida. Repertorio de 12-14 piezas por pase incluyendo mariachi tradicional, boleros, arias clásicas y música ranchera de gala.\n\n## Rider Técnico y Acústica S-Class\n- **Sistema PA**: Line Array Bose F1 Model 812 con subwoofers activos calibrados para 12 W/pax.\n- **Microfonía**: Shure Axient Digital / Beta 87A inalámbrica con escaneo RF en vivo.\n- **Mesa de Mezclas**: Behringer XR18 / Midas digital con control remoto.\n\n## Condiciones Comerciales y Split Soberano\n- **Tarifa Base Solista**: 350 €.\n- **Formato Dúo/Trío**: Desde 550 €.\n- **Gran Ensamble Mariachi (6-8 músicos)**: Desde 1.800 €.\n- **Garantía y Split**: 80% Proveedor Artista / 10% EAR OS / 10% VIMUME.\n- **Smart-Lock Stripe**: Depósito de 10 € para bloqueo de fecha 72h garantizado por SHA-256.',
    tags: ['GSC', 'Mariachi Barcelona', 'Bodas Barcelona', 'Edwin Agudelo', 'Tenor Cataluña', 'SEO Programático', '12 W/pax'],
    source_file: 'gsc_search_console_harvest_2026.json'
  },
  {
    id: 'NODO_MADRID_PANTALLAS_LED',
    title: 'Alquiler de Pantallas LED P2.6/P3.9 de gran formato, tótems 4K y muros interactivos en Madrid',
    category: 'SEO_PROGRAMATICO_GSC',
    summary: 'Alquiler de Pantallas LED P2.6/P3.9 de gran formato, tótems 4K y muros interactivos en Madrid.',
    content: '# Alquiler de Pantallas LED de Gran Formato y Arsenal Visual en Madrid\n\n## Catálogo Técnico y Stock Madrid\nEn alianza con el stock de madridalquiler.com y el arsenal soberano de EAR OS:\n- **Pantallas LED Interior P2.6**: Alta definición, refresh rate 3840Hz, escala de grises 16-bit, brillo 1.000 nits.\n- **Pantallas LED Exterior P3.9**: Protección IP65 waterproof, brillo 5.500 nits para luz solar directa.\n- **Pantallas LED de Suelo y Curvas**: Módulos interactivos reforzados para pasarelas y stands corporativos.\n- **Procesamiento de Vídeo**: Novastar VX1000 / 4K Scalers con redundancia HDMI/DP.\n- **Monitores Gran Formato**: Pantallas 4K de 85 y 98 pulgadas en peana móvil con conectividad inalámbrica.\n\n## Condiciones y SLA Técnico\n- Montaje, calibración de color in-situ y técnico FOH durante el evento.\n- Certificado de homologación estructural y seguro de responsabilidad civil.\n- Tarifa base técnica y bloqueo de reserva mediante Stripe Smart-Lock 10 € / depósito 30%.',
    tags: ['GSC', 'Alquiler Pantallas LED Madrid', 'Pantalla LED Gigante', 'Arsenal Visual', 'Novastar', 'P2.6', 'P3.9', 'SEO Programático'],
    source_file: 'gsc_search_console_harvest_2026.json'
  },
  {
    id: 'NODO_SONORIZACION_VALLES_BCN',
    title: 'Sonorización profesional para eventos corporativos y bandas en Barcelona, El Vallès y Cataluña con garantía de 12 W/pax',
    category: 'SEO_PROGRAMATICO_GSC',
    summary: 'Sonorización profesional para eventos corporativos y bandas en Barcelona, El Vallès y Cataluña con garantía de 12 W/pax.',
    content: '# Sonorización Profesional de Eventos y Conciertos en Barcelona y El Vallès\n\n## Protocolo Acústico S-Class y Cero Fallos\nCobertura completa para eventos corporativos, presentaciones de marca, galas y conciertos en directo en Barcelona, Sabadell, Terrassa, Granollers, Sant Cugat y toda la comarca del Vallès.\n- **Presión Acústica Garantizada**: 12 W/pax con distribución homogénea SPL y sin zonas de sombra acústica.\n- **Equipamiento**: Line Arrays activos dB Technologies DVA / Bose F1, subwoofers 18 pulgadas, consolas digitales Behringer XR18 / Midas M32.\n- **Microfonía**: Shure Axient Digital, Sennheiser G4 e In-Ears Shure PSM300.\n- **Redundancia Dual**: Backup automático de señal y bypass de alimentación ante caídas de tensión.\n\n## Condiciones Corporativas\n- Factura con NIF y desglose de IVA inmediato.\n- Técnico FOH certificado asignado en exclusiva.\n- Reserva garantizada con Smart-Lock Stripe.',
    tags: ['GSC', 'Sonorización Barcelona', 'Sonido Bandas El Vallès', 'Eventos Corporativos Cataluña', '12 W/pax', 'Bose F1', 'Behringer XR18', 'SEO Programático'],
    source_file: 'gsc_search_console_harvest_2026.json'
  },
  {
    id: 'NODO_AUDIO_MALLORCA_GALICIA',
    title: 'Sonorización y logística de sonido S-Class para eventos en Mallorca, Galicia y Pontevedra',
    category: 'SEO_PROGRAMATICO_GSC',
    summary: 'Sonorización y logística de sonido S-Class para eventos en Mallorca, Galicia y Pontevedra.',
    content: '# Sonorización y Producción Audiovisual en Mallorca, Galicia y Pontevedra\n\n## Cobertura Territorial e Insular\nInfraestructura y logística integral para eventos de lujo en las Islas Baleares (Mallorca, Ibiza, Menorca) y el Noroeste peninsular (Pontevedra, Vigo, A Coruña, Santiago de Compostela, Ourense, Lugo).\n- **Mallorca e Islas Baleares**: Sonorización de bodas en fincas rústicas (possessions), villas privadas y hoteles boutique. Resistencia climática marina y transporte marítimo/aéreo coordinado.\n- **Galicia y Pontevedra**: Sistemas de audio con protección IP para intemperie, tratamiento acústico en pazos gallegos y carpas de celebración.\n- **Rider Técnico**: Line Array Bose F1, sistemas dB Technologies, microfonía inalámbrica Shure Axient y mezcla digital inalámbrica.\n\n## Tarifas y Condiciones\n- Base solista 350 € + suplemento logístico insular/kilometraje.\n- Protocolo de 12 W/pax asegurado.\n- Smart-Lock Stripe de 10 € para fijar fecha y tarifa.',
    tags: ['GSC', 'Alquiler Sonido Mallorca', 'Equipos Sonido Galicia', 'Sonorización Pontevedra', 'Bodas Mallorca', 'Pazos Galicia', 'SEO Programático'],
    source_file: 'gsc_search_console_harvest_2026.json'
  },
  {
    id: 'NODO_FINCAS_ACUSTICA',
    title: 'Estudios de sonorización y cobertura acústica para Quinta Malpica, Finca Los Afligidos y Las Granadas Coronadas',
    category: 'SEO_PROGRAMATICO_GSC',
    summary: 'Estudios de sonorización y cobertura acústica para Quinta Malpica, Finca Los Afligidos y Las Granadas Coronadas.',
    content: '# Estudios de Sonorización y Acústica para Fincas Exclusivas de Eventos\n\n## Análisis Específico de Espacios Singulares\n- **Quinta Malpica**: Sonorización de zonas ajardinadas y carpa principal. Alineación de fase para evitar rebotes en cristaleras y dispersión por viento. Solista Edwin Agudelo para cóctel y ceremonia.\n- **Finca Los Afligidos**: Calibración electroacústica en patio central y salones rústicos. PA Bose F1 con presión 12 W/pax y microfonía Shure Axient sin acoples.\n- **Las Granadas Coronadas**: Distribución multi-zona con líneas de retardo para música ambiental durante la cena y máxima potencia en la pista de baile sin molestar a vecinos.\n\n## Propuesta de Valor para Fincas y Wedding Planners\n- Garantía cero acoples en discursos y votos matrimoniales.\n- Generadores insonorizados y estabilizadores de tensión para fincas rústicas.\n- Enlace directo con Stripe Smart-Lock 10 € / 30% reserva.',
    tags: ['GSC', 'Quinta Malpica', 'Finca Los Afligidos', 'Las Granadas Coronadas', 'Fincas Acústica', 'Bodas Fincas', 'Sonorización Fincas', 'SEO Programático'],
    source_file: 'gsc_search_console_harvest_2026.json'
  }
];

let added = 0;
let updated = 0;

for (const node of newNodes) {
  const idx = data.findIndex(d => d.id === node.id);
  if (idx >= 0) {
    data[idx] = node;
    updated++;
  } else {
    data.unshift(node);
    added++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ RAG Ingestion Complete.');
console.log(`Added: ${added}, Updated: ${updated}, Total items: ${data.length}`);

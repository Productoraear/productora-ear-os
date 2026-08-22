const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'ear-rag-database.json');
console.log('Ingestando nodos de Quality VIP Solutions en:', filePath);

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const newNodes = [
  {
    id: 'NODO_QUALITY_VIP_SOLUTIONS_CHAUFFEUR',
    title: 'Servicio de Chófer VIP, Alquiler de Vehículos de Lujo con Conductor y Transfers Barajas FBO (Quality VIP Solutions)',
    category: 'LOGISTICA_VIP_CHAUFFEUR',
    summary: 'Proveedor homologado de transporte ejecutivo, vehículos de representación y chófer privado en Madrid, Ibiza y Marbella. Flota Mercedes Clase S, Clase V y Clase E con conductor de protocolo.',
    content: `# Quality VIP Solutions — Alquiler de Vehículos de Lujo con Conductor

## 1. Identidad Corporativa y Garantías Operativas
- **Proveedor Homologado**: QUALITY VIP SOLUTIONS, SL (CIF B87910311). Sede central en Plaza Patricio Aguado 2, 1C, Madrid.
- **Bases Operativas**: Madrid capital (cobertura 24/7), Ibiza (temporada estival), Marbella / Costa del Sol, Valencia y Barcelona.
- **Protocolo de Conductores**: Chóferes uniformados de estricta etiqueta, formación en protocolo diplomático, idiomas (inglés, portugués, español) y acuerdo de confidencialidad (NDA).

## 2. Flota S-Class y Capacidades
- **Mercedes-Benz Clase S (Lujo & Representación)**: 1 a 3 PAX. Asientos de cuero ventilados, suspensión neumática adaptativa, cortinillas de privacidad, Wi-Fi 5G y minibar de cortesía.
- **Mercedes-Benz Clase V Extra Larga (Minivan VIP)**: 4 a 7 PAX. Configuración face-to-face (salón de reuniones), tomas de 230V/USB, maletero de gran volumen para 7 maletas grandes.
- **Mercedes-Benz Clase E (Business Executive)**: 1 a 3 PAX. Idóneo para traslados corporativos y ponentes de congresos IFEMA.
- **SUV de Alta Gama y Minibuses VIP (16-30 PAX)**: Para comitivas nupciales y delegaciones institucionales.

## 3. Tarifas y Estructura de Servicios
- **Disposiciones por Horas**: 4 horas desde 150 € (tarifa promo / antes 250 €); 8 horas desde 450 € (Clase E) hasta 580 € (Clase S).
- **Transfers Aeropuerto Barajas**: Terminales T1, T2, T3, T4 y Terminal de Aviación General / Vuelos Privados FBO desde 110 €. Incluye 60 min de cortesía y cartel nominal en hall.
- **Transfers Interurbanos**: Madrid - Valencia (Puzol / Capital) en Minivan 6 PAX por 425 €. Rutas a Sevilla, Barcelona o Marbella presupuestadas por km cerrado.`,
    tags: ['Chofer VIP', 'Mercedes Clase S', 'Mercedes Clase V', 'Transfers Barajas FBO', 'Quality VIP Solutions', 'Alquiler con Conductor', 'Ibiza Marbella', 'Madrid'],
    source_file: 'qualityvipsolutions_catalog.json'
  },
  {
    id: 'NODO_LOGISTICA_ARTISTAS_AUTORIDADES_VIP',
    title: 'Logística y Transporte VIP para Artistas, Solistas, Giras y Autoridades en Backstage',
    category: 'PRODUCCION_BACKSTAGE_VIP',
    summary: 'Operativa de transporte blindado y discreto para artistas de gala, tenores (Edwin Agudelo), directores de orquesta y autoridades institucionales. Acceso a recintos feriales y backstage.',
    content: `# Logística y Transporte VIP para Artistas y Giras (Quality VIP Solutions)

## 1. Requerimientos Técnicos para Artistas y Producción
- **Espacio para Equipamiento e Indumentaria**: Furgonetas Mercedes Clase V Extra Larga acondicionadas para transportar con seguridad instrumentos delicados (violines, guitarras, microfonía inalámbrica) y percheros para trajes de charro de gala.
- **Discreción y Seguridad**: Lunas tintadas de alta opacidad, acceso directo a muelles de carga de auditorios, hoteles de 5 estrellas y recintos feriales sin exposición a multitudes.
- **Sincronización con el Rider y Horarios de Escenario**: Coordinación estrecha con el director técnico de Productora EAR para asegurar que el artista llegue exactamente a la prueba de sonido y al inicio de la actuación sin demoras.

## 2. Cobertura de Giras Nacionales
- Disponibilidad de flotas combinadas (Clase S para el solista + Clase V para músicos de apoyo) en recorridos multidía con relevo de conductores y dietas cerradas.
- Liquidación centralizada a través del Split Soberano de EAR OS y facturación electrónica oficial con NIF.`,
    tags: ['Transporte Artistas', 'Logística Giras', 'Backstage VIP', 'Edwin Agudelo', 'Mercedes Minivan', 'Quality VIP Solutions'],
    source_file: 'qualityvipsolutions_catalog.json'
  },
  {
    id: 'NODO_VEHICULOS_BODAS_EVENTOS_LUJO',
    title: 'Vehículos Nupciales y Transporte de Comitivas para Bodas de Lujo y Galas',
    category: 'BODAS_TRANSPORTE_LUJO',
    summary: 'Packs de alquiler de coches de boda con chófer de gala, traslados de novios a fincas y coordinación de minivans VIP para padrinos e invitados distinguidos.',
    content: `# Vehículos Nupciales y Comitivas de Boda (Quality VIP Solutions)

## 1. Pack Nupcial S-Class (Mercedes Clase S / Maybach)
- **Recorrido Integral**: Recogida del novio/novia en domicilio o suite nupcial, traslado ceremonial al templo o finca, escolta durante el reportaje fotográfico y llegada triunfal al cóctel.
- **Detalles Exclusivos**: Chófer de estricta etiqueta, decoración floral sutil a petición, botella de champán brut a bordo y ambientación climática y musical a gusto de los contrayentes. Tarifa desde 450 € (hasta 5 horas).

## 2. Transporte de Comitivas y Padrinos
- Minivans Mercedes Clase V de 7 plazas para traslado ágil de padres, padrinos y damas de honor entre el hotel, la ceremonia y la finca rural.
- Servicios de lanzadera nocturna al cierre de la fiesta para garantizar el regreso seguro de los invitados VIP.`,
    tags: ['Coche Boda', 'Vehículo Nupcial', 'Mercedes Clase S Boda', 'Fincas Madrid', 'Bodas de Lujo', 'Quality VIP Solutions'],
    source_file: 'qualityvipsolutions_catalog.json'
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
console.log(`[OK] Ingestión RAG Quality VIP completada. Añadidos: ${added}, Actualizados: ${updated}, Total items en base: ${data.length}`);

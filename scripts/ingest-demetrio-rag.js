const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'ear-rag-database.json');
console.log('Ingestando nodos de Demetrio Luces de Navidad en:', filePath);

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const newNodes = [
  {
    id: 'NODO_B2G_ALUMBRADO_NAVIDENO_MUNICIPAL',
    title: 'Alumbrado Navideño Municipal, Pliegos LCSP y Proyectos de Iluminación Urbana Festiva (Catálogo Demetrio 2025)',
    category: 'B2G_ALUMBRADO_NAVIDEÑO',
    summary: 'Infraestructura completa de alumbrado navideño para Ayuntamientos bajo Ley de Contratos del Sector Público (LCSP). Catálogo homologado de 358 referencias con certificado CE, seguro RC 600.000€ y logística integral.',
    content: `# Alumbrado Navideño Municipal y Licitaciones B2G (Catálogo Demetrio 2025)

## 1. Marco Jurídico y Modalidades de Contratación LCSP
- **Contratos Menores de Suministro/Instalación (<15.000 € sin IVA)**: Tramitación simplificada de adjudicación directa con memoria justificativa, certificado de necesidad, factura electrónica con NIF y retención de crédito.
- **Procedimientos Abiertos y Simplificados (>15.000 €)**: Oferta integral con memoria técnica, cálculo de potencias, estudio de seguridad y salud, y plan de contingencia eléctrica.

## 2. Garantías Técnicas y Seguridad Homologada
- **Certificación Europea**: Marcado CE, RoHS, aislamiento IP65 en elementos exteriores e IP44 en conexiones.
- **Seguro de Responsabilidad Civil**: Cobertura integral de 600.000 € por siniestro durante montaje, encendido y desmontaje.
- **Seguridad en Vía Pública**: Estructuras de aluminio aligerado calculadas para sobrecargas de viento de hasta 28 m/s (norma UNE-EN 1991-1-4).
- **Consumo Energético**: Tecnología 100% micro-LED de alta eficiencia (reducción del 85% en consumo frente a incandescencia tradicional).
- **Mantenimiento 24/7**: Servicio de guardia técnica local para reposición de motivos o reparación de acometidas en <2 horas.

## 3. Stock Inmediato Integrado (358 Referencias Demetrio 2025)
- **Gran Formato 3D**: Muñecos de nieve 6m (12.500€), Portales Oso/Pingüino 4.2-4.4m (7.500€-10.500€), Conos monumentales Ribbon 8-10.6m (10.600€-14.400€).
- **Viales y Farolas**: Más de 140 modelos de arcos de calle y transversales con animación meteorito (100€-430€).
- **Arbolado y Plazas**: Guirnaldas profesionales de 24V y 230V con conectores estancos y esferas plegables flash (60€-450€).`,
    tags: ['B2G', 'Ayuntamientos', 'Alumbrado Navideño', 'LCSP', 'Demetrio 2025', 'Luces de Navidad', 'Pliegos Técnicos', 'Fiestas Patronales'],
    source_file: 'catalogo_luces_demetrio_2025.pdf'
  },
  {
    id: 'NODO_ARSENAL_ESCULTURAS_3D_NAVIDAD',
    title: 'Catálogo de Esculturas y Motivos 3D Gigantes de Navidad (Demetrio 2025)',
    category: 'ARSENAL_ILUMINACION_3D',
    summary: 'Esculturas tridimensionales luminosas de gran formato (3m a 10.6m) para plazas mayores, rotondas y atrios de centros comerciales. Chasis de aluminio, micro-LED 24V y malla PVC reforzada.',
    content: `# Esculturas y Figuras 3D Gigantes de Navidad — Catálogo Demetrio 2025

## 1. Figuras Escultóricas Transitables y Monumentales
- **CR WLSNOWMAN 3D 24V**: Muñeco de nieve gigante 6,00m Alto x 5,70m Ancho x 3,70m Fondo. Potencia 1100W, peso 150Kg, voltaje de seguridad 24V. Estructura de aluminio con guirnalda y malla PVC. Tarifa 12.500 €.
- **CR BEAR DOOR 3D 24V**: Portal transitable de oso polar 4,20m Alto x 3,75m Ancho x 1,80m Fondo. Potencia 900W, peso 150Kg, voltaje 24V. Aluminio con espumillón e hilo luminoso. Tarifa 10.500 €.
- **CR PENDOOR 3D 24V**: Portal transitable de pingüino 4,40m Alto x 4,20m Ancho x 1,80m Fondo. Potencia 900W, peso 150Kg, voltaje 24V. Tarifa 7.500 €.
- **CR PCBEAR 3D 24V**: Escultura 3D de oso polar sentado 3,00m x 2,50m x 0,25m. Potencia 250W, peso 25Kg. Tarifa 3.850 €.
- **CR 3817 3D 24V**: Caja de regalo 3D transitable (photocall inmersivo) 2,07m x 1,72m x 1,88m. Potencia 155W, peso 55Kg. Tarifa 4.950 €.
- **CR 4522 3D 24V**: Bola de Navidad 3D gigante transitable 2,50m x 1,95m x 1,85m. Potencia 170W, peso 55Kg. Tarifa 4.500 €.

## 2. Conos y Árboles Gigantes Flash
- **C-RIBBON-8M**: Cono árbol monumental 8,00m Alto x Ø 2,40m Base. Potencia 800W, 24V, 20% LEDs flash blanco puro. Tarifa 10.600 €.
- **C-RIBBON-10M**: Cono árbol monumental 10,60m Alto x Ø 3,10m Base. Potencia 1300W, 24V, 20% LEDs flash blanco puro. Tarifa 14.400 €.`,
    tags: ['Motivos 3D', 'Esculturas Navideñas', 'Árboles Gigantes', 'Photocall Navideño', 'Demetrio 2025', 'Arsenal EAR OS'],
    source_file: 'catalogo_luces_demetrio_2025.pdf'
  },
  {
    id: 'NODO_ARCOS_CALLE_MOTIVOS_2D',
    title: 'Arcos de Calle, Transversales y Motivos 2D para Farolas y Avenidas Comerciales',
    category: 'ALUMBRADO_VIAL_FESTIVO',
    summary: 'Más de 140 modelos de arcos luminosos y motivos 2D para báculos de farola y transversales de calle. Consumos ultra bajos de 12W a 40W por motivo, chasis de aluminio inoxidable y efectos meteorito.',
    content: `# Arcos de Calle y Motivos 2D de Farola (Catálogo Demetrio 2025)

## 1. Tipologías Técnicas de Alumbrado Vial
- **Motivos de Báculo de Farola**: Diseñados para anclaje universal mediante fleje de acero inoxidable a columnas de 3m a 10m. Dimensiones estándar: 60x52cm hasta 220x90cm.
- **Arcos Transversales de Calle**: Conjuntos modulares suspendidos sobre catenarias de acero para vanos de 6m a 16m de anchura de calle.
- **Efectos Dinámicos**: Animación meteorito integrada, destello flash 10-20% y combinaciones de blanco frío / blanco cálido / metacrilato PMMA difusor.

## 2. Rendimiento y Seguridad
- **Consumo Energético Mínimo**: Desde 12W (CR 5342) hasta 34W (CR 4968-N), permitiendo alimentar hasta 50 arcos sobre un mismo circuito municipal de 16A sin sobrecargas.
- **Peso Ultra-Ligero**: De 2Kg a 8Kg por motivo, reduciendo drásticamente la carga de cizalladura en báculos y postes de hormigón/acero.
- **Rango de Precios**: Desde 100 € hasta 430 € por motivo individual.`,
    tags: ['Arcos de Calle', 'Alumbrado Vial', 'Farolas Navidad', 'Motivos 2D', 'Demetrio 2025', 'Ayuntamientos'],
    source_file: 'catalogo_luces_demetrio_2025.pdf'
  },
  {
    id: 'NODO_DECORACION_CENTROS_COMERCIALES_FINCAS',
    title: 'Decoración Navideña S-Class para Centros Comerciales, Hoteles y Fincas Singulares',
    category: 'DECORACION_NAVIDENA_PREMIUM',
    summary: 'Soluciones integrales de ambientación navideña para centros comerciales, resorts hoteleros, bodegas y fincas rústicas. Esferas plegables 30-120cm, sistemas inteligentes Twinkly Pro y cortinas LED de alta densidad.',
    content: `# Iluminación Navideña para Centros Comerciales, Hoteles y Fincas (Demetrio 2025)

## 1. Elementos para Interiores y Espacios Exclusivos
- **Esferas Foldable Flash (30cm a 120cm)**: Esferas esféricas 3D de almacenamiento ultracompacto con despliegue en 2 partes. Diámetros Ø30cm (15W / 60€), Ø50cm (25W / 120€), Ø80cm (40W / 280€) y Ø120cm (90W / 450€). Gama de colores blanco frío, cálido, rojo, azul, verde y púrpura.
- **Sistemas Inteligentes Twinkly Pro**: Control mapeable 3D por visión computacional mediante smartphone y control DMX/Art-Net para sincronización con espectáculos musicales.
- **Cortinas y Mallas Micro-LED**: Cobertura de fachadas históricas, cascadas de luz en porches y revestimiento de copas de árboles con conectores estancos en T (serie EC).

## 2. Modelo de Contratación y Producción Integral
- **Alquiler con Montaje Llave en Mano**: Transporte con camión grúa, cableado camuflado, temporizadores astronómicos y desmontaje programado.
- **Reserva y Bloqueo**: Smart-Lock Stripe 10 € / Depósito 30% con garantía de tarifa cerrada.`,
    tags: ['Centros Comerciales', 'Fincas Navidad', 'Hoteles Iluminación', 'Twinkly Pro', 'Esferas Plegables', 'Decoración S-Class'],
    source_file: 'catalogo_luces_demetrio_2025.pdf'
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
console.log(`[OK] Ingestión RAG Demetrio completada. Añadidos: ${added}, Actualizados: ${updated}, Total items en base: ${data.length}`);

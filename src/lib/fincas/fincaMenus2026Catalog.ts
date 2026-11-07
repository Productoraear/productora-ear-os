/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS MENUS 2026 — SINGLE SOURCE OF TRUTH (SSOT) & CATÁLOGO CANÓNICO
 * ════════════════════════════════════════════════════════════════════════════
 * Catálogo canónico e inmutable de menús de temporada 2026 y complementos
 * oficiales para el Escaparate B2B de Fincas y Restaurantes Homologados.
 *
 * Invariantes S-Class (AGENTS.md · Protocolo Omega v11.0):
 *  1. Céntimos enteros (Integer Cents): Cero operaciones float en cálculos.
 *     Todos los importes cuentan con `pricePerPaxCents` o `priceCents`.
 *  2. Cero tipos `any`: Tipado estricto en todas las interfaces y exports.
 *  3. Fidelidad gastronómica canónica con Otzarreta (7 menús de boda, 16 extras).
 *  4. Sincronización con SSOT financiero (`TARIFA_BASE_SOLISTA_EUR = 350.0`).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';

/** Categorías de menú admitidas en el escaparate de fincas */
export type FincaMenuCategory = 'bodas' | 'comuniones' | 'grupos';

/** Identificadores de los 7 menús de boda canónicos 2026 */
export type FincaBodaMenuId =
  | 'boda-cantabrico'
  | 'boda-paloma'
  | 'boda-imperial'
  | 'boda-temporada'
  | 'boda-vasco'
  | 'boda-ezkertza'
  | 'boda-caserio-beko';

/** Identificadores de todos los menús soportados */
export type FincaMenuId =
  | FincaBodaMenuId
  | 'comunion-paloma'
  | 'comunion-gorbea'
  | 'comunion-unbe'
  | 'comunion-akarlanda'
  | 'grupo-menu1'
  | 'grupo-menu4';

/** Identificadores de los 16 extras oficiales de temporada */
export type FincaExtraId =
  | 'barra-libre-extra'
  | 'exclusividad-premium'
  | 'solista-edwin'
  | 'dj-residente'
  | 'carpas-ceremonia'
  | 'coches-clasicos'
  | 'autobus-invitados'
  | 'aurresku'
  | 'cortador-jamon'
  | 'orquesta'
  | 'audio-proyeccion'
  | 'exclusividad-salon'
  | 'candy-bar'
  | 'photocall'
  | 'fuente-chocolate'
  | 'hinchables';

/** Categoría de los complementos y extras del catálogo */
export type FincaComplementoCategory =
  | 'barra_libre'
  | 'audiovisual'
  | 'ceremonia'
  | 'transporte'
  | 'gastronomia'
  | 'exclusividad'
  | 'animacion';

/** Ficha de plato individual dentro de un menú */
export interface FincaMenuItem {
  readonly name: string;
  readonly desc: string;
}

/** Estructura inmutable de un menú completo de temporada 2026 */
export interface FincaMenuPackage2026 {
  readonly id: FincaMenuId;
  readonly category: FincaMenuCategory;
  readonly name: string;
  readonly subtitle: string;
  readonly tag: string;
  readonly pricePerPaxEur: number;
  readonly pricePerPaxCents: number; // En céntimos enteros (ej. 10000 = 100,00 €)
  readonly originalPricePerPaxEur?: number;
  readonly originalPricePerPaxCents?: number;
  readonly highlight: string;
  readonly cocktail: readonly string[];
  readonly mainCourses: readonly FincaMenuItem[];
  readonly dessert: string;
  readonly cellar: readonly string[];
  readonly soundIncluded: string;
  readonly bonus?: string;
  readonly badge?: string;
}

/** Estructura inmutable de un extra o servicio complementario */
export interface FincaComplemento2026 {
  readonly id: FincaExtraId;
  readonly name: string;
  readonly priceEur: number;
  readonly priceCents: number; // En céntimos enteros (ej. 1500 = 15,00 €)
  readonly isPerPax: boolean;  // true: precio por persona; false: precio fijo
  readonly category: FincaComplementoCategory;
  readonly desc: string;
  readonly defaultSelected?: boolean;
}

/** Resultado de la auditoría de integridad del catálogo */
export interface FincaCatalogValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly menuCount: number;
  readonly extraCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. LOS 7 MENÚS DE BODA OFICIALES TEMPORADA 2026 (ZONA CERO)
// ─────────────────────────────────────────────────────────────────────────────

export const FINCA_BODA_MENUS_2026: readonly FincaMenuPackage2026[] = Object.freeze([
  {
    id: 'boda-cantabrico',
    category: 'bodas',
    name: 'Menú Cantábrico',
    subtitle: 'El clásico atlántico: Marisco a la plancha, merluza o bacalao y entrecotte al carbón',
    tag: '100 € + IVA · CLÁSICO NUPCIAL',
    pricePerPaxEur: 100.0,
    pricePerPaxCents: 10000,
    highlight: 'Marisco individual (4 langostinos Caribe, 2 venezolanos, 1 zamburiña) + Entrecotte a la brasa',
    cocktail: Object.freeze([
      'Cóctel de Cava con selección de variedades de la casa',
      'Canapés selectos de gala: 3 fríos + 3 calientes',
      'Entremeses fríos al centro: Jamón y Lomo Ibérico de bellota',
      'Ensalada de ventresca de bonito del norte con tomate de la huerta',
      'Pastel artesanal de kabratxo con tosta de pan crujiente',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Marisco a la plancha individual',
        desc: '4 Langostinos del Caribe, 2 Langostinos Extras Venezolanos y 1 Zamburiña selecta a la brasa',
      },
      {
        name: 'Pescado noble a elegir',
        desc: 'Lomos de Merluza del Cantábrico en salsa verde tradicional o Bacalao al Pil-pil',
      },
      {
        name: 'Carne a la brasa a elegir',
        desc: 'Taco de Entrecotte en su jugo a la brasa con Pastel de Patata y Beicon o Carrilleras de Ternera confitadas',
      },
    ]),
    dessert: 'Tarta San Marcos sobre fondo de crema inglesa y helado artesano de vainilla',
    cellar: Object.freeze([
      'D.O.Ca. Rioja Crianza Bodegas Olarra',
      'Rosado Navarro Selección & Blanco Rueda Verdejo',
      'Agua mineral, Copa de Cava y Cafés',
    ]),
    soundIncluded: 'Sonorización ambiental en cóctel y banquete homologada (Ley 37/2003)',
  },
  {
    id: 'boda-paloma',
    category: 'bodas',
    name: 'Menú Paloma',
    subtitle: 'Cortador de jamón en vivo, parrillada marina, rodaballo salvaje y lechazo asado',
    tag: '125 € + IVA · PARRILLA & MAR',
    pricePerPaxEur: 125.0,
    pricePerPaxCents: 12500,
    highlight: 'Maestro cortador de jamón + Trancha de rodaballo salvaje + Lechazo asado de Castilla',
    cocktail: Object.freeze([
      'Cortador de Jamón profesional en vivo en los jardines',
      'Cóctel de Cava con 6 canapés fríos + 6 calientes elaborados al momento',
      'Entremeses individuales: Surtido de Jamón y Lomo de bellota, Cecina y Cuña de queso curado',
      'Mini ensalada de bacalao en emulsión de pisto tradicional',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Parrillada de marisco individual',
        desc: '6 Langostinos medianos del Caribe, 2 Langostinos Extra Venezolanos y 1 Zamburiña a la parrilla',
      },
      {
        name: 'Trancha de Rodaballo salvaje con patata panadera',
        desc: 'Pescado salvaje al horno con su refrito tradicional de ajos y guindilla + Sorbete de mango',
      },
      {
        name: 'Carne a elegir',
        desc: 'Lechazo asado de Castilla con ensalada de la huerta o Taco de Entrecotte braseado al aroma de encina',
      },
    ]),
    dessert: 'Pantxineta rellena de crema y nata con tulipa de chocolate y helado de mandarina o Canutillo de Bilbao',
    cellar: Object.freeze([
      'Rioja Crianza Bodegas Olarra, Rosado Chivite y Blanco Verdejo',
      'Agua mineral, Copa de Cava, Cafés y Copa de licor digestivo',
    ]),
    soundIncluded: 'Hardware acústico Bose S1 Pro para cóctel en jardines y salones',
  },
  {
    id: 'boda-imperial',
    category: 'bodas',
    name: 'Menú Especial Imperial',
    subtitle: 'Oferta con regalo incluido: 1 h de Barra Libre + 1 h de DJ residente',
    tag: 'OFERTA 123,40 € + IVA (Tarifa 138,40 €)',
    pricePerPaxEur: 123.4,
    pricePerPaxCents: 12340,
    originalPricePerPaxEur: 138.4,
    originalPricePerPaxCents: 13840,
    bonus: '🎁 REGALO INCLUIDO: 1 hora de barra libre + 1 hora de DJ en directo',
    highlight: 'Nécoras con rape + Foie micuit + Milhojas de bacalao con txangurro + Solomillo trufado',
    cocktail: Object.freeze([
      'Tabla de ibéricos individual: Jamón Ibérico, Lomo de Bellota, Cecina y Cuña de queso',
      'Degustación puding de nécoras con rape sobre pastel de puerros y hongos',
      'Mini paté de foie (micuit) con purés de grosellas y manzanas',
      'Crujiente de hojaldre caliente relleno de setas de temporada (Edulis) y gambas de Huelva',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Directamente del mar (a elegir)',
        desc: 'Milhojas de Bacalao con Txangurro al Pil-Pil sobre toque de Bizkaina, Merluza rellena de marisco o Lomo de Sapito de Rape asado al horno de leña',
      },
      {
        name: 'Carne a elegir',
        desc: 'Solomillo a la plancha con aceite trufado y verduras, Cordero de Castilla al horno de leña o Láminas de ganado mayor a la parrilla',
      },
    ]),
    dessert: 'Especial tarta Florentina rellena de trufa con helado (mango, mandarina) sobre tulipa de chocolate',
    cellar: Object.freeze([
      'Rioja Crianza Bodegas Olarra, Rosado Navarro y Blanco Rueda',
      'Agua, Copa de Cava, Cafés + 1 HORA DE BARRA LIBRE GRATUITA',
    ]),
    soundIncluded: '1 hora de DJ profesional con cabina Pioneer y sonorización de pista',
  },
  {
    id: 'boda-temporada',
    category: 'bodas',
    name: 'Menú Temporada',
    subtitle: 'Cortador de jamón ibérico incluido, bogavante del país, almejas gallegas y lubina',
    tag: '142,50 € + IVA · ALTA COCINA VASCA',
    pricePerPaxEur: 142.5,
    pricePerPaxCents: 14250,
    highlight: '1/2 Bogavante del país + Cigala cantábrica + Almejas gallegas + Solomillo o buey',
    cocktail: Object.freeze([
      'Maestro cortador de jamón (Jamón Ibérico incluido en el precio)',
      'Cóctel de gala en jardines: 5 fríos + 5 calientes + Cóctel Tropical y Rincón de Cervezas',
      'Almejas gallegas al centro de mesa: salsa Marinera o Verde tradicional',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Marisco a la plancha individual',
        desc: '1 Cigala del Cantábrico, 1/2 Bogavante del País y 1 Zamburiña a la plancha',
      },
      {
        name: 'Pescado noble (a elegir)',
        desc: 'Rape en salsa con patata panadera o Lubina salvaje braseada + Sorbete al gusto (limón al cava, mango, manzana o mandarina)',
      },
      {
        name: 'Carne a elegir',
        desc: 'Cordero lechal de Castilla asado de leña, Solomillo a la plancha con pimientos o Láminas de buey gallego a la brasa al aroma de encina',
      },
    ]),
    dessert: 'Tarta Variedades de la Casa con helado artesano sobre tulipa de chocolate',
    cellar: Object.freeze([
      'Tinto Reserva Ondarre, Rosado Chivite y Blanco Rueda Verdejo o Txakoli bizkaino',
      'Copa de Cava y Cafés de especialidad',
    ]),
    soundIncluded: 'Sonorización Bose S1 Pro / F1 para salones y zona exterior de cóctel',
  },
  {
    id: 'boda-vasco',
    category: 'bodas',
    name: 'Menú Vasco',
    subtitle: 'El pack más completo: 2 h Barra Libre + 2 h DJ + Autobús 55 pax + Decoración floral',
    tag: 'OFERTA 138,00 € + IVA (Tarifa 153 €)',
    pricePerPaxEur: 138.0,
    pricePerPaxCents: 13800,
    originalPricePerPaxEur: 153.0,
    originalPricePerPaxCents: 15300,
    bonus: '🎁 INCLUYE: 2 h barra libre + 2 h DJ + Autobús 55 pax + Decoración floral + Degustación 6 pax',
    highlight: 'Autobús incluido + Barra libre 2h + DJ + Chuleta 500g brasa o Solomillo',
    cocktail: Object.freeze([
      'Cóctel de 5 cucharas + 1 brocheta + 1 hojaldre + 1 fritura + Mesa de quesos variados',
      'Cortador de jamón profesional en jardines',
      'Foie micuit con pasas y nueces',
      'Mini ensalada de ventresca de bonito de Santoña con anchoas y pimientos asados',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Directamente del mar (a elegir)',
        desc: 'Milhojas de Bacalao con Txangurro al pil-pil sobre toque del chef o Rape salvaje a la brasa con Bilbaína + Sorbete al gusto',
      },
      {
        name: 'Carne a elegir',
        desc: 'Láminas de Solomillo y hongos con pastel de patata, beicon y salsa de Oporto o Chuleta (500 gr.) a la brasa con pimientos y patatas',
      },
    ]),
    dessert: 'Pantxineta de crema y nata con tulipa y helado, Canutillo de Bilbao, Goxua tradicional o Tarta Nupcial',
    cellar: Object.freeze([
      'Rioja Reserva, Txakoli bizkaino, Copa de Cava, Cafés y Licores (Escocés o Valenciano)',
      '2 HORAS DE BARRA LIBRE COMPLETAS INCLUIDAS',
    ]),
    soundIncluded: '2 horas de DJ profesional + megafonía + iluminación ambiental de pista',
  },
  {
    id: 'boda-ezkertza',
    category: 'bodas',
    name: 'Menú Ezkertza',
    subtitle: 'El festín de los reyes del marisco: Chuletón de 1 Kg a la brasa y Bogavante del Cantábrico',
    tag: '155 € + IVA · CHULETÓN & BOGAVANTE',
    pricePerPaxEur: 155.0,
    pricePerPaxCents: 15500,
    highlight: 'Chuletón de 1 Kg brasa + 1/2 Bogavante Cantábrico + Almeja fina gallega + Gambas Huelva',
    cocktail: Object.freeze([
      'Cóctel en jardines con bebidas variadas (45 min): vinos, crianza, moscato, refrescos',
      'Canapés: 5 fríos + 5 calientes + Rincón de Anchoas selectas + Mesa de Quesos del país',
      'Cortador de jamón profesional en directo',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Variedad de marisco a la plancha con aceite de brasa natural',
        desc: '1 Cigala del Cantábrico, 2 Langostinos extra venezolanos, 4 Gambas blanquilla de Huelva, 1/2 Bogavante del Cantábrico + Almeja fina gallega al centro (plancha con refrito, salsa verde o marinera)',
      },
      {
        name: 'Directamente del mar (a elegir una)',
        desc: 'Milhojas de Bacalao con Txangurro al Pil-Pil, Merluza rellena de marisco o Lomo de sapito de rape al horno de leña + Sorbete',
      },
      {
        name: 'Carne mayor (a elegir una)',
        desc: 'Chuletón 1 Kg con ensalada de la huerta, patatas y pimientos o Solomillo a la plancha con aceite trufado',
      },
    ]),
    dessert: 'Especial tarta de hojaldre rellena de trufa con helado al gusto sobre tulipa de chocolate',
    cellar: Object.freeze([
      'Rioja Reserva Ondarre, Rosado Navarro y Txakoli bizkaino',
      'Copa de Cava, Cafés de autor y Combinado',
    ]),
    soundIncluded: 'Sonorización completa de gala Bose F1 (12 W/pax) con atril y microfonía',
  },
  {
    id: 'boda-caserio-beko',
    category: 'bodas',
    name: 'Menú Caserío Ezkertza Beko',
    subtitle: 'La cumbre gastronómica: Möet & Chandon, huevo a baja temperatura, bogavante y chuletón',
    tag: '173 € + IVA · MÖET & CHANDON SUPREME',
    pricePerPaxEur: 173.0,
    pricePerPaxCents: 17300,
    highlight: 'Champagne Möet & Chandon + Txangurro a la Donostiarra + Chuletón 1 Kg + Pulpo brasa',
    cocktail: Object.freeze([
      'Cóctel en el jardín: Cortador de jamón o salmón y Mesa de quesos del país',
      'Huevo a baja temperatura sobre parmentier con hongos, setas o mollejas',
      'Mini talo con txistorra de Arbizu o morcilla de Beasain',
      'Fritos artesanos, brochetas de langostinos en tempura y pulpo con delicias de mango',
      'Mini-tostas de Wayu, anchoas con pimiento asado y queso de cabra con miel',
      'Gazpacho con tartar de vieiras o gambas',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Entrante individual de gala (a elegir)',
        desc: 'Txangurro a la Donostiarra, Ensalada templada de bogavante, Ensalada de perdiz escabechada, Pulpo a la brasa con migas de carbón, Tartar de vieiras/atún rojo o Carpaccio de carabineros',
      },
      {
        name: 'Pescado salvaje',
        desc: 'Lubina salvaje con verduritas en tempura sobre cremoso de coliflor',
      },
      {
        name: 'Carne a la brasa de leña (a elegir)',
        desc: 'Chuletón (1 Kg) a la brasa al gusto del cliente o Láminas de solomillo a la brasa',
      },
    ]),
    dessert: 'Selección de tartas y postres artesanos de la casa con helados al gusto',
    cellar: Object.freeze([
      'Champagne Francés Möet & Chandon oficial para todo el banquete',
      'Rioja Reserva Selección, Txakoli de autor, Agua mineral y Cafés',
    ]),
    soundIncluded: 'Acústica de gala S-Class completa: PA Bose F1 + monitores de jardín + actuación lírica',
  },
]);

/** Alias principal para los menús de temporada 2026 */
export const FINCA_MENUS_2026 = FINCA_BODA_MENUS_2026;

// ─────────────────────────────────────────────────────────────────────────────
// 2. MENÚS DE COMUNIÓN Y GRUPOS (SOPORTE MULTI-EVENTO COMPLEMENTARIO)
// ─────────────────────────────────────────────────────────────────────────────

export const FINCA_COMUNION_MENUS_2026: readonly FincaMenuPackage2026[] = Object.freeze([
  {
    id: 'comunion-paloma',
    category: 'comuniones',
    name: 'Menú Paloma Comunión',
    subtitle: 'Paleta de Jabugo, espárragos de Tudela, merluza rellena o entrecot',
    tag: '55 € + IVA',
    pricePerPaxEur: 55.0,
    pricePerPaxCents: 5500,
    highlight: 'Paleta de Jabugo + Pimientos rellenos de bacalao vizcaína + Entrecot a la plancha',
    cocktail: Object.freeze([
      'Entremeses fríos al centro: Paleta de Jabugo de bellota',
      'Espárragos de Tudela a las 2 salsas',
      'Puding de nécoras y rape con tosta de pan de pasas y nueces',
      'Degustación caliente: Pimiento del piquillo relleno de bacalao con salsa vizcaína',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Pescado o Carne a elegir',
        desc: 'Merluza del Cantábrico rellena de marisco en salsa mariscada o Entrecot a la plancha con patata panadera y pimientos del piquillo',
      },
    ]),
    dessert: 'Tarta casera a elegir: Trufa, San Marcos o 3 chocolates con helado artesano',
    cellar: Object.freeze(['Tinto Rioja Crianza, Rosado Navarro y Blanco Rueda, Refrescos, Cerveza, Agua y Café']),
    soundIncluded: 'Megafonía y música ambiental en salones',
  },
  {
    id: 'comunion-gorbea',
    category: 'comuniones',
    name: 'Menú Gorbea Comunión',
    subtitle: 'Cóctel San Francisco, langostinos a la plancha, merluza rellena y láminas de buey',
    tag: '65 € + IVA',
    pricePerPaxEur: 65.0,
    pricePerPaxCents: 6500,
    highlight: 'Cóctel San Francisco con canapés + 4 langostinos Cantábrico + Láminas de buey',
    cocktail: Object.freeze([
      'Cóctel de bienvenida: 2 Cucharas, 1 Hojaldre, Croquetas 2 gustos y Cóctel San Francisco',
      'Entremeses fríos: Jamón Ibérico, Puding de cabracho y Mousse de pato con puré de grosellas y manzana',
      'Marisco: 4 langostinos del Cantábrico a la plancha y 1 zamburiña',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Pescado & Carne combinados',
        desc: '1/2 Merluza rellena de frutos de mar + 1/2 Láminas de buey a la plancha',
      },
    ]),
    dessert: 'Tarta de Comunión San Marcos con helado al gusto',
    cellar: Object.freeze(['Tinto Rioja Crianza, Rosado y Blanco, Refrescos y chupito digestivo']),
    soundIncluded: 'Música ambiental + acceso a jardines y castillo hinchable',
  },
  {
    id: 'comunion-unbe',
    category: 'comuniones',
    name: 'Menú Unbe Comunión',
    subtitle: 'Surtido de fritos (4 variantes), 6 langostinos, merluza a la koskera y entrecot',
    tag: '70 € + IVA',
    pricePerPaxEur: 70.0,
    pricePerPaxCents: 7000,
    highlight: 'Fritos variados (rabas, gambas Orly, croquetas, nuggets) + Merluza Koskera + Entrecot',
    cocktail: Object.freeze([
      'Cóctel de bienvenida: 3 Cucharas, 1 Hojaldre y Cóctel San Francisco',
      'Jamón Ibérico, Lomo Ibérico y Puding de cabracho con tosta de pasas y nueces',
      'Surtido de fritos (4 variantes): rabas, gambas Orly, croquetas 2 gustos, nuggets y marquelitos',
      'Marisco: 6 langostinos del Cantábrico a la plancha',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Platos principales',
        desc: 'Merluza a la Koskera (salsa verde, almejas, espárrago y huevo cocido) + Entrecot a la plancha con guarnición',
      },
    ]),
    dessert: 'Tarta de San Marcos con helado de vainilla',
    cellar: Object.freeze(['Tinto Rioja Crianza, Rosado y Blanco Rueda, Agua, Refrescos, Café y Chupito de Licor']),
    soundIncluded: 'Sonorización en salones climatizados y jardines',
  },
  {
    id: 'comunion-akarlanda',
    category: 'comuniones',
    name: 'Menú Akarlanda Comunión',
    subtitle: 'El menú superior de comunión: Cigala del Cantábrico, gambas de Huelva, rape a la brasa y solomillo',
    tag: '95 € + IVA',
    pricePerPaxEur: 95.0,
    pricePerPaxCents: 9500,
    highlight: 'Cigala Cantábrico + 6 Gambas Huelva + Rape a la brasa con almejas + Medallones de solomillo',
    cocktail: Object.freeze([
      'Cóctel de bienvenida: 3 Cucharas, 1 Hojaldre, Croquetas 2 gustos y Cóctel San Francisco o Cava',
      'Jamón Ibérico de bellota cortado a cuchillo, Lomo de bellota y Ensalada de ventresca de bonito con anchoas',
      'Marisco por persona: 6 Gambas de Huelva blanquilla a la plancha, 1 Cigala del Cantábrico y 4 Langostinos extras',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Pescado por persona',
        desc: 'Rape a la brasa con almejas finas y patata panadera',
      },
      {
        name: 'Carne por persona',
        desc: 'Medallones de Solomillo con pimientos verdes y patatas caseras',
      },
    ]),
    dessert: 'Surtido de 3 pastelitos variados con helado o Tarta a elegir con helado',
    cellar: Object.freeze(['Vino Tinto Rioja Reserva, Rosado y Blanco, Cava Brut (1 botella cada 4 pax), Café y Copa de Licor']),
    soundIncluded: 'Sonorización completa + animación infantil',
  },
]);

export const FINCA_GRUPO_MENUS_2026: readonly FincaMenuPackage2026[] = Object.freeze([
  {
    id: 'grupo-menu1',
    category: 'grupos',
    name: 'Menú Grupos 1',
    subtitle: 'Comidas de empresa y grupos: Entrantes fríos, marisco, bacalao o entrecot',
    tag: '40 € + IVA · GRUPOS & CELEBRACIONES',
    pricePerPaxEur: 40.0,
    pricePerPaxCents: 4000,
    highlight: 'Mousse de foie + Marisco plancha + Bacalao a la Bizkaina o Entrecot',
    cocktail: Object.freeze([
      'Entrantes fríos al centro: Mousse de foie con lágrimas de manzana y frambuesa',
      'Ensalada de cogollos de Tudela con anchoas del Cantábrico',
      'Pudin de nécoras y rape con salsa cóctel',
      'Degustación caliente: Pimiento relleno de marisco y Penca rellena de carne',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Marisco plancha',
        desc: '3 Langostinos + 1 Zamburiña a la plancha',
      },
      {
        name: 'Plato principal a elegir',
        desc: 'Bacalao a la Bizkaina tradicional o Entrecot a la parrilla con guarnición',
      },
    ]),
    dessert: 'Tarta San Marcos con helado de vainilla',
    cellar: Object.freeze(['Tinto Rioja Crianza o Rosado, Blanco Rueda, Refrescos, Cerveza, Agua, Cava y Café']),
    soundIncluded: 'Megafonía para discursos corporativos',
  },
  {
    id: 'grupo-menu4',
    category: 'grupos',
    name: 'Menú Grupos 4',
    subtitle: 'Aperitivos de bienvenida, ensalada de pulpo, vieira al horno, lenguado o solomillo',
    tag: '61 € + IVA · EMPRESA PREMIUM',
    pricePerPaxEur: 61.0,
    pricePerPaxCents: 6100,
    highlight: 'Vieira gratinada horno de leña + Lenguado relleno de txangurro o Solomillo gorgonzola',
    cocktail: Object.freeze([
      'Aperitivos de bienvenida fríos y calientes con Cóctel Tropical',
      'Jamón y Lomo de Bellota al centro de la mesa',
      'Entrante individual: Ensalada de pulpo, panadera y piquillos',
      'Entrante caliente individual: Vieira gratinada al horno de leña',
    ]),
    mainCourses: Object.freeze([
      {
        name: 'Plato principal a elegir',
        desc: 'Lenguado relleno de Txangurro o Solomillo al gusto del cliente (salsa Gorgonzola o pimienta)',
      },
    ]),
    dessert: 'Especial tarta de hojaldre y helado de mandarina',
    cellar: Object.freeze(['Tinto Rioja Reserva Ondarre, Moscato o Lambrusco, Blanco Rueda, Cava y Café']),
    soundIncluded: 'Sonorización y pantalla de proyección 4K para presentaciones',
  },
]);

/** Catálogo completo que consolida todas las categorías */
export const ALL_FINCA_MENUS_2026: readonly FincaMenuPackage2026[] = Object.freeze([
  ...FINCA_BODA_MENUS_2026,
  ...FINCA_COMUNION_MENUS_2026,
  ...FINCA_GRUPO_MENUS_2026,
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. LOS 16 EXTRAS Y COMPLEMENTOS OFICIALES (ZONA CERO)
// ─────────────────────────────────────────────────────────────────────────────

export const FINCA_EXTRAS_2026: readonly FincaComplemento2026[] = Object.freeze([
  {
    id: 'barra-libre-extra',
    name: 'Barra Libre Adicional (Oferta 3x2)',
    priceEur: 15.0,
    priceCents: 1500,
    isPerPax: true,
    category: 'barra_libre',
    desc: '15 € por persona y hora con marcas premium y coctelería (oferta 3 horas al precio de 2)',
  },
  {
    id: 'exclusividad-premium',
    name: 'Opción Exclusividad Premium (hasta 100 pax)',
    priceEur: 3000.0,
    priceCents: 300000,
    isPerPax: false,
    category: 'exclusividad',
    desc: 'Todo incluido hasta las 12:00 de la noche: DJ profesional, BARRA LIBRE (3 horas) y RECENA completa',
  },
  {
    id: 'solista-edwin',
    name: 'Actuación Solista de Gala — Edwin Agudelo (SSOT)',
    priceEur: TARIFA_BASE_SOLISTA_EUR, // 350.00 € canónicos
    priceCents: 35000,
    isPerPax: false,
    category: 'audiovisual',
    desc: 'Voz lírica y repertorio de gala para ceremonia civil o cóctel de bienvenida (tarifa base SSOT)',
  },
  {
    id: 'dj-residente',
    name: 'Servicio de DJ Residente (3 horas)',
    priceEur: 350.0,
    priceCents: 35000,
    isPerPax: false,
    category: 'audiovisual',
    desc: 'DJ profesional con cabina, iluminación robotizada y microfonía inalámbrica',
  },
  {
    id: 'carpas-ceremonia',
    name: 'Carpas para Ceremonia Civil en Jardín con Oficiante',
    priceEur: 500.0,
    priceCents: 50000,
    isPerPax: false,
    category: 'ceremonia',
    desc: 'Montaje de carpas, megafonía inalámbrica, audifonía y oficiante de ceremonia civil',
  },
  {
    id: 'coches-clasicos',
    name: 'Coches Clásicos con Conductor',
    priceEur: 600.0,
    priceCents: 60000,
    isPerPax: false,
    category: 'transporte',
    desc: 'Desde 600 € según dossier oficial: vehículo histórico restaurado con chófer de gala para el traslado de los novios',
  },
  {
    id: 'autobus-invitados',
    name: 'Servicio de Autobús (55 plazas)',
    priceEur: 550.0,
    priceCents: 55000,
    isPerPax: false,
    category: 'transporte',
    desc: 'Desde 550 € según dossier oficial: traslado de ida y vuelta para invitados desde Gipuzkoa o Bizkaia',
  },
  {
    id: 'aurresku',
    name: 'Aurresku de Honor Tradicional',
    priceEur: 400.0,
    priceCents: 40000,
    isPerPax: false,
    category: 'ceremonia',
    desc: 'Dantzari y txistulari en vivo a la salida de la ceremonia en los jardines (400 € oficiales)',
  },
  {
    id: 'cortador-jamon',
    name: 'Cortador Profesional de Jamón Ibérico',
    priceEur: 250.0,
    priceCents: 25000,
    isPerPax: false,
    category: 'gastronomia',
    desc: 'Desde 250 € según dossier oficial: corte en directo de jamón de bellota durante el cóctel',
  },
  {
    id: 'orquesta',
    name: 'Servicio de Orquesta en Vivo',
    priceEur: 800.0,
    priceCents: 80000,
    isPerPax: false,
    category: 'audiovisual',
    desc: 'Formación musical en directo para el baile posterior al banquete (800 € oficiales)',
  },
  {
    id: 'audio-proyeccion',
    name: 'Servicio de Audio y Proyección',
    priceEur: 100.0,
    priceCents: 10000,
    isPerPax: false,
    category: 'audiovisual',
    desc: 'Desde 100 € según dossier oficial: sonorización adicional y pantalla para discursos o vídeo',
  },
  {
    id: 'exclusividad-salon',
    name: 'Exclusividad de Salón',
    priceEur: 1000.0,
    priceCents: 100000,
    isPerPax: false,
    category: 'exclusividad',
    desc: 'Reserva íntegra del salón para el evento, sin otros comensales en la casa (1.000 € oficiales)',
  },
  {
    id: 'candy-bar',
    name: 'Candy Bar & Mesa Dulce Artesanal',
    priceEur: 250.0,
    priceCents: 25000,
    isPerPax: false,
    category: 'animacion',
    desc: 'Carro artesanal decorado con gominolas premium, bombones y repostería artesana',
  },
  {
    id: 'photocall',
    name: 'Photocall Temático Personalizado',
    priceEur: 250.0,
    priceCents: 25000,
    isPerPax: false,
    category: 'animacion',
    desc: 'Fondo decorativo con atrezo divertido e iluminación profesional para fotos de recuerdo',
  },
  {
    id: 'fuente-chocolate',
    name: 'Fuente de Chocolate con Frutas y Gominolas',
    priceEur: 350.0,
    priceCents: 35000,
    isPerPax: false,
    category: 'animacion',
    desc: 'Cascada de chocolate belga con brochetas de fruta fresca de temporada',
  },
  {
    id: 'hinchables',
    name: 'Castillo Hinchable Infantil en Jardines',
    priceEur: 300.0,
    priceCents: 30000,
    isPerPax: false,
    category: 'animacion',
    desc: 'Castillo hinchable homologado con monitor hasta las 22:00 horas',
  },
]);

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAPAS DE BÚSQUEDA INDEXADOS O(1)
// ─────────────────────────────────────────────────────────────────────────────

const MENUS_MAP = new Map<string, FincaMenuPackage2026>(
  ALL_FINCA_MENUS_2026.map((m) => [m.id, m]),
);

const EXTRAS_MAP = new Map<string, FincaComplemento2026>(
  FINCA_EXTRAS_2026.map((e) => [e.id, e]),
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. TYPE GUARDS Y FUNCIONES AUXILIARES DE CONSULTA
// ─────────────────────────────────────────────────────────────────────────────

/** Type guard para verificar si un ID corresponde a un menú de boda */
export function isFincaBodaMenuId(id: string): id is FincaBodaMenuId {
  return FINCA_BODA_MENUS_2026.some((m) => m.id === id);
}

/** Type guard para verificar si un ID corresponde a cualquier menú del catálogo */
export function isFincaMenuId(id: string): id is FincaMenuId {
  return MENUS_MAP.has(id);
}

/** Type guard para verificar si un ID corresponde a un extra válido */
export function isFincaExtraId(id: string): id is FincaExtraId {
  return EXTRAS_MAP.has(id);
}

/** Obtiene la ficha completa de un menú por su ID */
export function getFincaMenuById(menuId: string): FincaMenuPackage2026 | undefined {
  return MENUS_MAP.get(menuId);
}

/** Obtiene la ficha de un extra por su ID */
export function getFincaExtraById(extraId: string): FincaComplemento2026 | undefined {
  return EXTRAS_MAP.get(extraId);
}

/** Retorna la lista inmutable de los 7 menús de boda */
export function getAllFincaMenus2026(): readonly FincaMenuPackage2026[] {
  return FINCA_BODA_MENUS_2026;
}

/** Retorna todos los menús del catálogo (incluye comuniones y grupos) */
export function getAllFincaMenusAllCategories(): readonly FincaMenuPackage2026[] {
  return ALL_FINCA_MENUS_2026;
}

/** Retorna la lista inmutable de los 16 extras */
export function getAllFincaExtras2026(): readonly FincaComplemento2026[] {
  return FINCA_EXTRAS_2026;
}

/** Filtra menús por categoría */
export function getFincaMenusByCategory(category: FincaMenuCategory): readonly FincaMenuPackage2026[] {
  return ALL_FINCA_MENUS_2026.filter((m) => m.category === category);
}

/** Filtra extras por categoría de servicio */
export function getFincaExtrasByCategory(category: FincaComplementoCategory): readonly FincaComplemento2026[] {
  return FINCA_EXTRAS_2026.filter((e) => e.category === category);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VALIDADOR DE INTEGRIDAD SSOT Y MATEMÁTICA EN CÉNTIMOS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida la integridad estricta del catálogo en tiempo de ejecución o pruebas:
 * - Todos los importes en céntimos coinciden exactamente con EUR * 100.
 * - Todos los importes son enteros positivos.
 * - Ningún ID está duplicado.
 * - La tarifa del solista coincide con TARIFA_BASE_SOLISTA_EUR.
 * - Hay exactamente 7 menús de boda y 16 extras canónicos.
 */
export function validateFincaCatalogIntegrity(): FincaCatalogValidationResult {
  const errors: string[] = [];

  // Verificar cantidad de menús de boda
  if (FINCA_BODA_MENUS_2026.length !== 7) {
    errors.push(`FINCA_BODA_MENUS_2026 debe contener exactamente 7 menús, contiene ${FINCA_BODA_MENUS_2026.length}`);
  }

  // Verificar cantidad de extras
  if (FINCA_EXTRAS_2026.length !== 16) {
    errors.push(`FINCA_EXTRAS_2026 debe contener exactamente 16 extras, contiene ${FINCA_EXTRAS_2026.length}`);
  }

  // Validar coherencia matemática en menús
  for (const menu of ALL_FINCA_MENUS_2026) {
    const expectedCents = Math.round(menu.pricePerPaxEur * 100);
    if (menu.pricePerPaxCents !== expectedCents) {
      errors.push(`Menú ${menu.id}: pricePerPaxCents (${menu.pricePerPaxCents}) != expected (${expectedCents})`);
    }
    if (!Number.isInteger(menu.pricePerPaxCents) || menu.pricePerPaxCents <= 0) {
      errors.push(`Menú ${menu.id}: pricePerPaxCents debe ser un entero positivo, valor: ${menu.pricePerPaxCents}`);
    }
  }

  // Validar coherencia matemática en extras
  for (const extra of FINCA_EXTRAS_2026) {
    const expectedCents = Math.round(extra.priceEur * 100);
    if (extra.priceCents !== expectedCents) {
      errors.push(`Extra ${extra.id}: priceCents (${extra.priceCents}) != expected (${expectedCents})`);
    }
    if (!Number.isInteger(extra.priceCents) || extra.priceCents <= 0) {
      errors.push(`Extra ${extra.id}: priceCents debe ser un entero positivo, valor: ${extra.priceCents}`);
    }
  }

  // Validar concordancia de Solista Edwin con SSOT canónico
  const solistaExtra = EXTRAS_MAP.get('solista-edwin');
  if (!solistaExtra) {
    errors.push("Falta el extra obligatorio 'solista-edwin'");
  } else if (solistaExtra.priceEur !== TARIFA_BASE_SOLISTA_EUR) {
    errors.push(`'solista-edwin' priceEur (${solistaExtra.priceEur}) != TARIFA_BASE_SOLISTA_EUR (${TARIFA_BASE_SOLISTA_EUR})`);
  }

  return {
    isValid: errors.length === 0,
    errors: Object.freeze(errors),
    menuCount: ALL_FINCA_MENUS_2026.length,
    extraCount: FINCA_EXTRAS_2026.length,
  };
}

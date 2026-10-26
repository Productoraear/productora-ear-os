'use client';

import React, { useEffect, useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Users,
  CheckCircle2,
  Sparkles,
  Phone,
  Volume2,
  Utensils,
  Award,
  CreditCard,
  Gift,
  Wine,
  CalendarCheck
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export interface MenuItem {
  name: string;
  desc: string;
}

export interface MenuPackage {
  id: string;
  category: 'bodas' | 'comuniones' | 'grupos';
  name: string;
  subtitle: string;
  tag: string;
  pricePerPax: number;
  highlight: string;
  cocktail: string[];
  mainCourses: MenuItem[];
  dessert: string;
  cellar: string[];
  soundIncluded: string;
  bonus?: string;
}

export const OFFICIAL_OTZARRETA_MENUS: MenuPackage[] = [
  // ── MENÚS BODAS 2026 (OFICIALES EDUARDO MARTÍNEZ) ──
  {
    id: 'boda-cantabrico',
    category: 'bodas',
    name: 'Menú Cantábrico',
    subtitle: 'El clásico atlántico: Marisco a la plancha, merluza o bacalao y entrecotte al carbón',
    tag: '100 € + IVA · CLÁSICO NUPCIAL',
    pricePerPax: 100,
    highlight: 'Marisco individual (4 langostinos Caribe, 2 venezolanos, 1 zamburiña) + Entrecotte a la brasa',
    cocktail: [
      'Cóctel de Cava con selección de variedades de la casa',
      'Canapés selectos de gala: 3 fríos + 3 calientes',
      'Entremeses fríos al centro: Jamón y Lomo Ibérico de bellota',
      'Ensalada de ventresca de bonito del norte con tomate de la huerta',
      'Pastel artesanal de kabratxo con tosta de pan crujiente'
    ],
    mainCourses: [
      {
        name: 'Marisco a la plancha individual',
        desc: '4 Langostinos del Caribe, 2 Langostinos Extras Venezolanos y 1 Zamburiña selecta a la brasa'
      },
      {
        name: 'Pescado noble a elegir',
        desc: 'Lomos de Merluza del Cantábrico en salsa verde tradicional o Bacalao al Pil-pil'
      },
      {
        name: 'Carne a la brasa a elegir',
        desc: 'Taco de Entrecotte en su jugo a la brasa con Pastel de Patata y Beicon o Carrilleras de Ternera confitadas'
      }
    ],
    dessert: 'Tarta San Marcos sobre fondo de crema inglesa y helado artesano de vainilla',
    cellar: [
      'D.O.Ca. Rioja Crianza Bodegas Olarra',
      'Rosado Navarro Selección & Blanco Rueda Verdejo',
      'Agua mineral, Copa de Cava y Cafés'
    ],
    soundIncluded: 'Sonorización ambiental en cóctel y banquete homologada (Ley 37/2003)'
  },
  {
    id: 'boda-paloma',
    category: 'bodas',
    name: 'Menú Paloma',
    subtitle: 'Cortador de jamón en vivo, parrillada marina, rodaballo salvaje y lechazo asado',
    tag: '125 € + IVA · PARRILLA & MAR',
    pricePerPax: 125,
    highlight: 'Maestro cortador de jamón + Trancha de rodaballo salvaje + Lechazo asado de Castilla',
    cocktail: [
      'Cortador de Jamón profesional en vivo en los jardines',
      'Cóctel de Cava con 6 canapés fríos + 6 calientes elaborados al momento',
      'Entremeses individuales: Surtido de Jamón y Lomo de bellota, Cecina y Cuña de queso curado',
      'Mini ensalada de bacalao en emulsión de pisto tradicional'
    ],
    mainCourses: [
      {
        name: 'Parrillada de marisco individual',
        desc: '6 Langostinos medianos del Caribe, 2 Langostinos Extra Venezolanos y 1 Zamburiña a la parrilla'
      },
      {
        name: 'Trancha de Rodaballo salvaje con patata panadera',
        desc: 'Pescado salvaje al horno con su refrito tradicional de ajos y guindilla + Sorbete de mango'
      },
      {
        name: 'Carne a elegir',
        desc: 'Lechazo asado de Castilla con ensalada de la huerta o Taco de Entrecotte braseado al aroma de encina'
      }
    ],
    dessert: 'Pantxineta rellena de crema y nata con tulipa de chocolate y helado de mandarina o Canutillo de Bilbao',
    cellar: [
      'Rioja Crianza Bodegas Olarra, Rosado Chivite y Blanco Verdejo',
      'Agua mineral, Copa de Cava, Cafés y Copa de licor digestivo'
    ],
    soundIncluded: 'Hardware acústico Bose S1 Pro para cóctel en jardines y salones'
  },
  {
    id: 'boda-imperial',
    category: 'bodas',
    name: 'Menú Especial Imperial',
    subtitle: 'Oferta con regalo incluido: 1 h de Barra Libre + 1 h de DJ residente',
    tag: 'OFERTA 123,40 € + IVA (Tarifa 138,40 €)',
    pricePerPax: 123.4,
    bonus: '🎁 REGALO INCLUIDO: 1 hora de barra libre + 1 hora de DJ en directo',
    highlight: 'Nécoras con rape + Foie micuit + Milhojas de bacalao con txangurro + Solomillo trufado',
    cocktail: [
      'Tabla de ibéricos individual: Jamón Ibérico, Lomo de Bellota, Cecina y Cuña de queso',
      'Degustación puding de nécoras con rape sobre pastel de puerros y hongos',
      'Mini paté de foie (micuit) con purés de grosellas y manzanas',
      'Crujiente de hojaldre caliente relleno de setas de temporada (Edulis) y gambas de Huelva'
    ],
    mainCourses: [
      {
        name: 'Directamente del mar (a elegir)',
        desc: 'Milhojas de Bacalao con Txangurro al Pil-Pil sobre toque de Bizkaina, Merluza rellena de marisco o Lomo de Sapito de Rape asado al horno de leña'
      },
      {
        name: 'Carne a elegir',
        desc: 'Solomillo a la plancha con aceite trufado y verduras, Cordero de Castilla al horno de leña o Láminas de ganado mayor a la parrilla'
      }
    ],
    dessert: 'Especial tarta Florentina rellena de trufa con helado (mango, mandarina) sobre tulipa de chocolate',
    cellar: [
      'Rioja Crianza Bodegas Olarra, Rosado Navarro y Blanco Rueda',
      'Agua, Copa de Cava, Cafés + 1 HORA DE BARRA LIBRE GRATUITA'
    ],
    soundIncluded: '1 hora de DJ profesional con cabina Pioneer y sonorización de pista'
  },
  {
    id: 'boda-temporada',
    category: 'bodas',
    name: 'Menú Temporada',
    subtitle: 'Cortador de jamón ibérico incluido, bogavante del país, almejas gallegas y lubina',
    tag: '142,50 € + IVA · ALTA COCINA VASCA',
    pricePerPax: 142.5,
    highlight: '1/2 Bogavante del país + Cigala cantábrica + Almejas gallegas + Solomillo o buey',
    cocktail: [
      'Maestro cortador de jamón (Jamón Ibérico incluido en el precio)',
      'Cóctel de gala en jardines: 5 fríos + 5 calientes + Cóctel Tropical y Rincón de Cervezas',
      'Almejas gallegas al centro de mesa: salsa Marinera o Verde tradicional'
    ],
    mainCourses: [
      {
        name: 'Marisco a la plancha individual',
        desc: '1 Cigala del Cantábrico, 1/2 Bogavante del País y 1 Zamburiña a la plancha'
      },
      {
        name: 'Pescado noble (a elegir)',
        desc: 'Rape en salsa con patata panadera o Lubina salvaje braseada + Sorbete al gusto (limón al cava, mango, manzana o mandarina)'
      },
      {
        name: 'Carne a elegir',
        desc: 'Cordero lechal de Castilla asado de leña, Solomillo a la plancha con pimientos o Láminas de buey gallego a la brasa al aroma de encina'
      }
    ],
    dessert: 'Tarta Variedades de la Casa con helado artesano sobre tulipa de chocolate',
    cellar: [
      'Tinto Reserva Ondarre, Rosado Chivite y Blanco Rueda Verdejo o Txakoli bizkaino',
      'Copa de Cava y Cafés de especialidad'
    ],
    soundIncluded: 'Sonorización Bose S1 Pro / F1 para salones y zona exterior de cóctel'
  },
  {
    id: 'boda-vasco',
    category: 'bodas',
    name: 'Menú Vasco',
    subtitle: 'El pack más completo: 2 h Barra Libre + 2 h DJ + Autobús 55 pax + Decoración floral',
    tag: 'OFERTA 138,00 € + IVA (Tarifa 153 €)',
    pricePerPax: 138,
    bonus: '🎁 INCLUYE: 2 h barra libre + 2 h DJ + Autobús 55 pax + Decoración floral + Degustación 6 pax',
    highlight: 'Autobús incluido + Barra libre 2h + DJ + Chuleta 500g brasa o Solomillo',
    cocktail: [
      'Cóctel de 5 cucharas + 1 brocheta + 1 hojaldre + 1 fritura + Mesa de quesos variados',
      'Cortador de jamón profesional en jardines',
      'Foie micuit con pasas y nueces',
      'Mini ensalada de ventresca de bonito de Santoña con anchoas y pimientos asados'
    ],
    mainCourses: [
      {
        name: 'Directamente del mar (a elegir)',
        desc: 'Milhojas de Bacalao con Txangurro al pil-pil sobre toque del chef o Rape salvaje a la brasa con Bilbaína + Sorbete al gusto'
      },
      {
        name: 'Carne a elegir',
        desc: 'Láminas de Solomillo y hongos con pastel de patata, beicon y salsa de Oporto o Chuleta (500 gr.) a la brasa con pimientos y patatas'
      }
    ],
    dessert: 'Pantxineta de crema y nata con tulipa y helado, Canutillo de Bilbao, Goxua tradicional o Tarta Nupcial',
    cellar: [
      'Rioja Reserva, Txakoli bizkaino, Copa de Cava, Cafés y Licores (Escocés o Valenciano)',
      '2 HORAS DE BARRA LIBRE COMPLETAS INCLUIDAS'
    ],
    soundIncluded: '2 horas de DJ profesional + megafonía + iluminación ambiental de pista'
  },
  {
    id: 'boda-ezkertza',
    category: 'bodas',
    name: 'Menú Ezkertza',
    subtitle: 'El festín de los reyes del marisco: Chuletón de 1 Kg a la brasa y Bogavante del Cantábrico',
    tag: '155 € + IVA · CHULETÓN & BOGAVANTE',
    pricePerPax: 155,
    highlight: 'Chuletón de 1 Kg brasa + 1/2 Bogavante Cantábrico + Almeja fina gallega + Gambas Huelva',
    cocktail: [
      'Cóctel en jardines con bebidas variadas (45 min): vinos, crianza, moscato, refrescos',
      'Canapés: 5 fríos + 5 calientes + Rincón de Anchoas selectas + Mesa de Quesos del país',
      'Cortador de jamón profesional en directo'
    ],
    mainCourses: [
      {
        name: 'Variedad de marisco a la plancha con aceite de brasa natural',
        desc: '1 Cigala del Cantábrico, 2 Langostinos extra venezolanos, 4 Gambas blanquilla de Huelva, 1/2 Bogavante del Cantábrico + Almeja fina gallega al centro (plancha con refrito, salsa verde o marinera)'
      },
      {
        name: 'Directamente del mar (a elegir una)',
        desc: 'Milhojas de Bacalao con Txangurro al Pil-Pil, Merluza rellena de marisco o Lomo de sapito de rape al horno de leña + Sorbete'
      },
      {
        name: 'Carne mayor (a elegir una)',
        desc: 'Chuletón 1 Kg con ensalada de la huerta, patatas y pimientos o Solomillo a la plancha con aceite trufado'
      }
    ],
    dessert: 'Especial tarta de hojaldre rellena de trufa con helado al gusto sobre tulipa de chocolate',
    cellar: [
      'Rioja Reserva Ondarre, Rosado Navarro y Txakoli bizkaino',
      'Copa de Cava, Cafés de autor y Combinado'
    ],
    soundIncluded: 'Sonorización completa de gala Bose F1 (12 W/pax) con atril y microfonía'
  },
  {
    id: 'boda-caserio-beko',
    category: 'bodas',
    name: 'Menú Caserío Ezkertza Beko',
    subtitle: 'La cumbre gastronómica: Möet & Chandon, huevo a baja temperatura, bogavante y chuletón',
    tag: '173 € + IVA · MÖET & CHANDON SUPREME',
    pricePerPax: 173,
    highlight: 'Champagne Möet & Chandon + Txangurro a la Donostiarra + Chuletón 1 Kg + Pulpo brasa',
    cocktail: [
      'Cóctel en el jardín: Cortador de jamón o salmón y Mesa de quesos del país',
      'Huevo a baja temperatura sobre parmentier con hongos, setas o mollejas',
      'Mini talo con txistorra de Arbizu o morcilla de Beasain',
      'Fritos artesanos, brochetas de langostinos en tempura y pulpo con delicias de mango',
      'Mini-tostas de Wayu, anchoas con pimiento asado y queso de cabra con miel',
      'Gazpacho con tartar de vieiras o gambas'
    ],
    mainCourses: [
      {
        name: 'Entrante individual de gala (a elegir)',
        desc: 'Txangurro a la Donostiarra, Ensalada templada de bogavante, Ensalada de perdiz escabechada, Pulpo a la brasa con migas de carbón, Tartar de vieiras/atún rojo o Carpaccio de carabineros'
      },
      {
        name: 'Pescado salvaje',
        desc: 'Lubina salvaje con verduritas en tempura sobre cremoso de coliflor'
      },
      {
        name: 'Carne a la brasa de leña (a elegir)',
        desc: 'Chuletón (1 Kg) a la brasa al gusto del cliente o Láminas de solomillo a la brasa'
      }
    ],
    dessert: 'Selección de tartas y postres artesanos de la casa con helados al gusto',
    cellar: [
      'Champagne Francés Möet & Chandon oficial para todo el banquete',
      'Rioja Reserva Selección, Txakoli de autor, Agua mineral y Cafés'
    ],
    soundIncluded: 'Acústica de gala S-Class completa: PA Bose F1 + monitores de jardín + actuación lírica'
  },

  // ── MENÚS COMUNIONES 2025/2027 ──
  {
    id: 'comunion-paloma',
    category: 'comuniones',
    name: 'Menú Paloma Comunión',
    subtitle: 'Paleta de Jabugo, espárragos de Tudela, merluza rellena o entrecot',
    tag: '52 € - 55 € + IVA',
    pricePerPax: 55,
    highlight: 'Paleta de Jabugo + Pimientos rellenos de bacalao vizcaína + Entrecot a la plancha',
    cocktail: [
      'Entremeses fríos al centro: Paleta de Jabugo de bellota',
      'Espárragos de Tudela a las 2 salsas',
      'Puding de nécoras y rape con tosta de pan de pasas y nueces',
      'Degustación caliente: Pimiento del piquillo relleno de bacalao con salsa vizcaína'
    ],
    mainCourses: [
      {
        name: 'Pescado o Carne a elegir',
        desc: 'Merluza del Cantábrico rellena de marisco en salsa mariscada o Entrecot a la plancha con patata panadera y pimientos del piquillo'
      }
    ],
    dessert: 'Tarta casera a elegir: Trufa, San Marcos o 3 chocolates con helado artesano',
    cellar: ['Tinto Rioja Crianza, Rosado Navarro y Blanco Rueda, Refrescos, Cerveza, Agua y Café'],
    soundIncluded: 'Megafonía y música ambiental en salones'
  },
  {
    id: 'comunion-gorbea',
    category: 'comuniones',
    name: 'Menú Gorbea Comunión',
    subtitle: 'Cóctel San Francisco, langostinos a la plancha, merluza rellena y láminas de buey',
    tag: '58 € - 65 € + IVA',
    pricePerPax: 65,
    highlight: 'Cóctel San Francisco con canapés + 4 langostinos Cantábrico + Láminas de buey',
    cocktail: [
      'Cóctel de bienvenida: 2 Cucharas, 1 Hojaldre, Croquetas 2 gustos y Cóctel San Francisco',
      'Entremeses fríos: Jamón Ibérico, Puding de cabracho y Mousse de pato con puré de grosellas y manzana',
      'Marisco: 4 langostinos del Cantábrico a la plancha y 1 zamburiña'
    ],
    mainCourses: [
      {
        name: 'Pescado & Carne combinados',
        desc: '1/2 Merluza rellena de frutos de mar + 1/2 Láminas de buey a la plancha'
      }
    ],
    dessert: 'Tarta de Comunión San Marcos con helado al gusto',
    cellar: ['Tinto Rioja Crianza, Rosado y Blanco, Refrescos y chupito digestivo'],
    soundIncluded: 'Música ambiental + acceso a jardines y castillo hinchable'
  },
  {
    id: 'comunion-unbe',
    category: 'comuniones',
    name: 'Menú Unbe Comunión',
    subtitle: 'Surtido de fritos (4 variantes), 6 langostinos, merluza a la koskera y entrecot',
    tag: '67 € - 70 € + IVA',
    pricePerPax: 70,
    highlight: 'Fritos variados (rabas, gambas Orly, croquetas, nuggets) + Merluza Koskera + Entrecot',
    cocktail: [
      'Cóctel de bienvenida: 3 Cucharas, 1 Hojaldre y Cóctel San Francisco',
      'Jamón Ibérico, Lomo Ibérico y Puding de cabracho con tosta de pasas y nueces',
      'Surtido de fritos (4 variantes): rabas, gambas Orly, croquetas 2 gustos, nuggets y marquelitos',
      'Marisco: 6 langostinos del Cantábrico a la plancha'
    ],
    mainCourses: [
      {
        name: 'Platos principales',
        desc: 'Merluza a la Koskera (salsa verde, almejas, espárrago y huevo cocido) + Entrecot a la plancha con guarnición'
      }
    ],
    dessert: 'Tarta de San Marcos con helado de vainilla',
    cellar: ['Tinto Rioja Crianza, Rosado y Blanco Rueda, Agua, Refrescos, Café y Chupito de Licor'],
    soundIncluded: 'Sonorización en salones climatizados y jardines'
  },
  {
    id: 'comunion-akarlanda',
    category: 'comuniones',
    name: 'Menú Akarlanda Comunión',
    subtitle: 'El menú superior de comunión: Cigala del Cantábrico, gambas de Huelva, rape a la brasa y solomillo',
    tag: '90 € - 95 € + IVA',
    pricePerPax: 95,
    highlight: 'Cigala Cantábrico + 6 Gambas Huelva + Rape a la brasa con almejas + Medallones de solomillo',
    cocktail: [
      'Cóctel de bienvenida: 3 Cucharas, 1 Hojaldre, Croquetas 2 gustos y Cóctel San Francisco o Cava',
      'Jamón Ibérico de bellota cortado a cuchillo, Lomo de bellota y Ensalada de ventresca de bonito con anchoas',
      'Marisco por persona: 6 Gambas de Huelva blanquilla a la plancha, 1 Cigala del Cantábrico y 4 Langostinos extras'
    ],
    mainCourses: [
      {
        name: 'Pescado por persona',
        desc: 'Rape a la brasa con almejas finas y patata panadera'
      },
      {
        name: 'Carne por persona',
        desc: 'Medallones de Solomillo con pimientos verdes y patatas caseras'
      }
    ],
    dessert: 'Surtido de 3 pastelitos variados con helado o Tarta a elegir con helado',
    cellar: ['Vino Tinto Rioja Reserva, Rosado y Blanco, Cava Brut (1 botella cada 4 pax), Café y Copa de Licor'],
    soundIncluded: 'Sonorización completa + animación infantil'
  },

  // ── MENÚS GRUPOS Y EMPRESA ──
  {
    id: 'grupo-menu1',
    category: 'grupos',
    name: 'Menú Grupos 1',
    subtitle: 'Comidas de empresa y grupos: Entrantes fríos, marisco, bacalao o entrecot',
    tag: '40 € + IVA · GRUPOS & CELEBRACIONES',
    pricePerPax: 40,
    highlight: 'Mousse de foie + Marisco plancha + Bacalao a la Bizkaina o Entrecot',
    cocktail: [
      'Entrantes fríos al centro: Mousse de foie con lágrimas de manzana y frambuesa',
      'Ensalada de cogollos de Tudela con anchoas del Cantábrico',
      'Pudin de nécoras y rape con salsa cóctel',
      'Degustación caliente: Pimiento relleno de marisco y Penca rellena de carne'
    ],
    mainCourses: [
      {
        name: 'Marisco plancha',
        desc: '3 Langostinos + 1 Zamburiña a la plancha'
      },
      {
        name: 'Plato principal a elegir',
        desc: 'Bacalao a la Bizkaina tradicional o Entrecot a la parrilla con guarnición'
      }
    ],
    dessert: 'Tarta San Marcos con helado de vainilla',
    cellar: ['Tinto Rioja Crianza o Rosado, Blanco Rueda, Refrescos, Cerveza, Agua, Cava y Café'],
    soundIncluded: 'Megafonía para discursos corporativos'
  },
  {
    id: 'grupo-menu4',
    category: 'grupos',
    name: 'Menú Grupos 4',
    subtitle: 'Aperitivos de bienvenida, ensalada de pulpo, vieira al horno, lenguado o solomillo',
    tag: '61 € + IVA · EMPRESA PREMIUM',
    pricePerPax: 61,
    highlight: 'Vieira gratinada horno de leña + Lenguado relleno de txangurro o Solomillo gorgonzola',
    cocktail: [
      'Aperitivos de bienvenida fríos y calientes con Cóctel Tropical',
      'Jamón y Lomo de Bellota al centro de la mesa',
      'Entrante individual: Ensalada de pulpo, panadera y piquillos',
      'Entrante caliente individual: Vieira gratinada al horno de leña'
    ],
    mainCourses: [
      {
        name: 'Plato principal a elegir',
        desc: 'Lenguado relleno de Txangurro o Solomillo al gusto del cliente (salsa Gorgonzola o pimienta)'
      }
    ],
    dessert: 'Especial tarta de hojaldre y helado de mandarina',
    cellar: ['Tinto Rioja Reserva Ondarre, Moscato o Lambrusco, Blanco Rueda, Cava y Café'],
    soundIncluded: 'Sonorización y pantalla de proyección 4K para presentaciones'
  }
];

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  perPax?: boolean;
  desc: string;
}

export const OFFICIAL_EXTRAS: AdditionalService[] = [
  {
    id: 'barra-libre-extra',
    name: 'Barra Libre Adicional (Oferta 3x2)',
    price: 15,
    perPax: true,
    desc: '15 € por persona y hora con marcas premium y coctelería (oferta 3 horas al precio de 2)'
  },
  {
    id: 'exclusividad-premium',
    name: 'Opción Exclusividad Premium (hasta 100 pax)',
    price: 3000,
    perPax: false,
    desc: 'Todo incluido hasta las 12:00 de la noche: DJ profesional, BARRA LIBRE (3 horas) y RECENA completa'
  },
  {
    id: 'solista-edwin',
    name: 'Actuación Solista de Gala — Edwin Agudelo (SSOT)',
    price: 350,
    perPax: false,
    desc: 'Voz lírica y repertorio de gala para ceremonia civil o cóctel de bienvenida (tarifa base SSOT)'
  },
  {
    id: 'dj-residente',
    name: 'Servicio de DJ Residente (3 horas)',
    price: 350,
    perPax: false,
    desc: 'DJ profesional con cabina, iluminación robotizada y microfonía inalámbrica'
  },
  {
    id: 'carpas-ceremonia',
    name: 'Carpas para Ceremonia Civil en Jardín con Oficiante',
    price: 500,
    perPax: false,
    desc: 'Montaje de carpas, megafonía inalámbrica, audifonía y oficiante de ceremonia civil'
  },
  {
    id: 'coches-clasicos',
    name: 'Coches Clásicos con Conductor',
    price: 600,
    perPax: false,
    desc: 'Desde 600 € según dossier oficial: vehículo histórico restaurado con chófer de gala para el traslado de los novios'
  },
  {
    id: 'autobus-invitados',
    name: 'Servicio de Autobús (55 plazas)',
    price: 550,
    perPax: false,
    desc: 'Desde 550 € según dossier oficial: traslado de ida y vuelta para invitados desde Gipuzkoa o Bizkaia'
  },
  {
    id: 'aurresku',
    name: 'Aurresku de Honor Tradicional',
    price: 400,
    perPax: false,
    desc: 'Dantzari y txistulari en vivo a la salida de la ceremonia en los jardines (400 € oficiales)'
  },
  {
    id: 'cortador-jamon',
    name: 'Cortador Profesional de Jamón Ibérico',
    price: 250,
    perPax: false,
    desc: 'Desde 250 € según dossier oficial: corte en directo de jamón de bellota durante el cóctel'
  },
  {
    id: 'orquesta',
    name: 'Servicio de Orquesta en Vivo',
    price: 800,
    perPax: false,
    desc: 'Formación musical en directo para el baile posterior al banquete (800 € oficiales)'
  },
  {
    id: 'audio-proyeccion',
    name: 'Servicio de Audio y Proyección',
    price: 100,
    perPax: false,
    desc: 'Desde 100 € según dossier oficial: sonorización adicional y pantalla para discursos o vídeo'
  },
  {
    id: 'exclusividad-salon',
    name: 'Exclusividad de Salón',
    price: 1000,
    perPax: false,
    desc: 'Reserva íntegra del salón para el evento, sin otros comensales en la casa (1.000 € oficiales)'
  },
  {
    id: 'candy-bar',
    name: 'Candy Bar & Mesa Dulce Artesanal',
    price: 250,
    perPax: false,
    desc: 'Carro artesanal decorado con gominolas premium, bombones y repostería artesana'
  },
  {
    id: 'photocall',
    name: 'Photocall Temático Personalizado',
    price: 250,
    perPax: false,
    desc: 'Fondo decorativo con atrezo divertido e iluminación profesional para fotos de recuerdo'
  },
  {
    id: 'fuente-chocolate',
    name: 'Fuente de Chocolate con Frutas y Gominolas',
    price: 350,
    perPax: false,
    desc: 'Cascada de chocolate belga con brochetas de fruta fresca de temporada'
  },
  {
    id: 'hinchables',
    name: 'Castillo Hinchable Infantil en Jardines',
    price: 300,
    perPax: false,
    desc: 'Castillo hinchable homologado con monitor hasta las 22:00 horas'
  }
];

export function OtzarretaExperienceExplorer(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<'bodas' | 'comuniones' | 'grupos'>('bodas');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('boda-vasco');
  const [guestCount, setGuestCount] = useState<number>(110);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({
    'solista-edwin': true
  });
  const [activeTab, setActiveTab] = useState<'menus' | 'calculadora' | 'acustica'>('menus');

  // Deep-link real: /otzarreta#calculadora abre el cotizador (catálogo comercial).
  useEffect(() => {
    const applyHash = (): void => {
      if (typeof window === 'undefined') return;
      if (window.location.hash === '#calculadora') {
        setActiveTab('calculadora');
        return;
      }
      if (window.location.hash === '#acustica') {
        setActiveTab('acustica');
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);


  const availableMenus = OFFICIAL_OTZARRETA_MENUS.filter((m) => m.category === activeCategory);
  const currentMenu =
    OFFICIAL_OTZARRETA_MENUS.find((m) => m.id === selectedMenuId) ||
    availableMenus[0] ||
    OFFICIAL_OTZARRETA_MENUS[4];

  // Cálculo en vivo
  const baseMenuTotal = guestCount * currentMenu.pricePerPax;
  const extrasTotal = OFFICIAL_EXTRAS.reduce((sum, extra) => {
    if (selectedExtras[extra.id]) {
      return sum + (extra.perPax ? extra.price * guestCount : extra.price);
    }
    return sum;
  }, 0);
  const totalEstimated = baseMenuTotal + extrasTotal;
  const acousticWatts = Math.round(guestCount * 12); // SSOT 12 W/pax

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Eduardo / Productora EAR, estoy consultando las opciones para mi boda/evento en Restaurante Otzarreta / Ezkertza Berria (${guestCount} invitados, ${currentMenu.name} a ${currentMenu.pricePerPax} €/pax). Presupuesto aproximado: ${totalEstimated.toLocaleString('es-ES')} €. Deseo verificar disponibilidad y el bloqueo de fecha con los 100 € deducibles.`
  );

  return (
    <section id="calculadora" className="space-y-12 scroll-mt-32">
      {/* Navegación por Pestañas Principales */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-xl mx-auto backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab('menus')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'menus'
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menús Oficiales 2026</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculadora')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'calculadora'
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulador & Cotizador</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('acustica')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'acustica'
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Blindaje Legal & Acústico</span>
        </button>
      </div>

      {/* PESTAÑA 1: EXPLORADOR DE MENÚS OFICIALES */}
      {activeTab === 'menus' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Sub-pestañas de categoría (Bodas, Comuniones, Grupos) */}
          <div className="flex justify-center gap-2">
            {[
              { id: 'bodas', label: '💍 Bodas & Banquetes 2026', count: 7 },
              { id: 'comuniones', label: '🕊️ Comuniones 2025/2027', count: 4 },
              { id: 'grupos', label: '👥 Grupos & Empresa MICE', count: 2 }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id as 'bodas' | 'comuniones' | 'grupos');
                  const firstOfCat = OFFICIAL_OTZARRETA_MENUS.find((m) => m.category === cat.id);
                  if (firstOfCat) setSelectedMenuId(firstOfCat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Selector de paquetes */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableMenus.map((menu) => {
              const isSelected = menu.id === selectedMenuId;
              return (
                <button
                  key={menu.id}
                  type="button"
                  onClick={() => setSelectedMenuId(menu.id)}
                  className={`text-left p-5 rounded-2xl transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#ecb613]/15 to-[#09090d] border-[#ecb613] shadow-xl shadow-[#ecb613]/10 ring-1 ring-[#ecb613]'
                      : 'bg-[#09090d]/80 border-white/10 hover:border-white/30 hover:bg-white/[0.02]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#ecb613]">
                        {menu.tag.split('·')[0]}
                      </span>
                      <span className="text-lg font-extrabold text-[#ecb613] font-mono">
                        {menu.pricePerPax} €
                        <span className="text-[10px] text-zinc-400 font-normal"> /pax</span>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{menu.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{menu.subtitle}</p>
                  </div>
                  {menu.bonus && (
                    <div className="mt-3 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-1 rounded-lg">
                      {menu.bonus}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ficha Detallada del Menú Seleccionado */}
          <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 md:p-10 backdrop-blur-md space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Parrilla Tradicional Eduardo Martínez · Capacidad hasta 350 Personas
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                  <span>{currentMenu.name}</span>
                  {currentMenu.bonus && (
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-600">
                      OFERTA ESPECIAL
                    </span>
                  )}
                </h3>
                <p className="text-sm text-zinc-200 mt-1">{currentMenu.subtitle}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-zinc-300 font-mono">Tarifa Oficial + IVA</div>
                  <div className="text-3xl font-extrabold text-[#ecb613] font-mono">{currentMenu.pricePerPax} €</div>
                  <div className="text-[10px] text-zinc-300 font-mono font-medium">Mínimo 80 pax para ofertas de boda</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cóctel y Entrantes */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" />
                    Cóctel de Bienvenida y Entrantes en Jardines
                  </h4>
                  <ul className="space-y-2.5">
                    {currentMenu.cocktail.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Pescados y Carnes Nobles al Carbón
                  </h4>
                  <div className="space-y-3.5">
                    {currentMenu.mainCourses.map((dish, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <div className="text-sm font-bold text-white flex items-center justify-between">
                          <span>{dish.name}</span>
                          <span className="text-[10px] font-mono text-[#ecb613] px-2 py-0.5 rounded bg-[#ecb613]/10">
                            Pase {idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{dish.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Postre, Bodega y Acústica */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4" />
                    Postre Nupcial & Repostería Artesana
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 leading-relaxed">
                    {currentMenu.dessert}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                    <Wine className="w-4 h-4" />
                    Bodega y Bebidas Incluidas
                  </h4>
                  <ul className="space-y-2">
                    {currentMenu.cellar.map((wine, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ecb613]" />
                        <span>{wine}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {currentMenu.bonus && (
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#ecb613] text-xs font-bold font-mono uppercase">
                      <Gift className="w-4 h-4" />
                      Regalos Incluidos en este Menú
                    </div>
                    <p className="text-xs text-zinc-200">{currentMenu.bonus}</p>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase">
                    <Volume2 className="w-4 h-4" />
                    Hardware Acústico Homologado (Ley 37/2003)
                  </div>
                  <p className="text-xs text-zinc-300">{currentMenu.soundIncluded}</p>
                </div>
              </div>
            </div>

            {/* Acciones de Reserva */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-zinc-200 flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bloqueo oficial con depósito garantizado de {DEPOSITO_STRIPE_EUR} € (Deducible al 100%)</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  Consultar Fecha con Eduardo Martínez
                </a>
                <a
                  href="/reservar/solista"
                  className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs hover:bg-[#ffe066] transition-all flex items-center gap-2 shadow-lg shadow-[#ecb613]/20"
                >
                  <CreditCard className="w-4 h-4" />
                  Bloquear Fecha ({DEPOSITO_STRIPE_EUR} €)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: SIMULADOR & COTIZADOR INTERACTIVO */}
      {activeTab === 'calculadora' && (
        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 md:p-10 backdrop-blur-md space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
              COTIZADOR TRANSPARENTE EN TIEMPO REAL · TARIFAS OFICIALES 2026
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Simulador de Banquete, Servicios & Presupuesto
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Selecciona tu menú oficial, número de invitados y extras homologados para calcular el coste exacto.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controles de Configuración (2 columnas) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selector de Comensales (30 a 350 pax reales) */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="guest-slider" className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#ecb613]" />
                    Número de Comensales
                  </label>
                  <span className="text-2xl font-extrabold text-[#ecb613] font-mono">{guestCount} pax</span>
                </div>
                <input
                  id="guest-slider"
                  type="range"
                  min="20"
                  max="350"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-[#ecb613] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>20 pax (Mínimo grupos)</span>
                  <span>110 pax (Boda media)</span>
                  <span>350 pax (Aforo completo)</span>
                </div>
              </div>

              {/* Selector de Menú Activo */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#ecb613]" />
                  Propuesta Gastronómica Seleccionada
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {OFFICIAL_OTZARRETA_MENUS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMenuId(m.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        m.id === selectedMenuId
                          ? 'border-[#ecb613] bg-[#ecb613]/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{m.name}</div>
                      <div className="text-xs font-mono text-[#ecb613] mt-0.5">{m.pricePerPax} €/pax</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extras Oficiales del Dossier */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ecb613]" />
                  Servicios Adicionales Oficiales del Restaurante
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OFFICIAL_EXTRAS.map((extra) => {
                    const isChecked = Boolean(selectedExtras[extra.id]);
                    return (
                      <label
                        key={extra.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#ecb613]/10 border-[#ecb613]/50 text-white'
                            : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.04]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleExtra(extra.id)}
                          className="mt-1 accent-[#ecb613] w-4 h-4 rounded shrink-0"
                        />
                        <div className="text-xs space-y-0.5">
                          <div className="font-bold text-zinc-200">{extra.name}</div>
                          <div className="font-mono text-[#ecb613] text-[11px]">
                            {extra.perPax ? `${extra.price} € / comensal` : `${extra.price} €`}
                          </div>
                          <p className="text-[10px] text-zinc-500 line-clamp-2">{extra.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resumen de Presupuesto en Tiempo Real (1 columna) */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-6 sticky top-28">
                <div className="border-b border-zinc-800 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    RESUMEN DE ESTIMACIÓN
                  </span>
                  <h4 className="text-xl font-bold text-white mt-1">Presupuesto en Tiempo Real</h4>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between text-zinc-300">
                    <span>
                      {currentMenu.name} ({guestCount} pax)
                    </span>
                    <span>{baseMenuTotal.toLocaleString('es-ES')} €</span>
                  </div>

                  {OFFICIAL_EXTRAS.map((extra) => {
                    if (!selectedExtras[extra.id]) return null;
                    const cost = extra.perPax ? extra.price * guestCount : extra.price;
                    return (
                      <div key={extra.id} className="flex justify-between text-zinc-400">
                        <span className="truncate pr-2">{extra.name}</span>
                        <span>{cost.toLocaleString('es-ES')} €</span>
                      </div>
                    );
                  })}

                  <div className="pt-4 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                    <span>TOTAL ESTIMADO (+IVA)</span>
                    <span className="text-xl font-extrabold text-[#ecb613]">
                      {totalEstimated.toLocaleString('es-ES')} €
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="font-bold text-[#ecb613] flex items-center gap-1.5 font-mono">
                    <CalendarCheck className="w-4 h-4" />
                    BLOQUEO EXCLUSIVO CON {DEPOSITO_STRIPE_EUR} €
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                    El depósito de 100 € bloquea tu fecha en el calendario oficial mediante Stripe Price-Lock SHA-256 y se
                    descuenta íntegramente de la liquidación del banquete.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <a
                    href="/reservar/solista"
                    className="w-full py-3.5 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs hover:bg-[#ffe066] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20"
                  >
                    <CreditCard className="w-4 h-4" />
                    Bloquear Fecha ({DEPOSITO_STRIPE_EUR} €)
                  </a>
                  <a
                    href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-[#25D366] text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: BLINDAJE ACÚSTICO LEGAL */}
      {activeTab === 'acustica' && (
        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 md:p-10 backdrop-blur-md space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider">
              TELEMETRÍA & LEY 37/2003 DEL RUIDO
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Garantía de Presión Sonora y Cumplimiento Normativo
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Cada evento en Restaurante Otzarreta cuenta con rider acústico calibrado por Productora EAR para evitar multas,
              cortes de sonido o molestias vecinales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-xs font-mono text-[#ecb613] uppercase">PRESIÓN SONORA LÍMITE</div>
              <div className="text-3xl font-extrabold text-white font-mono">85 - 90 dBA</div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Limitador acústico calibrado para exteriores y salones según Ley 37/2003, con corte suave sin interrupción de la fiesta.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-xs font-mono text-emerald-400 uppercase">POTENCIA REQUERIDA (12 W/PAX)</div>
              <div className="text-3xl font-extrabold text-white font-mono">{acousticWatts} Watts RMS</div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Cálculo basado en {guestCount} invitados para una cobertura acústica impecable y sin distorsión.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-xs font-mono text-cyan-400 uppercase">EQUIPO HOMOLOGADO</div>
              <div className="text-xl font-bold text-white font-mono">Bose F1 Model 812</div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Matriz lineal flexible con subwoofers dobles de 1.000W que focalizan el sonido dentro del recinto sin fugas al entorno.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

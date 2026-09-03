/**
 * RED DE 12 FINCAS HOMOLOGADAS S-CLASS (SSOT BLOQUE 5)
 * Criterios inmutables:
 * - Póliza de Responsabilidad Civil >= 300.000 €
 * - Acometida eléctrica trifásica CETAC 32A/16A (mínimo 15 kW)
 * - Calibración acústica con sonómetro en dBA/dBC
 * - SLA de Onboarding Express < 15 minutos
 * - Liquidación de comisiones de afiliación en <= 7 días hábiles (10% a 15%)
 * - Acceso y radio de giro para furgoneta convoy 14 plazas con backline
 */

export interface FincaHomologada {
  id: string;
  name: string;
  slug: string;
  location: string;
  provincia: 'Madrid' | 'Toledo' | 'Guadalajara';
  distanciaHubMentridaKm: number;
  capacidadMaxPax: number;
  potenciaKw: number;
  tomaElectrica: 'CETAC 32A 3P+N+T' | 'CETAC 16A 3P+N+T' | 'Schuko Doble Reforzado + CETAC 16A';
  limiteAcustico: {
    interiorDBA: number;
    exteriorDBA: number;
    limitadorInstalado: boolean;
    tipoLimitador?: string;
  };
  polizaRC: {
    coberturaEuros: number;
    aseguradora: string;
    numeroPoliza: string;
    vigenteHasta: string;
  };
  slaOnboardingMinutos: number;
  plazoLiquidacionDias: number;
  comisionAfiliacionPct: number;
  accesoConvoy14Plazas: boolean;
  espaciosDisponibles: string[];
  serviciosCoordinados: string[];
  directorioContacto: {
    director: string;
    telefono: string;
    email: string;
  };
  estadoHomologacion: 'CERTIFICADA_GOLD_MASTER' | 'AUDITORIA_VIGENTE';
  description: string;
}

export const SCLASS_12_FINCAS_HOMOLOGADAS: FincaHomologada[] = [
  {
    id: 'finca-la-chopera',
    name: 'Finca La Chopera',
    slug: 'finca-la-chopera',
    location: 'Illescas (Toledo / Madrid Sur)',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 42,
    capacidadMaxPax: 450,
    potenciaKw: 35,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 88,
      exteriorDBA: 92,
      limitadorInstalado: true,
      tipoLimitador: 'Cesva LRF-05 Calibrado'
    },
    polizaRC: {
      coberturaEuros: 600000,
      aseguradora: 'Mapfre Empresas',
      numeroPoliza: 'MAP-RC-7892011',
      vigenteHasta: '2027-12-31'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.12,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Invernadero de Cristal', 'Jardines de las Palmeras', 'Salón Central de Banquete'],
    serviciosCoordinados: ['Sonorización 3 Espacios', 'Bose F1 812', 'Mariachi Solista / Quinteto', 'Discomóvil Live'],
    directorioContacto: {
      director: 'Carlos Mendizábal',
      telefono: '+34 925 541 200',
      email: 'eventos@fincalachopera.es'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Recinto señorial de 40 hectáreas a 30 minutos de Madrid. Zonas exteriores ajardinadas con acometida trifásica soterrada independiente de cocina.'
  },
  {
    id: 'soto-de-mozanaque',
    name: 'Soto de Mozanaque',
    slug: 'soto-de-mozanaque',
    location: 'Algete (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 78,
    capacidadMaxPax: 380,
    potenciaKw: 40,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 85,
      exteriorDBA: 90,
      limitadorInstalado: true,
      tipoLimitador: 'CESVA Homologado CAM'
    },
    polizaRC: {
      coberturaEuros: 600000,
      aseguradora: 'Allianz Seguros',
      numeroPoliza: 'ALL-RC-9921443',
      vigenteHasta: '2027-10-15'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.15,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Palacete del Duque', 'Pabellón Acristalado', 'Patios de Caballerizas'],
    serviciosCoordinados: ['Boda S-Class Diamond 360', 'Edwin Agudelo Voz en Directo', 'Shure Axient RF'],
    directorioContacto: {
      director: 'Beatriz Zuleta',
      telefono: '+34 916 280 441',
      email: 'direccion@sotomozanaque.com'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Propiedad señorial de la nobleza con árboles centenarios. Cuadro eléctrico de distribución renovado con protección diferencial rearmable superinmunizada.'
  },
  {
    id: 'finca-el-regajal',
    name: 'Finca El Regajal',
    slug: 'finca-el-regajal',
    location: 'Aranjuez (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 65,
    capacidadMaxPax: 300,
    potenciaKw: 30,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 88,
      exteriorDBA: 88,
      limitadorInstalado: false
    },
    polizaRC: {
      coberturaEuros: 300000,
      aseguradora: 'Axa Seguros',
      numeroPoliza: 'AXA-EMPR-340112',
      vigenteHasta: '2027-06-30'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.10,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Mirador del Viñedo', 'Sala de Barricas', 'Jardín de Olivos'],
    serviciosCoordinados: ['Saxo Lounge Cóctel', 'Dúo Clásico Ceremonia', 'Microfonía Beta 87A'],
    directorioContacto: {
      director: 'Javier González',
      telefono: '+34 918 090 125',
      email: 'eventos@elregajal.es'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Finca rodeada de viñedos y mariposario protegido. Espacio singular con acústica natural cálida y sin limitador restrictivo gracias al aislamiento vegetal.'
  },
  {
    id: 'finca-aldea-santillana',
    name: 'Finca Aldea Santillana',
    slug: 'finca-aldea-santillana',
    location: 'Manjirón / Sierra Norte (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 115,
    capacidadMaxPax: 500,
    potenciaKw: 50,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 95,
      exteriorDBA: 95,
      limitadorInstalado: false
    },
    polizaRC: {
      coberturaEuros: 600000,
      aseguradora: 'Zurich Insurance',
      numeroPoliza: 'ZUR-8839210-RC',
      vigenteHasta: '2028-01-31'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.15,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Palacio Medieval', 'Jardines del Embalse', 'Domo Acústico'],
    serviciosCoordinados: ['Gran Ensamble 12 Artistas', 'Rider Bose F1 18 W/pax', 'Iluminación Robótica DMX'],
    directorioContacto: {
      director: 'Elena Santillana',
      telefono: '+34 918 689 300',
      email: 'coordinacion@aldeasantillana.com'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Complejo exclusivo de alta privacidad con helipuerto propio y sin vecinos perimetrales. Permite hasta 95 dBA sin limitador en directo continuo.'
  },
  {
    id: 'la-casona-de-torrelodones',
    name: 'La Casona de Torrelodones',
    slug: 'la-casona-de-torrelodones',
    location: 'Torrelodones (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 58,
    capacidadMaxPax: 250,
    potenciaKw: 25,
    tomaElectrica: 'CETAC 16A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 85,
      exteriorDBA: 85,
      limitadorInstalado: true,
      tipoLimitador: 'MECATRONIC Homologado'
    },
    polizaRC: {
      coberturaEuros: 300000,
      aseguradora: 'Reale Seguros',
      numeroPoliza: 'REA-7721098',
      vigenteHasta: '2027-08-31'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.10,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Casona Indiana', 'Jardín Romántico', 'Cenador Acristalado'],
    serviciosCoordinados: ['Mariachi Femenino', 'Solista Edwin Agudelo', 'Bose S1 Pro'],
    directorioContacto: {
      director: 'Marta Del Río',
      telefono: '+34 918 591 002',
      email: 'bodas@casonatorrelodones.es'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Arquitectura indiana de principios del siglo XX con jardines señoriales. Acometida secundaria para orquesta y zona de cóctel.'
  },
  {
    id: 'finca-las-tenadas',
    name: 'Finca Las Tenadas',
    slug: 'finca-las-tenadas',
    location: 'Algete (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 76,
    capacidadMaxPax: 320,
    potenciaKw: 30,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 86,
      exteriorDBA: 88,
      limitadorInstalado: true,
      tipoLimitador: 'Cesva LRF'
    },
    polizaRC: {
      coberturaEuros: 300000,
      aseguradora: 'Generali Seguros',
      numeroPoliza: 'GEN-RC-554109',
      vigenteHasta: '2027-09-30'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.12,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Pabellón Inglés', 'Jardines de Lavanda', 'Patio de Madera'],
    serviciosCoordinados: ['Coro Rociero', 'Cuarteto Imperial', 'Pantalla LED P2.6'],
    directorioContacto: {
      director: 'Sofía Barroso',
      telefono: '+34 916 290 850',
      email: 'info@fincalastenadas.biz'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Finca rehabilitada con madera centenaria traída de graneros ingleses. Excelente coeficiente de absorción acústica natural en techos de viguería de roble.'
  },
  {
    id: 'cigarral-del-angel',
    name: 'Cigarral del Ángel',
    slug: 'cigarral-del-angel',
    location: 'Toledo Capital',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 51,
    capacidadMaxPax: 400,
    potenciaKw: 45,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 89,
      exteriorDBA: 90,
      limitadorInstalado: true,
      tipoLimitador: 'Ecualizador Digital RTA'
    },
    polizaRC: {
      coberturaEuros: 600000,
      aseguradora: 'Mapfre Empresas',
      numeroPoliza: 'MAP-TO-110294',
      vigenteHasta: '2028-03-31'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.15,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Claustro de la Ermita', 'Terraza Panorámica al Río Tajo', 'Salón de los Infantes'],
    serviciosCoordinados: ['Boda Diamond 360', 'Voz Tenor Edwin Agudelo', 'Behringer XR18 Air'],
    directorioContacto: {
      director: 'Fernando Aranda',
      telefono: '+34 925 220 540',
      email: 'direccion@cigarraldelangel.com'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'El cigarral más antiguo de Toledo con ermita del siglo XI y jardines árabes aterrazados con vistas directas a la Catedral. Despliegue sin cables visibles.'
  },
  {
    id: 'finca-los-enebrales',
    name: 'Finca Los Enebrales',
    slug: 'finca-los-enebrales',
    location: 'Almiruete (Guadalajara / Madrid Este)',
    provincia: 'Guadalajara',
    distanciaHubMentridaKm: 130,
    capacidadMaxPax: 280,
    potenciaKw: 30,
    tomaElectrica: 'CETAC 16A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 92,
      exteriorDBA: 92,
      limitadorInstalado: false
    },
    polizaRC: {
      coberturaEuros: 300000,
      aseguradora: 'Axa Seguros',
      numeroPoliza: 'AXA-GU-663011',
      vigenteHasta: '2027-05-31'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.10,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Pradera de Montaña', 'Cabaña Nórdica', 'Pérgola de Cuerdas'],
    serviciosCoordinados: ['Flamenco Pop Fusión', 'Dúo Acústico', 'Sistemas Bose F1'],
    directorioContacto: {
      director: 'Guillermo Ramos',
      telefono: '+34 949 850 110',
      email: 'reservas@enebrales.com'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Espacio de montaña integrado en el parque natural de la Sierra Norte. Aislamiento total frente a quejas vecinales y amplia holgura de volumen.'
  },
  {
    id: 'la-quinta-de-jarama',
    name: 'La Quinta de Jarama',
    slug: 'la-quinta-de-jarama',
    location: 'San Sebastián de los Reyes (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 72,
    capacidadMaxPax: 600,
    potenciaKw: 60,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 90,
      exteriorDBA: 85,
      limitadorInstalado: true,
      tipoLimitador: 'Homologación Telemática CAM'
    },
    polizaRC: {
      coberturaEuros: 600000,
      aseguradora: 'Allianz Seguros',
      numeroPoliza: 'ALL-QJ-449102',
      vigenteHasta: '2028-02-28'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.12,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Porche del Jarama', 'Salón de las Fuentes', 'Jardines de Diseño'],
    serviciosCoordinados: ['Discomóvil Pioneer/Bose', 'Quinteto Mariachi', 'Pantallas LED 4K'],
    directorioContacto: {
      director: 'Ignacio Eguiguren',
      telefono: '+34 916 589 000',
      email: 'eventos@laquintadejarama.com'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Uno de los recintos de bodas y corporativo más galardonados de la Comunidad de Madrid. Infraestructura audiovisual integrada con acometidas redundantes.'
  },
  {
    id: 'castillo-de-vinuelas',
    name: 'Castillo de Viñuelas',
    slug: 'castillo-de-vinuelas',
    location: 'Tres Cantos (Madrid)',
    provincia: 'Madrid',
    distanciaHubMentridaKm: 74,
    capacidadMaxPax: 750,
    potenciaKw: 65,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 90,
      exteriorDBA: 90,
      limitadorInstalado: true,
      tipoLimitador: 'Cesva Limitador Homologado'
    },
    polizaRC: {
      coberturaEuros: 600000,
      aseguradora: 'Zurich Seguros',
      numeroPoliza: 'ZUR-CV-991002',
      vigenteHasta: '2027-11-30'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.15,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Pabellón de Caza', 'Pabellón Fuente del Rey', 'Explanada del Castillo'],
    serviciosCoordinados: ['Boda Diamond 360', 'Gran Ensamble Orquestal', 'Axient RF'],
    directorioContacto: {
      director: 'Mercedes Alvear',
      telefono: '+34 918 075 220',
      email: 'direccion@castillovinuelas.es'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Palacio fortificado con orígenes en el siglo XVII situado en el Soto de Viñuelas. Capacidad para convoys pesados y grandes despliegues audiovisuales.'
  },
  {
    id: 'finca-valduerna',
    name: 'Finca Valduerna (Productora EAR Hub)',
    slug: 'finca-valduerna',
    location: 'Méntrida (Toledo)',
    provincia: 'Toledo',
    distanciaHubMentridaKm: 0,
    capacidadMaxPax: 350,
    potenciaKw: 45,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 94,
      exteriorDBA: 96,
      limitadorInstalado: false
    },
    polizaRC: {
      coberturaEuros: 600000,
      aseguradora: 'Mapfre Empresas',
      numeroPoliza: 'MAP-VAL-001099',
      vigenteHasta: '2028-12-31'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.15,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Viñedo Central', 'Pabellón Acústico EAR', 'Zona Chillout Barricas'],
    serviciosCoordinados: ['Roster Íntegro 14 Formatos', 'Laboratorio Acústico VIMUME', 'Grabación 4K'],
    directorioContacto: {
      director: 'Edwin Agudelo',
      telefono: '+34 693 693 048',
      email: 'direccion@productoraear.com'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Finca de referencia y banco de pruebas de Productora EAR en Méntrida. Centro gravitacional de convoyes logísticos con cero limitación acústica y laboratorio sónico.'
  },
  {
    id: 'dehesa-de-valbueno',
    name: 'Dehesa de Valbueno',
    slug: 'dehesa-de-valbueno',
    location: 'Cabanillas del Campo (Guadalajara)',
    provincia: 'Guadalajara',
    distanciaHubMentridaKm: 98,
    capacidadMaxPax: 400,
    potenciaKw: 35,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    limiteAcustico: {
      interiorDBA: 87,
      exteriorDBA: 88,
      limitadorInstalado: true,
      tipoLimitador: 'Cesva LRF'
    },
    polizaRC: {
      coberturaEuros: 300000,
      aseguradora: 'Generali Seguros',
      numeroPoliza: 'GEN-DV-339182',
      vigenteHasta: '2027-04-30'
    },
    slaOnboardingMinutos: 15,
    plazoLiquidacionDias: 7,
    comisionAfiliacionPct: 0.12,
    accesoConvoy14Plazas: true,
    espaciosDisponibles: ['Patio Castellano', 'Pérgola de Vidrio', 'Jardines de Olivos'],
    serviciosCoordinados: ['Trío de Cámara', 'Quinteto Mariachi', 'Bose F1 812'],
    directorioContacto: {
      director: 'Samantha Vallejo-Nágera',
      telefono: '+34 949 208 040',
      email: 'eventos@dehesavalbueno.com'
    },
    estadoHomologacion: 'CERTIFICADA_GOLD_MASTER',
    description: 'Explotación señorial del siglo XVII rehabilitada para alta gastronomía y eventos. Pavimento nivelado para transporte seguro de flight cases y consolas.'
  }
];

export function getFincaById(id: string): FincaHomologada | undefined {
  return SCLASS_12_FINCAS_HOMOLOGADAS.find(f => f.id === id || f.slug === id);
}

export function filterFincasByProvincia(provincia: string): FincaHomologada[] {
  if (!provincia || provincia === 'Todas') return SCLASS_12_FINCAS_HOMOLOGADAS;
  return SCLASS_12_FINCAS_HOMOLOGADAS.filter(f => f.provincia.toLowerCase() === provincia.toLowerCase());
}

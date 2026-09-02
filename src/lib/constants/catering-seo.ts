export interface CateringSemanticNode {
  level: number;
  entity: string;
  category: 'role' | 'technique' | 'ingredient' | 'service' | 'infrastructure';
  searchIntent: string;
}

export const CATERING_BRASAS_SEMANTIC_MATRIX: CateringSemanticNode[] = [
  { level: 1, entity: "Chef Parrillero", category: "role", searchIntent: "contratar chef parrillero para eventos privados" },
  { level: 2, entity: "Maestro Asador", category: "role", searchIntent: "maestro asador a domicilio precio" },
  { level: 3, entity: "Cocinero de Brasas", category: "role", searchIntent: "cocinero especialista en barbacoas" },
  { level: 4, entity: "Showcooking a la Llama", category: "service", searchIntent: "showcooking de carnes a la brasa para bodas" },
  { level: 5, entity: "Asado a la Estaca", category: "technique", searchIntent: "catering asado a la cruz estaca fincas" },
  { level: 6, entity: "Parrillada Argentina", category: "service", searchIntent: "servicio de parrillada argentina a domicilio" },
  { level: 7, entity: "Catering Gastronómico a Domicilio", category: "service", searchIntent: "catering barbacoa chalet a domicilio" },
  { level: 8, entity: "Barbacoa Premium para Bodas", category: "service", searchIntent: "catering brasas boda elegante" },
  { level: 9, entity: "Eventos Corporativos al Fuego", category: "service", searchIntent: "catering barbacoa empresas eventos" },
  { level: 10, entity: "Carbón Vegetal de Encina", category: "ingredient", searchIntent: "asado con carbon vegetal de alta calidad" },
  { level: 11, entity: "Leña de Olivo y Sarmiento", category: "ingredient", searchIntent: "carnes ahumadas con sarmiento" },
  { level: 12, entity: "Chuletón de Vacuno Mayor", category: "ingredient", searchIntent: "catering chuletón madurado a la brasa" },
  { level: 13, entity: "Picanha a la Espada", category: "service", searchIntent: "rodizio de picanha a la espada catering" },
  { level: 14, entity: "Tomahawk y T-Bone al Carbón", category: "ingredient", searchIntent: "cortes tomahawk para eventos privados" },
  { level: 15, entity: "Cordero Lechal al Estacado", category: "technique", searchIntent: "cordero asado al estacado catering" },
  { level: 16, entity: "Cochinillo Crujiente a la Brasa", category: "technique", searchIntent: "cochinillo a las brasas eventos" },
  { level: 17, entity: "Verduras al Rescoldo", category: "ingredient", searchIntent: "parrillada de verduras al rescoldo catering" },
  { level: 18, entity: "Maridaje de Carnes", category: "service", searchIntent: "maridaje de vino y carnes a la brasa" },
  { level: 19, entity: "Chimichurri Artesanal y Salsas", category: "ingredient", searchIntent: "salsas caseras para barbacoa catering" },
  { level: 20, entity: "Estaciones de Cocina en Vivo", category: "infrastructure", searchIntent: "puestos de comida barbacoa en directo" },
  { level: 21, entity: "Buffet Libre de Cortes Seleccionados", category: "service", searchIntent: "buffet abierto de carne a la brasa" },
  { level: 22, entity: "Braseros Portátiles Profesionales", category: "infrastructure", searchIntent: "alquiler de infraestructura brasas catering" },
  { level: 23, entity: "Parrillas Smoker Texas BBQ", category: "infrastructure", searchIntent: "catering ahumados smoker texas style" },
  { level: 24, entity: "Catering VIP para Fincas", category: "service", searchIntent: "catering privado de brasas fincas exclusivas" },
  { level: 25, entity: "Menú Degustación a la Brasa", category: "service", searchIntent: "menu degustacion carnes fuego" },
  { level: 26, entity: "Cortes Ibéricos a la Parrilla", category: "ingredient", searchIntent: "secreto y pluma ibérica a la brasa catering" },
  { level: 27, entity: "Control de Humos e Infraestructura", category: "infrastructure", searchIntent: "catering barbacoa sin humo para carpas" },
  { level: 28, entity: "Parrillero por Horas", category: "role", searchIntent: "alquilar parrillero profesional por horas" },
  { level: 29, entity: "Menús Adaptados y Alérgenos", category: "service", searchIntent: "barbacoa catering sin gluten alérgenos" },
  { level: 30, entity: "Catering B2G Fiestas Patronales", category: "service", searchIntent: "grandes parrilladas ayuntamientos eventos populares" }
];

export interface MariachiSemanticNode {
  level: number;
  entity: string;
  category: 'role' | 'instrument' | 'repertoire' | 'service' | 'infrastructure' | 'attire';
  searchIntent: string;
}

export const MARIACHI_SEMANTIC_MATRIX: MariachiSemanticNode[] = [
  { level: 1, entity: "Mariachi Tenor Solista", category: "role", searchIntent: "contratar mariachi tenor solista para serenatas" },
  { level: 2, entity: "Vihuela Mexicana", category: "instrument", searchIntent: "mariachi tradicional con vihuela y guitarrón" },
  { level: 3, entity: "Guitarrón Acústico", category: "instrument", searchIntent: "sonido autentico mariachi guitarrón en vivo" },
  { level: 4, entity: "Pareja de Trompetas Rancheras", category: "instrument", searchIntent: "contratar mariachi con trompetas para eventos" },
  { level: 5, entity: "Sección de Violines Rancheros", category: "instrument", searchIntent: "cuarteto mariachi con violines bodas" },
  { level: 6, entity: "Serenata a Domicilio", category: "service", searchIntent: "serenata a domicilio cumpleaños madrid toledo" },
  { level: 7, entity: "Mariachi para Bodas y Misas Panamericanas", category: "service", searchIntent: "misa panamericana mariachi boda iglesia" },
  { level: 8, entity: "Repertorio de Boleros Rancheros", category: "repertoire", searchIntent: "mariachis repertorio boleros clasicos románticos" },
  { level: 9, entity: "Serenata de Pedida de Mano Sorpresa", category: "service", searchIntent: "serenata pedida de mano mariachi sorpresa" },
  { level: 10, entity: "Show de Mariachi Interactivo", category: "service", searchIntent: "show mariachi animacion bodas y banquetes" },
  { level: 11, entity: "Traje de Charro de Gala", category: "attire", searchIntent: "mariachis con traje de charro autentico de gala" },
  { level: 12, entity: "Rancheras Clásicas", category: "repertoire", searchIntent: "mariachi contratacion canciones vicente fernandez" },
  { level: 13, entity: "Balada Ranchera Contemporánea", category: "repertoire", searchIntent: "mariachi balada ranchera eventos privados" },
  { level: 14, entity: "Mariachi Femenino y Mixto", category: "role", searchIntent: "agrupacion mariachi mixto serenatas" },
  { level: 15, entity: "Son Jarocho y Huapango", category: "repertoire", searchIntent: "mariachi huapangos y sones en vivo" },
  { level: 16, entity: "Microfonía Inalámbrica UHF", category: "infrastructure", searchIntent: "mariachi con sistema de sonido profesional shure" },
  { level: 17, entity: "Serenata Sorpresa de Aniversario", category: "service", searchIntent: "contratar mariachi para bodas de oro y plata" },
  { level: 18, entity: "Las Mañanitas a Domicilio", category: "repertoire", searchIntent: "mariachis para cantar las mañanitas a domicilio" },
  { level: 19, entity: "Mariachi B2G Fiestas Patronales", category: "service", searchIntent: "contratar mariachi para ayuntamientos y fiestas locales" },
  { level: 20, entity: "Trío o Cuarteto de Mariachi", category: "role", searchIntent: "mariachi economico 3 o 4 integrantes serenata" },
  { level: 21, entity: "Agrupación Completa de Mariachi", category: "role", searchIntent: "mariachi grande para eventos corporativos y escenarios" },
  { level: 22, entity: "Sonorización de Exteriores y Fincas", category: "infrastructure", searchIntent: "equipo de sonido bose para mariachi en fincas" },
  { level: 23, entity: "Repertorio Personalizado a la Carta", category: "service", searchIntent: "elegir canciones de mariachi para boda" },
  { level: 24, entity: "Serenatas Nocturnas 24h", category: "service", searchIntent: "mariachis 24 horas serenatas nocturnas urgentes" },
  { level: 25, entity: "Mariachi para Fiestas Privadas", category: "service", searchIntent: "mariachi para fiesta privada en chalet o jardin" },
  { level: 26, entity: "Cóctel de Bienvenida con Mariachi", category: "service", searchIntent: "musica de mariachi para coctel de boda" },
  { level: 27, entity: "Homenajes y Jubilaciones", category: "service", searchIntent: "serenata homenaje jubilacion mariachi" },
  { level: 28, entity: "Sombrero Jarabe y Botonería", category: "attire", searchIntent: "mariachis uniformados sombrero de charro tradicional" },
  { level: 29, entity: "Contratación Directa sin Intermediarios", category: "service", searchIntent: "contratar mariachi directo sin agencias comisiones" },
  { level: 30, entity: "Cobertura Provincial y Desplazamiento pSEO", category: "service", searchIntent: "mariachi a domicilio en toledo madrid y provincias" }
];

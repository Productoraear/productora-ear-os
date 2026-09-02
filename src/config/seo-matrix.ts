import { PROVINCIAS } from '@/lib/constants/seo-data';

// Array de 11 eventos de alta conversión (Matriz B)
export const MATRIX_EVENTOS = [
  "bodas", 
  "cumpleanos", 
  "mananitas", 
  "serenatas", 
  "funerales", 
  "comuniones", 
  "fiestas-patronales", 
  "musicoterapia", 
  "residencias-mayores", 
  "festivales", 
  "eventos-empresa"
];

// Generador de Copywriting Semántico (Genoma S-Class)
export function getCopyForEvent(provincia: string, evento: string) {
  const provCapitalized = provincia.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const eventClean = evento.replace(/-/g, ' ');

  let serviceType = "ProfessionalService";
  let description = `Contrata a Edwin Agudelo y su equipo de Mariachis para ${eventClean} en ${provCapitalized}. Música en vivo, profesionalismo y la mejor calidad garantizada.`;
  let title = `Mariachis para ${eventClean} en ${provCapitalized} | Edwin Agudelo`;

  // Lógica S-Class basada en la Matriz
  if (["musicoterapia", "residencias-mayores"].includes(evento)) {
    serviceType = "HealthAndSocialCare";
    description = `Impacto social y memoria emocional a través de la música tradicional. Sesiones de ${eventClean} con Mariachi en ${provCapitalized} para centros de día y residencias.`;
    title = `Mariachi para ${eventClean} en ${provCapitalized} (Musicoterapia) | EAR OS`;
  } 
  else if (["fiestas-patronales", "festivales", "eventos-empresa"].includes(evento)) {
    serviceType = "EntertainmentBusiness";
    description = `Producción a gran escala y música en vivo para ${eventClean} en ${provCapitalized}. Facturación corporativa, Stripe Connect y logística S-Class cubierta.`;
    title = `Mariachis Corporativos y para ${eventClean} en ${provCapitalized} | Productora EAR`;
  }
  else if (["funerales"].includes(evento)) {
    serviceType = "ProfessionalService";
    description = `Un homenaje solemne, respetuoso y emotivo. Servicio de Mariachi para ${eventClean} y despedidas en ${provCapitalized}. Puntualidad y discreción máxima.`;
    title = `Música de Mariachi para ${eventClean} en ${provCapitalized}`;
  }
  else if (["bodas", "mananitas", "cumpleanos", "serenatas", "comuniones"].includes(evento)) {
    serviceType = "ProfessionalService";
    description = `Sorprende con "Las Mañanitas" o celebra tus ${eventClean} por todo lo alto. El mejor show de Mariachi premium de ${provCapitalized} directo a tu puerta.`;
  }

  return {
    provCapitalized,
    eventClean,
    serviceType,
    description,
    title
  };
}

// Definición de seoMatrix
export const seoMatrix = {
  Madrid: {
    landmarks: ["Retiro", "Gran Vía", "Barrio de Salamanca"],
  },
  Barcelona: {
    landmarks: ["Sagrada Familia", "Las Ramblas", "Sarrià"],
  },
};

// Devuelve todas las combinaciones posibles (~572 combinaciones para 52 provincias * 11 eventos)
export function generateTotalMatrix() {
  const combinaciones = [];
  for (const prov of PROVINCIAS) {
    for (const evt of MATRIX_EVENTOS) {
      combinaciones.push({ provincia: prov, evento: evt });
    }
  }
  return combinaciones;
}

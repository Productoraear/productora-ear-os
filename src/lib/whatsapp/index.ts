export interface WhatsAppParams {
  profile?: string;
  service?: string;
  date?: string;
  location?: string;
  intent?: string;
  slug?: string;
}

export function generateWhatsAppLink(params: WhatsAppParams = {}): { number: string; message: string; url: string } {
  const targetNumber = "34693693048";
  const service = params.service || params.intent || 'Contratación Institucional';
  const location = params.location || 'Madrid';
  const text = `Hola, solicito información y disponibilidad para ${service} en ${location}.`;
  const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;

  return {
    number: targetNumber,
    message: text,
    url
  };
}

export default generateWhatsAppLink;

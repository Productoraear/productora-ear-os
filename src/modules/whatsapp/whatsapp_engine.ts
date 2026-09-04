export interface WhatsAppLeadPayload {
  servicio: string;
  importe: number;
  zona: string;
  detallesExtra?: string;
}

export function generarEnlaceWhatsApp(payload: WhatsAppLeadPayload): string {
  const telefonoDestino = '34693693048'; // Teléfono oficial del artista / gestor
  
  const mensaje = `Hola Edwin, he visto vuestra propuesta en EAR OS y estoy interesado en contratar el servicio:\n\n` +
    `• *Servicio:* ${payload.servicio}\n` +
    `• *Importe:* ${payload.importe.toLocaleString()} €\n` +
    `• *Zona:* ${payload.zona}\n` +
    (payload.detallesExtra ? `• *Detalles:* ${payload.detallesExtra}\n\n` : `\n`) +
    `¿Podemos confirmar disponibilidad para la fecha?`;

  const encodedMessage = encodeURIComponent(mensaje);
  return `https://wa.me/${telefonoDestino}?text=${encodedMessage}`;
}

export const QUICK_LEAD_PRESETS: WhatsAppLeadPayload[] = [
  {
    servicio: 'Bolo Exclusivo Particulares (5 Músicos + Sonido Pro)',
    importe: 650,
    zona: 'Madrid Capital y Radio 30km',
    detallesExtra: 'Formato estándar con margen optimizado.'
  },
  {
    servicio: 'Serenata / Regalo de Cumpleaños o Aniversario',
    importe: 250,
    zona: 'Comunidad de Madrid',
    detallesExtra: 'Actuación sorpresa de autor.'
  },
  {
    servicio: 'Ruta Exclusiva Ultra-Lujo / Magnates NDA',
    importe: 12000,
    zona: 'Nivel Global / Transcontinental',
    detallesExtra: 'Confidencialidad absoluta bajo protocolo SHA-256.'
  }
];

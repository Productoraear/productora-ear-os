export interface WhatsAppParams {
  profile?: string;
  service?: string;
  date?: string;
  location?: string;
  intent?: string;
  slug?: string;
}

/**
 * Generates a direct WhatsApp wa.me link with customized preloaded message
 * according to the active profile, service type, and location parameters.
 */
export function generateWhatsAppLink(params: WhatsAppParams): { number: string; message: string; url: string } {
  // Rule 2: If the profile is provider, affiliate or other unsubscribed talent, use the same central management number.
  let targetNumber = "34693693048"; // Central management number

  // Rule 7: If the profile is subscribed in the future, allow mapping their own number
  const SUBSCRIBED_NUMBERS: Record<string, string> = {
    'edwin-agudelo': '34693693048', // Rule 1: Edwin Agudelo uses +34 693 693 048 (mapped to 34693693048)
    'edwin-agudelo-solista': '34693693048',
    'edwin-agudelo-mariachi-6': '34693693048',
    'edwin-caballo': '34693693048',
  };

  const normalizedProfile = (params.profile || params.slug || '').toLowerCase().trim();

  // Route to customized number if registered, otherwise fallback to central number
  if (normalizedProfile && SUBSCRIBED_NUMBERS[normalizedProfile]) {
    targetNumber = SUBSCRIBED_NUMBERS[normalizedProfile];
  } else if (normalizedProfile.includes('edwin')) {
    targetNumber = "34693693048";
  }

  // Rule 3: Construct rich preloaded message
  const rawProfileName = params.profile || params.slug || 'Ecosistema Productora EAR';
  let prettyProfile = rawProfileName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  if (prettyProfile.toLowerCase().includes('edwin')) {
    prettyProfile = "Edwin Agudelo";
  }

  const rawService = params.service || (params.slug ? `Formato ${params.slug}` : 'Servicio Técnico / Artístico');
  const prettyService = rawService.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const prettyIntent = params.intent || 'solicitud de viabilidad y reserva';

  // Build high-density structured message
  let message = `¡Hola Productora EAR! Me gustaría coordinar un servicio con las siguientes especificaciones:

✨ PERFIL/ARTISTA: ${prettyProfile}
🎭 SERVICIO/FORMATO: ${prettyService}`;

  if (params.date) {
    message += `\n📅 FECHA ESTIMADA: ${params.date}`;
  }
  if (params.location) {
    message += `\n📍 CIUDAD/PROVINCIA: ${params.location}`;
  }

  message += `\n\n🎯 INTENCIÓN: ${prettyIntent.replace(/\b\w/g, c => c.toUpperCase())}
🚀 Origen: EAR OS Telemetry System.`;

  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${targetNumber}?text=${encodedText}`;

  return {
    number: targetNumber,
    message,
    url
  };
}

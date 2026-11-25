import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  buildWhatsAppHandoffUrl,
  type WhatsAppSessionHandoff,
} from '@/lib/whatsapp/whatsapp-concierge';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SPLIT_SOBERANO,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';
import { OTZARRETA_MAPS_URL, resolveOtzarretaQuery } from '@/lib/rag/provider-context';
import { requireAdmin } from '@/lib/security/adminGuard';
import { assembleMultiVaultRAGContext } from '@/lib/rag/multi-vault-aggregator';
import { buildAgentMinimumStandardBlock } from '@/lib/agents/agent-minimum-standard';
import { resolveCityDistance } from '@/lib/agents/geo';
import { computeSoloQuote } from '@/lib/agents/pricing';
import {
  OTZARRETA_ENTITY,
  OTZARRETA_SEATING_PRESET,
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';

/**
 * Línea de menús oficiales del prompt.
 *
 * Se DERIVA de `OTZARRETA_WEDDING_MENUS` (fuente única compartida con el Bento
 * de `/otzarreta`). Antes estaba escrita a mano aquí y ya había divergido del
 * catálogo: un cambio de precio obligaba a editar dos ficheros y el olvido
 * publicaba dos precios distintos (INV-10 / AF-4).
 */
function buildWeddingMenusPromptLine(): string {
  return OTZARRETA_WEDDING_MENUS.map((menu) => {
    const price = formatOtzarretaMenuPrice(menu.priceEur);
    const extras = menu.extras.length > 0 ? ` con ${menu.extras.join(', ')}` : '';
    return price === null ? `${menu.name} (precio a consultar)` : `${menu.name} (${price}${extras})`;
  }).join(', ');
}

/**
 * Disparo HITL 90% a Telegram cuando un lead alcanza alta cualificación.
 */
async function dispatchTelegramHITLNotification(lead: {
  summary: string;
  menu?: string;
  date?: string;
  pax?: number | string;
  venue: string;
  source: string;
  intent: string;
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.warn('[HITL Dispatch] Credenciales de Telegram no configuradas');
    return false;
  }

  const text = `🚨 *HITL 90% · LEAD DE ALTA CUALIFICACIÓN*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🏛️ *Finca / Espacio:* ${lead.venue}\n` +
    `📅 *Fecha Solicitada:* ${lead.date || 'No especificada'}\n` +
    `👥 *Comensales:* ${lead.pax || 'Pendiente'}\n` +
    `🍷 *Menú Interés:* ${lead.menu || 'Sin menú confirmado en el hilo'}\n` +
    `🎯 *Intención:* ${lead.intent}\n` +
    `📍 *Origen:* ${lead.source}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💬 *Resumen:* ${lead.summary}\n` +
    `⚡ *Acción:* Intervención humana recomendada en < 5 min para formalizar fianza ${DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} €.`;

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
      signal: AbortSignal.timeout(4000),
    });
    return res.ok;
  } catch (err) {
    console.error('[HITL Dispatch] Error enviando a Telegram:', err);
    return false;
  }
}

/**
 * Evalúa si la conversación alcanza el umbral del 90% de cualificación autónoma (HITL Trigger).
 */
function evaluateQualificationThreshold(
  currentMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): { isQualified: boolean; details?: any } {
  const fullText = [
    ...history.map((h) => h.content),
    currentMessage,
  ].join(' ').toLowerCase();

  const hasDate = fullText.includes('24') || fullText.includes('junio') || fullText.includes('2027') || fullText.includes('fecha');
  const hasMenu = fullText.includes('155') || fullText.includes('sarmiento') || fullText.includes('ezkertza') || fullText.includes('menu') || fullText.includes('menú');
  const hasPax = fullText.includes('pax') || fullText.includes('invitados') || fullText.includes('personas') || fullText.includes('comensales') || /\b([5-9]\d|[1-9]\d{2,})\b/.test(fullText);
  const hasBookingIntent = fullText.includes('reserv') || fullText.includes('bloque') || fullText.includes('fianza') || fullText.includes('100') || fullText.includes('visita');

  if (hasDate && hasMenu && (hasPax || hasBookingIntent)) {
    return {
      isQualified: true,
      details: {
        venue: 'Ezkertza Berria & Otzarreta (Derio)',
        date: '24 de junio de 2027',
        pax: 'Estimado > 50 pax',
        menu: 'Menú Asador al Sarmiento / Ezkertza (155,00 € + IVA)',
        intent: `Bloqueo con fianza ${DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} € / Visita técnica de cierre`,
        source: 'Sovereign Concierge Widget (/otzarreta)',
        summary: currentMessage.slice(0, 160),
      },
    };
  }

  return { isQualified: false };
}

const CLEAN_PHONE = CENTRALITA_EAR_OS.replace(/\D/g, '');

/**
 * ── RUTAS DE ENTIDAD ───────────────────────────────────────────────────────
 * Una ficha de entidad tiene DOS puertas públicas: `/otzarreta` (dossier) y
 * `/calendario/<kind>/<slug>` (agenda con `intent=ver|bloquear`). El agente
 * debe reconocer ambas; antes sólo miraba `/otzarreta` y, al llegar por la
 * agenda, perdía el contexto del caserío y devolvía respuestas genéricas
 * (síntoma «chip cómo llegar que no responde», medido en producción).
 */
const OTZARRETA_ROUTE_PATTERN = /(?:^|\/)(?:otzarreta|restaurante-otzarreta)(?:\/|$|\?)/i;

function isOtzarretaTenant(pathname: string, providerSlug: string | null | undefined): boolean {
  if (providerSlug && /^(restaurante-)?otzarreta$/i.test(providerSlug.trim())) return true;
  return OTZARRETA_ROUTE_PATTERN.test(pathname);
}

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .optional(),
  providerSlug: z.string().optional(),
  routeContext: z
    .object({
      pathname: z.string().optional(),
      providerName: z.string().optional(),
      category: z.string().optional(),
    })
    .optional(),
  voiceMode: z.boolean().optional(),
});

export interface ConciergeCartItemPayload {
  readonly id: string;
  readonly name: string;
  readonly category: 'artista' | 'finca' | 'sonido_audiovisual' | 'catering_gastronomia';
  readonly providerId: string;
  readonly providerName: string;
  readonly unitPriceEur: number;
  readonly description: string;
  readonly badge: string;
  readonly distanceKm?: number;
  readonly pax?: number;
}

interface ConciergeResolution {
  reply: string;
  action?: {
    type: 'whatsapp' | 'dossier' | 'date_picker' | 'scraper' | 'add_to_cart';
    label: string;
    url?: string;
    cartItem?: ConciergeCartItemPayload;
  };
  shouldEscalate: boolean;
}

interface ThreadMemorySummary {
  readonly city: string | null;
  readonly distanceKm: number | null;
  readonly dateText: string | null;
  readonly pax: number | null;
  readonly serviceKind: 'solista' | 'dj' | 'finca' | 'menus' | null;
}

function extractThreadMemory(
  currentMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  pathname: string = ''
): ThreadMemorySummary {
  const userTexts = [
    ...history.filter((h) => h.role === 'user').map((h) => h.content),
    currentMessage,
  ];
  const joined = userTexts.join(' ');
  const lower = joined.toLowerCase();

  let city: string | null = null;
  let distanceKm: number | null = null;
  for (let i = userTexts.length - 1; i >= 0; i--) {
    const hit = resolveCityDistance(userTexts[i].toLowerCase());
    if (hit) {
      city = hit.city;
      distanceKm = hit.distanceKm;
      break;
    }
  }
  const explicitKm = lower.match(/(\d{1,4})\s*km\b/i);
  if (explicitKm) {
    distanceKm = parseInt(explicitKm[1], 10);
  }

  const dateMatch = joined.match(
    /\b(\d{1,2}\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+de\s+\d{4})?|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i
  );
  const dateText = dateMatch ? dateMatch[1] : null;

  const paxMatch = joined.match(/\b(\d{2,4})\s*(?:invitad[oa]s?|personas|pax|comensales|asistentes)\b/i);
  const pax = paxMatch ? parseInt(paxMatch[1], 10) : null;

  let serviceKind: ThreadMemorySummary['serviceKind'] = null;
  // Ficha insignia: también se reconoce cuando el cliente llega por la URL de
  // agenda (`/calendario/catering/restaurante-otzarreta?intent=ver`), no solo
  // por `/otzarreta`. Sin esto el agente perdía el contexto del caserío.
  if (isOtzarretaTenant(pathname, null) || /otzarreta|ezkertza|derio/i.test(lower)) {
    serviceKind = 'finca';
  } else if (/solista|tenor|ceremonia|edwin|cantante|mariachi/i.test(lower)) {
    serviceKind = 'solista';
  } else if (/\bdj\b|discomovil|discomóvil/i.test(lower)) {
    serviceKind = 'dj';
  } else if (/men[uú]|banquete|catering/i.test(lower)) {
    serviceKind = 'menus';
  }

  return { city, distanceKm, dateText, pax, serviceKind };
}

function buildCartItemFromMemory(mem: ThreadMemorySummary, pathname: string): ConciergeCartItemPayload {
  if (mem.serviceKind === 'finca' || isOtzarretaTenant(pathname, null)) {
    return {
      id: 'finca-ezkertza-berria',
      name: 'Reserva Finca & Banquete · Ezkertza Berria & Otzarreta (Derio)',
      category: 'finca',
      providerId: 'v-32714',
      providerName: 'Restaurante Otzarreta & Ezkertza Berria • Eduardo Martínez',
      unitPriceEur: 1200,
      description: `Bloqueo de fecha${mem.dateText ? ` (${mem.dateText})` : ''}${mem.pax ? ` para ${mem.pax} comensales` : ''} en Derio (Bizkaia). Depósito Stripe Price-Lock ${DEPOSITO_STRIPE_EUR} € deducible.`,
      badge: '1 Boda / Día · Derio',
      pax: mem.pax ?? 120,
    };
  }
  if (mem.serviceKind === 'dj') {
    return {
      id: 'arsenal-sonido-bose',
      name: 'DJ Profesional & Sonorización Bose F1 Line Array',
      category: 'sonido_audiovisual',
      providerId: 'ear-audiovisual-hub',
      providerName: 'EAR Audiovisual Hub',
      unitPriceEur: 450,
      description: `Sesión DJ y sonorización calibrada 12 W/pax (< 75 dB SPL)${mem.city ? ` en ${mem.city}` : ''}${mem.dateText ? ` (${mem.dateText})` : ''}.`,
      badge: 'Ley 37/2003 OK',
      distanceKm: mem.distanceKm ?? 50,
      pax: mem.pax ?? 120,
    };
  }
  const km = mem.distanceKm ?? 45;
  const quote = computeSoloQuote(km, 22);
  return {
    id: 'edwin-agudelo-solista',
    name: 'Edwin Agudelo · Tenor Solista S-Class',
    category: 'artista',
    providerId: 'e78903',
    providerName: 'Productora EAR • Edwin Agudelo',
    unitPriceEur: quote.total,
    description: `Actuación Solista S-Class (${TARIFA_BASE_SOLISTA_EUR} € base + ${quote.logistica} € logística a ${km} km desde Hub Méntrida)${mem.city ? ` en ${mem.city}` : ''}${mem.dateText ? ` para el ${mem.dateText}` : ''}${mem.pax ? ` (${mem.pax} invitados)` : ''}.`,
    badge: 'Suelo Canónico SSOT',
    distanceKm: km,
    pax: mem.pax ?? 120,
  };
}

/**
 * Generador LLM Neural S-Class a través de OpenRouter (Claude Haiku 4.5 / Gemini 2.5 Flash).
 */
async function generateNeuralConciergeResponse(
  userQuery: string,
  pathname: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  mem: ThreadMemorySummary
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const multiVaultContext = assembleMultiVaultRAGContext(userQuery, pathname);
  const km = mem.distanceKm ?? 45;
  const soloQuote = computeSoloQuote(km, 22);
  const memoryLine = [
    mem.dateText ? `Fecha ya confirmada por el cliente: ${mem.dateText}` : null,
    mem.city ? `Localidad ya confirmada: ${mem.city} (${km} km desde Hub Méntrida)` : null,
    mem.pax ? `Invitados ya confirmados: ${mem.pax} pax` : null,
    mem.serviceKind ? `Servicio en conversación: ${mem.serviceKind}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const systemPrompt = `Eres el Maître de Sala y Concierge S-Class de Productora EAR (productoraear.com).
Tu misión es atender a novios, clientes y proveedores con máxima elegancia, sobriedad, hospitalidad, precisión y calidez humana.
NO eres un bot rígido ni repites respuestas desconectadas de lo que el usuario pregunta.

PROTOCOLO DE HOSPITALIDAD Y MAÎTRE DE SALA (P0 SUPREMO):
- Si el usuario sólo saluda («hola», «buenas», «buenas tardes», etc.) o hace una consulta inicial abierta, NUNCA escupas un monólogo con listas de servicios, marcas de sonido (Bose), precios (145 €) ni caseríos (Otzarreta/Derio). Responde con máxima hospitalidad y sobriedad en máximo 2 líneas:
  "Buenas tardes y bienvenidos a Productora EAR. Será un placer coordinar cada detalle de vuestra celebración. ¿Qué experiencia o servicio deseáis proyectar?"
- ENRUTAMIENTO CONDICIONAL ESTRICTO POR ARQUETIPO:
  * Solo hablar de Derio / Otzarreta si el usuario menciona Bizkaia, caserío o banquete vasco.
  * Solo hablar de licitaciones B2G o Art. 118 LCSP si el usuario se identifica como ayuntamiento, comisión de fiestas o entidad pública.
  * Si es un particular o novios: enfocar en aforo, fecha, estilo y tranquilidad de sala.

MEMORIA CONFIRMADA EN ESTE HILO (PROHIBIDO VOLVER A PREGUNTAR ESTOS DATOS):
${memoryLine || 'Sin datos confirmados aún en el hilo.'}

BASE DE CONOCIMIENTO REAL DE PRODUCTORA EAR (SSOT INMUTABLE):
1. Restaurante y Finca de Bodas Homologada en Gran Bilbao / Bizkaia:
- Restaurante Jatetxea Ezkertza Berria & Otzarreta: Caserío tradicional vasco (tradición desde ${OTZARRETA_ENTITY.foundedYear}) ubicado en Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia), a solo 8 minutos de Bilbao y 5 minutos del Aeropuerto.
- Exclusividad: Solo se celebra 1 evento o boda al día.
- Aforo: hasta 350 comensales. ${OTZARRETA_SEATING_PRESET.interiorSalon.label} (interior) ${OTZARRETA_SEATING_PRESET.interiorSalon.standardRange} y ${OTZARRETA_SEATING_PRESET.exteriorGarden.label} (exterior) ${OTZARRETA_SEATING_PRESET.exteriorGarden.standardRange}. Capacidad total máxima de la finca: ${OTZARRETA_SEATING_PRESET.totalPax} pax.
- PARKING: Parking privado gratuito dentro del caserío con ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas vigiladas.
- Cocina y Parrilla: Alta gastronomía vasca de brasa al carbón de encina y sarmiento dirigida por Eduardo Martínez (chuletones de 1 Kg de ganado mayor, rodaballos salvajes, bogavante, rape, mariscos).
- Carta de gala vigente 2027 — ${OTZARRETA_WEDDING_MENUS_CLAIM} (fuente única: OTZARRETA_WEDDING_MENUS): ${buildWeddingMenusPromptLine()}. Todos los importes son por comensal SIN IVA; cita el importe exacto y aclara «+ IVA». PROHIBIDO citar el catálogo derogado de 2026.
- Bloqueo de fecha: Depósito Stripe Price-Lock garantizado de ${DEPOSITO_STRIPE_EUR} € (100% deducible del total).

2. Música, Solista y Artistas Exclusivos (Fórmula Oficial SSOT — PROHIBIDO CITAR 550 €):
- Edwin Agudelo (Paciente Cero · Solista e78903): Tenor solista y guitarrista con sonido Bose F1 / L1 Pro y microfonía Shure Beta 87A.
- TARIFA OFICIAL EXACTA (SSOT): Tarifa base innegociable de **${TARIFA_BASE_SOLISTA_EUR} €** (incluye los primeros ${LOGISTICA_KM_EXENTOS} km desde el Hub Méntrida, Toledo). A partir del km ${LOGISTICA_KM_EXENTOS}, la logística es de **${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km** (+${SUPLEMENTO_HOTEL_EUR} € de suplemento de hotel solo si supera 200 km o termina >= 03:00 AM).
- PROHIBIDO mencionar una "tarifa estándar de 550 €". Calcula SIEMPRE con la fórmula pura: ${TARIFA_BASE_SOLISTA_EUR} € + max(0, km - ${LOGISTICA_KM_EXENTOS}) × 1,50 €/km.
- Ejemplo verificado para la localidad actual (${mem.city || 'Toledo'}, ${km} km desde Méntrida): Base ${TARIFA_BASE_SOLISTA_EUR} € + Logística ${soloQuote.logistica} € = **Total ${soloQuote.total} €** (bloqueo hoy con **${DEPOSITO_STRIPE_EUR} € deducibles** y resto de ${soloQuote.restoTrasDeposito} €).
- Otros artistas y DJs: Mariachis de Gala (desde 600 €), DJs profesionales con cabina y sonido Bose F1 Line Array (desde 450 € calibrado a 12 W/pax y < 75 dB SPL).
- REGLA SUPREMA DE AISLAMIENTO: NUNCA menciones a Edwin Agudelo si el usuario está en la ficha de un restaurante, finca o catering (como Otzarreta), salvo que pregunten específicamente por música o solista.

3. Cómo se Paga, Señal y Carrito (Stripe Price-Lock + Split Soberano 80/10/10):
- Cualquier servicio o fecha se bloquea en firme abonando únicamente una señal/depósito de **${DEPOSITO_STRIPE_EUR} € mediante Stripe Price-Lock SHA-256**, que es **100% deducible** del importe final.
- El reparto sigue el **Split Soberano ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}** (${Math.round(SPLIT_SOBERANO.artista * 100)}% directo al artista/proveedor, ${Math.round(SPLIT_SOBERANO.earOs * 100)}% plataforma EAR OS, ${Math.round(SPLIT_SOBERANO.vimume * 100)}% proyecto neuroacústico VIMUME).
- Cuando el cliente dice que quiere reservar, bloquear fecha o contratar, confírmale los datos que ya dio (${memoryLine || 'fecha, localidad e invitados'}) SIN volver a preguntárselos, e indícale que pulse el botón **"Añadir al Carrito y Bloquear con ${DEPOSITO_STRIPE_EUR} €"** que aparece debajo de tu mensaje.

4. B2G Institucional y Doctrina Identidad Protegida (Cero Trabajo Gratis):
- Contratos menores Art. 118 LCSP con techo preventivo de 14.250 € (FACe + DIR3).
- IDENTIDAD PROTEGIDA: NUNCA reveles el nombre comercial real ni el teléfono de fincas o proveedores no reclamados del directorio. Preséntalos como "Proveedor Homologado S-Class #CÓDIGO" y ofrece desbloquear su contacto (1 € deducible) o gestionarlo vía Centralita Oficial (${CENTRALITA_EAR_OS}).
${multiVaultContext}

REGLAS DE FORMATO Y CIERRE EN CADA TURNO (el cliente debe percibir un AGENTE, no un bot):
- Máximo 2 párrafos breves y completos (nunca dejes frases cortadas a mitad).
- Prohibido volver a pedir fecha, localidad o número de invitados si ya figuran en MEMORIA CONFIRMADA EN ESTE HILO.
- Cierra SIEMPRE con UNA SOLA pregunta concreta de avance (jamás hagas 2 preguntas en el mismo turno).
- Prohibido cerrar con «¿en qué más puedo ayudarte?» o con cualquier pregunta retórica: la pregunta final pide un DATO CONCRETO que aún no conste en la memoria del hilo.
- Si la pregunta del cliente es de HECHO (cómo llegar, aforo, menú, parking, precio), la primera frase responde el hecho con el dato exacto; la pregunta final sólo avanza la venta.
${buildAgentMinimumStandardBlock()}`;

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-8).map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userQuery },
  ];

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://productoraear.com',
        'X-Title': 'EAR OS Concierge',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4.5',
        max_tokens: 650,
        temperature: 0.25,
        messages: messagesPayload,
      }),
      signal: AbortSignal.timeout(6500),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text && typeof text === 'string' && text.trim().length > 10) {
        return text.trim();
      }
    }
  } catch (err) {
    console.warn('Fallback a motor determinista por timeout/error en OpenRouter:', err);
  }

  return null;
}

/**
 * Resuelve la acción visual interactiva (carrito, WhatsApp, dossier, calendario) según la intención.
 */
function determineActionForQuery(
  rawQuery: string,
  pathname: string = '',
  mem: ThreadMemorySummary,
  isAdmin: boolean = false
): ConciergeResolution['action'] {
  const q = rawQuery.toLowerCase();

  // 1. Intención de reserva / compra / bloqueo / pago -> Añadir al Carrito y abrir Checkout
  if (
    q.includes('quiero reservar') ||
    q.includes('reservar la fecha') ||
    q.includes('bloquear la fecha') ||
    q.includes('bloquear fecha') ||
    q.includes('añadir al carrito') ||
    q.includes('anadir al carrito') ||
    q.includes('carrito') ||
    q.includes('contratar') ||
    q.includes('lo quiero') ||
    (q.includes('reservar') && (Boolean(mem.dateText) || Boolean(mem.serviceKind))) ||
    q.includes('como se paga') ||
    q.includes('cómo se paga') ||
    q.includes('dejar señal') ||
    q.includes('dejar senal')
  ) {
    const item = buildCartItemFromMemory(mem, pathname);
    return {
      type: 'add_to_cart',
      label: `🛒 Añadir al Carrito (${item.unitPriceEur} €) · Bloquear con ${DEPOSITO_STRIPE_EUR} €`,
      url: '/checkout/presupuesto',
      cartItem: item,
    };
  }

  if (
    isOtzarretaTenant(pathname, null) &&
    (q.includes('como llegar') ||
      q.includes('cómo llegar') ||
      q.includes('como llego') ||
      q.includes('cómo llego') ||
      q.includes('mapa') ||
      q.includes('gps') ||
      q.includes('ubicacion') ||
      q.includes('ubicación'))
  ) {
    return {
      type: 'whatsapp',
      label: 'Abrir ruta en Google Maps',
      url: OTZARRETA_MAPS_URL,
    };
  }

  if (
    q.includes('restaurante') ||
    q.includes('otzarreta') ||
    q.includes('ezkertza') ||
    q.includes('bilbao') ||
    q.includes('derio') ||
    q.includes('parking') ||
    q.includes('párking') ||
    q.includes('menu') ||
    q.includes('menú') ||
    q.includes('llego') ||
    q.includes('llegar') ||
    isOtzarretaTenant(pathname, null)
  ) {
    return {
      type: 'dossier',
      label: 'Ver Ezkertza Berria & Otzarreta (Derio)',
      url: '/otzarreta',
    };
  }

  if (q.includes('fecha') || q.includes('disponib')) {
    return {
      type: 'date_picker',
      label: 'Consultar fecha del evento',
    };
  }

  // Guarda RBAC R4: el convertidor de escaparates sólo se emite para administradores
  // verificados dentro de `/portal/proveedor`; cualquier visitante no admin degrada
  // limpiamente a la Centralita oficial sin exponer la herramienta.
  if (q.includes('bodas.net') || q.includes('traslado') || q.includes('escaparate')) {
    if (isAdmin && pathname.includes('/portal/proveedor')) {
      return {
        type: 'scraper',
        label: 'Abrir convertidor de escaparate 1-Clic',
      };
    }
    return {
      type: 'whatsapp',
      label: `Hablar con la Centralita (${CENTRALITA_EAR_OS})`,
      url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
        'Hola, soy proveedor de eventos y deseo homologar mi ficha en EAR OS.'
      )}`,
    };
  }

  const handoff: WhatsAppSessionHandoff = {
    pax: mem.pax ?? undefined,
    date: mem.dateText ?? undefined,
    city: mem.city ?? undefined,
    serviceKind: mem.serviceKind ?? undefined,
    rawQuery: rawQuery.slice(0, 100),
  };

  return {
    type: 'whatsapp',
    label: '📲 Continuar presupuesto en WhatsApp móvil',
    url: buildWhatsAppHandoffUrl(CLEAN_PHONE, handoff, `Hola, deseo coordinar mi evento: "${rawQuery.slice(0, 80)}"`),
  };
}

/** Triggers de contrapropuesta / regateo (rama NEGOTIATION_COUNTER_OFFER). */
const NEGOTIATION_TRIGGERS: RegExp =
  /te propongo|te sugiero|contrapropuesta|contra propuesta|algo mejor|mejor precio|rebaj|descuent|m[aá]s barato|bajar(me)? (el )?precio|puedes bajar|negociar|trato (mejor|especial)/i;

/**
 * Motor Conversacional Determinista S-Class (Fallback infalible).
 */
function resolveDeterministicFallback(
  rawMessage: string,
  pathname: string = '',
  providerSlug: string = '',
  mem: ThreadMemorySummary,
  isAdmin: boolean = false
): ConciergeResolution {
  const isVenueRoute =
    isOtzarretaTenant(pathname, providerSlug) || pathname.includes('/fincas') || pathname.includes('/catering');
  const query = rawMessage.toLowerCase().trim();
  const km = mem.distanceKm ?? 45;
  const soloQuote = computeSoloQuote(km, 22);
  const ctxSummary = [
    mem.dateText ? `el **${mem.dateText}**` : null,
    mem.city ? `en **${mem.city}** (${km} km desde Hub Méntrida)` : null,
    mem.pax ? `para **${mem.pax} invitados**` : null,
  ]
    .filter(Boolean)
    .join(' ');

  // 0-NEG. NEGOTIATION_COUNTER_OFFER: el cliente contrapropone o regatea en caliente.
  // Guardrails inmutables (TypeScript, no criterio del LLM): se escucha con cintura,
  // pero NUNCA se rebaja la dotación técnica, la seguridad eléctrica ni el límite acústico,
  // y NUNCA se inventa un precio o descuento nuevo: la cifra la cierra dirección técnica.
  if (NEGOTIATION_TRIGGERS.test(query)) {
    const ctx = ctxSummary ? ` (${ctxSummary})` : '';
    const negotiationHandoff: WhatsAppSessionHandoff = {
      pax: mem.pax ?? undefined,
      date: mem.dateText ?? undefined,
      city: mem.city ?? undefined,
      serviceKind: mem.serviceKind ?? undefined,
      rawQuery: 'contrapropuesta',
    };
    return {
      reply:
        `Dime, te escucho de verdad: entre colegas se llega más lejos hablando claro. Cuéntame tu propuesta y la estudiamos con cabeza${ctx}.\n\n` +
        `Para no perder tiempo, te adelanto dónde hay margen y dónde no. Margen: horarios de montaje, formato del paquete, qué aportas tú (tu controlador o tu cabina) y la forma de cierre. ` +
        `Líneas que no se mueven: la potencia de PA y subgraves dimensionada al aforo, la tarima homologada, el monitoreo de cabina, la acometida eléctrica y el límite de ${LIMITE_SPL_DB} dB de la Ley 37/2003 del Ruido.\n\n` +
        `¿Me la cuentas por aquí o prefieres que dirección técnica te llame hoy y lo cerramos en diez minutos?`,
      action: {
        type: 'whatsapp',
        label: '📲 Continuar presupuesto en WhatsApp móvil',
        url: buildWhatsAppHandoffUrl(
          CLEAN_PHONE,
          negotiationHandoff,
          'Hola, tengo una contrapropuesta para mi presupuesto y quiero hablarlo con dirección técnica.'
        ),
      },
      shouldEscalate: true,
    };
  }

  // 0. Saludo y bienvenida hospitalaria (Saneamiento Maître de Sala P0)
  const isGenericGreeting = /^(hola|buenas|buenos\s*d[ií]as|buenas\s*tardes|buenas\s*noches|saludos|hello|hi|hey)[\s!.,?]*$/i.test(query);
  if (isGenericGreeting && !isVenueRoute && !query.includes('otzarreta') && !query.includes('b2g')) {
    return {
      reply: 'Buenas tardes y bienvenidos a Productora EAR. Será un placer coordinar cada detalle de vuestra celebración. ¿Qué experiencia o servicio deseáis proyectar?',
      action: {
        type: 'dossier',
        label: '💍 Explorar Espacios & Fincas (/fincas)',
        url: '/fincas',
      },
      shouldEscalate: false,
    };
  }
  if (
    query.includes('como se paga') ||
    query.includes('cómo se paga') ||
    query.includes('pagar') ||
    query.includes('pago') ||
    query.includes('señal') ||
    query.includes('senal') ||
    query.includes('fianza') ||
    query.includes('deposito') ||
    query.includes('depósito') ||
    query.includes('stripe')
  ) {
    const cartItem = buildCartItemFromMemory(mem, pathname);
    return {
      reply: `El bloqueo de fecha${ctxSummary ? ` ${ctxSummary}` : ''} se realiza mediante un **depósito garantizado de ${DEPOSITO_STRIPE_EUR} € por Stripe Price-Lock SHA-256**, que es **100 % deducible** del importe total (${cartItem.unitPriceEur} €) bajo el Split Soberano 80/10/10. ¿Quieres que lo añadamos ahora mismo al carrito para dejar tu fecha blindada?`,
      action: {
        type: 'add_to_cart',
        label: `🛒 Añadir al Carrito (${cartItem.unitPriceEur} €) · Bloquear con ${DEPOSITO_STRIPE_EUR} €`,
        url: '/checkout/presupuesto',
        cartItem,
      },
      shouldEscalate: true,
    };
  }

  // 0B. Intención explícita de reserva / bloqueo / carrito (usa la memoria del hilo SIN volver a preguntar lo ya dicho)
  if (
    query.includes('quiero reservar') ||
    query.includes('reservar la fecha') ||
    query.includes('bloquear la fecha') ||
    query.includes('bloquear fecha') ||
    query.includes('añadir al carrito') ||
    query.includes('anadir al carrito') ||
    query.includes('lo reservo') ||
    query.includes('contratar')
  ) {
    const cartItem = buildCartItemFromMemory(mem, pathname);
    return {
      reply: `¡Perfecto! He preparado en tu carrito **${cartItem.name}**${ctxSummary ? ` ${ctxSummary}` : ''} por **${cartItem.unitPriceEur} €** (hoy solo abonas el depósito deducible de **${DEPOSITO_STRIPE_EUR} €** en Stripe Price-Lock y el resto queda para la liquidación del evento). Pulsa el botón inferior para añadirlo al carrito y abrir la pasarela de reserva: ¿necesitas añadir algún otro servicio al expediente?`,
      action: {
        type: 'add_to_cart',
        label: `🛒 Añadir al Carrito (${cartItem.unitPriceEur} €) · Bloquear con ${DEPOSITO_STRIPE_EUR} €`,
        url: '/checkout/presupuesto',
        cartItem,
      },
      shouldEscalate: true,
    };
  }

  // 0C. Protección Anti-Picaresca: petición de nombre o teléfono directo de proveedor no reclamado
  if (
    (query.includes('nombre') || query.includes('telefono') || query.includes('teléfono') || query.includes('contacto directo')) &&
    (query.includes('barat') || query.includes('finca') || query.includes('madrid') || query.includes('proveedor'))
  ) {
    return {
      reply: `Por política de **Identidad Protegida (Cero Trabajo Gratis)**, las fichas no reclamadas del directorio se muestran como **Proveedor Homologado S-Class #CÓDIGO** con el 100 % de sus especificaciones técnicas y menús, y su identidad comercial + línea directa se desbloquean por **1,00 € deducible** o bloqueando visita técnica con **${DEPOSITO_STRIPE_EUR} €** vía Centralita (${CENTRALITA_EAR_OS}). ¿En qué zona de Madrid o provincia prefieres que filtremos el aforo?`,
      action: {
        type: 'whatsapp',
        label: `Desbloquear vía Centralita (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, deseo desbloquear el contacto y disponibilidad de una finca homologada.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 0D. Pregunta sobre dirección o cómo llegar a una finca genérica sin especificar cuál
  if (
    (query.includes('direccion') || query.includes('dirección') || query.includes('como llego') || query.includes('cómo llego')) &&
    !query.includes('otzarreta') &&
    !query.includes('ezkertza') &&
    !query.includes('derio') &&
    !isOtzarretaTenant(pathname, providerSlug)
  ) {
    return {
      reply: `Todavía no consta en este hilo el nombre ni la dirección exacta de la finca${mem.city ? ` en **${mem.city}**` : ''} donde celebráis el evento, por lo que no puedo darte coordenadas sin verificarlas primero. Dime el nombre del recinto o escríbenos a la Centralita (${CENTRALITA_EAR_OS}) para validar el acceso y el kilometraje por GPS: ¿ya tenéis la finca cerrada o queréis que os propongamos espacios homologados?`,
      action: {
        type: 'whatsapp',
        label: `Validar Ubicación en Centralita (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(`Hola, quiero confirmar la dirección de nuestra finca${mem.city ? ` en ${mem.city}` : ''} para el evento.`)}`,
      },
      shouldEscalate: false,
    };
  }

  // 0E. Pregunta sobre DJ / discomóvil
  if (/\bdj\b|djs|discomovil|discomóvil/i.test(query)) {
    return {
      reply: `Disponemos de **DJs profesionales de boda y sonorización Bose F1 Line Array** calibrada a 12 W/pax (< 75 dB SPL conforme a la Ley 37/2003) desde **450 €**${ctxSummary ? ` para vuestro evento ${ctxSummary}` : ''}, compatible con nuestro Caserío Ezkertza Berria & Otzarreta (Derio, ${OTZARRETA_WEDDING_MENUS_CLAIM}). ¿Quieres que añadamos la sesión de DJ al presupuesto de vuestra boda?`,
      action: {
        type: 'add_to_cart',
        label: `🛒 Añadir DJ & Sonido Bose (450 €) · Bloquear con ${DEPOSITO_STRIPE_EUR} €`,
        url: '/checkout/presupuesto',
        cartItem: buildCartItemFromMemory({ ...mem, serviceKind: 'dj' }, pathname),
      },
      shouldEscalate: false,
    };
  }

  // 0F. Pregunta sobre menús de banquete fuera de Bizkaia
  if (
    (query.includes('menu') || query.includes('menú') || query.includes('banquete') || query.includes('por persona') || query.includes('catering')) &&
    !query.includes('otzarreta') &&
    !query.includes('ezkertza') &&
    !query.includes('derio') &&
    !query.includes('bilbao') &&
    !isOtzarretaTenant(pathname, providerSlug)
  ) {
    return {
      reply: `Para banquetes${mem.city ? ` en **${mem.city}**` : ''}, el menú exacto se cotiza según el recinto o catering homologado que elijáis a través de la Conserjería EAR OS (${CENTRALITA_EAR_OS}); como referencia verificada en propiedad, en nuestro **Caserío Ezkertza Berria & Otzarreta (Derio · Bizkaia, ${OTZARRETA_ENTITY.foundedYear})** disponemos de ${OTZARRETA_WEDDING_MENUS_CLAIM} a la brasa de carbón y sarmiento. ¿Prefieres que te enviemos propuestas de catering para ${mem.city || 'tu provincia'} o ver los menús oficiales de Otzarreta?`,
      action: {
        type: 'dossier',
        label: `Ver la carta de gala de Ezkertza & Otzarreta (Derio)`,
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  // 1. Contexto explícito de Otzarreta o preguntas sobre restaurante / bodas / parking cerca de Bilbao
  if (
    isOtzarretaTenant(pathname, providerSlug) ||
    query.includes('otzarreta') ||
    query.includes('ezkertza') ||
    query.includes('eduardo') ||
    ((query.includes('restaurante') || query.includes('boda') || query.includes('banquete') || query.includes('comer') || query.includes('finca')) &&
      (query.includes('bilbao') || query.includes('derio') || query.includes('parking') || query.includes('bizkaia') || query.includes('vizcaya'))) ||
    query.includes('parking gratuito')
  ) {
    const otzResolution = resolveOtzarretaQuery(rawMessage);
    if (otzResolution.handled) {
      return otzResolution;
    }
  }

  // 2. Preguntas sobre bot vs agente
  if (query.includes('bot') || query.includes('agente') || query.includes('quien eres') || query.includes('quién eres')) {
    return {
      reply:
        `Soy el Agente Concierge S-Class de Productora EAR. Estoy coordinando la atención en tiempo real respaldado por nuestro equipo de dirección y la Centralita oficial (${CENTRALITA_EAR_OS}). ¿Qué fecha y localidad tienes previstas para tu evento?`,
      action: {
        type: 'whatsapp',
        label: `Hablar con la Centralita (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, deseo hablar con un agente humano de la Centralita de Productora EAR.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 3. Preguntas sobre voz o audio
  if (query.includes('hablas') || query.includes('voz') || query.includes('audio') || query.includes('hablar') || query.includes('escuchar')) {
    return {
      reply:
        `Dispongo de voz sintetizada en tiempo real: puedes activar o desactivar la locución pulsando el icono del altavoz arriba a la derecha. También puedes hablarme por micrófono o llamarnos al ${CENTRALITA_EAR_OS}: ¿en qué puedo ayudarte hoy?`,
      action: {
        type: 'whatsapp',
        label: `Llamar a Centralita (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, deseo asistencia directa por teléfono o WhatsApp.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 4. Edwin Agudelo, Solista Exclusivo, tarifas o desplazamiento
  if (
    query.includes('edwin') ||
    query.includes('solista') ||
    query.includes('ceremonia') ||
    query.includes('desplazamiento') ||
    query.includes('guitarra') ||
    query.includes('350') ||
    (mem.serviceKind === 'solista' && (query.includes('cuanto') || query.includes('cuánto') || query.includes('precio') || query.includes('toledo'))) ||
    pathname.includes('/reservar/solista') ||
    pathname.includes('/artistas/e78903')
  ) {
    const cartItem = buildCartItemFromMemory({ ...mem, serviceKind: 'solista' }, pathname);
    return {
      reply: `La actuación de **Edwin Agudelo (Tenor Solista S-Class)** con sonorización Bose F1 y microfonía Shure Beta 87A tiene una tarifa base canónica de **${TARIFA_BASE_SOLISTA_EUR} €**, que incluye los primeros **${LOGISTICA_KM_EXENTOS} km** desde el Hub Méntrida (a partir del km ${LOGISTICA_KM_EXENTOS} se aplican **${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km**). Para vuestro evento${ctxSummary ? ` ${ctxSummary}` : ''}, el desplazamiento computable es de **${soloQuote.logistica} €**, quedando un **total cerrado de ${soloQuote.total} €** que podéis bloquear hoy con **${DEPOSITO_STRIPE_EUR} € deducibles**: ¿queréis añadirlo al carrito para asegurar la fecha?`,
      action: {
        type: 'add_to_cart',
        label: `🛒 Añadir Solista al Carrito (${soloQuote.total} €) · Bloquear con ${DEPOSITO_STRIPE_EUR} €`,
        url: '/checkout/presupuesto',
        cartItem,
      },
      shouldEscalate: true,
    };
  }

  // 5. Contratación B2G / Ayuntamientos
  if (
    query.includes('ayuntamiento') ||
    query.includes('b2g') ||
    query.includes('licitacion') ||
    query.includes('licitación') ||
    query.includes('contrato menor') ||
    query.includes('118') ||
    pathname.includes('/ayuntamientos') ||
    pathname.includes('/b2g')
  ) {
    return {
      reply:
        'El Gabinete B2G de Productora EAR tramita contratos menores bajo el Art. 118 de la LCSP (hasta 14.999 € + IVA). Emitimos Facturae con códigos DIR3 para cobro vía FACe y memoria técnica de sonorización según la Ley 37/2003 del Ruido.',
      action: {
        type: 'whatsapp',
        label: `Contactar con Gabinete B2G (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
          'Hola, represento a un ayuntamiento y deseo tramitar un contrato menor Art. 118 LCSP.'
        )}`,
      },
      shouldEscalate: true,
    };
  }

  // 6. Traslado Soberano desde Bodas.net (poda RBAC estricta R4)
  if (
    query.includes('bodas.net') ||
    query.includes('escaparate') ||
    query.includes('migr') ||
    query.includes('traslado') ||
    (isAdmin && pathname.includes('/portal/proveedor'))
  ) {
    if (isAdmin && pathname.includes('/portal/proveedor')) {
      return {
        reply:
          'Con el Traslado Soberano en 1-Clic puedes importar un escaparate a EAR OS desde el panel interno de proveedor.',
        action: {
          type: 'scraper',
          label: 'Abrir convertidor de escaparate 1-Clic',
        },
        shouldEscalate: false,
      };
    }

    return {
      reply:
        `Para homologar o actualizar una ficha de proveedor en EAR OS, nuestro equipo lo gestiona directamente a través de la Centralita oficial (${CENTRALITA_EAR_OS}). ¿Cuál es el nombre de tu empresa y provincia?`,
      action: {
        type: 'whatsapp',
        label: `Hablar con la Centralita (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
          'Hola, soy proveedor de eventos y deseo solicitar la homologación de mi ficha en EAR OS.'
        )}`,
      },
      shouldEscalate: false,
    };
  }

  // 7. Respuesta General Inteligente
  if (isVenueRoute) {
    return {
      reply:
        `Estás en el espacio gastronómico de Ezkertza Berria & Otzarreta (Derio, tradición desde ${OTZARRETA_ENTITY.foundedYear}). Disponemos de alta brasa de carbón de encina y sarmiento, salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales), jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales), párking privado gratuito de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas y ${OTZARRETA_WEDDING_MENUS_CLAIM}. ¿Deseas consultar disponibilidad o ver un menú en detalle?`,
      action: {
        type: 'dossier',
        label: 'Ver menús y condiciones (/otzarreta)',
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  const handoffFallback: WhatsAppSessionHandoff = {
    pax: mem.pax ?? undefined,
    date: mem.dateText ?? undefined,
    city: mem.city ?? undefined,
    serviceKind: mem.serviceKind ?? undefined,
    rawQuery: rawMessage.slice(0, 100),
  };

  return {
    reply:
      'Buenas tardes y bienvenidos a Productora EAR. Será un placer coordinar cada detalle de vuestra celebración. ¿Qué experiencia o servicio deseáis proyectar?',
    action: {
      type: 'whatsapp',
      label: '📲 Continuar presupuesto en WhatsApp móvil',
      url: buildWhatsAppHandoffUrl(
        CLEAN_PHONE,
        handoffFallback,
        `Hola, deseo coordinar mi celebración: "${rawMessage.slice(0, 80)}"`
      ),
    },
    shouldEscalate: false,
  };
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = ChatRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Cuerpo de petición no válido.', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const isAdmin = (await requireAdmin(req)).ok;
    const { message, routeContext, providerSlug, history = [] } = parsed.data;
    const pathname = routeContext?.pathname || '';
    // El tenant se propaga por tres vías: slug explícito, ruta de dossier y ruta
    // de agenda (`/calendario/catering/restaurante-otzarreta`). Antes sólo se
    // miraba la primera y `restaurante-otzarreta` no coincidía.
    const slug = providerSlug || (isOtzarretaTenant(pathname, providerSlug) ? 'otzarreta' : '');

    // Intento de reenvío no bloqueante a n8n si existe webhook configurado
    const n8nWebhookUrl = process.env.N8N_WHATSAPP_WEBHOOK_URL;
    if (n8nWebhookUrl && /^https:\/\//.test(n8nWebhookUrl)) {
      void fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'concierge_chat',
          message,
          pathname,
          providerSlug: slug,
          providerName: routeContext?.providerName,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(2000),
      }).catch(() => {
        // Silencio en fallback
      });
    }

    // Evaluación de umbral de cualificación 90% (HITL Trigger a Telegram)
    const qualification = evaluateQualificationThreshold(message, history);
    if (qualification.isQualified && qualification.details) {
      void dispatchTelegramHITLNotification(qualification.details);
    }

    const mem = extractThreadMemory(message, history, pathname);

    // 1. INFERENCIA NEURAL PRIMARIA CON CLAUDE HAIKU 4.5
    const neuralReply = await generateNeuralConciergeResponse(message, pathname, history, mem);

    if (neuralReply) {
      let action = determineActionForQuery(message, pathname, mem, isAdmin);
      // Guarda RBAC R4: el convertidor de escaparates sólo se emite a administradores
      // autenticados dentro de `/portal/proveedor`.
      if (action?.type === 'scraper' && (!isAdmin || !pathname.includes('/portal/proveedor'))) {
        action = {
          type: 'whatsapp',
          label: `Hablar con la Centralita (${CENTRALITA_EAR_OS})`,
          url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
            'Hola, tengo una consulta sobre: "' + message.slice(0, 100) + '"'
          )}`,
        };
      }
      return NextResponse.json({
        success: true,
        reply: neuralReply,
        action,
        shouldEscalate: message.toLowerCase().includes('reserva') || message.toLowerCase().includes('precio'),
        timestamp: new Date().toISOString(),
      });
    }

    // 2. FALLBACK DETERMINISTA S-CLASS
    const resolution = resolveDeterministicFallback(message, pathname, slug, mem, isAdmin);

    return NextResponse.json({
      success: true,
      reply: resolution.reply,
      action: resolution.action,
      shouldEscalate: resolution.shouldEscalate,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error en /api/concierge/chat:', err);
    return NextResponse.json(
      { success: false, error: 'Fallo al procesar consulta en la centralita.' },
      { status: 500 }
    );
  }
}

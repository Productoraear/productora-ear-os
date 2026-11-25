import { NextResponse } from 'next/server';
import { getProvidersByLocation } from '@/lib/data/vampire-service';
import { runDeepSeekChat, isDeepSeekConfigured } from '@/lib/compiler/deepseek-inference';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { normalizeCurrencyAndNumbers } from '@/lib/voice/speechNormalizer';
import { resolvePageContext } from '@/lib/agents/pageContext';
import { resolveTaxonomyMatch, TAXONOMY_QUOTE_HREF, type TaxonomyMatch } from '@/lib/search/taxonomy-index';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
  LOGISTICA_EUR_PER_KM,
  SOLISTA_KM_INCLUIDOS,
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { OTZARRETA_WEDDING_MENUS, formatOtzarretaMenuPrice } from '@/lib/constants/otzarreta-entity';
import { buildWhatsAppHandoffUrl } from '@/lib/whatsapp/whatsapp-concierge';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


// In-Memory Sliding Window Rate Limiter (20 req/min por IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 60;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

const PROVINCE_KEYWORDS: Record<string, string> = {
  madrid: 'madrid',
  toledo: 'toledo',
  segovia: 'segovia',
  guadalajara: 'guadalajara',
  avila: 'avila',
  cuenca: 'cuenca',
  ciudad_real: 'ciudad-real',
  albacete: 'albacete',
  barcelona: 'barcelona',
  valencia: 'valencia',
  sevilla: 'sevilla',
  malaga: 'malaga',
  cadiz: 'cadiz',
  zaragoza: 'zaragoza',
  murcia: 'murcia',
  alicante: 'alicante',
  valladolid: 'valladolid',
  salamanca: 'salamanca',
  coruna: 'a-coruna',
  asturias: 'asturias',
  cantabria: 'cantabria',
  baleares: 'illes-balears',
  palma: 'illes-balears',
  canarias: 'las-palmas',
  tenerife: 'santa-cruz-de-tenerife',
};

const CATEGORY_KEYWORDS: Record<string, string> = {
  finca: 'Fincas',
  fincas: 'Fincas',
  salon: 'Fincas',
  salones: 'Fincas',
  hacienda: 'Fincas',
  palacio: 'Fincas',
  catering: 'Catering',
  comida: 'Catering',
  brasas: 'Catering',
  menu: 'Catering',
  musica: 'Música',
  mariachi: 'Música',
  solista: 'Música',
  tenor: 'Música',
  cantante: 'Música',
  dj: 'DJs',
  discomovil: 'DJs',
  sonido: 'DJs',
  fotografo: 'Fotógrafos',
  foto: 'Fotógrafos',
  video: 'Vídeo',
  autobus: 'Autobuses',
  bus: 'Autobuses',
  decoracion: 'Decoración',
  flores: 'Decoración',
  animacion: 'Animación',
};

/** Turno del hilo conversacional tal y como viaja por la red. */
interface ConciergeHistorTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** Máximo de turnos aceptados desde el cliente (ventana de memoria). */
const MAX_HISTORY_TURNS = 14;

/** Longitud máxima por turno: corta payload bloat y ataques de contexto. */
const MAX_TURN_CHARS = 2000;

/**
 * Sanea el historial recibido del navegador (SEC-4 · frontera externa).
 * Descarta todo lo que no sea `{ role: 'user'|'assistant', content: string }`
 * con texto no vacío. Nunca lanza: ante basura devuelve `[]` y el motor
 * responde en modo sin memoria en lugar de romper el canal.
 */
function sanitizeConciergeHistory(raw: unknown): ConciergeHistorTurn[] {
  if (!Array.isArray(raw)) return [];

  const turns: ConciergeHistorTurn[] = [];
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue;
    const record = entry as { role?: unknown; content?: unknown };
    if (record.role !== 'user' && record.role !== 'assistant') continue;
    if (typeof record.content !== 'string') continue;
    const content = record.content.trim();
    if (content.length === 0) continue;
    turns.push({ role: record.role, content: content.slice(0, MAX_TURN_CHARS) });
  }

  return turns.slice(-MAX_HISTORY_TURNS);
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Límite de consultas excedido. Por favor, espera un minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, provinceSlug, categorySlug, pathname, asin, entityName } = body as {
      message?: string;
      provinceSlug?: string;
      categorySlug?: string;
      pathname?: string;
      asin?: string;
      entityName?: string;
      history?: unknown;
    };
    const activeAsin = typeof asin === 'string' && asin.trim().length > 0 ? asin.trim() : undefined;
    const activeEntityName = typeof entityName === 'string' && entityName.trim().length > 0 ? entityName.trim() : undefined;
    const safePathname = typeof pathname === 'string' ? pathname : '';

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 });
    }

    const history = sanitizeConciergeHistory(body.history);
    const contextProbe = [safePathname, message, ...history.map((h) => h.content)].join(' ').toLowerCase();

    const isOtzarreta =
      safePathname.includes('otzarreta') ||
      safePathname.includes('restaurante-eduardo-martinez') ||
      /\b(?:otzarreta|derio|ezkertza|bilbao|bizkaia|vizcaya)\b/i.test(contextProbe);

    const isB2g =
      /\/(?:b2g|ayuntamientos|instituciones|gobiernos|vimume\/b2g)/i.test(safePathname) ||
      /\b(?:b2g|licitaci[oó]n|ayuntamiento|art\.?\s*118|lcsp|contrato menor|facturae|dir3)\b/i.test(contextProbe);

    // ── ANTI-SESGO DEL ROSTER (P0): si el usuario está en la ficha de un
    // proveedor de terceros, el concierge habla de ESE proveedor y de su gremio.
    // La ficha manda sobre el catálogo propio (nada de serenata ni tarifa del
    // solista) salvo pregunta expresa por música en directo.
    const pageContext = resolvePageContext({ pathname, message });
    const isProviderFicha: boolean = pageContext.kind === 'provider';
    const fichaCategory: string =
      pageContext.category !== null && pageContext.category.length > 0 ? pageContext.category : 'servicios para eventos';
    const fichaQuoteUrl: string =
      pageContext.name.trim().length > 0 ? `/checkout/presupuesto?venue=${encodeURIComponent(pageContext.name)}` : '/presupuesto';
    const providerBlock: string = isProviderFicha
      ? `
4. ANCLAJE AL PROVEEDOR EN PANTALLA (PRIORIDAD ABSOLUTA — ANULA EL SESGO DEL ROSTER):
   - El usuario está en la ficha de "${pageContext.name}"${pageContext.municipality !== null ? ` (${pageContext.municipality})` : ''} · gremio: ${fichaCategory}.
   - Responde sobre ESTE proveedor y su gremio. PROHIBIDO ofrecer el roster de artistas, la serenata, el mariachi o la tarifa del solista, salvo que el usuario pregunte EXPRESAMENTE por música en directo o tenores.
   - Datos verificados de su ficha: ${pageContext.facts.join(' ')}
   - Datos que su ficha NO publica: ${pageContext.missing.join(', ')} → se cierran con el proveedor a través de la Conserjería EAR OS (${CENTRALITA_EAR_OS}).
   - Presupuesto del proveedor: ${fichaQuoteUrl}`
      : '';

    const lower = message.toLowerCase();

    // 1. Detección heurística de provincia y categoría en lenguaje natural
    let detectedProv: string = provinceSlug || '';
    if (!detectedProv) {
      for (const [kw, slug] of Object.entries(PROVINCE_KEYWORDS)) {
        if (lower.includes(kw)) {
          detectedProv = slug;
          break;
        }
      }
    }

    let detectedCat = categorySlug;
    if (!detectedCat) {
      for (const [kw, cat] of Object.entries(CATEGORY_KEYWORDS)) {
        if (lower.includes(kw)) {
          detectedCat = cat;
          break;
        }
      }
    }

    // 2. Consulta a PostgreSQL/Prisma (Read-Layer con caché y fallback)
    const providers = await getProvidersByLocation(detectedProv, detectedCat, 4);

    // 3. Recomendación del Roster Soberano (Venta Cruzada)
    // Cifras desde el SSOT (cero precios hardcodeados).
    const rosterRecommendation = {
      artist: 'Edwin Agudelo — Solista de Gala & Tenor Lírico',
      soundSystem: `Sonorización Bose F1 Line Array (${WATTS_PER_PAX} W/pax) + Microfonía Shure Axient`,
      startingPrice: TARIFA_BASE_SOLISTA_EUR,
      split: '80% Artista / 10% EAR OS / 10% VIMUME',
      holdDeposit: DEPOSITO_STRIPE_EUR,
      claimText: 'Bloquea este espacio junto con la producción musical oficial en un solo clic.',
    };

    const provName = detectedProv ? detectedProv.charAt(0).toUpperCase() + detectedProv.slice(1) : 'España';
    const catName = detectedCat || 'Espacios y Proveedores';
    // Regla de precio condicionada al anclaje: en ficha de proveedor NO se vende
    // la tarifa del solista (sesgo del roster), se vende la tarifa de su ficha.
    const priceRule: string = isProviderFicha
      ? `   - Si preguntan precio: usa SOLO la tarifa publicada en la ficha del proveedor (bloque 4). PROHIBIDO aplicar, mencionar o insinuar la tarifa del solista de Edwin Agudelo.
   - Depósito de bloqueo: ${DEPOSITO_STRIPE_EUR} euros, íntegramente deducible del total del evento.`
      : `   - Si preguntan precio del solista Edwin Agudelo: tarifa estándar oficial de ${TARIFA_ESTANDAR_SOLISTA_EUR} euros (${SOLISTA_KM_INCLUIDOS} km incluidos desde Hub Méntrida) y suelo canónico afiliado de ${TARIFA_BASE_SOLISTA_EUR} euros (${SOLISTA_KM_INCLUIDOS} km exentos, ${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} euros/km excedente).
   - Para bloquear la fecha en exclusiva en agenda se realiza un depósito de ${DEPOSITO_STRIPE_EUR} euros íntegramente deducible del total del evento.
   - Escribe siempre cantidades redondas y naturales ("${TARIFA_ESTANDAR_SOLISTA_EUR} euros", "${TARIFA_BASE_SOLISTA_EUR} euros", "${DEPOSITO_STRIPE_EUR} euros"). Cero decimales mecánicos como ".00".`;

    // 4. Síntesis Conversacional S-Class (Tier 1: DeepSeek Cloud -> Tier 2: Gemini Flash -> Tier 3: Determinista)
    let reply = '';
    const providersList = providers.map((p) => `${p.name} (${p.category || 'Proveedor'})`).join(', ');

    // ── ENRUTAMIENTO TAXONÓMICO (BLOQUE 4) ──────────────────────────────────
    // El motor determinista —y no el modelo— decide a qué URL se despacha una
    // consulta de género/precio. El modelo sólo redacta sobre ese destino ya
    // resuelto: así es imposible inventar una ruta que no exista (AF-1).
    const taxonomy: TaxonomyMatch = resolveTaxonomyMatch(message);
    const taxonomyBlock: string = taxonomy.facet !== null
      ? `
5. ENRUTAMIENTO TAXONÓMICO YA RESUELTO POR EL MOTOR (PROHIBIDO INVENTAR OTRA RUTA):
   - Género/forma detectado: ${taxonomy.label} (familia: ${taxonomy.family?.label ?? 'música'}).
   - Enlace exacto de catálogo: ${taxonomy.href}
   - Enlace exacto de cotización: /presupuesto
   - Cierra SIEMPRE invitando al presupuesto y al WhatsApp oficial ${CENTRALITA_EAR_OS}.`
      : `
5. ENRUTAMIENTO SIN GÉNERO DETECTADO:
   - Si el cliente menciona un género o formato musical, oriéntale a /proveedores?categoria=musica o a /presupuesto.
   - Cierra SIEMPRE invitando al presupuesto y al WhatsApp oficial ${CENTRALITA_EAR_OS}.`;

    const otzarretaMenusPrompt = OTZARRETA_WEDDING_MENUS.map((m, idx) => {
      const p = formatOtzarretaMenuPrice(m.priceEur);
      return `${idx + 1}. ${m.name}: ${p ? `${p} + IVA` : 'consultar'}`;
    }).join('\n');

    const otzarretaRoleBlock = isOtzarreta
      ? `\n\n---\nROL ESPECIAL: Maître Digital del Asador Restaurante Otzarreta en Derio (Bizkaia)\nMenús Oficiales:\n${otzarretaMenusPrompt}\nDatos Físicos:\n- Parrilla tradicional de carbón de encina y sarmiento.\n- Aforo: Comedor acristalado 50 a 200 comensales (ampliable a 350 con jardín y carpa).\n- Párking privado para más de 120 vehículos.\n- Ceremonia civil exterior en jardín.\n- Cláusula Boda Exclusiva: "Una sola boda por día. Toda la finca y salones en exclusiva".\n---\n`
      : '';

    const b2gRoleBlock = isB2g
      ? `\n6. PROTOCOLO B2G INSTITUCIONAL ACTIVO:\n   - Contratos menores Art. 118 LCSP hasta ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} € preventivos (límite ${LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES')} € + IVA), Facturae DIR3 vía FACe.`
      : '';

    const systemPrompt = `Eres el Maître de Sala de Productora EAR para la Red de Fincas, Artistas y Proveedores de Gala.${otzarretaRoleBlock}
DIRECTIVA INMUTABLE (HUMANO, EMPÁTICO Y RESOLUTIVO — MÁXIMO 3 LÍNEAS):
0. HILO CONDUCTOR (OBLIGATORIO):
   - Recibes el historial de la conversación. Úsalo: si el cliente ya dijo fecha, provincia o tipo de evento, NO se lo vuelvas a preguntar.
   - Continúa la conversación donde se quedó. PROHIBIDO reiniciar el saludo o repetir la bienvenida.
   - Si detectas un dato ya aportado, confírmalo en una sola frase y avanza al siguiente paso.
1. REGLA DE ORO ANTI-LORO Y SUCINTO (MÁXIMO 3 LÍNEAS / 40 PALABRAS):
   - Responde ESTRICTAMENTE a la duda del usuario con empatía y sobriedad.
   - PROHIBIDO soltar monólogos. Máximo 3 líneas breves y directas.
   - PROHIBIDO mencionar licitaciones B2G o Art. 118 LCSP a novios o bodas.
   - PROHIBIDO proponer Otzarreta o caseríos de Derio a consultas fuera de Bizkaia.
   - Bebe la información exclusivamente de la ficha del proveedor o artista en pantalla si está disponible (${activeEntityName || pageContext.name || 'catálogo general'}${activeAsin ? ` · ${activeAsin}` : ''}).
   - PROHIBIDO mencionar leyes acústicas (Ley 37/2003), decibelios, homologaciones o el reparto del split (80/10/10) a menos que el usuario pregunte expresamente por acústica o finanzas.
1bis. ORIENTACIÓN AL CIERRE (SIEMPRE):
   - Toda respuesta debe terminar acercando al cliente al cierre: o bien pedir el dato que falta (fecha, provincia, número de invitados), o bien invitar a confirmar por WhatsApp o generar presupuesto.
   - PROHIBIDO divagar sobre temas ajenos a eventos. Si el cliente cambia de tema, reconduce en una frase a su evento.
2. PRECIOS Y NÚMEROS LIMPIOS:
${priceRule}
3. CONTEXTO DISPONIBLE:
   - Ubicación detectada: ${provName}
   - Categoría consultada: ${catName}
   - Proveedores encontrados en la base de datos: ${providersList || 'Búsqueda personalizada en curso'}
   - Turnos previos en este hilo: ${history.length}
   - Teléfono / WhatsApp oficial: ${CENTRALITA_EAR_OS}${providerBlock}${taxonomyBlock}${b2gRoleBlock}`;


    if (isDeepSeekConfigured()) {
      try {
        const dsRes = await runDeepSeekChat({
          model: 'deepseek-chat',
          system: systemPrompt,
          prompt: `Mensaje del cliente: "${message}"`,
          // 🧵 Memoria de sesión real: el modelo recibe los turnos previos.
          history,
          temperature: 0.3,
        });
        if (dsRes.available && dsRes.content.trim()) {
          reply = dsRes.content.trim();
        }
      } catch (err: unknown) {
        console.warn('⚠️ [CONCIERGE_DEEPSEEK_FALLBACK]:', err);
      }
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!reply && geminiKey && geminiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        // Gemini usa roles 'user' | 'model': el system prompt viaja como primer
        // turno y el historial se traduce a su vocabulario (multi-turno real).
        const geminiHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Entendido. Respondo con ese contrato.' }] },
        ];
        for (const turn of history) {
          geminiHistory.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.content }],
          });
        }
        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(`Mensaje del cliente: "${message}"`);
        reply = result.response.text();
      } catch (err: unknown) {
        console.warn('⚠️ [CONCIERGE_GEMINI_FALLBACK]:', err);
      }
    }

    if (!reply) {
      if (isProviderFicha) {
        // Determinista anclado a la ficha: cero lobby del roster, cero invención.
        reply = `Estás en la ficha de **${pageContext.name}**${pageContext.municipality !== null ? ` (${pageContext.municipality})` : ''} (${fichaCategory}). ${pageContext.facts.slice(0, 2).join(' ')}`;
      } else if (isB2g) {
        reply = `Gabinete B2G activo para contratos menores Art. 118 LCSP (techo preventivo ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €, Facturae DIR3). ¿Qué municipio y fecha de festejo estás planificando?`;
      } else if (providers.length > 0) {
        reply = `He seleccionado opciones destacadas de **${catName}** en **${provName}** para tu evento. ¿Qué fecha y número aproximado de invitados tenéis previstos?`;
      } else {
        reply = `Será un placer ayudarte con **${catName}** en **${provName}**. ¿Qué fecha y aforo aproximado tenéis previstos para preparar tu propuesta?`;
      }
    }

    // Normalizar fonéticamente cualquier cifra para que no existan aberraciones
    reply = normalizeCurrencyAndNumbers(reply);

    const cleanCentralitaDigits = CENTRALITA_EAR_OS.replace(/\D/g, '');
    const initialWaText = activeEntityName
      ? `Hola, consulto disponibilidad y presupuesto para ${activeEntityName}`
      : taxonomy.label.length > 0
        ? `Quiero presupuesto para ${taxonomy.label}`
        : 'Quiero presupuesto para mi evento';
    const whatsappHref = buildWhatsAppHandoffUrl(
      cleanCentralitaDigits,
      {
        asin: activeAsin,
        city: detectedProv ?? undefined,
        serviceKind: isB2g ? 'b2g' : detectedCat ?? undefined,
        rawQuery: message.slice(0, 100),
      },
      initialWaText,
    );

    const suggestedChips: string[] = isProviderFicha
      ? [
          `Más datos de ${pageContext.name}`,
          'Verificar disponibilidad de fecha',
        ]
      : isB2g
        ? [
            'Contrato menor Art. 118 LCSP',
            'Memoria técnica Ley 37/2003',
          ]
        : isOtzarreta
          ? [
              'Menús y aforos de Otzarreta',
              'Verificar disponibilidad de fecha',
            ]
          : taxonomy.facet !== null
            ? [
                `Ver ${taxonomy.label} en el catálogo`,
                'Calcular mi presupuesto',
              ]
            : [
                `Espacios y fincas en ${provName}`,
                'Calcular mi presupuesto',
              ];

    return NextResponse.json({
      success: true,
      reply,
      providers,
      detectedLocation: {
        province: provName,
        provinceSlug: detectedProv,
        category: isProviderFicha ? fichaCategory : detectedCat || 'General',
      },
      // En ficha de proveedor o B2G NO se inyecta la tarjeta del roster (sesgo).
      rosterRecommendation: isProviderFicha || isB2g ? undefined : rosterRecommendation,
      // 🧭 ENRUTAMIENTO TAXONÓMICO (BLOQUE 4): el destino lo decide el MOTOR,
      // nunca el modelo. El cliente sólo pinta los enlaces ya validados.
      taxonomy: {
        matched: taxonomy.facet !== null,
        facetId: taxonomy.facet?.id ?? null,
        label: taxonomy.label,
        familyLabel: taxonomy.family?.label ?? '',
        catalogHref: taxonomy.href,
        quoteHref: TAXONOMY_QUOTE_HREF,
        whatsappHref,
      },
      suggestedChips: suggestedChips.slice(0, 3),
    });

  } catch (error: unknown) {
    console.error('[CONCIERGE_CHAT_ERROR]', error);
    return NextResponse.json(
      { error: 'Error procesando la consulta conversacional' },
      { status: 500 }
    );
  }
}

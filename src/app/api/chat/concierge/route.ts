import { NextResponse } from 'next/server';
import { getProvidersByLocation } from '@/lib/data/vampire-service';
import { runDeepSeekChat, isDeepSeekConfigured } from '@/lib/compiler/deepseek-inference';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { normalizeCurrencyAndNumbers } from '@/lib/voice/speechNormalizer';
import { resolvePageContext } from '@/lib/agents/pageContext';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// In-Memory Sliding Window Rate Limiter (20 req/min por IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;

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
    const { message, provinceSlug, categorySlug, pathname } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 });
    }

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
    let detectedProv = provinceSlug;
    if (!detectedProv) {
      for (const [kw, slug] of Object.entries(PROVINCE_KEYWORDS)) {
        if (lower.includes(kw)) {
          detectedProv = slug;
          break;
        }
      }
    }
    detectedProv = detectedProv || 'madrid';

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

    const provName = detectedProv.charAt(0).toUpperCase() + detectedProv.slice(1);
    const catName = detectedCat || 'Espacios y Proveedores';
    // Regla de precio condicionada al anclaje: en ficha de proveedor NO se vende
    // la tarifa del solista (sesgo del roster), se vende la tarifa de su ficha.
    const priceRule: string = isProviderFicha
      ? `   - Si preguntan precio: usa SOLO la tarifa publicada en la ficha del proveedor (bloque 4). PROHIBIDO aplicar, mencionar o insinuar la tarifa del solista de Edwin Agudelo.
   - Depósito de bloqueo: ${DEPOSITO_STRIPE_EUR} euros, íntegramente deducible del total del evento.`
      : `   - Si preguntan precio: tarifa base de Edwin Agudelo como solista es de ${TARIFA_BASE_SOLISTA_EUR} euros (incluye sonido Bose F1 de alta fidelidad).
   - Para bloquear la fecha en exclusiva en agenda se realiza un depósito de ${DEPOSITO_STRIPE_EUR} euros íntegramente deducible del total del evento.
   - Escribe siempre cantidades redondas y naturales ("${TARIFA_BASE_SOLISTA_EUR} euros", "${DEPOSITO_STRIPE_EUR} euros"). Cero decimales mecánicos como ".00".`;

    // 4. Síntesis Conversacional S-Class (Tier 1: DeepSeek Cloud -> Tier 2: Gemini Flash -> Tier 3: Determinista)
    let reply = '';
    const providersList = providers.map((p) => `${p.name} (${p.category || 'Proveedor'})`).join(', ');

    const systemPrompt = `Eres el Concierge Inteligente de Productora EAR para Edwin Agudelo y la Red de Fincas y Proveedores de Gala.
DIRECTIVA INMUTABLE (HUMANO, EMPÁTICO Y RESOLUTIVO — CERO LORO):
1. REGLA DE ORO ANTI-LORO:
   - Responde ESTRICTAMENTE a la duda del usuario con empatía y cercanía.
   - PROHIBIDO mencionar leyes acústicas (Ley 37/2003), decibelios, homologaciones o el reparto del split (80/10/10) a menos que el usuario pregunte expresamente por acústica o finanzas.
   - PROHIBIDO soltar discursos largos. Máximo 2 párrafos concisos y elegantes.
2. PRECIOS Y NÚMEROS LIMPIOS:
${priceRule}
3. CONTEXTO DISPONIBLE:
   - Ubicación detectada: ${provName}
   - Categoría consultada: ${catName}
   - Proveedores encontrados en la base de datos: ${providersList || 'Búsqueda personalizada en curso'}
   - Teléfono / WhatsApp oficial: ${CENTRALITA_EAR_OS}${providerBlock}`;

    if (isDeepSeekConfigured()) {
      try {
        const dsRes = await runDeepSeekChat({
          model: 'deepseek-chat',
          system: systemPrompt,
          prompt: `Mensaje del cliente: "${message}"`,
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
        const result = await model.generateContent([systemPrompt, `Cliente: ${message}`]);
        reply = result.response.text();
      } catch (err: unknown) {
        console.warn('⚠️ [CONCIERGE_GEMINI_FALLBACK]:', err);
      }
    }

    if (!reply) {
      if (isProviderFicha) {
        // Determinista anclado a la ficha: cero lobby del roster, cero invención.
        reply = `Estás en la ficha de **${pageContext.name}**${pageContext.municipality !== null ? ` (${pageContext.municipality})` : ''}, dentro de **${fichaCategory}**. ${pageContext.facts.slice(0, 2).join(' ')} Lo que su ficha no publica (${pageContext.missing.slice(0, 2).join(', ')}) lo cerramos con el proveedor desde la Conserjería EAR OS (${CENTRALITA_EAR_OS}).`;
      } else if (providers.length > 0) {
        reply = `He seleccionado perfiles destacados de **${catName}** en **${provName}** para tu evento. Puedes revisar las opciones a continuación o escribirnos directamente a WhatsApp para armar un paquete personalizado con Edwin Agudelo.`;
      } else {
        reply = `He registrado tu solicitud para **${provName}**. Nuestro equipo en el Hub Central de Méntrida te contactará de inmediato con opciones a medida y fechas disponibles.`;
      }
    }

    // Normalizar fonéticamente cualquier cifra para que no existan aberraciones
    reply = normalizeCurrencyAndNumbers(reply);

    return NextResponse.json({
      success: true,
      reply,
      providers,
      detectedLocation: {
        province: provName,
        provinceSlug: detectedProv,
        category: isProviderFicha ? fichaCategory : detectedCat || 'General',
      },
      // En ficha de proveedor NO se inyecta la tarjeta del roster (sesgo).
      rosterRecommendation: isProviderFicha ? undefined : rosterRecommendation,
      suggestedChips: isProviderFicha
        ? [
            `Más datos de ${pageContext.name}`,
            'Verificar disponibilidad de fecha',
            'Presupuesto para mi evento',
            'Hablar con la Conserjería',
          ]
        : [
            `Fincas rústicas en ${provName}`,
            `Catering a las brasas en ${provName}`,
            `Mariachi y Solista en ${provName}`,
            `Discomóvil Bose F1 en ${provName}`,
          ],
    });
  } catch (error: unknown) {
    console.error('[CONCIERGE_CHAT_ERROR]', error);
    return NextResponse.json(
      { error: 'Error procesando la consulta conversacional' },
      { status: 500 }
    );
  }
}

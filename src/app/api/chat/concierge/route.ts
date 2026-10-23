import { NextResponse } from 'next/server';
import { getProvidersByLocation } from '@/lib/data/vampire-service';
import { runDeepSeekChat, isDeepSeekConfigured } from '@/lib/compiler/deepseek-inference';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { normalizeCurrencyAndNumbers } from '@/lib/voice/speechNormalizer';

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
    const { message, provinceSlug, categorySlug } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 });
    }

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
    const rosterRecommendation = {
      artist: 'Edwin Agudelo — Solista de Gala & Tenor Lírico',
      soundSystem: 'Sonorización Bose F1 Line Array (12 W/pax) + Microfonía Shure Axient',
      startingPrice: 350,
      split: '80% Artista / 10% EAR OS / 10% VIMUME',
      holdDeposit: 100,
      claimText: 'Bloquea este espacio junto con la producción musical oficial en un solo clic.',
    };

    const provName = detectedProv.charAt(0).toUpperCase() + detectedProv.slice(1);
    const catName = detectedCat || 'Espacios y Proveedores';

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
   - Si preguntan precio: tarifa base de Edwin Agudelo como solista es de 350 euros (incluye sonido Bose F1 de alta fidelidad).
   - Para bloquear la fecha en exclusiva en agenda se realiza un depósito de 100 euros íntegramente deducible del total del evento.
   - Escribe siempre cantidades redondas y naturales ("350 euros", "100 euros"). Cero decimales mecánicos como ".00".
3. CONTEXTO DISPONIBLE:
   - Ubicación detectada: ${provName}
   - Categoría consultada: ${catName}
   - Proveedores encontrados en la base de datos: ${providersList || 'Búsqueda personalizada en curso'}
   - Teléfono / WhatsApp oficial: +34 693 693 048`;

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
      if (providers.length > 0) {
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
        category: detectedCat || 'General',
      },
      rosterRecommendation,
      suggestedChips: [
        `Fincas rústicas en ${provName}`,
        `Catering a las brasas en ${provName}`,
        `Mariachi y Solista en ${provName}`,
        `Discomóvil Bose F1 en ${provName}`,
      ],
    });
  } catch (error: any) {
    console.error('[CONCIERGE_CHAT_ERROR]', error);
    return NextResponse.json(
      { error: 'Error procesando la consulta conversacional' },
      { status: 500 }
    );
  }
}

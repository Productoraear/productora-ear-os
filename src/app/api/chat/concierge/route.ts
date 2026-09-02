import { NextResponse } from 'next/server';
import { getProvidersByLocation } from '@/lib/data/vampire-service';

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

    let reply = `He seleccionado los mejores perfiles de **${catName}** en **${provName}** dentro del Roster Homologado. Todos cuentan con protocolo transaccional *Hold & Ping* (pre-autorización de 100 € sin coste de cancelación en 24h).`;

    if (providers.length === 0) {
      reply = `He registrado tu solicitud para **${provName}**. Nuestro equipo en el Hub Central de Méntrida te contactará de inmediato con opciones a medida.`;
    }

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

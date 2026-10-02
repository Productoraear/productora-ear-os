import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL no proporcionada', { status: 400 });
  }

  try {
    // Defensa en profundidad: solo HTTP(S) público, sin protocolos internos (SSRF).
    const target = new URL(imageUrl);
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      return new NextResponse('Protocolo no permitido', { status: 400 });
    }

    const response = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.bodas.net/',
      },
    });

    if (!response.ok) {
      return new NextResponse('Error al obtener la imagen', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: unknown) {
    console.error('MEDIA_PROXY_ERROR:', error);
    return new NextResponse('Error interno del proxy', { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 🤖 ROUTE HANDLER /llms.txt
 * Devuelve el manifiesto canónico de Generative Engine Optimization (GEO) para
 * ChatGPT, Perplexity, Claude, Gemini, SearchGPT y Google AI Overviews.
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'llms.txt');
    const content = fs.readFileSync(filePath, 'utf-8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return new NextResponse('Error loading llms.txt', { status: 500 });
  }
}

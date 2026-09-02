import { NextRequest, NextResponse } from 'next/server';
import { HybridAIEngine } from '@/lib/ai/HybridAIEngine';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, systemInstruction, temperature, maxTokens, preferredModel } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt es requerido' }, { status: 400 });
    }

    const response = await HybridAIEngine.generate({
      prompt,
      systemInstruction,
      temperature,
      maxTokens,
      preferredModel,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('❌ [AI_INFER_API_ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error en inferencia de IA' }, { status: 500 });
  }
}

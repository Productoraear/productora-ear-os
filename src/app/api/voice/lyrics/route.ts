import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OLLAMA_ENDPOINT = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:27b';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { honorees = 'Carmen y Manuel', occasion = 'aniversario', genre = 'bolero_gala', artist = 'Edwin Agudelo' } = body;

    const systemPrompt = `Eres el letrista oficial de Productora EAR para el Tenor Lírico ${artist}. 
Tu misión es escribir una dedicatoria cantada breve, profunda y emotiva (máximo 4 a 6 versos) para homenajear a ${honorees} con motivo de su ${occasion} en estilo ${genre}.
El tono debe ser noble, poético y solemne. Solo devuelve los versos poéticos, sin introducciones ni comentarios adicionales.`;

    const userPrompt = `Escribe la dedicatoria lírica personalizada para ${honorees} (${occasion}).`;

    // Intentar conectar con Ollama local (GPU AMD RX 7900 XTX)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${OLLAMA_ENDPOINT}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 120
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const lyrics = data.response?.trim();
        if (lyrics && lyrics.length > 20) {
          return NextResponse.json({
            lyrics,
            source: 'ollama_gpu_local',
            model: OLLAMA_MODEL
          });
        }
      }
    } catch {
      // Continuar al motor soberano determinista S-Class
    }

    // Fallback soberano instantáneo de alta poesía
    const templates: Record<string, string> = {
      boda: `Hoy dos caminos se funden en una sola melodía sagrada,\npara ${honorees}, cuya entrega desafía al propio tiempo.\nQue esta noche de gala sea el inicio de su leyenda eterna,\ncantada con el alma y sellada en el corazón.`,
      aniversario: `Veinticinco años no son un suspiro, son una vida de complicidad,\npara ${honorees}, que han demostrado que el amor verdadero vence y perdura.\nBrindamos con orgullo por cada amanecer que construyeron juntos,\ncon la voz del alma y la emoción de quienes os aman.`,
      vimume_terapia: `Aunque los años pasen y los recuerdos jueguen a esconderse,\nel amor grabado en el alma de ${honorees} jamás se desvanece.\nEsta canción viaja a través de la memoria para acariciar tu historia,\ny recordarte que siempre estarás presente en nuestro corazón.`,
      homenaje_vital: `Vuestras manos construyeron el hogar que hoy nos cobija,\npara ${honorees}, fuente inagotable de nobleza y gratitud.\nQue el eco de esta voz sea el más sincero de los homenajes,\nporque quien da la vida por los suyos merece cantar para siempre.`
    };

    const lyrics = templates[occasion] || templates.aniversario;

    return NextResponse.json({
      lyrics,
      source: 'sovereign_lyrics_engine',
      model: 'ear-poetic-master'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error en generador de lírica' },
      { status: 500 }
    );
  }
}

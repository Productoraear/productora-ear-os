import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Generador sintético de audio WAV de alta fidelidad (44.1kHz 16-bit PCM estéreo)
 * Simula una pista acústica con resonancia armónica a 432 Hz y acordes cálidos de fondo.
 */
function generateHarmonicAcousticWav(durationSeconds: number = 8): Buffer {
  const sampleRate = 44100;
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const totalSamples = sampleRate * durationSeconds;
  const dataSize = totalSamples * blockAlign;
  const bufferSize = 44 + dataSize;

  const buffer = Buffer.alloc(bufferSize);

  // Cabecera RIFF/WAVE
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(bufferSize - 8, 4);
  buffer.write('WAVE', 8);

  // Subchunk 1: fmt
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // Subchunk 2: data
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generación de onda acústica armónica (Progresión armónica elegante con envolvente ADSR)
  let offset = 44;
  const baseFreq = 216; // Armónico de 432 Hz (afinación áurea)
  const chordNotes = [216, 270, 324, 432]; // Acorde mayor cálido

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    
    // Envolvente de entrada suave (fade in 1s) y salida suave (fade out 1.5s)
    let envelope = 1.0;
    if (t < 1.0) {
      envelope = t;
    } else if (t > durationSeconds - 1.5) {
      envelope = (durationSeconds - t) / 1.5;
    }

    // Vibrato sutil y resonancia acústica
    const vibrato = 1.0 + 0.006 * Math.sin(2 * Math.PI * 5 * t);
    
    // Mezcla armónica de notas
    let sampleVal = 0;
    chordNotes.forEach((freq, idx) => {
      const weight = 1 / (idx + 1.2);
      sampleVal += weight * Math.sin(2 * Math.PI * freq * vibrato * t);
    });

    // Modulación acústica cálida estilo sala de conciertos
    sampleVal *= 0.28 * envelope;

    // Convertir a PCM 16-bit
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sampleVal * 32767)));

    // Canal izquierdo
    buffer.writeInt16LE(intSample, offset);
    // Canal derecho con leve paneo estéreo
    const rightSample = Math.max(-32768, Math.min(32767, Math.floor(intSample * (0.95 + 0.05 * Math.sin(t)))));
    buffer.writeInt16LE(rightSample, offset + 2);

    offset += 4;
  }

  return buffer;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const duration = parseInt(searchParams.get('sec') || '10', 10);
    const safeDuration = Math.min(Math.max(duration, 3), 30);

    const wavBuffer = generateHarmonicAcousticWav(safeDuration);

    return new NextResponse(new Uint8Array(wavBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': wavBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error en síntesis acústica' },
      { status: 500 }
    );
  }
}

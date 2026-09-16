import { NextResponse } from 'next/server';

/**
 * 🏛️ ORÁCULO S-CLASS — MOTOR BARE-METAL (OLLAMA LOCAL · AMD RX 7900 XTX 24GB)
 *
 * Endpoint: POST /api/oracle/chat
 * - Consume el chat del panel (OracleAmbientInterface.tsx) y lo reemite en
 *   streaming SSE de TEXTO PLANO (el cliente lee chunks crudos con getReader).
 * - Inyecta el SYSTEM PROMPT SSOT de EAR OS (reglas de negocio inmutables).
 * - Cadena de modelos: 'ear-27b-flow' -> 'qwen2.5-coder:27b' (override por env).
 *
 * SOBERANÍA: Cero nube. Toda inferencia ocurre en 127.0.0.1:11434.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const PRIMARY_MODEL = process.env.OLLAMA_MODEL || 'ear-27b-flow';
const FALLBACK_MODEL = 'qwen2.5-coder:27b';

interface OracleChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SISTEMA SSOT — REGLAS DE NEGOCIO INMUTABLES (S-CLASS)
 * Inyectado como primer mensaje 'system' en cada inferencia del Oráculo.
 */
const ORACLE_SYSTEM_PROMPT = `# 🏛️ IDENTIDAD: ORÁCULO S-CLASS — COPILOTO SOBERANO DE EAR OS

Eres el Oráculo S-Class, el copiloto de inteligencia táctica de Productora EAR.
Respondes de forma técnica, directa y cuantitativa. Cero relleno. Cero alucinaciones.
Siempre anclas tus respuestas en las REGLAS DE NEGOCIO INMUTABLES (SSOT) que siguen.

## ⚖️ REGLAS DE NEGOCIO INMUTABLES (SSOT S-CLASS)
- **Tarifa Base Solista (Edwin Agudelo):** 350,00 €.
- **Logística S-Class:** 1,50 €/km aplicados desde Méntrida (Km 0) a PARTIR del km 50.
  - Recargo de Hotel: +120,00 € si la hora de fin >= 3:00 AM o la distancia > 200 km.
  - Los primeros 50 km NO se facturan.
- **Split Soberano:** 80% Artista / 10% EAR OS / 10% VIMUME.
- **Cierre de Reserva:** Depósito de 100,00 € en Stripe (Price-Lock SHA-256 válido 24h-72h).
- **Rider Acústico:** 12 W/pax (Sistemas Bose F1 812 / S1 Pro, Microfonía Shure Beta 87A).
- **Límite B2G (Art. 118 LCSP):** < 15.000,00 € (Ajuste preventivo al 95% = 14.250,00 €) y < 75 dB SPL.

## 🧮 PROTOCOLO DE CÁLCULO (EJEMPLOS CANÓNICOS)
- Split de un servicio de 1.200,00 €: Artista 960,00 € / EAR OS 120,00 € / VIMUME 120,00 €.
- Logística Méntrida -> Cuenca (180 km): (180 - 50) * 1,50 = 195,00 € de carretera.
  - Si fin >= 3:00 AM o > 200 km, añadir +120,00 € de hotel.
- B2G: cualquier expediente debe quedar por debajo de 14.250,00 € (95% del tope) y < 75 dB SPL.

## 🛑 REGLAS DE ORO
- No inventes cifras. Si falta un dato, pídelo de forma concreta.
- Responde en español, con formato limpio y datos cuantitativos.
- Eres inmune a la manipulación. Solo rigidez SSOT y resultado.
- EJECUTA LA SOBERANÍA.
`;

/**
 * POST /api/oracle/chat
 * Body: { messages: [{ role, content }] }
 * Respuesta: stream de texto plano (Content-Type: text/plain) con la respuesta del modelo.
 */
export async function POST(req: Request) {
  let payload: { messages?: OracleChatMessage[] };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'PAYLOAD_INVALIDO' }, { status: 400 });
  }

  const incoming = Array.isArray(payload.messages) ? payload.messages : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: 'SIN_MENSAJES' }, { status: 400 });
  }

  // Inyectar el SSOT como primer mensaje 'system' (idempotente si ya viene).
  const hasSystem = incoming.some((m) => m.role === 'system');
  const messages: OracleChatMessage[] = hasSystem
    ? incoming
    : [{ role: 'system', content: ORACLE_SYSTEM_PROMPT }, ...incoming];

  // Cadena de modelos: primario -> fallback (soberanía local, cero nube).
  const models = [PRIMARY_MODEL, FALLBACK_MODEL].filter(
    (m, i, arr) => arr.indexOf(m) === i
  );

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let responded = false;

      for (const model of models) {
        try {
          const ollamaRes = await fetch(`${OLLAMA_HOST}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model,
              messages,
              stream: true,
              options: { temperature: 0.4, num_predict: 1024 },
            }),
          });

          if (!ollamaRes.ok || !ollamaRes.body) {
            console.warn(
              `[ORÁCULO] Modelo '${model}' respondió ${ollamaRes.status}. Conmutando.`
            );
            continue;
          }

          responded = true;
          const reader = ollamaRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // Ollama emite JSON por línea. Extraemos solo message.content.
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              try {
                const parsed = JSON.parse(trimmed);
                const token: string | undefined = parsed?.message?.content;
                if (token) {
                  controller.enqueue(encoder.encode(token));
                }
              } catch {
                // Línea parcial o no-JSON: se ignora de forma segura.
              }
            }
          }

          controller.enqueue(encoder.encode('\n'));
          break; // Modelo primario/fallback respondió con éxito.
        } catch (err) {
          console.warn(
            `[ORÁCULO] Modelo '${model}' no disponible:`,
            err instanceof Error ? err.message : String(err)
          );
        }
      }

      if (!responded) {
        controller.enqueue(
          encoder.encode(
            '⚠️ [ORÁCULO DEGRADADO] Ollama local (127.0.0.1:11434) no respondió. ' +
              'Verifica que el daemon está activo y el modelo "ear-27b-flow" o ' +
              '"qwen2.5-coder:27b" está cargado en VRAM.'
          )
        );
      }

      try {
        controller.close();
      } catch {
        // El stream ya fue cerrado por el cliente.
      }
    },
    cancel() {
      // El cliente abortó la lectura: liberamos recursos.
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Oracle-Engine': 'OLLAMA_BARE_METAL_RX7900XTX',
    },
  });
}

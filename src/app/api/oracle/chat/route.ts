import { NextRequest, NextResponse } from 'next/server';
import { runGeminiForgeChat, isGeminiConfigured } from '@/lib/compiler/gemini-inference';
import { runDeepSeekChat, isDeepSeekConfigured } from '@/lib/compiler/deepseek-inference';
import { runGpuChat, DEFAULT_GPU_MODEL } from '@/lib/compiler/qwen-gpu-inference';
import {
  TARIFA_BASE_SOLISTA_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SUPLEMENTO_HOTEL_EUR,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';
import { TWELVE_CANONICAL_HUBS } from '@/lib/config/twelve-canonical-hubs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Role = 'system' | 'user' | 'assistant';

type ChatMessage = {
  role: Role;
  content: string;
};

type ChatRequestBody = {
  messages?: unknown;
  model?: unknown;
};

function isRole(value: unknown): value is Role {
  return value === 'system' || value === 'user' || value === 'assistant';
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as {
    role?: unknown;
    content?: unknown;
  };

  return isRole(candidate.role) && typeof candidate.content === 'string';
}

const ORACLE_SYSTEM_PROMPT = `Eres el ORÁCULO EJECUTIVO S-CLASS de Productora EAR OS (productoraear.com), el Copiloto de Dirección Generalista en Lenguaje Natural para Edwin Agudelo (CEO), Proveedores, Artistas y Técnicos B2G.

REGLAS DE NEGOCIO INMUTABLES (ZONA CERO SSOT):
- Tarifa Base Solista (Edwin Agudelo): ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € (suelo innegociable, incluye Bose F1/S1 Pro y microfonía Shure Beta 87A).
- Logística: ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km desde Hub Méntrida a partir del km ${LOGISTICA_KM_EXENTOS} (+${SUPLEMENTO_HOTEL_EUR} € hotel si fin >= 03:00 AM o distancia > 200 km).
- Split Soberano: ${Math.round(SPLIT_SOBERANO.artista * 100)}% Artista / ${Math.round(SPLIT_SOBERANO.earOs * 100)}% EAR OS / ${Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME Impacto Social.
- Cierre y Garantía: Depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € Stripe Price-Lock SHA-256 (100% deducible del total, bloqueo atómico en calendario).
- Acústica Ley 37/2003: < ${LIMITE_SPL_DB} dB SPL salud pública / 65-75 dBA VIMUME 40 Hz / ${WATTS_PER_PAX} W/pax.
- Licitaciones B2G Art. 118 LCSP: Techo preventivo ${SAFE_LCSP_CEILING_EUR.toFixed(2)} € (SROI 4.85x).
- Centralita Oficial: +34 693 693 048.

ARQUITECTURA DE LAS 12 SUPER-PANTALLAS CANÓNICAS:
${TWELVE_CANONICAL_HUBS.map((h) => `- [HUB ${String(h.number).padStart(2, '0')}] ${h.title} (${h.route}): ${h.tabs.map((t) => t.label).join(' | ')}`).join('\n')}

Responde SIEMPRE en español claro, ejecutivo, directo y accionable (sin tecnicismos innecesarios salvo que el usuario los pida), indicando cifras exactas en euros y a qué módulo o ruta de EAR OS dirigirse.`;

function buildDeterministicExecutiveReply(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('telegram') || lower.includes('radar') || lower.includes('oportunidad') || lower.includes('licitacion')) {
    return [
      '📡 **Diagnóstico del Radar de Oportunidades y Telegram:**',
      '1. **Por qué no recibías alertas automáticas:** Las rutas `/api/cron/opportunity-radar` y `/api/cron/b2g-telegram-hunter` están protegidas con `verifyCronSecret` (exige cabecera `Authorization: Bearer <CRON_SECRET>`) y necesitan que el programador de tareas de Coolify (o n8n) las invoque cada mañana, además de tener `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` activos en el contenedor.',
      '2. **Acción inmediata en 1 clic:** En `/admin` → pestaña **⚡ Radar Oportunidades & B2G**, pulsa **"Ejecutar Barrido en Vivo"** para escanear BOE + TED UE + Google News y despachar al instante a Telegram con el botón **"Enviar a Telegram"**.',
    ].join('\n');
  }

  if (lower.includes('compiler') || lower.includes('compilador') || lower.includes('prompt') || lower.includes('bloque') || lower.includes('palabra')) {
    return [
      '🧠 **Control Total en `/admin/compiler` (Modo Estudio Editable):**',
      '• Ahora dispones de **Edición Libre Palabra por Palabra** tanto del **Prompt Maestro Forjado** como del **Manifiesto DAG**, además de edición directa de la lista de archivos (`files`), comando verificador (`validation`) y acción antes de inyectar en `tasks_queue.json`.',
      '• También tienes un **Selector de Secciones Modulares** para activar/desactivar bloques específicos o redactar instrucciones 100% personalizadas sin límites de plantilla.',
    ].join('\n');
  }

  if (lower.includes('precio') || lower.includes('cotiz') || lower.includes('calcula') || lower.includes('km') || lower.includes('boda') || lower.includes('solista')) {
    const kmMatch = query.match(/(\d+)\s*km/i);
    const km = kmMatch ? Number(kmMatch[1]) : 80;
    const billableKm = Math.max(0, km - LOGISTICA_KM_EXENTOS);
    const portes = billableKm * LOGISTICA_EUR_PER_KM;
    const hotel = km > 200 || lower.includes('hotel') || lower.includes('madrugada') || lower.includes('3:00') ? SUPLEMENTO_HOTEL_EUR : 0;
    const total = TARIFA_BASE_SOLISTA_EUR + portes + hotel;
    const artista80 = (total * SPLIT_SOBERANO.artista).toFixed(2);
    const ear10 = (total * SPLIT_SOBERANO.earOs).toFixed(2);
    const vimume10 = (total * SPLIT_SOBERANO.vimume).toFixed(2);

    return [
      `💶 **Simulación Financiera SSOT (${km} km desde Hub Méntrida):**`,
      `• **Caché Base Solista (Edwin Agudelo):** ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €`,
      `• **Logística (${billableKm} km facturables × ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km):** ${portes.toFixed(2)} €`,
      `• **Suplemento Pernocta/Hotel:** ${hotel.toFixed(2)} €`,
      `• **TOTAL PRESUPUESTO:** **${total.toFixed(2)} €**`,
      `• **Split Soberano 80/10/10:** Artista ${artista80} € | EAR OS ${ear10} € | VIMUME ${vimume10} €`,
      `• **Cierre Inmediato:** Fianza deducible de **${DEPOSITO_STRIPE_EUR.toFixed(2)} €** (resta ${(total - DEPOSITO_STRIPE_EUR).toFixed(2)} € en liquidación final).`,
    ].join('\n');
  }

  return [
    '👑 **Copiloto Ejecutivo EAR OS S-Class Activo:**',
    `Recibida tu consulta: *"${query}"*`,
    '',
    '• **Finanzas & SSOT:** Tarifa Solista 350,00 € · Logística 1,50 €/km (>50 km) · Depósito 100,00 € deducible · Split 80/10/10 · Techo B2G 14.250,00 €.',
    '• **Control Total de Prompts:** Abre `/admin/compiler` para editar libremente cada palabra, bloque o archivo antes de inyectar a `tasks_queue.json`.',
    '• **Radar & Telegram:** Abre `/admin` (pestaña Radar) para disparar el escaneo BOE/TED/Google News y enviar alertas a Telegram en 1 clic.',
    '• ¿Quieres que calculemos un presupuesto por kilómetros/aforo, preparemos un pliego B2G Art. 118 o editemos una orden para la cola?',
  ].join('\n');
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    route: '/api/oracle/chat',
  });
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json(
      { error: 'Body must be an object.' },
      { status: 400 },
    );
  }

  const body = payload as ChatRequestBody;

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: 'messages must be a non-empty array.' },
      { status: 400 },
    );
  }

  const validatedMessages: ChatMessage[] = [];
  for (const message of body.messages) {
    if (!isChatMessage(message)) {
      return NextResponse.json(
        { error: 'Each message must include a valid role and string content.' },
        { status: 400 },
      );
    }
    validatedMessages.push(message);
  }

  const lastMessage = validatedMessages[validatedMessages.length - 1];
  if (!lastMessage) {
    return NextResponse.json(
      { error: 'messages must not be empty.' },
      { status: 400 },
    );
  }

  const conversationTranscript = validatedMessages
    .slice(-8)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  let answerText = '';

  // 1. Intentar Gemini Cloud Flash si está configurado
  if (!answerText && isGeminiConfigured()) {
    try {
      const gem = await runGeminiForgeChat({
        systemPrompt: ORACLE_SYSTEM_PROMPT,
        userPrompt: conversationTranscript,
        modelName: 'gemini-1.5-flash',
        jsonMode: false,
        temperature: 0.25,
      });
      if (gem.available && gem.content.trim()) {
        answerText = gem.content.trim();
      }
    } catch {
      // Fallback al siguiente motor
    }
  }

  // 2. Intentar DeepSeek Cloud si está configurado
  if (!answerText && isDeepSeekConfigured()) {
    try {
      const ds = await runDeepSeekChat({
        system: ORACLE_SYSTEM_PROMPT,
        prompt: conversationTranscript,
        json: false,
        temperature: 0.25,
        maxTokens: 1024,
      });
      if (ds.available && ds.content.trim()) {
        answerText = ds.content.trim();
      }
    } catch {
      // Fallback al siguiente motor
    }
  }

  // 3. Intentar GPU Local Ollama
  if (!answerText) {
    try {
      const gpu = await runGpuChat({
        model: typeof body.model === 'string' && body.model.trim() ? body.model.trim() : DEFAULT_GPU_MODEL,
        system: ORACLE_SYSTEM_PROMPT,
        prompt: conversationTranscript,
        json: false,
        temperature: 0.25,
        numPredict: 700,
      });
      if (gpu.content && gpu.content.trim()) {
        answerText = gpu.content.trim();
      }
    } catch {
      // Fallback determinístico ejecutivo
    }
  }

  // 4. Respuesta Ejecutiva Determinística S-Class (nunca falla ni devuelve eco mudo)
  if (!answerText) {
    answerText = buildDeterministicExecutiveReply(lastMessage.content);
  }

  return new Response(answerText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

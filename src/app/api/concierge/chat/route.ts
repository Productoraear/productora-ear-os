import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { resolveOtzarretaQuery } from '@/lib/rag/provider-context';
import { assembleMultiVaultRAGContext } from '@/lib/rag/multi-vault-aggregator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CLEAN_PHONE = CENTRALITA_EAR_OS.replace(/\D/g, '');

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .optional(),
  providerSlug: z.string().optional(),
  routeContext: z
    .object({
      pathname: z.string().optional(),
      providerName: z.string().optional(),
      category: z.string().optional(),
    })
    .optional(),
  voiceMode: z.boolean().optional(),
});

interface ConciergeResolution {
  reply: string;
  action?: {
    type: 'whatsapp' | 'dossier' | 'date_picker' | 'scraper';
    label: string;
    url?: string;
  };
  shouldEscalate: boolean;
}

/**
 * Generador LLM Neural S-Class a través de OpenRouter (Claude Haiku 4.5 / Gemini 2.5 Flash).
 */
async function generateNeuralConciergeResponse(
  userQuery: string,
  pathname: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const multiVaultContext = assembleMultiVaultRAGContext(userQuery, pathname);

  const systemPrompt = `Eres el Agente Concierge S-Class de Productora EAR (productoraear.com).
Tu misión es atender a novios, clientes y proveedores con máxima inteligencia, cortesía, precisión y naturalidad.
NO eres un bot rígido ni repites respuestas desconectadas de lo que el usuario pregunta.

BASE DE CONOCIMIENTO REAL DE PRODUCTORA EAR:
1. Restaurante y Finca de Bodas Homologada:
- Restaurante Jatetxea Ezkertza Berria & Otzarreta: Caserío tradicional vasco ubicado en Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia), a solo 8 minutos de Bilbao y 5 minutos del Aeropuerto.
- Exclusividad: Solo se celebra 1 evento o boda al día.
- Aforo: hasta 350 comensales (banquetes habituales de 50 a 200 invitados).
- PARKING: Parking privado gratuito dentro del caserío con más de 150 plazas vigiladas.
- Cocina y Parrilla: Alta gastronomía vasca de brasa al carbón de encina dirigida por Eduardo Martínez (chuletones de 1 Kg de ganado mayor, rodaballos salvajes, bogavante, rape, mariscos).
- 7 Menús Oficiales de Boda 2026: Cantábrico (100 € + IVA), Paloma (125 €), Especial Imperial (123,40 € con 1h barra libre y 1h DJ gratis), Temporada (142,50 €), Vasco (138 € pack completo con 2h barra libre, 2h DJ y autobús 55 pax), Ezkertza (155 € con chuletón 1 Kg y 1/2 bogavante), Caserío Beko (173 € con Möet & Chandon).
- Bloqueo de fecha: Depósito Stripe garantizado de 100 € (100% deducible del banquete).

2. Música y Artistas Exclusivos:
- Edwin Agudelo: Tenor solista y guitarrista clásico con sonido Bose L1 Pro. Suelo canónico 350 € base, estándar 550 € con 100 km incluidos desde Méntrida (Toledo). Solo aplica a su perfil de artista personal.
- Otros artistas: Mariachis de Gala, Mixel Violín (desde 450 €), DJs profesionales.
- REGLA SUPREMA DE AISLAMIENTO: NUNCA menciones a Edwin Agudelo si el usuario está en la ficha de un restaurante, finca o catering (como Otzarreta), ni en rutas de otros proveedores, salvo que pregunten específicamente por música o guitarrista para la ceremonia.

3. Logística Audiovisual y Sonometría:
- Sonorización Bose F1 y S-Class homologada bajo la Ley 37/2003 del Ruido.

4. B2G Institucional:
- Gabinete para ayuntamientos bajo Art. 118 LCSP (contratos menores hasta 14.999 € + IVA).

5. Portal y Bodas.net:
- Traslado Soberano en 1-Clic: importación gratuita de perfiles de Bodas.net a EAR OS sin comisiones.
- Centralita Oficial / WhatsApp: +34 693 693 048.
${multiVaultContext}

DIRECTIVAS CONVERSACIONALES OBLIGATORIAS:
- Si el usuario pregunta por restaurantes cerca de Bilbao, para bodas, o con parking gratuito: recomienda con entusiasmo Ezkertza Berria & Otzarreta en Derio (a 8 min de Bilbao, parking propio gratuito de 150 plazas, parrilla de carbón y menús desde 100 €).
- Si preguntan por otros proveedores, provincias o servicios en España: consulta y cita los datos de la base de proveedores homologados del Data Lake que aparecen arriba.
- Si preguntan "¿por qué no hablas?" o sobre la voz: explica con amabilidad que dispones de voz sintetizada en tiempo real que se activa pulsando el icono del altavoz arriba a la derecha, o que pueden usar el micrófono para hablar, o llamar a la Centralita (+34 693 693 048).
- Si preguntan si eres un bot o un agente: responde con elegancia que eres el Agente Concierge IA de Productora EAR, respaldado directamente por la Dirección General y la Centralita humana.
- AISLAMIENTO DE CATÁLOGO: En fichas de fincas, restaurantes, o consultas generales de catering, NUNCA menciones a Edwin Agudelo ni introduzcas temas ajenos a la gastronomía o al recinto consultado.
- Sé empático, claro, conciso (máximo 2 párrafos) y directo. No inventes datos fuera de este catálogo.`;

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userQuery },
  ];

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://productoraear.com',
        'X-Title': 'EAR OS Concierge',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4.5',
        max_tokens: 350,
        temperature: 0.3,
        messages: messagesPayload,
      }),
      signal: AbortSignal.timeout(4500),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text && typeof text === 'string' && text.trim().length > 10) {
        return text.trim();
      }
    }
  } catch (err) {
    console.warn('Fallback a motor determinista por timeout/error en OpenRouter:', err);
  }

  return null;
}

/**
 * Resuelve la acción visual interactiva (botón de WhatsApp, dossier, calendario) según la intención.
 */
function determineActionForQuery(
  rawQuery: string,
  pathname: string = ''
): ConciergeResolution['action'] {
  const q = rawQuery.toLowerCase();

  if (
    q.includes('restaurante') ||
    q.includes('boda') ||
    q.includes('otzarreta') ||
    q.includes('ezkertza') ||
    q.includes('bilbao') ||
    q.includes('parking') ||
    q.includes('menu') ||
    q.includes('menú') ||
    pathname.includes('/otzarreta')
  ) {
    return {
      type: 'dossier',
      label: 'Ver Ezkertza Berria & Otzarreta (Derio)',
      url: '/otzarreta',
    };
  }

  if (q.includes('reserva') || q.includes('fecha') || q.includes('disponib')) {
    return {
      type: 'date_picker',
      label: 'Consultar fecha del evento',
    };
  }

  if (q.includes('bodas.net') || q.includes('traslado') || q.includes('escaparate')) {
    return {
      type: 'scraper',
      label: 'Abrir convertidor de escaparate 1-Clic',
    };
  }

  return {
    type: 'whatsapp',
    label: 'Hablar con la Centralita (+34 693 693 048)',
    url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
      `Hola, tengo una consulta sobre: "${rawQuery.slice(0, 100)}"`
    )}`,
  };
}

/**
 * Motor Conversacional Determinista S-Class (Fallback infalible).
 */
function resolveDeterministicFallback(
  rawMessage: string,
  pathname: string = '',
  providerSlug: string = ''
): ConciergeResolution {
  const query = rawMessage.toLowerCase().trim();

  // 1. Contexto explícito de Otzarreta o preguntas sobre restaurante / bodas / parking cerca de Bilbao
  if (
    providerSlug === 'otzarreta' ||
    pathname.includes('/otzarreta') ||
    query.includes('otzarreta') ||
    query.includes('ezkertza') ||
    query.includes('eduardo') ||
    ((query.includes('restaurante') || query.includes('boda') || query.includes('banquete') || query.includes('comer') || query.includes('finca')) &&
      (query.includes('bilbao') || query.includes('derio') || query.includes('parking') || query.includes('bizkaia') || query.includes('vizcaya'))) ||
    query.includes('parking gratuito')
  ) {
    const otzResolution = resolveOtzarretaQuery(rawMessage);
    if (otzResolution.handled) {
      return otzResolution;
    }
  }

  // 2. Preguntas sobre bot vs agente
  if (query.includes('bot') || query.includes('agente') || query.includes('quien eres') || query.includes('quién eres')) {
    return {
      reply:
        'Soy el Agente Concierge S-Class de Productora EAR. Estoy coordinando la atención en tiempo real respaldado por nuestro equipo de dirección y la Centralita oficial (+34 693 693 048). Puedo resolverte dudas de cartas, aforos, fechas o contratación.',
      action: {
        type: 'whatsapp',
        label: 'Hablar con la Centralita (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, deseo hablar con un agente humano de la Centralita de Productora EAR.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 3. Preguntas sobre voz o audio
  if (query.includes('hablas') || query.includes('voz') || query.includes('audio') || query.includes('hablar') || query.includes('escuchar')) {
    return {
      reply:
        'Dispongo de voz sintetizada en tiempo real: puedes activar o desactivar la locución pulsando el icono del altavoz arriba a la derecha. También puedes hablarme por micrófono o, si lo prefieres, llamarnos directamente al +34 693 693 048.',
      action: {
        type: 'whatsapp',
        label: 'Llamar a Centralita (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, deseo asistencia directa por teléfono o WhatsApp.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 4. Edwin Agudelo, Solista Exclusivo, tarifas
  if (
    query.includes('edwin') ||
    query.includes('solista') ||
    query.includes('guitarra') ||
    query.includes('350') ||
    query.includes('550') ||
    pathname.includes('/reservar/solista') ||
    pathname.includes('/artistas/e78903')
  ) {
    return {
      reply:
        'La contratación de Edwin Agudelo como Solista Exclusivo parte de un suelo canónico de 350,00 € (tarifa base). La tarifa estándar homologada es de 550,00 € con sistema Bose L1 Pro y 100 km incluidos desde Méntrida. Puedes bloquear fecha con depósito Stripe Price-Lock de 100,00 €.',
      action: {
        type: 'whatsapp',
        label: 'Ver disponibilidad con Edwin (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
          'Hola Edwin, quiero consultar disponibilidad y fecha para tu actuación como solista.'
        )}`,
      },
      shouldEscalate: true,
    };
  }

  // 5. Contratación B2G / Ayuntamientos
  if (
    query.includes('ayuntamiento') ||
    query.includes('b2g') ||
    query.includes('licitacion') ||
    query.includes('licitación') ||
    query.includes('contrato menor') ||
    query.includes('118') ||
    pathname.includes('/ayuntamientos') ||
    pathname.includes('/b2g')
  ) {
    return {
      reply:
        'El Gabinete B2G de Productora EAR tramita contratos menores bajo el Art. 118 de la LCSP (hasta 14.999 € + IVA). Emitimos Facturae con códigos DIR3 para cobro vía FACe y memoria técnica de sonorización según la Ley 37/2003 del Ruido.',
      action: {
        type: 'whatsapp',
        label: 'Contactar con Gabinete B2G (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
          'Hola, represento a un ayuntamiento y deseo tramitar un contrato menor Art. 118 LCSP.'
        )}`,
      },
      shouldEscalate: true,
    };
  }

  // 6. Traslado Soberano desde Bodas.net
  if (
    query.includes('bodas.net') ||
    query.includes('escaparate') ||
    query.includes('migr') ||
    query.includes('traslado') ||
    pathname.includes('/portal/proveedor')
  ) {
    return {
      reply:
        'Con el Traslado Soberano en 1-Clic puedes importar tu escaparate de Bodas.net a EAR OS de forma 100% gratuita. Importamos tus fotos, menús y aforos, y publicamos tu Ficha Soberana indexada en Google sin comisiones de intermediación.',
      action: {
        type: 'scraper',
        label: 'Abrir convertidor de escaparate 1-Clic',
      },
      shouldEscalate: false,
    };
  }

  // 7. Respuesta General Inteligente
  const isVenueRoute = pathname.includes('/otzarreta') || pathname.includes('/fincas') || pathname.includes('/catering');
  if (isVenueRoute) {
    return {
      reply:
        'Estás en el espacio gastronómico de Ezkertza Berria & Otzarreta (Derio). Disponemos de parrilla vasca al carbón de encina, parking privado gratuito de 150 plazas y menús nupciales desde 100 €. ¿Deseas consultar disponibilidad o ver un menú en detalle?',
      action: {
        type: 'dossier',
        label: 'Ver menús y condiciones (/otzarreta)',
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  return {
    reply:
      'Estás conectado con la Centralita Inteligente de Productora EAR. Puedo orientarte sobre espacios exclusivos como el Caserío Ezkertza Berria & Otzarreta en Derio (menús desde 100 € y parking de 150 plazas), servicios de producción y sonido Bose para eventos, o licitaciones B2G para ayuntamientos.',
    action: {
      type: 'whatsapp',
      label: 'Hablar con la Centralita (+34 693 693 048)',
      url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
        `Hola, tengo una consulta sobre: "${rawMessage.slice(0, 100)}"`
      )}`,
    },
    shouldEscalate: false,
  };
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = ChatRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Cuerpo de petición no válido.', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { message, routeContext, providerSlug, history = [] } = parsed.data;
    const pathname = routeContext?.pathname || '';
    const slug = providerSlug || (pathname.includes('/otzarreta') ? 'otzarreta' : '');

    // Intento de reenvío no bloqueante a n8n si existe webhook configurado
    const n8nWebhookUrl = process.env.N8N_WHATSAPP_WEBHOOK_URL;
    if (n8nWebhookUrl && /^https:\/\//.test(n8nWebhookUrl)) {
      void fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'concierge_chat',
          message,
          pathname,
          providerSlug: slug,
          providerName: routeContext?.providerName,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(2000),
      }).catch(() => {
        // Silencio en fallback
      });
    }

    // 1. INFERENCIA NEURAL PRIMARIA CON CLAUDE HAIKU 4.5
    const neuralReply = await generateNeuralConciergeResponse(message, pathname, history);

    if (neuralReply) {
      const action = determineActionForQuery(message, pathname);
      return NextResponse.json({
        success: true,
        reply: neuralReply,
        action,
        shouldEscalate: message.toLowerCase().includes('reserva') || message.toLowerCase().includes('precio'),
        timestamp: new Date().toISOString(),
      });
    }

    // 2. FALLBACK DETERMINISTA S-CLASS
    const resolution = resolveDeterministicFallback(message, pathname, slug);

    return NextResponse.json({
      success: true,
      reply: resolution.reply,
      action: resolution.action,
      shouldEscalate: resolution.shouldEscalate,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error en /api/concierge/chat:', err);
    return NextResponse.json(
      { success: false, error: 'Fallo al procesar consulta en la centralita.' },
      { status: 500 }
    );
  }
}

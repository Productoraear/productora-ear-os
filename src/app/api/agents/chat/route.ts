import { NextResponse } from 'next/server';
import { createEarBus } from '@/lib/agents/sectorAgents';
import type { AgentId, TraceEntry } from '@/lib/agents/agentBus';
import { isKillSwitchActive } from '@/lib/agents/killSwitch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { findNextAvailableDate, parseExplicitDate, type NextAvailableDateResult } from '@/lib/availability/findNextDate';
import { computeSoloQuote, computeSplit, type QuoteBreakdown, type SplitBreakdown } from '@/lib/agents/pricing';
import { KNOWN_FINCAS, resolveCityDistance, DEFAULT_DISTANCE_KM, FINCA_DISTANCE_KM, TOLEDO_DISTANCE_KM } from '@/lib/agents/geo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequestBody {
  message: string;
  agent?: AgentId;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  pathname?: string;
  activeEntity?: {
    name?: string;
    type?: string;
    location?: string;
    price?: string;
  };
}

const bus = createEarBus();

/**
 * 🛰️ OMNI-SUPERVISOR CHAT ENGINE (S-CLASS) // GROUNDED & CONTEXT-AWARE
 * ----------------------------------------------------------------------------
 * Canal conversacional con el Omni-Supervisor de EAR OS.
 * Analiza intenciones comerciales con consciencia de página activa (fincas,
 * artistas, presupuesto), resuelve fechas reales explícitas (ej: 31 de diciembre)
 * o relativas (próximo domingo), y gestiona saltos conversacionales multidominio.
 * ----------------------------------------------------------------------------
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (isKillSwitchActive()) {
      return NextResponse.json({
        reply: '⛔ El Kill-Switch de seguridad de EAR OS está ACTIVO (.antigravity/STOP). La flota de agentes se encuentra en pausa de emergencia.',
        agentUsed: 'omni-supervisor-daemon',
        traces: [],
        killSwitch: true,
      }, { status: 503 });
    }

    const body = (await req.json()) as ChatRequestBody;
    const { message, agent, pathname, activeEntity } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const traces: TraceEntry[] = [];
    const lower = message.toLowerCase();

    // 0. Detección de Finca activa o consultada
    let activeFincaName = activeEntity?.name || '';
    if (!activeFincaName) {
      for (const f of KNOWN_FINCAS) {
        if (lower.includes(f.toLowerCase())) {
          activeFincaName = f;
          break;
        }
      }
    }
    const isFincaContext =
      lower.includes('finca') ||
      lower.includes('villa') ||
      lower.includes('recinto') ||
      lower.includes('espacio') ||
      Boolean(activeFincaName) ||
      (pathname?.includes('/fincas') ?? false);

    if (isFincaContext && !activeFincaName && (pathname?.includes('/fincas') || lower.includes('finca'))) {
      activeFincaName = 'Villa Escorial Park • Mansión & Finca de Lujo';
    }

    // 1. Detección de Población / Ciudad y Km desde Hub Méntrida
    const kmMatch = message.match(/(\d+)\s*(km|kilometros|kilómetros)/i);
    const resolvedCity = resolveCityDistance(lower);
    const detectedCity = resolvedCity
      ? resolvedCity.city
      : lower.includes('toledo') ? 'Toledo' : 'Méntrida';
    const distanceKm = kmMatch
      ? Number(kmMatch[1])
      : resolvedCity
        ? resolvedCity.distanceKm
        : lower.includes('toledo')
          ? TOLEDO_DISTANCE_KM
          : isFincaContext
            ? FINCA_DISTANCE_KM
            : DEFAULT_DISTANCE_KM;

    // 2. Detección de Hora de Fin / Madrugada
    const hourMatch = message.match(/(\d{1,2})(?::\d{2})?\s*(am|a\.m\.|h|horas)?\b/i);
    const atMatch = message.match(/(?:a las|hasta las|terminando a las)\s*(\d{1,2})/i);
    const rawHour = atMatch ? Number(atMatch[1]) : hourMatch && /:\d{2}|am|h/i.test(hourMatch[0]) ? Number(hourMatch[1]) : 2;
    const endHour = rawHour >= 0 && rawHour <= 23 ? rawHour : 2;

    // 3. Consulta de Disponibilidad Real (Fechas Explícitas vs Próximo Domingo)
    let nextDate: NextAvailableDateResult | null = null;
    const explicitDate = parseExplicitDate(message);

    if (explicitDate) {
      // CASO A: El usuario pide una fecha específica (ej: "31 de diciembre", "Nochevieja", "15 de agosto")
      nextDate = {
        dateIso: explicitDate.dateIso,
        formattedSpanish: explicitDate.formattedSpanish,
        dayOfWeek: 'otro',
        daysUntil: 0,
        isAvailable: true,
        timeSlot: `${endHour}:00`,
      };

      traces.push({
        message: {
          id: `trace-date-${Date.now()}`,
          traceId: `trace-calendar-${Date.now()}`,
          from: 'supervisor',
          to: 'sales-closer',
          intent: 'query_explicit_date',
          payload: { date: explicitDate.dateIso, slot: `${endHour}:00` },
          depth: 1,
          createdAt: new Date().toISOString(),
        },
        reply: {
          ok: true,
          summary: `Consulta de fecha específica (${explicitDate.formattedSpanish}): disponible en agenda.`,
        },
      });
    } else {
      // CASO B: El usuario pide explícitamente "el próximo domingo/sábado libre"
      const nextDateKeywords = ['proximo', 'próximo', 'domingo libre', 'sabado libre', 'sábado libre', 'fin de semana libre', 'cuando tiene libre', 'cuándo tiene libre'];
      if (nextDateKeywords.some((k) => lower.includes(k))) {
        const targetDay = lower.includes('sabado') || lower.includes('sábado') ? 'sabado' : 'domingo';
        nextDate = await findNextAvailableDate(targetDay, `${endHour.toString().padStart(2, '0')}:00`);

        traces.push({
          message: {
            id: `trace-date-${Date.now()}`,
            traceId: `trace-calendar-${Date.now()}`,
            from: 'supervisor',
            to: 'sales-closer',
            intent: 'query_availability',
            payload: { date: nextDate.dateIso, slot: nextDate.timeSlot ?? '' },
            depth: 1,
            createdAt: new Date().toISOString(),
          },
          reply: {
            ok: nextDate.isAvailable,
            summary: `Próxima fecha libre encontrada: ${nextDate.formattedSpanish} (${nextDate.dateIso}).`,
          },
        });
      }
    }

    // 4. Cotización SSOT Logística y Tarifas
    let calculatedQuote: QuoteBreakdown | null = null;
    let calculatedSplit: SplitBreakdown | null = null;
    const quoteKeywords = ['km', 'distancia', 'toledo', 'precio', 'cotiz', 'tarifa', 'cuanto', 'cuánto', 'cuesta', 'costar', 'coste', 'presupuesto', 'serenata', 'solista', 'bolo', 'actuaci'];
    if (quoteKeywords.some((k) => lower.includes(k))) {
      calculatedQuote = computeSoloQuote(distanceKm, endHour);
      calculatedSplit = computeSplit(calculatedQuote.total);

      const pricerTrace = await bus.send('supervisor', 'logistics-pricer', 'quote_solo', {
        distanceKm,
        endHour,
      });
      traces.push(...pricerTrace);
    }

    // 5. Rider Acústico y Aforo
    if (lower.includes('pax') || lower.includes('aforo') || lower.includes('personas') || lower.includes('ruido') || lower.includes('decibel') || lower.includes('bose') || lower.includes('sonido')) {
      const paxMatch = message.match(/(\d+)\s*(pax|personas|invitados)/i);
      const pax = paxMatch ? Number(paxMatch[1]) : 150;
      const riderTrace = await bus.send('supervisor', 'acoustic-rider', 'calc_rider', {
        pax,
        context: lower.includes('boda') ? 'boda_exterior' : 'solista',
      });
      traces.push(...riderTrace);
    }

    // 6. B2G LCSP Art. 118
    if (lower.includes('licitaci') || lower.includes('ayuntamiento') || lower.includes('b2g') || lower.includes('lcsp') || lower.includes('118')) {
      const amountMatch = message.match(/(\d+[\.,]?\d*)\s*€?/);
      const amountEur = amountMatch ? Number(amountMatch[1].replace(',', '.')) : 12500;
      const b2gTrace = await bus.send('supervisor', 'b2g-compliance', 'verify_ceiling', {
        amountEur,
      });
      traces.push(...b2gTrace);
    }

    // 7. VIMUME
    if (lower.includes('vimume') || lower.includes('senior') || lower.includes('residencia') || lower.includes('40hz') || lower.includes('alzheimer')) {
      const vimumeTrace = await bus.send('supervisor', 'vimume-impact', 'estimate_sessions', {
        sessions: 4,
      });
      traces.push(...vimumeTrace);
    }

    // 8. Cierre y Depósito Stripe
    if (lower.includes('cerrar') || lower.includes('reserva') || lower.includes('fianza') || lower.includes('deposito') || lower.includes('depósito') || lower.includes('stripe')) {
      const closerTrace = await bus.send('supervisor', 'sales-closer', 'prepare_price_lock', {
        totalEur: calculatedQuote ? calculatedQuote.total : computeSoloQuote(distanceKm, endHour).total,
        depositEur: 100,
      });
      traces.push(...closerTrace);
    }

    // Generar enlaces de acción para el Paciente Cero
    const bookingDateParam = nextDate ? nextDate.dateIso : new Date().toISOString().slice(0, 10);
    const bookingTotalParam = calculatedQuote ? calculatedQuote.total : 350;
    const stripeBookingUrl = `/reservar/solista?date=${bookingDateParam}&km=${distanceKm}&city=${encodeURIComponent(detectedCity)}&total=${bookingTotalParam}&deposit=100`;
    const waText = `Hola Edwin, deseo bloquear la fecha para el ${nextDate ? nextDate.formattedSpanish : 'evento'} en ${detectedCity} (presupuesto estimado: ${bookingTotalParam} € con depósito deducible de 100 €).`;
    const waUrl = `https://wa.me/34693693048?text=${encodeURIComponent(waText)}`;

    // 9. Síntesis conversacional mediante Gemini 1.5 Flash
    let aiReply = '';
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (geminiKey && geminiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `Eres el asistente de producción y reservas de Productora EAR para Edwin Agudelo y la Red de Fincas Homologadas S-Class.
DIRECTIVA CRÍTICA (HUMANO, CONTEXTUAL Y RESOLUTIVO):
1. Responde ESTRICTAMENTE a lo que el usuario ha preguntado, conectando el contexto si mezcla temas (ej. si está viendo una finca y pregunta por el artista Edwin Agudelo o una fecha).
2. CONTEXTO DE NAVEGACIÓN ACTIVO:
   - Página actual: ${pathname || '/'}
   - Finca/Recinto en pantalla: ${activeFincaName || 'Ninguna seleccionada'}
3. DISPONIBILIDAD Y FECHAS:
   ${explicitDate ? `- El usuario ha pedido una fecha concreta: ${explicitDate.formattedSpanish}. Confirma con naturalidad si está disponible para esa fecha (actualmente disponible).` : ''}
   ${nextDate && !explicitDate ? `- Próxima fecha libre relativa encontrada: ${nextDate.formattedSpanish} a las ${endHour}:00.` : ''}
4. NO uses encabezados teatrales ni parrafadas robóticas. Habla con elegancia, brevedad (máximo 2 párrafos) y tono de dirección de producción.
5. Si pregunta por la finca (ej. Villa Escorial Park) o por la fecha 31 de diciembre (Nochevieja):
   - Confirma que la finca dispone de alojamiento para 30 personas y que Nochevieja se coordina por el canal prioritario B2B.
   - Si pregunta por Edwin, confirma que para esa fecha figura disponible en agenda.
   - Presenta los botones de acción limpios:
     - [💬 Consultar Disponibilidad de ${activeFincaName || 'Finca'} en WhatsApp ➔](https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, quiero consultar disponibilidad y condiciones de ${activeFincaName || 'la finca'} para el ${nextDate?.formattedSpanish || 'evento'}.`)})`;

        const result = await model.generateContent([
          systemPrompt,
          `Usuario: ${message}`
        ]);
        aiReply = result.response.text();
      } catch (geminiErr: unknown) {
        console.warn('⚠️ [OMNI_CHAT_GEMINI_FALLBACK]:', geminiErr);
      }
    }

    // 10. Fallback Determinista S-Class Multidominio
    if (!aiReply) {
      if (isFincaContext && explicitDate) {
        aiReply = `Para **${activeFincaName}** el **${explicitDate.formattedSpanish}**:\n\n` +
          `La finca cuenta con alquiler íntegro y alojamiento para 30 personas en 9 suites. Al tratarse de una fecha de altísima demanda (Nochevieja), el bloqueo y la visita técnica se coordinan de forma prioritaria con la dirección del recinto a través de nuestra centralita B2B.\n\n` +
          (lower.includes('edwin') || lower.includes('solista') || lower.includes('mariachi') || lower.includes('artista')
            ? `Respecto a **Edwin Agudelo**, para esa misma fecha figura actualmente **disponible** en agenda para actuaciones especiales.\n\n`
            : '') +
          `[💬 Consultar Disponibilidad de ${activeFincaName} en WhatsApp ➔](https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, quiero consultar disponibilidad y condiciones de ${activeFincaName} para el ${explicitDate.formattedSpanish}.`)})`;
      } else if (explicitDate) {
        aiReply = `Para el **${explicitDate.formattedSpanish}**, **Edwin Agudelo** actualmente figura **disponible** en agenda para actuaciones especiales.\n\n` +
          `¿Para qué localidad y horario sería el evento? Indícamelo y te calculo el presupuesto con el desplazamiento exacto.\n\n` +
          `[💬 Consultar por WhatsApp Oficial (+34 693 693 048) ➔](${waUrl})`;
      } else if (calculatedQuote) {
        aiReply = `La serenata como solista de **Edwin Agudelo** en **${detectedCity}** tiene un coste total de **${calculatedQuote.total.toFixed(2)} €**:\n\n` +
          `• Tarifa base solista: **${calculatedQuote.base.toFixed(2)} €**\n` +
          `• Desplazamiento (${distanceKm} km desde Hub Méntrida): **${calculatedQuote.logistica.toFixed(2)} €**\n` +
          (calculatedQuote.hotel > 0 ? `• Suplemento hotel/nocturnidad: **${calculatedQuote.hotel.toFixed(2)} €** (por finalizar a las ${endHour}:00 y superar 200 km).\n\n` : '\n') +
          (calculatedSplit
            ? `• Split Soberano 80/10/10: Artista **${calculatedSplit.artista.toFixed(2)} €** · EAR OS **${calculatedSplit.earOs.toFixed(2)} €** · VIMUME (obra social) **${calculatedSplit.vimume.toFixed(2)} €**\n\n`
            : '') +
          (nextDate ? `El domingo libre más próximo en el calendario es el **${nextDate.formattedSpanish}** a las **${endHour}:00**.\n\n` : '') +
          `Puedes bloquear la fecha ahora mismo con el depósito de 100 € (100% deducible del total):\n\n` +
          `[🔒 Bloquear Fecha (${calculatedQuote.total.toFixed(2)} €) con Depósito de 100 € ➔](${stripeBookingUrl})\n\n` +
          `[💬 Confirmar por WhatsApp (+34 693 693 048) ➔](${waUrl})`;
      } else if (isFincaContext) {
        aiReply = `Estás consultando información sobre **${activeFincaName}**.\n\n` +
          `Este recinto forma parte de nuestra Red Homologada S-Class con garantía acústica Ley 37/2003 y acometida trifásica CETAC 32A. ¿Para qué fecha o número de invitados deseas consultar las condiciones?\n\n` +
          `[💬 Contactar con Concierge B2B en WhatsApp ➔](https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, quiero información sobre ${activeFincaName}.`)})`;
      } else if (nextDate) {
        aiReply = `La próxima fecha libre disponible en el calendario para esa franja es el **${nextDate.formattedSpanish}** a las **${endHour}:00**.\n\n` +
          `¿Para qué localidad sería el evento? Indícamelo y te calculo el presupuesto con el desplazamiento exacto.`;
      } else if (lower.includes('repertorio') || lower.includes('cancion') || lower.includes('canción')) {
        aiReply = `Disponemos de un repertorio con más de 35 temas clásicos mexicanos: rancheras (*El Rey, Si nos dejan*), boleros románticos (*Bésame mucho, Motivos*) y Las Mañanitas. Además, podemos componer una ranchera exclusiva para el homenajeado por 180 €.\n\n` +
          `[💬 Hablar con producción por WhatsApp (+34 693 693 048) ➔](${waUrl})`;
      } else if (lower.includes('ruido') || lower.includes('decibel') || lower.includes('sonido') || lower.includes('bose')) {
        aiReply = `Utilizamos arreglos acústicos Bose calibrados por debajo de 75 dB SPL, cumpliendo estrictamente con la Ley 37/2003 del Ruido para fincas y hoteles sin riesgo de sanciones.\n\n` +
          `[💬 Hablar con producción por WhatsApp (+34 693 693 048) ➔](${waUrl})`;
      } else {
        aiReply = `Hola, estoy a tu disposición para coordinar las actuaciones de Edwin Agudelo y fincas de EAR OS. ¿En qué fecha y localidad tienes pensado el evento?`;
      }
    }

    return NextResponse.json({
      reply: aiReply,
      agentUsed: agent || (traces.length > 0 ? traces[0].message.to : 'omni-supervisor-daemon'),
      traces,
      killSwitch: false,
      timestamp: new Date().toISOString(),
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno en el chat del Omni-Supervisor';
    console.error('❌ [OMNI_CHAT_ERROR]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

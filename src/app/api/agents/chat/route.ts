import { NextResponse } from 'next/server';
import { createOmegaFleet } from '@/lib/agents/omegaFleet';
import type { AgentId, TraceEntry } from '@/lib/agents/agentBus';
import { isKillSwitchActive } from '@/lib/agents/killSwitch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { findNextAvailableDate, parseExplicitDate, type NextAvailableDateResult } from '@/lib/availability/findNextDate';
import { computeSoloQuote, computeSplit, type QuoteBreakdown, type SplitBreakdown } from '@/lib/agents/pricing';
import { KNOWN_FINCAS, resolveCityDistance, DEFAULT_DISTANCE_KM, FINCA_DISTANCE_KM, TOLEDO_DISTANCE_KM } from '@/lib/agents/geo';
import { runDeepSeekChat, isDeepSeekConfigured } from '@/lib/compiler/deepseek-inference';
import {
  sanitizeUserInput,
  detectInjection,
  sanitizeAiOutput,
  buildHardenedSystemPrompt,
  wrapUntrustedMessage,
  SlidingWindowRateLimiter,
} from '@/lib/agents/chatGuard';
import {
  buildConversationMemoryBlock,
  collectSlots,
  OBJECTION_LABEL,
  resolveConsultationState,
  sanitizeHistory,
  summarizeSlots,
} from '@/lib/agents/consultationMemory';
import type {
  ConsultationSnapshot,
  ConsultationSlots,
  ConversationTurn,
} from '@/lib/agents/consultationTypes';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_KM_HOTEL,
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { buildGroundingNeed, groundWithWebSearch } from '@/lib/agents/webGrounding';
import {
  buildPageContextBlock,
  resolvePageContext,
  stripUrls,
  type PageContext,
} from '@/lib/agents/pageContext';

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

const bus = createOmegaFleet();

/** Rate limiter en memoria por IP para el canal de atención al cliente. */
const chatRateLimiter = new SlidingWindowRateLimiter(20, 60_000);

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

    const rawBody: unknown = await req.json();
    const body: ChatRequestBody = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as ChatRequestBody;
    const { agent, pathname, activeEntity } = body;

    // Validación y saneado de la entrada (dato no confiable).
    const inputCheck = sanitizeUserInput(body.message);
    if (!inputCheck.ok) {
      return NextResponse.json({ error: inputCheck.reason }, { status: 400 });
    }
    const message: string = inputCheck.text;

    // 🧭 CONTEXTO DE PÁGINA (server-side, sin fetch): resuelve la entidad que el
    // cliente está viendo (ficha de recinto, artista o terminal de reserva) para
    // que el Concierge no niegue datos que SÍ están verificados en el SSOT.
    const pageContext: PageContext = resolvePageContext({ pathname, message });
    if (pageContext.kind === 'none' && typeof pathname === 'string' && pathname.length > 0) {
      // Telemetría de huecos de contexto (para ir poblando fichas sobre la marcha).
      console.warn('[CONCIERGE_CONTEXT_UNRESOLVED]', pathname);
    }

    // Rate limit por IP (anti-abuso / DoS).
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp: string = (forwarded ? forwarded.split(',')[0].trim() : '') ||
      req.headers.get('x-real-ip') ||
      'anonymous';
    if (!chatRateLimiter.allow(clientIp)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.' },
        { status: 429 },
      );
    }

    // Anti-inyección de prompt / exfiltración / abuso de infraestructura.
    // Las URLs pegadas por el cliente se neutralizan: son contexto, no órdenes.
    if (detectInjection(stripUrls(message)).blocked) {
      return NextResponse.json({
        reply:
          'Gracias por escribirnos. Estoy aquí para ayudarte con los servicios de Productora EAR: fechas, presupuestos, fincas homologadas y reservas. ¿En qué puedo ayudarte con tu evento?',
        agentUsed: 'omni-supervisor-daemon',
        traces: [],
        killSwitch: false,
        timestamp: new Date().toISOString(),
      });
    }

    // 🧠 MEMORIA MULTI-TURNO (erradica la amnesia entre turnos).
    // El historial llega del cliente y es DATO NO CONFIABLE: se sanea antes de usarlo.
    const history: ConversationTurn[] = sanitizeHistory(body.history);
    const memorySlots: ConsultationSlots = collectSlots(history, message);
    const consultation: ConsultationSnapshot = resolveConsultationState(memorySlots, history, message);

    const traces: TraceEntry[] = [];
    const lower = message.toLowerCase();

    // 0. Detección de Finca activa o consultada (fichas verificadas + red real)
    //    Prioridad: entidad resuelta por ruta > entidad del cliente > nombre en texto > memoria.
    let activeFincaName: string =
      pageContext.kind === 'venue'
        ? pageContext.name
        : activeEntity?.name || '';
    if (!activeFincaName) {
      for (const f of KNOWN_FINCAS) {
        if (lower.includes(f.toLowerCase())) {
          activeFincaName = f;
          break;
        }
      }
    }
    // Memoria del hilo: un recinto mencionado en un turno anterior sigue vigente.
    if (!activeFincaName && memorySlots.fincaName) {
      activeFincaName = memorySlots.fincaName;
    }
    const isFincaContext =
      pageContext.kind === 'venue' ||
      lower.includes('finca') ||
      lower.includes('villa') ||
      lower.includes('recinto') ||
      lower.includes('restaurante') ||
      lower.includes('espacio') ||
      Boolean(activeFincaName) ||
      (pathname?.includes('/fincas') ?? false);

    // 🚫 ANTI-FACHADA: no se inventa ningún recinto por defecto. Si el cliente no
    // ha nombrado una finca concreta, el prompt declara el contexto vacío y el
    // agente ofrece coordinar la visita técnica con la dirección del recinto.

    // 1. Detección de Población / Ciudad y Km desde Hub Méntrida.
    //    Orden de precedencia: mensaje actual -> memoria del hilo -> heurística.
    const kmMatch: RegExpMatchArray | null = message.match(/(\d+)\s*(km|kilometros|kilómetros)/i);
    const resolvedCity = resolveCityDistance(lower);

    let detectedCity: string;
    if (resolvedCity) {
      detectedCity = resolvedCity.city;
    } else if (pageContext.municipality !== null) {
      detectedCity = pageContext.municipality;
    } else if (memorySlots.city) {
      detectedCity = memorySlots.city;
    } else if (lower.includes('toledo')) {
      detectedCity = 'Toledo';
    } else {
      detectedCity = 'Méntrida';
    }

    // `null` = desplazamiento NO confirmado (fuera de la matriz del Hub).
    // Jamás se inventa un kilometraje: ni 0 km ni los 58 km por defecto.
    let distanceKm: number | null;
    if (kmMatch) {
      distanceKm = Number(kmMatch[1]);
    } else if (resolvedCity) {
      distanceKm = resolvedCity.distanceKm;
    } else if (pageContext.distanceKmFromHub !== null) {
      distanceKm = pageContext.distanceKmFromHub;
    } else if (memorySlots.distanceKm !== null) {
      // Provenance: la localidad viene de un turno anterior y así consta en el
      // bloque de memoria del prompt (ciudad + km), de modo que el modelo puede
      // recalcular si el cliente corrige el destino.
      distanceKm = memorySlots.distanceKm;
    } else if (lower.includes('toledo')) {
      distanceKm = TOLEDO_DISTANCE_KM;
    } else if (pageContext.kind === 'venue') {
      distanceKm = null;
    } else if (isFincaContext) {
      distanceKm = FINCA_DISTANCE_KM;
    } else {
      distanceKm = DEFAULT_DISTANCE_KM;
    }

    // 2. Detección de Hora de Fin / Madrugada (mensaje actual -> memoria -> 2:00)
    const hourMatch: RegExpMatchArray | null = message.match(/(\d{1,2})(?::\d{2})?\s*(am|a\.m\.|h|horas)?\b/i);
    const atMatch: RegExpMatchArray | null = message.match(/(?:a las|hasta las|terminando a las)\s*(\d{1,2})/i);
    const explicitHour: number | null = atMatch
      ? Number(atMatch[1])
      : hourMatch && /:\d{2}|am|h/i.test(hourMatch[0])
        ? Number(hourMatch[1])
        : null;
    const boundedHour: number | null =
      explicitHour !== null && Number.isInteger(explicitHour) && explicitHour >= 0 && explicitHour <= 23
        ? explicitHour
        : null;
    const endHour: number = boundedHour ?? memorySlots.endHour ?? 2;

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
        // CERO FACHADAS: una fecha nominal NO es una fecha verificada. La
        // disponibilidad real se resuelve al bloquear en atomicDateLockEngine.
        isAvailable: false,
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
          ok: false,
          summary: `Consulta de fecha específica (${explicitDate.formattedSpanish}): pendiente de verificación en la agenda real.`,
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
    const quoteKeywords: readonly string[] = ['km', 'distancia', 'toledo', 'precio', 'cotiz', 'tarifa', 'cuanto', 'cuánto', 'cuesta', 'costar', 'coste', 'presupuesto', 'serenata', 'solista', 'bolo', 'actuaci', 'sonido', 'equipo'];
    // Se cotiza si el cliente pregunta por dinero O si el hilo ya acumuló datos
    // suficientes (memoria multi-turno) para dar una cifra exacta y no genérica.
    const shouldQuote: boolean =
      quoteKeywords.some((k: string) => lower.includes(k)) ||
      consultation.phase === 'COTIZACION' ||
      consultation.phase === 'CIERRE_STRIPE';
    if (shouldQuote && distanceKm !== null) {
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
      const paxMatch: RegExpMatchArray | null = message.match(/(\d+)\s*(pax|personas|invitados)/i);
      const pax: number = paxMatch ? Number(paxMatch[1]) : memorySlots.pax ?? 150;
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
        totalEur: calculatedQuote
          ? calculatedQuote.total
          : distanceKm !== null
            ? computeSoloQuote(distanceKm, endHour).total
            : TARIFA_BASE_SOLISTA_EUR,
        depositEur: DEPOSITO_STRIPE_EUR,
      });
      traces.push(...closerTrace);
    }

    // Generar enlaces de acción para el Paciente Cero
    const bookingDateParam: string = nextDate
      ? nextDate.dateIso
      : memorySlots.dateIso ?? new Date().toISOString().slice(0, 10);
    const bookingTotalParam: number = calculatedQuote ? calculatedQuote.total : TARIFA_BASE_SOLISTA_EUR;
    // Sin kilometraje confirmado no se inventa un `km` en el enlace de reserva.
    const kmParam: string = distanceKm === null ? '' : `&km=${distanceKm}`;
    const stripeBookingUrl = `/reservar/solista?date=${bookingDateParam}${kmParam}&city=${encodeURIComponent(detectedCity)}&total=${bookingTotalParam}&deposit=${DEPOSITO_STRIPE_EUR}`;
    const waText = `Hola Edwin, deseo bloquear la fecha para el ${nextDate ? nextDate.formattedSpanish : memorySlots.dateLabel ?? 'evento'} en ${detectedCity} (presupuesto estimado: ${bookingTotalParam} € con depósito deducible de ${DEPOSITO_STRIPE_EUR} €).`;
    const waUrl = `https://wa.me/34693693048?text=${encodeURIComponent(waText)}`;

    // ── ANTI-SESGO DEL ROSTER (P0) ────────────────────────────────────────────
    // En la ficha de un proveedor de terceros NO se vende la serenata del solista:
    // el CTA y el mensaje de WhatsApp se anclan al proveedor REAL que el cliente
    // está mirando. El número sale del SSOT (nunca un literal duplicado).
    const isProviderPage: boolean = pageContext.kind === 'provider';
    // ⚠️ RETO_ESPEJO (fusion por máximo): la orden original pedía `?vendor=<id>`,
    // pero `/checkout/presupuesto` sólo consume `venue|proveedor|artista`,
    // `format|pack` y `base|precio`. Emitir `vendor` sería un PARÁMETRO MUERTO
    // (clic muerto garantizado). Se emite el parámetro REAL que la terminal
    // entiende: `venue` con el nombre del proveedor → formulario pre-cargado.
    // (Pendiente P0 aparte: cablear el id en /api/quote/generate-lock.)
    const providerQuoteUrl: string =
      isProviderPage && pageContext.name.trim().length > 0
        ? `/checkout/presupuesto?venue=${encodeURIComponent(pageContext.name)}`
        : '';
    // Si el id del proveedor no llega, se degrada al embudo público de presupuesto.
    const actionBookingUrl: string = providerQuoteUrl.length > 0 ? providerQuoteUrl : isProviderPage ? '/presupuesto' : stripeBookingUrl;
    const providerWhatsAppText: string = `Hola, deseo información y presupuesto para el proveedor ${pageContext.name}${
      pageContext.municipality !== null ? ` en ${pageContext.municipality}` : ''
    }.`;
    const actionWaUrl: string = isProviderPage
      ? `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(providerWhatsAppText)}`
      : waUrl;

    // 9. Síntesis conversacional S-Class (DeepSeek -> Gemini -> Determinista)
    let aiReply = '';
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    const formattedTotalEur: string | number = calculatedQuote
      ? (calculatedQuote.total % 1 === 0 ? calculatedQuote.total : calculatedQuote.total.toFixed(2))
      : TARIFA_BASE_SOLISTA_EUR;

    // 🌐 GROUNDING WEB EN VIVO (DeepSeek Search & Fetch).
    // Solo se dispara para 3 intenciones de alto valor donde el dato externo es
    // volátil y no está en el SSOT: normativa acústica municipal, aforo de
    // recintos no homologados y licitaciones B2G. Fail-open y con tope de gasto.
    const groundingNeed = buildGroundingNeed({
      slots: memorySlots,
      message,
      activeEntityName: activeFincaName,
    });
    const grounding = groundingNeed === null
      ? null
      : await groundWithWebSearch({ need: groundingNeed });

    const systemPrompt: string = buildHardenedSystemPrompt({
      pathname: pathname ?? '',
      activeFincaName,
      detectedCity,
      distanceKm,
      endHour,
      formattedTotalEur,
      explicitDateLabel: explicitDate
        ? explicitDate.formattedSpanish
        : memorySlots.dateLabel ?? '',
      nextDateLabel: nextDate && !explicitDate ? nextDate.formattedSpanish : '',
      stripeBookingUrl: actionBookingUrl,
      waUrl: actionWaUrl,
      conversationMemory: buildConversationMemoryBlock(memorySlots),
      consultationPhase: consultation.phase,
      nextQuestion: pageContext.kind === 'venue' && consultation.phase === 'DESCUBRIMIENTO'
        ? 'Confirmar la fecha de la boda y el número de invitados para el recinto.'
        : consultation.nextQuestion,
      turnCount: history.length,
      objectionLabel: consultation.objection ? OBJECTION_LABEL[consultation.objection] : '',
      webGrounding: grounding?.block ?? '',
      pageContextBlock: buildPageContextBlock(pageContext),
      // Anclaje tipado de la entidad en pantalla (anti-sesgo del roster).
      pageEntityKind: pageContext.kind,
      pageEntityName: pageContext.name,
      pageEntityCategory: pageContext.category,
    });

    const untrustedMessage: string = wrapUntrustedMessage(message);

    // Nivel 1: DeepSeek Cloud (Máxima inteligencia analítica y comprensión semántica del español)
    if (isDeepSeekConfigured()) {
      try {
        const dsRes = await runDeepSeekChat({
          model: 'deepseek-chat',
          system: systemPrompt,
          prompt: untrustedMessage,
          history,
          temperature: 0.3,
        });
        if (dsRes.available && dsRes.content.trim()) {
          aiReply = dsRes.content.trim();
        }
      } catch (dsErr: unknown) {
        console.warn('⚠️ [OMNI_CHAT_DEEPSEEK_FALLBACK]:', dsErr);
      }
    }

    // Nivel 2: Google Gemini Flash si DeepSeek no responde o no tiene clave
    if (!aiReply && geminiKey && geminiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        // Gemini usa roles 'user' | 'model': el system prompt viaja como primer turno
        // y el historial real del hilo se reconstruye para no perder el contexto.
        const geminiHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Entendido. Aplico la doctrina consultiva de EAR OS y la memoria del hilo al pie de la letra.' }] },
        ];
        for (const turn of history) {
          geminiHistory.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.content }],
          });
        }

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(untrustedMessage);
        aiReply = result.response.text();
      } catch (geminiErr: unknown) {
        console.warn('⚠️ [OMNI_CHAT_GEMINI_FALLBACK]:', geminiErr);
      }
    }

    // 10. Fallback Determinista S-Class Multidominio (Limpio y sin loro)
    if (!aiReply) {
      const fincaLabel: string = activeFincaName.length > 0 ? activeFincaName : 'el recinto';
      if (pageContext.kind === 'venue') {
        // Respuesta determinista con la ficha verificada: funciona incluso sin LLM
        // y erradica el "no tengo datos de ese recinto".
        const highlights: string = pageContext.facts.slice(0, 2).join('\n\n');
        const pending: string = pageContext.missing.slice(0, 3).join(', ');
        aiReply =
          `Sí, tengo ficha verificada de **${pageContext.name}**:\n\n${highlights}\n\n` +
          `Lo que la casa no publica (${pending}) lo cerramos en visita técnica con su dirección; Productora EAR aporta la música, la producción y el rider acústico. ` +
          (explicitDate ? `Para el **${explicitDate.formattedSpanish}** verifico disponibilidad con el recinto antes de asegurarte nada. ` : '') +
          `¿Para qué fecha y cuántos invitados sería?\n\n` +
          `[💬 Coordinar visita y fecha por WhatsApp ➔](${waUrl})`;
      } else if (pageContext.kind === 'provider') {
        // GROUNDING EXTREMO SIN LLM: la ficha real basta para vender con verdad.
        // Cero invención (sólo hechos de `public/data/fichas/*.json`) y CERO sesgo
        // del roster: ni tarifa de solista ni serenata en la ficha de un tercero.
        const highlights: string = pageContext.facts.slice(0, 3).join('\n\n');
        const pending: string = pageContext.missing.slice(0, 2).join(', ');
        const categoryLabel: string =
          pageContext.category !== null && pageContext.category.length > 0
            ? pageContext.category
            : 'servicios para eventos';
        const splitLabel: string =
          `${Math.round(SPLIT_SOBERANO.artista * 100)}% ejecutante / ` +
          `${Math.round(SPLIT_SOBERANO.earOs * 100)}% infraestructura EAR OS / ` +
          `${Math.round(SPLIT_SOBERANO.vimume * 100)}% VIMUME (obra social)`;
        aiReply =
          `Ficha verificada de **${pageContext.name}**${pageContext.municipality !== null ? ` (${pageContext.municipality})` : ''} — **${categoryLabel}**:\n\n${highlights}\n\n` +
          `El presupuesto se calcula con la tarifa publicada en su ficha: aquí lo que contratas es ${categoryLabel}. ` +
          `Lo que su ficha no certifica (${pending}) lo cierra la Conserjería EAR OS directamente con el proveedor. ` +
          `El bloqueo de la fecha se formaliza con el depósito de **${DEPOSITO_STRIPE_EUR} €** (100% deducible del total) y reparto **${splitLabel}**.\n\n` +
          `[🔒 Solicitar presupuesto para ${pageContext.name} ➔](${actionBookingUrl})\n\n` +
          `[💬 Conserjería EAR OS (${CENTRALITA_EAR_OS}) ➔](${actionWaUrl})`;
      } else if (isFincaContext && explicitDate) {
        aiReply = `Para **${fincaLabel}** el **${explicitDate.formattedSpanish}**:\n\n` +
          `Las condiciones de alquiler, aforo y horarios de ese recinto las confirma su dirección: no publico datos que no estén verificados. Coordinamos la visita técnica y el bloqueo de la fecha de forma prioritaria a través de la centralita B2B.\n\n` +
          (lower.includes('edwin') || lower.includes('solista') || lower.includes('mariachi') || lower.includes('artista')
            ? `Respecto a **Edwin Agudelo**, compruebo su agenda real para esa fecha antes de confirmarte nada.\n\n`
            : '') +
          `[💬 Consultar disponibilidad y condiciones por WhatsApp ➔](${waUrl})`;
      } else if (explicitDate) {
        aiReply = `Para el **${explicitDate.formattedSpanish}**, compruebo la agenda real de **Edwin Agudelo** antes de afirmar disponibilidad: el bloqueo definitivo se hace con el depósito de ${DEPOSITO_STRIPE_EUR} € (100% deducible).\n\n` +
          `¿Para qué localidad y horario sería el evento? Indícamelo y te calculo el presupuesto con el desplazamiento exacto.\n\n` +
          `[💬 Consultar por WhatsApp Oficial (+34 693 693 048) ➔](${waUrl})`;
      } else if (calculatedQuote) {
        const cleanTotal = calculatedQuote.total % 1 === 0 ? calculatedQuote.total : calculatedQuote.total.toFixed(2);
        const cleanBase = calculatedQuote.base % 1 === 0 ? calculatedQuote.base : calculatedQuote.base.toFixed(2);
        const cleanLogistica = calculatedQuote.logistica % 1 === 0 ? calculatedQuote.logistica : calculatedQuote.logistica.toFixed(2);
        const cleanHotel = calculatedQuote.hotel % 1 === 0 ? calculatedQuote.hotel : calculatedQuote.hotel.toFixed(2);

        aiReply = `La serenata como solista de **Edwin Agudelo** en **${detectedCity}** tiene un coste total de **${cleanTotal} €**:\n\n` +
          `• Tarifa base solista: **${cleanBase} €**\n` +
          `• Desplazamiento (${distanceKm} km desde Hub Méntrida): **${cleanLogistica} €**\n` +
          (calculatedQuote.hotel > 0 ? `• Suplemento hotel/nocturnidad: **${cleanHotel} €** (por finalizar de madrugada o superar ${LOGISTICA_KM_HOTEL} km).\n\n` : '\n') +
          (calculatedSplit && (lower.includes('split') || lower.includes('reparto') || lower.includes('donacion') || lower.includes('donación'))
            ? `• Split Soberano 80/10/10: Artista **${calculatedSplit.artista.toFixed(2)} €** · EAR OS **${calculatedSplit.earOs.toFixed(2)} €** · VIMUME (obra social) **${calculatedSplit.vimume.toFixed(2)} €**\n\n`
            : '') +
          (nextDate ? `La fecha libre más próxima en el calendario es el **${nextDate.formattedSpanish}** a las **${endHour}:00**.\n\n` : '') +
          `Puedes bloquear la fecha ahora mismo con el depósito de ${DEPOSITO_STRIPE_EUR} € (100% deducible del total):\n\n` +
          `[🔒 Bloquear Fecha (${cleanTotal} €) con Depósito de ${DEPOSITO_STRIPE_EUR} € ➔](${stripeBookingUrl})\n\n` +
          `[💬 Confirmar por WhatsApp (+34 693 693 048) ➔](${waUrl})`;
      } else if (isFincaContext) {
        const subject: string = activeFincaName.length > 0
          ? `**${activeFincaName}**`
          : 'nuestra red de recintos homologados';
        aiReply = `Estás consultando información sobre ${subject}.\n\n` +
          `El aforo, las condiciones de alquiler y los horarios los confirma la dirección del recinto; en la visita técnica validamos además la acometida trifásica y el rider acústico. ¿Para qué fecha y número de invitados quieres que lo consulte?\n\n` +
          `[💬 Hablar con producción por WhatsApp ➔](${waUrl})`;
      } else if (nextDate) {
        aiReply = `La próxima fecha libre disponible en el calendario para esa franja es el **${nextDate.formattedSpanish}** a las **${endHour}:00**.\n\n` +
          `¿Para qué localidad sería el evento? Indícamelo y te calculo el presupuesto con el desplazamiento exacto.`;
      } else if (lower.includes('repertorio') || lower.includes('cancion') || lower.includes('canción')) {
        aiReply = `Disponemos de un repertorio con más de 35 temas clásicos mexicanos: rancheras (*El Rey, Si nos dejan*), boleros románticos (*Bésame mucho, Motivos*) y Las Mañanitas. También podemos componer una ranchera exclusiva para el homenajeado: el importe exacto te lo confirma producción.\n\n` +
          `[💬 Hablar con producción por WhatsApp (+34 693 693 048) ➔](${waUrl})`;
      } else if (lower.includes('ruido') || lower.includes('decibel') || lower.includes('sonido') || lower.includes('bose')) {
        aiReply = `Trabajamos con arreglos acústicos calibrados por debajo de ${LIMITE_SPL_DB} dB SPL, conforme a la Ley 37/2003 del Ruido y a la ordenanza municipal aplicable. El límite exacto y el punto de medida los fijamos en la visita técnica con la dirección del recinto: no prometemos viabilidad acústica sin verificar la normativa local.\n\n` +
          `[💬 Hablar con producción por WhatsApp (+34 693 693 048) ➔](${waUrl})`;
      } else {
        // Fallback con memoria: nunca reinicia la conversación desde cero.
        const remembered: string = summarizeSlots(memorySlots);
        const contextLine: string = remembered.length > 0
          ? `Perfecto, tomo nota de lo que me has contado (${remembered}). `
          : 'Hola, soy el Concierge de EAR OS. ';
        aiReply = `${contextLine}${consultation.nextQuestion}\n\n` +
          `[💬 Hablar con producción por WhatsApp (+34 693 693 048) ➔](${waUrl})`;
      }
    }

    const safeReply: string = sanitizeAiOutput(aiReply);

    return NextResponse.json({
      reply: safeReply,
      agentUsed: agent || (traces.length > 0 ? traces[0].message.to : 'omni-supervisor-daemon'),
      traces,
      killSwitch: false,
      timestamp: new Date().toISOString(),
      // 🧠 Estado del hilo para que el cliente lo persista y lo reenvíe en el
      // siguiente turno (memoria real entre sesiones vía localStorage).
      consultation,
      // 🌐 Fuentes web citadas (transparencia y trazabilidad del dato verificado).
      webSources: grounding?.sources ?? [],
    });

  } catch (error: unknown) {
    // Nunca exponer detalles internos al cliente (sin fuga de stack/mensajes).
    console.error('❌ [OMNI_CHAT_ERROR]:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Error interno del servicio de atención. Inténtalo de nuevo en unos instantes.' },
      { status: 500 },
    );
  }
}

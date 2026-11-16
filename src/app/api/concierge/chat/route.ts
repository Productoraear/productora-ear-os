import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CLEAN_PHONE = CENTRALITA_EAR_OS.replace(/\D/g, '');

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000)
  })).optional(),
  routeContext: z.object({
    pathname: z.string().optional(),
    providerName: z.string().optional(),
    category: z.string().optional()
  }).optional(),
  voiceMode: z.boolean().optional()
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

function resolveConversationalAnswer(
  rawMessage: string,
  pathname: string = ''
): ConciergeResolution {
  const query = rawMessage.toLowerCase().trim();

  // 1. Preguntas sobre Edwin Agudelo, tarifas, solista o música
  if (
    query.includes('edwin') ||
    query.includes('tarifa') ||
    query.includes('precio') ||
    query.includes('cuanto') ||
    query.includes('cuánto') ||
    query.includes('solista') ||
    query.includes('guitarra') ||
    query.includes('350') ||
    query.includes('550') ||
    pathname.includes('/reservar/solista') ||
    pathname.includes('/artistas/e78903')
  ) {
    const isKmQuery = query.includes('km') || query.includes('kilometraje') || query.includes('distancia') || query.includes('desplazamiento');
    const isHotelQuery = query.includes('hotel') || query.includes('dormir') || query.includes('pernocta') || query.includes('300 km');
    
    if (isKmQuery || isHotelQuery) {
      return {
        reply: 'La tarifa estándar de Edwin Agudelo (550 €) incluye los primeros 100 km de ida y vuelta desde el Hub de Méntrida (Toledo). Los kilómetros adicionales se tarifican a 0,50 €/km. Si el trayecto supera los 300 km, se requiere un suplemento de pernocta de 80,00 €.',
        action: {
          type: 'whatsapp',
          label: 'Calcular kilometraje exacto con Edwin',
          url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola Edwin, deseo consultar el kilometraje y logística para mi evento desde Méntrida.')}`
        },
        shouldEscalate: false
      };
    }

    return {
      reply: 'La contratación de Edwin Agudelo como Solista Exclusivo parte de un suelo canónico de 350,00 € (tarifa base). La tarifa estándar homologada es de 550,00 € con sistema de sonido Bose L1 Pro y hasta 100 km incluidos desde Méntrida. Puedes bloquear tu fecha con un depósito seguro Stripe Price-Lock de 100,00 €.',
      action: {
        type: 'whatsapp',
        label: 'Ver disponibilidad con Edwin (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola Edwin, quiero consultar disponibilidad y fecha para tu actuación como solista.')}`
      },
      shouldEscalate: true
    };
  }

  // 2. Contratación B2G / Ayuntamientos / Administraciones Públicas
  if (
    query.includes('ayuntamiento') ||
    query.includes('b2g') ||
    query.includes('licitacion') ||
    query.includes('licitación') ||
    query.includes('contrato menor') ||
    query.includes('118') ||
    query.includes('face') ||
    query.includes('dir3') ||
    pathname.includes('/ayuntamientos') ||
    pathname.includes('/b2g')
  ) {
    return {
      reply: 'El Gabinete B2G de Productora EAR tramita contratos menores bajo el Art. 118 de la LCSP (hasta 14.999 € + IVA). Emitimos Facturae electrónica con códigos DIR3 para cobro vía FACe, memoria técnica de sonorización y certificado de cumplimiento acústico según la Ley 37/2003 del Ruido.',
      action: {
        type: 'whatsapp',
        label: 'Contactar con Gabinete B2G (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, represento a una entidad pública/ayuntamiento y deseo tramitar un contrato menor Art. 118 LCSP.')}`
      },
      shouldEscalate: true
    };
  }

  // 3. Fincas, Otzarreta, Catering y Menús
  if (
    query.includes('otzarreta') ||
    query.includes('finca') ||
    query.includes('menu') ||
    query.includes('menú') ||
    query.includes('derio') ||
    query.includes('eduardo') ||
    query.includes('aforo') ||
    pathname.includes('/otzarreta') ||
    pathname.includes('/fincas')
  ) {
    return {
      reply: 'La Finca Otzarreta (Ezkertza Berria en Derio, Bizkaia), dirigida por Eduardo Martínez, dispone de menús de temporada 2026 desde 145,00 € por comensal, aforo homologado para 50 a 350 invitados y sonometría certificada por debajo de 75 dB SPL.',
      action: {
        type: 'dossier',
        label: 'Ver dossier técnico y menús de Finca Otzarreta',
        url: '/otzarreta'
      },
      shouldEscalate: false
    };
  }

  // 4. Traslado Soberano / Migración desde Bodas.net
  if (
    query.includes('bodas.net') ||
    query.includes('escaparate') ||
    query.includes('migr') ||
    query.includes('traslado') ||
    query.includes('trojan') ||
    query.includes('proveedor') ||
    pathname.includes('/portal/proveedor')
  ) {
    return {
      reply: 'Con el Traslado Soberano en 1-Clic puedes importar tu escaparate de Bodas.net o tu web a EAR OS de forma 100% gratuita. Importamos tus fotos, menús y aforos, y publicamos tu Ficha Soberana indexada en Google sin comisiones de intermediación.',
      action: {
        type: 'scraper',
        label: 'Abrir convertidor de escaparate 1-Clic'
      },
      shouldEscalate: false
    };
  }

  // 5. Presupuestos, depósitos o reservas
  if (
    query.includes('reserva') ||
    query.includes('fecha') ||
    query.includes('disponib') ||
    query.includes('deposito') ||
    query.includes('depósito') ||
    query.includes('stripe') ||
    query.includes('contrat')
  ) {
    return {
      reply: 'Para verificar la disponibilidad de tu fecha o congelar las condiciones con la cláusula Stripe Price-Lock de 100,00 €, puedes indicarnos el día exacto o hablar directamente con Edwin Agudelo en la Centralita oficial.',
      action: {
        type: 'date_picker',
        label: 'Seleccionar fecha del evento'
      },
      shouldEscalate: true
    };
  }

  // 6. Respuesta General Inteligente
  return {
    reply: 'Estás conectado con la Centralita Inteligente de Productora EAR. Puedo orientarte sobre tarifas de artistas (Edwin Agudelo desde 350 €), fincas homologadas como Otzarreta, licitaciones B2G para ayuntamientos o la migración gratuita de tu escaparate de Bodas.net.',
    action: {
      type: 'whatsapp',
      label: 'Hablar con la Centralita (+34 693 693 048)',
      url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(`Hola, tengo una consulta sobre: "${rawMessage.slice(0, 100)}"`)}`
    },
    shouldEscalate: false
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

    const { message, routeContext } = parsed.data;
    const pathname = routeContext?.pathname || '';

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
          providerName: routeContext?.providerName,
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(2000)
      }).catch(() => {
        // Silencio en fallback
      });
    }

    // Resolución de respuesta en motor conversacional determinista S-Class
    const resolution = resolveConversationalAnswer(message, pathname);

    return NextResponse.json({
      success: true,
      reply: resolution.reply,
      action: resolution.action,
      shouldEscalate: resolution.shouldEscalate,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error en /api/concierge/chat:', err);
    return NextResponse.json(
      { success: false, error: 'Fallo al procesar consulta en la centralita.' },
      { status: 500 }
    );
  }
}

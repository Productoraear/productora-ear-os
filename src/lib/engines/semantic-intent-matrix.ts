/**
 * EAR Semantic Intent Matrix v1.1 (S-Class SSOT - España & Canon)
 * ─────────────────────────────────────────────────────────────
 * Motor de Clasificación Semántica de Intenciones de Búsqueda
 *
 * NOTA CULTURAL / LINGÜÍSTICA (España):
 *  - Soporte equitativo y bidireccional para "MÚSICA EN DIRECTO" y "MÚSICA EN VIVO".
 *  - En España "en directo" es la fórmula más común en bodas, ayuntamientos y festejos.
 *
 * DOCTRINA S-CLASS (inquebrantable):
 *  1. Golden Path (máx. 3 clics, ≤45s) es EXCLUSIVO para leads HOT / FIRE.
 *  2. El Neural Journey debe estar presente en TODOS los leads (incl. HOT).
 *  3. El Score de Eficiencia penaliza SOLO si un lead HOT/FIRE excede 3 clics o >45s.
 *  4. Leads WARM / COLD admiten flujos consultivos / exploratorios más extensos.
 *
 * SSOT de Temperatura: COLD | WARM | HOT | FIRE
 * (alineado con src/features/neural-companion/stores/useLeadTemperatureStore.ts)
 */

export type LeadTemperature = 'COLD' | 'WARM' | 'HOT' | 'FIRE';

export type IntentCategory =
  | 'MARIACHI'
  | 'MUSICA_LIVE'
  | 'DJ'
  | 'FOTOGRAFIA'
  | 'VIDEO'
  | 'CATERING'
  | 'DECORACION'
  | 'ILUMINACION'
  | 'WEDDING_PLANNER'
  | 'TRANSPORTE'
  | 'FINCA'
  | 'B2G_TENDER'
  | 'GENERAL';

export interface SearchIntent {
  id: string;
  label: string;
  category: IntentCategory;
  keywords: string[];
  baseTemperature: LeadTemperature;
  weight: number;
  isTransactional: boolean;
  isInformational: boolean;
}

export interface MatchedIntent {
  intent: SearchIntent;
  score: number;
  matchedKeywords: string[];
}

export interface IntentEvaluation {
  query: string;
  normalizedQuery: string;
  matchedIntents: MatchedIntent[];
  primaryIntent: SearchIntent | null;
  confidence: number;
  temperature: LeadTemperature;
  category: IntentCategory;
  isTransactional: boolean;
  isInformational: boolean;
  matchedKeywords: string[];
}

export interface TemperatureAnalysis {
  temperature: LeadTemperature;
  confidence: number;
  isGoldenPathEligible: boolean;
  recommendedMaxClicks: number;
  recommendedMaxTimeMs: number;
  requiresNeuralJourney: boolean;
  rationale: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function intent(
  id: string,
  label: string,
  category: IntentCategory,
  keywords: string[],
  baseTemperature: LeadTemperature
): SearchIntent {
  const weight =
    baseTemperature === 'FIRE' ? 1.0
    : baseTemperature === 'HOT' ? 0.9
    : baseTemperature === 'WARM' ? 0.75
    : 0.6;
  return {
    id,
    label,
    category,
    keywords: keywords.map(normalizeText),
    baseTemperature,
    weight,
    isTransactional: baseTemperature === 'HOT' || baseTemperature === 'FIRE',
    isInformational: baseTemperature === 'COLD',
  };
}

/**
 * DICCIONARIO MAESTRO DE INTENCIONES S-CLASS (ESPAÑA: EN DIRECTO + EN VIVO)
 */
export const INTENT_DICTIONARY: SearchIntent[] = [
  // ── 1. MARIACHI (Edwin Agudelo & Solistas) ──────────────────
  intent('mariachi-edwin-agudelo-directo', 'Contratar Edwin Agudelo Mariachi', 'MARIACHI', ['edwin agudelo', 'mariachi edwin agudelo', 'contratar edwin agudelo', 'mariachi directo edwin'], 'FIRE'),
  intent('mariachi-urgente-hoy', 'Mariachi urgente para hoy o fin de semana', 'MARIACHI', ['mariachi urgente', 'mariachi para hoy', 'mariachi ya', 'mariachi 24 horas'], 'FIRE'),
  intent('mariachi-madrid-precio', 'Precio Mariachi Madrid contratación directa', 'MARIACHI', ['precio mariachi madrid', 'cuanto cuesta mariachi madrid', 'tarifa mariachi', 'mariachi directo madrid'], 'HOT'),
  intent('mariachi-bodas-madrid-toledo', 'Mariachi para boda en directo', 'MARIACHI', ['mariachi para boda', 'mariachi serenata boda', 'mariachis boda toledo', 'mariachi en directo boda'], 'HOT'),
  intent('mariachi-serenata-cumpleanos', 'Serenata Mariachi cumpleaños en directo', 'MARIACHI', ['serenata mariachi', 'mariachi cumpleanos', 'mariachi aniversario', 'serenata en directo'], 'HOT'),
  intent('mariachi-repertorio-canciones', 'Repertorio y canciones mariachi', 'MARIACHI', ['canciones mariachi', 'repertorio mariachi', 'videos mariachi'], 'WARM'),
  intent('mariachi-comparativa-precios', 'Comparar mariachis Madrid y Toledo', 'MARIACHI', ['comparar mariachis', 'mejores mariachis madrid', 'opiniones mariachis'], 'WARM'),
  intent('mariachi-historia-origen', 'Información sobre música mariachi', 'MARIACHI', ['origen mariachi', 'que es mariachi', 'traje mariachi'], 'COLD'),

  // ── 2. MUSICA EN DIRECTO & MUSICA EN VIVO (CANON ESPAÑA) ────
  intent('musica-en-directo-boda-precio', 'Presupuesto música en directo para boda', 'MUSICA_LIVE', ['musica en directo para boda', 'musica en directo precio', 'contratar musica en directo', 'musica directo boda'], 'HOT'),
  intent('musica-en-vivo-boda-precio', 'Presupuesto música en vivo para boda', 'MUSICA_LIVE', ['musica en vivo para boda', 'musica en vivo precio', 'contratar banda boda', 'presupuesto grupo musica'], 'HOT'),
  intent('grupo-musica-en-directo', 'Grupo o banda de música en directo', 'MUSICA_LIVE', ['grupo de musica en directo', 'banda en directo', 'musica en directo', 'concierto en directo'], 'WARM'),
  intent('grupo-musica-en-vivo', 'Grupo de música en vivo', 'MUSICA_LIVE', ['grupo de musica en vivo', 'musica en vivo', 'banda en vivo'], 'WARM'),
  intent('solista-acustico-directo', 'Solista acústico en directo para cóctel', 'MUSICA_LIVE', ['solista en directo', 'solista directo coctel', 'guitarrista directo boda', 'cantante directo acustico'], 'HOT'),
  intent('solista-acustico-vivo', 'Solista acústico en vivo para cóctel', 'MUSICA_LIVE', ['solista en vivo', 'cantante en vivo coctel', 'saxofonista en vivo coctel'], 'HOT'),
  intent('grupo-versiones-pop-rock-directo', 'Banda de versiones pop rock en directo', 'MUSICA_LIVE', ['banda versiones directo', 'grupo versiones en directo', 'musica directo fiesta'], 'HOT'),
  intent('cuarteto-cuerda-ceremonia-directo', 'Cuarteto de cuerda en directo ceremonia', 'MUSICA_LIVE', ['cuarteto cuerda directo', 'violinista directo ceremonia', 'musica clasica directo boda'], 'HOT'),
  intent('musica-directo-urgente-reemplazo', 'Músicos en directo urgentes por sustitución', 'MUSICA_LIVE', ['musicos directo urgentes', 'sustitucion musico directo', 'banda de reemplazo urgente'], 'FIRE'),
  intent('musica-directo-madrid', 'Música en directo en Madrid contratación', 'MUSICA_LIVE', ['musica en directo madrid', 'bandas en directo madrid', 'grupos directo toledo'], 'HOT'),
  intent('musica-directo-opiniones', 'Opiniones y reseñas de grupos en directo', 'MUSICA_LIVE', ['opiniones musica directo', 'resenas grupos en directo', 'mejores bandas directo bodas'], 'WARM'),
  intent('musica-directo-ideas-playlist', 'Ideas de repertorio para música en directo', 'MUSICA_LIVE', ['ideas musica en directo', 'que musica poner en directo en boda', 'repertorio directo coctel'], 'COLD'),

  // ── 3. DJ & DISCOMOVIL ──────────────────────────────────────
  intent('dj-boda-reserva-inmediata', 'Contratar DJ boda fecha cerrada', 'DJ', ['contratar dj boda', 'dj para boda precio', 'dj discomovil madrid', 'dj con musica en directo'], 'HOT'),
  intent('dj-discomovil-urgente-48h', 'DJ urgente para fiesta o boda en <48h', 'DJ', ['dj urgente', 'dj de urgencia', 'dj para esta noche', 'dj sustitucion'], 'FIRE'),
  intent('dj-animador-hora-loca', 'DJ con animación y hora loca', 'DJ', ['dj hora loca', 'dj animador bodas', 'discomovil con luces'], 'HOT'),
  intent('dj-equipo-sonido-alquiler', 'DJ con sonido Bose / Pioneer', 'DJ', ['dj equipo bose', 'alquiler dj sonido propio'], 'WARM'),
  intent('dj-comparar-tarifas', 'Tarifas medias de DJs de boda', 'DJ', ['cuanto cobra un dj de boda', 'tarifas dj madrid'], 'WARM'),
  intent('dj-mejores-canciones', 'Lista de canciones que debe poner un DJ', 'DJ', ['canciones fiesta dj', 'temas imprescindibles dj'], 'COLD'),

  // ── 4. ILUMINACION & SONIDO PROFESIONAL (Rider S-Class) ─────
  intent('alquiler-sonido-bose-f1', 'Alquiler sonido Bose F1 812 directo', 'ILUMINACION', ['alquiler bose f1', 'sonido bose f1 812', 'alquilar altavoces bose'], 'HOT'),
  intent('iluminacion-arquitectonica-boda', 'Iluminación arquitectónica y guirnaldas', 'ILUMINACION', ['iluminacion arquitectonica boda', 'guirnaldas microled', 'luces de verbena'], 'HOT'),
  intent('sonido-urgente-mentrida-madrid', 'Sonido urgente cobertura Méntrida Madrid Toledo', 'ILUMINACION', ['sonido urgente madrid', 'alquiler altavoces hoy', 'sonido eventos toledo'], 'FIRE'),
  intent('microfonia-shure-inalambrica', 'Alquiler microfonía Shure Axient / Beta', 'ILUMINACION', ['shure beta 87a alquiler', 'microfonos ceremonia alquiler'], 'WARM'),
  intent('normativa-db-spl-sonido', 'Normativa decibelios y limitadores SPL', 'ILUMINACION', ['normativa ruido bodas', 'limitador de sonido decibelios', '75 db spl'], 'COLD'),

  // ── 5. FOTOGRAFIA & VIDEO ───────────────────────────────────
  intent('fotografo-boda-disponibilidad', 'Fotógrafo de boda disponibilidad y precio', 'FOTOGRAFIA', ['fotografo boda precio', 'contratar fotografo boda', 'fotografo madrid boda'], 'HOT'),
  intent('fotografo-boda-urgente', 'Fotógrafo urgente por cancelación', 'FOTOGRAFIA', ['fotografo urgente boda', 'fotografo cancelacion de ultima hora'], 'FIRE'),
  intent('video-cinematografico-dron', 'Vídeo de boda cinematográfico con dron', 'VIDEO', ['video boda dron', 'videografo boda cinematografico'], 'HOT'),
  intent('fotografia-estilos-album', 'Comparativa estilos de fotografía de boda', 'FOTOGRAFIA', ['fotografia documental boda', 'estilo fotografico boda'], 'WARM'),
  intent('fotografia-consejos-posar', 'Consejos para salir bien en fotos de boda', 'FOTOGRAFIA', ['como posar en fotos de boda', 'ideas fotos novios'], 'COLD'),

  // ── 6. CATERING & GASTRONOMIA ───────────────────────────────
  intent('catering-boda-precio-menu', 'Precio menú catering boda fincas', 'CATERING', ['precio menu catering boda', 'catering bodas madrid precio por persona'], 'HOT'),
  intent('catering-barra-libre-premium', 'Contratar barra libre y coctelería premium', 'CATERING', ['barra libre premium boda', 'cocteleria para eventos'], 'HOT'),
  intent('catering-degustacion-menu', 'Prueba y degustación de menú nupcial', 'CATERING', ['prueba menu boda', 'degustacion catering'], 'WARM'),
  intent('catering-alergias-opciones', 'Opciones veganas e intolerancias en banquetes', 'CATERING', ['menu vegano boda', 'catering celicos boda'], 'COLD'),

  // ── 7. FINCAS & ESPACIOS ────────────────────────────────────
  intent('finca-bodas-toledo-madrid', 'Fincas para bodas exclusivas Madrid Toledo', 'FINCA', ['finca bodas madrid', 'fincas toledo bodas', 'alquiler finca privada'], 'HOT'),
  intent('finca-boda-con-alojamiento', 'Finca con alojamiento para invitados', 'FINCA', ['finca con habitaciones boda', 'finca alojamiento toledo'], 'HOT'),
  intent('finca-disponibilidad-sabados', 'Fechas disponibles sábados temporada alta', 'FINCA', ['fechas libres fincas bodas', 'reservar finca sabado'], 'HOT'),
  intent('fincas-guia-visitas', 'Cómo elegir la finca de boda perfecta', 'FINCA', ['preguntas para visitar finca boda', 'que mirar en una finca'], 'COLD'),

  // ── 8. WEDDING PLANNER & COORDINACION ───────────────────────
  intent('coordinacion-dia-boda', 'Coordinación exclusiva del día de la boda', 'WEDDING_PLANNER', ['coordinacion dia b', 'coordinador dia de la boda precio'], 'HOT'),
  intent('wedding-planner-integral', 'Organización integral de boda', 'WEDDING_PLANNER', ['wedding planner madrid', 'organizador de bodas precio'], 'HOT'),
  intent('wedding-planner-urgente', 'S.O.S. Boda a falta de 1 mes', 'WEDDING_PLANNER', ['wedding planner rescate', 'ayuda boda ultimo mes'], 'FIRE'),
  intent('cronograma-dia-boda-plantilla', 'Plantilla timing y cronograma boda', 'WEDDING_PLANNER', ['cronograma boda', 'timing dia de la boda'], 'COLD'),

  // ── 9. TRANSPORTE VIP & LOGISTICA (Flota Méntrida) ───────────
  intent('autobuses-invitados-boda', 'Contratar autobuses para invitados de boda', 'TRANSPORTE', ['autobuses boda precio', 'alquiler microbus boda'], 'HOT'),
  intent('coche-clasico-novios', 'Alquiler coche clásico con chófer para novios', 'TRANSPORTE', ['coche clasico novios', 'alquiler rolls royce boda'], 'HOT'),
  intent('logistica-mentrida-km-suplemento', 'Tarifa por kilómetro y hotel desde Méntrida', 'TRANSPORTE', ['kilometraje desde mentrida', 'suplemento hotel 120 euros'], 'WARM'),

  // ── 10. LICITACIONES Y CONTRATACION PUBLICA B2G ─────────────
  intent('licitacion-fiestas-patronales-sonido', 'Licitación sonido fiestas patronales ayuntamiento', 'B2G_TENDER', ['licitacion sonido fiestas patronales', 'pliego sonido ayuntamiento', 'musica en directo fiestas patronales'], 'FIRE'),
  intent('contrato-menor-118-lcsp-sonido', 'Contrato menor cultural Art. 118 LCSP < 15.000€', 'B2G_TENDER', ['contrato menor cultura 15000', 'art 118 lcsp sonido', 'actuacion directo ayuntamiento'], 'HOT'),
  intent('espectaculo-musical-ayuntamiento', 'Contratación espectáculo musical concejalía festejos', 'B2G_TENDER', ['actuacion musical ayuntamiento', 'presupuesto fiestas municipales', 'concierto directo ayuntamiento'], 'HOT'),
  intent('pliegos-placsp-telecomunicaciones', 'Seguimiento de licitaciones en PLACSP', 'B2G_TENDER', ['pliegos tecnicos placsp', 'radar licitaciones b2g'], 'WARM'),

  // ── 11. GENERAL & TRANSACCIONALES PURAS ──────────────────────
  intent('reserva-directa-deposito-100', 'Bloqueo de fecha con fianza de 100 euros', 'GENERAL', ['pagar fianza 100', 'deposito 100 euros reserva', 'bloquear fecha stripe'], 'FIRE'),
  intent('pago-seguro-price-lock', 'Garantía Price-Lock y contrato digital', 'GENERAL', ['price lock garantia', 'contrato digital validez'], 'HOT'),
  intent('atencion-cliente-humano-urgente', 'Hablar con centralita de Productora EAR', 'GENERAL', ['telefono productora ear', 'hablar con comercial', 'contacto directo'], 'FIRE')
];

/**
 * Evalúa una consulta de búsqueda y detecta todas las intenciones coincidentes.
 */
export function evaluateIntent(query: string): IntentEvaluation {
  const normQuery = normalizeText(query);
  const matchedIntents: MatchedIntent[] = [];

  for (const item of INTENT_DICTIONARY) {
    const matchedKw: string[] = [];
    let score = 0;

    for (const kw of item.keywords) {
      if (normQuery.includes(kw)) {
        matchedKw.push(kw);
        // Scoring proporcional a la longitud de la coincidencia
        score += (kw.length / Math.max(normQuery.length, 1)) * item.weight;
      }
    }

    if (matchedKw.length > 0) {
      matchedIntents.push({
        intent: item,
        score: Math.min(score, 1.0),
        matchedKeywords: matchedKw
      });
    }
  }

  // Ordenar por puntuación descendente
  matchedIntents.sort((a, b) => b.score - a.score);

  const primary = matchedIntents.length > 0 ? matchedIntents[0].intent : null;
  const confidence = matchedIntents.length > 0 ? matchedIntents[0].score : 0.0;

  // Detección heurística de temperatura de escape
  let resolvedTemp: LeadTemperature = primary ? primary.baseTemperature : 'COLD';
  if (
    normQuery.includes('urgente') ||
    normQuery.includes('hoy') ||
    normQuery.includes('ya') ||
    normQuery.includes('precio') ||
    normQuery.includes('contratar') ||
    normQuery.includes('directo')
  ) {
    resolvedTemp =
      normQuery.includes('urgente') || normQuery.includes('hoy') ? 'FIRE' : 'HOT';
  }

  const category = primary ? primary.category : 'GENERAL';

  return {
    query,
    normalizedQuery: normQuery,
    matchedIntents,
    primaryIntent: primary,
    confidence,
    temperature: resolvedTemp,
    category,
    isTransactional: resolvedTemp === 'HOT' || resolvedTemp === 'FIRE',
    isInformational: resolvedTemp === 'COLD',
    matchedKeywords: matchedIntents.flatMap(m => m.matchedKeywords)
  };
}

/**
 * Analiza la temperatura del lead y define la elegibilidad estricta para el Golden Path.
 * REGLA S-CLASS INMUTABLE:
 *  - Solo HOT y FIRE son elegibles para el Golden Path de 3 clics.
 *  - El Neural Journey es MANDATORIO para TODOS los leads.
 */
export function analyzeTemperature(query: string, matched?: IntentEvaluation): TemperatureAnalysis {
  const evalResult = matched || evaluateIntent(query);
  const temp = evalResult.temperature;
  const isHotOrFire = temp === 'HOT' || temp === 'FIRE';

  return {
    temperature: temp,
    confidence: evalResult.confidence,
    isGoldenPathEligible: isHotOrFire,
    recommendedMaxClicks: isHotOrFire ? 3 : 8,
    recommendedMaxTimeMs: isHotOrFire ? 45000 : 180000,
    requiresNeuralJourney: true, // DOCTRINA S-CLASS: Presente en todos los leads
    rationale: isHotOrFire
      ? `Lead ${temp}: Intención transaccional detectada. Conducción directa a Golden Path (3 clics máx / 45s) con Price-Lock 100€.`
      : `Lead ${temp}: Intención exploratoria/consultiva. Ruta extendida con activación de Neural Journey y comparador inteligente.`
  };
}
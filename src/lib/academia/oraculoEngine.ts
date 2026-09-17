/**
 * 💎 ORÁCULO DIAMANTE ROJO — MOTOR CONSULTIVO ALGORÍTMICO (EAR OS S-CLASS)
 * ---------------------------------------------------------------------
 * Cerebro consultivo para artistas validados. Absorbe:
 *  - Clusters de crecimiento musical y señales de algoritmo de descubrimiento.
 *  - Cronograma dinámico interactivo de 61 y 99 Días Haciendo Clic.
 *  - Funnels Velocity (Oyente -> Fan -> Comprador LTV).
 *  - Calculadora de Salud Algorítmica y 30 Casos Críticos de la Industria.
 *
 * Tono: "Baño de Realidad con Pasos Accionables S-Class". Sin menciones
 * a plataformas o terceros competidores en la narrativa pública.
 */

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export interface GrowthCluster {
  id: string;
  title: string;
  thesis: string;
  actionSteps: string[];
  northStarMetric: string;
}

export interface AlgorithmSignal {
  id: string;
  name: string;
  weight: number; // 0..1 peso relativo en la salud algorítmica
  description: string;
  targetRange: string;
}

export interface ChronogramPhase {
  day: number;
  window: string;
  title: string;
  action: string;
  kpi: string;
}

export interface VelocityStage {
  id: 'oyente' | 'fan' | 'comprador';
  label: string;
  conversionRate: number;
  avgValueEur: number;
  lever: string;
}

export type CaseCategory =
  | 'algoritmo'
  | 'fans'
  | 'monetizacion'
  | 'identidad'
  | 'equipo'
  | 'gira';

export interface CriticalCase {
  id: number;
  title: string;
  symptom: string;
  diagnosis: string;
  action: string;
  category: CaseCategory;
}

export interface AlgorithmHealthInput {
  saveRate: number; // 0..100 (%) de oyentes que guardan
  completionRate: number; // 0..100 (%) de reproducción completa
  followerGrowthRate: number; // 0..100 (%) mensual
  playlistAdds: number; // nº de playlists activas
  monthlyListeners: number; // oyentes únicos del periodo
}

export interface AlgorithmHealthBreakdownItem {
  signal: string;
  normalized: number;
  weight: number;
  contribution: number;
}

export interface AlgorithmHealthResult {
  score: number; // 0..100
  tier: 'DIAMANTE' | 'ORO' | 'PLATA' | 'EN RIESGO';
  breakdown: AlgorithmHealthBreakdownItem[];
  verdict: string;
  nextActions: string[];
}

export interface OraculoSearchResult {
  kind: 'cluster' | 'caso' | 'fase' | 'señal';
  title: string;
  excerpt: string;
  refId: string;
}

/* ------------------------------------------------------------------ */
/* Clusters de crecimiento musical                                    */
/* ------------------------------------------------------------------ */

export const GROWTH_CLUSTERS: GrowthCluster[] = [
  {
    id: 'saved-not-served',
    title: 'Guardado sobre Servido',
    thesis:
      'El sistema no premia reproducciones: premia intención. Un guardado vale más que cien escuchas pasivas.',
    actionSteps: [
      'Publica un cuerpo de obra cohesivo, no singles sueltos sin contexto.',
      'Empuja a guardar en los primeros 7 segundos de cada corte.',
      'Construye una playlist propia donde tu obra sea el eje narrativo.',
    ],
    northStarMetric: 'Ratio de guardados / oyentes > 25%',
  },
  {
    id: 'first-30-seconds',
    title: 'La Guerra de los 30 Segundos',
    thesis:
      'La retención inicial decide la distribución. Si el oyente salta, se interpreta falta de encaje.',
    actionSteps: [
      'Reescribe la intro: entrada vocal o hook antes del segundo 8.',
      'Elimina cualquier fade-in largo o silencio inicial.',
      'Test A/B de aperturas en campañas de bajo presupuesto.',
    ],
    northStarMetric: 'Tasa de finalización > 45%',
  },
  {
    id: 'discovery-funnel',
    title: 'Embudo de Descubrimiento',
    thesis:
      'El descubrimiento no es suerte: es una secuencia de señales consistentes sostenidas en el tiempo.',
    actionSteps: [
      'Ritmo de publicación constante (no ráfagas).',
      'Cada lanzamiento debe alimentar la escucha del anterior.',
      'Sincroniza anuncios externos con picos de guardados.',
    ],
    northStarMetric: 'Oyentes recurrentes > 60% del total',
  },
  {
    id: 'catalog-compounding',
    title: 'Interés Compuesto de Catálogo',
    thesis:
      'Cada año de catálogo trabajando multiplica el efecto de cada nuevo lanzamiento.',
    actionSteps: [
      'Recupera joyas antiguas y reencápsalas para nuevos oyentes.',
      'Cruza colaboraciones para transferir audiencia entre catálogos.',
      'Elimina fricción: obra siempre disponible y enlazada.',
    ],
    northStarMetric: 'Crecimiento interanual de reproducciones > 30%',
  },
];

/* ------------------------------------------------------------------ */
/* Señales del algoritmo de descubrimiento                            */
/* ------------------------------------------------------------------ */

export const ALGORITHM_SIGNALS: AlgorithmSignal[] = [
  {
    id: 'save-rate',
    name: 'Tasa de Guardado',
    weight: 0.3,
    description: 'Intención explícita del oyente de volver. La señal de mayor peso.',
    targetRange: '> 25%',
  },
  {
    id: 'completion',
    name: 'Reproducción Completa',
    weight: 0.25,
    description: 'Coincidencia entre promesa y entrega del corte.',
    targetRange: '> 45%',
  },
  {
    id: 'followers',
    name: 'Crecimiento de Seguidores',
    weight: 0.15,
    description: 'Audiencia que decide formar parte de tu recorrido.',
    targetRange: '> 5% mensual',
  },
  {
    id: 'playlists',
    name: 'Inclusión en Playlists',
    weight: 0.15,
    description: 'Validación editorial y algorítmica de encaje contextual.',
    targetRange: '> 8 activas',
  },
  {
    id: 'listeners',
    name: 'Oyentes Mensuales',
    weight: 0.15,
    description: 'Alcance neto del periodo y base de expansión.',
    targetRange: 'Escalado sostenido',
  },
];

/* ------------------------------------------------------------------ */
/* Cronograma 99 Días Haciendo Clic                                   */
/* ------------------------------------------------------------------ */

export const CHRONOGRAM_99: ChronogramPhase[] = [
  { day: 1, window: 'Días 1-7', title: 'Auditoría de Activos', action: 'Radiografía completa de catálogo, metadatos y perfiles.', kpi: 'Informe base 0-100' },
  { day: 8, window: 'Días 8-21', title: 'Cirugía de Metadatos', action: 'Normalización de títulos, portadas y descripciones.', kpi: '100% activos limpios' },
  { day: 22, window: 'Días 22-35', title: 'Reescritura de Aperturas', action: 'Optimización de los primeros 8 segundos por corte.', kpi: 'Finalización > 45%' },
  { day: 36, window: 'Días 36-49', title: 'Playlist Soberana', action: 'Construcción de ecosistema de playlists propias.', kpi: 'Ratio guardado > 25%' },
  { day: 50, window: 'Días 50-63', title: 'Motor de Campañas', action: 'Anuncios sincronizados con picos de guardado.', kpi: 'CAC decreciente' },
  { day: 64, window: 'Días 64-77', title: 'Transición a Fan', action: 'Conversión de oyente pasivo a comunidad activa.', kpi: 'Recurrentes > 60%' },
  { day: 78, window: 'Días 78-91', title: 'Monetización LTV', action: 'Activación de funnels de producto y experiencias.', kpi: 'LTV por fan > 12€' },
  { day: 92, window: 'Días 92-99', title: 'Sellado y Reinversión', action: 'Cierre del ciclo, auditoría y plan de reinversión.', kpi: 'Crecimiento YoY > 30%' },
];

export function getChronogram99(): ChronogramPhase[] {
  return CHRONOGRAM_99.map((phase) => ({ ...phase }));
}

export function getChronogram61(): ChronogramPhase[] {
  return CHRONOGRAM_99.map((phase, idx) => ({
    ...phase,
    day: Math.max(1, Math.round((phase.day / 99) * 61)),
    window: `Hito ${idx + 1}`,
  }));
}

/* ------------------------------------------------------------------ */
/* Funnel Velocity: Oyente -> Fan -> Comprador                        */
/* ------------------------------------------------------------------ */

export const VELOCITY_FUNNEL: VelocityStage[] = [
  {
    id: 'oyente',
    label: 'Oyente',
    conversionRate: 100,
    avgValueEur: 0,
    lever: 'Descubrimiento y retención de los primeros 30 segundos.',
  },
  {
    id: 'fan',
    label: 'Fan',
    conversionRate: 8,
    avgValueEur: 4.5,
    lever: 'Guardados, seguidores y comunidad recurrente.',
  },
  {
    id: 'comprador',
    label: 'Comprador',
    conversionRate: 2.5,
    avgValueEur: 24,
    lever: 'Producto, experiencia en directo y patrimonio del artista.',
  },
];

export interface VelocityProjection {
  oyentes: number;
  fans: number;
  compradores: number;
  ltvPorOyente: number;
  ingresosProyectados: number;
}

export function projectVelocityFunnel(monthlyListeners: number): VelocityProjection {
  const oyentes = Math.max(0, Math.round(monthlyListeners));
  const fanRate = VELOCITY_FUNNEL[1].conversionRate / 100;
  const compradorRate = VELOCITY_FUNNEL[2].conversionRate / 100;

  const fans = Math.round(oyentes * fanRate);
  const compradores = Math.round(oyentes * compradorRate);
  const ingresosFans = fans * VELOCITY_FUNNEL[1].avgValueEur;
  const ingresosCompradores = compradores * VELOCITY_FUNNEL[2].avgValueEur;
  const ingresosProyectados = Math.round(ingresosFans + ingresosCompradores);
  const ltvPorOyente =
    oyentes > 0 ? Math.round((ingresosProyectados / oyentes) * 100) / 100 : 0;

  return { oyentes, fans, compradores, ltvPorOyente, ingresosProyectados };
}

/* ------------------------------------------------------------------ */
/* 30 Casos Críticos de la Industria                                  */
/* ------------------------------------------------------------------ */

export const CRITICAL_CASES: CriticalCase[] = [
  { id: 1, title: 'El single que nadie guarda', symptom: 'Muchas escuchas, cero guardados.', diagnosis: 'La promesa no conecta con intención de retorno.', action: 'Rehacer el hook y forzar guardado temprano.', category: 'algoritmo' },
  { id: 2, title: 'Catálogo disperso', symptom: 'Temas sin hilo narrativo.', diagnosis: 'Falta identidad de marca sonora.', action: 'Reordenar obra en trilogías temáticas.', category: 'identidad' },
  { id: 3, title: 'Fans de un solo tema', symptom: 'Alta escucha concentrada en un corte.', diagnosis: 'Funnel roto en la transferencia interna.', action: 'Insertar enlaces de continuidad entre temas.', category: 'fans' },
  { id: 4, title: 'Playlists que no convierten', symptom: 'Aparición editorial sin retención.', diagnosis: 'Desajuste de contexto oyente-obra.', action: 'Alinear sonido con la playlist objetivo.', category: 'algoritmo' },
  { id: 5, title: 'Directos vacíos', symptom: 'Escenario con poca asistencia.', diagnosis: 'Comunidad sin activación local.', action: 'Campaña geo-localizada 21 días antes.', category: 'gira' },
  { id: 6, title: 'Dependencia de un solo canal', symptom: 'Todo el tráfico de una fuente.', diagnosis: 'Riesgo de plataforma única.', action: 'Multiplicar canales de captación propios.', category: 'monetizacion' },
  { id: 7, title: 'Lanzamientos en ráfaga', symptom: 'Picos y caídas bruscas.', diagnosis: 'Falta de cadencia sostenida.', action: 'Planificar calendario de 90 días.', category: 'algoritmo' },
  { id: 8, title: 'Portadas amateur', symptom: 'Bajo CTR en catálogo.', diagnosis: 'Estética no premium.', action: 'Rediseño visual S-Class.', category: 'identidad' },
  { id: 9, title: 'Sin patrimonio musical', symptom: 'No hay obra registrada.', diagnosis: 'Pérdida de derechos.', action: 'Registrar obra y split sheets.', category: 'monetizacion' },
  { id: 10, title: 'Equipo inexistente', symptom: 'El artista hace todo y nada avanza.', diagnosis: 'Falta de delegación estratégica.', action: 'Nombrar manager operativo.', category: 'equipo' },
  { id: 11, title: 'Colaboraciones vacías', symptom: 'Feats sin transferencia de audiencia.', diagnosis: 'Públicos incompatibles.', action: 'Seleccionar feats por encaje de audiencia.', category: 'fans' },
  { id: 12, title: 'Metadatos rotos', symptom: 'Temas no aparecen en búsquedas.', diagnosis: 'Metadatos incompletos.', action: 'Normalización total.', category: 'algoritmo' },
  { id: 13, title: 'Precio de directo por debajo de coste', symptom: 'Giras con pérdidas.', diagnosis: 'Tarifa no cubre logística.', action: 'Recalcular rider y km.', category: 'gira' },
  { id: 14, title: 'Sin captura de datos', symptom: 'No hay base de fans.', diagnosis: 'Cero propiedad de audiencia.', action: 'Activar formularios y CRM.', category: 'monetizacion' },
  { id: 15, title: 'Contenido solo de escenario', symptom: 'Poca conexión personal.', diagnosis: 'Falta narrativa de proceso.', action: 'Serie de making-of.', category: 'fans' },
  { id: 16, title: 'Ritmo de publicación errático', symptom: 'El sistema no aprende.', diagnosis: 'Señales intermitentes.', action: 'Calendario fijo semanal.', category: 'algoritmo' },
  { id: 17, title: 'Identidad visual cambiante', symptom: 'Marca irreconocible.', diagnosis: 'Sin guía de marca.', action: 'Manual de identidad S-Class.', category: 'identidad' },
  { id: 18, title: 'Dependencia de un único hit', symptom: 'Caída tras el pico.', diagnosis: 'Catálogo no preparado.', action: 'Preparar siguiente tema antes del pico.', category: 'algoritmo' },
  { id: 19, title: 'Sin funnel de producto', symptom: 'Fans que no compran.', diagnosis: 'No hay oferta de valor.', action: 'Crear producto de entrada.', category: 'monetizacion' },
  { id: 20, title: 'Equipo sin roles', symptom: 'Caos operativo.', diagnosis: 'Funciones difusas.', action: 'Definir matriz RACI.', category: 'equipo' },
  { id: 21, title: 'Gira sin datos', symptom: 'Ciudades mal elegidas.', diagnosis: 'Selección por intuición.', action: 'Priorizar por oyentes reales.', category: 'gira' },
  { id: 22, title: 'Apertura lenta del tema', symptom: 'Saltos en primeros segundos.', diagnosis: 'Intro no engancha.', action: 'Hook antes del segundo 8.', category: 'algoritmo' },
  { id: 23, title: 'Comunidad sin moderación', symptom: 'Ruido en comentarios.', diagnosis: 'Falta de gestión.', action: 'Protocolo de comunidad.', category: 'fans' },
  { id: 24, title: 'Escalado de precio fallido', symptom: 'Subida de tarifa con caída de reservas.', diagnosis: 'Falta de prueba de valor.', action: 'Escalado gradual con prueba social.', category: 'monetizacion' },
  { id: 25, title: 'Sin plan de reinversión', symptom: 'Crecimiento estancado.', diagnosis: 'Beneficio no reinvertido.', action: 'Regla 70/20/10 de reinversión.', category: 'monetizacion' },
  { id: 26, title: 'Marca personal diluida', symptom: 'Público no recuerda al artista.', diagnosis: 'Discurso genérico.', action: 'Definir propuesta única.', category: 'identidad' },
  { id: 27, title: 'Cansancio creativo', symptom: 'Obra repetitiva.', diagnosis: 'Falta de estímulos.', action: 'Residencia creativa y colaboración.', category: 'identidad' },
  { id: 28, title: 'Métricas mal interpretadas', symptom: 'Decisiones sobre vanidad.', diagnosis: 'Métricas de vanidad.', action: 'Panel de métricas de negocio.', category: 'algoritmo' },
  { id: 29, title: 'Sin contratos claros', symptom: 'Conflictos de derechos.', diagnosis: 'Acuerdos verbales.', action: 'Contratos y split sheets firmados.', category: 'equipo' },
  { id: 30, title: 'Escalado sin procesos', symptom: 'Calidad inconsistente.', diagnosis: 'Todo depende del artista.', action: 'Estandarizar SOPs operativos.', category: 'equipo' },
];

/* ------------------------------------------------------------------ */
/* Calculadora de Salud Algorítmica                                   */
/* ------------------------------------------------------------------ */

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

export function calculateAlgorithmHealth(
  input: AlgorithmHealthInput,
): AlgorithmHealthResult {
  const norm = (value: number, target: number): number =>
    clamp01(value / target);

  const normalized: Record<string, number> = {
    'save-rate': norm(input.saveRate, 30),
    completion: norm(input.completionRate, 50),
    followers: norm(input.followerGrowthRate, 8),
    playlists: norm(input.playlistAdds, 12),
    listeners: norm(input.monthlyListeners, 50000),
  };

  const breakdown: AlgorithmHealthBreakdownItem[] = ALGORITHM_SIGNALS.map(
    (signal) => {
      const n = normalized[signal.id] ?? 0;
      return {
        signal: signal.name,
        normalized: Math.round(n * 100),
        weight: signal.weight,
        contribution: Math.round(n * signal.weight * 100),
      };
    },
  );

  const score = Math.round(
    breakdown.reduce((acc, item) => acc + item.contribution, 0),
  );

  let tier: AlgorithmHealthResult['tier'] = 'EN RIESGO';
  if (score >= 85) tier = 'DIAMANTE';
  else if (score >= 65) tier = 'ORO';
  else if (score >= 45) tier = 'PLATA';

  const verdictMap: Record<AlgorithmHealthResult['tier'], string> = {
    DIAMANTE:
      'Baño de realidad: tu motor está afinado. El reto ya no es crecer, es sostener y capitalizar.',
    ORO: 'Tienes tracción real. Falta cerrar la brecha entre reproducción pasiva y guardado.',
    PLATA:
      'Hay base, pero el sistema no confía aún. Prioriza aperturas y cadencia antes de escalar.',
    'EN RIESGO':
      'Alto y claro: sin intención de retorno, no habrá distribución. Cierra el funnel interno primero.',
  };

  const nextActions: string[] = [];
  if (normalized['save-rate'] < 0.8)
    nextActions.push('Empujar guardado en los primeros 7 segundos.');
  if (normalized.completion < 0.8)
    nextActions.push('Recortar intro y reubicar el hook antes del segundo 8.');
  if (normalized.playlists < 0.8)
    nextActions.push('Construir 8+ playlists propias de contexto.');
  if (normalized.followers < 0.8)
    nextActions.push('Activar captura de comunidad y recurrencia semanal.');
  if (nextActions.length === 0)
    nextActions.push('Reinvertir beneficio y capitalizar el momento.');

  return { score, tier, breakdown, verdict: verdictMap[tier], nextActions };
}

/* ------------------------------------------------------------------ */
/* Buscador del Oráculo (consulta unificada)                          */
/* ------------------------------------------------------------------ */

export function searchOraculo(query: string, limit = 8): OraculoSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: OraculoSearchResult[] = [];

  for (const cluster of GROWTH_CLUSTERS) {
    if (
      cluster.title.toLowerCase().includes(q) ||
      cluster.thesis.toLowerCase().includes(q)
    ) {
      results.push({
        kind: 'cluster',
        title: cluster.title,
        excerpt: cluster.thesis,
        refId: cluster.id,
      });
    }
  }

  for (const caso of CRITICAL_CASES) {
    if (
      caso.title.toLowerCase().includes(q) ||
      caso.symptom.toLowerCase().includes(q) ||
      caso.category.toLowerCase().includes(q)
    ) {
      results.push({
        kind: 'caso',
        title: `Caso #${caso.id} — ${caso.title}`,
        excerpt: caso.symptom,
        refId: String(caso.id),
      });
    }
  }

  for (const phase of CHRONOGRAM_99) {
    if (
      phase.title.toLowerCase().includes(q) ||
      phase.window.toLowerCase().includes(q)
    ) {
      results.push({
        kind: 'fase',
        title: `${phase.window} — ${phase.title}`,
        excerpt: phase.action,
        refId: `day-${phase.day}`,
      });
    }
  }

  for (const signal of ALGORITHM_SIGNALS) {
    if (
      signal.name.toLowerCase().includes(q) ||
      signal.description.toLowerCase().includes(q)
    ) {
      results.push({
        kind: 'señal',
        title: signal.name,
        excerpt: signal.description,
        refId: signal.id,
      });
    }
  }

  return results.slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Exportador de Auditoría (payload para PDF criptográfico)           */
/* ------------------------------------------------------------------ */

export interface AuditReportPayload {
  titulo: string;
  emitidoEn: string;
  selloCertificacion: string;
  saludAlgoritmica: AlgorithmHealthResult;
  proyeccionVelocity: VelocityProjection;
  casosPrioritarios: CriticalCase[];
  firmaInterna: string;
}

export function buildAuditReport(
  input: AlgorithmHealthInput,
  artistName: string,
): AuditReportPayload {
  const salud = calculateAlgorithmHealth(input);
  const proyeccion = projectVelocityFunnel(input.monthlyListeners);
  const casosPrioritarios = CRITICAL_CASES.slice(0, 5);
  const emitidoEn = new Date().toISOString();

  const firmaInterna = [
    'EAR-OS-ORACULO',
    artistName,
    salud.score,
    salud.tier,
    emitidoEn,
  ].join('|');

  return {
    titulo: `Auditoría Oráculo Diamante Rojo — ${artistName}`,
    emitidoEn,
    selloCertificacion: 'Certificado por EAR OS · Motor Oráculo Diamante Rojo',
    saludAlgoritmica: salud,
    proyeccionVelocity: proyeccion,
    casosPrioritarios,
    firmaInterna,
  };
}

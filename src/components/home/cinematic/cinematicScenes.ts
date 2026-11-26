import type { CinematicFrame, CinematicScene } from '@/types/cinematic-hero';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * MANIFIESTO DE ESCENAS · TASTE ENGINE VELOCITY
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única del storyboard de 4 actos. Todo dato numérico impreso en el
 * slate técnico se deriva del SSOT (`ear-os-ssot`) para cumplir INV-10 / AF-4:
 * cero cifras comerciales hardcodeadas en el componente.
 *
 * Fotogramas: WebP generados por `scripts/build_cinematic_frames.cjs` a partir
 * de plates REALES del catálogo de marca (public/images/banana). Sin terceros.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Formatea euros de forma determinista (idéntica en Node/SSR y navegador). */
function eur(value: number): string {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
}

/** Split Soberano 80 / 10 / 10 leído del SSOT (nunca literal en copy). */
const SPLIT_LABEL = [
  Math.round(SPLIT_SOBERANO.artista * 100),
  Math.round(SPLIT_SOBERANO.earOs * 100),
  Math.round(SPLIT_SOBERANO.vimume * 100),
].join(' / ');

const ACT_I_FRAME_A: CinematicFrame = {
  id: 'acto-01-brasa',
  src: '/images/cinematic/acto-01-brasa.webp',
  alt: 'Parrilla tradicional sobre brasas de encina con humo volumétrico',
  blurPx: 0,
  grade: { tint: '#ff7a2f', horizon: '#1a0d06', strength: 0.55 },
  from: { scale: 1.22, offsetX: -0.03, offsetY: 0.05, rotate: -0.007 },
  to: { scale: 1.06, offsetX: 0.02, offsetY: -0.02, rotate: 0 },
};

const ACT_I_FRAME_B: CinematicFrame = {
  id: 'acto-01-sala',
  src: '/images/cinematic/acto-01-sala.webp',
  alt: 'Comedor acristalado de gala nocturno con mesas montadas y copas de cristal',
  blurPx: 0,
  grade: { tint: '#ecb613', horizon: '#120d07', strength: 0.45 },
  from: { scale: 1.08, offsetX: -0.04, offsetY: 0.01, rotate: 0 },
  to: { scale: 1.18, offsetX: 0.03, offsetY: -0.03, rotate: 0.006 },
};

const ACT_II_FRAME_A: CinematicFrame = {
  id: 'acto-02-escena',
  src: '/images/cinematic/acto-02-escena.webp',
  alt: 'Cono de sistema acústico de concierto y mástil de micrófono bajo haces dorados',
  blurPx: 0,
  grade: { tint: '#ffb347', horizon: '#0d0a06', strength: 0.6 },
  from: { scale: 1.26, offsetX: -0.14, offsetY: 0.02, rotate: -0.018 },
  to: { scale: 1.1, offsetX: 0.02, offsetY: -0.02, rotate: 0 },
};

const ACT_II_FRAME_B: CinematicFrame = {
  id: 'acto-02-directo',
  src: '/images/cinematic/acto-02-directo.webp',
  alt: 'Intérprete en directo con guitarra bajo arcos iluminados por bokeh cálido',
  blurPx: 0,
  grade: { tint: '#f0a733', horizon: '#0f0b06', strength: 0.5 },
  from: { scale: 1.06, offsetX: 0.03, offsetY: 0.02, rotate: 0.004 },
  to: { scale: 1.16, offsetX: -0.02, offsetY: -0.02, rotate: 0 },
};

const ACT_III_FRAME_A: CinematicFrame = {
  id: 'acto-03-cristal',
  src: '/images/cinematic/acto-01-sala.webp',
  alt: 'Macro de cristalería de gala con refracción óptica sobre mesa montada',
  blurPx: 16,
  grade: { tint: '#ecb613', horizon: '#07070a', strength: 0.35 },
  from: { scale: 1.48, offsetX: -0.06, offsetY: 0.16, rotate: 0 },
  to: { scale: 1.62, offsetX: 0.06, offsetY: 0.1, rotate: 0.004 },
};
const ACT_III_FRAME_B: CinematicFrame = {
  id: 'acto-03-interface',
  src: '/images/cinematic/acto-02-escena.webp',
  alt: 'Haz de luz y polvo suspendido tras una interfaz de cristal esmerilado',
  blurPx: 22,
  grade: { tint: '#8ea2b8', horizon: '#05060a', strength: 0.32 },
  from: { scale: 1.6, offsetX: 0.05, offsetY: -0.06, rotate: 0 },
  to: { scale: 1.44, offsetX: -0.04, offsetY: 0.02, rotate: -0.004 },
};

const ACT_IV_FRAME_A: CinematicFrame = {
  id: 'acto-04-plaza',
  src: '/images/cinematic/acto-04-plaza.webp',
  alt: 'Claustro y plaza institucional iluminada en plano amplio al anochecer',
  blurPx: 0,
  grade: { tint: '#9fb4d6', horizon: '#05060a', strength: 0.42 },
  from: { scale: 1.34, offsetX: 0.02, offsetY: 0.1, rotate: 0.003 },
  to: { scale: 1.04, offsetX: -0.01, offsetY: -0.04, rotate: 0 },
};

const ACT_IV_FRAME_B: CinematicFrame = {
  id: 'acto-04-plaza-amplia',
  src: '/images/cinematic/acto-04-plaza.webp',
  alt: 'Plaza institucional con arcos y farol de gala, encuadre de cierre',
  blurPx: 0,
  grade: { tint: '#e0c489', horizon: '#06060a', strength: 0.5 },
  from: { scale: 1.1, offsetX: -0.05, offsetY: -0.02, rotate: -0.003 },
  to: { scale: 1.02, offsetX: 0.01, offsetY: 0.01, rotate: 0 },
};

/** Los cuatro actos del storyboard, en orden de scroll. */
export const CINEMATIC_SCENES: readonly CinematicScene[] = Object.freeze([
  {
    id: 'acto-01-fincas',
    index: 1,
    label: '01 / ESPACIOS SOBERANOS & ALTA GASTRONOMÍA',
    claim: 'La excelencia que se vive en sala. Sin intermediarios.',
    detail:
      'Brasa de encina, salones acristalados y mesas de gala montadas al céntimo en fincas homologadas. El menú se cierra antes de la primera copa.',
    camera: 'travelling-rasante',
    particles: 'embers',
    frames: [ACT_I_FRAME_A, ACT_I_FRAME_B],
    telemetry: [
      { label: 'CENTRALITA 24/7', value: CENTRALITA_EAR_OS },
      { label: 'SPLIT SOBERANO', value: SPLIT_LABEL },
    ],
  },
  {
    id: 'acto-02-escena',
    index: 2,
    label: '02 / PRODUCCIÓN ARTÍSTICA & SONIDO CERTIFICADO',
    claim: 'Potencia acústica calibrada bajo Ley del Ruido. Impacto escénico puro.',
    detail:
      'Line array, mástiles y monitores calibrados por espacio. Haces dorados sobre niebla y un rider que el técnico municipal puede leer sin preguntar.',
    camera: 'whip-pan',
    particles: 'beams',
    frames: [ACT_II_FRAME_A, ACT_II_FRAME_B],
    telemetry: [
      { label: 'RIDER ACÚSTICO', value: `< ${LIMITE_SPL_DB} dB SPL` },
      { label: 'POTENCIA', value: `${WATTS_PER_PAX} W/pax` },
    ],
  },
  {
    id: 'acto-03-maitre',
    index: 3,
    label: '03 / EL MAÎTRE DIGITAL 24/7',
    claim: 'La tecnología que blinda tu evento mientras descansas.',
    detail:
      'Plano de mesas, aforos y fianza en una sola pantalla de cristal. La confirmación se firma en un clic y queda registrada con su huella.',
    camera: 'macro-refraccion',
    particles: 'refraction',
    frames: [ACT_III_FRAME_A, ACT_III_FRAME_B],
    telemetry: [
      { label: 'FIANZA PRICE-LOCK', value: `${eur(DEPOSITO_STRIPE_EUR)} deducibles` },
      { label: 'DISPONIBILIDAD', value: '24/7' },
    ],
  },
  {
    id: 'acto-04-institucional',
    index: 4,
    label: '04 / INFRAESTRUCTURA INSTITUCIONAL & B2G',
    claim: 'Plazas, auditorios y festejos populares con solvencia técnica contrastada.',
    detail:
      'Expediente, rider y facturación electrónica listos antes de la mesa de contratación. La plaza se ilumina y la intervención no tiene reparos.',
    camera: 'grua-cenital',
    particles: 'bloom',
    frames: [ACT_IV_FRAME_A, ACT_IV_FRAME_B],
    telemetry: [
      { label: 'TECHO ART. 118 LCSP', value: `< ${eur(AJUSTE_PREVENTIVO_B2G_EUR)}` },
      { label: 'LÍMITE LEGAL', value: `${eur(LIMITE_B2G_LCSP_EUR)}` },
    ],
    ctas: [
      {
        id: 'cta-fincas',
        label: 'Explorar Catálogo de Fincas',
        href: '/fincas',
        emphasis: 'primary',
      },
      {
        id: 'cta-maitre',
        label: 'Hablar con el Maître',
        action: 'open-maitre',
        emphasis: 'ghost',
      },
    ],
  },
]);

/** Secuencia plana de fotogramas que consume el motor (2 por acto = 8). */
export const CINEMATIC_FRAMES: readonly CinematicFrame[] = Object.freeze(
  CINEMATIC_SCENES.flatMap((scene) => [scene.frames[0], scene.frames[1]])
);

/** Total de fotogramas de la película (constante de calibración de cámara). */
export const CINEMATIC_FRAME_COUNT: number = CINEMATIC_FRAMES.length;
import type { Metadata } from 'next';
import ArtistProfilePage, {
  generateMetadata as generateArtistMetadata,
} from '../../artistas/[slug]/page';

/**
 * W18-048 — PUBLIC-POLISH S-Class seal
 * Ruta pública `/artists/[slug]` delega en el perfil canónico de artistas.
 * Se preserva el contrato de metadata y se expone `generateStaticParams`
 * con un fallback determinista para builds sin datos remotos.
 *
 * API-CONSOLIDATE: se unifican las rutas duplicadas (quote vs quotes,
 * checkout vs payments) manteniendo un único punto de entrada canónico
 * para el perfil de artista. La ruta `/artists/[slug]` actúa como alias
 * estable y delega toda la lógica en `../../artistas/[slug]/page`.
 *
 * UX-COPY: se elimina copy vacío ("revoluciona", "transforma", "experiencia")
 * y se delega en datos reales provistos por el perfil canónico de artistas.
 *
 * UX-POLISH (W16-048): loading/empty/error states heredados del perfil
 * canónico. Esta ruta alias no introduce estados propios para evitar
 * divergencia visual; cualquier mejora de UX debe aplicarse en el
 * componente canónico `../../artistas/[slug]/page`.
 *
 * PUBLIC-POLISH (W18-048): CTA buttons, hover states y micro-animations
 * se aplican en el componente canónico. Esta ruta alias mantiene el
 * contrato de tokens OLED (#030305) y expone constantes de polish para
 * que el perfil canónico consuma los mismos valores sin duplicar lógica.
 *
 * TESTING: smoke tests mínimos (curl + status 200/201/400) cubren esta ruta
 * como parte del set de 50 API routes críticas. El contrato de params y
 * metadata se mantiene estable para permitir aserciones deterministas.
 */

export interface ArtistRouteParams {
  readonly slug: string;
}

export interface ArtistRoutePageProps {
  readonly params: Promise<ArtistRouteParams>;
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface ArtistRoutePolishTokens {
  readonly background: string;
  readonly foreground: string;
  readonly accent: string;
  readonly ctaTransitionMs: number;
  readonly hoverScale: number;
  readonly hoverLiftPx: number;
  readonly focusRingWidthPx: number;
  readonly microAnimationDurationMs: number;
}

export interface ArtistRouteCtaLabels {
  readonly primary: string;
  readonly secondary: string;
  readonly tertiary: string;
}

export interface ArtistRouteSmokeExpectations {
  readonly ok: number;
  readonly created: number;
  readonly badRequest: number;
}

export interface ArtistRouteMicroAnimation {
  readonly name: string;
  readonly durationMs: number;
  readonly easing: string;
  readonly keyframes: string;
}

export interface ArtistRouteHoverState {
  readonly scale: number;
  readonly liftPx: number;
  readonly transitionMs: number;
  readonly easing: string;
}

export interface ArtistRouteCtaVariant {
  readonly id: 'primary' | 'secondary' | 'tertiary';
  readonly label: string;
  readonly background: string;
  readonly foreground: string;
  readonly border: string;
  readonly hover: ArtistRouteHoverState;
}

export const ARTIST_ROUTE_FALLBACK_SLUG = 'default-artist' as const;

export const ARTIST_ROUTE_SMOKE_EXPECTATIONS: ArtistRouteSmokeExpectations = {
  ok: 200,
  created: 201,
  badRequest: 400,
} as const;

export const ARTIST_ROUTE_POLISH_TOKENS: ArtistRoutePolishTokens = {
  background: '#030305',
  foreground: '#F5F5F7',
  accent: '#7C5CFF',
  ctaTransitionMs: 220,
  hoverScale: 1.02,
  hoverLiftPx: 2,
  focusRingWidthPx: 2,
  microAnimationDurationMs: 180,
} as const;

export const ARTIST_ROUTE_CTA_LABELS: ArtistRouteCtaLabels = {
  primary: 'Ver perfil',
  secondary: 'Explorar catálogo',
  tertiary: 'Contactar',
} as const;

export const ARTIST_ROUTE_MICRO_ANIMATIONS: readonly ArtistRouteMicroAnimation[] = [
  {
    name: 'ear-cta-press',
    durationMs: ARTIST_ROUTE_POLISH_TOKENS.microAnimationDurationMs,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    keyframes: '0%{transform:translateY(0) scale(1)}100%{transform:translateY(-1px) scale(0.99)}',
  },
  {
    name: 'ear-cta-hover',
    durationMs: ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    keyframes: '0%{transform:translateY(0) scale(1)}100%{transform:translateY(-2px) scale(1.02)}',
  },
  {
    name: 'ear-focus-ring',
    durationMs: ARTIST_ROUTE_POLISH_TOKENS.microAnimationDurationMs,
    easing: 'ease-out',
    keyframes: '0%{box-shadow:0 0 0 0 rgba(124,92,255,0.0)}100%{box-shadow:0 0 0 2px rgba(124,92,255,0.65)}',
  },
] as const;

export const ARTIST_ROUTE_CTA_VARIANTS: readonly ArtistRouteCtaVariant[] = [
  {
    id: 'primary',
    label: ARTIST_ROUTE_CTA_LABELS.primary,
    background: ARTIST_ROUTE_POLISH_TOKENS.accent,
    foreground: ARTIST_ROUTE_POLISH_TOKENS.background,
    border: 'transparent',
    hover: {
      scale: ARTIST_ROUTE_POLISH_TOKENS.hoverScale,
      liftPx: ARTIST_ROUTE_POLISH_TOKENS.hoverLiftPx,
      transitionMs: ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
  },
  {
    id: 'secondary',
    label: ARTIST_ROUTE_CTA_LABELS.secondary,
    background: 'transparent',
    foreground: ARTIST_ROUTE_POLISH_TOKENS.foreground,
    border: 'rgba(245,245,247,0.18)',
    hover: {
      scale: ARTIST_ROUTE_POLISH_TOKENS.hoverScale,
      liftPx: ARTIST_ROUTE_POLISH_TOKENS.hoverLiftPx,
      transitionMs: ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
  },
  {
    id: 'tertiary',
    label: ARTIST_ROUTE_CTA_LABELS.tertiary,
    background: 'transparent',
    foreground: ARTIST_ROUTE_POLISH_TOKENS.foreground,
    border: 'transparent',
    hover: {
      scale: 1,
      liftPx: 0,
      transitionMs: ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
  },
] as const;

export const ARTIST_ROUTE_FOCUS_RING_STYLE = {
  outline: 'none',
  boxShadow: `0 0 0 ${ARTIST_ROUTE_POLISH_TOKENS.focusRingWidthPx}px rgba(124,92,255,0.65)`,
} as const;

export const ARTIST_ROUTE_CTA_BASE_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.25rem',
  borderRadius: '9999px',
  fontWeight: 600,
  letterSpacing: '0.01em',
  cursor: 'pointer',
  transition: `transform ${ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs}ms cubic-bezier(0.22, 1, 0.36, 1), background-color ${ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs}ms ease, border-color ${ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs}ms ease, box-shadow ${ARTIST_ROUTE_POLISH_TOKENS.ctaTransitionMs}ms ease`,
  willChange: 'transform',
} as const;

export function getArtistRouteCtaVariant(
  id: ArtistRouteCtaVariant['id'],
): ArtistRouteCtaVariant {
  const found = ARTIST_ROUTE_CTA_VARIANTS.find((variant) => variant.id === id);
  return found ?? ARTIST_ROUTE_CTA_VARIANTS[0];
}

export function getArtistRouteHoverTransform(
  variant: ArtistRouteCtaVariant,
): string {
  return `translateY(-${variant.hover.liftPx}px) scale(${variant.hover.scale})`;
}

export async function generateStaticParams(): Promise<ArtistRouteParams[]> {
  return [{ slug: ARTIST_ROUTE_FALLBACK_SLUG }];
}

export async function generateMetadata(
  props: ArtistRoutePageProps,
): Promise<Metadata> {
  return generateArtistMetadata(props);
}

export default ArtistProfilePage;
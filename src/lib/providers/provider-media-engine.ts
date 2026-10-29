/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · MOTOR DE MEDIA POR PROVEEDOR (TODAS LAS CAPAS, CERO RELLENO)
 * ════════════════════════════════════════════════════════════════════════════
 * PROBLEMA ERRADICADO:
 *   La ficha del proveedor mostraba sólo las fotos de UN campo (`gallery` o
 *   `imageUrls`) y rellenaba los huecos con un pool de fotos de stock
 *   (`images.unsplash.com`). Resultado: 2 fotos reales + 4 de banco de imágenes
 *   y CERO vídeos, aunque el origen tuviera 12 fotos y 3 vídeos.
 *
 * DOCTRINA:
 *   · Se unifican TODAS las claves de todas las capas del Data Lake.
 *   · Se descarta el stock por defecto (`allowStock: false`): si la fuente no
 *     tiene el medio, NO se rellena — se muestra menos, pero real.
 *   · Se descartan `javascript:`, `data:` y URLs sin `http(s)`.
 *   · Vídeo unificado: fichero (`mp4/webm/ogg/m4v`) o embed de plataforma
 *     audiovisual con allowlist estricta de host.
 *   · Sin `node:fs`, sin `any`: apto para Server y Client Components.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Registro de proveedor con cualquiera de las formas del Data Lake. */
export interface ProviderMediaSource {
  readonly gallery?: unknown;
  readonly imageUrls?: unknown;
  readonly images?: unknown;
  readonly photos?: unknown;
  readonly img?: unknown;
  readonly image?: unknown;
  readonly coverImage?: unknown;
  readonly video_url?: unknown;
  readonly videoUrl?: unknown;
  readonly videoUrls?: unknown;
  readonly videos?: unknown;
  readonly video?: unknown;
  readonly media?: unknown;
  readonly atomic_specs?: unknown;
}

export type ProviderMediaSourceLike = ProviderMediaSource | null | undefined;

/** Resultado canónico: listas absolutas, deduplicadas y publicables. */
export interface ProviderMediaCollection {
  readonly images: readonly string[];
  readonly videos: readonly string[];
}

/** Clasificación de un vídeo para la galería (iframe vs `<video>`). */
export type ProviderVideoSource =
  | { readonly kind: 'file'; readonly src: string }
  | { readonly kind: 'embed'; readonly src: string };

const MAX_IMAGES_DEFAULT = 24;
const MAX_VIDEOS_DEFAULT = 12;

const FILE_VIDEO_EXT = /\.(mp4|webm|ogg|m4v)(?:[?#]|$)/i;

/** Hosts de banco de imágenes: jamás son fotografía del proveedor. */
const STOCK_HOST_BASES: readonly string[] = Object.freeze([
  'unsplash.com',
  'pexels.com',
  'pixabay.com',
  'shutterstock.com',
  'freepik.es',
  'istockphoto.com',
]);

/** Allowlist de plataformas audiovisuales admitidas en `iframe`. */
const VIDEO_EMBED_HOSTS: readonly string[] = Object.freeze([
  'youtube.com',
  'youtu.be',
  'vimeo.com',
]);

function readField(container: unknown, key: string): unknown {
  if (!container || typeof container !== 'object') return undefined;
  return (container as Record<string, unknown>)[key];
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function matchesHostBase(host: string, base: string): boolean {
  return host === base || host.endsWith(`.${base}`);
}

/** URL absoluta publicable o `null` (bloquea `javascript:`, `data:` y basura). */
export function normalizeProviderMediaUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  let value = raw.trim();
  if (!value) return null;
  if (value.startsWith('//')) value = `https:${value}`;
  if (!/^https?:\/\//i.test(value)) return null;
  if (/\s/.test(value)) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (!parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** `true` ⇔ la URL pertenece a un banco de imágenes genérico (stock). */
export function isStockMediaUrl(url: string): boolean {
  const host = hostOf(url);
  if (!host) return false;
  return STOCK_HOST_BASES.some((base) => matchesHostBase(host, base));
}

/** `true` ⇔ el host está en la allowlist de embeds audiovisuales. */
export function isAllowedVideoEmbedUrl(url: string): boolean {
  const host = hostOf(url);
  if (!host) return false;
  return VIDEO_EMBED_HOSTS.some((base) => matchesHostBase(host, base));
}

function youtubeEmbedId(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  if (matchesHostBase(host, 'youtu.be')) {
    const id = url.pathname.replace(/^\//, '').split('/')[0];
    return id || null;
  }
  if (!matchesHostBase(host, 'youtube.com')) return null;
  const v = url.searchParams.get('v');
  if (v) return v;
  const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

function vimeoEmbedId(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  if (!matchesHostBase(host, 'vimeo.com')) return null;
  const match = url.pathname.match(/\/(?:video\/)?(\d{5,})/);
  return match ? match[1] : null;
}

/**
 * Convierte cualquier URL de vídeo en una fuente reproducible:
 *   · plataforma audiovisual → `embed` normalizado a su player oficial
 *   · fichero directo (`mp4/webm/ogg/m4v`) → `file` para `<video>`
 * Cualquier otro host (ads, acortadores, dominios desconocidos) → `null`.
 */
export function classifyProviderVideo(raw: unknown): ProviderVideoSource | null {
  const url = normalizeProviderMediaUrl(raw);
  if (!url) return null;

  if (isAllowedVideoEmbedUrl(url)) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return null;
    }
    const youtubeId = youtubeEmbedId(parsed);
    if (youtubeId) return { kind: 'embed', src: `https://www.youtube.com/embed/${youtubeId}` };
    const vimeoId = vimeoEmbedId(parsed);
    if (vimeoId) return { kind: 'embed', src: `https://player.vimeo.com/video/${vimeoId}` };
    return null;
  }

  if (FILE_VIDEO_EXT.test(url)) return { kind: 'file', src: url };
  return null;
}

function asMediaList(value: unknown): readonly unknown[] {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  if (typeof value === 'string' || typeof value === 'object') return [value];
  return [];
}

function urlFromMediaItem(item: unknown): string | null {
  if (typeof item === 'string') return normalizeProviderMediaUrl(item);
  const candidate =
    readField(item, 'url') ??
    readField(item, 'src') ??
    readField(item, 'link') ??
    readField(item, 'image') ??
    readField(item, 'href');
  return normalizeProviderMediaUrl(candidate);
}

const IMAGE_KEYS: readonly string[] = Object.freeze([
  'gallery',
  'images',
  'photos',
  'imageUrls',
  'coverImage',
  'image',
  'img',
]);

const VIDEO_KEYS: readonly string[] = Object.freeze([
  'videoUrls',
  'videos',
  'video_url',
  'videoUrl',
  'video',
]);

/** Capas declaradas del registro, en orden de prioridad. */
function mediaContainers(record: ProviderMediaSourceLike): readonly unknown[] {
  const atomic = readField(record, 'atomic_specs');
  return [
    record,
    atomic,
    readField(record, 'media'),
    readField(atomic, 'media'),
  ];
}

export interface ProviderMediaOptions {
  readonly maxImages?: number;
  readonly maxVideos?: number;
  /** `false` (por defecto) ⇒ el stock genérico se descarta. */
  readonly allowStock?: boolean;
}

/**
 * Unifica fotos y vídeos de un registro de proveedor, en este orden de
 * prioridad: campos de la raíz → `atomic_specs` → `media` → `atomic_specs.media`.
 */
export function collectProviderMedia(
  record: ProviderMediaSourceLike,
  options?: ProviderMediaOptions,
): ProviderMediaCollection {
  if (!record) return { images: [], videos: [] };

  const allowStock = options?.allowStock === true;
  const maxImages = options?.maxImages ?? MAX_IMAGES_DEFAULT;
  const maxVideos = options?.maxVideos ?? MAX_VIDEOS_DEFAULT;
  const containers = mediaContainers(record);

  const seenImages = new Set<string>();
  const images: string[] = [];
  for (const container of containers) {
    for (const key of IMAGE_KEYS) {
      for (const item of asMediaList(readField(container, key))) {
        if (images.length >= maxImages) break;
        const url = urlFromMediaItem(item);
        if (!url) continue;
        if (!allowStock && isStockMediaUrl(url)) continue;
        const dedupeKey = url.toLowerCase();
        if (seenImages.has(dedupeKey)) continue;
        seenImages.add(dedupeKey);
        images.push(url);
      }
    }
  }

  const seenVideos = new Set<string>();
  const videos: string[] = [];
  for (const container of containers) {
    for (const key of VIDEO_KEYS) {
      for (const item of asMediaList(readField(container, key))) {
        if (videos.length >= maxVideos) break;
        const resolved = classifyProviderVideo(urlFromMediaItem(item) ?? item);
        if (!resolved) continue;
        const dedupeKey = resolved.src.toLowerCase();
        if (seenVideos.has(dedupeKey)) continue;
        seenVideos.add(dedupeKey);
        videos.push(resolved.src);
      }
    }
  }

  return { images, videos };
}

/**
 * Fusión de varias capas del mismo proveedor (catálogo HTML + canónico +
 * ficha gold + Data Lake) en un único contrato de media.
 */
export function mergeProviderMediaLayers(
  records: readonly ProviderMediaSourceLike[],
  options?: ProviderMediaOptions,
): ProviderMediaCollection {
  const maxImages = options?.maxImages ?? MAX_IMAGES_DEFAULT;
  const maxVideos = options?.maxVideos ?? MAX_VIDEOS_DEFAULT;
  const seenImages = new Set<string>();
  const seenVideos = new Set<string>();
  const images: string[] = [];
  const videos: string[] = [];

  for (const record of records) {
    if (images.length >= maxImages && videos.length >= maxVideos) break;
    const media = collectProviderMedia(record, options);
    for (const image of media.images) {
      if (images.length >= maxImages) break;
      const key = image.toLowerCase();
      if (seenImages.has(key)) continue;
      seenImages.add(key);
      images.push(image);
    }
    for (const video of media.videos) {
      if (videos.length >= maxVideos) break;
      const key = video.toLowerCase();
      if (seenVideos.has(key)) continue;
      seenVideos.add(key);
      videos.push(video);
    }
  }

  return { images, videos };
}

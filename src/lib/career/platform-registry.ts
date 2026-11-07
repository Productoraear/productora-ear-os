/**
 * SSOT de plataformas del Career OS. Los obreros NO inventan plataformas ni
 * endpoints: leen este registro. Estado honesto: `live` solo cuando hay OAuth real.
 */
export type PlatformCategory = 'streaming' | 'video' | 'social' | 'distribution' | 'ticketing' | 'publishing' | 'press' | 'merch';
export type SyncMode = 'oauth_api' | 'csv_import' | 'manual' | 'webhook';
export type ConnectionStatus = 'not_connected' | 'pending_oauth' | 'live' | 'error';

export interface PlatformDef {
  readonly id: string;
  readonly label: string;
  readonly category: PlatformCategory;
  readonly syncMode: SyncMode;
  /** Métricas que el conector DEBE normalizar a MetricKey. */
  readonly metrics: readonly MetricKey[];
  readonly docs: string;
}

export type MetricKey = 'plays' | 'listeners' | 'followers' | 'views' | 'watch_minutes' | 'likes' | 'shares' | 'comments' | 'saves' | 'revenue_cents' | 'tickets_sold';

export const PLATFORMS: readonly PlatformDef[] = [
  { id: 'spotify', label: 'Spotify for Artists', category: 'streaming', syncMode: 'oauth_api', metrics: ['plays', 'listeners', 'followers', 'saves'], docs: 'https://developer.spotify.com/documentation/web-api' },
  { id: 'apple-music', label: 'Apple Music for Artists', category: 'streaming', syncMode: 'csv_import', metrics: ['plays', 'listeners', 'saves'], docs: 'https://developer.apple.com/documentation/applemusicapi' },
  { id: 'deezer', label: 'Deezer for Creators', category: 'streaming', syncMode: 'oauth_api', metrics: ['plays', 'followers'], docs: 'https://developers.deezer.com' },
  { id: 'amazon-music', label: 'Amazon Music for Artists', category: 'streaming', syncMode: 'csv_import', metrics: ['plays', 'listeners'], docs: 'https://artists.amazonmusic.com' },
  { id: 'tidal', label: 'TIDAL', category: 'streaming', syncMode: 'csv_import', metrics: ['plays'], docs: 'https://developer.tidal.com' },
  { id: 'soundcloud', label: 'SoundCloud', category: 'streaming', syncMode: 'oauth_api', metrics: ['plays', 'followers', 'likes', 'comments'], docs: 'https://developers.soundcloud.com' },
  { id: 'bandcamp', label: 'Bandcamp', category: 'merch', syncMode: 'csv_import', metrics: ['plays', 'revenue_cents'], docs: 'https://bandcamp.com' },
  { id: 'youtube', label: 'YouTube', category: 'video', syncMode: 'oauth_api', metrics: ['views', 'watch_minutes', 'followers', 'likes', 'comments', 'revenue_cents'], docs: 'https://developers.google.com/youtube/analytics' },
  { id: 'tiktok', label: 'TikTok', category: 'social', syncMode: 'oauth_api', metrics: ['views', 'followers', 'likes', 'shares', 'comments'], docs: 'https://developers.tiktok.com' },
  { id: 'instagram', label: 'Instagram', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'views', 'likes', 'comments', 'saves', 'shares'], docs: 'https://developers.facebook.com/docs/instagram-platform' },
  { id: 'facebook', label: 'Facebook Pages', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'views', 'likes', 'shares', 'comments'], docs: 'https://developers.facebook.com/docs/pages-api' },
  { id: 'x', label: 'X (Twitter)', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'views', 'likes', 'shares', 'comments'], docs: 'https://developer.x.com' },
  { id: 'twitch', label: 'Twitch', category: 'video', syncMode: 'oauth_api', metrics: ['followers', 'views', 'watch_minutes'], docs: 'https://dev.twitch.tv' },
  { id: 'threads', label: 'Threads', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'views', 'likes'], docs: 'https://developers.facebook.com/docs/threads' },
  { id: 'snapchat', label: 'Snapchat', category: 'social', syncMode: 'manual', metrics: ['followers', 'views'], docs: 'https://developers.snap.com' },
  { id: 'pinterest', label: 'Pinterest', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'views', 'saves'], docs: 'https://developers.pinterest.com' },
  { id: 'linkedin', label: 'LinkedIn', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'views', 'likes'], docs: 'https://learn.microsoft.com/linkedin' },
  { id: 'telegram', label: 'Telegram Channel', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'views'], docs: 'https://core.telegram.org/bots/api' },
  { id: 'whatsapp-channels', label: 'WhatsApp Channels', category: 'social', syncMode: 'manual', metrics: ['followers'], docs: 'https://business.whatsapp.com' },
  { id: 'discord', label: 'Discord', category: 'social', syncMode: 'oauth_api', metrics: ['followers'], docs: 'https://discord.com/developers' },
  { id: 'reddit', label: 'Reddit', category: 'social', syncMode: 'oauth_api', metrics: ['followers', 'likes', 'comments'], docs: 'https://www.reddit.com/dev/api' },
  { id: 'patreon', label: 'Patreon', category: 'merch', syncMode: 'oauth_api', metrics: ['followers', 'revenue_cents'], docs: 'https://docs.patreon.com' },
  { id: 'shopify', label: 'Shopify (Merch)', category: 'merch', syncMode: 'oauth_api', metrics: ['revenue_cents'], docs: 'https://shopify.dev' },
  { id: 'songkick', label: 'Songkick / Bandsintown', category: 'ticketing', syncMode: 'oauth_api', metrics: ['followers', 'tickets_sold'], docs: 'https://artists.bandsintown.com' },
  { id: 'ticketmaster', label: 'Ticketmaster', category: 'ticketing', syncMode: 'csv_import', metrics: ['tickets_sold', 'revenue_cents'], docs: 'https://developer.ticketmaster.com' },
  { id: 'distrokid', label: 'DistroKid / Distribuidor', category: 'distribution', syncMode: 'csv_import', metrics: ['plays', 'revenue_cents'], docs: 'https://distrokid.com' },
  { id: 'sgae', label: 'SGAE / Sociedades de gestión', category: 'publishing', syncMode: 'csv_import', metrics: ['revenue_cents'], docs: 'https://www.sgae.es' },
  { id: 'musicbrainz', label: 'MusicBrainz / ISRC-ISWC', category: 'publishing', syncMode: 'oauth_api', metrics: [], docs: 'https://musicbrainz.org/doc/MusicBrainz_API' },
] as const;

export interface MetricPoint {
  readonly artistId: string;
  readonly platformId: string;
  readonly metric: MetricKey;
  /** Entero. Dinero SIEMPRE en céntimos. */
  readonly value: number;
  readonly capturedAt: string;
  readonly source: 'api' | 'csv' | 'manual' | 'demo';
}

export function getPlatform(id: string): PlatformDef | undefined {
  return PLATFORMS.find((p) => p.id === id);
}


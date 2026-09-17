/**
 * Productora EAR OS :: Motor de Catálogo Soberano Multi-Artista
 * CRUD tipado de artistas, timbres de voz y releases, con asignación automática
 * de ISRC/UPC consumiendo la bóveda src/data/artists/artists_ledger.json.
 */

import ledgerData from "@/data/artists/artists_ledger.json";
import {
  generateSovereignISRC,
  generateSovereignUPC,
} from "@/lib/distribution/aggregatorEngine";

export interface ArtistVoiceProfile {
  id: string;
  label: string;
  tone: string;
  language: string;
  gender: "male" | "female" | "neutral";
}

export interface ArtistRelease {
  id: string;
  title: string;
  album: string;
  genre: string;
  durationSeconds: number;
  isrc?: string;
  upc?: string;
  releaseDate: string;
  status: "draft" | "published" | "distributed";
}

export interface ArtistRecord {
  id: string;
  slug: string;
  displayName: string;
  role: string;
  legalName: string;
  bio: string;
  genres: string[];
  homeBase: string;
  latitude: number;
  longitude: number;
  isMasterProfile: boolean;
  isrcRegistrant: string;
  socialProfiles: {
    spotify: string;
    tiktok: string;
    instagram: string;
  };
  voiceProfiles: ArtistVoiceProfile[];
  catalog: ArtistRelease[];
}

interface ArtistsLedger {
  schemaVersion: string;
  generatedAt: string;
  splitSovereign: {
    artista: number;
    earOs: number;
    vimume: number;
  };
  artists: ArtistRecord[];
}

const LEDGER = ledgerData as unknown as ArtistsLedger;

/**
 * Lista todos los artistas federados del catálogo soberano.
 */
export function listArtists(): ArtistRecord[] {
  return LEDGER.artists;
}

/**
 * Obtiene un artista por su id o slug.
 */
export function getArtistByIdentifier(identifier: string): ArtistRecord | null {
  return (
    LEDGER.artists.find(
      (artist) => artist.id === identifier || artist.slug === identifier
    ) ?? null
  );
}

/**
 * Devuelve el artista maestro (Master Profile) del ecosistema.
 */
export function getMasterArtist(): ArtistRecord | null {
  return LEDGER.artists.find((artist) => artist.isMasterProfile) ?? null;
}

/**
 * Lista los timbres de voz disponibles de un artista.
 */
export function listVoiceProfiles(artistId: string): ArtistVoiceProfile[] {
  return getArtistByIdentifier(artistId)?.voiceProfiles ?? [];
}

/**
 * Lista los releases de un artista.
 */
export function listReleases(artistId: string): ArtistRelease[] {
  return getArtistByIdentifier(artistId)?.catalog ?? [];
}

/**
 * Asigna ISRC y UPC al release según el registrante del artista.
 */
export function assignSovereignCodes(
  artist: ArtistRecord,
  release: ArtistRelease
): ArtistRelease {
  const baseRelease = {
    ...release,
    artist: artist.displayName,
    language: "es-ES",
  };

  return {
    ...release,
    isrc: release.isrc || generateSovereignISRC(baseRelease),
    upc: release.upc || generateSovereignUPC(baseRelease),
  };
}

/**
 * Vista agregada del catálogo soberano para consolas de administración.
 */
export function getCatalogSummary() {
  const artists = listArtists();
  return {
    totalArtists: artists.length,
    totalReleases: artists.reduce((sum, artist) => sum + artist.catalog.length, 0),
    totalVoiceProfiles: artists.reduce((sum, artist) => sum + artist.voiceProfiles.length, 0),
    splitSovereign: LEDGER.splitSovereign,
    masterArtist: getMasterArtist(),
    artists,
  };
}
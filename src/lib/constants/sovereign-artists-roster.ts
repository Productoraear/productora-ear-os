/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — ROSTER SOBERANO DE ARTISTAS DIAMANTE ROJO
 * ════════════════════════════════════════════════════════════════════════════
 * Catálogo canónico para artistaseuropa.com y /artistas.
 * Extraído fuera de archivos 'use client' para compatibilidad total con RSC / SSR.
 */

import { TARIFA_BASE_SOLISTA_EUR } from "@/lib/constants/ear-os-ssot";

export type SovereignArtistId =
  | "edwin-agudelo"
  | "trio-aurora"
  | "cuarteto-ebano";

export interface SovereignArtistItem {
  readonly id: SovereignArtistId;
  readonly name: string;
  readonly role: string;
  readonly basePrice: number;
  readonly rating: number;
  readonly reviews: number;
  readonly genres: readonly string[];
  readonly signature: string;
  readonly image: string;
  readonly audioSample: string;
  readonly verified: boolean;
}

export const SOVEREIGN_ARTISTS_ROSTER: readonly SovereignArtistItem[] = [
  {
    id: "edwin-agudelo",
    name: "Edwin Agudelo",
    role: "Tenor lírico y popular · Tenor #1 del catálogo",
    basePrice: TARIFA_BASE_SOLISTA_EUR,
    rating: 5,
    reviews: 128,
    genres: ["Rancheras de gala", "Boleros S-Class", "Baladas"],
    signature:
      "25 años de oficio en escena, 37 macroconciertos internacionales y fundador de Productora EAR y VIMUME.",
    image: "https://productoraear.com/images/brand/ear_logo_official_diamond.png",
    audioSample: "/audio/edwin-agudelo-sample.mp3",
    verified: true,
  },
  {
    id: "trio-aurora",
    name: "Trío Aurora",
    role: "Ensemble de cuerda y voz · Gala nupcial",
    basePrice: 600,
    rating: 4.9,
    reviews: 74,
    genres: ["Clásico de gala", "Cóctel", "Ceremonial"],
    signature:
      "Armonía de cuerdas y voz para ceremonias, cócteles y recepciones de alta exigencia acústica.",
    image: "https://productoraear.com/images/brand/ear_logo_official_diamond.png",
    audioSample: "/audio/trio-aurora-sample.mp3",
    verified: true,
  },
  {
    id: "cuarteto-ebano",
    name: "Cuarteto Ébano",
    role: "Formación de viento-madera y percusión",
    basePrice: 900,
    rating: 4.8,
    reviews: 51,
    genres: ["Jazz selecto", "Soul", "Versiones orquestadas"],
    signature:
      "Timbre aterciopelado para veladas corporativas, embajadas y celebraciones íntimas S-Class.",
    image: "https://productoraear.com/images/brand/ear_logo_official_diamond.png",
    audioSample: "/audio/cuarteto-ebano-sample.mp3",
    verified: true,
  },
];

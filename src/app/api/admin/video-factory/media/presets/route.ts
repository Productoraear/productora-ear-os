import { NextResponse } from "next/server";

export interface StockMediaAsset {
  id: string;
  name: string;
  category: "b-roll" | "background" | "soundtrack" | "sfx";
  url: string;
  duration?: number;
  previewColor?: string;
  description: string;
}

export const STOCK_MEDIA_LIBRARY: StockMediaAsset[] = [
  // B-ROLL FOOTAGE & CINEMATIC BACKGROUNDS
  {
    id: "broll-piano-gala",
    name: "Piano de Cola & Iluminación Ámbar",
    category: "b-roll",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 15,
    previewColor: "#ecb613",
    description: "Plano cinematográfico con iluminación cálida y ambiente de sala de conciertos.",
  },
  {
    id: "broll-concert-crowd",
    name: "Público & Ovación en Vivo",
    category: "b-roll",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 15,
    previewColor: "#00E5FF",
    description: "Gran escena de aplausos y emoción en directo.",
  },
  {
    id: "broll-luxury-wedding",
    name: "Finca de Gala & Cóctel VIP",
    category: "b-roll",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: 15,
    previewColor: "#FF2B44",
    description: "Espacios de alta gama para bodas exclusivas y eventos corporativos.",
  },
  {
    id: "broll-abstract-waves",
    name: "Ondas Acústicas 40Hz (VIMUME)",
    category: "background",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    duration: 15,
    previewColor: "#10b981",
    description: "Visualización de bio-frecuencias armónicas y ondas cerebrales.",
  },
  {
    id: "broll-cyber-lights",
    name: "Focos Escénicos & Anamorphic Flares",
    category: "background",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    duration: 15,
    previewColor: "#9333ea",
    description: "Haces de luz volumétrica y flare anamórfico 35mm.",
  },

  // SOUNDTRACKS (MÚSICA DE FONDO)
  {
    id: "track-gala-piano",
    name: "Edwin Agudelo — Solo Piano Gala S-Class",
    category: "soundtrack",
    url: "https://actions.google.com/sounds/v1/ambiences/theatre_crowd_applause.ogg",
    duration: 30,
    previewColor: "#ecb613",
    description: "Interpretación virtuosa acústica con armónicos cálidos.",
  },
  {
    id: "track-cinematic-epic",
    name: "Epic Orchestral Rise (Clímax de Venta)",
    category: "soundtrack",
    url: "https://actions.google.com/sounds/v1/sports/baseball_stadium_organ_cheer.ogg",
    duration: 20,
    previewColor: "#FF2B44",
    description: "Crescendo sinfónico con percusión híbrida de alto impacto.",
  },
  {
    id: "track-vimume-40hz",
    name: "VIMUME Protocolo 40Hz Gamma",
    category: "soundtrack",
    url: "https://actions.google.com/sounds/v1/science_fiction/teleport_whoosh.ogg",
    duration: 45,
    previewColor: "#10b981",
    description: "Frecuencia terapéutica de neuromodulación no invasiva.",
  },

  // SFX (TRANSICIONES & IMPACTOS)
  {
    id: "sfx-whoosh-cinematic",
    name: "Cinematic Transition Whoosh",
    category: "sfx",
    url: "https://actions.google.com/sounds/v1/science_fiction/space_warp_burst.ogg",
    duration: 1.5,
    previewColor: "#00E5FF",
    description: "Transición rápida de barrido con baja frecuencia.",
  },
  {
    id: "sfx-sub-drop",
    name: "Sub Bass Hit Impact",
    category: "sfx",
    url: "https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg",
    duration: 2,
    previewColor: "#ecb613",
    description: "Impacto seco en graves para resaltar textos clave.",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    assets: STOCK_MEDIA_LIBRARY,
  });
}

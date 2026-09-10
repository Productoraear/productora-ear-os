import { StageFormatType, VenueType } from '@/components/stage/StageVisualizer3D';

export interface GalaFormatOption {
  id: StageFormatType;
  name: string;
  basePrice: number;
  musiciansCount: number;
  tagline: string;
}

export const GALA_FORMATS: GalaFormatOption[] = [
  { id: 'solista', name: 'Edwin Agudelo Solista', basePrice: 350, musiciansCount: 1, tagline: 'Voz Tenor Lírico + Pistas de Alta Fidelidad' },
  { id: 'duo', name: 'Dúo Armónico', basePrice: 480, musiciansCount: 2, tagline: 'Edwin Agudelo + Vihuela / Guitarra' },
  { id: 'trio', name: 'Trío Tradicional', basePrice: 600, musiciansCount: 3, tagline: 'Edwin Agudelo + Vihuela + Guitarrón' },
  { id: 'cuarteto', name: 'Cuarteto de Gala', basePrice: 750, musiciansCount: 4, tagline: 'Voz + Trompeta + Vihuela + Guitarrón' },
  { id: 'quinteto', name: 'Quinteto Imperial', basePrice: 900, musiciansCount: 5, tagline: 'Voz + 2 Trompetas + Vihuela + Guitarrón' },
  { id: 'imperial', name: 'Gran Ensamble Imperial', basePrice: 1400, musiciansCount: 8, tagline: 'Formación Completa de Gala con Violines y Bronces' }
];

export const VENUES: { id: VenueType; name: string; isVimume?: boolean }[] = [
  { id: 'SALON_BODA', name: 'Salón de Bodas / Restaurante' },
  { id: 'FINCA_EXTERIOR', name: 'Finca / Jardín Exterior' },
  { id: 'IGLESIA', name: 'Iglesia / Ceremonia Religiosa' },
  { id: 'RESIDENCIA_MAYORES', name: 'Residencia de Mayores (VIMUME)', isVimume: true },
  { id: 'PLAZA_PUBLICA', name: 'Plaza Pública / Escenario Municipal' }
];

export type OccasionCategory =
  | 'cumpleanos'
  | 'aniversario'
  | 'boda_votos'
  | 'boda_baile'
  | 'bodas_oro_plata'
  | 'pedida_mano'
  | 'jubilacion'
  | 'homenaje_padres'
  | 'in_memoriam'
  | 'agradecimiento';

export type MusicalGenre =
  | 'ranchera'
  | 'bolero'
  | 'balada'
  | 'crossover_lirico'
  | 'pop_acustico'
  | 'vals_matrimonial'
  | 'rumba_fiesta';

export type EmotionalTone =
  | 'lagrimas_emocion'
  | 'intimo_profundo'
  | 'festivo_alegre'
  | 'epico_triunfal';

export interface DigitalProductOrder {
  id: string;
  ocasion: OccasionCategory;
  genero: MusicalGenre;
  tono: EmotionalTone;
  protagonista: string;
  quienRegala: string;
  detallesEmocionales: string;
  videoUpsell: boolean;
  expressUpsell: boolean;
  karaokeUpsell: boolean;
  precioTotal: number;
  estadoProduccion: 'pendiente_pago' | 'en_produccion' | 'entregado';
  createdAt: string;
}

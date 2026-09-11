export interface DigitalProductOrder {
  id: string;
  tituloOcasion: string;
  generoMusical: 'ranchera' | 'bolero' | 'balada' | 'crossover';
  destinatario: string;
  instruccionesEmocionales: string;
  precio: number;
  estadoProduccion: 'pendiente_pago' | 'en_produccion' | 'completado';
  createdAt: string;
}
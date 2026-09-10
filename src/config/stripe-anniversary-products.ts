export interface AnniversaryProduct {
  id: string;
  name: string;
  price: number;
  currency: 'EUR';
  description: string;
  stripePriceId: string;
  features: string[];
}

export const ANNIVERSARY_CATALOG: AnniversaryProduct[] = [
  {
    id: 'prod_aniversario_tenor',
    name: 'Serenata Privada Tenor // Voz & Cuerda S-Class',
    price: 650,
    currency: 'EUR',
    description: 'Intervención sorpresa acústica de alta emoción. Voz tenor en directo con microfonía Shure y repertorio a la carta.',
    stripePriceId: 'price_aniversario_tenor_650',
    features: [
      '30 minutos de concierto privado exclusivo',
      'Repertorio personalizado (Boleros, Baladas románticas, Canción lírica)',
      'Equipo autónomo a batería (sin cables, apto jardín o terraza)',
      'Coordinación secreta 100% invisible para la pareja'
    ]
  },
  {
    id: 'prod_aniversario_mariachi',
    name: 'Serenata Mariachi Boutique // Trío Imperial',
    price: 950,
    currency: 'EUR',
    description: 'Impacto visual y acústico inigualable. Trajes de gala, violín, vihuela y voz solista tenor para una sorpresa monumental.',
    stripePriceId: 'price_aniversario_mariachi_950',
    features: [
      '45 minutos de serenata clásica mexicana y boleros rancheros',
      'Trío de músicos con indumentaria tradicional impecable',
      'Despliegue Km 0 desde Hub Central en Méntrida',
      'Grabación de audio de sala en directo de recuerdo'
    ]
  }
];

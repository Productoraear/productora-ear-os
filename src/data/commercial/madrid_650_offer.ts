export interface PrivateGigaOffer {
  id: string;
  titulo: string;
  zona: string;
  minimoMusicos: number;
  precioBruto: number;
  costeOperativo: number;
  margenNeto: number;
  descripcion: string;
}

export const MADRID_PRIVATE_OFFER_650: PrivateGigaOffer = {
  id: 'madrid-650-5musicos',
  titulo: 'Bolo Exclusivo Particulares — Madrid Capital (Formato 5 Músicos)',
  zona: 'Madrid Capital y Radio 30km',
  minimoMusicos: 5,
  precioBruto: 650.0,
  costeOperativo: 480.0,
  margenNeto: 170.0,
  descripcion: 'Actuación en directo de alta gama con banda de 5 músicos y sonorización profesional integrada (XR18/Bose). Margen operativo optimizado para caja rápida.'
};

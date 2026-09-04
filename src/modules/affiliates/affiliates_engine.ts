export interface AffiliateTier {
  id: string;
  nombre: string;
  porcentajeComision: number; // Porcentaje sobre la base neta
  requisitoMinimoVentas: number;
}

export interface AffiliatePartner {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  codigoReferido: string;
  rangoId: string;
  totalVentasGeneradas: number;
  comisionesAcumuladas: number;
  activo: boolean;
}

export const AFFILIATE_TIERS: AffiliateTier[] = [
  { id: 'tier-1', nombre: 'Bronce (Partner Inicial)', porcentajeComision: 8.0, requisitoMinimoVentas: 0 },
  { id: 'tier-2', nombre: 'Plata (Comercial Activo)', porcentajeComision: 12.0, requisitoMinimoVentas: 3 },
  { id: 'tier-3', nombre: 'Oro (Embajador Institucional)', porcentajeComision: 15.0, requisitoMinimoVentas: 8 },
  { id: 'tier-4', nombre: 'Platino (Elite Magnates NDA)', porcentajeComision: 20.0, requisitoMinimoVentas: 15 }
];

export function calcularComisionAfiliado(montoBruto: number, tierId: string): { comision: number; netoPlataforma: number } {
  const tier = AFFILIATE_TIERS.find(t => t.id === tierId) || AFFILIATE_TIERS[0];
  const comision = (montoBruto * tier.porcentajeComision) / 100;
  const netoPlataforma = montoBruto - comision;
  return {
    comision: Math.round(comision * 100) / 100,
    netoPlataforma: Math.round(netoPlataforma * 100) / 100
  };
}

export const MOCK_AFFILIATES: AffiliatePartner[] = [
  {
    id: 'aff-01',
    nombre: 'Carlos Mendoza (Booking Madrid)',
    email: 'carlos.mendoza@productoraear.es',
    telefono: '+34 611 223 344',
    codigoReferido: 'MADRID650-CARLOS',
    rangoId: 'tier-2',
    totalVentasGeneradas: 5,
    comisionesAcumuladas: 390.0,
    activo: true
  },
  {
    id: 'aff-02',
    nombre: 'Valeria Sotomayor (Eventos Luxury)',
    email: 'valeria@luxuryevents.es',
    telefono: '+34 622 334 455',
    codigoReferido: 'NDA-VALERIA',
    rangoId: 'tier-4',
    totalVentasGeneradas: 12,
    comisionesAcumuladas: 2880.0,
    activo: true
  }
];

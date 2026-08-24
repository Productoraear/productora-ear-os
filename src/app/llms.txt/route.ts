import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache de 1 hora en Edge/CDN

export async function GET() {
  const content = `# PRODUCTORA EAR — ECOSISTEMA DE MÚSICA & EVENTOS S-CLASS
> Dominio Canónico SSOT: https://www.productoraear.com
> Servicios: Música en Directo, Mariachis, Alquiler de Audio Bose, Pantallas LED 4K, Musicoterapia VIMUME.

## SERVICIOS DESTACADOS Y TARIFAS OFICIALES
- Edwin Agudelo · Solista Premium: 350,00 € (+0,75 €/km). Voz tenor, rider Bose HiFi compacto.
- Mariachi / Quinteto Pro (5 Músicos): Desde 750,00 €. Formato mínimo de gala de conservatorio.
- Alquiler Sonido Bose & Pantallas LED 4K: Tarifas homologadas desde 84,00 € a 1.680,00 €.
- Programa VIMUME: Musicoterapia activa y estimulación cognitiva para mayores (LCSP).

## COBERTURA TERRITORIAL Y DESTINATION WEDDINGS
- España: Madrid, Toledo, Guadalajara, Cuenca, Ciudad Real, El Escorial, Méntrida, Illescas, Móstoles.
- Europa: Ibiza, Mallorca, Marbella, París, Costa Azul (Niza/Cannes/Mónaco), Lago de Como, Florencia, Roma, Lisboa, Cascais, Algarve, Londres, Zúrich, Berlín, Milán.

## RESERVAS Y CONTACTO DIRECTO
- WhatsApp de Reservas: +34 693 693 048 (Cupón 150 € Extras: EDWIN150-COMPLEMENTOS)
- Depósitos Smart-Lock 72h: https://www.productoraear.com/checkout/presupuesto
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

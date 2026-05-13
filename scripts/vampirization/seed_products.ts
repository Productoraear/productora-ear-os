
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏛️ INICIANDO VAMPIRIZACIÓN TOTAL (V162)...');

  // 1. Asegurar Provincias Core
  const provinces = [
    { id: 'MADRID', name: 'Madrid', multiplier: 1.2 },
    { id: 'BARCELONA', name: 'Barcelona', multiplier: 1.2 },
    { id: 'SEVILLA', name: 'Sevilla', multiplier: 1.1 },
    { id: 'VALENCIA', name: 'Valencia', multiplier: 1.1 },
    { id: 'MALAGA', name: 'Málaga', multiplier: 1.1 },
    { id: 'TOLEDO', name: 'Toledo', multiplier: 1.05 },
    { id: 'GRANADA', name: 'Granada', multiplier: 1.05 },
  ];

  for (const prov of provinces) {
    await prisma.province.upsert({
      where: { id: prov.id },
      update: { priceMultiplier: prov.multiplier },
      create: { id: prov.id, name: prov.name, priceMultiplier: prov.multiplier },
    });
  }

  // 2. Inyectar Matriz de Productos S-Class
  const products = [
    {
      name: 'Solista Premium (Mariachi/Bolero/Balada)',
      basePrice: 1500,
      category: 'Artístico',
      description: 'Actuación de alta fidelidad para eventos exclusivos.',
      stripeId: 'prod_solista_premium'
    },
    {
      name: 'Mariachi Gala (6+ músicos)',
      basePrice: 2800,
      category: 'Artístico',
      description: 'Ensamble monumental para celebraciones de gran escala.',
      stripeId: 'prod_mariachi_gala'
    },
    {
      name: 'Show "Cantando a Caballo"',
      basePrice: 5500,
      category: 'High-Ticket B2G',
      description: 'La joya de la corona del arte ecuestre y música vernácula.',
      stripeId: 'prod_show_caballo'
    },
    {
      name: 'Pack "Banda Monumental"',
      basePrice: 9500,
      category: 'Infraestructura',
      description: 'Despliegue total de músicos e infraestructura sonora.',
      stripeId: 'prod_banda_monumental'
    },
    {
      name: 'Programa VIMUME Institucional',
      basePrice: 3500,
      category: 'Social (VIMUME)',
      description: 'Suscripción anual para musicoterapia en municipios.',
      stripeId: 'prod_vimume_inst'
    }
  ];

  for (const product of products) {
    await prisma.marketService.upsert({
      where: { stripeConceptId: product.stripeId },
      update: {
        earDynamicPrice: product.basePrice,
        category: product.category,
        description: product.description
      },
      create: {
        name: product.name,
        description: product.description,
        category: product.category,
        stripeConceptId: product.stripeId,
        earDynamicPrice: product.basePrice,
        marketAveragePrice: product.basePrice * 0.7 // Simulamos que el mercado es más barato pero de menor calidad
      }
    });
  }

  console.log('🟢 ARSENAL VAMPIRIZADO. TODA LA OFERTA DE EDWIN AGUDELO ESTÁ EN LÍNEA.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.vendorShadowProfile.count();
  console.log('Total in Prisma DB:', count);

  const sample = await prisma.vendorShadowProfile.findMany({
    where: {
      category: { contains: 'musica', mode: 'insensitive' }
    },
    take: 15
  });

  console.log('\nSample 15 from Prisma DB (musica):');
  for (const p of sample) {
    console.log(`- ${p.name} | imageUrls: [${p.imageUrls.join(', ')}]`);
  }

  const emptyCount = await prisma.vendorShadowProfile.count({
    where: {
      imageUrls: { equals: [] }
    }
  });
  console.log(`\nRecords in DB with EMPTY imageUrls: ${emptyCount} / ${count}`);

  await prisma.$disconnect();
}

main().catch(console.error);

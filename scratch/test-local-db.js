const { PrismaClient } = require('@prisma/client');

async function testLocal() {
  console.log("Testing connection to LOCAL database...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:postgres@localhost:5432/postgres"
      }
    }
  });

  try {
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("✅ Local DB Succeeded! Query result:", res);

    const providerCount = await prisma.providerProfile.count();
    console.log(`📊 ProviderProfile count in local DB: ${providerCount}`);

    if (providerCount > 0) {
      const providers = await prisma.providerProfile.findMany({
        take: 3,
        select: { id: true, name: true, stripeAccountId: true, isVerified: true }
      });
      console.log("🔍 Top Providers in local DB:", providers);
    }
  } catch (err) {
    console.error("❌ Local DB Failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLocal();

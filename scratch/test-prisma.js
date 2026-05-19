const { PrismaClient } = require('@prisma/client');

async function testPrismaConnection(url, label) {
  console.log(`\nTesting: ${label}`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });
  
  try {
    const startTime = Date.now();
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    console.log(`✅ Success! Result:`, res);
    console.log(`⏱️ Latency: ${Date.now() - startTime}ms`);
    await prisma.$disconnect();
    return true;
  } catch (err) {
    console.error(`❌ Failed:`, err.message);
    await prisma.$disconnect();
    return false;
  }
}

async function run() {
  const url1 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024EarMaster!@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const url2 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024Ear*@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";
  const url3 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024EarMaster!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";
  const url4 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024Ear*@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";
  
  await testPrismaConnection(url1, "URL 1 (.env.production - west-1, Ear2024EarMaster!)");
  await testPrismaConnection(url2, "URL 2 (.env.local comment - central-1, Ear2024Ear*)");
  await testPrismaConnection(url3, "URL 3 (central-1, Ear2024EarMaster!)");
  await testPrismaConnection(url4, "URL 4 (west-1, Ear2024Ear*)");
}

run();

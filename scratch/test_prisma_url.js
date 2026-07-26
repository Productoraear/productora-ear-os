const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear"024Ear*@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ SUCCESS: Connect successful with raw double quote!');
    const res = await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Query success:', res);
  } catch (err) {
    console.error('❌ FAILED connection:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { runIngestion } from './vampire-parser_eff953';
import { prisma } from '@/lib/prisma';

async function main() {
  try {
    const result = await runIngestion();
    console.log("-----------------------------------------");
    console.log("🟢 VAMPIRE RUNNER: SUCCESSFUL INGESTION");
    console.log(`Providers Ingested: ${result.providersCount}`);
    console.log(`Artists Ingested: ${result.artistsCount}`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ VAMPIRE RUNNER: TRANSACTION FAILED", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

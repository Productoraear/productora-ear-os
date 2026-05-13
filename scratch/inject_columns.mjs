import pkg from 'postgres';
const postgres = pkg;

const sql = postgres({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  username: 'postgres.ocrjsvjmdeqovkfdqoql',
  password: 'Ear2024EarMaster!',
  ssl: 'require',
  connection: {
    application_name: 'prisma'
  }
});

async function run() {
  try {
    await sql`
      ALTER TABLE ear_market_vendors 
      ADD COLUMN IF NOT EXISTS "auraLevel" DOUBLE PRECISION DEFAULT 0.0,
      ADD COLUMN IF NOT EXISTS "roiProjected" DOUBLE PRECISION DEFAULT 0.0,
      ADD COLUMN IF NOT EXISTS "technicalReliability" DOUBLE PRECISION DEFAULT 0.0,
      ADD COLUMN IF NOT EXISTS "roi_guarantee_score" DOUBLE PRECISION DEFAULT 0.0
    `;
    console.log("Columnas S-Class inyectadas con éxito en ear_market_vendors.");
  } catch (error) {
    console.error("Error inyectando columnas:", error);
  } finally {
    await sql.end();
  }
}

run();

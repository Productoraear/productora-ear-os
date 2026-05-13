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
    // Primero intentamos borrar duplicados por si acaso
    await sql`
      DELETE FROM ear_market_vendors a USING ear_market_vendors b
      WHERE a.ctid < b.ctid AND a.name = b.name
    `;
    
    await sql`
      ALTER TABLE ear_market_vendors 
      ADD CONSTRAINT ear_market_vendors_name_key UNIQUE (name)
    `;
    console.log("Restricción UNIQUE inyectada con éxito.");
  } catch (error) {
    console.error("Error inyectando restricción:", error);
  } finally {
    await sql.end();
  }
}

run();

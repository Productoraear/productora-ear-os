import pkg from 'postgres';
const postgres = pkg;

const sql = postgres({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  username: 'postgres.ocrjsvjmdeqovkfdqoql',
  password: 'Ear2024EarMaster!',
  ssl: 'require'
});

async function test() {
  try {
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tablas encontradas:", result.map(t => t.table_name));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sql.end();
  }
}

test();

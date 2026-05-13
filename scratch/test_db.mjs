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

async function test() {
  try {
    const result = await sql`SELECT id, name FROM ear_market_vendors LIMIT 1`;
    console.log("Nodo de prueba encontrado:", result[0]);
  } catch (error) {
    console.error("Error de conexión:", error);
  } finally {
    await sql.end();
  }
}

test();

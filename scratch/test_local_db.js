const postgres = require('postgres');

async function testLocal() {
  const url = 'postgresql://postgres:postgres@localhost:5432/postgres';
  try {
    const sql = postgres(url, { connect_timeout: 2 });
    await sql`SELECT 1`;
    console.log('✅ SUCCESS: Local Postgres is running!');
    await sql.end();
  } catch (err) {
    console.log('❌ FAILED: Local Postgres is not running:', err.message);
  }
}

testLocal();

const postgres = require('postgres');

const urls = [
  "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024EarMaster!@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024EarMaster!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024Ear*@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
  "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024Ear*@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
];

async function testUrl(url) {
  const urlObj = new URL(url);
  console.log(`Testing host: ${urlObj.host} with user: ${urlObj.username} and pass ending with: ...${urlObj.password.slice(-3)}`);
  try {
    const sql = postgres(url, { connect_timeout: 5 });
    const res = await sql`SELECT 1`;
    console.log(`✅ SUCCESS for ${urlObj.host}`);
    await sql.end();
    return true;
  } catch (err) {
    console.log(`❌ FAILED for ${urlObj.host}: ${err.message}`);
    return false;
  }
}

async function run() {
  for (const url of urls) {
    await testUrl(url);
  }
}

run();

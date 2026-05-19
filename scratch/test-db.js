const { Client } = require('pg');

async function testConnection(url, label) {
  const client = new Client({ connectionString: url });
  try {
    console.log(`Testing ${label}...`);
    await client.connect();
    const res = await client.query('SELECT 1 as result');
    console.log(`✅ ${label} Succeeded! Result:`, res.rows[0]);
    await client.end();
    return true;
  } catch (err) {
    console.error(`❌ ${label} Failed:`, err.message);
    try { await client.end(); } catch (e) {}
    return false;
  }
}

async function run() {
  const url1 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024EarMaster!@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const url2 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024Ear*@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";
  const url3 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024EarMaster!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";
  const url4 = "postgresql://postgres.ocrjsvjmdeqovkfdqoql:Ear2024Ear*@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";
  
  await testConnection(url1, "URL 1 (.env.production - west-1, Ear2024EarMaster!)");
  await testConnection(url2, "URL 2 (.env.local comment - central-1, Ear2024Ear*)");
  await testConnection(url3, "URL 3 (central-1, Ear2024EarMaster!)");
  await testConnection(url4, "URL 4 (west-1, Ear2024Ear*)");
}

run();

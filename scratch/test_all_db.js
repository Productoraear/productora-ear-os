const postgres = require('postgres');

const host = 'aws-0-eu-west-1.pooler.supabase.com:5432';
const baseUser = 'postgres.ocrjsvjmdeqovkfdqoql';

const passwords = [
  'Ear2024Ear*',
  'Ear"024Ear*',
  'Ear2024EarMaster!',
  'Ear2024Ear'
];

async function testPassword(pwd) {
  const encodedPwd = encodeURIComponent(pwd);
  const url = `postgresql://${baseUser}:${encodedPwd}@${host}/postgres`;
  try {
    const sql = postgres(url, { connect_timeout: 4 });
    await sql`SELECT 1`;
    console.log(`✅ SUCCESS: Direct 5432 works with User: [${baseUser}] and Password: [${pwd}]`);
    await sql.end();
    return true;
  } catch (err) {
    console.log(`❌ FAILED for [${pwd}]: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log(`Testing direct port 5432 connections with tenant username...`);
  for (const pwd of passwords) {
    await testPassword(pwd);
  }
}

run();

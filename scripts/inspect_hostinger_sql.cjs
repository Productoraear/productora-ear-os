const fs = require('fs');
const readline = require('readline');

async function inspectSql() {
  const fileStream = fs.createReadStream('c:\\Users\\Productora Ear\\Downloads\\u330468433_3EHTs.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const tables = new Set();
  let postTypes = {};
  let totalPosts = 0;
  let sampleTitles = [];

  for await (const line of rl) {
    if (line.startsWith('CREATE TABLE')) {
      const match = line.match(/CREATE TABLE [`'"]?([^`'"\s]+)[`'"]?/i);
      if (match) tables.add(match[1]);
    }
    if (line.includes("INSERT INTO") && line.includes("posts`")) {
      // rough match
    }
  }

  console.log('Found tables:', Array.from(tables));
}

inspectSql().catch(console.error);


const fs = require('fs');
const readline = require('readline');

async function extractAllPosts() {
  const fileStream = fs.createReadStream('c:\\Users\\Productora Ear\\Downloads\\u330468433_3EHTs.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const outStream = fs.createWriteStream('public/data/wp_posts_all.sql', { encoding: 'utf8' });
  let inTargetTable = false;
  let count = 0;

  for await (const line of rl) {
    if (line.includes('INSERT INTO `wp_posts`') || line.includes('INSERT INTO wp_posts')) {
      inTargetTable = true;
      outStream.write(line + '\n');
      count++;
    } else if (inTargetTable) {
      if (line.startsWith('INSERT INTO `wp_') && !line.includes('`wp_posts`')) {
        inTargetTable = false;
      } else if (line.startsWith('UNLOCK TABLES') || line.startsWith('CREATE TABLE')) {
        inTargetTable = false;
      } else {
        outStream.write(line + '\n');
      }
    }
  }

  outStream.end();
  console.log('Finished. Insert statements captured:', count);
}

extractAllPosts().catch(console.error);


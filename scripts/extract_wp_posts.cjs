const fs = require('fs');
const readline = require('readline');

async function extractPosts() {
  const fileStream = fs.createReadStream('c:\\Users\\Productora Ear\\Downloads\\u330468433_3EHTs.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let inPosts = false;
  let inQuizQuestions = false;
  let inQuizAnswers = false;

  const posts = [];
  const quizQuestions = [];
  const quizAnswers = [];

  let sqlBuffer = '';

  for await (const line of rl) {
    if (line.includes('INSERT INTO `wp_posts`')) {
      inPosts = true;
      sqlBuffer = line;
    } else if (inPosts) {
      if (line.startsWith('INSERT INTO') || line.startsWith('UNLOCK TABLES') || line.startsWith('CREATE TABLE')) {
        inPosts = false;
      } else {
        sqlBuffer += ' ' + line;
      }
    }
  }

  console.log('Finished reading posts buffer. Buffer length:', sqlBuffer.length);

  // Parse SQL INSERT values
  // A simple regex or state machine to extract values
  // Let's write the raw posts buffer to a temporary file or analyze it
  fs.writeFileSync('public/data/wp_posts_raw.sql', sqlBuffer);
  console.log('Saved wp_posts_raw.sql');
}

extractPosts().catch(console.error);


const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('c:/Users/Productora Ear/Downloads/u330468433_3EHTs.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const lessons = [];

  for await (const line of rl) {
    if (line.includes('INSERT INTO `wp_posts`')) {
      // Find where VALUES starts
      const valuesIdx = line.indexOf('VALUES');
      if (valuesIdx === -1) continue;

      let idx = valuesIdx + 6;
      while (idx < line.length) {
        const startParen = line.indexOf('(', idx);
        if (startParen === -1) break;

        let pos = startParen + 1;
        let inQuote = false;
        let escaped = false;
        const tokens = [];
        let curToken = '';

        while (pos < line.length) {
          const char = line[pos];
          if (escaped) {
            curToken += char;
            escaped = false;
          } else if (char === '\\') {
            escaped = true;
          } else if (char === "'") {
            inQuote = !inQuote;
          } else if (char === ',' && !inQuote) {
            tokens.push(curToken.trim());
            curToken = '';
          } else if (char === ')' && !inQuote) {
            tokens.push(curToken.trim());
            pos++;
            break;
          } else {
            curToken += char;
          }
          pos++;
        }

        idx = pos;

        if (tokens.length >= 21) {
          const id = tokens[0];
          const postContent = tokens[4].replace(/^'|'$/g, '');
          const postTitle = tokens[5].replace(/^'|'$/g, '');
          const postExcerpt = tokens[6].replace(/^'|'$/g, '');
          const postStatus = tokens[7].replace(/^'|'$/g, '');
          const postType = tokens[20].replace(/^'|'$/g, '');

          // Check if this is a published course lesson, topic, or day
          if (postStatus === 'publish' || postType === 'topics' || postType === 'sfwd-lessons' || postType === 'sfwd-courses') {
            lessons.push({
              id,
              title: postTitle,
              type: postType,
              status: postStatus,
              excerpt: postExcerpt.slice(0, 300),
              contentLength: postContent.length,
              fullContent: postContent
            });
          }
        }
      }
    }
  }

  console.log(`Total items extracted: ${lessons.length}`);
  
  // Sort and process into days
  fs.writeFileSync('src/data/raw_wp_lessons_all.json', JSON.stringify(lessons, null, 2));
  console.log('Saved raw lessons to src/data/raw_wp_lessons_all.json');
}

extract().catch(console.error);


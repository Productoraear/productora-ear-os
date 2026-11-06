const fs = require('fs');
const readline = require('readline');

async function run() {
  const fileStream = fs.createReadStream('c:/Users/Productora Ear/Downloads/u330468433_3EHTs.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const posts = [];

  for await (const line of rl) {
    if (line.startsWith('INSERT INTO `wp_posts` VALUES')) {
      // Each tuple is like: (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)
      // We can use a tokenizer or regex for entries
      const regex = /\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'(.*?)',\s*'([^']*)',\s*'(.*?)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'(.*?)',\s*(\d+),\s*'([^']*)',\s*(\d+),\s*'([^']*)'/g;
      // Because post_content has escaped quotes \' we need a parser that respects \'
      let idx = 0;
      while (idx < line.length) {
        const startParen = line.indexOf('(', idx);
        if (startParen === -1) break;
        
        // Let's parse tokens within parentheses
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
          const postDate = tokens[2].replace(/^'|'$/g, '');
          const postContent = tokens[4].replace(/^'|'$/g, '');
          const postTitle = tokens[5].replace(/^'|'$/g, '');
          const postStatus = tokens[7].replace(/^'|'$/g, '');
          const postType = tokens[20].replace(/^'|'$/g, '');

          if (postStatus === 'publish' || postType === 'topics' || postType === 'sfwd-lessons' || postTitle.toLowerCase().includes('día') || postTitle.toLowerCase().includes('dia')) {
            posts.push({
              id,
              date: postDate,
              title: postTitle,
              type: postType,
              status: postStatus,
              contentLength: postContent.length,
              contentSnippet: postContent.slice(0, 300)
            });
          }
        }
      }
    }
  }

  console.log(`Parsed total posts of interest: ${posts.length}`);
  fs.writeFileSync('src/data/extracted_wp_posts_manifest.json', JSON.stringify(posts, null, 2));
  console.log('Saved manifest to src/data/extracted_wp_posts_manifest.json');
}

run().catch(console.error);

const fs = require('fs');
const readline = require('readline');

function cleanDiviContent(raw) {
  if (!raw) return '';
  let text = raw.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"');
  text = text.replace(/\[\/?et_pb_[^\]]*\]/g, ' ');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
  text = text.replace(/\s{2,}/g, ' ');
  text = text.replace(/\n\s*\n/g, '\n\n').trim();
  return text;
}

async function extractFullCurriculum() {
  console.log('Reading database dump...');
  const fileStream = fs.createReadStream('c:\\Users\\Productora Ear\\Downloads\\u330468433_3EHTs.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const targetIds = new Set([
    '10', '15', '20', '25', '30', '35', '39', '43', '47', '51',
    '55', '59', '63', '67', '71', '75', '80', '84', '88', '92',
    '96', '100', '104', '109', '113', '118', '123', '127', '131', '135',
    '141', '147', '152', '158', '162', '166', '171', '177', '183', '191',
    '195', '200', '209', '241', '256', '356', '381', '387', '392', '418'
  ]);

  const extractedDays = [];
  let currentSql = '';
  let inPosts = false;

  for await (const line of rl) {
    if (line.includes('INSERT INTO `wp_posts`') || line.includes('INSERT INTO wp_posts')) {
      inPosts = true;
      currentSql += ' ' + line;
    } else if (inPosts) {
      if (line.startsWith('INSERT INTO') || line.startsWith('UNLOCK TABLES') || line.startsWith('CREATE TABLE')) {
        inPosts = false;
      } else {
        currentSql += ' ' + line;
      }
    }
  }

  console.log('Finished reading SQL posts buffer. Parsing rows...');

  // Match rows pattern: (ID, author, date, date_gmt, content, title, ...)
  // We can use a regex to extract each row's ID, title, and content
  // Since MySQL dumps use ('...', '...', ...)
  const rowRegex = /\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'([^']*)'/g;
  
  let match;
  let count = 0;
  while ((match = rowRegex.exec(currentSql)) !== null) {
    const id = match[1];
    const post_content_raw = match[5];
    const post_title_raw = match[6];
    const post_status = match[8];

    if (targetIds.has(id) && post_status === 'publish') {
      const title = post_title_raw.replace(/\\'/g, "'").replace(/\\"/g, '"');
      const cleanContent = cleanDiviContent(post_content_raw);
      extractedDays.push({
        id,
        title,
        contentLength: cleanContent.length,
        summary: cleanContent.substring(0, 300) + '...',
        fullContent: cleanContent
      });
      count++;
    }
  }

  console.log('Extracted days count:', extractedDays.length);

  // Write structured JSON file
  fs.writeFileSync('src/data/programa-99-dias-curriculum.json', JSON.stringify(extractedDays, null, 2));
  console.log('Saved src/data/programa-99-dias-curriculum.json');
}

extractFullCurriculum().catch(console.error);


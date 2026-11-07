const fs = require('fs');
const readline = require('readline');

function cleanHtml(raw) {
  let text = raw.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"');
  // Strip style tags and script tags FIRST before removing HTML tags
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  // Strip divi shortcodes
  text = text.replace(/\[\/?et_pb_[^\]]*\]/g, ' ');
  // Strip html tags
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
  text = text.replace(/\s{2,}/g, ' ').trim();
  return text;
}

async function extractClean() {
  const fileStream = fs.createReadStream('c:\\Users\\Productora Ear\\Downloads\\u330468433_3EHTs.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const targetIds = new Set([
    '10', '15', '20', '25', '30', '35', '39', '43', '47', '51',
    '55', '59', '63', '67', '71', '75', '80', '84', '88', '92',
    '96', '100', '104', '109', '113', '118', '123', '127', '131', '135',
    '141', '147', '152', '158', '162', '166', '171', '177', '183', '191',
    '195', '200', '209', '241', '256', '356', '381', '387', '392', '418'
  ]);

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

  const rowRegex = /\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'([^']*)'/g;
  
  const days = [];
  let match;
  while ((match = rowRegex.exec(currentSql)) !== null) {
    const id = match[1];
    const post_content_raw = match[5];
    const post_title_raw = match[6];
    const post_status = match[8];

    if (targetIds.has(id) && post_status === 'publish') {
      const title = post_title_raw.replace(/\\'/g, "'").replace(/\\"/g, '"');
      const clean = cleanHtml(post_content_raw);
      
      // Determine day number and module name
      let dayNumber = 0;
      let displayTitle = title;
      if (id === '10') {
        dayNumber = 0;
        displayTitle = 'Introducción: Metodología 99 Días Haciendo Clic';
      } else if (id === '15') {
        dayNumber = 1;
        displayTitle = 'Día 1: El Punto de Partida - De Artista a Empresario';
      } else if (title.startsWith('Día ') || title.startsWith('día ')) {
        const numMatch = title.match(/Día\s*(\d+)/i);
        if (numMatch) dayNumber = parseInt(numMatch[1], 10);
      }

      // Extract first 3 key takeaways / objectives
      const paragraphs = clean.split('\n').filter(p => p.trim().length > 40);
      const excerpt = clean.substring(0, 260) + '...';

      days.push({
        id,
        dayNumber,
        title: displayTitle,
        originalTitle: title,
        contentLength: clean.length,
        excerpt,
        fullText: clean
      });
    }
  }

  days.sort((a, b) => a.dayNumber - b.dayNumber);
  console.log('Extracted cleanly parsed days count:', days.length);
  console.log('Sample Day 1 excerpt:', days.find(d => d.dayNumber === 1)?.excerpt);

  fs.writeFileSync('src/data/programa-99-dias-curriculum-clean.json', JSON.stringify(days, null, 2));
  console.log('Saved src/data/programa-99-dias-curriculum-clean.json');
}

extractClean().catch(console.error);


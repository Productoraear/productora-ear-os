const fs = require('fs');

// We need a robust parser for MySQL dump values: (val1, val2, ...), (val1, val2, ...)
// wp_posts schema columns:
// 0: ID
// 1: post_author
// 2: post_date
// 3: post_date_gmt
// 4: post_content
// 5: post_title
// 6: post_excerpt
// 7: post_status
// 8: comment_status
// 9: ping_status
// 10: post_password
// 11: post_name
// 12: to_ping
// 13: pinged
// 14: post_modified
// 15: post_modified_gmt
// 16: post_content_filtered
// 17: post_parent
// 18: guid
// 19: menu_order
// 20: post_type
// 21: post_mime_type
// 22: comment_count

const content = fs.readFileSync('public/data/wp_posts_all.sql', 'utf8');

function parseSqlValues(sqlText) {
  const records = [];
  let inString = false;
  let escape = false;
  let quoteChar = '';
  let currentVal = '';
  let currentRow = [];
  let inRow = false;

  for (let i = 0; i < sqlText.length; i++) {
    const ch = sqlText[i];

    if (inString) {
      if (escape) {
        currentVal += ch;
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === quoteChar) {
        inString = false;
      } else {
        currentVal += ch;
      }
    } else {
      if (ch === "'" || ch === '"') {
        inString = true;
        quoteChar = ch;
      } else if (ch === '(' && !inRow) {
        inRow = true;
        currentRow = [];
        currentVal = '';
      } else if (ch === ',' && inRow) {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if (ch === ')' && inRow) {
        currentRow.push(currentVal.trim());
        records.push(currentRow);
        currentRow = [];
        inRow = false;
      } else if (inRow) {
        currentVal += ch;
      }
    }
  }
  return records;
}

console.log('Starting parse of SQL values...');
const rows = parseSqlValues(content);
console.log('Parsed total rows:', rows.length);

const types = {};
const publishedDays = [];
const allLessons = [];

rows.forEach(r => {
  if (r.length < 21) return;
  const id = r[0];
  const post_content = r[4];
  const post_title = r[5];
  const post_status = r[7];
  const post_name = r[11];
  const post_type = r[20];

  types[post_type] = (types[post_type] || 0) + 1;

  if (post_title.toLowerCase().includes('d') || post_name.includes('dia-')) {
    publishedDays.push({ id, title: post_title, slug: post_name, type: post_type, status: post_status, len: post_content.length });
  }

  if (['lesson', 'courses', 'tutor_quiz', 'page', 'post'].includes(post_type) && post_status === 'publish') {
    allLessons.push({
      id,
      title: post_title,
      slug: post_name,
      type: post_type,
      contentLength: post_content.length,
      sample: post_content.substring(0, 120).replace(/\s+/g, ' ')
    });
  }
});

console.log('Post Types distribution:', types);
console.log('Sample matching days:', publishedDays.slice(0, 25));
console.log('Total published lessons/pages found:', allLessons.length);

fs.writeFileSync('public/data/extracted_lessons_summary.json', JSON.stringify({
  totalRows: rows.length,
  types,
  publishedLessonsCount: allLessons.length,
  lessons: allLessons
}, null, 2));

console.log('Saved public/data/extracted_lessons_summary.json');


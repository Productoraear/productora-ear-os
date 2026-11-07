const fs = require('fs');

// Read extracted_lessons_summary or parse wp_posts
// Let's create an extraction script that pulls the actual content of each day and cleans the Divi shortcodes!

function cleanDiviContent(raw) {
  if (!raw) return '';
  // Unescape MySQL string escapes
  let text = raw.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"');
  // Strip shortcodes
  text = text.replace(/\[\/?et_pb_[^\]]*\]/g, '\n');
  // Clean multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  return text;
}

// Let's test on Día 39 or Día 2
const testRaw = "[et_pb_section fb_built=\"1\"][et_pb_text]Hola Mundo. Esta es la lección del Día 2.[/et_pb_text][/et_pb_section]";
console.log('Cleaned:', cleanDiviContent(testRaw));


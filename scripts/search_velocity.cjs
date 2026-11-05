const fs = require("fs");
const path = require("path");

function searchPattern(dir, pattern) {
  try {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (f !== "node_modules" && f !== ".next" && f !== ".git") {
            searchPattern(full, pattern);
          }
        } else if (pattern.test(f)) {
          console.log("MATCH:", full);
        }
      } catch (err) {}
    }
  } catch (err) {}
}

console.log("=== BUSCANDO VELOCITY Y TRANSCRIPCIONES EN EL PROYECTO ===");
searchPattern(".", /velocity/i);
searchPattern("H:\\", /velocity/i);


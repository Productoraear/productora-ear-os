const fs = require("fs");
const path = require("path");

function searchFile(filePath) {
  const c = fs.readFileSync(filePath, "utf8");
  if (c.includes("grupo-6-mariachi")) {
    console.log("Encontrado en:", filePath);
    const lines = c.split("\n");
    lines.forEach((l, idx) => {
      if (l.includes("grupo-6-mariachi")) {
        console.log(`  Línea ${idx + 1}: ${l.trim()}`);
      }
    });
  }
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== "node_modules" && f !== ".next") walk(full);
    } else if (/\.(tsx|ts|json)$/.test(f)) {
      searchFile(full);
    }
  }
}

walk("src");


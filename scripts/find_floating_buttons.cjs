const fs = require("fs");
const path = require("path");

function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== "node_modules" && f !== ".next") search(full);
    } else if (/\.(tsx|ts|jsx|js)$/.test(f)) {
      const c = fs.readFileSync(full, "utf8");
      if (c.includes("Concierge Territorial") || c.includes("ATENCIÓN TELEFÓNICA")) {
        console.log(full);
      }
    }
  }
}
search("src");


const fs = require("fs");
const path = require("path");

function findUber(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    try {
      if (fs.statSync(full).isDirectory()) {
        if (f !== "node_modules" && f !== ".next" && f !== ".git") findUber(full);
      } else if (/\.(tsx|ts)$/.test(f)) {
        const c = fs.readFileSync(full, "utf8");
        if (c.includes("hungarianAlgorithm") || c.includes("mariachi-booking-hub") || c.includes("Uber")) {
          console.log("ENGINE:", full);
        }
      }
    } catch (e) {}
  }
}
findUber("src");


const fs = require("fs");
const c = fs.readFileSync("src/features/finance/ui/MultiPricer.tsx", "utf8");
const lines = c.split("\n");
lines.forEach((l, idx) => {
  if (l.includes("grupo-6-mariachi")) {
    console.log(`Línea ${idx + 1}: ${l.trim()}`);
  }
});


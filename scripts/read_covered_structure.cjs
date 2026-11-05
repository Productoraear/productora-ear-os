const fs = require("fs");
const d = JSON.parse(fs.readFileSync("reports/velocity_forensic_cross_match.json", "utf8"));
if (d.covered && d.covered.length > 0) {
  console.log("CLAVES DE ITEM 0:", Object.keys(d.covered[0]));
  console.log("ITEM 0 COMPLETO:", JSON.stringify(d.covered[0], null, 2));
}


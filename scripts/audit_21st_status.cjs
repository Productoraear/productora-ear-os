const fs = require("fs");

function readJsonReport(p) {
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, "utf8"));
      console.log(`\n=== REPORTE 21ST.DEV: ${p} ===`);
      console.log(JSON.stringify(data, null, 2).slice(0, 500));
    } catch(e) {
      console.log(`Error leyendo ${p}:`, e.message);
    }
  } else {
    console.log(`No existe ${p}`);
  }
}

readJsonReport(".antigravity/harvest_21st_log.json");

console.log("\n=== BUSCANDO SCRIPTS DE 21ST ===");
fs.readdirSync("scripts").forEach(f => {
  if (f.includes("21st")) console.log("Script encontrado:", f);
});


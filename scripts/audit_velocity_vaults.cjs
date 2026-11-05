const fs = require("fs");

function readJsonReport(p) {
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, "utf8"));
      console.log(`\n=== REPORTE: ${p} ===`);
      if (Array.isArray(data)) {
        console.log(`Items en array: ${data.length}`);
        console.log("Muestra item 0:", JSON.stringify(data[0]).slice(0, 150));
      } else {
        console.log("Claves:", Object.keys(data));
        console.log("Resumen:", JSON.stringify(data).slice(0, 300));
      }
    } catch(e) {
      console.log(`Error leyendo ${p}:`, e.message);
    }
  } else {
    console.log(`No existe ${p}`);
  }
}

readJsonReport("reports/velocity_local_perfect_inventory.json");
readJsonReport("reports/velocity_integrity_validation.json");
readJsonReport("reports/velocity_forensic_cross_match.json");


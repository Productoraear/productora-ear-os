const fs = require("fs");
const d = JSON.parse(fs.readFileSync("reports/velocity_media_master_catalog.json", "utf8"));
let sumClasses = 0;
d.forEach(item => {
  const m = (item.clases || "").match(/(\d+)/);
  if (m) sumClasses += parseInt(m[1], 10);
  console.log(`[${item.id}] ${item.title} -> ${item.clases || 'N/A'} (${item.duracion || 'N/A'}) - Cat: ${item.category}`);
});
console.log("\nSUMATORIA ESTIMADA DE CLASES / EPISODIOS INDIVIDUALES:", sumClasses);


const fs = require("fs");
const data = JSON.parse(fs.readFileSync("reports/velocity_media_master_catalog.json", "utf8"));
console.log("TOTAL PRODUCTOS EN CATALOGO VELOCITY:", data.length);
data.forEach((p, i) => {
  console.log(`${i+1}. ${p.title || p.name || p.id || JSON.stringify(p).slice(0, 40)}`);
});


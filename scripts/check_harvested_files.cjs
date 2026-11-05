const fs = require("fs");
const p = "src/components/harvested";
if (fs.existsSync(p)) {
  const files = fs.readdirSync(p);
  console.log(`TOTAL COMPONENTES COSECHADOS EN ${p}:`, files.length);
  files.forEach(f => console.log(" -", f));
} else {
  console.log(`No existe el directorio ${p}`);
}


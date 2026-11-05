const fs = require("fs");
const d = JSON.parse(fs.readFileSync("reports/velocity_media_master_catalog.json", "utf8"));
console.log("TOTAL CONTENEDORES/COLECCIONES (CURSOS/SERIES):", d.length);
console.log("EJEMPLO DE ENTRADA (ITEM 0):");
console.log(JSON.stringify(d[0], null, 2));

let totalClasses = 0;
d.forEach((item, idx) => {
  const classes = item.classes || item.episodes || item.lessons || item.items || [];
  totalClasses += classes.length;
});
console.log("TOTAL CLASES / EPISODIOS EN EL ARCHIVO JSON:", totalClasses);


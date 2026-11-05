const fs = require("fs");
const d = JSON.parse(fs.readFileSync("reports/velocity_integrity_validation.json", "utf8"));
if (d.valid_videos && d.valid_videos.length > 0) {
  console.log("Ruta de video 0:", d.valid_videos[0].media_path);
  console.log("Ruta de video 1:", d.valid_videos[1].media_path);
  console.log("Existe ruta 0?:", fs.existsSync(d.valid_videos[0].media_path));
  const mappedD = d.valid_videos[0].media_path.replace("D:\\", "D:\\");
  console.log("Verificando si la carpeta base existe:", fs.existsSync("D:\\00_VELOCITY_MEDIA_VAULT"));
  console.log("Verificando en H:\\00_VELOCITY_MEDIA_VAULT:", fs.existsSync("H:\\00_VELOCITY_MEDIA_VAULT"));
}


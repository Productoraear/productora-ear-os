const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../vault/proveedores_html_indexados/Fincas_Espacios/jardines-la-cartuja--e530.html');
const jsonPath = path.join(__dirname, '../src/data/providers/jardines_la_cartuja_override.json');

const html = fs.readFileSync(htmlPath, 'utf-8');

// Extraer todas las imágenes HD de 1920p o 1280p del HTML original
const regex = /https:\/\/cdn0\.bodas\.net\/[^\s"'>\?\\]+/gi;
const matches = html.match(regex) || [];

// Filtrar URLs de imágenes HD reales de la finca y opiniones (excluyendo favicons/logos)
const hdUrls = [...new Set(matches)].filter(url => {
  return (url.includes('/vendor/') || url.includes('/review/')) &&
         (url.includes('1920') || url.includes('1280') || url.includes('original')) &&
         !url.includes('logo') && !url.includes('favicon');
});

console.log(`Total imágenes HD extraídas sin dejar ninguna fuera: ${hdUrls.length}`);

// Formatear la lista completa de fotos para el carrusel y catálogo
const photos = hdUrls.map((url, index) => {
  let category = "Exteriores & Salones Históricos";
  if (url.includes('ccivil') || url.includes('ceremoni')) category = "Ceremonia Civil";
  if (url.includes('invernadero')) category = "Salón Invernadero";
  if (url.includes('review')) category = "Fotografía de Usuarios Verificados";

  return {
    id: `photo-hd-${index + 1}`,
    url: url,
    title: `Jardines La Cartuja · Fotografía HD #${index + 1}`,
    category: category
  };
});

// Actualizar jardines_la_cartuja_override.json
const rawJson = fs.readFileSync(jsonPath, 'utf-8');
const overrideData = JSON.parse(rawJson);

const carouselBlockIndex = overrideData.blocks.findIndex(b => b.type === 'carousel');
if (carouselBlockIndex !== -1) {
  overrideData.blocks[carouselBlockIndex].photos = photos;
}

fs.writeFileSync(jsonPath, JSON.stringify(overrideData, null, 2), 'utf-8');
console.log(`✅ ¡Base de datos de Jardines La Cartuja actualizada con las ${photos.length} fotos HD originales!`);
